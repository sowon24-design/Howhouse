import test from 'node:test'
import assert from 'node:assert/strict'
import {validateReleaseConfig} from './release-config.mjs'
const env={VITE_ANALYSIS_API_BASE_URL:'https://api.example',VITE_ANALYSIS_AUTH_URL:'https://auth.example',VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY:'sb_publishable_public',VITE_RELEASE_PRIVACY_READY:'1'}
test('release fails closed without public settings or finalized disclosure',()=>{
 assert.throws(()=>validateReleaseConfig('release',{},{}))
 assert.throws(()=>validateReleaseConfig('production',{...env,VITE_RELEASE_PRIVACY_READY:''},{}))
 assert.throws(()=>validateReleaseConfig('release',env,{privacy:'검토 초안'}))
 assert.doesNotThrow(()=>validateReleaseConfig('release',env,{privacy:'공개된 확정 안내'}))
 assert.doesNotThrow(()=>validateReleaseConfig('release',env,{privacy:[{title:'안내',paragraphs:['공개된 확정 안내','[선택] 안내 항목']}]}))
 assert.throws(()=>validateReleaseConfig('release',env,{privacy:[{title:'안내',paragraphs:['[제공업체 설정 확인 필요]']}]}))
})
test('release rejects private keys, unsafe addresses and capture bypass',()=>{
 for(const patch of [{VITE_ANALYSIS_API_BASE_URL:'http://localhost:8787'},{VITE_ANALYSIS_AUTH_URL:'https://auth.example/path'},{VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY:'sb_secret_never-public'},{VITE_OPENAI_API_KEY:'not-allowed'},{VITE_CAPTURE_MODE:'true'}])assert.throws(()=>validateReleaseConfig('release',{...env,...patch},{}))
 assert.throws(()=>validateReleaseConfig('development',{VITE_OPENAI_API_KEY:'not-allowed'},{}))
 assert.throws(()=>validateReleaseConfig('unexpected-mode',{},{}))
})
test('preview can verify the release shell without pretending legal readiness',()=>{
 assert.doesNotThrow(()=>validateReleaseConfig('release-preview',{...env,VITE_RELEASE_PRIVACY_READY:''},{privacy:'검토 초안'}))
 assert.throws(()=>validateReleaseConfig('release-preview',{...env,VITE_SECRET:'secret'},{}))
})
