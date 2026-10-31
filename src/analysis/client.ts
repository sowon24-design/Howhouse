/** Front-end connection contract. This is not the server's final wire format. */
export type AnalysisInput = {
  analysisUserText: string
  analysisUserPhotos: File[]
}

export type AnalysisResult<TGenerated> =
  | { source: 'existing'; caseId: string }
  | { source: 'generated'; solution: TGenerated }

export type AnalysisFailure = {
  code: 'invalid-input' | 'case-not-found' | 'sample-failure' | 'transport-error'
  message: string
}

export type AnalysisMode = 'sample' | 'api'
export type AnalysisTerminal<TGenerated> = {
  requestId: string
  mode: AnalysisMode
} & (
  | { status: 'succeeded'; result: AnalysisResult<TGenerated> }
  | { status: 'failed'; error: AnalysisFailure }
  | { status: 'cancelled'; reason: 'user' | 'superseded' }
)
export type AnalysisEvent<TGenerated> = AnalysisTerminal<TGenerated> | {
  requestId: string
  mode: AnalysisMode
  status: 'running'
}
export type AnalysisHandle<TGenerated> = {
  requestId: string
  cancel: () => void
  /** Always resolves to exactly one terminal state; cancellation is not failure. */
  completed: Promise<AnalysisTerminal<TGenerated>>
}
export type AnalysisTransport<TGenerated> = (
  input: AnalysisInput,
  context: { requestId: string; signal: AbortSignal },
) => Promise<AnalysisResult<TGenerated>>

class AnalysisError extends Error {
  readonly failure: AnalysisFailure
  constructor(failure: AnalysisFailure) {
    super(failure.message)
    this.failure = failure
  }
}

/** One instance per input flow. New starts cancel the previous active request. */
export function createAnalysisClient<TGenerated>(
  transport: AnalysisTransport<TGenerated>,
  mode: AnalysisMode,
) {
  let active: { requestId: string; cancel: (reason: 'user' | 'superseded') => void } | undefined

  function startAnalysis(
    input: AnalysisInput,
    onState: (event: AnalysisEvent<TGenerated>) => void,
  ): AnalysisHandle<TGenerated> {
    // Copy the array and text so edits to the input form cannot alter a request.
    const snapshot = { ...input, analysisUserPhotos: [...input.analysisUserPhotos] }
    const previous = active
    const requestId = crypto.randomUUID()
    const controller = new AbortController()
    let settled = false
    let resolveCompleted!: (event: AnalysisTerminal<TGenerated>) => void
    const completed = new Promise<AnalysisTerminal<TGenerated>>(resolve => { resolveCompleted = resolve })

    function publish(event: AnalysisEvent<TGenerated>) {
      // A screen callback error must not leave the request promise pending.
      try { onState(event) } catch (error) { console.error('Analysis state callback failed', error) }
    }
    function finish(event: AnalysisTerminal<TGenerated>) {
      if (settled) return
      settled = true
      if (active?.requestId === requestId) active = undefined
      resolveCompleted(event)
      publish(event)
    }
    function cancel(reason: 'user' | 'superseded') {
      if (settled) return
      // Settle before abort: even a synchronously arriving response cannot win.
      finish({ requestId, mode, status: 'cancelled', reason })
      controller.abort()
    }
    const handle = { requestId, cancel: () => cancel('user'), completed }
    active = { requestId, cancel }
    previous?.cancel('superseded')
    if (!settled) publish({ requestId, mode, status: 'running' })

    // Start asynchronously so a caller can store the handle before a result.
    void Promise.resolve().then(async () => {
      if (settled) return
      if ((!snapshot.analysisUserText.trim() && snapshot.analysisUserPhotos.length === 0)
        || snapshot.analysisUserPhotos.length > 5) {
        throw new AnalysisError({ code: 'invalid-input', message: '글 또는 사진이 필요하며 사진은 최대 5장입니다.' })
      }
      const result = await transport(snapshot, { requestId, signal: controller.signal })
      if (!settled) finish({ requestId, mode, status: 'succeeded', result })
    }).catch(error => {
      if (settled) return
      finish({ requestId, mode, status: 'failed', error: error instanceof AnalysisError
        ? error.failure
        : { code: 'transport-error', message: '분석 요청을 완료하지 못했습니다.' } })
    })
    return handle
  }

  return { startAnalysis, cancel: () => active?.cancel('user') }
}

/** Manual sample only: no timers, network, photo analysis, or paid model calls. */
export function createSampleAnalysisClient<TGenerated = never>(options: {
  result: AnalysisResult<TGenerated>
  getSolutionById: (id: string) => unknown | undefined
}) {
  type Pending = {
    resolve: (value: AnalysisResult<TGenerated>) => void
    reject: (error: Error) => void
    detach: () => void
  }
  const pending = new Map<string, Pending>()
  const client = createAnalysisClient<TGenerated>((_input, { requestId, signal }) => new Promise((resolve, reject) => {
    const onAbort = () => {
      pending.delete(requestId)
      signal.removeEventListener('abort', onAbort)
      reject(new Error('Sample cancelled'))
    }
    if (signal.aborted) { onAbort(); return }
    signal.addEventListener('abort', onAbort, { once: true })
    pending.set(requestId, { resolve, reject, detach: () => signal.removeEventListener('abort', onAbort) })
  }), 'sample')

  // Invoking controls immediately after start is also safe: transport is queued first.
  function completeSample(requestId: string, outcome: 'success' | 'failure' = 'success') {
    queueMicrotask(() => {
      const request = pending.get(requestId)
      if (!request) return
      pending.delete(requestId)
      request.detach()
      if (outcome === 'failure') {
        request.reject(new AnalysisError({ code: 'sample-failure', message: '화면 연결 확인용 샘플 실패입니다.' }))
        return
      }
      try {
        if (options.result.source === 'existing' && !options.getSolutionById(options.result.caseId)) {
          throw new AnalysisError({ code: 'case-not-found', message: '선택한 사례 ID를 현재 데이터에서 찾을 수 없습니다.' })
        }
        request.resolve(structuredClone(options.result))
      } catch (error) {
        request.reject(error instanceof Error ? error : new Error('Sample lookup failed'))
      }
    })
  }
  return { ...client, completeSample }
}
