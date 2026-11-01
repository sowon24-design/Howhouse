import test from 'node:test'
import assert from 'node:assert/strict'
import { probeModelConnectivity } from './connectivity.mjs'

test('connectivity probe has no secret/body/model call and is bounded; 401 proves path only', async () => {
  let calls = 0
  const result = await probeModelConnectivity(async (url, options) => {
    calls++; assert.equal(url, 'https://api.openai.com/v1/models'); assert.equal(options.method, 'GET')
    assert.equal(options.body, undefined); assert.equal(options.headers, undefined)
    assert.equal(options.redirect, 'error'); assert.ok(options.signal instanceof AbortSignal)
    return new Response('', { status: 401 })
  })
  assert.equal(result, 'reachable'); assert.equal(calls, 1)
})

test('upstream HTTP and network failures remain distinct and are never retried', async () => {
  assert.equal(await probeModelConnectivity(async () => new Response('', { status: 503 })), 'server-error')
  let calls = 0
  assert.equal(await probeModelConnectivity(async () => { calls++; throw new TypeError('network') }), 'unreachable')
  assert.equal(calls, 1)
})
