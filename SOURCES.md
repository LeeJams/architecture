# 출처와 설명 범위

이 문서는 사례의 근거, 시각 표현 참고 자료, 학습을 위한 재구성을 구분합니다.

화면 색과 한국어 문구를 수정할 때 확인한 웹 레퍼런스는 [화면과 한국어 문구](docs/design-references.md)에 기록했습니다. GitHub Primer의 색상 토큰, 토스 es-toolkit의 한국어 문서, 토스 테크니컬 라이팅 가이드의 확인한 원문과 적용 범위를 연결합니다.

## 아키텍처와 기술

| 자료 | 사용하는 범위 |
| --- | --- |
| [Netflix Open Connect](https://openconnect.netflix.com/en/) | 전용 전달망, OCA와 영상 전달의 개요 |
| [Open Connect Overview](https://openconnect.netflix.com/Open-Connect-Overview.pdf) | 제어·전달·콘텐츠 배치 구조를 검증할 원문 |
| [Open Connect Appliances](https://openconnect.netflix.com/en/appliances/) | 장비와 공개된 OCA 소프트웨어 구성 |
| [FreeBSD Handbook](https://docs.freebsd.org/en/books/handbook/) | 운영체제와 스토리지·네트워크 기능의 일반적인 설명 |
| [NGINX Documentation](https://nginx.org/en/docs/) | HTTP 요청 처리와 파일 응답의 일반적인 설명 |
| [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) | HTTP 요청·응답과 전송 프로토콜 개념 |

제작 환경에서는 Netflix 공식 사이트와 PDF의 직접 접근이 제한되어 원문 재확인이 남아 있습니다. FreeBSD·NGINX는 공개된 OCA 설명에 등장하는 계층으로 표시했으며, 특정 버전이나 현재 모든 구현을 확정하지 않습니다. GitHub에서 확인한 최신 FreeBSD Handbook의 회사 사례 목록만으로 Netflix의 사용을 검증했다고 주장하지 않습니다.

## 기술 상세 글의 근거

공식 문서 사이트의 직접 접근이 제한된 경우 아래 공식 GitHub 저장소의 문서 원문을 확인했습니다. 일반 기능의 설명을 Netflix의 특정 버전·설정·알고리즘에 대한 증거로 확장하지 않습니다.

| 확인한 원문 | 설명하는 범위 |
| --- | --- |
| [NGINX Beginner’s Guide](https://github.com/nginx/nginx.org/blob/master/xml/en/docs/beginners_guide.xml) | master·worker, 정적 파일 응답 |
| [NGINX connection processing methods](https://github.com/nginx/nginx.org/blob/master/xml/en/docs/events.xml) | OS에 따른 kqueue·epoll |
| [NGINX HTTP core](https://github.com/nginx/nginx.org/blob/master/xml/en/docs/http/ngx_http_core_module.xml) | root·try_files·sendfile·aio의 역할과 제약 |
| [FreeBSD sendfile(2)](https://github.com/freebsd/freebsd-src/blob/main/lib/libsys/sendfile.2) | 파일→소켓 전송, 비차단 소켓의 부분 전송과 EAGAIN |
| [FreeBSD kqueue(2)](https://github.com/freebsd/freebsd-src/blob/main/lib/libsys/kqueue.2) | 이벤트 통지와 파일 디스크립터 |
| [MDN Range requests](https://github.com/mdn/content/blob/main/files/en-us/web/http/guides/range_requests/index.md) | Range·206·Content-Range와 범위 요청 |
| [MDN Evolution of HTTP](https://github.com/mdn/content/blob/main/files/en-us/web/http/guides/evolution_of_http/index.md) | HTTP/2·HTTP/3와 QUIC의 전송 차이 |
| [MDN adaptive streaming](https://github.com/mdn/content/blob/main/files/en-us/web/media/guides/audio_and_video_delivery/live_streaming_web_audio_and_video/index.md) | 여러 화질의 구간과 HLS·DASH 개념; 라이브 문서에서 공통 ABR 개념만 사용 |
| [CloudFront Expiration](https://github.com/awsdocs/amazon-cloudfront-developer-guide/blob/main/doc_source/Expiration.md) | 보존된 AWS 문서의 TTL·Cache-Control 설명; 현재 제품의 기본값·구체적인 동작은 최신 문서 확인 필요 |

AWS 고객 사례, Caddy Automatic HTTPS, CloudFront의 최신 제품 문서, TLS 1.3·HLS RFC는 **추가 읽기**로 연결했으며 이 환경에서는 직접 열람하지 못했습니다. CloudFront cache key의 보존 문서와 아래 HTTP Working Group 원문은 별도로 확인했습니다. 각 글의 자료 목록에서도 확인한 문서와 추가 읽기를 구분합니다.

### 개발자 상세의 주장과 근거

2026-10-27에 아래 공식 저장소 원문을 읽어 핵심 동작·조건·오류를 대조했습니다. `technology-depth.js`의 핵심 주장 옆에서 해당 자료로 바로 이동합니다. 원문이 일반 기술 동작을 설명하는 경우 Netflix의 현재 배포를 확인한 것처럼 쓰지 않습니다.

| 확인한 원문 | 상세에 반영한 핵심 |
| --- | --- |
| [NGINX core 설정](https://github.com/nginx/nginx.org/blob/master/xml/en/docs/ngx_core_module.xml) | worker_connections에 upstream 연결도 포함, open-file 한도의 제약 |
| [NGINX HTTP core](https://github.com/nginx/nginx.org/blob/master/xml/en/docs/http/ngx_http_core_module.xml) | Linux aio·directio와 정렬되지 않은 범위의 blocking, aio threads의 빌드·OS 조건 |
| [NGINX access log](https://github.com/nginx/nginx.org/blob/master/xml/en/docs/http/ngx_http_log_module.xml) | request_time의 측정 구간, body_bytes_sent의 의미; upstream 없는 정적 응답의 진단 |
| [FreeBSD sendfile(2)](https://github.com/freebsd/freebsd-src/blob/main/lib/libsys/sendfile.2) | EAGAIN에도 sbytes의 부분 전송량 확인, SF_NODISKIO와 디스크 대기의 구분 |
| [FreeBSD kqueue(2)](https://github.com/freebsd/freebsd-src/blob/main/lib/libsys/kqueue.2) | 쓰기 준비 상태와 전체 전송 완료의 차이 |
| [FreeBSD ktls(4)](https://github.com/freebsd/freebsd-src/blob/main/share/man/man4/ktls.4) | 사용자 공간 handshake, 방향별 세션 키, SW·IFNET·TOE 모드, 통계와 NIC capability |
| [HTTP Working Group RFC 9110 원문](https://github.com/httpwg/http-core/blob/main/rfc9110.xml) · [발행 표준](https://www.rfc-editor.org/rfc/rfc9110.html) | §13.1.5 If-Range, §14 범위·206·416, 멱등성·상태 코드. If-Range 불일치는 Range를 무시하며 412가 아님 |
| [HTTP Working Group RFC 9111 원문](https://github.com/httpwg/http-core/blob/main/rfc9111.xml) · [발행 표준](https://www.rfc-editor.org/rfc/rfc9111.html) | 저장·재검증·공유 캐시, 인증 응답의 조건, no-cache·no-store·private·max-age |
| [AWS cache key 보존 문서](https://github.com/awsdocs/amazon-cloudfront-developer-guide/blob/main/doc_source/understanding-the-cache-key.md) | 바이트가 다른 입력의 키 반영과 불필요한 키 분산. 최신 기본값의 근거로 사용하지 않음 |
| [Caddy file_server 구현](https://github.com/caddyserver/caddy/blob/master/modules/caddyhttp/fileserver/staticfiles.go) | Range·If-Range·조건부 요청 처리와 Go ServeContent 사용 |
| [Apache event MPM](https://github.com/apache/httpd/blob/trunk/docs/manual/mod/event.xml) · [core](https://github.com/apache/httpd/blob/trunk/docs/manual/mod/core.xml) | keep-alive 연결 관리·worker 처리 구분, DocumentRoot·EnableSendfile의 조건 |
| [Cloudflare cache control](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/cache/concepts/cache-control.mdx) | Origin Cache Control 적용 상태에 따른 no-cache 처리; 실제 규칙과 원본 헤더의 대조 |

OCA의 파일·네트워크 용량, API deadline과 의존성 지연, 배치 상태 머신, 후보 필터·복구 예산, 증상별 진단과 교체 검증 순서는 **일반 설계 및 학습 예제**입니다. 공개되지 않은 Netflix의 점수식·재시도 순서·내부 필드·KTLS 모드·현재 장비 성능의 근거로 쓰지 않습니다. AWS 실행 제품이 특정되지 않았으므로 Google Cloud·Azure 상세는 실제 제품 목록 확인과 이관 계약을 설명하며, 확인되지 않은 일대일 제품 전환표를 만들지 않습니다.

### 실제 파일 응답 실험

[실습 안내와 설정](examples/file-delivery/README.md), [검사 스크립트](scripts/verify-delivery-lab.py)를 제공합니다. 공식 [NGINX 소스 9a7439f](https://github.com/nginx/nginx/commit/9a7439fd79076de03c408de136ba1772347030c2)를 Linux에서 빌드해 실행했으며, 실행 파일이 출력한 버전은 `nginx/1.31.9`입니다. 빌드에는 `--without-http_rewrite_module --without-http_gzip_module`을 사용했습니다. 이 버전은 실험 재현 정보이며 Netflix의 사용 버전이 아닙니다.

10,000바이트의 결정적인 파일에서 전체 GET, 정상 0–1023 범위, suffix 256바이트, 파일 끝 밖의 범위, If-Range 일치·불일치, 없는 파일의 7개 검사가 통과했습니다. 상태·헤더와 원본의 해당 바이트를 대조했습니다. 사이트에 표시한 NGINX 설정과 이 실험의 설정 파일은 자동 검사로 일치시킵니다. 포트만 비어 있는 루프백 포트로 치환합니다. 이 실험으로 TLS·FreeBSD·NIC offload·CDN 성능을 검증했다고 주장하지 않습니다.

### 설명용 예제와 계산의 가정

구성도의 입력·처리·출력 설명과 서버 계층의 작은 동작 도식은 위 공식 기술 문서와 사례의 기능 구분을 읽기 위한 요약입니다. NGINX·FreeBSD·캐시 등의 일반 기능을 설명하며 특정 OCA 버전의 실행 순서나 설정을 재현하지 않습니다. 대안 비교 카드는 역할과 교체 범위를 설명하고, 공개 사례의 구성도를 대안으로 변경하거나 실제 성능 우위를 가정하지 않습니다.

- NGINX 설정은 로컬 파일 응답을 설명하는 루프백 HTTP 실습입니다. 인증·TLS·캐시를 갖춘 운영 설정이나 OCA 설정이 아닙니다.
- AWS의 JSON, 콘텐츠 경로·캐시 정책 메모, 전송 후보 평가와 재시도 기준은 가상의 설계 예제입니다.
- 용량 계산: `동시 시청자 × 평균 비트레이트 ÷ 목표 링크 사용률`. 십진 단위를 사용하며 패킷·TLS 오버헤드, 오디오, 재전송, 순간 피크와 장애 예비 용량은 제외합니다.
- ABR 계산: 4초·5 Mb/s 구간의 크기를 20 Mb로 놓고 상수 처리량으로 나눕니다. 다음 후보는 1·3·5·8 Mb/s 중 처리량의 75% 이하인 최댓값입니다. 실제 알고리즘·처리량 측정·플레이어 시뮬레이션이 아닙니다.
- ABR 버퍼: 다운로드 시간 T, 초기 버퍼 B, 새 구간 길이 d에서 `stall=max(0,T−B)`, `B_next=max(0,B−T)+d`입니다. 다운로드 중 연속 재생을 가정하고 오디오·VBR·RTT·디코딩·최대 버퍼·중단은 생략합니다.
- 지표 목록과 대안의 선택 조건은 설계를 판단하기 위한 제안이며 Netflix의 관측 항목이나 전환 계획을 확인한 자료가 아닙니다.

## 웹 도식 참고 자료

1. **ByteByteGo — Netflix Tech Stack**
   - [공개 스냅샷의 원문](https://github.com/ByteByteGoHq/system-design-101/blob/44f1251199ae384a1d46c01479b58b1bed610cb8/README.md#netflixs-tech-stack)
   - `assets/netflix.png`
   - 기술을 역할별 영역으로 묶는 표현을 참고했습니다. 2023년 스냅샷으로, 현재 Netflix의 기술 목록을 확인한 자료가 아닙니다.
2. **ByteByteGo — How do video live streamings work?**
   - [공개 스냅샷의 원문](https://github.com/ByteByteGoHq/system-design-101/blob/44f1251199ae384a1d46c01479b58b1bed610cb8/README.md#how-do-video-live-streamings-work-on-youtube-tiktok-live-or-twitch)
   - `assets/streaming.jpg`
   - 번호·영역 경계·프로토콜 표기의 표현을 참고했습니다. 라이브 방송 도식이며 이번 주문형 영상의 실제 구성도가 아닙니다.
3. **System Design Primer — Content delivery network**
   - [인용된 페이지](https://github.com/donnemartin/system-design-primer#content-delivery-network)
   - [Primer가 표시한 원출처: Creative Artworks](https://www.creative-artworks.eu/why-use-a-content-delivery-network-cdn/)
   - `assets/cdn.jpg`
   - 지리적 분산의 표현을 참고했습니다. Netflix의 실제 거점 지도가 아닙니다.

참고 원본 이미지는 수정하지 않았으며, 자체 구성도와 구분해 표시합니다. 외부 자료의 권리와 조건은 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)를 참고하세요.

## 자체 제작·단순화한 부분

- 카드 표지, 아키텍처 SVG, OCA 서버 일러스트와 플레이어·저장소·HTTPS·라우팅·배치 아이콘은 이 사례를 설명하기 위해 제작했습니다.
- OCA 그림은 실제 제품 외형이나 드라이브 수를 재현한 것이 아닙니다. 작은 표시에는 별도의 OCA 아이콘을 사용합니다.
- 서비스 구분, 서버 수, 콘텐츠 배치의 계층과 경로는 기능을 설명하기 위해 단순화했습니다.
- 장애 보기는 다른 후보로 요청을 재시도하는 개념도입니다. 실제 감지 시간, 재시도 알고리즘이나 무중단 전환을 검증한 시뮬레이션이 아닙니다.

## 대안 기술

### 대체 대상·대체 기술·제공 조직

제품 목록은 현재 설계의 대체 대상과 직접 연결합니다. Open Connect의 전달망 역할 → CloudFront·Fastly·Cloudflare CDN, NGINX의 HTTP 파일 응답 역할 → Caddy·Apache HTTP Server, FreeBSD의 OS 역할 → Ubuntu Server·Debian, AWS의 재생 제어 실행 환경 → Google Cloud·Azure의 9개 관계입니다. 각 관계의 양쪽 기술, 대체 위치·범위와 함께 연결할 기존 역할을 표시합니다. 전체 제품의 완전한 기능 호환이나 동일 설정의 즉시 교체를 검증했다는 뜻이 아닙니다.

원본 파일 저장소는 현재 제품이 특정되지 않았으므로 S3·Cloud Storage를 특정 기존 제품의 대체재라고 표시하지 않습니다. 별도 접이식 영역의 구현 예시로 구분하며, 대체 관계의 수에도 포함하지 않습니다. 제품·제공 조직·종류·일반 동작·활용 상황과 공식 문서는 각 상세 창에서 확인할 수 있습니다.

| 기술 | 제공 조직·문서 |
| --- | --- |
| Amazon CloudFront · Amazon S3 | Amazon Web Services · [CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) · [S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) |
| Fastly CDN | Fastly · [공식 문서](https://www.fastly.com/documentation/) · [확인한 CLI 프로젝트 README](https://github.com/fastly/cli) |
| Cloudflare CDN | Cloudflare · [캐시 문서](https://developers.cloudflare.com/cache/). 별도 제품인 Stream과 역할을 구분합니다. |
| Caddy | ZeroSSL, HID Global 계열 · [공식 README](https://github.com/caddyserver/caddy). 2026-10-27에 확인한 README의 프로젝트 소속·자동 HTTPS·설정 설명을 사용합니다. 상표 소유와 프로젝트 소속은 구분합니다. |
| Apache HTTP Server | Apache Software Foundation · [공식 프로젝트 README](https://github.com/apache/httpd) · [제품 문서](https://httpd.apache.org/docs/2.4/) |
| Ubuntu Server | Canonical · [확인한 공식 문서 저장소](https://github.com/canonical/ubuntu-server-documentation) |
| Debian | Debian Project · [프로젝트 소개](https://www.debian.org/intro/about). 특정 회사 소유 제품으로 표시하지 않습니다. |
| Google Cloud · Cloud Storage | Google · [플랫폼 문서](https://cloud.google.com/docs) · [확인한 Cloud Storage 클라이언트 README](https://github.com/googleapis/python-storage) |
| Microsoft Azure | Microsoft · [제품 문서](https://learn.microsoft.com/azure/) |

제품 문서 링크 중 직접 접근이 제한된 자료는 추가 읽기로 연결합니다. 요금·플랜·기본값·최신 지원 범위를 재확인했다고 주장하지 않습니다. Cloudflare의 영상 사용 범위, Caddy의 인증서 자동화 조건 등 제품별 적용 범위는 실제 도입 시 해당 공식 문서로 확인할 수 있도록 안내합니다.

### 세분화한 흐름의 범위

9단계는 파일 준비·거점 배치·재생 정보 요청·후보 조회·정보 응답·구간 요청·파일 응답·버퍼 판단·다음 요청으로 기능을 나눈 것입니다. Netflix의 실제 내부 API 순서·서비스 수·HTTP 버전·플레이어 알고리즘을 재현하지 않습니다. GET·Range·206과 구간 크기는 일반 기술을 읽는 설명용 예제입니다.

CloudFront·Fastly, Linux, Caddy·Apache HTTP Server는 역할별로 검토할 수 있는 대안입니다. 동일한 설정으로 교체할 수 있다거나 동등한 성능을 검증했다는 뜻이 아닙니다. 비용, 운영 책임, 기능, 하드웨어와 실제 트래픽에서의 측정이 판단 기준입니다.

HTTP(S)와 WebRTC는 통신 모델과 용도가 다르므로 단순한 대체재로 소개하지 않습니다. 클라우드 선택과 CDN 선택도 별도의 설계 축으로 구분합니다.

## 로고와 서체

외부 로고의 경로를 보존하고, 일부 SVG의 색과 표시 여백을 조정했습니다. Noto Sans CJK KR와 DejaVu Sans Mono는 현재 콘텐츠에 필요한 글리프를 추려 WOFF로 포함했습니다. 원문 고지는 `licenses/`와 `assets/fonts/`에 보존하며, 단일 HTML에도 서체 고지를 넣습니다.
