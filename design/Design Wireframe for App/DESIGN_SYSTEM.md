# 어쩌집 Design System

자취생의 생활 문제 해결 서비스 **어쩌집**의 모바일 UI 디자인 시스템이다.  
현재 React 구현(`src/App.tsx`, `src/index.css`)을 기준으로 색상, 타이포그래피, 레이아웃, 컴포넌트, 인터랙션 규칙을 정리한다.

## 1. Design principles

### Calm and practical

- 긴 설명보다 현재 상황과 다음 행동을 먼저 보여준다.
- 생활 문제를 과장하거나 공포스럽게 표현하지 않는다.
- 충분한 여백, 낮은 채도의 배경, 선명한 액션 컬러로 차분한 인상을 유지한다.

### Action first

- 각 화면의 핵심 행동은 한 개의 Primary CTA로 명확하게 구분한다.
- 해결 절차는 확인 → 조치 → 재확인 → 다음 행동 순서로 안내한다.
- 긴급 상황에서는 일반 탐색보다 피해 확산 방지와 연락 행동을 우선한다.

### Reassuring hierarchy

- 제목은 짧고 직접적인 질문이나 행동 문장으로 작성한다.
- 보조 설명은 중립적인 회색을 사용하고 최소 12px을 유지한다.
- 성공, 주의, 긴급 상태는 색상만이 아니라 아이콘과 문구를 함께 사용한다.

## 2. Foundations

### 2.1 Platform and viewport

| 항목 | 기준 |
|---|---|
| 기본 플랫폼 | Mobile web |
| 콘텐츠 최대 너비 | 430px |
| Figma 기준 프레임 | 390 × 844px |
| 최소 지원 너비 | 320px |
| 상태 바 높이 | 46px |
| 상단 헤더 높이 | 58px |
| 하단 콘텐츠 안전 여백 | 120px |
| 데스크톱 프리뷰 | 중앙 정렬된 모바일 셸, 700px 이상에서 32px 모서리 |

모바일에서는 앱이 뷰포트를 채운다. 넓은 화면에서는 모바일 셸을 중앙에 놓고 바깥에 블루그레이 배경을 노출한다.

### 2.2 Typography

기본 서체는 **Noto Sans KR**이다.

```css
font-family:
  "Noto Sans KR",
  -apple-system,
  BlinkMacSystemFont,
  system-ui,
  Roboto,
  "Apple SD Gothic Neo",
  sans-serif;
```

지원 굵기는 `400`, `500`, `600`, `700`이다. 본문 자간은 `-0.01em`, 큰 브랜드/타이틀은 필요에 따라 `-0.04em`까지 좁힐 수 있다.

| Token | Weight | Size / Line height | 사용 |
|---|---:|---:|---|
| `Display/1` | 700 | 36 / 44 | 스플래시 브랜드 |
| `Display/2` | 700 | 32 / 40 | 강조 디스플레이 |
| `Title/1` | 700 | 28 / 36 | 화면 핵심 질문 |
| `Title/2` | 700 | 24 / 32 | 상세 제목 |
| `Title/3` | 600 | 20 / 28 | 섹션 제목 |
| `Headline` | 600 | 18 / 26 | 카드·시트 헤더 |
| `Body/1` | 400 | 16 / 24 | 주요 본문 |
| `Body/2` | 400 | 14 / 20 | 일반 본문 |
| `Label/1` | 500 | 16 / 24 | 큰 버튼 |
| `Label/2` | 500 | 14 / 20 | 탭·칩·일반 버튼 |
| `Label/3` | 500 | 12 / 16 | 보조 라벨 |
| `Caption/1` | 400 | 12 / 16 | 메타데이터 |

#### Typography rules

- UI의 최소 글자 크기는 **12px**이다.
- 한국어 줄바꿈은 단어 단위로 유지한다(`word-break: keep-all`).
- 화면 제목은 최대 2줄, 카드 제목은 가능하면 2줄 이하로 제한한다.
- 숫자, 시간, 카운트는 주변 텍스트와 동일한 크기를 사용하되 굵기로 우선순위를 만든다.

### 2.3 Core color tokens

#### Brand

