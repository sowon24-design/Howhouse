import { useState } from 'react'
import { HomeScreen, homeCategories, type HomeCategoryKey } from './HomeScreen'
import './home-preview.css'

// Current three displayed problems mapped to verified existing case IDs. Month remains a preview value.
const problems = [
  { id: '욕실·수도:1', title: '욕실 배수구에서 냄새가 나요' },
  { id: '욕실·수도:2', title: '배수구에 물이 고여서 내려가지 않아요' },
  { id: '난방·전기:17', title: '방의 특정 부분이 따뜻해지지 않아요' },
]
export function HomePreview({ nickname = '자취하는 소라게', onCategory, onProblem, storageStatus, onResetSetup }: { storageStatus?: string; onResetSetup?: () => void; nickname?: string; onCategory?: (key: HomeCategoryKey) => void; onProblem?: (id: string) => void }) {
  const [status, setStatus] = useState('문제 작성 배너는 A02로 이동합니다. 프로필은 마이로 이동하며 카테고리는 B01로 이동합니다. 인기 문제 세 개는 해당 기존 사례 B02로 이동합니다.')
  return <div className="hh-home-preview">
    <div className="hh-home-preview-frame"><HomeScreen nickname={nickname} month={11} popularProblems={problems}
      onProfile={() => { window.location.hash = 'my' }}
      onStartProblem={() => { window.location.hash = 'problem' }}
      onCategory={key => onCategory ? onCategory(key) : setStatus(`${homeCategories.find(item => item.key === key)?.label} 카테고리 선택 · B01 연결 예정`)}
      onProblem={id => onProblem ? onProblem(id) : setStatus(`${problems.find(item => item.id === id)?.title} · B02 연결 예정`)}
    /></div>
    <details className="hh-home-preview-tools hh-preview-disclosure" aria-label="홈 미리보기 안내"><summary>개발용 안내·테스트 도구</summary><div className="hh-preview-disclosure-panel">
      <a href="#components">공통 컴포넌트 보기</a>
      <p>A01 홈 · Figma 예시 데이터 · 시스템 영역 제외</p>
      <p role="status">{status}</p>
      <p role="status">{storageStatus}</p>
      {onResetSetup && <button type="button" onClick={onResetSetup}>테스트 초기화 · 처음부터 시작</button>}
    </div></details>
  </div>
}
