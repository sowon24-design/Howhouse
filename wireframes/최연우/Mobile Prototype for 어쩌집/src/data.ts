export type Issue = {
  id: string
  cat: string
  name: string
  emoji: string
  sos?: boolean
  urgency: string
  ratio: number
  cause: string
  owner: string
  supplies: string[]
  time: string
  steps: [string, string, string]
  cases: [string, string[], string, number][]
  temp?: string[]
  root?: string[]
  fallback?: string
  call?: string
}

export const CATEGORIES = [
  { id: '화장실', emoji: '🚽' }, { id: '보일러', emoji: '🔥' }, { id: '수도·수질', emoji: '🚰' },
  { id: '세탁기', emoji: '🧺' }, { id: '전기·조명', emoji: '💡' }, { id: '냉장고', emoji: '🧊' },
  { id: '해충', emoji: '🪳' }, { id: '곰팡이', emoji: '🍄' }, { id: '쓰레기', emoji: '🗑️' },
]

export const ISSUES: Issue[] = [
  { id: 'toilet', cat: '화장실', name: '변기 물이 역류해요', emoji: '🚽', sos: true, urgency: '긴급', ratio: 18,
    cause: '배수관 막힘 또는 건물 공용 배관 문제', owner: '집주인·관리실 연락', supplies: ['고무장갑', '수건', '대야'], time: '약 10분(임시조치)',
    steps: ['물을 더 내리지 말고 수위가 오르는지 확인해요', '변기 옆 급수 밸브를 잠그고 바닥 물기를 닦아요', '관리실 연락 후 배수가 되는지 확인해요'],
    temp: ['변기 물을 더 내리지 마세요', '바닥에 수건을 깔아 물이 번지는 걸 막으세요', '전기 제품을 물에서 멀리 치우세요'],
    root: ['변기 옆 작은 급수 밸브를 시계 방향으로 끝까지 잠그세요'],
    fallback: '관리실·집주인이 연락되지 않으면 건물 공용 배관 막힘일 수 있어요. 아랫집 상황도 확인하고 배관 전문 업체 문의 전에 사진을 남겨두세요.',
    cases: [['김*현', ['누수', '꿀팁'], '밤 11시에 변기가 넘쳤는데 밸브부터 잠그고 관리실에 문자 보냈어요. 30분 뒤 공용 배관 막힘이라고 뚫어줬어요.', 4210], ['박*진', ['집주인'], '집주인이 바로 업체를 불러줘서 비용 없이 해결했어요.', 1530]] },
  { id: 'drain', cat: '화장실', name: '배수구에서 냄새가 나요', emoji: '🚿', urgency: '낮음', ratio: 41,
    cause: '배수구 머리카락·이물질 또는 트랩 물 증발', owner: '직접 해결 가능', supplies: ['고무장갑', '베이킹소다', '뜨거운 물'], time: '약 20분',
    steps: ['배수구 덮개를 열고 이물질과 물 고임을 확인해요', '머리카락을 제거하고 베이킹소다와 뜨거운 물을 부어요', '30분 뒤 냄새가 줄었는지 확인해요, 그대로면 집주인에게 알려요'],
    cases: [['이*서', ['꿀팁'], '샤워기 아래 배수구를 열어보니 머리카락 뭉치가 있었어요. 빼고 나서 냄새가 사라졌어요.', 3321], ['최*우', ['집주인'], '청소해도 냄새가 계속돼서 집주인에게 알렸더니 트랩을 교체해줬어요.', 940]] },
  { id: 'gas', cat: '보일러', name: '가스 냄새가 나요', emoji: '⚠️', sos: true, urgency: '긴급', ratio: 6,
    cause: '가스 호스 또는 밸브 연결부 누출 가능성', owner: '즉시 대피 후 신고', supplies: [], time: '즉시',
    steps: ['불꽃과 전기 스위치 사용을 멈춰요', '가스 중간 밸브를 잠그고 창문을 열어요', '밖에서 가스 안전공사에 신고해요'],
    temp: ['전등 스위치·라이터 등 불꽃이 생길 일은 하지 마세요', '창문을 모두 열어 환기하세요'], root: ['가스 중간 밸브를 잠그고 밖으로 나가 1544-4500에 연락하세요'],
    fallback: '집주인 연락이 안 되더라도 가스 안전공사 신고가 우선이에요.', call: '1544-4500',
    cases: [['정*아', ['꿀팁'], '밸브를 잠그고 나가서 신고했더니 호스 교체로 해결됐어요.', 2210]] },
  { id: 'boilerHot', cat: '보일러', name: '온수가 안 나와요', emoji: '🔥', urgency: '보통', ratio: 37,
    cause: '보일러 압력 저하 또는 전원·동결 문제', owner: '직접 해결 후 집주인 연락', supplies: ['보일러 설명서', '휴대폰 손전등'], time: '약 15분',
    steps: ['보일러 전원과 에러 코드를 확인해요', '압력계가 낮으면 급수 밸브로 1.5bar까지 보충해요', '5분 뒤 온수가 나오는지 확인하고, 안 나오면 집주인에게 알려요'],
    cases: [['윤*아', ['보일러', '꿀팁'], '압력이 0.5로 떨어져 있었어요. 밸브를 열어 채우니 바로 됐어요.', 2540], ['한*민', ['집주인'], '에러가 반복돼서 집주인이 A/S를 접수해줬어요.', 1104]] },
  { id: 'boilerErr', cat: '보일러', name: '난방이 잘 안 돼요', emoji: '♨️', urgency: '보통', ratio: 29,
    cause: '난방 밸브 잠김 또는 공기 유입', owner: '직접 해결 가능', supplies: ['장갑'], time: '약 20분',
    steps: ['난방 모드와 설정 온도를 확인해요', '분배기 밸브가 열려 있는지 확인해요', '1시간 뒤 바닥이 따뜻해졌는지 확인해요'],
    cases: [['오*진', ['보일러'], '외출 모드로 되어 있었어요. 난방으로 바꾸니 해결됐어요.', 1820]] },
  { id: 'leak', cat: '수도·수질', name: '물이 심하게 새요', emoji: '🌊', sos: true, urgency: '긴급', ratio: 14,
    cause: '배관·호스 파손 또는 연결부 이탈', owner: '집주인·관리실 연락', supplies: ['수건', '대야', '핸드폰 손전등'], time: '약 10분(임시조치)',
    steps: ['새는 위치와 물 번짐 범위를 확인해요', '수도 밸브를 잠그고 물을 받아내요', '물이 멈췄는지 확인하고 집주인에게 알려요'],
    temp: ['수건·대야로 물이 번지는 걸 막으세요', '전기 제품과 멀티탭을 물에서 치우세요'],
    root: ['수도 계량기 옆 밸브를 시계 방향으로 끝까지 잠그세요'],
    fallback: '집주인 연락이 안 되면 관리실에 먼저 알리고, 아랫집에도 물이 샐 수 있어 상황을 공유해주세요. 피해 사진을 남겨두세요.',
    cases: [['임*영', ['누수', '집주인'], '세탁기 호스가 빠져 바닥이 물바다였어요. 밸브를 잠그고 집주인에게 알렸어요.', 3015]] },
  { id: 'sink', cat: '수도·수질', name: '싱크대 아래에서 물이 새요', emoji: '🚰', urgency: '보통', ratio: 52,
    cause: '배수 호스 연결부 풀림 또는 패킹 노후', owner: '직접 해결 가능, 안 되면 집주인', supplies: ['마른 수건', '장갑', '패킹(필요 시)'], time: '약 20분',
    steps: ['수납장을 비우고 물을 틀어 새는 곳을 찾아요', '연결부 너트를 손으로 조이거나 패킹을 교체해요', '5분 동안 물을 틀어 새지 않는지 확인해요'],
    cases: [['김*윤', ['누수', '꿀팁'], '호스 너트가 풀려 있었어요. 손으로 조이니 새는 게 멈췄어요.', 2814], ['서*아', ['집주인'], '배관 자체에서 새서 사진을 보내고 집주인이 기사를 불렀어요.', 1932]] },
  { id: 'rust', cat: '수도·수질', name: '수돗물이 누렇게 나와요', emoji: '💧', urgency: '낮음', ratio: 22,
    cause: '배관 녹 또는 장기간 미사용', owner: '직접 해결 후 지속되면 집주인', supplies: ['투명 컵'], time: '약 10분',
    steps: ['투명 컵에 받아 색을 확인해요', '찬물을 5분 이상 흘려보내요', '맑아졌는지 확인하고 계속되면 집주인에게 알려요'],
    cases: [['장*원', ['꿀팁'], '5분 틀어두니 맑아졌어요.', 880]] },
  { id: 'washDrain', cat: '세탁기', name: '세탁기 물이 안 빠져요', emoji: '🧺', urgency: '보통', ratio: 33,
    cause: '배수 필터 막힘 또는 배수 호스 꺾임', owner: '직접 해결 가능', supplies: ['수건', '대야', '장갑'], time: '약 15분',
    steps: ['전원을 끄고 호스가 꺾였는지 확인해요', '하단 배수 필터를 열어 이물질을 제거해요', '배수 코스로 물이 빠지는지 확인해요'],
    cases: [['문*희', ['꿀팁'], '필터에 동전과 먼지가 가득이었어요. 청소 후 해결됐어요.', 1960]] },
  { id: 'elec', cat: '전기·조명', name: '콘센트에서 스파크가 튀어요', emoji: '⚡', sos: true, urgency: '긴급', ratio: 8,
    cause: '접촉 불량 또는 과부하', owner: '집주인 연락 필수', supplies: [], time: '즉시',
    steps: ['기기에서 멀리 떨어져요', '분전반에서 해당 차단기를 내려요', '집주인에게 알리고 연기가 나면 119에 신고해요'],
    temp: ['만지지 말고 거리를 두세요', '젖은 손으로 스위치를 만지지 마세요'], root: ['분전반에서 해당 차단기를 내리세요'],
    fallback: '집주인 연락이 안 되면 해당 콘센트는 사용하지 말고, 연기·화재 징후가 있으면 119에 신고하세요.', call: '119',
    cases: [['배*수', ['집주인'], '차단기를 내리고 집주인에게 연락했더니 전기 기사가 다음 날 왔어요.', 1305]] },
  { id: 'flicker', cat: '전기·조명', name: '전등이 깜빡거려요', emoji: '💡', urgency: '낮음', ratio: 45,
    cause: '전구 수명 또는 안정기 문제', owner: '직접 해결 가능', supplies: ['같은 규격 전구'], time: '약 10분',
    steps: ['스위치를 끄고 전구가 헐겁지 않은지 확인해요', '같은 규격 전구로 교체해요', '켜서 깜빡임이 사라졌는지 확인해요'],
    cases: [['송*민', ['꿀팁'], '전구가 헐거웠어요. 돌려 끼우니 해결.', 2010]] },
  { id: 'fridge', cat: '냉장고', name: '냉장고가 시원하지 않아요', emoji: '🧊', urgency: '보통', ratio: 27,
    cause: '문 틈 벌어짐, 설정 온도, 공기 순환 문제', owner: '직접 해결 후 집주인(옵션 가전)', supplies: ['온도계'], time: '약 15분',
    steps: ['문이 완전히 닫히는지 확인해요', '설정 온도를 조절하고 내부를 정리해요', '2~3시간 뒤 온도를 다시 확인해요'],
    cases: [['류*인', ['집주인'], '옵션 냉장고라 집주인에게 알렸어요.', 760]] },
  { id: 'bug', cat: '해충', name: '바퀴벌레가 나와요', emoji: '🪳', urgency: '낮음', ratio: 48,
    cause: '배수구·틈새 유입 또는 음식물 보관', owner: '직접 해결 가능', supplies: ['바퀴 약', '실리콘', '밀폐 용기'], time: '약 30분',
    steps: ['발견 위치와 틈새를 확인해요', '틈새를 막고 약을 놓아요', '1주일 뒤 개체 수를 확인해요'],
    cases: [['조*현', ['해충', '꿀팁'], '싱크대 틈새를 막고 약을 놓았더니 줄었어요.', 3300]] },
  { id: 'flies', cat: '해충', name: '초파리가 계속 생겨요', emoji: '🪰', urgency: '낮음', ratio: 39,
    cause: '음식물 쓰레기·과일 보관', owner: '직접 해결 가능', supplies: ['식초', '종이컵'], time: '약 10분',
    steps: ['과일과 음식물 쓰레기를 확인해요', '식초 트랩을 만들어 놓아요', '2~3일 뒤 개체 수를 확인해요'],
    cases: [['권*서', ['해충', '꿀팁'], '식초 트랩 하나로 거의 없어졌어요.', 2410]] },
  { id: 'mold', cat: '곰팡이', name: '벽에 곰팡이가 생겼어요', emoji: '🍄', urgency: '낮음', ratio: 56,
    cause: '결로·환기 부족', owner: '직접 제거 후 반복되면 집주인', supplies: ['곰팡이 제거제', '마스크', '장갑'], time: '약 40분',
    steps: ['곰팡이 범위와 원인을 사진으로 확인해요', '제거제를 뿌리고 20분 뒤 닦아요', '환기하고 일주일 뒤 재발을 확인해요'],
    cases: [['안*지', ['곰팡이', '꿀팁'], '제거제와 하루 2번 환기로 2주째 재발이 없어요.', 3321], ['남*호', ['곰팡이', '집주인'], '결로 원인이라 집주인이 실링을 보수했어요.', 876]] },
  { id: 'trash', cat: '쓰레기', name: '음식물 쓰레기 냄새가 나요', emoji: '🗑️', urgency: '낮음', ratio: 44,
    cause: '수분 많은 음식물, 배출 지연', owner: '직접 해결 가능', supplies: ['음식물 봉투', '신문지'], time: '약 10분',
    steps: ['남은 음식물을 확인해요', '수분을 빼고 냉동 보관해요', '배출 요일에 맞춰 버리고 냄새를 확인해요'],
    cases: [['나*림', ['꿀팁'], '냉동 보관하니 냄새가 없어졌어요.', 1240]] },
  { id: 'etc', cat: '기타', name: '기타 집 문제', emoji: '🔧', urgency: '낮음', ratio: 10,
    cause: '정확한 원인은 추가 확인이 필요해요', owner: '사진 기록 후 집주인 상담', supplies: ['휴대폰'], time: '약 10분',
    steps: ['문제 부위를 여러 각도로 촬영해요', '언제부터 어땠는지 간단히 메모해요', '집주인에게 사진과 함께 알려요'],
    cases: [['홍*길', ['집주인'], '사진과 함께 정리해 보내니 수리 판단이 빨랐어요.', 640]] },
]

