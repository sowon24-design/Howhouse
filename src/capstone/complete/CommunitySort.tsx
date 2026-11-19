import {Children,cloneElement,isValidElement} from 'react'
import type {ReactNode} from 'react'
export function CommunitySort({className,children,value,onChange}:{className?:string;children:ReactNode;value:'popular'|'recommended';onChange:(value:'popular'|'recommended')=>void}){
 return <label className={(className??'')+' cg-sort'}>
  {Children.map(children,child=>isValidElement<{children?:ReactNode}>(child)&&child.type==='p'?cloneElement(child,{},value==='popular'?'인기 순':'추천 순'):child)}
  <select aria-label="게시글 정렬" value={value} onChange={event=>onChange(event.target.value as 'popular'|'recommended')}><option value="popular">인기 순</option><option value="recommended">추천 순</option></select>
 </label>
}
