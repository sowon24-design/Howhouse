# API 주소 설정 — 예슬 전달용

2026-11-01 후속 연결. 변경 범위는 분석 모듈·검사·이 문서다.
App.tsx, ProblemPreview.tsx, ConnectivityBoundary.tsx 및 Android 보안 설정은 이번에 수정하지 않는다.
API/샘플 모드 UI와 일반 화면 F02 복귀는 예슬 담당으로 유지한다.

## 주소 선택 우선순위

1. 함수 옵션 `baseUrl` (분석 함수와 health 함수에 같은 값을 전달).
2. Vite 환경변수 `VITE_ANALYSIS_API_BASE_URL` (기존 호출 코드를 바꾸지 않고 둘 다 적용).
3. 미설정이면 기존 PC 개발 주소 `http://127.0.0.1:8787`.

주소는 API 루트다. `/api/analysis/match`까지 넣지 않는다. 마지막 /는 제거하며 서버 앞의 경로 prefix는 유지한다.
예: https://team.example/howhouse → /howhouse/session, /howhouse/api/analysis/match, /howhouse/health.
예시 도메인은 설명용이며 실제 배포 주소가 아니다.

```ts
const baseUrl = 'https://실제로-준비한-서버-주소'
const analysis = createHttpAnalysisClient({
  catalog: serializeCatalog(solutionCases), getSolutionById, baseUrl,
})
const status = await checkAnalysisConnection({ baseUrl, verifyUpstream: true })
```

앱 UI를 바꾸지 않으려면 환경변수 방식을 사용한다. 공개 가능한 서버 주소만 넣으며 API 키/공유 비밀번호는 넣지 않는다.

## 환경변수로 실행·빌드

루트의 무시되는 `.env.local`에 필요한 주소를 설정한다. 서버 키 파일 `server/analysis/.env`와 다르다.

```dotenv
VITE_ANALYSIS_API_BASE_URL=http://127.0.0.1:8787
```

PC에서는 설정 없이 기존 실행을 계속 사용할 수 있다. 설정 변경 뒤 Vite를 다시 시작한다.
환경별로 `.env.android.local`을 사용하려면 실제 HTTPS 서버가 준비된 뒤 아래 순서로 빌드한다.
기존 `.env.local`이 있으면 덮어쓰지 말고 필요한 한 줄만 조정한다.

```powershell
# .env.android.local: VITE_ANALYSIS_API_BASE_URL=https://실제-시험-서버
npm run build -- --mode android
npx cap sync android
```

주소는 Vite 빌드 시 앱에 포함된다. 설치한 앱의 주소를 바꾸려면 다시 빌드·sync·설치해야 한다.
현재 `npm run android:sync`는 기본 모드로 build를 다시 수행하므로 android 모드 빌드를 유지하려면 위 순서를 사용한다.
공식: [Vite 환경변수/모드](https://vite.dev/guide/env-and-mode).

## PC·Android·배포 구분

| 환경 | 주소/방법 | 검증 상태·추가 조건 |
| --- | --- | --- |
| PC 웹 개발 | 기본 http://127.0.0.1:8787 | 기존 동작 유지 |
| USB 폰 Chrome | 기본 주소 + adb reverse 5173/8787 | 이전 실제 분석 성공 확인. 재연결 시 포트 설정 확인 |
| Android APK/WebView | 준비된 HTTPS 서버 주소를 빌드 환경변수로 지정하는 방식 우선 | 아직 실서버/인증/APK 연결 미검증. 주소 설정만으로 완료가 아님 |
| Android 에뮬레이터 | http://10.0.2.2:8787 형식은 주소 검증상 허용 | 현재 서버 Host 허용 목록에는 없음. 서버 측 정책·앱 HTTP 조건을 별도 검토해야 하며 바로 연결된다고 안내하지 않음 |
| 이후 팀 전용 서버 | 실제 HTTPS API 루트 | 인증·허용 Origin·영구 한도/저장 격리·배포 작업 필요. DEPLOYMENT.md 참조 |

현재 서버는 loopback에만 열고 `http://127.0.0.1:5173`, `http://localhost:5173` Origin만 허용한다.
Capacitor 앱의 Origin은 PC 웹과 다를 수 있다. 예슬 쪽 실제 앱의 `window.location.origin`과
Live Reload/번들 앱 여부를 확인한 뒤 서버의 정확한 허용 Origin을 별도 맞춘다.
APK에서 PC loopback HTTP를 쓰려면 adb reverse 외에도 WebView의 HTTPS/HTTP 혼합 콘텐츠 및 Android 네트워크 정책을 확인해야 한다.
이번 변경에서 wildcard CORS, 임의 LAN 공개, cleartext/mixed-content 보안 해제는 적용하지 않았다.
공식 설정 참고: [Capacitor config](https://capacitorjs.com/docs/config).

## 연결 확인 함수 사용

기존 `checkAnalysisConnection({verifyUpstream:true})` 의미는 그대로다. 분석 서버와 OpenAI 네트워크 경로만 확인하며 자동 분석은 하지 않는다.
일반 화면의 인터넷 복구 여부를 대신하지 않는다. 일반 화면 복귀와 분석 경로 확인을 나누는 처리는 예슬이 연결한다.
기본 PC 서버 확인의 scope는 기존 `local-analysis-server`, 다른 설정 주소 확인은 `analysis-server`,
상위 네트워크까지 확인하면 `analysis-path`다. status의 reachable만 해당 확인이 성공했다는 뜻이다.
Origin/CORS/HTTP 정책으로 접속이 막혀도 fetch만으로 물리적 인터넷 단절이라고 확정하지 않는다.

주소는 HTTPS 또는 제한된 로컬 개발 HTTP만 허용한다. 인증정보·쿼리·해시·외부 HTTP는 설정 오류로 거절하며 네트워크 요청을 보내지 않는다.
잘못된 설정은 연결 실패로 숨기지 않고 함수 생성/호출 시 오류를 낸다. 개발자가 실행/빌드 설정을 고쳐야 한다.
API 키는 계속 서버에서만 읽으며 이 설정은 공개 서버의 인증을 대체하지 않는다.

## 무료 검사

주소 우선순위·경로 prefix·금지 주소·session/분석/health 동일 서버 사용·설정 오류 시 0회 전송을 모의 응답으로 검사한다.
이번 검사는 API를 호출하지 않으며 실제 Android·외부 서버 성공을 대신하지 않는다.
