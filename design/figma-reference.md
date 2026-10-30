> 이전 디자인 시스템 상세 조회 기록입니다. 현재 규칙은 [DESIGN.md](../DESIGN.md), 동작 계약은 [CONTRACT.md](../src/components/CONTRACT.md)를 확인하세요. 미사용 컴포넌트와 과거 검증 기록을 포함한 참고 자료입니다.

# 어쩌집 Design System

기준일: 2026-10-30 (Asia/Seoul). Figma 현재 등록값을 읽어 작성한 문서이며, 이 작업에서 Figma는 수정하지 않았다.

## 출처와 범위

- [Figma 파일](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=462-8452)
- 변수: `w9 워크숍` 컬렉션 전체 73개. Light / Dark 모드와 Primitive 참조 포함.
- 텍스트 스타일: `어쩌집/` 그룹 7개. `Label`, `B2RG` 제외.
- [컴포넌트 섹션](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=336-27325) — 현재 이름: 컴포넌트 (수정중...~)
- [아이콘 섹션](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-6642) — 현재 이름: Icon - 계속 추가 예정

## 적용 원칙

- 일반 UI 토큰은 아래 변수 정의를 사용한다. 기존 컴포넌트의 색상·크기·간격·라운드는 원본 컴포넌트 정의를 우선한다.
- Disabled 버튼의 원본 색상과 Style 2의 pale 색상을 유지한다. `Color/disabled`를 버튼 배경에 일괄 대입하지 않는다.
- 버튼 라운드는 원본 12px를 유지한다. 다른 컴포넌트를 공통 라운드 값으로 일괄 변경하지 않는다.
- 간격은 현재 수치와 정확히 같은 토큰만 연결한다. 가까운 값으로 반올림하거나 화면 배치를 바꾸지 않는다.
- 텍스트 스타일은 등록된 폰트·굵기·크기·행간을 함께 적용한다. 사용자가 수정한 문구는 유지한다.
- 아이콘·일러스트·그라디언트·Material Kit 요소는 일반 단색 토큰 정리 대상으로 취급하지 않는다.
- 컴포넌트는 인스턴스로 재사용하고 연결을 유지한다. 이 문서는 모든 화면의 토큰 연결이나 Dark 모드 구현 완료를 보증하지 않는다.

## 변수

값은 px 단위의 수치 또는 sRGB 색상이다. 색상 HEX는 Figma 부동소수점 채널을 8비트로 반올림한 표기다. 원본 변수 이름의 철자도 그대로 보존했다.

### Color (9)

| 변수 | 타입 | Light | Dark | Scope | 등록 설명 |
| --- | --- | --- | --- | --- | --- |
| `Color/neutral` | COLOR | #F5F7FB ← `Primitive/color/Neutral-100` | #19212E ← `Primitive/color/Neutural-900` | FRAME_FILL, SHAPE_FILL | 화면 배경 |
| `Color/surface` | COLOR | #FFFFFF ← `Primitive/color/Neutral-white` | #19212E ← `Primitive/color/Neutural-900` | FRAME_FILL, SHAPE_FILL | 카드·시트 배경. Dark는 neutral과 같은 짙은색으로 통합 |
| `Color/primary` | COLOR | #365EFF ← `Primitive/color/Primary-700` | #365EFF ← `Primitive/color/Primary-700` | FRAME_FILL, SHAPE_FILL | 주요 버튼·선택; 모드 공통 브랜드 파랑 |
| `Color/primary-pressed` | COLOR | #1B43E4 ← `Primitive/color/Primary-800` | #1B43E4 ← `Primitive/color/Primary-800` | FRAME_FILL, SHAPE_FILL | 눌린 주요 버튼; primary와 구분 유지 |
| `Color/on-surface` | COLOR | #19212E ← `Primitive/color/Neutural-900` | #FFFFFF ← `Primitive/color/Neutral-white` | SHAPE_FILL, TEXT_FILL | 제목·본문 글자 |
| `Color/secondary` | COLOR | #5F6979 ← `Primitive/color/Neutural-500` | #B6C0D0 ← `Primitive/color/Neutural-400` | TEXT_FILL | 보조 글자; neutral/surface 대비 4.5:1 이상 |
| `Color/border` | COLOR | #D7DEE7 ← `Primitive/color/Neutural-200` | #5F6979 ← `Primitive/color/Neutural-500` | STROKE_COLOR | 구분선·테두리 |
| `Color/disabled` | COLOR | #898F98 ← `Primitive/color/Neutral-disabled` | #5F6979 ← `Primitive/color/Neutural-500` | SHAPE_FILL, TEXT_FILL, STROKE_COLOR | 비활성 글자·아이콘 |
| `Color/error` | COLOR | #FF0000 ← `Primitive/color/Error-ui` | #C93B3B ← `Primitive/color/Etc-red-700` | FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR | 오류·삭제 |

