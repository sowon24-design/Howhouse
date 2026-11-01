import { createCipheriv, createHmac, randomBytes } from 'node:crypto'
import { FeedbackError } from './feedback.mjs'

/** No default: an unresolved retention policy must never silently mean forever. */
export function readFeedbackRetention(env) {
  if (env.FEEDBACK_RETENTION_DAYS === undefined || env.FEEDBACK_RETENTION_DAYS === '') return undefined
  if (!/^[1-9]\d*$/.test(env.FEEDBACK_RETENTION_DAYS)) throw new Error('Invalid feedback retention setting')
  const days = Number(env.FEEDBACK_RETENTION_DAYS)
  if (!Number.isSafeInteger(days) || days > 3650) throw new Error('Invalid feedback retention setting')
  return days
}

const acceptedCodes = new Set(['invalid-input', 'result-unavailable', 'stale-selection', 'idempotency-conflict', 'feedback-not-configured'])
export function createFeedbackStore({ supabaseUrl, secretKey, encryptionKey, retentionDays, fetchImpl = fetch }) {
  const url = new URL(supabaseUrl), key = Buffer.from(encryptionKey ?? '', 'base64')
  if (url.protocol !== 'https:' || url.origin + '/' !== url.href || !secretKey?.startsWith('sb_secret_') || key.length !== 32
    || !Number.isSafeInteger(retentionDays) || retentionDays < 1 || retentionDays > 3650) throw new Error('Invalid server-only feedback settings')
  async function rpc(ownerId, kind, payload, hash = null) {
    let data
    try {
      const response = await fetchImpl(`${url.origin}/rest/v1/rpc/howhouse_feedback`, {
        method: 'POST', headers: { apikey: secretKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_owner: ownerId, p_kind: kind, p_payload: payload, p_hash: hash, p_days: retentionDays }),
        signal: AbortSignal.timeout(10000), redirect: 'error',
      })
      if (!response.ok) throw new Error()
      data = await response.json()
    } catch { throw new FeedbackError('storage-unavailable') }
    if (data?.ok === false && acceptedCodes.has(data.code)) throw new FeedbackError(data.code)
    if (data?.ok !== true || !data.data || typeof data.data !== 'object') throw new FeedbackError('storage-unavailable')
    return data.data
  }
  return {
    async execute(ownerId, kind, payload) {
      const hash = createHmac('sha256', key).update(JSON.stringify({ ownerId, kind, payload })).digest('hex')
      const encrypted = { ...payload }
      if (payload.text !== undefined) {
        const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv)
        cipher.setAAD(Buffer.from(`${ownerId}:${payload.operationId}:${payload.target}`))
        const bytes = Buffer.concat([cipher.update(payload.text, 'utf8'), cipher.final()])
        encrypted.comment = { iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: bytes.toString('base64') }
        delete encrypted.text
      }
      return rpc(ownerId, kind, encrypted, hash)
    },
    recordResult(ownerId, requestId, result) {
      return rpc(ownerId, 'result', { requestId, source: result.source, ...(result.source === 'existing' ? { caseId: result.caseId } : {}) })
    },
  }
}
