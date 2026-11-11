# 국외 이전 고지의 공개 근거와 반영 범위

2026-11-10 / PR62 / 미게시 v7 검토본. 업체·개인정보위 문의, main 병합·운영 변경 없음. AI·사진 분석·Supabase Free 유지.

## 확인한 정보와 앱 반영

| 항목 | 반영 내용 | 근거·구분 |
| --- | --- | --- |
| 이전 근거 | AI 관련 국외 위탁·보관에 별도 선택 동의, 거부 시 사례 조회 유지 | 법28조의8제1항1호·제2항. 별도 동의 체크만으로 누락 고지가 보완되지는 않음 |
| 시기·방법 | Render: 분석/관련 기능 이용 시 HTTPS. OpenAI: 분석 서버에서 분석 요청 시 HTTPS. Supabase: 인증/저장 이용 시 HTTPS 및 필요한 운영·보안 접근 | 현재 HTTP/인증/개인정보 클라이언트와 서버 코드. 선택 동의 전 모든 네트워크가 없다는 주장은 하지 않음 |
| Render 항목 | 글·선택 사진·사용자 인증·요청 식별·접속 정보, 요청 처리와 보안 목적 | `src/analysis/http-client.ts`, `server/analysis/trial-access.mjs`, 서버 호스팅의 전송 경계. 로그에 원문·토큰을 직접 남긴다는 의미가 아님 |
| OpenAI 항목 | 글·선택 사진·분석 문맥. 앱 UUID·사용자 인증 토큰을 분석 입력에 별도 첨부하지 않음 | `server/analysis/matcher.mjs`. 공급자 API 사용·보안 정보까지 없다는 의미가 아님 |
| Supabase 항목 | 인증·UUID·암호화 답변·사용량·의견·동의·삭제, 접속/운영 메타데이터 | `trial-store.mjs`, `release-store.mjs`, `feedback-store.mjs`, 공식 FAQ. 암호화는 비개인정보 선언이 아님 |
| Supabase 국가 | DB/Auth 서울, EU 로그, 필요한 미국 지원/운영, 글로벌 보안 지원의 조건부 접근 | FAQ의 DB 지역·선택 지역 외 처리·지원 법인 설명. EU 개별 국가를 임의로 확정하지 않음 |
| Supabase 보유 | 앱 자료별 기간과 DPA 계약 기간·조기 삭제·계약 종료 후 반환/삭제 조건 구분 | DPA11.2·Schedule3. 계약 종료 후30일을 모든 이용자 로그 보관기간으로 표시하지 않음 |
| 하위처리자 | 최신 공식 목록과 역할·조건을 구분해 검토 | Supabase 목록2026-10-12. 목록의 업체 소재국을 이 프로젝트의 실제 처리국으로 일괄 전환하지 않음 |
| 지원·사진 최소화 | 지원 문의에 원문/사진/토큰 미첨부. 사진 메타데이터 제거 및 실패 시 원본 차단. 픽셀 식별 정보는 남음 | 운영자가 채택한 방침 및 `photo-privacy.ts`. 필수 보안 대응·악용 검토까지 차단하는 조치가 아님 |
| 철회·삭제 | 철회는 향후 분석 차단, 계정·서버 자료 삭제는 별도 기능. 소급 취소·공급자 전 자료 즉시 삭제 약속 없음 | privacy-client 및 release-store의 별도 철회·삭제 API |

기존 고지의 주계약 수령자·연락처, Render 싱가포르/미국 구분, OpenAI 미국 지정 API·조건부 검토·보관 예외는 유지한다. Render DPA의 직접 웹 추출은 본문이 누락됐지만 후속 공식 도메인 검색 색인에서6.1·2.4·Exhibit A의 미국 주된 운영·종료 후 반환/삭제·기간 조건을 대조했다. 검색 색인이 프로젝트별 실제 경로를 증명하지는 않는다.

## 국가·수령자 범위의 추가 구체화

법인 소재국, 공식 목록의 처리 가능국, 실제 프로젝트 적용 경로는 구분한다. 아래 목록은 근거 검토용이며 앱 이용자 정보가 모두에게 전달된다는 선언이 아니다.

