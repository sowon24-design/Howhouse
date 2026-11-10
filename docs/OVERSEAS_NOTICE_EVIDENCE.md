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

기존 고지의 주계약 수령자·연락처, Render 싱가포르/미국 구분, OpenAI 미국 지정 API·조건부 검토·보관 예외는 유지한다. 이번 검토에서 Render DPA 웹 추출은 본문이 누락돼 기존 계약 검토 기록을 근거로 유지했으며, 새 처리국·기간·계약 조항을 확정한 것으로 표시하지 않는다.

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
