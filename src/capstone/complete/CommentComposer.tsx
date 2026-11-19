import { useEffect, useRef, useState } from 'react'
import sendIcon from './assets/fcd8ef38-6f47-4618-be2d-53ee6469b920.svg'
import disabledSendIcon from './assets/3368d995-40e1-4e1d-84cf-0a9539108bcc.svg'

/** Figma 336:29762 input, above the real keyboard (no simulated keyboard). */
export function CommentComposer({ value, onChange, onSubmit, onClose }: {
  value: string; onChange: (value: string) => void; onSubmit: () => void; onClose: () => void
}) {
  const input = useRef<HTMLTextAreaElement>(null)
  const [keyboardInset, setKeyboardInset] = useState(0)
  useEffect(() => {
    input.current?.focus({ preventScroll: true })
    const update = () => setKeyboardInset(Math.max(0, innerHeight - (visualViewport?.height ?? innerHeight) - (visualViewport?.offsetTop ?? 0)))
    update(); visualViewport?.addEventListener('resize', update); visualViewport?.addEventListener('scroll', update)
    return () => { visualViewport?.removeEventListener('resize', update); visualViewport?.removeEventListener('scroll', update) }
  }, [])
  useEffect(() => { if (input.current) { input.current.style.height = '0px'; input.current.style.height = Math.min(84, Math.max(24, input.current.scrollHeight)) + 'px' } }, [value])
  return <div className="cg-comment-composer" style={{ bottom: keyboardInset ? keyboardInset + 8 : 24 }}>
    <textarea ref={input} data-comment-input aria-label="댓글" placeholder="댓글을 입력해주세요" maxLength={1000} value={value} onChange={event => onChange(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') onClose() }} />
    <button type="button" aria-label="댓글 보내기" disabled={!value.trim()} onClick={onSubmit}><img src={value.trim() ? sendIcon : disabledSendIcon} alt="" /></button>
  </div>
}
