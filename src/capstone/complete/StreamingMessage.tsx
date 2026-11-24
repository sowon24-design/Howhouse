import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'

/** Visual reveal only: the editable/copyable draft is always complete. */
export function StreamingMessage({value,label,active,visible,onChange,sentences=false,review=false,fieldClassName,onShown}:{value:string;label:string;active:boolean;visible:boolean;sentences?:boolean;review?:boolean;fieldClassName?:string;onShown?:()=>void;onChange:(value:string)=>void}) {
  const reduce = useReducedMotion()
  const shown = useRef(false)
  const field = useRef<HTMLTextAreaElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const [playing,setPlaying] = useState(false)
  const words = sentences?(value.match(/[^.!?。！？\n]+(?:[.!?。！？]+|$)|\n+|[.!?。！？]+/g)??[]):value.split(/(\s+)/)
  const count = words.filter(word=>word.trim()).length
  const stagger = Math.min(review?30:sentences?160:45, (review?1000:1500) / Math.max(1,count))
  useLayoutEffect(()=>{
    if (!visible) {shown.current=false;setPlaying(false);return}
    if (!active || shown.current || reduce) {setPlaying(false);return}
    const textarea=field.current
    if (textarea && overlay.current) {
      textarea.scrollTop=0
      const style=getComputedStyle(textarea)
      for (const name of ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','wordBreak','overflowWrap','paddingTop','paddingRight','paddingBottom','paddingLeft'] as const) overlay.current.style[name]=style[name]
    }
    let cancelled=false
    // Mark after setup so StrictMode effect replay does not consume the first reveal.
    queueMicrotask(()=>{if(!cancelled){shown.current=true;onShown?.()}})
    setPlaying(true)
    const timer=setTimeout(()=>setPlaying(false),Math.max(0,count-1)*stagger+300)
    return ()=>{cancelled=true;clearTimeout(timer)}
  },[active,visible,reduce])
  let index=0
  return <div className="solutions-message-stream" data-playing={playing||undefined}>
    <textarea className={fieldClassName} rows={sentences||review?Math.max(2,value.split('\n').length):undefined} maxLength={sentences||review?1000:undefined} ref={field} aria-label={label} value={value} onFocus={()=>setPlaying(false)} onPointerDown={()=>setPlaying(false)} onChange={event=>{setPlaying(false);onChange(event.target.value)}}/>
    <div ref={overlay} className="solutions-message-stream__words" aria-hidden="true">
      {words.map((word,i)=>word.trim()?<span key={i} style={{'--word-delay':`${index++*stagger}ms`} as CSSProperties}>{word}</span>:word)}
    </div>
  </div>
}
