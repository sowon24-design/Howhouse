import { animate } from 'motion'
import { useLayoutEffect, useRef } from 'react'

let returningToList = false
window.addEventListener('hashchange', event => { returningToList = new URL(event.oldURL).hash.startsWith('#case/') })

let searchSource: { rect: DOMRect; radius: string; background: string } | undefined
export function captureSearchMorph(element: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const style = getComputedStyle(element)
  searchSource = { rect: element.getBoundingClientRect(), radius: style.borderRadius, background: style.backgroundColor }
}
export function useSearchMorph() {
  const ref = useRef<HTMLDivElement>(null)
  const origin = useRef(searchSource)
  useLayoutEffect(() => {
    const source = origin.current
    searchSource = undefined
    const target = ref.current
    if (!source || !target || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const recommendations = target.parentElement?.querySelector<HTMLElement>('[aria-label="추천 검색어"]')
    if (recommendations) { recommendations.style.opacity = '0'; recommendations.inert = true }
    target.style.opacity = '0'
    const rect = target.getBoundingClientRect()
    const style = getComputedStyle(target)
    const shell = document.createElement('div')
    shell.setAttribute('aria-hidden', 'true')
    Object.assign(shell.style, { position:'fixed', pointerEvents:'none', zIndex:'1000', left:`${rect.left}px`, top:`${rect.top}px`, width:`${rect.width}px`, height:`${rect.height}px`, transformOrigin:'0 0', background:source.background, borderRadius:source.radius })
    document.body.append(shell)
    const movement = animate(shell, { x:[source.rect.left-rect.left,0], y:[source.rect.top-rect.top,0], scaleX:[source.rect.width/rect.width,1], scaleY:[source.rect.height/rect.height,1], borderRadius:[source.radius,style.borderRadius] }, { type:'spring', stiffness:260, damping:22, mass:1.05, restDelta:.5, restSpeed:8 })
    // Color is a monotonic dissolve, independent of the positional spring.
    const color = animate(shell, { backgroundColor:[source.background,style.backgroundColor] }, { duration:.15, ease:'linear' })
    const revealAt = Math.max(0, movement.duration - .3)
    const fade = animate(shell, { opacity:[1,0] }, { delay:revealAt, duration:.3, ease:'linear' })
    const controls = [movement, color, fade, animate(target, { opacity:[0,1] }, { delay:revealAt, duration:.2, ease:'linear' })]
    void fade.then(() => shell.remove())
    let revealTimer: ReturnType<typeof setTimeout> | undefined
    if (recommendations) {
      controls.push(animate(recommendations, { opacity:[0,1], y:[10,0] }, { duration:.32, delay:revealAt+.08, ease:[.16,1,.3,1] }))
      revealTimer = setTimeout(() => { recommendations.inert = false }, (revealAt+.08)*1000)
    }
    return () => {
      clearTimeout(revealTimer)
      controls.forEach(control => control.stop())
      shell.remove()
      target.style.removeProperty('opacity')
      if (recommendations) {
        recommendations.inert = false
        recommendations.style.removeProperty('opacity')
        recommendations.style.removeProperty('transform')
      }
    }
  }, [])
  return ref
}

/** Animate visible rows only; cap stagger so long lists never delay interaction. */
export function useListEntrance(key: string) {
  const ref = useRef<HTMLUListElement>(null)
  useLayoutEffect(() => {
    if (returningToList || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rows = Array.from(ref.current?.children ?? []) as HTMLElement[]
    const controls = rows.filter(row => { const r=row.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 }).map((row,index) => animate(row, { opacity:[0,1], y:[12,0] }, { duration:.28, delay:Math.min(index,5)*.045, ease:[.23,1,.32,1] }))
    return () => { controls.forEach(control => control.stop()); rows.forEach(row => {row.style.removeProperty('opacity');row.style.removeProperty('transform')}) }
  }, [key])
  return ref
}

const profileMotionSpeed = 1.2
// Keep the outgoing screen visible beneath the new screen's dissolve.
function snapshotScreen(root: HTMLElement, omit: string) {
  const rect=root.getBoundingClientRect()
  const clone=root.cloneNode(true) as HTMLElement
  const originals=[root,...Array.from(root.querySelectorAll<HTMLElement>('*'))]
  const copies=[clone,...Array.from(clone.querySelectorAll<HTMLElement>('*'))]
  originals.forEach((element,index)=>{
    const style=getComputedStyle(element)
    for(const property of Array.from(style)) copies[index].style.setProperty(property,style.getPropertyValue(property))
    copies[index].removeAttribute('id')
    copies[index].style.animation='none'
  })
  const omitted=clone.querySelector<HTMLElement>(omit)
  if(omitted) [omitted,...Array.from(omitted.querySelectorAll<HTMLElement>('*'))].forEach(element=>element.style.visibility='hidden')
  const frame=document.createElement('div')
  frame.setAttribute('aria-hidden','true');frame.inert=true
  Object.assign(frame.style,{position:'fixed',left:`${rect.left}px`,top:`${Math.max(0,rect.top)}px`,width:`${rect.width}px`,height:`${Math.min(innerHeight,rect.bottom)-Math.max(0,rect.top)}px`,overflow:'hidden',pointerEvents:'none',zIndex:'999'})
  Object.assign(clone.style,{position:'absolute',left:'0px',top:`${Math.min(0,rect.top)}px`,margin:'0',width:`${rect.width}px`,height:`${rect.height}px`})
  frame.append(clone)
  return frame
}
function dissolveSnapshot(snapshot: HTMLElement | undefined,delay:number,duration:number,exitText=false) {
  if(!snapshot)return ()=>{}
  const layer=snapshot.cloneNode(true) as HTMLElement
  layer.inert=true;document.body.append(layer)
  const textFades=exitText ? Array.from(layer.querySelectorAll<HTMLElement>('.ui-gnb, .hh-my-data, .hh-my-content > p')).map(e=>animate(e,{opacity:[1,0]},{duration:.12/profileMotionSpeed,ease:'linear'})) : []
  const fade=animate(layer,{opacity:[1,0]},{delay:delay/profileMotionSpeed,duration:duration/profileMotionSpeed,ease:'linear'})
  void fade.then(()=>layer.remove())
  return ()=>{fade.stop();textFades.forEach(c=>c.stop());layer.remove()}
}

let profileSource: { rect: DOMRect; background: string; icon: string; backdrop?: HTMLElement } | undefined
export function captureProfileMorph(element: HTMLElement) {
  profileSource = undefined
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  profileSource = { rect:element.getBoundingClientRect(), background:getComputedStyle(element).background, icon:element.querySelector('img')?.src ?? '', backdrop:element.closest('main') ? snapshotScreen(element.closest('main')!,'.hh-home-profile') : undefined }
}
export function useProfileMorph() {
  const ref = useRef<HTMLElement>(null)
  const origin = useRef(profileSource)
  useLayoutEffect(() => {
    const source=origin.current
    profileSource=undefined
    const target=ref.current
    if (!source || !target || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const clearBackdrop=dissolveSnapshot(source.backdrop,.18,.22)
    const rect=target.getBoundingClientRect()
    const style=getComputedStyle(target)
    const shell=document.createElement('div')
    shell.setAttribute('aria-hidden','true');shell.inert=true
    Object.assign(shell.style,{position:'fixed',zIndex:'1000',pointerEvents:'none',overflow:'hidden',background:style.background})
    const clone=target.cloneNode(true) as HTMLElement
    const originals=[target,...Array.from(target.querySelectorAll<HTMLElement>('*'))]
    const copies=[clone,...Array.from(clone.querySelectorAll<HTMLElement>('*'))]
    originals.forEach((element,index)=>{
      const computed=getComputedStyle(element)
      for(const property of Array.from(computed)) copies[index].style.setProperty(property,computed.getPropertyValue(property))
      copies[index].removeAttribute('id')
    })
    // One continuous gradient belongs to the moving mask, never the fixed content.
    Object.assign(clone.style,{position:'absolute',margin:'0',background:'transparent',width:`${rect.width}px`,height:`${rect.height}px`,opacity:'1'})
    shell.append(clone);document.body.append(shell)
    target.style.opacity='0'
    let active=true
    const position=(progress:number)=>{
      const left=source.rect.left+(rect.left-source.rect.left)*progress
      const top=source.rect.top+(rect.top-source.rect.top)*progress
      Object.assign(shell.style,{left:`${left}px`,top:`${top}px`,width:`${source.rect.width+(rect.width-source.rect.width)*progress}px`,height:`${source.rect.height+(rect.height-source.rect.height)*progress}px`,borderRadius:`${source.rect.width/2+(parseFloat(style.borderRadius)-source.rect.width/2)*progress}px`})
      clone.style.left=`${rect.left-left}px`;clone.style.top=`${rect.top-top}px`
    }
    position(0)
    const movement=animate(0,1,{type:'spring',stiffness:260,damping:24,mass:1.05,onUpdate:position})
    movement.speed=profileMotionSpeed
    void movement.then(()=>{if(active){target.style.removeProperty('opacity');shell.remove()}})
    const surrounding = Array.from(target.closest('main')?.querySelectorAll<HTMLElement>('.ui-gnb, .hh-my-data, .hh-my-content > p') ?? [])
    const fades = surrounding.map(element => animate(element,{opacity:[0,1]},{delay:.18/profileMotionSpeed,duration:.22/profileMotionSpeed}))
    return ()=>{active=false;clearBackdrop();movement.stop();shell.remove();target.style.removeProperty('opacity');fades.forEach(f=>f.stop());surrounding.forEach(e=>e.style.removeProperty('opacity'))}

  },[])
  return ref
}

let closingProfile: { rect: DOMRect; clone: HTMLElement; backdrop?: HTMLElement } | undefined
// Capture before React replaces the route, including browser/Android Back.
export function clearProfileReturn() { closingProfile=undefined }
export function captureProfileReturn() {
  closingProfile=undefined
  const card=document.querySelector<HTMLElement>('#root .hh-my-profile')
  if (!card || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const clone=card.cloneNode(true) as HTMLElement
  const originals=[card,...Array.from(card.querySelectorAll<HTMLElement>('*'))]
  const copies=[clone,...Array.from(clone.querySelectorAll<HTMLElement>('*'))]
  originals.forEach((element,index)=>{
    const style=getComputedStyle(element)
    for (const property of Array.from(style)) copies[index].style.setProperty(property,style.getPropertyValue(property))
    copies[index].removeAttribute('id')
  })
  clone.style.clipPath='none'
  clone.style.opacity='1'
  closingProfile={rect:card.getBoundingClientRect(),clone,backdrop:card.closest('main') ? snapshotScreen(card.closest('main')!,'.hh-my-profile') : undefined}
}
export function useProfileReturn() {
  const ref=useRef<HTMLElement>(null)
  const origin=useRef(closingProfile)
  useLayoutEffect(()=>{
    const source=origin.current
    closingProfile=undefined
    const root=ref.current
    const icon=root?.querySelector<HTMLElement>('.hh-home-profile')
    if (!source || !root || !icon || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const clearBackdrop=dissolveSnapshot(source.backdrop,0,.32,true)
    const destination=icon.getBoundingClientRect()
    const shell=document.createElement('div')
    shell.setAttribute('aria-hidden','true');shell.inert=true
    Object.assign(shell.style,{position:'fixed',pointerEvents:'none',zIndex:'1000',overflow:'hidden',left:`${source.rect.left}px`,top:`${source.rect.top}px`,width:`${source.rect.width}px`,height:`${source.rect.height}px`,borderRadius:'24px',background:source.clone.style.background || 'linear-gradient(#d6e4ff,#ebf2ff)'})
    const clone=source.clone.cloneNode(true) as HTMLElement
    Object.assign(clone.style,{position:'absolute',left:'0px',top:'0px',margin:'0',width:`${source.rect.width}px`,height:`${source.rect.height}px`,background:'transparent'})
    shell.append(clone);document.body.append(shell)
    const elements=Array.from(root.querySelectorAll<HTMLElement>('.hh-home-content, .hh-home-header > img'))
    const fades=elements.map(element=>animate(element,{opacity:[0,1]},{delay:.1/profileMotionSpeed,duration:.22/profileMotionSpeed}))
    const identity=clone.querySelector<HTMLElement>('.hh-my-identity')
    if(identity) fades.push(animate(identity,{opacity:[1,0]},{duration:.09/profileMotionSpeed,ease:'linear'}))
    icon.style.opacity='0'
    let swapped=false
    const revealIcon=()=>{
      if(swapped)return
      swapped=true
      icon.style.removeProperty('opacity')
      shell.style.visibility='hidden'
    }
    // Only the clipping frame travels; counter-position its contents in viewport space.
    const movement=animate(0,1,{duration:.32/profileMotionSpeed,ease:'linear',onUpdate:progress=>{
      const left=source.rect.left+(destination.left-source.rect.left)*progress
      const top=source.rect.top+(destination.top-source.rect.top)*progress
      Object.assign(shell.style,{
        left:`${left}px`,top:`${top}px`,
        width:`${source.rect.width+(destination.width-source.rect.width)*progress}px`,
        height:`${source.rect.height+(destination.height-source.rect.height)*progress}px`,
        borderRadius:`${24+(destination.width/2-24)*progress}px`,
      })
      clone.style.left=`${source.rect.left-left}px`
      clone.style.top=`${source.rect.top-top}px`
      if(progress>=1) revealIcon()
    }})
    void movement.then(()=>{revealIcon();shell.remove()})
    return ()=>{clearBackdrop();movement.stop();fades.forEach(c=>c.stop());shell.remove();[icon,...elements].forEach(e=>e.style.removeProperty('opacity'))}

  },[])
  return ref
}
