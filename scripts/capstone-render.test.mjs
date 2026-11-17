import test from 'node:test'
import assert from 'node:assert/strict'
import { renderDemoOptions, startRenderDemo } from '../server/analysis/capstone-render.mjs'
import { createServer } from 'node:net'
import { once } from 'node:events'
import { request } from 'node:http'

test('Render demo is disabled by default, requires exact provider host and explicit bounded expiry', () => {
  const now = Date.parse('2026-11-17T00:00:00Z')
  const env = { RENDER_EXTERNAL_HOSTNAME: 'howhouse-capstone.onrender.com' }
  assert.equal(renderDemoOptions(env, now).enabled, false)
  assert.throws(() => renderDemoOptions({ ...env, RENDER_EXTERNAL_HOSTNAME: 'attacker.example' }, now))
  for (const expiry of ['', '2026-11-16T00:00:00Z', '2027-01-01T00:00:00Z']) {
    assert.throws(() => renderDemoOptions({ ...env, CAPSTONE_DEMO_ENABLED: '1', CAPSTONE_DEMO_EXPIRES_AT: expiry }, now))
  }
  assert.equal(renderDemoOptions({ ...env, CAPSTONE_DEMO_ENABLED: '1', CAPSTONE_DEMO_EXPIRES_AT: '2026-11-18T00:00:00Z' }, now).enabled, true)
})

test('remote readiness is public but exact-host scoped; analysis remains disabled without approval', async t => {
  const probe = createServer()
  probe.listen(0, '127.0.0.1')
  await once(probe, 'listening')
  const port = probe.address().port
  await new Promise(resolve => probe.close(resolve))
  const host = 'howhouse-capstone.onrender.com'
  const server = startRenderDemo({ RENDER_EXTERNAL_HOSTNAME: host, PORT: String(port),
    OPENAI_API_KEY: 'not-a-real-openai-key-test-only', OPENAI_MODEL: 'gpt-6.1-terra', RENDER_GIT_COMMIT: 'test-commit' })
  await once(server, 'listening')
  t.after(() => { server.closeAllConnections(); return new Promise(resolve => server.close(resolve)) })
  // Node fetch rewrites Host. Use raw HTTP to model the hosting reverse proxy.
  const send = (path, headers, method = 'GET') => new Promise((resolve, reject) => {
    const req = request({ hostname: '127.0.0.1', port, path, method, headers }, res => {
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve({ status: res.statusCode, json: async () => JSON.parse(Buffer.concat(chunks).toString()) }))
    })
    req.on('error', reject); req.end()
  })
  const health = await send('/health', { Host: host })
  assert.equal(health.status, 200)
  assert.deepEqual(await health.json(), { service: 'howhouse-analysis', status: 'ok', variant: 'capstone', commit: 'test-commit', demoEnabled: false, database: false })
  assert.equal((await send('/health', {})).status, 403)
  assert.equal((await send('/session', { Host: host, Origin: 'https://other.example' })).status, 403)
  assert.equal((await send('/session', { Host: host, Origin: 'http://127.0.0.1' })).status, 200)
  assert.equal((await send('/api/analysis/match', { Host: host, Origin: 'http://127.0.0.1' }, 'POST')).status, 503)
})