| Token | Value | 사용 |
|---|---|---|
| `Brand/Primary` | `#3478F6` | 핵심 CTA, 활성 내비게이션, 링크, 포커스 |
| `Brand/Primary-Pressed` | `#2765DC` | 눌림 상태 |
| `Brand/Soft` | `#EAF2FF` | 아이콘 배경, 선택 칩 |
| `Brand/Softest` | `#F3F7FF` | 넓은 강조 배경 |

#### Neutral

| Token | Value | 사용 |
|---|---|---|
| `Text/Primary` | `#18202D` | 제목, 주요 본문 |
| `Text/Secondary` | `#4F5C6F` | 설명, 입력 내용 |
| `Text/Muted` | `#7E8797` | 메타데이터, 보조 문구 |
| `Text/Disabled` | `#AEB6C2` | 비활성 상태 |
| `Border/Default` | `#E8ECF2` | 카드, 구분선 |
| `Border/Strong` | `#DCE4EE` | 입력, 강조 구분선 |
| `Surface/Primary` | `#FFFFFF` | 카드, 시트 |
| `Surface/Subtle` | `#F7F9FC` | 시트, 보조 영역 |
| `Background/App` | `#F5F7FB` | 앱 기본 배경 |
| `Background/Canvas` | `#E9EEF7` | 데스크톱 프리뷰 바깥 배경 |

#### Semantic

| Token | Value | 사용 |
|---|---|---|
| `Danger/Primary` | `#EB5056` | 긴급 모드 CTA |
| `Danger/Strong` | `#E8444A` | SOS 강조 |
| `Danger/Soft` | `#FFE8EA` | 긴급 아이콘 배경 |
| `Warning/Text` | `#9B5D2D` | 안전 주의 문구 |
| `Warning/Soft` | `#FFF4E6` | 안전 주의 배경 |
| `Success/Primary` | `#268C72` | 해결 가능, 완료 상태 |
| `Success/Strong` | `#087F5B` | 성공 강조 텍스트 |
| `Success/Soft` | `#E6F7F1` | 성공 카드 배경 |

#### Category accents

카테고리는 의미 전달을 돕는 보조 색상이다. 본문이나 핵심 액션 컬러로 사용하지 않는다.

| Category | Foreground | Background |
|---|---|---|
| Blue | `#285CAA` | `#EAF2FF` |
| Cyan | `#3478F6` | `#E8F8FB` |
| Orange | `#D9480F` | `#FFF0E7` |
| Yellow | `#BD8A18` | `#FFF7D9` |
| Lavender | `#6754B8` | `#F0EDFF` |
| Mint | `#268C72` | `#E6F7F1` |
| Rose | `#D25B71` | `#FFEDF1` |
| Green | `#087F5B` | `#EAF5E9` |
| Gray | `#657083` | `#EEF1F5` |

### 2.4 Spacing

4px 기반 스케일을 사용하되, 현재 모바일 밀도에 맞춰 2px 단위를 보조적으로 허용한다.

| Token | Value | 대표 사용 |
|---|---:|---|
| `Space/1` | 4px | 아이콘 내부 간격 |
| `Space/2` | 8px | 인라인 요소, 작은 카드 간격 |
| `Space/3` | 12px | 카드 내부 작은 간격 |
| `Space/4` | 16px | 기본 카드 패딩 |
| `Space/5` | 20px | 화면 좌우 패딩 |
| `Space/6` | 24px | 섹션 패딩 |
| `Space/7` | 28px | 큰 요소 간격 |
| `Space/8` | 32px | 섹션 구분 |
| `Space/10` | 40px | 큰 섹션 구분 |

#### Layout rules

- 화면 기본 좌우 여백은 **20px**이다.
- 카드 내부 패딩은 기본 **16px**, 강조 카드에서는 18–24px을 사용한다.
- 같은 그룹 내부 간격은 8–12px, 다른 섹션 사이 간격은 24–32px을 사용한다.
- 360px 이하에서는 화면 좌우 여백을 15px까지 줄일 수 있다.

### 2.5 Radius

