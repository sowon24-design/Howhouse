# Howhouse
초보 자취생들을 위한 자취방 문제 솔루션 어플리케이션 개발

## 팀원 개발 시작

현재 공유 결과는 공통 컴포넌트 미리보기입니다. 실제 출시 화면 조립 검증은 사용자 결정으로 생략했으며, 화면별 이동·저장·입력 검증·API 연결은 후속 작업입니다.

Git과 Node.js 24.15.0(npm 11.12.1)을 설치한 뒤 터미널에서 실행하세요. 저장소가 비공개이면 먼저 GitHub 접근 권한을 받아야 합니다.

```sh
git clone --branch codex/initial-dev-and-component-setup https://github.com/sowon24-design/Howhouse.git
cd Howhouse
npm ci
npm run dev
```

터미널에 표시되는 주소의 `/#components`를 열면 컴포넌트, `/#colors`에서 색상을 확인할 수 있습니다. 별도 폰트 설치나 API 키는 필요 없습니다. 종료는 Ctrl+C입니다.

현재 안내는 main 병합 전 공유 브랜치를 받는 방법입니다. main에 PR·병합하는 일은 유소원이 진행합니다. 병합 이후 처음 받는 팀원은 `--branch codex/initial-dev-and-component-setup`을 생략해 main을 받으세요.

화면 개발을 시작할 때는 담당 화면을 정한 뒤 개인 작업 브랜치를 만드세요. 예: `git switch -c yeseul/home`. 공통 컴포넌트 변경은 유소원의 검토를 받고, 작업 전 `git status`로 다른 변경이 있는지 확인합니다.

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
