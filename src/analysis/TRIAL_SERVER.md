# 공용 시험 서버 — 현재 결정과 연결

2026-11-01 최신 사용자 결정:

- 앱을 받은 시험 사용자는 모두 분석 사용 가능. 별도 가입·로그인 화면 없음.
- 시험 단계에는 하루/사용자별/누적 분석 횟수 제한을 두지 않음. 공개 출시 전 다시 결정.
- OpenAI 키는 소원 소유 Render 계정의 서버 환경변수에만 보관. 앱/CSV/Git/채팅에 넣지 않음.
- 앱은 Supabase 자동 임시 인증을 사용. 이메일/비밀번호 입력이나 사용자 ID 허용 목록 없음.
- API의 인증 토큰/공개 식별 키는 OpenAI 키가 아니며, 서버 비밀 키와 구분.

이 문서는 기존 DEPLOYMENT.md의 '초대 계정 한정' 제안을 대체한다.
모든 앱 사용자가 임시 인증을 얻을 수 있으므로 배포 주소·앱이 외부로 전달되면 외부 호출도 가능하다.
이를 설치자만 사용할 수 있는 강한 앱 진위 검증으로 표현하지 않는다. 호출 한도 없음은 사용자의 시험 단계 결정이며 비용 0원 보장이 아니다.

## 실제로 준비한 계정/프로젝트

- 소원이 Render와 Supabase에 가입·로그인 완료.
- Supabase: Howhouse Test / howhouse-analysis-test, 서울 지역, 무료 조직.
- 새 테이블 자동 공개 끔, 자동 RLS 켬. 실제 SQL 테이블/함수 설정 적용 성공.
- Render: howhouse-analysis-test 생성 양식, Free $0/month, Singapore, Build `npm ci`, Start `node server/analysis/trial-server.mjs` 준비.
- 아직 Render 배포/서버 비밀 설정/앱 빌드/실기기 외부 API 검증은 미완료. 이 문서만으로 배포 완료를 주장하지 않는다.

## 서버 실행 구조

- 기존 `server.mjs` 직접 실행: PC/USB 개발용. 이전 누적 10회 보호 한도는 이 경로에만 남음.
- `trial-server.mjs`: 소원 소유 호스팅 서버용. 일일/누적 분석 횟수 제한 없음. 대신 요청 형식·사진 크기·90초 제한과 동시 작업 충돌 처리는 유지.
- Supabase가 확인한 모든 authenticated 사용자(임시 사용자 포함)를 허용. OpenAI 키로 앱 사용자를 인증하지 않음.
- 사용자별 DB 캐시/호출 기록. 원본 글·사진 저장 없음. 답변은 AES-GCM 암호화, 입력 비교는 HMAC, 7일 재사용/최대 100개.
- 사용자 토큰은 Supabase /auth/v1/user에서 확인하며, 다른 사용자의 저장 답변을 조회하지 않음.
- DB 접속 실패 시 유료 호출 전에 중단. 재배포해도 기록/캐시는 Supabase에 남음.
- 단일 무료 인스턴스의 동일 요청 합치기. 다중 인스턴스의 전역 중복 잠금/출시용 봇 방어는 후속 범위.

## Render에 소원만 직접 넣을 값

| 이름 | 값/보관 위치 |
| --- | --- |
| ANALYSIS_PRIVATE_TRIAL | 1 (출시 보호 정책을 적용한 공개 서비스라는 뜻은 아님) |
| OPENAI_API_KEY | 소원만 직접 입력. 기존 키를 채팅/소스에 보내지 않음 |
| OPENAI_MODEL | gpt-6.1-terra |
| SUPABASE_URL | 소원 프로젝트의 HTTPS URL |
| SUPABASE_PUBLISHABLE_KEY | 프로젝트 공개 식별용 sb_publishable_... |
| SUPABASE_SECRET_KEY | 프로젝트 서버 전용 sb_secret_... 값. 앱에는 넣지 않음 |
| ANALYSIS_CACHE_ENCRYPTION_KEY | 32바이트 base64 비밀 값. 재배포 때 동일 값 유지 |
| ANALYSIS_ALLOWED_ORIGINS | 실제 앱/Web Origin을 정확히 나열. * 금지 |

