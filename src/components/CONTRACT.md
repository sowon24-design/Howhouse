# CONTRACT.md — 어쩌집 공통 컴포넌트

최종 동작 대조: 2026-11-05. 현재 `src/components/ui` 및 `src/components/Icon` 코드와 사용자 확정 사항을 대조한 문서다. 새 화면 동작을 승인하거나 구현 완료로 간주하는 문서가 아니다. 시각 규칙과 수치는 [DESIGN.md](../../DESIGN.md), 화면별 정책은 [기능정의](../../docs/화면별_기능정의.md), 예제는 [사용 안내](ui/README.md)를 따른다.

## 공통 원칙

- 모달·바텀시트가 열려 있는 동안 배경의 터치·휠 스크롤을 차단한다. 닫힘 모션이 끝난 뒤 잠금을 해제한다. 시트 안에서 허용한 스크롤 영역(약관 본문·입력창)은 유지하되, 양 끝에서 배경으로 스크롤이 전달되지 않게 한다.
- 바텀시트 드래그 닫기는 상단 중앙 손잡이와 그 주변 터치 영역에서 시작할 때만 허용한다. 본문·배경 드래그는 시트를 이동시키지 않으며 배경 드래그를 클릭 닫기로 처리하지 않는다.

- 선택값·열림 상태는 호출한 화면이 보관한다. 컴포넌트는 콜백으로 변경을 요청하며 화면이 새 prop을 내려줘야 표시가 바뀐다.
- 기본 버튼은 `type="button"`이다. 네이티브 버튼 props를 받는 컴포넌트는 필요한 경우 화면에서 type을 바꿀 수 있다.
- 서버 요청·화면 이동·저장·카메라·권한 처리는 화면 담당이다. 클릭 콜백이 있다는 사실이 해당 기능 구현 완료를 뜻하지 않는다.
- native button/input의 키보드 조작을 유지한다. 접근성 이름을 전달하고 포커스 표시를 지우지 않는다.
- 아래 `?`는 선택 prop이다. 네이티브 속성 확장은 각 소스의 TypeScript 타입을 최종 기준으로 한다.

## SolutionStep (2026-11-03)

2026-11-11 사용자 요청: 준비물에 클릭 연결이 없거나 disabled인 항목은 동일한 태그 스타일의 span으로 표시한다. 이 경우 외부 이동 아이콘·클릭·탭 포커스·누름 효과가 없다. 실제 콜백이 있는 활성 항목만 기존 버튼 계약을 사용한다. 현재 사례 앱에는 쿠팡 연결이 없으므로 모두 정적 태그다.

소스: [SolutionStep.tsx](ui/SolutionStep.tsx), [Figma 725:28299](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=725-28299).

- 필수 Props: `number: number`, `title: string`, `description: string`. number는 화면이 전달하는 단계 번호다. B02 준비물은 0, 해결 단계는 1부터 표시한다.
- 선택 Props: `active?: boolean`(기본 false), `materials?: readonly StepMaterial[]`(기본 빈 배열), `onMaterialClick?: (material: StepMaterial) => void`.
- StepMaterial: `id: string`, `label: string`, `disabled?: boolean`. id는 목록 내 고유값이다.
- 최신 Figma 840:8523: 연한 번호 배경과 파란 숫자의 고정 행이다. active는 이전 호출 호환용이며 시각 변화와 aria-current를 만들지 않는다. B02는 모든 행을 하나의 흰 카드와 세로 연결선으로 묶는다.
- 준비물 수에 제한을 두지 않는다. 부모 폭에 맞춰 줄바꿈하며 긴 이름도 넘치지 않는다. 빈 배열이면 준비물 영역과 해당 간격을 렌더링하지 않는다.
- 준비물 버튼은 클릭한 항목만 콜백으로 전달한다. disabled 또는 콜백 부재 시 비활성이다. 링크·검색·외부 브라우저는 화면 책임이며 현재 API 요청을 하지 않는다.
- 원본 외부 링크 아이콘은 `public/components/figma/solution-step-external-link.svg`(725:31185), 16×16 그대로 사용한다.
- W10 색상은 공통 토큰을 재사용한다. B02의 SolutionSteps가 이 컴포넌트를 조립한다.
- 준비물 누름에는 기존 승인 밝기 피드백을 사용하고 키보드 focus-visible을 유지한다. B02는 하나의 흰 카드 안에서 단계를 고정 표시하며 스크롤에 따라 바꾸지 않는다. 공통 컴포넌트 자체는 스크롤을 감지하지 않는다.

