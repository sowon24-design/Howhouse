import { useId, useState } from 'react'
import { SolutionSheet } from './SolutionSheet'
import { Button, Radio } from '../components/ui'
import thanks from './assets/b02-thanks-w10.png'
import { aiReportReasons } from '../analysis/ai-report'

export const opinionReasons = ['내 상황과 달라요.', '방법이 틀린 것 같아요.', '따라하기 위험해 보여요.', '어려워 보여요.', '필요한 준비물·정보가 빠졌어요.', '직접 입력하기'] as const

export function OpinionSheet({ mode, reason, text, onReason, onText, onClose, onPreviewSubmit, saving=false, error='', reporting=false }: {
  mode: 'closed' | 'edit' | 'thanks'; reason: string; text: string
  onReason: (value: string) => void; onText: (value: string) => void
  onClose: () => void; onPreviewSubmit: () => void
  saving?: boolean; error?: string; reporting?: boolean
}) {
  const [visibleMode, setVisibleMode] = useState(mode)
  if (mode !== 'closed' && mode !== visibleMode) setVisibleMode(mode)
  const heading = useId()
  const group = useId()
  const custom = reason === '직접 입력하기'
  return <SolutionSheet open={mode !== 'closed'} onClose={onClose} swipeDismiss label={visibleMode === 'thanks' ? '접수했어요.' : reporting ? 'AI 답변 신고' : '어떤 점이 아쉬웠나요?'} className="solutions-opinion">
    <div className="solutions-opinion__handle" aria-hidden="true" />
    {visibleMode === 'thanks' ? <>
      <div className="solutions-opinion__copy"><h2 id={heading} className="text-heading">{reporting?'신고를 접수했어요.':'의견을 주셔서 감사합니다.'}</h2><p>{reporting?'운영자가 내용을 검토하고 필요한 조치를 진행해요.':'보내주신 의견은 어쩌집 서비스 개선에 활용됩니다.'}</p></div>
      <div className="solutions-opinion__thanks"><img src={thanks} alt="" /></div>
      <Button onClick={onClose}>확인했어요</Button>
    </> : <>
      <div className="solutions-opinion__copy"><h2 id={heading} className="text-heading">{reporting?'AI 답변 신고':'어떤 점이 아쉬웠나요?'}</h2><p>{reporting?'부적절하거나 위험한 답변을 알려주세요. 신고에는 표시된 답변 일부가 포함돼요. 이름·연락처·주소는 적지 마세요.':'해결 방법에 대한 의견을 자유롭게 알려주세요.'}</p></div>
      <fieldset className="solutions-opinion__reasons" disabled={saving}><legend className="ui-sr-only">의견 사유</legend>
        {(reporting?aiReportReasons:opinionReasons).map(value => <Radio key={value} name={group} label={value} checked={reason === value} onClick={() => onReason(reason === value ? '' : value)} onChange={() => {}} />)}
        <div className="ui-accordion" data-open={custom}><div className="ui-accordion-panel" aria-hidden={!custom} inert={!custom}><div className="ui-accordion-clip">
          <textarea aria-label="직접 입력 의견" placeholder={reporting?'어떤 내용이 문제인지 알려주세요.':'어떤 점이 아쉬웠나요?'} maxLength={reporting?1000:2000} value={text} onChange={event => onText(event.target.value)} />
        </div></div></div>
      </fieldset>
      {error && <p role="alert">{error}</p>}
      <Button disabled={saving || !reason || (custom && (!text.replace(/[\s\p{Cf}]/gu,'') || text.length>(reporting?1000:2000)))} onClick={onPreviewSubmit}>{saving?'접수하고 있어요':reporting?'신고 보내기':'의견 보내기'}</Button>
    </>}
  </SolutionSheet>
}
