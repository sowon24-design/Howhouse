import { createHmac, timingSafeEqual } from 'node:crypto'
import { loadCapstoneCatalog } from '../server/analysis/capstone-catalog.mjs'
import { createVercelQuota, activeWindow } from '../server/analysis/vercel-quota.mjs'
import { parseInput } from '../server/analysis/server.mjs'
import { createAnalysisService } from '../server/analysis/service.mjs'
import { createCapstoneYoutubeHandler } from '../server/analysis/capstone-youtube.mjs'
import { validateConfig } from '../server/analysis/verify-openai.mjs'
import { MatchError, analysisVersion } from '../server/analysis/matcher.mjs'
import { generatedContentVersion, toLegacyGeneratedContent } from '../src/analysis/solution.ts'

let services
function setup() {
  if (services) return services
  const config = validateConfig({ ...process.env, OPENAI_PROCESSING_REGION: 'us' })
  const secret = process.env.CAPSTONE_SESSION_SECRET
  if (!secret || secret.length < 32) throw Error('Session signing secret required.')
  const catalog = loadCapstoneCatalog()
  const ledger = createVercelQuota({ url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN })
  const analyze = createAnalysisService({ config, catalog, ledger })
  services = { config, secret, catalog, ledger, analyze }
  return services
}

function token(secret, host, hour) {
  return `${hour}.${createHmac('sha256', secret).update(`${host}:${hour}`).digest('hex')}`
}
function validToken(secret, host, candidate) {
  if (typeof candidate !== 'string' || !/^\d{5,7}\.[a-f0-9]{64}$/.test(candidate)) return false
  const hour = Number(candidate.split('.')[0])
  if (Math.abs(Math.floor(Date.now() / 3600000) - hour) > 1) return false
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(token(secret, host, hour)))
}
function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  res.end(JSON.stringify(body))
}

export default async function handler(req, res) {
  const host = req.headers.host ?? ''
  const origin = `https://${host}`
  const route = new URL(req.url ?? '/', origin).searchParams.get('route')
  const path = { session: '/session', health: '/health', match: '/api/analysis/match', thumbnail: '/api/youtube/thumbnail' }[route]
  if (!path || !/^[a-z0-9.-]+$/.test(host) || req.headers.origin && req.headers.origin !== origin || req.headers['sec-fetch-site'] === 'cross-site') return send(res, 403, { code: 'forbidden' })
  if (route === 'thumbnail') {
    const params = new URL(req.url, origin).searchParams
    params.delete('route')
    req.url = `/api/youtube/thumbnail?${params.toString()}`
    req.headers.origin = origin
    try {
      const handled = await createCapstoneYoutubeHandler({ apiKey: process.env.HOWHOUSE_YOUTUBE_API_KEY?.trim(), publicHost: host })(req, res)
      if (!handled) send(res, 404, { code: 'not-found' })
    } catch { send(res, 502, { code: 'thumbnail-unavailable' }) }
    return
  }
  if (route === 'health') return send(res, 200, { service: 'howhouse-analysis', status: 'ok', variant: 'capstone-vercel', demoEnabled: !!activeWindow(), database: false })
  let state
  try { state = setup() } catch { return send(res, 503, { code: 'service-unavailable' }) }
  if (route === 'session' && req.method === 'GET') {
    try { return send(res, 200, { token: token(state.secret, host, Math.floor(Date.now() / 3600000)), remainingCalls: await state.ledger.remaining(), generatedContentVersion, processingRegion: 'us' }) }
    catch { return send(res, 503, { code: 'service-unavailable' }) }
  }
  if (route !== 'match' || req.method !== 'POST') return send(res, 405, { code: 'method-not-allowed' })
  if (!activeWindow()) return send(res, 503, { code: 'demo-inactive' })
  if (!validToken(state.secret, host, req.headers['x-howhouse-session'])) return send(res, 403, { code: 'forbidden' })
  if (Number(req.headers['content-length']) > 4_400_000) return send(res, 422, { code: 'invalid-input' })
  req.url = path
  let requestId = null
  try {
    const input = await parseInput(req)
    requestId = input.requestId
    if (input.catalogVersion !== state.catalog.version) throw new MatchError('catalog-mismatch')
    const { result, reuse } = await state.analyze(input, { requestId, signal: new AbortController().signal })
    const compatible = result.source === 'generated' && req.headers['x-howhouse-content-version'] !== generatedContentVersion
      ? { source: 'generated', solution: toLegacyGeneratedContent(result.solution) } : result
    return send(res, 200, { requestId, result: compatible, reuse, feedbackAvailable: false })
  } catch (error) {
    if (error instanceof MatchError && error.requestId) requestId = error.requestId
    const code = error instanceof MatchError ? error.code : 'api-error'
    return send(res, code === 'budget-limit' ? 429 : code === 'server-busy' ? 409 : code === 'analysis-timeout' ? 504 : code === 'api-error' ? 502 : 422, { requestId, code })
  }
}
