import { readFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseEnv } from 'node:util'
import { pathToFileURL } from 'node:url'
import { createAnalysisServer, createCallLedger } from '../server/analysis/server.mjs'
import { validateConfig } from '../server/analysis/verify-openai.mjs'
import { loadCapstoneCatalog } from '../server/analysis/capstone-catalog.mjs'
import { createAnswerCache } from '../server/analysis/answer-cache.mjs'
import { createCapstoneYoutubeHandler } from '../server/analysis/capstone-youtube.mjs'

export function capstoneServerOptions(args, environment = process.env) {
  if (!args.includes('--test-data-only')) throw Error('Use --test-data-only: owner-provided synthetic/permissioned test data only; not a public service.')
  const selected = args.find(arg => arg.startsWith('--env-file='))?.slice(11)
  const env = selected ? parseEnv(readFileSync(resolve(selected), 'utf8')) : environment
  // Retain the previous US-only decision. No automatic global fallback.
  const config = validateConfig({ ...env, OPENAI_PROCESSING_REGION: 'us' })
  const dataDir = resolve('server/analysis/capstone-state.local')
  return { config, dataDir }
}

export function startCapstoneServer(args = process.argv.slice(2)) {
  const { config, dataDir } = capstoneServerOptions(args)
  mkdirSync(dataDir, { recursive: true })
  const catalog = loadCapstoneCatalog()
  // An intentionally small cumulative development ledger; failed calls count too.
  // It is not a substitute for the hosted monthly/user quota policies.
  const ledger = createCallLedger(resolve(dataDir, 'calls.local'), 5)
  const cache = createAnswerCache({ path: resolve(dataDir, 'answers.local'), keyPath: resolve(dataDir, 'answer-key.local') })
  const server = createAnalysisServer({ config, catalog, ledger, cache })
  const analysisRequest = server.listeners('request')[0]
  const thumbnail = createCapstoneYoutubeHandler({ apiKey: process.env.HOWHOUSE_YOUTUBE_API_KEY?.trim() })
  server.removeAllListeners('request')
  server.on('request', async (req, res) => {
    if (!await thumbnail(req, res)) await analysisRequest(req, res)
  })
  server.on('error', () => { console.error('Capstone server could not start. Check local port 8787.'); process.exitCode = 1 })
  server.listen(8787, '127.0.0.1', () => console.log(`Capstone loopback server: http://127.0.0.1:8787; ${catalog.cases.length} cases; model ${config.model}; US only; remaining ${ledger.remaining()}/5. No Supabase/Render connection.`))
  return server
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { startCapstoneServer() }
  catch { console.error('Capstone server not started. Check server-only key/model and --test-data-only. Credentials are never printed.'); process.exitCode = 1 }
}
