# 아키텍처 노트

실제 서비스의 아키텍처를 따라가며 **어떤 기술을 어디에, 왜 쓰는지** 살펴보는 인터랙티브 웹사이트입니다. 기술의 이름을 아는 것에서 더 나아가, 문제와 제약에 맞는 선택을 이해하는 데 목적을 둡니다.

**React + Vite**로 구성하고, Motion은 전환과 상태 변화를, Ladle은 컴포넌트 디자인 검토를 맡깁니다. 기존의 한국어 설명·중립색·기술 로고와 Chrome 기본 화면 전환을 유지합니다.

첫 번째 사례는 **「넷플릭스, 재생 버튼 뒤의 설계」**입니다. Open Connect를 중심으로 재생 정보가 오가는 경로, 실제 영상이 전달되는 경로, 시청 전에 콘텐츠를 준비하는 과정을 구분해 보여줍니다.

![서비스 카드 목록](docs/images/library.png)

[모바일 화면 보기](docs/images/library-mobile.png)

## 화면과 문구

한국어 독자를 기준으로 메뉴·표제·설명을 정리했습니다. 옅은 회색 페이지 바탕과 흰색 읽기 영역, 짙은 회색 글자를 기본으로 쓰고, 파랑은 링크와 제어 경로, 빨강은 영상 경로, 황갈색 점선은 사전 배치를 표시합니다. 기술·회사 로고는 원래 색을 유지합니다.

[확인한 웹 레퍼런스와 적용 범위](docs/design-references.md): GitHub Primer의 밝은 테마, 토스 es-toolkit의 한국어 문서, 토스 테크니컬 라이팅 가이드, W3C 버튼·링크·대화상자 패턴.

보조 글자는 12px 이상, 주요 버튼은 13px·높이 40px 이상으로 표시합니다. **대체 목록으로 이동**은 테두리와 배경이 있는 버튼으로 표시합니다. 설명창 열기, 페이지 이동, 본문 이동, 외부 문서 열기를 아이콘과 문구로 구분합니다.

## 살펴볼 수 있는 것

- **용어 설명 토글:** 화면 위·기술 글 옆·기술 상세 창에서 켜고 끌 수 있습니다. 켜면 물음표가 붙은 용어를 눌러 쉬운 뜻과 예시를 봅니다. 비트레이트·버퍼·CDN·ABR 등 43개 용어를 설명하고 켜짐 설정을 저장합니다.
- **카드 목록 → 상세 화면:** Chrome의 기본 View Transition API로 카드 배경·표지·제목을 연결합니다. 목록 복귀와 브라우저 뒤로/앞으로 이동을 지원합니다.
- **데이터 흐름:** 요청·응답은 파랑, 영상 전송은 빨강, 콘텐츠 배치는 황갈색 점선으로 구분합니다. 파일 준비부터 다음 구간 요청까지 9단계를 따라가며 요청 주체·데이터·처리 기술을 확인합니다.
- **오른쪽 상세 패널:** 역할과 흐름·구성 기술 두 탭으로 탐색합니다. 데스크톱 패널을 360~410px로 두고 설명을 14px로 표시합니다. 창 아이콘이 붙은 구성 기술이나 **기술 설명창 열기** 버튼은 이 화면 위에 상세 창을 엽니다. **본문의 전체 설명으로 이동**은 페이지 아래의 글로 이동합니다.
- **무엇을 무엇으로 대체하는지:** 본문 아래에서 현재 기술 → 대체 기술을 양쪽 이름·회사·로고로 직접 연결합니다. 4개 현재 기술의 9개 대체 관계를 선택하고, 대체 위치·범위와 함께 연결할 기존 역할을 확인합니다.
- **서버 내부 탐색:** 저장장치·NGINX·FreeBSD 계층을 선택하면 파일·요청·커널·네트워크의 처리 순서를 볼 수 있습니다.
- **기술 상세 읽기:** 기술 6개와 재생·서버 선택의 설계 2개를 문제 → 동작 원리 → 예제 → 대안 → 검증 지표 순서로 읽습니다. 기술 로고와 단계별 흐름을 함께 표시합니다.
- **계산하며 이해하기:** 동시 시청자·비트레이트에 따른 전달 용량과, 네트워크 처리량에 따른 구간 수신 시간·다음 화질 후보를 값을 바꿔 살펴봅니다.
- **기본 접근성:** 키보드 선택, 탭 이동, 포커스 복원, 모션 감소 설정을 지원합니다. View Transition API가 없는 환경에서는 즉시 화면을 전환합니다.

