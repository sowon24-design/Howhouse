import { useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { B01 } from './B01'
import { B02 } from './B02'
import { B03 } from './B03'
import { toMessageRecipients } from './message-model'
import { categories, getCategoryCases, solutionCases, getSolutionById } from './data'
import type { CategoryId } from './data'
import '../styles/global.css'
import './preview-only.css'

function previewScroll(){return document.querySelector<HTMLElement>('.solutions-preview__viewport')!}
/** Lookup boundary: the navigation state passes only the selected case ID. */
function SelectedCase({ id, onBack, notify }: {id:string; onBack:()=>void; notify:(text:string)=>void}) {
  const [contactOpen,setContactOpen]=useState(false)
  const [contactVisited,setContactVisited]=useState(false)
  const solutionScroll=useRef(0)
  useLayoutEffect(()=>{previewScroll().scrollTo({top:contactOpen?0:solutionScroll.current,behavior:'instant'})},[contactOpen])
  const data = getSolutionById(id)
  if (!data) return <main><p role="alert">선택한 사례를 찾을 수 없습니다.</p><button onClick={onBack}>B01로 돌아가기</button></main>
  return <><div hidden={contactOpen}><B02 key={id} data={data} onBack={onBack}
    onComplete={() => {notify('완료: A01 홈 이동 요청을 확인했습니다. 실제 A 화면 연결은 통합 시 적용합니다.');previewScroll().scrollTo({top:0,behavior:'instant'})}}
    onContact={() => {solutionScroll.current=previewScroll().scrollTop;setContactVisited(true);setContactOpen(true)}}
    onPreviewOpinion={() => notify('의견 완료 UI만 표시합니다. 실제 저장·전송은 없습니다.')}
    onOpenVideo={() => notify('선택 사례의 첫 번째 영상 원문을 새 탭에서 엽니다.')} /></div>{contactVisited&&<div hidden={!contactOpen}><B03 recipients={toMessageRecipients(data)} onBack={()=>setContactOpen(false)}/></div>}</>
}
function Preview() {
  const [category, setCategory] = useState<CategoryId>('화장실')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const listScroll = useRef(0)
  useLayoutEffect(() => { previewScroll().scrollTo({top: selectedId ? 0 : listScroll.current, behavior: 'instant'}) }, [selectedId, category])
  const items = getCategoryCases(solutionCases, category).map(c => ({key:c.id,label:c.symptom}))
  return <div className="solutions-preview">
    <aside className="solutions-preview__notice">
      <div>B 화면 독립 확인 / CSV 사례 {solutionCases.length}개 / 전체 앱 이동은 미연결</div>
      <label>카테고리 <select value={category} onChange={e => {listScroll.current=0;setCategory(e.target.value as CategoryId);setSelectedId(null);setNotice('')}}>{categories.map(c => <option key={c.id}>{c.id}</option>)}</select></label>
      <div>{selectedId ? `선택 ID: ${selectedId}` : `${category} ${items.length}개 사례`}</div>
      <div>임시 공통 이미지 · 의견 API/A 화면은 미연결</div>
      <p role="status">{notice}</p>
    </aside>
    <div className="solutions-preview__viewport">{selectedId ? <SelectedCase id={selectedId} onBack={() => {setSelectedId(null);setNotice('')}} notify={setNotice} /> : <B01 categoryLabel={category} items={items}
      onSelect={id => {listScroll.current=previewScroll().scrollTop;setSelectedId(id);setNotice('')}}
      onWriteProblem={() => setNotice('A02 연결 보류: 현재 화면을 유지합니다.')}
      onBack={() => setNotice('A01 홈 연결 보류: 현재 화면을 유지합니다.')} />}</div>
  </div>
}
createRoot(document.getElementById('root')!).render(<Preview />)




