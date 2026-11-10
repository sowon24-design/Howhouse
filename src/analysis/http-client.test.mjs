import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'

// Compile just this browser module in memory; Node can then load its typed client dependency.
const appSessionSource = readFileSync(new URL('./app-session.ts', import.meta.url), 'utf8')
  .replace("from './client'", `from '${new URL('./client.ts', import.meta.url).href}'`)
const appSessionUrl = `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(appSessionSource)).toString('base64')}`
const source = readFileSync(new URL('./http-client.ts', import.meta.url), 'utf8')
  .replace("from './client'", `from '${new URL('./client.ts', import.meta.url).href}'`)
  .replace("from './solution'", `from '${new URL('./solution.ts', import.meta.url).href}'`)
  .replace("from './deadline'", `from '${new URL('./deadline.ts', import.meta.url).href}'`)
  .replace("from './endpoint'", `from '${new URL('./endpoint.ts', import.meta.url).href}'`)
  .replace("from './app-session'", `from '${appSessionUrl}'`)
  .replace("from './photo-privacy'", `from '${new URL('./photo-privacy.ts', import.meta.url).href}'`)
const outputText = stripTypeScriptTypes(source)
const { createHttpAnalysisClient, checkAnalysisConnection } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const { getAnalysisFailureKind } = await import('./client.ts')

