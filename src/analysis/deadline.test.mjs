import test from 'node:test'
import assert from 'node:assert/strict'
import { analysisTimeoutMs, runWithDeadline } from './deadline.ts'

function clock() {
  let expire, delay, cancelled = 0
  return { schedule(fn, ms) { expire = fn; delay = ms; return () => { cancelled++ } },
    fire: () => expire(), delay: () => delay, cancelled: () => cancelled }
}
const timeoutError = () => Object.assign(new Error('timeout'), { code: 'analysis-timeout' })

test('approved 90-second deadline rejects and aborts model/HTTP operation; no late success', async () => {
  const timer = clock(), parent = new AbortController()
  let signal, resolveLate, calls = 0
  const pending = runWithDeadline(s => { calls++; signal = s; return new Promise(resolve => { resolveLate = resolve }) },
    { signal: parent.signal, timeoutMs: analysisTimeoutMs, timeoutError, schedule: timer.schedule })
  await Promise.resolve()
  assert.equal(timer.delay(), 90000); timer.fire()
  await assert.rejects(pending, { code: 'analysis-timeout' })
  assert.equal(signal.aborted, true); assert.equal(parent.signal.aborted, false)
  resolveLate('late'); await Promise.resolve(); assert.equal(calls, 1); assert.equal(timer.cancelled(), 1)
})

test('success cancels the timer, later timeout cannot abort a completed request', async () => {
  const timer = clock(); let signal
  const result = await runWithDeadline(async s => { signal = s; return 'done' },
    { signal: new AbortController().signal, timeoutMs: analysisTimeoutMs, timeoutError, schedule: timer.schedule })
  assert.equal(result, 'done'); assert.equal(timer.cancelled(), 1)
  timer.fire(); assert.equal(signal.aborted, false)
})

test('user cancellation remains cancellation; already-cancelled requests do not start work/timer', async () => {
  const timer = clock(), parent = new AbortController()
  let calls = 0
  const pending = runWithDeadline(async () => { calls++; return 'must not finish' },
    { signal: parent.signal, timeoutMs: analysisTimeoutMs, timeoutError, schedule: timer.schedule })
  parent.abort(); await assert.rejects(pending, { name: 'AbortError' }); assert.equal(calls, 0)
  const secondTimer = clock()
  await assert.rejects(runWithDeadline(async () => { calls++ },
    { signal: parent.signal, timeoutMs: analysisTimeoutMs, timeoutError, schedule: secondTimer.schedule }), { name: 'AbortError' })
  assert.equal(calls, 0); assert.equal(secondTimer.delay(), undefined)
})

test('provider failure cancels timeout and keeps the original typed failure', async () => {
  const timer = clock()
  await assert.rejects(runWithDeadline(async () => { throw Object.assign(new Error('provider'), { code: 'api-error' }) },
    { signal: new AbortController().signal, timeoutMs: analysisTimeoutMs, timeoutError, schedule: timer.schedule }), { code: 'api-error' })
  assert.equal(timer.cancelled(), 1)
})
