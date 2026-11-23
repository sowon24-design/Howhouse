import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'

/** Visual reveal only: the editable/copyable draft is always complete. */
export function StreamingMessage({value,label,active,visible,onChange}:{value:string;label:string;active:boolean;visible:boolean;onChange:(value:string)=>void}) {
  const reduce = useReducedMotion()
  const shown = useRef(false)
  const field = useRef<HTMLTextAreaElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const [playing,setPlaying] = useState(false)
  const words = value.split(/(\s+)/)
  const count = words.filter(word=>word.trim()).length
  const stagger = Math.min(45, 1500 / Math.max(1,count))
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
    queueMicrotask(()=>{if(!cancelled)shown.current=true})
    setPlaying(true)
    const timer=setTimeout(()=>setPlaying(false),Math.max(0,count-1)*stagger+300)
    return ()=>{cancelled=true;clearTimeout(timer)}
  },[active,visible,reduce])
  let index=0
  return <div className="solutions-message-stream" data-playing={playing||undefined}>
    <textarea ref={field} aria-label={label} value={value} onFocus={()=>setPlaying(false)} onPointerDown={()=>setPlaying(false)} onChange={event=>{setPlaying(false);onChange(event.target.value)}}/>
    <div ref={overlay} className="solutions-message-stream__words" aria-hidden="true">
      {words.map((word,i)=>word.trim()?<span key={i} style={{'--word-delay':`${index++*stagger}ms`} as CSSProperties}>{word}</span>:word)}
    </div>
  </div>
}
