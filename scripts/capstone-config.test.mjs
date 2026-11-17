import test from 'node:test'
import assert from 'node:assert/strict'
import { capstoneServerOptions } from './capstone-server.mjs'
import { validateCapstoneEnvironment } from './capstone-config.mjs'

test('capstone explicitly acknowledges owner test data and never falls back from US', () => {
  const env = { OPENAI_API_KEY: 'test-not-a-real-secret-12345678', OPENAI_MODEL: 'gpt-6.1-terra', OPENAI_PROCESSING_REGION: 'global' }
  assert.throws(() => capstoneServerOptions([], env))
  const options = capstoneServerOptions(['--test-data-only'], env)
  assert.equal(options.config.processingRegion, 'us')
  assert.throws(() => capstoneServerOptions(['--test-data-only'], { ...env, OPENAI_API_KEY: '' }))
})

test('phone-only demo requires an explicit HTTPS origin; never a credential or insecure remote', () => {
  assert.doesNotThrow(() => validateCapstoneEnvironment({ VITE_CAPSTONE_API_BASE_URL: 'https://capstone.example' }))
  for (const value of ['http://remote.example', 'https://user:password@remote.example', 'https://remote.example/api', 'https://remote.example?key=secret']) {
    assert.throws(() => validateCapstoneEnvironment({ VITE_CAPSTONE_API_BASE_URL: value }))
  }
})

test('prototype cannot bundle credentials or accidentally call the hosted analysis/auth servers', () => {
  assert.doesNotThrow(() => validateCapstoneEnvironment({ VITE_ANALYSIS_API_BASE_URL: 'http://127.0.0.1:8787' }))
  for (const env of [
    { VITE_OPENAI_API_KEY: 'never-public' },
    { VITE_ANALYSIS_AUTH_URL: 'https://auth.example' },
    { VITE_ANALYSIS_API_BASE_URL: 'https://api.example' },
    { VITE_SOMETHING: 'sk-not-allowed' },
  ]) assert.throws(() => validateCapstoneEnvironment(env))
})