export const byId = (id: string) => ISSUES.find((i) => i.id === id) || ISSUES[ISSUES.length - 1]

export function classify(t: string): Issue {
  const s = t.replace(/\s/g, '')
  const rules: [RegExp, string][] = [
    [/가스/, 'gas'], [/합선|스파크|감전|타는냄새|콘센트|불꽃/, 'elec'], [/변기|역류|올라와/, 'toilet'],
    [/(천장|물바다|넘쳐|터졌|심하게).*(물|새)|(물|새).*(천장|물바다|터졌|심하게)/, 'leak'],
    [/음식물|쓰레기/, 'trash'], [/싱크|주방|물이새|누수|새고/, 'sink'], [/배수구|하수구|악취|냄새/, 'drain'],
    [/온수|뜨거운/, 'boilerHot'], [/보일러|난방/, 'boilerErr'], [/세탁기/, 'washDrain'],
    [/깜빡|전등|조명|전구/, 'flicker'], [/냉장고/, 'fridge'], [/바퀴|벌레|해충/, 'bug'], [/초파리/, 'flies'],
    [/곰팡이|결로|습기/, 'mold'], [/누런|녹물|수돗물/, 'rust'],
  ]
  for (const [r, id] of rules) if (r.test(s)) return byId(id)
  return byId('etc')
}

