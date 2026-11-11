import { HomeIllustration } from './HomeIllustration'
import { ListRow } from '../../components/ui'
import { HomePressButton } from './HomePressButton'
import logo from './assets/imgVector132Stroke.svg'
import profile from './assets/imgIconProfile.svg'
import book from './assets/w10-imgIconBook.svg'
import arrow from './assets/w10-imgIconArrowRight.svg'
import boiler from './assets/w10-imgIcon.svg'
import bathroom from './assets/w10-imgIcon1.svg'
import refrigerator from './assets/w10-imgIcon2.svg'
import water from './assets/w10-imgIcon3.svg'
import electricity from './assets/w10-imgIcon4.svg'
import washer from './assets/w10-imgIcon5.svg'
import pests from './assets/w10-imgIcon6.svg'
import mold from './assets/w10-imgIcon7.svg'
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
  catalogOnly?: boolean
  nickname: string
  month: number
  popularProblems: readonly PopularProblem[]
  onProfile: () => void
  onStartProblem: () => void
  onCategory: (category: HomeCategoryKey) => void
  onProblem: (id: string) => void
}

export function HomeScreen({ nickname, month, popularProblems, onProfile, onStartProblem, onCategory, onProblem, catalogOnly = false }: HomeScreenProps) {
  return <main className="hh-home" aria-label="어쩌집 홈">
    <header className="hh-home-header">
      <img src={logo} alt="어쩌집" />
      <HomePressButton type="button" className="hh-home-profile" aria-label="마이 페이지" onClick={onProfile}><img src={profile} alt="" /></HomePressButton>
    </header>
    <div className="hh-home-content">
      <div className="hh-home-greeting">
        <h1><span>{nickname}</span> 님!</h1>
        <p>어떤 도움이 필요하세요?</p>
      </div>
      <section className="hh-home-help" aria-label={catalogOnly ? '기존 사례 검색' : '직접 문제 작성'}>
        <div className="hh-home-art" aria-hidden="true">
          <HomeIllustration />
        </div>
        <HomePressButton type="button" className="hh-home-banner" onClick={onStartProblem}>
          <span className="hh-home-book"><img src={book} alt="" /></span>
          <span className="hh-home-banner-copy"><span>{catalogOnly ? '어떤 문제가 생겼나요?' : '우리집 문제에 대한'}</span><strong>{catalogOnly ? '비슷한 사례를 찾아볼까요?' : '해결 방법을 찾아볼까요?'}</strong></span>
          <img src={arrow} alt="" />
        </HomePressButton>
      </section>
      <section className="hh-home-section" aria-labelledby="home-categories-title">
        <h2 id="home-categories-title">어떤 문제를 해결할까요?</h2>
        <div className="hh-home-categories">{homeCategories.map(category =>
          <HomePressButton type="button" key={category.key} onClick={() => onCategory(category.key)}>
            <img src={category.image} alt="" /><span>{category.label}</span>
          </HomePressButton>)}</div>
      </section>
      <section className="hh-home-section" aria-labelledby="home-popular-title">
        <h2 id="home-popular-title"><span>{month}월</span>에 많이 찾는 문제예요</h2>
        <div className="hh-home-popular">{popularProblems.map(problem =>
          <ListRow className="hh-home-problem" key={problem.id} onClick={() => onProblem(problem.id)}>{problem.title}</ListRow>)}</div>
      </section>
    </div>
  </main>
}
