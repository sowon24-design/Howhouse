import previous from '../../app-screens/my/information-draft.json'
import { catalogPolicy } from '../../catalog/policy'

type Section = { title: string; paragraphs: readonly string[] }
const blocks = (sections: readonly Section[]) => sections.map(section => (section.title ? '## ' + section.title + '\n' : '') + section.paragraphs.join('\n'))
const vercelDemo = import.meta.env.VITE_ANALYSIS_API_BASE_URL === 'same-origin'
const hostingProvider = vercelDemo ? 'Vercel' : 'Render'
const scope = '## 전시용 프로토타입 안내\n어쩌집의 주요 화면과 기능을 체험하는 전시용 프로토타입입니다. 기존 사례 검색과 AI 분석을 제공하며, AI 분석은 시연 기간과 이용 한도 안에서 이용할 수 있습니다. 분석을 요청하면 입력한 문제 글과 선택한 사진이 분석 서버를 거쳐 OpenAI API로 전송됩니다. 개인정보가 포함되지 않은 내용으로 체험해 주세요. 커뮤니티 글·댓글은 다른 관람객과 공유되지 않으며, 신고·로그아웃·회원 탈퇴는 화면 시연입니다.'
export const prototypePolicy = {
 ...catalogPolicy,
 version: 'capstone-ai-preview-2026-11-24-v2',
 status: 'prototype-review',
 terms: [scope,
  '## 제1조 목적 및 운영자\n이 약관은 어쩌집 운영팀이 제공하는 전시용 프로토타입의 이용 조건을 안내합니다. 운영자·개인정보 보호책임자: 유소원 / 문의: happytanglee@gmail.com',
  '## 제2조 제공 기능과 시연 범위\n기존 주거 문제 사례 검색, 해결 방법 열람, 글·선택 사진을 이용한 AI 분석, 문의 문장 편집·복사를 제공합니다. 커뮤니티 작성 내용은 현재 실행 중인 화면에서만 이용하며 다른 관람객에게 게시되지 않습니다. 신고·로그아웃·회원 탈퇴 화면은 실제 접수·계정 종료·자료 삭제를 수행하지 않습니다. 분석은 시연 기간·한도·통신 상태에 따라 제한될 수 있습니다.',
  '## 제3조 AI 안내의 한계\nAI 결과에는 오류가 있을 수 있으며, 원인·시간·비용 부담 안내는 현장 점검이나 전문가의 판단을 대신하지 않습니다. 전기·가스 등 위험이 의심되면 작업을 멈추고 안전을 확보해 주세요.',
  ...blocks(previous.terms.filter(section => ['제3조 AI 안내의 한계', '제4조 이용자의 의무', '제8조 책임의 제한'].includes(section.title))),
  '## 제5조 외부 서비스와 문의 문장\nAI 분석에는 외부 분석 서버와 OpenAI API를 이용합니다. 문의 문장은 직접 확인·수정한 뒤 복사하거나, 지원하는 휴대폰에서 메시지 앱의 작성 화면으로 전달할 수 있습니다. 받는 사람 선택과 최종 전송은 외부 메시지 앱에서 직접 진행합니다. 연락처 목록은 가져오지 않습니다. 프로토타입은 메시지를 자동 발송하거나 수리 업체를 예약하지 않습니다. 외부 영상 이용에는 해당 서비스의 약관과 개인정보 처리방침이 적용됩니다.',
  '## 제6조 이용 안내와 변경\n만 14세 이상 이용자를 대상으로 하며 생년월일은 요구하지 않습니다. 입력 정보의 처리와 국외 전송은 개인정보 처리방침 및 국외 이전 안내에서 확인할 수 있습니다. 전시 종료·점검·장애 등에 따라 체험이 중단될 수 있습니다. 변경 사항과 문의는 서비스 내 안내 또는 운영팀을 통해 확인할 수 있습니다.',
 ],
 privacy: [scope,
  '## 처리 항목과 목적\n닉네임·초기 이용 확인값·약관 버전 등 설정은 기기에 보관합니다. 작성 중인 문제 글·선택 사진·문의 문장·커뮤니티 시연 내용은 실행 중인 화면에서 관리합니다. AI 분석을 요청하면 분석 버튼으로 제출한 문제 글과 선택 사진을 분석 서버를 거쳐 OpenAI API에 전송해 기존 사례 판단·해결 방법·문의 문구 생성에 사용합니다.',
  ...(vercelDemo ? ['## 이용 한도 관리\n기간별 사용 횟수와 무작위 요청 ID의 예약 여부를 Upstash Redis에 저장합니다. 원본 문제 글·사진·답변은 이 저장소에 넣지 않습니다. 예약 기록은 90일 후 만료되며 기간별 횟수는 마지막 예약에서 90일 후 만료됩니다. 호스팅·AI 제공사의 운영·보안 자료는 해당 업체의 정책과 설정에 따라 별도로 처리됩니다.'] : []),
  '## 보관과 삭제\n현재 프로토타입은 원본 글·사진이나 커뮤니티 글·댓글을 Supabase에 저장하지 않습니다. 실행 중인 시연 데이터는 새로고침·앱 종료 후 사라질 수 있습니다. 최근 열람한 사례는 최대 10개까지 이 기기에 보관합니다. 기존 사례는 사례 ID와 열람 시각을, AI 생성 사례는 해결 방안·문의 문구와 열람 시각을 보관하며 원본 문제 글·사진은 이 기록에 넣지 않습니다. 최근 기록은 앱 데이터 삭제 또는 브라우저 사이트 데이터 삭제로 지울 수 있습니다. 기기 설정은 브라우저 사이트 데이터 또는 앱 데이터 삭제로 지울 수 있습니다. 직접 복사한 문장은 클립보드나 붙여넣은 외부 앱에서 별도로 관리합니다. 시연용 탈퇴 완료 화면은 실제 삭제 완료를 의미하지 않습니다.',
  `## AI 처리업체\nAI 분석에 사용하는 업체는 분석 서버 운영업체 ${hostingProvider}와 OpenAI입니다. 분석 요청의 글·사진은 서버를 거쳐 OpenAI로 전송됩니다. Supabase는 이 프로토타입의 분석·인증·저장에 사용하지 않습니다. 동의 선택값은 기기에 저장하며 서버에 동의 이력을 별도로 보관하지 않습니다.`,
  '## 외부 영상과 문의\nYouTube 영상 썸네일과 링크를 사용할 수 있으며 외부 서비스의 정책이 적용됩니다. 현재 캡스톤은 공개 영상 ID를 분석 서버의 썸네일 경로로 보내 이미지를 받아 표시합니다. Google API 키는 서버에서 관리합니다. 사례 검색어·닉네임·문의 문장·선택 사진은 썸네일 요청에 넣지 않습니다. 영상을 누르면 외부 YouTube 앱 또는 브라우저로 이동합니다.\nGoogle 개인정보처리방침: https://policies.google.com/privacy?hl=ko\nGoogle 보관·삭제 정책: https://policies.google.com/technologies/retention?hl=ko\nYouTube 이용약관: https://www.youtube.com/t/terms?hl=ko',
  '## 열람·정정·삭제·처리 정지\n문의: happytanglee@gmail.com. 비밀번호·인증 토큰·신분증은 보내지 마세요. 현재 시연의 로그아웃·회원 탈퇴는 실제 삭제가 아닙니다. 기기 설정과 클립보드·외부로 직접 전송한 문장은 별도로 관리하며, 실제 서버 동의 철회·삭제 기능은 이 프로토타입에 연결하지 않았습니다.',
  '## 안전조치와 연령\nOpenAI 등 서버 비밀 키는 서버에서 관리하며 프론트 코드에 넣지 않습니다. 이 프로토타입에서는 Supabase 인증·DB·답변 및 의견 암호화 저장을 사용하지 않습니다. 이용 연령은 만 14세 이상이며 생년월일은 요구하지 않습니다. 글·사진에 얼굴·이름·전화번호·상세 주소·타인 정보를 포함하지 마세요.',
  ...blocks(previous.privacy.filter(section=>section.title==='문의와 변경 안내')),
 ],
 data: [scope,'## 기기와 실행 중 데이터\n닉네임·이용 설정은 기기에 저장합니다. 커뮤니티 예시 글과 댓글은 가상의 시연 자료이며 다른 이용자의 실제 게시글이 아닙니다. 로그아웃·탈퇴 버튼은 화면 과정을 시연할 뿐 설정·글·계정·서버 기록을 지우지 않습니다.'],
 consent: [scope,
  '## 수집·이용 목적\nAI 분석을 요청할 때 문제 상황을 이해하고 기존 사례의 적합성을 판단하며, 필요한 경우 해결 방법·문의 문구를 생성하는 데 사용합니다.',
  '## 처리 항목\n사용자가 분석 버튼으로 제출한 문제 글과 선택한 사진, 분석 문맥을 처리합니다. 사진은 선택 사항입니다. 이름·전화번호·얼굴·상세 주소·타인 정보와 불필요한 사진 부가정보를 제외해 주세요. 현재 시연에서는 임시 계정 생성이나 서버 동의 증빙 저장을 하지 않습니다.',
  '## 동의 거부·철회와 영향\n선택 항목에 동의하지 않아도 준비된 기존 사례를 볼 수 있습니다. 실제 AI 분석은 운영자가 활성화한 시연 기간에만 동작합니다. 분석을 원하지 않으면 문제 글·사진을 제출하지 않고 기존 사례를 이용해 주세요. 이미 전송한 정보에 관한 문의는 운영팀 이메일로 요청할 수 있습니다.',
  ...blocks(previous.processingConsent.filter(section=>section.title==='처리 주체와 문의')),
  '## 현재 프로토타입의 보관 범위\n기기 설정과 실행 중의 글·선택 사진을 위 개인정보 처리방침대로 관리합니다. Supabase 저장·임시 계정 생성·동의 증빙 서버 제출은 하지 않습니다. 원본 입력과 외부 제공사의 보관 범위는 개인정보 처리방침과 국외 이전 안내를 확인해 주세요.'],
 transfer: [scope,
  '## 이전 목적·시기·방법\nAI 분석을 요청할 때 분석 버튼으로 제출한 문제 글·선택 사진·분석 문맥을 HTTPS로 분석 서버와 OpenAI API에 전송합니다. 약관 화면을 여는 것만으로 문제 글·사진이 전송되지는 않습니다.',
  ...(vercelDemo ? ['## Vercel\n이전받는 자: Vercel Inc. / https://vercel.com/legal/privacy-policy. 분석 버튼으로 보낸 문제 글·선택 사진은 Vercel 분석 서버를 거쳐 OpenAI API로 전송됩니다. 서비스 접속·요청 정보는 호스팅과 보안 운영에 처리될 수 있습니다. 원본 글·사진·답변은 앱의 서버 데이터베이스에 저장하지 않습니다. 실제 처리 리전과 제공사의 운영 로그 보관기간은 배포 설정·제공사 정책에 따라 달라집니다.'] : blocks(previous.overseasConsent.filter(section=>section.title==='Render'))),
  ...blocks(previous.overseasConsent.filter(section=>section.title==='OpenAI')),
  ...(vercelDemo ? ['## Upstash Redis\n이전받는 자: Upstash / https://upstash.com/trust/privacy.pdf. 시연 이용 한도와 중복 요청 관리를 위해 기간별 이용 횟수·무작위 요청 ID·예약 여부를 전송합니다. 원본 글·사진·답변은 전송하지 않습니다. 예약 기록은 90일 후 만료되며 기간별 횟수는 마지막 예약에서 90일 후 만료됩니다. 저장 국가는 배포에 연결된 데이터베이스 리전에 따릅니다.'] : []),
  '## 거부 방법과 문의\n각 선택 항목을 체크하지 않거나 동의창을 닫을 수 있습니다. 기존 사례 열람은 유지됩니다. 현재 시연에서는 Supabase 저장·인증·삭제 처리를 하지 않습니다. 문의: happytanglee@gmail.com. 이후 전송을 원하지 않으면 분석 요청을 중단해 주세요. 이미 완료된 외부 처리와 보관 자료가 즉시 모두 삭제되는 것은 아닙니다.',
 ],
 ai: [scope,
  '## AI 분석 방식\n입력한 문제 글과 선택 사진을 바탕으로 기존 사례를 찾고, 필요한 경우 해결 방법과 문의 문구를 생성합니다. 모든 결과가 새로 생성되는 것은 아닙니다.',
  '## 결과 확인과 안전\nAI는 사실과 다르거나 상황에 맞지 않는 안내를 할 수 있습니다. 원인·시간·비용 부담은 참고 정보이며 현장 점검이나 전문가의 판단을 대신하지 않습니다. 전기·가스·누수 등 위험이 의심되면 작업을 멈추고 안전을 확보한 뒤 전문가에게 확인해 주세요.',
  '## 입력 정보와 문의\n이름·연락처·얼굴·상세 주소·타인의 정보가 포함되지 않은 내용으로 체험해 주세요. 분석 전송·보관 범위는 개인정보 처리방침과 국외 이전 안내에서 확인할 수 있습니다. 결과 오류와 개인정보 관련 문의: happytanglee@gmail.com.',
 ],
} as const
export const prototypeConsentSections = {
 service: prototypePolicy.terms,
 processing: prototypePolicy.consent,
 overseas: prototypePolicy.transfer,
}
const sections=(values:readonly string[])=>values.map(value=>{const [first,...rest]=value.split('\n');return first.startsWith('## ')?{title:first.slice(3),paragraphs:rest}:{title:'',paragraphs:[value]}})
export const prototypeConsentDocuments={service:sections(prototypePolicy.terms),processing:sections(prototypePolicy.consent),overseas:sections(prototypePolicy.transfer)}