| Token | Value | 사용 |
|---|---:|---|
| `Radius/XS` | 8px | 작은 썸네일, 태그 |
| `Radius/SM` | 12px | 칩, 작은 아이콘 타일 |
| `Radius/MD` | 15px | 리스트, 입력 |
| `Radius/LG` | 18px | 기본 카드, 버튼 |
| `Radius/XL` | 22px | 강조 카드 |
| `Radius/2XL` | 24px | 플로팅 내비게이션 |
| `Radius/Sheet` | 29px | 바텀시트 상단 |
| `Radius/Device` | 32px | 데스크톱 모바일 셸 |
| `Radius/Full` | 999px | 원형 버튼, 칩 |

한 화면 안에서 카드 모서리는 가급적 `18px` 또는 `22px` 중 하나를 중심으로 사용한다.

### 2.6 Elevation

| Token | Value | 사용 |
|---|---|---|
| `Elevation/Card` | `0 6px 16px rgba(43, 61, 87, .07)` | 일반 카드 |
| `Elevation/Floating` | `0 12px 32px rgba(37, 68, 113, .10)` | 하단 내비게이션, 시트 |
| `Elevation/Primary` | `0 8px 20px rgba(52, 120, 246, .25)` | Primary CTA |
| `Elevation/Danger` | `0 8px 20px rgba(235, 80, 86, .24)` | 긴급 CTA |
| `Elevation/Device` | `0 0 50px rgba(41, 61, 94, .13)` | 데스크톱 앱 셸 |

그림자는 계층 표현에만 사용한다. 모든 카드에 동일하게 그림자를 추가하지 않는다.

### 2.7 Icons

- 아이콘은 **24 × 24px** 아웃라인 스타일을 기본으로 한다.
- 기본 선 굵기는 `1.8px`, 둥근 cap과 join을 사용한다.
- 작은 보조 아이콘은 18–20px, 일러스트 역할의 아이콘은 40–52px까지 확대할 수 있다.
- 인터페이스 기호에 이모지를 사용하지 않는다.
- 아이콘 단독 버튼에는 접근 가능한 이름을 제공한다.
- 카테고리 아이콘은 의미별 파스텔 배경 타일과 함께 사용한다.

## 3. Core components

### 3.1 App shell

- 최대 너비 430px의 모바일 컨테이너다.
- 기본 배경은 `Background/App`이다.
- 상태 바는 46px 높이이며 스크롤 상단에 고정한다.
- 카메라 화면에서는 일반 콘텐츠 하단 여백과 내비게이션을 제거한다.

### 3.2 Top header

- 높이 58px, 3열 구조: 좌측 액션 84px / 제목 / 우측 액션 84px.
- 제목은 16px/700, 중앙 정렬한다.
- 배경은 앱 배경의 반투명 버전과 14px 블러를 사용한다.
- 스크롤 방향에 따라 숨길 수 있지만, 뒤로 가기와 닫기가 중요한 화면에서는 유지한다.

### 3.3 Buttons

#### Primary button

- 높이 52–54px.
- 배경 `Brand/Primary`, 텍스트 흰색.
- Radius 18px.
- 라벨은 16px/600 이상.
- 한 화면에 하나를 원칙으로 한다.

#### Danger button

- 긴급 흐름에서만 사용한다.
- 배경 `Danger/Primary`, 흰색 텍스트.
- 일반 오류나 삭제 행동에 SOS 스타일을 재사용하지 않는다.

#### Secondary button

- 흰색 또는 투명 배경.
- `Border/Default` 1px 테두리.
- 핵심 CTA와 동일한 시각적 무게를 갖지 않도록 그림자를 줄인다.

#### Icon button

- 터치 영역은 최소 44 × 44px.
- 시각 아이콘은 24 × 24px.
- 배경이 없더라도 hover/pressed 영역은 원형 또는 12px 이상의 radius로 표시한다.

### 3.4 Chips and filters

- 높이 32–36px.
- Radius Full.
- 기본 상태는 흰색 배경과 중립 텍스트.
- 선택 상태는 `Brand/Soft` 배경과 `Brand/Primary` 텍스트.
- 필터가 많으면 가로 스크롤하며 줄바꿈하지 않는다.

### 3.5 Cards

#### Standard card

- `Surface/Primary`, Radius 18–22px.
- 기본 패딩 16–18px.
- 테두리 또는 낮은 그림자 중 하나를 우선 사용한다.

#### Problem list card

