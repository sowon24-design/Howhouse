import {useId,useRef} from 'react'
import './recipient-tabs.css'
type TabOption={value:string;label:string;panelId:string}
/** Figma 1175:30447–30453; only the requested recipient controls differ. */
export function PrototypeRecipientTabs({options,value,onChange,label}:{options:readonly TabOption[];value:string;onChange:(value:string)=>void;label:string}){
 const id=useId(),refs=useRef<(HTMLButtonElement|null)[]>([])
 return <div className="capstone-recipient"><div className="capstone-recipient__label">누구에게 보낼까요?</div>
  <div className="capstone-recipient__tabs" role="tablist" aria-label={label}>
   {options.map((option,index)=><button ref={node=>{refs.current[index]=node}} key={option.value} type="button" role="tab" id={`${id}-${option.value}`} aria-controls={option.panelId} aria-selected={value===option.value} tabIndex={value===option.value?0:-1} onClick={()=>onChange(option.value)} onKeyDown={event=>{
    let next:number
    if(event.key==='ArrowRight')next=(index+1)%options.length
    else if(event.key==='ArrowLeft')next=(index-1+options.length)%options.length
    else if(event.key==='Home')next=0
    else if(event.key==='End')next=options.length-1
    else return
    event.preventDefault();onChange(options[next].value);refs.current[next]?.focus()
   }}>{option.value==='company'?'수리기사':option.label}</button>)}
  </div>
 </div>
}
