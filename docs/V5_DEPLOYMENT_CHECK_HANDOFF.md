# 소원 확인 요청: v5 동의 증빙 DB·서버 적용 상태

기준 main: `c18a3cf`(PR #58 포함). 동의 원본 버전: `2026-11-10-v5`.

이번에는 상태 확인만 한다. AI·사진 분석·평가·캐시·신고·철회·삭제 기능은 유지한다. DB 마이그레이션, 배포, 환경변수·권한·요금제·리전 변경은 하지 않는다. 이미 기록된 서울/Free/DPA/백업/11월 6일 54개 검사 항목은 다시 요청하지 않는다.

## 1. Supabase: 읽기 전용 SQL 결과

1. 기존 어쩌집 운영 프로젝트를 연다. 새 프로젝트를 만들지 않는다.
2. SQL Editor에서 새 쿼리를 연다.
3. 이 저장소의 [check-consent-evidence-readonly.sql](../server/analysis/check-consent-evidence-readonly.sql)을 전체 복사한다. `consent-evidence.sql`은 적용용 파일이므로 이번 확인에서 실행하지 않는다.
4. 내용을 확인하고 Run으로 실행한다. 이 파일은 read only 트랜잭션 안에서 테이블·컬럼·함수·권한 메타데이터만 조회한다. 사용자 자료·키·토큰·이벤트 행을 조회하거나 변경하지 않는다.
5. 결과의 테이블/RLS/권한, 필수 컬럼, RPC, 함수 계약 표식을 전달한다. 결과 표가 하나만 표시되면 각 SELECT 구간을 각각 실행해 모든 결과를 확인해도 된다. 각 SELECT도 메타데이터 조회뿐이다. SQL 수정·권한 확대는 하지 않는다.
6. 오류가 나면 오류 문구를 전달하고 중단한다. 누락 항목을 확인했다고 마이그레이션을 바로 적용하지 않는다. 전체 로그·접속 문자열·키·사용자 자료는 전달하지 않는다.

### 결과 해석

- 4개 대상 테이블의 `exists`와 `rls_enabled`: true 기대.
- `anon_can_select`, `app_can_select`: false 기대. `server_can_select`: true 기대.
- `howhouse_release_users`의 `server_can_update`: true일 수 있다. 나머지 신규 증빙 3개 테이블은 서버 직접 UPDATE도 false 기대. 변경은 승인된 RPC로 수행한다.
- 항목별 동의 필수 컬럼 6개의 `exists`: true 기대.
- 증빙 RPC 2개의 `exists`, `server_can_execute`: true 기대. `anon_can_execute`, `app_can_execute`: false 기대.
- `howhouse_record_consent`의 영수증 반환·두 선택 전달 표식: true 기대.
- false/null 또는 함수 표식 결과 0행이면 해당 부분이 누락·불일치일 수 있다. 임의로 권한을 열지 않는다.

이 점검은 스키마와 일부 계약을 확인하는 도구다. 함수 전체가 main과 동일한지, 실제 동의 저장이 성공하는지, 출시 승인이 끝났는지까지 증명하지 않는다. 아직 새 동의를 받지 않았다면 v5 문서/이벤트 행이 없는 것은 정상일 수 있다. 사용자별 행을 추가하거나 과거 동의를 v5로 소급 생성하지 않는다.

## 2. Render: 현재 실제 Live 배포의 커밋

1. https://dashboard.render.com/ 에서 기존 분석 서버 `howhouse-analysis-test`를 연다. 서비스 이름이 바뀌었다면 서비스 주소가 `https://howhouse-analysis-test.onrender.com`인지 확인한다.
2. **Deploys** 화면에서 **Live 배지가 붙은 배포**를 찾는다. 맨 위의 최신 시도와 현재 Live 배포가 다를 수 있다. 실패/빌드 중인 배포를 선택하지 않는다.
3. 해당 배포의 상세를 열고 연결된 Git 커밋의 SHA를 복사한다. 짧은 SHA만 보이면 커밋 링크에서 전체 SHA를 확인한다. 배포 ID(`dep-...`)와 Git 커밋 SHA는 다르다.
4. 아래 항목만 전달한다: 서비스 이름, Live 커밋 SHA, Live 배포 일시, 연결된 저장소/브랜치. 브랜치는 Settings에서 읽기만 한다. Deploys 화면에 항목이 없으면 보이는 상태만 전달한다.
5. **Manual Deploy / Deploy latest commit / Restart / Rollback / Save Changes**를 누르지 않는다. 환경변수 페이지의 비밀 값을 캡처하지 않는다. 자동 배포 설정도 변경하지 않는다.

공식 근거: [Deploying on Render](https://render.com/docs/deploys), [현재 Live 배포 표시](https://render.com/blog/deploys-page). Live 배지는 현재 트래픽을 처리하는 배포이며 최신 배포 시도와 다를 수 있다.

## 3. 답변 양식

```text
[v5 운영 적용 상태 확인]
확인 일시(KST):
Supabase: 기존 어쩌집 프로젝트에서 실행했음 / 실행 못 함
DB 점검 결과: (결과 표 또는 CSV 첨부, 오류면 오류 문구)
Render 서비스:
현재 Live 커밋 SHA:
Live 배포 일시:
연결 저장소/브랜치:
이번에 설정 변경·배포·마이그레이션 실행 안 함: 예/아니오
```

비밀번호·API 키·삭제 코드·사용자 원문은 포함하지 않는다. 확인 결과는 사용자에게 전달하고, 이 문서 때문에 자동으로 제3자에게 메시지를 발송하지 않는다.

## 4. 결과를 받은 뒤 진행할 작업

DB 누락 여부와 실행 커밋을 대조해 빠진 것만 대상으로 잡는다. 적용이 필요하면 `release-data.sql` → `consent-evidence.sql`의 영향과 복구/중단 기준을 설명한 뒤 진행한다. 같은 v5의 서버·호환 앱을 맞추고 동의 영수증·철회·삭제를 검증한다. 출시 승인 파일이나 `RELEASE_DATA_ENABLED`, `PRIVACY_DOCUMENT_READY`, `VITE_RELEASE_PRIVACY_READY`를 이번 확인에서 바꾸지 않는다.

마지막 공개 GET 관찰은 health 200/us, privacy·terms·data-deletion 503이었다. 이는 실행 커밋이나 특정 환경변수 값을 증명하지 않는다. health의 `analysis-v4-...`는 분석 로직 버전이고 동의 문서 v5와 다르다.

## 로컬 검증

읽기 전용 SQL은 PGlite에서 이전 스키마의 증빙 누락 검출과 신규 증빙 적용 후 테이블/RLS/앱 역할 차단/서버 RPC 권한 확인을 통과했다. 운영 DB에는 실행하지 않았다.

## 5. 후속 확인: Render 활성화 플래그 두 개만 읽기

2026-11-10 15:59:55 KST 소원의 전달 결과로 DB 테이블/RLS/권한·필수 컬럼·RPC·계약 표식이 기대값과 일치하고, Render Live 커밋이 `c18a3cfbb53c1ae091a5768a70b33a8276579ec4`임을 확인했다. 이 기록을 근거로 1~3절 SQL/커밋 확인을 반복 요청하지 않는다. 아래는 남은 환경변수 확인만을 위한 절차다. 전달받은 보고에 근거하며 이 문서 작성 중 운영 계정을 재조회하지 않았다.

### 확인 순서

1. https://dashboard.render.com/ → 기존 `howhouse-analysis-test` 서비스 → **Environment**를 연다.
2. Environment Variables 목록에서 이름이 정확히 아래 두 개인 항목만 찾는다.
   - `RELEASE_DATA_ENABLED`
   - `PRIVACY_DOCUMENT_READY`
3. 각 항목의 표시된 값을 그대로 기록한다. `0`, `1`, 빈 문자열, 항목 없음, 값 확인 불가를 구분한다. 값이 마스킹돼 있으면 해당 두 비밀이 아닌 플래그만 확인하고, 다른 키·접속 문자열을 펼치거나 복사하지 않는다. 읽기 화면에서 확인할 수 없으면 편집·저장 대신 '확인 불가'로 답한다.
4. 서비스 자체에 항목이 없으면 같은 화면의 **Linked Environment Groups**에서 이미 연결된 그룹에 같은 이름이 있는지 읽기만 한다. 그룹을 연결·해제·수정하지 않는다. 출처를 서비스 직접 설정/연결 그룹/없음/확인 불가로 구분한다.
5. 서비스 직접 설정이 있으면 연결 그룹의 동일 이름보다 우선한다. 여러 그룹에 같은 이름이 있고 직접 설정이 없다면 각 그룹의 해당 값과 '중복 정의' 사실만 기록하고 최종 값을 추정하지 않는다.
6. 화면에 미배포 변경이나 값 변경 시점의 표시가 있으면 그 사실만 적는다. **대시보드에 저장된 값이 현재 Live 프로세스에 반영됐다고 자동 단정하지 않는다.** 저장만 하고 배포하지 않은 설정이 있을 수 있다. 표시나 기존 기록으로 배포 반영 여부를 모르면 '실행값 미확인'이라고 답한다. 확인 목적으로 새로 배포하거나 재시작하지 않는다.
7. 전체 환경변수 화면은 캡처하지 말고 아래 텍스트 양식으로 두 항목만 전달한다.

### 이번에 하지 않을 것

- 값 입력·수정, Edit 적용, **Save only / Save and deploy / Save, rebuild, and deploy / Save Changes** 선택.
- 환경변수/그룹 추가·삭제·연결·해제.
- Manual Deploy, Restart, Rollback, Shell 명령 실행.
- Supabase SQL 마이그레이션이나 권한 변경.
- 다른 비밀 키·토큰·인증 정보·전체 환경변수 내보내기.

### 두 값의 의미 — 변경 지시가 아님

| 플래그 | 현재 코드의 의미 | 주의할 영향 |
|---|---|---|
| `RELEASE_DATA_ENABLED` | 문자열 `1`일 때 증빙·삭제용 releaseStore를 생성하고 스키마 확인·삭제 작업자를 연결 | 구형 앱의 동의 호환과 삭제 대기 작업 처리에 영향. 이번에 켜지 않음 |
| `PRIVACY_DOCUMENT_READY` | 문자열 `1`일 때 공개 문서·외부 삭제 페이지의 준비 상태로 전달 | privacy/terms는 별도 분석 승인 파일도 검사. 값만 켜도 분석 승인이 완료되는 것은 아님 |

다른 값/미설정은 이 코드의 활성화 조건에 해당하지 않는다. 단, 표시가 마스킹되거나 확인되지 않은 값을 임의로 0으로 기록하지 않는다. AI·사진 기능은 삭제하지 않으며, `analysisConsentApproved`와 앱 `VITE_RELEASE_PRIVACY_READY`도 이번에 변경하지 않는다. 공개 페이지 503만으로 특정 플래그 값을 역산하지 않는다.

### 답변 양식 — 이것만 보내면 됨

```text
[Render 플래그 읽기 전용 확인]
확인 시각(KST):
서비스: howhouse-analysis-test
RELEASE_DATA_ENABLED 표시값: 0 / 1 / 빈 값 / 항목 없음 / 확인 불가 / 기타(그대로)
출처: 서비스 직접 설정 / 연결 그룹(해당 그룹 이름) / 없음 / 확인 불가
PRIVACY_DOCUMENT_READY 표시값: 0 / 1 / 빈 값 / 항목 없음 / 확인 불가 / 기타(그대로)
출처: 서비스 직접 설정 / 연결 그룹(해당 그룹 이름) / 없음 / 확인 불가
동일 이름이 여러 그룹에 정의됨: 없음 / 있음 / 확인 불가
현재 Live에 반영된 값인지: 기존 배포 기록상 확인됨(근거) / 미확인
미배포 변경 표시: 없음 / 있음 / 확인 불가
이번에 값 수정·저장·배포·재시작 안 함: 예/아니오
```

결과를 받으면 기존 DB·Live 커밋 확인과 합쳐, 필요한 활성화 변경과 영향을 먼저 설명한다. 값이 1로 보인다는 이유만으로 실제 동의 저장 성공이나 출시 가능 상태로 처리하지 않는다.

공식 근거: [Render 환경변수와 환경 그룹](https://render.com/docs/configure-environment-variables). 서비스 직접 값 우선, 그룹 간 중복 정의의 우선순위 미보장, Save only 값은 다음 배포 전까지 미반영이라는 설명을 따른다.
