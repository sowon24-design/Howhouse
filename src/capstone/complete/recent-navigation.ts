export const recentListPath = 'screen/336:31416'
export const recentMyPath = 'screen/336:30827'
export const recentCasePath = (id:string,fromMy=false,fromSolved=false) => 'case/'+encodeURIComponent(id)+'?from='+(fromSolved?'solved':fromMy?'my':'recent')
export const recentCaseOrigin = (hash:string) => /\?from=category-(1042:\d+)$/.test(hash) ? 'screen/'+hash.split('category-').pop() : hash.endsWith('?from=case-search') ? 'screen/336:29106' : hash.endsWith('?from=solved') ? 'screen/336:31369' : hash.endsWith('?from=my') ? recentMyPath : hash.endsWith('?from=recent') ? recentListPath : undefined
export const caseIdPart = (hash:string) => hash.startsWith('#case/')?hash.slice(6).replace(/\?from=(recent|my|solved|case-search|category-1042:\d+)$/,''):''
