import { createServer } from 'node:http'
import { randomBytes } from 'node:crypto'
import { appendFileSync, readFileSync, existsSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { pathToFileURL } from 'node:url'
import { loadCatalog } from './catalog.mjs'
import { MatchError, matchCase } from './matcher.mjs'
import { validateConfig } from './verify-openai.mjs'
import { createAnalysisService } from './service.mjs'
import { createAnswerCache } from './answer-cache.mjs'
import { probeModelConnectivity } from './connectivity.mjs'
import { checkLocalStorage } from './storage.mjs'

const origins = new Set(['http://127.0.0.1:5173', 'http://localhost:5173'])
const bodyLimit = 12 * 1024 * 1024
const codes = new Set(['invalid-input', 'insufficient-input', 'unsafe-input', 'model-refusal', 'analysis-timeout', 'catalog-mismatch', 'budget-limit', 'server-busy', 'api-error'])

export function developmentCallLimit(args) {
  const selected = args.find(arg => arg.startsWith('--max-calls='))
  const limit = selected ? Number(selected.slice('--max-calls='.length)) : 10
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 10) throw new Error('개발 호출 한도는 1~10회입니다.')
  return limit
}

/** Persist reservations BEFORE calling provider, including failed/cancelled attempts. */
export function createCallLedger(path, maxCalls = 3) {
  const rows = existsSync(path) ? readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : []
  const ids = new Set(rows.filter(row => row.state === 'reserved').map(row => row.requestId))
  return {
    reserve(requestId) {
      if (ids.has(requestId)) throw new MatchError('invalid-input')
      if (ids.size >= maxCalls) throw new MatchError('budget-limit')
      appendFileSync(path, JSON.stringify({ state: 'reserved', requestId, at: new Date().toISOString() }) + '\n', { mode: 0o600 })
      ids.add(requestId)
    },
    finish(requestId, state, usage) {
      appendFileSync(path, JSON.stringify({ state, requestId, usage, at: new Date().toISOString() }) + '\n')
    },
    remaining: () => Math.max(0, maxCalls - ids.size),
  }
}

export async function parseInput(req) {
  if (!/^multipart\/form-data;\s*boundary=/i.test(req.headers['content-type'] ?? '')) throw new MatchError('invalid-input')
  if (Number(req.headers['content-length']) > bodyLimit) throw new MatchError('invalid-input')
  let size = 0
  const chunks = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > bodyLimit) throw new MatchError('invalid-input')
    chunks.push(chunk)
  }
  let form
  try {
    form = await new Request('http://localhost', { method: 'POST',
      headers: { 'Content-Type': req.headers['content-type'] }, body: Buffer.concat(chunks) }).formData()
  } catch { throw new MatchError('invalid-input') }
  const single = name => {
    const values = form.getAll(name)
    if (values.length !== 1 || typeof values[0] !== 'string') throw new MatchError('invalid-input')
    return values[0]
  }
  const requestId = single('requestId')
  try {
  if ([...form.keys()].some(key => !['requestId', 'catalogVersion', 'analysisUserText', 'analysisUserPhotos'].includes(key))) throw new MatchError('invalid-input')
  const catalogVersion = single('catalogVersion'), text = single('analysisUserText')
  if (!/^[0-9a-f-]{36}$/i.test(requestId) || !/^[0-9a-f]{64}$/.test(catalogVersion) || text.length > 6000) throw new MatchError('invalid-input')
  const files = form.getAll('analysisUserPhotos')
  if ((!text.trim() && !files.length) || files.length > 5) throw new MatchError('invalid-input')
  const photos = []
  for (const file of files) {
    if (!(file instanceof File) || !file.size || file.size > 4 * 1024 * 1024) throw new MatchError('invalid-input')
    const bytes = Buffer.from(await file.arrayBuffer())
    const isPng = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    const isJpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    const isWebp = bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
    if (!(file.type === 'image/png' && isPng || file.type === 'image/jpeg' && isJpeg || file.type === 'image/webp' && isWebp)) throw new MatchError('invalid-input')
    photos.push({ type: file.type, bytes })
  }
  return { requestId, catalogVersion, text, photos }
  } catch (error) {
    if (error instanceof MatchError && /^[0-9a-f-]{36}$/i.test(requestId)) error.requestId = requestId
    throw error
  }
}