![넷플릭스 Open Connect 상세 화면](docs/images/netflix-detail.png)

[오른쪽 설명 패널](docs/images/inspector-panel.png) · [구성 기술과 설명창 열기](docs/images/inspector-stack.png)

왼쪽의 9단계를 선택하면 오른쪽 역할과 흐름 탭에 요청 주체, 전달 데이터, 처리 순서와 설명용 요청·응답이 표시됩니다. 구성 기술을 누르면 원리와 예제를 크게 읽을 수 있습니다. **대체 목록으로 이동**를 누르면 선택한 현재 기술의 대체 관계로 이동합니다.

| 대체할 현재 기술 | 대체에 쓸 기술 | 대체하는 범위 |
| --- | --- | --- |
| Open Connect / Netflix | Amazon CloudFront / AWS · Fastly CDN / Fastly · Cloudflare CDN / Cloudflare | 영상 전달망과 운영 방식 |
| NGINX / F5·NGINX Open Source | Caddy / ZeroSSL·HID Global · Apache HTTP Server / Apache Software Foundation | OCA 내부 HTTP 파일 응답 서버 |
| FreeBSD / FreeBSD Project | Ubuntu Server / Canonical · Debian / Debian Project | 서버 OS와 I/O 기반 |
| AWS의 재생 제어 실행 환경 | Google Cloud / Google · Azure / Microsoft | 재생 제어 API의 실행·배포·연결 환경 |

현재 원본 저장소 제품은 특정되지 않았으므로 S3·Cloud Storage는 위 대체 관계에 넣지 않고, 별도의 **구현 예시 2개**로 구분합니다.

![회사·제품별 대안 기술](docs/images/alternative-technologies.png)

각 카드와 [대체 관계 상세 창](docs/images/replacement-detail.png)은 **대체 대상 → 이 기술로 대체**를 먼저 보여주고, 해당 계층·범위·기존 역할에 이어 대체 기술의 동작과 제공 조직을 설명합니다.

![선택한 서버 계층의 내부 동작](docs/images/appliance-detail.png)

## 어려운 용어 확인하기

**용어 설명** 토글을 켜면 점선 밑줄과 물음표가 붙습니다. 용어를 누르면 같은 화면에 뜻·예시가 열립니다. 닫기 버튼이나 Escape로 닫을 수 있으며, 상세 창 안에서는 먼저 용어 도움말만 닫습니다.

![비트레이트 용어 설명](docs/images/glossary-help.png)

[모바일 도움말 화면](docs/images/glossary-mobile.png)

## 기술을 깊게 읽기

구성도의 상세 설명에서 **기술 설명창 열기**를 누르거나, 본문의 **03 기술 설명**에서 주제를 선택하세요. 각 글의 주소를 직접 공유할 수 있습니다. 예를 들어 `?case=netflix#tech-nginx`는 NGINX 글을 바로 엽니다.

![구성 기술의 넓은 상세 설명 창](docs/images/technology-sheet.png)

