import test from 'node:test'
import assert from 'node:assert/strict'
import { runConnectionCheck, validateConfig } from './verify-openai.mjs'
const config = { apiKey: 'fake-test-key-never-sent-to-network', model: 'gpt-6.1-terra' }

test('fixed request is bounded, storage disabled, no private data or tools', async () => {
  let calls = 0
  const result = await runConnectionCheck({ ...config, fetchImpl: async (url, options) => {
    calls++
    assert.equal(url, 'https://api.openai.com/v1/responses')
    const body = JSON.parse(options.body)
    assert.equal(body.store, false)
    assert.equal(body.max_output_tokens, 128)
    assert.equal(body.reasoning.effort, 'none')
    assert.equal(body.tools, undefined)
    assert.equal(body.input, 'Reply with exactly this text and nothing else: HOWHOUSE_CONNECTION_OK')
    return { ok: true, json: async () => ({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: 'HOWHOUSE_CONNECTION_OK' }] }], usage: { input_tokens: 20, output_tokens: 8 } }) }
  } })
  assert.equal(calls, 1)
  assert.equal(result.success, true)
  assert.equal(result.referenceCostUsd, 0.00006)
  assert.equal(JSON.stringify(result).includes(config.apiKey), false)
})

test('billing error is sanitized and never retried', async () => {
  let calls = 0
  const result = await runConnectionCheck({ ...config, fetchImpl: async () => {
    calls++
    return { ok: false, status: 429, json: async () => ({ error: { code: 'credit_balance_exhausted', message: config.apiKey } }) }
  } })
  assert.equal(calls, 1)
  assert.equal(result.issue, 'credit_balance_exhausted')
  assert.equal(JSON.stringify(result).includes(config.apiKey), false)
})

test('unknown network outcome is not success and is not retried', async () => {
  let calls = 0
  const result = await runConnectionCheck({ ...config, fetchImpl: async () => { calls++; throw new Error(config.apiKey) } })
  assert.equal(calls, 1)
  assert.equal(result.success, false)
  assert.equal(result.issue, 'network-or-timeout')
  assert.equal(JSON.stringify(result).includes(config.apiKey), false)
})

test('model allowlist, incomplete output and missing usage are handled honestly', async () => {
  assert.throws(() => validateConfig({ OPENAI_API_KEY: config.apiKey, OPENAI_MODEL: 'unknown-expensive-model' }))
  const result = await runConnectionCheck({ ...config, fetchImpl: async () => ({ ok: true, json: async () => ({ status: 'incomplete', output: [] }) }) })
  assert.equal(result.success, false)
  assert.equal(result.usage, null)
  assert.equal(result.referenceCostUsd, null)
})
