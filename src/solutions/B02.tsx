import { VideoPreview } from './VideoPreview'
import { useEffect, useRef, useState } from 'react'
import { Button, GNB } from '../components/ui'
import { SolutionSteps } from './SolutionSteps'
import { ResolutionSheet } from './ResolutionSheet'
import { CostReference } from './CostReference'
import type { SolutionView } from './data/types'
import { displayDuration, displayResponsibility } from './data/presentation'
import type { ResolutionStatus } from './resolution-message'
import clock from './assets/b02-clock.svg'
import dollar from './assets/b02-dollar.svg'
import external from './assets/b02-external.svg'
import warning from './assets/b02-warning.svg'
import generatedResultDefault from './assets/generated-result-w10.png'
import './b02.css'

/** View data only. This is NOT the team's final analysis response / sheet schema. */
export type B02ViewData = Omit<SolutionView, 'id' | 'field' | 'number' | 'category' | 'symptom'> & { id?: string }
export function B02({ data, onBack, onContact, onComplete, onOpenVideo }: {
  data: B02ViewData; onBack?: () => void; onContact: (resolution?: ResolutionStatus) => void; onComplete?: () => void
  onOpenVideo: (url: string) => void; onPreviewOpinion: () => void
}) {
  // Presentation-only fallback; never ask the model to generate asset paths.
  const photos = data.source === 'generated'
    ? [{ src: generatedResultDefault, alt: '돋보기로 문제를 살펴보는 어쩌집 캐릭터' }]
    : data.photos
  const [resolution,setResolution]=useState<'closed'|'solved'|'unsolved'>('closed')
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
  return <section ref={root} className="solutions-b02 solutions-b02--case" data-generated={data.source === 'generated'} data-without-photos={photos.length === 0} aria-label="해결 방법">
    <div className="solutions-b02__header" data-hidden={headerHidden} data-scrolled={headerScrolled} onFocusCapture={() => { headerState.current.hidden = false; setHeaderHidden(false) }}>
      <GNB title="해결 방법" variant={data.source === 'generated' || headerScrolled || !photos.length ? 'depth2-light' : 'depth2-dark'} onBack={onBack} />
    </div>
    {photos.length > 0 && <div ref={media} className="solutions-b02__media"><div className="solutions-b02__photos">{photos.map((photo, i) => <img key={i} src={photo.src} alt={photo.alt} />)}</div></div>}
    <main className="solutions-b02__content">
      <div className="solutions-b02__intro">
        <div>{data.title.trim() && <h1 title={data.title}>{data.title}</h1>}{data.description.trim() && <p>{data.description}</p>}</div>
        <div className="solutions-b02__facts">
          {data.duration.trim() && <div><img src={clock} alt="" /><span>예상 소요 시간</span><i /><strong>{displayDuration(data.duration)}</strong></div>}
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
          <VideoPreview key={data.id} url={data.videos[0].url} thumbnail={data.videos[0].thumbnail} externalIcon={external} onOpen={onOpenVideo} />
        </section>
      </>}
      <div className="solutions-b02__feedback solutions-b02__advisory text-caption-rg">
        <p><span className="solutions-b02__warning"><img src={warning} alt=""/></span><span>미리 준비된 사례를 바탕으로 한 안내예요.<br/>상황에 따라 원인과 해결 방법이 다를 수 있어요.</span></p>
      </div>
      <div className="solutions-b02__actions"><Button variant="pale" onClick={()=>setResolution('unsolved')}>해결이 어려워요</Button><Button onClick={()=>setResolution('solved')}>해결됐어요</Button></div>
    </main>
    <ResolutionSheet mode={resolution} onClose={()=>setResolution('closed')} onHome={onComplete} onContact={onContact} canContact={data.canContact} hasLandlordMessage={!!data.contacts.landlord.label.trim() && (data.contacts.landlord.solvedSentences?.length ? data.contacts.landlord.solvedSentences : data.contacts.landlord.sentences).some(text => !!text.trim())} hasCompany={!!data.contacts.company.label.trim()}/>
  </section>
}