| 주제 | 상세 내용 |
| --- | --- |
| OCA | 전송 Gb/s와 디스크 GB/s의 차이, 페이지 적중, TLS·NIC 병목, 피크·장애 용량 |
| AWS와 재생 제어 | API 요청·응답 규칙, 의존 서비스의 제한 시간, p99 해석, 신규·기존 재생의 장애 범위 |
| FreeBSD | sendfile의 sbytes·EAGAIN, kqueue 준비 상태, KTLS 연결 협상·SW·NIC 모드 |
| NGINX | 연결·FD 한도, 메모리 적중·저장장치 읽기, Linux·FreeBSD의 AIO 조건, 정적 응답 로그 해석 |
| HTTP(S) | 206·416·If-Range 불일치의 200, 강한 ETag, 미디어 구간과 바이트 범위의 차이 |
| 콘텐츠 배치 | 검증 후 게시·파일 보유 목록, 캐시 키와 권한, no-cache/no-store, 바이트 적중률 |
| 플레이어·ABR | 구간 수신 시간·버퍼·재버퍼링 계산, 표현 전환, 디코더 병목 |
| 서버 선택 | 후보 필터·정보 신선도, 오류별 재시도 판단, 버퍼 안의 복구 시간 예산 |

각 상세는 **핵심 원리 → 조건별 흐름 → 관측·진단**으로 읽습니다. 조건 버튼을 누르면 로고가 있는 데이터 경로와 요청·응답, 해석이 함께 바뀝니다. 핵심 주장 옆에는 확인한 공식 문서 링크를 두고, 일반 기술 원리와 설계·계산 예제를 표시합니다. 본문과 상세 창은 같은 원고·렌더러를 사용합니다.

![If-Range 버전 불일치와 전체 응답](docs/images/http-range-detail.png)

대안 상세에는 **교체할 때 이어야 할 동작**을 추가했습니다. 예를 들어 NGINX → Caddy는 실제 Caddyfile, URI prefix 유지, Range·ETag 재검증을 설명합니다. FreeBSD → Linux는 이벤트·AIO·서비스 한도, CDN 교체는 원본·캐시 키·권한·재생 URL의 연결을 다룹니다.

![NGINX에서 Caddy로 교체할 때의 설정과 검증](docs/images/replacement-contract.png)

실행 가능한 [HTTP 파일 전송 실습](examples/file-delivery/README.md)도 제공합니다. 실제 NGINX에서 7가지 요청의 상태·헤더·본문 바이트를 검사합니다.

```sh
python3 scripts/verify-delivery-lab.py --nginx nginx
```

이 실습은 NGINX 실행 파일이 필요합니다. 루프백 임시 서버를 사용하고 종료 시 정리합니다. 서버 성능·FreeBSD KTLS·Netflix 장비를 재현하는 시험은 아닙니다.

예제 설정·API 응답·수치는 학습용이며 Netflix의 실제 내부 설정이나 알고리즘을 뜻하지 않습니다. 확인한 문서와 추가 읽기 자료의 접근 범위는 각 글 하단에 표시합니다.

## 바로 열어보기

[`openconnect-visual-study.html`](openconnect-visual-study.html)을 다운로드해 Chrome에서 여세요. CSS, JavaScript, 이미지, 아이콘과 서체가 포함된 단일 파일로, 설치나 외부 이미지 서버 없이 동작합니다.

메인에서 넷플릭스 카드를 선택하면 상세 화면이 열립니다. 구성도의 노드나 기술 배지에서 상세 글로 이동하고, 글에서는 해당 역할의 구성도로 돌아갈 수 있습니다. 기술 요약 카드와 참고 도식은 접을 수 있는 자료에 모았습니다.

## 로컬 개발

**Node.js 20.19 이상**이 필요합니다. 소스 화면은 Vite에서 실행합니다.

```sh
git clone https://github.com/LeeJams/architecture.git
cd architecture
npm ci
npm run dev
```

브라우저에서 `http://127.0.0.1:5173`을 엽니다. 빌드 결과를 확인할 때는 `npm run build` 다음 `npm run preview`를 실행하고 `http://127.0.0.1:4173`에 접속합니다. 정적 호스팅에는 `dist/`를 배포합니다.

## 디자인 작업대와 애니메이션

