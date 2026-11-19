export const postKinds = ['도움 요청','자취 팁','수리 책임','해결 후기','기타'] as const
export type PostKind = typeof postKinds[number]
export type CommunityPost = {id:string;kind:PostKind;title:string;body:string;author:string;mine:boolean;likes:number;liked:boolean;created:number;tags:string[];photos:string[];comments:{id:string;author:string;body:string;mine:boolean}[]}
export const sampleBody = '직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.'
/** Fictional demo posts. No real user posts, contact details or remote storage. */
export function initialPosts(owner='김서윤'):CommunityPost[]{
 const rows: [PostKind,string,string,string,boolean,number,string[],string[]][] = [
  ['해결 후기','욕실 배수구, 머리카락부터 정리하니 나아졌어요','샤워 후 발목까지 물이 고여서 당황했어요. 어쩌집의 배수구 막힘 사례를 보고 장갑을 낀 뒤 눈에 보이는 머리카락만 정리했어요.\n\n배수구 안쪽을 분해하지 않고 거름망을 씻어 다시 끼웠더니 물이 전보다 빨리 내려갔어요. 그래도 반복되면 집주인께 점검을 부탁드리려고 해요.',owner,true,18,['욕실','배수구','해결후기'],['저도 거름망을 씻은 뒤 물 빠지는 속도를 먼저 확인해 봐야겠어요.','세정제부터 붓기 전에 눈에 보이는 이물질을 확인하는 게 도움이 됐군요.']],
  ['도움 요청','외출 후 보일러를 켜도 방 한쪽만 차가워요','원룸에 들어온 지 두 달 됐어요. 저녁에 난방을 켜면 문 쪽 바닥은 따뜻한데 침대 아래는 계속 차가워요. 실내 온도 설정과 창문이 닫혔는지는 확인했어요.\n\n분배기나 보일러는 건드리지 않았고, 따뜻한 위치와 차가운 위치를 메모해 두었어요. 집주인께 문의할 때 어떤 내용을 같이 말씀드리면 좋을까요?','온기찾기',false,12,['보일러','난방','집주인문의'],['난방을 켠 시각과 얼마나 기다렸는지도 같이 적어 보내면 설명하기 좋았어요.']],
  ['자취 팁','입주 첫날 찍어 두길 잘한 사진 5가지','짐을 놓기 전에 벽지 얼룩, 바닥 흠집, 창틀, 싱크대 하부, 욕실 실리콘을 찍어 두었어요. 전체 모습 한 장과 가까운 사진 한 장씩 남기니 위치를 설명하기 편했어요.\n\n하자가 의심되는 부분은 날짜와 함께 집주인께 공유했어요. 사진에 도어락 번호나 계약서 개인정보가 찍히지 않았는지도 확인했어요.','첫독립',false,16,['입주','기록','자취준비'],['가구 들어오기 전에 전체 사진을 남기라는 팁이 특히 유용하네요.','주소나 계약서가 보이지 않게 확인하는 것도 챙겨야겠어요.']],
  ['수리 책임','싱크대 아래 물기, 비용 이야기 전에 상태부터 전달했어요','싱크대 수납장 바닥이 젖어 있어 사용을 멈추고 바깥쪽 물기만 닦았어요. 언제부터 보였는지, 물을 쓸 때 생기는지와 사진을 집주인께 보냈어요.\n\n비용을 제가 내야 한다고 먼저 단정하지 않고 원인과 계약 내용을 확인해 달라고 요청했어요. 방문 가능한 시간도 두 가지로 적으니 일정 잡기가 수월했어요.',owner,true,9,['싱크대','누수','수리문의'],['원인 확인과 방문 일정을 먼저 이야기하는 문장으로 써봐야겠어요.']],
  ['자취 팁','작은 냉장고는 벽에 너무 붙이지 않았어요','냉장고 옆에서 웅 하는 소리가 커져서 설명서를 찾아봤어요. 뒷면과 벽 사이에 필요한 간격을 확인하고, 위에 올려 둔 물건과 바닥 수평도 살폈어요.\n\n모델마다 설치 기준이 다르니 인터넷 숫자를 그대로 따르지 않고 제 제품 설명서를 기준으로 했어요. 소리가 계속되면 제조사에 문의할 생각이에요.','작은부엌',false,8,['냉장고','소음','설명서'],['같은 크기 냉장고라도 설명서가 다를 수 있겠네요.']],
  ['해결 후기','환기 습관을 바꾸고 욕실 사진을 비교해 봤어요','샤워 후 바닥 물기를 정리하고 환기한 날짜를 적어 두었어요. 일주일 간격으로 같은 위치를 찍어 보니 실리콘에 물기가 남는 곳을 찾기 쉬웠어요.\n\n아직 곰팡이가 완전히 사라진 건 아니에요. 심한 부분은 직접 덮어 가리지 않고 집주인께 사진과 함께 문의하려고 해요.','바람드는집',false,11,['욕실','환기','곰팡이'],['해결됐다고 단정하지 않고 같은 위치를 비교하는 방법이 좋네요.']],
  ['기타','첫 자취 장보기, 큰 묶음 대신 작은 용량으로 시작했어요','수납장이 작아서 처음 산 대용량 세제를 놓을 곳이 없었어요. 다음부터는 평소 쓰는 양을 알아본 뒤 사려고 작은 용량으로 바꿨어요.\n\n휴지와 청소도구도 필요한 만큼만 들여놓으니 집이 훨씬 정돈돼 보여요. 여러분은 처음에 너무 많이 샀던 물건이 있나요?','작은살림',false,7,['자취생활','수납','장보기'],['저는 수납함부터 너무 많이 샀어요. 물건 양부터 파악하는 게 먼저였네요.']],
  ['도움 요청','세탁 후 바닥에 물이 보여서 사용을 멈췄어요','세탁이 끝난 뒤 세탁기 앞쪽 바닥에 물이 조금 보였어요. 물이 나온 위치와 발생한 시간을 사진과 메모로 남겼고, 추가 세탁은 하지 않았어요.\n\n기계를 옮기거나 뒷면을 열지는 않았어요. 임대 옵션 세탁기라 집주인께 먼저 연락하려는데, 모델명 외에 전달할 정보가 더 있을까요?','빨래하는날',false,6,['세탁기','물샘','옵션가전'],['에러 표시가 있었는지와 사용한 코스도 함께 적으면 도움이 될 것 같아요.']],
  ['해결 후기','문의 문장을 정리하니 방문 시간을 바로 잡았어요','온수가 중간에 끊기는 증상을 짧게 정리하고 발생한 시간, 보일러 화면에 보인 표시, 방문 가능한 시간을 붙여 보냈어요.\n\n무엇이 고장인지 제가 단정하지 않고 확인을 요청했더니 필요한 사진을 알려 주셨어요. 다음에도 관찰한 사실 위주로 문의해 보려고 해요.',owner,true,10,['온수','문의메시지','방문일정'],['상황 설명과 가능한 시간을 나누어 적어 두는 방식 참고할게요.']],
  ['수리 책임','벽지 얼룩을 발견했을 때 바로 기록부터 남겼어요','비가 온 다음 날 창가 벽지에 얼룩이 보여 날짜와 크기를 기록했어요. 임의로 벽지를 뜯거나 페인트를 칠하지 않고 집주인께 상태 확인을 요청했어요.\n\n결로나 누수인지 제가 판단하기 어려워 발생 시점과 비가 왔는지를 함께 전달했어요. 수리 비용은 점검 결과와 계약을 보고 이야기하기로 했어요.','창가자리',false,5,['벽지','누수의심','기록'],['비가 온 날과 발견한 날을 같이 적는 것도 중요하겠어요.']],
  ['자취 팁','집 문제 메모를 한 양식으로 적어 두고 있어요','장소 / 처음 발견한 날 / 보이는 증상 / 이미 확인한 것 / 문의할 내용을 메모에 나눠 적어요. 급하게 연락할 때 빠뜨리는 정보가 줄었어요.\n\n사진을 보낼 때는 이름이나 택배 송장이 보이지 않게 확인하고, 답변받은 내용도 같은 메모에 정리해요.','한칸메모',false,13,['생활기록','문의준비','개인정보'],['이 양식대로 정리하면 같은 설명을 여러 번 하지 않아도 되겠네요.']],
  ['기타','자취방 공구는 어디까지 준비해 두나요?','줄자, 장갑, 손전등 정도만 두고 있는데 수납 공간이 부족해서 더 늘리지는 않으려고 해요. 고장 난 기기를 분해하는 용도보다는 상태를 확인하고 기록할 때 쓰고 있어요.\n\n전기나 가스 문제는 직접 수리하지 않고 전문가에게 문의하려고요. 작은 집에서 자주 쓰는 기본 물건이 무엇인지 궁금해요.','한평정리',false,4,['준비물','수납','자취생활'],['손전등은 정전 때도 필요해서 충전 상태를 확인해 두고 있어요.']],
 ]
 const now=Date.now()
 return rows.map(([kind,title,body,author,mine,likes,tags,replies],i)=>({id:'demo-'+i,kind,title,body,author,mine,likes,liked:false,created:now-(i+1)*45*60*1000,tags,photos:[],comments:replies.map((body,j)=>({id:`demo-${i}-reply-${j}`,author:j===0?'이웃소라게':'차근차근',body,mine:!mine&&i%3===1&&j===0}))}))
}
export function postTime(created:number){const minutes=Math.max(0,Math.floor((Date.now()-created)/60000));return minutes<1?'방금 전':minutes<60?`${minutes}분 전`:minutes<1440?`${Math.floor(minutes/60)}시간 전`:`${Math.floor(minutes/1440)}일 전`}
export function canPublish(kind:string,title:string,body:string,photos:readonly unknown[],tags:readonly string[]){return (postKinds as readonly string[]).includes(kind)&&!!title.trim()&&title.length<=60&&!!body.trim()&&body.length<=1000&&photos.length<=5&&tags.length<=5}
export function findPosts(posts:readonly CommunityPost[],query:string,kind:string,sort:'popular'|'recommended'|'recent'){
 const words=query.trim().normalize('NFKC').toLocaleLowerCase().split(/\s+/).filter(Boolean)
 return posts.filter(p=>(kind==='전체'||p.kind===kind)&&words.every(w=>[p.title,p.body,...p.tags].join(' ').normalize('NFKC').toLocaleLowerCase().includes(w))).sort((a,b)=>sort==='popular'?b.likes-a.likes||b.created-a.created:sort==='recommended'?(b.likes+b.comments.length)-(a.likes+a.comments.length)||b.created-a.created:b.created-a.created)
}
export function toggleLike(post:CommunityPost):CommunityPost{return {...post,liked:!post.liked,likes:Math.max(0,post.likes+(post.liked?-1:1))}}
export function rememberQuery(history:readonly string[],query:string){const q=query.trim().slice(0,60);return q?[q,...history.filter(x=>x!==q)].slice(0,10):[...history]}
export function validNickname(name:string){return name.trim().length>=1&&name.trim().length<=10&&/^[가-힣A-Za-z0-9 ]+$/.test(name.trim())}