### Type (5)

글자 크기만 정의하는 숫자 변수이며, 아래 텍스트 스타일 전체와 동일한 개념이 아니다.

| 변수 | 타입 | Light | Dark | Scope | 등록 설명 |
| --- | --- | --- | --- | --- | --- |
| `Type/text-sm` | FLOAT | 14 ← `Primitive/number/14` | 14 ← `Primitive/number/14` | FONT_SIZE | 시안 글자 크기(px). 폰트/굵기/행간을 포함하는 복합 스타일 아님. |
| `Type/text-base` | FLOAT | 16 ← `Primitive/number/16` | 16 ← `Primitive/number/16` | FONT_SIZE | 시안 글자 크기(px). 폰트/굵기/행간을 포함하는 복합 스타일 아님. |
| `Type/text-lg` | FLOAT | 20 ← `Primitive/number/20` | 20 ← `Primitive/number/20` | FONT_SIZE | 시안 글자 크기(px). 폰트/굵기/행간을 포함하는 복합 스타일 아님. |
| `Type/text-xl` | FLOAT | 26 ← `Primitive/number/26` | 26 ← `Primitive/number/26` | FONT_SIZE | 시안 글자 크기(px). 폰트/굵기/행간을 포함하는 복합 스타일 아님. |
| `Type/text-2xl` | FLOAT | 32 ← `Primitive/number/32` | 32 ← `Primitive/number/32` | FONT_SIZE | 시안 글자 크기(px). 폰트/굵기/행간을 포함하는 복합 스타일 아님. |

### Space (19)

| 변수 | 타입 | Light | Dark | Scope | 등록 설명 |
| --- | --- | --- | --- | --- | --- |
| `Space/space-1` | FLOAT | 4 ← `Primitive/number/4` | 4 ← `Primitive/number/4` | GAP | 시안 사용 빈도 상위 6개 간격(px). |
| `Space/space-2` | FLOAT | 8 ← `Primitive/number/8` | 8 ← `Primitive/number/8` | GAP | 시안 사용 빈도 상위 6개 간격(px). |
| `Space/space-3` | FLOAT | 12 ← `Primitive/number/12` | 12 ← `Primitive/number/12` | GAP | 시안 사용 빈도 상위 6개 간격(px). |
| `Space/space-4` | FLOAT | 16 ← `Primitive/number/16` | 16 ← `Primitive/number/16` | GAP | 시안 사용 빈도 상위 6개 간격(px). |
| `Space/space-5` | FLOAT | 20 ← `Primitive/number/20` | 20 ← `Primitive/number/20` | GAP | 시안 사용 빈도 상위 6개 간격(px). |
| `Space/space-6` | FLOAT | 24 ← `Primitive/number/24` | 24 ← `Primitive/number/24` | GAP | 시안 사용 빈도 상위 6개 간격(px). |
| `Space/value-10` | FLOAT | 10 ← `Primitive/number/10` | 10 ← `Primitive/number/10` | GAP | — |
| `Space/value-40` | FLOAT | 40 ← `Primitive/number/40` | 40 ← `Primitive/number/40` | GAP | — |
| `Space/value-64` | FLOAT | 64 ← `Primitive/number/64` | 64 ← `Primitive/number/64` | GAP | — |
| `Space/value-2` | FLOAT | 2 ← `Primitive/number/2` | 2 ← `Primitive/number/2` | GAP | — |
| `Space/value-36` | FLOAT | 36 ← `Primitive/number/36` | 36 ← `Primitive/number/36` | GAP | — |
| `Space/value-32` | FLOAT | 32 ← `Primitive/number/32` | 32 ← `Primitive/number/32` | GAP | — |
| `Space/value-420` | FLOAT | 420 ← `Primitive/number/420` | 420 ← `Primitive/number/420` | GAP | — |
| `Space/value-65` | FLOAT | 65 ← `Primitive/number/65` | 65 ← `Primitive/number/65` | GAP | — |
| `Space/value-200` | FLOAT | 200 ← `Primitive/number/200` | 200 ← `Primitive/number/200` | GAP | — |
| `Space/value-258` | FLOAT | 258 ← `Primitive/number/258` | 258 ← `Primitive/number/258` | GAP | — |
| `Space/value-28` | FLOAT | 28 ← `Primitive/number/28` | 28 ← `Primitive/number/28` | GAP | — |
| `Space/value-180` | FLOAT | 180 ← `Primitive/number/180` | 180 ← `Primitive/number/180` | GAP | — |
| `Space/value-6` | FLOAT | 6 ← `Primitive/number/6` | 6 ← `Primitive/number/6` | GAP | — |

