---
"project": "어쩌집"
"updated": "2026-10-30"
"scope": "Light 웹 구현. Dark는 Figma 등록값만 보존"
"sources":
  "figma_file": "6WGOaMy4R6jiO6Q7fQ09w8"
  "launch_section": "462:8452"
  "components": "336:27325"
  "icons": "355:6642"
  "contract": "src/components/CONTRACT.md"
  "reference": "design/figma-reference.md"
"representative_screens":
  -
    "name": "A01 홈"
    "node": "462:8453"
  -
    "name": "A02-1 문제 작성"
    "node": "462:8683"
  -
    "name": "B03-2 문의 메세지_전문 업체"
    "node": "472:16668"
"figma_variables":
  -
    "name": "Color/neutral"
    "type": "COLOR"
    "light": "#F5F7FB ← Primitive/color/Neutral-100"
    "dark": "#19212E ← Primitive/color/Neutural-900"
    "scope": "FRAME_FILL, SHAPE_FILL"
    "description": "화면 배경"
  -
    "name": "Color/surface"
    "type": "COLOR"
    "light": "#FFFFFF ← Primitive/color/Neutral-white"
    "dark": "#19212E ← Primitive/color/Neutural-900"
    "scope": "FRAME_FILL, SHAPE_FILL"
    "description": "카드·시트 배경. Dark는 neutral과 같은 짙은색으로 통합"
  -
    "name": "Color/primary"
    "type": "COLOR"
    "light": "#365EFF ← Primitive/color/Primary-700"
    "dark": "#365EFF ← Primitive/color/Primary-700"
    "scope": "FRAME_FILL, SHAPE_FILL"
    "description": "주요 버튼·선택; 모드 공통 브랜드 파랑"
  -
    "name": "Color/primary-pressed"
    "type": "COLOR"
    "light": "#1B43E4 ← Primitive/color/Primary-800"
    "dark": "#1B43E4 ← Primitive/color/Primary-800"
    "scope": "FRAME_FILL, SHAPE_FILL"
    "description": "눌린 주요 버튼; primary와 구분 유지"
  -
    "name": "Color/on-surface"
    "type": "COLOR"
    "light": "#19212E ← Primitive/color/Neutural-900"
    "dark": "#FFFFFF ← Primitive/color/Neutral-white"
    "scope": "SHAPE_FILL, TEXT_FILL"
    "description": "제목·본문 글자"
  -
    "name": "Color/secondary"
    "type": "COLOR"
    "light": "#5F6979 ← Primitive/color/Neutural-500"
    "dark": "#B6C0D0 ← Primitive/color/Neutural-400"
    "scope": "TEXT_FILL"
    "description": "보조 글자; neutral/surface 대비 4.5:1 이상"
  -
    "name": "Color/border"
    "type": "COLOR"
    "light": "#D7DEE7 ← Primitive/color/Neutural-200"
    "dark": "#5F6979 ← Primitive/color/Neutural-500"
    "scope": "STROKE_COLOR"
    "description": "구분선·테두리"
  -
    "name": "Color/disabled"
    "type": "COLOR"
    "light": "#898F98 ← Primitive/color/Neutral-disabled"
    "dark": "#5F6979 ← Primitive/color/Neutural-500"
    "scope": "SHAPE_FILL, TEXT_FILL, STROKE_COLOR"
    "description": "비활성 글자·아이콘"
  -
    "name": "Color/error"
    "type": "COLOR"
    "light": "#FF0000 ← Primitive/color/Error-ui"
    "dark": "#C93B3B ← Primitive/color/Etc-red-700"
    "scope": "FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR"
    "description": "오류·삭제"
  -
    "name": "Type/text-sm"
    "type": "FLOAT"
    "light": "14 ← Primitive/number/14"
    "dark": "14 ← Primitive/number/14"
    "scope": "FONT_SIZE"
    "description": "시안 글자 크기(px). 폰트/굵기/행간을 포함하는 복합 스타일 아님."
  -
    "name": "Type/text-base"
    "type": "FLOAT"
    "light": "16 ← Primitive/number/16"
    "dark": "16 ← Primitive/number/16"
    "scope": "FONT_SIZE"
    "description": "시안 글자 크기(px). 폰트/굵기/행간을 포함하는 복합 스타일 아님."
  -
    "name": "Type/text-lg"
    "type": "FLOAT"
    "light": "20 ← Primitive/number/20"
    "dark": "20 ← Primitive/number/20"
    "scope": "FONT_SIZE"
    "description": "시안 글자 크기(px). 폰트/굵기/행간을 포함하는 복합 스타일 아님."
  -
    "name": "Type/text-xl"
    "type": "FLOAT"
    "light": "26 ← Primitive/number/26"
    "dark": "26 ← Primitive/number/26"
    "scope": "FONT_SIZE"
    "description": "시안 글자 크기(px). 폰트/굵기/행간을 포함하는 복합 스타일 아님."
  -
    "name": "Type/text-2xl"
    "type": "FLOAT"
    "light": "32 ← Primitive/number/32"
    "dark": "32 ← Primitive/number/32"
    "scope": "FONT_SIZE"
    "description": "시안 글자 크기(px). 폰트/굵기/행간을 포함하는 복합 스타일 아님."
  -
    "name": "Space/space-1"
    "type": "FLOAT"
    "light": "4 ← Primitive/number/4"
    "dark": "4 ← Primitive/number/4"
    "scope": "GAP"
    "description": "시안 사용 빈도 상위 6개 간격(px)."
  -
    "name": "Space/space-2"
    "type": "FLOAT"
    "light": "8 ← Primitive/number/8"
    "dark": "8 ← Primitive/number/8"
    "scope": "GAP"
    "description": "시안 사용 빈도 상위 6개 간격(px)."
  -
    "name": "Space/space-3"
    "type": "FLOAT"
    "light": "12 ← Primitive/number/12"
    "dark": "12 ← Primitive/number/12"
    "scope": "GAP"
    "description": "시안 사용 빈도 상위 6개 간격(px)."
  -
    "name": "Space/space-4"
    "type": "FLOAT"
    "light": "16 ← Primitive/number/16"
    "dark": "16 ← Primitive/number/16"
    "scope": "GAP"
    "description": "시안 사용 빈도 상위 6개 간격(px)."
  -
    "name": "Space/space-5"
    "type": "FLOAT"
    "light": "20 ← Primitive/number/20"
    "dark": "20 ← Primitive/number/20"
    "scope": "GAP"
    "description": "시안 사용 빈도 상위 6개 간격(px)."
  -
    "name": "Space/space-6"
    "type": "FLOAT"
    "light": "24 ← Primitive/number/24"
    "dark": "24 ← Primitive/number/24"
    "scope": "GAP"
    "description": "시안 사용 빈도 상위 6개 간격(px)."
  -
    "name": "Space/value-10"
    "type": "FLOAT"
    "light": "10 ← Primitive/number/10"
    "dark": "10 ← Primitive/number/10"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-40"
    "type": "FLOAT"
    "light": "40 ← Primitive/number/40"
    "dark": "40 ← Primitive/number/40"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-64"
    "type": "FLOAT"
    "light": "64 ← Primitive/number/64"
    "dark": "64 ← Primitive/number/64"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-2"
    "type": "FLOAT"
    "light": "2 ← Primitive/number/2"
    "dark": "2 ← Primitive/number/2"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-36"
    "type": "FLOAT"
    "light": "36 ← Primitive/number/36"
    "dark": "36 ← Primitive/number/36"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-32"
    "type": "FLOAT"
    "light": "32 ← Primitive/number/32"
    "dark": "32 ← Primitive/number/32"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-420"
    "type": "FLOAT"
    "light": "420 ← Primitive/number/420"
    "dark": "420 ← Primitive/number/420"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-65"
    "type": "FLOAT"
    "light": "65 ← Primitive/number/65"
    "dark": "65 ← Primitive/number/65"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-200"
    "type": "FLOAT"
    "light": "200 ← Primitive/number/200"
    "dark": "200 ← Primitive/number/200"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-258"
    "type": "FLOAT"
    "light": "258 ← Primitive/number/258"
    "dark": "258 ← Primitive/number/258"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-28"
    "type": "FLOAT"
    "light": "28 ← Primitive/number/28"
    "dark": "28 ← Primitive/number/28"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-180"
    "type": "FLOAT"
    "light": "180 ← Primitive/number/180"
    "dark": "180 ← Primitive/number/180"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Space/value-6"
    "type": "FLOAT"
    "light": "6 ← Primitive/number/6"
    "dark": "6 ← Primitive/number/6"
    "scope": "GAP"
    "description": "—"
  -
    "name": "Rounded/rounded-sm"
    "type": "FLOAT"
    "light": "12 ← Primitive/number/12"
    "dark": "12 ← Primitive/number/12"
    "scope": "CORNER_RADIUS"
    "description": "시안 모서리 반경(px). full은 원본 pill 100px 기준."
  -
    "name": "Rounded/rounded-lg"
    "type": "FLOAT"
    "light": "24 ← Primitive/number/24"
    "dark": "20 ← Primitive/number/20"
    "scope": "CORNER_RADIUS"
    "description": "시안 모서리 반경(px). full은 원본 pill 100px 기준."
  -
    "name": "Rounded/rounded-full"
    "type": "FLOAT"
    "light": "100 ← Primitive/number/100"
    "dark": "100 ← Primitive/number/100"
    "scope": "CORNER_RADIUS"
    "description": "시안 모서리 반경(px). full은 원본 pill 100px 기준."
  -
    "name": "Shadow/shadow-sm"
    "type": "FLOAT"
    "light": "12 ← Primitive/number/12"
    "dark": "12 ← Primitive/number/12"
    "scope": "EFFECT_FLOAT"
    "description": "그림자의 blur(px). 같은 이름의 Effect Style로 전체 그림자 적용. lg: 원본 네비게이션, sm: 파생 신규 값."
  -
    "name": "Shadow/shadow-lg"
    "type": "FLOAT"
    "light": "22.8 ← Primitive/number/22-8"
    "dark": "22.8 ← Primitive/number/22-8"
    "scope": "EFFECT_FLOAT"
    "description": "그림자의 blur(px). 같은 이름의 Effect Style로 전체 그림자 적용. lg: 원본 네비게이션, sm: 파생 신규 값."
  -
    "name": "Primitive/color/Neutral-100"
    "type": "COLOR"
    "light": "#F5F7FB"
    "dark": "#F5F7FB"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/color/Neutral-white"
    "type": "COLOR"
    "light": "#FFFFFF"
    "dark": "#FFFFFF"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/color/Neutural-900"
    "type": "COLOR"
    "light": "#19212E"
    "dark": "#19212E"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/color/Primary-700"
    "type": "COLOR"
    "light": "#365EFF"
    "dark": "#365EFF"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/color/Primary-800"
    "type": "COLOR"
    "light": "#1B43E4"
    "dark": "#1B43E4"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/color/Neutural-500"
    "type": "COLOR"
    "light": "#5F6979"
    "dark": "#5F6979"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/color/Neutural-400"
    "type": "COLOR"
    "light": "#B6C0D0"
    "dark": "#B6C0D0"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/color/Neutural-200"
    "type": "COLOR"
    "light": "#D7DEE7"
    "dark": "#D7DEE7"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/14"
    "type": "FLOAT"
    "light": "14"
    "dark": "14"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/16"
    "type": "FLOAT"
    "light": "16"
    "dark": "16"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/20"
    "type": "FLOAT"
    "light": "20"
    "dark": "20"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/26"
    "type": "FLOAT"
    "light": "26"
    "dark": "26"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/32"
    "type": "FLOAT"
    "light": "32"
    "dark": "32"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/4"
    "type": "FLOAT"
    "light": "4"
    "dark": "4"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/8"
    "type": "FLOAT"
    "light": "8"
    "dark": "8"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/12"
    "type": "FLOAT"
    "light": "12"
    "dark": "12"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/24"
    "type": "FLOAT"
    "light": "24"
    "dark": "24"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/100"
    "type": "FLOAT"
    "light": "100"
    "dark": "100"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/number/22-8"
    "type": "FLOAT"
    "light": "22.8"
    "dark": "22.8"
    "scope": "미지정"
    "description": "워크숍 참조용 원시 값"
  -
    "name": "Primitive/shadow-color"
    "type": "COLOR"
    "light": "#6683B5 / alpha 0.1"
    "dark": "#000000 / alpha 0.35"
    "scope": "미지정"
    "description": "Light 원본 그림자 색상; Dark 워크숍 제안"
  -
    "name": "Primitive/color/Etc-red-700"
    "type": "COLOR"
    "light": "#C93B3B"
    "dark": "#C93B3B"
    "scope": "미지정"
    "description": "오류/삭제를 위한 공통 red 원시 색"
  -
    "name": "Primitive/color/Neutral-disabled"
    "type": "COLOR"
    "light": "#898F98"
    "dark": "#898F98"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/color/Error-ui"
    "type": "COLOR"
    "light": "#FF0000"
    "dark": "#FF0000"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/10"
    "type": "FLOAT"
    "light": "10"
    "dark": "10"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/40"
    "type": "FLOAT"
    "light": "40"
    "dark": "40"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/64"
    "type": "FLOAT"
    "light": "64"
    "dark": "64"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/2"
    "type": "FLOAT"
    "light": "2"
    "dark": "2"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/36"
    "type": "FLOAT"
    "light": "36"
    "dark": "36"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/420"
    "type": "FLOAT"
    "light": "420"
    "dark": "420"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/65"
    "type": "FLOAT"
    "light": "65"
    "dark": "65"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/200"
    "type": "FLOAT"
    "light": "200"
    "dark": "200"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/258"
    "type": "FLOAT"
    "light": "258"
    "dark": "258"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/28"
    "type": "FLOAT"
    "light": "28"
    "dark": "28"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/180"
    "type": "FLOAT"
    "light": "180"
    "dark": "180"
    "scope": "미지정"
    "description": "—"
  -
    "name": "Primitive/number/6"
    "type": "FLOAT"
    "light": "6"
    "dark": "6"
    "scope": "미지정"
    "description": "—"
