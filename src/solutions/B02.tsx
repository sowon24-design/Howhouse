import { useEffect, useId, useRef, useState } from 'react'
import { Button, GNB } from '../components/ui'
import { iconCatalog } from '../components/Icon/Icon'
import { StepCards } from './StepCards'
import type { SolutionView } from './data/types'
import { displayResponsibility } from './data/presentation'
import { OpinionSheet } from './OpinionSheet'
import clock from './assets/b02-clock.svg'
import dollar from './assets/b02-dollar.svg'
import down from './assets/b02-down.svg'
import external from './assets/b02-external.svg'
import warning from './assets/b02-warning.svg'
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
  const referenceId = useId()
  const [expanded, setExpanded] = useState(false)
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const [sheet, setSheet] = useState<'closed' | 'edit' | 'thanks'>('closed')
  const [reason, setReason] = useState('')
  const [opinion, setOpinion] = useState('')
  const root = useRef<HTMLElement>(null)
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
      if (headerState.current.scrolled !== (next > 0)) {
        headerState.current.scrolled = next > 0
        setHeaderScrolled(next > 0)
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
    target.addEventListener('scroll', onScroll, { passive: true })
    return () => target.removeEventListener('scroll', onScroll)
  }, [])
  function rate(value: 'up' | 'down') {
    setRating(rating === value ? null : value)
    if (value === 'down' && rating !== value) setSheet('edit')
  }
  return <section ref={root} className="solutions-b02 solutions-b02--case" data-without-photos={data.photos.length === 0} aria-label="해결 방법">
    <div className="solutions-b02__header" data-hidden={headerHidden} data-scrolled={headerScrolled} onFocusCapture={() => { headerState.current.hidden = false; setHeaderHidden(false) }}>
      <GNB title="해결 방법" variant={headerScrolled || !data.photos.length ? 'depth2-light' : 'depth2-dark'} onBack={onBack} />
    </div>
    {data.photos.length > 0 && <div className="solutions-b02__media"><div className="solutions-b02__photos">{data.photos.map((photo, i) => <img key={i} src={photo.src} alt={photo.alt} />)}</div></div>}
    <main className="solutions-b02__content">
      <div className="solutions-b02__intro">
        <div>{data.title.trim() && <h1>{data.title}</h1>}{data.description.trim() && <p>{data.description}</p>}</div>
        <div className="solutions-b02__facts">
          {data.duration.trim() && <div><img src={clock} alt="" /><span>예상 소요 시간</span><i /><strong>{data.duration}</strong></div>}
          {(data.responsibility.trim() || data.reference.trim()) && <div><img src={dollar} alt="" /><span>배상 책임</span><i /><div className="solutions-b02__responsibility ui-accordion" data-open={expanded}>
            <button type="button" aria-label="배상 책임 판단 참고" disabled={!data.reference.trim()} aria-expanded={expanded} aria-controls={referenceId} onClick={() => setExpanded(!expanded)}><strong>{displayResponsibility(data.responsibility)}</strong>{data.reference.trim() && <img src={down} alt="" className="ui-accordion-arrow" />}</button>
            <div id={referenceId} className="solutions-b02__reference ui-accordion-panel" data-open={expanded} aria-hidden={!expanded} inert={!expanded}><div className="ui-accordion-clip"><p>{data.reference}</p></div></div>
          </div></div>}
        </div>
      </div>
      {(data.supplies.length > 0 || data.steps.length > 0) && <><hr />
      <section className="solutions-b02__steps" aria-label="해결 단계">
        <h2 className="text-body-sb">해결 방법</h2>
        {data.supplies.length > 0 && <div className="solutions-b02__supplies"><span>준비물</span>{data.supplies.map((s, i) => <span key={i}>{s}</span>)}</div>}
        {data.steps.length > 0 && <StepCards steps={data.steps} />}
      </section>
      <hr /></>}
      {data.source === 'existing' && data.videos.length > 0 && <>
        <section><h2 className="text-body-sb">더 자세히 알아보기</h2>
          <a className="solutions-b02__video" href={data.videos[0].url} target="_blank" rel="noopener noreferrer" aria-label="해결 방법 유튜브 영상 열기" onClick={() => onOpenVideo(data.videos[0].url)}><img src={data.videos[0].thumbnail} alt="해결 방법 유튜브 썸네일" /><span><img src={external} alt="" /></span></a>
        </section><hr />
      </>}
      <div className="solutions-b02__feedback">
        <p><span className="solutions-b02__warning"><img src={warning} alt="" /></span>Ai가 분석한 결과이므로 상황에 따라 다를 수 있어요.</p>
        <div><span>답변이 도움이 되었나요?</span>
          <button aria-label="도움돼요" aria-pressed={rating === 'up'} onClick={() => rate('up')}><FeedbackIcon filled={rating === 'up'} stroke="489:20374" fill="489:20373" /></button>
          <button aria-label="아쉬워요" aria-pressed={rating === 'down'} onClick={() => rate('down')}><FeedbackIcon filled={rating === 'down'} stroke="489:20394" fill="489:20386" /></button>
        </div>
      </div>
      <div className="solutions-b02__actions">{data.canContact && <Button variant="pale" onClick={onContact}>문의 메세지 작성하기</Button>}<Button disabled={!onComplete} onClick={onComplete}>완료</Button></div>
    </main>
    <OpinionSheet mode={sheet} reason={reason} text={opinion} onReason={setReason} onText={setOpinion} onClose={() => setSheet('closed')} onPreviewSubmit={() => { onPreviewOpinion(); setSheet('thanks') }} />
  </section>
}