export const VOICE_SAMPLES = [
  '싱크대 밑에서 물이 계속 새고 있어요.',
  '화장실 변기에서 물이 계속 올라와요.',
  '방 벽 모서리에 곰팡이가 생겼어요.',
  '집에서 가스 냄새가 나요.',
]

export const PHOTO_SAMPLES = [
  { label: '싱크대 아래 물', emoji: '🚰', hint: '싱크대 밑에서 물이 새고 있어요.', obj: '배수 호스 연결부' },
  { label: '벽 곰팡이', emoji: '🍄', hint: '벽에 곰팡이가 생겼어요.', obj: '벽 곰팡이' },
  { label: '깜빡이는 전등', emoji: '💡', hint: '거실 전등이 계속 깜빡여요.', obj: '전등 · 안정기' },
  { label: '보일러', emoji: '🔥', hint: '보일러에서 온수가 안 나와요.', obj: '보일러 패널' },
  { label: '세탁기', emoji: '🧺', hint: '세탁기 물이 안 빠져요.', obj: '세탁기 배수 호스' },
  { label: '냉장고', emoji: '🧊', hint: '냉장고가 시원하지 않아요.', obj: '냉장고 문 패킹' },
  { label: '벌레', emoji: '🪳', hint: '주방에 바퀴벌레가 나와요.', obj: '벌레 출몰 지점' },
  { label: '넘치는 변기', emoji: '🚽', hint: '변기에서 물이 올라와요.', obj: '변기 수위' },
]

