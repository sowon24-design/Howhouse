import type { PreviewConfig } from './preview-client'

/** This Google project key is extractable from an app; it is NOT an OpenAI/server secret. */
export function youtubePreviewConfig(): PreviewConfig | undefined {
  const apiKey = String(import.meta.env.VITE_YOUTUBE_API_KEY ?? '').trim()
  const sha1 = String(import.meta.env.VITE_YOUTUBE_ANDROID_SHA1 ?? '').trim()
  if (!/^AIza[A-Za-z0-9_-]{35}$/.test(apiKey) || !/^[a-fA-F0-9]{40}$/.test(sha1)) return
  return { apiKey, android: { packageName: 'com.howhouse.app', signingCertificateSha1: sha1 } }
}
