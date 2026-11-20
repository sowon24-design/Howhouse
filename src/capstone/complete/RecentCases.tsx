import {Children,cloneElement,createContext,createElement,isValidElement,useCallback,useContext,useEffect,useState} from 'react'
import type {ReactNode} from 'react'
import {getSolutionById} from '../../solutions/data'
import type {SolutionView} from '../../solutions/data/types'
import type {GeneratedSolution} from '../../analysis/solution'
import {generatedRecent,readRecent,recentHistoryKey,rememberRecent,restoreGenerated} from './recent-history'
import type {RecentEntry} from './recent-history'
import RecentFrame from './frames/336-31416'

type History={entries:RecentEntry[];rememberExisting:(id:string)=>void;rememberGenerated:(data:GeneratedSolution)=>void}
const Context=createContext<History|null>(null)
export function RecentCasesProvider({children}:{children:ReactNode}){
 const [entries,setEntries]=useState(()=>{try{return readRecent(localStorage.getItem(recentHistoryKey))}catch{return []}})
 const rememberExisting=useCallback((id:string)=>{if(getSolutionById(id))setEntries(previous=>rememberRecent(previous,{source:'existing',id,viewedAt:Date.now()}))},[])
 const rememberGenerated=useCallback((data:GeneratedSolution)=>{const entry=generatedRecent(data);if(entry)setEntries(previous=>rememberRecent(previous,entry))},[])
 useEffect(()=>{try{localStorage.setItem(recentHistoryKey,JSON.stringify(entries))}catch{/* Keep in-memory history when device storage is unavailable. */}},[entries])
 return <Context.Provider value={{entries,rememberExisting,rememberGenerated}}>{children}</Context.Provider>
}
export function useRecentCases(){const value=useContext(Context);if(!value)throw Error('RecentCasesProvider required');return value}
export function recentCaseData(entry:RecentEntry){return entry.source==='existing'?getSolutionById(entry.id):restoreGenerated(entry)}
type Props={children?:ReactNode;className?:string;'data-name'?:string;'data-node-id'?:string;[key:string]:unknown}
function findCard(node:ReactNode):ReactNode{
 if(!isValidElement<Props>(node))return null
 if(typeof node.type==='function')return findCard((node.type as (p:Props)=>ReactNode)(node.props))
 if(node.props['data-name']==='썸네일')return node
 return Children.toArray(node.props.children).map(findCard).find(Boolean)??null
}
const template=findCard(RecentFrame())
export function RecentCases({limit=10,onOpen}:{limit?:number;onOpen:(data:SolutionView|GeneratedSolution)=>void}){
 const {entries}=useRecentCases()
 function card(data:SolutionView|GeneratedSolution):ReactNode{
  function wire(node:ReactNode):ReactNode{
   if(!isValidElement<Props>(node))return node
   const id=String(node.props['data-node-id']??'')
   if(node.type==='img')return data.photos[0]?.src?<img {...node.props} src={data.photos[0].src} alt=""/>:null
   const text=typeof node.props.children==='string'?node.props.children.trim():''
   if(node.type==='p'&&text)return cloneElement(node,{},id.endsWith('441:16420')?('category' in data?data.category:'AI 생성'):data.title)
   return cloneElement(node,{},Children.map(node.props.children,wire))
  }
  if(!isValidElement<Props>(template))return null
  const content=wire(template)
  if(!isValidElement<Props>(content))return null
  return createElement('button',{...content.props,key:data.id,type:'button','aria-label':data.title,className:(content.props.className??'')+' cg-action cg-recent-card',onClick:()=>onOpen(data)},content.props.children)
 }
 return <div className="cg-recent-cases">{entries.map(recentCaseData).filter((data):data is SolutionView|GeneratedSolution=>!!data).slice(0,limit).map(card)}</div>
}
