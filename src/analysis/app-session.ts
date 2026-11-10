import { AnalysisError } from './client'

type Session = { accessToken: string; refreshToken: string; expiresAt: number }

/** Anonymous app authentication: no login UI and no OpenAI/server secret in the app. */
export function createAppSession(options: {
  url: string; publishableKey: string; storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
  fetchImpl?: typeof fetch; now?: () => number
}) {
  const url = new URL(options.url)
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Invalid app authentication URL')
  if (!options.publishableKey.startsWith('sb_publishable_')) throw new Error('Only a Supabase publishable key belongs in the app')
  const storageKey = `howhouse-analysis-session:${url.host}`
  const now = options.now ?? Date.now
  let session: Session | undefined, pending: Promise<string> | undefined
  let generation=0
  try {
    const saved = JSON.parse(options.storage?.getItem(storageKey) ?? 'null')
    if (typeof saved?.accessToken === 'string' && typeof saved?.refreshToken === 'string' && Number.isFinite(saved?.expiresAt)) session = saved
  } catch { /* Start anonymously if local state is unavailable. */ }
  async function acquire(signal: AbortSignal) {
    const attemptGeneration=generation
    const refresh = session?.refreshToken
    let response: Response
    try {
      response = await (options.fetchImpl ?? fetch)(`${url.origin}/auth/v1/${refresh ? 'token?grant_type=refresh_token' : 'signup'}`, {
        method: 'POST', headers: { apikey: options.publishableKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(refresh ? { refresh_token: refresh } : { data: {} }),
        signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]), redirect: 'error',
      })
    } catch (error) {
      if (signal.aborted) throw error
      throw new AnalysisError({ code: 'connection-error', message: '앱 인증 서버 연결을 확인하지 못했습니다.' })
    }
    if (!response.ok) {
      if (refresh && [400, 401, 403].includes(response.status)) {
        session = undefined
        try { options.storage?.removeItem(storageKey) } catch { /* In-memory reset still works. */ }
      }
      throw new AnalysisError({ code: 'auth-required', message: '앱의 임시 인증을 확인하지 못했습니다. 자동 분석 재시도는 하지 않습니다.' })
    }
    const data = await response.json()
    if (typeof data.access_token !== 'string' || typeof data.refresh_token !== 'string' || !Number.isFinite(data.expires_in) || data.expires_in <= 0) {
      throw new AnalysisError({ code: 'auth-required', message: '앱 인증 응답을 확인하지 못했습니다.' })
    }
    if(attemptGeneration!==generation)throw new AnalysisError({code:'auth-required',message:'인증 정보가 초기화됐습니다. 다시 시도해 주세요.'})
    session = { accessToken: data.access_token, refreshToken: data.refresh_token, expiresAt: now() + data.expires_in * 1000 }
    try { options.storage?.setItem(storageKey, JSON.stringify(session)) } catch { /* Current in-memory session remains usable. */ }
    return session.accessToken
  }
  async function getAccessToken(signal: AbortSignal) {
    signal.throwIfAborted()
    if (session && session.expiresAt > now() + 30000) return session.accessToken
    if (!pending) {const job=acquire(signal);pending=job;void job.finally(()=>{if(pending===job)pending=undefined}).catch(()=>{})}
    const token = await pending
    signal.throwIfAborted()
    return token
  }
  return Object.assign(getAccessToken,{peekAccessToken:()=>session && session.expiresAt > now() + 30000 ? session.accessToken : undefined,reset:()=>{generation++;session=undefined;pending=undefined;options.storage?.removeItem(storageKey)}})
}

let configured: ReturnType<typeof createAppSession> | undefined
export function clearConfiguredAppSession(){
 configured?.reset()
 const url=import.meta.env?.VITE_ANALYSIS_AUTH_URL
 if(url)globalThis.localStorage?.removeItem(`howhouse-analysis-session:${new URL(url).host}`)
 configured=undefined
}
export function configuredAppSession() {
  const url = import.meta.env?.VITE_ANALYSIS_AUTH_URL
  const publishableKey = import.meta.env?.VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY
  if (!url && !publishableKey) return undefined // Existing USB/PC server path.
  if (!url || !publishableKey) throw new Error('Both app authentication settings are required')
  if (!configured) {
    let storage: Storage | undefined
    try { storage = globalThis.localStorage } catch { /* Memory fallback, no global security changes. */ }
    configured = createAppSession({ url, publishableKey, storage })
  }
  return configured
}
