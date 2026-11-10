# 사진 데이터 최소화와 v6 고지 — 로컬 검토본

2026-11-10. `codex/photo-privacy-minimization`에서만 변경. main 병합·push·배포·운영 설정 변경 없음. Supabase Free, 글·사진 분석, 기존 동의 증빙·삭제 기능 유지.

## 구현

- `src/analysis/photo-privacy.ts`: 브라우저에서 사진 디코딩 후 동일 표시 크기로 새 이미지 인코딩. 원본 EXIF/GPS/XMP·원본 파일명·파일 수정 시각을 복사하지 않는다. JPEG/WebP는 재압축될 수 있다. 얼굴·주소 등 픽셀에 보이는 정보는 제거하지 않는다.
- `src/analysis/http-client.ts`: 사진을 순차 정리한 뒤 인증·세션·분석 요청 진행. 실패·취소 시 원본 전송으로 대체하지 않는다. 글만 입력한 분석은 디코더 없이 동작한다. 기존 장당 4 MiB 제한을 새 파일에도 적용한다. 재인코딩으로 커지는 사진은 원본 전송 대신 오류로 중단한다.
- 동의 본문이 바뀌므로 로컬 버전은 `2026-11-10-v6`. v5 증빙을 덮어쓰지 않는다. 새 본문 동의는 새 영수증으로 수집하는 기존 버전 검증을 따른다. DB 마이그레이션을 추가하지 않는다.
- 앱 본문과 `docs/policies/`의 노션 전달용 6개 문서·manifest를 동기화했다. 실제 Notion은 수정하지 않았다. 현재 문구는 공개 근거를 반영한 검토본이며 최종 적합성 승인이 아니다.
- `analysisConsentApproved=false`, `notionSyncVerified=false` 유지.

## 공개 근거 반영

- Render: 싱가포르 분석 배치와 계약상 미국 운영을 구분. Hobby 로그 7일과 내부 전체 자료 보유 조건을 구분. DPA의 서비스·업무·법령상 필요 및 완료 후 반환·삭제 기준 반영.
- Supabase: 서울 DB/Auth, 싱가포르 계약 법인, 미국 지원 법인, EU 로그를 구분. 계약 기간·조기 삭제·계약 만료 후 반환 기간을 반영. 이를 개별 로그 30일 보유로 해석하지 않음.
- OpenAI: 미국 지정 API, 기본 악용 모니터링 및 조건부 콘텐츠 검토를 구분. 공개 목록의 TaskUs(필리핀), Accenture International Limited(미국·캐나다·필리핀), Cinder Technologies(미국)를 조건부로 기재. 모든 요청의 전달처로 표현하지 않음.

근거: [Render DPA](https://render.com/dpa), [Render 로그](https://render.com/docs/logging), [Supabase DPA](https://supabase.com/legal/customer-resources/data-processing-addendum), [Supabase FAQ](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq), [OpenAI 목록](https://openai.com/policies/sub-processor-list/), [OpenAI 데이터 처리](https://developers.openai.com/api/docs/guides/your-data).

## 검증 및 재현

- 타입 검사: `node node_modules/typescript/bin/tsc --noEmit`
- 고지 동기화: `node scripts/sync-policy-documents.mjs --check`
- 전송 단위 검증: `node --experimental-strip-types --test src/analysis/http-client.test.mjs`
- 실제 로컬 브라우저: `node scripts/verify-photo-privacy.mjs <결과.json>` (`CHROME_PATH`로 Chromium 실행 파일 지정 가능). 합성 JPEG의 EXIF 방향/GPS 및 XMP, PNG 텍스트, WebP 메타데이터를 사용. 제거·방향·표시 크기·실패 중단 검증. 외부 서비스·유료 API 호출 없음.
- 관련 전체 자동 검증 230개 통과. 이 결과는 실제 Android WebView·실제 AI 답변 품질의 검증을 대신하지 않는다.

## 출시 전 남은 완료 조건

1. **고지·근거 판단**: Supabase의 EU 개별 로그국·글로벌 지원국, Render 기타 운영 경로 및 내부 기록별 보유 조건 등 공개 자료의 남은 공백에 대해 고지 충족 여부와 적용 근거를 정리한다. 모든 미확정 사실을 자동 위법으로 판정하지 않는다. 메타데이터 제거가 이 판단을 대체하지 않는다.
2. **최종 Android와 실제 서버**: 카메라·갤러리·회전 사진·장당 제한 근처 사진, 정리 실패, 거부·철회 후 네트워크, v6 저장 영수증과 분석 연결, 철회 후 분석 차단, 삭제·재시도·완료 확인. 기존 기기를 사용하되 실제 모델 성공 검증에는 기존 API 사용료가 발생할 수 있다. 승인되지 않은 운영 서버를 열어 테스트하지 않는다.
3. **공개 본문 일치**: 예슬이의 Notion 6개 페이지 반영 및 공개 접근, 앱·서버 본문·버전·해시 일치 확인.
4. **반영 승인**: 위 조건 완료 후 PR 검토·main 반영·배포·출시 빌드. 이번 요청에서는 하지 않는다. 스토어 제출·심사 완료와 기술 준비 완료를 구분한다.

개발·실기기 검증의 일정은 기기와 테스트 환경 확보 후 약 1작업일을 목표로 잡을 수 있는 작업량 추정이다. 법적 고지 판단·팀 반영·스토어 심사 기한을 포함하거나 보장하는 출시일이 아니다. 현재 날짜로 출시일 확정은 불가하며, 공백 해결과 별개로 위 실검증·문서·반영 절차도 필요하다.
