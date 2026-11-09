# Howhouse
초보 자취생들을 위한 자취방 문제 솔루션 어플리케이션 개발

## 팀원 개발 시작

현재 공통 컴포넌트와 A/D/E/F·B 화면 연결, 닉네임 기기 저장, Android 기본 연결을 제공합니다. 웹·Android 분석은 무료 샘플이 기본이며 실제 API는 별도 서버 설정 후 명시적으로 선택합니다. [현재 구현·검증 범위](src/app-screens/README.md)를 먼저 확인하세요.

Git과 Node.js 24.15.0(npm 11.12.1)을 준비하세요. 이 변경이 main에 병합된 이후 처음 받는 팀원은 다음을 실행합니다.

```sh
git clone --branch main https://github.com/sowon24-design/Howhouse.git
cd Howhouse
npm ci
npm run dev
```

병합 전에는 clone의 브랜치를 feature/app-screens로 지정합니다. 원격에 push된 내용까지만 받을 수 있습니다. 터미널 주소 뒤에 /#components, /#home, /#problem, /#onboarding, /#my, /#system을 붙여 확인합니다. 폰트 설치나 API 키는 필요 없습니다.

기존 팀원은 다시 clone하지 않습니다. 자기 변경을 먼저 커밋하거나 안전하게 보관하고 원격 main을 fetch한 뒤 현재 담당 브랜치에 병합합니다. 충돌 시 양쪽 기능을 유지하고 빌드를 확인합니다. package-lock.json이 바뀌면 개발 서버를 종료하고 npm ci 후 다시 실행합니다.

### 이번 통합 변경을 받는 순서

이 PR이 main에 병합된 후, 현재 작업을 보존한 담당 브랜치에서 실행합니다. 이전 main을 따로 먼저 받을 필요는 없습니다.

```sh
git fetch origin
git merge origin/main
npm ci
npm run build
npm run dev
```

충돌이 발생하면 병합을 해결한 뒤 다음 명령으로 넘어갑니다. 폴더를 통째로 덮어쓰지 않습니다.

Android 담당자는 `npm run android:sync` → `npm run android:open` → Android Studio에서 빌드·Run으로 다시 설치합니다. 이번에는 Network 네이티브 플러그인이 추가되어 웹 새로고침만으로 반영되지 않습니다. JDK·SDK 준비와 Windows 경로 안내는 [Android README](android/README.md)를 따릅니다. 웹 개발만 하는 팀원은 Android Studio 설치가 필요 없습니다.

- 무료 샘플: A02 개발용 도구에서 기존/생성 결과 선택 → 입력 후 분석 시작 → 샘플 성공/실패 버튼으로 확인합니다. API 키나 서버는 필요 없습니다.
- F02: Android 실제 연결 상태를 감지합니다. 연결 복구 후 사용자가 재시도를 눌러 복귀하며 분석은 자동 재요청하지 않습니다. 분석 서버 가동 여부로 일반 화면 복귀를 막지 않습니다.
- 실제 API: 소원 담당 서버 안내를 따르며 비밀 키는 GitHub나 프런트엔드에 넣지 않습니다. 이번 검증에서는 유료 API를 호출하지 않았습니다.
- [이번 PR 설명·검증과 남은 항목](docs/PR_app-screens_network.md)

예슬은 A/D/E/F 화면·전체 연결·공통 코드 검토, 연우는 B 화면·사례 데이터, 소원은 분석·API를 담당합니다. 예슬 브랜치는 feature/app-screens이며 팀원은 각자 담당 브랜치를 유지합니다. 공유 파일 수정은 사전에 알리고 main 반영은 PR 검토·승인을 거칩니다.

먼저 [DESIGN.md](DESIGN.md), [CONTRACT.md](src/components/CONTRACT.md), [컴포넌트 사용 예제](src/components/ui/README.md)를 읽으세요. 앱 코드는 `src/`에 두며 npm 명령은 저장소 루트에서 실행합니다. `preview.css`는 검토 화면 전용입니다.

공유 전 확인 명령은 `npm run build`와 `npm run verify:foundations`입니다. 자세한 환경·실행 안내는 [src/README.md](src/README.md)를 참고하세요.

