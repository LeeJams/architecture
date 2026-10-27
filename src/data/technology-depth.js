import { resolveAssets } from "./assets.js";

export const technicalSources = resolveAssets({
  core: [
    "NGINX · HTTP 기본 설정",
    "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/http/ngx_http_core_module.xml",
  ],
  events: [
    "NGINX · 연결 처리 방식",
    "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/events.xml",
  ],
  workers: [
    "NGINX · worker_connections",
    "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/ngx_core_module.xml",
  ],
  log: [
    "NGINX · 접근 로그 변수",
    "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/http/ngx_http_log_module.xml",
  ],
  sendfile: [
    "FreeBSD · sendfile(2)",
    "https://github.com/freebsd/freebsd-src/blob/main/lib/libsys/sendfile.2",
  ],
  kqueue: [
    "FreeBSD · kqueue(2)",
    "https://github.com/freebsd/freebsd-src/blob/main/lib/libsys/kqueue.2",
  ],
  ktls: [
    "FreeBSD · ktls(4)",
    "https://github.com/freebsd/freebsd-src/blob/main/share/man/man4/ktls.4",
  ],
  range: [
    "RFC 9110 · §14 Range",
    "https://www.rfc-editor.org/rfc/rfc9110.html#section-14",
  ],
  ifrange: [
    "RFC 9110 · §13.1.5 If-Range",
    "https://www.rfc-editor.org/rfc/rfc9110.html#section-13.1.5",
  ],
  semantics: [
    "RFC 9110 · §9.2.2 / §15",
    "https://www.rfc-editor.org/rfc/rfc9110.html",
  ],
  caching: [
    "RFC 9111 · §3 / §4 / §5",
    "https://www.rfc-editor.org/rfc/rfc9111.html",
  ],
  cachekey: [
    "AWS · 캐시 키 (보존 문서)",
    "https://github.com/awsdocs/amazon-cloudfront-developer-guide/blob/main/doc_source/understanding-the-cache-key.md",
  ],
  abr: [
    "MDN · adaptive streaming",
    "https://github.com/mdn/content/blob/main/files/en-us/web/media/guides/audio_and_video_delivery/live_streaming_web_audio_and_video/index.md",
  ],
  caddy: [
    "Caddy · file server implementation",
    "https://github.com/caddyserver/caddy/blob/master/modules/caddyhttp/fileserver/staticfiles.go",
  ],
  apache: [
    "Apache · event MPM",
    "https://github.com/apache/httpd/blob/trunk/docs/manual/mod/event.xml",
  ],
  cf: [
    "Cloudflare · cache control",
    "https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/cache/concepts/cache-control.mdx",
  ],
});