"text_styles":
  -
    "name": "어쩌집/Body rg"
    "family": "Pretendard"
    "weight": "Regular"
    "size_px": "16"
    "line_height": "150%"
    "line_height_px": "24"
  -
    "name": "어쩌집/Body md"
    "family": "Pretendard"
    "weight": "Medium"
    "size_px": "16"
    "line_height": "150%"
    "line_height_px": "24"
  -
    "name": "어쩌집/Body sb"
    "family": "Pretendard"
    "weight": "SemiBold"
    "size_px": "16"
    "line_height": "150%"
    "line_height_px": "24"
  -
    "name": "어쩌집/Heading"
    "family": "Pretendard"
    "weight": "SemiBold"
    "size_px": "20"
    "line_height": "150%"
    "line_height_px": "30"
  -
    "name": "어쩌집/Display bd"
    "family": "Pretendard"
    "weight": "Bold"
    "size_px": "26"
    "line_height": "140%"
    "line_height_px": "36.4"
  -
    "name": "어쩌집/Caption md"
    "family": "Pretendard"
    "weight": "Medium"
    "size_px": "14"
    "line_height": "140%"
    "line_height_px": "19.6"
  -
    "name": "어쩌집/Caption rg"
    "family": "Pretendard"
    "weight": "Regular"
    "size_px": "14"
    "line_height": "140%"
    "line_height_px": "19.6"