### Rounded (3)

현재 `Rounded/rounded-lg`는 Light **24px**, Dark **20px**로 등록되어 있다. 과거 20px 통일 요청과 차이가 있지만, 이번 문서는 현재 등록값을 보존한다.

| 변수 | 타입 | Light | Dark | Scope | 등록 설명 |
| --- | --- | --- | --- | --- | --- |
| `Rounded/rounded-sm` | FLOAT | 12 ← `Primitive/number/12` | 12 ← `Primitive/number/12` | CORNER_RADIUS | 시안 모서리 반경(px). full은 원본 pill 100px 기준. |
| `Rounded/rounded-lg` | FLOAT | 24 ← `Primitive/number/24` | 20 ← `Primitive/number/20` | CORNER_RADIUS | 시안 모서리 반경(px). full은 원본 pill 100px 기준. |
| `Rounded/rounded-full` | FLOAT | 100 ← `Primitive/number/100` | 100 ← `Primitive/number/100` | CORNER_RADIUS | 시안 모서리 반경(px). full은 원본 pill 100px 기준. |

### Shadow (2)

두 변수는 blur 수치만 정의한다. offset·spread·그림자 종류를 포함한 완전한 CSS box-shadow로 해석하지 않는다.

| 변수 | 타입 | Light | Dark | Scope | 등록 설명 |
| --- | --- | --- | --- | --- | --- |
| `Shadow/shadow-sm` | FLOAT | 12 ← `Primitive/number/12` | 12 ← `Primitive/number/12` | EFFECT_FLOAT | 그림자의 blur(px). 같은 이름의 Effect Style로 전체 그림자 적용. lg: 원본 네비게이션, sm: 파생 신규 값. |
| `Shadow/shadow-lg` | FLOAT | 22.8 ← `Primitive/number/22-8` | 22.8 ← `Primitive/number/22-8` | EFFECT_FLOAT | 그림자의 blur(px). 같은 이름의 Effect Style로 전체 그림자 적용. lg: 원본 네비게이션, sm: 파생 신규 값. |

### Primitive (35)

