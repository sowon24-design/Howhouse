import {createHash} from 'node:crypto'
import type {Plugin} from 'vite'
import {readFileSync} from 'node:fs'
import {validateReleaseConfig} from './scripts/release-config.mjs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  const policyText=readFileSync(new URL('./src/app-screens/my/information-draft.json', import.meta.url), 'utf8')
  validateReleaseConfig(mode, env, JSON.parse(policyText))
  const developerTools=['development','trial','test'].includes(mode)
  const buildInfo:Plugin={name:'howhouse-build-info',generateBundle(){
    this.emitFile({type:'asset',fileName:'howhouse-build.json',source:JSON.stringify({schema:1,variant:'ai',aiEnabled:true,serverStorage:true,mode,developerTools,privacyReady:env.VITE_RELEASE_PRIVACY_READY==='1',requiredProcessingRegion:developerTools?null:'us',policySha256:createHash('sha256').update(policyText).digest('hex')})})
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