"web_tokens":
  "--font-family": "Pretendard, sans-serif"
  "--color-neutral": "#f5f7fb"
  "--color-surface": "#ffffff"
  "--color-primary": "#365eff"
  "--color-primary-pressed": "#1b43e4"
  "--color-on-surface": "#19212e"
  "--color-secondary": "#5f6979"
  "--color-border": "#d7dee7"
  "--color-disabled": "#898f98"
  "--color-error": "#ff0000"
  "--button-primary-hover": "#234fff"
  "--button-primary-pressed": "#1b45f0"
  "--button-pale": "#e8f0ff"
  "--button-pale-hover": "#e0ebff"
  "--button-pale-pressed": "#d9e6ff"
  "--button-disabled-background": "#d7dee7"
  "--list-neutral-hover": "#f1f4fa"
  "--list-neutral-pressed": "#ebeff7"
  "--text-sm": "14px"
  "--text-base": "16px"
  "--text-lg": "20px"
  "--text-xl": "26px"
  "--text-2xl": "32px"
  "--space-1": "4px"
  "--space-2": "8px"
  "--space-3": "12px"
  "--space-4": "16px"
  "--space-5": "20px"
  "--space-6": "24px"
  "--space-32": "32px"
  "--space-40": "40px"
  "--space-64": "64px"
  "--rounded-sm": "12px"
  "--rounded-lg": "24px"
  "--rounded-full": "100px"