Render는 RENDER_EXTERNAL_URL과 PORT를 자동 설정한다. 다른 호스팅이면 ANALYSIS_PUBLIC_URL/PORT를 직접 지정한다.
호스팅 관리자 권한은 소원 계정만 유지한다. 팀원에게 프로젝트 Owner/secret 조회 권한을 부여하지 않는다.
호스팅 운영자/소원 계정 탈취까지 막는 '절대 키 비공개'를 보장하는 것은 아니다.

## 앱 빌드 설정 (예슬 전달)

```dotenv
VITE_ANALYSIS_API_BASE_URL=https://실제-Render-분석서버
VITE_ANALYSIS_AUTH_URL=https://실제-프로젝트.supabase.co
VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY=sb_publishable_공개식별값
```

위 값 중 Supabase publishable key는 공개해도 되는 식별 값이며 OpenAI/Supabase secret 키가 아니다.
app-session.ts가 첫 분석 때 자동 임시 세션을 만들고 만료 시 refresh한다. 사용자에게 로그인 화면을 요구하지 않는다.
앱에 세션을 저장할 수 없으면 메모리에서만 유지한다. 원본 입력 보존 정책과 별개다.
인증 설정 오류/만료는 auth-required(kind access), 네트워크 단절은 connection-error다. 자동 모델 재시도 없음.
Supabase에서 Anonymous Sign-Ins 활성화가 필요하다. 임시 계정 생성에는 제공사 자체 제한이 있을 수 있으며 분석 횟수 제한과 다르다.

기존 createHttpAnalysisClient 호출은 위 환경변수가 있으면 자동 인증을 사용한다.
checkAnalysisConnection도 같은 설정 사용. getAccessToken 옵션으로 별도 세션 제공 함수를 주입할 수도 있다.
일반 화면 F02 복귀, 샘플/API 모드 UI, App.tsx/ProblemPreview.tsx/ConnectivityBoundary.tsx는 이번 작업에서 변경하지 않는다.

## 검수와 미완료

무료 모의 검사: 자동 임시 인증/재사용/갱신, 모든 유효 사용자 허용, 사용자별 캐시 격리·암호화·만료,
시험 서버의 10회 초과 요청 허용, DB 장애 시 중단, 잘못된 인증과 네트워크 구분.
실제 DB에는 스키마만 적용했으며 실제 Render·앱 연결 성공은 후속 확인이 필요하다.

다음: 서버 코드 전달 → Supabase 임시 인증 활성화 → Render 비밀 값 소원 직접 입력 → 배포 health 확인 →
앱 환경변수 적용/재빌드 → 서로 다른 두 앱 사용자의 실제 분석/저장 답변·키 미노출 확인.

공식 참고: [OpenAI 키 서버 보관](https://developers.openai.com/api/reference/overview),
[Supabase 임시 인증](https://supabase.com/docs/guides/auth/auth-anonymous),
[Supabase 공개 키와 비밀 키](https://supabase.com/docs/guides/getting-started/api-keys),
[Render 무료 서버](https://render.com/docs/free), [Render 환경변수](https://render.com/docs/environment-variables).

## 예슬 연결 시 반드시 확인할 main 상태

main 5cb60db의 ProblemPreview는 초기 mode가 sample이다. 이번 PR은 예슬 작업 중 파일을 건드리지 않는다.
따라서 새 환경변수만 넣었다고 앱의 선택 모드가 자동 API로 바뀌지는 않는다.
실서버 확인 뒤 예슬이 시험 배포 빌드의 기본 모드를 api로 전환해야 실제 분석이 기본 동작한다.
기존 App/ProblemPreview/ConnectivityBoundary 변경을 덮어쓰거나 예슬에게 자동 메시지를 보내지 않는다.
