import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, COMMENTS0, ISSUES, KEYWORD_LABEL, KEYWORD_RE, MAP_PINS, PLACES, POSTS0, PHOTO_SAMPLES, SOS_SAMPLES, TAGS, VENDORS, VOICE_SAMPLES, byId, classify, extractKeywords, type Comment, type Issue, type Post } from './data'

const postsFor = (is: Issue, posts: Post[]): Post[] => [
  ...posts.filter((p) => p.issue === is.id),
  ...is.cases.map((c, i) => ({ id: `${is.id}-c${i}`, author: c[0], tags: c[1], text: c[2], likes: Math.round(c[3] / 50), issue: is.id, ago: 1440 * (3 + i * 4), views: c[3] })),
]

const SORTS = [['pop', '인기순'], ['new', '최신순'], ['help', '도움이 많이 된 순'], ['cmt', '댓글 많은 순']] as const

const anon = (n: string) => `익명 · 자취 ${['3개월', '1년', '2년', '3년', '4년', '6년', '8년'][[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % 7]}차`

const agoText = (m: number) => (m < 1 ? '방금 전' : m < 60 ? `${m}분 전` : m < 1440 ? `${Math.floor(m / 60)}시간 전` : `${Math.floor(m / 1440)}일 전`)

const Bookmark = ({ className = '' }: { className?: string }) => <svg viewBox="0 0 24 24" className={`fill-brand stroke-white ${className}`} strokeWidth="1.2" aria-label="북마크"><path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4.5L5 22V3a1 1 0 0 1 1-1z" /></svg>

type View =
  | { n: 'home' } | { n: 'photo' } | { n: 'voice' } | { n: 'text' } | { n: 'loading' }
  | { n: 'result' } | { n: 'lib' } | { n: 'cat'; id: string } | { n: 'issue'; id: string }
  | { n: 'nearby'; id: string } | { n: 'msg'; id: string; sos?: boolean }
  | { n: 'sos' } | { n: 'sosact'; id: string }
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

