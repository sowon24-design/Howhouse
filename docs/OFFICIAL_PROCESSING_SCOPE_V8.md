# v8 국외 이전 고지의 공식 처리 범위 근거

2026-11-11 / PR62 후속. main·운영 변경, Edge Function 도입, 업체/기관 문의, 유료 전환 없음. AI·사진·Supabase Free 유지.

## 이미 된 작업은 유지

`provider-region.mjs`의 미국 주소, matcher의 `/responses`·`store:false`, 사진 최소화, 별도 선택 동의·영수증·철회/삭제는 이미 구현됐다. 이번에는 런타임·서버 환경변수·시작 명령을 바꾸지 않았다. 기본 분석은 Render에서 처리하며 Edge Function이라고 기재하지 않는다.

## 공식 자료와 반영

| 근거 | 확인한 범위 | 고지 반영 |
| --- | --- | --- |
| OpenAI Services Agreement, 현행DPA(2026-01-01 효력) | 한국 소재 고객의 기본 계약 법인 OpCo와 Customer Data 수탁자 역할. 실제 계정별 별도 계약 존재 여부는 여기서 확인하지 않음 | 계약 역할과 계정 적용 조건을 구분.2024년 구DPA를 현행 근거로 사용하지 않음 |
| API Data Controls | 선택 모델/Responses의 미국 지역 처리 지원; 지역 제어는 시스템 정보 전체에 적용되지 않음 | 주요 콘텐츠 처리와 시스템/지원 처리 구분 |
| OpenAI Subprocessor List(2026-10-14) | 미국 지정 요청의 Cloudflare TLS종료·복호화 지역, API 인프라·조건부 검토·고객지원·계열사의 역할/국가 | 전체 국가를 개별 요청의 확정 경로로 복사하지 않음. 고객지원은 고객이 명시적으로 공유한 자료, 정책위반 표본 검토는 해당 조건으로 구분 |
| Supabase FAQ(2026-10-06)·현행DPA·하위처리자 | 서울 DB/Auth와 싱가포르 계약·미국 필요 지원, EU 로그·글로벌 지원 및 역할별 목록 | 기본 저장/인증과 운영·지원 분리. 사진 Storage업로드·Edge중계 미사용 유지 |
| Render DPA·공개 목록·로그 문서 | 현재 분석 서버의 싱가포르 위치와 미국 운영, 호스팅 수탁자/하위처리자·대시보드 로그와 기타 기록 구분 | Render를 고지에서 임의 제거하지 않고 원문 출처 연결 |

이 구분은 법정 고지를 위한 공개 계약·서비스 범위의 정리다. 매 요청이 통과한 모든 서버나 하위처리자의 실제 접근을 실시간으로 추적하는 작업을 별도 출시 필수 요건으로 추가하지 않는다. 또한 공개 자료의 국가·항목 등 실제 필요한 고지사항을 생략하거나, 제공 범위를 넘어 사실을 확정하는 근거도 아니다.

## 본문·버전 관리

앱 개인정보처리방침과 국외 이전 동의에 실제 기본 경로, 계약 역할·미국 처리의 적용 범위, 지원/계열사와 출처를 추가해v8로 올렸다. 거부·철회·삭제·보관 조건과 미확정 사실을 숨기지 않는다. 법적 근거는 기존28조의8제1항1호의 별도 동의로 유지하며, 계약 이행 필요성 근거로 임의 전환하지 않았다.

v8은 앱·서버 공통 출처와 새 해시·6개Markdown/manifest를 사용한다. v6/v7 기록은 보존하며 현재 동의로 인정하지 않는다. SQL 스키마 변경 없음.

## 완료·잔여의 의미

이번 완료는 공개 근거를 앱 고지에 연결하고 정확한 구조를 반영한 것이다. 공급자 내부 국가는 새로 알아낸 것이 아니다. 특히 Supabase가 공개한 EU 권역과 글로벌 지원의 구체 국가·공급자 내부 조건을 임의로 채우지 않았다. 전체 법률 적합성 승인·공개 본문 반영·최종 서명앱 및 실제 운영설정 검증 완료로 표시하지 않는다.

`analysisConsentApproved=false`, `notionSyncVerified=false` 유지. v7의실기기 로컬검증과v6의실서비스 결과는 해당 버전의 증거로 보존한다. v8 외부모델 재호출·운영DB쓰기 없음.

## 원문

- https://openai.com/policies/services-agreement/
- https://openai.com/policies/data-processing-addendum/
- https://openai.com/policies/sub-processor-list/
- https://developers.openai.com/api/docs/guides/your-data
- https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq
- https://supabase.com/legal/customer-resources/data-processing-addendum
- https://supabase.com/legal/customer-resources/subprocessor-list
- https://render.com/dpa
- https://render.com/security
- https://render.com/docs/logging

Render 계약의 직접 본문 추출에는 한계가 있어 기존 검토 기록과 공식 도메인 검색 색인을 대조했다. 실제 계약 적용·처리 국가를 새로 확인했다는 뜻으로 확대하지 않는다.
