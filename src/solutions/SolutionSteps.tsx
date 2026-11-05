import { SolutionStep } from '../components/ui/SolutionStep'
import type { SolutionCase } from './data/types'

/** Single white timeline card; source step counts and text remain unchanged. */
export function SolutionSteps({steps,supplies}:{steps:SolutionCase['steps'];supplies:string[]}) {
  const hasSupplies=supplies.length>0
  return <div className="solutions-b02__vertical-steps">
    {hasSupplies&&<SolutionStep number={0} title="필요한 물건을 준비해요" description="집에 없는 준비물은 쿠팡에서 구매할 수 있어요. 누르면 쿠팡 검색 결과 페이지로 이동해요." materials={supplies.map((label,i)=>({id:String(i),label}))} onMaterialClick={material=>window.open(`https://www.coupang.com/np/search?q=${encodeURIComponent(material.label.trim())}`, '_blank', 'noopener,noreferrer')}/>}
    {steps.map((step,i)=><SolutionStep key={`${step.number}-${i}`} {...step} active/>)}
  </div>
}
