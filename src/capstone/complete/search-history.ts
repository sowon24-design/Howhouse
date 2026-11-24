import {useEffect,useState} from 'react'

/** Keep the two search histories separate and persistent on this browser. */
export function useSearchHistory(scope:'community'|'cases'){
 const key='howhouse.capstone.search-history.'+scope+'.v1'
 const [history,setHistory]=useState<string[]>(()=>{
  try{
   const saved:unknown=JSON.parse(localStorage.getItem(key)??'[]')
   return Array.isArray(saved)?[...new Set(saved.filter((item):item is string=>typeof item==='string').map(item=>item.trim().slice(0,60)).filter(Boolean))].slice(0,5):[]
  }catch{return []}
 })
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(history))}catch{/* Keep this session usable when storage is unavailable. */}},[key,history])
 return [history,setHistory] as const
}