const preparePhoto = async (photo, index) => new File(['reencoded-pixels'], `analysis-photo-${index + 1}.png`, { type: 'image/png', lastModified: 0 })
function fixture(responder, { contentVersion = '2' } = {}) {
  const calls = []
  const client = createHttpAnalysisClient({ catalog: '[]', preparePhoto, getSolutionById: id => id === '욕실·수도:1',
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      if (url.endsWith('/session')) return Response.json({ token: 'local-ephemeral-token', ...(contentVersion ? { generatedContentVersion: contentVersion } : {}) })
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
  const uploaded = options.body.get('analysisUserPhotos')
  assert.equal(uploaded.name, 'analysis-photo-1.png')
  assert.equal(await uploaded.text(), 'reencoded-pixels')
  assert.equal(input.analysisUserPhotos[0].name, 'x.png')
  assert.match(options.body.get('catalogVersion'), /^[a-f0-9]{64}$/)
  assert.equal(options.body.get('requestId'), handle.requestId)
  assert.equal(options.headers['X-Howhouse-Session'], 'local-ephemeral-token')
  assert.equal(options.headers['X-Howhouse-Content-Version'], '2')
  assert.ok(options.signal instanceof AbortSignal)
})

test('generated content is validated and adapted without looking up an existing ID', async () => {
  const content = { title: '제목', description: '설명', duration: '-', responsibility: '-', reference: '판단 참고 테스트', supplies: [], steps: [{ title: '단계', description: '내용' }], contacts: { landlord: [], company: [] } }
  const { client } = fixture(({ body }) => Response.json({ requestId: body.get('requestId'), result: { source: 'generated', solution: content } }))
  const end = await client.startAnalysis(input, () => {}).completed
  assert.equal(end.status, 'succeeded'); assert.equal(end.result.source, 'generated')
  assert.ok(end.result.solution.id.startsWith('generated:')); assert.equal(end.result.solution.canContact, false)
  assert.deepEqual(end.result.solution.videos, []); assert.equal(end.result.solution.steps[0].number, 1)
})

test('expert referral is a successful generated result; 1, 2, 5 and 8 steps keep their count and contacts', async () => {
  for (const count of [1, 2, 5, 8]) {
    const content = { title: '전문가 점검을 요청해요', description: '직접 수리 대신 안전한 확인과 문의를 안내해요.', duration: '-', responsibility: '-', reference: '점검 전에는 책임을 단정할 수 없어요.', supplies: [],
      steps: Array.from({ length: count }, (_, i) => ({ title: `테스트 ${i + 1}`, description: '실제 수리 안내가 아닌 연결 확인' })),
      contacts: { landlord: ['설비 이상에 대해 점검을 부탁드립니다.'], company: [] } }
    const { client } = fixture(({ body }) => Response.json({ requestId: body.get('requestId'), result: { source: 'generated', solution: content } }))
    const end = await client.startAnalysis(input, () => {}).completed
    assert.equal(end.status, 'succeeded')
    assert.equal(end.result.solution.steps.length, count)
    assert.equal(end.result.solution.canContact, true)
    assert.deepEqual(end.result.solution.contacts.landlord.sentences, content.contacts.landlord)
  }
})

test('server failure reasons reach the screen unchanged without automatic retry', async () => {
  for (const code of ['insufficient-input', 'unsupported-input', 'unsafe-input', 'model-refusal']) {
    const { client, calls } = fixture(({ body }) => Response.json({ requestId: body.get('requestId'), code }, { status: 422 }))
    const end = await client.startAnalysis(input, () => {}).completed
    assert.equal(end.status, 'failed')
    assert.equal(end.error.code, code)
    assert.equal(getAnalysisFailureKind(code), 'analysis')
    assert.equal(calls.length, 2) // Session + one analysis, not a fallback generation.
  }
})

test('old server compatibility does not send an unsupported version header or invent missing metadata', async () => {
  const legacy = { title: '이전 서버 결과', description: '설명', supplies: [], steps: [{ title: '단계', description: '내용' }], contacts: { landlord: ['안녕하세요. 점검을 부탁드립니다.'], company: [] } }
  const { client, calls } = fixture(({ body }) => Response.json({ requestId: body.get('requestId'), result: { source: 'generated', solution: legacy } }), { contentVersion: null })
  const end = await client.startAnalysis(input, () => {}).completed
  assert.equal(end.status, 'succeeded')
  assert.equal(calls[1].options.headers['X-Howhouse-Content-Version'], undefined)
  assert.equal(end.result.solution.duration, '-')
  assert.match(end.result.solution.reference, /이전 버전/)
  assert.deepEqual(end.result.solution.contacts.landlord.sentences, ['안녕하세요.', '점검을 부탁드립니다.'])
  const strict = fixture(({ body }) => Response.json({ requestId: body.get('requestId'), result: { source: 'generated', solution: legacy } }))
  assert.equal((await strict.client.startAnalysis(input, () => {}).completed).status, 'failed')
})

test('custom endpoint prefix is shared by session, analysis and both connectivity checks', async () => {
  const baseUrl = 'https://team.example/howhouse/'
  const calls = []
  const fetchImpl = async (url, options) => {
    calls.push(url)
    if (url.endsWith('/session')) return Response.json({ token: 'local-ephemeral-token' })
    if (url.includes('/health')) return Response.json({ service: 'howhouse-analysis', status: 'ok', connection: 'reachable' })
    return Response.json({ requestId: options.body.get('requestId'), result: { source: 'existing', caseId: '욕실·수도:1' } })
  }
  const client = createHttpAnalysisClient({ baseUrl, catalog: '[]', preparePhoto, getSolutionById: () => true, fetchImpl })
  assert.equal((await client.startAnalysis(input, () => {}).completed).status, 'succeeded')
  assert.deepEqual(await checkAnalysisConnection({ baseUrl, fetchImpl }), { status: 'reachable', scope: 'analysis-server' })
  assert.deepEqual(await checkAnalysisConnection({ baseUrl, fetchImpl, verifyUpstream: true }), { status: 'reachable', scope: 'analysis-path' })
  assert.deepEqual(calls, [
    'https://team.example/howhouse/session', 'https://team.example/howhouse/api/analysis/match',
    'https://team.example/howhouse/health', 'https://team.example/howhouse/health?upstream=1',
  ])
})

test('invalid endpoint fails configuration before any network request', async () => {
  let calls = 0
  const fetchImpl = async () => { calls++; throw new Error('must not run') }
  assert.throws(() => createHttpAnalysisClient({ baseUrl: 'https://user:secret@team.example', catalog: '[]', getSolutionById: () => true, fetchImpl }))
  await assert.rejects(checkAnalysisConnection({ baseUrl: 'http://public.example', fetchImpl }))
  assert.equal(calls, 0)
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
  const client = createHttpAnalysisClient({ catalog: '[]', preparePhoto, getSolutionById: () => true,
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

test('photo preparation failure never sends the original or opens an authenticated connection', async () => {
  let connections = 0, auth = 0
  const client = createHttpAnalysisClient({ catalog: '[]', getSolutionById: () => true,
    preparePhoto: async () => { throw new Error('decode failed') },
    getAccessToken: async () => { auth++; return 'not-used' },
    fetchImpl: async () => { connections++; throw new Error('must not run') } })
  const result = await client.startAnalysis(input, () => {}).completed
  assert.equal(result.status, 'failed'); assert.equal(result.error.code, 'invalid-input')
  assert.equal(auth, 0); assert.equal(connections, 0)
})

test('text-only analysis works without any image decoder', async () => {
  const client = createHttpAnalysisClient({ catalog: '[]', getSolutionById: () => true,
    preparePhoto: async () => { throw new Error('must not run') },
    fetchImpl: async (url, { body }) => url.endsWith('/session') ? Response.json({ token: 'session' })
      : Response.json({ requestId: body.get('requestId'), result: { source: 'existing', caseId: 'case' } }) })
  assert.equal((await client.startAnalysis({ analysisUserText: '누수', analysisUserPhotos: [] }, () => {}).completed).status, 'succeeded')
})

test('cancelling a connection check propagates abort without a recovery result', async () => {
  const controller = new AbortController()
  const pending = checkAnalysisConnection({ signal: controller.signal, fetchImpl: async (_url, { signal }) => {
    await new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }))
  } })
  controller.abort()
  await assert.rejects(pending, { name: 'AbortError' })
})

test('hosted analysis attaches only the user token; denied/expired access is distinct from offline', async () => {
  const seen = []
  const client = createHttpAnalysisClient({ catalog: '[]', preparePhoto, getSolutionById: () => true,
    getAccessToken: async () => 'mock-user-login-token', fetchImpl: async (url, options) => {
      seen.push(options.headers.Authorization)
      if (url.endsWith('/session')) return Response.json({ token: 'local-session' })
      return Response.json({ code: 'auth-required' }, { status: 401 })
    } })
  const event = await client.startAnalysis(input, () => {}).completed
  assert.equal(event.error.code, 'auth-required')
  assert.deepEqual(seen, ['Bearer mock-user-login-token', 'Bearer mock-user-login-token'])
  assert.equal(getAnalysisFailureKind('auth-required'), 'access')
  assert.equal((await checkAnalysisConnection({ fetchImpl: async () => new Response('', { status: 401 }) })).status, 'auth-required')
})

test('cancellation while obtaining hosted login token prevents any health request', async () => {
  const controller = new AbortController(); let completeToken, calls = 0
  const pending = checkAnalysisConnection({ signal: controller.signal,
    getAccessToken: async () => await new Promise(resolve => { completeToken = resolve }),
    fetchImpl: async () => { calls++; return Response.json({ status: 'ok' }) } })
  controller.abort(); completeToken('late-token')
  await assert.rejects(pending, { name: 'AbortError' }); assert.equal(calls, 0)
})

test('release US guard refuses unconfirmed or global servers before any problem/photo upload',async()=>{
 for(const region of [undefined,'global','us']){
  let uploads=0
  const client=createHttpAnalysisClient({catalog:'[]',requiredProcessingRegion:'us',getSolutionById:()=>true,fetchImpl:async(url,options)=>{
   if(url.endsWith('/session'))return Response.json({token:'test-session',generatedContentVersion:'2',...(region?{processingRegion:region}:{})})
   uploads++;return Response.json({requestId:options.body.get('requestId'),result:{source:'existing',caseId:'test:1'}})
  }})
  const terminal=await client.startAnalysis({analysisUserText:'must not upload to global',analysisUserPhotos:[]},()=>{}).completed
  assert.equal(uploads,region==='us'?1:0);assert.equal(terminal.status,region==='us'?'succeeded':'failed')
 }
})