| 변수 | 타입 | Light | Dark | Scope | 등록 설명 |
| --- | --- | --- | --- | --- | --- |
| `Primitive/color/Neutral-100` | COLOR | #F5F7FB | #F5F7FB | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/color/Neutral-white` | COLOR | #FFFFFF | #FFFFFF | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/color/Neutural-900` | COLOR | #19212E | #19212E | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/color/Primary-700` | COLOR | #365EFF | #365EFF | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/color/Primary-800` | COLOR | #1B43E4 | #1B43E4 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/color/Neutural-500` | COLOR | #5F6979 | #5F6979 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/color/Neutural-400` | COLOR | #B6C0D0 | #B6C0D0 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/color/Neutural-200` | COLOR | #D7DEE7 | #D7DEE7 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/14` | FLOAT | 14 | 14 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/16` | FLOAT | 16 | 16 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/20` | FLOAT | 20 | 20 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/26` | FLOAT | 26 | 26 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/32` | FLOAT | 32 | 32 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/4` | FLOAT | 4 | 4 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/8` | FLOAT | 8 | 8 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/12` | FLOAT | 12 | 12 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/24` | FLOAT | 24 | 24 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/100` | FLOAT | 100 | 100 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/number/22-8` | FLOAT | 22.8 | 22.8 | 미지정 | 워크숍 참조용 원시 값 |
| `Primitive/shadow-color` | COLOR | #6683B5 / alpha 0.1 | #000000 / alpha 0.35 | 미지정 | Light 원본 그림자 색상; Dark 워크숍 제안 |
| `Primitive/color/Etc-red-700` | COLOR | #C93B3B | #C93B3B | 미지정 | 오류/삭제를 위한 공통 red 원시 색 |
| `Primitive/color/Neutral-disabled` | COLOR | #898F98 | #898F98 | 미지정 | — |
| `Primitive/color/Error-ui` | COLOR | #FF0000 | #FF0000 | 미지정 | — |
| `Primitive/number/10` | FLOAT | 10 | 10 | 미지정 | — |
| `Primitive/number/40` | FLOAT | 40 | 40 | 미지정 | — |
| `Primitive/number/64` | FLOAT | 64 | 64 | 미지정 | — |
| `Primitive/number/2` | FLOAT | 2 | 2 | 미지정 | — |
| `Primitive/number/36` | FLOAT | 36 | 36 | 미지정 | — |
| `Primitive/number/420` | FLOAT | 420 | 420 | 미지정 | — |
| `Primitive/number/65` | FLOAT | 65 | 65 | 미지정 | — |
| `Primitive/number/200` | FLOAT | 200 | 200 | 미지정 | — |
| `Primitive/number/258` | FLOAT | 258 | 258 | 미지정 | — |
| `Primitive/number/28` | FLOAT | 28 | 28 | 미지정 | — |
| `Primitive/number/180` | FLOAT | 180 | 180 | 미지정 | — |
| `Primitive/number/6` | FLOAT | 6 | 6 | 미지정 | — |

## 텍스트 스타일

스타일 그룹은 `어쩌집/`이다. 자간은 전부 0%, 문단 간격은 0px, 대소문자 변환은 ORIGINAL이다. 행간의 부동소수점 오차는 사람이 읽을 수 있도록 반올림했다.

| 스타일 | 폰트 | 굵기 | 크기(px) | 행간 | 환산 행간(px) |
| --- | --- | --- | --- | --- | --- |
| 어쩌집/Body rg | Pretendard | Regular | 16 | 150% | 24 |
| 어쩌집/Body md | Pretendard | Medium | 16 | 150% | 24 |
| 어쩌집/Body sb | Pretendard | SemiBold | 16 | 150% | 24 |
| 어쩌집/Heading | Pretendard | SemiBold | 20 | 150% | 30 |
| 어쩌집/Display bd | Pretendard | Bold | 26 | 140% | 36.4 |
| 어쩌집/Caption md | Pretendard | Medium | 14 | 140% | 19.6 |
| 어쩌집/Caption rg | Pretendard | Regular | 14 | 140% | 19.6 |

`어쩌집/Body sb`는 2026-10-30 사용자 정정에 따라 **Pretendard SemiBold**를 사용한다. 이전 Noto Sans KR 표기를 정정한다. `Type/text-2xl`(32px)은 변수로 존재하지만 이번 포함 대상 텍스트 스타일에는 32px 스타일이 없다.

## 컴포넌트

