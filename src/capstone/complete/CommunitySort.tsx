import {AnimatePresence,motion,useReducedMotion} from 'motion/react'
import {Children,cloneElement,isValidElement,useEffect,useRef,useState} from 'react'
import type {ReactNode} from 'react'
export function CommunitySort({className,children,value,onChange}:{className?:string;children:ReactNode;value:'popular'|'recent';onChange:(value:'popular'|'recent')=>void}){
 const reduced=useReducedMotion()
 const [open,setOpen]=useState(false),root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null)
 useEffect(()=>{
  if(!open)return
  const scene=root.current?.closest('.cg-scene') as HTMLElement|null
  const previous=scene?.style.overflowY
  if(scene)scene.style.overflowY='hidden'
  const block=(event:Event)=>event.preventDefault()
  const swallow=(event:MouseEvent)=>{event.preventDefault();event.stopImmediatePropagation()}
  let clickTimer:ReturnType<typeof setTimeout>|undefined
  const close=(event:PointerEvent)=>{
   if(root.current?.contains(event.target as Node))return
   event.preventDefault();event.stopImmediatePropagation()
   document.addEventListener('click',swallow,{capture:true,once:true})
   clickTimer=setTimeout(()=>document.removeEventListener('click',swallow,true),500)
   setOpen(false)
  }
  document.addEventListener('pointerdown',close,true)
  document.addEventListener('wheel',block,{capture:true,passive:false})
  document.addEventListener('touchmove',block,{capture:true,passive:false})
  return()=>{if(scene)scene.style.overflowY=previous??'';document.removeEventListener('pointerdown',close,true);document.removeEventListener('wheel',block,true);document.removeEventListener('touchmove',block,true);if(!clickTimer)document.removeEventListener('click',swallow,true)}
 },[open])
 return <div ref={root} className={(className??'')+' cg-sort'} onPointerDownCapture={()=>{if(root.current)root.current.dataset.pointerFocus='true'}} onKeyDown={event=>{if(root.current)delete root.current.dataset.pointerFocus;if(event.key==='Escape'){setOpen(false);trigger.current?.focus()}if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(!open){setOpen(true);requestAnimationFrame(()=>root.current?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')?.focus())}else{const items=Array.from(root.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')??[]);const index=items.indexOf(document.activeElement as HTMLButtonElement);items[(index+(event.key==='ArrowDown'?1:items.length-1))%items.length]?.focus()}}}}>
  <button ref={trigger} type="button" className="cg-sort-trigger" aria-label="게시글 정렬" aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(previous=>!previous)}>
  {Children.map(children,child=>isValidElement<{children?:ReactNode}>(child)&&child.type==='p'?cloneElement(child,{},value==='popular'?'인기 순':'최신 순'):<motion.span style={{display:'flex'}} animate={{rotate:open?180:0}} transition={{duration:reduced?0:.2,ease:'easeInOut'}}>{child}</motion.span>)}
  </button>
  <AnimatePresence>{open&&<motion.div initial={reduced?false:{opacity:0,scale:.94,y:-8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.97,y:-4}} transition={reduced?{duration:0}:{type:'spring',stiffness:420,damping:30,opacity:{duration:.15}}} style={{transformOrigin:'top right'}} className="cg-sort-menu" role="menu" aria-label="게시글 정렬 방식">{(['popular','recent'] as const).map(option=><button key={option} type="button" role="menuitemradio" aria-checked={value===option} onClick={()=>{onChange(option);setOpen(false);trigger.current?.focus()}}>{option==='popular'?'인기 순':'최신 순'}</button>)}</motion.div>}</AnimatePresence>
 </div>
}
