# 어쩌집 웹 앱 소스

React + TypeScript 앱 코드는 이 폴더에 둡니다. npm 명령은 이 폴더가 아닌 저장소 루트에서 실행합니다.

현재는 공통 컴포넌트 공유 단계입니다. Figma 컴포넌트 섹션의 사용 중인 13종을 구현했습니다. 사용자 결정으로 대표 화면 조립 검증은 생략했습니다. 실제 출시 화면 구현과 화면별 입력 검증·저장·이동 연결은 팀원의 후속 작업입니다. 처음 clone하는 방법은 루트 README.md를 참고하세요.

- `main.tsx`: React 앱 시작 지점
- `App.tsx`, `preview.css`: 검토용 미리보기. 출시 화면 레이아웃이 아닙니다.
- `styles/tokens.css`: Light 색상, 컴포넌트 상태 색상, 기본 간격·크기
- `styles/fonts.css`, `styles/typography.css`, `styles/global.css`: 로컬 Pretendard와 텍스트 스타일 7개
- `components/Icon`: 클릭 동작 없는 아이콘과 Figma 원본 목록
- `components/ui`: 버튼·선택·목록·헤더·아코디언·사진·시트·확인창. 사용법은 `components/ui/README.md`
- `ComponentPreview.tsx`: 공통 컴포넌트의 상태 변경과 동작 예시
- 루트 `public/components/figma`: 컴포넌트 인스턴스의 원본 SVG·예시 사진
- 루트 `public/fonts/pretendard`: 공식 WOFF2 4종과 라이선스
- 루트 `public/icons/figma`: 원본 SVG 176개

## 디자인 요소 사용

```tsx
import { Icon } from './components/Icon/Icon'

<p className="text-body-sb">Pretendard SemiBold 600</p>
<Icon nodeId="355:7093" label="홈" />
```

`Icon`은 정확한 변형 노드 ID로 선택합니다. 미리보기의 아이콘 위에 마우스를 올리면 해당 ID를 확인할 수 있으며 전체 목록은 `catalog.json`에 있습니다. `label`을 생략하면 장식용으로 처리하여 스크린리더에서 숨깁니다. onClick·tabIndex·버튼 역할을 받지 않습니다. 화면 개발 시 필요한 아이콘만 별도의 버튼 안에서 사용합니다.

아이콘의 원본 크기와 색상을 CSS로 임의 덮어쓰지 마세요. 다른 색상이 필요한 실제 화면은 그 화면의 Figma 인스턴스를 조회해 적용합니다. 화살표는 실제 방향에 맞춰 Left·Right·Bottom·Top으로 정정했습니다. 노드 ID와 SVG 모양·크기는 유지합니다.

색상은 `var(--color-primary)`처럼 사용합니다. 버튼의 Pressed는 `--button-primary-pressed`, 비활성 배경은 `--button-disabled-background`로 별도 보존합니다. 현재 Light만 적용하며 Dark 지원을 확정한 것은 아닙니다.

공식 Pretendard v1.3.9의 Regular 400 / Medium 500 / SemiBold 600 / Bold 700을 원본 WOFF2로 포함했습니다. 글꼴 설치나 실행 중 외부 CDN 연결이 필요 없습니다. 앱 전체의 오프라인 실행·캐시는 별도 후속 작업입니다.

## 실행

팀 기준 환경: Node.js 24.15.0, npm 11.12.1.

```powershell
npm ci
npm run dev
```

터미널에 표시된 로컬 주소를 브라우저에서 엽니다. `http://127.0.0.1:5173/#components`에서 공통 컴포넌트를 확인합니다. 이미 설치된 현재 환경에서는 `npm run dev`만 실행하면 됩니다. 종료는 터미널에서 Ctrl+C입니다.

```powershell
npm run typecheck
npm run verify:foundations
npm run build
npm run preview
```

`typecheck`는 TypeScript 오류를 확인하고, `build`는 배포용 `dist`를 만듭니다. `preview`는 만들어진 결과를 로컬에서 확인합니다. 현재 Android 앱 패키지를 만드는 명령은 없습니다.

`verify:foundations`는 아이콘 목록·파일·원본 크기와 WOFF2 파일 완전성·라이선스를 검사합니다. 브라우저에서는 색상, 글꼴 굵기, 아이콘 모양·크기를 직접 확인하고 좁은 창에서도 가로 잘림이 없는지 확인합니다. Blank 아이콘 4개가 비어 있는 것은 원본 의도입니다.

## 팀 작업 기준

- 현재 초기 개발·공통 컴포넌트 작업 브랜치: `codex/initial-dev-and-component-setup`.
- 공통 코드 변경·검토 담당은 사용자입니다. 화면별 팀원 배정은 아직 미정입니다.
- `package.json`은 라이브러리 목록과 실행 명령, `package-lock.json`은 정확한 설치 버전을 기록합니다. 팀원은 `npm ci`로 같은 버전을 설치합니다.
- 공통 컴포넌트는 해당 단계에서 한 번에 구현하며, 최신 Figma와 화면·상태별로 비교합니다.
- 아이콘은 시각 요소로 먼저 구현합니다. 버튼 역할과 동작은 해당 화면에 필요할 때 별도로 연결합니다.
- 미정 사항은 해당 작업 직전에 사용자에게 알립니다. 다른 팀원이 작업할 수 있으므로 작업 전 Git 변경 상태를 확인합니다.
- 실제 LLM API, Android WebView 포장, 시스템 UI는 현재 구현 범위가 아닙니다.
- 공통 컴포넌트 사용법은 `components/ui/README.md`에 있습니다. 화면별 역할 분담은 아직 미정입니다. 사용자 허락 없이 GitHub에 push하지 않습니다.

## 공통 기준 문서

시각 규칙은 [DESIGN.md](../DESIGN.md), 컴포넌트 동작 계약은 [CONTRACT.md](components/CONTRACT.md)를 따릅니다.
