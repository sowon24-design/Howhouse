import { isGeneratedContent, toGeneratedSolution } from '../../analysis/solution.ts'
import type { GeneratedContent, GeneratedSolution } from '../../analysis/solution'

export type RecentEntry = { source:'existing'; id:string; viewedAt:number } | { source:'generated'; id:string; viewedAt:number; content:GeneratedContent }
export const recentHistoryKey = 'howhouse.capstone.recent-solutions.v1'
export function rememberRecent(entries:readonly RecentEntry[], entry:RecentEntry):RecentEntry[] {
  return [entry,...entries.filter(item=>item.id!==entry.id)].slice(0,10)
}
export function generatedRecent(data:GeneratedSolution, viewedAt=Date.now()):RecentEntry|undefined {
  const content={title:data.title,description:data.description,duration:data.duration,responsibility:data.responsibility,reference:data.reference,supplies:data.supplies,
    steps:data.steps.map(({title,description})=>({title,description})),contacts:{landlord:data.contacts.landlord.sentences,company:data.contacts.company.sentences}}
  return data.id.startsWith('generated:')&&isGeneratedContent(content)?{source:'generated',id:data.id,viewedAt,content}:undefined
}
export function restoreGenerated(entry:Extract<RecentEntry,{source:'generated'}>):GeneratedSolution {
  return toGeneratedSolution(entry.content,entry.id.slice('generated:'.length))
}
export function readRecent(raw:string|null,limit=10):RecentEntry[] {
  try {
    const values:unknown=JSON.parse(raw??'[]');if(!Array.isArray(values))return []
    const result:RecentEntry[]=[]
    for(const item of values){if(!item||typeof item!=='object'||typeof item.id!=='string'||!Number.isFinite(item.viewedAt)||result.some(e=>e.id===item.id))continue
      if(item.source==='existing'&&!item.id.startsWith('generated:'))result.push({source:'existing',id:item.id,viewedAt:item.viewedAt})
      else if(item.source==='generated'&&item.id.startsWith('generated:')&&isGeneratedContent(item.content))result.push({source:'generated',id:item.id,viewedAt:item.viewedAt,content:item.content})
      if(result.length===limit)break
    }return result
  }catch{return []}
}
