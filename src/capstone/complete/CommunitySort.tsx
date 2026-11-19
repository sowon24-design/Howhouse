import {Children,cloneElement,isValidElement,useEffect,useRef,useState} from 'react'
import type {ReactNode} from 'react'
export function CommunitySort({className,children,value,onChange}:{className?:string;children:ReactNode;value:'popular'|'recommended';onChange:(value:'popular'|'recommended')=>void}){
 const [open,setOpen]=useState(false),root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null)
 useEffect(()=>{const close=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close)},[])
 return <div ref={root} className={(className??'')+' cg-sort'} onKeyDown={event=>{if(event.key==='Escape'){setOpen(false);trigger.current?.focus()}if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(!open){setOpen(true);requestAnimationFrame(()=>root.current?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')?.focus())}else{const items=Array.from(root.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')??[]);const index=items.indexOf(document.activeElement as HTMLButtonElement);items[(index+(event.key==='ArrowDown'?1:items.length-1))%items.length]?.focus()}}}}>
  <button ref={trigger} type="button" className="cg-sort-trigger" aria-label="게시글 정렬" aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(previous=>!previous)}>
  {Children.map(children,child=>isValidElement<{children?:ReactNode}>(child)&&child.type==='p'?cloneElement(child,{},value==='popular'?'인기 순':'추천 순'):child)}
  </button>
  {open&&<div className="cg-sort-menu" role="menu" aria-label="게시글 정렬 방식">{(['popular','recommended'] as const).map(option=><button key={option} type="button" role="menuitemradio" aria-checked={value===option} onClick={()=>{onChange(option);setOpen(false);trigger.current?.focus()}}>{option==='popular'?'인기 순':'추천 순'}</button>)}</div>}
 </div>
}
