import { Children, cloneElement, isValidElement } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import HomeFrame from './frames/336-27446'
import MyFrame from './frames/336-30827'
import CategoryFrame from './frames/336-27506'
import CommunityFrame from './frames/336-28651'
const destinations=['home','categories','community','my'] as const
const labels=['홈','해결책','커뮤니티','마이']
type Props={children?:ReactNode;className?:string;'data-name'?:string;[key:string]:unknown}
function nav(frame:ReactNode):ReactNode {
 if(!isValidElement<Props>(frame))return null
 return Children.toArray(frame.props.children).find(child=>isValidElement<Props>(child)&&child.props['data-name']==='Navigation Bar')
}
const frames=[HomeFrame,CategoryFrame,CommunityFrame,MyFrame]
function items(node:ReactNode):ReactNode[]{
 if(!isValidElement<Props>(node))return []
 const children=Children.toArray(node.props.children)
 const found=children.filter(child=>isValidElement<Props>(child)&&['홈','해결 방법','해결책','커뮤니티','마이'].includes(String(child.props['data-name'])))
 return found.length===4?found:children.flatMap(items)
}
export function BottomNavigation({selected}:{selected:typeof destinations[number]}) {
 const reduce=useReducedMotion(),index=destinations.indexOf(selected)
 const original=nav(HomeFrame())
 const selectedItems=items(nav(frames[index]()))
 if(!isValidElement<Props>(original))return null
 const write=Children.toArray((CommunityFrame() as React.ReactElement<Props>).props.children).find(child=>isValidElement<Props>(child)&&child.props['data-node-id']==='336:28711')
 const spring=reduce?{duration:0}:{type:'spring' as const,stiffness:340,damping:28}
 function wire(node:ReactNode):ReactNode {
  if(!isValidElement<Props>(node))return node
  const children=Children.toArray(node.props.children)
  if(children.filter(child=>isValidElement<Props>(child)&&['홈','해결 방법','커뮤니티','마이'].includes(String(child.props['data-name']))).length===4){
   return cloneElement(node,{},children.filter(child=>!isValidElement<Props>(child)||!['홈','해결 방법','커뮤니티','마이'].includes(String(child.props['data-name']))),destinations.map((dest,i)=>{
    const source=selectedItems[i]
    if(!isValidElement<Props>(source))return null
    const icon=Children.toArray(source.props.children)[0]
    return <motion.button key={dest} layout transition={spring} type="button" className="cg-motion-tab" aria-label={labels[i]} aria-current={selected===dest?'page':undefined} onClick={()=>{location.hash=dest}} style={{flex:i===index?'1 1 0':'0 0 56px'}}>
     {i===index&&<motion.span layoutId="capstone-nav-highlight" className="cg-motion-highlight" transition={spring}/>}
     <motion.span className="cg-motion-icon" style={{width:i===2&&i!==index?24:28,height:i===2&&i!==index?24:28}} key={dest+String(i===index)} initial={reduce?false:{scale:i===index?.72:1}} animate={{scale:1}} transition={{type:'spring',stiffness:520,damping:14}}>{icon}</motion.span>
     <motion.span className="cg-motion-label" style={{flex:i===index?1:undefined,textAlign:'center'}} initial={false} animate={{width:i===index?'auto':0,opacity:i===index?1:0,marginLeft:i===index?8:0}} transition={reduce?{duration:0}:{type:'spring',stiffness:300,damping:26}}>{labels[i]}</motion.span>
    </motion.button>
   }))
  }
  if(node.props.children===undefined)return node
  return cloneElement(node,{},Children.map(node.props.children,wire))
 }
 return <><AnimatePresence>{selected==='community'&&isValidElement<Props>(write)&&<motion.div key="community-write" className="cg-frame cg-write-floating" initial={reduce?false:{opacity:0,y:24,scale:.78}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:16,scale:.88,transition:{duration:reduce?0:.18,ease:'easeIn'}}} transition={reduce?{duration:0}:{type:'spring',stiffness:360,damping:18,opacity:{duration:.15}}}><button {...write.props} type="button" className={write.props.className+' cg-action'} aria-label="글쓰기" onClick={()=>{location.hash='screen/336:30472'}} style={{position:'relative',bottom:0,right:0}}>{write.props.children}</button></motion.div>}</AnimatePresence><nav className="cg-main-navigation cg-frame cg-animated-navigation" aria-label="하단 메뉴">{wire(cloneElement(original,{className:original.props.className+' cg-global-nav'}))}</nav></>
}
