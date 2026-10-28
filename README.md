# 아키텍처 노트

**어떤 기술을 어디에, 왜 쓰는지 함께 공부하고 정리하는 웹사이트입니다.**

공개된 서비스 아키텍처를 따라가며 기술의 역할, 필요한 이유, 얻는 것과 감수할 점, 대체할 수 있는 기술을 살펴봅니다. 첫 번째 사례는 **넷플릭스의 영상 전달과 Open Connect**입니다.

[화면 미리보기](docs/images/netflix-detail.png) · [다운로드용 HTML](openconnect-visual-study.html)

## 함께 만들어요

새로운 사례 제안부터 설명 한 문장 수정까지 환영합니다.

- 이해하기 어려운 설명이나 잘못된 내용을 알려주세요.
- 관심 있는 회사의 아키텍처나 기술을 제안해주세요.
- 공식 자료를 바탕으로 기술 설명·사용 예·대안을 보완해주세요.
- 흐름도, 디자인, 접근성과 사용성을 함께 개선해주세요.

[이슈](https://github.com/LeeJams/architecture/issues)로 의견을 남기거나 작은 수정부터 PR을 보내주세요. 코드 없이 자료 링크나 질문만 남겨주셔도 좋습니다. 기술 설명에는 출처를 함께 적고, 실제 사용이 확인된 내용과 학습용 예시를 구분해주세요.

## 로컬에서 실행하기

Node.js 20.19 이상이 필요합니다. React + Vite로 만들었습니다.

```sh
git clone https://github.com/LeeJams/architecture.git
cd architecture
npm ci
npm run dev
```

브라우저에서 `http://127.0.0.1:5173`을 엽니다.

## 수정할 곳과 확인 방법

- `src/data/` — 아키텍처·기술 설명, 필요한 이유, 대안과 출처
- `src/components/` · `src/styles/` — 화면, 상호작용과 스타일
- `assets/` — 기술 로고·이미지·서체

`npm run design`으로 컴포넌트를 따로 확인할 수 있습니다. 화면을 바꿨다면 모바일과 키보드 조작도 살펴봐주세요.

```sh
npx playwright install chromium  # 브라우저 검사 최초 준비
npm test                        # 빌드와 브라우저 검사
```

`npm run build`는 웹 배포용 `dist/`와 설치 없이 여는 `openconnect-visual-study.html`을 생성합니다. 앱을 수정했다면 갱신된 HTML도 함께 커밋해주세요.

[자료와 설명 범위](SOURCES.md) · [이미지·서체 라이선스](THIRD_PARTY_NOTICES.md) · [React 구성](docs/react-port.md)
