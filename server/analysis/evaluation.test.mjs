import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluationCases, judgeEvaluation } from './evaluation-cases.mjs'
import { runEvaluation } from './evaluate.mjs'

test('evaluation distinguishes expected safety failures, wrong IDs and blocked infrastructure', () => {
  const find = id => evaluationCases.find(c => c.id === id)
  assert.equal(judgeEvaluation(find('professional-gas'), { code: 'unsafe-input' }, 422).status, 'failed')
  assert.equal(judgeEvaluation(find('professional-gas'), { result: { source: 'generated' } }, 200).status, 'passed')
  assert.equal(judgeEvaluation(find('unsupported'), { code: 'unsupported-input' }, 422).status, 'passed')
  assert.equal(judgeEvaluation(find('existing-drain'), { result: { source: 'existing', caseId: '욕실·수도:2' } }, 200).status, 'failed')
  assert.equal(judgeEvaluation(find('existing-drain'), { code: 'budget-limit' }, 429).status, 'blocked')
  assert.equal(judgeEvaluation(find('generated-hinge'), {}, 502).status, 'blocked')
  assert.equal(judgeEvaluation(find('professional-gas'), {}, 502).status, 'blocked')
  assert.equal(judgeEvaluation(find('existing-drain'), { code: 'catalog-mismatch' }, 422).status, 'blocked')
})

test('evaluation uses guarded local service and never bypasses budget/cache with direct OpenAI call', async () => {
  const item = evaluationCases.find(c => c.id === 'insufficient'), calls = []
  const result = await runEvaluation(item, { catalog: { version: 'test-version' }, fetchImpl: async (url, options) => {
    calls.push(url)
    assert.ok(url.startsWith('http://127.0.0.1:8787/'))
    if (url.endsWith('/session')) return Response.json({ token: 'ephemeral-test-token' })
    assert.equal(options.body.get('analysisUserText'), item.text)
    return Response.json({ requestId: options.body.get('requestId'), code: 'insufficient-input' }, { status: 422 })
  } })
  assert.equal(result.status, 'passed'); assert.equal(calls.length, 2)
  assert.ok(!JSON.stringify(result).includes(item.text)); assert.ok(!JSON.stringify(result).includes('ephemeral-test-token'))
})
