import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createAnalysisServer } from './server.mjs'
import { readTrialConfig, trialSettingsIssues } from './trial-server.mjs'
import { MatchError } from './matcher.mjs'

const config = { apiKey: 'mock-key-never-sent-to-a-provider', model: 'gpt-6.1-terra' }
const env = { OPENAI_API_KEY: config.apiKey, OPENAI_MODEL: config.model, ANALYSIS_PRIVATE_TRIAL: '1',
  ANALYSIS_PUBLIC_URL: 'https://trial.example', ANALYSIS_ALLOWED_ORIGINS: 'https://localhost' }

test('startup diagnostics identify invalid fields without returning any credential values', () => {
  const complete = { ...env, SUPABASE_URL: 'https://project.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test', SUPABASE_SECRET_KEY: 'sb_secret_private_test',
    ANALYSIS_CACHE_ENCRYPTION_KEY: Buffer.alloc(32, 7).toString('base64') }
  assert.deepEqual(trialSettingsIssues(complete), [])
  const bad = { ...complete, OPENAI_API_KEY: 'private secret value', SUPABASE_SECRET_KEY: 'wrong-private-secret',
    ANALYSIS_CACHE_ENCRYPTION_KEY: 'a'.repeat(64) }
  const issues = trialSettingsIssues(bad)
  assert.deepEqual(issues, ['OPENAI_API_KEY', 'SUPABASE_SECRET_KEY', 'ANALYSIS_CACHE_ENCRYPTION_KEY (32-byte base64)'])
  for (const secret of [bad.OPENAI_API_KEY, bad.SUPABASE_SECRET_KEY, bad.ANALYSIS_CACHE_ENCRYPTION_KEY]) assert.equal(JSON.stringify(issues).includes(secret), false)
})

test('hosted trial never silently turns into a public no-auth endpoint', () => {
  assert.equal(readTrialConfig(env).host, 'trial.example')
  for (const override of [{ ANALYSIS_PRIVATE_TRIAL: '' }, { ANALYSIS_ALLOWED_ORIGINS: '*' },
    { ANALYSIS_PUBLIC_URL: 'http://trial.example' }, { ANALYSIS_ALLOWED_ORIGINS: '' }]) assert.throws(() => readTrialConfig({ ...env, ...override }))
  assert.throws(() => createAnalysisServer({ config, catalog: { cases: [], serialized: '[]', version: 'x' }, trial: {} }))
})

test('hosted trial authenticates before analysis, separates users and has no call-count quota', async t => {
  let calls = 0
  const byUser = new Map(), catalog = { cases: [{ id: 'case:1' }], version: 'a'.repeat(64), serialized: '[]' }
  const trial = { host: 'trial.example', origins: ['https://localhost'],
      authenticate: async header => { if (!['Bearer alice', 'Bearer bob'].includes(header)) throw new MatchError('auth-required'); return { id: header.slice(7) } },
      forUser(id) {
        const history = []; byUser.set(id, history)
        return { ledger: { reserve: async requestId => { history.push(requestId) }, finish: async () => {}, remaining: () => null } }
      },
    }
  const server = createAnalysisServer({ config, catalog,
    matchImpl: async () => { calls++; return { result: { source: 'existing', caseId: 'case:1' } } }, trial,
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  const base = `http://127.0.0.1:${server.address().port}`, headers = { Origin: 'https://localhost' }
  trial.host = new URL(base).host // Actual loopback Host, without depending on fetch's forbidden-header rewriting.
  assert.equal((await fetch(`${base}/health`)).status, 200)
  assert.equal((await fetch(`${base}/session`, { headers })).status, 401); assert.equal(calls, 0)
  assert.equal((await fetch(`${base}/session`, { headers: { ...headers, Origin: 'https://evil.example', Authorization: 'Bearer alice' } })).status, 403)
  const preflight = await fetch(`${base}/api/analysis/match`, { method: 'OPTIONS', headers })
  assert.match(preflight.headers.get('access-control-allow-headers'), /Authorization/)
  for (const id of ['alice', 'bob']) {
    const authHeaders = { ...headers, Authorization: `Bearer ${id}` }
    const session = await (await fetch(`${base}/session`, { headers: authHeaders })).json()
    assert.equal(session.remainingCalls, null)
    for (let i = 0; i < 12; i++) {
      const form = new FormData(); form.set('requestId', randomUUID()); form.set('catalogVersion', catalog.version); form.set('analysisUserText', `test ${i}`)
      const response = await fetch(`${base}/api/analysis/match`, { method: 'POST', headers: { ...authHeaders, 'X-Howhouse-Session': session.token }, body: form })
      assert.equal(response.status, 200)
    }
  }
  assert.equal(calls, 24); assert.equal(byUser.get('alice').length, 12); assert.equal(byUser.get('bob').length, 12)
})
