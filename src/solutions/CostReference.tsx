import { useId, useLayoutEffect, useRef, useState } from 'react'
import down from './assets/b02-down.svg'

export function CostReference({text}:{text:string}) {
  const id=useId(),paragraph=useRef<HTMLParagraphElement>(null)
  const [expanded,setExpanded]=useState(false)
  const [wrapping,setWrapping]=useState(false)
  const [size,setSize]=useState({height:21,overflow:false})
  useLayoutEffect(()=>{
    const p=paragraph.current!
    const measure=()=>{
      const line=parseFloat(getComputedStyle(p).lineHeight)
      const probe=p.cloneNode(true) as HTMLElement
      probe.removeAttribute('id');probe.style.cssText='position:absolute;visibility:hidden;white-space:normal;width:'+p.parentElement!.clientWidth+'px'
      p.parentElement!.append(probe)
      const height=probe.getBoundingClientRect().height;probe.remove()
      setSize({height,overflow:height>line+1})
    }
    const observer=new ResizeObserver(measure);observer.observe(p.parentElement!);measure()
    return()=>observer.disconnect()
  },[text])
  return <div className="solutions-cost-reference" data-open={expanded&&size.overflow} data-wrapping={wrapping&&size.overflow}>
    <div className="solutions-cost-reference__clip" onTransitionEnd={event=>{if(event.target===event.currentTarget && event.propertyName==='height' && !expanded)setWrapping(false)}} style={{height:expanded&&size.overflow?size.height:21}}><p ref={paragraph} id={id}>{text}</p></div>
    {size.overflow&&<button className="solutions-cost-reference__toggle" type="button" aria-label="수리비용부담 설명" aria-expanded={expanded} aria-controls={id} onClick={()=>{if(!expanded)setWrapping(true);else if(matchMedia('(prefers-reduced-motion: reduce)').matches)setWrapping(false);setExpanded(!expanded)}}><img src={down} alt=""/></button>}
  </div>
}
