import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createCapstoneYoutubeHandler } from '../server/analysis/capstone-youtube.mjs'

test('thumbnail proxy restricts origin/ID and returns current image bytes without credentials', async t => {
  const calls = []
  const handler = createCapstoneYoutubeHandler({ apiKey: 'AIza' + 'x'.repeat(35), fetchImpl: async (url, options) => {
    calls.push({ url: String(url), options })
    return String(url).startsWith('https://www.googleapis.com/')
      ? Response.json({ items: [{ id: 'abcdefghijk', status: { privacyStatus: 'public' }, snippet: {
        title: 'Public video', channelTitle: 'Channel', thumbnails: { high: { url: 'https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg' } },
      } }] })
      : new Response(new Uint8Array([255,216,255]), { headers: { 'Content-Type': 'image/jpeg' } })
  } })
  const server = createServer(async (req, res) => { if (!await handler(req, res)) { res.writeHead(404); res.end() } })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => { server.closeAllConnections(); return new Promise(resolve => server.close(resolve)) })
  const base = `http://127.0.0.1:${server.address().port}/api/youtube/thumbnail`
  const headers = { Origin: 'http://127.0.0.1:5190' }
  assert.equal((await fetch(base + '?videoId=abcdefghijk')).status, 403)
  assert.equal((await fetch(base + '?videoId=https://evil.example', { headers })).status, 422)
  assert.equal((await fetch(base + '?videoId=abcdefghijk&input=private', { headers })).status, 422)
  assert.equal(calls.length, 0)
  const response = await fetch(base + '?videoId=abcdefghijk', { headers })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'image/jpeg')
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [255,216,255])
  assert.equal(calls.length, 2)
  assert.equal(calls[0].options.credentials, 'omit')
  assert.equal(calls[0].options.headers.get('X-Forwarded-For'), null)
})

test('missing thumbnail server key and provider failure fail closed without exposing details', async () => {
  const request = { url: '/api/youtube/thumbnail?videoId=abcdefghijk', method: 'GET',
    headers: { origin: 'http://127.0.0.1:5190', host: '127.0.0.1:8787' }, resume() {} }
  const response = { destroyed: false, status: 0, body: '', writeHead(status) { this.status = status }, end(body) { this.body = body } }
  assert.equal(await createCapstoneYoutubeHandler({}) (request, response), true)
  assert.equal(response.status, 503)
  assert.equal(response.body, '{"code":"thumbnail-unavailable"}')
})
