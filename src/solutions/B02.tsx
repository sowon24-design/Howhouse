import { useEffect, useRef, useState } from 'react'
import { Button, GNB } from '../components/ui'
import { iconCatalog } from '../components/Icon/Icon'
import { SolutionSteps } from './SolutionSteps'
import { ResolutionSheet } from './ResolutionSheet'
import { CostReference } from './CostReference'
import type { SolutionView } from './data/types'
import { displayResponsibility } from './data/presentation'
import { OpinionSheet } from './OpinionSheet'
import clock from './assets/b02-clock.svg'
import dollar from './assets/b02-dollar.svg'
import external from './assets/b02-external.svg'
import warning from './assets/b02-warning.svg'
import generatedResultDefault from './assets/generated-result-w10.png'
import './b02.css'

/** Original 16px geometry with the B02 instance's secondary-color override. */
function FeedbackIcon({ filled, stroke, fill }: { filled: boolean; stroke: string; fill: string }) {
  return <span className="solutions-b02__rating-icon" data-filled={filled} aria-hidden="true">
    {[stroke, fill].map(id => <span key={id} style={{ maskImage: `url("${iconCatalog.find(icon => icon.id === id)!.src}")` }} />)}
  </span>
}

/** View data only. This is NOT the team's final analysis response / sheet schema. */
export type B02ViewData = Omit<SolutionView, 'id' | 'field' | 'number' | 'category' | 'symptom'>
export function B02({ data, onBack, onContact, onComplete, onOpenVideo, onPreviewOpinion }: {
  data: B02ViewData; onBack?: () => void; onContact: () => void; onComplete?: () => void
  onOpenVideo: (url: string) => void; onPreviewOpinion: () => void
}) {
  // Presentation-only fallback; never ask the model to generate asset paths.
  const photos = data.source === 'generated'
    ? [{ src: generatedResultDefault, alt: '돋보기로 문제를 살펴보는 어쩌집 캐릭터' }]
    : data.photos
  const [resolution,setResolution]=useState<'closed'|'solved'|'unsolved'>('closed')
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const [sheet, setSheet] = useState<'closed' | 'edit' | 'thanks'>('closed')
  const [reason, setReason] = useState('')
  const [opinion, setOpinion] = useState('')
  const root = useRef<HTMLElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const [headerHidden, setHeaderHidden] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const headerState = useRef({ hidden: false, scrolled: false })
  useEffect(() => {
    let parent = root.current?.parentElement
    while (parent && !/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) parent = parent.parentElement
    const scroller = parent ?? document.documentElement
    const target = parent ?? window
    let previous = scroller.scrollTop
    let travel = 0
    const onScroll = () => {
      const next = Math.max(0, Math.min(scroller.scrollTop, scroller.scrollHeight - scroller.clientHeight))
      const delta = next - previous
      previous = next
      const mediaBottom = media.current?.getBoundingClientRect().bottom ?? -1
      const viewportTop = parent?.getBoundingClientRect().top ?? 0
      const scrolled = mediaBottom <= viewportTop
      if (headerState.current.scrolled !== scrolled) {
        headerState.current.scrolled = scrolled
        setHeaderScrolled(scrolled)
      }
      if (next <= 0) {
        if (headerState.current.hidden) { headerState.current.hidden = false; setHeaderHidden(false) }
        travel = 0; return
      }
      if (!delta) return
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta
      if (Math.abs(travel) >= 8) {
        if (headerState.current.hidden !== (travel > 0)) { headerState.current.hidden = travel > 0; setHeaderHidden(travel > 0) }
        travel = 0
      }
    }
    onScroll()
    target.addEventListener('scroll', onScroll, { passive: true })
    return () => target.removeEventListener('scroll', onScroll)
  }, [])
  function rate(value: 'up' | 'down') {
    setRating(rating === value ? null : value)
    if (value === 'down' && rating !== value) setSheet('edit')
  }
  return <section ref={root} className="solutions-b02 solutions-b02--case" data-generated={data.source === 'generated'} data-without-photos={photos.length === 0} aria-label="해결 방법">
    <div className="solutions-b02__header" data-hidden={headerHidden} data-scrolled={headerScrolled} onFocusCapture={() => { headerState.current.hidden = false; setHeaderHidden(false) }}>
      <GNB title="해결 방법" variant={data.source === 'generated' || headerScrolled || !photos.length ? 'depth2-light' : 'depth2-dark'} onBack={onBack} />
    </div>
    {photos.length > 0 && <div ref={media} className="solutions-b02__media"><div className="solutions-b02__photos">{photos.map((photo, i) => <img key={i} src={photo.src} alt={photo.alt} />)}</div></div>}
    <main className="solutions-b02__content">
      <div className="solutions-b02__intro">
        <div>{data.title.trim() && <h1>{data.title}</h1>}{data.description.trim() && <p>{data.description}</p>}</div>
        <div className="solutions-b02__facts">
          {data.duration.trim() && <div><img src={clock} alt="" /><span>예상 소요 시간</span><i /><strong>{data.duration}</strong></div>}
          {(data.responsibility.trim() || data.reference.trim()) && <div><img src={dollar} alt="" /><span>수리 비용 부담</span><i /><div className="solutions-b02__responsibility">
            <strong>{displayResponsibility(data.responsibility)}</strong>
            {data.reference.trim()&&<CostReference text={data.reference}/>}
          </div></div>}
        </div>
      </div>
      {(data.supplies.length > 0 || data.steps.length > 0) && <>
      <section className="solutions-b02__steps" aria-label="해결 단계">
        <h2 className="text-body-sb"><span className="solutions-b02__step-count">{data.steps.length}단계</span> 해결 방법</h2>
        <SolutionSteps steps={data.steps} supplies={data.supplies}/>
      </section>
      </>}
      {data.source === 'existing' && data.videos.length > 0 && <>
        <section><h2 className="text-body-sb">더 자세히 알아보기</h2>
          <a className="solutions-b02__video" href={data.videos[0].url} target="_blank" rel="noopener noreferrer" aria-label="해결 방법 유튜브 영상 열기" onClick={() => onOpenVideo(data.videos[0].url)}><img src={data.videos[0].thumbnail} alt="해결 방법 유튜브 썸네일" /><span><img src={external} alt="" /></span></a>
        </section>
      </>}
      <div className="solutions-b02__feedback">
        <p><span className="solutions-b02__warning"><img src={warning} alt="" /></span>AI가 분석한 결과예요. 상황에 따라 다를 수 있어요.</p>
        <div><span>답변이 도움이 되었나요?</span>
          <button aria-label="도움돼요" disabled={rating !== null} aria-pressed={rating === 'up'} onClick={() => rate('up')}><FeedbackIcon filled={rating === 'up'} stroke="489:20374" fill="489:20373" /></button>
          <button aria-label="아쉬워요" disabled={rating !== null} aria-pressed={rating === 'down'} onClick={() => rate('down')}><FeedbackIcon filled={rating === 'down'} stroke="489:20394" fill="489:20386" /></button>
        </div>
      </div>
      <div className="solutions-b02__actions"><Button variant="pale" onClick={()=>setResolution('unsolved')}>해결이 어려워요</Button><Button onClick={()=>setResolution('solved')}>해결됐어요</Button></div>
    </main>
    <OpinionSheet mode={sheet} reason={reason} text={opinion} onReason={setReason} onText={setOpinion} onClose={() => setSheet('closed')} onPreviewSubmit={() => { onPreviewOpinion(); setSheet('thanks') }} />
    <ResolutionSheet mode={resolution} onClose={()=>setResolution('closed')} onHome={onComplete} onContact={onContact} canContact={data.canContact}/>
  </section>
}

