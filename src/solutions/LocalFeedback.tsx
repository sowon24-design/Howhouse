import { useState } from 'react'
import { iconCatalog } from '../components/Icon/Icon'
import { OpinionSheet } from './OpinionSheet'
import warning from './assets/b02-warning.svg'

function FeedbackIcon({ filled, stroke, fill }: { filled: boolean; stroke: string; fill: string }) {
  return <span className="solutions-b02__rating-icon" data-filled={filled} aria-hidden="true">
    {[stroke, fill].map(id => <span key={id} style={{maskImage:'url("' + iconCatalog.find(icon => icon.id === id)!.src + '")'}}/>)}
  </span>
}

/** Screen-local interaction only: no storage, authentication, or network requests. */
export function LocalFeedback() {
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const [sheet, setSheet] = useState<'closed' | 'edit' | 'thanks'>('closed')
  const [reason, setReason] = useState('')
  const [text, setText] = useState('')
  const rate = (next: 'up' | 'down') => {
    setRating(rating === next ? null : next)
    if (next === 'down' && rating !== next) setSheet('edit')
  }
  return <>
    <div className="solutions-b02__feedback">
      <p><span className="solutions-b02__warning"><img src={warning} alt=""/></span>상황에 따라 원인과 해결 방법이 다를 수 있어요.</p>
      <div><span>답변이 도움이 되었나요?</span>
        <button type="button" aria-label="도움돼요" aria-pressed={rating === 'up'} onClick={() => rate('up')}><FeedbackIcon filled={rating === 'up'} stroke="489:20374" fill="489:20373"/></button>
        <button type="button" aria-label="아쉬워요" aria-pressed={rating === 'down'} onClick={() => rate('down')}><FeedbackIcon filled={rating === 'down'} stroke="489:20394" fill="489:20386"/></button>
      </div>
    </div>
    <OpinionSheet localOnly mode={sheet} reason={reason} text={text} onReason={setReason} onText={setText} onClose={() => setSheet('closed')} onPreviewSubmit={() => setSheet('thanks')}/>
  </>
}
