import test from 'node:test'
import assert from 'node:assert/strict'
import { activeWindow, createVercelQuota } from './vercel-quota.mjs'

test('Korea demo dates include both full periods and stop at midnight', () => {
  assert.equal(activeWindow(Date.parse('2026-11-24T15:00:00Z'))?.name, 'november')
  assert.equal(activeWindow(Date.parse('2026-11-26T15:00:00Z')), undefined)
  assert.equal(activeWindow(Date.parse('2026-12-07T15:00:00Z'))?.name, 'december')
  assert.equal(activeWindow(Date.parse('2026-12-14T15:00:00Z')), undefined)
})

test('quota refuses an unavailable store before a provider call', async () => {
  const ledger = createVercelQuota({ url: 'https://redis.example', token: 'test', now: () => Date.parse('2026-11-25T00:00:00+09:00'),
    fetchImpl: async () => ({ ok: false }) })
  await assert.rejects(ledger.reserve('11111111-1111-1111-1111-111111111111'), /quota-store-unavailable/)
})

test('quota prevents duplicate and exhausted reservations across instances', async () => {
  let used = 47
  const ids = new Set()
  const fetchImpl = async (_url, options) => {
    const [command, , , , id, limit] = JSON.parse(options.body)
    if (command === 'GET') return { ok: true, json: async () => ({ result: used }) }
    let result = 0
    if (ids.has(id)) result = -1
    else if (used < Number(limit)) { used++; ids.add(id); result = 1 }
    return { ok: true, json: async () => ({ result }) }
  }
  const options = { url: 'https://redis.example', token: 'test', fetchImpl, now: () => Date.parse('2026-11-25T00:00:00+09:00') }
  const first = createVercelQuota(options), second = createVercelQuota(options)
  await first.reserve('11111111-1111-1111-1111-111111111111')
  assert.equal(await second.remaining(), 0)
  await assert.rejects(second.reserve('11111111-1111-1111-1111-111111111111'), { code: 'invalid-input' })
  await assert.rejects(second.reserve('22222222-2222-2222-2222-222222222222'), { code: 'budget-limit' })
})
