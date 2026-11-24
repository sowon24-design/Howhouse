import { MatchError } from './matcher.mjs'

export const windows = [
  { start: Date.parse('2026-11-25T00:00:00+09:00'), end: Date.parse('2026-11-27T00:00:00+09:00'), limit: 48, name: 'november' },
  { start: Date.parse('2026-12-08T00:00:00+09:00'), end: Date.parse('2026-12-15T00:00:00+09:00'), limit: 49, name: 'december' },
]
export const activeWindow = (now = Date.now()) => windows.find(item => now >= item.start && now < item.end)

const reserveScript = `
if redis.call('EXISTS', KEYS[2]) == 1 then return -1 end
local used = tonumber(redis.call('GET', KEYS[1]) or '0')
if used >= tonumber(ARGV[1]) then return 0 end
redis.call('INCR', KEYS[1])
redis.call('SET', KEYS[2], 'reserved', 'EX', 7776000)
redis.call('EXPIRE', KEYS[1], 7776000)
return 1`

export function createVercelQuota({ url, token, fetchImpl = fetch, now = () => Date.now() }) {
  if (!/^https:\/\//.test(url ?? '') || !token) throw Error('A persistent quota store is required.')
  const command = async parts => {
    const response = await fetchImpl(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(parts), signal: AbortSignal.timeout(5000) })
    if (!response.ok) throw Error('quota-store-unavailable')
    const data = await response.json()
    if (data.error) throw Error('quota-store-unavailable')
    return data.result
  }
  const key = w => `howhouse:capstone:2026:${w.name}`
  return {
    async remaining() {
      const w = activeWindow(now())
      if (!w) return 0
      const used = Number(await command(['GET', key(w)])) || 0
      return Math.max(0, w.limit - used)
    },
    async reserve(requestId) {
      const w = activeWindow(now())
      if (!w) throw new MatchError('budget-limit')
      const result = Number(await command(['EVAL', reserveScript, '2', key(w), `${key(w)}:${requestId}`, String(w.limit)]))
      if (result === -1) throw new MatchError('invalid-input')
      if (result === 0) throw new MatchError('budget-limit')
      if (!Number.isSafeInteger(result)) throw Error('quota-store-unavailable')
    },
    async finish() { /* Reservations are deliberately retained after failed or cancelled paid attempts. */ },
  }
}
