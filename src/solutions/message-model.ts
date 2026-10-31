import type { SolutionCase } from './data/types'
export type Recipient = {id:string; label:string; title:string; sentences:string[]}
export type MessageSentence = {id:string;blockId:string|null;order:number;text:string;direct:boolean}
type SourceBlock = {id:string;order:number;original:string}
export type MessageDraft = {catalog:SourceBlock[];sentences:MessageSentence[];nextId:number}
export function messageBody(draft:MessageDraft){return draft.sentences.map(s=>s.text).join('\n\n')}
export function selectedIndexes(draft:MessageDraft){return draft.catalog.flatMap((b,i)=>draft.sentences.some(s=>s.blockId===b.id)?[i]:[])}
export function toMessageRecipients(data: Pick<SolutionCase,'contacts'>): Recipient[] {
  const result:Recipient[]=[]
  for(const id of ['landlord','company'] as const){
    const contact=data.contacts[id]
    if(contact.label.trim())result.push({id,label:id==='landlord'?'집주인':'전문 업체',title:id==='landlord'?'집주인':'수리 기사',sentences:contact.sentences.filter(s=>s.trim())})
  }
  return result
}
export function initialDraft(recipient:Recipient):MessageDraft {
  const catalog=recipient.sentences.map((original,i)=>({id:`${recipient.id}:block:${i}`,order:i,original}))
  return {catalog,sentences:catalog.map(b=>({id:b.id,blockId:b.id,order:b.order,text:b.original,direct:false})),nextId:0}
}
/** Selection changes operate only on block IDs. Re-selection always uses the original. */
export function applySentences(draft:MessageDraft,next:number[],_sentences:readonly string[]):MessageDraft {
  const ids=new Set(next.flatMap(i=>draft.catalog[i]?[draft.catalog[i].id]:[]))
  const sentences=draft.sentences.filter(s=>s.direct||s.blockId!==null&&ids.has(s.blockId)).map(s=>({...s}))
  for(const block of draft.catalog)if(ids.has(block.id)&&!sentences.some(s=>s.blockId===block.id)){
    sentences.push({id:block.id,blockId:block.id,order:block.order,text:block.original,direct:false})
  }
  // Direct sentences retain their original order anchors; only missing source blocks are inserted.
  sentences.sort((a,b)=>a.order-b.order)
  return {...draft,sentences}
}
/** Translate whole-editor paragraph edits into sentence records, preserving existing IDs. */
export function editDraft(draft:MessageDraft,body:string):MessageDraft {
  const previous=messageBody(draft)
  if(body===previous)return draft
  // Editing inside one record keeps the entire replacement (including new lines)
  // attached to that record. A new paragraph inserted at its edge is independent.
  let start=0,end=previous.length,newEnd=body.length
  while(start<end&&start<newEnd&&previous[start]===body[start])start++
  while(end>start&&newEnd>start&&previous[end-1]===body[newEnd-1]){end--;newEnd--}
  let offset=0
  for(const sentence of draft.sentences){
    const limit=offset+sentence.text.length
    const insertion=body.slice(start,newEnd)
    const independent=start===end&&(start===offset||start===limit)&&/\n[ \t]*\n/.test(insertion)
    if(start>=offset&&end<=limit&&!independent){
      const text=sentence.text.slice(0,start-offset)+insertion+sentence.text.slice(end-offset)
      return {...draft,sentences:draft.sentences.map(s=>s.id===sentence.id?{...s,text}:s)}
    }
    offset=limit+2
  }
  const before=draft.sentences,after=body?body.split(/\n[ \t]*\n/):[]
  const n=before.length,m=after.length
  const cost=Array.from({length:n+1},()=>Array<number>(m+1).fill(0))
  for(let i=n;i>=0;i--)for(let j=m;j>=0;j--){
    if(i===n)cost[i][j]=m-j
    else if(j===m)cost[i][j]=n-i
    else cost[i][j]=Math.min((before[i].text===after[j]?0:1)+cost[i+1][j+1],1+cost[i+1][j],1+cost[i][j+1])
  }
  const sentences:MessageSentence[]=[]
  let i=0,j=0,nextId=draft.nextId
  while(i<n||j<m){
    if(i<n&&j<m&&cost[i][j]===(before[i].text===after[j]?0:1)+cost[i+1][j+1]){
      sentences.push({...before[i],text:after[j]});i++;j++
    }else if(i<n&&cost[i][j]===1+cost[i+1][j])i++
    else{
      const left=sentences.at(-1)?.order??((before[i]?.order??0)-1)
      const right=before[i]?.order??(left+1)
      sentences.push({id:`direct:${nextId++}`,blockId:null,order:(left+right)/2,text:after[j++],direct:true})
    }
  }
  return {...draft,sentences,nextId}
}
export async function copyMessage(body:string,write:(text:string)=>Promise<void>):Promise<string> {
  if(!body.trim())return '메시지 내용을 입력한 후 다시 시도해 주세요.'
  try {await write(body);return '메시지를 복사했어요'}
  catch {return '복사하지 못했어요. 다시 시도해 주세요.'}
}



