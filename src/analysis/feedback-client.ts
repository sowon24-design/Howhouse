export type FeedbackTarget = { source: 'existing'; caseId: string } | { source: 'generated'; resultId: string }
export type FeedbackRating = 'like' | 'dislike' | null
export type FeedbackReason = 'situation-mismatch' | 'incorrect-method' | 'unsafe-method' | 'too-difficult' | 'missing-information' | 'custom'
export type FeedbackState = { rating: FeedbackRating; revision: number; updatedAt: string | null }
type Receipt = { operationId: string; saved: true; duplicate: boolean; submittedAt: string; revision?: number }
export class FeedbackClientError extends Error {
  readonly code: string
  constructor(code: string) { super(code); this.code = code }
}
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export function feedbackTarget(source: string, id?: string): FeedbackTarget | undefined {
  if (source === 'generated') return id?.startsWith('generated:') && uuid.test(id.slice(10)) ? { source, resultId: id } : undefined
  return source === 'existing' && id && /^(욕실·수도|난방·전기|가전|해충·곰팡이):[^:]+$/.test(id) ? { source, caseId: id } : undefined
}
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
export const feedbackReasonCodes: Record<string, FeedbackReason> = {
  '내 상황과 달라요.': 'situation-mismatch', '방법이 틀린 것 같아요.': 'incorrect-method',
  '따라하기 위험해 보여요.': 'unsafe-method', '어려워 보여요.': 'too-difficult',
  '필요한 준비물·정보가 빠졌어요.': 'missing-information', '직접 입력하기': 'custom',
}
export function feedbackErrorMessage(error: unknown): string {
  const code = error instanceof FeedbackClientError ? error.code : 'connection-error'
  switch (code) {
    case 'sample-result': return '무료 생성 샘플은 평가·의견을 저장하지 않아요.'
    case 'feedback-not-configured': return '평가·의견 저장 연결이 아직 준비되지 않았어요.'
    case 'auth-required': return '저장에 필요한 앱 인증을 확인하지 못했어요. 작성 내용은 유지돼요.'
    case 'result-unavailable': case 'case-not-found': return '이 결과에 의견을 저장할 수 없어요. 작성 내용은 유지돼요.'
    case 'invalid-input': return '사유를 선택하고 직접 입력 의견은 2,000자 이내로 작성해 주세요.'
    case 'stale-selection': return '다른 선택이 먼저 저장됐어요. 현재 선택을 다시 저장해 주세요.'
    case 'idempotency-conflict': return '저장 요청을 확인하지 못했어요. 선택 내용을 변경한 뒤 다시 시도해 주세요.'
    default: return '저장 여부를 확인하지 못했어요. 작성 내용은 유지되니 다시 시도해 주세요.'
  }
}
/** Only our feedback API. No provider requests, raw problem input or message bodies. */
export function createFeedbackClient(options: {
  baseUrl: string; target: FeedbackTarget; getAccessToken: (signal: AbortSignal) => Promise<string>;
  fetchImpl?: typeof fetch; makeId?: () => string
}) {
  const base = new URL(options.baseUrl)
  if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password || base.search || base.hash
    || base.protocol === 'http:' && !['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname)) throw new FeedbackClientError('feedback-not-configured')
  const fetchImpl = options.fetchImpl ?? fetch, makeId = options.makeId ?? (() => crypto.randomUUID())
  const controllers = new Set<AbortController>()
  let revision = 0, loaded = false, stateJob: Promise<FeedbackState> | undefined
  let ratingIntent: { operationId: string; revision: number; rating: FeedbackRating } | undefined
  let opinionIntent: { operationId: string; reason: FeedbackReason; text?: string } | undefined
  let ratingJob: Promise<Receipt> | undefined, opinionJob: Promise<Receipt> | undefined, inFlightRating: FeedbackRating = null
  async function request(kind: string, body: unknown, existingToken?: string): Promise<Record<string, unknown>> {
    const controller = new AbortController(); controllers.add(controller)
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(10000)])
    try {
      const token = existingToken ?? await options.getAccessToken(signal)
      const response = await fetchImpl(`${base.href.replace(/\/$/, '')}/api/feedback/${kind}`, {
        method: 'POST', signal, redirect: 'error', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body),
      })
      let data: unknown
      try { data = await response.json() } catch { throw new FeedbackClientError('invalid-response') }
      if (!response.ok) throw new FeedbackClientError(response.status === 401 || response.status === 403 ? 'auth-required'
        : object(data) && typeof data.code === 'string' ? data.code : response.status === 404 ? 'feedback-not-configured' : 'storage-unavailable')
      if (!object(data)) throw new FeedbackClientError('invalid-response')
      return data
    } catch (error) {
      if (error instanceof FeedbackClientError) throw error
      const code = object(error) && object(error.failure) && typeof error.failure.code === 'string' ? error.failure.code : 'connection-error'
      throw new FeedbackClientError(code)
    } finally { controllers.delete(controller) }
  }
  async function loadState(existingToken?: string): Promise<FeedbackState> {
    const data = await request('state', { result: options.target }, existingToken)
    if (![null, 'like', 'dislike'].includes(data.rating as FeedbackRating) || !Number.isSafeInteger(data.revision) || Number(data.revision) < 0
      || data.updatedAt !== null && typeof data.updatedAt !== 'string') throw new FeedbackClientError('invalid-response')
    revision = Math.max(revision, Number(data.revision)); loaded = true
    return data as FeedbackState
  }
  function getState(existingToken?: string) {
    if (!stateJob) stateJob = loadState(existingToken).finally(() => { stateJob = undefined })
    return stateJob
  }
  async function persist(kind: string, intent: { operationId: string; revision?: number }): Promise<Receipt> {
    const data = await request(kind, { result: options.target, ...intent })
    if (data.saved !== true || data.operationId !== intent.operationId || typeof data.duplicate !== 'boolean'
      || typeof data.submittedAt !== 'string' || !Number.isFinite(Date.parse(data.submittedAt))
      || kind === 'rating' && data.revision !== intent.revision) throw new FeedbackClientError('invalid-response')
    return data as Receipt
  }
  function setRating(rating: FeedbackRating): Promise<Receipt> {
    if (ratingJob) return inFlightRating === rating ? ratingJob : Promise.reject(new FeedbackClientError('busy'))
    inFlightRating = rating
    ratingJob = (async () => {
      if (!loaded) await getState()
      if (!ratingIntent || ratingIntent.rating !== rating) ratingIntent = { operationId: makeId(), revision: ++revision, rating }
      try { const result = await persist('rating', ratingIntent); ratingIntent = undefined; return result }
      catch (error) {
        if (error instanceof FeedbackClientError && error.code === 'stale-selection') {
          ratingIntent = undefined; loaded = false // Next explicit retry re-reads revision and creates a new intent.
        }
        throw error
      }
    })().finally(() => { ratingJob = undefined })
    return ratingJob
  }
  function submitOpinion(reason: FeedbackReason, text: string): Promise<Receipt> {
    const normalized = reason === 'custom' ? text.trim() : undefined
    if (!Object.values(feedbackReasonCodes).includes(reason) || reason === 'custom' && (!normalized?.replace(/[\s\p{Cf}]/gu, '') || text.length > 2000)) return Promise.reject(new FeedbackClientError('invalid-input'))
    if (opinionJob) return opinionIntent?.reason === reason && opinionIntent.text === normalized ? opinionJob : Promise.reject(new FeedbackClientError('busy'))
    if (!opinionIntent || opinionIntent.reason !== reason || opinionIntent.text !== normalized) opinionIntent = { operationId: makeId(), reason, ...(normalized === undefined ? {} : { text: normalized }) }
    opinionJob = persist('opinions', opinionIntent).then(result => { opinionIntent = undefined; return result }).finally(() => { opinionJob = undefined })
    return opinionJob
  }
  return { getState, setRating, submitOpinion, cancel: () => { for (const c of controllers) c.abort(); controllers.clear() } }
}