| 공급자·구간 | 공개 이름·국가·목적 | 우리 구조에 대한 판단 |
| --- | --- | --- |
| Supabase 기본 DB/Auth | 서울 선택 지역, 계약 Supabase Pte. Ltd.(싱가포르), 지원 Supabase, Inc.(미국) | 서울 저장과 해외 지원을 구분. 싱가포르 법인 소재지가 DB 저장국을 뜻하지 않음 |
| Supabase 인프라·운영 목록 | AWS·Google·Cloudflare·Upstash·Vercel(미국), ConfigCat(헝가리), Braintrust·Sentry·Hex·Latacora(미국) | 공식 표의 Country 열이며 실제 서버·로그 처리국으로 자동 전환하지 않음. ConfigCat 헝가리만으로 EU 로그국을 헝가리로 특정하지 않음 |
| Supabase 관리자·지원·선택 기능 목록 | Postmark·FrontApp·HubSpot·Notion·Slack·Sublime·GitHub·Clay·Clazar·OpenAI(미국), Supabase Pte.(싱가포르 marketplace 지원) | 관리자 계정/지원/마켓플레이스 등 역할별 검토. 익명 Auth라는 이유만으로 플랫폼 공통 처리가 모두 사라지는 것도 아니며, 모든 목록 업체에 앱 사진이 간다고 쓰지도 않음 |
| Render 인프라 목록 | AWS·GCP·Cloudflare·ClickHouse Inc.; 공식 표 Entity Country는 모두 미국 | 싱가포르 분석 서버와 법인 소재국을 구분. 개별 요청의 엣지/로그 경로·처리국은 목록만으로 확정하지 않음 |
| OpenAI 조건부 콘텐츠 처리 | TaskUs(필리핀), Accenture International Limited(미국·캐나다·필리핀), Cinder Technologies(미국) | API 적용 역할은 공개됨. 개별 요청이 선택됐는지나 각 재수령자 연락처는 별도 미확정 |
| OpenAI 계열사 운영 | OpenAI OpCo·OAI International(미국), OpenAI Ireland(아일랜드), OpenAI UK(영국), OpenAI Japan(일본) | API 기술·운영 지원의 공개 처리 가능 범위. 미국 지정 API가 모든 시스템·계열사 처리를 미국으로 제한한다는 보장은 아님. 이 프로젝트의 실제 지원 배정은 미확정 |

Supabase 목록은2026-10-12, OpenAI 목록은2026-10-14 기준이다. Render 목록은 아래 보안 페이지에서 확인했다. 각 공급자의 주계약 연락처를 재수령자 개별 연락처인 것처럼 복사하지 않는다.

## 내부 기록 보관 조건의 추가 구체화

| 자료 | 공개된 기간·종료 조건 | 적용 한계 |
| --- | --- | --- |
| Supabase 프로젝트 DB | 활성 프로젝트 동안 유지, 프로젝트 삭제 시 Customer Data는30일 이내 삭제(FAQ) | 이용자가 앱에서 계정을 삭제하는 것과 운영자가 프로젝트 전체를 삭제하는 것은 다름 |
| Supabase 계약 대상 자료 | 기능에 따른 조기 삭제, 계약 만료 후30일 반환 기간 종료 시 대상 사본 삭제(DPA11.2·Schedule3) | 앱 계정 삭제 후 모든 내부 로그30일 보장 아님 |
| Supabase 운영자 계정 정보 | 계정 폐쇄 후 최대60일 개인정보 삭제 기준, 세금·청구·법적 의무 예외(FAQ) | 앱 이용자의 임시 Auth 계정이나 접속 로그에 그대로 적용하지 않음 |
| Supabase 백업·사용 로그 | 백업은 플랜별 조건. 로그·텔레메트리는 운영·보안 목적의 별도 기간 | Free 조회창1일을 내부 전체 보유기간으로 표시하지 않음. 공개 FAQ에 내부 세부 삭제 일수는 없음 |
| Render 서비스 위탁 자료 | 서비스 제공·정당한 업무 필요·법령상 필요 기간(Exhibit A); 서비스 완료 후 선택에 따른 반환/삭제, 법령상 허용·요구 예외. 반환·삭제가 불가한 경우 추가 처리 제한·보호(DPA2.4) | 앱 계정 삭제가 Render 계약 종료나 모든 사본 즉시 삭제를 뜻하지 않음 |
| Render 계정·사용/기기·IP 정보 | 관계 관리·핵심 업무·사기/보안 대응·법적 의무 목적; 기기/IP는 시스템 적정 운영에 필요한 기간. 법적 의무·분쟁·미수금 등 연장 기준(개인정보처리방침) | 대시보드 로그7일과 별개. 고정 일수는 확인되지 않음 |
| OpenAI 응답·악용 기록 | 코드에서store:false. 기본 악용 기록 최대30일 및 예외. 이미지의 잠재적 CSAM 탐지 시 수동 검토 보관 예외(공식 API 문서) | store:false는 완전 무보관이나ZDR 승인 아님. 검토 보관의 고정 상한을 만들어 적지 않음 |

