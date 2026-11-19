# 캡스톤 프로토타입 팀원 테스트 공유 검토

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
