import { AnalysisLimit } from '../analysis/AnalysisLimit'
import { AnalysisConfirmation } from '../analysis/AnalysisConfirmation'
import { useEffect, useRef, useState } from 'react'
import { useAndroidBack } from '../android-back'
import { createSampleAnalysisClient, createHttpAnalysisClient, serializeCatalog, existingCaseSample, generatedSampleResult } from '../../analysis'
import type { AnalysisHandle, AnalysisEvent, AnalysisResult, GeneratedSolution } from '../../analysis'
import { getAnalysisFailureKind } from '../../analysis/client'
import type { AnalysisFailure } from '../../analysis/client'
import { getSolutionById, solutionCases } from '../../solutions/data'
import { AnalysisScreen } from '../analysis/AnalysisScreen'
import { ProblemScreen, canAnalyze } from './ProblemScreen'
import type { AnalysisInput } from './ProblemScreen'
import '../home/home-preview.css'

export function ProblemPreview({ input, onChange, onInputBack, onSuccess, suspended = false, onConnectionLost }: {
  input: AnalysisInput; onChange: (input: AnalysisInput) => void;
  onInputBack?: () => void; onSuccess: (result: AnalysisResult<GeneratedSolution>) => void;
  suspended?: boolean; onConnectionLost?: () => void;
}) {
  const [sample] = useState(() => createSampleAnalysisClient<GeneratedSolution>({result: existingCaseSample, getSolutionById}))
  const [generatedSample] = useState(() => createSampleAnalysisClient<GeneratedSolution>({result: generatedSampleResult, getSolutionById}))
  const [api] = useState(() => createHttpAnalysisClient({catalog: serializeCatalog(solutionCases), getSolutionById}))
  const [mode, setMode] = useState<'sample' | 'api'>(import.meta.env.MODE === 'trial' ? 'api' : 'sample')
  const [sampleKind, setSampleKind] = useState<'existing' | 'generated'>('existing')
  const selectedSample = sampleKind === 'existing' ? sample : generatedSample
  const analysis = mode === 'api' ? api : selectedSample
  const [phase, setPhase] = useState<'input' | 'pending' | 'failed' | 'confirm' | 'limit'>('input')
  const [result, setResult] = useState<AnalysisResult<GeneratedSolution> | null>(null)
  const solution = result?.source === 'existing' ? getSolutionById(result.caseId) : result?.solution
  const [closingHome, setClosingHome] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [failureCode, setFailureCode] = useState<AnalysisFailure['code'] | undefined>()
  const request = useRef<AnalysisHandle<GeneratedSolution> | null>(null)
  const activeId = useRef<string | null>(null)
  const cancelledId = useRef<string | null>(null)
  const mounted = useRef(false)
  const [status, setStatus] = useState(import.meta.env.MODE === 'trial'
    ? '시험 APK · 실제 API 기본 모드. 분석 버튼을 누르면 요청하며 새 분석은 과금될 수 있습니다. 아래에서 무료 샘플로 전환할 수 있습니다.'
    : '무료 샘플 모드 · 실제 API 호출 없음. 기존 사례 또는 생성 결과 샘플을 선택해 확인하세요.')
  useEffect(() => {
    mounted.current = true
    return () => {mounted.current = false; activeId.current = null; analysis.cancel()}
  }, [analysis])
  useEffect(() => {
    if (suspended) {
      activeId.current = null; request.current?.cancel(); request.current = null
      setResult(null);setPhase('input');setClosingHome(false)
      setStatus('연결 중단으로 분석을 종료했습니다. 글·사진은 유지되며 복구 후 버튼을 눌러야 새 요청이 시작됩니다.')
    }
  }, [suspended])
  function cancel() {
    if (request.current) cancelledId.current = request.current.requestId
    activeId.current = null
    setResult(null)
    request.current?.cancel()
    request.current = null
  }
  function receive(event: AnalysisEvent<GeneratedSolution>) {
    if (!mounted.current) return
    if (event.status === 'running') {
      activeId.current = event.requestId
      setFeedback('');setFailureCode(undefined)
      setPhase('pending')
      setStatus(event.mode === 'sample' ? '샘플 분석 대기 중 · 아래 성공/실패 버튼으로 완료합니다. 실제 API 호출은 없습니다.' : '실제 GPT가 글·사진과 기존 사례를 비교하고 있습니다. 자동 재시도는 하지 않습니다.')
      return
    }
    if (event.requestId !== activeId.current) return
    activeId.current = null
    if (event.status === 'succeeded') {
      if (event.result.source === 'generated' || getSolutionById(event.result.caseId)) {setResult(event.result);setPhase('confirm')}
      else {setPhase('failed');setStatus('지원하지 않거나 찾을 수 없는 샘플 결과입니다.')}
    } else if (event.status === 'failed') {
      if (event.error.code === 'budget-limit') setPhase('limit')
      else if (event.mode === 'api' && getAnalysisFailureKind(event.error.code) !== 'analysis') setPhase('input')
      else setPhase('failed')
      setFailureCode(event.error.code)
      setFeedback(event.error.code === 'budget-limit' ? '현재 분석 이용 한도에 도달했어요. 입력한 내용은 유지돼요.'
        : event.error.code === 'server-busy' ? '다른 분석이 진행 중이에요. 잠시 후 다시 시도해 주세요. 입력한 내용은 유지돼요.'
        : event.error.code === 'invalid-input' ? '입력한 글과 첨부 사진의 형식·크기를 확인해 주세요.'
        : '분석 결과를 불러오지 못했어요. 잠시 후 다시 시도해 주세요. 입력한 내용은 유지돼요.')
      setStatus(`${event.mode === 'sample' ? '샘플' : '실제'} 분석 중단 (${event.error.code}) · 입력을 보존합니다. 자동 재시도하지 않습니다.`)
      if (event.error.code === 'connection-error') onConnectionLost?.()
    }
    // Cancellation does not choose a destination. The initiating UI owns navigation.
  }
  useAndroidBack(() => {
    cancel()
    if (phase === 'input') {
      if (onInputBack) onInputBack(); else window.location.hash = 'home'
    } else {
      setPhase('input')
      setFeedback('')
      setClosingHome(false)
      setStatus('입력으로 돌아왔습니다. 글·사진은 유지되며 자동 재분석하지 않습니다.')
    }
  })
  return <div className="hh-home-preview">
    <div className="hh-home-preview-frame hh-problem-preview-frame">
      <div className="hh-problem-layer-stack">
        <div className="hh-problem-layer-input" inert={phase !== 'input'} aria-hidden={phase !== 'input'} style={closingHome ? {visibility:'hidden'} : undefined}>
          <ProblemScreen input={input} onChange={value => {setFeedback('');onChange(value)}} analysisError={feedback} onBack={() => {cancel(); if(onInputBack)onInputBack();else window.location.hash='home'}}
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
        {(phase === 'pending' || phase === 'failed') && <AnalysisScreen failed={phase === 'failed'} failureCode={failureCode}
          onCancel={target => {cancel();setClosingHome(target === 'home')}}
          onBack={() => {setFeedback('');setResult(null);setPhase('input');setClosingHome(false);setStatus('입력으로 돌아왔습니다. 글·사진은 유지되며 자동 재분석하지 않습니다.')}}
          onHome={() => {window.location.hash='home'}} />}
        {phase === 'limit' && <AnalysisLimit lines={['오늘은 더 이상 분석할 수 없어요.', '내일 다시 시도해 주세요.']} onBack={() => {cancel();setFeedback('');setPhase('input')}} onHome={() => {cancel();window.location.hash='home'}} />}
        {phase === 'confirm' && result && solution && <AnalysisConfirmation title={solution.title} description={solution.description} stepCount={solution.steps.length}
          onConfirm={() => onSuccess(result)} onBack={() => {setResult(null);setPhase('input')}} onHome={() => {cancel();window.location.hash='home'}} />}
      </div>
    </div>
    <details className="hh-home-preview-tools hh-preview-disclosure" aria-label="문제 작성 미리보기 안내"><summary>개발용 안내·테스트 도구</summary><div className="hh-preview-disclosure-panel">
      <a href="#home" onClick={cancel}>홈으로 이동 · 입력 초기화</a> · <a href="#components" onClick={cancel}>공통 컴포넌트 보기</a>
      <p role="status">{status}</p>
      <p>현재 모드: {mode === 'api' ? '실제 API' : `무료 샘플 · ${sampleKind === 'existing' ? '기존 사례' : '생성 결과'}`}</p>
      {mode === 'sample' && <button type="button" onClick={() => {cancel();setFeedback('');setPhase('limit');setStatus('A07 한도 안내 재현 · API 호출 없음')}}>분석 한도 안내 A07 재현</button>}
      {onConnectionLost && <button type="button" onClick={onConnectionLost}>연결 끊김 재현 · API 호출 없음</button>}
      {<button type="button" disabled={phase === 'pending'} onClick={() => {
        cancel();setResult(null);setPhase('input');setClosingHome(false);setFeedback('');setFailureCode(undefined)
        const next = mode === 'sample' ? 'api' : 'sample';setMode(next)
        setStatus(next === 'api' ? '실제 GPT 분석 모드 · 저장 답변이 없을 때만 글·사진을 OpenAI로 전달합니다. 새로운 분석은 과금됩니다.' : '무료 샘플 모드 · 실제 API 호출 없음. 성공/실패 재현 버튼으로 완료합니다.')
      }}>{mode === 'sample' ? '실제 GPT 검색 모드로 전환 · 유료' : '무료 샘플 모드로 전환'}</button>}
      {mode === 'sample' && phase !== 'pending' && <button type="button" onClick={() => setSampleKind(sampleKind === 'existing' ? 'generated' : 'existing')}>{sampleKind === 'existing' ? '생성 결과 샘플 선택' : '기존 사례 샘플 선택'}</button>}
      {mode === 'sample' && phase === 'pending' && <>
        <button type="button" onClick={() => {if(request.current)selectedSample.completeSample(request.current.requestId)}}>샘플 분석 성공 재현</button>
        <button type="button" onClick={() => {if(request.current)selectedSample.completeSample(request.current.requestId,'failure')}}>샘플 분석 실패 재현</button>
      </>}
      {mode === 'sample' && cancelledId.current && <button type="button" onClick={() => {sample.completeSample(cancelledId.current!);generatedSample.completeSample(cancelledId.current!);setStatus('종료한 요청의 결과를 재전달했습니다. 화면과 현재 요청은 유지되어야 합니다.')}}>취소된 응답 재현 · 무시 확인</button>}
    </div></details>
  </div>
}
