import { defineConfig, loadEnv, type Plugin } from 'vite'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import approval from './src/catalog/release-approval.json'
import { catalogPolicy } from './src/catalog/policy'
import youtubeApproval from './src/youtube/release-approval.json'
import { validateYoutubeRelease, catalogContentSecurityPolicy } from './scripts/youtube-release.mjs'

export default defineConfig(({ mode, command }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  for (const [key,value] of Object.entries(env)) {
    if (!key.startsWith('VITE_') || !value) continue
    if (/ANALYSIS|OPENAI|SUPABASE|SECRET|SERVICE_ROLE|PASSWORD|PRIVATE_KEY|ENCRYPTION/i.test(key) || /^(sk-|sb_secret_)/.test(String(value))) throw Error('사례 전용 앱에 AI·인증 서버 설정이나 비밀 값을 넣을 수 없습니다.')
  }
  const preview = ['development','test','catalog-preview'].includes(mode)
  if (command === 'build' && !preview) validateYoutubeRelease(env, youtubeApproval)
  if (command === 'build' && !preview && (catalogPolicy.status !== ('published' as string) || approval.policyVersion !== catalogPolicy.version || !approval.publicPolicyVerified || !approval.androidVerified || !approval.externalContentRightsVerified || !approval.legacyDataTransitionReviewed)) {
    throw Error('사례 전용 출시 전 문서 공개·Android·콘텐츠 권리·기존 데이터 전환 검증이 필요합니다. 개발 확인은 --mode catalog-preview를 사용하세요.')
  }
  const guard: Plugin = {
    name: 'catalog-no-server-guard',
    generateBundle(_,bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue
        for (const id of Object.keys(output.modules)) if (/\/src\/analysis\/|\/server\/|\/src\/App\.tsx$|@capacitor\/(camera|network)/.test(id.replaceAll('\\','/'))) throw Error(`사례 전용 빌드에 서버/AI 연결 코드가 포함됐습니다: ${id}`)
        if (/api\.openai\.com|\.supabase\.co|howhouse-analysis-test\.onrender\.com/.test(output.code)) throw Error('사례 전용 빌드에 기존 API 주소가 포함됐습니다.')
      }
      this.emitFile({type:'asset',fileName:'howhouse-build.json',source:JSON.stringify({schema:2,variant:'catalog',mode,aiEnabled:false,serverStorage:false,youtubePreview:true,youtubeApiConfigured:Boolean(env.VITE_YOUTUBE_API_KEY),youtubeReleaseVerified:Object.values(youtubeApproval).every(value=>value===true),policyVersion:catalogPolicy.version,policyStatus:catalogPolicy.status,policySha256:createHash('sha256').update(readFileSync(new URL('./src/catalog/policy.ts',import.meta.url))).digest('hex'),releaseApproved:!preview})})
    },
    transformIndexHtml: command === 'build' ? () => [{tag:'meta',attrs:{'http-equiv':'Content-Security-Policy',content:catalogContentSecurityPolicy},injectTo:'head-prepend'}] : undefined,
  }
  return {plugins:[react(),guard],server:{port:5181,strictPort:true,fs:{deny:['.env','.env.*','*.{crt,pem,key,p12,pfx,cer,der}','.npmrc','.yarnrc.yml','**/.git/**','**/server/**','**/*.local']}}}
})
