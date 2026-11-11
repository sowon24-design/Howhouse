// Local evidence only: no environment files, credentials, API calls or writes.
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'
import {loadCatalog} from '../server/analysis/catalog.mjs'
import {privacyVersion,consentEvidenceSnapshots} from '../server/analysis/release-store.mjs'
const root=new URL('../',import.meta.url),cwd=fileURLToPath(root)
const read=p=>readFileSync(new URL(p,root),'utf8')
const approval=JSON.parse(read('src/analysis/policy-approval.json'))
const policies=JSON.parse(read('docs/policies/manifest.json'))
if(policies.consentVersion!==privacyVersion)throw Error('Policy versions differ; run policies:check')
const catalog=loadCatalog()
const commit=execFileSync('git',['-c','safe.directory='+cwd.replaceAll('\\','/'),'rev-parse','HEAD'],{cwd,encoding:'utf8'}).trim()
console.log(JSON.stringify({schema:1,scope:'local-source-only; not deployment or launch approval',sourceCommit:commit,consentVersion:privacyVersion,policyFileSha256:createHash('sha256').update(read('src/app-screens/my/information-draft.json')).digest('hex'),consentHashes:Object.fromEntries(Object.entries(consentEvidenceSnapshots).map(([surface,v])=>[surface,v.hash])),catalog:{cases:catalog.cases.length,version:catalog.version},analysisDeploymentApproved:approval.analysisConsentApproved,notionPublicationVerified:approval.notionSyncVerified,publicPolicyPages:policies.pages.map(({key,url,markdownSha256})=>({key,url,markdownSha256})),liveRuntimeVerified:false,signedArtifactVerified:false},null,2))
