import test from 'node:test'
import assert from 'node:assert/strict'
import { createRecoveryRouteGuard } from './recovery-route.ts'

function setup(initial = '#problem') {
  let hash = initial, stopped = 0, replacements = 0
  const guard = createRecoveryRouteGuard({ readHash: () => hash, replaceHash: value => { hash = value; replacements++ } })
  return { guard, event: { stopImmediatePropagation() { stopped++ } },
    setHash: value => { hash = value }, hash: () => hash, stopped: () => stopped, replacements: () => replacements }
}
test('F02 blocks navigation to home before router can clear in-memory photos', () => {
  const f = setup(), photo = new File(['fixture'], 'test.png'), draft = { text: '원본', photos: [photo] }
  f.guard.freeze(); f.setHash('#home'); f.guard.intercept(f.event)
  // App only sees uncancelled route changes. The guarded event never reaches it.
  if (!f.stopped() && f.hash() === '#home') { draft.text = ''; draft.photos = [] }
  assert.equal(f.hash(), '#problem'); assert.equal(draft.text, '원본'); assert.equal(draft.photos[0], photo)
  f.guard.release(); assert.equal(f.hash(), '#problem')
})
test('repeated disconnection signals preserve first destination and normal navigation resumes after recovery', () => {
  const f = setup('#analysis-result')
  f.guard.freeze(); f.setHash('#home'); f.guard.freeze(); f.guard.intercept(f.event)
  assert.equal(f.hash(), '#analysis-result')
  f.guard.release(); f.setHash('#home'); f.guard.intercept(f.event)
  assert.equal(f.hash(), '#home'); assert.equal(f.stopped(), 1)
})
test('recovery without hashchange notification restores destination; ordinary screens do not get rewritten', () => {
  const f = setup('#my')
  f.guard.freeze(); f.setHash('#home'); f.guard.release()
  assert.equal(f.hash(), '#my')
  f.setHash('#problem'); f.guard.intercept(f.event)
  assert.equal(f.hash(), '#problem'); assert.equal(f.stopped(), 0)
})
test('unchanged route is frozen without redundant history replacements and empty hash is supported', () => {
  const f = setup('')
  f.guard.freeze(); f.guard.intercept(f.event)
  assert.equal(f.replacements(), 0)
  f.setHash('#home'); f.guard.intercept(f.event); f.guard.release()
  assert.equal(f.hash(), ''); assert.equal(f.replacements(), 1)
})
