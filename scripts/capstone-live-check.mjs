import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { loadCapstoneCatalog } from '../server/analysis/capstone-catalog.mjs'

// Explicit one-time owner test using project-owned generated imagery, no personal data.
const receipt = new URL('./capstone-analysis-check.local', import.meta.url)
const origin = 'http://127.0.0.1:5190', base = 'http://127.0.0.1:8787'
if (!process.argv.includes('--send-once') || existsSync(receipt)) throw Error('Explicit --send-once required; never retry an existing check automatically.')
writeFileSync(receipt, JSON.stringify({ attempted: true, at: new Date().toISOString() }), { flag: 'wx', mode: 0o600 })
const catalog = loadCapstoneCatalog()
const headers = { Origin: origin }
try {
  const sessionResponse = await fetch(base + '/session', { headers, signal: AbortSignal.timeout(10000) })
  const session = await sessionResponse.json()
  if (!sessionResponse.ok || session.processingRegion !== 'us' || typeof session.token !== 'string') throw Error('session-not-ready')
  const image = readFileSync(new URL('../src/solutions/assets/cases/p01-drain.jpg', import.meta.url))
  const send = async () => {
    const body = new FormData()
    body.set('requestId', randomUUID()); body.set('catalogVersion', catalog.version)
    body.set('analysisUserText', '욕실 바닥 배수구의 물이 천천히 내려갑니다. 물이 넘치지는 않고 배수구 주변에 전기기기는 없습니다.')
    body.append('analysisUserPhotos', new Blob([image], { type: 'image/jpeg' }), 'generated-drain-test.jpg')
    const response = await fetch(base + '/api/analysis/match', { method: 'POST', body,
      headers: { ...headers, 'X-Howhouse-Session': session.token, 'X-Howhouse-Content-Version': '2' }, signal: AbortSignal.timeout(95000) })
    const data = await response.json()
    return { response, data }
  }
  const first = await send()
  if (!first.response.ok) {
    const result = { success: false, httpStatus: first.response.status, code: first.data.code, diagnostic: first.data.diagnostic, automaticRetry: false }
    writeFileSync(receipt, JSON.stringify(result, null, 2)); console.log(JSON.stringify(result)); process.exitCode = 1
  } else {
    const second = await send()
    const result = { success: second.response.ok && second.data.reuse === 'saved', processingRegion: 'us', photoIncluded: true,
      firstReuse: first.data.reuse, secondReuse: second.data.reuse, source: first.data.result?.source,
      ...(first.data.result?.source === 'existing' ? { caseId: first.data.result.caseId } : {
        stepCount: first.data.result?.solution?.steps?.length,
        landlordSentenceCount: first.data.result?.solution?.contacts?.landlord?.length,
        companySentenceCount: first.data.result?.solution?.contacts?.company?.length,
      }), automaticRetry: false }
    writeFileSync(receipt, JSON.stringify(result, null, 2)); console.log(JSON.stringify(result))
    if (!result.success) process.exitCode = 1
  }
} catch {
  const report = { success: false, issue: 'local-check-failed-or-timeout', automaticRetry: false }
  writeFileSync(receipt, JSON.stringify(report, null, 2)); console.log(JSON.stringify(report)); process.exitCode = 1
}