export const SOS_SAMPLES = [
  { label: '바닥에 물', emoji: '🌊', id: 'leak' },
  { label: '넘치는 변기', emoji: '🚽', id: 'toilet' },
  { label: '콘센트 스파크', emoji: '⚡', id: 'elec' },
  { label: '가스 냄새', emoji: '⚠️', id: 'gas' },
]

export type Post = { id: number | string; author: string; tags: string[]; text: string; likes: number; issue?: string; ago?: number; views?: number }

export const MAP_PINS = [
  { issue: 'toilet', x: 28, y: 20, place: '상도동 · 다세대 3층 화장실', emoji: '🚽' },
  { issue: 'sink', x: 64, y: 16, place: '상도동 · 원룸 주방 싱크대', emoji: '🚰' },
  { issue: 'flicker', x: 50, y: 36, place: '동작구 · 오피스텔 거실', emoji: '💡' },
  { issue: 'mold', x: 18, y: 50, place: '흑석동 · 원룸 창가 벽', emoji: '🍄' },
  { issue: 'boilerHot', x: 72, y: 46, place: '노량진 · 투룸 보일러실', emoji: '🔥' },
  { issue: 'bug', x: 44, y: 62, place: '사당동 · 원룸 주방 틈', emoji: '🪳' },
  { issue: 'leak', x: 78, y: 74, place: '상도동 · 다세대 2층 욕실', emoji: '🌊' },
  { issue: 'drain', x: 26, y: 78, place: '신대방 · 원룸 욕실', emoji: '🚿' },
]

