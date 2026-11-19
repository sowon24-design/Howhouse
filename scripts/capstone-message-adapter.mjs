import {readFileSync,writeFileSync} from 'node:fs'
import {resolve,relative,dirname} from 'node:path'
const root=resolve(import.meta.dirname,'..')
function relocate(sourcePath,targetPath){
 const source=resolve(root,sourcePath),target=resolve(root,targetPath)
 let text=readFileSync(source,'utf8')
 const pathFrom=path=>{let p=relative(dirname(target),resolve(dirname(source),path)).replaceAll('\\','/');return p.startsWith('.')?p:'./'+p}
 text=text.replace(/from (['"])(\.[^'"]+)\1/g,(_,q,p)=>`from ${q}${pathFrom(p)}${q}`)
 return text.replace(/import (['"])(\.[^'"]+)\1/g,(_,q,p)=>`import ${q}${pathFrom(p)}${q}`)
}
let message=relocate('src/solutions/B03.tsx','src/capstone/complete/PrototypeB03.tsx')
message=message.replace('MessageButton, TabBar','MessageButton')
message="// Main B03 interactions preserved; only the explicitly requested Figma recipient tabs differ.\nimport {PrototypeRecipientTabs as TabBar} from './PrototypeRecipientTabs'\n"+message
writeFileSync(resolve(root,'src/capstone/complete/PrototypeB03.tsx'),message.trimEnd()+'\n')
let flow=relocate('src/analysis/AnalysisResultFlow.tsx','src/capstone/complete/PrototypeResultFlow.tsx')
flow=flow.replace("import { B03 } from '../../solutions/B03'","import { B03 } from './PrototypeB03'")
writeFileSync(resolve(root,'src/capstone/complete/PrototypeResultFlow.tsx'),'// Original result flow with the owner-requested recipient tab adapter.\n'+flow)