## Button

소스: [Button.tsx](ui/Button.tsx)

- Props: `ButtonHTMLAttributes<HTMLButtonElement>` + `variant?: 'primary' | 'pale'`, `loading?: boolean`.
- 기본값: variant=`primary`, loading=`false`, type=`button`.
- 누름 시작 시 pressed 색을 즉시 적용한다. 포인터를 놓으면 눌림 상태를 해제하며 최소 유지 시간이나 클릭·화면 이동 지연을 추가하지 않는다. 취소·영역 이탈·포커스 이탈·disabled/loading 전환에서는 해제한다. 화면이 즉시 교체되면 그 화면의 버튼도 함께 사라진다.
- `disabled || loading`이면 native disabled로 클릭을 차단한다. loading 중에는 원래 버튼 색상을 유지한다.
- loading이면 텍스트 대신 원 애니메이션을 보여주고, `aria-busy` 및 숨겨진 “처리 중” 텍스트를 제공한다.
- 앞 원의 축소와 다음 원의 확대가 동시에 이어진다. 주기·easing은 DESIGN.md의 `motion`을 따른다.
- 요청 시작·종료에 맞춰 loading을 바꾸는 책임은 화면에 있다. 자동 타이머나 API 호출을 포함하지 않는다.

## ArrowButton

소스: [ArrowButton.tsx](ui/ArrowButton.tsx)

- Props: 네이티브 button props에서 `children`, `aria-label`을 제외하고 `label: string`을 필수로 받는다.
- label은 실제 행동을 설명하는 접근성 이름이다. 기본 type은 `button`이다.
- 오른쪽 화살표 원본을 표시하며 hover·pressed·disabled 상태를 지원한다. 클릭 시 전달받은 onClick을 호출한다.
- 다음 화면/단계 이동과 마지막 단계의 disabled 조건은 화면에서 정한다.

## Checkbox / Radio

소스: [Selection.tsx](ui/Selection.tsx)

- 공통 Props: `label: ReactNode`, `checked: boolean` 및 input props. `type`, `size`, `children`, `defaultChecked`는 받지 않는다.
- Checkbox 추가 Props: `variant?: 'fill' | 'stroke'`, 기본 `fill`.
- 상태 변경 시 native `onChange(event)`를 사용한다. 화면은 `event.target.checked`를 상태에 반영한다.
- Checkbox는 선택/해제를 지원한다. Radio는 같은 그룹에 동일한 name을 전달해 하나만 선택하게 한다. 서로 다른 그룹은 다른 name을 쓴다.
- Radio 선택 표시는 테두리 원과 중앙 점으로 구성한다. 중앙 점을 컨트롤 전체 크기로 늘리지 않는다.
- native Space·방향키 동작을 유지한다. disabled input은 변경할 수 없다. 시각용 원본 에셋과 실제 input을 함께 사용한다.
- ‘모두 동의’와 개별 동의의 연동은 컴포넌트 내부 기능이 아니며 화면에서 구현한다.

## TabBar

소스: [Selection.tsx](ui/Selection.tsx)

- 필수 Props: `options: readonly { value: string; label: string; panelId: string }[]`, `value: string`, `onChange: (value: string) => void`, `label: string`.
- 호출 조건: options는 비어 있지 않고 value는 실제 옵션 중 하나여야 한다. 옵션 value와 panelId는 중복시키지 않는다.
- 클릭하면 해당 value로 onChange를 호출한다. ←/→는 순환 이동, Home/End는 처음/마지막 선택과 포커스 이동을 수행한다.
- 선택 탭만 tabIndex=0이다. tablist/tab 역할, aria-selected, aria-controls를 제공한다.
- 흰색 선택 배경은 독립 레이어로 좌우 이동한다. 실제 tabpanel 렌더링, 숨김 처리와 내용 보존은 화면 책임이다.
- 화면은 panelId와 패널 id를 일치시키고 `role="tabpanel"` 및 접근성 이름을 제공한다. 컴포넌트는 패널을 자동 생성하지 않는다.

