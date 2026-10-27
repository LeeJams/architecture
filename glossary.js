"use strict";

// Plain-language explanations. Numbers are learning examples, not Netflix measurements.
const glossaryEntries = [
  { id: "bitrate", label: "비트레이트", aliases: ["비트레이트"], meaning: "영상이나 소리가 1초에 사용하는 데이터의 양입니다. 보통 Mb/s 같은 단위로 표시합니다.", example: "평균 5 Mb/s인 영상의 4초 분량은 약 20 Mb입니다. 바이트로 바꾸면 약 2.5 MB입니다. 오디오는 뺀 단순 계산입니다.", note: "같은 비트레이트라도 코덱과 압축 방식에 따라 화질은 달라질 수 있습니다." },
  { id: "units", label: "비트와 바이트 단위", aliases: ["Mb/s", "Mbps", "Gb/s", "MB/s", "GB/s"], meaning: "소문자 b는 비트, 대문자 B는 바이트입니다. 1바이트는 8비트이고, /s는 ‘1초당’을 뜻합니다.", example: "8 Mb/s는 1 MB/s입니다. 1 Gb/s는 십진 단위로 약 125 MB/s입니다. 통신 과정의 추가 데이터는 제외한 계산입니다.", note: "이 사이트의 M·G는 십진 단위입니다. MiB·GiB처럼 1,024를 기준으로 하는 단위와 구분합니다." },
  { id: "buffer", label: "버퍼", aliases: ["버퍼"], meaning: "앞으로 재생할 영상 데이터를 잠시 모아두는 공간입니다. 영상에서는 ‘몇 초 분량이 남았는지’로도 표시합니다.", example: "재생 버퍼가 8초라면, 다음 데이터를 못 받더라도 이미 받은 부분을 약 8초 동안 재생할 여유가 있다는 뜻입니다.", note: "데이터를 받는 동안에도 재생은 계속됩니다. 받는 속도가 늦으면 남은 버퍼가 줄어듭니다." },
  { id: "abr", label: "적응형 비트레이트 · ABR", aliases: ["적응형 비트레이트", "ABR"], meaning: "플레이어가 네트워크 속도와 남은 버퍼를 보고 다음에 받을 영상의 화질을 조절하는 방식입니다.", example: "네트워크가 느려지면 다음 구간부터 데이터가 적게 필요한 화질을 골라, 영상이 멈추는 일을 줄일 수 있습니다.", note: "여러 화질의 파일을 미리 준비하고 그중에서 고릅니다. 전송 서버가 매 요청마다 새로 영상을 만드는 과정은 아닙니다." },
  { id: "cdn", label: "콘텐츠 전달망 · CDN", aliases: ["CDN"], meaning: "여러 지역의 서버에 콘텐츠를 두고, 사용자에게 적합한 서버에서 전달하는 네트워크입니다.", example: "한국에서 보는 영상을 매번 먼 해외 서버에서 받는 대신, 가까운 전달 서버에서 받을 수 있습니다.", note: "이 사이트에서는 넷플릭스의 Open Connect가 영상 전달망 역할을 맡습니다." },
  { id: "oca", label: "영상 전달 장비 · OCA", aliases: ["OCA"], meaning: "넷플릭스 Open Connect에서 준비된 영상 파일을 저장하고 사용자에게 보내는 서버 장비입니다.", example: "플레이어가 OCA에 영상 파일을 요청하면, OCA가 저장된 영상 데이터를 직접 응답합니다.", note: "HTTP 서버와 운영체제는 OCA 안에서 각각 다른 일을 하는 구성 기술입니다." },
  { id: "isp", label: "인터넷 서비스 제공자 · ISP", aliases: ["ISP"], meaning: "가정이나 회사가 인터넷에 접속하도록 회선과 네트워크를 제공하는 사업자입니다.", example: "집에서 인터넷 회선을 가입하는 통신사가 ISP의 한 예입니다.", note: "ISP 내부에 영상 서버를 두면 사용자가 영상을 받기 위해 거치는 외부 네트워크 구간을 줄일 수 있습니다." },
  { id: "peering", label: "피어링", aliases: ["피어링"], meaning: "서로 다른 네트워크가 연결해 데이터를 직접 주고받는 방식입니다.", example: "영상 사업자의 네트워크와 통신사 네트워크가 연결돼 사용자에게 영상 데이터를 전달할 수 있습니다.", note: "지도상 거리뿐 아니라 실제로 어떤 네트워크 경로를 이용하는지도 전송 품질에 영향을 줍니다." },
  { id: "api", label: "프로그램 간 요청 규칙 · API", aliases: ["API"], meaning: "프로그램이 다른 프로그램에 정보를 요청하거나 일을 맡길 때 사용하는 약속된 접점입니다.", example: "플레이어는 재생 API에 영상을 시작하는 데 필요한 정보를 요청합니다.", note: "이 구성도에서는 재생 정보를 받는 요청과 영상 파일을 받는 요청을 분리해 설명합니다." },
  { id: "https", label: "HTTPS", aliases: ["HTTPS"], meaning: "HTTP 통신을 TLS로 보호해 데이터를 주고받는 방식입니다.", example: "영상 파일을 받는 중간 경로에서 누군가 통신 내용을 읽거나 바꾸기 어렵게 합니다.", note: "전송 중의 보호와 콘텐츠 재생 권한을 관리하는 DRM은 맡는 일이 다릅니다." },
  { id: "http", label: "HTTP", aliases: ["HTTP"], meaning: "클라이언트가 파일이나 정보를 요청하고 서버가 상태·헤더·본문으로 답하는 통신 규칙입니다.", example: "플레이어가 영상 파일을 GET으로 요청하면 서버가 상태 코드와 영상 데이터를 응답합니다.", note: "200은 정상 응답, 206은 요청한 일부 바이트의 응답, 404는 리소스를 찾지 못했다는 뜻으로 쓰입니다." },
  { id: "tls", label: "통신 보호 기술 · TLS", aliases: ["TLS"], meaning: "통신 상대를 확인하고, 전송 중 데이터를 암호화하며, 데이터가 바뀌었는지 검증하는 기술입니다.", example: "HTTPS 연결은 TLS로 보호됩니다. 연결을 시작할 때 암호화에 필요한 정보를 협상합니다.", note: "네트워크 전송을 보호하는 기술입니다. 누가 영상을 재생할 수 있는지 정하는 정책은 별도로 필요합니다." },
  { id: "drm", label: "콘텐츠 권한 관리 · DRM", aliases: ["DRM"], meaning: "암호화된 콘텐츠를 누가 어떤 조건에서 재생할 수 있는지 관리하는 기술입니다.", example: "플레이어가 라이선스를 받아 재생에 필요한 복호화 권한을 확인하는 구성이 한 예입니다.", note: "HTTPS 연결을 사용한다고 콘텐츠 재생 권한 관리까지 자동으로 완성되지는 않습니다." },
  { id: "encoding", label: "인코딩", aliases: ["인코딩"], meaning: "원본 영상이나 소리를 재생·전송에 사용할 형식으로 바꾸는 작업입니다.", example: "같은 영상을 여러 해상도와 비트레이트로 준비해 기기와 네트워크 상황에 맞게 고를 수 있도록 합니다.", note: "이 사이트의 영상 전달 서버는 준비된 파일을 보내는 역할입니다. 인코딩은 앞선 준비 과정으로 구분합니다." },
  { id: "codec", label: "코덱", aliases: ["코덱"], meaning: "영상이나 소리를 압축하고 다시 해석하는 방식입니다.", example: "H.264와 AV1은 영상 코덱의 예입니다. 같은 장면도 압축 방식에 따라 필요한 데이터 양이 달라질 수 있습니다.", note: "기기가 해당 코덱을 재생할 수 있는지도 확인해야 합니다." },
  { id: "decoding", label: "디코딩", aliases: ["디코딩", "디코더"], meaning: "압축된 영상·소리 데이터를 화면과 스피커로 재생할 수 있도록 해석하는 과정입니다.", example: "파일을 충분히 빨리 받았어도 기기의 영상 해석이 느리면 프레임이 빠지거나 재생이 끊길 수 있습니다.", note: "네트워크 전송 속도와 기기의 재생 처리 능력은 따로 관측합니다." },
  { id: "segment", label: "미디어 구간 · 세그먼트", aliases: ["미디어 구간", "세그먼트"], meaning: "긴 영상을 나눠 요청하고 재생할 수 있도록 준비한 작은 구간입니다.", example: "4초짜리 구간을 먼저 받아 재생하면서 다음 구간을 이어 받을 수 있습니다.", note: "구간 하나가 별도 파일일 수도 있고, 큰 파일 안의 바이트 범위로 제공될 수도 있습니다." },
  { id: "manifest", label: "재생 목록 · 매니페스트", aliases: ["매니페스트", "manifest", "MPD", "playlist"], meaning: "어떤 화질과 구간을 어디에서 받을 수 있는지 플레이어에게 알려주는 목록입니다.", example: "HLS의 재생 목록이나 DASH의 MPD가 관련 형식의 예입니다.", note: "목록이 가리키는 미디어 파일의 버전과 실제 파일이 맞아야 합니다." },
  { id: "cache-key", label: "캐시 키", aliases: ["캐시 키"], meaning: "저장된 응답 중 어떤 것을 다시 사용할지 구분하는 이름표입니다.", example: "파일 경로와 버전이 키에 포함되면 서로 다른 버전의 영상을 별개로 구분할 수 있습니다.", note: "같은 키에 서로 다른 응답을 섞으면 안 됩니다. 접근 권한을 확인하는 일도 따로 설계해야 합니다." },
  { id: "cache-hit", label: "캐시 적중", aliases: ["캐시 적중", "적중률"], meaning: "요청한 데이터를 캐시에 보관한 사본으로 제공할 수 있는 상태입니다. 적중률은 전체 중 그 비중입니다.", example: "100번 요청 중 90번을 캐시에서 처리하면 요청 적중률은 90%입니다.", note: "큰 파일과 작은 파일이 섞이면 요청 횟수 기준과 전송 바이트 기준 적중률은 달라집니다." },
  { id: "cache", label: "캐시", aliases: ["캐시", "캐싱"], meaning: "다시 쓸 가능성이 있는 데이터를 가까운 곳에 보관해 빠르게 재사용하는 방법입니다.", example: "CDN에 영상 파일을 보관하거나, 운영체제가 자주 읽는 파일의 일부를 메모리에 두는 것이 예입니다.", note: "전달 서버의 파일 보관과 운영체제의 메모리 캐시는 서로 다른 계층입니다." },
  { id: "ttl", label: "보관·신선도 시간 · TTL", aliases: ["TTL"], meaning: "정해진 정보를 유효하게 취급하는 시간을 뜻합니다. 캐시에서는 응답을 얼마나 오래 신선한 것으로 볼지 정할 때 쓰입니다.", example: "캐시 신선도 시간이 60초라면, 그 시간 동안 저장된 응답을 재사용할 수 있는지 정책에 따라 판단합니다.", note: "캐시 신선도와 사용자의 영상 접근 권한이 끝나는 시각은 별개의 정책입니다." },
  { id: "origin", label: "원본 서버 · 오리진", aliases: ["원본 서버", "오리진", "origin"], meaning: "CDN이 필요한 파일을 가져오는 원래 서버나 저장소입니다.", example: "CDN에 없는 파일을 요청받으면 원본에서 가져와 제공하는 구성을 만들 수 있습니다.", note: "Open Connect의 사전 배치 과정과 일반 CDN의 요청 시 원본 조회를 같은 동작으로 가정하지 않습니다." },
  { id: "throughput", label: "처리량", aliases: ["처리량"], meaning: "일정한 시간 동안 실제로 처리하거나 전달한 데이터 양입니다.", example: "영상 20 Mb를 2초에 받았다면, 단순 평균 다운로드 처리량은 10 Mb/s입니다.", note: "회선의 최대 속도와 실제 다운로드 처리량은 다를 수 있습니다." },
  { id: "bandwidth", label: "대역폭", aliases: ["대역폭"], meaning: "네트워크 경로가 단위 시간에 전달할 수 있는 용량입니다.", example: "10 Gb/s 링크는 1초에 전달할 수 있는 데이터 용량을 나타내는 표현입니다.", note: "혼잡·기기·서버의 상태 때문에 실제로 받는 속도가 이 용량에 못 미칠 수 있습니다." },
  { id: "latency", label: "지연 시간", aliases: ["지연 시간", "지연시간"], meaning: "요청이나 데이터가 처리·전달되기를 기다리는 시간입니다.", example: "요청 후 첫 응답을 받기까지 100 ms가 걸렸다면 0.1초를 기다린 것입니다.", note: "첫 바이트를 기다린 시간과 파일 전체를 받는 데 걸린 시간은 나눠 봅니다." },
  { id: "percentile", label: "느린 요청을 보는 지표 · p95·p99", aliases: ["p95", "p99"], meaning: "관측한 요청의 일정 비율이 이 시간 안에 처리됐다는 뜻입니다. 평균이 가릴 수 있는 느린 요청을 볼 때 씁니다.", example: "응답 시간의 p99가 300 ms라면 관측한 요청의 약 99%가 300 ms 이하였다는 뜻입니다.", note: "p95는 95%, p99는 99% 지점입니다. 같은 기간·요청 종류를 기준으로 비교합니다." },
  { id: "rtt", label: "왕복 시간 · RTT", aliases: ["RTT"], meaning: "데이터를 보내고 그에 대한 응답이 돌아오기까지 걸리는 시간입니다.", example: "새 연결에서 여러 번 왕복이 필요하면 재생을 시작하기 전에 기다리는 시간도 늘 수 있습니다.", note: "한 번 왕복하는 시간과 큰 파일의 전체 다운로드 시간은 서로 다른 값입니다." },
  { id: "io", label: "입출력 · I/O", aliases: ["I/O", "입출력"], meaning: "프로그램이 디스크나 네트워크 같은 장치에서 데이터를 읽거나 쓰는 일입니다.", example: "영상 서버가 파일을 읽는 일과 소켓에 영상 데이터를 쓰는 일이 모두 입출력입니다.", note: "디스크 읽기 대기와 네트워크 전송 대기는 원인과 확인할 지표가 다릅니다." },
  { id: "os", label: "운영체제", aliases: ["운영체제"], meaning: "프로그램이 메모리·파일·장치·네트워크 자원을 사용할 수 있도록 관리하는 기본 소프트웨어입니다.", example: "FreeBSD와 Linux는 서버를 구성할 때 쓰는 운영체제의 예입니다.", note: "HTTP 서버는 운영체제 위에서 실행되는 별도의 프로그램입니다." },
  { id: "kernel", label: "커널", aliases: ["커널"], meaning: "메모리·장치·프로세스 같은 자원을 관리하는 운영체제의 중심 부분입니다.", example: "파일을 읽거나 네트워크로 보내는 요청을 프로그램으로부터 받아 처리합니다.", note: "프로그램에서 호출한 작업이 커널과 장치를 거쳐 어떻게 실행되는지에 따라 전송 비용이 달라집니다." },
  { id: "socket", label: "소켓", aliases: ["소켓"], meaning: "프로그램이 네트워크로 데이터를 읽고 쓰는 데 사용하는 통신 접점입니다.", example: "영상 서버는 연결된 플레이어 쪽 소켓에 응답 데이터를 씁니다.", note: "수신자가 느리면 소켓에 쓸 수 있는 여유가 줄어들어 전송을 기다려야 할 수 있습니다." },
  { id: "sendfile", label: "파일을 소켓으로 보내는 기능 · sendfile", aliases: ["sendfile"], meaning: "파일 내용을 소켓으로 전달하는 일을 운영체제에 맡기는 기능입니다.", example: "프로그램이 파일을 자기 버퍼로 읽고 다시 쓰는 부담을 줄이는 데 사용할 수 있습니다.", note: "디스크 대기와 암호화 비용이 모두 사라지는 것은 아닙니다. 운영체제별 사용 조건도 다릅니다." },
  { id: "kqueue", label: "이벤트 알림 · kqueue·epoll", aliases: ["kqueue", "epoll"], meaning: "여러 연결 중 지금 읽거나 쓸 수 있는 대상을 운영체제가 알려주는 기능입니다. FreeBSD의 kqueue와 Linux의 epoll이 관련 예입니다.", example: "한 소켓이 쓰기 가능한 상태가 되면 서버가 남은 전송을 이어갈 수 있습니다.", note: "소켓이 준비됐다는 알림과 디스크의 파일 읽기가 끝났다는 사실은 구분합니다." },
  { id: "nonblocking", label: "비차단 처리", aliases: ["비차단"], meaning: "지금 작업을 끝낼 수 없으면 계속 기다리는 대신, 진행 상태를 돌려받고 다른 일을 처리할 수 있는 방식입니다.", example: "소켓에 더 쓸 수 없으면 준비됐다는 알림을 기다렸다가 나머지를 이어 보낼 수 있습니다.", note: "이미 처리한 길이와 남은 길이를 기억해야 중복 전송을 피할 수 있습니다." },
  { id: "threads", label: "스레드 풀", aliases: ["스레드 풀", "thread pool"], meaning: "작업을 맡길 실행 단위인 스레드를 미리 마련하고 재사용하는 방식입니다.", example: "오래 걸리는 파일 작업을 별도 스레드에 맡겨 주된 요청 처리 흐름의 대기를 줄일 수 있습니다.", note: "실제로 사용할 수 있는 기능과 설정은 서버의 빌드·운영체제에 따라 확인합니다." },
  { id: "fd", label: "열린 파일·소켓의 번호 · FD", aliases: ["파일 디스크립터", "FD"], meaning: "운영체제가 열린 파일이나 소켓 등을 구분하기 위해 프로그램에 주는 번호입니다.", example: "연결된 소켓뿐 아니라 열어 둔 파일과 로그도 자원을 사용합니다.", note: "동시 연결 설정을 높여도 실제 프로세스의 열린 파일 한도에 먼저 걸릴 수 있습니다." },
  { id: "nic", label: "네트워크 장치 · NIC", aliases: ["NIC"], meaning: "서버를 네트워크에 연결하고 데이터를 주고받는 장치입니다.", example: "영상 서버가 전송할 데이터는 최종적으로 네트워크 장치를 거쳐 외부로 나갑니다.", note: "장치의 최대 속도 외에 디스크·CPU·외부 경로도 실제 전송 속도에 영향을 줍니다." },
  { id: "range", label: "일부 바이트 요청 · Range", aliases: ["Range"], meaning: "HTTP에서 파일 전체가 아니라 지정한 바이트 부분을 요청할 때 사용하는 헤더입니다.", example: "bytes=0-1023은 양 끝을 포함해 첫 1,024바이트를 요청한다는 뜻입니다.", note: "서버가 요청을 수락했는지는 206 상태와 Content-Range 등을 확인합니다. 별도 구간 파일은 일반 GET으로 받을 수도 있습니다." },
  { id: "etag", label: "파일 버전 식별자 · ETag", aliases: ["ETag"], meaning: "서버가 리소스의 현재 표현을 구분하기 위해 응답에 붙이는 식별자입니다.", example: "이어받을 때 기존 ETag와 현재 파일의 ETag를 비교하면 같은 표현을 받고 있는지 판단하는 데 도움이 됩니다.", note: "강한 ETag와 약한 ETag의 비교 조건은 다릅니다. If-Range에는 약한 ETag를 사용하지 않습니다." },
  { id: "checksum", label: "체크섬", aliases: ["체크섬"], meaning: "데이터로부터 계산한 값을 비교해 파일이 예상한 내용과 맞는지 확인하는 방법입니다.", example: "파일을 옮긴 뒤 예상한 값과 실제 파일에서 계산한 값을 비교할 수 있습니다.", note: "길이 확인과 함께 무결성 검증에 활용할 수 있으며, 검증 방식에 따라 보장하는 범위는 다릅니다." },
  { id: "zerocopy", label: "복사를 줄이는 전송 · zero-copy", aliases: ["zero-copy", "zero copy"], meaning: "데이터를 전달하면서 생기는 메모리 복사를 줄이려는 처리 방식입니다.", example: "파일 전송 경로에서 프로그램의 중간 버퍼를 거치는 부담을 줄이는 방법을 검토할 수 있습니다.", note: "이 이름이 디스크 읽기·암호화·장치 처리 비용까지 모두 없앤다는 뜻은 아닙니다." },
  { id: "ktls", label: "커널에서 TLS 레코드 처리 · KTLS", aliases: ["KTLS", "kTLS"], meaning: "연결을 협상한 뒤 TLS 데이터 레코드의 처리를 커널 쪽에 맡기는 기능입니다.", example: "FreeBSD에서는 커널의 소프트웨어 처리와 지원 네트워크 장치의 암호화 처리를 구분합니다.", note: "KTLS를 쓴다는 사실만으로 모든 연결이 네트워크 장치에서 암호화된다고 볼 수는 없습니다." }
];

