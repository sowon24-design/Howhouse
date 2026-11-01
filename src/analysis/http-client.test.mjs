import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'

// Compile just this browser module in memory; Node can then load its typed client dependency.
const source = readFileSync(new URL('./http-client.ts', import.meta.url), 'utf8')
  .replace("from './client'", `from '${new URL('./client.ts', import.meta.url).href}'`)
  .replace("from './solution'", `from '${new URL('./solution.ts', import.meta.url).href}'`)
  .replace("from './deadline'", `from '${new URL('./deadline.ts', import.meta.url).href}'`)
const outputText = stripTypeScriptTypes(source)
const { createHttpAnalysisClient, checkAnalysisConnection } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const { getAnalysisFailureKind } = await import('./client.ts')

function fixture(responder) {
  const calls = []
  const client = createHttpAnalysisClient({ catalog: '[]', getSolutionById: id => id === '욕실·수도:1',
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      if (url.endsWith('/session')) return Response.json({ token: 'local-ephemeral-token' })
      return responder(options)
    } })
  return { client, calls }
}
const input = { analysisUserText: '냄새', analysisUserPhotos: [new File(['test'], 'x.png', { type: 'image/png' })] }

test('HTTP client sends agreed FormData, fingerprint, request ID and cancellation signal', async () => {
  const { client, calls } = fixture(({ body }) => Response.json({ requestId: body.get('requestId'), result: { source: 'existing', caseId: '욕실·수도:1' } }))
  const handle = client.startAnalysis(input, () => {})
  assert.deepEqual((await handle.completed).result, { source: 'existing', caseId: '욕실·수도:1' })
  assert.equal(calls.length, 2)
  const options = calls[1].options
  assert.equal(options.body.get('analysisUserText'), '냄새')
  assert.equal(options.body.getAll('analysisUserPhotos').length, 1)
  assert.match(options.body.get('catalogVersion'), /^[a-f0-9]{64}$/)
  assert.equal(options.body.get('requestId'), handle.requestId)
  assert.equal(options.headers['X-Howhouse-Session'], 'local-ephemeral-token')
  assert.ok(options.signal instanceof AbortSignal)
})

test('generated content is validated and adapted without looking up an existing ID', async () => {
  const content = { title: '제목', description: '설명', supplies: [], steps: [{ title: '단계', description: '내용' }], contacts: { landlord: [], company: [] } }
  const { client } = fixture(({ body }) => Response.json({ requestId: body.get('requestId'), result: { source: 'generated', solution: content } }))
  const end = await client.startAnalysis(input, () => {}).completed
  assert.equal(end.status, 'succeeded'); assert.equal(end.result.source, 'generated')
  assert.ok(end.result.solution.id.startsWith('generated:')); assert.equal(end.result.solution.canContact, false)
  assert.deepEqual(end.result.solution.videos, []); assert.equal(end.result.solution.steps[0].number, 1)
})

test('typed budget error preserved, unknown ID and wrong response identity rejected, no retries', async () => {
  for (const [responder, code] of [
    [({ body }) => Response.json({ requestId: body.get('requestId'), code: 'budget-limit' }, { status: 429 }), 'budget-limit'],
    [({ body }) => Response.json({ requestId: body.get('requestId'), code: 'server-busy' }, { status: 409 }), 'server-busy'],
    [({ body }) => Response.json({ requestId: body.get('requestId'), code: 'model-refusal' }, { status: 422 }), 'model-refusal'],
    [({ body }) => Response.json({ requestId: body.get('requestId'), code: 'analysis-timeout' }, { status: 504 }), 'analysis-timeout'],
    [({ body }) => Response.json({ requestId: body.get('requestId'), result: { source: 'existing', caseId: '없는ID' } }), 'case-not-found'],
    [() => Response.json({ requestId: 'wrong', result: { source: 'existing', caseId: '욕실·수도:1' } }), 'invalid-response'],
  ]) {
    const { client, calls } = fixture(responder)
    const end = await client.startAnalysis(input, () => {}).completed
    assert.equal(end.status, 'failed'); assert.equal(end.error.code, code); assert.equal(calls.length, 2)
  }
})

