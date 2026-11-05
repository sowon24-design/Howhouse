import test from 'node:test'
import assert from 'node:assert/strict'
import { getAnalysisFailureKind } from './client.ts'
import { getAnalysisFailureCopy } from './failure-presentation.ts'

test('A05 preserves distinct insufficient, out-of-scope, safety, refusal and timeout explanations', () => {
  const codes = ['insufficient-input', 'unsupported-input', 'unsafe-input', 'model-refusal', 'analysis-timeout']
  const firstLines = new Set()
  for (const code of codes) {
    assert.equal(getAnalysisFailureKind(code), 'analysis')
    const lines = getAnalysisFailureCopy(code)
    assert.equal(lines.length, 2)
    firstLines.add(lines[0])
  }
  assert.equal(firstLines.size, codes.length)
})