export const technologyDepth = resolveAssets({
  nginx: {
    headline: "이벤트 루프의 효율과 파일 I/O의 지연은 따로 봐야 합니다.",
    scope:
      "NGINX 공식 문서로 확인한 일반 동작 · 아래 경로는 개념도이며 OCA 설정을 재현하지 않습니다.",
    points: [
      {
        title: "worker_connections는 시청자 수가 아닙니다",
        text: "한 작업자 프로세스가 열 수 있는 연결의 상한입니다. 프록시 구성에서는 클라이언트 연결뿐 아니라 원본 서버 연결도 소비합니다. 연결 외에 파일·로그 등도 파일 디스크립터를 쓰므로, 작업자 프로세스 수 × 연결 수만으로 동시 시청 한도를 정할 수 없습니다. 먼저 정적 파일 응답인지 프록시인지 구분하고 프로세스별 파일 디스크립터 한도와 실제 FD 사용량을 확인합니다.",
        refs: ["workers"],
      },
      {
        title: "epoll·kqueue는 ‘지금 소켓에 쓸 수 있음’을 알려줍니다",
        text: "느린 수신자의 송신 버퍼가 가득 차면 전송을 멈추고 다른 연결을 처리합니다. 다시 쓰기 가능한 이벤트가 오면 남은 바이트를 이어 보냅니다. 반면 파일 페이지가 메모리에 없을 때의 저장장치 읽기는 별도의 문제입니다. 네트워크가 비차단이라는 이유로 메모리에 없는 파일을 읽는 부하에서도 작업자 프로세스가 전혀 기다리지 않는다고 해석하면 안 됩니다.",
        refs: ["events", "core"],
      },
      {
        title: "sendfile·aio·스레드 풀은 같은 스위치가 아닙니다",
        text: "sendfile은 파일→소켓 전송 경로입니다. NGINX 문서상 Linux의 aio on은 directio 조건이 있고, directio는 해당 요청에서 sendfile을 끕니다. 정렬되지 않은 Range의 앞뒤 읽기는 여전히 대기 시간을 만들 수 있습니다. aio threads는 --with-threads 빌드가 필요하며, 문서상 다중 스레드 sendfile은 Linux에서만 지원됩니다. FreeBSD와 Linux에 같은 튜닝 설정을 복사해서는 안 됩니다.",
        refs: ["core"],
      },
      {
        title: "정적 파일 서버와 원본 프록시의 로그 해석도 다릅니다",
        text: "root로 파일을 보내는 요청에는 upstream이 없습니다. 이때 upstream_response_time으로 디스크 지연을 판단할 수 없습니다. request_time은 요청을 읽기 시작한 시점부터 마지막 응답을 보낸 뒤의 로그 기록까지이므로, 느린 클라이언트의 다운로드 시간도 포함합니다. body_bytes_sent·status·Range를 같이 기록하고 OS의 디스크 지연·CPU·재전송과 연결해야 합니다.",
        refs: ["log"],
      },
    ],
    scenarios: [
      {
        id: "warm",
        label: "메모리 적중",
        title: "파일 페이지가 이미 메모리에 있을 때",
        path: [
          ["nginx", "URI → 파일", "root·try_files"],
          ["freebsd", "파일 페이지", "저장장치 읽기 없이 활용"],
          ["https", "소켓 출력", "수신 속도에 맞춰 전송"],
        ],
        text: "같은 파일을 반복 요청하는 부하는 저장장치보다 CPU·메모리·NIC 경로를 강하게 시험할 수 있습니다. sendfile 사용 여부와 TLS 조건을 고정한 뒤 전송 Gb/s당 CPU를 봅니다. 이 결과를 메모리에 없는 여러 파일을 읽는 부하의 성능으로 확대하지 않습니다.",
        code: "GET /media/demo.bin\n→ root data + /media/demo.bin\n→ <NGINX prefix>/data/media/demo.bin\n→ file pages → socket → NIC",
        refs: ["core", "sendfile"],
      },
      {
        id: "cold",
        label: "저장장치 미스",
        title: "파일이 디스크에는 있지만 페이지가 준비되지 않았을 때",
        path: [
          ["storage", "파일 읽기 필요", "메모리에 없는 파일 페이지"],
          ["freebsd", "I/O 대기 처리", "OS·AIO·빌드 조건"],
          ["nginx", "응답 재개", "데이터 준비 후 전송"],
        ],
        text: "메모리에 없는 파일을 읽는 시간과 소켓이 다시 쓰기 가능해지는 시간은 다릅니다. 인기 파일 하나로만 시험하면 이 지연이 감춰집니다. 파일 작업 집합·동시 읽기·메모리 페이지 적중 상태를 부하 조건에 남기고, AIO 또는 스레드 풀이 실제 적용됐는지 확인합니다.",
        code: "socket writable ≠ file pages ready\n\nLinux: aio on + directio → alignment matters\naio threads → --with-threads required\nFreeBSD: check its own aio / sendfile path",
        refs: ["core"],
      },
      {
        id: "slow",
        label: "느린 수신자",
        title: "서버가 빠르더라도 다운로드 완료는 늦을 수 있습니다",
        path: [
          ["player", "느린 수신", "송신 버퍼 여유 감소"],
          ["nginx", "진행 상태 보관", "다른 연결의 작업 처리"],
          ["freebsd", "쓰기 가능 이벤트", "남은 전송 재개"],
        ],
        text: "긴 request_time 하나로 서버가 느리다고 결론내리지 않습니다. 큰 파일을 낮은 속도로 받는 정상 요청일 수 있습니다. 요청 크기·실제 전송 바이트·클라이언트 중단을 함께 보고, 동일 조건에서 첫 바이트와 전체 수신 시간을 분리합니다.",
        code: "request_time: first request bytes read → log after response delivery\nbody_bytes_sent = bytes actually sent (without headers)\n\nlong request_time alone does not locate the bottleneck",
        refs: ["log", "events"],
      },
    ],
    diagnostics: [
      [
        "링크는 여유인데 디스크에서 읽을 때만 느림",
        "인기 파일 반복과 큰 작업 집합을 따로 측정. 디스크 지연·작업자 프로세스의 CPU·I/O 대기를 같은 시간축으로 기록.",
        "캐시 적중 부하와 저장장치 미스 부하를 섞지 않고 I/O 경로부터 확인합니다.",
      ],
      [
        "동시 접속이 늘면 연결 실패",
        "worker_connections, 프로세스 FD 한도·사용량, error log의 자원 부족 메시지를 확인.",
        "설정의 동시 접속 상한과 OS 자원 상한 중 실제로 먼저 도달한 것을 찾습니다.",
      ],
      [
        "request_time만 높음",
        "응답 크기·클라이언트 속도·중단·TCP 재전송과 첫 바이트 시간을 대조.",
        "전송 완료 지연과 요청 처리 지연을 구분합니다.",
      ],
    ],
  },
  freebsd: {
    headline:
      "sendfile의 부분 전송, kqueue의 준비 상태, TLS의 실행 위치를 구분합니다.",
    scope:
      "FreeBSD 공식 시스템 호출·KTLS 매뉴얼의 일반 동작 · 특정 OCA의 커널·NIC·암호화 모드를 단정하지 않습니다.",
    points: [
      {
        title: "EAGAIN이어도 이미 보낸 바이트가 있을 수 있습니다",
        text: "FreeBSD sendfile은 비차단 소켓의 송신 버퍼가 가득 차면 EAGAIN을 반환할 수 있고, sbytes로 성공한 전송량을 돌려줍니다. 오류라고 같은 offset부터 전부 다시 보내면 중복 데이터가 생깁니다. 성공한 길이만큼 offset을 진행하고 남은 길이를 줄인 다음, 쓰기 가능 이벤트를 기다려 재개해야 합니다. Linux와 함수 시그니처도 다릅니다.",
        refs: ["sendfile"],
      },
      {
        title: "kqueue 알림은 전체 파일 전송 완료가 아닙니다",
        text: "EVFILT_WRITE는 소켓 쓰기가 가능한 상태를 관측하는 필터입니다. 준비됐다는 알림을 받은 뒤에도 한 번의 호출이 요청한 모든 바이트를 보낸다는 보장은 없습니다. 읽기 가능한 소켓과 파일 페이지의 준비 여부도 별개입니다. SF_NODISKIO는 페이지가 준비되지 않은 상황을 피하려는 sendfile 옵션이며, 일반적인 비차단 소켓과 같은 의미가 아닙니다.",
        refs: ["kqueue", "sendfile"],
      },
      {
        title: "KTLS도 핸드셰이크는 사용자 공간에서 합니다",
        text: "ktls(4)에 따르면 TLS 연결 협상과 세션 키 협상은 사용자 공간에서 수행하고, 키와 암호 스위트를 커널에 넘긴 뒤 레코드 처리를 위임합니다. SW 모드는 커널의 암호 처리 경로, IFNET 모드는 지원 NIC의 암호화 경로입니다. KTLS를 쓴다는 사실만으로 NIC offload를 사용한다고 말할 수 없습니다. 지원 라이브러리·커널·드라이버·협상 암호가 모두 맞아야 합니다.",
        refs: ["ktls"],
      },
    ],
    scenarios: [
      {
        id: "partial",
        label: "부분 전송",
        title: "반환 코드와 전송량을 함께 처리합니다",
        path: [
          ["nginx", "남은 범위", "offset·remaining"],
          ["freebsd", "sendfile", "EAGAIN + sbytes 가능"],
          ["routing", "재개 대기", "writable event"],
        ],
        text: "아래는 알고리즘을 읽는 의사 코드입니다. sendfile의 호출 가능한 C 예제가 아니며, 오류 처리 전체를 생략했습니다. EINTR·치명적 오류·연결 종료도 각각 처리해야 합니다.",
        code: "offset = 0; remaining = file_size\n\nrc, sbytes = freebsd_sendfile(offset, remaining)\noffset += sbytes\nremaining -= sbytes\nif EAGAIN: wait_for_writable()\nif fatal_error: stop()\notherwise: continue_until_remaining_is_zero",
        refs: ["sendfile"],
      },
      {
        id: "tls",
        label: "TLS 경로",
        title: "TLS 연결 협상과 레코드 암호화는 다른 단계입니다",
        path: [
          ["https", "사용자 공간", "연결 협상·키 협상"],
          ["freebsd", "KTLS 설정", "방향별 키·암호 전달"],
          ["routing", "SW 또는 NIC", "지원 조건에 따른 레코드 처리"],
        ],
        text: "HTTPS 성능을 비교할 때 평문 HTTP·사용자 공간 TLS·커널 SW TLS·NIC offload를 같은 항목으로 묶지 않습니다. FreeBSD에서는 sysctl kern.ipc.tls 아래 통계와 ifconfig의 TXTLS 능력 표기를 확인할 수 있습니다. 능력 표시는 지원 여부이며 해당 연결이 실제 그 모드로 전송됐다는 증거와는 구분합니다.",
        code: "FreeBSD observation (names depend on release):\n  sysctl kern.ipc.tls\n  ifconfig <interface>\n\ncapability advertised ≠ offload active for every connection",
        refs: ["ktls"],
      },
    ],
    diagnostics: [
      [
        "CPU를 쓰는데 NIC가 덜 참",
        "같은 TLS·파일 분포에서 CPU 프로파일, 전송량, TLS 모드를 대조.",
        "암호 처리·메모리 경로·저장장치·소켓 중 어느 곳이 제한인지 분리합니다.",
      ],
      [
        "EAGAIN이 늘어남",
        "부분 전송량·송신 버퍼·수신 속도·TCP 재전송을 함께 확인.",
        "EAGAIN 자체는 비차단 흐름 제어일 수 있습니다. 무조건 실패로 재시도하지 않습니다.",
      ],
      [
        "캐시 미스에서 지연 급증",
        "파일 페이지 적중 여부, 저장장치 대기와 sendfile의 I/O 관련 조건을 확인.",
        "zero-copy라는 명칭을 디스크 대기까지 없다는 뜻으로 해석하지 않습니다.",
      ],
    ],
  },
  https: {
    headline:
      "206·200·416을 구분해야 탐색과 재시도가 파일을 망가뜨리지 않습니다.",
    scope:
      "RFC 9110의 HTTP 의미론 · 아래는 Range를 지원하는 정적 서버와 10,000바이트 학습 파일의 예제입니다.",
    points: [
      {
        title: "Range의 끝 위치은 포함됩니다",
        text: "bytes=0-1023은 1,024바이트입니다. 단일 범위 206의 Content-Range는 선택한 범위와 전체 길이를, Content-Length는 이번 응답 본문의 길이를 가리킵니다. 범위 밖 요청의 416에는 Content-Range: bytes */10000처럼 현재 길이를 알릴 수 있습니다. 서버가 Range를 무시하고 200을 반환하는 경우도 있으므로, 요청한 길이만 올 것이라고 가정하면 안 됩니다.",
        refs: ["range"],
      },
      {
        title: "이어받기는 파일의 동일성까지 확인해야 합니다",
        text: "같은 URL이라도 배포 중 바이트가 바뀔 수 있습니다. 강한 ETag를 If-Range에 담아 요청하면 값이 일치할 때만 부분 응답을 이어받고, 불일치 시 서버는 Range를 무시합니다. 정상 전체 응답은 200이며 412가 아닙니다. W/ 접두사의 약한 ETag는 If-Range에 사용할 수 없습니다. 이전 버전의 조각과 새 버전의 조각을 섞지 않는 것이 목적입니다.",
        refs: ["ifrange"],
      },
      {
        title: "미디어 구간과 HTTP byte range는 다른 단위입니다",
        text: "4초짜리 .m4s 파일 하나를 일반 GET으로 받으면 200일 수 있습니다. 큰 파일의 일부를 Range로 받으면 206일 수 있습니다. 바이트 1,024개가 몇 초 영상인지 HTTP는 알지 못합니다. 재생 시간·키프레임·표현 전환 경계는 패키징·미디어 계층이 관리합니다. Range 지원만으로 탐색 가능한 플레이어가 완성되지 않습니다.",
        refs: ["range", "abr"],
      },
    ],
    scenarios: [
      {
        id: "partial",
        label: "206 · 정상 범위",
        title: "요청한 1,024바이트만 받습니다",
        path: [
          ["player", "Range 요청", "0–1023"],
          ["nginx", "범위 수락", "206 Partial Content"],
          ["https", "부분 본문", "1,024바이트"],
        ],
        text: "길이와 범위를 함께 확인합니다. 헤더의 이름은 대소문자를 구분하지 않습니다. 이 사이트의 실습 스크립트는 본문이 실제 원본의 첫 1,024바이트와 같은지도 검사합니다.",
        code: "GET /media/demo.bin HTTP/1.1\nRange: bytes=0-1023\n\nHTTP/1.1 206 Partial Content\nContent-Range: bytes 0-1023/10000\nContent-Length: 1024",
        refs: ["range"],
      },
      {
        id: "unsatisfied",
        label: "416 · 범위 초과",
        title: "10,000바이트 파일의 바이트 위치 10,000부터는 없습니다",
        path: [
          ["player", "Range 요청", "10000–"],
          ["nginx", "만족 불가", "416 Range Not Satisfiable"],
          ["https", "현재 길이", "bytes */10000"],
        ],
        text: "유효한 바이트 위치은 0부터 9,999까지입니다. 파일 크기가 바뀌었거나 구간 인덱스가 오래됐는지 확인할 신호입니다. 같은 잘못된 범위를 다른 서버에 무한 반복하는 대신 파일 버전과 재생 정보를 확인합니다.",
        code: "GET /media/demo.bin HTTP/1.1\nRange: bytes=10000-\n\nHTTP/1.1 416 Range Not Satisfiable\nContent-Range: bytes */10000\n\n[error body, not media bytes]",
        refs: ["range"],
      },
      {
        id: "changed",
        label: "200 · 버전 불일치",
        title: "If-Range 불일치는 전체 표현을 돌려줍니다",
        path: [
          ["player", "이전 ETag", 'If-Range: "old-version"'],
          ["nginx", "현재 ETag와 다름", "Range 무시"],
          ["https", "전체 응답", "200 · 10,000바이트"],
        ],
        text: "이 응답을 기존 부분 데이터 뒤에 무조건 이어 붙이면 안 됩니다. 아래 200에는 Content-Range가 없고 전체 본문이 옵니다. 실제 클라이언트는 상태·validator를 보고 이전 조각을 버릴지, 새로운 리소스로 다시 처리할지 결정해야 합니다.",
        code: 'GET /media/demo.bin HTTP/1.1\nRange: bytes=1024-2047\nIf-Range: "old-version"\n\nHTTP/1.1 200 OK\nContent-Length: 10000\n\n[entire current representation]',
        refs: ["ifrange"],
      },
    ],
    diagnostics: [
      [
        "Range 요청인데 200이 옴",
        "If-Range 일치 여부, 서버의 Range 처리와 중간 프록시를 확인.",
        "부분 본문으로 취급하기 전에 상태와 길이를 검증합니다.",
      ],
      [
        "416이 반복됨",
        "요청 시작 위치·현재 전체 길이·파일 버전·오래된 목록을 대조.",
        "네트워크 재시도로 해결되는 오류인지 먼저 분류합니다.",
      ],
      [
        "네트워크는 정상인데 탐색 실패",
        "미디어 인덱스·디코딩 시작점·기기 지원·필수 초기화 구간을 확인.",
        "HTTP 바이트 전달과 미디어 디코딩 오류를 분리합니다.",
      ],
    ],
  },
  fill: {
    headline:
      "‘파일이 저장됨’과 ‘이 파일로 시청자를 보내도 됨’ 사이에 검증 단계가 필요합니다.",
    scope:
      "공개 사례의 사전 배치 역할을 출발점으로 한 일반 설계 · 캐시 키·배포 상태 머신은 학습 모델입니다.",
    points: [
      {
        title: "배치 완료를 곧바로 후보 등록으로 취급하지 않습니다",
        text: "전송 중인 파일이 요청 경로에 노출되면 짧은 파일·잘못된 Range 응답이 발생할 수 있습니다. 일반 구현에서는 임시 경로로 전송 → 길이·체크섬 검증 → 읽기 경로에 게시 → 파일 보유 목록에 READY 반영으로 나눌 수 있습니다. 검증 실패·디스크 부족이면 READY로 올리지 않습니다. 이 상태 머신은 설명용이며 넷플릭스의 내부 상태 이름이 아닙니다.",
        refs: [],
      },
      {
        title: "캐시 키와 권한 검증은 별개의 결정입니다",
        text: "버전·화질·오디오처럼 응답 바이트가 달라지는 값은 객체 식별에 반영해야 합니다. 반대로 사용자별 토큰을 모두 키에 넣으면 같은 영상이 수많은 객체로 분산될 수 있습니다. 그렇다고 토큰을 키에서 빼기만 해서는 안 됩니다. 매 요청의 접근 검증이 별도로 보장돼야 하며, 개인별 응답은 공유 저장 가능 여부를 먼저 판단합니다. 인증 헤더가 있는 응답의 공유 캐시는 RFC 조건과 제품 정책을 확인해야 합니다.",
        refs: ["cachekey", "caching"],
      },
      {
        title: "no-cache는 ‘저장 금지’가 아닙니다",
        text: "no-cache는 저장된 응답을 재사용하기 전에 검증이 필요하다는 뜻이고, no-store는 저장하지 말라는 지시입니다. private은 공유 캐시의 저장을 제한합니다. max-age는 신선도 수명입니다. 이들은 토큰의 접근 허용 기간과 서로 다른 개념입니다. 콘텐츠의 신선도와 시청 권한 만료를 하나의 TTL로 처리하면 잘못된 응답 재사용이 생길 수 있습니다.",
        refs: ["caching"],
      },
    ],
    scenarios: [
      {
        id: "publish",
        label: "안전한 게시",
        title: "다운로드된 파일은 검증 후에만 후보가 됩니다",
        path: [
          ["fill", "전송 중", "임시 파일"],
          ["storage", "검증 완료", "길이·체크섬 일치"],
          ["routing", "제공 가능", "파일 보유 목록에 반영"],
        ],
        text: "설명용 상태 전이입니다. 이미 READY인 버전의 바이트는 유지하고 새 버전은 새 식별자로 게시하는 편이 Range 재시도와 캐시 일관성을 이해하기 쉽습니다. 여러 노드의 동시 원자성을 보장한다는 뜻은 아니며, 파일 보유 목록 전파 지연도 별도로 다룹니다.",
        code: "COPYING → verify(size, checksum) → PUBLISH → READY\n           failure ↓\n           NOT_ELIGIBLE\n\nURL /film/v3/... always identifies the same bytes",
        refs: [],
      },
      {
        id: "bytes",
        label: "바이트 적중률",
        title: "요청 99% 적중도 원본 트래픽 대부분을 남길 수 있습니다",
        path: [
          ["player", "100회 요청", "1 MB × 99 + 1,000 MB"],
          ["ocaIcon", "99개 적중", "99 MB 제공"],
          ["storage", "대용량 1개 미스", "1,000 MB 필요"],
        ],
        text: "십진 단위로 작은 객체 99개가 각각 1 MB이고 큰 객체 하나가 1,000 MB라면, 요청 적중률은 99%지만 바이트 적중률은 99 / 1,099 ≈ 9.01%입니다. 실제 제품의 byte-hit 집계와 Range·재검증 포함 방식은 확인해야 합니다.",
        code: "request hit = 99 / 100 = 99%\nbyte hit = 99 MB / 1,099 MB ≈ 9.01%\n\norigin bytes ≠ request miss count",
        refs: [],
      },
    ],
    diagnostics: [
      [
        "저장했는데 후보에 안 잡힘",
        "파일 전송·검증·게시·파일 보유 목록 반영 시간을 각각 기록.",
        "파일 존재와 제공 가능 상태의 불일치를 찾습니다.",
      ],
      [
        "요청 적중률은 높은데 원본이 바쁨",
        "객체 크기 분포·바이트 적중률·Range·동시 미스를 확인.",
        "대용량 미스와 키 분산이 원본 바이트를 만드는지 구분합니다.",
      ],
      [
        "다른 사용자 응답이 섞임",
        "바이트를 바꾸는 입력·인증 처리·공유 캐시 정책·실제 키를 확인.",
        "키 축소보다 먼저 응답 동일성과 권한 검증을 바로잡습니다.",
      ],
    ],
  },
  abr: {
    headline: "다운로드가 성공해도 버퍼가 고갈되면 사용자는 멈춤을 겪습니다.",
    scope:
      "적응형 HTTP 스트리밍의 일반 원리 · 수식은 오디오·RTT·VBR·디코딩 시간을 뺀 단일 구간 학습 모델입니다.",
    points: [
      {
        title: "처리량·인코딩 비트레이트·재생 버퍼는 서로 다릅니다",
        text: "비트레이트 r Mb/s, 구간 길이 d초이면 단순 크기는 r×d Mb이고, 유효 처리량 c Mb/s에서 다운로드 시간 T=r×d/c입니다. 시작 버퍼 B초에 대해 다음 버퍼는 max(0, B−T)+d, 이 구간 다운로드 중 멈춤은 max(0, T−B)초로 계산할 수 있습니다. 요청 성공 여부만으로 재생 품질을 판정할 수 없는 이유입니다.",
        refs: ["abr"],
      },
      {
        title: "버퍼가 작으면 같은 속도에서도 더 보수적인 결정이 필요합니다",
        text: "최근 처리량이 충분해 보여도 남은 버퍼가 2초라면 연결 지연이나 다음 구간의 크기 증가를 견딜 여유가 적습니다. 실제 ABR은 처리량 추정·버퍼·기기 디코딩 능력 등을 함께 쓸 수 있습니다. 한 번의 측정값에 곧바로 따라가면 화질이 반복해서 오르내릴 수 있습니다. 아래 75% 규칙은 작은 학습 모델일 뿐 실제 넷플릭스 알고리즘이 아닙니다.",
        refs: ["abr"],
      },
      {
        title: "화질 전환은 요청할 표현을 바꾸는 일입니다",
        text: "플레이어는 다음 구간에 사용할 미리 준비된 표현을 고릅니다. 전환 가능한 경계·초기화 데이터·코덱 지원·미디어 타임라인이 맞아야 합니다. 서버에 낮은 비트레이트 파일이 존재하는 것만으로 모든 기기가 그 파일로 즉시 전환할 수 있지는 않습니다. 인코딩·패키징·플레이어와 서버의 연동 규칙이 함께 필요합니다.",
        refs: ["abr"],
      },
    ],
    scenarios: [
      {
        id: "stall",
        label: "버퍼 고갈",
        title: "8초의 버퍼로 10초 다운로드를 기다리면 2초 멈춥니다",
        path: [
          ["player", "초기 버퍼 8초", "5 Mb/s × 4초"],
          ["https", "수신에 10초", "처리량 2 Mb/s"],
          ["player", "2초 재버퍼링", "완료 후 버퍼 4초"],
        ],
        text: "구간 크기 20 Mb를 2 Mb/s로 받으면 10초입니다. 처음 8초는 기존 버퍼를 재생하고 다음 2초는 기다립니다. 완료 시 4초짜리 구간이 더해집니다. 음수 버퍼를 그대로 남기는 계산과 다릅니다.",
        code: "T = 5 × 4 / 2 = 10 s\nstall = max(0, 10 - 8) = 2 s\nB_next = max(0, 8 - 10) + 4 = 4 s",
        refs: [],
      },
      {
        id: "recover",
        label: "버퍼 회복",
        title: "같은 구간을 2초에 받으면 버퍼가 8초에서 10초로 늘어납니다",
        path: [
          ["player", "초기 버퍼 8초", "5 Mb/s × 4초"],
          ["https", "수신에 2초", "처리량 10 Mb/s"],
          ["player", "버퍼 10초", "재생 2초·추가 4초"],
        ],
        text: "수신 중에도 2초를 재생합니다. 다운로드 완료 시 6초가 남고 새 구간 4초가 붙어 10초가 됩니다. 큰 버퍼가 무조건 좋은 것은 아닙니다. 사용자가 곧 탐색·종료하면 미리 받은 바이트를 쓰지 않을 수 있습니다.",
        code: "T = 5 × 4 / 10 = 2 s\nstall = max(0, 2 - 8) = 0 s\nB_next = max(0, 8 - 2) + 4 = 10 s",
        refs: [],
      },
    ],
    diagnostics: [
      [
        "서버 2xx인데 재생이 멈춤",
        "구간별 다운로드 시간·재생 길이·다운로드 시작 시 버퍼를 기록.",
        "요청 성공과 재생 요청 제한 시간 충족을 나눠 봅니다.",
      ],
      [
        "네트워크는 충분한데 프레임 드롭",
        "디코더 오류·드롭 프레임·CPU·코덱과 기기 지원을 확인.",
        "전송 경로를 바꾸기 전에 미디어 처리 병목을 확인합니다.",
      ],
      [
        "화질이 자주 오르내림",
        "처리량 추정의 변동·전환 이력·버퍼·구간별 실제 크기를 대조.",
        "평균 비트레이트만으로 VBR 구간의 크기를 예측하지 않습니다.",
      ],
    ],
  },
  steering: {
    headline:
      "파일·경로·상태로 후보를 거른 뒤, 남은 버퍼 안에서 실패를 처리합니다.",
    scope:
      "넷플릭스의 실제 후보 점수식은 공개 확인하지 않음 · 아래 필터·예산·오류 분류는 일반 전달망 설계 예제입니다.",
    points: [
      {
        title: "파일 보유 목록와 건강 상태는 각각 오래될 수 있습니다",
        text: "파일 목록이 있다고 현재 파일이 읽히는 것은 아니고, 서버 상태 보고가 있다고 특정 ISP 경로가 좋은 것도 아닙니다. 보고 시각·파일 버전·거점 접근 가능성을 함께 보관하고, 최신 서버 상태와 플레이어에서 관측한 다운로드 결과를 구분합니다. 지리적 거리 순으로만 정렬하기 전에 실제 제공 가능한 후보인지 필터링해야 합니다.",
        refs: [],
      },
      {
        title: "재시도 가능성과 재시도할 시간은 별개입니다",
        text: "GET은 HTTP에서 멱등 메서드지만, 같은 바이트를 다시 받는 비용과 버퍼 요청 제한 시간은 남습니다. 404·416은 파일·범위의 문제일 수 있어 같은 요청을 반복해도 해결되지 않습니다. 403은 토큰·권한·시간을, 429·503은 과부하와 Retry-After를 검토합니다. 연결 timeout과 전체 시도 횟수·시간 예산을 분리하고, 이미 받은 바이트와 파일 버전도 보존 여부를 판단합니다.",
        refs: ["semantics", "range"],
      },
      {
        title: "대체 후보에는 동일 파일과 잔여 용량이 필요합니다",
        text: "다른 OCA로 옮길 때 같은 버전의 표현·구간을 제공할 수 있어야 합니다. 후보 두 개가 같은 혼잡 경로를 공유할 수도 있습니다. 한 거점의 트래픽을 넘기면 대상 거점의 여유를 소비하므로 정상 시의 총용량만으로 복구를 설명하지 않습니다. 단계적 장애·ISP별 장애 상황에서도 재생 품질과 중복 바이트를 측정합니다.",
        refs: [],
      },
    ],
    scenarios: [
      {
        id: "eligible",
        label: "후보 필터",
        title: "가까운 A가 아니라 파일과 경로를 가진 B가 후보입니다",
        path: [
          ["storage", "A: 파일 없음", "선택 제외"],
          ["routing", "B: 파일·경로 가능", "용량 검토"],
          ["ocaIcon", "C: 경로 불가", "선택 제외"],
        ],
        text: "설명용 상황입니다. B를 남겼더라도 실제 처리량이 충분한지는 요청 결과로 확인해야 합니다. 이 필터는 넷플릭스의 정렬 순서나 서버 점수를 재현하지 않습니다.",
        code: "eligible = file_version_ready\n        AND path_reachable\n        AND healthy_enough\n\nthen evaluate load / capacity / observed delivery",
        refs: [],
      },
      {
        id: "budget",
        label: "복구 시간 예산",
        title:
          "남은 버퍼 6초에 실패 대기 4초면 다운로드 시간은 2초도 남지 않습니다",
        path: [
          ["player", "버퍼 6초", "재생 계속 진행"],
          ["routing", "실패 대기 4초", "연결·TLS 비용 추가"],
          ["ocaIcon", "구간 수신", "요청 제한 시간 안에 완료 필요"],
        ],
        text: "필요 조건은 실패 감지·재시도 연결·구간 다운로드 시간이 남은 버퍼보다 작은 것입니다. 이를 만족해도 디코딩·스케줄링 비용이 있으므로 무중단을 보장하지 않습니다. 이미 준비된 대체 연결과 새 연결의 비용도 다릅니다.",
        code: "T_detect + T_connect + T_download < buffer_remaining\n\nexample: 4 + 0.5 + 2 = 6.5 s > 6 s\n→ at least 0.5 s late in this simplified model",
        refs: [],
      },
    ],
    diagnostics: [
      [
        "정상 OCA로 안내했는데 특정 ISP만 느림",
        "OCA별 집계와 ISP·시간대별 처리량·손실을 나눠 확인.",
        "서버 장애와 경로 혼잡을 분리합니다.",
      ],
      [
        "대체 요청은 성공했지만 재생이 끊김",
        "실패 대기·재연결·다운로드 시간을 버퍼와 대조.",
        "성공률만으로 복구 경험을 평가하지 않습니다.",
      ],
      [
        "장애 후 다른 거점도 과부하",
        "이동한 Gb/s·잔여 링크·파일 보유율·공유 경로를 확인.",
        "후보 개수보다 실제로 흡수할 수 있는 부하를 계산합니다.",
      ],
    ],
  },
  oca: {
    headline:
      "OCA 한 대의 처리량과 Open Connect 전체 전달망의 역할을 구분합니다.",
    scope:
      "사례의 전달 역할 + 공식 OS 문서의 데이터 경로 + 설명용 용량 계산 · 현재 OCA 사양·성능을 가정하지 않습니다.",
    points: [
      {
        title:
          "제어 응답 이후 영상 바이트는 플레이어와 전달 서버 사이를 흐릅니다",
        text: "재생 제어는 어떤 콘텐츠·표현·전송 후보를 사용할지 연결하는 역할입니다. 파일의 본문을 API 서버가 계속 중계하는 경로와 구분합니다. 따라서 제어 서비스의 요청 지연과 전달망의 전송량을 별도로 관측합니다. 단, 이미 재생 중인 세션도 토큰·라이선스 갱신 등 제어 의존성이 있을 수 있어 제어 장애와 완전히 독립적이라고 가정하면 안 됩니다.",
        refs: [],
      },
      {
        title: "파일 부재와 메모리 페이지 미스는 다른 사건입니다",
        text: "OCA에 파일이 저장돼 있어도 해당 페이지가 메모리에 없으면 저장장치 읽기가 필요합니다. 이는 콘텐츠 파일 자체가 그 거점에 없는 상황과 다릅니다. 전자는 파일 I/O 경로, 후자는 파일 배치·보유 목록·후보 선택의 문제입니다. 일반 CDN의 cache miss 시 원본 조회를 모든 OCA 요청에 그대로 가정하지 않습니다. 이 구성도에서는 사전 준비와 전송 후보를 분리해 읽습니다.",
        refs: ["sendfile", "core"],
      },
      {
        title: "50 Gb/s 페이로드는 평균 6.25 GB/s의 바이트입니다",
        text: "동시 10,000명 × 5 Mb/s = 50 Gb/s이고 8로 나누면 6.25 GB/s입니다. 하지만 이것이 곧 디스크 읽기 6.25 GB/s라는 뜻은 아닙니다. 메모리의 파일 페이지에서 보내는 비중, 파일 재사용, read amplification과 동시 fill에 따라 저장장치 요구가 달라집니다. 네트워크 전송량과 물리 디스크 읽기량을 각각 측정해야 합니다.",
        refs: ["sendfile"],
      },
      {
        title: "평균 비트레이트만큼 일정하게 보내는 부하가 아닐 수 있습니다",
        text: "플레이어가 다음 구간을 짧게 다운로드하고 쉬면 순간 전송량은 미디어 비트레이트보다 커집니다. 또 같은 콘텐츠의 오디오·여러 표현·탐색·재시도가 바이트를 만듭니다. 용량 계획에는 평균 페이로드 외에 다운로드 피크·장애 이동량·프로토콜 오버헤드를 따로 정의해야 합니다. 아래 계산기는 첫 번째 평균값만 다룹니다.",
        refs: ["abr"],
      },
    ],
    scenarios: [
      {
        id: "network",
        label: "평균 전송량",
        title: "링크 계획과 디스크 계획은 같은 수식이 아닙니다",
        path: [
          ["player", "10,000명", "평균 5 Mb/s"],
          ["ocaIcon", "50 Gb/s", "6.25 GB/s 페이로드"],
          ["routing", "71.43 Gb/s", "목표 사용률 70% 가정"],
        ],
        text: "십진 단위의 평균값입니다. 링크 목표 사용률 70%를 적용하면 50/0.7≈71.43 Gb/s입니다. 장애 예비 용량과 순간 피크는 이 70% 안에 자동으로 증명되는 값이 아닙니다. 실제 트래픽과 복구 시나리오로 따로 산정합니다.",
        code: "payload = 10,000 × 5 Mb/s = 50 Gb/s\nbytes = 50 / 8 = 6.25 GB/s\nlink = 50 / 0.70 ≈ 71.43 Gb/s\n\ndisk read rate must be measured separately",
        refs: [],
      },
      {
        id: "bottleneck",
        label: "바이트 경로",
        title: "저장장치·메모리·TLS·NIC 중 먼저 막히는 곳이 제한합니다",
        path: [
          ["storage", "파일 페이지", "메모리 적중·저장장치 읽기"],
          ["freebsd", "소켓·TLS 경로", "CPU·메모리 비용"],
          ["routing", "NIC·외부 경로", "큐·손실·용량"],
        ],
        text: "NIC가 남는다고 저장장치를 즉시 늘리지 않습니다. 인기 파일 반복에서는 메모리·암호 처리, 큰 작업 집합에서는 디스크 읽기, 특정 ISP에서는 외부 경로가 제한일 수 있습니다. 같은 파일 분포·TLS·하드웨어 조건에서 각 계층의 지표를 함께 수집합니다.",
        code: "measure together:\n  delivered bytes/s + CPU profile\n  physical disk reads/s + read latency\n  retransmissions + NIC / path utilization",
        refs: ["sendfile", "ktls"],
      },
    ],
    diagnostics: [
      [
        "OCA 평균은 정상인데 시작이 느림",
        "DNS·연결·TLS·첫 바이트와 ISP별 품질을 분리.",
        "집계 평균이 가린 경로·기기별 문제를 확인합니다.",
      ],
      [
        "NIC 여유에도 전송이 제한됨",
        "파일 페이지 적중·디스크 지연·CPU 프로파일·TLS 모드를 대조.",
        "바이트 경로의 실제 병목부터 찾습니다.",
      ],
      [
        "한 거점 장애 후 연쇄 과부하",
        "이동 시청자 × 비트레이트와 대상 거점의 잔여 용량·동일 파일을 확인.",
        "정상 상태의 총용량과 장애를 흡수할 용량을 따로 계획합니다.",
      ],
    ],
  },
  aws: {
    headline:
      "AWS라는 로고보다 재생 API 요청·응답 규칙과 의존성 예산이 먼저입니다.",
    scope:
      "제어·전달 분리를 읽기 위한 일반 API 설계 · 내부 AWS 제품·데이터베이스·넷플릭스 API 필드는 확정하지 않습니다.",
    points: [
      {
        title:
          "클라우드 사업자는 바꾸더라도 플레이어가 기대하는 계약은 정의해야 합니다",
        text: "재생 API가 돌려줄 콘텐츠 식별자·파일 버전·표현 정보·전달 URL·유효 기간·오류 의미를 먼저 정의합니다. 만료된 URL과 재생 권한 거절을 같은 재시도 오류로 처리하지 않습니다. 실제 필드명은 서비스마다 다르며, 이 사이트의 JSON은 경계를 설명하는 예제입니다. AWS 로고만으로 EC2·EKS·Lambda나 특정 DB를 추정하지 않습니다.",
        refs: ["semantics"],
      },
      {
        title: "전체 요청 제한 시간보다 긴 의존성 timeout을 둘 수 없습니다",
        text: "플레이어에 답할 전체 시간 안에 서비스 호출·직렬화·네트워크 여유를 배분해야 합니다. 두 의존성이 직렬이면 대기 시간이 누적되고, 독립적이라 병렬로 호출해도 느린 쪽이 완료 시간을 제한할 수 있습니다. 재시도는 남은 요청 제한 시간에서만 허용하고 무제한 중첩하지 않습니다. 아래 800 ms는 Netflix 수치가 아닌 예산 계산입니다.",
        refs: [],
      },
      {
        title: "제어 장애가 기존 재생에 미치는 영향은 별도로 시험합니다",
        text: "새 재생 시작이 실패해도 이미 받은 재생 정보로 파일 요청을 이어갈 수 있는 경우가 있습니다. 반대로 URL 만료·라이선스 갱신·새 후보 요청이 필요하면 기존 세션도 영향을 받습니다. ‘제어와 전달 분리’만으로 기존 세션이 끝까지 안전하다고 결론내릴 수 없습니다. 신규 시작·재생 중·탐색·갱신을 나눠 장애를 시험합니다.",
        refs: [],
      },
    ],
    scenarios: [
      {
        id: "요청 제한 시간",
        label: "지연 예산",
        title: "두 호출의 p99를 더해 API p99라고 부르지 않습니다",
        path: [
          ["player", "전체 800 ms", "가상 요청 제한 시간"],
          ["aws", "의존 서비스", "직렬·병렬 관계"],
          ["routing", "응답·네트워크", "남은 예산"],
        ],
        text: "가상 단일 요청에서 A에 250 ms, B에 300 ms, 응답 처리에 100 ms가 들면 직렬 경로는 650 ms로 여유가 150 ms입니다. 이는 한 실행의 시간 예제이며, 각 서비스 p99의 합이 전체 p99라는 뜻은 아닙니다. 분산 추적으로 실제 임계 경로와 지연 시간 분포를 확인합니다.",
        code: "illustrative request: 250 + 300 + 100 = 650 ms\n800 ms deadline - 650 ms = 150 ms remaining\n\np99(total): measure the end-to-end distribution;\ndo not infer it by summing service p99 values.",
        refs: [],
      },
      {
        id: "dependency",
        label: "장애 범위",
        title: "API 응답 성공과 이후 미디어 수신 성공을 연결해서 봅니다",
        path: [
          ["aws", "제어 응답 200", "후보·재생 정보"],
          ["player", "미디어 요청", "별도 hostname·토큰"],
          ["ocaIcon", "전달 결과", "2xx / 권한 / 경로 오류"],
        ],
        text: "제어 API 성공률이 높아도 잘못된 파일 URL·만료 시각·도달 불가능한 후보를 주면 시작 실패가 납니다. 개인정보나 토큰 원문을 로그에 남기지 않으면서 재생 시도 식별자와 파일 버전으로 제어 응답 이후의 요청을 연결하는 관측 설계가 필요합니다.",
        code: "playback attempt\n  → control API result\n  → selected content version / candidate\n  → first media request result\n  → time to first frame",
        refs: [],
      },
    ],
    diagnostics: [
      [
        "API 200인데 영상 시작 실패",
        "반환 파일·버전·URL 유효성·첫 미디어 요청 결과를 연결.",
        "제어 성공률 대신 실제 재생 시작의 성공을 확인합니다.",
      ],
      [
        "인스턴스 CPU는 낮은데 p99가 큼",
        "분산 추적의 의존성 대기·연결 풀·요청 제한 시간 소진을 확인.",
        "컴퓨팅 증설로 해결되는 병목인지 먼저 구분합니다.",
      ],
      [
        "장애 중 요청 수가 증폭됨",
        "호출 단계별 시도 횟수·timeout·전체 요청 제한 시간을 기록.",
        "겹친 재시도가 장애 의존성에 부하를 더하는지 확인합니다.",
      ],
    ],
  },
});