추가 확인으로 보관의 대상·종료 조건은 더 좁혔지만, 내부 세부 기록의 일수와 고지 충분성은 확정하지 않았다. 공급자 운영자 계정 자료를 앱 이용자 국외 이전 표에 섞어 공백을 채우지 않는다. v7 본문은 이 구분을 포함하는 기존 기간 안내로 유지하며, 추가 근거표는 별도 검토 자료로 제공한다. 이번 문서 보완만으로 동의 본문을 다시 변경하거나 해시·버전을 올리지 않았다.

추가 출처: [Render 보안·하위처리자](https://render.com/security), [Render 개인정보처리방침](https://render.com/privacy). DPA2.4·6.1·Exhibit A는 [공식 DPA](https://render.com/dpa)의 공개 색인과 대조했다.

## 공개 근거 목록

- [법28조의8·11](https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029334869)
- [Supabase FAQ, 2026-10-06](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq)
- [Supabase DPA, 2026-08-01](https://supabase.com/legal/customer-resources/data-processing-addendum)
- [Supabase 하위처리자 목록](https://supabase.com/legal/customer-resources/subprocessor-list), [2026-10-12 PDF](https://supabase.com/legal/subprocessor-list/October-12-2026.pdf)
- [Render DPA](https://render.com/dpa), [대시보드 로그](https://render.com/docs/logging)
- [OpenAI 데이터 처리](https://developers.openai.com/api/docs/guides/your-data), [DPA](https://openai.com/policies/data-processing-addendum/), [하위처리자](https://openai.com/policies/sub-processor-list/)

## 아직 확정하지 않은 것

1. EU 개별 로그 국가·미국 외 지원·부수 운영·시스템/계열사의 프로젝트별 실제 수령 경로.
2. 공급자 내부 운영·보안 기록의 상세 종료 조건과 조건형 기간 고지의 충분성.
3. 조건부 재수령자의 연락처와 재이전 고지·보호조치가 필요한 범위.

법정 고지에 필요한 정보가 실제 누락됐다면 동의 요건이 불충분할 수 있다. 반대로 위 표현의 존재 자체만으로 위법·AI 불가능 판정을 내리지 않는다. 문의 없이 공개 자료로 정리한 범위와 적합성 최종 판단을 구별하며 승인값은false로 둔다. 공개 목록 링크 하나가 필요한 국가·수령자 고지를 항상 대체한다고 보지 않는다.

## v6에서 v7로의 변경과 배포 영향

미공개 본문이라도 실제 v6 동의 증빙이 생성된 검증 이력이 있으므로 버전 재사용 대신v7로 올렸다. 앱과 서버는 같은 출처의 새 본문·해시를 사용하며 과거v6 영수증을 현재 동의로 인정하지 않는다. 과거 증빙을v7로 덮어쓰지 않는다. DB 스키마 변경 없음.

PGlite 회귀 검증은v6 증빙 보존→현재 버전 분석428 차단→양쪽 동의 화면의 새 본문 저장→분석→철회428→삭제를 확인한다. v6 실제 Android/외부서비스 검증은 역사적 사실로 보존하고, v7 실서버·최종 서명 앱 검증과 혼동하지 않는다.
