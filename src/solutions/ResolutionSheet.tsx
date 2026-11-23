import { CompletionIllustration, preloadCompletionArtwork } from './CompletionIllustration'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui'
import { SolutionSheet } from './SolutionSheet'
import unsolved from './assets/unsolved.svg'
import type { ResolutionStatus } from './resolution-message'

export function ResolutionSheet({mode,onClose,onHome,onContact,canContact,hasLandlordMessage=false,hasCompany=false}:{mode:'closed'|'solved'|'unsolved';onClose:()=>void;onHome?:()=>void;onContact:(status:ResolutionStatus)=>void;canContact:boolean;hasLandlordMessage?:boolean;hasCompany?:boolean}) {
  useEffect(() => { void preloadCompletionArtwork() }, [])
  const [visible,setVisible]=useState(mode)
  if(mode!=='closed'&&visible!==mode)setVisible(mode)
  const done=visible==='solved'
  const showContact=canContact && (!done || hasLandlordMessage)
  const title=done?'해결됐다니 다행이에요!':showContact?'혼자 해결하기 어려운가요?':'아직 해결되지 않았나요?'
  const contact=<Button variant={done?'pale':'primary'} onClick={()=>{onClose();onContact(done?'solved':'unsolved')}}>문의 메시지 작성하기</Button>
  const home=<Button variant={done || !showContact?'primary':'pale'} disabled={!onHome} onClick={()=>{onClose();onHome?.()}}>홈으로 돌아가기</Button>
  return <SolutionSheet open={mode!=='closed'} onClose={onClose} swipeDismiss label={title} className={done ? "solutions-resolution solutions-completion-sheet" : "solutions-resolution"}>
    <div className="solutions-opinion__handle" aria-hidden="true"/>
    <div className="solutions-resolution__body">
      <div className="solutions-opinion__copy"><h2 className="text-heading">{title}</h2><p>{!showContact ? (done ? <>집 안의 불편이 하나 줄었네요.<br/>다음에 궁금한 일이 생겨도 어쩌집과 함께해요.</> : <>집마다 상황이 다를 수 있어요.<br/>무리해서 해결하려 하지 않아도 괜찮아요.</>) : done?<>문제가 다시 생기거나 점검이 필요하면<br/>문의 메시지를 작성할 수 있어요.</>:<>직접 해결하기 어렵다면<br/>{hasCompany?'집주인이나 전문 업체에':'집주인에게'} 상황을 알려보세요.</>}</p></div>
      {done?<CompletionIllustration active={mode!=='closed'}/>:<img className="solutions-resolution__art" src={unsolved} alt=""/>}
    </div>
    <div className="solutions-resolution__actions">{!showContact ? home : done?<>{contact}{home}</>:<>{home}{contact}</>}</div>
  </SolutionSheet>
}
