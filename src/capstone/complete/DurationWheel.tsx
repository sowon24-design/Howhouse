import { useEffect, useRef } from 'react'
export function DurationWheel({value,max,unit,onChange}:{value:number;max:number;unit:string;onChange:(value:number)=>void}){
 const ref=useRef<HTMLDivElement>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null)
 useEffect(()=>{if(ref.current)ref.current.scrollTop=value*40;return()=>{if(timer.current)clearTimeout(timer.current)}},[])
 return <div ref={ref} className="cg-duration-wheel" role="listbox" aria-label={unit==='년'?'자취 기간 연':'자취 기간 개월'} onScroll={event=>{const top=event.currentTarget.scrollTop;if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>onChange(Math.max(0,Math.min(max,Math.round(top/40)))),80)}}>{Array.from({length:max+1},(_,n)=><button type="button" role="option" aria-selected={n===value} key={n} onClick={()=>{onChange(n);ref.current?.scrollTo({top:n*40,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}} style={{opacity:Math.abs(n-value)===0?1:Math.abs(n-value)===1?.44:.16}}>{n} {unit}</button>)}</div>
}