```sh
npm run design
```

`http://127.0.0.1:61000`에서 **Ladle** 작업대를 엽니다. 오른쪽 패널의 역할/기술 탭과 선택 기술, HTTP 조건별 흐름, 화질 계산기, 현재 → 대체 기술 카드를 개별 화면에서 조작할 수 있습니다. 작업대의 Controls에서 패널·제품을 바꾸고, 브라우저 폭을 줄여 반응형 배치를 확인합니다. `npm run design:build`는 작업대의 정적 결과를 `build/`에 만듭니다.

![Ladle에서 오른쪽 패널 검토](docs/images/react-design-workbench.png)

**Motion**은 단계 버튼의 눌림, 설명 패널·조건별 예제·서버 계층의 내용 전환, 대체 카드와 상세 창의 등장에만 적용했습니다. 화질 예제에는 **4초 구간의 재생 시간과 다운로드 시간 비교**를 추가해, 처리량을 바꿀 때 버퍼가 줄어드는 이유를 확인할 수 있습니다. 운영체제의 모션 감소 설정을 따릅니다. 카드에서 상세로의 이동은 기존 Chrome View Transition API를 사용합니다.

![다운로드와 재생 시간 비교](docs/images/react-playback-timing.png)

[모바일 계산 예제](docs/images/react-playback-mobile.png)

런타임 의존성은 `react`, `react-dom`, `motion` 세 개입니다. Ladle·Vite·Playwright는 개발 도구이며 서비스 화면에 포함되지 않습니다. [컴포넌트 구조와 도구 선택](docs/react-port.md)을 정리했습니다.

| 경로 | 역할 |
| --- | --- |
| `src/App.jsx` · `src/main.jsx` | React 진입점·공통 화면·설정 제공 |
| `src/state/AppState.jsx` | URL·선택 노드·9단계 재생·상세 창·대체 필터 상태 |
| `src/components/Explorer.jsx` · `Diagram.jsx` | 구성도·오른쪽 패널·경로 강조 |
| `src/components/TechnicalDepth.jsx` | 본문과 상세 창이 공유하는 원리·조건별 흐름·진단 |
| `src/components/TechnologyReader.jsx` | 주제 탭·기술 글·계산기 |
| `src/components/TechnologyDialog.jsx` | 기본 dialog와 기술·대체 제품 상세 |
| `src/components/Alternatives.jsx` · `Anatomy.jsx` | 교체 범위·양쪽 로고·서버 계층 |
| `src/components/Glossary.jsx` | React 용어 표시·43개 설명·토글·기본 Popover |
| `src/data/` | 기술 원고·예제·출처·대체 관계·회사 정보 |
| `src/styles/` · `src/interaction.css` | 기존 색상·글자·반응형·명확한 버튼·추가 상호작용 |
| `src/components/Architecture.stories.jsx` · `.ladle/` | 디자인 검토 시나리오·작업대 설정 |
| `assets/` | 자체 도식·원본 기술 로고·참고 이미지·서체와 고지 |
| `scripts/` | React 오프라인 HTML 생성·브라우저 검증 |
| `examples/file-delivery/` | 실제 실행 검증한 NGINX 설정·실습 안내 |

## 웹 빌드와 단일 HTML 만들기

```sh
npm run build
```

웹용 `dist/`와 다운로드용 `openconnect-visual-study.html`을 함께 갱신합니다. 웹용 빌드는 React·Motion·서비스 코드를 나눠 캐시하고 큰 참고 이미지를 필요할 때 읽습니다. 단일 HTML은 같은 React 소스를 별도로 빌드해 코드·스타일·이미지·서체·라이선스를 포함합니다. 네트워크 없이도 계산·용어 설명·상세 창이 동작합니다. 생성 파일도 소스와 함께 커밋합니다.

포함된 WOFF 서체는 현재 콘텐츠에 필요한 글리프를 추린 파일입니다. 새로운 문자를 추가할 때는 서체 범위와 대체 서체에서의 배치도 확인해야 합니다.

