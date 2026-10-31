import { useEffect, useRef, useState } from 'react'
import { AnalysisScreen } from '../analysis/AnalysisScreen'
import { ProblemScreen, canAnalyze } from './ProblemScreen'
import type { AnalysisInput } from './ProblemScreen'
import '../home/home-preview.css'

export function ProblemPreview({ input, onChange }: { input: AnalysisInput; onChange: (input: AnalysisInput) => void }) {
  const [phase, setPhase] = useState<'input' | 'pending' | 'failed'>('input')
  const [closingHome, setClosingHome] = useState(false)
  const request = useRef<{id: number; controller: AbortController} | null>(null)
  const sequence = useRef(0)
  const lateResult = useRef<(() => void) | null>(null)
  useEffect(() => () => { request.current?.controller.abort(); request.current = null }, [])
  const cancel = () => { request.current?.controller.abort(); request.current = null }
  const [status, setStatus] = useState('A02 입력·사진 첨부 확인용입니다. 실제 분석 요청은 보내지 않습니다.')
  return <div className="hh-home-preview">
    <div className="hh-home-preview-frame hh-problem-preview-frame">
      <div className="hh-problem-layer-stack">
      <div className="hh-problem-layer-input" inert={phase !== 'input'} aria-hidden={phase !== 'input'} style={closingHome ? {visibility:'hidden'} : undefined}>
      <ProblemScreen input={input} onChange={onChange} onBack={() => { window.location.hash = 'home' }}
        onCapture={() => setStatus('사진 찍기 콜백을 확인했습니다. Android 시스템 카메라·권한·촬영 결과 연결은 아직 준비 단계입니다. 기존 입력은 유지됩니다.')}
        onAnalyze={snapshot => {
          if (!canAnalyze(snapshot)) return
          cancel()
          const current = {id: ++sequence.current, controller: new AbortController()}
          request.current = current
          lateResult.current = () => {
            if (current.controller.signal.aborted || request.current?.id !== current.id) {
              setStatus('취소된 이전 요청의 응답을 무시했습니다. 화면과 입력은 변경하지 않습니다.')
              return
            }
            setPhase('failed')
            setStatus('샘플 분석 실패입니다. 실제 API 요청은 보내지 않았습니다.')
          }
          setPhase('pending')
          setStatus(`샘플 분석 #${current.id}: 글 ${snapshot.analysisUserText.length}자, 사진 ${snapshot.analysisUserPhotos.length}장. 아래에서 실패를 재현할 수 있습니다. 실제 제한 시간은 미정입니다.`)
        }} />
      </div>
      {phase !== 'input' && <AnalysisScreen failed={phase === 'failed'}
        onCancel={target => { cancel(); setClosingHome(target === 'home') }}
        onBack={() => { setPhase('input'); setClosingHome(false); setStatus('분석을 중단하고 입력으로 돌아왔습니다. 글·사진은 유지됩니다.') }}
        onHome={() => { window.location.hash = 'home' }} />}
      </div>
    </div>
    <aside className="hh-home-preview-tools" aria-label="문제 작성 미리보기 안내">
      <a href="#home" onClick={cancel}>홈으로 이동 · 입력 초기화</a> · <a href="#components" onClick={cancel}>공통 컴포넌트 보기</a>
      <p role="status">{status}</p>
      {phase === 'pending' && <button type="button" onClick={() => lateResult.current?.()}>샘플 분석 실패 재현</button>}
      {phase === 'input' && lateResult.current && <button type="button" onClick={() => lateResult.current?.()}>취소된 응답 재현 · 무시 확인</button>}
    </aside>
  </div>
}
