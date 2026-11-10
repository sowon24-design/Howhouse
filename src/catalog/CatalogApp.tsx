import { useEffect, useRef, useState } from 'react'
import { Button, GNB, ListRow } from '../components/ui'
import { HomeScreen, type HomeCategoryKey } from '../app-screens/home/HomeScreen'
import { CatalogOnboarding } from './CatalogOnboarding'
import { catalogIntroductionKey } from './onboarding-progress'
import { NicknameScreen } from '../app-screens/onboarding/NicknameScreen'
import { minimizeAndroidApp, useAndroidBack, useAndroidBackBridge } from '../app-screens/android-back'
import { B01 } from '../solutions/B01'
import { B02 } from '../solutions/B02'
import { B03 } from '../solutions/B03'
import { categories, getCategoryCases, getSolutionById, solutionCases, type CategoryId } from '../solutions/data'
import { toMessageRecipients } from '../solutions/message-model'
import type { ResolutionStatus } from '../solutions/resolution-message'
import { searchCases } from './search-cases'
import { catalogPolicy } from './policy'
import { reviewedCatalogCase } from './content-review'
import '../app-screens/home/home-preview.css'
import '../app-screens/solutions/solutions-flow.css'
import './catalog.css'

import { PolicyBody } from './PolicyBody'

const profileKey = 'howhouse.catalog.profile.v1'
function PolicyDocuments({ all = false }: { all?: boolean }) {
  const documents = [
    ['privacy', '개인정보 처리방침'], ['terms', '이용약관'],
    ...(all ? [['data', '개인정보 및 데이터 관리'], ['consent', 'AI 분석 동의 — 미사용 안내'],
      ['transfer', '분석 국외 이전 동의 — 미사용 안내'], ['ai', '서비스 제공 방식·이미지 안내']] : []),
  ] as const
  return <>{documents.map(([key, title]) => <details key={key}>
    <summary>{title}</summary>
    <PolicyBody paragraphs={catalogPolicy[key as 'privacy' | 'terms' | 'data' | 'consent' | 'transfer' | 'ai']}/>
  </details>)}</>
}
const categoryMap: Record<HomeCategoryKey, CategoryId> = {
  boiler: '보일러', bathroom: '화장실', refrigerator: '냉장고', water: '수도·수질',
  electricity: '전기·조명', washer: '세탁기', pests: '해충', mold: '곰팡이',
}
type Profile = { nickname: string; ageConfirmed: true }
function readProfile(): Profile | undefined {
  try {
    const p = JSON.parse(localStorage.getItem(profileKey) ?? 'null')
    if (p?.ageConfirmed === true && typeof p.nickname === 'string' && p.nickname.trim() && Array.from(p.nickname).length <= 10) return p
  } catch { /* First use or unavailable local storage. */ }
}

