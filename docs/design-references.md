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
| 기본 배경 | `#ffffff` |
| 보조 배경 | `#f6f8fa` |
| 제목·주요 글자 | `#1f2328` |
| 본문 | `#454e58` |
| 보조 설명 | `#656d76` |
| 경계선 | `#d1d9e0` |
| 링크·재생 제어 경로 | `#0969da` |
| 영상 전송 경로 | `#cf222e` |
| 파일 사전 배치 경로 | `#9a6700` |

색상과 레이아웃 규칙은 `styles.css`의 변수와 `site-theme.css`에 모았습니다. 기술·회사 로고는 각 원본 색을 유지하고, 직접 그린 표지와 서버·기능 아이콘은 같은 중립색으로 맞췄습니다. 연결선은 색과 함께 선의 굵기·점선·범례로 구분합니다.

## 구성과 문구

- 메인은 소개 한 문단과 서비스 카드로 구성합니다. 카드에서는 서비스 이름·주제·기술·이동 버튼을 보여줍니다.
- 영어로 붙인 장식 표제와 `CASE 001` 같은 번호를 없앴습니다. 메뉴는 ‘전달 구조’, ‘서버 내부’, ‘기술 설명’, ‘대체 기술’로 통일합니다.
- 제품명·표준·설정 지시어·HTTP 응답은 원래 이름을 씁니다. 일반 설명과 동작 안내는 한국어로 씁니다.
- 기술 상세와 9단계 구성도, 기술별 교체 관계는 유지합니다. 표어와 반복 안내를 줄이고 기술 설명을 읽는 공간을 확보합니다.
- 도식과 카드의 작은 글자, 좁은 화면의 줄바꿈, 상세 창, 화면 전환은 실제 브라우저로 확인합니다.
