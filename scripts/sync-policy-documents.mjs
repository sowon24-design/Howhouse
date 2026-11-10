import {readFileSync,writeFileSync,mkdirSync} from 'node:fs'
import {createHash} from 'node:crypto'

const root=new URL('../',import.meta.url)
const information=JSON.parse(readFileSync(new URL('src/app-screens/my/information-draft.json',root),'utf8'))
const publication=JSON.parse(readFileSync(new URL('src/analysis/policy-publication.json',root),'utf8'))
const hash=value=>createHash('sha256').update(value).digest('hex')
const check=process.argv.includes('--check')
const directory=new URL('docs/policies/',root)
const records=[]
if(!check)mkdirSync(directory,{recursive:true})
function emit(name,text){
 const file=new URL(name,directory)
 if(check){if(readFileSync(file,'utf8').replace(/\r\n/g,'\n')!==text)throw Error(`Policy export differs: ${name}. Run npm run policies:sync.`)}
 else writeFileSync(file,text)
}
for(const page of publication.pages){
 const sections=information[page.key]
 if(!Array.isArray(sections)||!sections.length)throw Error('Missing policy sections: '+page.key)
 const content='# '+page.title+'\n\n'+sections.map(section=>(section.title?'## '+section.title+'\n\n':'')+section.paragraphs.join('\n\n')).join('\n\n')+'\n'
 emit(page.key+'.md',content)
 records.push({...page,file:'docs/policies/'+page.key+'.md',sourceSha256:hash(JSON.stringify(sections)),markdownSha256:hash(content)})
}
emit('manifest.json',JSON.stringify({schema:1,consentVersion:publication.consentVersion,revisedAt:publication.revisedAt,source:'src/app-screens/my/information-draft.json',pages:records},null,2)+'\n')
console.log(`${check?'Verified':'Exported'} ${records.length} policy pages from the app source. Notion pages are not modified by this command.`)