const Header = ({ title, onBack, step }: { title: string; onBack?: () => void; step?: string }) => (
  <div className="sticky top-0 z-10 grid h-[58px] grid-cols-[84px_1fr_84px] items-center bg-bg/95 px-3 backdrop-blur-[14px]">
    <div>{onBack && <button onClick={onBack} aria-label="뒤로" className="flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-navy/5"><img src="/assets/chev-left.svg" alt="" className="h-6 w-6" /></button>}</div>
    <h1 className="truncate text-center text-base font-bold">{title}</h1>
    <div className="flex justify-end">{step && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">{step}</span>}</div>
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
  const [sel, setSel] = useState(0)
  const baseN = 4 + ([...is.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 19)
  const [watch, setWatch] = useState(baseN)
  useEffect(() => {
    setWatch(baseN)
    const t = setInterval(() => setWatch((w) => Math.max(2, w + (Math.random() < 0.5 ? -1 : 1))), 4000)
    return () => clearInterval(t)
  }, [baseN])
  const n = Math.max(1, Math.round(is.ratio / 10))
  const circ = 2 * Math.PI * 72
  const tiles = [['발생 원인', '🔍', is.cause], ['해결 방법', '🛠️', is.owner], ['필요 물품', '🧰', is.supplies.join(', ') || '없음'], ['소요 시간', '⏱️', is.time]]
  return (
    <div>
      <div className="px-1 pt-2">
        <p className="text-xs font-semibold text-brand">{is.cat} · 해결 사례</p>
        <h1 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.04em]">{is.emoji} {is.name}</h1>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#9ba3af]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#18A957]" />지금 {watch}명이 보는 중</div>
      </div>
      <div className="mt-4 flex items-center gap-5 rounded-[22px] bg-white p-5 shadow-[0_7px_11px_rgba(36,63,103,.06)]">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90"><circle cx="90" cy="90" r="72" fill="none" stroke="#eaf2ff" strokeWidth="16" /><circle cx="90" cy="90" r="72" fill="none" stroke="#3478f6" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${(circ * is.ratio) / 100} ${circ}`} /></svg>
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl font-bold text-brand">{is.ratio}<span className="text-base">%</span></span></div>
        </div>
        <div><p className="text-xs font-semibold text-[#9ba3af]">혼자만의 문제가 아니에요</p><p className="mt-1 text-base font-semibold leading-6 tracking-[-0.025em]">자취생 10명 중 {n}명이<br />겪은 문제예요</p></div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {tiles.map(([k, ic], i) => (
          <button key={k} onClick={() => setSel(i)} className={`flex h-[84px] flex-col items-center justify-center gap-1.5 rounded-[18px] border text-xs font-semibold transition active:scale-95 ${sel === i ? 'border-navy bg-navy text-white' : 'border-[#e8ecf2] bg-white text-[#788292]'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-[11px] text-lg ${sel === i ? 'bg-white/15' : 'bg-[#eaf2ff]'}`}>{ic}</span>{k}</button>
        ))}
      </div>
      <div className="mt-2 rounded-[22px] bg-white p-4 shadow-[0_7px_11px_rgba(36,63,103,.06)]"><div className="text-xs font-semibold text-brand">{tiles[sel][0]}</div><div className="mt-1 text-base font-semibold leading-6 tracking-[-0.025em]">{tiles[sel][2]}</div></div>
    </div>
  )
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
  const libRef = useRef<HTMLDivElement>(null)
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
  const [sortOpen, setSortOpen] = useState(false)
  const [planSel, setPlanSel] = useState('')
  const [vSel, setVSel] = useState('')
  const [openOnly, setOpenOnly] = useState(false)
  const [libIdx, setLibIdx] = useState(0)
  const [saved, setSaved] = useState<string[]>([])
  const [landlord, setLandlord] = useState({ name: '박OO 집주인', phone: '010-1234-5678' })
  const [housing, setHousing] = useState('원룸')
  const [phrase, setPhrase] = useState('어쩌지 도와줘')
  const [posts, setPosts] = useState<Post[]>(POSTS0)
  const [tagFilter, setTagFilter] = useState('')
  const [bookFilter, setBookFilter] = useState('')
  const [mapSel, setMapSel] = useState('')
  const [mapMode, setMapMode] = useState<'map' | 'list'>('map')
  const [mapCat, setMapCat] = useState('')
  const [wTags, setWTags] = useState<string[]>([])
  const [wText, setWText] = useState('')
  const [sosMode, setSosMode] = useState<'' | 'cam' | 'voice' | 'text'>('')
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
  const base = qn ? allPosts.filter(qMatch) : bookFilter ? postsFor(byId(bookFilter), posts) : posts.filter((p) => !tagFilter || p.tags.includes(tagFilter))
  const shown = [...base].sort(sort === 'new' ? (a, b) => (a.ago ?? 0) - (b.ago ?? 0) : sort === 'help' ? (a, b) => likeN(b) - likeN(a) : sort === 'cmt' ? (a, b) => cn(b) - cn(a) : (a, b) => score(b) - score(a))
  const addComment = (pid: string) => {
    if (!cText.trim()) return
    setComments((c) => ({ ...c, [pid]: [...(c[pid] || []), { id: Date.now(), author: '서*윤', kind: cKind, text: cText.trim(), ago: 0 }] }))
    setCText(''); flash(cKind === 'empathy' ? '공감을 남겼어요' : '의견을 남겼어요')
  }
  const postCard = (p: Post, wide = false) => {
    const k = String(p.id)
    const r = rankOf(p)
    const m = p.text.match(/^(.+?[.!?])\s+(.+)$/)
    const title = m ? m[1] : p.text
    const body = m ? m[2] : ''
    const nm = p.author.replace('*', '')
    return (
      <div key={k} role="button" tabIndex={0} onClick={() => go({ n: 'post', id: k })} className={`flex flex-col rounded-[22px] border border-[#e8ecf2] bg-white p-4 text-left shadow-[0_7px_11px_rgba(36,63,103,.06)] active:scale-[.99] ${wide ? 'w-[82%] shrink-0 snap-start' : ''}`}>
        <div className="flex items-center">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-[#dfedfa] text-xs font-semibold text-[#356da8]">{nm.slice(0, 1)}</span>
          <div className="min-w-0 flex-1 pl-[9px]"><div className="text-xs font-bold leading-6">{nm}***{r > 0 && !wide && <span className="ml-1.5 rounded-full bg-navy px-1.5 py-0.5 text-[11px] font-semibold text-white">{r}위</span>}</div><div className="text-xs leading-5 text-[#9ba3af]">{anon(p.author).split(' · ')[1]} · {agoText(p.ago ?? 0)}</div></div>
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
    const c = setTimeout(() => reset({ n: 'home' }, { n: 'result' }), 2700)
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c) }
  }, [view.n])

  const proceed = () => {
    setHistory((h) => [{ k: Date.now(), id: issue.id, days: 0, done: false }, ...h])
    setRecent((r) => [issue.id, ...r.filter((x) => x !== issue.id)].slice(0, 5))
    reset({ n: 'home' }, issue.sos ? { n: 'sosact', id: issue.id } : { n: 'issue', id: issue.id })
  }
  useEffect(() => {
    if (view.n !== 'result') return
    const t = setTimeout(proceed, issue.sos ? 3000 : 4500)
    return () => clearTimeout(t)
  }, [view.n])

  const goSos = (id: string) => { setIssueId(id); setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 5)); go({ n: 'sosact', id }) }
  const resetInputs = () => { setText(''); setPhoto(null); setTranscript(''); setRecording(false); setSecs(0) }
  const tabs = [
    ['home', '홈', '🏠', () => { resetInputs(); reset({ n: 'home' }) }],
    ['lib', '사례', '📖', () => reset({ n: 'lib' })],
    ['sos', '긴급 모드', '🚨', () => { setSosMode(''); reset({ n: 'sos' }) }],
    ['community', '커뮤니티', '💬', () => { setBookFilter(''); reset({ n: 'community' }) }],
    ['me', '더보기', '👤', () => reset({ n: 'me' })],
  ] as const
  const tabOf = (v: View) => (v.n === 'cat' || v.n === 'issue' || v.n === 'lib' || v.n === 'book' || v.n === 'nearby' || v.n === 'plan' ? 'lib' : v.n === 'sos' || v.n === 'sosact' ? 'sos' : v.n === 'write' || v.n === 'map' || v.n === 'post' ? 'community' : ['photo', 'voice', 'text', 'loading', 'result'].includes(v.n) ? 'home' : v.n === 'msg' ? (v.sos ? 'sos' : 'lib') : v.n)
  const isSos = view.n === 'sos' || view.n === 'sosact' || (view.n === 'msg' && view.sos)

  const IssueRow = ({ is, onClick }: { is: Issue; onClick: () => void }) => (
    <button onClick={onClick} className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-left active:scale-[.99]">
      <span className="text-2xl">{is.emoji}</span>
      <span className="flex-1 text-[15px] font-bold">{is.name}</span>
      {is.sos && <span className="rounded-full bg-sos px-2 py-0.5 text-[11px] font-bold text-white">긴급</span>}
      <span className="text-navy/30">›</span>
    </button>
  )

  return (
    <div className="flex min-h-screen justify-center">
      <div className={`relative flex h-screen w-full max-w-[430px] flex-col overflow-hidden shadow-xl ${isSos ? 'bg-calm' : 'bg-bg'}`}>
        <div ref={scroller} className="flex-1 overflow-y-auto">
          {view.n === 'home' && (
            <div className="fadeup min-h-full px-5 pb-8 pt-5">
              <div className="flex items-start justify-between px-[3px] pb-5 pt-1">
                <h1 className="pt-[7px] text-[28px] font-bold leading-10 tracking-[-0.04em]">서윤님의<br /><span className="font-semibold text-[#8a93a3]">생활 해결 책장</span></h1>
                <button onClick={() => tabs[4][3]()} aria-label={`내 정보 (${housing})`} className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white shadow-[0_7px_9.5px_rgba(43,64,96,.1)]"><img src="/assets/53c7d.svg" alt="" className="h-6 w-6" /></button>
              </div>

              <button onClick={() => tabs[2][3]()} className="flex w-full items-center rounded-[20px] border border-[#dbe7fb] bg-[#edf4ff] p-[14px] text-left active:scale-[.99]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#d9e8ff]"><img src="/assets/baeca.svg" alt="" className="h-6 w-6" /></span>
                <span className="min-w-0 flex-1 pl-3"><span className="block text-base font-semibold text-[#31598e]">긴급한 문제인가요?</span><span className="block text-sm text-[#6e83a0]">지금 먼저 할 일을 빠르게 알려드려요</span></span>
                <img src="/assets/0de08.svg" alt="" className="h-6 w-6" />
              </button>

              <h2 className="mb-3 mt-7 text-xl font-semibold tracking-[-0.01em]">무슨 문제가 생겼나요?</h2>
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
                <div className="flex flex-wrap gap-2 px-[23px] pt-4">
                  {['화장실', '보일러', '수도·수질', '곰팡이'].map((c) => (
                    <button key={c} onClick={() => go({ n: 'cat', id: c })} className="h-9 rounded-full bg-white px-4 text-sm font-medium text-brand shadow-[0_7px_10px_rgba(36,63,103,.05)]">{CATEGORIES.find((x) => x.id === c)?.emoji} {c}</button>
                  ))}
                </div>
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
              <h1 className="mt-1 text-[28px] font-black leading-tight">{issue.sos ? `${issue.name.replace('요', '')}, 지금 바로 대처가 필요해요.` : `${issue.name.replace(/요$/, '')} 문제로 확인했어요.`}</h1>
              <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl bg-white">
                {[['문제 분류', `${issue.cat} · ${issue.name}`], ['예상 긴급도', issue.urgency], ['설명', `${issue.cause} 가능성이 있어요.`], ['추천 다음 단계', issue.sos ? '지금 당장 해야 할 일부터 따라 해주세요.' : `비슷한 사례를 보고 ${issue.owner.split(',')[0]} 여부를 정해보세요.`]].map(([k, v]) => (
                  <div key={k} className="p-4"><div className="text-xs font-bold text-navy/50">{k}</div>
                    <div className={k === '예상 긴급도' ? `mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-bold ${issue.sos ? 'bg-sos text-white' : 'bg-brand-soft text-brand'}` : 'mt-0.5 text-[15px] leading-relaxed'}>{v}</div></div>
                ))}
              </div>
              <div className={`mt-5 rounded-2xl p-4 text-sm font-bold ${issue.sos ? 'bg-navy text-white' : 'bg-brand text-white'}`}>
                {issue.sos ? '🚨 긴급 상황이에요. SOS 모드로 이동합니다…' : '✅ 일반 문제예요. 해결 사례로 이동합니다…'}
                <div className="mt-2 h-1 overflow-hidden rounded bg-white/25"><div className="h-full bg-white" style={{ animation: `bar ${issue.sos ? 3 : 4.5}s linear forwards` }} /></div>
              </div>
              <div className="mt-4"><Btn kind={issue.sos ? 'sos' : 'main'} onClick={proceed}>{issue.sos ? '지금 바로 확인하기' : '해결 사례 보기'}</Btn></div>
            </div>
          )}

          {view.n === 'lib' && (
            <div className="fadeup">
              <Header title="해결 사례" />
              <div className="px-5 pb-8 pt-1">
                <h2 className="text-base font-black">어떻게 찾아볼까요?</h2>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {([['photo', I.camera, '사진'], ['voice', I.mic, '음성'], ['text', I.pen, '텍스트']] as const).map(([k, ic, l]) => (
                    <button key={k} onClick={() => { resetInputs(); go({ n: k }) }} className="flex h-20 flex-col items-center justify-center gap-1 rounded-2xl bg-white text-sm font-bold text-brand active:scale-[.97]"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft [&>svg]:h-5 [&>svg]:w-5">{ic}</span>{l}</button>
                  ))}
                </div>
                <h2 className="mt-7 text-base font-black">또는 생활공간으로 찾기</h2>
                <p className="mt-1 text-xs text-navy/50">책등을 눌러 문제 책을 펼쳐보세요.</p>
                <button onClick={() => { setPlanSel(''); go({ n: 'plan' }) }} className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm active:scale-[.98]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft"><svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-brand" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 11h9V3M12 11v10M12 15h9" /></svg></span>
                  <span className="flex-1"><span className="block text-[15px] font-black">우리 집 2D 지도로 찾기</span><span className="text-xs text-navy/50">방을 누르면 생길 수 있는 문제를 보여줘요</span></span><span className="text-navy/30">›</span>
                </button>
                {(() => {
                  const allBooks = CATEGORIES.flatMap((c) => ISSUES.filter((i) => i.cat === c.id))
                  const cur = allBooks[libIdx] || allBooks[0]
                  const jump = (k: number) => { setLibIdx(k); (libRef.current?.children[k] as HTMLElement | undefined)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }) }
                  return (
                    <>
                      <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
                        {CATEGORIES.map((c) => (
                          <button key={c.id} onClick={() => jump(allBooks.findIndex((b) => b.cat === c.id))} className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl text-[10px] font-bold transition ${cur.cat === c.id ? 'bg-brand text-white shadow-md shadow-brand/25' : 'bg-white text-navy/60'}`}><span className="text-xl">{c.emoji}</span>{c.id}</button>
                        ))}
                      </div>
                      <div className="mt-5">
                        <div className="flex items-center justify-between"><h3 className="text-xl font-black">{cur.cat}</h3><span className="text-xs font-bold text-navy/40">{libIdx + 1} / {allBooks.length} · 옆으로 밀어보세요</span></div>
                        <div ref={libRef} onScroll={(e) => { const el = e.currentTarget; const c = el.scrollLeft + el.clientWidth / 2; let best = 0, bd = 1e9; Array.from(el.children).forEach((ch, k) => { const h = ch as HTMLElement; const d = Math.abs(h.offsetLeft + h.offsetWidth / 2 - c); if (d < bd) { bd = d; best = k } }); setLibIdx(best) }} className="relative -mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[15%] pb-4 pt-1">
                          {allBooks.map((b, k) => (
                            <button key={b.id} onClick={() => (k === libIdx ? go({ n: 'book', id: b.id }) : jump(k))} aria-label={b.name} className={`relative aspect-[3/4] w-[70%] shrink-0 snap-center overflow-hidden rounded-[28px] bg-brand text-left text-white shadow-xl transition-all duration-300 ${k === libIdx ? 'scale-100' : 'scale-[.9] opacity-70'}`}>
                              <Photo id={b.id} className="absolute inset-0 h-full w-full" />
                              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                              <span className="absolute inset-y-0 left-0 w-2 bg-black/20" />
                              {b.sos && <span className="absolute left-4 top-3 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black text-sos">긴급</span>}
                              {markedBooks.includes(b.id) && <Bookmark className="absolute right-5 top-0 h-10 w-8 drop-shadow" />}
                              <span className="absolute inset-x-0 bottom-0 p-5"><span className="block text-xs font-bold opacity-80">{b.cat}</span><span className="mt-1 block text-2xl font-black leading-tight">{b.name}</span></span>
                            </button>
                          ))}
                        </div>
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

          {view.n === 'cat' && (
            <div className="fadeup">
              <Header title={view.id} onBack={back} />
              <div className="space-y-2 px-5 pt-4 pb-8">
                <p className="mb-2 text-sm text-navy/60">어떤 문제인가요?</p>
                {ISSUES.filter((i) => i.cat === view.id).map((i) => <IssueRow key={i.id} is={i} onClick={() => (i.sos ? (() => { setIssueId(i.id); go({ n: 'sosact', id: i.id }) })() : openIssue(i.id))} />)}
              </div>
            </div>
          )}

          {view.n === 'issue' && (() => {
            const is = byId(view.id)
            return (
              <div className="fadeup">
                <Header title={is.cat} onBack={back} />
                <div className="space-y-5 px-5 pt-4 pb-40">
                  <IssueTop is={is} />
                  <section>
                    <h2 className="mb-3 px-1 text-sm font-semibold text-[#4f5c6f]">비슷한 자취생 사례</h2>
                    <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5">{postsFor(is, []).map((p) => postCard(p, true))}</div>
                  </section>
                  <Timeline is={is} />
                </div>
                <div className="absolute inset-x-0 bottom-[84px] z-10 grid grid-cols-2 gap-2 bg-gradient-to-t from-bg via-bg/95 to-transparent px-5 pb-2 pt-4">
                  <Btn kind="ghost" onClick={() => go({ n: 'nearby', id: is.id })}>주변 업체 찾기</Btn>
                  <Btn onClick={() => go({ n: 'msg', id: is.id })}>집주인에게 연락하기</Btn>
                </div>
              </div>
            )
          })()}

          {view.n === 'nearby' && (() => {
            const now = new Date()
            const day = '일월화수목금토'[now.getDay()]
            const mins = now.getHours() * 60 + now.getMinutes()
            const toM = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3)
            const status = (v: (typeof VENDORS)[number]) => (v.off === day ? 'off' : mins >= toM(v.open) && mins < toM(v.close) ? 'open' : 'closed')
            const list = VENDORS.filter((v) => !openOnly || status(v) === 'open').sort((a, b) => (status(a) === 'open' ? 0 : 1) - (status(b) === 'open' ? 0 : 1))
            const sel = VENDORS.find((v) => v.id === vSel)
            const chip = { open: ['영업중', 'bg-[#E3F6EA] text-[#18853F]'], closed: ['영업 종료', 'bg-navy/10 text-navy/60'], off: ['오늘 휴무', 'bg-sos-soft text-sos'] } as const
            return (
              <div className="fadeup">
                <Header title="주변 업체 찾기" onBack={back} />
                <div className="space-y-3 px-5 pb-8 pt-3">
                  <div className="relative h-56 overflow-hidden rounded-3xl bg-[#e9eef7]">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                      <path d="M0 40H100M0 70H100M35 0V100M68 0V100" stroke="white" strokeWidth="3.2" fill="none" />
                      <path d="M0 15L100 90" stroke="white" strokeWidth="2" fill="none" />
                      <rect x="40" y="44" width="24" height="22" rx="2" fill="#d6dcf5" /><rect x="4" y="46" width="26" height="20" rx="2" fill="#d6dcf5" /><rect x="72" y="46" width="24" height="20" rx="2" fill="#d6dcf5" />
                      {sel && <line x1="50" y1="55" x2={sel.x} y2={sel.y} stroke="#3478f6" strokeWidth="0.8" strokeDasharray="2 2" />}
                    </svg>
                    {VENDORS.map((v) => {
                      const st = status(v)
                      return (
                        <button key={v.id} onClick={() => setVSel(v.id === vSel ? '' : v.id)} aria-label={v.name} style={{ left: `${v.x}%`, top: `${v.y}%` }} className="absolute -translate-x-1/2 -translate-y-full">
                          <span className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-base shadow-md transition ${vSel === v.id ? 'scale-125 border-brand bg-brand' : st === 'open' ? 'border-brand bg-white' : 'border-navy/20 bg-white opacity-60'}`}>🛠️</span>
                          <span className="mt-0.5 block whitespace-nowrap rounded-full bg-white/90 px-1.5 text-[9px] font-bold">{v.name.split(' ')[0]}</span>
                        </button>
                      )
                    })}
                    <div style={{ left: '50%', top: '55%' }} className="absolute -translate-x-1/2 -translate-y-1/2">
                      <span className="absolute inset-0 rounded-full bg-brand" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
                      <span className="relative block h-4 w-4 rounded-full border-[3px] border-white bg-brand shadow" />
                      <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">내 위치</span>
                    </div>
                    <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-navy/60">🛠️ 업체 · 회색은 지금 영업 안 해요</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-navy/50">오늘은 {day}요일 · 현재 시각 기준이에요</span>
                    <button onClick={() => setOpenOnly(!openOnly)} role="switch" aria-checked={openOnly} className={`h-9 rounded-full px-3 text-xs font-bold ${openOnly ? 'bg-brand text-white' : 'bg-white text-navy/60'}`}>영업중만 보기</button>
                  </div>
                  {list.map((v) => {
                    const st = status(v)
                    return (
                      <div key={v.id} onClick={() => setVSel(v.id)} className={`rounded-2xl bg-white p-4 shadow-sm ${vSel === v.id ? 'ring-2 ring-brand' : ''}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div><div className="text-[16px] font-black">{v.name}</div>
                            <div className="mt-1 flex items-center gap-1.5 text-sm"><span className="text-[#F5A524]">{'★'.repeat(Math.round(v.rating))}</span><span className="font-black">{v.rating}</span><span className="text-xs text-navy/50">리뷰 {v.reviews}개</span></div></div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${chip[st][1]}`}>{st === 'open' && '● '}{chip[st][0]}</span>
                        </div>
                        <div className="mt-2 text-xs text-navy/60">📍 {v.dist} · {v.open === '00:00' && v.close === '24:00' ? '24시간' : `${v.open}–${v.close}`} · {v.off ? `휴무 매주 ${v.off}요일` : '연중무휴'}</div>
                        <div className="mt-3 flex flex-wrap gap-1.5">{v.tags.map(([t, c]) => <span key={t as string} className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand">{t} <span className="opacity-60">{c}</span></span>)}</div>
                        <button disabled={st !== 'open'} onClick={(e) => { e.stopPropagation(); flash(`${v.name}에 전화 연결 중… (시연)`) }} className={`mt-3 h-11 w-full rounded-xl text-sm font-bold ${st === 'open' ? 'bg-navy text-white' : 'bg-navy/10 text-navy/40'}`}>{st === 'open' ? '전화' : st === 'off' ? '오늘은 쉬어요' : '영업 시간이 아니에요'}</button>
                      </div>
                    )
                  })}
                  {!list.length && <p className="rounded-2xl bg-white p-4 text-center text-sm text-navy/50">지금 영업 중인 업체가 없어요.</p>}
                  <div className="rounded-2xl bg-brand-soft p-3 text-xs font-medium text-brand">업체 예약은 연결되지 않아요. 전화로 방문 전 견적 범위를 먼저 물어보세요.</div>
                  <p className="text-xs text-navy/50">수리 비용과 책임 소재는 서비스에서 확정하지 않아요. 입주 계약과 집주인 안내를 확인하세요.</p>
                </div>
              </div>
            )
          })()}

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
                          <button key={i.id} onClick={() => (i.sos ? (() => { setIssueId(i.id); go({ n: 'sosact', id: i.id }) })() : openIssue(i.id))} className="flex h-24 flex-col items-center justify-center gap-1 rounded-xl bg-bg px-1 text-center text-[12px] font-bold leading-tight active:scale-[.97]"><span className="text-2xl">{i.emoji}</span>{i.name}<span className="text-[10px] font-medium text-navy/40">{PLACES.find((pl) => pl.issues.includes(i.id))?.name}</span></button>
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
                        <div className="grid max-h-[250px] grid-cols-3 gap-2 overflow-y-auto pb-1">{place.issues.map((id) => byId(id)).map((i) => <button key={i.id} onClick={() => (i.sos ? (() => { setIssueId(i.id); go({ n: 'sosact', id: i.id }) })() : openIssue(i.id))} className="relative flex h-28 flex-col items-center justify-center gap-2 rounded-2xl bg-white px-2 text-center text-[13px] font-bold leading-tight shadow-sm active:scale-[.97]"><span className="text-3xl">{i.emoji}</span>{i.name}{i.sos && <span className="absolute right-2 top-2 rounded-full bg-sos-soft px-1.5 text-[9px] font-black text-sos">긴급</span>}</button>)}</div>
                      </div>
                    ) : <p className="rounded-2xl bg-brand-soft p-4 text-sm font-medium text-brand">아직 선택한 방이 없어요. 위 지도에서 방을 눌러보세요.</p>}
                  </div>
                </div>
              </div>
            )
          })()}

          {view.n === 'msg' && <MsgView is={byId(view.id)} landlord={landlord} sos={!!view.sos} onBack={back} onDone={() => { flash('전송했어요 (시연)'); reset({ n: 'home' }) }} />}

          {view.n === 'sos' && (
            <div className="fadeup min-h-full px-5 pb-8 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold tracking-wide text-[#eb5056]">SOS</span>
                <button onClick={() => (sosMode ? setSosMode('') : tabs[0][3]())} aria-label={sosMode ? '뒤로' : '긴급 모드 닫기'} className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white shadow-[0_7px_10px_rgba(36,63,103,.05)]"><img src="/assets/ac808.svg" alt="" className="h-6 w-6" /></button>
              </div>
              <div className="mt-2 flex gap-2" aria-hidden>{[0, 1, 2, 3].map((k) => <span key={k} className={`h-[3px] flex-1 rounded-full ${k === 0 || (sosMode && k === 1) ? 'bg-[#eb5056]' : 'bg-[#e1e5ec]'}`} />)}</div>
              {sosMode === 'voice' ? <SosVoice phrase={phrase} onGo={goSos} /> : sosMode === 'text' ? <SosText onGo={goSos} /> : (<>
                <div className="mt-9 flex flex-col items-center text-center">
                  <span className="flex h-[122px] w-[122px] items-center justify-center rounded-[40px] bg-[#ffe3e5] shadow-[0_10px_24px_rgba(235,80,86,.12)]"><span className="flex h-[72px] w-[72px] items-center justify-center rounded-[26px] bg-white"><img src="/assets/997cd.svg" alt="" className="h-7 w-7" /></span></span>
                  <p className="mt-6 text-xs font-semibold text-[#eb5056]">긴급 문제 접수</p>
                  <h1 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.04em]">어떤 방법으로<br />상황을 알려주시겠어요?</h1>
                  <p className="mt-4 text-xs leading-5 text-[#7e8797]">가장 편한 방법을 선택하면 지금 필요한 조치를 빠르게 찾아드려요.</p>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-2">
                  {([['cam', 'ddedc', '카메라', '사진으로 인식'], ['voice', '0d5ab', '음성인식', '말로 설명'], ['text', 'd96a2', '직접 입력', '글로 설명']] as const).map(([m, ic, t1, t2]) => (
                    <button key={m} onClick={() => setSosMode(m)} className="flex h-[116px] flex-col items-center justify-center rounded-[22px] border border-[#e8ecf2] bg-white shadow-[0_7px_10px_rgba(36,63,103,.05)] active:scale-[.97]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#eaf2ff]"><img src={`/assets/${ic}.svg`} alt="" className="h-6 w-6" /></span>
                      <span className="mt-3 text-sm font-bold">{t1}</span><span className="text-xs text-[#8791a0]">{t2}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-center text-xs text-[#9ba4b1]">음성 호출 문구 · “{phrase}”</p>
                <div className="pt-5">
                  <div className="mb-2 text-sm font-semibold text-[#4f5c6f]">촬영이 어렵다면 직접 선택</div>
                  <div className="grid max-h-[262px] grid-cols-3 gap-2 overflow-y-auto pb-1">{[...ISSUES.filter((i) => i.sos), ...['sink', 'boilerHot', 'boilerErr', 'drain', 'washDrain', 'flicker', 'rust', 'fridge'].map(byId)].map((i) => (
                    <button key={i.id} onClick={() => goSos(i.id)} className="flex h-[84px] flex-col items-center justify-center gap-1.5 rounded-[18px] border border-[#e8ecf2] bg-white px-1 shadow-[0_5px_8px_rgba(36,63,103,.04)] active:scale-[.97]">
                      <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eaf2ff] text-xl">{i.emoji}</span>
                      <span className="line-clamp-1 w-full text-center text-xs font-semibold">{i.name.length > 9 ? i.name.slice(0, 8) + '…' : i.name}</span>
                    </button>
                  ))}</div>
                </div>
              </>)}
            </div>
          )}

          {view.n === 'sosact' && <SosAct is={byId(view.id)} onBack={back} onMsg={() => go({ n: 'msg', id: byId(view.id).id, sos: true })} onCases={() => openIssue(view.id)} onCall={(c) => flash(`${c}로 전화 연결 중… (시연)`)} />}

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
                          <button key={i.id} onClick={() => (i.sos ? (() => { setIssueId(i.id); go({ n: 'sosact', id: i.id }) })() : openIssue(i.id))} className="flex w-36 shrink-0 items-center gap-2 rounded-xl bg-bg p-2 text-left active:scale-[.97]">
                            <Photo id={i.id} className="h-10 w-10 shrink-0 rounded-lg" /><span className="text-[13px] font-bold leading-tight">{i.name}</span>
                          </button>
                        ))}</div>
                      </>
                    ) : <p className="mt-2 text-sm text-navy/50">비슷한 문제를 찾지 못했어요. 장소나 증상을 더 적어보세요.</p>}
                  </div>
                )}
                <div className="px-1 pb-4 pt-5"><p className="text-xs font-semibold text-brand">혼자 고민하지 않아도 돼요</p><h2 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.04em]">먼저 겪어본 사람들의<br />생활 해결 노트</h2></div>
                <div className="mb-3 flex gap-2">
                  <button className="h-9 flex-1 rounded-[18px] border border-navy bg-navy text-xs font-semibold text-white">목록</button>
                  <button onClick={() => { setMapSel(''); go({ n: 'map' }) }} className="h-9 flex-1 rounded-[18px] border border-[#e4e8ef] bg-white text-xs font-semibold text-[#788292]">지도</button>
                </div>
                {bookFilter && <div className="mb-3 flex items-center justify-between rounded-2xl border-2 border-brand bg-white px-4 py-3 text-sm font-bold">📖 {byId(bookFilter).name} 사례<button onClick={() => setBookFilter('')} aria-label="필터 해제" className="text-navy/50">✕</button></div>}
                <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
                  {['', ...TAGS].map((t) => <button key={t} onClick={() => setTagFilter(t)} className={`h-9 shrink-0 rounded-[18px] border px-[15px] text-xs font-semibold ${tagFilter === t ? 'border-navy bg-navy text-white' : 'border-[#e4e8ef] bg-white text-[#788292]'}`}>{t ? t : '추천'}</button>)}
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
            return (
              <div className="fadeup">
                <Header title="게시글" onBack={back} />
                <div className="space-y-4 px-5 pb-40 pt-2">
                  <Photo id={p.issue} className="h-52 w-full rounded-3xl" />
                  <div className="flex flex-wrap gap-1">{p.tags.map((t) => <Tag key={t} t={t} />)}</div>
                  <p className="text-[17px] leading-relaxed">{p.text}</p>
                  <div className="text-xs text-navy/50">{anon(p.author)} · {agoText(p.ago ?? 0)} · 👀 {(p.views ?? 0).toLocaleString()}</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => toggleLike(p.id)} className={`h-14 rounded-2xl text-sm font-bold ${liked.includes(k) ? 'bg-brand text-white' : 'bg-white text-navy'}`}>👍 좋아요 {likeN(p)}</button>
                    <button onClick={() => { toggleSave(k); flash(saved.includes(k) ? '저장을 취소했어요' : '내 정보에 저장했어요') }} className={`h-14 rounded-2xl text-sm font-bold ${saved.includes(k) ? 'bg-brand text-white' : 'bg-white text-navy'}`}>🔖 {saved.includes(k) ? '저장됨' : '저장하기'}</button>
                    <button onClick={() => document.getElementById('cinput')?.focus()} className="h-14 rounded-2xl bg-white text-sm font-bold">💬 댓글 {cs.length}</button>
                  </div>
                  <button onClick={() => !isRep && setReportFor(k)} className="text-xs font-bold text-navy/40 underline">{isRep ? '신고한 글이에요' : '🚩 신고하기'}</button>
                  <section>
                    <h2 className="mb-2 text-base font-black">댓글 {cs.length}</h2>
                    <div className="space-y-2">
                      {cs.map((c) => (
                        <div key={c.id} className="rounded-2xl bg-white p-3 shadow-sm">
                          <div className="flex items-center gap-2 text-xs text-navy/50"><span className="font-bold text-navy">{anon(c.author)}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${c.kind === 'empathy' ? 'bg-brand-soft text-brand' : 'bg-navy/10 text-navy/70'}`}>{c.kind === 'empathy' ? '🙌 공감' : '💡 다른 의견'}</span><span>{agoText(c.ago)}</span>
                            <button onClick={() => flash('신고가 접수됐어요 (시연)')} className="ml-auto text-navy/30">신고</button></div>
                          <p className="mt-1.5 text-[15px] leading-snug">{c.text}</p>
                        </div>
                      ))}
                      {!cs.length && <p className="rounded-2xl bg-brand-soft p-4 text-sm text-brand">첫 댓글로 공감이나 다른 의견을 남겨보세요.</p>}
                    </div>
                  </section>
                </div>
                <div className="absolute inset-x-0 bottom-[84px] z-10 space-y-2 border-t border-line bg-white px-4 py-3">
                  <div className="flex gap-2">{([['empathy', '🙌 공감해요'], ['opinion', '💡 다른 의견']] as const).map(([kk, l]) => <button key={kk} onClick={() => setCKind(kk)} className={`h-8 rounded-full px-3 text-xs font-bold ${cKind === kk ? 'bg-brand text-white' : 'bg-brand-soft text-brand'}`}>{l}</button>)}</div>
                  <div className="flex gap-2">
                    <input id="cinput" value={cText} onChange={(e) => setCText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addComment(k)} placeholder={cKind === 'empathy' ? '공감한 이유를 남겨보세요' : '다른 의견을 남겨보세요'} className="h-11 min-w-0 flex-1 rounded-xl border-2 border-line px-3 text-sm outline-none focus:border-brand" />
                    <button onClick={() => addComment(k)} disabled={!cText.trim()} className="h-11 rounded-xl bg-brand px-4 text-sm font-bold text-white disabled:bg-navy/20">등록</button>
                  </div>
                </div>
                {reportFor === k && (
                  <div className="absolute inset-0 z-30 flex items-end bg-black/40" onClick={() => setReportFor('')}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full rounded-t-3xl bg-white p-5 pb-8">
                      <h3 className="text-lg font-black">신고 사유를 선택해주세요</h3>
                      <div className="mt-3 space-y-2">{['광고·홍보', '욕설·비방', '잘못된 정보', '개인정보 노출'].map((r) => <button key={r} onClick={() => { setReported([...reported, k]); setReportFor(''); flash('신고가 접수됐어요 (시연)') }} className="flex h-12 w-full items-center rounded-xl border border-line px-4 text-left font-bold">{r}</button>)}</div>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {view.n === 'write' && (
            <div className="fadeup">
              <Header title="사례 공유하기" onBack={back} />
              <div className="space-y-4 px-5 pt-4">
                <div><div className="mb-2 text-sm font-black">문제 태그 선택 <span className="font-medium text-navy/50">(1개 이상)</span></div>
                  <div className="flex flex-wrap gap-2">{TAGS.map((t) => <button key={t} onClick={() => setWTags(wTags.includes(t) ? wTags.filter((x) => x !== t) : [...wTags, t])} className={`h-11 rounded-full px-4 text-sm font-bold ${wTags.includes(t) ? 'bg-brand text-white' : 'border border-line'}`}>#{t}</button>)}</div></div>
                <textarea value={wText} onChange={(e) => setWText(e.target.value)} placeholder="어떻게 해결했는지 알려주세요. 이름과 주소 등 개인정보는 쓰지 마세요." className="h-44 w-full resize-none rounded-2xl border-2 border-line p-4 outline-none focus:border-brand" />
                <Btn disabled={!wTags.length || !wText.trim()} onClick={() => { setPosts([{ id: Date.now(), author: '서*윤', tags: wTags, text: wText, likes: 0, ago: 0, views: 0 }, ...posts]); setTagFilter(''); reset({ n: 'community' }); flash('사례가 등록됐어요') }}>등록하기</Btn>
              </div>
            </div>
          )}

          {view.n === 'me' && (
            <div className="fadeup">
              <Header title="더보기" />
              <div className="px-5 pb-10 pt-[18px]">
                <div className="flex items-center rounded-3xl bg-gradient-to-br from-[#edf4ff] to-white p-[18px]">
                  <span className="flex h-[54px] w-[54px] items-center justify-center rounded-[19px] bg-brand text-base font-bold text-white">서</span>
                  <div className="min-w-0 flex-1 pl-[13px]"><div className="text-base font-bold">김서윤</div><div className="text-xs text-[#8290a2]">자취 6개월 · {housing}</div></div>
                </div>
                <div className="mt-[10px] flex items-center rounded-[21px] bg-white px-2 py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]">
                  {([['저장한 사례', saved.length], ['해결한 문제', history.filter((h) => h.done).length], ['작성한 글', Math.max(0, posts.length - POSTS0.length)]] as const).map(([l, n], k) => (
                    <div key={l} className={`flex flex-1 flex-col items-center ${k ? 'border-l border-[#e7eaf0]' : ''}`}><span className="text-lg font-bold text-brand">{n}</span><span className="text-xs text-[#8791a0]">{l}</span></div>
                  ))}
                </div>
              </div>
              <div className="space-y-[14px] px-5 pb-10">
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]"><h2 className="mb-3 text-xs font-semibold text-[#9aa3b0]">저장한 해결 사례</h2>
                  {saved.length ? <div className="space-y-2">{saved.map((k) => { const sp = findPost(k); if (!sp) return null; return <button key={k} onClick={() => go({ n: 'post', id: k })} className="relative w-full rounded-2xl border border-line p-3 pr-10 text-left text-sm"><Bookmark className="absolute right-3 top-0 h-6 w-6" /><span className="font-bold">{sp.issue ? byId(sp.issue).name : '커뮤니티 글'}</span><br /><span className="text-navy/60">{sp.text.slice(0, 36)}…</span></button> })}</div> : <p className="rounded-2xl bg-brand-soft p-4 text-sm text-brand">사례의 '저장하기'를 누르면 여기에 저장돼요.</p>}</section>
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]">
                  <div className="mb-2 flex items-center justify-between"><h2 className="text-xs font-semibold text-[#9aa3b0]">우리 집 문제 기록</h2><span className="text-xs font-bold text-navy/45">총 {history.length}건 · 해결 {history.filter((h) => h.done).length}건</span></div>
                  <div className="space-y-2">{history.map((h) => {
                    const it = byId(h.id)
                    const d = new Date(Date.now() - h.days * 86400000)
                    return (
                      <div key={h.k} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                        <button onClick={() => (it.sos ? (() => { setIssueId(it.id); go({ n: 'sosact', id: it.id }) })() : openIssue(it.id))} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`${it.name} 다시 보기`}>
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
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]"><h2 className="mb-3 text-xs font-semibold text-[#9aa3b0]">주거 형태</h2>
                  <div className="flex gap-2">{['원룸', '투룸', '오피스텔', '다세대'].map((h) => <button key={h} onClick={() => setHousing(h)} className={`h-11 flex-1 rounded-full text-sm font-bold ${housing === h ? 'bg-brand text-white' : 'border border-line'}`}>{h}</button>)}</div></section>
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]"><h2 className="mb-3 text-xs font-semibold text-[#9aa3b0]">SOS 음성 호출 문구</h2>
                  <input value={phrase} onChange={(e) => setPhrase(e.target.value)} className="h-12 w-full rounded-xl border border-[#dce4ee] bg-white px-4 outline-none focus:border-sos" aria-label="SOS 음성 문구" /></section>
                <Btn onClick={() => flash('저장했어요')}>저장하기</Btn>
                <section className="rounded-[22px] bg-white px-[18px] py-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]"><h2 className="mb-3 text-xs font-semibold text-[#9aa3b0]">최근 확인한 문제</h2><div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1">{recent.map((id) => (
                  <button key={id} onClick={() => openIssue(id)} className="w-40 shrink-0 rounded-2xl bg-white p-3 text-left shadow-sm active:scale-[.97]"><Photo id={id} className="h-20 w-full rounded-xl" /><span className="mt-2 block text-sm font-bold leading-tight">{byId(id).name}</span><span className="text-[11px] text-navy/40">{byId(id).cat}</span></button>
                ))}</div></section>
              </div>
            </div>
          )}
        </div>

        {view.n === 'community' && <button onClick={() => { setWTags([]); setWText(''); go({ n: 'write' }) }} className="absolute bottom-[100px] right-5 z-20 h-12 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_8px_11px_rgba(52,120,246,.3)] active:scale-95"><img src="/assets/aaae9.svg" alt="" className="mr-1.5 inline h-5 w-5 align-[-4px]" />글쓰기</button>}

        {view.n === 'photo' && <CameraView onBack={back} onAnalyze={(t) => analyze('photo', t)} />}
        {view.n === 'sos' && sosMode === 'cam' && <CameraView sos onBack={() => setSosMode('')} onAnalyze={(t) => goSos(classify(t).id)} />}

        <div aria-hidden={!booting} className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${booting ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <div className="flex text-[56px] font-black tracking-tight text-brand">{'어쩌집'.split('').map((ch, i) => <span key={i} style={{ animation: 'rise .6s ease both', animationDelay: `${0.15 + i * 0.18}s` }}>{ch}</span>)}</div>
          <p className="mt-3 text-sm font-medium text-brand/60" style={{ animation: 'rise .6s ease both', animationDelay: '0.9s' }}>자취방 문제, 어쩌지 싶을 때</p>
          <div className="mt-10 h-1 w-24 overflow-hidden rounded-full bg-brand-soft"><div className="h-full w-1/3 rounded-full bg-brand" style={{ animation: 'load 1.1s ease-in-out infinite' }} /></div>
        </div>

        {toast && <div className="fadeup absolute inset-x-6 bottom-24 z-30 rounded-2xl bg-navy px-4 py-3 text-center text-sm font-medium text-white">{toast}</div>}

        <nav className="relative z-20 mx-4 mb-3 grid h-[70px] shrink-0 grid-cols-5 rounded-[24px] border border-[#dce4ee] bg-white/95 px-2 pb-2.5 pt-2 shadow-xl backdrop-blur-[18px]">
          {tabs.map(([k, l, , fn]) => k === 'sos' ? (
            <button key={k} onClick={fn} className="relative flex flex-col items-center justify-end gap-[3px] active:scale-95">
              <span className="absolute -top-[29px] flex h-[51px] w-[51px] items-center justify-center rounded-[18px] border-[3.4px] border-white bg-gradient-to-br from-[#ff6c68] to-[#e8444a] shadow-[0_8px_9px_rgba(232,68,74,.28)]"><img src="/assets/24bea.svg" alt="" className="h-6 w-6" /></span>
              <span className="text-xs font-semibold leading-6 text-[#e65353]">{l}</span>
            </button>
          ) : (
            <button key={k} onClick={fn} className={`flex flex-col items-center justify-center gap-[3px] text-xs font-semibold ${tabOf(view) === k ? 'text-brand' : 'text-[#939cab]'}`}>
              <img src={`/assets/${NAVICON[k]}-${tabOf(view) === k ? 'on' : 'off'}.svg`} alt="" className="h-6 w-6" />{l}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

function Timeline({ is }: { is: Issue }) {
  const [cur, setCur] = useState(0)
  const [ex, setEx] = useState(-1)
  const labels = ['확인', '조치', '결과 확인']
  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-1"><h2 className="text-sm font-semibold text-[#4f5c6f]">해결 단계</h2><span className="text-xs font-semibold text-brand">{Math.min(cur + 1, 3)} / 3</span></div>
      <div className="mb-3 flex gap-2" aria-hidden>{[0, 1, 2].map((k) => <span key={k} className={`h-[3px] flex-1 rounded-full ${k <= cur ? 'bg-brand' : 'bg-[#e1e5ec]'}`} />)}</div>
      <ol className="space-y-2">
        {is.steps.map((s, i) =>
          i < cur ? (
            <li key={s}><button onClick={() => setCur(i)} className="flex h-14 w-full items-center gap-3 rounded-[18px] border border-[#e8ecf2] bg-white px-4 text-left"><span className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#eaf2ff] text-sm font-bold text-brand">✓</span><span className="flex-1 truncate text-sm font-semibold">{labels[i]}</span><span className="text-xs font-semibold text-brand">다시 보기</span></button></li>
          ) : i === cur ? (
            <li key={s} className="rounded-[22px] bg-white p-5 shadow-[0_7px_11px_rgba(36,63,103,.06)]">
              <p className="text-xs font-semibold text-brand">{i + 1} · {labels[i]}</p>
              <button onClick={() => setEx(ex === i ? -1 : i)} aria-expanded={ex === i} className="mt-2 flex w-full items-start justify-between gap-2 text-left"><span className="text-lg font-semibold leading-7 tracking-[-0.03em]">{s}</span><span className={`mt-1 text-[#9ba3af] transition ${ex === i ? 'rotate-180' : ''}`}>⌄</span></button>
              <Reveal open={ex === i}><Draw text={s} /></Reveal>
              <div className="mb-4" />
              <Btn onClick={() => setCur(cur + 1)}>{i === 2 ? '모두 확인했어요' : '확인했어요'}</Btn>
            </li>
          ) : (
            <li key={s} className="flex h-14 items-center gap-3 rounded-[18px] border border-[#e8ecf2] bg-white/60 px-4 text-[#9ba3af]"><span className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#eef1f5] text-xs font-semibold">{i + 1}</span><span className="text-sm font-semibold">{labels[i]}</span></li>
          ),
        )}
      </ol>
      {cur === 3 && <div className="mt-3 rounded-[18px] bg-[#eaf2ff] p-4 text-sm font-semibold leading-5 text-brand">모두 확인했어요! 해결되지 않았다면 집주인에게 연락해보세요.</div>}
    </section>
  )
}

