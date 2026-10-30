import { Icon, iconCatalog } from './components/Icon/Icon'
import { ComponentPreview } from './ComponentPreview'
import './preview.css'

const colors = [
  ['neutral', '화면 배경', '#F5F7FB'], ['surface', '카드·시트', '#FFFFFF'],
  ['primary', '브랜드 파랑', '#365EFF'], ['primary-pressed', '기본 토큰 · 눌림', '#1B43E4'],
  ['on-surface', '제목·본문', '#19212E'], ['secondary', '보조 글자', '#5F6979'],
  ['border', '테두리', '#D7DEE7'], ['disabled', '비활성 글자·아이콘', '#898F98'],
  ['error', '오류', '#FF0000'],
]
const componentColors = [
  ['button-primary-hover', '주요 버튼 · Hover', '#234FFF'],
  ['button-primary-pressed', '주요 버튼 · Pressed', '#1B45F0'],
  ['button-pale', '보조 버튼 · Default', '#E8F0FF'],
  ['button-pale-hover', '보조 버튼 · Hover', '#E0EBFF'],
  ['button-pale-pressed', '보조 버튼 · Pressed', '#D9E6FF'],
  ['button-disabled-background', '비활성 버튼 배경', '#D7DEE7'],
  ['list-neutral-hover', '목록 · Hover', '#F1F4FA'],
  ['list-neutral-pressed', '목록 · Pressed', '#EBEFF7'],
]
const typography = [
  ['display', 'Display bd', '700', '26', '36.4'],
  ['heading', 'Heading', '600', '20', '30'],
  ['body-sb', 'Body sb', '600', '16', '24'],
  ['body-md', 'Body md', '500', '16', '24'],
  ['body-rg', 'Body rg', '400', '16', '24'],
  ['caption-md', 'Caption md', '500', '14', '19.6'],
  ['caption-rg', 'Caption rg', '400', '14', '19.6'],
]
const groups = [...new Set(iconCatalog.map((asset) => asset.groupId))]
const iconNotes: Record<string, string> = {
  '408:3504': '← Left · 실제 방향에 맞춰 이름 정정',
  '408:3506': '→ Right · 실제 방향에 맞춰 이름 정정',
  '408:3518': '↓ Bottom',
  '408:3530': '↑ Top',
  '408:3835': '점선은 크기 확인용 · 실제 Blank는 빈 정사각형 공간',
}

export default function App() {
  return (
    <main className="foundation-preview">
      <header className="preview-header">
        <p className="preview-eyebrow text-caption-md">어쩌집 · 04 / COMMON COMPONENTS</p>
        <h1 className="text-display">함께 쓰는 디자인과 컴포넌트</h1>
        <p className="preview-description">우리 팀이 함께 사용할 디자인의 기본 요소를 확인해요.</p>
        <p className="text-caption-rg preview-muted">출시 화면이 아닌 검토용 미리보기입니다. 아이콘은 클릭 동작이 없는 시각 요소입니다.</p>
        <nav aria-label="미리보기 목차" className="preview-nav">
          <a href="#colors">01 색상</a><a href="#typography">02 Pretendard</a><a href="#icons">03 아이콘</a>
          <a href="#components">04 공통 컴포넌트</a>
        </nav>
      </header>

      <ComponentPreview />
      <section id="colors" className="preview-section" aria-labelledby="colors-title">
        <div className="section-heading"><h2 id="colors-title" className="text-heading">01 색상</h2><span className="text-caption-rg">Light · 기본 색상 9개</span></div>
        <div className="swatch-grid">{colors.map(([key, label, hex]) => (
          <figure className="swatch-card" key={key}>
            <div className="swatch" style={{ backgroundColor: `var(--color-${key})` }} />
            <figcaption><strong className="text-body-md">{label}</strong><span className="text-caption-rg">{hex}</span><code>Color/{key}</code></figcaption>
          </figure>
        ))}</div>
        <h3 className="text-body-sb subsection-title">컴포넌트별 상태 색상</h3>
        <p className="text-caption-rg preview-muted">버튼의 눌림 색상과 비활성 배경은 기본 토큰과 구분해 원본 값을 보존합니다.</p>
        <div className="component-colors">{componentColors.map(([key, label, hex]) => (
          <div className="component-color" key={key}><span className="color-dot" style={{ backgroundColor: `var(--${key})` }} /><span className="text-caption-md">{label}</span><span className="text-caption-rg preview-muted">{hex}</span></div>
        ))}</div>
      </section>

      <section id="typography" className="preview-section" aria-labelledby="type-title">
        <div className="section-heading"><h2 id="type-title" className="text-heading">02 Pretendard</h2><span className="text-caption-rg">로컬 WOFF2 · 4가지 굵기</span></div>
        <p className="preview-muted text-caption-rg">모든 스타일에 Pretendard를 사용합니다. Body sb는 SemiBold 600입니다.</p>
        <div className="type-list">{typography.map(([key, name, weight, size, lineHeight]) => (
          <article className="type-row" key={key}>
            <div><h3 className="text-caption-md">{name}</h3><p className="text-caption-rg preview-muted">{size}px / {lineHeight}px · {weight}</p></div>
            <div className={`type-sample text-${key}`} data-type-style={key}><p>혼자 사는 마음까지 든든하게</p><p>어쩌집 Howhouse 0123456789</p></div>
          </article>
        ))}</div>
      </section>

      <section id="icons" className="preview-section" aria-labelledby="icons-title">
        <div className="section-heading"><h2 id="icons-title" className="text-heading">03 아이콘</h2><span className="text-caption-rg">29종 · 180개 변형 · 원본 SVG</span></div>
        <p className="text-caption-rg preview-muted">16 / 20 / 24 / 28px의 원본 크기입니다. Fill은 채움, Stroke는 선입니다. 원본 이름과 노드 번호를 함께 표시합니다.</p>
        <p className="text-caption-rg preview-muted">전체 아이콘 자료를 보관한 목록이며, 커뮤니티·로그아웃 등의 앱 기능을 추가한 것은 아닙니다.</p>
        <div className="icon-grid">{groups.map((groupId) => {
          const assets = iconCatalog.filter((asset) => asset.groupId === groupId)
          const styles = [...new Set(assets.map((asset) => asset.variant.match(/Style=(\w+)/)?.[1] ?? 'Default'))]
          return <article className="icon-card" key={groupId}>
            <h3 className="text-body-sb">{assets[0].name}</h3><p className="text-caption-rg preview-muted">{groupId}</p>
            {styles.map((style) => <div className="icon-variants" key={style}>
              <span className="text-caption-rg variant-label">{style}</span>
              {assets.filter((asset) => (asset.variant.match(/Style=(\w+)/)?.[1] ?? 'Default') === style).sort((a,b) => a.width-b.width).map((asset) => (
                <figure className="icon-example" key={asset.id} title={`${asset.variant} · ${asset.id}`}>
                  <div className={`icon-slot ${asset.src ? '' : 'icon-slot--blank'}`}><Icon nodeId={asset.id} /></div>
                  <figcaption className="text-caption-rg">{asset.width}</figcaption>
                </figure>
              ))}
            </div>)}
            {iconNotes[groupId] && <p className="icon-note text-caption-rg">{iconNotes[groupId]}</p>}
          </article>
        })}</div>
      </section>
      <footer className="preview-footer text-caption-rg">4단계 확인용 · 다음 단계는 실제 출시 화면에 조립해 확인하기입니다.</footer>
    </main>
  )
}
