// Isolated, short-lived, one-owner live QA. Never use as the existing service start command.
import {readTrialConfig,trialSettingsIssues} from './trial-server.mjs'
import {createTrialAccess} from './trial-access.mjs'
import {createTrialStore} from './trial-store.mjs'
import {createReleaseStore,ReleaseError} from './release-store.mjs'
import {createAnalysisServer} from './server.mjs'
import {matchCase} from './matcher.mjs'
import {createQaIsolation} from './qa-isolation.mjs'

try{
 if(process.env.HOWHOUSE_ISOLATED_QA!=='one-owner-one-analysis')throw Error('Explicit isolated QA required')
 if(trialSettingsIssues(process.env).length)throw Error('Server settings incomplete')
 const config=readTrialConfig(process.env),owner=process.env.QA_OWNER_ID,store=createTrialStore(config)
 const context=store.forUser(owner)
 const hasCalls=async()=>{
  const url=new URL('/rest/v1/howhouse_trial_calls',config.supabaseUrl);url.searchParams.set('owner_id','eq.'+owner);url.searchParams.set('select','request_id');url.searchParams.set('limit','1')
  const r=await fetch(url,{headers:{apikey:config.secretKey},signal:AbortSignal.timeout(10000),redirect:'error'})
  if(!r.ok)throw Error('QA quota lookup unavailable');const rows=await r.json();if(!Array.isArray(rows))throw Error('Invalid QA quota response');return rows.length>0
 }
 const isolation=createQaIsolation({owner,expiresAt:Date.parse(process.env.QA_EXPIRES_AT??''),authenticate:createTrialAccess(config),hasCalls,reserve:id=>context.ledger.reserve(id)})
 await store.check()
 const releaseStore=createReleaseStore({...config,consentApproved:true}) // QA-only dependency; policy-approval.json stays false.
 await releaseStore.check()
 // Anonymous proof/code paths must not operate on any other account through this service.
 const forbidden=async()=>{throw new ReleaseError('auth-required')}
 releaseStore.deletionStatus=forbidden;releaseStore.deleteWithCode=forbidden
 const server=createAnalysisServer({config,releaseStore,
  releasePublicConfig:{authUrl:config.supabaseUrl,publishableKey:config.publishableKey,documentsReady:false},
  trial:{host:config.host,origins:config.origins,authenticate:isolation.authenticate,forUser:id=>{if(id!==owner)throw Error('Unexpected QA owner');return {...context,ledger:{...context.ledger,reserve:isolation.reserve}}}},
  matchImpl:args=>{isolation.assertFresh();return matchCase(args)},
 })
 // No global cleanup worker or feedback console: only the QA owner is in scope.
 server.on('error',()=>{console.error('Isolated QA server failed');process.exitCode=1})
 server.listen(config.port,'0.0.0.0',()=>console.log('Isolated QA service ready; one owner, one analysis, no public policy approval'))
}catch{console.error('Isolated QA refused to start; verify settings, owner and expiry. No secret values printed.');process.exitCode=1}
