import {useState} from 'react'
import {Button,Checkbox} from '../components/ui'
import {Dialog} from '../components/ui/Dialogs'
import information from '../app-screens/my/information-draft.json'
import {configuredPrivacyClient} from './PrivacyActions'
export function AnalysisPrivacyDialog({open,onClose,onContinue}:{open:boolean;onClose:()=>void;onContinue:()=>void}){
 const [age,setAge]=useState(false)
 const [processing,setProcessing]=useState(false)
 const [checked,setChecked]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('')
 const ready=import.meta.env.VITE_RELEASE_PRIVACY_READY==='1'&&!information.privacy.some(s=>/검토 초안|확정 필요|\[[^\]]+\]/.test(s.title+' '+s.paragraphs.join(' ')))
 async function accept(){if(!checked||!processing||!age||!ready||busy)return;setBusy(true);setError('');try{await configuredPrivacyClient().consent({ageAtLeast14:true,processingAccepted:true,overseasAccepted:true});onContinue()}catch{setError('동의 저장을 확인하지 못했어요. 글·사진은 전송하지 않았어요. 다시 시도해 주세요.')}finally{setBusy(false)}}
 return <Dialog open={open} onClose={()=>{if(!busy)onClose()}} label="AI 분석 정보 전송 동의" className="ui-action-sheet hh-terms-sheet" closeOnBackdrop={!busy}>
  <div className="ui-sheet-handle" aria-hidden="true"/><h2>AI 분석 전에 확인해 주세요</h2>
  <div className="hh-terms-document" tabIndex={0} role="region" aria-label="AI 처리 및 국외 이전 안내">
   <p>글·선택한 사진은 싱가포르의 분석 서버를 거쳐 OpenAI로 전송돼요. 사진의 얼굴·이름·연락처·상세 주소를 제외해 주세요.</p>
   <p>동의하지 않아도 카테고리의 기존 사례를 볼 수 있어요. 동의 철회와 서버 데이터 삭제는 마이 페이지에서 할 수 있어요.</p>
   {information.privacy.map((section,i)=><section key={i}><h3>{section.title}</h3>{section.paragraphs.map((p,j)=><p key={j}>{p}</p>)}</section>)}
  </div>
  {!ready&&<p role="alert">국외 처리 조건의 최종 검토 전이라 실제 분석 동의를 받을 수 없어요.</p>}
  <Checkbox label="만 14세 이상임을 확인해요." checked={age} disabled={busy||!ready} onChange={e=>setAge(e.target.checked)}/>
  <Checkbox label="[선택] AI 분석을 위한 글·사진 수집·이용에 동의해요." checked={processing} disabled={busy||!ready} onChange={e=>setProcessing(e.target.checked)}/>
  <Checkbox label="[선택] 안내한 업체·국가로의 개인정보 국외 이전에 동의해요." checked={checked} disabled={busy||!ready} onChange={e=>setChecked(e.target.checked)}/>
  {error&&<p role="alert">{error}</p>}
  <Button disabled={!checked||!processing||!age||busy||!ready} onClick={()=>{void accept()}}>{busy?'동의 확인 중':'동의하고 분석하기'}</Button><Button variant="pale" disabled={busy} onClick={onClose}>동의하지 않고 돌아가기</Button>
 </Dialog>
}
