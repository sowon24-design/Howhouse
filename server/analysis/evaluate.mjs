import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { randomUUID } from 'node:crypto'
import { loadCatalog } from './catalog.mjs'
import { evaluationCases, judgeEvaluation } from './evaluation-cases.mjs'

export async function runEvaluation(item, { fetchImpl = fetch, catalog = loadCatalog() } = {}) {
  const requestId = randomUUID(), headers = { Origin: 'http://127.0.0.1:5173' }
  const sessionResponse = await fetchImpl('http://127.0.0.1:8787/session', { headers })
  if (!sessionResponse.ok) throw new Error('Local server unavailable')
  const session = await sessionResponse.json()
  if (typeof session.token !== 'string') throw new Error('Invalid local session')
  headers['X-Howhouse-Session'] = session.token
  const body = new FormData()
  body.set('requestId', requestId); body.set('catalogVersion', catalog.version); body.set('analysisUserText', item.text)
  const response = await fetchImpl('http://127.0.0.1:8787/api/analysis/match', { method: 'POST', headers, body })
  const data = await response.json()
  if (data.requestId !== requestId) throw new Error('Mismatched response')
  const judged = judgeEvaluation(item, data, response.status)
  // Never print key, token, user text, model content or private provider diagnostics.
  return { caseId: item.id, ...judged, httpStatus: response.status, source: data.result?.source,
    selectedCaseId: data.result?.source === 'existing' ? data.result.caseId : undefined,
    code: data.code, reuse: data.reuse }
}

async function main() {
  const selected = process.argv.find(arg => arg.startsWith('--case='))?.slice(7)
  if (!process.argv.includes('--send-once')) {
    console.log('DRY RUN: 유료 API 호출 없음. 예상 분류를 확인합니다.')
    console.log(JSON.stringify(evaluationCases.map(({ id, expected }) => ({ id, expected })), null, 2)); return
  }
  const item = evaluationCases.find(c => c.id === selected)
  if (!item) throw new Error('Select a known evaluation case')
  const receipt = new URL(`evaluation-${item.id}.local`, import.meta.url)
  if (existsSync(receipt)) {
    console.log('기존 평가 실행 기록이 있어 반복 호출을 막았습니다.')
    const previous = JSON.parse(readFileSync(receipt, 'utf8'))
    console.log(JSON.stringify({ caseId: item.id, state: previous.state, status: previous.result?.status })); return
  }
  writeFileSync(receipt, JSON.stringify({ caseId: item.id, state: 'attempted', at: new Date().toISOString() }), { flag: 'wx' })
  let result
  try { result = await runEvaluation(item) }
  catch { result = { caseId: item.id, status: 'blocked', note: '통신/서버 확인 필요. 처리·과금 여부는 호출 기록과 Usage에서 확인하며 자동 재시도하지 않음.' } }
  writeFileSync(receipt, JSON.stringify({ state: 'finished', result, at: new Date().toISOString() }, null, 2))
  console.log(JSON.stringify(result, null, 2))
  if (result.status !== 'passed') process.exitCode = 1
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => { console.error('평가를 시작하지 못했습니다. 키/원본 응답은 출력하지 않습니다.'); process.exitCode = 1 })
}
