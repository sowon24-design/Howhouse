import { useEffect, useRef, useState } from 'react'
import { useAndroidBack } from '../android-back'
import { createSampleAnalysisClient, existingCaseSample } from '../../analysis'
import type { AnalysisHandle, AnalysisEvent } from '../../analysis'
import { getSolutionById } from '../../solutions/data'
import { AnalysisScreen } from '../analysis/AnalysisScreen'
import { ProblemScreen, canAnalyze } from './ProblemScreen'
import type { AnalysisInput } from './ProblemScreen'
import '../home/home-preview.css'

export function ProblemPreview({ input, onChange, onInputBack, onSuccess }: {
  input: AnalysisInput; onChange: (input: AnalysisInput) => void;
  onInputBack?: () => void; onSuccess: (caseId: string) => void;
}) {
  const [analysis] = useState(() => createSampleAnalysisClient({result: existingCaseSample, getSolutionById}))
  const [phase, setPhase] = useState<'input' | 'pending' | 'failed'>('input')
  const [closingHome, setClosingHome] = useState(false)
  const request = useRef<AnalysisHandle<never> | null>(null)
  const activeId = useRef<string | null>(null)
  const cancelledId = useRef<string | null>(null)
  const mounted = useRef(false)
  const [status, setStatus] = useState('샘플 분석 모드 · 실제 API나 사진 분석 없이 욕실·수도:1 사례로 연결합니다.')
  useEffect(() => {
    mounted.current = true
    return () => {mounted.current = false; activeId.current = null; analysis.cancel()}
  }, [analysis])
  function cancel() {
    if (request.current) cancelledId.current = request.current.requestId
    activeId.current = null
    request.current?.cancel()
    request.current = null
  }
  function receive(event: AnalysisEvent<never>) {
    if (!mounted.current) return
    if (event.status === 'running') {
      activeId.current = event.requestId
      setPhase('pending')
      setStatus('샘플 분석 대기 중 · 아래 성공/실패 버튼으로 완료합니다. 실제 API 호출은 없습니다.')
      return
    }
    if (event.requestId !== activeId.current) return
    activeId.current = null
    if (event.status === 'succeeded') {
      if (event.result.source === 'existing' && getSolutionById(event.result.caseId)) onSuccess(event.result.caseId)
      else {setPhase('failed');setStatus('지원하지 않거나 찾을 수 없는 샘플 결과입니다.')}
    } else if (event.status === 'failed') {
      setPhase('failed');setStatus(`샘플 분석 실패 (${event.error.code}) · 입력을 보존합니다.`)
    }
    // Cancellation does not choose a destination. The initiating UI owns navigation.
  }
  useAndroidBack(() => {
    cancel()
    if (phase === 'input') {
      if (onInputBack) onInputBack(); else window.location.hash = 'home'
    } else {
      setPhase('input')
      setClosingHome(false)
      setStatus('입력으로 돌아왔습니다. 글·사진은 유지되며 자동 재분석하지 않습니다.')
    }
  })
  return <div className="hh-home-preview">
    <div className="hh-home-preview-frame hh-problem-preview-frame">
      <div className="hh-problem-layer-stack">
        <div className="hh-problem-layer-input" inert={phase !== 'input'} aria-hidden={phase !== 'input'} style={closingHome ? {visibility:'hidden'} : undefined}>
          <ProblemScreen input={input} onChange={onChange} onBack={() => {cancel(); if(onInputBack)onInputBack();else window.location.hash='home'}}
            onCapture={() => setStatus('사진 촬영은 Android 앱에서 사용할 수 있습니다. 웹에서는 사진 보관함 선택으로 확인해 주세요.')}
            onAnalyze={snapshot => {
              if (!canAnalyze(snapshot) || activeId.current) return
              if (typeof crypto.randomUUID !== 'function') {
                setStatus('현재 HTTP 주소에서는 샘플 모듈의 요청 ID 생성 기능을 사용할 수 없습니다. 같은 컴퓨터의 localhost 주소로 확인해 주세요. Android 실행 환경 호환성은 후속 연결 단계에서 확인합니다.')
                return
              }
              cancel()
              request.current = analysis.startAnalysis(snapshot, receive)
            }} />
        </div>
        {phase !== 'input' && <AnalysisScreen failed={phase === 'failed'}
          onCancel={target => {cancel();setClosingHome(target === 'home')}}
          onBack={() => {setPhase('input');setClosingHome(false);setStatus('입력으로 돌아왔습니다. 글·사진은 유지되며 자동 재분석하지 않습니다.')}}
          onHome={() => {window.location.hash='home'}} />}
      </div>
    </div>
    <details className="hh-home-preview-tools hh-preview-disclosure" aria-label="문제 작성 미리보기 안내"><summary>개발용 안내·테스트 도구</summary><div className="hh-preview-disclosure-panel">
      <a href="#home" onClick={cancel}>홈으로 이동 · 입력 초기화</a> · <a href="#components" onClick={cancel}>공통 컴포넌트 보기</a>
      <p role="status">{status}</p>
      {phase === 'pending' && <>
        <button type="button" onClick={() => {if(request.current)analysis.completeSample(request.current.requestId)}}>샘플 분석 성공 재현</button>
        <button type="button" onClick={() => {if(request.current)analysis.completeSample(request.current.requestId,'failure')}}>샘플 분석 실패 재현</button>
      </>}
      {cancelledId.current && <button type="button" onClick={() => {analysis.completeSample(cancelledId.current!);setStatus('종료한 요청의 결과를 재전달했습니다. 화면과 현재 요청은 유지되어야 합니다.')}}>취소된 응답 재현 · 무시 확인</button>}
    </div></details>
  </div>
}
