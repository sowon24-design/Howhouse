import test from 'node:test'
import assert from 'node:assert/strict'
import { validateYoutubeRelease, youtubeApprovalKeys, catalogContentSecurityPolicy } from './youtube-release.mjs'
import signers from '../src/youtube/android-signers.json' with {type:'json'}
const env={VITE_YOUTUBE_API_KEY:'AIza'+'x'.repeat(35),VITE_YOUTUBE_ANDROID_SHA1:signers.playSha1}
const approved=Object.fromEntries(youtubeApprovalKeys.map(key=>[key,true]))
test('release requires key configuration and every separate YouTube review',()=>{
  assert.doesNotThrow(()=>validateYoutubeRelease(env,approved))
  assert.throws(()=>validateYoutubeRelease({},approved))
  for(const key of youtubeApprovalKeys) assert.throws(()=>validateYoutubeRelease(env,{...approved,[key]:false}))
  assert.throws(()=>validateYoutubeRelease({...env,VITE_YOUTUBE_ANDROID_SHA1:''},approved))
})
test('Play releases cannot accidentally use the direct-install certificate',()=>{
  assert.notEqual(signers.playSha1,signers.directInstallSha1)
  assert.throws(()=>validateYoutubeRelease({...env,VITE_YOUTUBE_ANDROID_SHA1:signers.directInstallSha1},approved))
  assert.doesNotThrow(()=>validateYoutubeRelease({...env,VITE_YOUTUBE_ANDROID_SHA1:signers.playSha1.toLowerCase()},approved))
})
test('CSP permits metadata and thumbnail fetches only; no remote scripts, frames, or arbitrary remote images',()=>{
  const directives=Object.fromEntries(catalogContentSecurityPolicy.split(';').map(value=>value.trim().split(/\s+/)).filter(value=>value[0]).map(([key,...values])=>[key,values]))
  assert.deepEqual(directives['connect-src'],['https://www.googleapis.com','https://i.ytimg.com'])
  assert.deepEqual(directives['script-src'],["'self'"])
  assert.deepEqual(directives['frame-src'],["'none'"])
  assert.ok(!directives['img-src'].some(value=>value.startsWith('http')))
})
