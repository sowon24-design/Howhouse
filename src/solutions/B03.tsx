import { useEffect, useId, useRef, useState } from 'react'
import { Button, GNB, ListRow, MessageButton, TabBar } from '../components/ui'
import { applySentences, initialDraft, copyMessageResult, editDraft, messageBody, selectedIndexes } from './message-model'
import type { MessageDraft, Recipient } from './message-model'
import { resolutionDraft } from './resolution-message'
import type { ResolutionStatus } from './resolution-message'
import write from './assets/b03-write.svg'
import { SolutionSheet } from './SolutionSheet'
import './b03.css'

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

export function B03({recipients,onBack,resolution,contextual=false}:{recipients:readonly Recipient[];onBack:()=>void;resolution?:ResolutionStatus;contextual?:boolean}) {
  const base=useId()
  const [target,setTarget]=useState(recipients[0]?.id??'')
  const [drafts,setDrafts]=useState<Record<string,MessageDraft>>(()=>Object.fromEntries(recipients.map(r=>[r.id,contextual?resolutionDraft(r,resolution):initialDraft(r)])))
  const editedRecipients=useRef(new Set<string>())
  const appliedResolution=useRef(resolution)
  useEffect(()=>{
    if(appliedResolution.current===resolution)return
    appliedResolution.current=resolution
    if(contextual)setDrafts(previous=>Object.fromEntries(recipients.map(r=>[r.id,editedRecipients.current.has(r.id)?previous[r.id]:resolutionDraft(r,resolution)])))
  },[resolution,contextual,recipients])
  const [picking,setPicking]=useState(false)
  const [pending,setPending]=useState<number[]>([])
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
  const draft=drafts[target]
  const sourceSentences=draft.catalog.map(block=>block.original)
  return <section className="solutions-b03" aria-label="문의 메시지">
    <GNB title="문의 메시지 작성하기" onBack={onBack}/>
    <main className="solutions-b03__content" onClick={event=>{if(!(event.target instanceof HTMLTextAreaElement) && document.activeElement instanceof HTMLTextAreaElement) document.activeElement.blur()}}>
      <div className="solutions-b03__top">
        {recipients.length>1&&<TabBar label="문의 대상" options={recipients.map(r=>({value:r.id,label:r.label,panelId:`${base}-${r.id}`}))} value={target} onChange={value=>{setTarget(value);setToast('')}}/>}
        {recipients.map(r=><section key={r.id} id={`${base}-${r.id}`} role="tabpanel" aria-label={r.label} hidden={target!==r.id}>
          <h2 className="text-body-sb"><span>{r.title}</span>에게 보낼 메시지</h2>
          <ListRow variant="pale" icon={<img src={write} alt=""/>} onClick={()=>{setPending(selectedIndexes(drafts[r.id]));setPicking(true)}}>메시지에 넣을 내용을 선택해 주세요.</ListRow>
          <textarea aria-label={`${r.label} 메시지 본문`} value={messageBody(drafts[r.id])} onChange={e=>{editedRecipients.current.add(r.id);setDrafts(previous=>({...previous,[r.id]:editDraft(previous[r.id],e.target.value)}))}}/>
          <p>* 메시지를 직접 수정할 수 있어요.</p>
        </section>)}
      </div>
      <div className="solutions-b03__actions"><div className="solutions-b03__toast" role="status">{toast&&<span key={toastSequence}>{toast}</span>}</div><Button disabled={copying} onClick={copy}>메시지 복사하기</Button><p>복사한 뒤 문자에 붙여넣어 주세요.</p></div>
    </main>
    <SolutionSheet open={picking} onClose={()=>setPicking(false)} label="메시지에 포함할 문장을 선택해 주세요." className="solutions-message-sheet">
      <div className="solutions-message-sheet__handle" aria-hidden="true"/>
      <h2 id={`${base}-heading`} className="text-heading">메시지에 포함할 문장을 선택해 주세요.</h2>
      <div className="solutions-message-sheet__sentences">{sourceSentences.map((text,i)=><MessageButton key={i} selected={pending.includes(i)} onSelectedChange={selected=>setPending(previous=>selected?[...previous,i]:previous.filter(n=>n!==i))}>{text}</MessageButton>)}</div>
      <div className="solutions-message-sheet__actions"><Button variant="pale" onClick={()=>setPicking(false)}>취소하기</Button><Button onClick={()=>{editedRecipients.current.add(target);setDrafts(previous=>({...previous,[target]:applySentences(draft,pending,sourceSentences)}));setPicking(false)}}>수정하기</Button></div>
    </SolutionSheet>
  </section>
}