2026-10-30 사용자 확정: Search, Navigation Bar, Community_Post는 출시 화면에서 사용하지 않으며 Figma의 미사용 섹션으로 이동했다. 아래 원본 명세는 참조용으로 보존하고 출시 구현 대상에서는 제외한다. 기존 미사용 Chip·태그·썸네일도 출시 화면의 실제 구성과 혼동하지 않는다.

아이콘은 우선 시각 요소로만 구현한다. 클릭·버튼 역할을 기본 부여하지 않으며, 화면 구현 시 상호작용이 필요한 아이콘만 버튼과 동작을 연결한다. 공통 컴포넌트는 사용자 요청에 따라 한 번에 구현하고 최신 Figma의 실제 화면·상태와 시각적으로 대조한다.

4단계 구현: 사용 중인 13종은 `src/components/ui`에 있으며 상태 변경 미리보기는 `src/ComponentPreview.tsx`에 있다. 개발 후순위 섹션 `531:6862`의 6종은 제외한다. 공통 컴포넌트 사용법과 화면 연결 시 확인할 미정 사항은 `src/components/ui/README.md`를 따른다. 미리보기의 예시 초기 상태는 출시 화면의 초기 상태 확정이 아니다.

아래 치수는 메인 컴포넌트의 현재 크기이며 모든 화면에서 고정 폭으로 강제할 값은 아니다. 변형 이름과 상태명은 Figma 원문을 따른다. `of`, `Disable` 등의 표기도 임의로 수정하지 않았다.

### [Overlay](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=436-15888)

단일 컴포넌트. 원본 크기: 354 × 211px.

### [유의사항 아코디언](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=336-27389)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Property 1=Open | 354 × 285 | 0 | 없음 |
| Property 1=Close | 354 × 52 | 0 | 없음 |

### [Tab bar](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=336-27423)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Property 1=1 | 354 × 56 | 100 | #F5F7FB |
| Property 1=2 | 354 × 56 | 100 | #F5F7FB |

### [Checkbox](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=336-27434)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Property 1=on, style=Fill | 20 × 20 | 4 | #365EFF |
| Property 1=off, style=Fill | 20 × 20 | 4 | #FFFFFF |
| Property 1=of, style=Stroke | 20 × 20 | 4 | 없음 |
| Property 1=on, style=Stroke | 20 × 20 | 4 | 없음 |

### [Radio](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=336-27438)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Property 1=on | 20 × 20 | 100 | 없음 |
| Property 1=off | 20 × 20 | 100 | 없음 |

### [Community_Post](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-8265)

단일 컴포넌트. 원본 크기: 354 × 135px.

### [썸네일](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=441-16423)

단일 컴포넌트. 원본 크기: 220 × 140px.

### [Action Sheet](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-8130)

단일 컴포넌트. 원본 크기: 402 × 401px.

### [Photo](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=369-9358)

단일 컴포넌트. 원본 크기: 82.5 × 82.5px.

### [태그](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=458-4519)

단일 컴포넌트. 원본 크기: 90 × 44px.

### [Add image](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=462-9067)

단일 컴포넌트. 원본 크기: 82.5 × 82.5px.

### [Message Button](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=472-16852)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Property 1=Pressed, Style=Neutral | 352 × 44 | 12 | #EBEFF7 |
| Property 1=Hover, Style=Pale | 352 × 44 | 12 | #E0EBFF |
| Property 1=Pressed, Style=Pale | 352 × 44 | 12 | #D9E6FF |
| Property 1=Default, Style=Pale | 352 × 44 | 12 | #E8F0FF |
| Property 1=Default, Style=Neutral | 352 × 44 | 12 | #F5F7FB |
| Property 1=Hover, Style=Neutral | 352 × 44 | 12 | #F1F4FA |

### [Navigation Bar](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-6382)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Property 1=1 홈 | 402 × 116 | 0 | 없음 |
| Property 1=2 사례 | 402 × 116 | 0 | 없음 |
| Property 1=4 마이 | 402 × 116 | 0 | 없음 |
| Property 1=3 커뮤니티 | 402 × 116 | 0 | 없음 |

