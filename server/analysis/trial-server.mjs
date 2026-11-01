import { pathToFileURL } from 'node:url'
import { validateConfig } from './verify-openai.mjs'
import { createTrialAccess } from './trial-access.mjs'
import { createTrialStore } from './trial-store.mjs'
import { createAnalysisServer } from './server.mjs'

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
  try {
    // Hosted secrets only: no .env file or local unlimited fallback.
    const config = readTrialConfig(process.env)
    const authenticate = createTrialAccess(config)
    const store = createTrialStore(config)
    await store.check()
    const server = createAnalysisServer({ config, trial: {
      host: config.host, origins: config.origins, authenticate, forUser: id => store.forUser(id),
    } })
    server.on('error', () => { console.error('시험 서버 포트/설정을 확인하세요. 비밀 값은 표시하지 않습니다.'); process.exitCode = 1 })
    server.listen(config.port, '0.0.0.0', () => console.log('앱 임시 인증 기반 시험 서버 시작. 분석 횟수 제한 없음. 공개 출시용 보호 정책은 별도입니다.'))
  } catch {
    console.error('시험 서버를 시작하지 않았습니다. HTTPS 주소·앱 인증 설정·서버 비밀 값·DB 스키마를 확인하세요. 비밀 값은 표시하지 않습니다.')
    process.exitCode = 1
  }
}
