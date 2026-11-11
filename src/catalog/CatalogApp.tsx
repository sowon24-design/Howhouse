import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button } from '../components/ui'
import { HomeScreen, type HomeCategoryKey } from '../app-screens/home/HomeScreen'
import { LaunchScreen } from '../app-screens/system/LaunchScreen'
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
import { CatalogSearch } from './CatalogSearch'
import { searchCases } from './search-cases'
import { CatalogMy, CatalogMyDetail, type CatalogMyPage } from './CatalogMy'
import { reviewedCatalogCase } from './content-review'
import '../app-screens/home/home-preview.css'
import '../app-screens/solutions/solutions-flow.css'
import './catalog.css'

const profileKey = 'howhouse.catalog.profile.v1'
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
  const [launchReady, setLaunchReady] = useState(false)
  const [launchPreview, setLaunchPreview] = useState(false)
  useEffect(() => {
    let active = true
    let timer: ReturnType<typeof setTimeout>
    const minimum = new Promise<void>(resolve => { timer = setTimeout(resolve, 1000) })
    Promise.all([minimum, document.fonts.ready.catch(() => undefined)]).then(() => {
      if (active) setLaunchReady(true)
    })
    return () => { active = false; clearTimeout(timer) }
  }, [])
  const [profile, setProfile] = useState(readProfile)
  const [onboardingKey, setOnboardingKey] = useState(0)
  const [hash, setHash] = useState(location.hash)
  const [query, setQuery] = useState('')
  const [previewCaseId, setPreviewCaseId] = useState<string>(solutionCases[0]?.id ?? '')
  const [notice, setNotice] = useState('')
  const [contact, setContact] = useState(false)
  const [visited, setVisited] = useState(false)
  const [resolution, setResolution] = useState<ResolutionStatus>()
  const [editing, setEditing] = useState(false)
  const searchOrigin = useRef('home')
  const caseOrigin = useRef('search')
  const frameRef = useRef<HTMLDivElement>(null)
  const solutionScroll = useRef({ hash: '', top: 0 })
  const previousView = useRef({ hash, contact })
  useLayoutEffect(() => {
    const returningFromMessage = previousView.current.hash === hash && previousView.current.contact && !contact
    const top = returningFromMessage && solutionScroll.current.hash === hash ? solutionScroll.current.top : 0
    frameRef.current?.scrollTo({ top, behavior: 'instant' })
    previousView.current = { hash, contact }
  }, [hash, contact, editing])
  const navigate = (path: string) => {
    if (path === 'search') setQuery('')
    if (path === 'search' && !location.hash.startsWith('#case/') && location.hash !== '#search-results') {
      searchOrigin.current = location.hash.startsWith('#solutions/') ? location.hash.slice(1) : 'home'
    }
    if (path.startsWith('case/')) {
      const origin = location.hash
      caseOrigin.current = origin === '#search' || origin === '#search-results' || origin.startsWith('#solutions/') ? origin.slice(1) : 'home'
    }
    location.hash = path
  }
  const home = () => navigate('home')
  const backFromSearch = () => navigate(searchOrigin.current)
  const backFromCase = () => navigate(caseOrigin.current)
  const caseId = hash.startsWith('#case/') ? hash.slice(6) : ''
  let decodedId = ''
  try { decodedId = decodeURIComponent(caseId) } catch { /* Invalid link is handled below. */ }
  const originalCase = getSolutionById(decodedId)
  const selected = originalCase ? reviewedCatalogCase(originalCase) : undefined
  const category = categories.find(item => hash === `#solutions/${encodeURIComponent(item.id)}`)?.id
  useEffect(() => {
    const update = (event: HashChangeEvent) => {
      // Clear only A09 → A08; returning from a case to its results keeps the query.
      if (new URL(event.oldURL).hash === '#search-results' && location.hash === '#search') setQuery('')
      setHash(location.hash); setContact(false); setVisited(false); setResolution(undefined); setEditing(false); setNotice('')
    }
    window.addEventListener('hashchange', update)
    if (!location.hash || location.hash === '#') location.replace('#home')
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useAndroidBack(() => {
    if (editing) setEditing(false)
    else if (contact) setContact(false)
    else if (selected) backFromCase()
    else if (hash.startsWith('#my/')) navigate('my')
    else if (hash === '#search-results') navigate('search')
    else if (hash === '#search') backFromSearch()
    else if (hash !== '#home') home()
    else minimizeAndroidApp()
  }, Boolean(profile) && launchReady && !launchPreview)
  useAndroidBack(() => { if (launchPreview) setLaunchPreview(false); else minimizeAndroidApp() }, !launchReady || launchPreview)
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
  // Capture builds hide the tools without removing the development workflow.
  const showDeveloperTools = import.meta.env.VITE_HIDE_DEVELOPER_TOOLS !== '1' && (import.meta.env.DEV || ['test', 'catalog-preview'].includes(import.meta.env.MODE))
  const frame = (children: React.ReactNode) => <div className="hh-home-preview">
    <div ref={frameRef} className="hh-home-preview-frame hh-catalog-frame">{children}</div>
    {showDeveloperTools && <details className="hh-home-preview-tools hh-preview-disclosure" aria-label="사례 앱 개발용 도구">
      <summary>개발용 안내·테스트 도구</summary>
      <div className="hh-preview-disclosure-panel">
        <p>AI 없는 사례 검색 버전 · 기존 사례 {solutionCases.length}개</p>
        {profile ? <nav aria-label="미리보기 화면 이동">
          <button type="button" onClick={home}>홈</button>{' · '}
          <button type="button" onClick={() => navigate('search')}>사례 검색</button>{' · '}
          <button type="button" onClick={() => navigate('my')}>마이 페이지</button>
        </nav> : <p>시작 설정을 완료하면 화면 이동 도구를 사용할 수 있어요.</p>}
        {profile && <div className="hh-catalog-case-picker">
          <label htmlFor="catalog-preview-case">B02 사례 직접 열기 · 전체 {solutionCases.length}개</label>
          <select id="catalog-preview-case" value={previewCaseId} onChange={event => setPreviewCaseId(event.target.value)}>
            {Array.from(new Set(solutionCases.map(item => item.category))).map(categoryName => <optgroup key={categoryName} label={categoryName}>
              {solutionCases.filter(item => item.category === categoryName).map(item => <option key={item.id} value={item.id}>{item.id} · {item.symptom}</option>)}
            </optgroup>)}
          </select>
          <Button variant="pale" disabled={!previewCaseId} onClick={() => { setContact(false); setVisited(false); setEditing(false); setLaunchPreview(false); navigate(`case/${encodeURIComponent(previewCaseId)}`) }}>선택한 사례 열기</Button>
          <p>검색어와 관계없이 현재 앱에 연결된 사례를 열어요.</p>
        </div>}
        <Button variant="pale" onClick={() => setLaunchPreview(true)}>F01 로딩 다시 보기</Button>
        {launchPreview && <Button onClick={() => setLaunchPreview(false)}>로딩 미리보기 닫기</Button>}
        <Button variant="pale" onClick={reset}>테스트 초기화 · 처음부터 시작</Button>
        <p>이 버전의 닉네임·시작 설정·검색 입력만 초기화해요.</p>
      </div>
    </details>}
  </div>
  if (!launchReady || launchPreview) return frame(<LaunchScreen/>)
  if (!profile) return <CatalogOnboarding key={onboardingKey} onComplete={nickname => { saveProfile({nickname, ageConfirmed:true}); home() }}/>
  if (editing) return frame(<NicknameScreen mode="edit" initialValue={profile.nickname} onBack={() => setEditing(false)} onComplete={nickname => {saveProfile({...profile,nickname});setEditing(false)}}/>)
  if (hash === '#my') return frame(<CatalogMy nickname={profile.nickname} onBack={home} onEdit={()=>setEditing(true)} onPage={page=>navigate(`my/${page}`)} notice={notice}/>)
  if (['#my/data','#my/ai','#my/contact'].includes(hash)) return frame(<CatalogMyDetail page={hash.slice(4) as CatalogMyPage} onBack={()=>navigate('my')} notice={notice}/>)
  if (selected) return frame(<div className="hh-catalog-result">
    <div hidden={contact}><B02 data={selected} onBack={backFromCase} onComplete={home}
      onContact={value => {solutionScroll.current = { hash, top: frameRef.current?.scrollTop ?? 0 };setResolution(value);setVisited(true);setContact(true)}} onOpenVideo={() => {}} onPreviewOpinion={() => {}}/></div>
    {visited && <div hidden={!contact}><B03 recipients={toMessageRecipients(selected,resolution==='solved')} resolution={resolution} onBack={() => setContact(false)}/></div>}
  </div>)
  if (category) return frame(<B01 categoryLabel={category} items={getCategoryCases(solutionCases, category).map(item=>({key:item.id,label:item.symptom}))}
    onSelect={id=>navigate(`case/${encodeURIComponent(id)}`)} onBack={home}/> )
  if (hash === '#home' || hash === '' || hash === '#') return frame(<HomeScreen catalogOnly nickname={profile.nickname} month={new Date().getMonth()+1}
    popularProblems={['욕실·수도:1','욕실·수도:2','난방·전기:17'].flatMap(id=>{const item=getSolutionById(id);return item?[{id,title:item.symptom}]:[]})}
    onProfile={()=>navigate('my')} onStartProblem={()=>navigate('search')} onCategory={key=>navigate(`solutions/${encodeURIComponent(categoryMap[key])}`)} onProblem={id=>navigate(`case/${encodeURIComponent(id)}`)}/> )
  const hasQuery = Boolean(query.trim())
  const results = hasQuery ? searchCases(solutionCases,query) : []
  return frame(<CatalogSearch key={hash} query={query} onChange={setQuery} showResults={hash === '#search-results'} results={results}
    onBack={hash === '#search-results' ? () => navigate('search') : backFromSearch}
    onHome={home} onSubmit={() => navigate('search-results')} onSelect={id => navigate('case/'+encodeURIComponent(id))}/>)
}
