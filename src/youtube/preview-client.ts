/** Official public video metadata only. This module is not enabled in the catalog yet. */
export type YoutubePreview = {
  videoId: string
  title: string
  channelTitle: string
  thumbnailUrl: string
}
export type PreviewResult =
  | { status: 'ready'; preview: YoutubePreview }
  | { status: 'unavailable'; reason: 'not-configured' | 'invalid-id' | 'cancelled' | 'network' | 'quota-or-permission' | 'provider' | 'not-public' | 'invalid-response' }
export type PreviewConfig = {
  apiKey: string
  privacyAccepted?: boolean
  android?: { packageName: string; signingCertificateSha1: string }
}
const videoIdPattern = /^[A-Za-z0-9_-]{11}$/

function thumbnailUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && url.hostname === 'i.ytimg.com' && !url.port && !url.username && !url.password && url.pathname.startsWith('/vi/')) return url.href
  } catch { /* Invalid external data must not become an image URL. */ }
}

/** No login, cookies, automatic retry, persistent cache, or user-entered text. */
export async function requestYoutubePreview(
  videoId: string,
  config: PreviewConfig | undefined,
  signal: AbortSignal,
  request: typeof fetch = fetch,
): Promise<PreviewResult> {
  if (!videoIdPattern.test(videoId)) return { status: 'unavailable', reason: 'invalid-id' }
  if (signal.aborted) return { status: 'unavailable', reason: 'cancelled' }
  if (!config?.apiKey.trim()) return { status: 'unavailable', reason: 'not-configured' }
  if (config.privacyAccepted !== true) return { status: 'unavailable', reason: 'not-configured' }
  const headers = new Headers({ Accept: 'application/json' })
  if (config.android) {
    const sha1 = config.android.signingCertificateSha1.replaceAll(':', '')
    if (!/^[a-fA-F0-9]{40}$/.test(sha1) || config.android.packageName !== 'com.howhouse.app') return { status: 'unavailable', reason: 'not-configured' }
    headers.set('X-Android-Package', config.android.packageName)
    headers.set('X-Android-Cert', sha1)
  }
  const url = new URL('https://www.googleapis.com/youtube/v3/videos')
  url.searchParams.set('part', 'snippet,status')
  url.searchParams.set('id', videoId)
  url.searchParams.set('fields', 'items(id,snippet(title,channelTitle,thumbnails),status(privacyStatus))')
  url.searchParams.set('key', config.apiKey.trim())
  try {
    const response = await request(url, { headers, signal, credentials: 'omit', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer' })
    if (signal.aborted) return { status: 'unavailable', reason: 'cancelled' }
    if (!response.ok) return { status: 'unavailable', reason: [401, 403, 429].includes(response.status) ? 'quota-or-permission' : 'provider' }
    let body
    try { body = await response.json() } catch { return { status: 'unavailable', reason: 'invalid-response' } }
    if (signal.aborted) return { status: 'unavailable', reason: 'cancelled' }
    if (!Array.isArray(body?.items)) return { status: 'unavailable', reason: 'invalid-response' }
    const item = body.items.find((entry: { id?: unknown }) => entry?.id === videoId)
    if (!item || item.status?.privacyStatus !== 'public') return { status: 'unavailable', reason: 'not-public' }
    const snippet = item.snippet
    if (typeof snippet?.title !== 'string' || !snippet.title.trim() || typeof snippet.channelTitle !== 'string') return { status: 'unavailable', reason: 'invalid-response' }
    const images = snippet.thumbnails
    const image = thumbnailUrl(images?.high?.url) ?? thumbnailUrl(images?.medium?.url) ?? thumbnailUrl(images?.default?.url)
    if (!image || !new URL(image).pathname.startsWith(`/vi/${videoId}/`)) return { status: 'unavailable', reason: 'invalid-response' }
    return { status: 'ready', preview: { videoId, title: snippet.title, channelTitle: snippet.channelTitle, thumbnailUrl: image } }
  } catch {
    // Do not log the request URL, provider body, or key-bearing exception.
    return { status: 'unavailable', reason: signal.aborted ? 'cancelled' : 'network' }
  }
}

/** Fetch image bytes without a persistent image URL/cache. Never fall back to packaged JPGs. */
export async function requestYoutubeImage(preview: YoutubePreview, signal: AbortSignal, request: typeof fetch = fetch): Promise<Blob | undefined> {
  const image = thumbnailUrl(preview.thumbnailUrl)
  if (!videoIdPattern.test(preview.videoId) || !image || !new URL(image).pathname.startsWith(`/vi/${preview.videoId}/`) || signal.aborted) return
  try {
    const response = await request(image, { signal, credentials: 'omit', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer' })
    if (!response.ok || signal.aborted || !/^image\/(jpeg|png|webp)(;|$)/i.test(response.headers.get('content-type') ?? '')) return
    const length = Number(response.headers.get('content-length'))
    if (length > 2 * 1024 * 1024) return
    const blob = await response.blob()
    if (!signal.aborted && blob.size > 0 && blob.size <= 2 * 1024 * 1024) return blob
  } catch { /* No provider URLs or credentials in errors. */ }
}

export function youtubeVideoId(raw: string): string | undefined {
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return
    let id: string | undefined
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1)
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v') ?? undefined : /^\/(?:shorts|embed)\/([^/]+)\/?$/.exec(url.pathname)?.[1]
    }
    if (id && videoIdPattern.test(id)) return id
  } catch { /* No arbitrary external URLs. */ }
}
