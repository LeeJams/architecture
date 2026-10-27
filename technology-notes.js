"use strict";

// Explanatory models are deliberately separate from claims about Netflix's deployment.
const technologyNotes = [
  {
    key: "oca", node: "oca", title: "Open Connect Appliance", short: "OCA · 전달 거점",
    category: "영상 전달망", image: "assets/tech/oca-icon.svg",
    question: "왜 영상을 클라우드 API 서버에서 바로 보내지 않을까?",
    intro: "OCA는 인코딩이 끝난 영상 파일을 저장하고 HTTP로 전달하는 전용 서버입니다. 사용자와 가까운 ISP 내부나 피어링 거점에 콘텐츠를 두어, 긴 네트워크 구간을 반복해서 지나는 영상 트래픽을 줄입니다.",
    scope: "OCA의 위치와 역할은 공개 설계의 요약입니다. 아래 용량 계산과 운영 시나리오는 학습용 가정입니다.",
    problem: "재생 요청은 짧지만 영상 응답은 오랫동안 이어집니다. API 요청 수가 같아도 동시 시청자와 화질이 늘면 필요한 전송 대역폭이 커집니다. 영상을 제어 API에서 중계하면 API 처리와 대용량 전송의 증설·장애 범위가 얽힙니다.",
    steps: [
      ["storage", "파일 준비", "시청 전에 인코딩된 파일을 거점 저장장치에 배치합니다."],
      ["routing", "후보 안내", "제어 경로에서 해당 파일을 보유한 전송 후보를 안내합니다."],
      ["ocaIcon", "직접 응답", "플레이어가 OCA에 요청하고, OCA가 영상 바이트를 보냅니다."],
      ["player", "연속 재생", "플레이어는 버퍼를 채우며 필요한 다음 구간을 요청합니다."]
    ],
    mechanics: [
      ["가까움은 네트워크 경로의 문제", "같은 도시라는 사실만으로 좋은 서버가 되지는 않습니다. 사용자의 ISP에서 접근 가능한 경로, 파일 보유 여부, 현재 용량이 함께 맞아야 합니다. 물리적 거리와 실제 전송 품질은 다릅니다."],
      ["디스크와 네트워크의 균형", "대부분 메모리에 있는 인기 파일을 보내는 경우와, 여러 디스크에서 서로 다른 파일을 읽는 경우는 부하가 다릅니다. NIC가 남아 있어도 디스크 읽기 지연이나 CPU의 TLS 처리 때문에 처리량이 제한될 수 있습니다."],
      ["장애 시에도 필요한 여유", "한 거점의 시청자가 다른 거점으로 이동하면 대체 거점의 링크와 파일 보유 상태가 중요해집니다. 정상 시 최대 처리량만 채우는 설계로는 장애를 흡수하기 어렵습니다."]
    ],
    example: {
      title: "동시 시청자 수를 전송 용량으로 바꿔보기", kind: "capacity",
      text: "시청자 10,000명 × 평균 5 Mb/s = 영상 페이로드 50 Gb/s입니다. 목표 링크 사용률을 70%로 두면 단순 계산상 약 71.4 Gb/s의 링크 용량이 필요합니다. 평균값이므로 순간 다운로드 피크와 장애 이동량은 별도로 더해야 합니다.",
      caveat: "십진 단위(Mb/s·Gb/s)를 사용합니다. 패킷·TLS 오버헤드, 오디오, 재전송, 피크와 장애 예비 용량은 이 계산에 포함하지 않았습니다. 실제 OCA의 성능 수치가 아닙니다."
    },
    metrics: [
      ["링크 사용률·재전송", "포화가 보이면 디스크 증설보다 네트워크 경로와 용량을 먼저 점검합니다."],
      ["디스크 읽기 지연·CPU", "링크가 남아 있는데 전송이 느리면 파일 읽기, 암호화와 I/O 경로를 분리해 측정합니다."],
      ["시작 시간·재버퍼링", "서버의 평균 처리량이 좋아도 특정 ISP의 시청 품질이 나쁠 수 있습니다. 기기·ISP·시간대로 나눠 봅니다."]
    ],
    takeaway: "OCA를 선택한다는 것은 HTTP 서버 하나를 설치하는 것보다 넓은 결정입니다. 저장·배치·경로·전송 용량을 하나의 전달망으로 운영할 수 있는지가 핵심입니다.",
    sources: [
      ["Netflix Open Connect · 전달망 개요", "https://openconnect.netflix.com/en/", "공개 사례 · 원문 재확인 필요"],
      ["Open Connect Appliances · 장비와 소프트웨어", "https://openconnect.netflix.com/en/appliances/", "공개 사례 · 현재 장비 사양을 가정하지 않음"]
    ]
  },
  {
    key: "aws", node: "playback", title: "AWS와 재생 제어", short: "AWS · 재생 제어",
    category: "재생 제어", image: "assets/tech/aws.svg",
    question: "제어 경로와 영상 전송 경로는 무엇을 기준으로 나눌까?",
    intro: "클라우드의 재생 관련 서비스는 플레이어가 무엇을, 어디서 받을지 연결합니다. 실제 영상 파일의 바이트는 전송 거점이 보냅니다. AWS는 이 제어 서비스를 실행하는 플랫폼의 이름이며 단일 서버 제품의 이름은 아닙니다.",
    scope: "아래 API 응답과 서비스 분해는 역할을 설명하는 가상 설계입니다. 넷플릭스의 내부 API나 EC2·EKS·Lambda 사용을 재현하지 않습니다.",
    problem: "재생 허용 여부와 전송 후보를 빠르게 결정하는 일은 짧은 응답의 지연·가용성이 중요합니다. 수십 분 동안 바이트를 전송하는 일은 대역폭·저장장치·전달 비용이 중요합니다. 두 부하를 같은 방식으로 확장하면 한쪽의 병목이 다른 쪽에 영향을 줍니다.",
    steps: [
      ["player", "재생 요청", "플레이어가 선택한 콘텐츠와 기기에 필요한 정보를 요청합니다."],
      ["aws", "제어 처리", "재생에 필요한 정보와 정책 판단을 서비스가 처리합니다."],
      ["routing", "후보 전달", "재생 정보와 사용할 수 있는 전달 경로를 연결합니다."],
      ["ocaIcon", "영상 요청", "플레이어는 전달 서버에 별도로 영상 데이터를 요청합니다."]
    ],
    mechanics: [
      ["서로 다른 증설 단위", "API는 초당 요청 수, 처리 시간, CPU와 하위 서비스 지연을 봅니다. 전달망은 동시 시청자, 평균·피크 비트레이트와 링크 사용률을 봅니다. 제어와 전송을 나누면 각 부하에 맞춰 따로 용량을 계획할 수 있습니다."],
      ["가용성은 의존 서비스까지 포함", "API 인스턴스가 살아 있어도 사용자 상태나 콘텐츠 정보를 읽는 하위 서비스가 느리면 재생 시작이 늦어집니다. 시간 제한, 제한된 재시도와 실패 시 응답 정책을 함께 설계해야 합니다."],
      ["컴퓨팅 제품은 다음 결정", "가상 설계라면 VM은 OS·배포 제어, 관리형 컨테이너는 배포·스케줄링, 함수형 실행은 짧고 변동적인 작업에서 비교할 수 있습니다. 유휴 비용, 시작 지연, 네트워크 연결과 팀 경험이 달라집니다."]
    ],
    example: {
      title: "제어 응답에는 영상 본문 대신 다음 행동이 담깁니다", language: "JSON · 가상 API",
      text: "다음은 재생 제어와 영상 전송의 구분를 설명하기 위한 가상 응답입니다. 만료 시각, 토큰 검증과 DRM 라이선스 처리의 구체적인 방식은 별도의 설계가 필요합니다.",
      code: '{\n  "contentId": "film-demo",\n  "manifestUrl": "https://media.example/film-demo/manifest",\n  "deliveryCandidates": [\n    "https://edge-a.example",\n    "https://edge-b.example"\n  ]\n}',
      caveat: "example 도메인과 필드명은 설명용입니다. 후보가 둘이라는 사실도 넷플릭스의 실제 구현을 뜻하지 않습니다."
    },
    metrics: [
      ["재생 API p95·p99 지연", "평균보다 느린 요청의 꼬리가 시작 경험에 미치는 영향을 확인합니다."],
      ["초당 요청·오류·의존성 지연", "API 자체의 CPU 부족인지 하위 서비스 대기인지 구분합니다."],
      ["요청당 비용·리전 장애 복구", "정상 운영 비용과 리전 손실 시의 복구 목표를 함께 평가합니다."]
    ],
    takeaway: "클라우드 사업자와 CDN 사업자는 별도의 선택 축입니다. 먼저 제어와 전송의 부하·장애 범위를 나누고, 그 뒤에 각 역할에 맞는 제품을 고릅니다.",
    sources: [
      ["Netflix Open Connect · 제어와 전달 구조", "https://openconnect.netflix.com/en/", "공개 사례 · 원문 재확인 필요"],
      ["AWS · Netflix 고객 사례", "https://aws.amazon.com/solutions/case-studies/netflix/", "추가 읽기 · 원문 재확인 필요"]
    ]
  },
  {
    key: "freebsd", node: "oca", title: "FreeBSD와 파일 전송 경로", short: "FreeBSD · 운영체제",
    category: "운영체제", image: "assets/tech/freebsd.svg",
    question: "HTTP 서버 아래에서 운영체제는 어떤 일을 할까?",
    intro: "FreeBSD는 커널, 네트워크 스택, 파일시스템과 기본 도구를 함께 제공하는 운영체제입니다. 전송 서버에서는 파일을 읽고 메모리를 관리하고, 소켓을 통해 NIC로 보내는 경로의 기반이 됩니다.",
    scope: "kqueue·sendfile은 공식 매뉴얼로 확인한 일반 기능입니다. 특정 OCA 버전의 튜닝 값·TLS 경로·성능 수치를 뜻하지 않습니다.",
    problem: "수많은 연결에 큰 파일을 보내면 애플리케이션 코드 외에도 메모리 복사, 시스템 호출, 디스크 대기와 네트워크 큐에 비용이 듭니다. 웹 서버가 효율적이어도 운영체제와 드라이버 경로가 병목이면 링크를 충분히 사용하지 못합니다.",
    steps: [
      ["nginx", "응답 결정", "HTTP 서버가 보낼 파일과 바이트 범위를 결정합니다."],
      ["freebsd", "이벤트 통지", "kqueue 같은 기능으로 소켓의 읽기·쓰기 가능 상태를 감지합니다."],
      ["storage", "파일 접근", "메모리의 파일 페이지를 활용하거나 저장장치에서 읽습니다."],
      ["https", "네트워크 출력", "커널의 소켓·네트워크 스택과 NIC가 데이터를 전달합니다."]
    ],
    mechanics: [
      ["kqueue: 연결마다 기다리는 일을 줄이기", "여러 파일 디스크립터의 상태 변화를 이벤트로 받아 처리합니다. 한 연결이 쓸 수 있을 때 작업을 진행하고, 쓸 수 없으면 다른 연결로 넘어가는 이벤트 기반 서버를 구성할 수 있습니다. Linux에서는 epoll이 유사한 역할을 맡습니다."],
      ["sendfile: 파일에서 소켓으로", "일반적인 read → 사용자 공간 버퍼 → write 경로 대신 파일 디스크립터와 소켓을 커널에 넘겨 전송합니다. 애플리케이션을 오가는 복사와 호출 부담을 줄일 여지가 있습니다. 흔히 zero-copy라고 부르지만 디스크 읽기나 모든 내부 복사까지 사라진다는 뜻은 아닙니다."],
      ["완료되지 않은 전송도 처리해야 함", "비차단 소켓의 sendfile은 요청한 양보다 적게 보내고 EAGAIN을 반환할 수 있습니다. 전송한 바이트 수를 기억하고 쓰기 가능 이벤트가 오면 나머지를 이어 보내야 합니다. TLS 적용 시 경로는 커널·라이브러리·하드웨어 지원에 따라 달라집니다."]
    ],
    example: {
      title: "같은 파일을 보내도 데이터가 지나는 경로가 다릅니다", language: "개념 경로",
      text: "아래 두 경로는 비용이 생기는 위치를 비교하는 단순화입니다. sendfile을 사용하더라도 캐시 미스, 암호화와 드라이버 처리 비용은 측정해야 합니다.",
      code: 'read / write\n  file → kernel → application buffer → kernel → socket\n\nsendfile\n  file → kernel-managed transfer → socket\n\nnon-blocking socket\n  partial send → remember offset → wait writable → resume',
      caveat: "FreeBSD와 Linux의 sendfile 시그니처·동작은 완전히 같지 않습니다. 이 경로도는 호출 가능한 프로그램이 아닙니다."
    },
    metrics: [
      ["전송 Gb/s당 CPU·메모리 대역폭", "처리량만 비교하지 않고 같은 바이트를 보내는 데 드는 자원을 비교합니다."],
      ["파일 캐시 적중·디스크 지연", "메모리에 있는 파일과 없는 파일을 구분해 부하를 만듭니다."],
      ["재전송·NIC 큐·연결 수", "네트워크 혼잡, 드라이버와 소켓 자원 제한을 나눠 확인합니다."]
    ],
    takeaway: "운영체제의 우열은 이름으로 결정되지 않습니다. 동일 하드웨어·파일 분포·TLS 조건에서 처리량과 지연, CPU 비용, 장애 분석 가능성을 함께 비교해야 합니다.",
    sources: [
      ["FreeBSD sendfile(2) · 공식 소스의 매뉴얼", "https://github.com/freebsd/freebsd-src/blob/main/lib/libsys/sendfile.2", "확인한 원문 · 파일→소켓, 부분 전송과 EAGAIN"],
      ["FreeBSD kqueue(2) · 공식 소스의 매뉴얼", "https://github.com/freebsd/freebsd-src/blob/main/lib/libsys/kqueue.2", "확인한 원문 · 이벤트 통지"],
      ["FreeBSD ktls(4) · 공식 매뉴얼", "https://github.com/freebsd/freebsd-src/blob/main/share/man/man4/ktls.4", "확인한 원문 · 사용자 공간의 연결 협상, 커널 SW 및 NIC 모드"],
      ["NGINX connection processing methods", "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/events.xml", "확인한 원문 · kqueue와 epoll"]
    ]
  },
  {
    key: "nginx", node: "oca", title: "NGINX와 정적 파일 응답", short: "NGINX · HTTP 서버",
    category: "HTTP 서버", image: "assets/tech/nginx-mark.svg",
    question: "연결이 많을 때 파일 응답을 어떻게 처리할까?",
    intro: "NGINX는 HTTP 요청을 받아 파일 응답이나 프록시 처리를 수행하는 서버입니다. 이 사례에서 살펴볼 역할은 이미 만들어진 영상 파일의 전달입니다. 인코딩, 화질 선택과 전송 거점 선택은 각각 다른 역할입니다.",
    scope: "이벤트 처리와 설정 지시어는 NGINX 공식 문서의 일반 기능입니다. 예제는 Netflix 설정이 아닌 로컬 학습용입니다.",
    problem: "느린 클라이언트 연결을 각각 기다리는 방식은 동시 연결이 늘수록 비효율적일 수 있습니다. NGINX는 worker 프로세스가 여러 연결의 이벤트를 처리하도록 구성해, 한 연결이 대기하는 동안 다른 연결의 작업을 진행합니다.",
    steps: [
      ["player", "HTTP 요청", "경로와 필요하면 Range 헤더로 필요한 데이터를 요청합니다."],
      ["nginx", "URI → 파일", "location·root 같은 설정으로 응답할 파일을 찾습니다."],
      ["freebsd", "I/O 처리", "이벤트와 파일 전송 기능을 이용해 준비된 데이터를 보냅니다."],
      ["https", "상태와 본문", "200·206·404 같은 상태와 헤더, 파일 데이터를 응답합니다."]
    ],
    mechanics: [
      ["master와 worker", "master는 설정을 읽고 작업자 프로세스를 관리하며, 작업자 프로세스가 요청 처리를 담당합니다. 이벤트 방식은 운영체제에 맞춰 선택됩니다. 작업자 프로세스 수·연결 수와 파일 디스크립터 한도는 함께 검토해야 합니다."],
      ["비동기 네트워크가 디스크 대기까지 없애지는 않음", "소켓 이벤트 처리가 효율적이어도 캐시에 없는 파일을 읽는 작업은 지연을 만들 수 있습니다. sendfile, AIO, thread pool의 적용 조건은 OS와 빌드에 따라 다릅니다. 설정 이름만 보고 모두 켜면 되는 문제가 아닙니다."],
      ["파일 응답과 프록시 캐시는 다른 기능", "아래 root 설정은 로컬 파일을 응답합니다. proxy_pass·proxy_cache로 원본 응답을 저장하는 구성이 아닙니다. NGINX 설치만으로 사전 배치, ISP 연동과 거점 선택이 생기지는 않습니다."]
    ],
    example: {
      title: "실제로 실행 검증한 로컬 파일 응답 설정", language: "nginx.conf · 학습용",
      text: "/media/demo.bin 요청은 NGINX prefix 아래 data/media/demo.bin으로 연결됩니다. 아래 실습 링크의 스크립트가 10,000바이트 파일을 준비하고 상태·헤더·본문을 검증합니다. 파일이 없으면 404를 반환합니다.",
      code: "daemon off;\npid logs/nginx.pid;\nerror_log logs/error.log;\nworker_processes 1;\n\nevents { worker_connections 128; }\n\nhttp {\n  default_type application/octet-stream;\n  log_format delivery '$status bytes=$body_bytes_sent seconds=$request_time range=\"$http_range\"';\n  access_log logs/access.log delivery;\n  sendfile on;\n\n  server {\n    listen 127.0.0.1:8080;\n    location /media/ {\n      root data;\n      try_files $uri =404;\n    }\n  }\n}",
      caveat: "루프백 HTTP 실습 예제입니다. TLS·인증·캐시·접근 제어는 생략했습니다. worker_connections=128은 작은 실습 값이며 이 예제를 운영 환경에 그대로 적용하지 않습니다."
    },
    metrics: [
      ["활성 연결·파일 디스크립터", "연결 한도와 OS 한도를 같이 확인하고, 단순 동시 접속 숫자만 늘리지 않습니다."],
      ["첫 바이트·완료 시간·전송량", "파일 크기와 클라이언트 속도가 달라도 비교할 수 있게 나눠 측정합니다."],
      ["4xx·5xx·작업자 프로세스의 CPU·디스크 지연", "없는 파일, 접근 오류, 자원 부족과 저장장치 지연을 구분합니다."]
    ],
    takeaway: "NGINX를 선택하는 이유를 ‘빠르다’에서 끝내지 않습니다. 어떤 연결·파일·TLS 부하를 처리하고, 어떤 운영 기능을 필요로 하는지 먼저 정해야 대안을 비교할 수 있습니다.",
    sources: [
      ["NGINX Beginner’s Guide · 공식 문서 소스", "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/beginners_guide.xml", "확인한 원문 · master/worker, 정적 콘텐츠"],
      ["NGINX HTTP core · 공식 문서 소스", "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/http/ngx_http_core_module.xml", "확인한 원문 · root, try_files, sendfile, aio"],
      ["Caddy Automatic HTTPS", "https://caddyserver.com/docs/automatic-https", "대안 추가 읽기 · 원문 재확인 필요"]
    ]
  },
  {
    key: "https", node: "oca", title: "HTTP(S), Range와 연결", short: "HTTP(S) · 전송",
    category: "전송 프로토콜", image: "assets/tech/https.svg",
    question: "영상은 하나의 긴 파일일까, 여러 요청일까?",
    intro: "HTTP는 리소스를 요청하고 상태·헤더·본문으로 응답하는 규칙입니다. 플레이어는 독립된 미디어 구간 파일을 요청하거나 큰 파일의 일부 바이트를 요청할 수 있습니다. HTTPS는 그 통신을 TLS로 보호합니다.",
    scope: "HTTP 동작을 설명하는 일반 예제입니다. Netflix가 쓰는 특정 HTTP 버전·파일 패키징·URL 형식을 확정하지 않습니다.",
    problem: "영상을 끝까지 받은 뒤 재생하면 시작이 늦어집니다. 필요한 구간부터 받아 버퍼에 넣고, 사용자가 탐색하면 다른 구간을 요청할 수 있어야 합니다. 구간 파일과 바이트 범위는 이를 구현하는 서로 다른 방법입니다.",
    steps: [
      ["player", "구간 선택", "재생 위치와 버퍼를 보고 다음에 받을 구간을 정합니다."],
      ["https", "요청 전송", "파일 URL 또는 Range로 필요한 바이트를 요청합니다."],
      ["nginx", "응답 검증", "상태·Content-Range·길이와 리소스 버전을 확인합니다."],
      ["player", "버퍼에 연결", "받은 미디어를 디코더에 전달하고 다음 요청을 이어갑니다."]
    ],
    mechanics: [
      ["Range와 206 Partial Content", "Range: bytes=0-1023은 양 끝을 포함한 1,024바이트를 요청합니다. 서버가 지원하고 수락하면 206과 Content-Range를 돌려줍니다. 범위가 유효하지 않으면 416이 올 수 있고, Range가 무시되어 전체 200 응답이 올 수도 있어 클라이언트가 확인해야 합니다."],
      ["TLS와 DRM은 보호하는 범위가 다름", "TLS는 통신 상대를 인증하고 전송 중의 기밀성과 무결성을 보호합니다. 콘텐츠 파일의 사용 권한·복호화 라이선스를 관리하는 DRM과는 별개입니다. HTTPS만으로 콘텐츠 이용 권한 관리가 완성되지는 않습니다."],
      ["HTTP/2와 HTTP/3의 선택", "HTTP/2는 한 TCP 연결 위에 여러 스트림을 다중화하지만 패킷 손실에 따른 TCP의 대기가 다른 스트림에 영향을 줄 수 있습니다. HTTP/3는 QUIC을 사용해 스트림 간 그 대기를 줄이도록 설계됩니다. UDP 경로·기기 지원·CPU 비용을 확인해야 하며 혼잡과 모든 지연이 사라지는 것은 아닙니다."]
    ],
    example: {
      title: "1,024바이트 요청을 헤더로 읽기", language: "HTTP/1.1 · 가상 리소스",
      text: "전체 파일 크기가 10,000바이트라고 가정합니다. Content-Length는 이번 응답 본문의 길이이고, Content-Range의 /10000은 전체 리소스 크기입니다.",
      code: 'GET /film-demo.mp4 HTTP/1.1\nHost: edge.example\nRange: bytes=0-1023\n\nHTTP/1.1 206 Partial Content\nAccept-Ranges: bytes\nContent-Range: bytes 0-1023/10000\nContent-Length: 1024\n\n[1,024 bytes of body]',
      caveat: "각 미디어 구간이 별도 파일이면 일반 GET과 200으로 전달할 수도 있습니다. 영상 전달에 항상 Range가 필요하다는 뜻은 아닙니다."
    },
    metrics: [
      ["DNS·연결·TLS·첫 바이트", "요청 시간이 길어지는 구간을 분해해 관측합니다."],
      ["다운로드 시간 / 구간 재생 시간", "지속적으로 1보다 크면 현재 화질을 유지할 때 버퍼가 줄어듭니다."],
      ["206·416·200 분포와 재시도", "부분 전송이 예상대로 동작하는지, 같은 바이트를 낭비해 받는지 확인합니다."]
    ],
    takeaway: "코덱은 영상 압축, 패키징은 구간의 묶음, HTTP는 전달 규칙, TLS는 전송 보호입니다. 이 계층을 나눠야 ‘어떤 기술을 바꿀지’도 정확하게 말할 수 있습니다.",
    sources: [
      ["MDN HTTP Range requests · 공식 문서 소스", "https://github.com/mdn/content/blob/main/files/en-us/web/http/guides/range_requests/index.md", "확인한 원문 · Range, 206, Content-Range"],
      ["MDN Evolution of HTTP · 공식 문서 소스", "https://github.com/mdn/content/blob/main/files/en-us/web/http/guides/evolution_of_http/index.md", "확인한 원문 · HTTP/2와 HTTP/3"],
      ["RFC 9110 · HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", "확인한 HTTP Working Group 원문 · Range, If-Range와 상태 코드"],
      ["RFC 8446 · TLS 1.3", "https://www.rfc-editor.org/rfc/rfc8446", "표준 추가 읽기 · 원문 재확인 필요"]
    ]
  },
  {
    key: "fill", node: "fill", title: "콘텐츠 배치와 캐시 정책", short: "Fill · 콘텐츠 배치",
    category: "콘텐츠 배치", image: "assets/tech/fill.svg",
    question: "한 번도 요청되지 않은 영상을 언제 거점에 넣을까?",
    intro: "사전 배치는 요청이 오기 전에 파일을 거점에 준비하는 방식입니다. 반대로 요청 시 가져오는 캐시는 파일이 없을 때 상위 서버에서 받아 저장합니다. 저장 공간, 준비 트래픽과 첫 시청 지연 사이의 선택입니다.",
    scope: "Open Connect의 사전 준비 역할을 설명합니다. 아래 캐시 키·TTL·혼합 전략은 일반 CDN 설계이며 OCA의 내부 정책을 뜻하지 않습니다.",
    problem: "모든 콘텐츠의 모든 화질·오디오를 모든 거점에 넣으면 저장 용량과 배치 트래픽이 커집니다. 너무 적게 넣으면 첫 요청이 원본을 기다리거나 다른 거점으로 이동해야 합니다. 콘텐츠의 지역 수요와 최신성까지 고려해야 합니다.",
    steps: [
      ["storage", "파일 목록", "인코딩·버전·크기와 재생 가능한 파일 목록을 관리합니다."],
      ["fill", "배치 계획", "예상 수요, 저장 용량과 전송 가능한 시간을 고려합니다."],
      ["ocaIcon", "전송·검증", "파일을 옮기고 무결성과 실제 제공 가능 상태를 확인합니다."],
      ["routing", "상태 반영", "파일을 제공할 준비가 된 거점을 선택에 반영합니다."]
    ],
    mechanics: [
      ["요청 적중률과 바이트 적중률", "작은 파일 99개와 1 GB 파일 하나를 요청한다고 가정하면, 작은 파일만 적중해도 요청 적중률은 99%입니다. 하지만 큰 파일의 미스가 원본 트래픽 대부분을 차지할 수 있습니다. 영상에서는 바이트 기준으로도 봐야 합니다."],
      ["캐시 키가 조각내는 공간", "같은 파일인데 쿼리나 헤더 값이 캐시 키에 불필요하게 들어가면 별도 객체로 저장되어 적중률이 낮아질 수 있습니다. 반대로 권한이나 표현이 다른 응답을 같은 키로 섞으면 안 됩니다. 어떤 값이 바이트를 바꾸는지부터 정의합니다."],
      ["불변 파일과 바뀌는 목록", "버전이 들어간 미디어 파일은 같은 URL의 바이트를 유지하고 길게 보관하는 정책을 검토할 수 있습니다. 바뀔 수 있는 목록·권한 응답은 별도로 다룹니다. TTL만 조정하면 되는 것이 아니라 키, 무효화, 접근 검증과 만료 정책을 함께 설계합니다."]
    ],
    example: {
      title: "같은 영상도 파일과 목록의 정책을 나눠 생각하기", language: "정책 메모 · 가상 설계",
      text: "다음은 URL과 캐시의 책임을 나누는 설계 메모입니다. 특정 CDN의 설정 문법이 아니며 실제 인증 콘텐츠의 캐시·토큰 검증은 제품 동작에 맞게 확인해야 합니다.",
      code: 'versioned media\n  /film-demo/v3/720p/segment-001.m4s\n  same URL → same bytes\n\nmutable playback information\n  /film-demo/playback\n  freshness + authorization policy\n\nbyte hit ratio\n  bytes served from cache / total delivered bytes',
      caveat: "개인별 재생 정보나 권한 응답을 무조건 공유 캐시하면 안 됩니다. CloudFront의 경우 원본 헤더뿐 아니라 cache policy의 TTL 제한도 결과에 영향을 줍니다."
    },
    metrics: [
      ["바이트 적중률·원본 전송량", "시청 트래픽이 실제로 얼마나 거점에서 처리되는지 확인합니다."],
      ["배치 완료율·미사용 바이트", "파일을 제때 준비했는지와 과도하게 준비한 양을 함께 봅니다."],
      ["캐시 미스 지연·동시 원본 요청", "한 파일의 동시 미스가 원본을 압도하는지 확인합니다. 관리형 CDN의 요청 병합도 검토 대상입니다."]
    ],
    takeaway: "캐시는 저장 공간만의 문제가 아닙니다. 수요를 언제 알 수 있는지, 첫 요청이 기다려도 되는지, 원본과 배치 링크에 여유가 있는지를 함께 판단합니다.",
    sources: [
      ["Netflix Open Connect · 콘텐츠 준비", "https://openconnect.netflix.com/en/", "공개 사례 · 원문 재확인 필요"],
      ["CloudFront Expiration · AWS 공식 문서 저장소", "https://github.com/awsdocs/amazon-cloudfront-developer-guide/blob/main/doc_source/Expiration.md", "확인한 보존 문서 · Cache-Control과 TTL; 현재 제품 설정은 최신 문서 재확인 필요"],
      ["RFC 9111 · HTTP Caching", "https://www.rfc-editor.org/rfc/rfc9111.html", "확인한 HTTP Working Group 원문 · 공유 캐시, 검증과 Cache-Control"],
      ["CloudFront cache key · AWS 보존 문서", "https://github.com/awsdocs/amazon-cloudfront-developer-guide/blob/main/doc_source/understanding-the-cache-key.md", "확인한 보존 문서 · 객체 동일성과 키 분산; 현재 기본값을 가정하지 않음"]
    ]
  },
  {
    key: "abr", node: "player", title: "플레이어와 적응형 비트레이트", short: "ABR · 화질 적응",
    category: "화질 조절", image: "assets/tech/player.svg",
    question: "와이파이가 느려지면 누가 화질을 바꿀까?",
    intro: "적응형 비트레이트(ABR)는 네트워크와 재생 버퍼에 맞춰 다음 미디어 구간의 표현을 선택하는 방식입니다. 여러 비트레이트의 파일을 미리 준비하고 플레이어가 다음 요청을 바꿉니다. 전송 서버가 요청마다 영상을 새로 인코딩하는 방식과 다릅니다.",
    scope: "HLS·DASH와 ABR의 일반 동작을 설명합니다. 아래 규칙은 단일 구간의 학습 모델이며 넷플릭스의 플레이어 알고리즘·패키징 형식이 아닙니다.",
    problem: "처음에 고른 높은 화질을 끝까지 고정하면 네트워크가 느려질 때 버퍼가 바닥나 재생이 멈춥니다. 무조건 낮은 화질로 고정하면 사용할 수 있는 대역폭과 화면 품질을 낭비합니다. 끊김·화질·시작 시간 사이에서 조절해야 합니다.",
    steps: [
      ["storage", "여러 표현", "동일한 콘텐츠를 여러 비트레이트로 인코딩해 준비합니다."],
      ["player", "상태 관측", "다운로드 처리량·버퍼 길이와 기기 능력을 관측합니다."],
      ["routing", "다음 선택", "다음 구간의 화질을 정하고 해당 URL·범위를 요청합니다."],
      ["player", "버퍼 재생", "구간을 소비하면서 다음 다운로드 결과로 판단을 갱신합니다."]
    ],
    mechanics: [
      ["manifest와 media segment", "일반적인 적응형 HTTP 전달에서는 재생 목록이 화질·구간 정보를 안내하고 미디어 구간이 실제 데이터를 담습니다. HLS의 playlist와 DASH의 MPD는 관련 형식의 예입니다. 코덱(H.264·AV1 등)과 목록·패키징 형식은 별개로 구분합니다."],
      ["버퍼가 줄어드는 조건", "4초짜리 5 Mb/s 구간은 단순 계산상 20 Mb입니다. 유효 처리량이 10 Mb/s라면 2초, 2 Mb/s라면 10초가 걸립니다. 다운로드하는 동안 재생도 진행되므로 후자는 버퍼가 줄어듭니다. RTT·오디오·가변 비트레이트는 이 단순 계산에서 생략했습니다."],
      ["화질 진동을 막는 판단", "실제 ABR은 한 번의 속도 측정만 따르기보다 추정 평활화, 버퍼, 화면·디코더 능력과 화질 전환 비용을 고려할 수 있습니다. 최근 처리량의 75% 이하를 고르는 아래 규칙은 이를 이해하기 위한 작은 모델입니다."]
    ],
    example: {
      title: "네트워크가 달라지면 구간 수신 시간은 어떻게 바뀔까?", kind: "abr",
      text: "현재 5 Mb/s, 4초 구간을 받고 있다고 가정합니다. 네트워크 처리량을 바꿔 수신 시간과 다음 화질 후보를 비교해 보세요. 후보는 1·3·5·8 Mb/s이며 안전 예산은 처리량의 75%입니다.",
      caveat: "단일 구간의 상수 처리량 모델입니다. 실제 처리량 측정, 시작·탐색·버퍼 제어와 실시간 재생 시뮬레이션은 포함하지 않습니다. 넷플릭스의 ABR 정책이 아닙니다."
    },
    metrics: [
      ["시작 지연·재버퍼링 비율", "재생을 얼마나 빨리 시작하고 얼마나 자주 멈추는지 측정합니다."],
      ["비트레이트·화질 전환 횟수", "끊김을 줄이면서도 지나치게 낮은 품질이나 잦은 전환이 없는지 봅니다."],
      ["기기별 디코딩 실패·드롭 프레임", "네트워크가 충분한데도 재생이 나쁘면 코덱·기기 병목을 확인합니다."]
    ],
    takeaway: "CDN 전송이 빨라지는 것과 재생 경험이 좋아지는 것은 연결되어 있지만 같은 지표는 아닙니다. 전달망 지표와 플레이어의 버퍼·화질 지표를 함께 봐야 합니다.",
    sources: [
      ["MDN adaptive streaming · 공식 문서 소스", "https://github.com/mdn/content/blob/main/files/en-us/web/media/guides/audio_and_video_delivery/live_streaming_web_audio_and_video/index.md", "확인한 원문 · 구간·다중 화질·HLS·DASH; ABR 개념만 사용"],
      ["HLS RFC 8216", "https://www.rfc-editor.org/rfc/rfc8216", "표준 추가 읽기 · 원문 재확인 필요"]
    ]
  },
  {
    key: "steering", node: "steering", title: "전송 후보 선택과 장애 대응", short: "Steering · 서버 선택",
    category: "서버 선택", image: "assets/tech/routing.svg",
    question: "가장 가까운 서버가 언제나 가장 좋은 서버일까?",
    intro: "전송 후보 선택은 요청한 파일을 가진 서버 중에서 사용할 수 있는 경로와 용량을 고르는 제어 역할입니다. 파일 존재, 접근 가능한 네트워크와 건강 상태를 함께 봐야 합니다. 서버가 정상이라는 사실과 시청 품질이 좋다는 사실도 구분합니다.",
    scope: "파일·경로·상태라는 판단 축은 사례를 읽기 위한 요약입니다. 후보 목록과 재시도 예제는 일반 설계이며 넷플릭스의 점수식·API·복구 순서를 재현하지 않습니다.",
    problem: "지리적으로 가장 가까운 서버에 파일이 없을 수 있고, 파일이 있어도 링크가 포화일 수 있습니다. 상태 보고가 늦으면 이미 장애인 서버를 계속 안내할 수도 있습니다. 선택과 장애 대응에는 최신 정보와 남은 재생 버퍼가 함께 중요합니다.",
    steps: [
      ["storage", "파일 필터", "요청한 버전·구간을 보유한 후보를 확인합니다."],
      ["routing", "경로·용량", "접근 경로, 부하와 상태가 적합한 후보를 정합니다."],
      ["player", "요청·관측", "플레이어가 요청하고 실제 다운로드 결과를 관측합니다."],
      ["ocaIcon", "다른 후보", "실패하면 정해진 예산 안에서 다른 후보를 검토합니다."]
    ],
    mechanics: [
      ["보고된 상태와 실제 경험", "서버 상태 수집에는 지연이 있습니다. 서버가 살아 있어도 특정 ISP 경로의 손실이 클 수 있습니다. 중앙 상태와 플레이어에서 관측한 오류·처리량을 구분해 봐야 합니다."],
      ["재시도는 남은 시간 안에서", "연결 시간 제한, 요청 시간 제한과 전체 재시도 예산을 정해야 합니다. 실패를 오래 기다리면 버퍼가 소진되고, 너무 공격적으로 재시도하면 혼잡과 중복 트래픽이 커질 수 있습니다. 모든 요청을 무제한으로 재시도하지 않습니다."],
      ["다른 후보도 파일과 여유가 필요", "대체 서버가 있다고 자동으로 복구되지는 않습니다. 같은 파일을 제공할 수 있고, 이동한 사용자를 받을 전송 용량이 있어야 합니다. 기존 다운로드의 처리, 중복 바이트와 토큰 유효성도 검토할 항목입니다."]
    ],
    example: {
      title: "거리보다 먼저 확인할 후보의 조건", language: "후보 평가 · 가상 상황",
      text: "이 상황에서는 A가 가깝더라도 요청한 파일을 줄 수 없습니다. C가 여유 있어 보여도 사용자 네트워크에서 접근할 수 없다면 후보가 아닙니다. B를 선택할 수 있는지는 남은 용량과 실제 경로 품질까지 확인해야 합니다.",
      code: 'candidate A: nearby     / file missing\ncandidate B: reachable / file ready / capacity available\ncandidate C: far away  / file ready / path unavailable\n\nfilter first → evaluate eligible candidates → observe playback',
      caveat: "실제 시스템의 점수나 선택 순서가 아닙니다. 그림의 ‘OCA 장애 흐름’도 후보 변경 개념을 보여주며 무중단 복구를 보장하지 않습니다."
    },
    metrics: [
      ["후보별 오류·다운로드 처리량", "선택된 서버뿐 아니라 ISP·기기·시간대에 따른 품질을 봅니다."],
      ["상태 정보의 나이·선택 실패", "오래된 보고로 불가능한 후보를 안내하는지 확인합니다."],
      ["복구 시간·중복 바이트·재버퍼링", "재시도 성공률만으로 사용자가 끊김을 겪었는지 알 수는 없습니다."]
    ],
    takeaway: "장애 대응은 화살표를 다른 서버로 옮기는 것보다 넓습니다. 후보의 파일·경로·여유 용량과 플레이어의 남은 시간까지 설계해야 합니다.",
    sources: [
      ["Netflix Open Connect · 서버와 경로", "https://openconnect.netflix.com/en/", "공개 사례 · 원문 재확인 필요"],
      ["Open Connect Overview", "https://openconnect.netflix.com/Open-Connect-Overview.pdf", "추가 읽기 · 원문 재확인 필요; 예제의 알고리즘 근거로 사용하지 않음"]
    ]
  }
];
