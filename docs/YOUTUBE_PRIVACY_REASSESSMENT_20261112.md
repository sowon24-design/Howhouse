# YouTube 개인정보 재검토 및 앞선 판단 정정

확인일: 2026-11-12. 디자인은 사용자 승인: 기존 썸네일 → 검정 20% Multiply → 원본 흰색 중앙 아이콘. 다른 제품 UI/문구 유지.

## 정정
Google이 IP를 받는다는 사실만으로 어쩌집이 개인정보 보호법 제28조의8에 따른 국외 이전 동의를 반드시 받아야 한다고 판단할 수 없다. 앞선 국가/보관기간 미확인 → 일괄 출시 불가 판단은 철회한다. 이는 현재 앱이 모든 법적 의무에서 면제된다는 판정이 아니다.

개인정보보호위원회는 해외 사업자의 국내 정보주체 직접 수집과 국내 개인정보처리자의 제공/위탁/보관을 구분한다. 해외 사업자의 직접 수집에는 그 수집 단계의 국외 이전 규정이 적용되지 않지만, 직접 수집하는 사업자의 보호법 의무가 사라지는 것은 아니다. 이 일반 설명이 자동 제3자 콘텐츠 요청을 포함한 특정 앱의 전체 책임을 개별 승인한 것은 아니다.

## 사실 / 평가의 구분
| 항목 | 확인/판정 |
|---|---|
| 접속 경로 | 기기에서 www.googleapis.com / i.ytimg.com으로 직접 HTTPS 요청. 어쩌집 서버 중계 없음 |
| 어쩌집 사용자 자료 | 닉네임·검색어·문의 문장·사진·광고 ID·OAuth 토큰을 요청에 넣지 않음 |
| 기기에서 수신되는 정보 | 공개 영상 ID·공통 프로젝트/앱 식별정보, 통신에 따른 IP·요청/HTTP 정보 |
| Google 일반 방침 | 서비스 제공/유지/개선·보안 등 목적, 전 세계 처리, 유형/목적별 보관·삭제 기준 공개 |
| 단일 API 로그 기간 | 일반 광고 로그의 9/18개월 또는 백업 삭제 예시 6개월을 이 API 로그의 확정 수치로 적용하지 않음 |
| 계약 | 공개 Google Controller-Controller 목록에 YouTube API는 없음. 다른 서비스의 DPA/독립 controller 계약이 자동 적용된다고 주장하지 않음 |
| 현재 법적 평가 | Google의 기기 접속정보 수신을 어쩌집이 보유한 사용자 DB를 해외 업체에 넘기는 구조와 동일시하지 않는 것이 타당. 구체적 법적 분류는 기술 구조를 바탕으로 한 검토 의견이며 기관의 개별 유권해석이 아님 |
| 확정할 수 없는 주장 | 완벽한 법적 무위험, Play 심사 통과, 별도 동의 절대 불필요, Google 내부 기록 국가/삭제일 확정 |

## 실제 반영
- src/catalog/policy.ts: 실제 요청 시점/항목, 제외 항목, Google 처리 목적·일반 보관 방침·문의처, 앱 삭제 범위와 Google 기록 관리의 구분을 구체화.
- 약관 확인 버전도 기기 저장 항목으로 명시. 새 정책 버전 catalog-2026-11-12-youtube-v2로 변경하여 과거 확인을 소급하지 않음.
- 소원 트랙 개인정보 처리방침에 같은 YouTube 문단과 로컬 저장 항목 반영. 공개 URL에서 신규 본문 끝·공식 보관 링크·개정일·약관 버전 항목 확인. 다른 트랙/원본 미수정.
- 로컬 정책 사본 재생성, 타입 검사 통과. 호출 차단·현재 버전 확인·취소·호스트 제한·키 오류 비노출 등 기존 관련 검사 16개 통과.
- 승인 값을 무조건 true로 바꾸거나 법률 보증을 코드로 기록하지 않음. 최종 서명 AAB는 아직 없음. 업데이트한 정책을 포함한 Android 재빌드·새 정책 확인 검증과 Play 제출 준비는 별도 작업.

## 공개 문서
https://xamxam33.notion.site/41402821a7f3805bb89cccccd63ec5a6

## 근거
- 개인정보위 직접 수집과 국외 이전의 구별: https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS292&mCode=I040010000&nttId=10972
- 개인정보 포털 제도 설명: https://www.privacy.go.kr/front/contents/cntntsView.do?contsNo=367
- YouTube 개발자 정책 III.A: https://developers.google.com/youtube/terms/developer-policies
- Google 개인정보처리방침: https://policies.google.com/privacy?hl=ko
- Google 앱/사이트 정보 처리: https://policies.google.com/technologies/partner-sites?hl=ko
- Google 보관 정책: https://policies.google.com/technologies/retention?hl=ko
- Google 계약 적용 서비스 목록: https://business.safety.google/services/

## 추가 확인이 필요할 경우 그대로 사용할 질문 (미발송)
별도 서버/DB 없이 로컬 사례 앱에서 공개 YouTube Data API videos.list와 응답의 썸네일 URL을 기기가 직접 조회합니다. 앱 약관/방침 확인 전에는 요청하지 않으며 쿠키/referrer/OAuth/광고 ID 및 닉네임·검색어·문의 원문은 전송하지 않습니다. 공개 영상 ID와 공통 API/앱 식별정보가 있고 Google은 통신 IP를 받습니다. 이 구조에서 Google의 접속정보 수신을 해외 사업자의 직접 수집으로 볼 수 있는지, 국내 앱 운영자의 별도 제공/국외 이전 동의가 필요한지, 그 밖에 필요한 이용자 고지·통제 조치가 무엇인지 확인 부탁드립니다.
