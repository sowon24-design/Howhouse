import { useEffect, useId, useRef, useState } from 'react'
import { Button, GNB, ListRow, MessageButton, TabBar } from '../components/ui'
import { applySentences, initialDraft, copyMessage, editDraft, messageBody, selectedIndexes } from './message-model'
import type { MessageDraft, Recipient } from './message-model'
import write from './assets/b03-write.svg'
import './b03.css'

export function B03({recipients,onBack}:{recipients:readonly Recipient[];onBack:()=>void}) {
  const base=useId()
  const [target,setTarget]=useState(recipients[0]?.id??'')
  const [drafts,setDrafts]=useState<Record<string,MessageDraft>>(()=>Object.fromEntries(recipients.map(r=>[r.id,initialDraft(r)])))
  const [picking,setPicking]=useState(false)
  const [pending,setPending]=useState<number[]>([])
  const [toast,setToast]=useState('')
  const [copying,setCopying]=useState(false)
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const dialog=useRef<HTMLDialogElement>(null)
  const startedOutside=useRef(false)
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[])
  useEffect(()=>{
    if(!picking)return
    const el=dialog.current!
    const focus=document.activeElement as HTMLElement|null
    const overflow=document.body.style.overflow
    document.body.style.overflow='hidden';el.showModal()
    return ()=>{el.close();document.body.style.overflow=overflow;focus?.focus({preventScroll:true})}
  },[picking])
  function announce(text:string){if(timer.current)clearTimeout(timer.current);setToast(text);timer.current=setTimeout(()=>setToast(''),3000)}
  async function copy(){
    setCopying(true)
    try {announce(await copyMessage(messageBody(drafts[target]),text=>navigator.clipboard.writeText(text)))}
    finally {setCopying(false)}
  }
  if(!recipients.length)return null
  const current=recipients.find(r=>r.id===target)!
  const draft=drafts[target]
  return <section className="solutions-b03" aria-label="문의 메세지">
    <GNB title="문의 메세지 작성하기" onBack={onBack}/>
    <main className="solutions-b03__content" onClick={event=>{if(!(event.target instanceof HTMLTextAreaElement) && document.activeElement instanceof HTMLTextAreaElement) document.activeElement.blur()}}>
      <div className="solutions-b03__top">
        {recipients.length>1&&<TabBar label="문의 대상" options={recipients.map(r=>({value:r.id,label:r.label,panelId:`${base}-${r.id}`}))} value={target} onChange={value=>{setTarget(value);setToast('')}}/>}
        {recipients.map(r=><section key={r.id} id={`${base}-${r.id}`} role="tabpanel" aria-label={r.label} hidden={target!==r.id}>
          <h2 className="text-body-sb"><span>{r.title}</span>에게 보낼 메세지</h2>
          <ListRow variant="pale" icon={<img src={write} alt=""/>} onClick={()=>{setPending(selectedIndexes(drafts[r.id]));setPicking(true)}}>메세지에 넣을 내용을 선택해 주세요.</ListRow>
          <textarea aria-label={`${r.label} 메시지 본문`} value={messageBody(drafts[r.id])} onChange={e=>setDrafts(previous=>({...previous,[r.id]:editDraft(previous[r.id],e.target.value)}))}/>
          <p>* 메세지창을 클릭해서 직접 수정할 수도 있어요.</p>
        </section>)}
      </div>
      <div className="solutions-b03__actions"><div className="solutions-b03__toast" role="status">{toast&&<span>{toast}</span>}</div><Button disabled={copying} onClick={copy}>메세지 복사하기</Button><p>복사한 뒤 문자에 붙여넣어 주세요.</p></div>
    </main>
    <dialog ref={dialog} className="solutions-message-sheet" aria-labelledby={`${base}-heading`} onCancel={e=>{e.preventDefault();setPicking(false)}}
      onPointerDown={e=>{const b=e.currentTarget.getBoundingClientRect();startedOutside.current=e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom}}
      onClick={e=>{const b=e.currentTarget.getBoundingClientRect();if(startedOutside.current&&(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom))setPicking(false)}}>
      <div className="solutions-message-sheet__handle" aria-hidden="true"/>
      <h2 id={`${base}-heading`} className="text-heading">메세지에 포함할 문장을 선택해 주세요.</h2>
      <div className="solutions-message-sheet__sentences">{current.sentences.map((text,i)=><MessageButton key={i} selected={pending.includes(i)} onSelectedChange={selected=>setPending(previous=>selected?[...previous,i]:previous.filter(n=>n!==i))}>{text}</MessageButton>)}</div>
      <div className="solutions-message-sheet__actions"><Button variant="pale" onClick={()=>setPicking(false)}>취소하기</Button><Button onClick={()=>{setDrafts(previous=>({...previous,[target]:applySentences(draft,pending,current.sentences)}));setPicking(false)}}>수정하기</Button></div>
    </dialog>
  </section>
}





