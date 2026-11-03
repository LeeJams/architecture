# 기여 안내

자료를 찾아 정리하는 일, 이해하기 어려운 설명을 고치는 일, 화면을 개선하는 일 모두 이 프로젝트에 도움이 됩니다.

## 질문과 제안

[이슈](https://github.com/LeeJams/architecture/issues)에 읽다가 막힌 부분이나 추가로 알고 싶은 내용을 남겨주세요. 관련 화면과 문장, 참고한 자료 링크가 있으면 함께 적어주세요. 새로운 회사의 사례를 제안할 때는 아키텍처를 확인할 수 있는 공개 자료도 알려주세요.

## 설명을 보완할 때

- **문제와 필요성부터 설명합니다.** 어떤 상황에서 필요해지는지, 동작이 어떻게 달라지는지, 무엇을 얻고 감수하는지 연결해주세요.
- **근거를 남깁니다.** 공식 문서나 공개된 기술 자료를 연결하고, 확인된 사실과 학습용 예시를 구분해주세요. 사례에서 사용한 제품이 불분명하면 그 범위도 표시해주세요.
- **사용처와 대체 범위를 구체적으로 적습니다.** 어느 회사의 어떤 기술인지, 어디에 연결하는지, 기존의 어떤 역할을 바꾸는지 설명해주세요.
- **한국어로 풀어 씁니다.** 제품 이름은 정확히 표기하고, 생소한 용어에는 뜻이나 예시를 덧붙여주세요.

## 수정할 곳

| 수정할 내용 | 위치 |
| --- | --- |
| 기술 정의·사용처·예제·출처 | `src/data/technology-catalogue.js`, `src/data/technology-profiles.js` |
| 새 언어·웹·서버·모바일·데이터·운영 기술 | `src/data/technologies/` |
| 기술이 필요한 이유·도입 효과와 조건 | `src/data/technology-rationales.js` |
| 체험형 웹 기술의 정의·필요성·예제 | `src/data/interactive-web-technologies.js` |
| 산사의 행동별 흐름·근거·비교 프로젝트 | `src/data/interactive-services.js` |
| 서비스별 영역·파트·사용 기술·처리 방식·근거 | `src/data/service-stacks.js` |
| 아키텍처와 기술별 흐름·설명 | `src/data/architecture.js`, `src/data/technology-notes.js`, `src/data/technology-depth.js` |
| 대체 관계·용어 풀이 | `src/data/alternatives.js`, `src/data/glossary.js` |
| 화면·상호작용·스타일 | `src/components/`, `src/styles/` |
| 기술 로고·이미지·서체 | `assets/` |

로고는 해당 제품의 정확한 원본을 사용하고 출처와 라이선스를 확인해주세요. 이미지·서체 고지는 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), 확인한 자료는 [SOURCES.md](SOURCES.md)에 정리합니다.

## 기술 추가하기

처음이라면 설명 한 문장이나 출처 하나를 보태는 PR부터 보내셔도 좋습니다. 새 기술은 [작성 틀](docs/templates/technology-profile.js)을 복사해 아래 파일의 배열에 추가해주세요. 각 항목은 일반 JavaScript 객체이며 공용 카드와 상세 창이 같은 데이터를 사용합니다.

| 분야 | 파일 |
| --- | --- |
| 언어 | `src/data/technologies/languages.js` |
| 웹 UI·웹 앱 | `src/data/technologies/web.js` |
| 서버·모바일 프레임워크 | `src/data/technologies/applications.js` |
| DB·검색 | `src/data/technologies/data-platform.js` |
| 실행 환경·메시징·관측·운영·개발 도구·API | `src/data/technologies/infrastructure.js` |

1. 기존 기술과 ID가 겹치지 않는지 확인하고 `category`에는 `technologyCategories`에 등록된 ID를 씁니다. 새 분류라면 분류 이름과 설명도 함께 추가합니다.
2. **필요한 이유·사용 상황·핵심 개념·처리 순서·실제 도입 조건·진단 방법**을 구체적으로 적습니다. 예제에는 필요한 환경과 생략한 부분을 밝힙니다. 작성 틀의 안내 문구는 실제 설명으로 바꿔주세요.
3. 공식 문서·사양·구현 원문을 읽고 `sources`에 제목·URL·확인 범위를 남깁니다. 특정 회사의 사용 근거와 일반 기술 설명을 구분합니다.
4. 심벌은 원본과 라이선스를 확인해 `assets/tech/<id>.svg`로 저장하고 `image`에 같은 ID를 적습니다. 이 이름은 자동 등록됩니다. 공통 브랜드 심벌이면 `logoScope: "brand"`와 실제 표시 범위를 명시합니다. 적절한 이미지가 없다면 다른 제품의 로고를 대신 쓰지 말고 그 사실을 이슈에 남겨주세요.
5. 새 원문·이미지의 URL·바이트 수·SHA-256을 `docs/research/technology-catalogue-100-sources.json`에 추가하고 필요한 외부 자료 고지를 보완합니다. `related`에는 등록된 기술의 ID만 씁니다.

```sh
npm run catalogue:check  # 필수 내용·분류·관련 ID·이미지 경로·원본 해시 확인
npm run dev             # 검색·카드·공용 상세 창 확인
```

기술을 늘릴 때 개수를 고정한 테스트를 수정할 필요는 없습니다. `npm test`는 전체 데이터에 맞춰 분류와 상세 창을 확인합니다. 서비스 사례의 실제 사용 목록은 이 기술 목록과 별도이므로, 사용을 확인한 자료가 있을 때 해당 사례도 보완해주세요.

## 변경 확인하기

로컬 실행은 [README](README.md#실행하기)를 참고해주세요.

```sh
npm run design                  # Ladle에서 컴포넌트 확인
npx playwright install chromium # 브라우저 검사 최초 준비
npm test                        # 프로덕션 빌드와 브라우저 검사
```

앱의 코드나 콘텐츠를 바꿨다면 모바일 배치, 키보드 조작, 긴 설명의 스크롤도 확인해주세요. 새로 추가한 한글이 깨지지 않는지도 살펴봐주세요. 시스템에 Chromium이 있으면 검사는 해당 브라우저를 사용합니다.

`npm run build`는 웹 배포용 `dist/`와 내려받아 여는 `openconnect-visual-study.html`을 생성합니다. `npm test`에도 같은 빌드 과정이 포함되어 있습니다. 앱을 수정했다면 갱신된 HTML도 함께 커밋해주세요.

## PR 보내기

무엇을 왜 바꿨는지, 근거로 본 자료와 확인한 내용을 간단히 적어주세요. 화면을 바꿨다면 스크린샷이나 재현 방법을 함께 적어주시면 검토에 도움이 됩니다. 오탈자나 문장 하나를 고치는 작은 PR도 좋습니다.
