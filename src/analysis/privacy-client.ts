export const privacyVersion = '2026-11-10-v2'
export class PrivacyError extends Error { readonly code:string;constructor(code: string) {super(code);this.code=code} }
type Store = Pick<Storage,'getItem'|'setItem'|'removeItem'>
export function createPrivacyClient(options:{baseUrl:string;getAccessToken:(signal:AbortSignal)=>Promise<string>;storage:Store;fetchImpl?:typeof fetch;makeId?:()=>string;makeSecret?:()=>string}){
 const origin=new URL(options.baseUrl)
 if(origin.protocol!=='https:' && !(origin.protocol==='http:'&&['localhost','127.0.0.1'].includes(origin.hostname)))throw new PrivacyError('not-configured')
 const base=origin.href.replace(/\/$/,''),fetchImpl=options.fetchImpl??fetch
 const makeSecret=options.makeSecret??(()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join(''))
 const makeId=options.makeId??(()=>crypto.randomUUID())
 const codeKey='howhouse:delete-code:'+origin.origin,pendingKey='howhouse:delete-pending:'+origin.origin,consentKey='howhouse:ai-consent:'+origin.origin
 function tokenOwner(token:string){try{const value=JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));if(typeof value.sub==='string'&&/^[0-9a-f-]{36}$/i.test(value.sub))return value.sub}catch{}throw new PrivacyError('auth-required')}
 async function request(path:string,payload:unknown,anonymous=false,expectedOwner?:string){
  const signal=AbortSignal.timeout(20000),token=anonymous?undefined:await options.getAccessToken(signal)
  if(expectedOwner&&tokenOwner(token??'')!==expectedOwner)throw new PrivacyError('identity-changed')
  let response:Response
  try{response=await fetchImpl(base+'/api/privacy/'+path,{method:'POST',signal,redirect:'error',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(payload)})}catch{throw new PrivacyError('connection-error')}
  let data:Record<string,unknown>
  try{data=await response.json()}catch{throw new PrivacyError('invalid-response')}
  if(!response.ok)throw new PrivacyError(typeof data.code==='string'?data.code:'server-error')
  return data
 }
 async function identity(){
  let code=options.storage.getItem(codeKey)
  if(!code){code=makeSecret();options.storage.setItem(codeKey,code)}
  if(!/^[0-9a-f]{64}$/.test(code))throw new PrivacyError('invalid-code')
  const result=await request('identity',{code});if(result.registered!==true)throw new PrivacyError('invalid-response')
  return code
 }
 return {
  identity,
  consentRecorded:()=>options.storage.getItem(consentKey)===privacyVersion,
  clearConsentLocal:()=>options.storage.removeItem(consentKey),
  async consent(acceptance:{ageAtLeast14:boolean;processingAccepted:boolean;overseasAccepted:boolean}){if(acceptance.ageAtLeast14!==true)throw new PrivacyError('age-required');if(acceptance.processingAccepted!==true||acceptance.overseasAccepted!==true)throw new PrivacyError('consent-required');await identity();const result=await request('consent',{version:privacyVersion,ageAtLeast14:true,processingAccepted:true,overseasAccepted:true});if(result.accepted!==true)throw new PrivacyError('invalid-response');options.storage.setItem(consentKey,privacyVersion)},
  async withdraw(){const result=await request('consent',{version:null});if(result.accepted!==false)throw new PrivacyError('invalid-response');options.storage.removeItem(consentKey)},
  async deleteMine(){
   let pending:{operationId:string;proof:string;confirm:string;owner:string}|undefined
   try{const raw=JSON.parse(options.storage.getItem(pendingKey)??'null');if(raw&&/^[0-9a-f-]{36}$/i.test(raw.operationId)&&/^[0-9a-f]{64}$/.test(raw.proof))pending=raw}catch{/* No valid pending receipt. */}
   let data:Record<string,unknown>|undefined
   if(pending){try{data=await request('delete-status',pending,true)}catch(error){if(!(error instanceof PrivacyError)||error.code!=='not-found')throw error}}
   if(!data){
    if(pending&&!pending.owner)throw new PrivacyError('identity-changed')
    pending??={operationId:makeId(),proof:makeSecret(),confirm:'delete-my-data',owner:tokenOwner(await options.getAccessToken(AbortSignal.timeout(20000)))}
    options.storage.setItem(pendingKey,JSON.stringify(pending))
    data=await request('delete',pending,false,pending.owner)
   }
   if(data.deleted!==true||data.operationId!==pending?.operationId)throw new PrivacyError('invalid-response')
   return {deleted:true as const}
  },
  clear(){for(const key of [consentKey,codeKey,pendingKey])options.storage.removeItem(key)},
 }
}