"component_values":
  "button_height_px": 56 # Button의 고정 높이
  "photo_size_px": 82.5 # Photo와 AddImage의 정사각형 크기
  "arrow_button_size_px": 40 # ArrowButton 원형 영역
  "arrow_icon_size_px": 24 # ArrowButton 내부 원본 화살표
  "checkbox_radius_px": 4 # Checkbox 원본 모서리
  "backdrop": "rgb(0 0 0 / .25)" # 모달 뒤 배경 딤
  "overlay_surface": "rgb(255 255 255 / .94)" # Overlay 반투명 면
  "overlay_blur_px": 6 # Overlay 배경 블러
"observed_layout":
  "status": "관찰: 전 화면 공통 규칙으로 승인되지 않음"
  "frame_width_px": 412
  "content_horizontal_inset_px": 24
  "content_width_px": 364
"motion":
  "navigation_pressed_brightness": 0.94 # 2026-10-31 사용자 승인: 별도 상태 디자인 없는 화면 이동 요소
  "easing": "cubic-bezier(.4, 0, .2, 1)" # 공통 시작·끝 가감속
  "transition_ms": 320 # 탭 선택 배경·아코디언·ActionSheet 전환
  "overlay_ms": 100 # Overlay 열림·닫힘 dissolve
  "color_ms": 160 # 버튼·목록·문장 버튼 상태 색 전환
  "tab_text_ms": 200 # 탭 글자 색 전환
  "loading_cycle_ms": 3000 # 로딩 원 전체 순환
  "loading_handoff_ms": 1000 # 앞 원 축소와 다음 원 확대의 간격
  "accordion_rotation_deg": -180 # 열림 상태의 화살표 회전
