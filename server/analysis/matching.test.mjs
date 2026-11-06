import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { loadCatalog } from './catalog.mjs'
import { analysisVersion, buildMatchingRequest, parseMatchingResponse, matchCase } from './matcher.mjs'
import { createAnalysisServer, createCallLedger } from './server.mjs'

const catalog = loadCatalog()
const output = (decision = 'existing', caseId = '욕실·수도:1') => ({ status: 'completed',
  output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({ decision, caseId,
    observations: ['배수구 냄새'], reason: '증상과 조치가 맞음', solution: null }) }] }], usage: { input_tokens: 200, output_tokens: 50 } })
const config = { apiKey: 'never-a-real-key', model: 'gpt-6.1-terra' }

test('catalog uses same active IDs and excludes management/contact fields', () => {
  assert.equal(catalog.cases.length, 53)
  assert.ok(!catalog.cases.some(c => c.id === '가전:32'))
  assert.ok(catalog.cases.some(c => c.id === '욕실·수도:1'))
  assert.deepEqual(Object.keys(JSON.parse(catalog.serialized)[0]), ['id', 'symptom', 'description', 'steps'])
})

test('multimodal request has strict schema, original photo, no tools, no storage', () => {
  const request = buildMatchingRequest({ model: config.model, catalog, text: '입력',
    photos: [{ type: 'image/png', bytes: Buffer.from('photo') }] })
  assert.equal(request.store, false)
  assert.equal(request.max_output_tokens, 2400)
  assert.equal(request.text.format.strict, true)
  assert.equal(request.tools, undefined)
  assert.equal(request.input[1].content[1].image_url, 'data:image/png;base64,cGhvdG8=')
  assert.ok(request.input[0].content[0].text.includes(catalog.serialized))
})

test('matched ID stays original; unsafe and insufficient are distinct from no existing case', () => {
  assert.deepEqual(parseMatchingResponse(output(), catalog), { source: 'existing', caseId: '욕실·수도:1' })
  for (const decision of ['unsafe', 'insufficient']) assert.throws(() => parseMatchingResponse(output(decision, null), catalog), { code: `${decision === 'unsafe' ? 'unsafe' : 'insufficient'}-input` })
})

test('reject invented/deleted ID, inconsistent ID, refusal, incomplete and invalid JSON', () => {
  for (const data of [output('existing', '가전:32'), output('existing', '없는ID'), output('no_match', '욕실·수도:1'),
    { ...output(), status: 'incomplete' },
    { status: 'completed', output: [] }]) assert.throws(() => parseMatchingResponse(data, catalog), { code: 'api-error' })
  assert.throws(() => parseMatchingResponse({ status: 'completed', output: [{ type: 'message', content: [{ type: 'refusal' }] }] }, catalog), { code: 'model-refusal' })
})

test('provider errors are not retried or exposed; cancellation signal is forwarded', async () => {
  let calls = 0
  const signal = new AbortController().signal
  await assert.rejects(matchCase({ ...config, catalog, text: 'x', photos: [], signal, fetchImpl: async (url, options) => {
    calls++; assert.equal(url, 'https://api.openai.com/v1/responses'); assert.equal(options.signal, signal)
    return new Response('private provider error', { status: 429 })
  } }), { code: 'api-error', diagnostic: 'provider-http-429' })
  assert.equal(calls, 1)
})

test('provider billing limits and congestion are distinct, sanitized and never retried', async () => {
  for (const [providerCode, expected] of [
    ['organization_spend_limit_exceeded', 'budget-limit'], ['project_spend_limit_exceeded', 'budget-limit'],
    ['organization_usage_limit_exceeded', 'budget-limit'], ['credit_balance_exhausted', 'budget-limit'],
    ['insufficient_quota', 'budget-limit'], ['rate_limit_exceeded', 'server-busy'], ['unknown', 'api-error'],
  ]) {
    let calls = 0
    await assert.rejects(matchCase({ ...config, catalog, text: 'x', photos: [], signal: new AbortController().signal,
      fetchImpl: async () => { calls++; return Response.json({ error: { code: providerCode, message: 'private provider billing details' } }, { status: 429 }) },
    }), error => { assert.equal(error.code, expected); assert.ok(!JSON.stringify(error).includes('private')); return true })
    assert.equal(calls, 1)
  }
})

test('ledger persists failed attempts, rejects duplicate IDs and stops at three calls', () => {
  const dir = mkdtempSync(join(tmpdir(), 'howhouse-ledger-'))
  try {
    const path = join(dir, 'calls.local'), ledger = createCallLedger(path)
    ledger.reserve('a'); ledger.finish('a', 'failed')
    assert.throws(() => ledger.reserve('a'), { code: 'invalid-input' })
    const reopened = createCallLedger(path)
    reopened.reserve('b'); reopened.reserve('c')
    assert.throws(() => reopened.reserve('d'), { code: 'budget-limit' })
    assert.equal(reopened.remaining(), 0)
    assert.ok(!readFileSync(path, 'utf8').includes('never-a-real-key'))
  } finally { rmSync(dir, { recursive: true }) }
})

