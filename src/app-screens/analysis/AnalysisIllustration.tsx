import { motion, useReducedMotion } from 'motion/react'
const assets = import.meta.glob('./assets/w10-*', { eager:true, query:'?url', import:'default' }) as Record<string,string>
export function AnalysisIllustration(){const reduced=useReducedMotion();return <div className="hh-analysis-art" aria-hidden="true">
<img src={assets['./assets/w10-base.png']} alt="" />
<div style={{position:'absolute',left:179,top:48.2,width:45,height:42.85}}>
<motion.div style={{ transformOrigin: '0 0', transform: 'var(--motion-layout-transform, translate(0px)) translate(calc(var(--motion-origin-x, 0) * 1%), calc(var(--motion-origin-y, 0) * 1%)) var(--motion-design-transform-inverse, matrix(1, 0, 0, 1, 0, 0)) translate(calc(var(--motion-translate-x, 0) * 1px), calc(var(--motion-translate-y, 0) * 1px)) scale(var(--motion-scale-x, 1), var(--motion-scale-y, 1)) var(--motion-design-transform, matrix(1, 0, 0, 1, 0, 0)) translate(calc(var(--motion-origin-x, 0) * -1%), calc(var(--motion-origin-y, 0) * -1%))' }} initial={reduced ? false : { '--motion-origin-x': 50, '--motion-origin-y': 50, '--motion-scale-x': 0, '--motion-scale-y': 0, '--motion-translate-x': 0, '--motion-translate-y': 10.783936, opacity: 0, }} animate={reduced ? undefined : { '--motion-scale-x': [0, 0, 1, 1], '--motion-scale-y': [0, 0, 1, 1], '--motion-translate-y': [10.783936, 0, 0, -10.637062], opacity: [0, 1, 1, 0], }} transition={{ '--motion-scale-x': { duration: 1.852, times: [0, 0.0061, 0.3415, 1], ease: ["linear", [0.7, -0.4, 0.4, 1.4], "linear"], repeat: Infinity }, '--motion-scale-y': { duration: 1.852, times: [0, 0.0061, 0.3415, 1], ease: ["linear", [0.7, -0.4, 0.4, 1.4], "linear"], repeat: Infinity }, '--motion-translate-y': { duration: 1.852, times: [0, 0.162, 0.801, 1], ease: "linear", repeat: Infinity }, opacity: { duration: 1.852, times: [0, 0.1105, 0.801, 1], ease: [0.5, 0, 0.5, 1], repeat: Infinity }, }}>
<img src={assets['./assets/w10-bubble.svg']} alt="" />
</motion.div>
</div>
<div style={{position:'absolute',left:104,top:116.15,width:53,height:57.17}}>
<motion.div style={{ transformOrigin: '0 0', transform: 'var(--motion-layout-transform, translate(0px)) var(--motion-design-transform-inverse, matrix(1, 0, 0, 1, 0, 0)) translate(calc(var(--motion-translate-x, 0) * 1px), calc(var(--motion-translate-y, 0) * 1px)) var(--motion-design-transform, matrix(1, 0, 0, 1, 0, 0))' }} initial={reduced ? false : { '--motion-translate-x': 0, '--motion-translate-y': 0, }} animate={reduced ? undefined : { '--motion-translate-y': [0, 4, 0, 4, 0], }} transition={{ '--motion-translate-y': { duration: 1.852, times: [0, 0.145, 0.5155, 0.7781, 1], ease: [0.45, 1.45, 0.8, 1], repeat: Infinity }, }}>
<div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden'}}>
<img src={assets['./assets/w10-hand1.png']} alt="" style={{position:'absolute',height:'auto',left:'-73.03%',top:'-81.94%',width:'346.07%'}}/>
</div>
</motion.div>
</div>
<div style={{position:'absolute',left:144,top:95.1,width:48,height:51.8}}>
<motion.div style={{ transformOrigin: '0 0', transform: 'var(--motion-layout-transform, translate(0px)) var(--motion-design-transform-inverse, matrix(1, 0, 0, 1, 0, 0)) translate(calc(var(--motion-translate-x, 0) * 1px), calc(var(--motion-translate-y, 0) * 1px)) var(--motion-design-transform, matrix(1, 0, 0, 1, 0, 0))' }} initial={reduced ? false : { '--motion-translate-x': 0, '--motion-translate-y': 4, }} animate={reduced ? undefined : { '--motion-translate-y': [4, 1, 7, 1, 4, 4], }} transition={{ '--motion-translate-y': { duration: 1.852, times: [0, 0.2367, 0.471, 0.6998, 0.9543, 1], ease: [[0.45, 1.45, 0.8, 1], [0.45, 1.45, 0.8, 1], [0.45, 1.45, 0.8, 1], [0.45, 1.45, 0.8, 1], "linear"], repeat: Infinity }, }}>
<div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden'}}>
<img src={assets['./assets/w10-hand2.png']} alt="" style={{position:'absolute',height:'auto',left:'-172.69%',top:'-68.72%',width:'346.07%'}}/>
</div>
</motion.div>
</div>
<div style={{position:'absolute',left:165.8,top:86.93,width:74.84,height:81.352}}>
<div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden'}}>
<img src={assets['./assets/w10-laptop.png']} alt="" style={{position:'absolute',height:'auto',left:'-28.31%',top:'4.82%',width:'148.19%'}}/>
</div>
</div>
</div>}
