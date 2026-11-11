import { CatalogContact } from './CatalogContact'
import { GNB } from '../components/ui'
import { catalogPolicy } from './policy'
import { PolicyBody } from './PolicyBody'
import release from './app-release.json'
import crab from '../app-screens/my/assets/profile-w10.png'
import edit from '../app-screens/my/assets/edit-profile.svg'
import '../app-screens/my/my.css'
import './my.css'

export type CatalogMyPage = 'data' | 'ai' | 'contact'
export function CatalogMy({nickname,onBack,onEdit,onPage,notice}:{nickname:string;onBack:()=>void;onEdit:()=>void;onPage:(page:CatalogMyPage)=>void;notice:string}) {
  return <main className="hh-my hh-catalog-my" aria-label="마이 페이지">
    <GNB title="마이 페이지" onBack={onBack}/>
    <div className="hh-my-content">
      <section className="hh-my-profile" aria-label="내 프로필">
        <div className="hh-my-identity"><h1>{nickname}</h1><button type="button" aria-label="닉네임 수정" onClick={onEdit}><img src={edit} alt=""/></button></div>
        <div className="hh-my-art"><img src={crab} alt=""/></div>
      </section>
      <section className="hh-my-data" aria-labelledby="catalog-my-data"><h2 id="catalog-my-data">데이터</h2>
        <div className="hh-my-menu">
          <div className="hh-catalog-my-version"><span>앱 버전</span><span className="hh-my-version">v {release.versionName}</span></div>
          <a href="https://xamxam33.notion.site/41402821a7f3803ba78afd29cdfbea36" target="_blank" rel="noopener noreferrer">개인정보 및 데이터 관리<span className="ui-sr-only"> (외부 링크, 새 창)</span></a>
          <a href="https://xamxam33.notion.site/41402821a7f3808b8575dc3b877d7763" target="_blank" rel="noopener noreferrer">이용약관<span className="ui-sr-only"> (외부 링크, 새 창)</span></a>
          <a href="https://xamxam33.notion.site/41402821a7f3805bb89cccccd63ec5a6" target="_blank" rel="noopener noreferrer">개인정보 처리방침<span className="ui-sr-only"> (외부 링크, 새 창)</span></a>
          <a href="https://xamxam33.notion.site/41402821a7f380a4a636e926d3faa4ce" target="_blank" rel="noopener noreferrer">서비스 제공 방식<span className="ui-sr-only"> (외부 링크, 새 창)</span></a>
          <button type="button" onClick={()=>onPage('contact')}>문의하기</button>
        </div>
      </section>
      {notice&&<p className="text-caption-rg" role="status">{notice}</p>}
    </div>
  </main>
}
export function CatalogMyDetail({page,onBack,notice}:{page:CatalogMyPage;onBack:()=>void;notice:string}) {
  if (page === 'contact') return <CatalogContact onBack={onBack} />
  const title={data:'개인정보 및 데이터 관리',ai:'서비스 제공 방식',contact:'문의하기'}[page]
  return <main className="hh-my hh-catalog-my"><GNB title={title} onBack={onBack}/>
    <div className="hh-my-content hh-catalog-my-detail">
      <PolicyBody paragraphs={catalogPolicy[page]}/>
      {notice&&<p role="status">{notice}</p>}
    </div>
  </main>
}