/** Loopback-only development service; not a public production API. */
export function createAnalysisServer({ config, catalog = loadCatalog(), ledger, cache, matchImpl = matchCase, probeImpl = probeModelConnectivity }) {
  const token = randomBytes(32).toString('hex')
  const analyze = createAnalysisService({ config, catalog, ledger, cache, matchImpl })
  return createServer(async (req, res) => {
    const origin = req.headers.origin
    const host = req.headers.host ?? ''
    const allowed = origins.has(origin) && /^(127\.0\.0\.1|localhost):\d+$/.test(host)
    const reply = (status, data) => {
      if (res.destroyed) return
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff', ...(allowed ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}) })
      res.end(JSON.stringify(data))
    }
    if (!allowed) { reply(403, { code: 'forbidden' }); req.resume(); return }
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Access-Control-Allow-Origin': origin, Vary: 'Origin',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'X-Howhouse-Session, Content-Type' })
      res.end(); return
    }
    if (req.method === 'GET' && req.url === '/session') { reply(200, { token, remainingCalls: ledger.remaining() }); return }
    if (req.method === 'GET' && req.url === '/health') {
      reply(200, { service: 'howhouse-analysis', status: 'ok' }); return
    }
    if (req.method === 'GET' && req.url === '/health?upstream=1') {
      const connection = await probeImpl()
      reply(connection === 'reachable' ? 200 : 503, { service: 'howhouse-analysis',
        status: connection === 'reachable' ? 'ok' : 'unavailable', connection }); return
    }
    if (req.method !== 'POST' || req.url !== '/api/analysis/match') { reply(404, { code: 'not-found' }); return }
    if (req.headers['x-howhouse-session'] !== token) { reply(403, { code: 'forbidden' }); req.resume(); return }
    const controller = new AbortController()
    const abort = () => controller.abort()
    res.once('close', abort)
    let requestId = null
    try {
      const input = await parseInput(req)
      requestId = input.requestId
      if (controller.signal.aborted) return
      if (input.catalogVersion !== catalog.version) throw new MatchError('catalog-mismatch')
      const { result, reuse } = await analyze(input, { requestId, signal: controller.signal })
      if (!controller.signal.aborted) reply(200, { requestId, result, reuse })
    } catch (error) {
      if (error instanceof MatchError && error.requestId) requestId = error.requestId
      if (!controller.signal.aborted) {
        const code = error instanceof MatchError && codes.has(error.code) ? error.code : 'api-error'
        reply(code === 'budget-limit' ? 429 : code === 'server-busy' ? 409 : code === 'analysis-timeout' ? 504 : code === 'api-error' ? 502 : 422, { requestId, code })
      }
    } finally {
      res.removeListener('close', abort)
    }
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const config = validateConfig(parseEnv(readFileSync(new URL('.env', import.meta.url), 'utf8')))
    const catalog = loadCatalog()
    const limit = developmentCallLimit(process.argv.slice(2))
    checkLocalStorage(new URL('matching-calls.local', import.meta.url), new URL('answers.local', import.meta.url))
    const ledger = createCallLedger(new URL('matching-calls.local', import.meta.url), limit)
    const cache = createAnswerCache({ path: new URL('answers.local', import.meta.url), keyPath: new URL('answer-key.local', import.meta.url) })
    const server = createAnalysisServer({ config, catalog, ledger, cache })
    server.on('error', () => { console.error('분석 서버 시작 실패. 포트 8787 사용 여부를 확인하세요.'); process.exitCode = 1 })
    server.listen(8787, '127.0.0.1', () => console.log(`분석 서버 http://127.0.0.1:8787 · ${catalog.cases.length}개 사례 · 남은 개발 호출 ${ledger.remaining()}/${limit}회 · 종료 Ctrl+C`))
  } catch (error) {
    console.error(error?.message === 'analysis-storage-unavailable'
      ? '분석 서버를 시작하지 않았습니다. server/analysis 폴더에 비용 기록·답변을 저장할 권한이 필요합니다. 사용자 PowerShell에서 실행하거나 해당 폴더의 쓰기 권한을 확인하세요.'
      : '서버 설정 또는 호출 기록 확인이 필요합니다. 비밀 키는 표시하지 않습니다.')
    process.exitCode = 1
  }
}
