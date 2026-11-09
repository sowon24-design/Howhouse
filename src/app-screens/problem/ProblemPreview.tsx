import {useState} from 'react'
import {Button, GNB, ListRow} from '../../components/ui'
import {useAndroidBack} from '../android-back'
import {solutionCases} from '../../solutions/data'
import {findLocalCases} from '../../analysis/local-search'
import type {AnalysisResult} from '../../analysis/client'
import type {GeneratedSolution} from '../../analysis/solution'
import {ProblemScreen, type AnalysisInput} from './ProblemScreen'
import '../home/home-preview.css'
import '../analysis/analysis.css'
export function ProblemPreview({input,onChange,onInputBack,onSuccess}: {
 input:AnalysisInput;onChange:(input:AnalysisInput)=>void;onInputBack?:()=>void;
 onSuccess:(result:AnalysisResult<GeneratedSolution>)=>void;suspended?:boolean;onConnectionLost?:()=>void;
}) {
 const [results,setResults]=useState<ReturnType<typeof findLocalCases>|null>(null)
 const back=()=>results!==null?setResults(null):onInputBack?.()
 useAndroidBack(back)
 return <div className="hh-home-preview"><div className="hh-home-preview-frame">
 {results===null?<ProblemScreen input={input} onChange={onChange} onBack={back} onCapture={()=>{}} onAnalyze={value=>setResults(findLocalCases(value.analysisUserText,solutionCases))}/>
 :<main className="hh-analysis hh-analysis-confirm" aria-label="관련 사례 검색 결과">
 <GNB title="관련 사례" onBack={back} onClose={()=>{window.location.hash='home'}}/>
 <div className="hh-analysis-content"><h1>{results.length?'지금 상황과 비슷한 사례를 골라주세요.':'맞는 사례를 찾지 못했어요.'}</h1>
 <p>{results.length?'입력한 글의 단어와 증상으로 찾은 사례예요. 원인을 진단한 결과는 아니에요.':'문제가 생긴 곳과 증상을 함께 적어 보세요. 예: 변기 물이 내려가지 않아요.'}</p>
 <div className="hh-local-results">{results.map(item=><ListRow key={item.id} onClick={()=>onSuccess({source:'existing',caseId:item.id})}>{item.title}</ListRow>)}</div>
 <div className="hh-analysis-next hh-confirm-actions"><Button variant="pale" onClick={back}>질문 수정하기</Button><Button onClick={()=>{window.location.hash='home'}}>카테고리에서 찾기</Button></div>
 </div></main>}
 </div></div>
}
