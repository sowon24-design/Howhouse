import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {analysisConsentReady} from './consent-flow.ts'
import {consentDocuments,privacyVersion} from './consent-document.ts'
import {createReleaseStore,consentEvidenceSnapshots} from '../../server/analysis/release-store.mjs'
import {validateReleaseConfig} from '../../scripts/release-config.mjs'
import information from '../app-screens/my/information-draft.json' with {type:'json'}
import publication from './policy-publication.json' with {type:'json'}

test('app consent bodies and six Notion exports use one source',()=>{
 assert.equal(privacyVersion,publication.consentVersion)
 assert.deepEqual(consentDocuments.processing,information.processingConsent)
 assert.deepEqual(consentDocuments.overseas,information.overseasConsent)
 assert.equal(new Set(publication.pages.map(page=>page.id)).size,6)
 for(const page of publication.pages){
  const markdown=readFileSync(new URL(`../../docs/policies/${page.key}.md`,import.meta.url),'utf8')
  for(const section of information[page.key])for(const paragraph of section.paragraphs)assert.ok(markdown.includes(paragraph))
 }
})

test('polished wording and an environment flag do not substitute for release approval',()=>{
 assert.equal(analysisConsentReady('1',{text:'확인된 공개 안내'}),false)
 assert.equal(analysisConsentReady('1',{text:'확인된 공개 안내'},true),true)
 const env={VITE_ANALYSIS_API_BASE_URL:'https://api.example',VITE_ANALYSIS_AUTH_URL:'https://auth.example',VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY:'sb_publishable_test',VITE_RELEASE_PRIVACY_READY:'1'}
 assert.throws(()=>validateReleaseConfig('release',env,information),/승인/)
})

test('unapproved server rejects new consent without network but still accepts withdrawal requests',async()=>{
 let calls=0
 const store=createReleaseStore({supabaseUrl:'https://project.supabase.co',secretKey:'sb_secret_mock',encryptionKey:Buffer.alloc(32,7).toString('base64'),fetchImpl:async()=>{calls++;return Response.json({ok:true,data:{accepted:false,eventId:'1',recordedAt:'2026-11-10T00:00:00Z'}})}})
 await assert.rejects(store.acceptConsent('11111111-1111-4111-8111-111111111111',privacyVersion,true,true,true,consentEvidenceSnapshots.analysis.hash,'analysis'),{code:'policy-not-approved'})
 assert.equal(await store.hasConsent('11111111-1111-4111-8111-111111111111'),false)
 assert.equal(calls,0)
 assert.equal((await store.acceptConsent('11111111-1111-4111-8111-111111111111',null)).accepted,false)
 assert.equal(calls,1)
})
