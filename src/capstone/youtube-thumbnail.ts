/** Same visual component, local prototype transport only. No Google credential in the browser. */
export async function requestCapstoneThumbnail(videoId: string, signal: AbortSignal): Promise<Blob | undefined> {
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId) || signal.aborted) return
  try {
    const response = await fetch(`${import.meta.env.VITE_ANALYSIS_API_BASE_URL || 'http://127.0.0.1:8787'}/api/youtube/thumbnail?videoId=${videoId}`, {
      signal, credentials: 'omit', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer',
    })
    if (!response.ok || !/^image\/(jpeg|png|webp)(;|$)/i.test(response.headers.get('content-type') ?? '')) return
    if (Number(response.headers.get('content-length')) > 2 * 1024 * 1024) return
    const blob = await response.blob()
    if (!signal.aborted && blob.size > 0 && blob.size <= 2 * 1024 * 1024) return blob
  } catch { /* Keep existing thumbnail fallback; never expose provider errors. */ }
}
