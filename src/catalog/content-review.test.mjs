import test from 'node:test'
import assert from 'node:assert/strict'
import { reviewedCatalogCase } from './content-review.ts'

test('unsafe electrical instructions are replaced without changing the shared case or its ID', () => {
  const input = {id:'난방·전기:28',description:'비가 오면 정전돼요.',reference:'참고',steps:[{number:1,title:'원래 안내',description:'젖은 플러그를 뽑고 닦아요.'}],supplies:['수건'],videos:[{url:'https://example.com'}],duration:'20분'}
  const saved = structuredClone(input)
  const output = reviewedCatalogCase(input)
  assert.deepEqual(input,saved)
  assert.equal(output.id,input.id)
  assert.equal(output.steps.length,4)
  assert.ok(output.steps.some(step=>step.description.includes('119')))
  assert.ok(!output.steps.some(step=>step.description.includes('젖은 플러그를 뽑고')))
  assert.deepEqual(output.videos,[])
  assert.deepEqual(output.supplies,[])
})
test('ordinary cases retain their steps and show the cost qualification before the reference', () => {
  const input={id:'욕실·수도:1',description:'원문',reference:'집주인',steps:[{number:1,title:'청소',description:'설명'}]}
  const output=reviewedCatalogCase(input)
  assert.deepEqual(output.steps,input.steps)
  assert.ok(output.description.includes('확정 판정이 아니에요'))
  assert.ok(output.reference.startsWith('수리 비용 부담은'))
})
