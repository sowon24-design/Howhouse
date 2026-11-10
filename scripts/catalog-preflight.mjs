import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { catalogPolicy } from '../src/catalog/policy.ts'
const root=new URL('../',import.meta.url)
const read=path=>readFile(new URL(path,root),'utf8')
const approval=JSON.parse(await read('src/catalog/release-approval.json'))
const release=JSON.parse(await read('src/catalog/app-release.json'))
const blockers=[]
if(release.applicationId!=='com.howhouse.app'||!Number.isInteger(release.versionCode)||release.versionCode<1||!release.versionName)blockers.push('invalid-release-identity')
for(const key of ['publicPolicyVerified','androidVerified','externalContentRightsVerified','legacyDataTransitionReviewed'])if(approval[key]!==true)blockers.push(key)
if(catalogPolicy.status!=='published')blockers.push('policy-not-published')
if(approval.policyVersion!==catalogPolicy.version)blockers.push('policy-version-mismatch')
try {
 const info=JSON.parse(await read('android/app/src/main/assets/public/howhouse-build.json'))
 if(info.policySha256!==createHash('sha256').update(await read('src/catalog/policy.ts')).digest('hex'))blockers.push('android-policy-stale')
 if(info.variant!=='catalog'||info.aiEnabled!==false||info.serverStorage!==false)blockers.push('wrong-app-variant')
 if(info.releaseApproved!==true)blockers.push('preview-assets-only')
}catch{blockers.push('android-build-info-missing')}
console.log(JSON.stringify({release,readyForPlaySubmission:blockers.length===0,blockers,deviceTestNotAssumed:true},null,2))
process.exitCode=blockers.length?1:0
