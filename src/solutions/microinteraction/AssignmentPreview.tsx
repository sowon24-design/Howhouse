import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { HomeScreen, type HomeCategoryKey } from '../../app-screens/home/HomeScreen'
import { B01 } from '../B01'
import { B02 } from '../B02'
import { B03 } from '../B03'
import { ResolutionSheet } from '../ResolutionSheet'
import { OpinionSheet } from '../OpinionSheet'
import { categories, getCategoryCases, getSolutionById, solutionCases, type CategoryId } from '../data'
import { toMessageRecipients } from '../message-model'
import '../../styles/global.css'
import '../../app-screens/home/home-preview.css'
import '../../app-screens/solutions/solutions-flow.css'
import '../../catalog/catalog.css'
import './assignment-preview.css'

const categoryMap:Record<HomeCategoryKey,CategoryId>={boiler:'보일러',bathroom:'화장실',refrigerator:'냉장고',water:'수도·수질',electricity:'전기·조명',washer:'세탁기',pests:'해충',mold:'곰팡이'}
const example=getSolutionById('욕실·수도:1')!
const scene=new URLSearchParams(location.search).get('scene')
if(scene) document.documentElement.dataset.catalogApp='true'
document.documentElement.dataset.appHorizontalLock='true'

function Demo(){
  const [category,setCategory]=useState<CategoryId>()
  const [caseId,setCaseId]=useState<string>()
  const [contact,setContact]=useState(false)
  const [solved,setSolved]=useState(false)
  const [thanks,setThanks]=useState(false)
  const data=caseId?getSolutionById(caseId)!:example
  const home=()=>{setCategory(undefined);setCaseId(undefined);setContact(false)}
  const selectCategory=(value:HomeCategoryKey)=>{
    const update=()=>flushSync(()=>setCategory(categoryMap[value]))
    if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(update)
    else update()
  }
  const content=contact?<B03 recipients={toMessageRecipients(data)} onBack={()=>setContact(false)}/>
    :(scene==='2'||caseId)?<B02 key={caseId} data={data} onBack={home} onComplete={home} onContact={()=>setContact(true)} onOpenVideo={()=>{}} onPreviewOpinion={()=>{}}/>
    :category?<B01 key={category} categoryLabel={category} items={getCategoryCases(solutionCases,category).map(item=>({key:item.id,label:item.symptom}))} onSelect={setCaseId} onBack={home} onWriteProblem={()=>setCategory(categories[0].id)}/>
    :<HomeScreen catalogOnly nickname="연우" month={11} popularProblems={[{id:example.id,title:example.symptom}]} onCategory={selectCategory} onProblem={setCaseId} onProfile={()=>{}} onStartProblem={()=>selectCategory('bathroom')}/>
  return <>
    <div className="yw-demo-tools">
      {scene==='1'?<><strong>01 · 홈 → 카테고리</strong><button onClick={home}>처음부터</button></>
        :<><button onClick={()=>setSolved(true)}>해결완료 재생</button><button onClick={()=>setThanks(true)}>의견완료 재생</button></>}
    </div>
    <div className="hh-home-preview"><div className="hh-home-preview-frame hh-catalog-frame" key={scene}>
      {content}
      <ResolutionSheet mode={solved?'solved':'closed'} onClose={()=>setSolved(false)} onHome={()=>{setSolved(false);home()}} onContact={()=>{setSolved(false);setContact(true)}} canContact={data.canContact} hasLandlordMessage/>
      <OpinionSheet localOnly mode={thanks?'thanks':'closed'} reason="" text="" onReason={()=>{}} onText={()=>{}} onClose={()=>setThanks(false)} onPreviewSubmit={()=>{}}/>
    </div></div>
  </>
}
function Gallery(){return <main className="yw-gallery">
  <header><p>어쩌집 · 연우 개인 과제</p><h1>마이크로 인터랙션 미리보기</h1><p>왼쪽은 홈의 화장실을 눌러보세요. 오른쪽은 상단의 완료 재생 버튼으로 각각 확인할 수 있어요.</p></header>
  <div className="yw-gallery__grid">
    <section><h2>01 화면 전환 · 순차 등장 · 눌림</h2><iframe title="첫 번째 인터랙션" src="?scene=1"/></section>
    <section><h2>02 부드러운 시트 · 소라게 · 눌림</h2><iframe title="두 번째 인터랙션" src="?scene=2"/></section>
  </div>
  <p className="yw-gallery__note">실제 앱과 같은 화면·버튼·바텀시트 컴포넌트를 사용한 과제용 시연입니다. 의견은 서버로 전송되지 않아요.</p>
</main>}
createRoot(document.getElementById('root')!).render(scene?<Demo/>:<Gallery/>)
