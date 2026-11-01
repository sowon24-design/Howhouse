import { screenSlidesEnabled } from '../navigation-motion'
import { useState } from 'react'
import { Button, GNB } from '../../components/ui'
import { AnalysisIllustration } from './AnalysisIllustration'
import type { AnalysisFailure } from '../../analysis/client'
import { getAnalysisFailureCopy } from '../../analysis/failure-presentation'
import failure from './assets/failure.png'
import './analysis.css'

export function AnalysisScreen({ failed, onCancel, onBack, onHome, unsafe = false, timedOut = false, failureCode }: {
  failed: boolean; unsafe?: boolean; timedOut?: boolean; failureCode?: AnalysisFailure['code']; onCancel: (target: 'input' | 'home') => void; onBack: () => void; onHome: () => void
}) {
  const [leaving, setLeaving] = useState<'input' | 'home' | null>(null)
  const failureCopy = getAnalysisFailureCopy(failureCode ?? (unsafe ? 'unsafe-input' : timedOut ? 'analysis-timeout' : 'sample-failure'))
  function leave(target: 'input' | 'home') {
    if (leaving) return
    onCancel(target) // Stop work immediately, before the visual transition finishes.
    if (!screenSlidesEnabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (target === 'home') onHome(); else onBack()
    } else setLeaving(target)
  }
  return <main className={`hh-analysis${leaving ? ' hh-analysis--leaving' : ''}`} aria-label={failed ? '분석 실패' : '문제 분석 중'} inert={Boolean(leaving)} onAnimationEnd={event => {
    if (event.target === event.currentTarget && event.animationName === 'hh-problem-slide-out') {
      if (leaving === 'home') onHome(); else if (leaving === 'input') onBack()
    }
  }}>
    <GNB title="문제 분석하기" onBack={() => leave('input')} onClose={() => leave('home')} />
    <div className="hh-analysis-content">
      <div className="hh-analysis-copy" role="status">{failed ? failureCopy.map(line => <p key={line}>{line}</p>) : <><p>어디가 문제인지 알아보고 있어요.</p><p>입력한 내용과 사진을 확인하고 있어요.</p></>}</div>
      <div className="hh-analysis-illustration">{failed ? <img className="hh-analysis-failure" src={failure} alt="" /> : <AnalysisIllustration />}</div>
      <div className="hh-analysis-next"><Button disabled={!failed} onClick={() => leave('input')}>{failed ? '다시 문제 알려주기' : '잠시만 기다려 주세요'}</Button></div>
    </div>
  </main>
}
