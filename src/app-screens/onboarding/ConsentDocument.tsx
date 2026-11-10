import { Button } from '../../components/ui'
import { useEffect, useRef } from 'react'
import information from '../my/information-draft.json'
export type ConsentDocumentKind = 'service' | 'processing' | 'overseas'
export const consentTitles = { service: '서비스 이용약관', processing: '개인정보 수집·이용 동의', overseas: '개인정보 국외 이전 동의' }
export const consentDocuments = {
  service: information.terms,
  processing: information.processingConsent,
  overseas: information.overseasConsent,
}
export function ConsentDocument({ kind, onBack }: { kind: ConsentDocumentKind; onBack: () => void }) {
  const scroll = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const area = scroll.current!
    const body = content.current!
    let lastY = 0
    let pull = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reset = () => {
      pull = 0
      body.style.transition = reduced ? 'none' : 'transform 280ms ease-out'
      body.style.transform = 'translateY(0)'
    }
    const stretch = (delta: number) => {
      const bottom = Math.max(0, area.scrollHeight - area.clientHeight)
      if (!pull && !((area.scrollTop <= 0 && delta > 0) || (area.scrollTop >= bottom - 1 && delta < 0))) return false
      pull = Math.max(-160, Math.min(160, pull + delta))
      body.style.transition = 'none'
      body.style.transform = `translateY(${reduced ? 0 : 48 * Math.tanh(pull / 120)}px)`
      return true
    }
    const start = (e: TouchEvent) => { clearTimeout(timer); lastY = e.touches[0]?.clientY ?? 0; pull = 0 }
    const move = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const y = e.touches[0].clientY
      if (stretch(y - lastY)) e.preventDefault()
      lastY = y
    }
    const wheel = (e: WheelEvent) => {
      if (stretch(-e.deltaY)) { e.preventDefault(); clearTimeout(timer); timer = setTimeout(reset, 100) }
    }
    area.addEventListener('touchstart', start, { passive: true })
    area.addEventListener('touchmove', move, { passive: false })
    area.addEventListener('touchend', reset)
    area.addEventListener('touchcancel', reset)
    area.addEventListener('wheel', wheel, { passive: false })
    return () => {
      clearTimeout(timer)
      area.removeEventListener('touchstart', start)
      area.removeEventListener('touchmove', move)
      area.removeEventListener('touchend', reset)
      area.removeEventListener('touchcancel', reset)
      area.removeEventListener('wheel', wheel)
    }
  }, [kind])
  return <div className="hh-terms-sheet-content">
    <h2>{consentTitles[kind]}</h2>
    <div ref={scroll} className="hh-terms-document" key={kind} tabIndex={0} role="region" aria-label={`${consentTitles[kind]} 전문`}>
      <div ref={content} className="hh-terms-document-body">
      {consentDocuments[kind].map(section => <section key={section.title}><h3>{section.title}</h3>{section.paragraphs.map((text, index) => <p key={index}>{text}</p>)}</section>)}
      </div>
    </div>
    <Button onClick={onBack}>닫기</Button>
  </div>
}
