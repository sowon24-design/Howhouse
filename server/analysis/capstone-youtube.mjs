import { requestYoutubePreview, requestYoutubeImage } from '../../src/youtube/preview-client.ts'
import signers from '../../src/youtube/android-signers.json' with { type: 'json' }

/** Owner-only loopback proxy: no browser Google key or catalog-profile dependency. */
export function createCapstoneYoutubeHandler({ apiKey, fetchImpl = fetch, publicHost }) {
  return async (req, res) => {
    if (!req.url?.startsWith('/api/youtube/')) return false
    const allowed = ['http://127.0.0.1:5190', 'http://127.0.0.1'].includes(req.headers.origin)
      && (publicHost ? req.headers.host === publicHost : /^(127\.0\.0\.1|localhost):\d+$/.test(req.headers.host ?? ''))
    const reply = (status, body, type = 'application/json') => {
      if (res.destroyed) return
      res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
        ...(allowed ? { 'Access-Control-Allow-Origin': req.headers.origin, Vary: 'Origin' } : {}) })
      res.end(body)
    }
    const reject = status => { req.resume(); reply(status, '{"code":"thumbnail-unavailable"}'); return true }
    if (!allowed) return reject(403)
    if (req.method !== 'GET') return reject(405)
    const url = new URL(req.url, 'http://127.0.0.1')
    const ids = url.searchParams.getAll('videoId')
    if (url.pathname !== '/api/youtube/thumbnail' || ids.length !== 1 || [...url.searchParams.keys()].some(key => key !== 'videoId') || !/^[A-Za-z0-9_-]{11}$/.test(ids[0])) return reject(422)
    if (!/^AIza[A-Za-z0-9_-]{35}$/.test(apiKey ?? '')) return reject(503)
    const controller = new AbortController()
    const abort = () => controller.abort()
    res.once('close', abort)
    const timer = setTimeout(abort, 9000)
    try {
      // Same restricted project key/package/certificate already approved for this app.
      // Only this server contacts Google; never forward IP, cookies or user input.
      const result = await requestYoutubePreview(ids[0], { apiKey, privacyAccepted: true,
        android: { packageName: signers.applicationId, signingCertificateSha1: signers.playSha1 } }, controller.signal, fetchImpl)
      if (result.status !== 'ready') return reject(502)
      const blob = await requestYoutubeImage(result.preview, controller.signal, fetchImpl)
      if (!blob || controller.signal.aborted) return reject(502)
      reply(200, Buffer.from(await blob.arrayBuffer()), blob.type)
      return true
    } catch { return reject(502) }
    finally { clearTimeout(timer); res.removeListener('close', abort) }
  }
}
