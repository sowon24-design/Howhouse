import { Children, cloneElement, createElement, isValidElement } from 'react'
import type { ReactNode } from 'react'
import MyFrame from './frames/336-30827'
type Props={children?:ReactNode;className?:string;'data-node-id'?:string;'data-name'?:string;[key:string]:unknown}
const routes:Record<string,string>={'로그아웃':'336:31894','회원 탈퇴':'336:32026','내가 작성한 글':'336:31289','댓글 단 글':'336:31329','내가 해결한 문제':'336:31369'}
function textOf(node:ReactNode):string{if(typeof node==='string')return node.trim();if(!isValidElement<Props>(node))return '';return Children.toArray(node.props.children).map(textOf).join(' ').trim()}
export function PrototypeMyAdditions(){
 function pick(node:ReactNode):ReactNode[]{if(!isValidElement<Props>(node))return [];if(['336:30900','336:30945'].includes(node.props['data-node-id']??''))return [node];return Children.toArray(node.props.children).flatMap(pick)}
 function wire(node:ReactNode):ReactNode{if(!isValidElement<Props>(node))return node;const text=textOf(node);if(text==='비밀번호 변경')return null;if(routes[text])return createElement('button',{...node.props,type:'button',className:node.props.className+' cg-action',onClick:()=>{location.hash='screen/'+routes[text]}},node.props.children);return cloneElement(node,{},Children.map(node.props.children,wire))}
 return <div className="cg-prototype-my cg-frame">{pick(MyFrame()).map((node,index)=><div key={index}>{wire(node)}</div>)}</div>
}
