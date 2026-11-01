import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { buildMatchingRequest, parseMatchingResponse, matchCase } from './matcher.mjs'
import { loadCatalog } from './catalog.mjs'
import { createAnalysisServer } from './server.mjs'
import { generatedContentSchema, generatedStepLimits, isGeneratedContent, toGeneratedSolution } from '../../src/analysis/solution.ts'
import { toMessageRecipients, initialDraft, messageBody } from '../../src/solutions/message-model.ts'

const catalog = loadCatalog()
// Synthetic provider output: verifies transport/validation, not an actual model judgment.
const professional = {
  title: '전문가에게 점검을 요청해요',
  description: '직접 분해하지 않고 관찰한 증상을 전달해 점검을 요청하는 연결 테스트입니다.',
  supplies: [],
  duration: '-', responsibility: '-', reference: '원인과 계약 조건을 확인하기 전에는 책임을 판단할 수 없어요.',
  steps: [
    { title: '직접 작업을 멈춰요', description: '배선이나 부품을 분해하지 마세요.' },
    { title: '관찰한 증상을 전달해요', description: '원인을 찾으려고 위험한 재현 시험을 하지 말고 이미 관찰한 증상을 전달해요.' },
    { title: '점검을 요청해요', description: '집주인 또는 전문 업체에 증상과 점검 가능 여부를 문의해요.' },
  ],
  contacts: {
    landlord: ['안녕하세요.', '설비에서 이상 증상을 확인해 전문 점검이 가능한지 문의드립니다.'],
    company: ['안녕하세요.', '설비의 이상 증상에 대해 안전 점검이 가능한지 문의드립니다.'],
  },
}
const providerOutput = (decision, solution = null, caseId = null) => ({ status: 'completed',
  output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({
    decision, caseId, solution, observations: ['사용자가 알린 설비 이상'], reason: '직접 수리 대신 안전한 점검 요청 가능',
  }) }] }], usage: { input_tokens: 10, output_tokens: 10 } })

test('safe professional referral stays generated and supplies both B03 message drafts', () => {
  const result = parseMatchingResponse(providerOutput('generated', professional), catalog)
  assert.equal(result.source, 'generated')
  const view = toGeneratedSolution(result.solution, 'safe-escalation')
  assert.equal(view.canContact, true)
  assert.equal(view.steps.length, 3)
  assert.deepEqual(view.steps.map(s => s.number), [1, 2, 3])
  for (const recipient of toMessageRecipients(view)) {
    assert.equal(messageBody(initialDraft(recipient)), professional.contacts[recipient.id].join('\n\n'))
  }
  assert.deepEqual(toMessageRecipients(view).map(r => r.id), ['landlord', 'company'])
})

test('schema and runtime accept necessary 1, 2, 3, 5, 8 steps without padding; reject 0 and 9', () => {
  assert.deepEqual(generatedStepLimits, { min: 1, max: 8 })
  assert.equal(generatedContentSchema.properties.steps.minItems, 1)
  assert.equal(generatedContentSchema.properties.steps.maxItems, 8)
  for (const count of [1, 2, 3, 5, 8]) {
    const content = { ...professional, steps: Array.from({ length: count }, (_, i) => ({
      title: `연결 테스트 단계 ${i + 1}`, description: `실제 수리 안내가 아닌 단계 수 검사 ${i + 1}`,
    })) }
    const result = parseMatchingResponse(providerOutput('generated', content), catalog)
    assert.deepEqual(result.solution.steps, content.steps)
    assert.equal(toGeneratedSolution(result.solution, 'counts').steps.length, count)
  }
  for (const count of [0, 9]) {
    const content = { ...professional, steps: Array(count).fill(professional.steps[0]) }
    assert.equal(isGeneratedContent(content), false)
    assert.throws(() => parseMatchingResponse(providerOutput('generated', content), catalog), { code: 'api-error' })
  }
})

test('insufficient, unsupported and genuinely unsafe stay distinct failures; unsafe is never forced to success', () => {
  for (const decision of ['insufficient', 'unsupported', 'unsafe']) {
    assert.throws(() => parseMatchingResponse(providerOutput(decision), catalog), { code: `${decision}-input` })
    assert.throws(() => parseMatchingResponse(providerOutput(decision, professional), catalog), { code: 'api-error' })
  }
  assert.deepEqual(parseMatchingResponse(providerOutput('existing', null, '욕실·수도:1'), catalog), { source: 'existing', caseId: '욕실·수도:1' })
  assert.throws(() => parseMatchingResponse({ status: 'completed', output: [{ type: 'message', content: [{ type: 'refusal' }] }] }, catalog), { code: 'model-refusal' })
})

test('provider request advertises variable step bounds and supported outcome distinctions', () => {
  const request = buildMatchingRequest({ model: 'gpt-6.1-terra', catalog, text: '전문 점검이 필요해요', photos: [] })
  assert.deepEqual(request.text.format.schema.properties.decision.enum, ['existing', 'generated', 'insufficient', 'unsupported', 'unsafe'])
  assert.equal(request.text.format.schema.properties.solution.anyOf[0].properties.steps.maxItems, 8)
  assert.equal(request.store, false)
})

test('HTTP returns 200 for safe professional content and preserves all three failure reasons with 422', async t => {
  let output = providerOutput('generated', professional), providerCalls = 0
  const server = createAnalysisServer({ config: { apiKey: 'never-a-real-key', model: 'gpt-6.1-terra' }, catalog,
    ledger: { reserve() {}, finish() {}, remaining: () => 10 },
    matchImpl: args => matchCase({ ...args, fetchImpl: async () => { providerCalls++; return Response.json(output) } }),
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve) }))
  const base = `http://127.0.0.1:${server.address().port}`
  const headers = { Origin: 'http://127.0.0.1:5173', 'X-Howhouse-Content-Version': '2' }
  headers['X-Howhouse-Session'] = (await (await fetch(`${base}/session`, { headers, signal: AbortSignal.timeout(5000) })).json()).token
  async function send() {
    const body = new FormData()
    body.set('requestId', randomUUID()); body.set('catalogVersion', catalog.version); body.set('analysisUserText', '설비 이상에 대한 점검 문의')
    return fetch(`${base}/api/analysis/match`, { method: 'POST', headers, body, signal: AbortSignal.timeout(5000) })
  }
  const success = await send()
  assert.equal(success.status, 200)
  assert.deepEqual((await success.json()).result, { source: 'generated', solution: professional })
  delete headers['X-Howhouse-Content-Version']
  const legacy = await (await send()).json()
  assert.equal(legacy.result.solution.duration, undefined)
  assert.deepEqual(legacy.result.solution.contacts, professional.contacts)
  headers['X-Howhouse-Content-Version'] = '2'
  for (const decision of ['insufficient', 'unsupported', 'unsafe']) {
    output = providerOutput(decision)
    const failed = await send()
    assert.equal(failed.status, 422)
    assert.equal((await failed.json()).code, `${decision}-input`)
  }
  assert.equal(providerCalls, 5) // Five local mocked responses, no external OpenAI call.
})
