import {ageConfirmationKey} from './release-mode'
import {useState} from 'react'
import {Button,Checkbox} from '../components/ui'
import {Dialog} from '../components/ui/Dialogs'
import {configuredAppSession,clearConfiguredAppSession} from './app-session'
import {resolveAnalysisBaseUrl} from './endpoint'
import {createPrivacyClient} from './privacy-client'
import {resetProfile} from '../app-screens/profile-storage'
export function configuredPrivacyClient(){
 const auth=configuredAppSession();if(!auth)throw Error('실서버 인증 설정이 필요합니다.')
 return createPrivacyClient({baseUrl:resolveAnalysisBaseUrl(),getAccessToken:auth,storage:window.localStorage})
}
export function PrivacyActions(){
 const [open,setOpen]=useState(false),[confirmed,setConfirmed]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[code,setCode]=useState('')
 async function showCode(){setBusy(true);setError('');try{setCode(await configuredPrivacyClient().identity())}catch{setError('삭제 코드를 확인하지 못했어요. 서버 연결을 확인하고 다시 시도해 주세요.')}finally{setBusy(false)}}
 async function withdraw(){setBusy(true);setError('');try{await configuredPrivacyClient().withdraw();setError('AI 분석 동의를 철회했어요. 기존 서버 기록까지 지우려면 아래에서 데이터 삭제를 요청해 주세요.')}catch{setError('철회를 확인하지 못했어요. 연결을 확인하고 다시 시도해 주세요.')}finally{setBusy(false)}}
 async function remove(){
  if(!confirmed||busy)return
  setBusy(true);setError('')
  let serverDeleted=false
  try{
   const client=configuredPrivacyClient();await client.deleteMine();serverDeleted=true
   if(!resetProfile(window.localStorage))throw Error('local-storage')
   clearConfiguredAppSession();window.localStorage.removeItem(ageConfirmationKey);client.clear()
   window.location.replace('#onboarding');window.location.reload()
  }catch{setError(serverDeleted?'서버 데이터는 삭제됐지만 기기 저장을 정리하지 못했어요. 기기 설정에서 이 앱의 데이터를 지워 주세요.':'삭제 완료를 확인하지 못했어요. 기기 정보는 유지했어요. 같은 버튼으로 다시 확인해 주세요.');setBusy(false)}
 }
 return <section className="hh-information-sections" aria-label="서버 데이터 삭제">
  <h2>서버 데이터 삭제</h2><p>임시 계정·분석 답변·호출 기록·평가·의견·신고를 삭제하고 처음 화면으로 돌아가요. 삭제한 정보는 복구할 수 없어요.</p>
  <Button variant="pale" disabled={busy} onClick={()=>{setError('');setConfirmed(false);setOpen(true)}}>내 서버 데이터 삭제</Button>
  <Button variant="pale" disabled={busy} onClick={()=>{void withdraw()}}>AI 분석 동의 철회</Button>
  <Button variant="pale" disabled={busy} onClick={()=>{void showCode()}}>앱 삭제 전 삭제 코드 확인</Button>
  {code&&<><p>삭제 코드는 비밀번호처럼 보관하세요. 이메일·채팅으로 보내지 마세요. 앱을 지운 뒤에도 외부 삭제 페이지에서 사용할 수 있어요.</p><code style={{overflowWrap:'anywhere'}}>{code}</code></>}
  {error&&<p role="alert">{error}</p>}
  <Dialog open={open} onClose={()=>{if(!busy)setOpen(false)}} label="서버 데이터 삭제 확인" className="ui-action-sheet" closeOnBackdrop={!busy}>
   <h2>서버 데이터를 삭제할까요?</h2><p>임시 계정과 연결 데이터를 삭제해요. 직접 복사·전송한 메시지와 외부 제공사의 독립된 보관 기록은 별도예요. 실패하면 기기 정보를 지우지 않아요.</p>
   <Checkbox label="삭제할 정보와 복구할 수 없다는 점을 확인했어요." checked={confirmed} disabled={busy} onChange={e=>setConfirmed(e.target.checked)}/>
   {error&&<p role="alert">{error}</p>}
   <Button disabled={!confirmed||busy} onClick={()=>{void remove()}}>{busy?'삭제 확인 중':'확인한 서버 데이터 삭제'}</Button><Button variant="pale" disabled={busy} onClick={()=>setOpen(false)}>취소하기</Button>
  </Dialog>
 </section>
}