function CameraView({ onBack, onAnalyze, sos = false }: { onBack: () => void; onAnalyze: (t: string) => void; sos?: boolean }) {
  const [live, setLive] = useState(0)
  const [shot, setShot] = useState<{ url?: string; sample?: number } | null>(null)
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
  const hint = shot?.url ? '싱크대 밑에서 물이 새고 있어요.' : smp.hint
  const is = classify(hint)
  const objs: [string, number][] = shot?.url ? [['문제 부위', 93], ['배수 호스', 89], ['물 고임', 84]] : (smp.objs as [string, number][])
  const label = shot?.url ? '문제 부위' : smp.obj
  const src = shot?.url || (PHOTOS[smp.issue] ? `https://images.unsplash.com/photo-${PHOTOS[smp.issue]}?w=900&h=1200&fit=crop&auto=format&q=75` : '')
  const scanning = !!shot && step < 4
  const corner = 'absolute h-8 w-8 border-white'
  return (
    <div className="absolute inset-0 z-40 flex flex-col overflow-hidden bg-[#12152a]">
      {src ? <img src={src} alt="촬영한 문제 사진" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,#3a4180,#12152a_70%)] text-[10rem] opacity-90">{smp.emoji}</div>}
      <div className={`absolute inset-0 transition-colors duration-500 ${shot ? 'bg-black/25' : 'bg-black/10'}`} />
      {shot && <div key={String(shot.sample) + (shot.url || '')} className="pointer-events-none absolute inset-0 z-30 bg-white" style={{ animation: 'flash .5s ease-out forwards' }} />}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
        <button onClick={onBack} aria-label="뒤로" className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-2xl text-white backdrop-blur">‹</button>
        <span className="text-sm font-bold text-white drop-shadow">사진으로 보여주기</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${sos ? "bg-sos" : "bg-brand"}`}>{sos ? "SOS" : "1/3"}</span>
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
          <div className="-mx-5 flex items-center gap-2 overflow-x-auto px-5">
            {PHOTO_SAMPLES.map((x, i) => <button key={x.label} onClick={() => setLive(i)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${live === i ? 'bg-white text-brand' : 'bg-white/20 text-white'}`}>{x.emoji} {x.label}</button>)}
          </div>
          <div className="flex items-center justify-between px-4">
            <label className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-white/20 text-xl text-white" aria-label="앨범에서 선택">🖼️
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setShot({ url: URL.createObjectURL(f) }) }} />
            </label>
            <button onClick={() => setShot({ sample: live })} aria-label="촬영" className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-4 border-white"><span className="h-[58px] w-[58px] rounded-full bg-white active:scale-90" /></button>
            <span className="w-12" />
          </div>
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
      {shot && !scanning && (
        <div className="fadeup absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-2xl">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded bg-navy/15" />
          <div className="flex items-center gap-3">
            <Photo id={shot.url ? is.id : smp.issue} className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1"><span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">감지된 문제</span><h2 className="mt-1 text-[20px] font-black leading-tight">{is.name}</h2></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">{objs.map(([n, c]) => <span key={n} className="rounded-full bg-bg px-2.5 py-1 text-xs font-bold">✓ {n} <span className="text-brand">{c}%</span></span>)}</div>
          <p className="mb-4 mt-3 text-sm leading-relaxed text-navy/70">{is.cause} 가능성이 있어요.</p>
          <Btn kind={sos ? 'sos' : 'main'} onClick={() => onAnalyze(hint)}>{sos ? '지금 해야 할 일 보기' : '이 사진으로 분석하기'}</Btn>
          <button onClick={() => setShot(null)} className="mt-2 h-11 w-full text-sm font-bold text-navy/50">다시 선택하기</button>
        </div>
      )}
    </div>
  )
}