export const replacementDepth = resolveAssets({
  caddy: {
    title: "NGINX의 파일 경로·Range·권한 처리를 Caddy에 연결하기",
    explanation:
      "Caddy의 file_server 구현은 Range·If-Range·조건부 요청을 처리합니다. 아래는 HTTPS 자동화와 분리해 HTTP 파일 응답부터 확인하는 학습 설정입니다. ./data 아래에 같은 media/demo.bin을 준비하고 Caddy를 실행한 작업 경로를 기준으로 읽습니다.",
    code: "http://127.0.0.1:8081 {\n  root * ./data\n  file_server\n}",
    checks: [
      "NGINX root data + /media/demo.bin과 같은 파일을 찾아야 합니다. handle_path /media/*로 감싸면 /media prefix가 제거되므로 그대로 옮긴 설정이 아닙니다.",
      "전체 200·정상 Range 206·범위 초과 416·If-Range 일치/불일치를 새 서버에서 다시 요청합니다. ETag 생성 방식이 서버마다 같다고 가정하지 않고 각 서버가 돌려준 현재 ETag로 검증합니다.",
      "학습 설정의 명시적 http://는 평문 HTTP입니다. 실제 HTTPS 전환은 도메인·인증서·접근 검증·로그를 별도로 구성하고, 기존 URL의 본문·상태 계약을 유지하는지 확인합니다.",
    ],
    refs: ["caddy", "range", "ifrange"],
  },
  apache: {
    title: "NGINX의 URI 매핑과 연결 처리를 Apache 설정으로 옮기기",
    explanation:
      "DocumentRoot는 요청 URI를 파일 트리에 연결합니다. MPM은 연결 처리 모델입니다. event MPM이 있다는 이유로 모든 요청의 전체 처리가 비동기라고 해석하지 않습니다. 응답을 처리하는 worker와 keep-alive 연결 관리의 역할을 나눠 읽습니다. 아래는 기존 Apache 기본 설정에 넣을 경로 설정 조각입니다.",
    code: '# Fragment; installed modules / MPM are configured separately\nListen 127.0.0.1:8082\nDocumentRoot "/srv/video"\n<Directory "/srv/video">\n  Require all granted\n  Options -Indexes\n  AllowOverride None\n</Directory>',
    checks: [
      "/media/demo.bin → /srv/video/media/demo.bin 매핑과 파일 접근 권한을 확인합니다. NGINX location·alias를 Apache Directory·Alias에 이름만 바꿔 복사하지 않습니다.",
      "실제 활성 MPM·로드된 모듈·연결 상한과 파일 디스크립터를 확인합니다. EnableSendfile은 OS와 파일시스템 조건을 검토하며, 켰다는 사실로 TLS 경로까지 같다고 보지 않습니다.",
      "동일 파일·클라이언트 속도·TLS·작업 집합에서 상태·Range·ETag·전송 바이트와 CPU를 비교합니다. 이벤트 방식이라는 명칭으로 처리량 우위를 미리 정하지 않습니다.",
    ],
    refs: ["apache", "range"],
  },
  cloudfront: {
    title: "사전 배치 전달망을 origin·behavior·cache policy로 다시 구성하기",
    explanation:
      "CloudFront에서는 distribution의 경로 behavior로 원본과 캐시 정책을 연결합니다. 요청 시 원본 조회가 가능한 구성을 만들고, 파일이 사전에 OCA에 있다는 기존 가정은 새 CDN에서도 성립하는지 별도로 확인해야 합니다. 아래는 제품 설정 문법이 아닌 설계 매핑입니다.",
    code: "versioned media path → behavior → origin\nobject identity      → cache policy / cache key\nviewer access        → authorization policy\norigin access        → origin protection\nplayback URLs        → distribution hostname / domain",
    checks: [
      "캐시 키에서 화질·파일 버전처럼 바이트를 바꾸는 값을 보존합니다. 토큰의 키 포함 여부와 요청별 접근 검증을 별도로 설계합니다. 보존 AWS 문서의 minimum TTL 설정은 원본 캐시 헤더에 영향을 줄 수 있으므로 현재 정책을 확인합니다.",
      "아직 캐시되지 않은 파일·대량 동시 미스·오래된 URL·원본 거절·Range 요청을 시험합니다. 캐시 적중률과 함께 원본 바이트·오류·첫 바이트·ISP별 재생 시작을 봅니다.",
      "플레이어가 받는 도메인·서명·유효 기간·파일 버전이 연결돼야 합니다. CDN 도입만으로 인코딩·DRM·재생 제어 API까지 구현되지는 않습니다.",
    ],
    refs: ["cachekey", "caching", "range"],
  },
  fastly: {
    title: "전달 서버 목록 대신 서비스·원본·캐시 정책을 연결하기",
    explanation:
      "Fastly의 원본 연결과 캐시·무효화 기능으로 전달 역할을 구성하는 선택입니다. 기존 OCA 파일 보유 목록·사전 배치 알고리즘을 그대로 Fastly 설정으로 옮기는 관계는 아닙니다. 아래 항목은 제품별 최신 정책과 함께 검증할 이관 항목입니다.",
    code: "origin + domain → delivery service\nversioned URL  → shared object identity\ncontent update → new version / invalidation policy\nedge miss      → reachable, authorized origin",
    checks: [
      "원본의 Host·TLS·접근 권한과 파일 경로를 정의합니다. edge hit와 miss가 같은 버전·바이트·Content-Type을 주는지 확인합니다.",
      "무효화 범위와 버전 URL의 책임을 나눕니다. 객체를 지우는 동작만으로 이미 내려간 목록·파일 인덱스·클라이언트 캐시가 동시에 바뀐다고 가정하지 않습니다.",
      "대상 ISP별 구간 수신 시간·원본 요청 증폭·전송량·재시도 바이트를 같은 조건에서 관측합니다. 구체적인 TTL·대형 객체·Range 지원 조건은 Fastly의 현재 제품 문서로 결정합니다.",
    ],
    refs: ["caching", "range"],
  },
  cloudflare: {
    title: "프록시 도메인·캐시 규칙·원본 정책의 경계를 맞추기",
    explanation:
      "Cloudflare의 공식 문서는 Origin Cache Control 적용 여부에 따라 no-cache 등의 처리 차이를 설명합니다. HTTP 지시어 이름만 보고 실제 캐시 결과를 추정하지 않고, 현재 규칙·원본 응답·캐시 상태를 함께 확인합니다. 인코딩·영상 관리 제품인 Stream과 일반 CDN의 계약 범위도 구분합니다.",
    code: "requested URL → cache rules → cache eligibility\ncache miss    → origin request / response\ncache control → effective freshness / revalidation policy",
    checks: [
      "원본이 보내는 Cache-Control과 적용 중인 cache rule을 함께 기록합니다. 캐시 hit·miss·재검증을 구분하고 no-cache와 no-store를 같은 뜻으로 쓰지 않습니다.",
      "사용자 권한에 따라 응답이 바뀌는 경로는 공유 저장 허용 여부부터 정의합니다. 미디어 바이트를 공유하더라도 매 요청의 접근 검증과 토큰 만료가 지켜지는지 시험합니다.",
      "대형 파일·Range·영상 사용 범위·플랜 조건은 현재 제품 문서를 확인합니다. 일반 CDN에서 플레이어·인코딩·DRM 라이선스가 자동으로 제공된다고 가정하지 않습니다.",
    ],
    refs: ["cf", "caching", "range"],
  },
  ubuntu: {
    title: "FreeBSD의 튜닝 값을 복사하지 않고 Linux 경로를 확인하기",
    explanation:
      "HTTP 파일 응답이라는 상위 계층의 동작을 유지하면서 커널·드라이버·패키지·서비스 관리 환경을 Ubuntu Server로 옮기는 작업입니다. NGINX의 이벤트 방식은 Linux에서 epoll을 사용할 수 있지만, aio·directio·sendfile의 조건은 FreeBSD와 다릅니다.",
    code: "nginx -V\nulimit -n\nsystemctl show nginx -p LimitNOFILE\nss -tin\n\n# Observe first; these commands do not tune the system.",
    checks: [
      "패키지 버전·빌드 모듈·서비스 계정·파일 경로·OS 및 서비스 FD 한도를 확인합니다. 셸의 ulimit만 바꾸고 서비스 프로세스에도 적용됐다고 가정하지 않습니다.",
      "명시적 use kqueue 같은 FreeBSD 전용 설정을 점검합니다. Linux의 aio on·directio 정렬 조건, aio threads 빌드 조건을 해당 NGINX 버전 문서와 대조합니다.",
      "메모리에 있는 파일·없는 파일·TLS·NIC·동시 접속·수신 속도를 맞춰 요청·응답 규칙과 자원 사용을 검증합니다. FreeBSD KTLS 모드와 Linux 환경이 이름만 같아 동일 경로라고 보지 않습니다.",
    ],
    refs: ["events", "core", "workers", "ktls"],
  },
  debian: {
    title: "Debian의 패키지·서비스 환경에서 같은 파일 응답 규칙 만들기",
    explanation:
      "Debian은 커뮤니티 배포판이며 CDN 제품이 아닙니다. OS 이관에서는 설치된 NGINX의 빌드 옵션·보안 업데이트·서비스 제한·스토리지 마운트와 네트워크 설정을 다시 구성해야 합니다. 아래는 Linux 환경에서의 관측 예시이며 변경 명령은 아닙니다.",
    code: "nginx -V\ncat /proc/<nginx-worker-pid>/limits\nss -tin\n\n# Compare effective limits and the real installed build.",
    checks: [
      "패키지 저장소·업데이트 경로·서비스 계정·실제 프로세스 한도를 확인합니다. 설정 파일만 같아도 모듈·인증서·권한·파일 경로는 다를 수 있습니다.",
      "kqueue 의존 코드·FreeBSD sendfile API·커널 모듈·네트워크 튜닝을 이관 목록에 넣습니다. NGINX를 재빌드하는 경우 패키지 보안 업데이트를 어떻게 받을지도 정합니다.",
      "Range·If-Range·없는 파일·부분 전송·느린 수신자와 TLS를 포함해 검증합니다. 같은 파일 분포와 하드웨어 조건에서 전송량·지연·CPU·디스크 읽기를 함께 기록합니다.",
    ],
    refs: ["events", "core", "sendfile", "range"],
  },
  gcp: {
    title: "AWS라는 범위를 실제 실행·데이터·권한 계약으로 분해하기",
    explanation:
      "이 사례는 AWS의 구체적인 실행 제품을 확정하지 않습니다. 따라서 실제 AWS 서비스의 확인 없이 EC2→Compute Engine, EKS→GKE처럼 전환을 완료했다고 말할 수 없습니다. VM·컨테이너·관리형 실행 선택은 확인된 현재 워크로드의 배포·네트워크·상태 요구에서 시작합니다.",
    code: "inventory actual AWS services first\n  → runtime / deployment / network\n  → data consistency / migration\n  → identity / secrets / observability\n  → playback API contract / deadline",
    checks: [
      "플레이어 API의 응답·오류·URL 만료·후보 파일 버전을 유지합니다. 클라우드 변경과 CDN 도메인 변경을 별도 계약으로 관리합니다.",
      "현재 DB·큐·객체 저장소·IAM 의존성을 목록화하고 데이터 일관성·백필·전환 순서를 설계합니다. 플랫폼 로고만으로 관리형 서비스가 일대일 호환된다고 가정하지 않습니다.",
      "의존성 지연·p99·신규 재생 성공·토큰 및 라이선스 갱신·장애 복구를 검증합니다. 실행 인스턴스가 정상인 것만으로 재생 제어 이관의 완료를 판단하지 않습니다.",
    ],
    refs: [],
  },
  azure: {
    title: "Azure 실행 환경으로 옮겨도 재생 API·데이터·인증의 의미를 유지하기",
    explanation:
      "VM·컨테이너 등 Azure의 실행 제품은 실제 서비스가 요구하는 배포 방식에 맞춰 선택합니다. AWS로 표시된 제어 영역을 Azure로 바꾸는 것은 URL 하나를 바꾸는 작업보다 넓습니다. 현재 제품이 미확정인 이 구성도에서는 이관할 책임과 검증 기준을 명시합니다.",
    code: "playback request / response → stable public contract\nservice runtime            → selected Azure runtime\nidentity and data          → explicit migration plan\nmedia delivery             → separate CDN decision",
    checks: [
      "플레이어 응답·권한 거절·파일 버전·토큰 만료를 비교합니다. 새로운 네트워크 경로에서 전달 URL·인증서·원본 접근이 정상인지 확인합니다.",
      "현재 AWS의 데이터·IAM·큐·비밀 관리·관측 기능을 실제 제품 단위로 확인한 뒤 대응 기능을 선정합니다. 재배포와 데이터 이관·전환 시점을 구분합니다.",
      "정상 요청뿐 아니라 리전·의존 서비스 장애, 중복 재시도, 재생 중 갱신을 시험합니다. 공통 기준은 API 지연과 실제 재생 시작·유지의 성공입니다.",
    ],
    refs: [],
  },
});