---

# DESIGN.md — 어쩌집

## Overview

자취생이 주거 문제를 사진·글로 설명하고 해결 방법과 문의 메시지를 확인하는 Android 지향 하이브리드 앱이다. 친근한 문구와 명확한 다음 행동을 유지한다. 제품 범위는 [W9 PRD](docs/PRD_w9%20수정안.md), 화면 동작은 [화면별 기능정의](docs/화면별_기능정의.md)를 따른다.

이 파일이 프로젝트 최상위 디자인 기준이다. 수업자료의 섹션 순서를 따르며 값은 상단 YAML에 모으고 본문은 용도를 설명한다. 이전 상세 조회 자료는 [Figma 참조 명세](design/figma-reference.md)에 보존한다. 이 문서 작성으로 Figma Variables나 앱 동작을 변경하지 않았다.

### 근거와 검증 상태

문서의 적용 범위: 루트 `DESIGN.md`는 여러 화면에서 반복되는 시각 판단을, [CONTRACT.md](src/components/CONTRACT.md)는 컴포넌트 자체의 보장과 호출 조건을 다룬다. 계약은 `ui`와 `Icon` 모두를 포함하므로 공통 상위 컴포넌트 폴더에 둔다. 화면별 요구는 작업 프롬프트로 전달하고, 지속적으로 필요한 확정 동작은 기능정의에 기록한다.

