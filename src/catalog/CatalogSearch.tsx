import { useRef } from 'react'
import { Button, GNB, ListRow } from '../components/ui'
import { Icon } from '../components/Icon/Icon'
import { useCtaPositionMotion } from '../app-screens/use-cta-position-motion'
import emptyArt from './assets/search-empty.png'
import './search.css'
import { searchParticle } from './search-particle'
import { getCaseListLabel } from '../solutions/data/case-list-labels'

const recommendations = ['곰팡이', '세탁기', '변기 막힘', '배수구 냄새', '에어컨 물 떨어짐']
export function CatalogSearch({query,onChange,onBack,onHome,onSubmit,onSelect,results,showResults}: {
  query:string; onChange:(value:string)=>void; onBack:()=>void; onHome:()=>void; onSubmit:()=>void;
  onSelect:(id:string)=>void; results:readonly {id:string;symptom:string}[]; showResults:boolean
}) {
  const input=useRef<HTMLInputElement>(null)
  const footer=useCtaPositionMotion<HTMLElement>()
  return <main className="hh-search" aria-label={showResults?'검색 결과':'사례 검색'}>
    <GNB title="사례 찾아보기" onBack={onBack} onClose={showResults?onHome:undefined}/>
    {showResults ? <section className="hh-search-results">
      <h1>{results.length ? <>‘<span>{query.trim()}</span>’{searchParticle(query)}<br/>비슷한 문제 {results.length}건이 발견되었어요.</> : <>비슷한 문제를 찾지 못했어요.<br/>다른 검색어로 다시 시도해 주세요.</>}</h1>
      {results.length ? <ul>{results.map(item=><li key={item.id}><ListRow onClick={()=>onSelect(item.id)}>{getCaseListLabel(item.id, item.symptom)}</ListRow></li>)}</ul> : <>
        <div className="hh-search-empty"><img src={emptyArt} alt=""/></div>
        <footer><Button onClick={onHome}>홈으로 돌아가기</Button></footer>
      </>}
    </section> : <form className="hh-search-form" onSubmit={event=>{event.preventDefault();if(query.trim()){input.current?.blur();onSubmit()}}}>
      <div className="hh-search-fields">
        <div className="hh-search-input"><input ref={input} autoFocus type="search" enterKeyHint="search" aria-label="문제·증상 검색" placeholder="어떤 문제가 생겼나요?" maxLength={200} autoComplete="off" value={query} onChange={event=>onChange(event.target.value)}/><button type="submit" aria-label="검색" disabled={!query.trim()}><Icon nodeId="408:3708"/></button></div>
        <section aria-label="추천 검색어"><h2>추천 검색어</h2><div className="hh-search-tags">{recommendations.map(word=><button type="button" key={word} onClick={()=>{onChange(word);input.current?.blur();onSubmit()}}>{word}</button>)}</div></section>
        {/가스\s*냄새|연기|불꽃|감전|탄내|타는\s*냄새/.test(query) && <p role="alert">위험한 상황일 수 있어요. 직접 분해하거나 수리하지 말고 안전을 확보한 뒤 긴급기관 또는 전문가에게 도움을 요청하세요. 검색 결과만으로 안전 여부를 판단하지 마세요.</p>}
      </div>
      <footer ref={footer}><Button type="submit" disabled={!query.trim()}>비슷한 문제 찾아보기</Button></footer>
    </form>}
  </main>
}
