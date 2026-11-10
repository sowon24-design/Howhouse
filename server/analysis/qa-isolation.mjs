import { MatchError } from './matcher.mjs'

// Used only by qa-server.mjs. The normal server and release approval stay unchanged.
export function createQaIsolation({owner,expiresAt,authenticate,hasCalls,reserve,now=Date.now}) {
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(owner??'') || !Number.isFinite(expiresAt) || expiresAt<=now() || expiresAt>now()+2*60*60*1000)throw Error('QA owner and expiry within two hours are required')
 let claimed=false
 return {
  async authenticate(token,signal){const user=await authenticate(token,signal);if(user.id!==owner)throw new MatchError('auth-required');return user},
  async reserve(requestId){
   if(claimed||now()>=expiresAt)throw new MatchError('budget-limit')
   claimed=true // Fail closed even when the network result is uncertain.
   if(await hasCalls())throw new MatchError('budget-limit')
   await reserve(requestId)
  },
  assertFresh(){if(now()>=expiresAt)throw new MatchError('budget-limit')},
 }
}