강의의 primary 버튼 개수 제한, 삭제 확인창 의무, variant 목록은 형식 예시이며 우리 앱의 확정 정책으로 추가하지 않는다.

- **확정:** 기존 변수·텍스트 스타일 기록, 사용자가 정정한 Pretendard SemiBold, 아이콘 방향·크기, 출시 제외 범위 및 요청한 모션. 실제 코드의 동작은 [CONTRACT.md](src/components/CONTRACT.md)에 별도로 기록한다.
- **관찰:** 아래 대표 화면의 구조·치수는 작성일에 Figma MCP로 다시 조회했다. 관찰값을 모든 화면에 적용하는 규칙으로 승격하지 않는다.
- **확인 필요:** 화면 이동·저장·취소·입력 검증 시점의 미정 사항은 기능정의 문서에서 관리하며 확정 규칙에 포함하지 않는다. 이 문서 작성이 팀 전체 승인이나 실제 화면 조립 검증 완료를 뜻하지 않는다.
- 변수 전체와 텍스트 스타일 값은 기존 조회 기록을 보존했다. 이번 작업에서는 전체 변수의 최신 값 재검증을 수행하지 않았다.

핵심 경로를 포함하도록 다음 대표 화면을 선정했다.

| 화면 | 확인 목적 | Figma |
| --- | --- | --- |
| A01 홈 | 콘텐츠 묶음, 목록, 시작 동선 | [원본](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=462-8453) |
| A02-1 문제 작성 | 헤더, 문제 입력, 사진 추가, CTA | [원본](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=462-8683) |
| B03-2 문의 메세지_전문 업체 | 수신자 탭, 메시지 편집·복사 | [원본](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=472-16668) |

## Colors

일반 면은 `Color/neutral`과 `Color/surface`, 주요 행동·선택은 `Color/primary`, 본문은 `Color/on-surface`, 보조 글은 `Color/secondary`, 경계는 `Color/border`, 오류는 `Color/error`를 쓴다. 웹에서는 대응하는 `--color-*` 토큰을 사용한다.

버튼의 hover·pressed·pale·disabled 배경은 일반 의미 토큰과 구분된 `--button-*`을 사용한다. 비활성 글자용 `Color/disabled`를 버튼 배경으로 대입하지 않는다. 등록된 Dark 값은 참고 데이터이며 현재 웹의 Dark 지원 완료를 의미하지 않는다.

## Typography

로컬 Pretendard를 사용한다. 제목에는 Heading, 강조 제목에는 Display bd, 본문에는 Body rg/md/sb, 보조 설명에는 Caption rg/md를 사용한다. 스타일의 글꼴·굵기·크기·행간을 묶어서 적용한다. Body sb는 Pretendard SemiBold이며 Noto Sans KR로 대체하지 않는다.

`Type/*`는 크기만 정의하므로 완성된 텍스트 스타일과 혼동하지 않는다. 컴포넌트 원본의 별도 행간은 해당 컴포넌트 스타일을 유지한다. 텍스트 클래스는 [typography.css](src/styles/typography.css), 글꼴 로딩은 [fonts.css](src/styles/fonts.css)를 따른다.

## Layout

간격은 원본과 정확히 일치하는 `Space/*`만 연결한다. 가장 가까운 토큰으로 반올림하지 않는다. `observed_layout`은 선정 화면에서 확인한 배치이며 공통 여백 강제 규칙이 아니다.

컴포넌트의 폭은 화면의 부모 영역에 맞춘다. 원본 프레임 폭을 모든 기기에서 고정하지 않는다. 사진과 원형 버튼처럼 자체 크기가 있는 요소는 `component_values`와 원본을 따른다. 긴 본문은 자연스럽게 늘어나도록 한다. 시간·배터리·시스템 내비게이션·키보드를 웹 화면에 복제하지 않는다.

## Elevation & Depth