function SosVoice({ phrase, onGo }: { phrase: string; onGo: (id: string) => void }) {
  const SAMPLES = ['싱크대 밑에서 물이 계속 새고 있어요.', '화장실 변기에서 물이 계속 올라와요.', '집에서 가스 냄새가 나요.', '콘센트에서 스파크가 튀었어요.']
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'listen' | 'done'>('idle')
  const [n, setN] = useState(0)
  const [secs, setSecs] = useState(0)
  const words = SAMPLES[idx].split(' ')
  useEffect(() => {
    if (phase !== 'listen') return
    const t = setInterval(() => setN((x) => x + 1), 520)
    const c = setInterval(() => setSecs((x) => x + 1), 1000)
    return () => { clearInterval(t); clearInterval(c) }
  }, [phase])
  useEffect(() => {
    if (phase === 'listen' && n >= words.length) { const t = setTimeout(() => setPhase('done'), 600); return () => clearTimeout(t) }
  }, [n, phase])
  const heard = words.slice(0, n).join(' ')
  const kws = extractKeywords(heard)
  const guess = classify(SAMPLES[idx])
  const tone = { place: 'bg-brand-soft text-brand', thing: 'bg-navy text-white', symptom: 'bg-sos-soft text-sos' }
  const start = () => { setN(0); setSecs(0); setPhase('listen') }
  return (
    <div className="fadeup flex flex-col items-center pt-8 text-center">
      <p className="text-xs font-semibold text-[#eb5056]">음성인식</p>
      <h1 className="mt-2 text-[24px] font-bold leading-8 tracking-[-0.04em]">{phase === 'idle' ? '버튼을 누르고 말해주세요' : phase === 'listen' ? '잘 듣고 있어요' : '이렇게 이해했어요'}</h1>
      <p className="mt-2 text-xs text-[#7e8797]">{phase === 'listen' ? `00:${String(secs).padStart(2, '0')} · 단어가 하나씩 인식돼요` : `“${phrase}”라고 말해도 바로 시작돼요`}</p>
      {phase !== 'done' && (
        <div className="relative mt-8 flex h-36 w-36 items-center justify-center">
          {phase === 'listen' && <span className="absolute inset-0 rounded-full bg-[#eb5056]" style={{ animation: 'pulse-ring 1.4s infinite' }} />}
          <button onClick={() => (phase === 'idle' ? start() : setPhase('done'))} aria-label={phase === 'idle' ? '녹음 시작' : '녹음 종료'} className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#eb5056] text-white shadow-lg active:scale-95">
            {phase === 'listen' ? <span className="h-10 w-10 rounded-lg bg-white" /> : <img src="/assets/0d5ab.svg" alt="" className="h-12 w-12 brightness-0 invert" />}
          </button>
        </div>
      )}
      {phase === 'listen' && <div className="mt-4 flex h-10 items-center justify-center gap-1" aria-hidden>{Array.from({ length: 17 }).map((_, k) => <span key={k} className="h-8 w-1 origin-center rounded-full bg-[#eb5056]" style={{ animation: `wave ${0.7 + (k % 5) * 0.12}s ease-in-out ${k * 0.05}s infinite` }} />)}</div>}
      {phase === 'idle' && (
        <div className="mt-6 w-full"><p className="mb-2 text-xs text-[#9ba4b1]">예시 상황 선택 (시연)</p>
          <div className="flex flex-wrap justify-center gap-1.5">{SAMPLES.map((x, k) => <button key={x} onClick={() => setIdx(k)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${idx === k ? 'bg-navy text-white' : 'border border-[#e4e8ef] bg-white text-[#788292]'}`}>{x.replace(/[.]/g, '').slice(0, 11)}…</button>)}</div></div>
      )}
      {phase !== 'idle' && (
        <div className="mt-6 w-full space-y-3 text-left">
          <div className="rounded-[22px] bg-white p-4 shadow-[0_7px_10px_rgba(36,63,103,.05)]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#eb5056]">{phase === 'listen' && <span className="h-2 w-2 animate-pulse rounded-full bg-[#eb5056]" />}{phase === 'listen' ? '실시간 인식 중' : '인식 완료'}</div>
            <p className="mt-2 flex min-h-[56px] flex-wrap gap-x-1.5 text-xl font-bold leading-snug">{(phase === 'done' ? words : words.slice(0, n)).map((w, k) => <span key={k} className="fadeup">{w.split(KEYWORD_RE).map((t, m) => (m % 2 ? <mark key={m} className="rounded bg-[#eb5056]/15 px-0.5">{t}</mark> : t))}</span>)}{phase === 'listen' && <span className="inline-block w-0.5 animate-pulse bg-[#eb5056]">&nbsp;</span>}</p>
            <div className="mt-2 flex min-h-8 flex-wrap gap-1.5">{kws.map((k) => <span key={k.word} className={`fadeup rounded-full px-2.5 py-1 text-xs font-bold ${tone[k.type]}`}><span className="mr-1 opacity-70">{KEYWORD_LABEL[k.type]}</span>✓ {k.word}</span>)}</div>
          </div>
          {phase === 'done' && (
            <>
              <div className="fadeup rounded-[22px] border border-[#ffd3d6] bg-[#fff5f6] p-4"><div className="text-xs font-semibold text-[#eb5056]">AI 예상 상황</div><div className="mt-1 text-lg font-bold">{guess.emoji} {guess.name}</div></div>
              <Btn kind="sos" onClick={() => onGo(guess.id)}>지금 해야 할 일 보기</Btn>
              <Btn kind="ghost" onClick={() => { setPhase('idle'); setIdx((idx + 1) % SAMPLES.length) }}>다시 말하기</Btn>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function SosText({ onGo }: { onGo: (id: string) => void }) {
  const [t, setT] = useState('')
  const kws = extractKeywords(t)
  const main = kws.length ? classify(t) : null
  const rest = main ? ISSUES.filter((i) => i.id !== main.id && kws.some((k) => i.name.includes(k.word))).slice(0, 2) : []
  const cands = main && main.id !== 'etc' ? [[main, 92], ...rest.map((r, k) => [r, 71 - k * 12] as const)] as const : []
  const tone = { place: 'bg-brand-soft text-brand', thing: 'bg-navy text-white', symptom: 'bg-sos-soft text-sos' }
  return (
    <div className="fadeup pt-8">
      <p className="text-center text-xs font-semibold text-[#eb5056]">직접 입력</p>
      <h1 className="mt-2 text-center text-[24px] font-bold leading-8 tracking-[-0.04em]">어떤 일이 일어나고 있나요?</h1>
      <div className="relative mt-5 h-32 rounded-[22px] bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words rounded-[22px] border-2 border-transparent p-4 text-base text-transparent">{t.split(KEYWORD_RE).map((x, k) => (k % 2 ? <mark key={k} className="rounded bg-[#eb5056]/15 text-transparent">{x}</mark> : x))}</div>
        <textarea value={t} onChange={(e) => setT(e.target.value)} autoFocus placeholder="예: 화장실 변기에서 물이 넘쳐요" aria-label="상황 입력" className="absolute inset-0 h-full w-full resize-none rounded-[22px] border-2 border-[#e8ecf2] bg-transparent p-4 text-base outline-none focus:border-[#eb5056]" />
      </div>
      {!t && <div className="mt-3 flex flex-wrap gap-1.5">{['변기 물이 넘쳐요', '가스 냄새가 나요', '천장에서 물이 새요', '콘센트 스파크'].map((x) => <button key={x} onClick={() => setT(x)} className="rounded-full border border-[#e4e8ef] bg-white px-3 py-1.5 text-xs font-semibold text-[#788292]">{x}</button>)}</div>}
      <div className="mt-3 min-h-[68px] rounded-[22px] bg-white p-3 shadow-[0_7px_10px_rgba(36,63,103,.05)]">
        <div className="mb-2 text-xs font-bold text-[#7e8797]">인식된 키워드</div>
        {kws.length ? <div className="flex flex-wrap gap-1.5">{kws.map((k) => <span key={k.word} className={`fadeup rounded-full px-3 py-1 text-sm font-bold ${tone[k.type]}`}><span className="mr-1 text-xs opacity-70">{KEYWORD_LABEL[k.type]}</span>{k.word}</span>)}</div> : <p className="text-sm text-[#9ba4b1]">쓰는 동안 장소·대상·증상 키워드를 찾아드려요.</p>}
      </div>
      {cands.length > 0 && (
        <div className="fadeup mt-3 space-y-2">
          <div className="text-xs font-semibold text-[#eb5056]">AI가 먼저 유추한 상황</div>
          {cands.map(([i, c], k) => (
            <button key={i.id} onClick={() => onGo(i.id)} className={`flex w-full items-center gap-3 rounded-[18px] border bg-white p-3 text-left active:scale-[.99] ${k === 0 ? 'border-[#eb5056]' : 'border-[#e8ecf2]'}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eaf2ff] text-xl">{i.emoji}</span>
              <span className="flex-1 text-sm font-bold">{i.name}</span><span className="text-xs font-bold text-[#eb5056]">{c}%</span>
            </button>
          ))}
        </div>
      )}
      <div className="mt-4"><Btn kind="sos" disabled={!cands.length} onClick={() => onGo(cands[0][0].id)}>지금 해야 할 일 보기</Btn></div>
    </div>
  )
}