## ListRow / MessageButton

소스: [Rows.tsx](ui/Rows.tsx)

- ListRow Props: 네이티브 button props + `variant?: 'neutral' | 'pale'`, `icon?: ReactNode`. 기본 variant=`neutral`, type=`button`.
- ListRow는 children과 오른쪽 화살표를 표시하며 클릭 콜백만 실행한다. 자동 이동이나 선택 상태는 없다.
- MessageButton 필수 Props: `selected: boolean`, `onSelectedChange: (selected: boolean) => void`, `children: ReactNode`; 선택 Props: `disabled?: boolean`.
- MessageButton 클릭은 `onSelectedChange(!selected)`를 호출한다. selected에 따라 pale/neutral, 체크/+ 원본 에셋, aria-pressed가 바뀐다.
- disabled면 클릭을 차단한다. 메시지 문자열의 생성·추가·삭제·저장은 화면이 담당한다.
- `HomeIcon({ pale?: boolean })`은 목록 등에 쓰는 시각 보조 요소이며 자체 클릭 동작이 없다.

## GNB

소스: [GNB.tsx](ui/GNB.tsx)

- Props: `title?: string`, `variant?: 'depth1' | 'depth2-light' | 'depth2-dark'`, `onBack?: () => void`, `onClose?: () => void`.
- 기본 variant=`depth2-light`. depth1은 뒤로/닫기 버튼을 렌더링하지 않는다.
- depth2에서는 콜백이 있는 쪽만 버튼을 만든다. 생략한 쪽은 빈 자리를 유지한다.
- 뒤로·닫기는 각각 콜백을 호출하며 실제 목적지·저장 여부·Android 뒤로가기를 결정하지 않는다.

## Accordion

소스: [Accordion.tsx](ui/Accordion.tsx)

- 필수 Props: `title: string`, `children: ReactNode`, `open: boolean`, `onOpenChange: (open: boolean) => void`.
- 제목 클릭은 `onOpenChange(!open)`을 호출한다. aria-expanded와 aria-controls로 상태와 본문을 연결한다.
- 내용 높이와 투명도가 전환되고 화살표가 회전한다. 본문 높이를 원본 예시 높이에 고정하지 않는다.
- 닫힌 내용은 DOM에 유지하되 aria-hidden 및 inert로 읽기·포커스 이동 대상에서 제외한다.
- 초기 열림값과 본문 내용은 화면이 정한다.

## AddImage / Photo

소스: [Photo.tsx](ui/Photo.tsx)

- AddImage Props: `onClick: () => void`, `disabled?: boolean`(기본 false). 접근성 이름은 “사진 추가”다.
- Photo 필수 Props: `src: string`, `alt: string`, `onRemove: () => void`. 삭제 버튼 이름은 alt에 “삭제”를 붙인다.
- 사진은 지정 영역을 채우도록 잘라 표시한다. 추가·삭제 버튼은 콜백만 호출한다.
- 사진 배열, 최대 5장 제한, 추가 버튼 숨김/재표시, 파일 검증, 카메라·앨범·권한·업로드는 화면 책임이다. 미리보기는 예시 사진만 추가한다.

## ActionSheet

소스: [Dialogs.tsx](ui/Dialogs.tsx)

- 필수 Props: `open: boolean`, `onClose: () => void`, `label: string`, `actions: readonly SheetAction[]`.
- 선택 Props: `cancelLabel?: string`(기본 “취소”).
- SheetAction: `id: string`, `label: string`, `onClick: () => void`, `disabled?: boolean`. id는 목록 내 고유값이다.
- 액션 클릭은 해당 onClick만 호출하며 자동 닫힘이 아니다. 화면에서 필요 시 open을 false로 변경한다.
- 취소·Escape·배경 바깥 클릭은 onClose를 호출한다. 배경 클릭은 포인터 시작과 종료가 모두 dialog 바깥일 때 처리한다.
- 아래에서 올라와 열리고 아래로 내려가 닫힌다. 상단 중앙 손잡이 주변에서 시작한 드래그로 닫을 수 있다. 아래 Dialog 계약을 따른다.

