# 어쩌집 웹 앱 소스

React + TypeScript 앱 코드는 이 폴더에 둡니다. npm 명령은 이 폴더가 아닌 저장소 루트에서 실행합니다.

현재는 2단계 기본 실행 확인 화면만 있습니다. 출시 화면, 디자인 토큰, 아이콘 및 공통 컴포넌트는 이후 단계에서 구현합니다.

- `main.tsx`: React 앱 시작 지점
- `App.tsx`: 현재 실행 확인 화면

## 실행

팀 기준 환경: Node.js 24.15.0, npm 11.12.1.

```powershell
npm ci
npm run dev
```

터미널에 표시된 로컬 주소를 브라우저에서 엽니다. 종료는 터미널에서 Ctrl+C입니다.

```powershell
npm run typecheck
npm run build
npm run preview
```

`typecheck`는 TypeScript 오류를 확인하고, `build`는 배포용 `dist`를 만듭니다. `preview`는 만들어진 결과를 로컬에서 확인합니다. 현재 Android 앱 패키지를 만드는 명령은 없습니다.

## 팀 작업 기준

- 현재 초기 개발·공통 컴포넌트 작업 브랜치: `codex/initial-dev-and-component-setup`.
- 공통 코드 변경·검토 담당은 사용자입니다. 화면별 팀원 배정은 아직 미정입니다.
- `package.json`은 라이브러리 목록과 실행 명령, `package-lock.json`은 정확한 설치 버전을 기록합니다. 팀원은 `npm ci`로 같은 버전을 설치합니다.
- 공통 컴포넌트는 해당 단계에서 한 번에 구현하며, 최신 Figma와 화면·상태별로 비교합니다.
- 아이콘은 시각 요소로 먼저 구현합니다. 버튼 역할과 동작은 해당 화면에 필요할 때 별도로 연결합니다.
- 미정 사항은 해당 작업 직전에 사용자에게 알립니다. 다른 팀원이 작업할 수 있으므로 작업 전 Git 변경 상태를 확인합니다.
- 실제 LLM API, Android WebView 포장, 시스템 UI는 현재 구현 범위가 아닙니다.
- 공통 컴포넌트의 사용법과 화면별 역할 분담은 구현 후 추가합니다. 사용자 허락 없이 GitHub에 push하지 않습니다.
