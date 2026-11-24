export const recentListPath = 'screen/336:31416'
export const recentMyPath = 'screen/336:30827'
export const recentCasePath = (id:string,fromMy=false,fromSolved=false) => 'case/'+encodeURIComponent(id)+'?from='+(fromSolved?'solved':fromMy?'my':'recent')
const savedOrigin=(hash:string)=>{const origin=new URLSearchParams(hash.split('?')[1]??'').get('returnTo');return origin&&(origin==='home'||origin==='search'||origin==='screen/336:29106'||origin.startsWith('solutions/'))?origin:undefined}
export const recentCaseOrigin = (hash:string) => savedOrigin(hash) ?? ( hash.endsWith('?from=case-search') ? 'screen/336:29106' : hash.endsWith('?from=solved') ? 'screen/336:31369' : hash.endsWith('?from=my') ? recentMyPath : hash.endsWith('?from=recent') ? recentListPath : undefined)
export const caseIdPart = (hash:string) => hash.startsWith('#case/')?hash.slice(6).split('?')[0]:''
