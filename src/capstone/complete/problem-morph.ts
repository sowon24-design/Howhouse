import { animate } from 'motion'
import { useLayoutEffect, type RefObject } from 'react'

let searchSource: { rect: DOMRect; radius: string; background: string } | undefined
export function captureProblemMorph(element: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const style = getComputedStyle(element)
  searchSource = { rect: element.getBoundingClientRect(), radius: style.borderRadius, background: style.backgroundColor }
}
export function useProblemMorph(ref:RefObject<HTMLDivElement|null>, screen:string, frame:unknown) {
  useLayoutEffect(() => {
    if(screen!=='1042:10739')return
    const source = searchSource

    const target = ref.current?.querySelector<HTMLElement>('[data-node-id="1042:10777"]')
    if (!source || !target || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let dispose: (()=>void)|undefined
    const frame=requestAnimationFrame(()=>{
    searchSource = undefined
    const recommendations = ref.current?.querySelector<HTMLElement>('[data-node-id="1042:10779"]')
    if (recommendations) { recommendations.style.opacity = '0'; recommendations.inert = true }
    target.style.opacity = '0'
    const rect = target.getBoundingClientRect()
    const style = getComputedStyle(target)
    const shell = document.createElement('div')
    shell.setAttribute('aria-hidden', 'true')
    shell.dataset.problemMorph='true'
    Object.assign(shell.style, { position:'fixed', pointerEvents:'none', zIndex:'1000', left:`${rect.left}px`, top:`${rect.top}px`, width:`${rect.width}px`, height:`${rect.height}px`, transformOrigin:'0 0', background:source.background, borderRadius:source.radius })
    document.body.append(shell)
    const movement = animate(shell, { x:[source.rect.left-rect.left,0], y:[source.rect.top-rect.top,0], scaleX:[source.rect.width/rect.width,1], scaleY:[source.rect.height/rect.height,1], borderRadius:[source.radius,style.borderRadius] }, { type:'spring', stiffness:260, damping:22, mass:1.05, restDelta:.5, restSpeed:8 })
    // Color is a monotonic dissolve, independent of the positional spring.
    const color = animate(shell, { backgroundColor:[source.background,style.backgroundColor] }, { duration:.15, ease:'linear' })
    // Reveal the real field in the moving shell's coordinates, not at its final
    // resting position while the spring is still overshooting.
    const previousTransform=target.style.transform,previousOrigin=target.style.transformOrigin
    target.style.transformOrigin='0 0'
    let tracking=0,active=true
    const track=()=>{
      if(!active)return
      const moving=shell.getBoundingClientRect()
      target.style.transform=`translate(${moving.left-rect.left}px,${moving.top-rect.top}px) scale(${moving.width/rect.width},${moving.height/rect.height})`
      tracking=requestAnimationFrame(track)
    }
    track()
    const restoreTarget=()=>{active=false;cancelAnimationFrame(tracking);target.style.transform=previousTransform;target.style.transformOrigin=previousOrigin}
    const revealAt = Math.max(0, movement.duration - .3)
    const fade = animate(shell, { opacity:[1,0] }, { delay:revealAt, duration:.3, ease:'linear' })
    const controls = [movement, color, fade, animate(target, { opacity:[0,1] }, { delay:revealAt, duration:.2, ease:'linear' })]
    void movement.then(() => {restoreTarget();shell.remove()})
    let revealTimer: ReturnType<typeof setTimeout> | undefined
    if (recommendations) {
      controls.push(animate(recommendations, { opacity:[0,1], y:[10,0] }, { duration:.32, delay:revealAt+.08, ease:[.16,1,.3,1] }))
      revealTimer = setTimeout(() => { recommendations.inert = false }, (revealAt+.08)*1000)
    }
    dispose = () => {
      restoreTarget();clearTimeout(revealTimer)
      controls.forEach(control => control.stop())
      shell.remove()
      target.style.removeProperty('opacity')
      if (recommendations) {
        recommendations.inert = false
        recommendations.style.removeProperty('opacity')
        recommendations.style.removeProperty('transform')
      }
    }
    })
    return ()=>{cancelAnimationFrame(frame);dispose?.()}
  }, [screen,frame])
}