### [List](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-7937)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Property=Default, Style=Neutral | 354 × 56 | 100 | #F5F7FB |
| Property=Default, Style=Pale | 354 × 56 | 100 | #E8F0FF |
| Property=Pressed, Style=Neutral | 354 × 56 | 100 | #EBEFF7 |
| Property=Hover, Style=Neutral | 354 × 56 | 100 | #F1F4FA |
| Property=Hover, Style=Pale | 354 × 56 | 100 | #E0EBFF |
| Property=Pressed, Style=Pale | 354 × 56 | 100 | #D9E6FF |

### [GNB](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=411-4570)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Style=Depth 2_Light | 402 × 56 | 0 | #FFFFFF |
| Style=Depth 2_Dark | 402 × 56 | 0 | 없음 |
| Style=Depth 1 | 402 × 56 | 0 | #FFFFFF |

### [Search](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=431-14516)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Property 1=Default | 354 × 48 | 28 | #F5F7FB |
| Property 1=Active | 354 × 48 | 28 | #F5F7FB |

### [Button](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=441-17141)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Property 1=Default, Style=1 | 354 × 56 | 12 | #365EFF |
| Property 1=Default, Style=2 | 354 × 56 | 12 | #E8F0FF |
| Property 1=Hover, Style=1 | 354 × 56 | 12 | #234FFF |
| Property 1=Hover, Style=2 | 354 × 56 | 12 | #E0EBFF |
| Property 1=Pressed, Style=1 | 354 × 56 | 12 | #1B45F0 |
| Property 1=Pressed, Style=2 | 354 × 56 | 12 | #D9E6FF |
| Property 1=Disable, Style=1 | 354 × 56 | 12 | #D7DEE7 |
| Property 1=Disable, Style=2 | 354 × 56 | 12 | #D7DEE7 |
| Property 1=Loading, Style=1 | 354 × 56 | 12 | #365EFF |
| Property 1=Loading, Style=2 | 354 × 56 | 12 | #E8F0FF |

### [Chip](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=458-4814)

| 변형 | 원본 크기(px) | 라운드(px) | 최상위 배경 |
| --- | --- | --- | --- |
| Property 1=Default | 56 × 38 | 24 | #FFFFFF |
| Property 1=Hover | 56 × 38 | 24 | #F5F7FB |
| Property 1=Pressed | 56 × 38 | 24 | #F0F3FA |
| Property 1=Selected | 56 × 38 | 24 | #19212E |
| Property 1=Disabled | 56 × 38 | 24 | #FFFFFF |

Button은 모든 변형의 높이 56px, 라운드 12px이다. Style 2 기본 배경은 `#E8F0FF`, 두 Style의 Disable 배경은 `#D7DEE7`이다. 이 색상은 워크숍의 `Color/disabled`와 다르므로 별도로 보존한다. Pressed 색상 또한 원본 컴포넌트를 우선한다.

## 아이콘

29개 컴포넌트 세트가 있다. 벡터를 다시 그리지 않고 해당 세트의 인스턴스를 사용한다. 아래 목록은 에셋 참조이며 SVG 파일 자체를 포함하지 않는다. 각 변형의 실제 프레임 크기를 함께 기록했다.