function SosAct({ is, onBack, onMsg, onCases, onCall }: { is: Issue; onBack: () => void; onMsg: () => void; onCases: () => void; onCall: (c: string) => void }) {
  const temp = is.temp || ['수건·대야로 피해를 막으세요', '전기 제품을 치우세요']
  const root = is.root || ['관련 밸브·차단기를 잠그세요']
  const steps = [...temp.map((t) => [t, '피해 확산 막기'] as const), ...root.map((t) => [t, '근본 조치'] as const)]
  const total = steps.length
  const [step, setStep] = useState(0)
  const [open, setOpen] = useState(false)
  const done = step >= total
  const cur = steps[Math.min(step, total - 1)]
  return (
    <div className="fadeup min-h-full px-5 pb-8 pt-3">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold tracking-wide text-[#eb5056]">SOS</span>
        <button onClick={onBack} aria-label="닫기" className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white shadow-[0_7px_10px_rgba(36,63,103,.05)]"><img src="/assets/ac808.svg" alt="" className="h-6 w-6" /></button>
      </div>
      <div className="mt-2 flex gap-2" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.min(step + 1, total)}>{[...Array(total)].map((_, k) => <span key={k} className={`h-[3px] flex-1 rounded-full ${k <= step || done ? 'bg-[#eb5056]' : 'bg-[#e1e5ec]'}`} />)}</div>
      {!done ? (
        <>
          <div className="mt-9 flex flex-col items-center text-center">
            <span className="flex h-[122px] w-[122px] items-center justify-center rounded-[40px] bg-[#ffe3e5] shadow-[0_10px_24px_rgba(235,80,86,.12)]"><span className="flex h-[72px] w-[72px] items-center justify-center rounded-[26px] bg-white"><img src="/assets/d24d9.svg" alt="" className="h-7 w-7" /></span></span>
            <p className="mt-6 text-xs font-semibold text-[#eb5056]">{step + 1} · {cur[1]}</p>
            <h1 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.04em]">{cur[0]}</h1>
            <p className="mt-4 text-xs leading-5 text-[#7e8797]">{is.name} · 한 번에 하나씩만 해주세요.</p>
            <button onClick={() => setOpen(!open)} aria-expanded={open} className="mt-3 text-xs font-semibold text-brand">{open ? '그림 접기' : '그림으로 보기'}</button>
            {open && <div className="mt-3 w-full rounded-[22px] bg-white p-3"><Draw text={cur[0]} /></div>}
            <div className="mt-5 flex w-full items-center gap-3 rounded-[18px] bg-[#fff4e6] px-4 py-3 text-left text-xs leading-5 text-[#9b5d2d]"><img src="/assets/dd472.svg" alt="" className="h-6 w-6 shrink-0" />위험하다고 느껴지면 즉시 119 또는 관리실에 연락하세요.</div>
          </div>
          <div className="mt-10">
            <button onClick={() => setStep(step + 1)} className="h-[54px] w-full rounded-[18px] bg-[#eb5056] text-base font-semibold text-white shadow-lg active:scale-[.98]">{step < temp.length ? '임시 조치했어요' : '조치했어요'}</button>
            <button onClick={() => (step ? setStep(step - 1) : onBack())} className="mt-3 h-11 w-full text-sm text-[#7e8797]">이전 단계로</button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-9 flex flex-col items-center text-center">
            <span className="flex h-[122px] w-[122px] items-center justify-center rounded-[40px] bg-[#e6f7f1]"><span className="flex h-[72px] w-[72px] items-center justify-center rounded-[26px] bg-white text-3xl text-[#268c72]">✓</span></span>
            <p className="mt-6 text-xs font-semibold text-[#268c72]">조치 완료</p>
            <h1 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.04em]">큰 불은 껐어요.<br />다음 행동을 골라주세요.</h1>
          </div>
          <div className="mt-8 space-y-2">
            <button onClick={() => setOpen(!open)} className="flex h-[54px] w-full items-center justify-between rounded-[18px] bg-white px-4 text-sm font-semibold shadow-[0_7px_10px_rgba(36,63,103,.05)]">집주인이 연락이 안 되나요?<span>{open ? '−' : '+'}</span></button>
            {open && <p className="rounded-[18px] bg-white p-4 text-sm leading-relaxed text-[#4f5c6f]">{is.fallback}</p>}
            <Btn kind="sos" onClick={onMsg}>집주인에게 알리기</Btn>
            {is.call && <Btn onClick={() => onCall(is.call!)}>{is.call} 전화하기</Btn>}
            <Btn kind="ghost" onClick={onCases}>관련 해결 사례 보기</Btn>
            <button onClick={() => setStep(0)} className="h-11 w-full text-sm text-[#7e8797]">처음 단계부터 다시 보기</button>
          </div>
        </>
      )}
    </div>
  )
}

