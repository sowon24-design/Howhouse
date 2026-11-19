import { Children, Fragment, cloneElement, createElement, isValidElement, useEffect, useRef, useState } from 'react'
import type { ReactNode, ReactElement, ComponentType } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from '../../components/ui/Button'
import { lockModalScroll } from '../../components/ui/modalScrollLock'
import { screens } from './screens'
import type { ScreenId } from './screens'
import classMap from './class-map.json'
import './figma.css'
import './scene.css'

type Props = Record<string, unknown> & {children?:ReactNode;className?:string;style?:Record<string,unknown>}
export type NodeInfo = { id:string;name:string;text:string;props:Props;type:unknown;parents:{name:string;text:string;id:string}[];index:number }
export type SceneAdapter = {replace?:(info:NodeInfo)=>ReactNode|undefined;action?:(info:NodeInfo)=>(()=>void)|undefined;decorate?:(info:NodeInfo)=>Record<string,unknown>|undefined;append?:(info:NodeInfo)=>ReactNode}
export const css = (token:string)=>(classMap as Record<string,string>)[token]??''
export function textOf(node:ReactNode):string{
 if(typeof node==='string'||typeof node==='number')return String(node)
 if(!isValidElement(node))return Array.isArray(node)?node.map(textOf).join(' ').replace(/\s+/g,' ').trim():''
 if(typeof node.type==='function'){try{return textOf((node.type as (p:unknown)=>ReactNode)(node.props))}catch{return ''}}
 return textOf((node.props as Props).children)
}
const cache = new Map<ScreenId,ComponentType>()
export function Scene({id,adapter,onBack}:{id:ScreenId;adapter:SceneAdapter;onBack:()=>void}){
 const [Frame,setFrame]=useState<ComponentType|null>(()=>cache.get(id)??null)
 const root=useRef<HTMLDivElement>(null),reduced=useReducedMotion()
 const drag=useRef<{y:number;delta:number;dialog:HTMLDialogElement}|null>(null)
 useEffect(()=>{let alive=true;void screens[id].load().then(module=>{cache.set(id,module.default);if(alive)setFrame(()=>module.default)});return()=>{alive=false}},[id])
 useEffect(()=>{
  const overlay=root.current?.querySelector<HTMLDialogElement>('[data-cg-overlay]');if(!overlay)return
  const restore=lockModalScroll(overlay);const previous=document.activeElement as HTMLElement|null
  const first=overlay.querySelector<HTMLElement>('button,input,textarea,[tabindex="0"]');first?.focus({preventScroll:true})
  return()=>{restore();if(previous?.isConnected)previous.focus({preventScroll:true})}
 },[id,Frame])
 if(!Frame)return null
 let navIndex=0,hasModal=false
 function walk(node:ReactNode,parents:NodeInfo['parents']=[],index=0):ReactNode{
  if(!isValidElement(node))return node
  const element=node as ReactElement<Props>,p=element.props
  if(typeof element.type==='function')return walk((element.type as (props:Props)=>ReactNode)(p),parents,index)
  const name=String(p['data-name']??''),nodeId=String(p['data-node-id']??p['data-motion-for']??'')
  // Native Android provides these system surfaces; never duplicate them on the web.
  if(name==='상단바'||name==='Keyboard'||name==='status bar')return null
  const info:NodeInfo={id:nodeId,name,text:textOf(p.children).replace(/\s+/g,' ').trim(),props:p,type:element.type,parents,index}
  if(!parents.length)hasModal=Children.toArray(p.children).some(child=>isValidElement(child)&&['Overlay','신고하기'].includes(String((child.props as Props)['data-name'])))
  const replacement=adapter.replace?.(info);if(replacement!==undefined)return replacement
  const next=[...parents,{name,text:info.text,id:nodeId}]
  const children=Children.toArray(p.children).map((child,i)=><Fragment key={isValidElement(child)?child.key??i:i}>{walk(child,next,i)}</Fragment>)
  const appended=adapter.append?.(info);if(appended)children.push(<Fragment key="dynamic-append">{appended}</Fragment>)
  const extras:Record<string,unknown>={...adapter.decorate?.(info)}
  // The absolute solution hero includes Figma's 48px simulated status bar.
  // Crop that same origin when the native status bar replaces the simulated one.
  if(parents.length===1&&p.className?.split(' ').includes(css('h-[220px]'))&&p.className?.split(' ').includes(css('top-0')))extras.style={...p.style,...extras.style as object,top:-48}
  if(hasModal&&parents.length===1&&!['Overlay','신고하기','Modal scrim'].includes(name)&&!p.className?.split(' ').includes(css('bg-[rgba(0,0,0,0.25)]'))){extras.inert=true;extras['aria-hidden']=true}
  if(!parents.length){extras.className=(p.className??'')+' cg-frame';extras['data-screen-id']=id}
  if(name==='Navigation Bar'&&parents.length===1)extras.className=(p.className??'')+' cg-bottom-nav'
  const navItem=parents.at(-1)?.name==='Navigation Bar'&&['홈','커뮤니티','해결 방법','마이'].includes(name)
  if(navItem)extras['data-nav-index']=navIndex++
  let action=adapter.action?.(info)
  if(navItem){const index=Number(extras['data-nav-index'])%4;extras['aria-label']=['홈','해결책','커뮤니티','마이'][index];action=()=>{window.location.hash=['home','categories','community','my'][index]}}
  if(name==='Modal scrim'||(String(p.className).split(' ').includes(css('bg-[rgba(0,0,0,0.25)]'))&&!p.children)){action=onBack;extras.className=(p.className??'')+' cg-scrim'}
  if(p.className?.split(' ').includes(css('h-[5px]'))&&p.className?.split(' ').includes(css('w-[80px]'))){
   extras.className=(p.className??'')+' cg-sheet-handle'
   extras.onPointerDown=(event:React.PointerEvent<HTMLElement>)=>{const dialog=event.currentTarget.closest('dialog');if(dialog){drag.current={y:event.clientY,delta:0,dialog};event.currentTarget.setPointerCapture(event.pointerId)}}
   extras.onPointerMove=(event:React.PointerEvent)=>{if(drag.current){drag.current.delta=Math.max(0,event.clientY-drag.current.y);drag.current.dialog.style.transform=`translateY(${drag.current.delta}px)`}}
   extras.onPointerUp=()=>{const current=drag.current;drag.current=null;if(current){current.dialog.style.transform='';if(current.delta>80)onBack()}}
   extras.onPointerCancel=()=>{if(drag.current)drag.current.dialog.style.transform='';drag.current=null}
  }
  if(name==='Overlay'||name==='신고하기'){
   extras['data-cg-overlay']=true;extras['data-cg-sheet']=p.className?.split(' ').includes(css('bottom-0'));extras.open=true;extras.role='dialog';extras['aria-modal']=true;extras['aria-label']=info.text.slice(0,80)
   extras.className=(p.className??'')+' cg-overlay'
   const sheet=!!extras['data-cg-sheet']
   return createElement(motion.dialog,{...p,...extras,key:nodeId,initial:reduced?false:sheet?{y:'100%'}:{opacity:0},animate:sheet?{y:0}:{opacity:1},transition:{duration:sheet?.32:.1,ease:[.4,0,.2,1]},onCancel:(event:React.SyntheticEvent)=>{event.preventDefault();onBack()},onKeyDown:(event:React.KeyboardEvent)=>{
    if(event.key==='Escape'){event.preventDefault();onBack()}
    if(event.key==='Tab'){const items=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input,textarea,[tabindex="0"]'));const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}
   }},children)
  }
  if(action){
   const buttonProps={...p,...extras,type:'button' as const,onClick:(event:React.MouseEvent)=>{event.stopPropagation();action?.()},'aria-label':String(extras['aria-label']??(info.text||name||'뒤로')),className:(extras.className??p.className??'')+' cg-action'}
   if(name==='Button')return <Button key={nodeId} {...buttonProps as React.ComponentProps<typeof Button>}>{children}</Button>
   return createElement('button',buttonProps,children)
  }
  return cloneElement(element,{...extras,key:nodeId||index},...children)
 }
 return <div ref={root} className="cg-scene" key={id}>{walk(createElement(Frame))}</div>
}
