# 공통 컴포넌트 사용 안내

기준: 2026-10-30 Figma `336:27325` 직접 조회. React + TypeScript + 일반 CSS를 사용하며 추가 라이브러리는 없습니다.

미리보기: 루트에서 `npm run dev` → `http://127.0.0.1:5173/#components`.

## 구현 목록과 파일

| Figma | 내보내는 이름 / 파일 | 기본 동작 |
| --- | --- | --- |
| Arrow Button (`549:9825`) | `ArrowButton` / ArrowButton.tsx | 오른쪽 화살표, 40×40px, Hover·Pressed·Disabled, 클릭 콜백 |
| Button | `Button` / Button.tsx | primary·pale, Hover·Pressed, disabled·loading 중 클릭 차단 |
| Checkbox | `Checkbox` / Selection.tsx | fill·stroke, 선택·해제, Space 지원 |
| Radio | `Radio` / Selection.tsx | 같은 name 중 하나 선택, 방향키 지원 |
| Tab bar | `TabBar` / Selection.tsx | 선택·포커스 이동, ← → Home End, 패널 연결 |
| List | `ListRow` / Rows.tsx | neutral·pale, 클릭 콜백, 선택한 아이콘 전달 |
| Message Button | `MessageButton` / Rows.tsx | 선택·해제, +/체크 원본 에셋 전환 |
| GNB | `GNB` / GNB.tsx | depth1·depth2-light·depth2-dark, 뒤로·닫기 콜백 |
| 유의사항 아코디언 | `Accordion` / Accordion.tsx | 펼침·접힘, 제목·본문 전달 |
| Add image | `AddImage` / Photo.tsx | 추가 콜백 |
| Photo | `Photo` / Photo.tsx | 사진 표시·삭제 콜백 |
| Action Sheet | `ActionSheet` / Dialogs.tsx | 액션 버튼, 바깥·취소·Escape 닫기 |
| Overlay | `Overlay` / Dialogs.tsx | 네·아니오·Escape, 확인 콜백 |

`ui.css`는 공통 컴포넌트 스타일입니다. `preview.css`는 검토 페이지 전용이므로 출시 화면에 복사하지 않습니다. Button·List·Tab 기준 폭 354px, Message Button 원본 폭 352px, GNB·Action Sheet 원본 폭 402px이며 실제 화면의 부모 폭에 맞춰 늘거나 줄어듭니다. 버튼 높이 56px·radius 12px, Photo·Add image 82.5×82.5px은 유지합니다. 시트 배경 딤은 출시 화면 `472:13298`의 검정 25%입니다.

## 사용 예시

추가 화살표 버튼: `<ArrowButton label="다음 단계" onClick={handleNext} disabled={isLastStep} />`. `label`은 접근성 이름으로 필수입니다. 내부 원본 화살표는 24×24px이며 방향이나 색상을 임의로 바꾸지 않습니다. 실제 화면 이동은 호출하는 화면에서 연결합니다.

화면에서 상태를 보관하고 컴포넌트에 전달합니다. 아래는 화면 컴포넌트 함수 안에서 쓰는 예시입니다.

```tsx
import { useState } from 'react'
import { Button, Checkbox, ActionSheet } from './components/ui'

function Example() {
  const [checked, setChecked] = useState(false)
  const [open, setOpen] = useState(false)
  return <>
    <Checkbox label="선택 항목" checked={checked}
      onChange={event => setChecked(event.target.checked)} />
    <Button disabled={!checked} onClick={() => setOpen(true)}>다음</Button>
    <ActionSheet open={open} label="선택하기" onClose={() => setOpen(false)}
      actions={[{ id: 'example', label: '예시 액션', onClick: () => setOpen(false) }]} />
  </>
}
```