test('connection failure, HTTP server failure and broken response remain distinct', async () => {
  for (const [responder, code] of [
    [() => { throw new TypeError('fetch failed: private diagnostics') }, 'connection-error'],
    [() => new Response('gateway HTML', { status: 503 }), 'server-error'],
    [() => new Response('not JSON', { status: 200 }), 'invalid-response'],
  ]) {
    const { client } = fixture(responder)
    const end = await client.startAnalysis(input, () => {}).completed
    assert.equal(end.error.code, code)
    assert.ok(!end.error.message.includes('private diagnostics'))
  }
  assert.equal(getAnalysisFailureKind('connection-error'), 'connection')
  assert.equal(getAnalysisFailureKind('api-error'), 'server')
  assert.equal(getAnalysisFailureKind('invalid-response'), 'response')
  assert.equal(getAnalysisFailureKind('unsafe-input'), 'analysis')
  assert.equal(getAnalysisFailureKind('transport-error'), 'unknown')
})

test('health check is GET only, no input/key/analysis request or automatic retry', async () => {
  const calls = []
  const result = await checkAnalysisConnection({ fetchImpl: async (url, options) => {
    calls.push({ url, options })
    return Response.json({ service: 'howhouse-analysis', status: 'ok' })
  } })
  assert.deepEqual(result, { status: 'reachable', scope: 'local-analysis-server' })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, 'http://127.0.0.1:8787/health')
  assert.equal(calls[0].options.method, 'GET')
  assert.equal(calls[0].options.body, undefined)
  assert.equal(calls[0].options.headers, undefined)
  assert.equal(calls[0].options.cache, 'no-store')
})

test('health does not claim offline for a stopped server or accept unrelated successful page', async () => {
  for (const [response, expected] of [
    [() => { throw new TypeError('connection refused') }, 'unreachable'],
    [() => new Response('HTML', { status: 503 }), 'server-error'],
    [() => Response.json({ status: 'ok' }), 'invalid-response'],
    [() => new Response('not JSON'), 'invalid-response'],
  ]) assert.equal((await checkAnalysisConnection({ fetchImpl: response })).status, expected)
})

test('F02 recovery requires upstream confirmation, not only localhost availability', async () => {
  let url
  const localOnly = await checkAnalysisConnection({ verifyUpstream: true, fetchImpl: async target => {
    url = target; return Response.json({ service: 'howhouse-analysis', status: 'ok' })
  } })
  assert.equal(localOnly.status, 'invalid-response'); assert.ok(url.endsWith('/health?upstream=1'))
  const checked = await checkAnalysisConnection({ verifyUpstream: true, fetchImpl: async () =>
    Response.json({ service: 'howhouse-analysis', status: 'ok', connection: 'reachable' }) })
  assert.equal(checked.status, 'reachable'); assert.equal(checked.scope, 'analysis-path')
})

test('unsupported/empty/oversized photos and too-long text fail before network or paid work', async () => {
  let calls = 0
  const client = createHttpAnalysisClient({ catalog: '[]', getSolutionById: () => true,
    fetchImpl: async () => { calls++; throw new Error('must not run') } })
  for (const candidate of [
    { analysisUserText: 'x'.repeat(6001), analysisUserPhotos: [] },
    { analysisUserText: '글', analysisUserPhotos: [new File(['x'], 'x.heic', { type: 'image/heic' })] },
    { analysisUserText: '글', analysisUserPhotos: [new File([], 'x.png', { type: 'image/png' })] },
    { analysisUserText: '글', analysisUserPhotos: [new File([new Uint8Array(4 * 1024 * 1024 + 1)], 'x.png', { type: 'image/png' })] },
  ]) {
    const end = await client.startAnalysis(candidate, () => {}).completed
    assert.equal(end.status, 'failed'); assert.equal(end.error.code, 'invalid-input')
  }
  assert.equal(calls, 0)
})

test('90-second deadline also bounds session/upload/response wait and never auto-retries', async () => {
  let expire, calls = 0, signal
  const client = createHttpAnalysisClient({ catalog: '[]', getSolutionById: () => true,
    deadlineScheduler(fn, ms) { assert.equal(ms, 90000); expire = fn; return () => {} },
    fetchImpl: async (_url, options) => { calls++; signal = options.signal; return await new Promise(() => {}) },
  })
  const handle = client.startAnalysis(input, () => {})
  // Wait until local hashing has reached the mocked session request, without real network.
  while (!calls) await new Promise(resolve => setImmediate(resolve))
  expire()
  const end = await handle.completed
  assert.equal(end.status, 'failed'); assert.equal(end.error.code, 'analysis-timeout')
  assert.equal(signal.aborted, true); assert.equal(calls, 1)
})

test('cancelling a connection check propagates abort without a recovery result', async () => {
  const controller = new AbortController()
  const pending = checkAnalysisConnection({ signal: controller.signal, fetchImpl: async (_url, { signal }) => {
    await new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }))
  } })
  controller.abort()
  await assert.rejects(pending, { name: 'AbortError' })
})
