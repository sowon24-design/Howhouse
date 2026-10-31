import { screenSlidesEnabled } from '../navigation-motion'
import { useAndroidBack } from '../android-back'
import { useRef, useState } from 'react'
import { motion, useReducedMotion, useIsPresent } from 'motion/react'
import { B01 } from '../../solutions/B01'
import { B02 } from '../../solutions/B02'
import { B03 } from '../../solutions/B03'
import { getCategoryCases, getSolutionById, solutionCases, type CategoryId } from '../../solutions/data'
import { toMessageRecipients } from '../../solutions/message-model'
import type { HomeCategoryKey } from '../home/HomeScreen'
import './solutions-flow.css'

export const categoryForHome: Record<HomeCategoryKey, CategoryId> = {
  boiler: '보일러', bathroom: '화장실', refrigerator: '냉장고', water: '수도·수질',
  electricity: '전기·조명', washer: '세탁기', pests: '해충', mold: '곰팡이',
}

export function SolutionsFlow({ category, onHome, onWriteProblem, initialCaseId, active = true }: {
  active?: boolean;
  category: CategoryId; initialCaseId?: string; onHome: () => void; onWriteProblem: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(initialCaseId ?? null)
  const [depth, setDepth] = useState(initialCaseId ? 1 : 0)
  const [contactVisited, setContactVisited] = useState(false)
  const [notice, setNotice] = useState('사례 사진은 임시 공통 이미지입니다. 의견 저장·실제 분석은 연결하지 않았습니다.')
  const skipExit = useRef(false)
  const present = useIsPresent()
  const prefersReduced = useReducedMotion()
  const reduced = !screenSlidesEnabled || prefersReduced
  const transition = {duration: reduced ? 0 : .32, ease: [.4, 0, .2, 1] as const}
  const data = selectedId ? getSolutionById(selectedId) : undefined
  const items = getCategoryCases(solutionCases, category).map(c => ({key: c.id, label: c.symptom}))
  useAndroidBack(() => {
    if (depth === 2) setDepth(1)
    else if (depth === 1 && !initialCaseId) setDepth(0)
    else onHome()
  }, active && present)
  return <motion.div inert={!present} aria-hidden={!present} className="hh-home-preview" initial={{x: reduced ? 0 : '100%'}} animate={{x: 0}} exit={{x: reduced || skipExit.current ? 0 : '100%', transition: skipExit.current ? {duration:0} : transition}} transition={transition}>
    <div className="hh-home-preview-frame hh-solutions-frame">
      <div className="hh-solutions-layer" inert={depth !== 0} aria-hidden={depth !== 0}>
        <B01 categoryLabel={category} items={items} onSelect={id => {setSelectedId(id); setContactVisited(false); setDepth(1)}} onBack={onHome} onWriteProblem={() => {skipExit.current = true; onWriteProblem()}}/>
      </div>
      {data && <motion.div className="hh-solutions-layer hh-solutions-front" key={data.id} initial={{x:reduced || initialCaseId ? 0 : '100%'}} animate={{x:depth >= 1 ? 0 : '100%'}} transition={transition} inert={depth !== 1} aria-hidden={depth !== 1}>
        <B02 data={data} onBack={() => initialCaseId ? onHome() : setDepth(0)} onComplete={onHome}
          onContact={() => {setContactVisited(true);setDepth(2)}}
          onOpenVideo={() => {}} onPreviewOpinion={() => setNotice('의견 완료 UI만 표시하며 실제 저장·전송은 연결하지 않았습니다.')} />
      </motion.div>}
      {data && contactVisited && <motion.div className="hh-solutions-layer hh-solutions-front" key={`contact-${data.id}`} initial={{x:reduced ? 0 : '100%'}} animate={{x:depth === 2 ? 0 : '100%'}} transition={transition} inert={depth !== 2} aria-hidden={depth !== 2}>
        <B03 recipients={toMessageRecipients(data)} onBack={() => setDepth(1)}/>
      </motion.div>}
    </div>
    <details className="hh-home-preview-tools hh-preview-disclosure"><summary>개발용 안내·테스트 도구</summary><div className="hh-preview-disclosure-panel"><p role="status">{notice}</p></div></details>
  </motion.div>
}
