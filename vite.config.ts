import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  if (mode === 'trial') {
    const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
    const required = ['VITE_ANALYSIS_API_BASE_URL', 'VITE_ANALYSIS_AUTH_URL', 'VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY']
    for (const name of required) {
      if (!env[name]?.trim()) throw new Error(`시험 빌드 설정 누락: ${name}. .env.trial.local을 확인하세요.`)
    }
    for (const name of required.slice(0, 2)) {
      let url: URL
      try { url = new URL(env[name]!) } catch { throw new Error(`시험 빌드 URL 형식을 확인하세요: ${name}`) }
      if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || ['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error(`시험 빌드에는 공용 HTTPS 주소가 필요합니다: ${name}`)
      if (name === 'VITE_ANALYSIS_AUTH_URL' && url.pathname !== '/') throw new Error('인증 주소는 프로젝트 루트 URL이어야 합니다.')
    }
    if (!env.VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY!.startsWith('sb_publishable_')) throw new Error('시험 앱에는 Supabase 공개 publishable 키만 설정하세요.')
  }
  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      fs: {
        // Preserve Vite 8's defaults and keep all server-only data off the web.
        deny: ['.env', '.env.*', '*.{crt,pem,key,p12,pfx,cer,der}', '.npmrc', '.yarnrc.yml', '**/.git/**', '**/server/**', '**/*.local'],
      },
    },
  }
})