export const TAGS = ['곰팡이', '누수', '집주인', '꿀팁', '해충', '보일러', '전기', '배수']

export const POSTS0: Post[] = [
  { id: 1, ago: 180, views: 820, author: '김*윤', tags: ['누수', '꿀팁'], text: '싱크대 밑 호스 너트가 풀려 있었어요. 손으로 조였더니 끝! 마른 수건 깔고 해보세요.', likes: 42, issue: 'sink' },
  { id: 2, ago: 2880, views: 610, author: '이*서', tags: ['집주인'], text: '집주인에게 사진 3장이랑 영상 보냈더니 바로 기사님 연결해주셨어요. 사진이 중요해요.', likes: 31, issue: 'sink' },
  { id: 3, ago: 1500, views: 540, author: '박*진', tags: ['곰팡이', '꿀팁'], text: '곰팡이 제거제 쓰고 가구를 벽에서 5cm 띄우니 재발이 없어요.', likes: 27, issue: 'mold' },
  { id: 4, ago: 9000, views: 300, author: '최*우', tags: ['해충'], text: '초파리는 식초 트랩이 최고입니다. 종이컵에 식초 조금이면 돼요.', likes: 19, issue: 'flies' },
  { id: 5, ago: 25, views: 410, author: '정*민', tags: ['배수', '꿀팁'], text: '욕실 배수구 냄새는 뜨거운 물 + 베이킹소다 + 식초 순서로 부어주니 사라졌어요. 머리카락 먼저 걷어내세요.', likes: 36, issue: 'drain' },
  { id: 6, ago: 90, views: 760, author: '한*아', tags: ['보일러'], text: '온수가 안 나와서 놀랐는데 보일러 전원이 외출 모드였어요. 먼저 모드부터 확인하세요!', likes: 58, issue: 'boilerHot' },
  { id: 7, ago: 340, views: 520, author: '오*준', tags: ['전기', '집주인'], text: '전등이 계속 깜빡여서 집주인에게 영상 보냈더니 안정기 교체를 해주셨어요. 영상 꼭 찍어 두세요.', likes: 24, issue: 'flicker' },
  { id: 8, ago: 600, views: 380, author: '윤*서', tags: ['배수', '꿀팁'], text: '세탁기 배수 호스가 꺾여 있어서 물이 안 빠졌어요. 호스 위치만 바로잡았더니 해결.', likes: 22, issue: 'washDrain' },
  { id: 9, ago: 45, views: 290, author: '송*현', tags: ['곰팡이'], text: '결로 때문에 창가 곰팡이가 매년 생겼는데, 아침마다 10분 환기하니 훨씬 덜해요.', likes: 33, issue: 'mold' },
  { id: 10, ago: 1200, views: 640, author: '임*우', tags: ['누수', '집주인'], text: '천장에서 물이 떨어져서 윗집 연락 전에 사진부터 찍어두고 집주인에게 보냈어요. 기록이 도움됐어요.', likes: 47, issue: 'leak' },
  { id: 11, ago: 15, views: 150, author: '배*린', tags: ['꿀팁', '누수'], text: '녹물이 나올 땐 한참 틀어두면 맑아져요. 계속 누렇다면 집주인에게 알려주세요.', likes: 18, issue: 'rust' },
  { id: 12, ago: 2000, views: 470, author: '문*호', tags: ['꿀팁'], text: '냉장고 문 고무패킹이 헐거워서 성에가 끼었어요. 따뜻한 물수건으로 닦아주니 밀착이 좋아졌어요.', likes: 29, issue: 'fridge' },
  { id: 13, ago: 4320, views: 330, author: '노*빈', tags: ['해충', '꿀팁'], text: '바퀴벌레는 싱크대 틈 먼저 막고 젤 미끼를 놓았어요. 음식물은 밤에 꼭 밀폐하세요.', likes: 21, issue: 'bug' },
  { id: 14, ago: 10, views: 210, author: '장*은', tags: ['전기'], text: '멀티탭에서 탄 냄새가 나서 바로 뽑았어요. 문어발 연결은 피하세요, 진짜 위험해요.', likes: 52, issue: 'elec' },
  { id: 15, ago: 780, views: 560, author: '권*솔', tags: ['보일러', '집주인'], text: '보일러 에러 코드를 사진으로 찍어 보냈더니 집주인이 AS 기사님을 바로 연결해줬어요.', likes: 39, issue: 'boilerErr' },
  { id: 16, ago: 5400, views: 180, author: '유*라', tags: ['곰팡이', '꿀팁'], text: '욕실 곰팡이는 사용 후 찬물로 헹구고 스퀴지로 물기를 밀어주면 훨씬 안 생겨요.', likes: 26, issue: 'mold' },
  { id: 17, ago: 7200, views: 260, author: '신*재', tags: ['누수'], text: '싱크대 수전 아래 패킹이 닳아서 새던 거였어요. 철물점 천 원짜리 패킹으로 교체 끝.', likes: 44, issue: 'sink' },
  { id: 18, ago: 130, views: 330, author: '안*지', tags: ['배수', '집주인'], text: '변기 역류는 뚫어뻥 한 번에 해결됐어요. 반복되면 집주인에게 배관 점검 요청하세요.', likes: 40, issue: 'toilet' },
  { id: 19, ago: 8, views: 90, author: '조*훈', tags: ['꿀팁'], text: '가스 냄새가 나면 밸브부터 잠그고 창문을 열어 환기한 뒤 도시가스 센터에 연락하세요.', likes: 61, issue: 'gas' },
  { id: 20, ago: 3000, views: 140, author: '홍*나', tags: ['해충'], text: '초파리는 음식물 쓰레기 때문이었어요. 배수구 망을 청소하고 식초 트랩 놓으니 사라졌어요.', likes: 17, issue: 'flies' },
]

