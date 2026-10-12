import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, COMMENTS0, ISSUES, KEYWORD_LABEL, KEYWORD_RE, MAP_PINS, PLACES, POSTS0, GALLERY, PHOTO_SAMPLES, TAGS, VENDORS, VOICE_SAMPLES, byId, classify, extractKeywords, type Comment, type Issue, type Post } from './data'

const postsFor = (is: Issue, posts: Post[]): Post[] => [
  ...posts.filter((p) => p.issue === is.id),
  ...is.cases.map((c, i) => ({ id: `${is.id}-c${i}`, author: c[0], tags: c[1], text: c[2], likes: Math.round(c[3] / 50), issue: is.id, ago: 1440 * (3 + i * 4), views: c[3] })),
]

const SORTS = [['pop', '인기순'], ['new', '최신순'], ['help', '도움이 많이 된 순'], ['cmt', '댓글 많은 순']] as const

const postCat = (p: { tags: string[]; text: string }) => TAGS.find((t) => p.tags.includes(t)) ?? (/\?|어떻게|궁금|맞나요|될까요/.test(p.text) ? '생활질문' : /도와|부탁|급해|어쩌/.test(p.text) ? '도움요청' : /했더니|끝!|해결|없어요|됐어요|돼요|보냈더니|조였|최고/.test(p.text) ? '해결후기' : /팁|추천|꿀|방법|세요/.test(p.text) || p.tags.includes('꿀팁') ? '자취팁' : '기타')
const anon = (n: string) => `익명 · 자취 ${['3개월', '1년', '2년', '3년', '4년', '6년', '8년'][[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % 7]}차`

const agoText = (m: number) => (m < 1 ? '방금 전' : m < 60 ? `${m}분 전` : m < 1440 ? `${Math.floor(m / 60)}시간 전` : `${Math.floor(m / 1440)}일 전`)

const Bookmark = ({ className = '' }: { className?: string }) => <svg viewBox="0 0 24 24" className={`fill-brand stroke-white ${className}`} strokeWidth="1.2" aria-label="북마크"><path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4.5L5 22V3a1 1 0 0 1 1-1z" /></svg>

type View =
  | { n: 'home' } | { n: 'photo' } | { n: 'voice' } | { n: 'text' } | { n: 'loading' }
  | { n: 'result' } | { n: 'lib' } | { n: 'cat'; id: string } | { n: 'issue'; id: string }
  | { n: 'nearby'; id: string } | { n: 'msg'; id: string }
  | { n: 'community' } | { n: 'write' } | { n: 'me' } | { n: 'book'; id: string } | { n: 'map' } | { n: 'post'; id: string } | { n: 'plan' }

const I = {
  camera: <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>,
  mic: <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>,
  pen: <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l1-4L16 5l3 3L8 19z" /></svg>,
}

const Btn = ({ children, onClick, disabled, kind = 'main' }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; kind?: 'main' | 'sos' | 'navy' | 'ghost' }) => {
  const c = { main: 'bg-brand text-white', sos: 'bg-sos text-white !shadow-lg', navy: 'bg-brand text-white', ghost: 'bg-[#dce5ef] text-[#4f5c6f]' }[kind]
  return <button disabled={disabled} onClick={onClick} className={`h-[54px] w-full rounded-[18px] text-base font-semibold transition active:scale-[.98] disabled:opacity-35 ${kind === 'ghost' ? '' : 'shadow-md'} ${c}`}>{children}</button>
}

const StatusBar = ({ onBack, canBack, dark }: { onBack: () => void; canBack: boolean; dark: boolean }) => (
  <div className={`relative z-[45] flex h-[46px] shrink-0 items-center justify-between px-4 pt-1 ${dark ? 'bg-[#12152a] text-white' : 'bg-bg text-navy'}`}>
    <div className="flex items-center gap-1">
      <span className="text-sm font-bold tracking-[-0.01em]">9:41</span>
    </div>
    <div className="flex items-center gap-1.5" aria-hidden>
      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 4.2a9.5 9.5 0 0 1 13 0M4 7a6 6 0 0 1 8 0" /><circle cx="8" cy="10" r="1.1" fill="currentColor" stroke="none" /></svg>
      <span className="flex items-center"><span className="flex h-[12px] w-[24px] items-center rounded-[4px] border border-current p-[1.5px] opacity-90"><span className="h-full w-[78%] rounded-[2px] bg-current" /></span><span className="ml-px h-[5px] w-[2px] rounded-r-sm bg-current opacity-60" /></span>
    </div>
  </div>
)

