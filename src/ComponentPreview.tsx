import { useEffect, useRef, useState } from 'react'
import { Accordion, ActionSheet, AddImage, ArrowButton, Button, Checkbox, GNB, HomeIcon, ListRow, MessageButton, Overlay, Photo, Radio, TabBar } from './components/ui'

const notices = [
  '이름, 전화번호, 주소 등 개인정보가 노출되지 않도록 주의해 주세요.',
  '집주인이나 타인의 신상을 공개하거나 비방하는 글은 작성하지 말아 주세요.',
  '확인되지 않은 정보나 잘못된 해결 방법은 사실인 것처럼 단정하지 말아 주세요.',
  '서로 다른 경험과 의견을 존중하며 예의를 지켜 주세요.',
  '사진을 첨부할 때는 개인정보나 타인의 사생활이 노출되지 않았는지 확인해 주세요.',
]
export function ComponentPreview() {
  const [checks, setChecks] = useState([true, false])
  const [radio, setRadio] = useState('one')
  const [tab, setTab] = useState('landlord')
  const [selected, setSelected] = useState([false, true])
  const [expanded, setExpanded] = useState(false)
  const [photos, setPhotos] = useState([1])
  const nextPhoto = useRef(2)
  const [sheet, setSheet] = useState(false)
  const [overlay, setOverlay] = useState(false)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState('컴포넌트를 눌러 동작을 확인해 보세요.')
  useEffect(() => {
    if (!busy) return
    const timer = window.setTimeout(() => { setBusy(false); setResult('로딩 미리보기 완료') }, 3600)
    return () => window.clearTimeout(timer)
  }, [busy])
  return <section id="components" className="preview-section" aria-labelledby="components-title">
    <div className="section-heading"><h2 id="components-title" className="text-heading">04 공통 컴포넌트</h2><span className="text-caption-rg">Figma 13종 · 직접 눌러 확인</span></div>
    <p className="preview-muted">버튼·체크·탭·펼침·사진 삭제·시트 열고 닫기를 확인해요. 아래 문구와 사진은 검토용 예시입니다.</p>
    <p className="preview-result" role="status">{result}</p>
    <div className="component-preview-grid">
      <article id="arrow-button" className="component-demo"><h3>Arrow Button</h3>
        <div className="demo-arrow-buttons">
          <div><ArrowButton label="화살표 버튼 확인" onClick={() => setResult('화살표 버튼 클릭')} /><p className="text-caption-rg">기본 · Hover · Pressed</p></div>
          <div><ArrowButton label="비활성 화살표 버튼" disabled onClick={() => setResult('비활성 버튼 오류')} /><p className="text-caption-rg">비활성</p></div>
        </div>
        <p className="preview-muted text-caption-rg">40×40px · 마우스를 올리거나 눌러 상태를 확인해요.</p>
      </article>
      <article className="component-demo"><h3>Button</h3><div className="demo-stack">
        <Button loading={busy} onClick={() => { setBusy(true); setResult('로딩 중에는 중복 클릭할 수 없어요.') }}>눌러서 로딩 확인</Button>
        <Button variant="pale" onClick={() => setResult('보조 버튼 클릭')}>보조 버튼</Button>
        <Button disabled>비활성 버튼</Button><Button variant="pale" disabled>보조 비활성 버튼</Button>
        <Button loading>기본 로딩</Button><Button variant="pale" loading>보조 로딩</Button>
      </div></article>
      <article className="component-demo"><h3>Checkbox · Radio</h3><div className="demo-stack">
        <Checkbox label="채움 체크박스" checked={checks[0]} onChange={e => setChecks([e.target.checked, checks[1]])} />
        <Checkbox label="선 체크박스" variant="stroke" checked={checks[1]} onChange={e => setChecks([checks[0], e.target.checked])} />
        <fieldset className="demo-radio-group"><legend>하나만 선택</legend>
          <Radio name="demo-radio" value="one" label="첫 번째 항목" checked={radio === 'one'} onChange={() => setRadio('one')} />
          <Radio name="demo-radio" value="two" label="두 번째 항목" checked={radio === 'two'} onChange={() => setRadio('two')} />
        </fieldset>
      </div></article>
      <article className="component-demo"><h3>Tab bar</h3>
        <TabBar label="연락 대상 미리보기" value={tab} onChange={setTab} options={[
          { value: 'landlord', label: '집주인', panelId: 'demo-landlord' }, { value: 'professional', label: '전문 업체', panelId: 'demo-professional' },
        ]} />
        <div id="demo-landlord" role="tabpanel" aria-label="집주인" hidden={tab !== 'landlord'} tabIndex={0} className="demo-tab-panel">집주인 탭이 선택됐어요.</div>
        <div id="demo-professional" role="tabpanel" aria-label="전문 업체" hidden={tab !== 'professional'} tabIndex={0} className="demo-tab-panel">전문 업체 탭이 선택됐어요.</div>
        <p className="preview-muted text-caption-rg">키보드 ← →로도 바꿀 수 있어요.</p>
      </article>
      <article className="component-demo"><h3>List · Message Button</h3><div className="demo-stack">
        <ListRow icon={<HomeIcon />} onClick={() => setResult('기본 목록 클릭')}>Text</ListRow>
        <ListRow variant="pale" icon={<HomeIcon pale />} onClick={() => setResult('보조 목록 클릭')}>Text</ListRow>
        {selected.map((value, i) => <MessageButton key={i} selected={value} onSelectedChange={v => setSelected(values => values.map((old, index) => index === i ? v : old))}>선택 문장 {i + 1}</MessageButton>)}
      </div></article>
      <article className="component-demo component-demo--wide"><h3>GNB</h3><div className="demo-gnb-stack">
        <GNB title="Title" variant="depth1" />
        <GNB title="Title" onBack={() => setResult('헤더 뒤로 클릭')} onClose={() => setResult('헤더 닫기 클릭')} />
        <div className="demo-dark"><GNB title="Title" variant="depth2-dark" onBack={() => setResult('밝은 화살표 클릭')} onClose={() => setResult('밝은 닫기 클릭')} /></div>
      </div></article>
      <article className="component-demo"><h3>유의사항 아코디언</h3>
        <Accordion title="게시글 작성 전 확인해 주세요." open={expanded} onOpenChange={setExpanded}><ul>{notices.map(text => <li key={text}>{text}</li>)}</ul></Accordion>
        <p className="preview-muted text-caption-rg">Figma 원본 문구를 사용한 펼침 예시입니다. 출시 화면에서는 해당 화면의 문구를 전달합니다.</p>
      </article>
      <article className="component-demo"><h3>Add image · Photo</h3>
        <div className="demo-photo-row">{photos.length < 5 && <AddImage onClick={() => { const id = nextPhoto.current++; setPhotos(values => values.length < 5 ? [...values, id] : values) }} />}
          {photos.map(id => <Photo key={id} src="/components/figma/photo.png" alt={`예시 사진 ${id}`} onRemove={() => setPhotos(values => values.filter(value => value !== id))} />)}
        </div><p className="preview-muted text-caption-rg">{photos.length}/5장 · +를 누르면 예시 사진이 추가됩니다. 5장이면 +가 숨겨지고 삭제하면 다시 나타나요.</p>
      </article>
      <article className="component-demo"><h3>Action Sheet · Overlay</h3><div className="demo-stack">
        <Button variant="pale" onClick={() => setSheet(true)}>액션 시트 열기</Button>
        <Button onClick={() => setOverlay(true)}>확인창 열기</Button>
        <p className="preview-muted text-caption-rg">시트는 바깥 영역·취소·Escape로 닫힙니다. 확인창은 아니오·네·Escape를 확인해 주세요.</p>
      </div></article>
    </div>
    <ActionSheet open={sheet} label="액션 시트 미리보기" onClose={() => setSheet(false)} actions={[
      { id: '1', label: 'Action 1', onClick: () => { setResult('첫 번째 액션 선택'); setSheet(false) } },
      { id: '2', label: 'Action 2', onClick: () => { setResult('두 번째 액션 선택'); setSheet(false) } },
      { id: '3', label: 'Action 3', onClick: () => { setResult('세 번째 액션 선택'); setSheet(false) } },
    ]} />
    <Overlay open={overlay} title="Header" body="Body" onClose={() => { setOverlay(false); setResult('확인창 닫기') }} onConfirm={() => { setOverlay(false); setResult('확인창: 네 선택') }} />
  </section>
}
