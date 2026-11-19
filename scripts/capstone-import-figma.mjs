// Import the reviewed high-fidelity MCP references, not screen screenshots.
// Usage: node scripts/capstone-import-figma.mjs <reference-directory>
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs'
import { resolve, basename } from 'node:path'
import { createHash } from 'node:crypto'
const evidence=resolve(process.argv[2] ?? '')
if(!process.argv[2]) throw Error('Explicit reviewed Figma reference directory required.')
const frames=readdirSync(evidence).filter(n=>/^reference-\d+\.json$/.test(n)).sort().flatMap(n=>JSON.parse(readFileSync(resolve(evidence,n),'utf8')))
const out=resolve('src/capstone/complete');mkdirSync(resolve(out,'frames'),{recursive:true})
const files=readdirSync(resolve(out,'assets')), canonical=new Map(), assets=new Map()
if(existsSync(resolve(out,'assets-index.json')))for(const [name,target] of Object.entries(JSON.parse(readFileSync(resolve(out,'assets-index.json'),'utf8'))))assets.set(name,target)
for(const name of files){const path=resolve(out,'assets',name),hash=createHash('sha256').update(readFileSync(path)).digest('hex');if(!canonical.has(hash))canonical.set(hash,name);assets.set(name,canonical.get(hash))}
const classes=new Map()
const decode=s=>s.replaceAll('_',' ').replaceAll('\\/','\\/')
function declaration(t){
 const simple={relative:'position:relative',absolute:'position:absolute',sticky:'position:sticky',flex:'display:flex',grid:'display:grid',block:'display:block','flex-col':'flex-direction:column','flex-wrap':'flex-wrap:wrap','flex-none':'flex:none','shrink-0':'flex-shrink:0','items-center':'align-items:center','items-start':'align-items:flex-start','items-end':'align-items:flex-end','justify-between':'justify-content:space-between','justify-center':'justify-content:center','justify-end':'justify-content:flex-end','justify-self-stretch':'justify-self:stretch','content-stretch':'align-content:stretch','content-start':'align-content:flex-start','content-center':'align-content:center','self-stretch':'align-self:stretch','overflow-clip':'overflow:clip','overflow-hidden':'overflow:hidden','pointer-events-none':'pointer-events:none','pointer-events-auto':'pointer-events:auto',isolate:'isolation:isolate','object-cover':'object-fit:cover','object-contain':'object-fit:contain','object-bottom':'object-position:bottom','text-center':'text-align:center','text-right':'text-align:right','text-ellipsis':'text-overflow:ellipsis','whitespace-nowrap':'white-space:nowrap','whitespace-pre-wrap':'white-space:pre-wrap','not-italic':'font-style:normal','font-normal':'font-weight:400','list-disc':'list-style-type:disc',border:'border-width:1px','border-b':'border-bottom-width:1px','border-solid':'border-style:solid','max-w-none':'max-width:none','min-w-px':'min-width:1px','min-h-px':'min-height:1px','min-w-full':'min-width:100%','size-full':'width:100%;height:100%','w-full':'width:100%','h-full':'height:100%','inset-0':'inset:0','top-0':'top:0','left-0':'left:0','right-0':'right:0','bottom-0':'bottom:0','w-0':'width:0','h-0':'height:0','mb-0':'margin-bottom:0','left-1/2':'left:50%','top-1/2':'top:50%','-translate-x-1/2':'--cg-x:-50%;translate:var(--cg-x,0) var(--cg-y,0)','-translate-y-1/2':'--cg-y:-50%;translate:var(--cg-x,0) var(--cg-y,0)','rotate-90':'rotate:90deg','rotate-180':'rotate:180deg','-rotate-90':'rotate:-90deg','-rotate-180':'rotate:-180deg','-scale-x-100':'scale:-1 1','-scale-y-100':'scale:1 -1','bg-white':'background-color:white','text-white':'color:white','text-black':'color:black','from-black':'--cg-from:black','to-black':'--cg-to:black','opacity-16':'opacity:.16','opacity-44':'opacity:.44','[word-break:break-word]':'word-break:break-word'}
 if(simple[t])return simple[t]
 if(t.startsWith('bg-gradient-to-'))return `background-image:linear-gradient(to ${{b:'bottom',t:'top',r:'right'}[t.at(-1)]},var(--cg-from,transparent) var(--cg-from-pos,0%),var(--cg-to,transparent) var(--cg-to-pos,100%))`
 const m=t.match(/^(.+?)-\[(.*)\]$/);if(!m)throw Error('Unmapped Figma class: '+t)
 const k=m[1],v=decode(m[2]);
 if(k==='font')return `font-family:var(--font-family);font-weight:${v.includes('SemiBold')?600:v.includes('Medium')?500:v.includes('Bold')?700:400}`
 if(k==='text')return /^\d/.test(v)?`font-size:${v}`:`color:${v.replace(/^color:/,'')}`
 if(k==='border')return /^\d/.test(v)?`border-width:${v}`:`border-color:${v}`
 if(k==='bg')return `background-color:${v}`
 if(k==='from'||k==='to')return `--cg-${k}${v.endsWith('%')?'-pos':''}:${v}`
 const props={w:'width',h:'height','min-w':'min-width','min-h':'min-height','max-w':'max-width','max-h':'max-height',p:'padding',pt:'padding-top',pb:'padding-bottom',pl:'padding-left',pr:'padding-right',ms:'margin-inline-start',gap:'gap','gap-x':'column-gap','gap-y':'row-gap',top:'top',left:'left',right:'right',bottom:'bottom',inset:'inset',z:'z-index',rounded:'border-radius','rounded-tl':'border-top-left-radius','rounded-tr':'border-top-right-radius','rounded-bl':'border-bottom-left-radius','rounded-br':'border-bottom-right-radius',leading:'line-height',aspect:'aspect-ratio',flex:'flex',shadow:'box-shadow',transform:'transform',rotate:'rotate'}
 if(props[k])return `${props[k]}:${v}`
 if(k==='size')return `width:${v};height:${v}`
 if(k==='px')return `padding-left:${v};padding-right:${v}`
 if(k==='py')return `padding-top:${v};padding-bottom:${v}`
 if(k==='backdrop-blur')return `backdrop-filter:blur(${v})`
 if(k==='drop-shadow')return `filter:drop-shadow(${v})`
 if(k==='grid-cols')return `grid-template-columns:${v}`
 if(k==='grid-rows')return `grid-template-rows:${v}`
 throw Error('Unmapped Figma class: '+t)
}
function names(s){return s.split(/\s+/).filter(Boolean).map(t=>{if(!classes.has(t))classes.set(t,{name:'cg'+classes.size,css:declaration(t)});return classes.get(t).name}).join(' ')}
const motions=[JSON.parse(readFileSync(resolve(evidence,'home-motion.json'))),JSON.parse(readFileSync(resolve(evidence,'analysis-motion.json')))].flatMap(m=>m.nodes)
const motionMap=new Map(motions.map(n=>[n.nodeId,n]))
for(const f of frames){
 let code=f.code.replace(/<CodeConnectSnippet[^>]*data-name="Keyboard"[^>]*>[\s\S]*?<\/CodeConnectSnippet>/g,'')
 code=code.replaceAll(/https:\/\/www\.figma\.com\/api\/mcp\/asset\/([A-Za-z0-9-]+\.[A-Za-z0-9]+)/g,(_,name)=>{if(!assets.has(name))throw Error('Missing source asset '+name);return '../assets/'+assets.get(name)})
 code=code.replace(/const (\w+) = "(\.\.\/assets\/[^\"]+)";/g,(_,name,path)=>`import ${name} from '${path}'`)
 code=code.replace(/className="([^"]*)"/g,(_,s)=>`className="${names(s)}"`).replace(/className \|\| "([^"]*)"/g,(_,s)=>`className || "${names(s)}"`)
 // Merge authoritative Figma animation tracks at their original placement.
 code=code.replace(/<motion\.div\b([^>]*?)(?=>)/gs,(opening,attributes)=>{
  const id=attributes.match(/data-(?:node-id|motion-for)="([^"]+)"/)?.[1];let data=motionMap.get(id)
  if(!data)return opening
  let snippet=data.codeSnippets?.motionDev
  if(snippet?.startsWith('// Identical'))snippet=motionMap.get('1042:9675')?.codeSnippets?.motionDev
  if(!snippet?.startsWith('<motion.div'))return opening
  const props=snippet.slice('<motion.div'.length).replace(/\s*\/\>\s*$/,'')
  return '<motion.div'+attributes.replace(/\sstyle=\{\{.*?\}\s+as React\.CSSProperties\}/s,'')+' '+props
 })
 writeFileSync(resolve(out,'frames',f.id.replace(':','-')+'.tsx'),(`// @ts-nocheck\n// Figma ${f.id}: ${f.name}. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.\n${code.includes('<motion.')&&!/import\s*\{\s*motion\s*\}/.test(code)?"import { motion } from 'motion/react'\n":''}`+code).replace(/[ \t]+$/gm,'').trimEnd()+'\n')
}
writeFileSync(resolve(out,'figma.css'),`/* Deterministic translation of 535 reviewed Figma utility declarations; no Tailwind dependency. */\n`+[...classes.values()].map(v=>`.${v.name}{${v.css}}`).join('\n'))
writeFileSync(resolve(out,'screens.ts'),`export const screens = {\n${frames.map(f=>`'${f.id}': { name: ${JSON.stringify(f.name)}, load: ()=>import('./frames/${f.id.replace(':','-')}') }`).join(',\n')}\n} as const\nexport type ScreenId = keyof typeof screens\n`)
writeFileSync(resolve(out,'class-map.json'),JSON.stringify(Object.fromEntries([...classes].map(([key,value])=>[key,value.name])),null,2))
writeFileSync(resolve(out,'screen-index.json'),JSON.stringify(frames.map(({id,name})=>({id,name})),null,2))
const used=new Set(assets.values());for(const name of files)if(!used.has(name))unlinkSync(resolve(out,'assets',name))
writeFileSync(resolve(out,'assets-index.json'),JSON.stringify(Object.fromEntries(assets),null,2))
console.log(JSON.stringify({screens:frames.length,cssDeclarations:classes.size,assets:used.size,missingAssets:false}))
