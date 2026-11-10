import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveAnalysisBaseUrl } from './endpoint.ts'

test('endpoint precedence is explicit option, build environment, then existing PC default', () => {
  assert.equal(resolveAnalysisBaseUrl(undefined, undefined), 'http://127.0.0.1:8787')
  assert.equal(resolveAnalysisBaseUrl(undefined, ''), 'http://127.0.0.1:8787')
  assert.equal(resolveAnalysisBaseUrl(undefined, 'https://team.example/analysis/'), 'https://team.example/analysis')
  assert.equal(resolveAnalysisBaseUrl('http://localhost:8787/', 'https://team.example'), 'http://localhost:8787')
  assert.equal(resolveAnalysisBaseUrl('http://10.0.2.2:8787'), 'http://10.0.2.2:8787')
})

test('endpoint rejects credentials, query secrets, fragments, non-web URLs and external HTTP', () => {
  for (const url of [' ', '/analysis', '//team.example', 'not a url', 'https://user:password@team.example',
    'https://team.example?key=private', 'https://team.example/#', 'https://team.example/?',
    'file:///tmp/data', 'javascript:alert(1)', 'http://team.example', 'http://192.168.1.2:8787']) {
    assert.throws(() => resolveAnalysisBaseUrl(url))
  }
})
