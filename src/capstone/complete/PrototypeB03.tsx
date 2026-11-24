import { StreamingMessage } from './StreamingMessage'
// Main B03 interactions preserved; only the explicitly requested Figma recipient tabs differ.
import {PrototypeRecipientTabs as TabBar} from './PrototypeRecipientTabs'
import { useEffect, useLayoutEffect, useId, useRef, useState } from 'react'
import { Button, GNB } from '../../components/ui'
import { initialDraft, copyMessageResult, editDraft, messageBody } from '../../solutions/message-model'
import type { MessageDraft, Recipient } from '../../solutions/message-model'
import { resolutionDraft } from '../../solutions/resolution-message'
import type { ResolutionStatus } from '../../solutions/resolution-message'
import info from './assets/message-info.svg'
import '../../solutions/b03.css'

async function writeClipboard(text:string) {
  if(navigator.clipboard && window.isSecureContext) {
    try {await navigator.clipboard.writeText(text);return} catch { /* Try the HTTP-preview fallback. */ }
  }
  const previous=document.activeElement as HTMLElement|null
  const field=document.createElement('textarea')
  field.value=text;field.style.cssText='position:fixed;opacity:0;pointer-events:none'
  document.body.append(field);field.select()
  try {if(!document.execCommand('copy'))throw new Error('Clipboard unavailable')}
  finally {field.remove();previous?.focus({preventScroll:true})}
}

export function B03({recipients,onBack,resolution,contextual=false,visible=true}:{recipients:readonly Recipient[];onBack:()=>void;resolution?:ResolutionStatus;contextual?:boolean;visible?:boolean}) {
  const base=useId()
  const initialTarget=recipients.find(r=>r.id==='landlord')?.id??recipients[0]?.id??''
  const [target,setTarget]=useState(initialTarget)
  useLayoutEffect(()=>{if(!visible)setTarget(initialTarget)},[visible,initialTarget])
  const [drafts,setDrafts]=useState<Record<string,MessageDraft>>(()=>Object.fromEntries(recipients.map(r=>[r.id,contextual?resolutionDraft(r,resolution):initialDraft(r)])))
  const editedRecipients=useRef(new Set<string>())
  const appliedResolution=useRef(resolution)
  useEffect(()=>{
    if(appliedResolution.current===resolution)return
    appliedResolution.current=resolution
    if(contextual)setDrafts(previous=>Object.fromEntries(recipients.map(r=>[r.id,editedRecipients.current.has(r.id)?previous[r.id]:resolutionDraft(r,resolution)])))
  },[resolution,contextual,recipients])
  const [toast,setToast]=useState('')
  const [toastSequence,setToastSequence]=useState(0)
  const [copying,setCopying]=useState(false)
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const mounted=useRef(true)
  const inFlight=useRef(false)
  useEffect(()=>{mounted.current=true;return ()=>{mounted.current=false}},[])
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[])
  function announce(text:string){if(timer.current)clearTimeout(timer.current);setToastSequence(n=>n+1);setToast(text);timer.current=setTimeout(()=>setToast(''),1500)}
  async function copy(){
    if(inFlight.current)return
    inFlight.current=true;setCopying(true)
    try {
      const result=await copyMessageResult(messageBody(drafts[target]),writeClipboard)
      if(!mounted.current)return
      announce(result.message)
    } finally {inFlight.current=false;if(mounted.current)setCopying(false)}
  }
  if(!recipients.length)return null
  return <section className="solutions-b03 capstone-message" aria-label="문의 메시지">
    <GNB title="문의 메시지 작성하기" onBack={onBack}/>
    <main className="solutions-b03__content" onClick={event=>{if(!(event.target instanceof HTMLTextAreaElement) && document.activeElement instanceof HTMLTextAreaElement) document.activeElement.blur()}}>
      <div className="solutions-b03__top">
        {recipients.length>1&&<TabBar label="문의 대상" options={recipients.map(r=>({value:r.id,label:r.label,panelId:`${base}-${r.id}`}))} value={target} onChange={value=>{setTarget(value);setToast('')}}/>}
        {recipients.map(r=><section key={r.id} id={`${base}-${r.id}`} role="tabpanel" aria-label={r.label} hidden={target!==r.id}>
          <h2 className="text-body-sb"><span>{r.title}</span>에게 보낼 메시지</h2>
          <StreamingMessage label={`${r.label} 메시지 본문`} active={target===r.id} visible={visible} value={messageBody(drafts[r.id])} onChange={value=>{editedRecipients.current.add(r.id);setDrafts(previous=>({...previous,[r.id]:editDraft(previous[r.id],value)}))}}/>
          <p className="cg-message-help"><span className="cg-message-info"><img src={info} alt=""/></span>메시지를 직접 수정할 수 있어요.</p>
        </section>)}
      </div>
      <div className="solutions-b03__actions"><div className="solutions-b03__toast" role="status">{toast&&<span key={toastSequence}>{toast}</span>}</div><Button onClick={()=>{const body=messageBody(drafts[target]);if(!body.trim()){announce('메시지를 입력해 주세요.');return}if(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){window.location.href=`sms:${/iPhone|iPad|iPod/i.test(navigator.userAgent)?'&':'?'}body=${encodeURIComponent(body)}`}else announce('휴대폰에서 메시지 앱을 열 수 있어요. 복사하기를 이용해 주세요.')}}>메시지 보내기</Button><Button variant="pale" disabled={copying} onClick={copy}>복사하기</Button></div>
    </main>

  </section>
}
