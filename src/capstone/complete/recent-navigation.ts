export const recentListPath = 'screen/336:31416'
export const recentCasePath = (id:string) => 'case/'+encodeURIComponent(id)+'?from=recent'
export const isRecentCaseHash = (hash:string) => hash.startsWith('#case/')&&hash.endsWith('?from=recent')
export const caseIdPart = (hash:string) => hash.startsWith('#case/')?hash.slice(6).replace(/\?from=recent$/,''):''