- 좌측 카테고리 아이콘, 중앙 텍스트, 우측 chevron 구조다.
- 제목, 설명, 시간·도구 메타데이터 순으로 배치한다.
- 카드 전체가 하나의 터치 영역이다.

#### Step accordion

- 단계 라벨, 제목, 펼침 표시를 항상 노출한다.
- 한 번에 한 단계만 펼치는 것을 기본으로 한다.
- 열린 상태는 본문과 강조 테두리 또는 배경으로 구분한다.
- 단계 번호보다 행동 문장을 우선한다.

#### Community card

- 작성자 정보 → 본문 → 이미지/리액션 → 도움·댓글 통계 순서다.
- 사진은 카드 너비를 채우고, 정해진 비율로 crop한다.
- 프로필 정보와 게시글 통계는 12px 이하로 줄이지 않는다.

### 3.6 Floating bottom navigation

- 화면 사방에서 떨어진 플로팅 바다.
- Radius 24px, 흰색 배경, `Elevation/Floating`.
- 항목은 홈 / 문제별 사례 / 긴급 모드 / 커뮤니티 / 더보기 순서다.
- 일반 아이콘은 24px, 라벨은 12px.
- 활성 항목은 `Brand/Primary`를 사용한다.
- 중앙 SOS 버튼은 원형으로 돌출되고 `Danger/Primary`를 사용한다.
- 카메라, 긴급 전체 화면, 바텀시트 집중 상태에서는 숨길 수 있다.

### 3.7 Search field

- 자연어 질문을 수용할 수 있도록 단일 아이콘 검색보다 넓은 입력 영역을 사용한다.
- AI 검색은 반짝임 아이콘, 안내 문구, 로딩 상태를 함께 표시한다.
- 포커스 시 `Brand/Primary` 테두리와 낮은 포커스 링을 사용한다.

### 3.8 Bottom sheet

- 화면 아래에서 등장하며 상단 Radius는 29px이다.
- 배경 딤은 `rgba(25, 34, 47, .4)`와 3px 블러를 사용한다.
- 상단 중앙에 38 × 4px 핸들을 둔다.
- 헤더, 편집 영역, 도움말, Primary CTA 순서로 구성한다.
- 닫기 아이콘과 배경 탭 동작을 제공한다.

### 3.9 SOS flow

- 일반 브랜드 블루 대신 위험 의미의 레드를 핵심 액션에 사용한다.
- 상단에 SOS 라벨, 닫기 버튼, 4단계 진행 표시를 둔다.
- 중앙에는 아이콘 기반 일러스트, 단계 라벨, 행동 제목, 설명을 배치한다.
- 안전 주의는 `Warning/Soft` 배경과 아이콘을 함께 사용한다.
- 첫 화면은 카메라·음성·직접 입력의 3가지 방법과 직접 선택 목록을 제공한다.
- 직접 선택 목록은 세로 스크롤이며 항목 높이는 최소 46px이다.

### 3.10 Camera recognition

- 사진을 전체 화면 배경으로 사용하고 어두운 오버레이로 컨트롤 가독성을 확보한다.
- 가이드 브래킷과 촬영 안내를 중앙에 둔다.
- 하단에는 갤러리, 셔터, 도움말을 배치한다.
- 분석 상태에서는 촬영 컨트롤 대신 스캔 인디케이터와 상태 문구를 보여준다.

## 4. Imagery

- 생활 문제를 즉시 이해할 수 있는 사실적인 주거 사진을 사용한다.
- 욕실, 배수구, 배관, 주방, 세탁기, 수리 도구처럼 문제 맥락이 명확해야 한다.
- 사진 위 텍스트에는 충분한 딤 또는 그라디언트를 적용한다.
- 장식 목적의 무관한 인물 사진은 사용하지 않는다.
- 썸네일은 컨테이너를 가득 채우도록 `cover` crop을 사용한다.

## 5. Motion

| Pattern | Duration | Easing / 동작 |
|---|---:|---|
| 화면 진입 | 280ms | ease-out, opacity + 5px 상승 |
| 헤더 숨김 | 120–140ms | 짧은 opacity/translate |
| 바텀시트 진입 | 250ms | ease-out, 아래에서 위로 |
| 스플래시 브랜드 | 450ms | ease-out, 8px 상승 |
| 로딩 스피너 | 800ms | linear infinite |
| 토스트 | 약 2.4초 유지 | 자동 종료 |

