# 화면과 한국어 문구

2026-10-27에 웹에서 확인한 공식 자료와 적용 범위입니다. 공식 홈페이지 일부는 제작 환경에서 직접 접속이 제한되어, 해당 프로젝트의 공식 공개 소스를 함께 확인했습니다.

| 레퍼런스 | 확인한 원문 | 적용한 부분 |
| --- | --- | --- |
| [GitHub Primer](https://primer.style/foundations/primitives/getting-started) | [밝은 테마의 색상 토큰](https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/base/color/light/light.json5) | 흰 배경, 중립 회색, 명확한 글자 대비. 색은 링크·선택·연결선의 역할을 구분할 때 사용 |
| [토스 es-toolkit 한국어 문서](https://es-toolkit.slash.page/ko/) | [한국어 탐색 문구](https://github.com/toss/es-toolkit/blob/ee2676d1f56b06dd846401e8af2afb4b7e5c6264/docs/.vitepress/ko.mts) · [글자와 여백](https://github.com/toss/es-toolkit/blob/ee2676d1f56b06dd846401e8af2afb4b7e5c6264/docs/.vitepress/theme/index.css) | 짧은 메뉴 이름, 제목과 본문의 크기 구분, 한국어 줄바꿈 |
| [토스 테크니컬 라이팅 가이드](https://technical-writing.dev/) | [자연스러운 한국어](https://github.com/toss/technical-writing/blob/68ba335cbe35c877775f092e98177b60da5f3d95/docs/sentence/natural-kor-expression.mdx) · [필요한 정보만 남기기](https://github.com/toss/technical-writing/blob/68ba335cbe35c877775f092e98177b60da5f3d95/docs/sentence/compactness.mdx) · [제목 쓰기](https://github.com/toss/technical-writing/blob/68ba335cbe35c877775f092e98177b60da5f3d95/docs/architecture/heading.mdx) | 내용을 바로 알 수 있는 제목, 번역투·반복 안내·추상적인 표어 정리 |

## 색

| 용도 | 색 |
| --- | --- |
| 페이지 바탕 | `#f2f4f7` |
| 카드·읽는 영역 | `#ffffff` |
| 보조 배경 | `#f7f9fb` |
| 제목·주요 글자 | `#1f2328` |
| 본문 | `#454e58` |
| 보조 설명 | `#656d76` |
| 경계선 | `#d1d9e0` |
| 링크·재생 제어 경로 | `#0969da` |
| 영상 전송 경로 | `#cf222e` |
| 파일 사전 배치 경로 | `#9a6700` |

색상과 레이아웃 규칙은 `src/styles/styles.css`의 변수와 `src/styles/site-theme.css`에 모았습니다. 기술·회사 로고는 각 원본 색을 유지하고, 직접 그린 표지와 서버·기능 아이콘은 같은 중립색으로 맞췄습니다. 연결선은 색과 함께 선의 굵기·점선·범례로 구분합니다.

## 구성과 문구

- 메인은 소개 한 문단과 서비스 카드로 구성합니다. 카드에서는 서비스 이름·주제·기술·이동 버튼을 보여줍니다.
- 영어로 붙인 장식 표제와 `CASE 001` 같은 번호를 없앴습니다. 메뉴는 ‘전달 구조’, ‘서버 내부’, ‘기술 설명’, ‘대체 기술’로 통일합니다.
- 제품명·표준·설정 지시어·HTTP 응답은 원래 이름을 씁니다. 일반 설명과 동작 안내는 한국어로 씁니다.
- 기술 상세와 9단계 구성도, 기술별 교체 관계는 유지합니다. 표어와 반복 안내를 줄이고 기술 설명을 읽는 공간을 확보합니다.
- 도식과 카드의 작은 글자, 좁은 화면의 줄바꿈, 상세 창, 화면 전환은 실제 브라우저로 확인합니다.

## 가독성과 동작 구분

버튼·링크·설명창은 [W3C 버튼 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/button/), [링크 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/link/), [모달 대화상자 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)을 확인했습니다. 직접 읽은 공식 원문은 [버튼](https://github.com/w3c/aria-practices/blob/main/content/patterns/button/button-pattern.html)·[링크](https://github.com/w3c/aria-practices/blob/main/content/patterns/link/link-pattern.html)·[대화상자](https://github.com/w3c/aria-practices/blob/main/content/patterns/dialog-modal/dialog-modal-pattern.html)입니다.

[WCAG 구성 요소 대비 설명](https://github.com/w3c/wcag/blob/main/understanding/21/non-text-contrast.html)은 조작 가능한 요소와 선택 상태를 식별하는 데 참고했습니다. 아래 글자 크기는 이 사이트에서 정한 값이며, W3C가 지정한 최소 글자 크기라는 뜻은 아닙니다.

| 동작 | 화면에서의 표시 |
| --- | --- |
| 설명창 열기 | 창 모양 아이콘, ‘설명창 열기’ 버튼, `aria-haspopup="dialog"` |
| 서비스 페이지로 이동 | ‘설계 페이지 보기’와 오른쪽 화살표 |
| 본문 안에서 이동 | 밑줄, ‘이동’ 문구와 위·아래 화살표 |
| 대체 목록으로 이동 | 테두리·배경이 있는 버튼과 아래 화살표 |
| 외부 문서 열기 | ‘새 탭 ↗’ 표시 |
| 계층·주제 선택 | 선택 배경·테두리와 ‘선택됨’ 표시 |
| 접힌 자료 펼치기 | ‘펼치기 +’·‘접기 −’ 표시 |
| 참고 이미지 확대 | 이미지 위의 ‘이미지 확대’ 버튼 |

- 8~11px로 남아 있던 보조 글자를 12px 이상으로 맞췄습니다. 조작 버튼은 주로 13px·높이 40px 이상, 오른쪽 설명은 14px로 표시합니다.
- 데스크톱 오른쪽 패널은 화면 폭에 따라 360~410px입니다. 주요 설명창 버튼과 본문 이동 링크를 설명의 내부 스크롤 영역 밖에 배치합니다.
- 페이지 바탕·도식·흰색 읽기 영역의 밝기를 구분합니다. 조작 버튼은 장식용 경계선보다 선명한 테두리와 반응을 표시합니다.
- 설명창의 열기·닫기와 포커스 복원, 본문 이동, 이미지 확대의 마우스·키보드 동작을 브라우저에서 확인합니다.

## 용어 설명 토글

[W3C 스위치 패턴 원문](https://github.com/w3c/aria-practices/blob/main/content/patterns/switch/switch-pattern.html)을 확인했습니다. 스위치의 이름은 ‘용어 설명’으로 유지하고 `aria-checked`로 켜짐을 표시합니다. 마우스와 Space·Enter로 조작할 수 있습니다.

화면 위·기술 글 옆·상세 창의 토글은 같은 설정을 사용합니다. 켜면 용어에 물음표와 점선 밑줄을 붙이고, 누르면 뜻·예시를 작은 설명창으로 보여줍니다. 한 문단에서 같은 용어를 반복 표시하지 않으며, 링크·버튼·설정 코드·SVG 안에는 설명 버튼을 넣지 않습니다. 끄면 추가 표시를 걷어냅니다.

용어 설명은 Chrome의 Popover API를 사용하고, 상세 모달 안에서도 접근할 수 있도록 해당 모달 안에서 엽니다. Escape로 용어 설명을 닫은 뒤 원래 용어로 포커스를 돌려줍니다. 화면 폭에 맞춰 위치를 조절하며 브라우저 저장소를 쓸 수 없어도 현재 방문에서는 동작합니다.

## React 컴포넌트 디자인 검토

현재 디자인 규칙을 유지한 채 Ladle 작업대에서 오른쪽 설명 패널·HTTP 조건별 흐름·ABR 시간 비교·현재 기술과 대체 기술 카드를 확인합니다. 실제 서비스에서 쓰는 컴포넌트를 그대로 가져오므로 별도 목업과 화면 코드가 갈라지지 않습니다. `npm run design`으로 실행하며 세부 구성은 [React 전환 문서](react-port.md)에 기록했습니다.

추가 움직임은 Motion으로 구현했습니다. 패널과 조건 변경의 짧은 등장, 다운로드 시간 막대 등 상태 변화를 이해하는 데 사용하고 기본 View Transition을 유지합니다. 모션 감소 설정에서는 이동을 생략합니다.