const Header = ({ title, onBack, step, right }: { title: string; onBack?: () => void; step?: string; right?: React.ReactNode }) => (
  <div className="sticky top-0 z-10 grid h-[58px] grid-cols-[84px_1fr_84px] items-center bg-bg/95 px-3 backdrop-blur-[14px]">
    <div>{onBack && <button onClick={onBack} aria-label="뒤로" className="flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-navy/5"><img src="/assets/chev-left.svg" alt="" className="h-6 w-6" /></button>}</div>
    <h1 className="truncate text-center text-base font-bold">{title}</h1>
    <div className="flex justify-end">{right}{step && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">{step}</span>}</div>
  </div>
)

const PHOTOS: Record<string, string> = {
  sink: '1629078692818-c5a0443f4ae3', leak: '1629375701431-01e6d1415dc9', rust: '1562069028-92f10e37ac9d', drain: '1611066415697-7f58dc0a5d10',
  toilet: '1676056376198-ce426e8c7943', mold: '1720087448033-db1904db294b', boilerHot: '1781771760142-1b04201fa6d8', boilerErr: '1694401460964-5888971043f9',
  gas: '1646592491489-ebdf758b9d11', elec: '1621581667749-6f2e075232cd', flicker: '1686959248919-550a8c6c67e2', washDrain: '1626806787461-102c1bfaaea1', fridge: '1732044790214-2930623d3edc',
}

const TILE_BG = ['#EAF2FF', '#E3F2FD', '#E6F4EA', '#FFF3E0', '#F3E8FF', '#FDEBF0']

function Photo({ id, className = '' }: { id?: string; className?: string }) {
  const is = ISSUES.find((i) => i.id === id)
  const h = [...(id || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0)
  const bg = TILE_BG[h % TILE_BG.length]
  const u = id ? PHOTOS[id] : undefined
  if (u) return <img src={`https://images.unsplash.com/photo-${u}?w=600&h=600&fit=crop&auto=format&q=70`} alt={is?.name || '문제 사진'} loading="lazy" className={`object-cover ${className}`} style={{ background: bg }} />
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="img" aria-label={is?.name || '문제'} className={className} style={{ background: bg }}>
      <circle cx="50" cy="50" r="31" fill="white" opacity=".75" />
      <text x="50" y="52" fontSize="38" textAnchor="middle" dominantBaseline="central">{is?.emoji || '✏️'}</text>
    </svg>
  )
}

const kindOf = (t: string) =>
  /차단기|분전반/.test(t) ? 'breaker' : /밸브/.test(t) ? 'valve' : /창문|환기/.test(t) ? 'window' : /수건|대야|물기|번지/.test(t) ? 'towel'
  : /전기|멀티탭|콘센트|스위치|불꽃|젖은 손|만지지|거리/.test(t) ? 'plug' : /연락|신고|전화|알려|알리/.test(t) ? 'phone' : /변기/.test(t) ? 'toilet'
  : /호스|너트|연결부|패킹|조여|교체/.test(t) ? 'wrench' : /보일러|압력|난방|분배기|온도|전원/.test(t) ? 'gauge' : /사진|촬영|기록|메모/.test(t) ? 'camera'
  : /곰팡이|제거제|청소|닦|필터|이물질|배수구|머리카락/.test(t) ? 'spray' : 'look'

const SHAPES: Record<string, React.ReactNode> = {
  valve: <><path d="M14 62H86M114 62H186M14 78H86M114 78H186" /><rect x="86" y="52" width="28" height="36" rx="4" /><path d="M100 52V36M78 36H122" /><path className="a" d="M132 34c8-16 30-14 32 4M164 38l-1-10M164 38l-10-2" /></>,
  towel: <><path d="M30 78q12-12 24 0t24 0t24 0t24 0t24 0" /><rect x="64" y="42" width="72" height="20" rx="5" /><path d="M78 42v20M92 42v20" /><path className="a" d="M100 10q9 12 0 20q-9-8 0-20z" /></>,
  plug: <><rect x="62" y="32" width="40" height="38" rx="9" /><path d="M76 32V16M88 32V16M82 70c0 18 30 14 44 14" /><circle className="a" cx="150" cy="44" r="18" /><path className="a" d="M137 57l26-26" /></>,
  breaker: <><rect x="66" y="10" width="68" height="80" rx="7" /><rect x="90" y="26" width="20" height="44" rx="5" /><circle className="a" cx="100" cy="36" r="5" /><path className="a" d="M156 36v28M149 57l7 7l7-7" /></>,
  window: <><rect x="56" y="10" width="88" height="80" rx="4" /><path d="M100 10v80" /><path className="a" d="M100 10l50 12v56l-50 12" /><path className="a" d="M20 44h20M14 58h30" /></>,
  phone: <><rect x="78" y="8" width="44" height="84" rx="9" /><path d="M94 18h12M100 80h.1" /><path className="a" d="M136 36q10 14 0 28M148 28q16 22 0 44" /></>,
  toilet: <><rect x="68" y="12" width="64" height="26" rx="5" /><path d="M70 46h60q0 30-30 30q-30 0-30-30zM86 76l-4 12h36l-4-12" /><circle className="a" cx="100" cy="25" r="4" /><path className="a" d="M146 62q7-7 14 0t14 0" /></>,
  wrench: <><path d="M100 20l24 14v28l-24 14l-24-14V34z" /><circle cx="100" cy="48" r="10" /><path className="a" d="M148 28a30 30 0 0 1 6 32M154 60l-9-5M154 60l5-9" /></>,
  gauge: <><circle cx="100" cy="52" r="34" /><path d="M72 76h56M100 22v6M70 36l5 4M130 36l-5 4" /><path className="a" d="M100 52l22-18" /><circle className="a" cx="100" cy="52" r="3" /></>,
  camera: <><rect x="54" y="30" width="92" height="56" rx="10" /><path d="M82 30l6-10h24l6 10" /><circle cx="100" cy="58" r="17" /><circle className="a" cx="130" cy="43" r="3" /><path className="a" d="M36 24V12h12M164 12h12v12" /></>,
  spray: <><rect x="68" y="38" width="38" height="50" rx="7" /><rect x="78" y="24" width="18" height="14" rx="3" /><path d="M78 22H64l-4 7" /><path className="a" d="M44 22h-.1M36 30h-.1M44 38h-.1M52 30h-.1M30 20l4-4" /></>,
  look: <><circle cx="92" cy="46" r="26" /><path d="M80 46l8 8l16-16" /><path className="a" d="M112 66l26 24" /></>,
}

function Draw({ text }: { text: string }) {
  return (
    <div className="flex justify-center rounded-xl bg-brand-soft/70 py-3">
      <svg viewBox="0 0 200 100" className="h-24 w-48 fill-none stroke-navy [&_.a]:stroke-brand" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{SHAPES[kindOf(text)]}</svg>
    </div>
  )
}

const Reveal = ({ open, children }: { open: boolean; children: React.ReactNode }) => (
  <div className={`grid transition-all duration-300 ${open ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden">{children}</div></div>
)

function IssueTop({ is }: { is: Issue }) {
  const baseN = 4 + ([...is.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 19)
  const [watch, setWatch] = useState(baseN)
  useEffect(() => {
    setWatch(baseN)
    const t = setInterval(() => setWatch((w) => Math.max(2, w + (Math.random() < 0.5 ? -1 : 1))), 4000)
    return () => clearInterval(t)
  }, [baseN])
  const solved = is.cases.reduce((a, c) => a + c[3], 0)
  const level = is.urgency === '낮음' ? '쉬움' : is.urgency === '보통' ? '보통' : '주의'
  const way = is.owner.includes('즉시') ? '즉시 신고' : is.owner.startsWith('직접') ? '직접 해결' : '집주인 연락'
  const stats = [['예상 시간', is.time.replace(/\(.*\)/, '').trim()], ['난이도', level], ['해결 방식', way]]
  return (
    <div>
      <div className="rounded-[26px] bg-gradient-to-br from-[#3478f6] to-[#5b9bff] px-5 pb-12 pt-5 text-white">
        <p className="text-xs font-semibold opacity-90">{solved.toLocaleString()}명이 이 문제를 해결했어요</p>
        <h1 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.04em]">{is.name}</h1>
        <p className="mt-2 text-sm leading-[22px] opacity-90">{is.cause}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs opacity-80"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7dffb0]" />지금 {watch}명이 보는 중</div>
      </div>
      <div className="relative -mt-8 grid grid-cols-3 divide-x divide-[#e8ecf2] rounded-[22px] border border-[#e8ecf2] bg-white py-4 shadow-[0_7px_11px_rgba(36,63,103,.06)]">
        {stats.map(([k, v]) => <div key={k} className="px-2 text-center"><div className="text-xs text-[#8a95a4]">{k}</div><div className="mt-1 text-base font-bold">{v}</div></div>)}
      </div>
    </div>
  )
}

const CAT_PATH: Record<string, string> = {
  '화장실': 'M6 4h8v6M5 10h14a0 0 0 0 1 0 0c0 5-3 7-7 7s-7-2-7-7zM9 17l-1 3h8l-1-3',
  '보일러': 'M12 3c1 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z',
  '수도·수질': 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  '세탁기': 'M5 3h14v18H5zM5 8h14M12 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  '전기·조명': 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11c.7.6 1 1.3 1 2h4c0-.7.3-1.4 1-2a6 6 0 0 0-3-11z',
  '냉장고': 'M6 3h12v18H6zM6 10h12M9 6v1M9 13v3',
  '해충': 'M12 8a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3zM9 6l2 2M15 6l-2 2M6 11l3 1M18 11l-3 1M6 17l3-1M18 17l-3-1',
  '곰팡이': 'M4 14a8 6 0 0 1 16 0zM10 14v5h4v-5',
  '쓰레기': 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v6M14 11v6',
}
const CatIcon = ({ id }: { id: string }) => <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={CAT_PATH[id]} /></svg>

const CAT_TONE = ['bg-[#e6f0ff] text-[#3478f6]', 'bg-[#ffece6] text-[#e8683a]', 'bg-[#e3f6f4] text-[#14a39a]', 'bg-[#efe9ff] text-[#7a52e0]', 'bg-[#fff4d9] text-[#d99a0b]', 'bg-[#e3f1ff] text-[#2a8bd6]', 'bg-[#ffe8ec] text-[#e0455f]', 'bg-[#e6f6e6] text-[#3a9a46]', 'bg-[#eceff3] text-[#5d6878]']
const CAT_FILTERS: Record<string, [string, (i: Issue) => boolean][]> = {
  화장실: [['냄새', (i) => /냄새/.test(i.name)], ['역류·막힘', (i) => /역류|막힘/.test(i.name + i.cause)]],
  보일러: [['온수', (i) => /온수/.test(i.name)], ['난방', (i) => /난방/.test(i.name)], ['가스', (i) => /가스/.test(i.name)]],
  '수도·수질': [['누수', (i) => /새/.test(i.name)], ['수질', (i) => /누렇/.test(i.name)]],
  해충: [['바퀴벌레', (i) => /바퀴/.test(i.name)], ['초파리', (i) => /초파리/.test(i.name)]],
}

const Tag = ({ t }: { t: string }) => <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">#{t}</span>

const NAVICON: Record<string, string> = { home: '79917', lib: '552b3', community: '142dd', me: '72ec0' }

export default function App() {
  const [booting, setBooting] = useState(true)
  useEffect(() => { const t = setTimeout(() => setBooting(false), 2400); return () => clearTimeout(t) }, [])
  const [stack, setStack] = useState<View[]>([{ n: 'home' }])
  const view = stack[stack.length - 1]
  const [text, setText] = useState('')
  const [source, setSource] = useState<'photo' | 'voice' | 'text'>('text')
  const [issueId, setIssueId] = useState('sink')
  const [photo, setPhoto] = useState<{ url?: string; sample?: number } | null>(null)
  const [recording, setRecording] = useState(false)
  const [secs, setSecs] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [voiceIdx, setVoiceIdx] = useState(0)
  const [loadStep, setLoadStep] = useState(0)
  const [recent, setRecent] = useState<string[]>(['sink', 'mold'])
  const [markedBooks, setMarkedBooks] = useState<string[]>(['sink', 'mold', 'toilet', 'boilerHot'])
  const [liked, setLiked] = useState<string[]>([])
  const [comments, setComments] = useState<Record<string, Comment[]>>(COMMENTS0)
  const [cText, setCText] = useState('')
  const [cKind, setCKind] = useState<'empathy' | 'opinion'>('empathy')
  const [reportFor, setReportFor] = useState('')
  const [reported, setReported] = useState<string[]>([])
  const [sort, setSort] = useState<'pop' | 'new' | 'help' | 'cmt'>('pop')
  const [history, setHistory] = useState([{ k: 1, id: 'sink', days: 21, done: true }, { k: 2, id: 'mold', days: 9, done: false }, { k: 3, id: 'toilet', days: 45, done: true }])
  const [q, setQ] = useState('')
  const [heardN, setHeardN] = useState(0)
  const [pq, setPq] = useState('')
  const [lq, setLq] = useState('')
  const [lopen, setLopen] = useState(false)
  const [catF, setCatF] = useState('')
  const [sortOpen, setSortOpen] = useState(false)
  const [planSel, setPlanSel] = useState('')
  const [saved, setSaved] = useState<string[]>([])
  const [landlord, setLandlord] = useState({ name: '박OO 집주인', phone: '010-1234-5678' })
  const [housing, setHousing] = useState('원룸')
  const [address, setAddress] = useState('서울 동작구 상도동')
  const [posts, setPosts] = useState<Post[]>(POSTS0)
  const [tagFilter, setTagFilter] = useState('')
  const [bookFilter, setBookFilter] = useState('')
  const [mapSel, setMapSel] = useState('')
  const [mapMode, setMapMode] = useState<'map' | 'list'>('map')
  const [mapCat, setMapCat] = useState('')
  const [wTags, setWTags] = useState<string[]>([])
  const [wText, setWText] = useState('')
  const [wTitle, setWTitle] = useState('')
  const [wPhoto, setWPhoto] = useState('')
  const [wTagList, setWTagList] = useState<string[]>([])
  const [wTagIn, setWTagIn] = useState('')
  const [toast, setToast] = useState('')
  const scroller = useRef<HTMLDivElement>(null)

  const top = () => scroller.current?.scrollTo(0, 0)
  const go = (v: View) => { setStack((s) => [...s, v]); top() }
  const back = () => { setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)); top() }
  const reset = (...v: View[]) => { setStack(v); top() }
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }
  const openIssue = (id: string) => { setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 5)); go({ n: 'issue', id }) }
  const toggleSave = (k: string) => setSaved((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))

  useEffect(() => {
    if (!recording) return
    const t = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [recording])
  useEffect(() => {
    if (!recording) return
    setHeardN(0)
    const n = VOICE_SAMPLES[voiceIdx % VOICE_SAMPLES.length].split(' ').length
    const t = setInterval(() => setHeardN((h) => Math.min(n, h + 1)), 650)
    return () => clearInterval(t)
  }, [recording])

  const analyze = (src: 'photo' | 'voice' | 'text', input: string) => {
    setSource(src); setIssueId(classify(input).id); go({ n: 'loading' })
  }
  const issue = byId(issueId)
  const allPosts = [...posts, ...ISSUES.flatMap((i) => postsFor(i, []))]
  const findPost = (id: string) => allPosts.find((p) => String(p.id) === id)
  const cn = (p: Post) => (comments[String(p.id)] || []).length
  const likeN = (p: Post) => p.likes + (liked.includes(String(p.id)) ? 1 : 0)
  const score = (p: Post) => likeN(p) + cn(p) * 3 + (p.views ?? 0) / 20
  const top3 = [...posts].sort((a, b) => score(b) - score(a)).slice(0, 3)
  const rankOf = (p: Post) => top3.findIndex((x) => x.id === p.id) + 1
  const toggleLike = (id: string | number) => setLiked((l) => (l.includes(String(id)) ? l.filter((x) => x !== String(id)) : [...l, String(id)]))
  const qn = q.replace(/\s/g, '')
  const qKws = qn ? extractKeywords(q) : []
  const qGuess = qn ? classify(q) : null
  const qGuessOk = !!qGuess && qGuess.id !== 'etc' && qKws.length > 0
  const qRec = qn
    ? [...(qGuessOk ? [qGuess!] : []), ...ISSUES.filter((i) => i.id !== 'etc' && (qGuessOk ? i.cat === qGuess!.cat : false)), ...ISSUES.filter((i) => i.id !== 'etc' && (i.name + i.cause).replace(/\s/g, '').includes(qn))]
        .filter((i, k, a) => a.findIndex((x) => x.id === i.id) === k).slice(0, 5)
    : []
  const qIds = qRec.map((i) => i.id)
  const qMatch = (p: Post) => p.text.replace(/\s/g, '').includes(qn) || p.tags.some((t) => qn.includes(t) || t.includes(qn)) || (!!p.issue && (qIds.includes(p.issue) || qKws.some((k) => byId(p.issue!).name.includes(k.word))))
  const base = qn ? allPosts.filter(qMatch) : bookFilter ? postsFor(byId(bookFilter), posts) : posts.filter((p) => !tagFilter || postCat(p) === tagFilter)
  const shown = [...base].sort(sort === 'new' ? (a, b) => (a.ago ?? 0) - (b.ago ?? 0) : sort === 'help' ? (a, b) => likeN(b) - likeN(a) : sort === 'cmt' ? (a, b) => cn(b) - cn(a) : (a, b) => score(b) - score(a))
  const addComment = (pid: string) => {
    if (!cText.trim()) return
    setComments((c) => ({ ...c, [pid]: [...(c[pid] || []), { id: Date.now(), author: '서*윤', kind: cKind, text: cText.trim(), ago: 0 }] }))
    setCText(''); flash(cKind === 'empathy' ? '공감을 남겼어요' : '의견을 남겼어요')
  }
  const postCard = (p: Post, wide = false) => {
    const k = String(p.id)
    const m = p.text.match(/^(.+?[.!?])\s+(.+)$/)
    const title = p.title || (m ? m[1] : p.text)
    const body = p.title ? p.text : m ? m[2] : ''
    const nm = p.author.replace('*', '')
    return (
      <div key={k} role="button" tabIndex={0} onClick={() => go({ n: 'post', id: k })} className={`flex flex-col rounded-[22px] border border-[#e8ecf2] bg-white p-4 text-left shadow-[0_7px_11px_rgba(36,63,103,.06)] active:scale-[.99] ${wide ? 'w-[82%] shrink-0 snap-start' : ''}`}>
        <div className="flex items-center">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-[#dfedfa] text-xs font-semibold text-[#356da8]">{nm.slice(0, 1)}</span>
          <div className="min-w-0 flex-1 pl-[9px]"><div className="text-xs font-bold leading-6">{nm}***</div><div className="text-xs leading-5 text-[#9ba3af]">{anon(p.author).split(' · ')[1]} · {agoText(p.ago ?? 0)}</div></div>
          {p.issue && <Photo id={p.issue} className="ml-3 h-12 w-12 shrink-0 rounded-lg" />}
        </div>
        <h3 className="pt-3.5 text-lg font-semibold leading-[26px] tracking-[-0.02em] line-clamp-2">{title}</h3>
        {body && <p className="line-clamp-2 pt-[7px] text-sm leading-[21.7px] text-[#657083]">{body}</p>}
        <div className="flex flex-wrap gap-[5px] pt-[13px]">{p.tags.map((t) => <span key={t} className="rounded-lg bg-[#f2f5f8] px-[7px] py-[3px] text-xs text-[#6b7b91]">#{t}</span>)}</div>
        <div className="mt-[13px] flex items-center gap-[14px] border-t border-[#eff1f5] pt-2.5 text-xs text-[#9199a6]">
          <button onClick={(e) => { e.stopPropagation(); toggleLike(p.id) }} className={liked.includes(k) ? 'font-bold text-brand' : ''} aria-label="좋아요">도움돼요 {likeN(p)}</button>
          <button onClick={(e) => { e.stopPropagation(); go({ n: 'post', id: k }) }} aria-label="댓글">댓글 {cn(p)}</button>
          <button onClick={(e) => { e.stopPropagation(); toggleSave(k); flash(saved.includes(k) ? '저장을 취소했어요' : '내 정보에 저장했어요') }} className={`ml-auto ${saved.includes(k) ? 'font-bold text-brand' : ''}`} aria-label="저장하기">{saved.includes(k) ? '저장됨' : '저장하기'}</button>
        </div>
      </div>
    )
  }


  useEffect(() => {
    if (view.n !== 'loading') return
    setLoadStep(0)
    const a = setTimeout(() => setLoadStep(1), 900)
    const b = setTimeout(() => setLoadStep(2), 1800)
    const c = setTimeout(() => proceed(), 2700)
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c) }
  }, [view.n])

  const proceed = () => {
    setHistory((h) => { const old = h.find((x) => x.id === issue.id); return [old ? { ...old, days: 0 } : { k: Date.now(), id: issue.id, days: 0, done: false }, ...h.filter((x) => x.id !== issue.id)] })
    setRecent((r) => [issue.id, ...r.filter((x) => x !== issue.id)].slice(0, 5))
    reset({ n: 'home' }, { n: 'issue', id: issue.id })
  }

  const resetInputs = () => { setText(''); setPhoto(null); setTranscript(''); setRecording(false); setSecs(0) }
  const tabs = [
    ['home', '홈', '🏠', () => { resetInputs(); reset({ n: 'home' }) }],
    ['lib', '사례', '📖', () => reset({ n: 'lib' })],
    ['community', '커뮤니티', '💬', () => { setBookFilter(''); reset({ n: 'community' }) }],
    ['me', '마이', '👤', () => reset({ n: 'me' })],
  ] as const
  const tabOf = (v: View) => (v.n === 'cat' || v.n === 'issue' || v.n === 'lib' || v.n === 'book' || v.n === 'nearby' || v.n === 'plan' ? 'lib' : v.n === 'write' || v.n === 'map' || v.n === 'post' ? 'community' : ['photo', 'voice', 'text', 'loading', 'result'].includes(v.n) ? 'home' : v.n === 'msg' ? 'lib' : v.n)

  const IssueRow = ({ is, onClick }: { is: Issue; onClick: () => void }) => (
    <button onClick={onClick} className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-left active:scale-[.99]">
      <span className="text-2xl">{is.emoji}</span>
      <span className="flex-1 text-[15px] font-bold">{is.name}</span>
      
      <span className="text-navy/30">›</span>
    </button>
  )

  return (
    <div className="flex min-h-screen justify-center">
      <div className={`relative flex h-screen w-full max-w-[430px] flex-col overflow-hidden shadow-xl bg-bg`}>
        <StatusBar dark={view.n === 'photo'} canBack={stack.length > 1} onBack={back} />
        <div ref={scroller} className="flex-1 overflow-y-auto">
          {view.n === 'home' && (
            <div className="fadeup min-h-full px-5 pb-8 pt-5">
              <div className="flex items-start justify-between px-[3px] pb-5 pt-1">
                <h1 className="pt-[7px] text-[28px] font-bold leading-10 tracking-[-0.04em]">서윤님의<br /><span className="font-semibold text-[#8a93a3]">생활 해결 책장</span></h1>
                <button onClick={() => tabs[3][3]()} aria-label={`내 정보 (${housing})`} className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white shadow-[0_7px_9.5px_rgba(43,64,96,.1)]"><img src="/assets/53c7d.svg" alt="" className="h-6 w-6" /></button>
              </div>

              <h2 className="mb-3 mt-2 text-xl font-semibold tracking-[-0.01em]">무슨 문제가 생겼나요?</h2>
              <button onClick={() => { resetInputs(); go({ n: 'photo' }) }} className="flex w-full items-center gap-4 rounded-[22px] bg-brand p-5 text-left text-white shadow-md active:scale-[.98]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white/20 [&>svg]:h-6 [&>svg]:w-6">{I.camera}</span>
                <span className="flex-1 text-lg font-semibold">사진으로 보여주기</span><span className="text-2xl opacity-60">›</span>
              </button>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {([['voice', I.mic, '말로 알려주기'], ['text', I.pen, '직접 입력하기']] as const).map(([k, ic, l]) => (
                  <button key={k} onClick={() => { resetInputs(); go({ n: k }) }} className="flex h-[104px] flex-col justify-between rounded-[22px] bg-white p-4 text-left text-base font-semibold shadow-[0_7px_10px_rgba(36,63,103,.05)] active:scale-[.97]">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-brand-soft text-brand [&>svg]:h-5 [&>svg]:w-5">{ic}</span>{l}
                  </button>
                ))}
              </div>

              <section className="-mx-5 mt-7 rounded-3xl border border-[#dce5ef] bg-[#f6f9ff] pb-5 pt-5">
                <div className="flex items-center justify-between px-[23px] pb-3"><h3 className="text-xl font-semibold tracking-[-0.01em]">최근 확인한 문제</h3>
                  <button onClick={() => reset({ n: 'lib' })} className="py-1.5 text-sm font-medium text-[#64758d]">전체 보기</button></div>
                <div className="flex gap-[10px] overflow-x-auto px-[23px] pb-1">
                  {recent.slice(0, 6).map((id) => (
                    <button key={id} onClick={() => openIssue(id)} className="relative h-44 w-[132px] shrink-0 overflow-hidden rounded-b-[7px] rounded-t-xl border border-[#d8e2ed] bg-[#dfe7f0] text-left shadow-[0_3px_8px_rgba(42,61,86,.1)] active:scale-[.97]">
                      <Photo id={id} className="absolute inset-0 h-full w-full" />
                      <span className="absolute inset-x-0 bottom-0 h-[119px] bg-gradient-to-b from-[rgba(6,12,20,0)] via-[rgba(6,12,20,.45)] via-35% to-[rgba(4,9,16,.9)]" />
                      <span className="absolute bottom-4 left-[15px] right-2 text-base font-semibold leading-6 text-white">{byId(id).name}</span>
                    </button>
                  ))}
                </div>
                <div className="mx-[15px] mt-2 h-1.5 rounded-b-md bg-[#d5e0eb]" />
              </section>

              <section className="mt-8">
                <div className="flex items-center justify-between pb-3"><h3 className="text-xl font-semibold tracking-[-0.01em]">커뮤니티 인기글</h3>
                  <button onClick={() => { setBookFilter(''); reset({ n: 'community' }) }} className="py-1.5 text-sm font-medium text-[#64758d]">더보기</button></div>
                <div className="space-y-3">{[...posts].sort((a, b) => score(b) - score(a)).slice(0, 3).map((p) => postCard(p))}</div>
              </section>
            </div>
          )}

          {view.n === 'voice' && (
            <div className="fadeup">
              <Header title="말로 알려주기" onBack={back} step="1/3" />
              <div className="flex flex-col items-center px-5 pt-8">
                {!transcript ? (<>
                  <p className="text-lg font-bold">{recording ? '듣고 있어요…' : '버튼을 누르고 말해보세요'}</p>
                  <p className="mt-1 text-sm text-navy/60">{recording ? `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')} · 다 말했으면 다시 눌러주세요` : '예: "싱크대 밑에서 물이 새요"'}</p>
                  <div className={`relative flex items-center justify-center ${recording ? 'mt-6 h-36 w-36' : 'mt-12 h-48 w-48'}`}>
                    {recording && <span className="absolute inset-0 rounded-full bg-brand" style={{ animation: 'pulse-ring 1.4s infinite' }} />}
                    <button aria-label={recording ? '녹음 종료' : '녹음 시작'} onClick={() => {
                      if (!recording) { setSecs(0); setRecording(true) } else { setRecording(false); setTranscript(VOICE_SAMPLES[voiceIdx % VOICE_SAMPLES.length]); setVoiceIdx(voiceIdx + 1) }
                    }} className={`relative flex items-center justify-center rounded-full text-white shadow-lg active:scale-95 ${recording ? 'h-28 w-28' : 'h-40 w-40'} ${recording ? 'bg-navy' : 'bg-brand'}`}>
                      {recording ? <span className="h-12 w-12 rounded-lg bg-white" /> : <span className="scale-[2]">{I.mic}</span>}
                    </button>
                  </div>
                  {recording && (() => {
                    const heard = VOICE_SAMPLES[voiceIdx % VOICE_SAMPLES.length].split(' ').slice(0, heardN).join(' ')
                    const hk = extractKeywords(heard)
                    return (
                      <div className="fadeup mt-6 w-full space-y-3">
                        <div className="flex h-10 items-center justify-center gap-1" aria-hidden>{Array.from({ length: 17 }).map((_, k) => <span key={k} className="h-8 w-1 origin-center rounded-full bg-brand" style={{ animation: `wave ${0.7 + (k % 5) * 0.12}s ease-in-out ${k * 0.05}s infinite` }} />)}</div>
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-brand"><span className="h-2 w-2 animate-pulse rounded-full bg-sos" />잘 듣고 있어요</div>
                          <p className="mt-2 min-h-[56px] text-xl font-bold leading-snug">{heard ? heard.split(KEYWORD_RE).map((t, k) => (k % 2 ? <mark key={k} className="rounded bg-brand/20 px-0.5">{t}</mark> : t)) : <span className="text-navy/30">말씀해보세요…</span>}<span className="ml-0.5 inline-block w-0.5 animate-pulse bg-brand">&nbsp;</span></p>
                          <div className="mt-2 flex min-h-8 flex-wrap gap-1.5">{hk.map((k) => <span key={k.word} className="fadeup rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white"><span className="mr-1 text-[10px] opacity-70">{KEYWORD_LABEL[k.type]}</span>✓ {k.word}</span>)}</div>
                        </div>
                      </div>
                    )
                  })()}
                </>) : (
                  <div className="w-full space-y-4">
                    <div className="text-sm font-bold text-navy/50">이렇게 들었어요</div>
                    <div className="rounded-2xl bg-brand-soft p-5 text-xl font-bold leading-snug">“{transcript}”</div>
                    <Btn onClick={() => analyze('voice', transcript)}>이 내용으로 분석하기</Btn>
                    <Btn kind="ghost" onClick={() => { setTranscript(''); setSecs(0) }}>다시 말하기</Btn>
                  </div>
                )}
              </div>
            </div>
          )}

          {view.n === 'text' && (() => {
            const kws = extractKeywords(text)
            const guess = kws.length ? classify(text) : null
            const tone = { place: 'bg-brand-soft text-brand', thing: 'bg-navy text-white', symptom: 'bg-sos-soft text-sos' }
            return (
              <div className="fadeup">
                <Header title="직접 입력하기" onBack={back} step="1/3" />
                <div className="space-y-4 px-5 pt-4">
                  <div className="relative h-52 rounded-2xl bg-white">
                    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words rounded-2xl border-2 border-transparent p-5 text-lg text-transparent">
                      {text.split(KEYWORD_RE).map((t, k) => (k % 2 ? <mark key={k} className="rounded bg-brand/20 text-transparent">{t}</mark> : t))}
                    </div>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} autoFocus placeholder="예: 화장실 변기에서 물이 계속 올라와요." className="absolute inset-0 h-full w-full resize-none rounded-2xl border-2 border-line bg-transparent p-5 text-lg outline-none focus:border-brand" />
                  </div>
                  <div className="min-h-[76px] rounded-2xl bg-white p-3 shadow-sm">
                    <div className="mb-2 flex items-center justify-between text-xs font-bold text-navy/50"><span>🔍 인식된 키워드</span>{guess && guess.id !== 'etc' && <span className="text-brand">예상 문제 · {guess.name}</span>}</div>
                    {kws.length ? <div className="flex flex-wrap gap-1.5">{kws.map((k) => <span key={k.word} className={`fadeup rounded-full px-3 py-1 text-sm font-bold ${tone[k.type]}`}><span className="mr-1 text-[10px] opacity-70">{KEYWORD_LABEL[k.type]}</span>{k.word}</span>)}</div> : <p className="text-sm text-navy/40">쓰는 동안 장소·대상·증상 키워드를 찾아드려요.</p>}
                  </div>
                  <p className="text-xs text-navy/50">어디에서, 어떤 일이 일어나는지 편하게 써주세요.</p>
                  <Btn disabled={!text.trim()} onClick={() => analyze('text', text)}>분석하기</Btn>
                </div>
              </div>
            )
          })()}

          {view.n === 'loading' && (
            <div className="flex h-[80vh] flex-col items-center justify-center px-8 text-center">
              <span className="mb-5 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">2/3</span>
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
              <h1 className="mt-8 text-2xl font-black">문제를 확인하고 있어요</h1>
              <p className="mt-2 text-navy/60">잠시만 기다려주세요.</p>
              <ul className="mt-8 space-y-2 text-sm">
                {[source === 'photo' ? '사진을 분석하고 있어요…' : source === 'voice' ? '말씀하신 내용을 이해하고 있어요…' : '입력한 내용을 읽고 있어요…', '비슷한 사례를 찾고 있어요…', '긴급한 상황인지 확인 중이에요…'].map((s, i) => (
                  <li key={s} className={`transition ${i <= loadStep ? 'opacity-100' : 'opacity-20'}`}>{i < loadStep ? '✓ ' : '• '}{s}</li>
                ))}
              </ul>
            </div>
          )}

          {view.n === 'result' && (
            <div className="fadeup px-5 pt-10 pb-6">
              <div className="flex items-center justify-between"><div className="text-sm font-bold text-navy/50">분석 결과</div><span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">3/3</span></div>
              <div className="mt-4 flex h-28 items-center justify-center rounded-2xl bg-brand-soft text-7xl">{issue.emoji}</div>
              <h1 className="mt-1 text-[28px] font-black leading-tight">{`${issue.name.replace(/요$/, '')} 문제로 확인했어요.`}</h1>
              <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl bg-white">
                {[['문제 분류', `${issue.cat} · ${issue.name}`], ['예상 긴급도', issue.urgency], ['설명', `${issue.cause} 가능성이 있어요.`], ['추천 다음 단계', `비슷한 사례를 보고 ${issue.owner.split(',')[0]} 여부를 정해보세요.`]].map(([k, v]) => (
                  <div key={k} className="p-4"><div className="text-xs font-bold text-navy/50">{k}</div>
                    <div className={k === '예상 긴급도' ? `mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-bold ${'bg-brand-soft text-brand'}` : 'mt-0.5 text-[15px] leading-relaxed'}>{v}</div></div>
                ))}
              </div>
              <div className={`mt-5 rounded-2xl p-4 text-sm font-bold bg-brand text-white`}>
                ✅ 해결 사례로 이동합니다…
                <div className="mt-2 h-1 overflow-hidden rounded bg-white/25"><div className="h-full bg-white" style={{ animation: `bar 4.5s linear forwards` }} /></div>
              </div>
              <div className="mt-4"><Btn onClick={proceed}>해결 사례 보기</Btn></div>
            </div>
          )}

          {view.n === 'lib' && (
            <div className="fadeup">
              <Header title="문제별 사례" right={<button aria-label="검색" onClick={() => { setLopen(!lopen); if (lopen) setLq('') }} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-navy/5"><img src="/assets/ba4e9.svg" alt="" className="h-6 w-6" /></button>} />
              <div className="px-5 pb-8 pt-1">
                {(lopen || lq) && (<div className="relative mt-3">
                  <img src="/assets/ba4e9.svg" alt="" className="pointer-events-none absolute left-[15px] top-1/2 h-6 w-6 -translate-y-1/2" />
                  <input value={lq} onChange={(e) => setLq(e.target.value)} placeholder="겪고 있는 문제를 검색해보세요" aria-label="해결 사례 검색" className="h-[52px] w-full rounded-[17px] border border-[#dce4ee] bg-white pl-[49px] pr-10 text-sm shadow-[0_5px_8px_rgba(36,63,103,.05)] outline-none placeholder:text-[#9ba5b3] focus:border-brand focus:ring-2 focus:ring-brand/20" />
                  {lq && <button onClick={() => setLq('')} aria-label="지우기" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba5b3]">✕</button>}
                </div>
)}
                {(() => {
                  const open = (i: Issue) => openIssue(i.id)
                  const TextRow = ({ is }: { is: Issue }) => (
                    <button onClick={() => open(is)} className="flex w-full items-start gap-3 border-b border-[#eef1f5] py-3.5 text-left last:border-0 active:bg-[#f7f9fc]">
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-base font-semibold leading-6">{is.name}{markedBooks.includes(is.id) && <Bookmark className="h-4 w-4" />}</span>
                        <span className="mt-0.5 block text-sm leading-5 text-[#8a95a4]">{is.cat} · {is.cause}</span>
                      </span>
                      <span className="pt-0.5 text-lg text-[#b4bcc8]">›</span>
                    </button>
                  )
                  if (lq.trim()) {
                    const qs = lq.trim().replace(/\s/g, '')
                    const kws = extractKeywords(lq)
                    const hit = ISSUES.filter((i) => i.id !== 'etc' && ((i.name + i.cause + i.cat).replace(/\s/g, '').includes(qs) || kws.some((k) => i.name.includes(k.word))))
                    const g = classify(lq)
                    const ok = g.id !== 'etc' && kws.length > 0
                    const res = ok && !hit.some((i) => i.id === g.id) ? [g, ...hit] : hit.sort((x, y) => (y.id === g.id ? 1 : 0) - (x.id === g.id ? 1 : 0))
                    return (
                      <div className="fadeup mt-4">
                        <div className="rounded-[22px] border border-[#dce6f3] bg-[#edf4ff] p-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-brand"><span className="rounded-md bg-brand px-1.5 py-0.5 text-xs text-white">AI</span>입력한 글을 읽고 자동으로 찾았어요</div>
                          {kws.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{kws.map((k) => <span key={k.word} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-brand"><span className="mr-1 opacity-60">{KEYWORD_LABEL[k.type]}</span>{k.word}</span>)}</div>}
                          <p className="mt-2 text-sm font-semibold text-[#2b3a52]">{ok ? `“${g.name}” 문제로 예상돼요` : '장소나 증상을 조금 더 적어주세요'}</p>
                        </div>
                        <p className="px-1 pb-1 pt-4 text-xs font-semibold text-[#9ba3af]">검색 결과 {res.length}개</p>
                        <div className="rounded-[22px] border border-[#e8ecf2] bg-white px-4 shadow-[0_7px_11px_rgba(36,63,103,.06)]">
                          {res.map((i) => <TextRow key={i.id} is={i} />)}
                          {!res.length && <p className="py-10 text-center text-sm text-[#9ba3af]">비슷한 문제를 찾지 못했어요.</p>}
                        </div>
                      </div>
                    )
                  }
                  return (
                    <>
                      <p className="mt-3 text-xs font-semibold text-brand">문제별 사례</p>
                      <h1 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.04em]">어떤 문제가<br />생겼나요?</h1>
                      <p className="mt-3 text-sm leading-[22px] text-[#758092]">상황을 알려주면 비슷한 사례와 해결 순서를 보여드려요.</p>
                      <div className="mt-5 grid grid-cols-3 gap-2.5">
                        {([['photo', '카메라', '사진으로 찾기', I.camera, 'bg-brand text-white'], ['voice', '말로 설명', '음성으로 찾기', I.mic, 'bg-white text-navy'], ['text', '직접 입력', '글로 적기', I.pen, 'bg-white text-navy']] as const).map(([k, t, d, ic, c]) => (
                          <button key={k} onClick={() => { resetInputs(); go({ n: k }) }} className={`flex h-[112px] flex-col justify-between rounded-[22px] border border-[#e8ecf2] p-3.5 text-left shadow-[0_7px_11px_rgba(36,63,103,.06)] active:scale-[.97] ${c}`}>
                            <span className="[&>svg]:h-6 [&>svg]:w-6">{ic}</span>
                            <span><span className="block text-sm font-bold">{t}</span><span className="mt-0.5 block text-xs opacity-70">{d}</span></span>
                          </button>
                        ))}
                      </div>
                      <h2 className="mt-7 text-xl font-semibold tracking-[-0.02em]">카테고리</h2>
                      <p className="mt-0.5 text-sm font-medium text-[#7e8797]">직접 골라서 둘러볼 수 있어요</p>
                      <div className="mt-3 grid grid-cols-3 gap-2.5">
                        {CATEGORIES.map((c, n) => (
                          <button key={c.id} onClick={() => { setCatF(''); go({ n: 'cat', id: c.id }) }} className="flex h-[104px] flex-col items-center justify-center gap-2 rounded-[22px] border border-[#e8ecf2] bg-white shadow-[0_7px_11px_rgba(36,63,103,.06)] active:scale-[.97]">
                            <span className={`flex h-11 w-11 items-center justify-center rounded-[15px] ${CAT_TONE[n % CAT_TONE.length]}`}><CatIcon id={c.id} /></span>
                            <span className="text-xs font-semibold text-[#4f5c6f]">{c.id}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          {view.n === 'book' && (() => {
            const is = byId(view.id)
            const n = postsFor(is, posts).length
            return (
              <div className="fadeup">
                <Header title={is.cat} onBack={back} />
                <div className="px-5 pb-8 pt-2 text-center">
                  <button onClick={() => { setBookFilter(is.id); go({ n: 'community' }) }} aria-label="같은 문제 사례 커뮤니티 열기"
                    className="relative mx-auto flex h-80 w-56 flex-col justify-between overflow-hidden rounded-l-md rounded-r-2xl bg-brand p-6 pl-8 text-left text-white shadow-2xl shadow-brand/40 transition active:scale-[.98]">
                    <span className="absolute inset-y-0 left-0 w-3 bg-black/20" />
                    {markedBooks.includes(is.id) && <Bookmark className="absolute right-5 top-0 h-10 w-8" />}
                    <span className="text-xs font-bold opacity-80">{is.cat}</span>
                    <span><span className="block text-5xl">{is.emoji}</span><span className="mt-3 block text-[26px] font-black leading-tight">{is.name}</span></span>
                    <span className="text-xs font-bold">같은 문제 사례 {n}개 · 커뮤니티 ›</span>
                  </button>
                  <p className="mt-4 text-sm text-navy/60">표지를 누르면 같은 문제의 사례가 공유되는 커뮤니티로 이동해요.</p>
                  <button onClick={() => { setMarkedBooks((m) => (m.includes(is.id) ? m.filter((x) => x !== is.id) : [...m, is.id])); flash(markedBooks.includes(is.id) ? '북마크를 해제했어요' : '북마크했어요') }} className="mt-4 text-sm font-bold text-brand">{markedBooks.includes(is.id) ? '🔖 북마크 해제' : '🔖 이 책 북마크하기'}</button>
                  <div className="mt-4 space-y-2">
                    <Btn onClick={() => openIssue(is.id)}>해결 사례 보기</Btn>
                    <Btn kind="ghost" onClick={() => { setBookFilter(is.id); go({ n: 'community' }) }}>커뮤니티 사례 보기</Btn>
                  </div>
                </div>
              </div>
            )
          })()}

          {view.n === 'cat' && (() => {
            const list = ISSUES.filter((i) => i.cat === view.id)
            const fl = CAT_FILTERS[view.id] || [['직접 해결', (i: Issue) => i.owner.startsWith('직접')], ['연락 필요', (i: Issue) => !i.owner.startsWith('직접')]]
            const shown = list.filter((i) => !catF || fl.find((f) => f[0] === catF)?.[1](i))
            const open = (i: Issue) => openIssue(i.id)
            return (
              <div className="fadeup">
                <Header title={view.id} onBack={() => { setCatF(''); back() }} />
                <div className="px-5 pb-8 pt-3">
                  <h1 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.04em]">어떤 상황에 가까운가요?</h1>
                  <p className="mt-2 text-sm leading-[22px] text-[#758092]">비슷한 문제를 고르면 해결 순서를 알려드려요.</p>
                  <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
                    {[['', '전체'] as const, ...fl.map((f) => [f[0], f[0]] as const)].map(([k, l]) => (
                      <button key={l} onClick={() => setCatF(k)} className={`h-9 shrink-0 rounded-[18px] px-4 text-xs font-semibold active:scale-95 ${catF === k ? 'bg-navy text-white' : 'border border-[#e4e8ef] bg-white text-[#788292]'}`}>{l}</button>
                    ))}
                  </div>
                  <div className="mt-4 space-y-3">
                    {shown.map((i) => (
                      <button key={i.id} onClick={() => open(i)} className="flex min-h-[68px] w-full items-center justify-between gap-3 rounded-[22px] border border-[#e8ecf2] bg-white px-5 py-4 text-left shadow-[0_7px_11px_rgba(36,63,103,.06)] active:scale-[.99]">
                        <span className="flex items-center gap-2 text-base font-bold leading-6 tracking-[-0.02em]">{i.name}{markedBooks.includes(i.id) && <Bookmark className="h-4 w-4" />}</span>
                        <img src="/assets/ea344.svg" alt="" className="h-6 w-6 shrink-0 opacity-50" />
                      </button>
                    ))}
                    {!shown.length && <p className="py-10 text-center text-sm text-[#9ba3af]">해당하는 문제가 없어요.</p>}
                  </div>
                  <div className="mt-5 rounded-[22px] bg-[#eaf2ff] p-5">
                    <p className="text-base font-bold">내 문제와 조금 다른가요?</p>
                    <p className="mt-1 text-sm leading-[22px] text-[#758092]">사진이나 말로 설명하면 AI가 비슷한 사례를 찾아드려요.</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button onClick={() => { resetInputs(); go({ n: 'photo' }) }} className="h-11 rounded-[14px] bg-white text-sm font-semibold text-brand active:scale-95">사진으로 찾기</button>
                      <button onClick={() => { resetInputs(); go({ n: 'voice' }) }} className="h-11 rounded-[14px] bg-brand text-sm font-semibold text-white active:scale-95">말로 설명하기</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {view.n === 'issue' && (() => {
            const is = byId(view.id)
            const marked = markedBooks.includes(is.id)
            const iconBtn = 'flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-navy/5'
            return (
              <div className="fadeup">
                <Header title="" onBack={back} right={<><button aria-label="북마크" aria-pressed={marked} onClick={() => { setMarkedBooks((m) => (m.includes(is.id) ? m.filter((x) => x !== is.id) : [...m, is.id])); flash(marked ? '북마크를 해제했어요' : '북마크했어요') }} className={iconBtn}><Bookmark className={`h-6 w-6 ${marked ? '' : 'opacity-40'}`} /></button><button aria-label="닫기" onClick={() => reset({ n: 'lib' })} className={iconBtn + ' text-xl'}>✕</button></>} />
                <div className="space-y-6 px-5 pb-44 pt-2">
                  <IssueTop is={is} />
                  <Timeline is={is} />
                  <section>
                    <div className="mb-3 flex items-end justify-between px-1"><h2 className="text-xl font-semibold tracking-[-0.02em]">비슷한 상황의 이야기</h2><button onClick={() => { setBookFilter(is.id); go({ n: 'community' }) }} className="text-sm font-semibold text-brand">더 보기</button></div>
                    <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5">{postsFor(is, []).map((p) => postCard(p, true))}</div>
                  </section>
                </div>
                <div className="absolute inset-x-0 bottom-[84px] z-10 grid grid-cols-2 gap-2 bg-gradient-to-t from-bg via-bg/95 to-transparent px-5 pb-2 pt-6">
                  <button onClick={() => go({ n: 'nearby', id: is.id })} className="h-[54px] rounded-[15px] border border-[#dce4ee] bg-white text-sm font-semibold text-[#4f5c6f] active:scale-[.98]">근처 수리 업체 찾기</button>
                  <button onClick={() => go({ n: 'msg', id: is.id })} className="h-[54px] rounded-[15px] bg-brand text-sm font-semibold text-white shadow-[0_8px_9px_rgba(52,120,246,.25)] active:scale-[.98]">집주인에게 알리기</button>
                </div>
              </div>
            )
          })()}

          {view.n === 'nearby' && <NearbyView is={byId(view.id)} address={address} onBack={back} flash={flash} />}

          {view.n === 'plan' && (() => {
            const place = PLACES.find((p) => p.id === planSel)
            const pn = pq.replace(/\s/g, '')
            const pk = pn ? extractKeywords(pq) : []
            const pg = pn ? classify(pq) : null
            const pgOk = !!pg && pg.id !== 'etc' && pk.length > 0
            const sugg = pn ? [...(pgOk ? [pg!] : []), ...ISSUES.filter((i) => i.id !== 'etc' && (i.name + i.cause + i.cat).replace(/\s/g, '').includes(pn))].filter((i, k, a) => a.findIndex((x) => x.id === i.id) === k).slice(0, 6) : []
            const wordPlace = pn ? ([['화장실|욕실', 'bath'], ['주방|부엌|싱크', 'kitchen'], ['베란다|세탁', 'veranda'], ['침실|거실|천장', 'room'], ['현관', 'entry']] as const).find(([r]) => new RegExp(r).test(pq))?.[1] : undefined
            const pred = wordPlace || (sugg[0] ? PLACES.find((pl) => pl.issues.includes(sugg[0].id))?.id : undefined)
            const predPlace = PLACES.find((pl) => pl.id === pred)
            const hlId = pn && pred ? pred : planSel
            const room = (id: string) => `cursor-pointer transition ${hlId === id ? 'fill-brand-soft stroke-brand' : 'fill-white stroke-navy/50 hover:fill-brand-soft/50'}`
            const badge = (id: string, x: number, y: number) => (
              <g pointerEvents="none"><circle cx={x} cy={y} r="9" className={hlId === id ? 'fill-brand' : 'fill-navy/70'} /><text x={x} y={y + 3.5} textAnchor="middle" className="fill-white text-[10px] font-bold">{PLACES.find((p) => p.id === id)!.issues.length}</text></g>
            )
            const lbl = (t: string, x: number, y: number) => <text x={x} y={y} className="pointer-events-none fill-navy text-[11px] font-bold">{t}</text>
            const furn = 'pointer-events-none fill-none stroke-navy/40'
            return (
              <div className="fadeup">
                <Header title="우리 집 2D 지도" onBack={back} />
                <div className="px-5 pb-8 pt-2">
                  <div className="relative mb-3">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">🔍</span>
                    <input value={pq} onChange={(e) => setPq(e.target.value)} placeholder="키워드 검색 (예: 싱크대, 변기, 곰팡이)" aria-label="우리 집 키워드 검색" className="h-12 w-full rounded-2xl bg-white pl-11 pr-10 text-[15px] shadow-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-brand" />
                    {pq && <button onClick={() => setPq('')} aria-label="검색어 지우기" className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-navy/40">✕</button>}
                  </div>
                  {pn && (
                    <div className="fadeup mb-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand/20">
                      <div className="flex items-center gap-1.5 text-xs font-black text-brand"><span className="rounded-md bg-brand px-1.5 py-0.5 text-[10px] text-white">AI</span>입력을 보고 미리 예측했어요</div>
                      {pk.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{pk.map((k) => <span key={k.word} className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand"><span className="mr-1 text-[10px] opacity-60">{KEYWORD_LABEL[k.type]}</span>{k.word}</span>)}</div>}
                      {predPlace ? (
                        <div className="mt-3 flex items-center justify-between gap-2"><p className="text-sm font-bold">📍 <span className="text-brand">{predPlace.name}</span>에서 생긴 문제 같아요</p>
                          <button onClick={() => { setPlanSel(predPlace.id); setPq('') }} className="h-9 shrink-0 rounded-full bg-brand px-3 text-xs font-bold text-white">이 방 보기</button></div>
                      ) : <p className="mt-2 text-sm text-navy/50">예측할 수 있는 키워드를 찾지 못했어요. 장소나 물건 이름을 적어보세요.</p>}
                      {sugg.length > 0 && <>
                        <p className="mb-2 mt-3 text-xs font-bold text-navy/50">이런 문제를 찾고 있나요?</p>
                        <div className="grid grid-cols-3 gap-2">{sugg.map((i) => (
                          <button key={i.id} onClick={() => openIssue(i.id)} className="flex h-24 flex-col items-center justify-center gap-1 rounded-xl bg-bg px-1 text-center text-[12px] font-bold leading-tight active:scale-[.97]"><span className="text-2xl">{i.emoji}</span>{i.name}<span className="text-[10px] font-medium text-navy/40">{PLACES.find((pl) => pl.issues.includes(i.id))?.name}</span></button>
                        ))}</div>
                      </>}
                    </div>
                  )}
                  <p className="mb-2 text-sm text-navy/60">방을 눌러 그곳에서 생길 수 있는 문제를 확인해요.</p>
                  <div className="rounded-3xl bg-white p-3 shadow-sm">
                    <svg viewBox="0 0 300 320" className="w-full" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
                      <g role="button" aria-label="베란다·세탁실" onClick={() => setPlanSel('veranda')}><rect x="8" y="8" width="284" height="52" rx="6" className={room('veranda')} />{lbl('베란다·세탁실', 100, 38)}</g>
                      <g role="button" aria-label="방·거실" onClick={() => setPlanSel('room')}><rect x="8" y="60" width="176" height="196" rx="6" className={room('room')} />{lbl('방·거실', 18, 78)}</g>
                      <g role="button" aria-label="주방" onClick={() => setPlanSel('kitchen')}><rect x="184" y="60" width="108" height="100" rx="6" className={room('kitchen')} />{lbl('주방', 194, 78)}</g>
                      <g role="button" aria-label="화장실·욕실" onClick={() => setPlanSel('bath')}><rect x="184" y="160" width="108" height="96" rx="6" className={room('bath')} />{lbl('화장실·욕실', 194, 178)}</g>
                      <g role="button" aria-label="현관" onClick={() => setPlanSel('entry')}><rect x="8" y="256" width="284" height="56" rx="6" className={room('entry')} />{lbl('현관', 18, 276)}</g>
                      <rect x="18" y="18" width="34" height="30" rx="3" className={furn} /><circle cx="35" cy="33" r="9" className={furn} />
                      <rect x="20" y="130" width="76" height="104" rx="4" className={furn} /><rect x="28" y="138" width="26" height="16" rx="3" className={furn} /><rect x="62" y="138" width="26" height="16" rx="3" className={furn} />
                      <rect x="130" y="206" width="44" height="40" rx="3" className={furn} />
                      <rect x="196" y="90" width="86" height="20" rx="3" className={furn} /><rect x="204" y="94" width="24" height="12" rx="2" className={furn} /><circle cx="252" cy="100" r="5" className={furn} /><circle cx="268" cy="100" r="5" className={furn} /><rect x="196" y="126" width="26" height="26" rx="3" className={furn} />
                      <rect x="196" y="190" width="28" height="14" rx="3" className={furn} /><ellipse cx="210" cy="222" rx="12" ry="14" className={furn} /><rect x="244" y="190" width="38" height="52" rx="4" className={furn} /><circle cx="263" cy="204" r="4" className={furn} />
                      <path d="M120 256a30 30 0 0 1 30 30" className={furn} /><rect x="214" y="270" width="64" height="30" rx="3" className={furn} />
                      {badge('veranda', 276, 24)}{badge('room', 168, 76)}{badge('kitchen', 276, 76)}{badge('bath', 276, 176)}{badge('entry', 276, 272)}
                    </svg>
                  </div>
                  <div className="mt-4">
                    {pn ? null : place ? (
                      <div key={place.id} className="fadeup">
                        <h2 className="mb-2 text-lg font-black">{place.name}에서 생길 수 있는 문제</h2>
                        <div className="grid max-h-[250px] grid-cols-3 gap-2 overflow-y-auto pb-1">{place.issues.map((id) => byId(id)).map((i) => <button key={i.id} onClick={() => openIssue(i.id)} className="relative flex h-28 flex-col items-center justify-center gap-2 rounded-2xl bg-white px-2 text-center text-[13px] font-bold leading-tight shadow-sm active:scale-[.97]"><span className="text-3xl">{i.emoji}</span>{i.name}</button>)}</div>
                      </div>
                    ) : <p className="rounded-2xl bg-brand-soft p-4 text-sm font-medium text-brand">아직 선택한 방이 없어요. 위 지도에서 방을 눌러보세요.</p>}
                  </div>
                </div>
              </div>
            )
          })()}

          {view.n === 'msg' && <MsgView is={byId(view.id)} landlord={landlord} onBack={back} onDone={() => { flash('전송했어요 (시연)'); back() }} />}

          {view.n === 'map' && (() => {
            const pins = MAP_PINS.filter((p) => !mapCat || byId(p.issue).cat === mapCat)
            const sel = MAP_PINS.find((p) => p.issue === mapSel)
            const cnt = (id: string) => postsFor(byId(id), posts).length
            return (
              <div className="fadeup flex h-[calc(100vh-68px)] flex-col">
                <div className="relative min-h-0 flex-1 overflow-hidden bg-[#eceefb]">
                  {mapMode === 'map' ? (<>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                      <rect width="100" height="100" fill="#eceefb" />
                      {[[4, 28, 20, 18], [34, 28, 26, 18], [66, 28, 30, 22], [4, 58, 24, 16], [34, 58, 34, 14], [72, 56, 24, 22], [4, 82, 40, 14], [52, 82, 44, 14], [8, 4, 30, 18], [44, 4, 44, 18]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#f8f8fc" />)}
                      <path d="M0 25 H100 M0 55 H100 M0 79 H100 M31 0 V100 M63 0 V100" stroke="#fff" strokeWidth="2.4" fill="none" />
                      <path d="M0 90 L100 40" stroke="#c9ceff" strokeWidth="2" fill="none" />
                    </svg>
                    {pins.map((p) => {
                      const on = mapSel === p.issue
                      return (
                        <button key={p.issue} onClick={() => setMapSel(on ? '' : p.issue)} aria-label={p.place} className="absolute -translate-x-1/2 -translate-y-1/2 transition active:scale-95" style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: on ? 5 : 1 }}>
                          <span className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] text-2xl shadow-lg ${on ? 'scale-110 border-brand bg-brand' : 'border-brand-soft bg-white'}`}><span className={`flex h-9 w-9 items-center justify-center rounded-full ${on ? 'bg-white/90' : 'bg-brand-soft'}`}>{p.emoji}</span></span>
                          <span className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-black ${on ? 'bg-white text-brand' : 'bg-brand text-white'}`}>{cnt(p.issue)}</span>
                        </button>
                      )
                    })}
                  </>) : (
                    <div className="h-full space-y-2 overflow-y-auto bg-bg px-5 pb-4 pt-20">
                      {pins.map((p) => (
                        <button key={p.issue} onClick={() => { setMapSel(p.issue); setMapMode('map') }} className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-2xl">{p.emoji}</span>
                          <span className="flex-1"><span className="block text-sm font-bold">{byId(p.issue).name}</span><span className="text-xs text-navy/50">{p.place}</span></span>
                          <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-black text-white">{cnt(p.issue)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 px-4 pt-4">
                    <button onClick={back} aria-label="뒤로" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow">‹</button>
                    <div className="flex rounded-full bg-white p-1 shadow">
                      {(['map', 'list'] as const).map((m) => <button key={m} onClick={() => setMapMode(m)} className={`h-9 w-20 rounded-full text-sm font-bold ${mapMode === m ? 'bg-brand text-white' : 'text-navy/60'}`}>{m === 'map' ? '지도' : '리스트'}</button>)}
                    </div>
                  </div>
                </div>
                {sel && mapMode === 'map' && (
                  <div className="fadeup rounded-t-2xl bg-white px-5 pb-3 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,.08)]">
                    <div className="flex items-start justify-between"><div><div className="text-xs font-bold text-brand">{sel.place}</div><div className="text-base font-black">{byId(sel.issue).name} · 게시글 {cnt(sel.issue)}</div></div><button onClick={() => setMapSel('')} aria-label="닫기" className="text-navy/40">✕</button></div>
                    <div className="mt-2 space-y-1.5">
                      {postsFor(byId(sel.issue), posts).slice(0, 2).map((p) => (
                        <button key={p.id} onClick={() => { setBookFilter(sel.issue); go({ n: 'community' }) }} className="w-full rounded-xl bg-brand-soft px-3 py-2 text-left text-[13px]"><b>{anon(p.author)}</b> · {p.text.slice(0, 34)}…</button>
                      ))}
                    </div>
                    <div className="mt-2"><Btn onClick={() => { setBookFilter(sel.issue); go({ n: 'community' }) }}>커뮤니티에서 모두 보기</Btn></div>
                  </div>
                )}
                <div className="flex shrink-0 gap-2 overflow-x-auto bg-white px-4 py-3">
                  {['', ...CATEGORIES.map((c) => c.id)].map((c) => <button key={c} onClick={() => { setMapCat(c); setMapSel('') }} className={`h-10 shrink-0 rounded-full px-4 text-sm font-bold ${mapCat === c ? 'bg-brand text-white' : 'bg-brand-soft text-brand'}`}>{c || '전체'}</button>)}
                </div>
              </div>
            )
          })()}

          {view.n === 'community' && (
            <div className="fadeup">
              <Header title="커뮤니티" />
              <div className="px-5 pb-28">
                <div className="relative mb-3 mt-3">
                  <img src="/assets/ba4e9.svg" alt="" className="pointer-events-none absolute left-[15px] top-1/2 h-6 w-6 -translate-y-1/2" />
                  <input value={q} onChange={(e) => { setQ(e.target.value); setBookFilter('') }} placeholder="겪고 있는 문제를 문장으로 검색해보세요" aria-label="커뮤니티 검색" className="h-[52px] w-full rounded-[17px] border border-[#dce4ee] bg-white pl-[49px] pr-10 text-sm shadow-[0_5px_8px_rgba(36,63,103,.05)] outline-none placeholder:text-[#9ba5b3] focus:border-brand focus:ring-2 focus:ring-brand/20" />
                  {q && <button onClick={() => setQ('')} aria-label="검색어 지우기" className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-navy/40">✕</button>}
                </div>
                {qn && (
                  <div className="fadeup mb-4 rounded-[22px] border border-[#dce6f3] bg-[#edf4ff] p-4">
                    <div className="flex items-center gap-1.5 text-xs font-black text-brand"><span className="rounded-md bg-brand px-1.5 py-0.5 text-[10px] text-white">AI</span>입력한 글자를 분석했어요</div>
                    {qKws.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{qKws.map((k) => <span key={k.word} className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand"><span className="mr-1 text-[10px] opacity-60">{KEYWORD_LABEL[k.type]}</span>{k.word}</span>)}</div>}
                    {qRec.length > 0 ? (
                      <>
                        <p className="mt-3 text-sm font-bold">{qGuessOk ? `“${qGuess!.name}” 문제와 비슷해 보여요` : '이런 문제를 찾고 있나요?'}</p>
                        <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4">{qRec.map((i) => (
                          <button key={i.id} onClick={() => openIssue(i.id)} className="flex w-36 shrink-0 items-center gap-2 rounded-xl bg-bg p-2 text-left active:scale-[.97]">
                            <Photo id={i.id} className="h-10 w-10 shrink-0 rounded-lg" /><span className="text-[13px] font-bold leading-tight">{i.name}</span>
                          </button>
                        ))}</div>
                      </>
                    ) : <p className="mt-2 text-sm text-navy/50">비슷한 문제를 찾지 못했어요. 장소나 증상을 더 적어보세요.</p>}
                  </div>
                )}
                <div className="px-1 pb-4 pt-5"><p className="text-xs font-semibold text-brand">혼자 고민하지 않아도 돼요</p><h2 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.04em]">먼저 겪어본 사람들의<br />생활 해결 노트</h2></div>
                {bookFilter && <div className="mb-3 flex items-center justify-between rounded-2xl border-2 border-brand bg-white px-4 py-3 text-sm font-bold">📖 {byId(bookFilter).name} 사례<button onClick={() => setBookFilter('')} aria-label="필터 해제" className="text-navy/50">✕</button></div>}
                <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
                  {['', ...TAGS].map((t) => <button key={t} onClick={() => setTagFilter(t)} className={`h-9 shrink-0 rounded-[18px] border px-[15px] text-xs font-semibold ${tagFilter === t ? 'border-navy bg-navy text-white' : 'border-[#e4e8ef] bg-white text-[#788292]'}`}>{t ? t : '전체'}</button>)}
                </div>
                <div className="relative mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#9ba3af]">{qn ? '검색 결과' : '게시글'} {shown.length}개</span>
                  <button onClick={() => setSortOpen(!sortOpen)} aria-haspopup="listbox" aria-expanded={sortOpen} className="flex h-9 items-center gap-1 rounded-[18px] border border-[#e4e8ef] bg-white px-3.5 text-xs font-semibold text-[#788292]">{SORTS.find((x) => x[0] === sort)![1]}<span className={`text-navy/40 transition ${sortOpen ? 'rotate-180' : ''}`}>⌄</span></button>
                  {sortOpen && (
                    <div role="listbox" className="fadeup absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-2xl bg-white py-1 shadow-xl ring-1 ring-line">
                      {SORTS.map(([k, l]) => <button key={k} role="option" aria-selected={sort === k} onClick={() => { setSort(k); setSortOpen(false) }} className={`flex h-11 w-full items-center justify-between px-4 text-sm font-bold ${sort === k ? 'text-brand' : 'text-navy/70'}`}>{l}{sort === k && '✓'}</button>)}
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-3">{shown.map((p) => postCard(p))}{shown.length === 0 && <p className="py-10 text-center text-sm text-[#9ba3af]">조건에 맞는 글이 아직 없어요.</p>}</div>
              </div>
            </div>
          )}

          {view.n === 'post' && (() => {
            const p = findPost(view.id)
            if (!p) return null
            const k = String(p.id)
            const cs = comments[k] || []
            const isRep = reported.includes(k)
            const m = p.text.match(/^(.+?[.!?])\s+(.+)$/)
            const title = p.title || (m ? m[1] : p.text)
            const body = p.title ? p.text : m ? m[2] : ''
            const nm = p.author.replace('*', '')
            const isSaved = saved.includes(k)
            const ic = 'h-6 w-6 shrink-0'
            return (
              <div className="fadeup">
                <div className="sticky top-0 z-10 grid h-[58px] grid-cols-[84px_1fr_84px] items-center bg-bg/95 px-3 backdrop-blur-[14px]">
                  <button onClick={back} aria-label="뒤로" className="flex h-[42px] w-[42px] items-center justify-center rounded-full"><img src="/assets/252a1.svg" alt="" className="h-6 w-6" /></button>
                  <h1 className="text-center text-base font-bold">커뮤니티</h1>
                  <div className="flex justify-end"><button onClick={() => { toggleSave(k); flash(isSaved ? '저장을 취소했어요' : '내 정보에 저장했어요') }} aria-label="저장하기" aria-pressed={isSaved} className="flex h-[42px] w-[42px] items-center justify-center rounded-full">{isSaved ? <Bookmark className="h-6 w-6" /> : <img src="/assets/5640e.svg" alt="" className="h-6 w-6" />}</button></div>
                </div>
                <article className="rounded-b-[28px] bg-white px-5 pb-5 pt-[22px]">
                  <div className="flex items-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-[#dfedfa] text-xs font-semibold text-[#356da8]">{nm.slice(0, 1)}</span>
                    <div className="min-w-0 flex-1 pl-[9px]"><div className="text-xs font-bold leading-6">{nm}***</div><div className="text-xs leading-6 text-[#9ba3af]">{anon(p.author).split(' · ')[1]} · {agoText(p.ago ?? 0)}</div></div>
                    <button onClick={() => !isRep && setReportFor(k)} aria-label={isRep ? '신고한 글이에요' : '게시글 더보기·신고'} className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-[#9ba3af]"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg></button>
                  </div>
                  <h2 className="pt-[22px] text-2xl leading-[33.6px] tracking-[-0.03em]">{title}</h2>
                  <div className="flex flex-wrap gap-[5px] pt-3">{p.tags.map((t) => <span key={t} className="rounded-lg bg-[#f2f5f8] px-[7px] py-[5px] text-xs leading-6 text-[#6b7b91]">#{t}</span>)}</div>
                  {(p.img || p.issue) && <div className="mt-3.5 h-[241px] w-full overflow-hidden rounded-[18px] bg-[#dfe7f0]">{p.img ? <img src={p.img} alt="첨부 사진" className="h-full w-full object-cover" /> : <Photo id={p.issue} className="h-full w-full" />}</div>}
                  {body && <p className="pt-5 text-sm leading-[24.5px] text-[#4f5c6f]">{body}</p>}
                  <div className="mt-5 flex gap-3.5 border-t border-[#edf0f4] pt-3.5 text-xs leading-6 text-[#8a95a4]"><span>도움돼요 {likeN(p)}</span><span>댓글 {cs.length}</span><span>조회 {(p.views ?? 0).toLocaleString()}</span></div>
                  <div className="mt-[13px] grid grid-cols-2 gap-2">
                    <button onClick={() => toggleLike(p.id)} aria-pressed={liked.includes(k)} className={`flex min-h-[44px] items-center justify-center gap-[7px] rounded-[14px] border text-sm font-semibold active:scale-[.98] ${liked.includes(k) ? 'border-[#9bbdfd] bg-[#eaf2ff] text-brand' : 'border-[#e1e7ef] bg-[#f7f9fc] text-[#657083]'}`}>
                      <svg viewBox="0 0 24 24" className={ic} fill={liked.includes(k) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>도움돼요
                    </button>
                    <button onClick={() => document.getElementById('cinput')?.focus()} className="flex min-h-[44px] items-center justify-center gap-[7px] rounded-[14px] border border-[#e1e7ef] bg-[#f7f9fc] text-sm font-semibold text-[#657083] active:scale-[.98]">
                      <svg viewBox="0 0 24 24" className={ic} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4.5 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /></svg>댓글
                    </button>
                  </div>
                </article>
                <section className="px-5 pb-44 pt-[25px]">
                  <h2 className="text-xl font-semibold leading-6 tracking-[-0.02em]">댓글</h2>
                  <p className="pt-1 text-sm font-medium leading-6 text-[#7e8797]">서로의 경험을 편하게 나눠주세요</p>
                  <div className="flex gap-2 pt-3">{([['empathy', '공감해요'], ['opinion', '다른 의견']] as const).map(([kk, l]) => <button key={kk} onClick={() => setCKind(kk)} className={`h-8 rounded-[13px] border px-3 text-xs font-semibold ${cKind === kk ? 'border-[#9bbdfd] bg-[#eaf2ff] text-brand' : 'border-[#dce4ee] bg-white text-[#657083]'}`}>{l}</button>)}</div>
                  <div className="pt-1.5">
                    {cs.map((c) => (
                      <div key={c.id} className="flex items-start border-b border-[#e8ecf2] py-3.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-[#dfedfa] text-xs font-semibold text-[#356da8]">{c.author.replace('*', '').slice(0, 1)}</span>
                        <div className="min-w-0 flex-1 pl-2.5">
                          <div className="flex items-center gap-1.5 text-xs leading-6"><b className="text-navy">{c.author.replace('*', '')}***</b><span className="text-[#9ba4b1]">{agoText(c.ago)}</span><span className={`rounded-md px-1.5 text-xs ${c.kind === 'empathy' ? 'bg-[#eaf2ff] text-brand' : 'bg-[#f2f5f8] text-[#6b7b91]'}`}>{c.kind === 'empathy' ? '공감' : '다른 의견'}</span>
                            <button onClick={() => flash('신고가 접수됐어요 (시연)')} className="ml-auto text-[#b4bcc8]">신고</button></div>
                          <p className="pt-1.5 text-sm leading-[22.4px] text-[#5f6c7e]">{c.text}</p>
                        </div>
                      </div>
                    ))}
                    {!cs.length && <p className="mt-3 rounded-[18px] bg-[#eaf2ff] p-4 text-sm text-brand">첫 댓글로 공감이나 다른 의견을 남겨보세요.</p>}
                  </div>
                </section>
                <div className="absolute inset-x-4 bottom-[92px] z-10 flex min-h-[56px] items-center gap-2 rounded-[18px] border border-[#dce4ee] bg-white/95 py-[7px] pl-[15px] pr-2 shadow-[0_10px_28px_rgba(37,49,68,.14)] backdrop-blur-[14px]">
                  <input id="cinput" value={cText} onChange={(e) => setCText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addComment(k)} placeholder="댓글을 입력해주세요" aria-label="댓글 입력" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9ba4b1]" />
                  <button onClick={() => addComment(k)} disabled={!cText.trim()} className="h-10 min-w-[52px] rounded-xl bg-brand px-3 text-sm font-bold text-white transition disabled:bg-[#edf0f4] disabled:text-[#aab2c0]">등록</button>
                </div>
                {reportFor === k && (
                  <div className="absolute inset-0 z-30 flex items-end bg-black/40" onClick={() => setReportFor('')}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full rounded-t-3xl bg-white p-5 pb-8">
                      <h3 className="text-lg font-bold">신고 사유를 선택해주세요</h3>
                      <div className="mt-3 space-y-2">{['광고·홍보', '욕설·비방', '잘못된 정보', '개인정보 노출'].map((r) => <button key={r} onClick={() => { setReported([...reported, k]); setReportFor(''); flash('신고가 접수됐어요 (시연)') }} className="flex h-12 w-full items-center rounded-xl border border-line px-4 text-left font-semibold">{r}</button>)}</div>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {view.n === 'write' && (() => {
            const cat = wTags[0] || ''
            const ready = !!cat && !!wTitle.trim() && !!wText.trim()
            const addTag = () => { const t = wTagIn.trim().replace(/^#+/, '').replace(/,/g, ''); if (t && !wTagList.includes(t) && wTagList.length < 5) setWTagList([...wTagList, t]); setWTagIn('') }
            const card = 'rounded-[18px] border border-[#dce4ee] bg-white px-[15px] pb-2.5 pt-3.5 focus-within:border-brand'
            return (
              <div className="fadeup min-h-full pb-40">
                <div className="sticky top-0 z-10 grid h-[58px] grid-cols-[84px_1fr_84px] items-center bg-bg/95 px-3 backdrop-blur-[14px]">
                  <button onClick={back} aria-label="뒤로" className="flex h-[42px] w-[42px] items-center justify-center rounded-full"><img src="/assets/252a1.svg" alt="" className="h-6 w-6" /></button>
                  <h1 className="text-center text-base font-bold">새 글 작성</h1><span />
                </div>
                <section className="px-5 pt-[22px]">
                  <div className="text-base font-bold leading-6">어떤 이야기인가요? <span className="text-[#e8444a]">*</span></div>
                  <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pt-2.5">{TAGS.map((t) => <button key={t} onClick={() => setWTags([t])} aria-pressed={cat === t} className={`min-h-9 shrink-0 rounded-[13px] border px-3 py-[7px] text-xs font-semibold ${cat === t ? 'border-[#9bbdfd] bg-[#eaf2ff] text-brand' : 'border-[#dce4ee] bg-white text-[#657083]'}`}>{t}</button>)}</div>
                </section>
                <section className="px-5 pt-3">
                  <label className={`block ${card}`}>
                    <span className="block text-xs font-bold leading-6 text-[#4f5c6f]">제목</span>
                    <input value={wTitle} maxLength={60} onChange={(e) => setWTitle(e.target.value)} placeholder="어떤 경험인지 한눈에 알 수 있게 적어주세요" className="mt-1 h-10 w-full bg-transparent text-sm text-[#263448] outline-none placeholder:text-[#9ba4b1]" />
                    <span className="block text-right text-xs leading-6 text-[#9ba4b1]">{wTitle.length}/60</span>
                  </label>
                  <label className={`mt-2.5 block ${card}`}>
                    <span className="block text-xs font-bold leading-6 text-[#4f5c6f]">내용</span>
                    <textarea value={wText} maxLength={500} onChange={(e) => setWText(e.target.value)} placeholder={'문제가 생긴 상황과 직접 해본 방법을 적어보세요.\n구체적으로 적을수록 다른 자취생에게 도움이 돼요.'} className="mt-2 block h-[142px] w-full resize-none bg-transparent text-sm leading-[22.4px] text-[#263448] outline-none placeholder:text-[#9ba4b1]" />
                    <span className="block text-right text-xs leading-6 text-[#9ba4b1]">{wText.length}/500</span>
                  </label>
                </section>
                <section className="px-5 pt-[22px]">
                  <div className="flex items-center justify-between"><h2 className="text-base font-bold leading-6">사진</h2><span className="text-xs text-[#8a95a4]">선택 사항</span></div>
                  {wPhoto ? (
                    <div className="relative mt-2.5 h-14 w-14">
                      <img src={wPhoto} alt="첨부한 생활 문제 사진 미리보기" className="h-14 w-14 rounded-[10px] object-cover" />
                      <button onClick={() => setWPhoto('')} aria-label="첨부 사진 삭제" className="absolute -right-[7px] -top-[7px] flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-white bg-[#4f5c6f] text-xs leading-none text-white">✕</button>
                    </div>
                  ) : (
                    <button onClick={() => { const i = GALLERY.findIndex((g) => g.src === wPhoto); setWPhoto(GALLERY[(i + 1) % GALLERY.length].src) }} className="mt-2.5 flex w-full items-center gap-3 rounded-[18px] border border-[#dce4ee] bg-[#fbfcff] p-4 text-left active:scale-[.99]">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.2" /></svg>
                      <span><span className="block text-sm font-bold leading-6 text-[#263448]">사진 추가하기</span><span className="block text-xs leading-5 text-[#8a95a4]">문제 상황을 더 쉽게 이해할 수 있어요</span></span>
                    </button>
                  )}
                </section>
                <section className="px-5 pt-[22px]">
                  <div className="text-xs font-bold leading-6 text-[#4f5c6f]">태그</div>
                  <div className="mt-2 flex flex-wrap items-center gap-[7px] rounded-2xl border border-[#dce4ee] bg-white px-2.5 py-2 focus-within:border-brand">
                    {wTagList.map((t) => <span key={t} className="flex min-h-[30px] items-center gap-0.5 rounded-[10px] bg-[#eaf2ff] py-[3px] pl-[9px] pr-1.5 text-xs font-semibold text-brand">#{t}<button onClick={() => setWTagList(wTagList.filter((x) => x !== t))} aria-label={`#${t} 삭제`} className="flex h-5 w-5 items-center justify-center text-sm">✕</button></span>)}
                    <input value={wTagIn} onChange={(e) => setWTagIn(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } else if (e.key === 'Backspace' && !wTagIn && wTagList.length) setWTagList(wTagList.slice(0, -1)) }} onBlur={addTag} placeholder="태그를 입력해주세요 (예: 누수, 곰팡이)" aria-label="태그 입력" className="h-[30px] min-w-[110px] flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3acb9]" />
                  </div>
                </section>
                <div className="absolute inset-x-0 bottom-[84px] z-10 bg-gradient-to-b from-[rgba(245,247,251,0)] to-bg to-[38%] px-5 pt-6">
                  <button disabled={!ready} onClick={() => { addTag(); setPosts([{ id: Date.now(), author: '서*윤', tags: [cat, ...wTagList], title: wTitle.trim(), text: wText.trim(), likes: 0, ago: 0, views: 0, img: wPhoto || undefined }, ...posts]); setTagFilter(''); reset({ n: 'community' }); flash('사례가 등록됐어요') }} className={`h-[54px] w-full rounded-[15px] text-base font-semibold transition active:scale-[.98] ${ready ? 'bg-brand text-white shadow-[0_8px_9px_rgba(52,120,246,.25)]' : 'bg-[#e8ebf2] text-[#aab2c0]'}`}>글 올리기</button>
                </div>
              </div>
            )
          })()}

          {view.n === 'me' && (
            <div className="fadeup">
              <Header title="마이" />
              <div className="px-5 pb-10 pt-[18px]">
                <div className="flex items-center rounded-3xl bg-gradient-to-br from-[#edf4ff] to-white p-[18px]">
                  <span className="flex h-[54px] w-[54px] items-center justify-center rounded-[19px] bg-brand text-base font-bold text-white">서</span>
                  <div className="min-w-0 flex-1 pl-[13px]"><div className="text-base font-bold">김서윤</div><div className="text-xs text-[#8290a2]">자취 6개월 · {housing}</div></div>
                </div>
                <div className="mt-[10px] flex items-center rounded-[21px] bg-white px-2 py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]">
                  {([['저장한 사례', saved.length], ['해결한 문제', new Set(history.filter((h) => h.done).map((h) => h.id)).size], ['작성한 글', Math.max(0, posts.length - POSTS0.length)]] as const).map(([l, n], k) => (
                    <div key={l} className={`flex flex-1 flex-col items-center ${k ? 'border-l border-[#e7eaf0]' : ''}`}><span className="text-lg font-bold text-brand">{n}</span><span className="text-xs text-[#8791a0]">{l}</span></div>
                  ))}
                </div>
              </div>
              <div className="space-y-[14px] px-5 pb-10">
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]"><h2 className="mb-3 text-xs font-semibold text-[#9aa3b0]">저장한 해결 사례</h2>
                  {saved.length ? <div className="space-y-2">{saved.map((k) => { const sp = findPost(k); if (!sp) return null; return <button key={k} onClick={() => go({ n: 'post', id: k })} className="relative w-full rounded-2xl border border-line p-3 pr-10 text-left text-sm"><Bookmark className="absolute right-3 top-0 h-6 w-6" /><span className="font-bold">{sp.issue ? byId(sp.issue).name : '커뮤니티 글'}</span><br /><span className="text-navy/60">{sp.text.slice(0, 36)}…</span></button> })}</div> : <p className="rounded-2xl bg-brand-soft p-4 text-sm text-brand">사례의 '저장하기'를 누르면 여기에 저장돼요.</p>}</section>
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]">
                  <div className="mb-2 flex items-center justify-between"><h2 className="text-xs font-semibold text-[#9aa3b0]">우리 집 문제 기록</h2><span className="text-xs font-bold text-navy/45">총 {new Set(history.map((h) => h.id)).size}건 · 해결 {new Set(history.filter((h) => h.done).map((h) => h.id)).size}건</span></div>
                  <div className="space-y-2">{history.filter((h, i, a) => a.findIndex((x) => x.id === h.id) === i).map((h) => {
                    const it = byId(h.id)
                    const d = new Date(Date.now() - h.days * 86400000)
                    return (
                      <div key={h.k} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                        <button onClick={() => openIssue(it.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`${it.name} 다시 보기`}>
                          <Photo id={it.id} className="h-14 w-14 shrink-0 rounded-xl" />
                          <span className="min-w-0"><span className="block truncate text-[15px] font-bold">{it.name}</span><span className="text-xs text-navy/50">{h.days ? `${d.getMonth() + 1}월 ${d.getDate()}일 · ${h.days}일 전` : '오늘'} · {housing}</span><span className="block text-[11px] font-bold text-brand">다시 보기 ›</span></span>
                        </button>
                        <button onClick={() => setHistory(history.map((x) => (x.k === h.k ? { ...x, done: !x.done } : x)))} aria-pressed={h.done} className={`h-8 shrink-0 rounded-full px-3 text-xs font-bold ${h.done ? 'bg-[#E3F6EA] text-[#18853F]' : 'bg-brand-soft text-brand'}`}>{h.done ? '✓ 해결됨' : '진행 중'}</button>
                      </div>
                    )
                  })}</div>
                </section>
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]"><h2 className="mb-3 text-xs font-semibold text-[#9aa3b0]">집주인 연락처</h2>
                  <input value={landlord.name} onChange={(e) => setLandlord({ ...landlord, name: e.target.value })} className="mb-2 h-12 w-full rounded-xl border border-[#dce4ee] bg-white px-4 outline-none focus:border-brand" aria-label="집주인 이름" />
                  <input value={landlord.phone} onChange={(e) => setLandlord({ ...landlord, phone: e.target.value })} className="h-12 w-full rounded-xl border border-[#dce4ee] bg-white px-4 outline-none focus:border-brand" aria-label="집주인 전화번호" /></section>
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]"><h2 className="mb-3 text-xs font-semibold text-[#9aa3b0]">내 주소지</h2>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="예: 서울 동작구 상도동" aria-label="주소지" className="h-12 w-full rounded-xl border border-[#dce4ee] bg-white px-4 outline-none focus:border-brand" />
                  <p className="mt-2 text-xs text-[#8a95a4]">주변 수리업체를 찾을 때 이 주소를 기준으로 해요.</p></section>
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]"><h2 className="mb-3 text-xs font-semibold text-[#9aa3b0]">주거 형태</h2>
                  <div className="flex gap-2">{['원룸', '투룸', '오피스텔', '다세대'].map((h) => <button key={h} onClick={() => setHousing(h)} className={`h-11 flex-1 rounded-full text-sm font-bold ${housing === h ? 'bg-brand text-white' : 'border border-line'}`}>{h}</button>)}</div></section>
                <Btn onClick={() => flash('저장했어요')}>저장하기</Btn>
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]"><h2 className="mb-3 text-xs font-semibold text-[#9aa3b0]">최근 확인한 문제</h2><div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1">{recent.map((id) => (
                  <button key={id} onClick={() => openIssue(id)} className="w-40 shrink-0 rounded-2xl bg-white p-3 text-left shadow-sm active:scale-[.97]"><Photo id={id} className="h-20 w-full rounded-xl" /><span className="mt-2 block text-sm font-bold leading-tight">{byId(id).name}</span><span className="text-[11px] text-navy/40">{byId(id).cat}</span></button>
                ))}</div></section>
              </div>
            </div>
          )}
        </div>

        {view.n === 'community' && <button onClick={() => { setWTags([]); setWText(''); setWTitle(''); setWPhoto(''); setWTagList([]); setWTagIn(''); go({ n: 'write' }) }} className="absolute bottom-[100px] right-5 z-20 h-12 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_8px_11px_rgba(52,120,246,.3)] active:scale-95"><img src="/assets/aaae9.svg" alt="" className="mr-1.5 inline h-5 w-5 align-[-4px]" />글쓰기</button>}

        {view.n === 'photo' && <CameraView onBack={back} onAnalyze={(t) => analyze('photo', t)} />}

        <div aria-hidden={!booting} className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${booting ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <div className="flex text-[56px] font-black tracking-tight text-brand">{'어쩌집'.split('').map((ch, i) => <span key={i} style={{ animation: 'rise .6s ease both', animationDelay: `${0.15 + i * 0.18}s` }}>{ch}</span>)}</div>
          <p className="mt-3 text-sm font-medium text-brand/60" style={{ animation: 'rise .6s ease both', animationDelay: '0.9s' }}>자취방 문제, 어쩌지 싶을 때</p>
          <div className="mt-10 h-1 w-24 overflow-hidden rounded-full bg-brand-soft"><div className="h-full w-1/3 rounded-full bg-brand" style={{ animation: 'load 1.1s ease-in-out infinite' }} /></div>
        </div>

        {toast && <div className="fadeup absolute inset-x-6 bottom-24 z-30 rounded-2xl bg-navy px-4 py-3 text-center text-sm font-medium text-white">{toast}</div>}

        <nav className="relative z-20 mx-4 mb-3 grid h-[70px] shrink-0 grid-cols-4 rounded-[24px] border border-[#dce4ee] bg-white/95 px-2 pb-2.5 pt-2 shadow-xl backdrop-blur-[18px]">
          {tabs.map(([k, l, , fn]) => (
            <button key={k} onClick={fn} className={`flex flex-col items-center justify-center gap-[3px] text-xs font-semibold ${tabOf(view) === k ? 'text-brand' : 'text-[#939cab]'}`}>
              <img src={`/assets/${NAVICON[k]}-${tabOf(view) === k ? 'on' : 'off'}.svg`} alt="" className="h-6 w-6" />{l}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

const GLOSS: [string, string][] = [
  ['패킹', '수도꼭지·배관 연결부에 끼우는 고무 링. 닳으면 물이 새요'],
  ['너트', '배관을 조여 고정하는 육각 부품. 렌치로 돌려요'],
  ['트랩', '배수구 아래 U자 관. 물이 고여 냄새와 벌레를 막아요'],
  ['밸브', '물이나 가스가 지나가는 길을 여닫는 잠금 장치'],
  ['차단기', '전기를 한 번에 끊는 스위치. 내리면 전기가 꺼져요'],
  ['분전반', '차단기가 모여 있는 전기 박스. 보통 현관 쪽에 있어요'],
  ['콘센트', '전기 플러그를 꽂는 벽면 구멍'],
  ['실리콘', '틈을 메우는 말랑한 방수 접착제'],
]
function GlossNote({ texts }: { texts: string[] }) {
  const hit = GLOSS.filter(([w]) => texts.some((t) => t.includes(w)))
  if (!hit.length) return null
  return (
    <div className="mt-3 rounded-[14px] bg-[#f3f6fb] px-3 py-2.5">
      <p className="text-[11px] font-bold text-[#8a95a4]">어려운 말 풀이</p>
      {hit.map(([w, d]) => <p key={w} className="mt-1 text-xs leading-[18px] text-[#6b778a]"><b className="text-[#4f5c6f]">{w}</b> · {d}</p>)}
    </div>
  )
}

function Timeline({ is }: { is: Issue }) {
  const [cur, setCur] = useState(0)
  const [ex, setEx] = useState(-1)
  const steps = [
    { label: '확인', title: is.steps[0], detail: '먼저 지금 상태를 눈으로 확인해요. 사진을 찍어두면 나중에 설명하기 쉬워요.' },
    { label: '준비', title: is.supplies.length ? '필요한 물건을 챙겨요' : '따로 준비할 물건은 없어요', detail: is.supplies.length ? '아래 준비물을 미리 챙기면 중간에 멈추지 않아도 돼요.' : '바로 다음 단계로 넘어가도 괜찮아요.' },
    { label: '조치', title: is.steps[1], detail: '순서대로 천천히 진행해요. 무리하지 말고 어려우면 멈춰도 돼요.' },
    { label: '결과 확인', title: is.steps[2], detail: '해결되지 않았다면 집주인이나 업체에 알려야 해요.' },
  ]
  return (
    <section>
      <div className="mb-4 flex items-center justify-between px-1"><h2 className="text-xl font-semibold tracking-[-0.02em]">이 순서대로 해보세요</h2><span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-semibold text-brand">{Math.min(cur + 1, 4)} / 4</span></div>
      <ol className="relative">
        {steps.map((st, i) => {
          const act = i === cur
          const done = i < cur
          return (
            <li key={st.label} className="relative flex gap-3 pb-4 last:pb-0">
              {i < 3 && <span className={`absolute left-[17px] top-9 h-[calc(100%-28px)] border-l-2 border-dashed ${done ? 'border-brand' : 'border-[#d5dce8]'}`} aria-hidden />}
              <span className={`relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${act ? 'bg-brand text-white shadow-[0_4px_8px_rgba(52,120,246,.3)]' : done ? 'bg-[#eaf2ff] text-brand' : 'bg-white text-[#9ba3af] ring-1 ring-[#e1e5ec]'}`}>{done ? '✓' : i + 1}</span>
              {act ? (
                <div className="min-w-0 flex-1 rounded-[22px] border border-[#e8ecf2] bg-white p-4 shadow-[0_7px_11px_rgba(36,63,103,.06)]">
                  <p className="text-xs font-semibold text-brand">{st.label}</p>
                  <button onClick={() => setEx(ex === i ? -1 : i)} aria-expanded={ex === i} className="mt-1 flex w-full items-start justify-between gap-2 text-left"><span className="text-base font-semibold leading-6 tracking-[-0.02em]">{st.title}</span><span className={`mt-1 text-[#9ba3af] transition ${ex === i ? 'rotate-90' : ''}`}>›</span></button>
                  <p className="mt-2 text-sm leading-[22px] text-[#758092]">{st.detail}</p>
                  {i === 1 && is.supplies.length > 0 && <div className="mt-3"><p className="text-xs font-semibold text-[#8a95a4]">준비물</p><div className="mt-1.5 flex flex-wrap gap-1.5">{is.supplies.map((x) => <span key={x} className="rounded-[14px] bg-[#f2f5f8] px-3 py-1.5 text-xs font-semibold text-[#4f5c6f]">{x}</span>)}</div></div>}
                  <GlossNote texts={[st.title, st.detail, ...(i === 1 ? is.supplies : [])]} />
                  <Reveal open={ex === i}><Draw text={st.title} /></Reveal>
                  <div className="mt-4"><Btn onClick={() => setCur(cur + 1)}>{i === 3 ? '모두 확인했어요' : '확인했어요'}</Btn></div>
                </div>
              ) : (
                <button onClick={() => done && setCur(i)} className={`flex min-h-9 min-w-0 flex-1 items-center justify-between gap-2 pt-1.5 text-left ${done ? '' : 'cursor-default'}`}>
                  <span className="min-w-0"><span className={`block text-xs font-semibold ${done ? 'text-brand' : 'text-[#9ba3af]'}`}>{st.label}</span><span className={`block truncate text-sm font-semibold ${done ? 'text-[#4f5c6f]' : 'text-[#9ba3af]'}`}>{st.title}</span></span>
                  <span className="text-[#b4bcc8]">›</span>
                </button>
              )}
            </li>
          )
        })}
      </ol>
      {cur === 4 && <div className="mt-4 rounded-[18px] bg-[#eaf2ff] p-4 text-sm font-semibold leading-5 text-brand">모두 확인했어요! 해결되지 않았다면 집주인에게 알려보세요.</div>}
    </section>
  )
}

function CameraView({ onBack, onAnalyze }: { onBack: () => void; onAnalyze: (t: string) => void }) {
  const [live, setLive] = useState(0)
  const [shot, setShot] = useState<{ url?: string; sample?: number; g?: number } | null>(null)
  const [pick, setPick] = useState(false)
  const [found, setFound] = useState(false)
  const [step, setStep] = useState(0)
  useEffect(() => {
    setFound(false)
    const t = setTimeout(() => setFound(true), 1100)
    return () => clearTimeout(t)
  }, [live, shot])
  useEffect(() => {
    setStep(0)
    if (!shot) return
    const ts = [700, 1500, 2300, 3100].map((ms, k) => setTimeout(() => setStep(k + 1), ms))
    return () => ts.forEach(clearTimeout)
  }, [shot])
  const idx = shot?.sample ?? live
  const smp = PHOTO_SAMPLES[idx]
  const gal = shot?.g !== undefined ? GALLERY[shot.g] : null
  const hint = gal ? (gal.drain ? '싱크대 밑에서 물이 새고 있어요.' : '') : shot?.url ? '싱크대 밑에서 물이 새고 있어요.' : smp.hint
  const is = classify(hint || '기타')
  const objs: [string, number][] = gal ? ([...gal.found] as unknown as [string, number][]) : shot?.url ? [['문제 부위', 93], ['배수 호스', 89], ['물 고임', 84]] : (smp.objs as [string, number][])
  const label = gal ? gal.found[0][0] : shot?.url ? '문제 부위' : smp.obj
  const src = gal?.src || shot?.url || (smp as { src?: string }).src || (PHOTOS[smp.issue] ? `https://images.unsplash.com/photo-${PHOTOS[smp.issue]}?w=900&h=1200&fit=crop&auto=format&q=75` : '')
  const scanning = !!shot && step < 4
  const puddle = gal ? gal.id === 'g3' : !shot?.url && smp.issue === 'sink'
  const corner = 'absolute h-8 w-8 border-white'
  return (
    <div className="absolute inset-x-0 bottom-0 top-[46px] z-40 flex flex-col overflow-hidden bg-[#12152a]">
      {src ? <img src={src} alt="촬영한 문제 사진" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,#3a4180,#12152a_70%)] text-[10rem] opacity-90">{smp.emoji}</div>}
      {puddle && <div className="pointer-events-none absolute inset-x-[6%] bottom-[9%] h-[11%] rounded-[50%] bg-[radial-gradient(ellipse_at_40%_35%,rgba(190,225,255,.75),rgba(90,150,210,.55)_55%,rgba(60,110,170,.35))] shadow-[0_0_14px_rgba(120,180,240,.6)]" />}
      <div className={`absolute inset-0 transition-colors duration-500 ${shot ? 'bg-black/25' : 'bg-black/10'}`} />
      {shot && <div key={String(shot.sample) + String(shot.g) + (shot.url || '')} className="pointer-events-none absolute inset-0 z-30 bg-white" style={{ animation: 'flash .5s ease-out forwards' }} />}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
        <button onClick={onBack} aria-label="뒤로" className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-2xl text-white backdrop-blur">‹</button>
        <span className="text-sm font-bold text-white drop-shadow">사진으로 보여주기</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white bg-brand`}>1/3</span>
      </div>
      <div className="absolute left-[16%] right-[16%] top-[24%] h-[36%]">
        {scanning && <span className="absolute inset-x-[-12%] h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_14px_3px_rgba(255,255,255,.8)]" style={{ animation: 'scan 1.5s ease-in-out infinite alternate' }} />}
        <div className={`transition-opacity ${found || shot ? 'opacity-100' : 'animate-pulse opacity-60'}`}>
          <span className={`${corner} left-0 top-0 rounded-tl-xl border-l-4 border-t-4`} /><span className={`${corner} right-0 top-0 rounded-tr-xl border-r-4 border-t-4`} />
          <span className={`${corner} bottom-0 left-0 rounded-bl-xl border-b-4 border-l-4`} /><span className={`${corner} bottom-0 right-0 rounded-br-xl border-b-4 border-r-4`} />
        </div>
        <span className="absolute -top-4 left-2 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-lg">{shot ? (step >= 3 ? `✓ ${label} 인식 완료` : '스캔해서 정보를 찾는 중…') : found ? `● ${label}` : '문제 사물을 찾는 중…'}</span>
        {shot && objs.slice(0, step).map(([n], k) => (
          <span key={n} className="fadeup absolute rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-brand shadow" style={{ left: `${[8, 52, 24][k]}%`, top: `${[22, 48, 74][k]}%` }}>✓ {n}</span>
        ))}
      </div>
      {!shot && (
        <div className="absolute inset-x-0 bottom-0 z-10 space-y-4 bg-gradient-to-t from-black/70 to-transparent px-5 pb-8 pt-16">
          <div className="flex items-center justify-between px-4">
            <button onClick={() => setPick(true)} className="h-12 w-12 overflow-hidden rounded-xl border-2 border-white/80 bg-white/20" aria-label="갤러리에서 선택"><img src={GALLERY[2].src} alt="" className="h-full w-full object-cover" /></button>
            <button onClick={() => setShot({ sample: live })} aria-label="촬영" className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-4 border-white"><span className="h-[58px] w-[58px] rounded-full bg-white active:scale-90" /></button>
            <span className="w-12" />
          </div>
        </div>
      )}
      {pick && !shot && (
        <div className="fadeup absolute inset-0 z-30 flex flex-col justify-end bg-black/50">
          <button aria-label="닫기" onClick={() => setPick(false)} className="flex-1" />
          <div className="rounded-t-[29px] bg-white px-5 pb-8 pt-3">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#dce4ee]" />
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold">갤러리</h2><span className="text-xs text-[#8a95a4]">최근 항목 {GALLERY.length}장</span></div>
            <div className="mt-3 grid max-h-[52vh] grid-cols-3 gap-1.5 overflow-y-auto">
              {GALLERY.map((g, k) => <button key={g.id} onClick={() => { setPick(false); setShot({ g: k }) }} aria-label={g.label} className="aspect-square overflow-hidden rounded-xl bg-bg active:scale-95"><img src={g.src} alt={g.label} className="h-full w-full object-cover" /></button>)}
            </div>
            <p className="mt-3 text-xs text-[#8a95a4]">사진을 고르면 문제 사물을 찾아드려요.</p>
          </div>
        </div>
      )}
      {shot && gal && !gal.drain && !scanning && (
        <div className="fadeup absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-2xl">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded bg-navy/15" />
          <span className="rounded-full bg-[#fff4e6] px-2.5 py-0.5 text-xs font-bold text-[#9b5d2d]">문제를 찾지 못했어요</span>
          <h2 className="mt-2 text-lg font-bold">이 사진에서는 해결할 문제가 보이지 않아요</h2>
          <p className="mb-4 mt-1 text-sm text-[#657083]">{gal.found.map((f) => f[0]).join(', ')}이(가) 인식됐어요. 문제 부위가 잘 보이는 사진을 골라주세요.</p>
          <Btn onClick={() => { setShot(null); setPick(true) }}>다른 사진 고르기</Btn>
          <button onClick={() => setShot(null)} className="mt-2 h-11 w-full text-sm font-bold text-navy/50">카메라로 돌아가기</button>
        </div>
      )}
      {shot && scanning && (
        <div className="fadeup absolute inset-x-4 bottom-6 z-20 rounded-3xl bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between text-xs font-black text-brand"><span>🔍 인식한 개체</span><span>{Math.min(100, step * 30 + 10)}%</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-soft"><div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${Math.min(100, step * 30 + 10)}%` }} /></div>
          <div className="mt-3 space-y-2">{objs.map(([n, c], k) => (
            <div key={n} className={`flex items-center gap-2 text-sm transition-opacity ${k < step ? 'opacity-100' : 'opacity-30'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black ${k < step ? 'bg-brand text-white' : 'bg-navy/10 text-transparent'}`}>✓</span>
              <span className="flex-1 font-bold">{k < step ? n : '탐색 중…'}</span>{k < step && <span className="text-xs font-black text-brand">{c}%</span>}
            </div>
          ))}</div>
        </div>
      )}
      {shot && !scanning && !(gal && !gal.drain) && (
        <div className="fadeup absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-2xl">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded bg-navy/15" />
          <div className="flex items-center gap-3">
            <Photo id={shot.url || gal ? is.id : smp.issue} className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1"><span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">감지된 문제</span><h2 className="mt-1 text-[20px] font-black leading-tight">{is.name}</h2></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">{objs.map(([n, c]) => <span key={n} className="rounded-full bg-bg px-2.5 py-1 text-xs font-bold">✓ {n} <span className="text-brand">{c}%</span></span>)}</div>
          <p className="mb-4 mt-3 text-sm leading-relaxed text-navy/70">{is.cause} 가능성이 있어요.</p>
          <Btn onClick={() => onAnalyze(hint)}>{'이 사진으로 분석하기'}</Btn>
          <button onClick={() => setShot(null)} className="mt-2 h-11 w-full text-sm font-bold text-navy/50">다시 선택하기</button>
        </div>
      )}
    </div>
  )
}

function MsgView({ is, landlord, onBack, onDone }: { is: Issue; landlord: { name: string; phone: string }; onBack: () => void; onDone: () => void }) {
  const initial = ['안녕하세요, 입주자입니다.', `${is.name.replace(/요$/, '')} 문제가 생겼어요.`, '사진을 함께 보내드려요.', '가능한 시간에 확인 부탁드려요.']
  const extras = ['평일 저녁 7시 이후 방문 가능해요', '언제 방문 가능하신가요?']
  const [lines, setLines] = useState(initial)
  const [edit, setEdit] = useState(false)
  const [custom, setCustom] = useState('')
  const compose = (list: string[]) => ['안녕하세요.', ...list, '확인 부탁드립니다. 감사합니다.'].join('\n\n')
  const startEdit = () => { if (!edit) setCustom(compose(lines)); setEdit(!edit) }
  const text = edit ? custom : compose(lines)
  const photoLine = '사진을 함께 보내드려요.'
  const [photo, setPhoto] = useState('')
  const [sheet, setSheet] = useState<'' | 'menu' | 'album'>('')
  const attach = (src: string) => { setPhoto(src); setSheet(''); if (!lines.includes(photoLine)) setLines([...lines, photoLine]) }
  return (
    <div className="fadeup">
      <Header title="메시지 만들기" onBack={onBack} />
      <div className="pb-48">
        <div className="px-5 pb-[18px] pt-3">
          <h1 className="text-[28px] font-bold leading-9 tracking-[-0.04em]">상황을 알리는<br />메시지를 확인하세요.</h1>
          <p className="mt-3 text-sm leading-[22px] text-[#758092]">필요 없는 문장은 ×로 빼고, 아래에서 문장을 더할 수 있어요.</p>
        </div>
        <div className="px-5">
          <div className="flex items-center rounded-[19px] border border-[#dce6f3] bg-[#edf4ff] px-[15px] py-3.5">
            <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] bg-white"><img src="/assets/f0963.svg" alt="" className="h-6 w-6" /></span>
            <div className="min-w-0 flex-1 pl-[11px]"><div className="text-xs text-[#7d8999]">받는 사람</div><div className="truncate pt-0.5 text-sm font-bold">{landlord.name} 집주인 · {landlord.phone}</div></div>
            <img src="/assets/ea344.svg" alt="" className="h-6 w-6" />
          </div>
        </div>
        <div className="px-5 pt-[22px]">
          <div className="flex items-center justify-between"><h2 className="text-xl font-bold leading-6 tracking-[-0.01em]">보낼 메시지</h2>
            <button onClick={startEdit} className="flex items-center gap-[5px] text-xs font-semibold text-brand"><img src="/assets/329dd.svg" alt="" className="h-6 w-6" />{edit ? '블록으로 보기' : '직접 수정'}</button></div>
          <div className="mt-3 rounded-[22px] border border-[#e8ecf2] bg-white p-4 shadow-[0_7px_11px_rgba(36,63,103,.06)]">
            {edit ? (
              <textarea value={custom} onChange={(e) => setCustom(e.target.value)} aria-label="메시지 내용" className="h-[260px] w-full resize-none bg-transparent text-sm leading-[23px] text-[#4f5c6f] outline-none" />
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#4f5c6f]">안녕하세요.</p>
                {lines.map((l) => (
                  <div key={l} className="flex items-center gap-2 rounded-[12px] bg-[#f3f6fb] py-1.5 pl-3 pr-1.5">
                    <span className="min-w-0 flex-1 text-sm leading-[22px] text-[#4f5c6f]">{l}</span>
                    {l === photoLine && (photo ? <img src={photo} alt="첨부 사진" className="h-8 w-8 shrink-0 rounded-lg object-cover" /> : <span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-brand">📷 사진 없음</span>)}
                    <button onClick={() => setLines(lines.filter((x) => x !== l))} aria-label="문장 빼기" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base text-[#8a95a4] active:bg-white">×</button>
                  </div>
                ))}
                {!lines.length && <p className="py-2 text-center text-xs text-[#8a95a4]">문장을 모두 뺐어요. 아래에서 추가해보세요.</p>}
                <p className="text-sm font-semibold text-[#4f5c6f]">확인 부탁드립니다. 감사합니다.</p>
                <button onClick={() => setSheet('menu')} className="flex h-11 w-full items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[#b9c8e0] text-sm font-semibold text-brand">{photo ? '📷 사진 바꾸기' : '📷 사진 첨부'}</button>
              </div>
            )}
          </div>
        </div>
        <div className="px-5 pt-[22px]">
          <h2 className="text-base font-bold tracking-[-0.01em]">문장 추가하기</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...initial.filter((b) => !lines.includes(b)), ...extras.filter((b) => !lines.includes(b))].map((b) => (
              <button key={b} disabled={edit} onClick={() => setLines([...lines, b])} className="rounded-full border border-[#dce6f3] bg-white px-3.5 py-2 text-[13px] font-semibold text-brand disabled:opacity-40">+ {b}</button>
            ))}
          </div>
        </div>
      </div>
      {sheet && (
        <div className="fadeup absolute inset-0 z-40 flex flex-col justify-end bg-black/50">
          <button aria-label="닫기" onClick={() => setSheet('')} className="flex-1" />
          <div className="rounded-t-[29px] bg-white px-5 pb-8 pt-3">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#dce4ee]" />
            {sheet === 'menu' ? (
              <>
                <h2 className="text-lg font-bold">사진 첨부</h2>
                <div className="mt-3 space-y-2">
                  <button onClick={() => setSheet('album')} className="flex h-14 w-full items-center gap-3 rounded-[15px] bg-[#f3f6fb] px-4 text-left text-[15px] font-semibold">🖼️ 앨범에서 선택</button>
                  <button onClick={() => attach(PHOTO_SAMPLES[0]?.src ?? GALLERY[2]?.src ?? '')} className="flex h-14 w-full items-center gap-3 rounded-[15px] bg-[#f3f6fb] px-4 text-left text-[15px] font-semibold">📷 지금 촬영하기 <span className="text-xs font-normal text-[#8a95a4]">(시연)</span></button>
                  {photo && <button onClick={() => { setPhoto(''); setSheet('') }} className="h-11 w-full text-sm font-semibold text-[#8a95a4]">첨부 사진 지우기</button>}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between"><h2 className="text-lg font-bold">앨범</h2><button onClick={() => setSheet('menu')} className="text-xs font-semibold text-brand">뒤로</button></div>
                <div className="mt-3 grid max-h-[40vh] grid-cols-3 gap-1.5 overflow-y-auto">
                  {GALLERY.map((g) => <button key={g.id} onClick={() => attach(g.src)} aria-label={g.label} className="aspect-square overflow-hidden rounded-xl bg-bg active:scale-95"><img src={g.src} alt={g.label} className="h-full w-full object-cover" /></button>)}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-[84px] z-10 bg-gradient-to-t from-bg via-bg/95 to-transparent px-5 pb-2 pt-6">
        <button disabled={!text.trim()} onClick={onDone} className="flex h-[54px] w-full items-center justify-center gap-[7px] rounded-[15px] bg-brand text-base font-semibold text-white shadow-[0_8px_9px_rgba(52,120,246,.25)] active:scale-[.98] disabled:opacity-40">메시지 앱에서 보내기</button>
      </div>
    </div>
  )
}

type Shop = { name: string; addr: string; phone: string; dist: string; url: string }
const KAKAO_KEY = (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_KAKAO_REST_KEY

function NearbyView({ is, address, onBack, flash }: { is: Issue; address: string; onBack: () => void; flash: (m: string) => void }) {
  const keyword = ({ '수도·수질': '누수', 화장실: '배관', 보일러: '보일러', '전기·조명': '전기', 곰팡이: '곰팡이', 해충: '방역' } as Record<string, string>)[is.cat] ?? '집수리'
  const loc = address || '서울 동작구 상도동'
  const [state, setState] = useState<'loading' | 'done'>('loading')
  const [shops, setShops] = useState<Shop[]>([])
  const kakaoUrl = (q: string) => `https://map.kakao.com/link/search/${encodeURIComponent(q)}`
  const search = () => {
    setState('loading')
    const sample = (): Shop[] => VENDORS.map((v) => ({ name: v.name, addr: v.addr, phone: v.phone, dist: v.dist, url: kakaoUrl(keyword) }))
    const done = (l: Shop[]) => { setShops(l); setState('done') }
    if (!KAKAO_KEY) { setTimeout(() => done(sample()), 700); return }
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        try {
          const r = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}&x=${p.coords.longitude}&y=${p.coords.latitude}&radius=3000&sort=distance&size=8`, { headers: { Authorization: `KakaoAK ${KAKAO_KEY}` } })
          const j = await r.json()
          done(j.documents.map((x: { place_name: string; road_address_name: string; address_name: string; phone: string; distance: string; place_url: string }) => ({ name: x.place_name, addr: x.road_address_name || x.address_name, phone: x.phone || '전화번호 없음', dist: +x.distance >= 1000 ? `${(+x.distance / 1000).toFixed(1)}km` : `${x.distance}m`, url: x.place_url })))
        } catch { done(sample()) }
      },
      () => done(sample()),
    )
  }
  useEffect(() => { search() }, [])
  return (
    <div className="fadeup">
      <Header title="주변 수리업체 찾기" onBack={onBack} />
      <div className="space-y-3 px-5 pb-32 pt-3">
        <div className="rounded-[19px] border border-[#dce6f3] bg-[#edf4ff] px-4 py-3.5">
          <div className="text-xs text-[#7d8999]">내 주소지 기준</div>
          <div className="flex items-center justify-between pt-0.5"><span className="text-sm font-bold">📍 {loc}</span>
            <button onClick={search} className="text-xs font-semibold text-brand">다시 찾기</button></div>
          <div className="mt-2.5 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy/70">검색어 · {keyword}</div>
        </div>
        {state === 'loading' ? (
          <p className="py-12 text-center text-sm text-[#8a95a4]">카카오맵에서 &apos;{keyword}&apos; 검색 중…</p>
        ) : (
          shops.map((v) => (
            <div key={v.name} className="rounded-[22px] border border-[#e8ecf2] bg-white p-4 shadow-[0_7px_11px_rgba(36,63,103,.06)]">
              <div className="flex items-start justify-between gap-2"><div className="text-[16px] font-bold">{v.name}</div><span className="shrink-0 text-xs font-semibold text-brand">{v.dist}</span></div>
              <div className="mt-2 text-[13px] leading-5 text-[#566377]">📍 {v.addr}</div>
              <div className="text-[13px] leading-5 text-[#566377]">☎ {v.phone}</div>
              <a href={v.url} target="_blank" rel="noreferrer" onClick={() => !KAKAO_KEY && flash('카카오맵 연결 (시연)')} className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-[#FEE500] text-sm font-bold text-[#191919]">카카오맵에서 보기</a>
            </div>
          ))
        )}
        <p className="text-xs leading-5 text-navy/50">검색 결과는 카카오맵 장소 검색 기준이에요. 영업시간과 비용은 카카오맵에서 확인해 주세요.</p>
      </div>
    </div>
  )
}
