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
| 기술이 필요한 이유·도입 효과와 조건 | `src/data/technology-rationales.js` |
| 아키텍처와 기술별 흐름·설명 | `src/data/architecture.js`, `src/data/technology-notes.js`, `src/data/technology-depth.js` |
| 대체 관계·용어 풀이 | `src/data/alternatives.js`, `src/data/glossary.js` |
| 화면·상호작용·스타일 | `src/components/`, `src/styles/` |
| 기술 로고·이미지·서체 | `assets/` |

로고는 해당 제품의 정확한 원본을 사용하고 출처와 라이선스를 확인해주세요. 이미지·서체 고지는 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), 확인한 자료는 [SOURCES.md](SOURCES.md)에 정리합니다.

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