## Dialog / 화면용 바텀시트 (2026-11-05)

소스: [Dialogs.tsx](ui/Dialogs.tsx), [스크롤 잠금](ui/modalScrollLock.ts), [B 화면 어댑터](../solutions/SolutionSheet.tsx).

- 필수 Props: `open`, `onClose`, `children`, `label`, `className`. 선택 Props: `closeOnBackdrop`(기본 true), `swipeDismiss`(기본 false).
- ActionSheet와 B 화면 SolutionSheet는 손잡이 드래그를 사용한다. 일반 Dialog는 화면에서 `swipeDismiss`를 지정한다. B 화면은 별도 드래그 처리를 중복 등록하지 않는다.
- 드래그 시작 영역은 상단 중앙 112×40px이며 작은 화면에서는 시트 너비를 넘지 않는다. 손잡이 밖의 본문·배경에서 시작한 드래그는 시트를 움직이지 않는다.
- 아래로 시트 높이의 20% 또는 100px 중 작은 값 이상 끌면 onClose를 호출한다. 미달이면 200ms ease-out으로 복귀하며, 포인터 취소 시 원위치로 복원한다.
- 배경 클릭 닫기는 시작·끝이 모두 시트 밖이고 드래그가 아닐 때만 허용한다. 배경 드래그는 닫기 클릭으로 취급하지 않는다.
- 배경 휠·터치 스크롤은 차단한다. 시트 내부의 허용된 스크롤 영역은 유지하며, 시작·끝 경계에서는 배경으로 전달하지 않는다. 닫힘 애니메이션 중에도 잠금을 유지한다.
- 약관 외 시트는 본문 전체를 별도 스크롤 영역으로 만들지 않는다. 약관 전문과 긴 입력창 내부의 스크롤은 예외다.
- 시트 너비는 앱 프레임과 현재 보이는 화면 영역에 맞춰 조정한다. 412px 고정 너비를 호출 조건으로 요구하지 않는다.

## Overlay

소스: [Dialogs.tsx](ui/Dialogs.tsx)

- 필수 Props: `open: boolean`, `title: string`, `onConfirm: () => void`, `onClose: () => void`.
- 선택 Props: `body?: string`, `confirmLabel?: string`(기본 “네”), `cancelLabel?: string`(기본 “아니오”).
- 확인은 onConfirm만 호출한다. 자동 닫힘·삭제·저장이 아니므로 화면에서 성공/실패와 닫힘을 처리한다.
- 취소와 Escape는 onClose를 호출한다. 배경 클릭으로 닫히지 않는다.
- 열기·닫기에 dissolve를 사용한다. 시간은 DESIGN.md의 `motion.overlay_ms`를 따른다.

## 모달 공통 생명주기

- ActionSheet와 Overlay는 native dialog를 body에 portal로 렌더링한다. 한 번에 하나만 여는 것을 사용 조건으로 한다.
- 열 때 기존 포커스와 body overflow를 기억하고 showModal을 호출하며 배경 스크롤을 잠근다. Tab/Shift+Tab은 대화상자 안에서 순환한다.
- onClose를 받으면 화면이 open=false로 바꿔야 한다. 컴포넌트는 닫힘 애니메이션 동안 dialog를 유지하며 내부를 inert 처리한다.
- 닫힘 완료 후 dialog를 닫고 스크롤과 이전 포커스를 복원한다. 언마운트 시에도 복원한다.
- 자식은 닫힌 뒤에도 마운트되어 있다. 다시 열 때 선택값을 초기화할지는 화면이 명시적으로 정한다.
- 움직임 줄이기 설정에서는 애니메이션을 생략한다. Android 뒤로가기는 화면 연결 계층에서 열린 dialog의 cancel 이벤트로 전달하며, 컴포넌트가 직접 화면 목적지를 결정하지 않는다.