> 이 저장소는 팀 프로젝트의 기획, 디자인, 사용성 테스트, 팀 합의 및 개인별 활동 기록을 관리하기 위한 공간입니다.

---

## 📂 main 브랜치 구성

| 폴더 | 내용 |
| --- | --- |
| `usability-test/` | 사용성 테스트(UT) 영상, 녹음본, 기록 문서. 각자의 개인 분석물은 개인 브랜치에서 관리합니다. |
| `design/` | 프로토타입 디자인 작업물 |
| `docs/` | 팀 공통 기획·기능정의·UX 라이팅·의사결정·QA 및 출시/운영 안내 문서와 문서용 이미지 |
| `members/` | 팀원별 contribution 기록. 작업 파일은 개인 브랜치에서, 협업 기록은 `main/members`에서 관리합니다. |
| `wireframes/` | 팀 공통 와이어프레임. 각자의 와이어프레임은 개인 브랜치에 있습니다. |

---

### docs 폴더 관리

- `docs/`는 팀이 함께 참고하는 문서의 기준 위치입니다. PRD·화면별 기능정의, UX 라이팅·브랜드 보이스, 의사결정·팀 합의, QA 기준·검증 기록, 설치·출시·운영 안내를 둡니다.
- UX 라이팅의 브랜드 소개·코어 밸류·톤맵·문구 작성 원칙과 변경 사례는 [UX_WRITING.md](docs/UX_WRITING.md) 한 파일에서 관리합니다. 같은 내용을 별도 최상위 폴더에 중복 보관하지 않습니다.
- 문서에 삽입하는 그래프·이미지는 `docs/assets/`에 두고 상대 경로로 연결합니다. 자료가 많아지면 `docs/주제명/` 하위 폴더로 묶습니다. 앱이 직접 사용하는 이미지와 코드는 `src/` 또는 `public/`에서 관리합니다.
- 개인 과제·개인 기여 기록은 `members/`, 디자인 작업물은 `design/`, 사용성 테스트의 원본 영상·녹음은 사용성 테스트 폴더에 둡니다. 팀 공통 분석 결과와 검증 문서는 `docs/`에서 연결해 참고할 수 있게 합니다.
- 시각 규칙은 루트 `DESIGN.md`, 공통 컴포넌트 동작은 `src/components/CONTRACT.md`, 담당 영역의 실행·인계 안내는 해당 폴더의 README에서 관리합니다. 같은 규칙을 복사하기보다 원본 문서로 링크합니다.
- 문서에는 작성·수정일과 적용 범위를 표시하고, 확정 기준·초안·검증 결과를 구분합니다. 기존 주차 기록은 이력으로 보존하되 최신 기준이 무엇인지 명시합니다.
- 문서를 이동하거나 이름을 바꾸면 README와 문서 내부 링크·이미지 경로도 함께 수정합니다. API 키·개인 인증 정보 등 민감정보는 문서에 기록하지 않습니다.

## 📌 규칙

1. 합의된 **팀 전체 도출물만** `main`에 머지합니다.
2. 개인 과제 등 개인적으로 진행한 작업물은 `main`에 머지하지 않고 **개인 브랜치**에서 관리합니다.
3. 개인 브랜치 이름은 `영문이름`이며, `yeseul/design`처럼 `영문이름/목적` 형태로 나눠 쓸 수도 있습니다. (개인의 자유에 따릅니다.)
   - 예: `영문이름/design`, `영문이름/wireframe`
4. 개인 브랜치 외의 브랜치는 `main`에 머지하기 위한 **임시 브랜치**이므로 확인하지 않아도 됩니다.

---

## 👥 팀원

유소원 · 최연우 · 허예슬

## 개발 기준 문서

- [UX_WRITING.md](docs/UX_WRITING.md): 브랜드 보이스·톤맵·상황별 문구 작성 기준
- [DESIGN.md](DESIGN.md): 시각 규칙·디자인 토큰·대표 화면
- [CONTRACT.md](src/components/CONTRACT.md): 공통 컴포넌트 Props·상태·동작 계약
- [실행 안내](src/README.md) · [컴포넌트 예제](src/components/ui/README.md)