(() => {
  const entries = new Map(glossaryEntries.map(entry => [entry.id, entry]));
  const aliases = new Map(glossaryEntries.flatMap(entry => entry.aliases.map(alias => [alias, entry.id])));
  const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp([...aliases.keys()].sort((a, b) => b.length - a.length).map(escapePattern).join("|"), "g");
  const excluded = "a,button,code,pre,svg,script,style,label,textarea,select,nav,[contenteditable],[data-glossary-ui],.glossary-fragment,.note-sources,.sheet-sources,.technical-citations,.micro-label,.section-label,.eyebrow";
  const originals = new WeakMap();
  const popover = document.querySelector("#glossary-popover");
  const nativePopover = typeof popover.showPopover === "function";
  let enabled = false, anchor = null, opened = false, frame = 0;
  try { enabled = localStorage.getItem("atlas.glossary.enabled") === "true"; } catch { /* file/private storage may be unavailable */ }

  function annotate(root) {
    if (!enabled) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement || node.parentElement.closest(excluded + ",[hidden]")) continue;
      pattern.lastIndex = 0;
      if (pattern.test(node.data)) nodes.push(node);
    }
    for (const node of nodes) {
      const block = node.parentElement.closest("p,dd,li,h3,h4,h5") || node.parentElement;
      const seen = new Set([...block.querySelectorAll("[data-glossary-term]")].map(item => item.dataset.glossaryTerm));
      const wrapper = document.createElement("span");
      let end = 0;
      pattern.lastIndex = 0;
      for (const match of node.data.matchAll(pattern)) {
        const key = aliases.get(match[0]);
        if (seen.has(key) || seen.size >= 3) continue;
        if (/^[A-Za-z]/.test(match[0]) && /[A-Za-z0-9_]/.test(node.data[match.index - 1] || "")) continue;
        if (/[A-Za-z0-9_]$/.test(match[0]) && /[A-Za-z0-9_]/.test(node.data[match.index + match[0].length] || "")) continue;
        wrapper.append(document.createTextNode(node.data.slice(end, match.index)));
        const button = document.createElement("button");
        button.type = "button";
        button.className = "glossary-term";
        button.dataset.glossaryTerm = key;
        button.setAttribute("aria-label", `${match[0]} 뜻 보기`);
        button.setAttribute("aria-haspopup", "dialog");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", "glossary-popover");
        button.append(document.createTextNode(match[0]));
        const mark = document.createElement("span");
        mark.className = "glossary-mark";
        mark.setAttribute("aria-hidden", "true");
        mark.textContent = "?";
        button.append(mark);
        wrapper.append(button);
        seen.add(key);
        end = match.index + match[0].length;
      }
      if (!end) continue;
      wrapper.append(document.createTextNode(node.data.slice(end)));
      wrapper.className = "glossary-fragment";
      originals.set(wrapper, node.data);
      node.replaceWith(wrapper);
    }
  }

  function positionPopover() {
    if (!anchor || !opened) return;
    const rect = anchor.getBoundingClientRect();
    const card = popover.getBoundingClientRect();
    const left = Math.max(12, Math.min(rect.left, innerWidth - card.width - 12));
    const below = rect.bottom + 8;
    const top = below + card.height <= innerHeight - 12 ? below : Math.max(12, rect.top - card.height - 8);
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
  }

  function closeExplanation(restoreFocus = false) {
    if (!opened) return;
    const previous = anchor;
    opened = false;
    previous?.setAttribute("aria-expanded", "false");
    if (nativePopover && popover.matches(":popover-open")) popover.hidePopover();
    if (!nativePopover) popover.hidden = true;
    anchor = null;
    if (restoreFocus && previous?.isConnected && !previous.closest("[hidden]")) previous.focus({ preventScroll: true });
  }

  function showExplanation(button) {
    const entry = entries.get(button.dataset.glossaryTerm);
    if (!entry || !enabled) return;
    if (opened && anchor === button) { closeExplanation(true); return; }
    closeExplanation();
    // A popover opened from a modal must be inside that modal's active subtree.
    (button.closest("dialog[open]") || document.body).append(popover);
    document.querySelector("#glossary-word").textContent = entry.label;
    document.querySelector("#glossary-meaning").textContent = entry.meaning;
    document.querySelector("#glossary-example").textContent = entry.example;
    document.querySelector("#glossary-note").textContent = entry.note;
    anchor = button;
    opened = true;
    button.setAttribute("aria-expanded", "true");
    popover.style.left = "12px";
    popover.style.top = "12px";
    if (nativePopover) popover.showPopover();
    else popover.hidden = false;
    positionPopover();
    document.querySelector("#glossary-word").focus({ preventScroll: true });
  }

  function refresh() {
    frame = 0;
    if (opened && (!anchor?.isConnected || anchor.closest("[hidden]"))) closeExplanation();
    if (!enabled) return;
    annotate(document.querySelector("#main-content"));
    annotate(document.querySelector("#technology-sheet-content"));
  }

  function scheduleRefresh() {
    if (!frame) frame = requestAnimationFrame(refresh);
  }

  function setEnabled(value) {
    closeExplanation();
    enabled = value;
    try { localStorage.setItem("atlas.glossary.enabled", String(value)); } catch { /* keep working for this visit */ }
    document.querySelectorAll("[data-glossary-toggle]").forEach(button => {
      button.setAttribute("aria-checked", String(value));
      button.title = value ? "용어 설명 끄기" : "용어 설명 켜기";
      button.querySelector("[data-glossary-state]").textContent = value ? "켬" : "끔";
    });
    document.querySelectorAll("[data-glossary-hint]").forEach(hint => { hint.hidden = !value; });
    if (value) refresh();
    else document.querySelectorAll(".glossary-fragment").forEach(wrapper => wrapper.replaceWith(document.createTextNode(originals.get(wrapper))));
  }

  document.addEventListener("click", event => {
    const toggle = event.target.closest("[data-glossary-toggle]");
    const term = event.target.closest("[data-glossary-term]");
    const close = event.target.closest("[data-close-glossary]");
    if (toggle || term || close) {
      event.preventDefault();
      event.stopPropagation();
      if (toggle) setEnabled(!enabled);
      else if (term) showExplanation(term);
      else closeExplanation(true);
    } else if (opened && !popover.contains(event.target)) closeExplanation();
  }, true);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && opened) {
      event.preventDefault();
      event.stopPropagation();
      closeExplanation(true);
    }
  }, true);
  document.addEventListener("close", event => {
    if (opened && event.target.contains(anchor)) closeExplanation();
  }, true);
  document.addEventListener("scroll", event => {
    if (!opened || popover.contains(event.target)) return;
    const rect = anchor.getBoundingClientRect();
    const clip = anchor.closest("#technology-sheet-scroll,.detail-content")?.getBoundingClientRect();
    const top = Math.max(0, clip?.top || 0);
    const bottom = Math.min(innerHeight, clip?.bottom || innerHeight);
    if (rect.bottom < top || rect.top > bottom) closeExplanation();
    else positionPopover();
  }, true);
  window.addEventListener("resize", positionPopover);
  window.addEventListener("popstate", () => closeExplanation());
  if (nativePopover) popover.addEventListener("toggle", event => {
    if (event.newState === "closed" && opened && !popover.matches(":popover-open")) {
      opened = false;
      anchor?.setAttribute("aria-expanded", "false");
      anchor = null;
    }
  });
  else popover.hidden = true;
  const observer = new MutationObserver(scheduleRefresh);
  for (const root of [document.querySelector("#main-content"), document.querySelector("#technology-sheet-content")]) {
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
  }
  setEnabled(enabled);
})();
