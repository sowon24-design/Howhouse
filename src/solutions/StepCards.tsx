import { useRef, useState } from 'react'
import { ArrowButton } from '../components/ui'
import back from './assets/b02-back.svg'

export type PreviewStep = { number?: number; title: string; description: string }

/** Native horizontal scrolling and arrows share the nearest snapped card index. */
export function StepCards({ steps }: { steps: readonly PreviewStep[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  function updateCurrent() {
    const el = track.current!
    const cards = Array.from(el.children) as HTMLElement[]
    const left = el.getBoundingClientRect().left + 24
    let nearest = 0
    cards.forEach((card, i) => {
      if (Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[nearest].getBoundingClientRect().left - left)) nearest = i
    })
    setCurrent(nearest)
  }
  function move(delta: number) {
    const el = track.current!
    const next = Math.max(0, Math.min(steps.length - 1, current + delta))
    const card = el.children[next] as HTMLElement
    const left = el.scrollLeft + card.getBoundingClientRect().left - el.getBoundingClientRect().left - 24
    el.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <>
    <div className="solutions-b02__track" ref={track} onScroll={updateCurrent} tabIndex={0} role="region" aria-label="해결 단계 카드">
      {steps.map((step, i) => <article className="solutions-b02__card" key={i} aria-label={`${step.number ?? i + 1}단계`}>
        <div className="solutions-b02__progress" aria-hidden="true">{steps.map((_, j) => <span key={j} data-active={j <= current} />)}</div>
        <div>{step.title.trim() && <h3 className="text-heading">{step.title}</h3>}{step.description.trim() && <p>{step.description}</p>}</div>
      </article>)}
    </div>
    <div className="solutions-b02__arrows">
      <span className="ui-sr-only" role="status">{current + 1} / {steps.length}단계</span>
      <button className="solutions-b02__previous" type="button" aria-label="이전 단계" disabled={current === 0} onClick={() => move(-1)}><img src={back} alt="" /></button>
      <ArrowButton label="다음 단계" disabled={current === steps.length - 1} onClick={() => move(1)} />
    </div>
  </>
}

