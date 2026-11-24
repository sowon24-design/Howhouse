import {useEffect} from 'react'
import {motion, useReducedMotion} from 'motion/react'
import type {B02ViewData} from '../../solutions/B02'

export function AnalysisConfirmCard({data,playEntrance=true,onShown}:{data:B02ViewData;playEntrance?:boolean;onShown?:()=>void}) {
 const reduced=useReducedMotion()
 useEffect(()=>{onShown?.()},[onShown])
 return <div className="cg-result-perspective"><motion.article className="cg-result-card"
  initial={reduced||!playEntrance?false:{opacity:0,y:36,rotateY:-55}} animate={{opacity:1,y:0,rotateY:0}}
  transition={{type:'spring',stiffness:170,damping:20,opacity:{duration:.2}}}>
  <div><h2>{data.title}</h2><p>{data.description}</p></div>
  <span>문제 해결 방법 {data.steps.length}단계 제공</span>
 </motion.article></div>
}
