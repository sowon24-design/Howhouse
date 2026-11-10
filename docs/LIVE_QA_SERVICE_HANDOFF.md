# 일회성 실제 연결 검증 서비스

2026-11-10. 검증 브랜치 `codex/live-privacy-qa`. 기존 서비스 start command·main·policy-approval.json을 변경하지 않는다.

별도 Render Free Web Service에만 `node --experimental-strip-types server/analysis/qa-server.mjs`를 사용한다. 기본 Node 버전은 package.json engines의 Node 24를 따른다. 서버는 표준 Node 모듈만 사용하므로 의존성 설치가 없는 build command `node --version`으로 준비 가능하다. 무료 사용량·생성 가능 여부 확인 후 생성한다. 유료 전환·카드 등록 없음.

기존 서버에서 안전하게 연결할 환경변수 이름: `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_PROCESSING_REGION`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `ANALYSIS_CACHE_ENCRYPTION_KEY`. 키를 문서·로그·브라우저 출력·APK에 기록하지 않는다. 새 서비스에만 `ANALYSIS_PRIVATE_TRIAL=1`, `ANALYSIS_ALLOWED_ORIGINS=https://localhost`, `HOWHOUSE_ISOLATED_QA=one-owner-one-analysis`, `QA_OWNER_ID=<새 익명 테스트 UUID>`, `QA_EXPIRES_AT=<시작 시점부터 2시간 이내 ISO 시각>`를 설정한다. `RENDER_EXTERNAL_URL`은 새 서비스가 제공하는 값만 사용한다. 기존 서비스 주소를 덮어쓰지 않는다.

제한:
- Supabase Auth가 검증한 단일 QA UUID만 서비스 접근 허용. 추가 계정 가입을 허용하는 독자 인증 API는 없음.
- 첫 분석 예약 전에 실제 DB의 해당 계정 호출 기록을 검사. 기록이 있으면 거부. 같은 프로세스의 경쟁 예약·불확실한 실패도 재허용하지 않음.
- 만료 후 모델 호출 차단. 삭제를 위한 해당 계정 인증은 유지.
- 공개 정책 준비 false. 이 테스트 서비스를 공개 고지 승인으로 표시하지 않음.
- 전역 cleanup worker·의견 운영자 기능을 추가하지 않음. 익명 삭제 코드·상태 경로도 비활성화. 삭제는 해당 QA 계정의 인증된 요청으로 실행.
- 테스트용 동의 승인 주입은 이 별도 실행 파일 내부에만 존재. 기존 정책 승인 파일 false 유지.

실행 전: 기존 Render 설정 접근이 가능한 계정 필요. 새 워크스페이스만 보이는 계정에서는 비밀 설정을 추측·복제하지 않는다.
실행: 새 테스트 계정 → 등록 → v6 동의 영수증·문서 해시 확인 → 합성 사진 분석 1회 → 철회 → 재분석 차단 → 계정·연결 기록 삭제 → 기존 Auth 토큰 거부 확인.
Android 화면 성공 경로에는 별도 검증 APK의 테스트 전용 동의 준비 상태와 서비스 주소를 맞춰야 한다. 출시 APK의 승인 값을 변경하지 않는다.
정리: 테스트 계정 삭제 확인, 복구용 토큰·삭제 증빙 로컬 파일 정리, 새 Render 서비스 삭제 확인. 검증 브랜치는 결과·코드 검토를 위해 보존하며 main에 병합하지 않는다.

현재 이 문서는 실행 준비이며 실제 서비스 생성·유료 AI 호출 성공 기록이 아니다.
