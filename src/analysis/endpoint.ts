export const defaultAnalysisBaseUrl = 'http://127.0.0.1:8787'

/** Public endpoint only. Secrets and authentication belong on the server. */
export function resolveAnalysisBaseUrl(explicit?: string, environmentValue = import.meta.env?.VITE_ANALYSIS_API_BASE_URL): string {
  const value = explicit ?? environmentValue
  if (value === undefined || value === '') return defaultAnalysisBaseUrl
  const raw = value.trim()
  let url: URL
  try { url = new URL(raw) } catch { throw new Error('분석 API 주소는 절대 URL이어야 합니다.') }
  const localHttp = url.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]', '10.0.2.2'].includes(url.hostname)
  if ((!localHttp && url.protocol !== 'https:') || url.username || url.password || /[?#]/.test(raw)) {
    throw new Error('분석 API는 HTTPS 주소 또는 로컬 개발 HTTP 주소를 사용하세요. 인증정보·쿼리·해시는 주소에 넣지 않습니다.')
  }
  return url.href.replace(/\/+$/, '')
}