모션은 상태 이해를 돕는 범위로 제한하고, 화면 전환 중 레이아웃이 튀지 않도록 한다. Reduced Motion 환경에서는 이동 애니메이션을 제거하고 opacity 전환만 사용한다.

## 6. Content guidelines

- 존댓말 해요체를 사용한다: “확인해요”, “알려주세요”.
- 사용자를 탓하거나 불안을 높이는 표현을 피한다.
- 버튼은 결과가 예상되는 행동 문장으로 작성한다.
  - 좋은 예: `임시 조치했어요`, `메시지 초안 보기`
  - 피할 예: `확인`, `다음`
- 긴급 안내는 한 단계에 하나의 행동만 요구한다.
- 시간, 필요한 도구, 직접 해결 가능 여부를 함께 제공한다.

## 7. Accessibility

- 일반 텍스트와 배경은 WCAG AA 대비를 충족한다.
- 색상만으로 상태를 구분하지 않는다.
- 터치 타깃은 최소 44 × 44px이다.
- 모든 아이콘 단독 버튼에 접근 가능한 이름을 제공한다.
- 포커스 순서는 시각 순서와 같아야 한다.
- 콘텐츠가 길면 화면 자체 스크롤을 허용하고, 긴급 직접 선택 목록만 내부 세로 스크롤을 사용한다.
- 입력과 편집 영역에는 눈에 보이는 포커스 링을 제공한다.
- 사진에는 상황을 설명하는 대체 텍스트를 작성한다.

## 8. Responsive behavior

### 320–360px

- 화면 좌우 여백을 20px에서 15px로 줄인다.
- 큰 제목을 28px에서 24px로 축소할 수 있다.
- 카드와 책장형 콘텐츠는 가로 스크롤을 유지한다.
- 내비게이션 라벨은 12px 미만으로 축소하지 않는다.

### 361–699px

- 기본 모바일 규칙을 사용한다.
- 앱은 전체 뷰포트를 채운다.

### 700px 이상

- 모바일 셸을 중앙 정렬한다.
- 셸 상하에 18px 여백을 둔다.
- 셸과 오버레이에 32px 기기 모서리를 적용한다.
- 모바일 레이아웃을 데스크톱 그리드로 재배치하지 않는다.

## 9. Figma library structure

권장 페이지와 스타일 이름이다.

```text
00 Cover
01 Foundations
02 Components
03 Patterns
04 Screens
```

### Styles

```text
Color/Brand/Primary
Color/Text/Primary
Color/Surface/Primary
Color/Semantic/Danger

Type/Title/1
Type/Body/2
Type/Label/3

Effect/Elevation/Card
Effect/Elevation/Floating
```

### Components

```text
Navigation/Top Header
Navigation/Bottom Bar
Navigation/Bottom Item

Button/Primary
Button/Secondary
Button/Danger
Button/Icon

Card/Standard
Card/Problem
Card/Community
Card/Step

Input/Search
Input/Message
Filter/Chip

Overlay/Bottom Sheet
Feedback/Toast
Feedback/Safety Note
Feedback/Progress

SOS/Method Card
SOS/Direct Select Item
Camera/Shutter
Camera/Guide
```

상태는 가능한 한 variant로 관리한다.

```text
State = Default | Pressed | Selected | Disabled
Tone = Brand | Neutral | Danger | Warning | Success
Size = Small | Medium | Large
Expanded = True | False
```

## 10. Implementation reference

현재 구현의 기준 파일:

- `src/App.tsx`: 화면 구조, 컴포넌트, 콘텐츠, 아이콘
- `src/index.css`: 토큰, 레이아웃, 상태, 모션, 반응형 규칙

새 화면이나 컴포넌트를 만들 때는 다음 순서를 따른다.

1. 이 문서의 기존 토큰과 컴포넌트로 해결한다.
2. 기존 컴포넌트 variant를 추가한다.
3. 의미가 반복될 때만 새 semantic token을 추가한다.
4. 한 화면에서만 쓰는 임의의 색상·radius·그림자는 만들지 않는다.
5. Figma와 코드에서 동일한 이름과 의미를 유지한다.
