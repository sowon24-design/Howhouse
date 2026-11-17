import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID, createHash } from 'node:crypto'
import { createServer } from 'vite'
import { loadCapstoneCatalog } from '../server/analysis/capstone-catalog.mjs'
import { createAnalysisServer } from '../server/analysis/server.mjs'
import { generatedSampleContent } from '../src/analysis/samples.ts'

test('current browser and prototype server serialize all 115 cases identically', async () => {
  const vite = await createServer({ configFile: 'vite.capstone.config.ts', configLoader: 'runner', mode: 'capstone', cacheDir: '.capstone-cache.local', server: { middlewareMode: true } })
  try {
    const frontend = await vite.ssrLoadModule('/src/solutions/data/index.ts')
    const { serializeCatalog } = await vite.ssrLoadModule('/src/analysis/catalog.ts')
    const serialized = serializeCatalog(frontend.solutionCases)
    const catalog = loadCapstoneCatalog()
    assert.equal(catalog.cases.length, 115)
    assert.equal(catalog.serialized, serialized)
    assert.equal(catalog.version, createHash('sha256').update(serialized).digest('hex'))
  } finally { await vite.close() }
})

test('loopback HTTP accepts photos, existing and generated results, and protects session/origin', async t => {
  const catalog = loadCapstoneCatalog()
  let paidWork = 0
  const seen = []
  const server = createAnalysisServer({
    config: { apiKey: 'not-a-real-key', model: 'gpt-6.1-terra', processingRegion: 'us' }, catalog,
    ledger: { reserve: () => { paidWork++ }, finish: () => {}, remaining: () => 5 - paidWork },
    matchImpl: async input => {
      seen.push(input)
      return { result: input.text === 'generated-fixture' ? { source: 'generated', solution: generatedSampleContent }
        : { source: 'existing', caseId: catalog.cases.at(-1).id }, usage: { inputTokens: 0, outputTokens: 0 } }
    },
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => { server.closeAllConnections(); return new Promise(resolve => server.close(resolve)) })
  const base = `http://127.0.0.1:${server.address().port}`
  const origin = 'http://127.0.0.1:5190'
  assert.equal((await fetch(base + '/session', { headers: { Origin: 'https://other.example' } })).status, 403)
  const session = await (await fetch(base + '/session', { headers: { Origin: origin } })).json()
  assert.equal(session.processingRegion, 'us')
  const send = (text, token = session.token) => {
    const body = new FormData()
    body.set('requestId', randomUUID()); body.set('catalogVersion', catalog.version); body.set('analysisUserText', text)
    body.append('analysisUserPhotos', new Blob([Uint8Array.from([137,80,78,71,13,10,26,10,0])], { type: 'image/png' }), 'test.png')
    return fetch(base + '/api/analysis/match', { method: 'POST', body,
      headers: { Origin: origin, 'X-Howhouse-Session': token, 'X-Howhouse-Content-Version': '2' } })
  }
  assert.equal((await send('existing-fixture', 'wrong-token')).status, 403)
  assert.equal(paidWork, 0)
  const existing = await (await send('existing-fixture')).json()
  assert.deepEqual(existing.result, { source: 'existing', caseId: catalog.cases.at(-1).id })
  const generated = await (await send('generated-fixture')).json()
  assert.equal(generated.result.source, 'generated')
  assert.deepEqual(generated.result.solution.contacts, generatedSampleContent.contacts)
  assert.equal(seen[0].photos[0].type, 'image/png')
  assert.equal(paidWork, 2)
})