export default function CatalogApp() {
  useAndroidBackBridge()
  const [profile, setProfile] = useState(readProfile)
  const [onboardingKey, setOnboardingKey] = useState(0)
  const [hash, setHash] = useState(location.hash)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [contact, setContact] = useState(false)
  const [visited, setVisited] = useState(false)
  const [resolution, setResolution] = useState<ResolutionStatus>()
  const [editing, setEditing] = useState(false)
  const caseOrigin = useRef('search')
  const frameRef = useRef<HTMLDivElement>(null)
  useEffect(() => { frameRef.current?.scrollTo({top:0}) },[hash,contact,editing])
  const navigate = (path: string) => {
    if (path.startsWith('case/')) {
      const origin = location.hash
      caseOrigin.current = origin === '#search' || origin.startsWith('#solutions/') ? origin.slice(1) : 'home'
    }
    location.hash = path
  }
  const home = () => navigate('home')
  const backFromCase = () => navigate(caseOrigin.current)
  const caseId = hash.startsWith('#case/') ? hash.slice(6) : ''
  let decodedId = ''
  try { decodedId = decodeURIComponent(caseId) } catch { /* Invalid link is handled below. */ }
  const originalCase = getSolutionById(decodedId)
  const selected = originalCase ? reviewedCatalogCase(originalCase) : undefined
  const category = categories.find(item => hash === `#solutions/${encodeURIComponent(item.id)}`)?.id
  useEffect(() => {
    const update = () => { setHash(location.hash); setContact(false); setVisited(false); setResolution(undefined); setEditing(false); setNotice('') }
    window.addEventListener('hashchange', update)
    if (!location.hash || location.hash === '#') location.replace('#home')
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useAndroidBack(() => {
    if (editing) setEditing(false)
    else if (contact) setContact(false)
    else if (selected) backFromCase()
    else if (hash !== '#home') home()
    else minimizeAndroidApp()
  }, Boolean(profile))
  function saveProfile(next: Profile) {
    setProfile(next)
    try { localStorage.setItem(profileKey, JSON.stringify(next)); setNotice('설정을 이 기기에 저장했어요.') }
    catch { setNotice('기기 저장이 차단되어 앱을 다시 열면 설정이 사라질 수 있어요.') }
  }
  function reset() {
    try { localStorage.removeItem(catalogIntroductionKey); localStorage.removeItem(profileKey) }
    catch { setNotice('기기 저장 정보를 지우지 못했어요. 다시 시도해 주세요.'); return }
    setProfile(undefined); setOnboardingKey(value => value + 1); setQuery(''); setContact(false); setVisited(false); setEditing(false); home()
  }
  const frame = (children: React.ReactNode) => <div className="hh-home-preview"><div ref={frameRef} className="hh-home-preview-frame hh-catalog-frame">{children}</div></div>
  if (!profile) return <CatalogOnboarding key={onboardingKey} onComplete={nickname => { saveProfile({nickname, ageConfirmed:true}); home() }}/>
  if (editing) return frame(<NicknameScreen mode="edit" initialValue={profile.nickname} onBack={() => setEditing(false)} onComplete={nickname => {saveProfile({...profile,nickname});setEditing(false)}}/>)
  if (hash === '#my') return frame(<main className="hh-catalog-page">
    <GNB title="마이 페이지" onBack={home}/>
    <h1 className="text-heading">{profile.nickname} 님</h1>
    <Button variant="pale" onClick={() => setEditing(true)}>닉네임 수정</Button>
    <h2 className="text-heading">앱 정보</h2><p>기존 주거 문제 사례를 찾고 문의 문장을 편집하는 어쩌집이에요. 계정·AI 분석·평가 및 의견 서버 저장은 사용하지 않아요.</p>
    <PolicyDocuments all/>
    <p>운영: {catalogPolicy.operator}<br/>개인정보 보호담당자: {catalogPolicy.officer}</p>
    <a href={`mailto:${catalogPolicy.email}`} rel="noreferrer">이메일 문의 (외부 앱)</a>
    <Button variant="pale" onClick={reset}>이 기기의 설정 초기화</Button>
    <p>닉네임과 시작 설정을 지워요. 이전 AI 버전의 서버 기록이나 클립보드는 지우지 않아요.</p>
    {notice && <p role="status">{notice}</p>}
  </main>)
  if (selected) return frame(<div className="hh-catalog-result">
    <div hidden={contact}><B02 data={selected} onBack={backFromCase} onComplete={home}
      onContact={value => {setResolution(value);setVisited(true);setContact(true)}} onOpenVideo={() => {}} onPreviewOpinion={() => {}}/></div>
    {visited && <div hidden={!contact}><B03 recipients={toMessageRecipients(selected,resolution==='solved')} resolution={resolution} onBack={() => setContact(false)}/></div>}
  </div>)
  if (category) return frame(<B01 categoryLabel={category} items={getCategoryCases(solutionCases, category).map(item=>({key:item.id,label:item.symptom}))}
    onSelect={id=>navigate(`case/${encodeURIComponent(id)}`)} onBack={home} onWriteProblem={()=>navigate('search')}/> )
  if (hash === '#home' || hash === '' || hash === '#') return frame(<HomeScreen catalogOnly nickname={profile.nickname} month={new Date().getMonth()+1}
    popularProblems={['욕실·수도:1','욕실·수도:2','난방·전기:17'].flatMap(id=>{const item=getSolutionById(id);return item?[{id,title:item.symptom}]:[]})}
    onProfile={()=>navigate('my')} onStartProblem={()=>navigate('search')} onCategory={key=>navigate(`solutions/${encodeURIComponent(categoryMap[key])}`)} onProblem={id=>navigate(`case/${encodeURIComponent(id)}`)}/> )
  const hasQuery = Boolean(query.trim())
  const results = hasQuery ? searchCases(solutionCases,query) : []
  return frame(<main className="hh-catalog-page">
    <GNB title="사례 찾아보기" onBack={home}/>
    <h1 className="text-heading">비슷한 문제를 찾아보세요</h1>
    <label htmlFor="case-search">문제·증상 검색</label>
    <input id="case-search" type="search" maxLength={200} value={query} onChange={event=>setQuery(event.target.value)} placeholder="예: 배수구, 보일러, 곰팡이" autoComplete="off"/>

    {/가스\s*냄새|연기|불꽃|감전|탄내|타는\s*냄새/.test(query) && <p role="alert">위험한 상황일 수 있어요. 직접 분해하거나 수리하지 말고 안전을 확보한 뒤 긴급기관 또는 전문가에게 도움을 요청하세요. 검색 결과만으로 안전 여부를 판단하지 마세요.</p>}
    {hasQuery && <p role="status">{results.length}개의 사례</p>}
    {hasQuery && (results.length ? <ul className="hh-catalog-list">{results.map(item=><li key={item.id}><ListRow onClick={()=>navigate(`case/${encodeURIComponent(item.id)}`)}>{item.symptom}</ListRow></li>)}</ul>
      : <p>일치하는 사례가 없어요. 짧은 증상이나 카테고리 이름으로 다시 찾아보세요. 위험한 상황이라면 전문가에게 문의해 주세요.</p>)}
  </main>)
}
