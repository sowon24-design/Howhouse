import test from 'node:test'
import assert from 'node:assert/strict'
import { createAnalysisClient, createSampleAnalysisClient } from './client.ts'
import { existingCaseSample, generatedResultDraft } from './samples.ts'

const input = () => ({ analysisUserText: '테스트', analysisUserPhotos: [] })
const sample = (result = existingCaseSample, found = true) => createSampleAnalysisClient({
  result, getSolutionById: id => found && id === '욕실·수도:1' ? { id } : undefined,
})

test('manual success returns only existing ID and stays pending until completed', async () => {
  const client = sample(), events = []
  const handle = client.startAnalysis(input(), event => events.push(event))
  await Promise.resolve()
  assert.deepEqual(events.map(e => e.status), ['running'])
  client.completeSample(handle.requestId)
  const end = await handle.completed
  assert.equal(end.mode, 'sample')
  assert.deepEqual(end.result, existingCaseSample)
  assert.deepEqual(events.map(e => e.status), ['running', 'succeeded'])
})

test('bad ID is lookup failure, never silently changed into generated content', async () => {
  const client = sample(existingCaseSample, false)
  const handle = client.startAnalysis(input(), () => {})
  client.completeSample(handle.requestId)
  const end = await handle.completed
  assert.equal(end.status, 'failed')
  assert.equal(end.error.code, 'case-not-found')
})

test('failure control produces one failure and ignores repeated completion', async () => {
  const client = sample(), events = []
  const handle = client.startAnalysis(input(), e => events.push(e.status))
  client.completeSample(handle.requestId, 'failure')
  client.completeSample(handle.requestId)
  assert.equal((await handle.completed).error.code, 'sample-failure')
  assert.deepEqual(events, ['running', 'failed'])
})

test('immediate handle cancellation prevents even starting transport', async () => {
  let calls = 0
  const client = createAnalysisClient(async () => { calls++; return existingCaseSample }, 'sample')
  const events = []
  const handle = client.startAnalysis(input(), e => events.push(e.status))
  handle.cancel(); handle.cancel()
  assert.equal((await handle.completed).reason, 'user')
  await Promise.resolve()
  assert.equal(calls, 0)
  assert.deepEqual(events, ['running', 'cancelled'])
})

test('client cancellation is a user action and does not clear caller input', async () => {
  const client = sample(), draft = input()
  const handle = client.startAnalysis(draft, () => {})
  await Promise.resolve()
  client.cancel()
  assert.equal((await handle.completed).reason, 'user')
  assert.equal(draft.analysisUserText, '테스트')
})

test('new start cancels prior request; non-cooperative late response is ignored', async () => {
  const pending = [], oldEvents = [], newEvents = []
  const client = createAnalysisClient((_input, context) => new Promise(resolve => pending.push({ resolve, ...context })), 'sample')
  const old = client.startAnalysis(input(), e => oldEvents.push(e.status))
  await Promise.resolve()
  const current = client.startAnalysis(input(), e => newEvents.push(e.status))
  await Promise.resolve()
  assert.equal((await old.completed).reason, 'superseded')
  assert.equal(pending[0].signal.aborted, true)
  pending[0].resolve(generatedResultDraft)
  await Promise.resolve(); await Promise.resolve()
  assert.deepEqual(oldEvents, ['running', 'cancelled'])
  assert.deepEqual(newEvents, ['running'])
  pending[1].resolve(existingCaseSample)
  assert.equal((await current.completed).status, 'succeeded')
  old.cancel()
  assert.equal(pending[1].signal.aborted, false)
})

test('late rejection after cancellation is consumed without another event', async () => {
  let rejectTransport
  const events = []
  const client = createAnalysisClient(() => new Promise((_r, reject) => { rejectTransport = reject }), 'sample')
  const handle = client.startAnalysis(input(), e => events.push(e.status))
  await Promise.resolve()
  handle.cancel(); rejectTransport(new Error('late error'))
  await handle.completed
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(events, ['running', 'cancelled'])
})

test('request snapshots text and file array while preserving File objects', async () => {
  let received
  const client = createAnalysisClient(async value => { received = value; return existingCaseSample }, 'sample')
  const file = new File(['test'], 'test.png', { type: 'image/png' })
  const draft = { analysisUserText: '원본', analysisUserPhotos: [file] }
  const handle = client.startAnalysis(draft, () => {})
  draft.analysisUserText = '수정'; draft.analysisUserPhotos.length = 0
  await handle.completed
  assert.equal(received.analysisUserText, '원본')
  assert.equal(received.analysisUserPhotos[0], file)
})

test('invalid input fails without transport; photo-only input works', async () => {
  let calls = 0
  const client = createAnalysisClient(async () => { calls++; return existingCaseSample }, 'sample')
  const photo = new File(['x'], 'test.png')
  for (const value of [
    { analysisUserText: '  ', analysisUserPhotos: [] },
    { analysisUserText: '글', analysisUserPhotos: Array(6).fill(photo) },
  ]) {
    const end = await client.startAnalysis(value, () => {}).completed
    assert.equal(end.status, 'failed')
    assert.equal(end.error.code, 'invalid-input')
  }
  assert.equal(calls, 0)
  assert.equal((await client.startAnalysis({ analysisUserText: '', analysisUserPhotos: [photo] }, () => {}).completed).status, 'succeeded')
  assert.equal(calls, 1)
})

test('generated draft is explicitly chosen and copied for each run', async () => {
  const client = sample(generatedResultDraft)
  const first = client.startAnalysis(input(), () => {})
  client.completeSample(first.requestId)
  const end = await first.completed
  assert.equal(end.result.source, 'generated')
  end.result.solution.title = '사용자 수정'
  assert.notEqual(generatedResultDraft.solution.title, '사용자 수정')
})
