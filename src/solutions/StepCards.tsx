import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { ArrowButton } from '../components/ui'
import back from './assets/b02-back.svg'

export type PreviewStep = { number?: number; title: string; description: string }

/** Drag release and arrows use the same short ease-out; wheel/keyboard keep native snap. */
export function StepCards({ steps }: { steps: readonly PreviewStep[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const currentIndex = useRef(0)
  const animation = useRef(0)
  const destination = useRef<number | null>(null)
  const gesture = useRef<{ id: number; x: number; y: number; left: number; index: number; lastX: number; time: number; velocity: number; dragging: boolean } | null>(null)
  useEffect(() => () => cancelAnimationFrame(animation.current), [])
  function stopAnimation() {
    cancelAnimationFrame(animation.current)
    destination.current = null
  }
  function goTo(index: number) {
    const el = track.current!
    stopAnimation()
    const next = Math.max(0, Math.min(steps.length - 1, index))
    const card = el.children[next] as HTMLElement
    const start = el.scrollLeft
    const end = start + card.getBoundingClientRect().left - el.getBoundingClientRect().left - 24
    destination.current = next
    el.style.scrollSnapType = 'none'
    const started = performance.now()
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200
    const tick = (now: number) => {
      const progress = duration ? Math.min(1, (now - started) / duration) : 1
      // Cubic ease-out: immediate movement, then a soft landing without bounce.
      el.scrollLeft = start + (end - start) * (1 - Math.pow(1 - progress, 3))
      if (progress < 1) animation.current = requestAnimationFrame(tick)
      else {
        el.style.scrollSnapType = ''
        destination.current = null
        updateCurrent()
      }
    }
    animation.current = requestAnimationFrame(tick)
  }
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return
    stopAnimation()
    const el = event.currentTarget
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: el.scrollLeft, index: current, lastX: event.clientX, time: event.timeStamp, velocity: 0, dragging: false }
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current
    if (!g || g.id !== event.pointerId) return
    const dx = event.clientX - g.x
    const dy = event.clientY - g.y
    if (!g.dragging) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) { gesture.current = null; event.currentTarget.style.scrollSnapType = ''; return }
      if (Math.abs(dx) < 6) return
      g.dragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.style.scrollSnapType = 'none'
      event.currentTarget.dataset.dragging = 'true'
    }
    g.velocity = (event.clientX - g.lastX) / Math.max(1, event.timeStamp - g.time)
    g.lastX = event.clientX
    g.time = event.timeStamp
    event.currentTarget.scrollLeft = g.left - dx
  }
  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current
    if (!g || g.id !== event.pointerId) return
    gesture.current = null
    delete event.currentTarget.dataset.dragging
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (!g.dragging) { event.currentTarget.style.scrollSnapType = ''; return }
    const delta = event.clientX - g.x
    const flick = event.timeStamp - g.time < 100 && Math.abs(g.velocity) > .35
    const advance = event.type !== 'pointercancel' && (Math.abs(delta) > event.currentTarget.clientWidth * .15 || flick)
    goTo(advance ? g.index + (delta < 0 ? 1 : -1) : current)
  }
  function updateCurrent() {
    const el = track.current!
    const first = el.children[0] as HTMLElement
    const second = el.children[1] as HTMLElement | undefined
    const stride = second ? second.offsetLeft - first.offsetLeft : 0
    const nearest = stride ? Math.max(0, Math.min(steps.length - 1, Math.round(el.scrollLeft / stride))) : 0
    if (currentIndex.current !== nearest) { currentIndex.current = nearest; setCurrent(nearest) }
  }
  function move(delta: number) {
    goTo((destination.current ?? current) + delta)
  }
  return <>
    <div className="solutions-b02__track" ref={track} onScroll={updateCurrent} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onWheel={() => { stopAnimation(); track.current!.style.scrollSnapType = '' }} tabIndex={0} role="region" aria-label="해결 단계 카드">
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

