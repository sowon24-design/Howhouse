import { InformationScreen, type InformationPage } from './InformationScreen'
import { NicknameScreen } from '../onboarding/NicknameScreen'
import { useState } from 'react'
import { GNB } from '../../components/ui'
import crab from './assets/profile-crab.png'
import edit from './assets/edit-profile.svg'
import './my.css'

export const myMenus = [
  { id: 'app', label: '앱 정보' },
  { id: 'data', label: '개인정보 및 데이터 관리' },
  { id: 'terms', label: '이용약관' },
  { id: 'privacy', label: '개인정보 처리방침' },
  { id: 'ai', label: 'AI 활용 정보' },
  { id: 'contact', label: '문의하기' },
] as const
export type MyMenu = typeof myMenus[number]['id']
export function MyScreen({ nickname, version, onBack, onEdit, onMenu }: {
  nickname: string; version: string; onBack: () => void; onEdit: () => void; onMenu: (menu: MyMenu) => void
}) {
  const [leaving, setLeaving] = useState(false)
  function back() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) onBack()
    else setLeaving(true)
  }
  return <main className={`hh-my${leaving ? ' hh-my--leaving' : ''}`} aria-label="마이 페이지" inert={leaving} onAnimationEnd={event => {
    if (event.target === event.currentTarget && event.animationName === 'hh-my-out') onBack()
  }}>
    <GNB title="마이 페이지" onBack={back} />
    <div className="hh-my-content">
      <section className="hh-my-profile" aria-label="내 프로필">
        <div className="hh-my-identity"><h1>{nickname}</h1><button type="button" aria-label="닉네임 수정" onClick={onEdit}><img src={edit} alt="" /></button></div>
        <div className="hh-my-art"><img src={crab} alt="" /></div>
      </section>
      <section className="hh-my-data" aria-labelledby="my-data-title">
        <h2 id="my-data-title">데이터</h2>
        <div className="hh-my-menu">{myMenus.map(menu => <button type="button" key={menu.id} onClick={() => onMenu(menu.id)}><span>{menu.label}</span>{menu.id === 'app' && <span className="hh-my-version">{version}</span>}</button>)}</div>
      </section>
    </div>
  </main>
}
export function MyPreview({ nickname = '자취하는 소라게', onNicknameChange }: { nickname?: string; onNicknameChange: (name: string) => void }) {
  const [information, setInformation] = useState<InformationPage | null>(null)
  const [closingInformation, setClosingInformation] = useState(false)
  function closeInformation() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setInformation(null)
    else setClosingInformation(true)
  }
  const [editing, setEditing] = useState(false)
  const [closingEdit, setClosingEdit] = useState(false)
  const [status, setStatus] = useState('버전은 Figma 예시값입니다. 닉네임은 임시 저장합니다. 빨간 본문은 수정 예정인 임시 문구입니다. 이메일 복사는 테스트 문자열 test.email.com을 복사합니다.')
  return <div className="hh-home-preview">
    <div className="hh-home-preview-frame hh-my-frame hh-my-stack"><div className="hh-my-base" inert={editing || information !== null} aria-hidden={editing || information !== null}><MyScreen nickname={nickname} version="v 1.0.1" onBack={() => { window.location.hash = 'home' }} onEdit={() => { setClosingEdit(false); setEditing(true) }} onMenu={id => { if (id === 'ai') setStatus('AI 활용 정보 · 상세 시안 확인 후 연결 예정'); else { setClosingInformation(false); setInformation(id) } }} /></div>
      {information && <div className={`hh-my-editor${closingInformation ? ' hh-my-editor--leaving' : ''}`} inert={closingInformation} onAnimationEnd={event => { if (event.target === event.currentTarget && event.animationName === 'hh-my-out') { setInformation(null); setClosingInformation(false) } }}>
        <InformationScreen page={information} onBack={closeInformation} />
      </div>}
      {editing && <div className={`hh-my-editor${closingEdit ? ' hh-my-editor--leaving' : ''}`} inert={closingEdit} onAnimationEnd={event => { if (event.target === event.currentTarget && event.animationName === 'hh-my-out') { setEditing(false); setClosingEdit(false) } }}>
        <NicknameScreen mode="edit" initialValue={nickname} onBack={() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setEditing(false); else setClosingEdit(true) }} onComplete={name => { onNicknameChange(name); window.location.hash = 'home' }} />
      </div>}
    </div>
    <aside className="hh-home-preview-tools" aria-label="마이 미리보기 안내"><a href="#home">홈 미리보기</a> · <a href="#components">공통 컴포넌트 보기</a><p role="status">{status}</p></aside>
  </div>
}
