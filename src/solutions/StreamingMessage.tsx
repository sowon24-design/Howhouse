import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'

/** Visual reveal only: the editable/copyable draft is always complete. */
export function StreamingMessage({value,label,active,sequence,onChange}:{value:string;label:string;active:boolean;sequence:number;onChange:(value:string)=>void}) {
  const reduce = useReducedMotion()
  const field = useRef<HTMLTextAreaElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const [playing,setPlaying] = useState(false)
  const words = value.split(/(\s+)/)
  const count = words.filter(word=>word.trim()).length
  const stagger = Math.min(45, 1500 / Math.max(1,count))
  useLayoutEffect(()=>{
    if (!active || !sequence || reduce) {setPlaying(false);return}
    const textarea=field.current
    if (textarea && overlay.current) {
      textarea.scrollTop=0
      const style=getComputedStyle(textarea)
      for (const name of ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','wordBreak','overflowWrap','paddingTop','paddingRight','paddingBottom','paddingLeft'] as const) overlay.current.style[name]=style[name]
    }
    setPlaying(true)
    const timer=setTimeout(()=>setPlaying(false),Math.max(0,count-1)*stagger+300)
    return ()=>clearTimeout(timer)
  },[active,sequence,reduce])
  let index=0
  return <div className="solutions-message-stream" data-playing={playing||undefined}>
    <textarea ref={field} aria-label={label} value={value} onFocus={()=>setPlaying(false)} onPointerDown={()=>setPlaying(false)} onChange={event=>{setPlaying(false);onChange(event.target.value)}}/>
    <div ref={overlay} className="solutions-message-stream__words" aria-hidden="true" key={sequence}>
      {words.map((word,i)=>word.trim()?<span key={i} style={{'--word-delay':`${index++*stagger}ms`} as CSSProperties}>{word}</span>:word)}
    </div>
  </div>
}
