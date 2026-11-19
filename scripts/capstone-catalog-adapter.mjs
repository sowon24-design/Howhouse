import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'
const root=resolve(import.meta.dirname,'..')
const source=resolve(root,'src/catalog/CatalogApp.tsx'),target=resolve(root,'src/capstone/complete/PrototypeCatalogApp.tsx')
export function adaptCatalog(sourceText){
 let text=sourceText.replace(/from (['"])(\.[^'"]+)\1/g,(_,quote,path)=>{let destination=relative(dirname(target),resolve(dirname(source),path)).replaceAll('\\','/');if(!destination.startsWith('.'))destination='./'+destination;return `from ${quote}${destination}${quote}`})
 text=text.replace(/import (['"])(\.[^'"]+)\1/g,(_,quote,path)=>{let destination=relative(dirname(target),resolve(dirname(source),path)).replaceAll('\\','/');if(!destination.startsWith('.'))destination='./'+destination;return `import ${quote}${destination}${quote}`})
 text=text.replace("import { catalogPolicy } from '../../catalog/policy'","import { prototypePolicy as catalogPolicy } from './prototype-policy'")
 text=text.replace("import { HomeScreen, type HomeCategoryKey } from '../../app-screens/home/HomeScreen'","import { PrototypeHomeScreen as HomeScreen } from './PrototypeHomeScreen'\nimport type { HomeCategoryKey } from '../../app-screens/home/HomeScreen'")
 text=text.replace("import { B03 } from '../../solutions/B03'","import { B03 } from './PrototypeB03'")
 text=text.replace("import { CatalogOnboarding } from '../../catalog/CatalogOnboarding'","import { PrototypeOnboarding as CatalogOnboarding } from './PrototypeOnboarding'")
 text=text.replace("import { TermsView } from '../../app-screens/onboarding/TermsView'","import { PrototypeTermsView as TermsView } from './PrototypeTermsScreen'\nimport { PrototypeMyAdditions } from './PrototypeMyAdditions'")
 text=text.replace('AI 분석 동의 — 미사용 안내','개인정보 수집·이용 동의').replace('분석 국외 이전 동의 — 미사용 안내','개인정보 국외 이전 동의').replace('서비스 제공 방식·이미지 안내','AI 활용 정보')
 text=text.replace('기존 주거 문제 사례를 찾고 문의 문장을 편집하는 어쩌집이에요. 계정·AI 분석·평가 및 의견 서버 저장은 사용하지 않아요.','기존 사례와 AI 분석 화면을 확인하는 캡스톤 프로토타입이에요. 현재 분석은 꺼져 있고, 커뮤니티·로그아웃·탈퇴는 시연이에요.')
 text=text.replace('<PolicyDocuments all/>','<PolicyDocuments all/>\n    <PrototypeMyAdditions/>')
 return '// Main CatalogApp controller/layout; only owner-approved prototype documents, onboarding and Figma additions differ.\n'+text
}
if(process.argv[1]===import.meta.filename)writeFileSync(target,adaptCatalog(readFileSync(source,'utf8')))
