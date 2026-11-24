import character from '../../solutions/assets/generated-result-w10.png'
import {Children,cloneElement,createContext,createElement,isValidElement,useCallback,useContext,useEffect,useState} from 'react'
import type {ReactNode} from 'react'
import {getSolutionById,solutionCases} from '../../solutions/data'
import type {SolutionView} from '../../solutions/data/types'
import type {GeneratedSolution} from '../../analysis/solution'
import {generatedRecent,readRecent,recentHistoryKey,rememberRecent,restoreGenerated} from './recent-history'
import type {RecentEntry} from './recent-history'
import RecentFrame from './frames/336-31416'

const solvedKey="howhouse.capstone.solved-solutions.v1"
type History={solved:RecentEntry[];markSolved:(data:SolutionView|GeneratedSolution)=>void;entries:RecentEntry[];rememberExisting:(id:string)=>void;rememberGenerated:(data:GeneratedSolution)=>void}
const Context=createContext<History|null>(null)
export function RecentCasesProvider({children}:{children:ReactNode}){
 const [entries,setEntries]=useState(()=>{try{return readRecent(localStorage.getItem(recentHistoryKey))}catch{return []}})
 const [solved,setSolved]=useState(()=>{try{return readRecent(localStorage.getItem(solvedKey),Infinity)}catch{return []}})
 const markSolved=useCallback((data:SolutionView|GeneratedSolution)=>{const entry:RecentEntry|undefined=data.source==='existing'?{source:'existing',id:data.id,viewedAt:Date.now()}:generatedRecent(data);if(entry)setSolved(previous=>[entry,...previous.filter(item=>item.id!==entry.id)])},[])
 useEffect(()=>{try{localStorage.setItem(solvedKey,JSON.stringify(solved))}catch{/* Retain session state if storage is unavailable. */}},[solved])
 const rememberExisting=useCallback((id:string)=>{if(getSolutionById(id))setEntries(previous=>rememberRecent(previous,{source:'existing',id,viewedAt:Date.now()}))},[])
 const rememberGenerated=useCallback((data:GeneratedSolution)=>{const entry=generatedRecent(data);if(entry)setEntries(previous=>rememberRecent(previous,entry))},[])
 useEffect(()=>{try{localStorage.setItem(recentHistoryKey,JSON.stringify(entries))}catch{/* Keep in-memory history when device storage is unavailable. */}},[entries])
 return <Context.Provider value={{solved,markSolved,entries,rememberExisting,rememberGenerated}}>{children}</Context.Provider>
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
function cardCategory(data:SolutionView|GeneratedSolution){
 if('category' in data)return data.category
 const exact=solutionCases.find(item=>item.title.replace(/\s/g,'')===data.title.replace(/\s/g,''))
 if(exact)return exact.category
 const categories:[RegExp,string][]=[[/냉장|냉동/,'냉장고'],[/세탁|탈수/,'세탁기'],[/보일러|난방|온수/,'보일러'],[/변기|욕실|화장실|배수구/,'욕실'],[/수도|수질|싱크대|수전/,'수도'],[/전기|조명|콘센트|전등/,'전기·조명'],[/벌레|해충|모기|개미|바퀴/,'해충'],[/곰팡이/,'곰팡이'],[/창문|창틀|결로/,'창문'],[/천장|벽/,'벽·천장']]
 return categories.find(([pattern])=>pattern.test(data.title))?.[1]??'생활 문제'
}
const template=findCard(RecentFrame())
export function RecentCases({limit=10,horizontal=false,solvedOnly=false,onOpen}:{limit?:number;horizontal?:boolean;solvedOnly?:boolean;onOpen:(data:SolutionView|GeneratedSolution)=>void}){
 const history=useRecentCases();const entries=solvedOnly?history.solved:history.entries
 function card(data:SolutionView|GeneratedSolution):ReactNode{
  function wire(node:ReactNode):ReactNode{
   if(!isValidElement<Props>(node))return node
   const id=String(node.props['data-node-id']??'')
   if(node.type==='img')return <img {...node.props} src={data.photos[0]?.src??character} alt=""/>
   if(id==='441:16417'&&!data.photos[0]?.src)return <div className="cg-recent-character"><img src={character} alt=""/></div>
   const text=typeof node.props.children==='string'?node.props.children.trim():''
   if(node.type==='p'&&text)return cloneElement(node,{},id.endsWith('441:16420')?cardCategory(data):data.title)
   return cloneElement(node,{},Children.map(node.props.children,wire))
  }
  if(!isValidElement<Props>(template))return null
  const content=wire(template)
  if(!isValidElement<Props>(content))return null
  return createElement('button',{...content.props,key:data.id,type:'button','aria-label':data.title,className:(content.props.className??'')+' cg-action cg-recent-card',onClick:()=>onOpen(data)},content.props.children)
 }
 return <div className={horizontal?'cg-recent-cases cg-recent-carousel':'cg-recent-cases'}>{entries.map(recentCaseData).filter((data):data is SolutionView|GeneratedSolution=>!!data).slice(0,solvedOnly?Infinity:limit).map(card)}</div>
}