## Icon

소스: [Icon.tsx](Icon/Icon.tsx)

- Props: `nodeId: string`, `label?: string`. nodeId는 [catalog.json](Icon/catalog.json)에 등록된 정확한 변형 ID여야 하며 미등록 ID는 오류를 발생시킨다.
- label이 있으면 이미지 역할과 접근성 이름을 제공한다. 없으면 장식 요소로 숨긴다.
- 클릭·tabIndex·버튼 props를 받지 않는다. 필요할 때 화면이 별도 button으로 감싼다.
- 원본 크기·벡터·색상을 유지하며 Blank는 빈 정사각형이다. 내부 Asset 역시 원본을 그리는 용도다.

## 계약의 적용 범위

이 문서는 공통 컴포넌트의 보장과 호출 조건을 다룬다. 닉네임·문제 입력 제한, 저장·취소 정책과 화면별 초기 상태는 [화면별 기능정의](../../docs/화면별_기능정의.md)를 따른다. 미리보기 예시를 화면 정책으로 확정하지 않는다.

## 검토 체크리스트

### Usage / Don't

현재 Props와 구현에 따른 호출 조건이다. 새로운 제품 정책을 뜻하지 않는다.

| 컴포넌트 | Usage — 사용 규칙 | Don't — 피할 사용 |
| --- | --- | --- |
| Button | primary/pale 중 원본에 맞는 variant, 요청 중 loading 전달 | 미지원 secondary/ghost/danger 전달, 로딩 클릭 차단 덮어쓰기 |
| ArrowButton | label에 행동 이름, onClick에 화면 동작 연결 | label 생략, 원본 화살표 임의 교체 |
| Checkbox / Radio | checked와 onChange 연결, 라디오 그룹 name 지정 | 읽기 전용 의도 없이 변경 핸들러 생략, 다른 그룹에 같은 name 사용 |
| TabBar | 실제 옵션 value와 panelId 전달 | 빈 options, 중복 value, 패널 자동 생성 가정 |
| ListRow | 목록 행동을 onClick에 연결 | 화살표만으로 자동 이동한다고 가정 |
| MessageButton | selected와 onSelectedChange로 포함 여부 관리 | 표시 변경만으로 메시지 데이터도 저장됐다고 가정 |
| GNB | 실제 동작이 있을 때 onBack/onClose 전달 | 콜백 없는 자리에 동작 없는 버튼 추가 |
| Accordion | open과 onOpenChange 연결 | 닫힌 본문을 외부 스타일로 포커스 가능하게 만들기 |
| AddImage / Photo | 사진 상태·파일 처리를 화면에서 연결 | 카메라·업로드가 포함됐다고 가정 |
| ActionSheet | 액션 콜백에서 작업과 필요한 닫힘 처리 | 액션 후 자동 닫힘, 손잡이 드래그 지원 가정 |
| Overlay | onConfirm에서 확인 결과와 닫힘 처리 | 배경 클릭 닫힘, 확인 후 자동 저장 가정 |
| Icon | 등록 nodeId 사용, 상호작용은 별도 button에 연결 | Icon 자체에 onClick·tabIndex 전달 |

### Button 상태별 시각 보장

- 기본 배경은 variant의 primary/pale 토큰을 사용한다. hover·pressed는 버튼 전용 상태 토큰을 사용한다.
- disabled이며 loading이 아닐 때 배경은 `--button-disabled-background`, 글자는 흰색이다. disabled와 loading이 동시에 참이면 로딩 표시를 유지한다.
- loading은 variant의 배경을 유지하며 primary는 흰 원, pale는 어두운 원을 표시한다.
- focus-visible은 primary 색상 외곽선으로 표시한다.
- 값은 [DESIGN.md](../../DESIGN.md)의 YAML과 [ui.css](ui/ui.css)를 참조한다. 화면에서 상태 색상과 내부 아이콘 위치를 임의 덮어쓰지 않는다.

### 확인 항목