기본 컴포넌트는 면 색상과 테두리로 구분한다. 모달은 배경 딤과 전면 시트로 깊이를 나타내며 Overlay에는 반투명 면과 배경 블러가 있다. 세부 값은 `component_values`를 따른다.

`Shadow/*`는 blur 수치뿐이며 완성된 box-shadow가 아니다. 전체 효과 원본을 확인하지 않고 offset·spread를 만들어 넣지 않는다. 후순위 Navigation Bar의 그림자를 출시 화면에 일괄 적용하지 않는다.

## Shapes

버튼·사진·메시지 행은 `Rounded/rounded-sm`, 시트와 확인창은 현재 Light의 `Rounded/rounded-lg`, 탭·목록은 `Rounded/rounded-full`을 사용한다. Checkbox와 원형 ArrowButton의 형태는 각 원본을 유지한다. 서로 다른 컴포넌트의 모서리를 하나의 값으로 통일하지 않는다.

아이콘은 원본 SVG와 정확한 변형 노드 ID를 재사용한다. Blank도 원본 정사각형 프레임을 유지한다. 화살표 이름은 실제 방향을 따른다.

## Components

2026-10-31 사용자 승인: 별도 상태 디자인이 없는 화면 이동용 배너·카테고리·프로필 버튼은 눌리는 동안 `motion.navigation_pressed_brightness`로 어둡게 표시한다. 전환은 `motion.color_ms`와 `motion.easing`을 사용한다. native button의 `:active:not(:disabled)`를 사용하고 터치 스크롤을 막거나 눌림 상태를 고정하지 않는다. 해제·스크롤 취소 후 복원을 확인한다. 새 hover 효과는 필요하지 않으며, 기존 공통 컴포넌트의 상태 토큰을 이 밝기 효과로 대체하거나 중복 적용하지 않는다. 포커스 표시를 유지하고 움직임 줄이기에서는 전환을 생략한다.

공통 구현은 [src/components/ui](src/components/ui)에 있다. 주요 행동은 Button, 아이콘만 있는 다음 행동은 ArrowButton, 복수 선택은 Checkbox, 단일 선택은 Radio, 수신자 전환은 TabBar를 사용한다. ListRow는 목록 행동, MessageButton은 문장 포함 여부, GNB는 헤더, Accordion은 펼침 설명, AddImage·Photo는 사진 추가·표시, ActionSheet는 행동 선택, Overlay는 확인에 사용한다.

정확한 Props·기본값·이벤트·닫힘·접근성·모션은 [CONTRACT.md](src/components/CONTRACT.md)를 따른다. 모션 값은 상단 `motion`에 기록한다. 미리보기의 예시 상태나 콜백을 실제 화면 정책으로 확정하지 않는다.

## Do's and Don'ts

- 기존 토큰·공통 컴포넌트를 가져와 사용하고, 화면별 신규 요구는 담당자 검토 후 반영한다.
- 아이콘에 기본 클릭·포커스 동작을 넣지 않는다. 필요한 화면에서 의미 있는 버튼으로 감싼다.
- loading 또는 disabled 버튼이 중복 실행되지 않는지 확인한다.
- 닫힌 아코디언 내용이 키보드 포커스 대상이 되지 않는지 확인한다.
- 모달을 닫은 뒤 포커스와 배경 스크롤이 복원되는지 확인한다.
- 운영체제의 움직임 줄이기 설정에서 전환을 생략한다.
- 출시 제외된 Search·Navigation Bar·Community_Post·Chip·태그·썸네일을 추가하지 않는다.
- 미정 동작과 실제 LLM·카메라·앨범 연결을 예시 코드로 완료 처리하지 않는다.
- `preview.css`를 출시 화면의 스타일로 복사하지 않는다.

### CTA 눌림 피드백 (2026-10-31)
- 기존 pressed 색 토큰을 누르는 순간 즉시 적용하고 손을 떼면 기존 color_ms로 복귀한다. 짧은 탭을 위해 이벤트 실행을 지연하지 않는다.
