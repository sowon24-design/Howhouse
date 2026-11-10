import { MatchError } from './matcher.mjs'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Every verified app session, including anonymous sign-in, can analyze. No call quota. */
export function createTrialAccess({ supabaseUrl, publishableKey, fetchImpl = fetch }) {
  const url = new URL(supabaseUrl)
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Invalid trial auth URL')
  if (!publishableKey?.startsWith('sb_publishable_')) throw new Error('A Supabase publishable key is required')
  return async function authenticate(authorization, signal) {
    if (typeof authorization !== 'string' || !/^Bearer [A-Za-z0-9_.-]{20,8192}$/.test(authorization)) throw new MatchError('auth-required')
    let response
    try {
      response = await fetchImpl(`${url.origin}/auth/v1/user`, {
        headers: { apikey: publishableKey, Authorization: authorization },
        signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(5000)]) : AbortSignal.timeout(5000), redirect: 'error',
      })
    } catch { throw new MatchError('api-error') }
    if (response.status === 401 || response.status === 403) throw new MatchError('auth-required')
    if (!response.ok) throw new MatchError('api-error')
    let user
    try { user = await response.json() } catch { throw new MatchError('api-error') }
    if (!uuid.test(user?.id ?? '') || user?.role !== 'authenticated' || !(user?.is_anonymous === true || user?.email_confirmed_at)) {
      throw new MatchError('auth-required')
    }
    // Only Auth-managed app_metadata can grant review access; user_metadata is untrusted.
    return { id: user.id, ...(!user.is_anonymous && user.email_confirmed_at && user.app_metadata?.howhouse_reviewer === true ? { reviewer: true } : {}) }
  }
}
