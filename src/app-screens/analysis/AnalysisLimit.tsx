import { Button, GNB } from '../../components/ui'
import illustration from './assets/limit.png'
import './analysis.css'

/** The caller supplies copy because the server currently merges daily and billing limits. */
export function AnalysisLimit({ lines, onBack, onHome }: {
  lines: readonly string[]; onBack: () => void; onHome: () => void
}) {
  return <main className="hh-analysis hh-analysis-limit" aria-label="분석 사용 한도 안내">
    <GNB title="문제 분석하기" onBack={onBack} onClose={onHome} />
    <div className="hh-analysis-content">
      <div className="hh-analysis-copy" role="status">{lines.map(line => <p key={line}>{line}</p>)}</div>
      <div className="hh-analysis-illustration"><img className="hh-analysis-failure" src={illustration} alt="" style={{ transform: 'scaleX(-1)' }} /></div>
      <div className="hh-analysis-next"><Button onClick={onHome}>홈으로 돌아가기</Button></div>
    </div>
  </main>
}
