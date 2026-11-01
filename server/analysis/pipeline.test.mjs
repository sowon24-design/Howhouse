import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID, randomBytes } from 'node:crypto'
import { createAnswerCache, inputFingerprint } from './answer-cache.mjs'
import { createAnalysisService } from './service.mjs'
import { createCallLedger, developmentCallLimit } from './server.mjs'
import { loadCatalog } from './catalog.mjs'
import { parseMatchingResponse, MatchError } from './matcher.mjs'
import { generatedSampleContent } from '../../src/analysis/samples.ts'
import { isGeneratedContent, toGeneratedSolution } from '../../src/analysis/solution.ts'

const catalog = loadCatalog(), config = { apiKey: 'not-a-real-key', model: 'gpt-6.1-terra' }
const input = { text: '문 경첩에서 삐걱 소리가 납니다. 헐거움이나 파손은 없습니다.', photos: [] }
const generated = { source: 'generated', solution: generatedSampleContent }
const context = () => ({ requestId: randomUUID(), signal: new AbortController().signal })

test('development budget stays bounded, can be lowered, cannot be silently unlimited', () => {
  assert.equal(developmentCallLimit([]), 10)
  assert.equal(developmentCallLimit(['--max-calls=3']), 3)
  for (const value of ['0', '-1', '11', 'NaN', 'Infinity', '2.5', '']) {
    assert.throws(() => developmentCallLimit([`--max-calls=${value}`]))
  }
})
function setup(t, options = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'howhouse-pipeline-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const settings = { path: join(dir, 'answers.local'), keyPath: join(dir, 'key.local'), ...options }
  return { dir, settings, cache: createAnswerCache(settings), ledger: createCallLedger(join(dir, 'calls.local')) }
}

test('generated schema rejects missing, empty, extra, invented URL and malformed steps/contacts', () => {
  assert.ok(isGeneratedContent(generatedSampleContent))
  for (const content of [{ ...generatedSampleContent, title: '' }, { ...generatedSampleContent, steps: [] },
    { ...generatedSampleContent, videos: ['https://invented.invalid'] }, { ...generatedSampleContent, contacts: { landlord: [''], company: [] } },
    { ...generatedSampleContent, steps: [{ title: 'x' }] }]) assert.ok(!isGeneratedContent(content))
  const view = toGeneratedSolution(generatedSampleContent, 'test')
  assert.equal(view.id, 'generated:test'); assert.equal(view.responsibility, '-'); assert.deepEqual(view.photos, [])
})

test('one model response can generate only when caseId is null; existing never rewrites original', () => {
  const response = (decision, caseId, solution) => ({ status: 'completed', output: [{ type: 'message', content: [
    { type: 'output_text', text: JSON.stringify({ decision, caseId, solution, observations: [], reason: '정보 충분하고 기존 사례 없음' }) },
  ] }] })
  assert.deepEqual(parseMatchingResponse(response('generated', null, generatedSampleContent), catalog), generated)
  for (const data of [response('generated', '욕실·수도:1', generatedSampleContent), response('existing', '욕실·수도:1', generatedSampleContent),
    response('generated', null, { ...generatedSampleContent, title: '' })]) assert.throws(() => parseMatchingResponse(data, catalog), { code: 'api-error' })
})

test('exact input reuse survives restart encrypted, TTL expiry is a miss', t => {
  let time = 100000
  const { cache, settings } = setup(t, { now: () => time, ttlMs: 100 })
  const key = cache.key(input, { model: config.model, catalogVersion: catalog.version })
  cache.set(key, generated)
  const disk = readFileSync(settings.path, 'utf8')
  assert.ok(!disk.includes(generatedSampleContent.title)); assert.ok(!disk.includes(input.text)); assert.ok(!disk.includes(key))
  const reopened = createAnswerCache(settings)
  assert.deepEqual(reopened.get(key), generated)
  time += 101; assert.equal(reopened.get(key), undefined)
})

test('text, ordered photo bytes, MIME, model, prompt/schema/catalog version change invalidate reuse', () => {
  const secret = randomBytes(32), base = { model: 'terra', analysisVersion: 'a', catalogVersion: 'b', promptHash: 'c', now: 10000 }
  const photo = { type: 'image/png', bytes: Buffer.from('image') }, original = { ...input, photos: [photo] }
  const key = inputFingerprint(original, base, secret)
  for (const [candidate, ctx] of [[{ ...original, text: input.text + ' 물이 샙니다' }, base],
    [{ ...original, photos: [{ ...photo, bytes: Buffer.from('other') }] }, base],
    [{ ...original, photos: [{ ...photo, type: 'image/jpeg' }] }, base],
    [original, { ...base, model: 'sol' }], [original, { ...base, analysisVersion: 'new' }],
    [original, { ...base, catalogVersion: 'new' }], [original, { ...base, promptHash: 'new' }]]) {
    assert.notEqual(inputFingerprint(candidate, ctx, secret), key)
  }
  assert.equal(inputFingerprint({ ...original, text: ` ${input.text} ` }, base, secret), key)
  const dated = { text: '오늘 물이 고여요', photos: [] }
  assert.notEqual(inputFingerprint(dated, base, secret), inputFingerprint(dated, { ...base, now: base.now + 86400000 }, secret))
})

