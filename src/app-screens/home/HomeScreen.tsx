import { ListRow } from '../../components/ui'
import illustration from './assets/imgImage150.png'
import logo from './assets/imgVector132Stroke.svg'
import profile from './assets/imgIconProfile.svg'
import book from './assets/imgIconBook.svg'
import arrow from './assets/imgIconArrowRight.svg'
import shadow1 from './assets/imgEllipse118.svg'
import shadow2 from './assets/imgEllipse119.svg'
import shadow3 from './assets/imgEllipse121.svg'
import boiler from './assets/imgIcon.svg'
import bathroom from './assets/imgIcon1.svg'
import refrigerator from './assets/imgIcon2.svg'
import water from './assets/imgIcon3.svg'
import electricity from './assets/imgIcon4.svg'
import washer from './assets/imgIcon5.svg'
import pests from './assets/imgIcon6.svg'
import mold from './assets/imgIcon7.svg'
import './home.css'

// Presentation keys, not database category IDs. Integration maps these explicitly.
export const homeCategories = [
  { key: 'boiler', label: '보일러', image: boiler },
  { key: 'bathroom', label: '화장실', image: bathroom },
  { key: 'refrigerator', label: '냉장고', image: refrigerator },
  { key: 'water', label: '수도·수질', image: water },
  { key: 'electricity', label: '전기·조명', image: electricity },
  { key: 'washer', label: '세탁기', image: washer },
  { key: 'pests', label: '해충', image: pests },
  { key: 'mold', label: '곰팡이', image: mold },
] as const
export type HomeCategoryKey = typeof homeCategories[number]['key']
export type PopularProblem = { id: string; title: string }
export type HomeScreenProps = {
  nickname: string
  month: number
  popularProblems: readonly PopularProblem[]
  onProfile: () => void
  onStartProblem: () => void
  onCategory: (category: HomeCategoryKey) => void
  onProblem: (id: string) => void
}

export function HomeScreen({ nickname, month, popularProblems, onProfile, onStartProblem, onCategory, onProblem }: HomeScreenProps) {
  return <main className="hh-home" aria-label="어쩌집 홈">
    <header className="hh-home-header">
      <img src={logo} alt="어쩌집" />
      <button type="button" className="hh-home-profile" aria-label="마이 페이지" onClick={onProfile}><img src={profile} alt="" /></button>
    </header>
    <div className="hh-home-content">
      <div className="hh-home-greeting">
        <h1><span>{nickname}</span> 님!</h1>
        <p>어떤 도움이 필요하세요?</p>
      </div>
      <section className="hh-home-help" aria-label="직접 문제 작성">
        <div className="hh-home-art" aria-hidden="true">
          <div className="hh-home-art-stage">
            <img className="hh-home-shadow s1" src={shadow1} alt="" />
            <img className="hh-home-shadow s2" src={shadow2} alt="" />
            <img className="hh-home-shadow s3" src={shadow2} alt="" />
            <img className="hh-home-shadow s4" src={shadow3} alt="" />
            <img className="hh-home-character" src={illustration} alt="" />
          </div>
        </div>
        <button type="button" className="hh-home-banner" onClick={onStartProblem}>
          <span className="hh-home-book"><img src={book} alt="" /></span>
          <span className="hh-home-banner-copy"><span>우리집 문제에 대한</span><strong>해결 방법을 찾아 볼까요?</strong></span>
          <img src={arrow} alt="" />
        </button>
      </section>
      <section className="hh-home-section" aria-labelledby="home-categories-title">
        <h2 id="home-categories-title">어떤 문제를 해결할까요?</h2>
        <div className="hh-home-categories">{homeCategories.map(category =>
          <button type="button" key={category.key} onClick={() => onCategory(category.key)}>
            <img src={category.image} alt="" /><span>{category.label}</span>
          </button>)}</div>
      </section>
      <section className="hh-home-section" aria-labelledby="home-popular-title">
        <h2 id="home-popular-title"><span>{month}월</span>에 많이 찾는 문제예요</h2>
        <div className="hh-home-popular">{popularProblems.map(problem =>
          <ListRow className="hh-home-problem" key={problem.id} onClick={() => onProblem(problem.id)}>{problem.title}</ListRow>)}</div>
      </section>
    </div>
  </main>
}
