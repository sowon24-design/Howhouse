import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { inputFingerprint } from './answer-cache.mjs'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Server-only persistent trial storage. No daily/lifetime call limit; no raw inputs stored. */
export function createTrialStore({ supabaseUrl, secretKey, encryptionKey, fetchImpl = fetch, now = Date.now }) {
  const url = new URL(supabaseUrl)
  const key = Buffer.from(encryptionKey ?? '', 'base64')
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Invalid store URL')
  if (!secretKey?.startsWith('sb_secret_') || key.length !== 32) throw new Error('Server-only database secret and encryption key required')
  async function request(path, method = 'GET', body) {
    const response = await fetchImpl(`${url.origin}/rest/v1/${path}`, {
      method, headers: { apikey: secretKey, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(10000), redirect: 'error',
    })
    if (!response.ok) throw new Error('trial-storage-unavailable')
    if (response.status === 204) return undefined
    const text = await response.text()
    return text ? JSON.parse(text) : undefined
  }
  return {
    async check() { await request('howhouse_trial_calls?select=request_id&limit=0') },
    forUser(userId) {
      if (!uuid.test(userId)) throw new Error('Invalid trial user')
      return {
        ledger: {
          async reserve(requestId) {
            if (!uuid.test(requestId)) throw new Error('Invalid request ID')
            await request('howhouse_trial_calls', 'POST', { request_id: requestId, owner_id: userId, state: 'reserved' })
          },
          async finish(requestId, state, usage) {
            if (!uuid.test(requestId) || !['completed', 'failed', 'cancelled'].includes(state)) throw new Error('Invalid call state')
            await request(`howhouse_trial_calls?request_id=eq.${requestId}&owner_id=eq.${userId}`, 'PATCH', {
              state, usage: usage ?? null,
            })
          },
          remaining: () => null, // The owner explicitly chose no trial call-count quota.
        },
        cache: {
          key: (input, context) => inputFingerprint(input, { ...context, owner: userId, now: now() }, key),
          async get(id) {
            if (!/^[a-f0-9]{64}$/.test(id)) throw new Error('Invalid cache identifier')
            const rows = await request(`howhouse_trial_answers?owner_id=eq.${userId}&input_key=eq.${id}&select=encrypted_value,expires_at&limit=1`)
            const row = rows?.[0]
            if (!row || !Number.isFinite(Date.parse(row.expires_at)) || Date.parse(row.expires_at) <= now()) return undefined
            try {
              const record = row.encrypted_value
              const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(record.iv, 'base64'))
              decipher.setAAD(Buffer.from(`${userId}:${id}`)); decipher.setAuthTag(Buffer.from(record.tag, 'base64'))
              return JSON.parse(Buffer.concat([decipher.update(Buffer.from(record.data, 'base64')), decipher.final()]).toString())
            } catch { return undefined }
          },
          async set(id, result) {
            if (!/^[a-f0-9]{64}$/.test(id)) throw new Error('Invalid cache identifier')
            const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv)
            cipher.setAAD(Buffer.from(`${userId}:${id}`))
            const data = Buffer.concat([cipher.update(JSON.stringify(result), 'utf8'), cipher.final()])
            await request('rpc/howhouse_trial_put_answer', 'POST', { p_owner: userId, p_key: id, p_value: {
              iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: data.toString('base64'),
            } })
          },
        },
      }
    },
  }
}
