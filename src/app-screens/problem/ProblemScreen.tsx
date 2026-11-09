import {screenSlidesEnabled} from '../navigation-motion'
import {useCtaPositionMotion} from '../use-cta-position-motion'
import {useLayoutEffect,useRef,useState} from 'react'
import {Button,GNB} from '../../components/ui'
import './problem.css'
export type AnalysisInput={analysisUserText:string;analysisUserPhotos:File[]}
export const emptyInput=():AnalysisInput=>({analysisUserText:'',analysisUserPhotos:[]})
export const canAnalyze=(input:AnalysisInput)=>Boolean(input.analysisUserText.trim())
export function ProblemScreen({input,onChange,onBack,onAnalyze,analysisError}: {
 input:AnalysisInput;onChange:(input:AnalysisInput)=>void;onBack:()=>void;onAnalyze:(input:AnalysisInput)=>void;onCapture:()=>void;analysisError?:string;
}) {
 const textarea=useRef<HTMLTextAreaElement>(null)
 const cta=useCtaPositionMotion<HTMLDivElement>()
 const [leaving,setLeaving]=useState(false)
 useLayoutEffect(()=>{const node=textarea.current!;node.style.height='120px';node.style.height=`${Math.min(250,Math.max(120,node.scrollHeight))}px`},[input.analysisUserText])
 return <main className={`hh-problem${leaving?' hh-problem--leaving':''}`} aria-label="문제 작성" inert={leaving} onAnimationEnd={event=>{if(event.target===event.currentTarget&&event.animationName==='hh-problem-slide-out')onBack()}}>
 <GNB title="글로 해결 방법 찾기" onBack={()=>{if(leaving)return;if(!screenSlidesEnabled||window.matchMedia('(prefers-reduced-motion: reduce)').matches)onBack();else setLeaving(true)}}/>
 <form className="hh-problem-content" onSubmit={event=>{event.preventDefault();if(canAnalyze(input))onAnalyze({...input,analysisUserPhotos:[]})}}>
 <div className="hh-problem-fields"><div className="hh-problem-intro"><h1>어떤 문제가 생겼나요?</h1><p>문제가 생긴 곳과 증상을 적으면 비슷한 사례를 찾아드려요.</p></div>
 <div className="hh-problem-field"><label htmlFor="analysis-user-text">문제 상황</label><textarea ref={textarea} id="analysis-user-text" maxLength={6000} placeholder="예) 변기 물이 내려가지 않아요" value={input.analysisUserText} onChange={event=>onChange({analysisUserText:event.target.value,analysisUserPhotos:[]})}/></div>
 <p className="text-caption-rg">입력한 글은 이 기기 안에서만 검색에 사용해요. 서버로 보내거나 별도로 저장하지 않아요.</p>
 {analysisError&&<p role="alert" className="hh-problem-error">{analysisError}</p>}</div>
 <div ref={cta} className="hh-problem-next"><Button type="submit" disabled={!canAnalyze(input)}>관련 사례 찾기</Button></div></form></main>
}
