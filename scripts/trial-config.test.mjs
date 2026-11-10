import { test } from 'node:test'
import assert from 'node:assert/strict'
import config from '../vite.config.ts'

test('trial builds require public server/auth settings; development stays available and production cannot silently use samples', () => {
  const names = ['VITE_ANALYSIS_API_BASE_URL', 'VITE_ANALYSIS_AUTH_URL', 'VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY']
  const saved = names.map(name => process.env[name])
  try {
    for (const name of names) process.env[name] = ''
    assert.equal(config({ mode: 'development' }).server.strictPort, true)
    assert.throws(() => config({mode:'production'}), /설정/)
    assert.throws(() => config({ mode: 'trial' }), /설정/)
    process.env.VITE_ANALYSIS_API_BASE_URL = 'https://trial.example.com'
    process.env.VITE_ANALYSIS_AUTH_URL = 'https://auth.example.com'
    process.env.VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY = 'sb_secret_test_fixture'
    assert.throws(() => config({ mode: 'trial' }), /publishable/)
    process.env.VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY = 'sb_publishable_test_fixture'
    assert.equal(config({ mode: 'trial' }).server.port, 5173)
    process.env.VITE_ANALYSIS_API_BASE_URL = 'http://127.0.0.1:8787'
    assert.throws(() => config({ mode: 'trial' }), /HTTPS/)
  } finally {
    names.forEach((name, i) => { if (saved[i] === undefined) delete process.env[name]; else process.env[name] = saved[i] })
  }
})
