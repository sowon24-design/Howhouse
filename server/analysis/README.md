# 로컬 분석 서버

현재 전체 계약·보안·비용: [CURRENT.md](../../src/analysis/CURRENT.md).
팀 연결: [YESUL_HANDOFF.md](../../src/analysis/YESUL_HANDOFF.md).

## 실행

프로젝트 지정 Node.js 24.15.0 이상 24.x와 npm 11.12.1을 사용한다.
라이브러리를 추가 설치하지 않는다. 저장소 루트에서 각각 별도 PowerShell 창으로 실행한다.

```powershell
node server/analysis/server.mjs
npm run dev -- --strictPort
```

화면 http://127.0.0.1:5173/#problem, 분석 서버 8787. 종료는 각 창 Ctrl+C.
키/모델은 이 폴더의 `.env`에서만 읽고 `.env.example`을 참고한다. 키를 채팅/프론트/Android/VITE_에 넣지 않는다.
`node server/analysis/verify-openai.mjs`는 무료 설정 검사다. `--send-once`는 별도의 유료 점검이므로 반복하지 않는다.

서버 시작 시 비용 기록 append와 저장 폴더의 임시 파일 생성/이름 변경을 검사한다.
쓰기 권한이 없으면 분석 요청을 받기 전에 종료한다. 기존 비용 기록·저장 답변을 덮어쓰지 않는다.
Codex 환경에서 권한이 제한되면 사용자 PowerShell에서 실행한다. 기록을 지우거나 시스템 보안을 해제하지 않는다.

## 동작

- 현재 공통 CSV의 활성 사례 53개와 같은 버전을 비교한다.
- 유효한 저장 답변부터 반환한다. 없으면 실제 모델 요청 1개로 기존 사례 판단 및 필요한 생성/문의 문장을 작성한다.
- strict JSON schema 및 서버/프론트 검증. 기존 사례는 원문 ID만 반환한다.
- 프론트 전체 요청/서버 모델 작업 90초, 실패·취소 자동 재시도 없음. 늦은 결과 무시.
- 개발 분석 호출 누적 최대 10회. 실제 남은 수는 시작 로그/로컬 기록을 기준으로 한다. 실패·취소도 시도에 포함한다.
- 원본 글/사진·키는 파일/콘솔에 기록하지 않는다. 답변은 로컬 AES-GCM 암호화 저장, 입력 키는 HMAC.
- 비용 기록과 캐시는 `.local`로 Git에서 제외. `.env.example`만 공유한다.
- 실제 OpenAI 청구는 Usage/Billing 기준이며 호출 횟수 제한은 달러 상한을 보증하지 않는다.

## 개발 경로

- GET /session: 임시 로컬 세션 토큰, 남은 개발 호출 수.
- GET /health: 로컬 서버 응답 확인.
- GET /health?upstream=1: 키/모델 없이 OpenAI 네트워크 경로 확인.
- POST /api/analysis/match: 글/사진 분석.

로컬 127.0.0.1에만 열며 허용된 localhost Origin/Host/세션을 검사한다.
이 토큰은 외부 배포의 사용자 인증이 아니다. 현재 서버를 공개 터널로 노출하지 않는다.
입력 6000자, JPEG/PNG/WebP 최대 5장/파일당 4MiB/전체 본문 12MiB. 임의 압축이나 사진 누락 없음.
요청 상태 재개 API 없음. 취소 시 상위 요청 중단을 시도하지만 이미 발생한 과금 중단/환불은 보장하지 않는다.

## 무료 검사

```powershell
node --test src/analysis/*.test.mjs server/analysis/*.test.mjs src/app-screens/problem/native-photos.test.mjs
npm run build
npm run verify:foundations
```

검사는 가짜 제공사 응답/임시 서버를 사용한다. 외부 서버 준비·제약은 [DEPLOYMENT.md](../../src/analysis/DEPLOYMENT.md).
