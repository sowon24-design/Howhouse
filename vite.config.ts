import {createHash} from 'node:crypto'
import type {Plugin} from 'vite'
import {readFileSync} from 'node:fs'

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  const policyText=readFileSync(new URL('./src/app-screens/my/information-local.json', import.meta.url), 'utf8')
  // Local case search requires no authentication or remote API configuration.
  for (const [key,value] of Object.entries(env)) {
    if (key.startsWith('VITE_') && (/OPENAI|SECRET|SERVICE_ROLE|ENCRYPTION|PASSWORD|PRIVATE_KEY/i.test(key) || /^(sk-|sb_secret_)/.test(String(value)))) throw Error('서버 비밀 값을 앱에 포함할 수 없습니다.')
  }
  const developerTools=['development','trial','test'].includes(mode)
  const buildInfo:Plugin={name:'howhouse-build-info',generateBundle(){
    this.emitFile({type:'asset',fileName:'howhouse-build.json',source:JSON.stringify({schema:1,mode,developerTools,localCaseSearch:true,privacyReady:false,requiredProcessingRegion:null,policySha256:createHash('sha256').update(policyText).digest('hex')})})
  }}
  return {
    plugins: [react(),buildInfo],
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