function MsgView({ is, landlord, sos, onBack, onDone }: { is: Issue; landlord: { name: string; phone: string }; sos: boolean; onBack: () => void; onDone: () => void }) {
  const blocks = ['안녕하세요, 입주자입니다.', `${is.name.replace(/요$/, '')} 문제가 생겼어요.`, '사진을 함께 보내드려요.', sos ? '급한 상황이라 최대한 빨리 연락 부탁드려요.' : '가능한 시간에 확인 부탁드려요.', '평일은 저녁 7시 이후 방문이 가능해요.']
  const compose = (list: string[]) => ['안녕하세요.', ...list, '확인 부탁드립니다. 감사합니다.'].join('\n\n')
  const [sel, setSel] = useState<string[]>(blocks.slice(0, 4))
  const [body, setBody] = useState(compose(blocks.slice(0, 4)))
  const [note, setNote] = useState(false)
  const toggle = (b: string) => {
    const next = sel.includes(b) ? sel.filter((x) => x !== b) : [...sel, b]
    setSel(next); setBody(compose(blocks.filter((x) => next.includes(x))))
  }
  return (
    <div className="fadeup">
      <Header title="메시지 만들기" onBack={onBack} />
      <div className="pb-48">
        <div className="px-5 pb-[18px] pt-3">
          <p className="text-xs font-semibold text-brand">{sos ? '긴급 연락' : '메시지 만들기'}</p>
          <h1 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.04em]">필요한 내용만 골라<br />상황을 알려보세요.</h1>
          <p className="mt-3 text-sm leading-[22px] text-[#758092]">각 블록의 문장을 직접 고치거나 빼고 다시 넣을 수 있어요.</p>
        </div>
        <div className="px-5">
          <div className="flex items-center rounded-[19px] border border-[#dce6f3] bg-[#edf4ff] px-[15px] py-3.5">
            <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] bg-white"><img src="/assets/f0963.svg" alt="" className="h-6 w-6" /></span>
            <div className="min-w-0 flex-1 pl-[11px]"><div className="text-xs text-[#7d8999]">받는 사람</div><div className="truncate pt-0.5 text-sm font-bold">{landlord.name} · {landlord.phone}</div></div>
            <button onClick={() => setNote(!note)} aria-label="받는 사람 정보" className="flex h-9 w-9 items-center justify-center"><img src="/assets/ea344.svg" alt="" className={`h-6 w-6 transition ${note ? 'rotate-90' : ''}`} /></button>
          </div>
          {note && <p className="fadeup mt-2 px-1 text-xs text-[#7d8999]">받는 사람은 더보기의 집주인 연락처에서 바꿀 수 있어요.</p>}
        </div>
        <div className="px-5 pt-[22px]">
          <h2 className="text-xl font-bold leading-6 tracking-[-0.01em]">보낼 내용</h2>
          <p className="pt-[3px] text-sm leading-6 text-[#8a95a4]">블록을 뺐다 끼며 수정할 수 있어요</p>
          <div className="space-y-[7px] pt-3">{blocks.map((b) => (
            <div key={b} className={`flex min-h-12 items-center gap-[9px] rounded-[14px] border border-[#dce4ee] bg-white py-2 pl-[13px] pr-[9px] shadow-[0_4px_6px_rgba(36,63,103,.04)] ${sel.includes(b) ? '' : 'opacity-60'}`}>
              <span className={`min-w-0 flex-1 truncate text-sm ${sel.includes(b) ? 'text-[#4f5c6f]' : 'text-[#9ba3af] line-through'}`}>{b}</span>
              <button onClick={() => toggle(b)} aria-pressed={sel.includes(b)} aria-label={sel.includes(b) ? '내용 빼기' : '내용 넣기'} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${sel.includes(b) ? 'bg-[#eaf2ff]' : 'bg-[#f2f5f8]'}`}>{sel.includes(b) ? <img src="/assets/ba9eb.svg" alt="" className="h-6 w-6" /> : <span className="text-lg text-[#9ba3af]">+</span>}</button>
            </div>
          ))}</div>
        </div>
        <div className="px-5 pt-[26px]">
          <div className="flex items-end justify-between"><div><h2 className="text-xl font-bold leading-6 tracking-[-0.01em]">메시지 미리보기</h2><p className="pt-[3px] text-sm leading-6 text-[#8a95a4]">문장을 눌러 직접 수정할 수 있어요</p></div>
            <span className="flex items-center gap-[5px] text-xs font-semibold text-brand"><img src="/assets/329dd.svg" alt="" className="h-6 w-6" />직접 수정</span></div>
          <div className="mt-3 rounded-[19px] border border-[#dce6f3] bg-white p-1 shadow-[0_6px_9px_rgba(36,63,103,.05)]">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} aria-label="메시지 내용" className="h-[230px] w-full resize-none rounded-[15px] bg-transparent p-[13px] text-sm leading-[23px] tracking-[-0.01em] text-[#4f5c6f] outline-none focus:ring-2 focus:ring-brand/20" />
          </div>
          <p className="mt-2 px-1 text-xs text-[#8a95a4]">사진 1장이 함께 첨부돼요</p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[84px] z-10 bg-gradient-to-t from-bg via-bg/95 to-transparent px-5 pb-2 pt-6">
        <button disabled={!body.trim()} onClick={onDone} className={`flex h-[54px] w-full items-center justify-center gap-[7px] rounded-[15px] text-base font-semibold text-white active:scale-[.98] disabled:opacity-40 ${sos ? 'bg-sos shadow-lg' : 'bg-brand shadow-md'}`}><img src="/assets/8a215.svg" alt="" className="h-6 w-6" />메시지 앱에서 보내기</button>
      </div>
    </div>
  )
}
