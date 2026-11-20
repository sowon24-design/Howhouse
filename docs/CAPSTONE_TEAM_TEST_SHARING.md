# 캡스톤 프로토타입 팀원 테스트 공유 검토

## 2026-11-20 웹 배포 구성 (아래 별도 Static Site 안보다 최신)

사용자 승인으로 캡스톤 전용 Render 서비스가 웹과 API를 함께 제공하도록 변경했다. 별도 요금제·Supabase·출시 서버를 추가하거나 변경하지 않는다.

- 팀원용 접속 주소: https://howhouse-capstone-prototype.onrender.com/#home
- 같은 서비스의 `/capstone.html#home`도 지원한다. `/health`, 기존 Android/PC API 경로는 유지한다.
- Render 연결 브랜치: `캡스톤-프로토타입`만 사용한다.
- Render Build Command: `npm ci && node scripts/capstone-web-build.mjs`
- 기존 Start Command: `node --experimental-strip-types server/analysis/capstone-render.mjs` 유지.
- 빌드 시 Render의 공개 hostname으로 API 주소를 설정한다. 키는 서버 환경변수에만 있으며 웹 번들에는 넣지 않는다.
- 정적 파일은 `dist-capstone`의 HTML 및 `/assets/`, `/components/`, `/fonts/`, `/icons/`의 허용한 확장자만 제공한다. 체크박스 등 공통 Figma 자산도 기존 디자인 그대로 제공한다. 원본 소스·서버 파일·.env·소스맵·경로 탈출을 허용하지 않는다.
- 웹 API는 정확히 해당 서비스의 HTTPS origin만 추가로 허용한다. 동일 origin GET에서 Origin 헤더가 생략되면 브라우저의 `Sec-Fetch-Site: same-origin`을 확인한다. 다른 origin/cross-site 요청은 계속 거절한다. 이는 로그인이나 팀원 전용 접근 인증을 의미하지 않는다.
- 초기화되지 않은 새 브라우저에서는 사용자가 직접 연령·약관 확인과 닉네임 설정을 진행한다. 기존 화면·문구·디자인은 유지한다.
- 서버가 잠든 경우 최초 접속에 약 1분 이상 걸릴 수 있다. AI 활성화 만료는 2026-11-27 11:00 KST이며 프로세스당 신규 유료 분석 5회 한도다. 재배포/재시작하면 한도·캐시가 초기화돼 전체 누적 비용을 보장하는 상한은 아니다.
- AI에는 개인정보 없는 시연 자료만 사용한다. 커뮤니티는 기기별 메모리 시연이며 팀원끼리 글·댓글이 공유되지 않는다. 시연 URL을 안다고 팀원임을 인증하는 구조는 아니다.
- 무료 검사: 정적 경로 보호, 동일/다른 origin, 세션, 썸네일, 기존 동작 23개 및 타입 검사·웹 빌드 확인. 실서버 브라우저 검증 결과는 작업 완료 보고와 Git 기록을 함께 확인한다.

확인일: 2026-11-19. 실제 사이트 생성·접근 권한 변경·AI 활성화는 하지 않았다.

## 즉시 가능한 방법: APK 파일 링크

최신 캡스톤 debug APK를 팀 드라이브 등에 업로드하고 파일 링크를 전달하면 Android 팀원이 내려받아 설치할 수 있다. APK를 Git에 포함하지 않는다. 이는 웹에서 즉시 실행하는 링크와 다르며, Android의 외부 앱 설치 허용이 필요할 수 있다. 앱 ID는 `com.howhouse.capstone`이라 출시용 어쩌집과 구분된다. 실제 휴대폰 검증은 별도다.

## 권장 방법: 별도 Render Static Site

- 브랜치: `캡스톤-프로토타입`. main이나 출시 서버 설정을 바꾸지 않는다.
- 기존 Node.js 24.15 이상/25 미만 요구를 충족해야 한다.
- 빌드 명령: `npm ci && node node_modules/vite/bin/vite.js build --config vite.capstone.config.ts --mode capstone --configLoader runner`
- Publish Directory: `dist-capstone`
- 공개 환경변수: `VITE_CAPSTONE_API_BASE_URL=https://howhouse-capstone-prototype.onrender.com`
- 접속 경로: 생성된 사이트의 `/capstone.html#home`. 기본 `/` 접속에는 `/capstone.html`로 보내는 별도 리다이렉트가 필요하다.
- OpenAI·YouTube 서버 키, Supabase secret 등 비밀 값은 정적 사이트 환경변수에 넣지 않는다. `VITE_` 값은 사용자에게 공개된다.

Render 공식 문서는 정적 사이트 무료 배포, 브랜치 연결 및 고유 onrender.com 주소를 제공한다고 명시한다. 대역폭과 빌드 시간은 워크스페이스의 포함 사용량을 소모한다. 무료로 무제한이라는 의미는 아니다.

## 현재 코드로 확인한 제약

- `127.0.0.1:5190`은 접속한 사람 자신의 기기를 가리킨다. 다른 팀원에게 전달할 원격 주소가 아니다.
- 기존 Render 서비스는 API 서버다. 웹 앱 HTML을 제공하지 않으므로 서버 URL만 공유하면 앱 화면을 볼 수 없다.
- `server/analysis/capstone-youtube.mjs`는 현재 origin `http://127.0.0.1:5190`과 `http://127.0.0.1`만 허용한다. 새 Static Site에서는 썸네일이 거절된다. 배포 전에 정해진 새 HTTPS origin만 명시적으로 허용하도록 보완·검증해야 한다. 와일드카드로 풀지 않는다.
- 분석 서버도 새 웹 origin의 CORS·요청 검증 점검이 필요하다. 이번 작업에서 분석 활성화나 서버 설정을 바꾸지 않았다.
- 커뮤니티 글·댓글·공감은 브라우저별 메모리 시연이다. 팀원 간 데이터가 공유되지 않고 새로고침하면 초기화된다. 로그인·탈퇴도 실제 계정 기능이 아니다.
- 웹에서는 Android 뒤로가기·네이티브 사진 선택·키보드 등을 완전히 검증할 수 없다.
- 별도 접근 통제를 추가하지 않는 한 사이트 링크를 아는 다른 사람도 접속할 수 있다. 팀원에게만 전달하는 것과 팀원만 접근 가능하도록 제한하는 것은 다르다.

공식 근거:
- https://render.com/docs/static-sites
- https://render.com/docs/free
- https://vite.dev/guide/static-deploy#render
