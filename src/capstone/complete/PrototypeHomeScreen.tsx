import {captureProblemMorph} from './problem-morph'
import {Children,cloneElement,isValidElement,createElement} from 'react'
import type {ReactNode} from 'react'
import {HomeScreen,type HomeScreenProps} from '../../app-screens/home/HomeScreen'
import logo from './assets/home-logo-primary.svg'
import HomeFrame from './frames/336-27446'
import {CommunityCard} from './CommunityCard'
import {findPosts} from './model'
import {useCommunityStore} from './CommunityStore'
type Props={children?:ReactNode;className?:string;'data-node-id'?:string;'data-name'?:string;[key:string]:unknown}

function HomeStories(){
 const {posts}=useCommunityStore(),items=findPosts(posts,'','전체','popular').slice(0,3)
 function find(node:ReactNode):ReactNode{if(!isValidElement<Props>(node))return null;if(node.props['data-node-id']==='336:27498')return node;return Children.toArray(node.props.children).map(find).find(Boolean)??null}
 function wire(node:ReactNode):ReactNode{
  if(!isValidElement<Props>(node))return node
  if(node.props['data-name']==='Related / Solid list')return <div className={node.props.className}>{items.map(post=><CommunityCard key={post.id} post={post} onOpen={()=>{location.hash='community-post/'+encodeURIComponent(post.id)}}/>)}</div>
  if(node.props['data-node-id']==='336:27501')return createElement('button',{...node.props,type:'button',className:node.props.className+' cg-action',onClick:()=>{location.hash='community'}},node.props.children)
  return cloneElement(node,{},Children.map(node.props.children,wire))
 }
 return <section className="cg-home-stories cg-frame" aria-label="다른 자취생들이 많이 본 이야기">{wire(find(HomeFrame()))}</section>
}
/** Keep all main home content; append only the owner-requested Figma section. */
export function PrototypeHomeScreen(props:HomeScreenProps){
 const home=HomeScreen({...props,onStartProblem:()=>{const banner=document.querySelector<HTMLElement>('.hh-home-banner');if(banner)captureProblemMorph(banner);location.hash='screen/1042:10739'}})
 function adapt(node:ReactNode):ReactNode {
  if(!isValidElement<Props>(node))return node
  if(node.type==='img'&&node.props.alt==='어쩌집')return cloneElement(node,{src:logo})
  if(node.props.children===undefined)return node
  const children=Children.map(node.props.children,adapt)
  return cloneElement(node,{},children,node.props.className==='hh-home-content'?<HomeStories key="community-stories"/>:null)
 }
 return adapt(home)
}
