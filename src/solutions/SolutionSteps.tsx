import { SolutionStep } from '../components/ui/SolutionStep'
import { Capacitor } from '@capacitor/core'
import { coupangSearchUrl } from './supply-links'
import type { SolutionCase } from './data/types'

/** Single white timeline card; source step counts and text remain unchanged. */
export function SolutionSteps({steps,supplies}:{steps:SolutionCase['steps'];supplies:string[]}) {
  const hasSupplies=supplies.length>0
  function searchMaterial(label:string) {
    const url=coupangSearchUrl(label)
    if(!url)return
    // Capacitor's navigation handler opens external HTTPS URLs via ACTION_VIEW.
    if(Capacitor.isNativePlatform())window.location.assign(url)
    else window.open(url,'_blank','noopener,noreferrer')
  }
  return <div className="solutions-b02__vertical-steps">
    {hasSupplies&&<SolutionStep number={0} title="필요한 물건을 준비해요" description="준비물을 누르면 쿠팡 앱 또는 웹페이지에서 해당 이름의 검색 결과를 볼 수 있어요. 이미 가지고 있다면 구매하지 않아도 돼요." materials={supplies.map((label,i)=>({id:String(i),label,disabled:!label.trim()}))} onMaterialClick={material=>searchMaterial(material.label)}/>}
    {steps.map((step,i)=><SolutionStep key={`${step.number}-${i}`} {...step} active/>)}
  </div>
}
