import { motion, useReducedMotion } from 'motion/react'
import bowl from '../assets/microinteraction/toilet-body.png'
import plunger from '../assets/microinteraction/toilet-plunger.png'

/** Figma 1378:10116, coordinated 2.4s loop; native 157 x 200 transparent layers. */
export function BathroomIllustration() {
  const reduced = useReducedMotion()
  return <div className="yw-bathroom" aria-hidden="true">
    <motion.div className="yw-bathroom__layer" data-node-id="1378:10745" style={{transformOrigin:'50% 50%'}}
      initial={reduced ? false : {rotate:0,y:0}} animate={reduced ? undefined : {rotate:[0,0,-.6,.35,-.18,0,0,.45,-.28,.12,0,0], y:[0,0,.65,-.2,.1,0,0,.45,-.12,.06,0,0]}}
      transition={{rotate:{duration:2.4,times:[0,.1542,.1917,.2333,.2875,.375,.6167,.6583,.7,.75,.8417,1],ease:'easeInOut',repeat:Infinity},y:{duration:2.4,times:[0,.1542,.1917,.2375,.3042,.3833,.6167,.6583,.7125,.7792,.8542,1],ease:'easeInOut',repeat:Infinity}}}><img src={bowl} alt=""/></motion.div>
    <motion.div className="yw-bathroom__layer" data-node-id="1378:10757" style={{transformOrigin:'50% 50%'}}
      initial={reduced ? false : {y:0}} animate={reduced ? undefined : {y:[0,-.3,3.8,3.3,-.45,0,2.6,2.2,-.25,0]}}
      transition={{duration:2.4,times:[0,.075,.1917,.2583,.4292,.5208,.6583,.7167,.8667,1],ease:[[.333,0,.667,1],[.333,0,.667,1],[.333,0,.667,.467],[.333,.182,.667,1],[.333,0,.667,.772],[.333,.059,.667,1],[.333,0,.667,.533],[.333,.196,.667,1],[.333,0,.667,1]],repeat:Infinity}}><img src={plunger} alt=""/></motion.div>
  </div>
}