1. 비활성/로딩 버튼이 실행되지 않는지 확인한다.
2. 선택 콜백을 화면 상태에 연결했을 때 체크·라디오·탭·문장 선택 표시가 따라오는지 확인한다.
3. 탭 방향키와 Home/End, 패널 연결, 버튼의 키보드 실행을 확인한다.
4. 아코디언의 부드러운 열림/닫힘 및 닫힌 본문으로 포커스가 들어가지 않는지 확인한다.
5. 시트는 배경·취소·Escape로, Overlay는 취소·Escape로 닫히는지 확인한다. 액션/확인은 화면이 처리한다.
6. 모달 닫힘 후 포커스·스크롤 복원과 움직임 줄이기 설정을 확인한다.
7. 사진 개수 제한과 실제 파일 연결은 화면에서 별도 검증한다.

문서화 검증은 현재 코드 대조다. 실제 출시 화면 조립 테스트와 팀 검토를 대신하지 않는다.

## Dialog (시트·모달 공통 기반)

소스: [Dialogs.tsx](ui/Dialogs.tsx)

- 화면별 전문 시트 재사용을 위해 named export한다.
- 필수 Props: `open`, `onClose`, `children`, `label`, `className`. 선택 Props: `closeOnBackdrop`(기본 true).
- native dialog의 포커스 관리·배경 스크롤 잠금·Escape·닫힘 애니메이션을 공유한다. 호출 화면이 open을 관리한다.
- 시트는 `ui-action-sheet` 클래스를 사용한다. 전문·본문 스크롤·체크·동의 저장은 화면 책임이다.
- 한 번에 하나만 연다. 기존 ActionSheet·Overlay 동작은 유지한다.

### Button 눌림 피드백 보정 (2026-10-31)
- 짧은 탭에도 pressed 토큰이 보이도록 :active 진입 색 전환은 즉시 적용한다. 해제는 기존 160ms 복귀를 유지한다. disabled/loading 차단과 클릭 콜백 시점은 변경하지 않는다.

### ListRow 눌림 피드백 (2026-11-01)
- 기존 neutral/pale hover·pressed 토큰을 유지한다. 포인터를 누르는 즉시 pressed를 적용하고 up/cancel/leave/blur 및 disabled 전환에서 해제한다.
- 클릭 실행이나 화면 이동을 지연하지 않는다. 이 보정은 공통 ListRow를 사용하는 모든 화면에 적용된다.

## 색상 동기화 (2026-11-04)

- 최신 Figma 컴포넌트의 default·hover·pressed·disabled 색상을 토큰과 원본 SVG에 반영했다. 기존 클릭·선택·모션 동작은 유지한다.
- Button과 ArrowButton의 hover, pale Button과 List/Message의 hover는 각각 별도 토큰을 사용한다.
- TabBar 선택 배경은 흰색, 탭 바탕·AddImage는 기존 Blue glass 배경이다. GNB light·ActionSheet는 새 surface 색을 사용한다.
- 일반 disabled 영역과 disabled CTA 배경은 Figma에서 서로 다른 토큰이므로 합치지 않는다.

### Dialog의 선택적 상단 끌어 닫기

- `swipeDismiss` 기본값은 `false`. 약관 시트 등 명시한 인스턴스에서만 사용한다.
- 상단40px에서 아래로 끌어100px(또는 시트 높이20% 중 작은 값)에 도달하면 `onClose`를 호출한다. 짧게 끌면 원위치로 복귀한다.
- 본문 스크롤·바깥 터치·Escape/Android 취소·기존 열림/닫힘 모션은 유지한다. 닫기는 동의나 제출로 처리하지 않는다.

- 약관을 제외한 바텀시트는 내부 콘텐츠를 스크롤하지 않고 아래로 끌어 닫는다. 약관 본문 스크롤은 유지한다.

### 바텀시트 반응형 너비
- 모든 ui-action-sheet는 호출 화면의 앱 프레임 너비와 좌측 위치를 따른다. 프레임이 없는 공통 미리보기에서는 브라우저 가시 영역을 따른다. 열려 있는 동안 리사이즈·회전에도 갱신하며 402/412px 상한을 적용하지 않는다.
