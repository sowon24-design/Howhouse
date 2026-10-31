import { useState } from 'react'
import { HomeScreen, homeCategories } from './HomeScreen'
import './home-preview.css'

// Explicit Figma fixture. No production IDs, month policy or stored profile implied.
const problems = [
  { id: 'preview-drain-smell', title: '욕실 배수구에서 냄새가 나요' },
  { id: 'preview-drain-blocked', title: '배수구에 물이 고여서 내려가지 않아요' },
  { id: 'preview-heating', title: '방의 특정 부분이 따뜻해지지 않아요' },
]
export function HomePreview({ nickname = '자취하는 소라게' }: { nickname?: string }) {
  const [status, setStatus] = useState('문제 작성 배너는 A02로 이동합니다. 프로필은 마이로 이동하며 카테고리·인기 문제는 연결 동작만 안내합니다.')
  return <div className="hh-home-preview">
    <div className="hh-home-preview-frame"><HomeScreen nickname={nickname} month={11} popularProblems={problems}
      onProfile={() => { window.location.hash = 'my' }}
      onStartProblem={() => { window.location.hash = 'problem' }}
      onCategory={key => setStatus(`${homeCategories.find(item => item.key === key)?.label} 카테고리 선택 · B01 연결 예정`)}
      onProblem={id => setStatus(`${problems.find(item => item.id === id)?.title} · B02 연결 예정`)}
    /></div>
    <aside className="hh-home-preview-tools" aria-label="홈 미리보기 안내">
      <a href="#components">공통 컴포넌트 보기</a>
      <p>A01 홈 · Figma 예시 데이터 · 시스템 영역 제외</p>
      <p role="status">{status}</p>
    </aside>
  </div>
}
