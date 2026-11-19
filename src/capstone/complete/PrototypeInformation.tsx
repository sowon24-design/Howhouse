import { GNB } from '../../components/ui'
import { PolicyBody } from '../../catalog/PolicyBody'
import { prototypePolicy } from './prototype-policy'
import { InformationScreen, type InformationPage } from '../../app-screens/my/InformationScreen'
import '../../app-screens/my/information.css'

const titles={app:'앱 정보',data:'개인정보 및 데이터 관리',terms:'이용약관',privacy:'개인정보 처리방침',ai:'AI 활용 정보'}
/** Same existing information-screen structure, with the reviewed prototype documents. */
export function PrototypeInformation({page,onBack}:{page:InformationPage;onBack:()=>void}){
 if(page==='contact')return <InformationScreen page={page} onBack={onBack}/>
 const documents=page==='app'?prototypePolicy.data:page==='data'?[...prototypePolicy.data,'## 개인정보 수집·이용 동의',...prototypePolicy.consent,'## 개인정보 국외 이전 동의',...prototypePolicy.transfer]:prototypePolicy[page]
 return <main className={'hh-information hh-information--'+page} aria-label={titles[page]}>
  <div className="hh-information-header"><GNB title={titles[page]} onBack={onBack}/></div>
  <div className="hh-information-scroll" role="region" tabIndex={0} aria-label={titles[page]+' 본문'}><section className="hh-information-sections"><h1>{titles[page]}</h1><div className="hh-information-paragraphs"><PolicyBody paragraphs={documents}/></div></section></div>
 </main>
}