test('cache lookup before call budget: repeated result still works after paid limit', async t => {
  const { cache, ledger } = setup(t)
  let calls = 0
  const analyze = createAnalysisService({ config, catalog, ledger, cache, matchImpl: async () => { calls++; return { result: generated } } })
  assert.equal((await analyze(input, context())).reuse, 'new')
  ledger.reserve(randomUUID()); ledger.reserve(randomUUID())
  const second = await analyze(input, context())
  assert.equal(second.reuse, 'saved'); assert.deepEqual(second.result, generated); assert.equal(calls, 1)
  await assert.rejects(analyze({ ...input, text: '다른 증상' }, context()), { code: 'budget-limit' })
})

test('two identical requests share one paid call; cancelling one does not cancel another', async t => {
  const { cache, ledger } = setup(t)
  let release, calls = 0, providerSignal
  const gate = new Promise(resolve => { release = resolve })
  const analyze = createAnalysisService({ config, catalog, ledger, cache, matchImpl: async ({ signal }) => {
    calls++; providerSignal = signal; await gate; return { result: generated }
  } })
  const firstController = new AbortController()
  const first = analyze(input, { ...context(), signal: firstController.signal })
  const second = analyze(input, context())
  await Promise.resolve(); firstController.abort()
  await assert.rejects(first, { name: 'AbortError' }); assert.equal(providerSignal.aborted, false)
  release(); assert.equal((await second).reuse, 'in-flight'); assert.equal(calls, 1); assert.equal(ledger.remaining(), 2)
})

test('last cancellation aborts provider; late answer and failures never enter cache', async t => {
  const { cache, ledger } = setup(t)
  let release, signal, calls = 0, markStarted
  const started = new Promise(resolve => { markStarted = resolve })
  const gate = new Promise(resolve => { release = resolve })
  const analyze = createAnalysisService({ config, catalog, ledger, cache, matchImpl: async options => {
    calls++; signal = options.signal; markStarted(); await gate; return { result: generated }
  } })
  const controller = new AbortController(), first = analyze(input, { ...context(), signal: controller.signal })
  await started; controller.abort(); await assert.rejects(first); assert.equal(signal.aborted, true)
  release(); await new Promise(resolve => setImmediate(resolve))
  await analyze(input, context()); assert.equal(calls, 2)
  const fail = createAnalysisService({ config, catalog, ledger, cache, matchImpl: async () => { throw new MatchError('unsafe-input') } })
  await assert.rejects(fail({ ...input, text: 'unsafe' }, context()), { code: 'unsafe-input' })
  await assert.rejects(fail({ ...input, text: 'unsafe' }, context()), { code: 'budget-limit' })
})

test('shared model job has one 90-second deadline; timeout is not cached or automatically retried', async t => {
  const { cache, ledger } = setup(t)
  let expire, release, signal, calls = 0, timers = 0, markStarted
  const started = new Promise(resolve => { markStarted = resolve })
  const pendingProvider = new Promise(resolve => { release = resolve })
  const analyze = createAnalysisService({ config, catalog, ledger, cache,
    deadlineScheduler(fn, ms) { timers++; assert.equal(ms, 90000); expire = fn; return () => {} },
    matchImpl: async options => {
      calls++; signal = options.signal; markStarted()
      if (calls === 1) await pendingProvider
      return { result: generated }
    },
  })
  const first = analyze(input, context()), second = analyze(input, context())
  await started; assert.equal(timers, 1); expire()
  await Promise.all([assert.rejects(first, { code: 'analysis-timeout' }), assert.rejects(second, { code: 'analysis-timeout' })])
  assert.equal(signal.aborted, true); assert.equal(calls, 1); assert.equal(ledger.remaining(), 2)
  release(); await new Promise(resolve => setImmediate(resolve))
  const next = await analyze(input, context())
  assert.equal(next.reuse, 'new'); assert.equal(calls, 2)
})

test('bounded cache removes oldest entries and cloned results cannot mutate stored answer', t => {
  const { cache } = setup(t, { maxEntries: 2 })
  cache.set('one', generated); cache.set('two', generated); cache.set('three', generated)
  assert.equal(cache.get('one'), undefined)
  const copy = cache.get('two'); copy.solution.title = 'changed'
  assert.equal(cache.get('two').solution.title, generatedSampleContent.title)
})

test('different in-flight input is busy, not budget exhaustion, and does not spend another call', async t => {
  const { cache, ledger } = setup(t)
  let release, calls = 0
  const gate = new Promise(resolve => { release = resolve })
  const analyze = createAnalysisService({ config, catalog, ledger, cache, matchImpl: async () => {
    calls++; await gate; return { result: generated }
  } })
  const first = analyze(input, context())
  await Promise.resolve()
  await assert.rejects(analyze({ ...input, text: '다른 문제' }, context()), { code: 'server-busy' })
  assert.equal(calls, 1); assert.equal(ledger.remaining(), 2)
  release(); await first
})
