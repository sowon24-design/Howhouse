import { useState } from 'react'
import { Button, GNB } from '../../components/ui'
import { Dialog } from '../../components/ui/Dialogs'
import moreInformation from './assets/more-information.svg'
import './analysis.css'

export function AnalysisConfirmation({ title, description, stepCount, onConfirm, onBack, onHome }: {
  title: string; description: string; stepCount: number;
  onConfirm: () => void; onBack: () => void; onHome: () => void;
}) {
  const [more, setMore] = useState(false)
  return <main className="hh-analysis hh-analysis-confirm" aria-label="분석한 문제 확인">
    <GNB title="문제 분석하기" onBack={onBack} onClose={onHome} />
    <div className="hh-analysis-content">
      <h1>알려주신 상황과 비슷한 문제예요.<br />지금 겪고 있는 문제가 맞나요?</h1>
      <div className="hh-confirm-center"><section className="hh-confirm-card">
        <div><h2>{title}</h2><p>{description}</p></div>
        <span className="hh-confirm-tag">문제 해결 방법 {stepCount}단계 제공</span>
      </section></div>
      <div className="hh-analysis-next hh-confirm-actions"><Button variant="pale" onClick={() => setMore(true)}>이 문제가 아니에요</Button><Button onClick={onConfirm}>이 문제가 맞아요</Button></div>
    </div>
    <Dialog open={more} onClose={() => setMore(false)} className="ui-action-sheet hh-confirm-sheet" label="문제 상황 더 알려주기" swipeDismiss>
      <div className="ui-sheet-handle" aria-hidden="true" />
      <div className="hh-confirm-sheet-content"><div>
      <h2>문제 상황을 더 자세히 들려주세요</h2>
      <p>문제가 생긴 위치나 증상을 조금 더 알려주시면<br />다시 찾아볼게요.</p>
      </div><img src={moreInformation} alt="" /></div>
      <div className="hh-confirm-actions"><Button variant="pale" onClick={onHome}>홈으로 돌아가기</Button><Button onClick={onBack}>문제 상황 더 알려주기</Button></div>
    </Dialog>
  </main>
}
