import { useEffect, useId, useRef } from 'react'
import { Button, Radio } from '../components/ui'
import thanks from './assets/b02-thanks.png'

export const opinionReasons = ['내 상황과 달라요.', '방법이 틀린 것 같아요.', '따라하기 위험해 보여요.', '어려워 보여요.', '필요한 준비물·정보가 빠졌어요.', '직접 입력하기'] as const

export function OpinionSheet({ mode, reason, text, onReason, onText, onClose, onPreviewSubmit }: {
  mode: 'closed' | 'edit' | 'thanks'; reason: string; text: string
  onReason: (value: string) => void; onText: (value: string) => void
  onClose: () => void; onPreviewSubmit: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const heading = useId()
  const group = useId()
  const outside = useRef(false)
  useEffect(() => {
    if (mode === 'closed') return
    const dialog = ref.current!
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }) }
  }, [mode])
  const custom = reason === '직접 입력하기'
  return <dialog ref={ref} className="solutions-opinion" aria-labelledby={heading}
    onCancel={event => { event.preventDefault(); onClose() }}
    onPointerDown={event => { outside.current = event.target === event.currentTarget }}
    onClick={event => {
      const box = event.currentTarget.getBoundingClientRect()
      if (outside.current && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) onClose()
    }}>
    <div className="solutions-opinion__handle" aria-hidden="true" />
    {mode === 'thanks' ? <>
      <div className="solutions-opinion__copy"><h2 id={heading} className="text-heading">의견을 주셔서 감사합니다.</h2><p>보내주신 의견은 어쩌집 서비스 개선에 활용됨니다.</p></div>
      <div className="solutions-opinion__thanks"><img src={thanks} alt="" /></div>
      <Button onClick={onClose}>확인했어요</Button>
    </> : <>
      <div className="solutions-opinion__copy"><h2 id={heading} className="text-heading">어떤 점이 아쉬웠나요?</h2><p>{custom ? '해결 방법에 대한 의견을 자유롭게 알려주세요.' : '부적절하거나 틀린 내용을 알려 주세요.'}</p></div>
      <fieldset className="solutions-opinion__reasons"><legend className="ui-sr-only">의견 사유</legend>
        {opinionReasons.map(value => <Radio key={value} name={group} label={value} checked={reason === value} onChange={() => onReason(value)} />)}
        {custom && <textarea aria-label="직접 입력 의견" placeholder="신고 사유가 무엇인가요?" value={text} onChange={event => onText(event.target.value)} />}
      </fieldset>
      <Button disabled={!reason || (custom && text.length === 0)} onClick={onPreviewSubmit}>의견 보내기</Button>
    </>}
  </dialog>
}