| 아이콘 세트 | 등록 변형 및 실제 크기 |
| --- | --- |
| [Icon/Home](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-7094) | Size=24, Style=Fill → 24×24; Size=24, Style=Stroke → 24×24; Size=28, Style=Fill → 28×28; Size=28, Style=Stroke → 28×28; Size=20, Style=Fill → 20×20; Size=20, Style=Stroke → 20×20; Size=16, Style=Fill → 16×16; Size=16, Style=Stroke → 16×16 |
| [Icon/Book](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=411-4291) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Community](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-7404) | Size=24, Style=Fill → 24×24; Size=24, Style=Stroke → 24×24; Size=28, Style=Fill → 28×28; Size=28, Style=Stroke → 28×28; Size=20, Style=Fill → 20×20; Size=20, Style=Stroke → 20×20; Size=16, Style=Fill → 16×16; Size=16, Style=Stroke → 16×16 |
| [Icon/Profile](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-7173) | Size=24, Style=Fill → 24×24; Size=24, Style=Stroke → 24×24; Size=20, Style=Fill → 20×20; Size=20, Style=Stroke → 20×20; Size=28, Style=Fill → 28×28; Size=28, Style=Stroke → 28×28; Size=16, Style=Fill → 16×16; Size=16, Style=Stroke → 16×16 |
| [Icon/Write](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-7993) | Size=28, Style=Fill → 28×28; Size=28, Style=Stroke → 28×28; Size=24, Style=Fill → 24×24; Size=24, Style=Stroke → 24×24; Size=20, Style=Fill → 20×20; Size=20, Style=Stroke → 20×20; Size=16, Style=Fill → 16×16; Size=16, Style=Stroke → 16×16 |
| [Icon/Heart](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-9050) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Plus](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=369-9169) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/X-mark](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=369-9226) | Property 1=28 → 28×28; Property 1=24 → 24×24; Property 1=20 → 20×20; Property 1=16 → 16×16 |
| [Icon/Check](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=377-4743) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/Arrow_Left](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-3504) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/Arrow_Right](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-3506) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/Arrow_Bottom](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-3518) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/Arrow_Top](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-3530) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/Clock](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-3668) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Magnifier](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-3711) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/Warning](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-3833) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Info](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=431-14740) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Kebab](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-3930) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/Send](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-4101) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/External Link](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-4382) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/Dollar](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=411-4462) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/Question Mark](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=472-13724) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |
| [Icon/Setting](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-4579) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Locate](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=411-3598) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Logout](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=411-3664) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Scrab](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=411-4668) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Thums up](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=489-20377) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Thums down](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=489-20379) | Size=28, Style=Fill → 28×28; Size=24, Style=Fill → 24×24; Size=20, Style=Fill → 20×20; Size=16, Style=Fill → 16×16; Size=28, Style=Stroke → 28×28; Size=24, Style=Stroke → 24×24; Size=20, Style=Stroke → 20×20; Size=16, Style=Stroke → 16×16 |
| [Icon/Blank](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=408-3835) | Size=28 → 28×28; Size=24 → 24×24; Size=20 → 20×20; Size=16 → 16×16 |

2026-10-30 사용자 정정: 화살표 이름을 실제 방향 Left(408:3504), Right(408:3506), Bottom(408:3518), Top(408:3530)에 맞췄다. Home Stroke 16과 Community Fill 28의 크기 이름은 최신 Figma 수정값을 반영했다. Blank는 원본부터 16×16·20×20·24×24·28×28인 정사각형이며 그대로 유지한다. 좌우 이름은 사용자 요청에 따라 코드와 이 문서에 반영했으며 이번 작업에서 Figma 파일은 수정하지 않았다.

## 조회 및 검증 기준

- 변수 전체를 ID로 조회하고 각 모드의 alias를 Primitive까지 해석했다.
- 텍스트 스타일의 제외 조건은 경로 전체 `어쩌집/Label`, `어쩌집/B2RG`의 정확한 일치다.
- 컴포넌트·아이콘은 사용자가 지정한 두 섹션에 있는 원본을 기준으로 기록했다.
- 상태 색상, 비정상적으로 보이는 이름, 모드별 값 차이를 임의 정규화하지 않았다.



## 공통 모션 (사용자 요청 반영)

- 로딩: 3초 순환, 1초마다 앞 원 축소와 다음 원 확대를 동시에 연결합니다.
- 탭: 독립된 흰색 배경 레이어가 320ms로 좌우 이동합니다.
- 아코디언: 내용 높이·투명도와 화살표 180도 회전을 320ms로 전환합니다.
- Action Sheet: 320ms 아래↔위 슬라이드와 배경 페이드. 닫기 완료 후 포커스·스크롤을 복원합니다.
- Overlay: 열기·닫기 모두 100ms dissolve.
- 공통 easing: cubic-bezier(.4, 0, .2, 1). 움직임 줄이기 설정에서는 전환을 생략합니다.
