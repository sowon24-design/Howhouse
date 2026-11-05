const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const reasons = new Set(['situation-mismatch', 'incorrect-method', 'unsafe-method', 'too-difficult', 'missing-information', 'custom'])
export class FeedbackError extends Error {
  constructor(code) { super(code); this.code = code }
}
const invalid = () => { throw new FeedbackError('invalid-input') }
const object = value => value && typeof value === 'object' && !Array.isArray(value)
const exact = (value, names) => object(value) && Object.keys(value).every(key => names.includes(key))

export function validateFeedback(kind, body, catalog) {
  if (!['state', 'rating', 'opinions'].includes(kind) || !exact(body, kind === 'state' ? ['result']
    : kind === 'rating' ? ['result', 'operationId', 'revision', 'rating'] : ['result', 'operationId', 'reason', 'text'])) invalid()
  const result = body.result
  if (!object(result)) invalid()
  let target
  if (result.source === 'existing' && exact(result, ['source', 'caseId']) && typeof result.caseId === 'string') {
    if (!catalog.cases.some(item => item.id === result.caseId)) throw new FeedbackError('case-not-found')
    target = `existing:${result.caseId}`
  } else if (result.source === 'generated' && exact(result, ['source', 'resultId'])
    && typeof result.resultId === 'string' && result.resultId.startsWith('generated:') && uuid.test(result.resultId.slice(10))) {
    target = `generated:${result.resultId.slice(10).toLowerCase()}`
  } else invalid()
  if (kind === 'state') return { target }
  if (typeof body.operationId !== 'string' || !uuid.test(body.operationId)) invalid()
  const operationId = body.operationId.toLowerCase()
  if (kind === 'rating') {
    if (!Number.isSafeInteger(body.revision) || body.revision < 1 || ![null, 'like', 'dislike'].includes(body.rating)) invalid()
    return { target, operationId, revision: body.revision, rating: body.rating }
  }
  if (!reasons.has(body.reason)) invalid()
  if (body.reason === 'custom') {
    if (typeof body.text !== 'string' || body.text.length > 2000 || !body.text.replace(/[\s\p{Cf}]/gu, '')) invalid()
    return { target, operationId, reason: body.reason, text: body.text.trim() }
  }
  if (body.text !== undefined) invalid()
  return { target, operationId, reason: body.reason }
}

export async function parseFeedbackBody(req) {
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(req.headers['content-type'] ?? '')) invalid()
  const limit = 12 * 1024
  if (Number(req.headers['content-length']) > limit) invalid()
  let size = 0; const chunks = []
  for await (const chunk of req) { size += chunk.length; if (size > limit) invalid(); chunks.push(chunk) }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { invalid() }
}

export function feedbackStatus(code) {
  return code === 'case-not-found' || code === 'result-unavailable' ? 404
    : code === 'stale-selection' || code === 'idempotency-conflict' ? 409
    : code === 'invalid-input' ? 422 : 503
}

/** Verified user identity is passed by the existing hosted authentication middleware. */
export function createFeedbackService({ store, catalog }) {
  return {
    async handle(kind, ownerId, body) {
      if (!uuid.test(ownerId)) throw new FeedbackError('auth-required')
      return store.execute(ownerId, kind, validateFeedback(kind, body, catalog))
    },
    recordResult: (ownerId, requestId, result) => store.recordResult(ownerId, requestId, result),
  }
}