async function fixture(t, matchImpl) {
  const dir = mkdtempSync(join(tmpdir(), 'howhouse-http-'))
  const ledger = createCallLedger(join(dir, 'calls.local'))
  const server = createAnalysisServer({ config, catalog, ledger, matchImpl })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(async () => { await new Promise(resolve => server.close(resolve)); rmSync(dir, { recursive: true }) })
  const base = `http://127.0.0.1:${server.address().port}`
  const headers = { Origin: 'http://127.0.0.1:5173' }
  const session = await (await fetch(`${base}/session`, { headers })).json()
  headers['X-Howhouse-Session'] = session.token
  function form(extra = {}) {
    const body = new FormData()
    for (const [key, value] of Object.entries({ requestId: randomUUID(), catalogVersion: catalog.version, analysisUserText: '배수구에서 냄새가 납니다', ...extra })) body.set(key, value)
    return body
  }
  return { base, headers, form, ledger }
}

test('health route confirms local service without calling model or reserving paid attempt', async t => {
  let calls = 0
  const { base, headers, ledger } = await fixture(t, async () => { calls++; throw new Error('must not run') })
  for (let i = 0; i < 3; i++) {
    const response = await fetch(`${base}/health`, { headers: { Origin: headers.Origin } })
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.deepEqual(await response.json(), { service: 'howhouse-analysis', status: 'ok', analysisVersion, generatedContentVersion: '2' })
  }
  assert.equal(calls, 0); assert.equal(ledger.remaining(), 3)
  assert.equal((await fetch(`${base}/health`, { headers: { Origin: 'https://evil.invalid' } })).status, 403)
})

test('HTTP authenticates local origin/session and validates catalog before any paid call', async t => {
  let calls = 0
  const { base, headers, form } = await fixture(t, async () => { calls++; return { result: { source: 'existing', caseId: '욕실·수도:1' } } })
  assert.equal((await fetch(`${base}/session`, { headers: { Origin: 'https://evil.invalid' } })).status, 403)
  assert.equal((await fetch(`${base}/api/analysis/match`, { method: 'POST', headers: { Origin: headers.Origin }, body: form() })).status, 403)
  const response = await fetch(`${base}/api/analysis/match`, { method: 'POST', headers, body: form({ catalogVersion: '0'.repeat(64) }) })
  assert.equal((await response.json()).code, 'catalog-mismatch')
  assert.equal(calls, 0)
  const body = form(), requestId = body.get('requestId')
  const result = await (await fetch(`${base}/api/analysis/match`, { method: 'POST', headers, body })).json()
  assert.equal(result.requestId, requestId); assert.equal(result.result.caseId, '욕실·수도:1')
  await fetch(`${base}/api/analysis/match`, { method: 'POST', headers, body })
  assert.equal(calls, 1)
})

test('invalid/too many/oversized/spoofed photos and empty input never reach model', async t => {
  let calls = 0
  const { base, headers, form } = await fixture(t, async () => { calls++; throw new Error('must not run') })
  const requests = [form({ analysisUserText: '' }), form({ analysisUserText: 'x'.repeat(6001) })]
  const spoof = form(); spoof.append('analysisUserPhotos', new File(['not jpeg'], 'x.jpg', { type: 'image/jpeg' })); requests.push(spoof)
  const tooMany = form(); for (let i = 0; i < 6; i++) tooMany.append('analysisUserPhotos', new File(['x'], 'x.png', { type: 'image/png' })); requests.push(tooMany)
  const huge = form(); huge.append('analysisUserPhotos', new File([new Uint8Array(4 * 1024 * 1024 + 1)], 'x.png', { type: 'image/png' })); requests.push(huge)
  for (const body of requests) {
    const response = await fetch(`${base}/api/analysis/match`, { method: 'POST', headers, body })
    assert.equal(response.status, 422)
    const error = await response.json()
    assert.equal(error.code, 'invalid-input'); assert.equal(error.requestId, body.get('requestId'))
  }
  assert.equal(calls, 0)
})

test('photo-only input is sent; disconnect aborts provider; late result cannot change screen', async t => {
  let started, aborted
  const began = new Promise(resolve => { started = resolve })
  const cancelled = new Promise(resolve => { aborted = resolve })
  const { base, headers, form } = await fixture(t, async ({ photos, signal }) => {
    assert.equal(photos.length, 1); started()
    await new Promise(resolve => signal.addEventListener('abort', () => { aborted(); resolve() }, { once: true }))
    return { result: { source: 'existing', caseId: '욕실·수도:1' } }
  })
  const body = form({ analysisUserText: '' })
  body.append('analysisUserPhotos', new File([Buffer.from([137,80,78,71,13,10,26,10,0])], 'x.png', { type: 'image/png' }))
  const controller = new AbortController()
  const pending = fetch(`${base}/api/analysis/match`, { method: 'POST', headers, body, signal: controller.signal })
  await began; controller.abort()
  await assert.rejects(pending, { name: 'AbortError' }); await cancelled
})
