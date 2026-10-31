import { motion, useReducedMotion } from 'motion/react'

const assets = import.meta.glob('./assets/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const src = (name: string) => assets[`./assets/${name}.svg`]
// Coordinates from Figma 484:7717. Static SVGs retain their exported dimensions.
const parts: [string, number, number][] = [
  ['shell', 0, 0], ['v0', 100.55, 47.7], ['v1', 69.03, 41.12], ['v2', 109.27, 37.14],
]
const foreground: [string, number, number][] = [
  ['v5',112.07,66.96], ['v6',33.08,103.18], ['v7',117.5,78.96], ['v8',25.48,59.24], ['v9',125.14,95.78], ['v10',150.24,106.58],
]
const ease = [0.5,0,0.5,1] as const
const eyeTiming = { duration: 2, times: [0,.4177,.5278,.7082,1], ease: 'linear' as const, repeat: Infinity }
export function AnalysisIllustration() {
  const reduced = useReducedMotion()
  const still = (name: string, x: number, y: number) => <img key={name} src={src(name)} alt="" style={{ position:'absolute', left:x, top:y }} />
  return <div className="hh-analysis-art" aria-hidden="true">
    {parts.map(([name,x,y]) => still(name,x,y))}
    <motion.div style={{ position:'absolute',left:111.88,top:55.15 }} initial={{x:0,y:0}} animate={reduced ? undefined : {x:[0,0,1.624,0,0],y:[0,0,.673,0,0]}} transition={{x:eyeTiming,y:eyeTiming}}><img src={src('eye1')} alt="" /></motion.div>
    <motion.div style={{ position:'absolute',left:136.85,top:53.72 }} initial={{x:0,y:0}} animate={reduced ? undefined : {x:[0,0,1.952,0,0],y:[0,0,.791,0,0]}} transition={{x:eyeTiming,y:eyeTiming}}><img src={src('eye2')} alt="" /></motion.div>
    {foreground.map(([name,x,y]) => still(name,x,y))}
    <motion.div className="hh-analysis-rotator" style={{left:129.79,top:72.44,width:51.739,height:50.374}} initial={{rotate:0}} animate={reduced ? undefined : {rotate:[0,14,0,10,0,0]}} transition={{rotate:{duration:2,times:[0,.25,.3957,.5818,.8,1],ease:[ease,ease,ease,ease,'linear'],repeat:Infinity}}}>
      <div style={{transform:'rotate(-11.812deg)'}}><img src={src('arm1')} alt="" /></div>
    </motion.div>
    {still('foot1',26.76,107.41)}{still('foot2',11.67,105.78)}
    {still('pot',243.3,104.69)}{still('plant',242.69,74.39)}{still('laptop',118.09,66.87)}
    <motion.div className="hh-analysis-rotator" style={{left:46.05,top:57.99,width:91.206,height:82.491}} initial={{rotate:0}} animate={reduced ? undefined : {rotate:[0,20,4,15,0,7,0,0]}} transition={{rotate:{duration:2,times:[0,.15,.35,.5,.65,.75,.95,1],ease:[ease,ease,ease,ease,ease,ease,'linear'],repeat:Infinity}}}>
      <div style={{transform:'rotate(-13.641deg)'}}><img src={src('arm2')} alt="" /></div>
    </motion.div>
    <motion.div style={{position:'absolute',left:162.92,top:27.57}} initial={reduced ? {scaleX:1,scaleY:1,y:0} : {scaleX:0,scaleY:0,y:16.263}}
      animate={reduced ? undefined : {scaleX:[0,1,.957,0],scaleY:[0,1,.957,0],y:[16.263,0,0]}}
      transition={{scaleX:{duration:2,times:[0,.3,.75,1],ease:[[.7,-.4,.4,1.4],ease,[.7,-.4,.4,1.4]],repeat:Infinity},scaleY:{duration:2,times:[0,.3,.75,1],ease:[[.7,-.4,.4,1.4],ease,[.7,-.4,.4,1.4]],repeat:Infinity},y:{duration:2,times:[0,.5,1],ease:['easeInOut','linear'],repeat:Infinity}}}><img src={src('bubble')} alt="" /></motion.div>
  </div>
}
