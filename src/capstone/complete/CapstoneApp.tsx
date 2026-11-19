import { Children, cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Scene, css } from './Scene'
import type { NodeInfo, SceneAdapter } from './Scene'
import { screens } from './screens'
import type { ScreenId } from './screens'
import { canPublish, findPosts, postKinds, postTime, rememberQuery, toggleLike, validNickname } from './model'
import type { CommunityPost } from './model'
import { useAndroidBack, useAndroidBackBridge, minimizeAndroidApp } from '../../app-screens/android-back'
import { selectNativePhotos } from '../../app-screens/problem/native-photos'
import { Capacitor } from '@capacitor/core'
import { createHttpAnalysisClient, serializeCatalog } from '../../analysis'
import type { AnalysisHandle, AnalysisResult, GeneratedSolution, AnalysisInput, AnalysisEvent } from '../../analysis'
import { categories, getCategoryCases, getSolutionById, solutionCases } from '../../solutions/data'
import { SolutionStep } from '../../components/ui/SolutionStep'
import { InformationScreen } from '../../app-screens/my/InformationScreen'
import type { SolutionView } from '../../solutions/data/types'
import { CommunityCard, figmaAsset } from './CommunityCard'
import { CommunityComment } from './CommunityComment'
import { CommentComposer } from './CommentComposer'
import likedHeart from './assets/800b4df4-347c-41c2-b2bb-5d2e13a11615.svg'
import unlikedHeart from './assets/360726bd-00a6-43ab-a9ed-3497746c8752.svg'
import { searchCases } from '../../catalog/search-cases'
import { DurationWheel } from './DurationWheel'
import { Accordion } from '../../components/ui/Accordion'
import { ListRow, MessageButton } from '../../components/ui/Rows'
import { copyMessageResult } from '../../solutions/message-model'
import { writePrototypeClipboard } from './clipboard'
import { ConnectivityBoundary } from '../../analysis/ConnectivityBoundary'
import { OnboardingPreview } from '../../app-screens/onboarding/OnboardingPreview'
import { SystemPreview } from '../../app-screens/system/SystemPreview'
import { VideoPreview } from '../../solutions/VideoPreview'
import '../../solutions/b02.css'
import CatalogApp from './PrototypeCatalogApp'
import { AnalysisResultFlow } from './PrototypeResultFlow'
import { mainRoute } from './main-routing'
import { BottomNavigation } from './BottomNavigation'
import { PrototypeInformation } from './PrototypeInformation'
import { CommunityProvider,useCommunityStore } from './CommunityStore'
import { CommunitySort } from './CommunitySort'

const S={home:'336:27446',categories:'336:27506',community:'336:28651',my:'336:30827',write:'336:30472',detail:'336:29273',own:'336:29511',postMenu:'336:29391',deletePost:'336:29630',report:'336:29883',reportText:'336:30034',reportReady:'336:30189',reported:'336:30344',edit:'336:31089',picker:'336:31200',avatar:'441:16314',mind:'336:30955',logout:'336:31894',withdraw:'336:32026',withdrawText:'336:32096',withdrawReady:'336:32170',withdrawConfirm:'336:32244',withdrawDone:'336:32332',contact:'1047:19095',mine:'336:31289',commented:'336:31329',solved:'336:31369',recent:'336:31416',solution:'1042:11167',solvedSheet:'1042:13830',notSolvedSheet:'1042:13929',solutionReport:'1042:14028',solutionReported:'1042:14266',done:'1042:13541',message:'1042:13183',company:'1042:13324',sentences:'1042:13371',copied:'1042:13133',input:'1042:10739',attach:'1042:10786',pending:'1042:10495',failed:'1042:10570',confirm:'1042:10606',more:'1042:10685',limit:'1042:10649',caseSearch:'336:28787',caseResults:'336:29106',caseEmpty:'336:29193',communitySearch:'336:28715',communityResults:'336:29043',communityEmpty:'336:29150'} as const satisfies Record<string,ScreenId>
const categoryScreens:Record<string,ScreenId>={'화장실':'1042:12024','보일러':'1042:12068','수도·수질':'1042:12112','세탁기':'1042:12155','전기·조명':'1042:12200','냉장고':'1042:12244','해충':'1042:12286','곰팡이':'1042:12328'}
const ids=new Set(Object.keys(screens))
const is=idCheck
function idCheck(id:ScreenId,values:readonly string[]){return values.includes(id)}
function readHash(){const hash=decodeURIComponent(location.hash.slice(1));if(hash==='analysis-result')return S.solution;if(hash.startsWith('community-post/'))return S.detail;const alias=(S as Record<string,string>)[hash];return (alias??(hash.startsWith('screen/')?hash.slice(7):hash.startsWith('frame/')?hash.slice(6):S.home)) as ScreenId}
function saveProfile(nickname:string,years:number,months:number){try{localStorage.setItem('howhouse-capstone-profile-v1',JSON.stringify({nickname,years,months}));const main=JSON.parse(localStorage.getItem('howhouse.catalog.profile.v1')??'null');if(main)localStorage.setItem('howhouse.catalog.profile.v1',JSON.stringify({...main,nickname}))}catch{/* Memory flow remains usable. */}}
function readProfile(){try{const profile=JSON.parse(localStorage.getItem('howhouse-capstone-profile-v1')??'null')??{nickname:'김서윤',years:1,months:2};const main=JSON.parse(localStorage.getItem('howhouse.catalog.profile.v1')??'null');return {...profile,nickname:main?.nickname??profile.nickname}}catch{return {nickname:'김서윤',years:1,months:2}}}
const directSearch=(frame:ScreenId)=>is(frame,[S.caseSearch,S.caseResults,S.caseEmpty,'336:28859','336:28971',S.communitySearch,S.communityResults,S.communityEmpty,'336:32777','336:28899'])

