# 실제 분석 1단계 — 기존 사례 검색

> 이전 단계 기록입니다. 생성 결과·캐시·화면 통합의 현재 구현은 [CURRENT.md](CURRENT.md)를 따릅니다.

2026-11-01, main `308daa2` 화면 흐름을 기준으로 구현. 전체 LLM 기능 완료가 아니다.

## 화면에서 실제로 사용하는 부분

| 화면 | 현재 연결 | GPT 사용 |
| --- | --- | --- |
| A01 / B01 | 카테고리·기존 사례 선택 | 없음 |
| A02 | `analysisUserText: string`, `analysisUserPhotos: File[]` 전달 | 개발 도구에서 실제 모드 선택 후 분석 버튼을 누를 때만 |
| A04 | running 상태, 취소·뒤로·X는 기존 화면 동작 유지 | 서버 요청 1개, 자동 재시도 없음 |
| B02 | existing의 `caseId`로 기존 `getSolutionById` 조회 | 기존 원문 재작성 없음 |
| B03 | 같은 사례 contacts의 문장을 합쳐 표시·선택·편집·복사 | 추가 호출 없음 |
| A05 | insufficient/unsafe 판단 또는 샘플 실패 | 재입력은 글·사진 유지, 자동 재호출 없음 |
| F02 | 기존 독립 미리보기 | 자동 오프라인 전환·요청 상태 복구 미연결 |

실제 모드는 개발 서버(`npm run dev`)에서만 선택 가능하며 기본값은 무료 샘플이다.
앱 배포본 / Android에는 이 로컬 서버를 연결한 것으로 보고하지 않는다.
현재 A04의 ‘최대 1분’ 문구는 기존 화면 문구다. 이번 코드에 제품용 시간 제한을 정한 것은 아니다.

## 호출 및 결과

`createHttpAnalysisClient({catalog: serializeCatalog(solutionCases), getSolutionById})`의
`startAnalysis(input, onState)`와 반환된 `handle.cancel()`은 기존 샘플과 같은 호출 방식이다.
`requestId`, `mode`, running/succeeded/failed/cancelled 상태는 기존 계약을 유지한다.
취소·새 요청 뒤 이전 응답은 무시한다. 화면 이동은 계속 예슬 쪽 콜백이 담당한다.

- `{ source: 'existing', caseId: '욕실·수도:1' }`: 원본 사례로 이동.
- `{ source: 'needs-generation' }`: **검색 단계만 완료**. 분석 실패가 아니고 생성 결과도 아니다.
  현재는 A02에 입력을 유지하고 개발 도구에 미연결 상태를 표시한다. 사용자용 최종 동작이 아니다.
- insufficient-input / unsafe-input: 현 A05 사용. 최종 사유별 안내·재시도 정책은 추가 합의 필요.
- 서버 연결·과금 제한·데이터 버전·응답 검증 오류: A02에 보존, 개발 안내에 원인 코드 표시.
  이를 오프라인이라고 단정하거나 자동으로 새 유료 요청을 보내지 않는다.

프론트는 FormData로 기존 두 필드와 `requestId`, `catalogVersion`을 전송한다.
서버는 B 화면과 동일 CSV 변환기 및 삭제 목록을 이용한다. 검색용 필드만 정렬·해시하여
서버와 화면의 데이터가 다르면 유료 호출 전에 중단한다. 사례 ID는 분야+번호이며 재사용하면 안 된다.
현재는 53개 전체의 id·증상·예상 원인·단계를 한 번에 비교한다. 임의 적합성 점수 기준은 없다.
사진·글은 지시가 아닌 자료로 취급하고, 관찰되지 않은 원인 단정과 위험한 DIY 선택을 금지한다.
모델의 판단 정확도·안전을 보증하는 것은 아니며 실제 주거 사진 평가가 별도로 필요하다.

## 다음 순서와 먼저 합의할 내용

1. 현재 검색 연결과 실패·취소·입력 보존을 소원이 확인한다.
2. 연우와 생성 결과의 필수 항목, 빈 항목, 단계/문의 문장 구조 및 생성 결과 샘플을 확정한다.
   현재 `generatedResultDraft`는 계속 검토 초안이다. B 표시용 타입 전체를 API 생성 대상으로 쓰지 않는다.
3. 예슬과 생성 결과를 B02/B03에 전달하는 경로를 정한다. 현재 App/SolutionsFlow는 사례 ID 조회만 받는다.
   새 결과를 가짜 기존 사례 ID로 조회하거나 공동 CSV에 추가하지 않는다.
4. 정보가 충분한 no_match에만 생성 단계를 붙이고, 응답 구조·실제 값·필수 항목을 다시 검증한다.
   사진 규격/압축, 실패 문구, 시간 제한/재시도, 중단 후 늦은 응답, F02 복구를 함께 검증한다.
5. 실제 주거 사진으로 정확도·위험 사례 평가 후 개발/배포 서버·접근 제한·담당자·예산을 결정한다.

생성 시 배상 책임·관리용 번호·유튜브 URL·사진 URL을 추측해서 채우지 않는다.
개인정보나 얼굴·주소가 포함된 사진은 개발 테스트 자료로 사용하지 않는다.

공통 문서 변경 필요 목록: W9 PRD/화면 기능정의의 기존 사례 우선 선택→no_match일 때만 생성,
`no_match ≠ 분석 실패`, ID로 원본 조회, 생성 결과의 별도 전달, 위 표의 서버/F02 미연결 범위.
공통 문서를 이번 변경에서 직접 수정하지 않았다.

## 이번 변경 파일

- `src/analysis/catalog.ts`: 화면·서버 공통 검색 자료 직렬화.
- `src/analysis/http-client.ts`, `http-client.test.mjs`: 실제 FormData 전송·검증·취소 및 무료 검사.
- `src/analysis/client.ts`, `index.ts`: 검색 완료 후 생성 필요 상태와 서버 오류 코드 연결·내보내기.
- `src/app-screens/problem/ProblemPreview.tsx`: 기존 A 화면의 개발 도구에서 샘플/실제 모드 선택, 결과 콜백 연결.
- `server/analysis/catalog.mjs`, `matcher.mjs`, `server.mjs`, `matching.test.mjs`: 같은 원본 CSV 로드,
  GPT 선택·응답 검증, 로컬 서버/접근·비용 보호, 무료 검사.
- `src/analysis/INTEGRATION.md`, `IMPLEMENTATION.md`, `VALIDATION.md`, `server/analysis/README.md`:
  연결 계약 추가 사항·실행법·미완료 범위·검증 증거.

기존 `server/analysis/verify-openai.*`, `.env.example`, 키 파일은 이번 구현에서 변경하지 않았다.
공통 컴포넌트/스타일/디자인 문서, App.tsx/main.tsx, B 화면, 의존성 구성은 변경하지 않았다.
