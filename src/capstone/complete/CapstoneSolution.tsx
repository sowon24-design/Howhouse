import {useState,type ComponentProps} from 'react'
import {B02} from '../../solutions/B02'
import {Button} from '../../components/ui'
import {SolutionSheet} from '../../solutions/SolutionSheet'
import shareArt from './assets/b2c0bab8-c413-467d-b476-230a4191899f.png'
import {useRecentCases} from './RecentCases'
import {reviewDraft} from './review-draft'

export function CapstoneSolution(props:ComponentProps<typeof B02> & {recordData?:import('../../analysis/solution').GeneratedSolution}){
 const {markSolved}=useRecentCases()
 const [sharing,setSharing]=useState(false)
 return <><B02 {...props} onSolved={()=>{if(props.recordData)markSolved(props.recordData);props.onSolved?.();setSharing(true)}}/>
 <SolutionSheet open={sharing} onClose={()=>setSharing(false)} label="나의 해결 과정을 공유할까요?" className="solutions-resolution cg-review-share">
  <div className="solutions-opinion__handle" aria-hidden="true"/>
  <div className="solutions-resolution__body"><div className="solutions-opinion__copy"><h2 className="text-heading">어쩌집 커뮤니티에<br/>나의 해결 과정을 공유할까요?</h2><p>올라갈 글은 어쩌집이 자동으로 작성해드려요!</p></div>
  <img className="solutions-resolution__art" src={shareArt} alt=""/></div>
  <div className="solutions-resolution__actions"><Button variant="pale" onClick={()=>{setSharing(false);props.onComplete?.()}}>괜찮아요</Button><Button onClick={()=>{setSharing(false);window.dispatchEvent(new CustomEvent('capstone-review-draft',{detail:reviewDraft(props.data)}))}}>네, 공유할래요!</Button></div>
 </SolutionSheet></>
}