// Main owns all overlapping release routes. Figma additions never replace them.
export default function CapstoneApp(){
 return <CommunityProvider owner={readProfile().nickname}><CapstoneRouter/></CommunityProvider>
}
function CapstoneRouter(){
 const [hash,setHash]=useState(location.hash)
 useEffect(()=>{const sync=()=>setHash(location.hash);window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync)},[])
 const canonical=mainRoute(hash),main=canonical!==null
 useEffect(()=>{if(canonical!==null&&canonical!==location.hash)location.replace(canonical)},[canonical])
 const navigation=canonical==='#home'?'home':canonical==='#my'?'my':null
 return <><div hidden={!main} data-capstone-main>{main&&<CatalogApp/>}{main&&navigation&&<BottomNavigation selected={navigation}/>}</div><div hidden={main}><ConnectivityBoundary>{(suspended,onConnectionLost)=><CompleteContent suspended={suspended||main} onConnectionLost={onConnectionLost}/>}</ConnectivityBoundary></div></>
}
function CompleteContent({suspended,onConnectionLost}:{suspended:boolean;onConnectionLost:()=>void}){
 const [screen,setScreen]=useState<ScreenId>(()=>{const value=readHash();return ids.has(value)?value:S.home})
 const [auxiliary,setAuxiliary]=useState(location.hash==='#onboarding'?'onboarding':location.hash==='#system'?'system':'')
 const {posts,setPosts}=useCommunityStore()
 const [postId,setPostId]=useState('demo-1'),[kind,setKind]=useState('전체'),[sort,setSort]=useState<'popular'|'recommended'>('popular')
 const [query,setQuery]=useState(''),[history,setHistory]=useState<string[]>(['누수','곰팡이','보일러 누수'])
 const [draft,setDraft]=useState({kind:'',title:'',body:'',tags:''}),[postPhotos,setPostPhotos]=useState<string[]>([]),[comment,setComment]=useState('')
 const [editingPostId,setEditingPostId]=useState<string|null>(null)
 const [postMenuOpen,setPostMenuOpen]=useState(false),[commentOpen,setCommentOpen]=useState(false)
 useEffect(()=>{setPostMenuOpen(false);setCommentOpen(false)},[postId])
 useEffect(()=>{if(!screens[screen].name.startsWith('C03')){setPostMenuOpen(false);setCommentOpen(false)}},[screen])
 useEffect(()=>{
  const dismiss=(event:PointerEvent)=>{if(!(event.target as Element).closest('[data-name^="Post menu"],[data-post-menu-trigger]'))setPostMenuOpen(false)}
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){setPostMenuOpen(false);setCommentOpen(false)}}
  document.addEventListener('pointerdown',dismiss);document.addEventListener('keydown',escape)
  return()=>{document.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',escape)}
 },[])
 const profile=useRef(readProfile()),[nickname,setNickname]=useState<string>(profile.current.nickname),[years,setYears]=useState<number>(profile.current.years),[months,setMonths]=useState<number>(profile.current.months),[avatar,setAvatar]=useState('')
 const [reportReason,setReportReason]=useState(''),[reportBody,setReportBody]=useState(''),[withdrawReasons,setWithdrawReasons]=useState<string[]>([]),[withdrawBody,setWithdrawBody]=useState('')
 const [message,setMessage]=useState<string|null>(null),[companyMessage,setCompanyMessage]=useState<string|null>(null),[phrases,setPhrases]=useState<string[]>(['0','1','2'])
 const phraseTexts=useRef(new Map<string,string>())
 const [recipient,setRecipient]=useState<'landlord'|'company'>('landlord')
 const [solved,setSolved]=useState<string[]>([]),[recent,setRecent]=useState<string[]>([]),[selectedCase,setSelectedCase]=useState<SolutionView|GeneratedSolution>()
 const [analysisInput,setAnalysisInput]=useState<AnalysisInput>({analysisUserText:'',analysisUserPhotos:[]}),[analysisResult,setAnalysisResult]=useState<AnalysisResult<GeneratedSolution>|null>(null)
 const analysisPhotoUrls=useMemo(()=>analysisInput.analysisUserPhotos.map(file=>URL.createObjectURL(file)),[analysisInput.analysisUserPhotos])
 useEffect(()=>()=>analysisPhotoUrls.forEach(url=>URL.revokeObjectURL(url)),[analysisPhotoUrls])
 const [information,setInformation]=useState<React.ComponentProps<typeof InformationScreen>['page']|null>(null)
 const [noticeOpen,setNoticeOpen]=useState(false),[writePhotoMode,setWritePhotoMode]=useState(false)
 const routeStack=useRef<ScreenId[]>([]),fileInput=useRef<HTMLInputElement>(null),filePurpose=useRef<'post'|'analysis'|'avatar'>('post')
 const closingTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
 const recoverInput=useRef(false)
 const handle=useRef<AnalysisHandle<GeneratedSolution>|null>(null),activeRequest=useRef<string|null>(null),mounted=useRef(true)
 const client=useRef<ReturnType<typeof createHttpAnalysisClient>|null>(null)
 if(!client.current)client.current=createHttpAnalysisClient({catalog:serializeCatalog(solutionCases),getSolutionById})
 const post=posts.find(p=>p.id===postId)??posts[0]
 const analysisData=analysisResult?.source==='existing'?getSolutionById(analysisResult.caseId):analysisResult?.solution
 const found=findPosts(posts,query,kind,sort),tags=draft.tags.split(/[ ,，#]+/).filter(Boolean)
 const publishReady=canPublish(draft.kind,draft.title,draft.body,postPhotos,tags)
 const company=is(screen,[S.company,'1042:13276'])||screen===S.sentences&&recipient==='company'
 const currentMessage=(company?companyMessage:message)??'안녕하세요, 입주자입니다.\n\n싱크대 아래에서 물이 새고 있어요.\n\n수납장을 비우고 주변 물기를 닦았지만 연결부에서 물이 계속 떨어집니다.\n\n가능하신 시간에 확인 부탁드립니다.\n\n감사합니다.'
 useAndroidBackBridge()
 function go(id:ScreenId,replace=false){
  if(!ids.has(id)||closingTimer.current)return
  const navigate=()=>{closingTimer.current=null;if(!replace&&id!==screen&&!dialog)routeStack.current.push(screen);location.hash='screen/'+id;setScreen(id);setInformation(null)}
  const dialog=document.querySelector<HTMLDialogElement>('dialog[data-cg-overlay]')
  if(dialog&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const sheet=dialog.dataset.cgSheet==='true',duration=sheet?320:100;dialog.style.pointerEvents='none';dialog.animate(sheet?[{transform:'translateY(0)'},{transform:'translateY(100%)'}]:[{opacity:1},{opacity:0}],{duration,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});closingTimer.current=setTimeout(navigate,duration)}else navigate()
 }
 function back(){
  if(postMenuOpen){setPostMenuOpen(false);return}
  if(commentOpen){setCommentOpen(false);return}
  if(information){setInformation(null);return}
  if(screen===S.withdrawDone){go(S.home,true);return}
  if(is(screen,[S.mine,S.commented,S.solved,S.recent,S.logout,S.withdraw,S.mind])){go(S.my,true);return}
  if(screen===S.sentences){go(company?S.company:S.message,true);return}
  if(screens[screen].name.startsWith('B03')||screens[screen].name.startsWith('B05')){const solutionIndex=routeStack.current.lastIndexOf(S.solution);if(solutionIndex>=0)routeStack.current.splice(solutionIndex);go(S.solution,true);return}
  if(screen===S.pending){cancelAnalysis();go(S.input,true);return}
  if(screen===S.home){minimizeAndroidApp();return}
  const parent=routeStack.current.pop();go(parent??(screens[screen].name.startsWith('C')?S.community:S.home),true)
 }
 useAndroidBack(back,!auxiliary&&!suspended&&!(screen===S.solution&&!!selectedCase))
 useEffect(()=>{const sync=()=>{setAuxiliary(location.hash==='#onboarding'?'onboarding':location.hash==='#system'?'system':'');let next=readHash();if(location.hash.startsWith('#community-post/')){const item=posts.find(post=>post.id===decodeURIComponent(location.hash.slice('#community-post/'.length)));if(item){setPostId(item.id);next=item.mine?S.own:S.detail;routeStack.current=[S.home]}else next=S.community}if(ids.has(next)){if(activeRequest.current&&next!==S.pending)cancelAnalysis();if(['#home','#categories','#community','#my'].includes(location.hash))routeStack.current=[];setScreen(next)}};sync();window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync)},[posts])
 useEffect(()=>{if(suspended){if(activeRequest.current){recoverInput.current=true;cancelAnalysis();setScreen(S.input)}}else if(recoverInput.current){recoverInput.current=false;go(S.input,true)}},[suspended])
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;activeRequest.current=null;handle.current?.cancel();if(closingTimer.current)clearTimeout(closingTimer.current)}},[])
 useEffect(()=>{if(!is(screen,[S.copied,'1042:13276']))return;const timer=setTimeout(()=>go(company?S.company:S.message,true),3000);return()=>clearTimeout(timer)},[screen])
 function cancelAnalysis(){activeRequest.current=null;handle.current?.cancel();handle.current=null}
 function analyze(){
  if(!analysisInput.analysisUserText.trim()&&!analysisInput.analysisUserPhotos.length)return
  cancelAnalysis()
  const receive=(event:AnalysisEvent<GeneratedSolution>)=>{
   if(!mounted.current)return
   if(event.status==='running'){activeRequest.current=event.requestId;go(S.pending);return}
   if(event.requestId!==activeRequest.current)return
   activeRequest.current=null
   if(event.status==='succeeded'){setAnalysisResult(event.result);go(S.confirm,true)}
   else if(event.status==='failed'){if(event.error.code==='connection-error'){go(S.input,true);onConnectionLost()}else go(event.error.code==='budget-limit'?S.limit:S.failed,true)}
  }
  handle.current=client.current!.startAnalysis({...analysisInput,analysisUserPhotos:[...analysisInput.analysisUserPhotos]},receive)
 }
 function openCase(data?:SolutionView|GeneratedSolution){if(data?.source==='existing'){location.hash='case/'+encodeURIComponent(data.id);return}if(!data)return;setSelectedCase(data);setRecent(previous=>[data.id,...previous.filter(id=>id!==data.id)].slice(0,20));setMessage(data.contacts.landlord.sentences.join('\n\n'));setCompanyMessage(data.contacts.company.sentences.join('\n\n'));location.hash='analysis-result';setScreen(S.solution)}
 function openResult(){const data=analysisResult?.source==='existing'?getSolutionById(analysisResult.caseId):analysisResult?.solution;openCase(data)}
 function openPost(p=post){if(!p)return;setPostMenuOpen(false);setCommentOpen(false);setPostId(p.id);go(p.mine?S.own:S.detail)}
 function search(){setHistory(previous=>rememberQuery(previous,query));const community=screens[screen].name.startsWith('C');go(community?(found.length?S.communityResults:S.communityEmpty):(searchCases(solutionCases,query).length?S.caseResults:S.caseEmpty))}
 async function selectPhoto(purpose:'post'|'analysis'|'avatar',source:'camera'|'gallery'){
  filePurpose.current=purpose
  if(Capacitor.getPlatform()!=='android'){if(fileInput.current){fileInput.current.multiple=purpose!=='avatar';fileInput.current.capture=source==='camera'?'environment':'';fileInput.current.click()}return}
  try{const count=purpose==='avatar'?1:5-(purpose==='post'?postPhotos.length:analysisInput.analysisUserPhotos.length);if(count<1)return;const files=await selectNativePhotos(source,count);acceptPhotos(files,purpose)}catch{/* Cancel leaves the draft unchanged. */}
 }
 function acceptPhotos(files:File[],purpose=filePurpose.current){
  const valid=files.filter(file=>file.type.startsWith('image/')&&file.size>0&&file.size<=4*1024*1024)
  if(purpose==='avatar'){if(valid[0])setAvatar(URL.createObjectURL(valid[0]));go(S.edit,true)}
  else if(purpose==='analysis'){setAnalysisInput(previous=>({...previous,analysisUserPhotos:[...previous.analysisUserPhotos,...valid].slice(0,5)}));go(S.input,true)}
  else{setPostPhotos(previous=>[...previous,...valid.map(file=>URL.createObjectURL(file))].slice(0,5));go(S.write,true);setWritePhotoMode(false)}
 }
 async function copyMessage(){const result=await copyMessageResult(currentMessage,writePrototypeClipboard);if(result.status==='success')go(company?'1042:13276':S.copied)}
 function submitPost(){if(!publishReady)return;const id=editingPostId??crypto.randomUUID();const existing=posts.find(p=>p.id===id);const item:CommunityPost={id,kind:draft.kind as CommunityPost['kind'],title:draft.title.trim(),body:draft.body.trim(),photos:postPhotos,tags,author:nickname,mine:true,likes:existing?.likes??0,liked:existing?.liked??false,created:Date.now(),comments:existing?.comments??[]};setPosts(previous=>editingPostId?previous.map(p=>p.id===id?item:p):[item,...previous]);setEditingPostId(null);setPostId(id);setDraft({kind:'',title:'',body:'',tags:''});setPostPhotos([]);go(S.own)}
 function submitComment(){if(!comment.trim()||!post)return;const value={id:crypto.randomUUID(),author:nickname,body:comment.trim(),mine:true};setPosts(previous=>previous.map(p=>p.id===postId?{...p,comments:[...p.comments,value]}:p));setComment('')}
 function handleText(text:string):(()=>void)|undefined{
  const t=text.trim()
  if(t==='수정하기'&&screen===S.my)return undefined // Address editor is not supplied in the target section.
  const exact:Record<string,()=>void>={
   '글쓰기':()=>{setEditingPostId(null);go(S.write)},'글 올리기':submitPost,'신고하기':()=>go(S.report),'신고 완료하기':()=>{if(reportReason&&(!reportReason.includes('직접')||reportBody.trim()))go(S.reported)},'의견 보내기':()=>{if(reportReason&&(!reportReason.includes('직접')||reportBody.trim()))go(S.solutionReported)},
   '확인했어요':()=>go(screens[screen].name.startsWith('C')?(post?.mine?S.own:S.detail):screens[screen].name.startsWith('B')?S.solution:S.my,true),
   '내가 작성한 글':()=>go(S.mine),'댓글 단 글':()=>go(S.commented),'내가 해결한 문제':()=>go(S.solved),'최근 열람한 사례':()=>go(S.recent),
   '로그아웃':()=>go(S.logout),'회원 탈퇴':()=>go(S.withdraw),'문의하기':()=>go(S.contact),'마음 평수':()=>go(S.mind),'수정하기':()=>{if(screen===S.sentences){(company?setCompanyMessage:setMessage)(phrases.map(key=>phraseTexts.current.get(key)??'').filter(Boolean).join('\n\n'));go(company?S.company:S.message,true);return}if(screen===S.picker){go(S.edit,true);return}if(validNickname(nickname)){saveProfile(nickname,years,months);go(S.my)}else go('336:31141')},
   '사진 찍기':()=>{void selectPhoto(screen===S.avatar?'avatar':writePhotoMode?'post':'analysis','camera')},'사진 보관함에서 선택하기':()=>{void selectPhoto(screen===S.avatar?'avatar':writePhotoMode?'post':'analysis','gallery')},'기본 이미지로 변경하기':()=>{setAvatar('');go(S.edit,true)},
   '닫기':back,'취소하기':back,'아니오':back,
   '네':()=>{if(screen===S.deletePost){setPosts(previous=>previous.filter(p=>p.id!==postId));go(S.community)}else if(screen===S.withdrawConfirm){go(S.withdrawDone)}else if(screen===S.logout){go(S.home)}},
   '계정 삭제하기':()=>{if(withdrawReasons.length&&(!withdrawReasons.includes('직접 입력하기')||withdrawBody.trim()))go(S.withdrawConfirm)},'홈으로 돌아가기':()=>go(screen===S.solvedSheet?S.done:S.home),'확인하기':()=>go(S.home),'화면 나가기':()=>go(S.home,true),
   '괜찮아요':()=>go(S.home),'네, 공유할래요!':()=>{setDraft({kind:'해결 후기',title:selectedCase?.title??'싱크대 누수',body:selectedCase?.steps.map(step=>step.description).join('\n')??'',tags:''});go(S.write)},
   '메시지 복사하기':()=>{void copyMessage()},'복사하기':()=>{void copyMessage()},'해결됐어요':()=>{if(selectedCase)setSolved(previous=>[...new Set([...previous,selectedCase.id])]);go(S.solvedSheet)},'해결이 어려워요':()=>go(S.notSolvedSheet),
   '문제 분석하기':analyze,'분석하기':analyze,'다시 문제 알려주기':()=>go(S.input),'문제 상황 더 알려주기':()=>go(S.input),'지금 해야 할 일 보러 가기':openResult,'이 문제가 맞아요':openResult,'이 문제가 아니에요':()=>go(S.more),
  }
  if(exact[t])return exact[t]
  if(t==='더 보기'||t==='더보기')return()=>go(screen===S.my?S.recent:S.community)
  if(/어떤 문제를|찾는 글이 있나요|문제 검색|글 검색/.test(t)&&t.length<35)return()=>{setQuery('');go(screen===S.community?S.communitySearch:S.caseSearch)}
  if(t.includes('해결 방법을 찾아볼까요'))return()=>go(S.input)
  if(t.includes('메시지에 넣을 내용을 선택'))return()=>go(S.sentences)
  if(t.includes('문의')&&/메시지|메세지/.test(t))return()=>go(S.message)
  if(t.includes('다른 해결 방법')||t.includes('계속 해결'))return()=>go(S.solution,true)
  if(t.includes('도움됐어요'))return()=>{if(post)setPosts(previous=>previous.map(p=>p.id===postId?toggleLike(p):p))}
  if(t==='댓글 11'||t.startsWith('댓글 '))return()=>{setCommentOpen(true);document.querySelector<HTMLTextAreaElement>('[data-comment-input]')?.focus()}
  if(t==='집주인')return()=>{setRecipient('landlord');go(S.message)}
  if(t==='전문 업체')return()=>{setRecipient('company');go(S.company)}
  if(t==='이메일 보내기')return()=>{location.href='mailto:happytanglee@gmail.com'}
  if(t==='기본 프로필로 되돌리기')return()=>{setAvatar('');go(S.edit,true)}
  if(t==='앱 버전')return()=>setInformation('app')
  if(t==='개인정보 및 데이터 관리')return()=>setInformation('data')
  if(t==='서비스 제공 방식')return()=>setInformation('ai')
  if(categoryScreens[t])return()=>go(categoryScreens[t])
  return undefined
 }
 function action(n:NodeInfo):(()=>void)|undefined{
  if(screens[screen].name.startsWith('C03')&&n.parents.at(-1)?.name==='Reactions')return n.text.includes('도움됐어요')?()=>{if(post)setPosts(previous=>previous.map(p=>p.id===postId?toggleLike(p):p))}:()=>setCommentOpen(true)
  if(screens[screen].name.startsWith('C03')&&n.parents.some(p=>p.name==='Reactions'))return
  if(screen===S.categories){
   if(n.parents.some(parent=>categoryScreens[parent.name]))return
   if(categoryScreens[n.name])return()=>go(categoryScreens[n.name])
  }
  if(n.parents.some(p=>p.name==='Navigation Bar'))return
  if(n.parents.some(p=>['Button','List','Action','Write post','Chip','Message Button'].includes(p.name)))return
  if(n.parents.at(-1)?.name==='GNB'&&n.index===0&&screen!==S.home&&screen!==S.community&&screen!==S.my)return back
  if(n.name==='Icon/Kebab')return()=>{setPostMenuOpen(previous=>!previous);if(!post?.mine&&screen!==S.postMenu)go(S.postMenu,true)}
  if(n.name==='Icon/Send'||(n.name==='Button'&&n.parents.some(p=>p.name==='CommunityDetail')))return submitComment
  if(directSearch(screen)&&(n.id==='408:3708'||/Icon.*(Search|Magnifier|search)/.test(n.name)))return search
  if(directSearch(screen)&&n.name==='Icon/X-mark')return()=>setQuery('')
  if(n.name==='Icon/Thums up')return()=>go(S.solvedSheet)
  if(n.name==='Icon/Thums down')return()=>go(S.solutionReport)
  if(n.name==='Chip'&&postKinds.some(k=>k===n.text)||n.name==='Chip'&&n.text==='전체')return()=>{if(screens[screen].name.startsWith('C02'))setDraft(previous=>({...previous,kind:n.text}));else setKind(n.text)}
  if(n.name==='Add image'||n.name==='Icon/Plus'||n.name==='Icon/Add'||(n.name==='Photo'&&n.text===''))return()=>{const writing=screens[screen].name.startsWith('C02');setWritePhotoMode(writing);go(writing?'336:30551':S.attach)}
  if(n.name==='Navigation Bar/Community_Post')return()=>openPost()
  if(n.name==='Step heading'&&n.text.includes('자취 기간'))return()=>go(S.picker)
  if(n.text==='1년 2개월'||n.text===`${years}년 ${months}개월`)return()=>go(S.picker)
  if(n.name==='Icon/Setting'||n.name==='Icon/Settings')return()=>go(S.edit)
  if(n.props.className?.split(' ').includes(css('size-[116px]'))&&screens[screen].name.startsWith('D02'))return()=>go(S.avatar)
  if(n.name==='Message Button')return()=>setPhrases(previous=>previous.includes(n.text)?previous.filter(value=>value!==n.text):[...previous,n.text])
  if(n.name==='Icon/Info'&&screen===S.my)return()=>go(S.mind)
  if(n.name==='Icon/Arrow_Left'&&n.parents.some(p=>p.name==='GNB'))return back
  if(n.name==='Icon/X-mark'&&n.parents.some(p=>p.name==='GNB'))return()=>{cancelAnalysis();setAnalysisInput({analysisUserText:'',analysisUserPhotos:[]});go(S.home)}
  if(n.type==='p'&&n.text==='마음 평수')return()=>go(S.mind)
  if(n.name==='List'&&screens[screen].name.startsWith('B02'))return()=>{const item=solutionCases.find(c=>n.text.includes(c.title));openCase(item?getSolutionById(item.id):undefined)}
  if(n.name==='List'&&screen===S.home)return()=>{const item=searchCases(solutionCases,n.text)[0];openCase(item?getSolutionById(item.id):undefined)}
  if(n.name==='Image (햇빛이 드는 창가와 화분)'&&screens[screen].name.startsWith('B04')&&!n.parents.some(parent=>parent.name==='Navigation Bar/Community_Post'))return()=>{const url=selectedCase?.videos[0]?.url;if(url)window.open(url,'_blank','noopener,noreferrer')}
  if(n.name==='Action'&&n.text==='삭제하기')return()=>go(S.deletePost)
  if(n.name==='Action'&&n.text==='수정하기'&&post?.mine)return()=>{setEditingPostId(post.id);setDraft({kind:post.kind,title:post.title,body:post.body,tags:post.tags.join(' ')});setPostPhotos(post.photos);go(S.write)}
  if(n.name==='자취 팁'&&n.text.length<50&&n.parents.some(p=>p.name==='유의사항 아코디언'))return()=>setNoticeOpen(previous=>!previous)
  if(n.type==='p'&&n.text==='개인정보 처리방침')return()=>setInformation('privacy')
  if(n.type==='p'&&n.text==='이용약관')return()=>setInformation('terms')
  if(n.name==='Button'||n.name==='List'||n.name==='Action'||n.name==='Write post'||n.type==='p')return handleText(n.text)
  const reportOptions=['개인정보 또는 사생활 침해','욕설 · 비방 · 괴롭힘','허위 정보 또는 오해를 유발하는 내용','광고 · 도배 · 스팸','불법 콘텐츠 또는 기타 권리 침해','음란 · 선정성','직접 입력하기','내 상황과 달라요.','방법이 틀린 것 같아요.','따라하기 위험해 보여요.','어려워 보여요.','필요한 준비물·정보가 빠졌어요.']
  if(n.type==='div'&&n.props.className?.split(' ').includes(css('py-[8px]'))&&reportOptions.includes(n.text))return()=>{setReportReason(n.text);if(n.text==='직접 입력하기')go(screens[screen].name.startsWith('B')?'1042:14147':S.reportText,true)}
  if(screens[screen].name.startsWith('D14')&&n.type==='div'&&n.props.className?.split(' ').includes(css('py-[12px]'))&&n.text.length<55)return()=>{setWithdrawReasons(previous=>previous.includes(n.text)?previous.filter(v=>v!==n.text):[...previous,n.text]);if(n.text==='직접 입력하기')go(S.withdrawText,true)}
  if(/^[0-9] ?년$/.test(n.text)&&n.type==='p')return()=>setYears(Number(n.text.match(/\d+/)?.[0]))
  if(/^[0-9]+ ?개월$/.test(n.text)&&n.type==='p')return()=>setMonths(Number(n.text.match(/\d+/)?.[0]))
  return undefined
 }
 function input(n:NodeInfo,value:string,change:(value:string)=>void,options:{limit?:number;multiline?:boolean;placeholder?:string;label?:string;onEnter?:()=>void}={}):ReactNode{
  const props={className:(n.props.className??'')+' cg-input','data-node-id':n.id,'aria-label':options.label??options.placeholder??n.text,placeholder:options.placeholder??n.text,value,maxLength:options.limit,onChange:(event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>change(event.target.value),onKeyDown:(event:React.KeyboardEvent)=>{if(event.key==='Enter'&&options.onEnter){event.preventDefault();options.onEnter()}}}
  return options.multiline?<textarea {...props} rows={Math.max(2,value.split('\n').length)} />:<input {...props}/>
 }
 function replace(n:NodeInfo):ReactNode|undefined{
  if(screens[screen].name.startsWith('C03')){
   if(n.name.startsWith('Post menu')&&!postMenuOpen)return null
   if(n.name==='CommunityDetail')return commentOpen?<CommentComposer value={comment} onChange={setComment} onSubmit={submitComment} onClose={()=>setCommentOpen(false)}/>:null
   if(n.type==='img'&&n.parents.some(p=>p.name==='Icon/Heart')&&n.parents.some(p=>p.name==='Reactions'))return <img {...n.props as React.ImgHTMLAttributes<HTMLImageElement>} src={post?.liked?likedHeart:unlikedHeart}/>
  }
  const p=n.parents.at(-1),isWrite=screens[screen].name.startsWith('C02'),isEdit=screens[screen].name.startsWith('D02')
  if(n.name==='자취 팁'&&['인기 순','추천 순','최신 순'].includes(n.text))return <CommunitySort className={n.props.className} value={sort} onChange={setSort}>{n.props.children}</CommunitySort>
  if(screens[screen].name.startsWith('C03')&&post){
   const photoTemplate=Children.toArray(n.props.children).find(child=>isValidElement(child)&&(child.props as Record<string,unknown>)['data-name']==='자취 팁')
   if(isValidElement<{className?:string}>(photoTemplate))return post.photos.length?<div className={n.props.className}>{post.photos.map((src,index)=><div key={src+index} className={photoTemplate.props.className}><img className="cg-post-image" src={src} alt="가상 게시글의 AI 생성 예시 이미지"/></div>)}</div>:null
  }
  if(is(screen,[S.caseResults,S.caseEmpty])&&n.type==='span'&&['배수구','누수'].includes(n.text))return <span className={n.props.className}>{query}</span>
  if(screen===S.caseResults&&n.type==='p'&&/^총 \d+건 있어요\.$/.test(n.text))return <p className={n.props.className}>총 {searchCases(solutionCases,query).length}건 있어요.</p>
  if(screens[screen].name.startsWith('C03')&&post&&!post.id.startsWith('sample')&&n.name==='Supplies'){
   const template=Children.toArray(n.props.children).find(isValidElement)
   if(!isValidElement<{children?:ReactNode}>(template))return null
   const label=Children.toArray(template.props.children).find(isValidElement)
   if(!isValidElement<{children?:ReactNode}>(label))return null
   return <div className={n.props.className}>{post.tags.map((tag,index)=>cloneElement(template,{key:index},cloneElement(label,{},'#'+tag)))}</div>
  }
  if(screens[screen].name.startsWith('B03')&&n.type==='span'&&['수리 기사','집주인'].includes(n.text))return <span className={n.props.className}>{company?'수리 기사':'집주인'}</span>
  if(n.name.startsWith('년 · 선택'))return <DurationWheel value={years} max={50} unit="년" onChange={setYears}/>
  if(n.name.startsWith('개월 · 선택'))return <DurationWheel value={months} max={11} unit="개월" onChange={setMonths}/>
  if(selectedCase&&n.name==='Image (햇빛이 드는 창가와 화분)'&&screens[screen].name.startsWith('B')&&!n.parents.some(parent=>parent.name==='Navigation Bar/Community_Post'))return selectedCase.videos[0]?<div className="cg-case-video"><VideoPreview url={selectedCase.videos[0].url} thumbnail={selectedCase.videos[0].thumbnail} externalIcon={figmaAsset('17922d6b-18ca-4835-a946-ee8038468884.svg')} onOpen={()=>{}}/></div>:null
  if(selectedCase?.photos[0]&&n.type==='img'&&n.parents.some(parent=>parent.name==='Image (화장실 변기)'))return <img {...n.props as React.ImgHTMLAttributes<HTMLImageElement>} src={selectedCase.photos[0].src} style={{width:'100%',height:'100%',top:0,left:0,objectFit:'cover'}}/>
  if(n.name==='Message Button'){const key=String(n.index);phraseTexts.current.set(key,n.text);return <MessageButton selected={phrases.includes(key)} onSelectedChange={()=>setPhrases(previous=>previous.includes(key)?previous.filter(value=>value!==key):[...previous,key])}>{n.text}</MessageButton>}
  if(n.id==='336:27406'||n.id==='336:27390')return <Accordion title="게시글 작성 전 확인해 주세요." open={noticeOpen} onOpenChange={setNoticeOpen}><ul>{['이름, 전화번호, 주소 등 개인정보가 노출되지 않도록 주의해 주세요.','집주인이나 타인의 신상을 공개하거나 비방하는 글은 작성하지 말아 주세요.','확인되지 않은 정보나 잘못된 해결 방법은 사실인 것처럼 단정하지 말아 주세요.','서로 다른 경험과 의견을 존중하며 예의를 지켜 주세요.','사진을 첨부할 때는 개인정보나 타인의 사생활이 노출되지 않았는지 확인해 주세요.'].map(text=><li key={text}>{text}</li>)}</ul></Accordion>
  if(n.name==='Community / Solid list')return <div className={n.props.className}>{found.map(item=><CommunityCard key={item.id} post={item} onOpen={()=>openPost(item)}/>)}</div>
  if((screen===S.mine||screen===S.commented)&&Children.toArray(n.props.children).some(child=>isValidElement(child)&&((child.props as Record<string,unknown>)['data-name']==='Navigation Bar/Community_Post'||typeof child.type==='function'&&child.type.name==='NavigationBarCommunityPost'))){const mine=posts.filter(item=>screen===S.mine?item.mine:item.comments.some(c=>c.mine));return <div className={n.props.className}>{mine.map(item=><CommunityCard key={item.id} post={item} onOpen={()=>openPost(item)}/>)}</div>}
  if(directSearch(screen)&&n.name==='태그'){const label=history[n.index];if(!label)return null;return <div className="cg-history-tag"><button type="button" onClick={()=>{setQuery(label);go(screens[screen].name.startsWith('C')?S.communityResults:S.caseResults)}}>{label}</button><button type="button" aria-label={label+' 검색어 삭제'} onClick={()=>setHistory(previous=>previous.filter(value=>value!==label))}><img src={figmaAsset('90b067a8-b105-4faf-9f88-7014a07760e5.svg')} alt=""/></button></div>}
  if(avatar&&n.type==='img'&&n.parents.some(parent=>parent.name==='image 262'||screen===S.my&&parent.name==='image 8'))return <img {...n.props as React.ImgHTMLAttributes<HTMLImageElement>} src={avatar}/>
  if(screen===S.my&&n.type==='p'&&n.text==='김서윤')return <p className={n.props.className}>{nickname}</p>
  if(screen===S.my&&n.type==='p'&&n.text==='자취 6개월')return <p className={n.props.className}>자취 {years?`${years}년 `:''}{months}개월</p>
  if((screen===S.solved||screen===S.recent)&&n.name==='Message / Content'&&(screen===S.solved?solved.length:recent.length)>0){const list=(screen===S.solved?solved:recent).map(id=>getSolutionById(id)).filter(Boolean);return <div className={n.props.className}>{list.map(item=><button key={item!.id} type="button" className="cg-activity-case" onClick={()=>openCase(item)}>{item!.title}</button>)}</div>}
  const directChildren=Children.toArray(n.props.children)
  const listRows=directChildren.filter(child=>isValidElement(child)&&(child.props as Record<string,unknown>)['data-name']==='List')
  if(screen===S.caseResults&&n.name==='Case list'||!directSearch(screen)&&screens[screen].name.startsWith('B02')&&listRows.length>1){
   const label=Object.entries(categoryScreens).find(([,value])=>value===screen)?.[0],category=categories.find(item=>item.id===label)
   const results=screen===S.caseResults?searchCases(solutionCases,query):category?getCategoryCases(solutionCases,category.id):[]
   const rowClass=isValidElement(listRows[0])?(listRows[0].props as {className?:string}).className:undefined
   return <div className={n.props.className}>{results.map(item=><ListRow key={item.id} className={rowClass} onClick={()=>openCase(getSolutionById(item.id))}>{item.title}</ListRow>)}</div>
  }
  const addPhoto=directChildren.find(child=>isValidElement(child)&&(child.props as Record<string,unknown>)['data-name']==='Add image')
  if(addPhoto&&isValidElement(addPhoto)){
   const analysis=screens[screen].name.startsWith('A02'),photos=analysis?analysisInput.analysisUserPhotos.map((file,i)=>({file,url:analysisPhotoUrls[i]})):postPhotos.map(url=>({url,file:null}))
   return <div className={n.props.className}>{photos.length<5&&<button type="button" className={(addPhoto.props as {className?:string}).className} aria-label="사진 첨부하기" onClick={()=>{setWritePhotoMode(!analysis);go(analysis?S.attach:'336:30551')}}>{(addPhoto.props as {children?:ReactNode}).children}</button>}{photos.map((photo,i)=><div className="cg-new-photo" key={photo.file?.name??photo.url}><img src={photo.url} alt={'첨부 사진 '+(i+1)}/><button className="cg-photo-remove" aria-label={'첨부 사진 '+(i+1)+' 삭제'} onClick={()=>analysis?setAnalysisInput(previous=>({...previous,analysisUserPhotos:previous.analysisUserPhotos.filter((_,j)=>j!==i)})):setPostPhotos(previous=>previous.filter((_,j)=>j!==i))}>×</button></div>)}</div>
  }
  if(n.name==='Message text'&&screens[screen].name.startsWith('A02'))return <div {...n.props as React.HTMLAttributes<HTMLDivElement>}><textarea className="cg-input" aria-label="문제 상황" placeholder="예) 싱크대 안에 물이 새고 안이 젖어 있음" value={analysisInput.analysisUserText} maxLength={6000} rows={3} onChange={event=>setAnalysisInput(previous=>({...previous,analysisUserText:event.target.value}))}/></div>
  if(directSearch(screen)&&n.type==='span'&&n.text==='누수')return <span className={n.props.className}>{query||n.text}</span>
  if(n.name==='Message text')return <div {...n.props as React.HTMLAttributes<HTMLDivElement>}><textarea className="cg-input" aria-label="문의 메시지" value={currentMessage} rows={Math.max(7,currentMessage.split('\n').length)} onChange={event=>(company?setCompanyMessage:setMessage)(event.target.value)}/></div>
  if(isWrite&&n.type==='p'&&p?.text.includes('/60')&&!n.text.includes('/60'))return input(n,draft.title,value=>setDraft(previous=>({...previous,title:value})),{limit:60,placeholder:'제목을 입력해 주세요.',label:'제목',multiline:true})
  if(isWrite&&n.type==='p'&&p?.text.includes('/1000')&&!n.text.includes('/1000'))return input(n,draft.body,value=>setDraft(previous=>({...previous,body:value})),{limit:1000,placeholder:'제목을 입력해 주세요.',label:'내용',multiline:true})
  if(isWrite&&n.text==='0/60')return <p className={n.props.className}>{draft.title.length}/60</p>
  if(isWrite&&n.text==='0/1000')return <p className={n.props.className}>{draft.body.length}/1000</p>
  if(isWrite&&n.type==='p'&&n.text.startsWith('태그를 입력'))return input(n,draft.tags,value=>setDraft(previous=>({...previous,tags:value})),{limit:100})
  if(isWrite&&n.type==='p'&&n.text.startsWith('사진 첨부하기'))return <p className={n.props.className}>사진 첨부하기 ({postPhotos.length}/5)</p>
  if(screens[screen].name.startsWith('A02')&&n.type==='p'&&n.text.startsWith('사진 첨부하기'))return <p className={n.props.className}>사진 첨부하기 ({analysisInput.analysisUserPhotos.length}/5)</p>
  if(isWrite&&n.type==='p'&&n.text.startsWith('태그 ('))return <p className={n.props.className}>태그 ({tags.length}/5)</p>
  if(directSearch(screen)&&n.type==='p'&&(p?.name==='Search'||/어떤 문제를 찾고|어떤 글을 찾고|검색어를 입력/.test(n.text)))return input(n,query,setQuery,{limit:60,onEnter:search})
  if(n.type==='p'&&n.text==='댓글을 입력해주세요')return <input className={(n.props.className??'')+' cg-input'} data-comment-input aria-label="댓글" placeholder={n.text} value={comment} maxLength={1000} onChange={event=>setComment(event.target.value)} onKeyDown={event=>{if(event.key==='Enter')submitComment()}}/>
  if(isEdit&&n.type==='p'&&p?.text.includes('/10')&&!n.text.includes('/10'))return input(n,nickname,setNickname,{limit:10,placeholder:'닉네임'})
  if(isEdit&&n.type==='p'&&n.text.endsWith('/10'))return <p className={n.props.className}>{nickname.length}/10</p>
  if(n.type==='p'&&n.text==='1년 2개월')return <p className={n.props.className} role="button" tabIndex={0} onClick={()=>go(S.picker)}>{years}년 {months}개월</p>
  if((screen===S.reportText||screen===S.reportReady||screen==='1042:14147'||screen===S.solutionReport)&&n.type==='p'&&(/신고 사유가|아쉬운 점이|^그냥$/.test(n.text)))return input(n,reportBody,setReportBody,{multiline:true,limit:1000})
  if(screens[screen].name.startsWith('D14')&&n.type==='p'&&n.text==='탈퇴 이유를 알려주세요.')return input(n,withdrawBody,setWithdrawBody,{multiline:true,limit:1000})
  if(is(screen,[S.input,S.attach,'1042:10835','1042:10887'])&&n.type==='p'&&p?.text.includes('문제')&&n.text.length>50&&!n.text.includes('분석'))return input(n,analysisInput.analysisUserText,value=>setAnalysisInput(previous=>({...previous,analysisUserText:value})),{multiline:true,limit:6000})
  if(n.name==='Steps'&&selectedCase)return <div className={n.props.className}><SolutionStep number={0} title="필요한 물건을 준비해요" description="" materials={selectedCase.supplies.map((label,i)=>({id:String(i),label}))}/>{selectedCase.steps.map(step=><SolutionStep key={step.number} number={step.number} title={step.title} description={step.description}/>)}</div>
  if((selectedCase||analysisData)&&n.type==='p'&&['싱크대에서물이새요','싱크대누수'].includes(n.text.replace(/\s/g,'')))return <p className={n.props.className}>{(screens[screen].name.startsWith('A06')?analysisData:selectedCase)?.title??n.text}</p>
  if((selectedCase||analysisData)&&n.type==='p'&&n.text.startsWith('대부분 배수 호스'))return <p className={n.props.className}>{(screens[screen].name.startsWith('A06')?analysisData:selectedCase)?.description??n.text}</p>
  if(analysisData&&n.type==='p'&&n.text.startsWith('문제 해결 방법 '))return <p className={n.props.className}>문제 해결 방법 {analysisData.steps.length}단계 제공</p>
  if(selectedCase&&n.type==='p'&&n.text==='20분')return <p className={n.props.className}>{selectedCase.duration}</p>
  if(selectedCase&&n.type==='p'&&n.text==='세입자')return <p className={n.props.className}>{selectedCase.responsibility}</p>
  if(screens[screen].name.startsWith('C03')&&post&&n.type==='p'){
   if(n.text==='2시간 전'&&n.parents.some(parent=>parent.name==='Post metadata'))return <p className={n.props.className}>{postTime(post.created)}</p>
   if(!post.id.startsWith('sample')&&n.text==='김서윤'&&n.parents.some(parent=>parent.name==='Post metadata'))return <p className={n.props.className}>{post.author}</p>
   if(n.text==='도움됐어요 6')return <p className={n.props.className}>도움됐어요 {post.likes}</p>
   if(n.text==='댓글 11')return <p className={n.props.className}>댓글 {post.comments.length}</p>
   if(!post.id.startsWith('sample')&&n.text==='자취생 꿀팁!')return <p className={n.props.className}>{post.title}</p>
   if(!post.id.startsWith('sample')&&n.text.startsWith('수리 기사님을 부르기 전에'))return <p className={n.props.className}>{post.body}</p>
   if(!post.id.startsWith('sample')&&n.text.startsWith('직접 해보니 한 번에'))return null
  }
  return undefined
 }
 const adapter:SceneAdapter={action,replace,decorate:n=>{
  const extra:Record<string,unknown>={}
  if(directSearch(screen)&&n.id==='408:3708')extra['aria-label']='검색'
  if(screens[screen].name.startsWith('C03')&&n.name==='Icon/Kebab'){extra['data-post-menu-trigger']=true;extra['aria-expanded']=postMenuOpen;extra['aria-label']='글 메뉴'}
  if(screens[screen].name.startsWith('C03')&&n.parents.at(-1)?.name==='Reactions'){
   extra['aria-label']=n.text.includes('도움됐어요')?`도움됐어요 ${post?.likes??0}`:`댓글 ${post?.comments.length??0}`
   if(n.text.includes('도움됐어요')){extra.style={...n.props.style,backgroundColor:post?.liked?'#fce3e3':'var(--color-neutral,#e9eef7)'};extra['aria-pressed']=!!post?.liked}
  }
  if(n.name==='Chip'){const selected=n.text===(screens[screen].name.startsWith('C02')?draft.kind:kind);extra.className=(n.props.className??'')+(selected?' cg-selected':' cg-chip-unselected');extra['aria-pressed']=selected;extra['data-chip-selected']=selected}
  if(n.name==='Button'&&n.text==='글 올리기'){extra['data-ready']=publishReady;extra.disabled=!publishReady}
  if(n.name==='Button'&&n.text==='문제 분석하기'){extra['data-ready']=!!analysisInput.analysisUserText.trim()||analysisInput.analysisUserPhotos.length>0;extra.disabled=!extra['data-ready']}
  if(n.name==='Button'&&['신고 완료하기','의견 보내기'].includes(n.text)){extra['data-ready']=!!reportReason&&(!reportReason.includes('직접')||!!reportBody.trim());extra.disabled=!extra['data-ready']}
  if(n.name==='Button'&&n.text==='계정 삭제하기'){extra['data-ready']=withdrawReasons.length>0&&(!withdrawReasons.includes('직접 입력하기')||!!withdrawBody.trim());extra.disabled=!extra['data-ready']}
  if(n.name==='유의사항 아코디언')extra['data-expanded']=noticeOpen
  if(n.name==='Message Button'&&phrases.includes(n.text)){extra.className=(n.props.className??'')+' cg-selected';extra['aria-pressed']=true}
  if(n.name==='Article:margin'&&post&&!post.id.startsWith('sample'))extra.style={display:'none'}
  if(n.type==='div'&&reportReason===n.text&&reportReason){extra.className=(n.props.className??'')+' cg-radio-row';extra['aria-checked']=true}
  if(n.type==='div'&&withdrawReasons.includes(n.text)){extra.className=(n.props.className??'')+' cg-check-row';extra['aria-checked']=true}
  return extra
 },append:n=>n.name==='Section'&&screens[screen].name.startsWith('C03')&&post?post.comments.map(item=><CommunityComment key={item.id} comment={item} created={post.created}/>):null}
 if(auxiliary==='onboarding')return <OnboardingPreview onComplete={name=>{setNickname(name);saveProfile(name,years,months);go(S.home)}}/>
 if(auxiliary==='system')return <SystemPreview/>
 if(screen===S.solution&&selectedCase&&!location.hash.startsWith('#frame/'))return <AnalysisResultFlow data={selectedCase} onHome={()=>go(S.home)} onConnectionLost={onConnectionLost}/>
 if(information)return <div className="capstone-complete"><PrototypeInformation page={information} onBack={()=>setInformation(null)}/></div>
 return <main className="capstone-complete" aria-label="어쩌집 캡스톤"><Scene key={screen} id={screen} adapter={location.hash.startsWith('#frame/')?{}:adapter} onBack={back}/><input ref={fileInput} className="cg-native-input" type="file" accept="image/*" onChange={event=>{acceptPhotos(Array.from(event.target.files??[]));event.target.value=''}}/></main>
}