## 검증

```sh
npm ci
npx playwright install chromium
npm test
```

`npm test`는 프로덕션 빌드와 단일 HTML을 만든 뒤 임시 로컬 서버를 자동으로 시작하고 검증이 끝나면 종료합니다. 결과는 Git에서 제외된 `reports/`에 저장됩니다.

- `verify-ui.cjs`: 320~2560px의 **19개 화면 폭·1,026개 상태**에서 목록·상세·8개 기술 글·9단계 흐름·상세 dialog·대안 카드·서버 내부 계층·요약 카드·참고 자료의 배치, 텍스트 넘침, SVG 라벨 겹침, 이미지와 JavaScript 오류를 확인합니다. 노드·기술 선택, 흐름 재생, 키보드와 이미지 확대도 검사합니다.
- `verify-navigation.cjs`: 실제 View Transition의 준비·완료, 카드 열기·복귀, 뒤로/앞으로, 스크롤·포커스 복원, 빠른 취소, 상세 주소 직접 열기, 모션 감소 및 API 미지원 처리를 확인합니다.
- `verify-technology.cjs`: 기술 글의 직접 링크·새로고침·키보드·구성도 연결, 용량 계산의 잘못된 입력, 저속 네트워크에서의 화질 후보, 좁은 화면의 표·코드 스크롤과 단일 HTML의 오프라인 실행을 검사합니다.
- `verify-explorer.cjs`: 두 탭·9단계 흐름, 기술 상세 dialog의 포커스·닫기·맥락 유지, 9개 대체 관계의 양쪽 기술·범위·제공 조직, 구성도 위치 연결과 구현 예시의 분리를 검사합니다.
- `verify-depth.cjs`: 본문·상세 창의 원고 일치, 조건별 HTTP 응답, 버퍼·재버퍼링 계산, 키보드 탐색, 3개 폭의 54개 상세 흐름 상태와 교체 계약을 검사합니다. 화면의 NGINX 설정과 실제 실습 설정이 일치하는지도 확인합니다.
- `verify-interactions.cjs`: 속도를 바꿀 때 시간 막대가 같은 기준으로 비교되는지, 모션 감소 설정·계산기 값 보존·기본 모달 즉시 재열기가 동작하는지 검사합니다.
- `verify-delivery-lab.py`: `npm test`와 별도로 실행합니다. 실제 NGINX에서 일반 GET·정상/suffix/초과 범위·If-Range 일치/불일치·404를 확인합니다.
- `verify-glossary.cjs`: 토글의 키보드·설정 저장, 본문과 상세 창의 동적 용어 표시, 원문·코드 보존, 도움말 위치·포커스·닫기, 저장소 제한과 오프라인 실행을 검사합니다.

시스템에 `/usr/bin/chromium`이 있으면 이를 사용하고, 없으면 Playwright가 설치한 브라우저를 사용합니다. 다른 실행 파일은 `ATLAS_CHROMIUM_EXECUTABLE` 환경 변수로 지정할 수 있습니다.

검증 결과는 해당 Chromium과 화면 조건에서의 결과이며 모든 브라우저·기기 설정에 대한 보증은 아닙니다.

## 콘텐츠의 범위와 출처

구성도는 공개된 설계를 읽기 위한 **기능 단위의 설명용 재구성**입니다. Netflix의 현재 내부 전체 구성, 정확한 물리 배치, 특정 소프트웨어 버전이나 모든 장애 복구 절차를 재현하지 않습니다. 대안 비교는 학습을 위한 제안이며 Netflix의 실제 전환 계획을 뜻하지 않습니다.

원문, 참고 도식, 확인이 남은 범위는 [SOURCES.md](SOURCES.md)에 정리했습니다. 외부 이미지·아이콘·서체에는 서로 다른 라이선스가 적용되므로 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)와 함께 확인하세요.
