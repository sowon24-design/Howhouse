import { useEffect, useRef, useState } from 'react'
export function DurationWheel({value,max,unit,onChange}:{value:number;max:number;unit:string;onChange:(value:number)=>void}){
 const [position,setPosition]=useState(value)
 const ref=useRef<HTMLDivElement>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null)
 useEffect(()=>{
 const node=ref.current;if(!node)return
 node.scrollTop=value*40
 let target=value*40
 const wheel=(event:WheelEvent)=>{event.preventDefault();target=Math.max(0,Math.min(max*40,target+event.deltaY*(event.deltaMode===1?20:1)*1.25));node.scrollTo({top:target,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
 const touch=()=>{target=node.scrollTop}
 node.addEventListener('wheel',wheel,{passive:false});node.addEventListener('touchend',touch)
 return()=>{node.removeEventListener('wheel',wheel);node.removeEventListener('touchend',touch);if(timer.current)clearTimeout(timer.current)}
 },[])
 return <div ref={ref} className="cg-duration-wheel" role="listbox" aria-label={unit==='년'?'자취 기간 연':'자취 기간 개월'} onScroll={event=>{const top=event.currentTarget.scrollTop;setPosition(top/40);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>onChange(Math.max(0,Math.min(max,Math.round(top/40)))),80)}}>{Array.from({length:max+1},(_,n)=><button type="button" role="option" aria-selected={n===value} data-in-selection={n===Math.round(position)} key={n} onClick={()=>{onChange(n);ref.current?.scrollTo({top:n*40,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}} style={{opacity:n===Math.round(position)?1:Math.abs(n-Math.round(position))===1?.44:.16}}>{n}{unit}</button>)}</div>
}
