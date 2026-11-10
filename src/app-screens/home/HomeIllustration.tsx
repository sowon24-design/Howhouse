import { motion, useReducedMotion } from 'motion/react'
const assets = import.meta.glob('./assets/w10-*', { eager:true, query:'?url', import:'default' }) as Record<string,string>
export function HomeIllustration(){ const reduced=useReducedMotion(); return <div className="hh-home-art-stage" aria-hidden="true">
<div style={{position:'absolute',left:134.3,top:59.55,width:21.538,height:54.48}}>
<motion.div style={{ transformOrigin: '0 0', transform: 'var(--motion-layout-transform, translate(0px)) var(--motion-design-transform-inverse, matrix(1, 0, 0, 1, 0, 0)) translate(0px, calc(var(--motion-translate-y, 0) * 1px)) var(--motion-design-transform, matrix(1, 0, 0, 1, 0, 0))' }} initial={reduced ? false : { '--motion-translate-y': 0, }} animate={reduced ? undefined : { '--motion-translate-y': [0, 0.621302, 0, -0.621302, 0, 0.621302, 0, -0.621302, 0], }} transition={{ '--motion-translate-y': { duration: 2, times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], ease: "linear", repeat: Infinity }, }}>
<img src={assets['./assets/w10-img2.svg']} alt="" />
</motion.div>
</div>
<div style={{position:'absolute',left:117.83,top:72.22,width:19.638,height:50.045}}>
<motion.div style={{ transformOrigin: '0 0', transform: 'var(--motion-layout-transform, translate(0px)) var(--motion-design-transform-inverse, matrix(1, 0, 0, 1, 0, 0)) translate(0px, calc(var(--motion-translate-y, 0) * 1px)) var(--motion-design-transform, matrix(1, 0, 0, 1, 0, 0))' }} initial={reduced ? false : { '--motion-translate-y': 0, }} animate={reduced ? undefined : { '--motion-translate-y': [0, 0.621302, 0, -0.621302, 0, 0.621302, 0, -0.621302, 0], }} transition={{ '--motion-translate-y': { duration: 2, times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], ease: "linear", repeat: Infinity }, }}>
<img src={assets['./assets/w10-img4.svg']} alt="" />
</motion.div>
</div>
<div style={{position:'absolute',left:72.9,top:3.97,width:114.32,height:110.178}}>
<motion.div style={{ transformOrigin: '0 0', transform: 'var(--motion-layout-transform, translate(0px)) translate(calc(var(--motion-origin-x, 0) * 1%), calc(var(--motion-origin-y, 0) * 1%)) var(--motion-design-transform-inverse, matrix(1, 0, 0, 1, 0, 0)) translate(0px, calc(var(--motion-translate-y, 0) * 1px)) rotate(calc(var(--motion-rotate, 0) * 1rad)) var(--motion-design-transform, matrix(1, 0, 0, 1, 0, 0)) translate(calc(var(--motion-origin-x, 0) * -1%), calc(var(--motion-origin-y, 0) * -1%))' }} initial={reduced ? false : { '--motion-origin-x': 50, '--motion-origin-y': 50, '--motion-rotate': -0.010472, '--motion-translate-y': 0, }} animate={reduced ? undefined : { '--motion-rotate': [-0.010472, 0.010472, -0.010472, 0.010472, -0.010472], '--motion-translate-y': [0, -0.828402, 0, -0.828402, 0, -0.828402, 0, -0.828402, 0], }} transition={{ '--motion-rotate': { duration: 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear", repeat: Infinity }, '--motion-translate-y': { duration: 2, times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], ease: "linear", repeat: Infinity }, }}>
<img src={assets['./assets/w10-img.png']} alt="" />
</motion.div>
</div>
<div style={{position:'absolute',left:62.72,top:63.98,width:61.244,height:52.271}}>
<motion.div style={{ transformOrigin: '0 0', transform: 'var(--motion-layout-transform, translate(0px)) var(--motion-design-transform-inverse, matrix(0.999885, -0.015146, 0.015146, 0.999885, 0, 0)) translate(0px, calc(var(--motion-translate-y, 0) * 1px)) var(--motion-design-transform, matrix(0.999885, 0.015146, -0.015146, 0.999885, 0, 0))' }} initial={reduced ? false : { '--motion-translate-y': 0, }} animate={reduced ? undefined : { '--motion-translate-y': [0, -0.828402, 0, -0.828402, 0, -0.828402, 0, -0.828402, 0], }} transition={{ '--motion-translate-y': { duration: 2, times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], ease: "linear", repeat: Infinity }, }}>
<img src={assets['./assets/w10-body-rendered.png']} alt="" />
</motion.div>
</div>
<div style={{position:'absolute',left:68.76,top:106.28,width:0.633,height:0.633}}>
<motion.div style={{ transformOrigin: '0 0', transform: 'var(--motion-layout-transform, translate(0px)) translate(calc(var(--motion-origin-x, 0) * 1%), calc(var(--motion-origin-y, 0) * 1%)) var(--motion-design-transform-inverse, matrix(1, 0, 0, 1, 0, 0)) translate(calc(var(--motion-translate-x, 0) * 1px), calc(var(--motion-translate-y, 0) * 1px)) rotate(calc(var(--motion-rotate, 0) * 1rad)) var(--motion-design-transform, matrix(1, 0, 0, 1, 0, 0)) translate(calc(var(--motion-origin-x, 0) * -1%), calc(var(--motion-origin-y, 0) * -1%))' }} initial={reduced ? false : { '--motion-origin-x': 50, '--motion-origin-y': 50, '--motion-rotate': 0.034907, '--motion-translate-x': -0.414201, '--motion-translate-y': -1.242604, }} animate={reduced ? undefined : { '--motion-rotate': [0.034907, -0.034907, 0.034907, -0.034907, 0.034907], '--motion-translate-x': [-0.414201, 0, -0.414201, 0, -0.414201], '--motion-translate-y': [-1.242604, 0, -1.242604, 0, -1.242604], }} transition={{ '--motion-rotate': { duration: 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear", repeat: Infinity }, '--motion-translate-x': { duration: 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear", repeat: Infinity }, '--motion-translate-y': { duration: 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear", repeat: Infinity }, }}>
<div style={{position:'absolute',left:-30.75,top:-23.93,width:31.479,height:32.722}}>
<img src={assets['./assets/w10-img3.png']} alt="" />
</div>
<div style={{position:'absolute',left:-42.78,top:-76.51,width:43.905,height:62.544}}>
<img src={assets['./assets/w10-img5.png']} alt="" />
</div>
</motion.div>
</div>
<div style={{position:'absolute',left:85.74,top:95.66,width:38.935,height:40.592}}>
<motion.div style={{ transformOrigin: '0 0', transform: 'var(--motion-layout-transform, translate(0px)) translate(calc(var(--motion-origin-x, 0) * 1%), calc(var(--motion-origin-y, 0) * 1%)) var(--motion-design-transform-inverse, matrix(1, 0, 0, 1, 0, 0)) translate(0px, calc(var(--motion-translate-y, 0) * 1px)) rotate(calc(var(--motion-rotate, 0) * 1rad)) var(--motion-design-transform, matrix(1, 0, 0, 1, 0, 0)) translate(calc(var(--motion-origin-x, 0) * -1%), calc(var(--motion-origin-y, 0) * -1%))' }} initial={reduced ? false : { '--motion-origin-x': 50, '--motion-origin-y': 50, '--motion-rotate': -0.034907, '--motion-translate-y': 0, }} animate={reduced ? undefined : { '--motion-rotate': [-0.034907, 0.034907, -0.034907, 0.034907, -0.034907], '--motion-translate-y': [0, -1.242604, 0, -1.242604, 0], }} transition={{ '--motion-rotate': { duration: 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear", repeat: Infinity }, '--motion-translate-y': { duration: 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear", repeat: Infinity }, }}>
<img src={assets['./assets/w10-img6.png']} alt="" />
</motion.div>
</div>
</div>}
