import { pathToFileURL } from 'node:url'
import { validateConfig } from './verify-openai.mjs'
import { createTrialAccess } from './trial-access.mjs'
import { createTrialStore } from './trial-store.mjs'
import { createAnalysisServer } from './server.mjs'
import { createFeedbackStore, readFeedbackRetention } from './feedback-store.mjs'
import { readProcessingRegion } from './provider-region.mjs'
import { createReleaseStore } from './release-store.mjs'

/** Return field names only. Never return values, exceptions, URLs or credentials. */
export function trialSettingsIssues(env) {
  const issues = []
  if (env.ANALYSIS_PRIVATE_TRIAL !== '1') issues.push('ANALYSIS_PRIVATE_TRIAL')
  if (!env.ANALYSIS_ALLOWED_ORIGINS?.trim()) issues.push('ANALYSIS_ALLOWED_ORIGINS')
  if (!(env.ANALYSIS_PUBLIC_URL || env.RENDER_EXTERNAL_URL)) issues.push('ANALYSIS_PUBLIC_URL/RENDER_EXTERNAL_URL')
  try { validateConfig({ OPENAI_API_KEY: env.OPENAI_API_KEY, OPENAI_MODEL: 'gpt-6.1-terra' }) } catch { issues.push('OPENAI_API_KEY') }
  try{readProcessingRegion(env.OPENAI_PROCESSING_REGION)}catch{issues.push('OPENAI_PROCESSING_REGION')}
  if (!['gpt-6.1-terra', 'gpt-6.1-sol'].includes(env.OPENAI_MODEL?.trim())) issues.push('OPENAI_MODEL')
  try {
    const url = new URL(env.SUPABASE_URL)
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error()
  } catch { issues.push('SUPABASE_URL') }
  if (!env.SUPABASE_PUBLISHABLE_KEY?.startsWith('sb_publishable_')) issues.push('SUPABASE_PUBLISHABLE_KEY')
  if (!env.SUPABASE_SECRET_KEY?.startsWith('sb_secret_')) issues.push('SUPABASE_SECRET_KEY')
  if (Buffer.from(env.ANALYSIS_CACHE_ENCRYPTION_KEY ?? '', 'base64').length !== 32) issues.push('ANALYSIS_CACHE_ENCRYPTION_KEY (32-byte base64)')
  return issues
}

export function readTrialConfig(env) {
  if (env.ANALYSIS_PRIVATE_TRIAL !== '1') throw new Error('Private trial must be explicitly selected')
  const publicUrl = new URL(env.ANALYSIS_PUBLIC_URL || env.RENDER_EXTERNAL_URL || '')
  if (publicUrl.protocol !== 'https:' || publicUrl.username || publicUrl.password || publicUrl.search || publicUrl.hash || publicUrl.pathname !== '/') throw new Error('HTTPS public server origin required')
  const origins = (env.ANALYSIS_ALLOWED_ORIGINS ?? '').split(',').map(x => x.trim()).filter(Boolean)
  if (!origins.length) throw new Error('Explicit app origins required')
  for (const origin of origins) {
    const url = new URL(origin)
    if (url.origin !== origin || url.username || url.password || url.search || url.hash ||
      (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)))) throw new Error('Invalid app origin')
  }
  const port = Number(env.PORT ?? 10000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid hosting port')
  return { ...validateConfig(env), host: publicUrl.host, origins, port,
    supabaseUrl: env.SUPABASE_URL, publishableKey: env.SUPABASE_PUBLISHABLE_KEY,
    secretKey: env.SUPABASE_SECRET_KEY, encryptionKey: env.ANALYSIS_CACHE_ENCRYPTION_KEY,
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let stage = 'environment-settings'
  try {
    // Hosted secrets only: no .env file or local unlimited fallback.
    const issues = trialSettingsIssues(process.env)
    if (issues.length) {
      console.error(`확인할 설정 항목: ${issues.join(', ')}. 값은 표시하지 않습니다.`)
      throw new Error('invalid-settings')
    }
    const config = readTrialConfig(process.env)
    stage = 'authentication-settings'
    const authenticate = createTrialAccess(config)
    stage = 'storage-settings'
    const store = createTrialStore(config)
    stage = 'database-connection'
    await store.check()
    let feedbackStore
    try {
      const retentionDays = readFeedbackRetention(process.env)
      if (retentionDays !== undefined) feedbackStore = createFeedbackStore({ ...config, retentionDays })
    } catch { console.error('의견 저장 설정을 확인하세요. 의견 저장은 비활성화하고 기존 분석 서버는 유지합니다. 비밀 값은 표시하지 않습니다.') }
    stage = 'analysis-server-initialization'
    const releaseStore=process.env.RELEASE_DATA_ENABLED==='1'?createReleaseStore(config):undefined
    if(releaseStore)await releaseStore.check()
    const server = createAnalysisServer({ config, feedbackStore, releaseStore,
      releasePublicConfig: {authUrl:config.supabaseUrl,publishableKey:config.publishableKey,documentsReady:process.env.PRIVACY_DOCUMENT_READY==='1'}, trial: {
      host: config.host, origins: config.origins, authenticate, forUser: id => store.forUser(id),
    } })
    if(releaseStore){let busy=false;const cleanup=setInterval(()=>{if(busy)return;busy=true;void releaseStore.cleanup().catch(()=>{}).finally(()=>{busy=false})},60000);cleanup.unref();server.once('close',()=>clearInterval(cleanup))}
    server.on('error', () => { console.error('시험 서버 포트/설정을 확인하세요. 비밀 값은 표시하지 않습니다.'); process.exitCode = 1 })
    server.listen(config.port, '0.0.0.0', () => console.log('앱 임시 인증 기반 분석 서버 시작. 신규 분석 한도는 DB 운영 정책을 적용합니다.'))
  } catch {
    console.error(`시작 실패 단계: ${stage}. 비밀 값과 외부 오류 원문은 표시하지 않습니다.`)
    console.error('시험 서버를 시작하지 않았습니다. HTTPS 주소·앱 인증 설정·서버 비밀 값·DB 스키마를 확인하세요. 비밀 값은 표시하지 않습니다.')
    process.exitCode = 1
  }
}
