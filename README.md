# Howhouse
초보 자취생들을 위한 자취방 문제 솔루션 어플리케이션 개발

## 팀원 개발 시작

현재 공통 컴포넌트와 예슬 담당 A/D/E/F 화면 미리보기를 제공합니다. B 화면·실제 분석·영구 저장·Android 연결은 후속 통합 대상입니다. [현재 구현·PR 범위](src/app-screens/README.md)를 먼저 확인하세요.

Git과 Node.js 24.15.0(npm 11.12.1)을 준비하세요. 이 변경이 main에 병합된 이후 처음 받는 팀원은 다음을 실행합니다.

```sh
git clone --branch main https://github.com/sowon24-design/Howhouse.git
cd Howhouse
npm ci
npm run dev
```

병합 전에는 clone의 브랜치를 feature/app-screens로 지정합니다. 원격에 push된 내용까지만 받을 수 있습니다. 터미널 주소 뒤에 /#components, /#home, /#problem, /#onboarding, /#my, /#system을 붙여 확인합니다. 폰트 설치나 API 키는 필요 없습니다.

기존 팀원은 다시 clone하지 않습니다. 자기 변경을 먼저 커밋하거나 안전하게 보관하고 원격 main을 fetch한 뒤 현재 담당 브랜치에 병합합니다. 충돌 시 양쪽 기능을 유지하고 빌드를 확인합니다. package-lock.json이 바뀌면 개발 서버를 종료하고 npm ci 후 다시 실행합니다.

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
| `docs/` | PRD, 의사결정 기록 등 프로젝트 문서 |
| `members/` | 팀원별 contribution 기록. 작업 파일은 개인 브랜치에서, 협업 기록은 `main/members`에서 관리합니다. |
| `wireframes/` | 팀 공통 와이어프레임. 각자의 와이어프레임은 개인 브랜치에 있습니다. |

---

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

- [DESIGN.md](DESIGN.md): 시각 규칙·디자인 토큰·대표 화면
- [CONTRACT.md](src/components/CONTRACT.md): 공통 컴포넌트 Props·상태·동작 계약
- [실행 안내](src/README.md) · [컴포넌트 예제](src/components/ui/README.md)
