import { SolutionStep } from '../components/ui/SolutionStep'
import type { SolutionCase } from './data/types'

/** Single white timeline card; source step counts and text remain unchanged. */
export function SolutionSteps({steps,supplies}:{steps:SolutionCase['steps'];supplies:string[]}) {
  const hasSupplies=supplies.length>0
  return <div className="solutions-b02__vertical-steps">
    {hasSupplies&&<SolutionStep number={0} title="필요한 물건을 준비해요" description="이미 가지고 있는 물건이 있는지 확인해 주세요." materials={supplies.map((label,i)=>({id:String(i),label,disabled:true}))}/>}
    {steps.map((step,i)=><SolutionStep key={`${step.number}-${i}`} {...step} active/>)}
  </div>
}
