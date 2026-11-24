import {useLayoutEffect,useRef,useState,type ReactNode} from 'react'
import {AnimatePresence,motion,useReducedMotion} from 'motion/react'
export function PostMenu({open,className,children,name,onClose}:{open:boolean;className?:string;children:ReactNode;name:string;onClose:()=>void}){
 const marker=useRef<HTMLSpanElement>(null),reduced=useReducedMotion()
 useLayoutEffect(()=>{
  if(!open)return
  const scene=marker.current?.closest('.cg-scene') as HTMLElement|null
  const previous=scene?.style.overflowY
  if(scene)scene.style.overflowY='hidden'
  const block=(event:Event)=>event.preventDefault()
  document.addEventListener('wheel',block,{capture:true,passive:false})
  document.addEventListener('touchmove',block,{capture:true,passive:false})
  return()=>{if(scene)scene.style.overflowY=previous??'';document.removeEventListener('wheel',block,true);document.removeEventListener('touchmove',block,true)}
 },[open])
 const [position,setPosition]=useState<{top:number;right:number}|null>(null)
 useLayoutEffect(()=>{
  if(!open)return
  const anchor=marker.current?.closest('.cg-scene')?.querySelector('[data-post-menu-trigger]')
  if(!anchor)return
  const update=()=>{const r=anchor.getBoundingClientRect();setPosition({top:r.bottom+24,right:Math.max(0,innerWidth-r.right)})}
  update();window.addEventListener('resize',update);window.addEventListener('scroll',update,true)
  return()=>{window.removeEventListener('resize',update);window.removeEventListener('scroll',update,true)}
 },[open])
 return <><span hidden ref={marker}/>{open&&<div style={{position:'fixed',inset:0,zIndex:39}} onPointerDown={event=>{event.preventDefault();event.stopPropagation();onClose()}}/>}<AnimatePresence>{open&&position&&<motion.div data-name={name} className={className} style={{position:'fixed',...position,left:'auto',bottom:'auto',transformOrigin:'top right',zIndex:40}}
 initial={reduced?false:{opacity:0,scale:.94,y:-8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.97,y:-4}}
 transition={reduced?{duration:0}:{type:'spring',stiffness:420,damping:30,opacity:{duration:.15}}}>{children}</motion.div>}</AnimatePresence></>
}
