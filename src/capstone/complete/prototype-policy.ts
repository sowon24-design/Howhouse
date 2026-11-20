import previous from '../../app-screens/my/information-draft.json'
import { catalogPolicy } from '../../catalog/policy'

type Section = { title: string; paragraphs: readonly string[] }
const blocks = (sections: readonly Section[]) => sections.map(section => (section.title ? '## ' + section.title + '\n' : '') + section.paragraphs.join('\n'))
const scope = '## 캡스톤 프로토타입 안내\n현재는 화면·동작을 확인하는 프로토타입입니다. 실제 AI 분석은 운영자가 활성화한 시연 기간에만 동작하며, Supabase 인증·DB 저장은 사용하지 않습니다. 커뮤니티 글·댓글·신고와 로그아웃·탈퇴는 시연이며 실제 게시·접수·계정 종료·데이터 삭제로 이어지지 않습니다. 분석 버튼을 누르면 문제 글과 선택한 사진이 서버와 OpenAI API로 전송되므로 개인정보가 없는 시연 자료만 사용해 주세요.'
export const prototypePolicy = {
 ...catalogPolicy,
 version: 'capstone-ai-preview-2026-11-19-v1',
 status: 'prototype-review',
 terms: [scope, ...blocks(previous.terms.filter(section => section.title !== '제5조 평가·의견 및 부적절한 결과 신고'))],
 privacy: [scope,
  '## 처리 항목과 목적\n닉네임·초기 이용 확인값·약관 버전 등 설정은 기기에 보관합니다. 작성 중인 문제 글·선택 사진·문의 문장·커뮤니티 시연 내용은 실행 중인 화면에서 관리합니다. 실제 AI 분석을 활성화하면 분석 버튼으로 제출한 문제 글과 선택 사진을 분석 서버를 거쳐 OpenAI API에 전송해 기존 사례 판단·해결 방법·문의 문구 생성에 사용합니다.',
  '## 보관과 삭제\n현재 프로토타입은 원본 글·사진이나 커뮤니티 글·댓글을 Supabase에 저장하지 않습니다. 실행 중인 시연 데이터는 새로고침·앱 종료 후 사라질 수 있습니다. 최근 열람한 사례는 최대 10개까지 이 기기에 보관합니다. 기존 사례는 사례 ID와 열람 시각을, AI 생성 사례는 해결 방안·문의 문구와 열람 시각을 보관하며 원본 문제 글·사진은 이 기록에 넣지 않습니다. 최근 기록은 앱 데이터 삭제 또는 브라우저 사이트 데이터 삭제로 지울 수 있습니다. 기기 설정은 앱의 설정 초기화 또는 앱 데이터 삭제로 지울 수 있습니다. 직접 복사한 문장은 클립보드나 붙여넣은 외부 앱에서 별도로 관리합니다. 시연용 탈퇴 완료 화면은 실제 삭제 완료를 의미하지 않습니다.',
  '## AI 처리업체\n실제 AI 연결에 사용할 업체는 분석 서버 운영업체 Render와 OpenAI입니다. 이전 AI 버전의 국외 이전 안내에서 해당 업체의 항목·목적·보관 기준을 확인할 수 있습니다. Supabase는 이 프로토타입의 분석·인증·저장에 사용하지 않습니다. AI 활성화 전 실제 서버 설정과 고지·동의 조건을 확인하며, 화면 체크만으로 서버 동의 증빙이 저장되었다고 보지 않습니다.',
  '## 외부 영상과 문의\nYouTube 영상 썸네일과 링크를 사용할 수 있으며 외부 서비스의 정책이 적용됩니다. 현재 캡스톤은 공개 영상 ID를 분석 서버의 썸네일 경로로 보내 이미지를 받아 표시합니다. Google API 키는 서버에서 관리합니다. 사례 검색어·닉네임·문의 문장·선택 사진은 썸네일 요청에 넣지 않습니다. 영상을 누르면 외부 YouTube 앱 또는 브라우저로 이동합니다.\nGoogle 개인정보처리방침: https://policies.google.com/privacy?hl=ko\nGoogle 보관·삭제 정책: https://policies.google.com/technologies/retention?hl=ko\nYouTube 이용약관: https://www.youtube.com/t/terms?hl=ko',
  '## 열람·정정·삭제·처리 정지\n문의: happytanglee@gmail.com. 비밀번호·인증 토큰·신분증은 보내지 마세요. 현재 시연의 로그아웃·회원 탈퇴는 실제 삭제가 아닙니다. 기기 설정과 클립보드·외부로 직접 전송한 문장은 별도로 관리하며, 실제 서버 동의 철회·삭제 기능은 이 프로토타입에 연결하지 않았습니다.',
  '## 안전조치와 연령\nOpenAI 등 서버 비밀 키는 서버에서 관리하며 프론트 코드에 넣지 않습니다. 이 프로토타입에서는 Supabase 인증·DB·답변 및 의견 암호화 저장을 사용하지 않습니다. 이용 연령은 만 14세 이상이며 생년월일은 요구하지 않습니다. 글·사진에 얼굴·이름·전화번호·상세 주소·타인 정보를 포함하지 마세요.',
  ...blocks(previous.privacy.filter(section=>section.title==='문의와 변경 안내')),
 ],
 data: [scope,'## 기기와 실행 중 데이터\n닉네임·이용 설정은 기기에 저장합니다. 커뮤니티 예시 글과 댓글은 가상의 시연 자료이며 다른 이용자의 실제 게시글이 아닙니다. 로그아웃·탈퇴 버튼은 화면 과정을 시연할 뿐 설정·글·계정·서버 기록을 지우지 않습니다.'],
 consent: [scope,
  '## 수집·이용 목적\n실제 AI 분석을 활성화할 경우 문제 상황을 이해하고 기존 사례의 적합성을 판단하며, 필요한 경우 해결 방법·문의 문구를 생성하는 데 사용합니다.',
  '## 처리 항목\n사용자가 분석 버튼으로 제출한 문제 글과 선택한 사진, 분석 문맥을 처리합니다. 사진은 선택 사항입니다. 이름·전화번호·얼굴·상세 주소·타인 정보와 불필요한 사진 부가정보를 제외해 주세요. 현재 시연에서는 임시 계정 생성이나 서버 동의 증빙 저장을 하지 않습니다.',
  '## 동의 거부·철회와 영향\n선택 항목에 동의하지 않아도 준비된 기존 사례를 볼 수 있습니다. 실제 AI 분석은 운영자가 활성화한 시연 기간에만 동작합니다. 현재는 개인정보가 없는 시연 자료만 사용하며, 화면의 체크값만으로 실제 서버 동의가 완료됐다고 보지 않습니다. 일반 이용자 대상 제공 전 동의·거부·철회 처리를 별도로 확인해야 합니다.',
  ...blocks(previous.processingConsent.filter(section=>section.title==='처리 주체와 문의')),
  '## 현재 프로토타입의 보관 범위\n기기 설정과 실행 중의 글·선택 사진을 위 개인정보 처리방침대로 관리합니다. Supabase 저장·임시 계정 생성·동의 증빙 서버 제출은 하지 않습니다. AI 활성화 전 해당 시연의 실제 보관·처리 조건을 확인해야 합니다.'],
 transfer: [scope,
  '## 이전 목적·시기·방법\n실제 AI 분석을 활성화할 경우 필요한 안내·동의 확인 후 분석 버튼으로 제출한 문제 글·선택 사진·분석 문맥을 HTTPS로 분석 서버와 OpenAI API에 전송합니다. 현재 시연의 동의 화면은 실제 분석 전송이나 임시 인증을 시작하지 않습니다.',
  ...blocks(previous.overseasConsent.filter(section=>['Render','OpenAI'].includes(section.title))),
  '## 거부 방법과 문의\n각 선택 항목을 체크하지 않거나 동의창을 닫을 수 있습니다. 기존 사례 열람은 유지됩니다. 현재 시연에서는 Supabase 저장·인증·삭제 처리를 하지 않습니다. 문의: happytanglee@gmail.com. 실제 AI 활성화 전 동의 철회 처리와 업체별 실제 설정을 최종 확인해야 합니다.',
 ],
 ai: [scope,...blocks(previous.ai.filter(section=>!['저장과 삭제는 구분해 주세요','문제 있는 결과는 알려주세요'].includes(section.title))),
  '## 시연 범위\n커뮤니티 신고와 회원 탈퇴는 화면 시연이며 운영 접수·계정 삭제로 이어지지 않습니다. 원본에 없는 주소·비밀번호 수정 기능은 제공하지 않습니다.'],
} as const
export const prototypeConsentSections = {
 service: prototypePolicy.terms,
 processing: prototypePolicy.consent,
 overseas: prototypePolicy.transfer,
}
const sections=(values:readonly string[])=>values.map(value=>{const [first,...rest]=value.split('\n');return first.startsWith('## ')?{title:first.slice(3),paragraphs:rest}:{title:'',paragraphs:[value]}})
export const prototypeConsentDocuments={service:sections(prototypePolicy.terms),processing:sections(prototypePolicy.consent),overseas:sections(prototypePolicy.transfer)}