- `Checkbox`·`Radio`는 `checked`와 `onChange`를 함께 전달합니다. Radio 그룹은 고유한 동일 `name`을 사용합니다.
- `TabBar`의 각 `panelId`와 실제 `role="tabpanel"` 요소의 `id`를 맞추고 선택되지 않은 패널은 `hidden` 처리합니다. 값과 초기 선택은 화면에서 정합니다.
- `GNB`에 `onBack` 또는 `onClose`를 생략하면 해당 위치는 빈 자리로 남습니다. 아이콘만 보고 화면 이동을 추가하지 않습니다.
- `Icon`은 계속 시각 전용입니다. 위 컴포넌트가 필요한 위치에서만 별도 버튼을 감쌉니다. 색이 다른 인스턴스는 `public/components/figma` 원본을 사용합니다.
- `ActionSheet` 액션은 자동으로 닫히지 않습니다. 액션 콜백에서 화면 규칙에 따라 닫으세요. 시트 닫힘은 저장이나 취소 확정을 의미하지 않습니다.
- 모달은 native dialog를 사용합니다. 배경 스크롤 잠금, Tab 순환, 닫힌 뒤 열기 버튼으로 포커스 복귀를 처리합니다. 한 화면에서 동시에 하나만 엽니다.
- 로딩은 원본의 작은 원·큰 원 SVG를 사용하며 강조 위치가 1초 간격으로 순환합니다. 현재 모션은 사용자 요청을 반영했으며 상세 동작은 상위 컴포넌트 폴더의 CONTRACT.md를 따릅니다. 움직임 줄이기 설정에서는 정지합니다.
- 사진 선택·삭제 상태는 화면에서 관리합니다. 미리보기의 +는 예시 사진을 추가합니다. 실제 카메라·앨범·권한·업로드 연결은 포함하지 않습니다. 5장 제한 예시는 `ComponentPreview.tsx`를 참고합니다.

## 제외 및 후속 연결

개발 후순위 섹션 `531:6862`의 Search·Navigation Bar·Community_Post·Chip·태그·썸네일은 구현하지 않았습니다. 화면별 입력창·닉네임 검증·단계 카드·복사 알림·실제 약관/피드백 시트는 해당 출시 화면을 조립할 때 최신 시안과 미정 동작을 확인하고 연결합니다. 아코디언 원본 문구는 시각 비교용이며 커뮤니티 출시 기능을 만든 것이 아닙니다.

`docs/화면별_기능정의.md`의 미정 항목을 이 미리보기의 예시 상태나 콜백으로 확정하지 않습니다. 저장·취소·뒤로 목적지·닉네임 오류 최초 표시·첫 단계 이전 버튼은 담당자와 작업 직전에 확인합니다.

## 직접 확인

1. 기본/보조 버튼 클릭과 로딩 중 중복 클릭 차단, 비활성 클릭 차단.
2. 체크 두 종류 선택·해제, 라디오 하나만 선택, 탭 클릭·키보드 이동.
3. 목록 클릭 결과, 문장 +↔체크, 헤더 버튼 결과, 아코디언 펼침·접힘.
4. 사진을 5장까지 추가 → + 숨김 → 하나 삭제 → + 복귀.
5. 시트의 바깥·취소·Escape 및 액션, 확인창의 네·아니오·Escape, Tab 순환·열기 버튼으로 포커스 복귀.
6. 412px와 좁은 창에서 가로 넘침, 아이콘·Blank 정사각형 확인.

변경·검토 담당은 사용자입니다. 같은 브랜치에서도 push 전 허락을 받습니다.


## 공통 모션 (사용자 요청 반영)

- 로딩: 3초 순환, 1초마다 앞 원 축소와 다음 원 확대를 동시에 연결합니다.
- 탭: 독립된 흰색 배경 레이어가 320ms로 좌우 이동합니다.
- 아코디언: 내용 높이·투명도와 화살표 180도 회전을 320ms로 전환합니다.
- Action Sheet: 320ms 아래↔위 슬라이드와 배경 페이드. 닫기 완료 후 포커스·스크롤을 복원합니다.
- Overlay: 열기·닫기 모두 100ms dissolve.
- 공통 easing: cubic-bezier(.4, 0, .2, 1). 움직임 줄이기 설정에서는 전환을 생략합니다.

## 기준 문서

시각 규칙은 [DESIGN.md](../../../DESIGN.md), 정확한 Props·이벤트·상태 책임은 [CONTRACT.md](../CONTRACT.md)를 확인하세요. 이 README는 실행과 사용 예제 안내입니다.