export type Comment = { id: number; author: string; kind: 'empathy' | 'opinion'; text: string; ago: number }
export const COMMENTS0: Record<string, Comment[]> = {
  '1': [
    { id: 1, author: '문*아', kind: 'empathy', text: '저도 똑같았어요! 너트만 조여도 해결되더라고요.', ago: 120 },
    { id: 2, author: '서*호', kind: 'opinion', text: '저는 패킹이 닳아서 교체해야 했어요. 안 되면 패킹도 확인해보세요.', ago: 90 },
  ],
  '2': [{ id: 3, author: '하*늘', kind: 'empathy', text: '사진이 정말 중요해요. 공감합니다.', ago: 1800 }],
  '3': [{ id: 4, author: '류*원', kind: 'opinion', text: '가구 띄우는 것도 좋지만 제습기도 함께 쓰면 더 좋아요.', ago: 900 }],
  '6': [{ id: 5, author: '민*기', kind: 'empathy', text: '저도 외출 모드였던 적 있어요 ㅠㅠ', ago: 50 }],
  '14': [{ id: 6, author: '도*윤', kind: 'empathy', text: '정말 위험하죠. 공감해요.', ago: 5 }, { id: 7, author: '채*린', kind: 'opinion', text: '과부하 차단 멀티탭을 쓰면 안전해요.', ago: 4 }],
}

