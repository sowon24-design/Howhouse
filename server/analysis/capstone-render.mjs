import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createAnalysisServer, createCallLedger } from './server.mjs'
import { createAnswerCache } from './answer-cache.mjs'
import { loadCapstoneCatalog } from './capstone-catalog.mjs'
import { validateConfig } from './verify-openai.mjs'
import { createCapstoneYoutubeHandler } from './capstone-youtube.mjs'
import { createCapstoneWebHandler } from './capstone-web.mjs'

export function renderDemoOptions(env, now = Date.now()) {
  const host = env.RENDER_EXTERNAL_HOSTNAME
  if (!/^[a-z0-9][a-z0-9-]+\.onrender\.com$/.test(host ?? '')) throw Error('An explicit Render service hostname is required.')
  const port = Number(env.PORT || 10000)
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Invalid Render port.')
  const enabled = env.CAPSTONE_DEMO_ENABLED === '1'
  const expires = Date.parse(env.CAPSTONE_DEMO_EXPIRES_AT ?? '')
  if (enabled && (!Number.isFinite(expires) || expires <= now || expires > now + 7 * 86400000)) throw Error('Enabled demo requires an explicit future expiry within seven days.')
  return { host, port, enabled, expires }
}

export function startRenderDemo(env = process.env) {
  const options = renderDemoOptions(env)
  const config = validateConfig({ ...env, OPENAI_PROCESSING_REGION: 'us' })
  const data = resolve('server/analysis/capstone-render-state.local')
  mkdirSync(data, { recursive: true })
  // Free Render has no durable disk. These limits/caches reset on restart.
  // Expiry and disable switch remain in service configuration across restarts.
  const ledger = createCallLedger(resolve(data, 'calls.local'), 5)
  const cache = createAnswerCache({ path: resolve(data, 'answers.local'), keyPath: resolve(data, 'answer-key.local') })
  const server = createAnalysisServer({ config: { ...config, capstoneAndroidUsb: true, capstonePublicHost: options.host }, catalog: loadCapstoneCatalog(), ledger, cache })
  const analysis = server.listeners('request')[0]
  const thumbnails = createCapstoneYoutubeHandler({ apiKey: env.HOWHOUSE_YOUTUBE_API_KEY?.trim(), publicHost: options.host })
  const web = createCapstoneWebHandler()
  server.removeAllListeners('request')
  server.on('request', async (req, res) => {
    const reject = status => {
      req.resume()
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store',
        ...(['http://127.0.0.1', `https://${options.host}`].includes(req.headers.origin) ? { 'Access-Control-Allow-Origin': req.headers.origin, Vary: 'Origin' } : {}) })
      res.end('{"code":"api-error"}')
    }
    if (req.headers.host !== options.host) return reject(403)
    // Same-origin browser GET fetches omit Origin. Keep cross-site requests denied;
    // normalize only the browser's same-origin metadata on the exact service host.
    if (!req.headers.origin && req.headers['sec-fetch-site'] === 'same-origin') req.headers.origin = `https://${options.host}`
    if (web(req, res)) return
    if (req.method === 'GET' && req.url === '/health' && !req.headers.origin) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      res.end(JSON.stringify({ service: 'howhouse-analysis', status: 'ok', variant: 'capstone', commit: env.RENDER_GIT_COMMIT || 'unknown', demoEnabled: options.enabled && Date.now() < options.expires, database: false }))
      return
    }
    if (req.url === '/api/analysis/match' && req.method === 'POST' && (!options.enabled || Date.now() >= options.expires)) return reject(503)
    try { if (!await thumbnails(req, res)) await analysis(req, res) }
    catch { if (!res.headersSent) reject(503); else res.destroy() }
  })
  server.requestTimeout = 100000
  server.headersTimeout = 15000
  server.listen(options.port, '0.0.0.0', () => console.log('Capstone demo ready. Supabase disabled. Five new paid analyses per process; ephemeral cache; explicit demo expiry.'))
  return server
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { startRenderDemo() }
  catch { console.error('Capstone service configuration invalid. No credentials or user data are logged.'); process.exitCode = 1 }
}
