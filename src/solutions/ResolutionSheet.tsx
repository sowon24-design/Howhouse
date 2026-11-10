import { useState } from 'react'
import { Button } from '../components/ui'
import { SolutionSheet } from './SolutionSheet'
import solved from './assets/solved.svg'
import unsolved from './assets/unsolved.svg'
import type { ResolutionStatus } from './resolution-message'

export function ResolutionSheet({mode,onClose,onHome,onContact,canContact,hasLandlordMessage=false,hasCompany=false}:{mode:'closed'|'solved'|'unsolved';onClose:()=>void;onHome?:()=>void;onContact:(status:ResolutionStatus)=>void;canContact:boolean;hasLandlordMessage?:boolean;hasCompany?:boolean}) {
  const [visible,setVisible]=useState(mode)
  if(mode!=='closed'&&visible!==mode)setVisible(mode)
  const done=visible==='solved'
  const contact=<Button variant={done?'pale':'primary'} disabled={!canContact} onClick={()=>{onClose();onContact(done?'solved':'unsolved')}}>문의 메시지 작성하기</Button>
  const home=<Button variant={done?'primary':'pale'} disabled={!onHome} onClick={()=>{onClose();onHome?.()}}>홈으로 돌아가기</Button>
  return <SolutionSheet open={mode!=='closed'} onClose={onClose} swipeDismiss label={done?'해결됐다니 다행이에요!':'혼자 해결하기 어려운가요?'} className="solutions-resolution">
    <div className="solutions-opinion__handle" aria-hidden="true"/>
    <div className="solutions-resolution__body">
      <div className="solutions-opinion__copy"><h2 className="text-heading">{done?'해결됐다니 다행이에요!':'혼자 해결하기 어려운가요?'}</h2><p>{done?<>문제가 다시 생기거나 점검이 필요하면<br/>문의 메시지를 작성할 수 있어요.</>:<>직접 해결하기 어렵다면<br/>{hasCompany?'집주인이나 전문 업체에':'집주인에게'} 상황을 알려보세요.</>}</p></div>
      <img className="solutions-resolution__art" src={done?solved:unsolved} alt=""/>
    </div>
    <div className="solutions-resolution__actions">{done?<>{hasLandlordMessage && contact}{home}</>:<>{home}{contact}</>}</div>
  </SolutionSheet>
}