export const KEYWORDS: [RegExp, 'place' | 'thing' | 'symptom'][] = [
  [/화장실|욕실|주방|부엌|베란다|현관|침실|거실|천장|벽지|창가|창문/, 'place'],
  [/변기|싱크대|배수구|하수구|수돗물|수도|보일러|온수|세탁기|냉장고|전등|조명|전구|콘센트|멀티탭|가스|쓰레기|바퀴벌레|초파리|벌레/, 'thing'],
  [/역류|올라와|물이\s?새|누수|새고|새요|곰팡이|냄새|악취|깜빡|안\s?나와|막혔|막혀|터졌|스파크|합선|고장|결로|습기|녹물|넘쳐|소리|차가워/, 'symptom'],
]
export const KEYWORD_LABEL = { place: '장소', thing: '대상', symptom: '증상' } as const
export const extractKeywords = (t: string) => {
  const out: { word: string; type: 'place' | 'thing' | 'symptom' }[] = []
  for (const [r, type] of KEYWORDS) {
    const g = new RegExp(r.source, 'g')
    for (const m of t.matchAll(g)) if (!out.some((o) => o.word === m[0])) out.push({ word: m[0], type })
  }
  return out
}
export const KEYWORD_RE = new RegExp('(' + KEYWORDS.map(([r]) => r.source).join('|') + ')', 'g')

export const PLACES = [
  { id: 'veranda', name: '베란다·세탁실', issues: ['washDrain', 'boilerHot', 'mold', 'rust'] },
  { id: 'room', name: '방·거실', issues: ['flicker', 'elec', 'mold', 'boilerErr', 'fridge'] },
  { id: 'kitchen', name: '주방', issues: ['sink', 'gas', 'trash', 'flies', 'bug'] },
  { id: 'bath', name: '화장실·욕실', issues: ['toilet', 'drain', 'leak', 'mold'] },
  { id: 'entry', name: '현관', issues: ['elec', 'bug', 'trash'] },
]

export const VENDORS = [
  { id: 'v1', name: '상도 설비·배관', dist: '350m', open: '09:00', close: '19:00', off: '일', rating: 4.8, reviews: 132, x: 28, y: 28, tags: [['연락을 빠르게 봐요', 48], ['친절해요', 37], ['견적 후기 많아요', 21]] },
  { id: 'v2', name: '동작 해결사', dist: '720m', open: '00:00', close: '24:00', off: '', rating: 4.5, reviews: 86, x: 76, y: 24, tags: [['24시간 출동해요', 52], ['연락을 빠르게 봐요', 30], ['야간 추가요금 후기', 9]] },
  { id: 'v3', name: '우리동네 종합수리', dist: '1.1km', open: '10:00', close: '20:00', off: '토', rating: 4.2, reviews: 54, x: 80, y: 78, tags: [['견적이 상세해요', 22], ['친절해요', 18], ['방문이 정확해요', 11]] },
  { id: 'v4', name: '사당 전기·조명', dist: '1.4km', open: '09:00', close: '18:00', off: '일', rating: 4.6, reviews: 41, x: 22, y: 80, tags: [['설명을 잘해줘요', 19], ['견적 후기 많아요', 14], ['친절해요', 12]] },
]
