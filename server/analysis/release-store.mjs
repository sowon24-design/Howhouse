import {createHmac,createDecipheriv} from 'node:crypto'
export class ReleaseError extends Error {constructor(code){super(code);this.code=code}}
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const secret=/^[0-9a-f]{64}$/
export const privacyVersion='2026-11-10-v2'
export function createReleaseStore({supabaseUrl,secretKey,encryptionKey,fetchImpl=fetch,now=Date.now}){
 const origin=new URL(supabaseUrl).origin,key=Buffer.from(encryptionKey??'','base64')
 if(!origin.startsWith('https:')||!secretKey?.startsWith('sb_secret_')||key.length!==32)throw new Error('Invalid release settings')
 async function call(path,method='GET',body,extraHeaders={}){
  let response
  try{response=await fetchImpl(origin+path,{method,headers:{apikey:secretKey,'Content-Type':'application/json',...extraHeaders},body:body===undefined?undefined:JSON.stringify(body),redirect:'error',signal:AbortSignal.timeout(15000)})}catch{throw new ReleaseError('storage-unavailable')}
  if(!response.ok)throw new ReleaseError(response.status===404?'not-found':'storage-unavailable')
  const text=await response.text();if(!text)return null
  try{return JSON.parse(text)}catch{throw new ReleaseError('storage-unavailable')}
 }
 const hash=value=>createHmac('sha256',key).update('privacy-delete:'+value).digest('hex')
 const checkId=value=>{if(!uuid.test(value??''))throw new ReleaseError('invalid-input')}
 const checkToken=value=>{if(!secret.test(value??''))throw new ReleaseError('invalid-input')}
 async function rpc(owner,kind,payload={}){
  const result=await call('/rest/v1/rpc/howhouse_release_data','POST',{p_owner:owner,p_kind:kind,p_payload:payload})
  if(result?.ok!==true)throw new ReleaseError(['invalid-input','not-found','not-registered','conflict','auth-required'].includes(result?.code)?result.code:'storage-unavailable')
  return result.data
 }
 async function completeDeletion(operationId,proof,job){
  if(job.state==='cancelled')return {operationId,deleted:false}
  if(job.state!=='completed'){
   checkId(job.owner)
   // Repeat the owned-row purge on retry: an already authenticated in-flight write may have raced deletion.
   try{await rpc(job.owner,'begin-delete',{operationId,proof,confirm:'delete-my-data'})}catch(error){if(error.code!=='auth-required')throw error}
   // Database rows are already deleted; Auth deletion is retried with the same private receipt.
   try{await call('/auth/v1/admin/users/'+job.owner,'DELETE')}catch(error){if(error.code!=='not-found')throw error}
   job=await rpc(null,'finish-delete',{operationId,proof})
  }
  return {operationId,deleted:job.state==='completed'}
 }
 return {
  async check(){await call('/rest/v1/howhouse_release_users?select=owner_id&limit=0');try{await rpc(null,'consent-state',{})}catch(error){if(error.code!=='auth-required')throw error}},
  async identity(owner,token){checkId(owner);checkToken(token);return rpc(owner,'identity',{deleteHash:hash(token)})},
  touch:owner=>rpc(owner,'touch'),
  async acceptConsent(owner,version,ageAtLeast14,processingAccepted,overseasAccepted){if((version!==privacyVersion&&version!==null)||(version!==null&&(ageAtLeast14!==true||processingAccepted!==true||overseasAccepted!==true)))throw new ReleaseError('invalid-input');return rpc(owner,'consent',{version,ageAtLeast14,processingAccepted:version!==null&&processingAccepted===true,overseasAccepted:version!==null&&overseasAccepted===true})},
  async hasConsent(owner){return (await rpc(owner,'consent-state',{version:privacyVersion})).accepted===true},
  async deleteMine(owner,payload,beforeDelete=()=>{}){
   checkId(owner);checkId(payload.operationId);checkToken(payload.proof)
   if(payload.confirm!=='delete-my-data')throw new ReleaseError('invalid-input')
   await beforeDelete(owner)
   const proof=hash(payload.proof),job=await rpc(owner,'begin-delete',{operationId:payload.operationId,proof,confirm:payload.confirm})
   return completeDeletion(payload.operationId,proof,job)
  },
  async deletionStatus(payload){
   checkId(payload.operationId);checkToken(payload.proof)
   const proof=hash(payload.proof),job=await rpc(null,'delete-status',{operationId:payload.operationId,proof})
   return completeDeletion(payload.operationId,proof,job)
  },
  async deleteWithCode(payload,beforeDelete=()=>{}){
   checkToken(payload.code)
   const rows=await call('/rest/v1/howhouse_release_users?delete_hash=eq.'+hash(payload.code)+'&select=owner_id&limit=1')
   if(!rows?.length)throw new ReleaseError('not-found')
   return this.deleteMine(rows[0].owner_id,payload,beforeDelete)
  },
  async listFeedback(cursor){
   let after=''
   if(cursor!==undefined){
    const [at,id,...extra]=String(cursor).split('|')
    if(extra.length||!/^\d{4}-\d\d-\d\dT[0-9:.+Z-]+$/.test(at)||!uuid.test(id??''))throw new ReleaseError('invalid-input')
    after='&or='+encodeURIComponent(`(submitted_at.lt.${at},and(submitted_at.eq.${at},operation_id.lt.${id}))`)
   }
   const rows=await call('/rest/v1/howhouse_feedback_opinions?select=owner_id,operation_id,target_key,reason,encrypted_comment,submitted_at&expires_at=gt.'+encodeURIComponent(new Date(now()).toISOString())+'&order=submitted_at.desc,operation_id.desc&limit=100'+after)
   const reviews=rows.length?await call('/rest/v1/howhouse_feedback_reviews?select=owner_id,operation_id,status&operation_id=in.('+rows.map(r=>r.operation_id).join(',')+')'):[]
   return {items:rows.map(row=>{
    let text=''
    if(row.encrypted_comment){try{
     const record=row.encrypted_comment,decipher=createDecipheriv('aes-256-gcm',key,Buffer.from(record.iv,'base64'))
     decipher.setAAD(Buffer.from(`${row.owner_id}:${row.operation_id}:${row.target_key}`));decipher.setAuthTag(Buffer.from(record.tag,'base64'))
     text=Buffer.concat([decipher.update(Buffer.from(record.data,'base64')),decipher.final()]).toString()
    }catch{text='[복호화하지 못했습니다. 키를 확인하세요.]'}}
    return {owner:row.owner_id,id:row.operation_id,target:row.target_key,reason:row.reason,text,at:row.submitted_at,report:text.startsWith('[AI 답변 신고 v1]')||row.reason==='unsafe-method',status:reviews.find(r=>r.owner_id===row.owner_id&&r.operation_id===row.operation_id)?.status??'new'}
   }),next:rows.length===100?`${rows.at(-1).submitted_at}|${rows.at(-1).operation_id}`:null}
  },
  async review(reviewer,payload){
   for(const value of [reviewer,payload.owner,payload.id])checkId(value)
   if(!['reviewed','needs-change'].includes(payload.status))throw new ReleaseError('invalid-input')
   await call('/rest/v1/howhouse_feedback_reviews?on_conflict=owner_id,operation_id','POST',{owner_id:payload.owner,operation_id:payload.id,status:payload.status,reviewed_by:reviewer,reviewed_at:new Date(now()).toISOString()},{Prefer:'resolution=merge-duplicates'})
   return {saved:true}
  },
  async deletionQueue(){return {items:await call('/rest/v1/howhouse_deletion_jobs?state=in.(pending,data-deleted)&select=operation_id,state,requested_at&order=requested_at.asc&limit=20')}},
  async cleanup(beforeDelete=()=>{}){
   // Cron queues only inactive anonymous accounts. Re-check activity before any Auth deletion.
   const jobs=await call('/rest/v1/howhouse_deletion_jobs?state=in.(pending,data-deleted)&select=operation_id,proof_hash,owner_id,state,requested_at&order=requested_at.asc&limit=5')
   for(const job of jobs){
    try{
     if(job.state==='pending'){
      let user
      try{user=await call('/auth/v1/admin/users/'+job.owner_id)}catch(error){if(error.code==='not-found'){await completeDeletion(job.operation_id,job.proof_hash,{state:'data-deleted',owner:job.owner_id});continue}throw error}
      const activity=await call('/rest/v1/howhouse_release_users?owner_id=eq.'+job.owner_id+'&select=last_seen&limit=1')
      const account=user?.user??user
      const last=Math.max(...[account.created_at,account.last_sign_in_at,activity?.[0]?.last_seen].map(v=>Date.parse(v??'')||0))
      if(!account.is_anonymous||!last||last>now()-90*86400000){await rpc(null,'cancel-expiry',{operationId:job.operation_id,proof:job.proof_hash});continue}
      await beforeDelete(job.owner_id)
      const state=await rpc(job.owner_id,'begin-delete',{operationId:job.operation_id,proof:job.proof_hash,confirm:'delete-my-data'})
      await completeDeletion(job.operation_id,job.proof_hash,state)
     }else await completeDeletion(job.operation_id,job.proof_hash,{state:job.state,owner:job.owner_id})
    }catch{/* Keep failed jobs for bounded retry. Never log credentials or user data. */}
   }
   return {checked:jobs.length}
  },
 }
}
