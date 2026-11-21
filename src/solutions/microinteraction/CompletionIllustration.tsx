import { motion, useReducedMotion } from 'motion/react'
import body from '../assets/microinteraction/crab-body.png'
import frontHand from '../assets/microinteraction/crab-front-hand.png'
import file from '../assets/microinteraction/crab-file.png'
import rightHand from '../assets/microinteraction/crab-right-hand.svg'

/** Shared original Figma parts and exact 3.2s tracks for B02-1 and B02-3. */
export function CompletionIllustration({ active = true }: { active?: boolean }) {
  const reduced = useReducedMotion() || !active
  return <div className="yw-completion-art" aria-hidden="true">
    <img className="yw-completion-art__body" src={body} alt=""/>
    <div className="yw-completion-art__left">
      <motion.div style={{ transformOrigin: '50% 50%' }} transformTemplate={(_, generated) => `var(--motion-layout-transform, translate(0px)) ${generated === 'none' ? '' : generated}`} initial={false} animate={reduced ? undefined : { rotate: [0, -1, 2.1, -3.3, 2.3, -1.6, 0.8, -0.3, 0], }} transition={{ duration: 3.2, times: [0, 0.0625, 0.2188, 0.35, 0.4844, 0.6125, 0.7438, 0.875, 1], ease: [0.333, 0, 0.667, 1], repeat: Infinity, }} ><img className="yw-completion-art__front" src={frontHand} alt=""/></motion.div>
    </div>
    <div className="yw-completion-art__right">
      <motion.div style={{ transformOrigin: '50% 50%' }} transformTemplate={(_, generated) => `var(--motion-layout-transform, translate(0px)) ${generated === 'none' ? '' : generated}`} initial={false} animate={reduced ? undefined : { rotate: [0, 1, -4.2, 2.8, -2, 1.4, -0.75, 0.25, 0], y: [0, 0.576, -5.762, -5.186, -3.745, -0.576, 0], }} transition={{ rotate: { duration: 3.2, times: [0, 0.0625, 0.1938, 0.325, 0.4469, 0.575, 0.7031, 0.85, 1], ease: [0.333, 0, 0.667, 1], repeat: Infinity }, y: { duration: 3.2, times: [0, 0.0625, 0.2, 0.4531, 0.6875, 0.8688, 1], ease: [[0.333, 0, 0.667, 1], [0.333, 0, 0.667, 1], [0.333, 0, 0.667, 0.595], [0.333, 0.15, 0.667, 0.55], [0.333, 0.158, 0.667, 0.824], [0.333, 0.7, 0.667, 1]], repeat: Infinity }, }} >
        <div className="yw-completion-art__file-pivot">
          <motion.div style={{ transformOrigin: '50% 50%' }} transformTemplate={(_, generated) => `var(--motion-layout-transform, translate(0px)) ${generated === 'none' ? '' : generated}`} initial={false} animate={reduced ? undefined : { rotate: [0, 0.5, -3.2, 2.5, -1.7, 1.1, -0.55, 0.2, 0], }} transition={{ duration: 3.2, times: [0, 0.0875, 0.2281, 0.3594, 0.4844, 0.6094, 0.7375, 0.875, 1], ease: [0.333, 0, 0.667, 1], repeat: Infinity, }} ><img className="yw-completion-art__file" src={file} alt=""/></motion.div>
        </div>
        <img className="yw-completion-art__hand" src={rightHand} alt=""/>
      </motion.div>
    </div>
  </div>
}
