import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {adaptCatalog} from './capstone-catalog-adapter.mjs'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8').replaceAll('\r\n','\n')

test('prototype catalog differs from main controller only through the explicit document and Figma additions adapter',()=>{
 assert.equal(read('src/capstone/complete/PrototypeCatalogApp.tsx'),adaptCatalog(read('src/catalog/CatalogApp.tsx')))
})
test('prototype consent has no authentication, receipt submission or provider client',()=>{
 const source=read('src/capstone/complete/PrototypeTermsScreen.tsx')
 assert.ok(source.includes('const ready = false'))
 assert.doesNotMatch(source,/configuredPrivacyClient|createAnalysisConsentFlow|flow\.submit|\bfetch\s*\(/)
})
test('logout and withdrawal confirmations only navigate without clearing profiles or posts',()=>{
 const source=read('src/capstone/complete/CapstoneApp.tsx')
 const actions=source.slice(source.indexOf("'네':()=>"),source.indexOf("'계정 삭제하기':"))
 assert.ok(actions.includes('go(S.withdrawDone)'));assert.ok(actions.includes('go(S.home)'))
 const accountBranches=actions.slice(actions.indexOf('screen===S.withdrawConfirm'))
 assert.doesNotMatch(accountBranches,/removeItem|setPosts|setNickname|setAvatar|signOut|\.delete|\bfetch\s*\(/)
})
test('recipient tab adapter preserves the complete main message editing and copy controller',()=>{
 const main=read('src/solutions/B03.tsx'),prototype=read('src/capstone/complete/PrototypeB03.tsx')
 assert.equal(prototype.slice(prototype.indexOf('export function B03')).trimEnd(),main.slice(main.indexOf('export function B03')).trimEnd())
})
