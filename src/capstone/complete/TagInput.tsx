import {useRef,useState} from 'react'
import {motion,useReducedMotion} from 'motion/react'
import remove from './assets/tag-remove.svg'

export function TagInput({value,onChange}:{value:readonly string[];onChange:(tags:string[])=>void}){
 const [input,setInput]=useState('')
 const reduceMotion=useReducedMotion()
 const layoutTransition={duration:reduceMotion?0:.32,ease:[.4,0,.2,1] as const}
 const composing=useRef(false)
 function commit(text:string){
  const next=[...value]
  for(const part of text.trim().split(/\s+/)){const tag=part.replace(/^#+/,'');if(tag&&!next.includes(tag)&&next.length<5)next.push(tag)}
  onChange(next);setInput('')
 }
 function update(text:string){
  if(!composing.current&&/\s/.test(text)){
   const parts=text.split(/\s+/),last=parts.pop()??''
   const next=[...value]
   for(const part of parts){const tag=part.replace(/^#+/,'');if(tag&&!next.includes(tag)&&next.length<5)next.push(tag)}
   onChange(next);setInput(next.length<5?last:'')
  }else setInput(text)
 }
 return <div className="cg-tag-editor">
  <label className="text-body-sb">태그 ({value.length}/5)
   <input aria-label="태그 입력" value={input} maxLength={100} readOnly={value.length>=5} placeholder={value.length>=5?'태그는 최대 5개까지 입력할 수 있어요.':'태그를 입력해 주세요. (예: 누수, 곰팡이)'}
    onCompositionStart={()=>{composing.current=true}} onCompositionEnd={event=>{composing.current=false;update(event.currentTarget.value)}}
    onChange={event=>update(event.target.value)} onKeyDown={event=>{if(event.nativeEvent.isComposing||composing.current||event.keyCode===229)return;if(event.key==='Enter'||event.key===' '){event.preventDefault();commit(input)}}}/>
  </label>
  {value.length>0&&<div className="cg-tag-editor__chips">{value.map(tag=><motion.span layout="position" transition={{layout:layoutTransition}} key={tag} className="cg-tag-editor__chip">{tag}<button type="button" aria-label={`${tag} 태그 삭제`} onClick={()=>onChange(value.filter(item=>item!==tag))}><img src={remove} alt=""/></button></motion.span>)}</div>}
 </div>
}
