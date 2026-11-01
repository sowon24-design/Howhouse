import { AnalysisError, createAnalysisClient } from './client'
import type { AnalysisFailure, AnalysisResult } from './client'
import { isGeneratedContent, toGeneratedSolution } from './solution'
import type { GeneratedSolution } from './solution'
import { analysisTimeoutMs, runWithDeadline } from './deadline'
import type { DeadlineScheduler } from './deadline'
import { resolveAnalysisBaseUrl, defaultAnalysisBaseUrl } from './endpoint'
import { configuredAppSession } from './app-session'

const failureCodes = new Set<AnalysisFailure['code']>([
  'invalid-input', 'insufficient-input', 'unsafe-input', 'model-refusal', 'analysis-timeout', 'catalog-mismatch', 'budget-limit', 'server-busy', 'api-error',
  'auth-required',
])

function fail(code: AnalysisFailure['code']): never {
  throw new AnalysisError({ code, message: '분석 요청을 완료하지 못했습니다. 입력은 유지됩니다.' })
}
async function fetchServer(fetchImpl: typeof fetch, url: string, options: RequestInit) {
  try { return await fetchImpl(url, options) }
  catch (error) {
    if (options.signal?.aborted) throw error
    fail('connection-error')
  }
}
async function readJson(response: Response, signal?: AbortSignal): Promise<unknown> {
  try { return await response.json() }
  catch (error) {
    if (signal?.aborted) throw error
    // A readable HTTP status proves the server responded, even if its body is HTML.
    fail(response.ok ? 'invalid-response' : 'server-error')
  }
}

export type AnalysisConnection = {
  status: 'reachable' | 'unreachable' | 'server-error' | 'invalid-response' | 'auth-required'
  scope: 'local-analysis-server' | 'analysis-server' | 'analysis-path'
}

/** Free reachability check only: no model, key, input data, retries or analysis restart. */
export async function checkAnalysisConnection(options: {
  signal?: AbortSignal; fetchImpl?: typeof fetch; verifyUpstream?: boolean; baseUrl?: string
  getAccessToken?: (signal: AbortSignal) => Promise<string>
} = {}): Promise<AnalysisConnection> {
  const base = resolveAnalysisBaseUrl(options.baseUrl)
  const scope = options.verifyUpstream ? 'analysis-path' as const
    : base === defaultAnalysisBaseUrl ? 'local-analysis-server' as const : 'analysis-server' as const
  try {
    options.signal?.throwIfAborted()
    const getAccessToken = options.getAccessToken ?? configuredAppSession()
    const accessToken = await getAccessToken?.(options.signal ?? new AbortController().signal)
    options.signal?.throwIfAborted()
    if (getAccessToken && !accessToken) fail('auth-required')
    const response = await fetchServer(options.fetchImpl ?? fetch, `${base}/health${options.verifyUpstream ? '?upstream=1' : ''}`, {
      method: 'GET', cache: 'no-store', signal: options.signal,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
    if (response.status === 401 || response.status === 403) return { status: 'auth-required', scope }
    if (!response.ok) return { status: 'server-error', scope }
    const data = await readJson(response, options.signal)
    const valid = data && typeof data === 'object' && 'service' in data && data.service === 'howhouse-analysis'
      && 'status' in data && data.status === 'ok'
    const upstreamValid = !options.verifyUpstream || valid && 'connection' in data && data.connection === 'reachable'
    return { status: valid && upstreamValid ? 'reachable' : 'invalid-response', scope }
  } catch (error) {
    if (options.signal?.aborted) throw error
    if (error instanceof AnalysisError && error.failure.code === 'auth-required') return { status: 'auth-required', scope }
    return { status: error instanceof AnalysisError && error.failure.code === 'invalid-response'
      ? 'invalid-response' : 'unreachable', scope }
  }
}

/** Configurable endpoint; current server still uses a local development session contract. */
export function createHttpAnalysisClient(options: {
  catalog: string
  getSolutionById: (id: string) => unknown | undefined
  fetchImpl?: typeof fetch
  deadlineScheduler?: DeadlineScheduler
  baseUrl?: string
  /** User login token for a hosted trial, never an OpenAI or Supabase secret key. */
  getAccessToken?: (signal: AbortSignal) => Promise<string>
}) {
  const fetchImpl = options.fetchImpl ?? fetch
  const base = resolveAnalysisBaseUrl(options.baseUrl)
  const getAccessToken = options.getAccessToken ?? configuredAppSession()
  return createAnalysisClient<GeneratedSolution>((input, { requestId, signal: parentSignal }) => runWithDeadline(async signal => {
    // Development input guards match server limits; reject before opening any connection.
    if (input.analysisUserText.length > 6000 || input.analysisUserPhotos.some(photo =>
      !['image/jpeg', 'image/png', 'image/webp'].includes(photo.type) || !photo.size || photo.size > 4 * 1024 * 1024)) {
      fail('invalid-input')
    }
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(options.catalog))
    const catalogVersion = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('')
    const accessToken = await getAccessToken?.(signal)
    signal.throwIfAborted()
    if (getAccessToken && !accessToken) fail('auth-required')
    const authHeaders = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
    const sessionResponse = await fetchServer(fetchImpl, `${base}/session`, { signal, cache: 'no-store', headers: authHeaders })
    if (!sessionResponse.ok) fail(sessionResponse.status === 401 || sessionResponse.status === 403 ? 'auth-required' : 'server-error')
    const session = await readJson(sessionResponse, signal)
    if (!session || typeof session !== 'object' || !('token' in session) || typeof session.token !== 'string') {
      fail('invalid-response')
    }
    const body = new FormData()
    body.set('requestId', requestId)
    body.set('catalogVersion', catalogVersion)
    body.set('analysisUserText', input.analysisUserText)
    for (const photo of input.analysisUserPhotos) body.append('analysisUserPhotos', photo)
    const response = await fetchServer(fetchImpl, `${base}/api/analysis/match`, {
      method: 'POST', headers: { ...authHeaders, 'X-Howhouse-Session': session.token }, body, signal,
    })
    const data = await readJson(response, signal)
    if (!response.ok && (response.status === 401 || response.status === 403)) fail('auth-required')
    if (!data || typeof data !== 'object' || !('requestId' in data) || data.requestId !== requestId) {
      fail(response.ok ? 'invalid-response' : 'server-error')
    }
    if (!response.ok) {
      const code = 'code' in data && typeof data.code === 'string' && failureCodes.has(data.code as AnalysisFailure['code'])
        ? data.code as AnalysisFailure['code'] : 'server-error'
      fail(code)
    }
    if (!('result' in data) || !data.result || typeof data.result !== 'object') fail('invalid-response')
    const result = data.result
    if ('source' in result && result.source === 'existing' && 'caseId' in result && typeof result.caseId === 'string'
      && options.getSolutionById(result.caseId)) return { source: 'existing', caseId: result.caseId } satisfies AnalysisResult<never>
    if ('source' in result && result.source === 'generated' && 'solution' in result && isGeneratedContent(result.solution)) {
      return { source: 'generated', solution: toGeneratedSolution(result.solution, requestId) }
    }
    throw new AnalysisError({ code: 'case-not-found', message: '현재 데이터에 없는 사례 결과입니다.' })
  }, { signal: parentSignal, timeoutMs: analysisTimeoutMs, schedule: options.deadlineScheduler,
    timeoutError: () => new AnalysisError({ code: 'analysis-timeout', message: '분석 대기 시간이 초과됐습니다. 입력은 유지됩니다.' }) }), 'api')
}
