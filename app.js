"use strict";

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const assets = {
  aws: "assets/tech/aws.svg",
  ocaIcon: "assets/tech/oca-icon.svg",
  routing: "assets/tech/routing.svg",
  fill: "assets/tech/fill.svg",
  poster: "assets/netflix-case.svg",
  oca: "assets/tech/oca-appliance.svg",
  freebsd: "assets/tech/freebsd.svg",
  nginx: "assets/tech/nginx-mark.svg",
  https: "assets/tech/https.svg",
  storage: "assets/tech/storage.svg",
  player: "assets/tech/player.svg",
  cloudfront: "assets/tech/cloudfront.png",
  fastly: "assets/tech/fastly.svg",
  linux: "assets/tech/linux.svg",
  caddy: "assets/tech/caddy.svg",
  cloudflare: "assets/tech/cloudflare.svg",
  apache: "assets/tech/apache.svg",
  ubuntu: "assets/tech/ubuntu.svg",
  debian: "assets/tech/debian.svg",
  gcp: "assets/tech/gcp.svg",
  azure: "assets/tech/azure.svg",
  s3: "assets/tech/s3.png",
  gcs: "assets/tech/gcs.svg"
};

// Keep technology imagery local and warm the cache before an inspector switch.
const technologyImages = Object.values(assets).map(src => {
  const image = new Image();
  image.src = src;
  return image;
});

const stackEntry = (image, title, text, key = "") => {
  const technology = key || ({ [assets.aws]: "aws", [assets.nginx]: "nginx", [assets.freebsd]: "freebsd", [assets.https]: "https", [assets.player]: "abr", [assets.ocaIcon]: "oca", [assets.fill]: "fill" })[image];
  if (technology) return `<button class="stack-entry" data-stack-tech="${technology}" data-inspect-tech="${technology}" aria-haspopup="dialog"><img src="${image}" alt=""><span class="stack-entry-copy"><strong>${title}</strong><span>${text}</span></span><span class="stack-entry-action">자세히 ↗</span></button>`;
  return `<div class="stack-entry"><img src="${image}" alt=""><div><h3>${title}</h3><p>${text}</p></div></div>`;
};
const note = text => `<div class="detail-note">${text}</div>`;

const components = {
  player: {
    count: "01", title: "재생을 시작하고, 영상을 받는 곳", english: "NETFLIX PLAYER / VIEWING DEVICE", image: assets.player,
    alt: "영상 재생 화면을 보여주는 플레이어 도식", badges: ["TV · Mobile · Web", "Playback", "HTTP(S)"],
    role: `<h3>어디에 있나요?</h3><p>TV, 모바일 앱, 웹 등 사용자의 시청 기기 안에 있습니다.</p><h3>어떤 순서로 동작하나요?</h3><ul><li>클라우드에 재생에 필요한 정보를 요청합니다.</li><li>재생 정보와 전송에 사용할 OCA 후보를 받습니다.</li><li>전송 서버에서 영상·오디오 조각을 받아 재생합니다.</li></ul>${note("재생 정보와 실제 영상은 서로 다른 서버 경로로 도착합니다. 플레이어가 두 흐름을 연결합니다.")}`,
    stack: stackEntry(assets.player, "Player", "기기에서 영상 데이터를 받아 디코딩하고 재생합니다.") + stackEntry(assets.https, "HTTP(S)", "재생 정보와 영상 조각을 요청하고 응답받는 통신 기반입니다.") + note("화질 선택, DRM과 기기별 플레이어 구현은 이번 전달망 구성도의 범위 밖입니다."),
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"]
  },
  playback: {
    count: "02", title: "재생에 필요한 정보를 연결", english: "PLAYBACK SERVICES / AWS CLOUD", image: assets.aws,
    alt: "AWS 로고", brand: true, badges: ["AWS", "Playback APIs", "Control plane"],
    role: `<h3>어디에 있나요?</h3><p>클라우드의 재생 관련 서비스 영역입니다. 실제의 여러 기능을 하나의 노드로 묶었습니다.</p><h3>어떤 데이터를 다루나요?</h3><p>플레이어가 영상을 시작하는 데 필요한 정보와 전송 서버 후보를 연결하는 제어 경로를 담당합니다.</p><h3>왜 나누나요?</h3><p>재생 제어와 대용량 파일 전송은 요구하는 자원과 확장 방식이 다릅니다.</p>${note("이 그림의 API 노드는 영상 파일 전체를 중계하는 서버가 아닙니다.")}`,
    stack: stackEntry(assets.aws, "AWS / 클라우드", "재생 관련 제어 서비스를 실행하는 영역을 나타냅니다.", "aws") + stackEntry(assets.https, "API 요청·응답", "플레이어와 재생 정보를 주고받습니다.") + note("특정 AWS 서비스, 프로그래밍 언어나 데이터베이스를 이 노드만으로 확정하지 않습니다."),
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"]
  },
  steering: {
    count: "03", title: "어느 OCA에서 받을지 결정", english: "OPEN CONNECT / SERVER SELECTION", image: assets.routing,
    alt: "조건에 맞는 전달 경로를 고르는 개념 도식", badges: ["Content availability", "Network conditions", "Server status"],
    role: `<h3>어떤 조건을 보나요?</h3><ul><li>요청한 영상 파일을 보유하고 있는가?</li><li>사용자의 네트워크에서 적합한 경로인가?</li><li>전송 서버가 사용할 수 있는 상태인가?</li></ul><h3>왜 단순한 거리 비교가 아닌가요?</h3><p>지리적으로 가까워도 파일이 없거나 네트워크 조건이 맞지 않으면 적합한 전송 서버가 아닐 수 있습니다.</p>${note("서버 선택은 영상을 보내는 동작과 구분합니다. 여기서는 기능을 요약한 것이며 실제 내부 서비스 배치를 뜻하지 않습니다.")}`,
    stack: stackEntry(assets.ocaIcon, "OCA 상태와 콘텐츠 보유 정보", "사용 가능한 파일과 서버 상태가 선택에 영향을 줍니다.") + stackEntry(assets.storage, "전송 후보 선택", "콘텐츠와 네트워크 조건을 고려해 전송 후보를 결정합니다.") + note("세부 라우팅 알고리즘이나 내부 API는 이 시안에서 구현 사실로 단정하지 않습니다."),
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"]
  },
  oca: {
    count: "04", title: "사용자 가까이의 영상 서버", english: "OPEN CONNECT APPLIANCE", image: assets.oca,
    alt: "디스크와 네트워크 전송 기능을 갖춘 OCA 서버 설명 그림", badges: ["OCA", "FreeBSD", "NGINX", "HTTP(S)"],
    role: `<h3>어디에 있나요?</h3><p>ISP 네트워크 내부 또는 피어링 거점에 배치되는 영상 전송 서버입니다.</p><h3>무엇을, 어떻게 보내나요?</h3><p>미리 준비한 영상 파일을 저장하고, 플레이어의 요청에 영상·오디오 데이터를 직접 응답합니다.</p><h3>왜 이 위치에 두나요?</h3><p>사용자와 콘텐츠 사이의 네트워크 경로를 줄이고 전달 부하를 여러 거점으로 나눌 수 있습니다.</p>${note("OCA는 장비와 소프트웨어가 결합한 전송 서버입니다. FreeBSD나 NGINX 하나만 도입하는 것과는 운영 범위가 다릅니다.")}`,
    stack: stackEntry(assets.storage, "디스크 / 캐시된 파일", "미리 배치한 영상 파일을 읽을 준비를 합니다.") + stackEntry(assets.nginx, "NGINX / HTTP 서버", "HTTP 요청을 처리하고 영상 파일 데이터를 응답합니다.", "nginx") + stackEntry(assets.freebsd, "FreeBSD / 운영체제", "파일 읽기와 네트워크 I/O의 기반을 제공합니다.", "freebsd") + stackEntry(assets.https, "HTTP(S) / 전송", "플레이어가 영상 조각을 요청하고 전달받습니다.", "https"),
    source: ["Open Connect Appliances", "https://openconnect.netflix.com/en/appliances/"]
  },
  origin: {
    count: "05", title: "미리 준비한 여러 화질의 영상", english: "ENCODED CONTENT / ORIGIN", image: assets.storage,
    alt: "인코딩된 영상 파일을 보관하는 저장소 개념 그림", badges: ["Encoded files", "Video · Audio", "Multiple renditions"],
    role: `<h3>무엇을 저장하나요?</h3><p>기기와 네트워크 조건에 맞춰 전달할 수 있도록 준비한 영상·오디오 파일입니다.</p><h3>왜 준비가 필요한가요?</h3><p>한 개의 원본 영상을 그대로 모든 기기에 보내는 대신, 재생에 사용할 수 있는 여러 표현을 준비합니다.</p><h3>전달망과 어떻게 연결되나요?</h3><p>이 파일들이 콘텐츠 배치 체계를 통해 OCA로 전달됩니다.</p>${note("이 노드는 저장 역할을 나타냅니다. 특정 저장소 제품이나 전체 인코딩 파이프라인을 단정하지 않습니다.")}`,
    stack: stackEntry(assets.storage, "영상·오디오 파일", "전송과 재생에 사용할 인코딩된 파일을 준비합니다.") + stackEntry(assets.storage, "원본 저장 역할", "전송 거점에 배치할 콘텐츠를 보관합니다.") + note("코덱, 인코딩, DRM과 패키징의 세부 선택은 별도의 설계 주제로 확장할 수 있습니다."),
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"]
  },
  fill: {
    count: "06", title: "시청 요청 전에 거점을 채우기", english: "CONTENT PLACEMENT / FILL", image: assets.fill,
    alt: "저장된 콘텐츠를 전달망으로 배치하는 개념 그림", badges: ["Content placement", "Pre-positioning", "Fill"],
    role: `<h3>언제 하는 일인가요?</h3><p>사용자가 영상을 재생하는 경로와 구분되는 콘텐츠 준비 과정입니다.</p><h3>어떤 문제를 푸나요?</h3><p>시청 시점에 필요한 영상 파일이 전달 거점에 준비되어 있도록 합니다. 파일 보유와 저장 용량을 함께 관리해야 합니다.</p><h3>그림에서 생략한 부분</h3><p>실제 배치 체계에는 여러 서버와 전송 경로가 있을 수 있습니다. 한 노드와 점선으로 역할을 요약했습니다.</p>`,
    stack: stackEntry(assets.storage, "콘텐츠 배치 정책", "어떤 파일을 어느 거점에 둘지 결정하는 역할입니다.", "fill") + stackEntry(assets.ocaIcon, "OCA 저장 용량", "전송 거점의 파일 보유와 저장 공간을 관리합니다.") + note("‘콘텐츠 배치’는 기능 이름입니다. 실제 내부의 단일 제품이나 서비스 이름으로 제시한 것은 아닙니다."),
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"]
  },
  fallback: {
    count: "07", title: "한 전송 서버에만 기대지 않기", english: "ALTERNATE OCA / RETRY CONCEPT", image: assets.oca,
    alt: "다른 전송 거점의 OCA 서버를 설명하는 그림", badges: ["Alternate candidate", "Availability", "Retry"],
    role: `<h3>어떤 상황을 생각하나요?</h3><p>선택한 서버에서 전송을 계속할 수 없을 때, 사용할 수 있는 다른 전송 후보가 필요합니다.</p><h3>시안에서 보여주는 흐름</h3><p>‘OCA 장애 흐름’을 켜면 다른 후보 OCA로 요청을 재시도하는 경로를 강조합니다.</p>${note("장애 감지 시간, 재시도 순서와 무중단 전환을 재현한 시뮬레이션은 아닙니다. 여러 후보를 고려하는 설계 개념을 보여줍니다.")}`,
    stack: stackEntry(assets.ocaIcon, "다른 전송 후보", "요청할 수 있는 대체 서버가 필요합니다.") + stackEntry(assets.player, "플레이어의 오류 처리", "전송 오류를 처리하고 재생을 이어가기 위한 기능이 필요합니다.") + note("정확한 후보 선택과 재시도 방식은 원문과 기기 구현의 확인이 필요한 범위입니다."),
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"]
  }
};

const technologyDetails = {
  aws: {
    count: "02", title: "AWS · 재생 제어가 실행되는 곳", english: "CLOUD PLATFORM / CONTROL PLANE", image: assets.aws, alt: "AWS 로고", brand: true,
    badges: ["Cloud platform", "Playback services", "Control plane"],
    role: `<h3>구성도의 어느 부분인가요?</h3><p>상단의 클라우드 재생 서비스 영역입니다. 재생에 필요한 정보를 연결하는 제어 역할을 나타냅니다.</p><h3>영상 전달과 어떻게 다른가요?</h3><p>OCA가 영상 바이트를 직접 전달하는 동안, 클라우드의 재생 관련 서비스는 플레이어가 사용할 정보를 제공합니다.</p>${note("AWS 로고가 있다고 특정 서비스나 데이터베이스까지 알 수 있는 것은 아닙니다. 이 사례에서는 검증되지 않은 제품 목록을 추가하지 않습니다.")}`,
    stack: stackEntry(assets.aws, "클라우드 실행 환경", "재생 관련 서비스를 실행하는 기반입니다.") + stackEntry(assets.player, "재생 정보 요청·응답", "플레이어와 필요한 제어 정보를 연결합니다.") + note("컴퓨팅, 데이터 저장, 관측의 구체적인 제품 선택은 각 서비스의 원문이 필요한 범위입니다."),
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"]
  },
  freebsd: {
    count: "04", title: "FreeBSD · 전송 서버의 기반", english: "OPERATING SYSTEM / INSIDE OCA", image: assets.freebsd, alt: "FreeBSD 로고", brand: true,
    badges: ["Operating system", "Storage I/O", "Network I/O"],
    role: `<h3>어디에 쓰이나요?</h3><p>공개된 OCA 소프트웨어 설명에 등장하는 운영체제입니다. HTTP 서버 아래에서 파일과 네트워크 자원을 다룹니다.</p><h3>무슨 일을 하나요?</h3><p>디스크에서 데이터를 읽고 네트워크로 보내는 데 필요한 기반을 제공합니다. 드라이버, 메모리, 연결과 I/O 동작이 이 계층에 속합니다.</p>${note("HTTP 요청에 어떤 파일을 응답할지는 웹 서버의 역할입니다. FreeBSD와 NGINX는 서로 다른 계층에서 함께 동작합니다.")}`,
    stack: stackEntry(assets.storage, "스토리지 경로", "파일 읽기와 저장장치 접근의 기반을 제공합니다.") + stackEntry(assets.https, "네트워크 경로", "데이터를 네트워크로 전달하는 운영체제 기능을 제공합니다.") + stackEntry(assets.nginx, "상위 계층: NGINX", "운영체제 위에서 HTTP 요청과 파일 응답을 담당합니다."),
    source: ["FreeBSD Handbook", "https://docs.freebsd.org/en/books/handbook/"]
  },
  nginx: {
    count: "04", title: "NGINX · 영상 파일을 응답", english: "HTTP SERVER / INSIDE OCA", image: assets.nginx, alt: "NGINX 로고", brand: true,
    badges: ["HTTP server", "File delivery", "Inside OCA"],
    role: `<h3>어디에 쓰이나요?</h3><p>공개된 OCA 소프트웨어 구성의 HTTP 서버입니다. 플레이어의 요청을 받아 영상 파일 데이터를 응답하는 역할을 합니다.</p><h3>전체 CDN과 무엇이 다른가요?</h3><p>NGINX는 개별 서버의 HTTP 처리 계층입니다. 전달망에는 서버 배치, 콘텐츠 배치, 거점 선택과 운영 체계가 함께 필요합니다.</p>${note("‘NGINX를 설치했다’는 것만으로 Open Connect와 같은 전달망이 만들어지는 것은 아닙니다.")}`,
    stack: stackEntry(assets.player, "입력: 플레이어의 요청", "전달받을 영상·오디오 데이터에 대한 HTTP 요청입니다.") + stackEntry(assets.storage, "처리: 준비된 파일 읽기", "응답할 파일의 데이터를 읽습니다.") + stackEntry(assets.https, "출력: 네트워크 응답", "운영체제의 I/O 기반을 사용해 데이터를 보냅니다."),
    source: ["NGINX Documentation", "https://nginx.org/en/docs/"]
  },
  https: {
    count: "04", title: "HTTP(S) · 요청과 데이터 전송", english: "PROTOCOL / PLAYER ↔ DELIVERY SERVER", image: assets.https, alt: "HTTPS를 설명하는 방패와 자물쇠 도식", brand: true,
    badges: ["HTTP", "HTTPS / TLS", "Request · Response"],
    role: `<h3>어디에 쓰이나요?</h3><p>플레이어가 재생 정보와 영상 조각을 요청하고 응답받는 통신 기반입니다.</p><h3>HTTPS의 역할은 무엇인가요?</h3><p>HTTP 통신에 TLS 보호를 적용해 전송 내용을 보호합니다. 연결선의 프로토콜 표시는 ‘어떤 방식으로 데이터가 오가는지’를 뜻합니다.</p>${note("HTTP(S)는 프로토콜이고, NGINX는 그 통신을 처리하는 서버 소프트웨어입니다. 같은 수준의 대체 제품이 아닙니다.")}`,
    stack: stackEntry(assets.player, "요청", "플레이어가 필요한 영상 데이터나 재생 정보를 요청합니다.") + stackEntry(assets.https, "TLS 보호", "HTTPS 연결에서 전송 내용을 보호합니다.") + stackEntry(assets.ocaIcon, "응답", "전송 서버가 요청한 영상 데이터를 돌려보냅니다."),
    source: ["HTTP 개요 · MDN", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"]
  }
};

const technologies = [
  { key: "aws", node: "playback", title: "AWS", category: "CONTROL PLANE / 클라우드", image: assets.aws, alt: "AWS 로고", description: "재생 관련 제어 서비스를 실행하는 영역입니다. 플레이어에 필요한 정보를 연결하며, 실제 영상 바이트를 보내는 경로와 구분합니다.", why: "재생 제어와 파일 전송을 서로 다른 요구에 맞춰 운영할 수 있습니다.", alternative: "다른 클라우드 또는 자체 인프라. 지역·서비스 범위·운영 역량을 비교합니다." },
  { key: "oca", node: "oca", title: "OCA", category: "DELIVERY / 영상 전송 서버", image: assets.oca, alt: "OCA 서버 개념 일러스트", wide: true, description: "ISP 내부 또는 피어링 거점에 놓이는 Open Connect Appliance입니다. 미리 배치한 영상을 플레이어로 직접 전달합니다.", why: "콘텐츠를 사용자 네트워크 가까이에 두고 여러 거점으로 전달 부하를 나눕니다.", alternative: "CloudFront·Fastly 같은 관리형 CDN. 직접 제어할 범위와 운영 책임이 달라집니다." },
  { key: "freebsd", node: "oca", title: "FreeBSD", category: "OPERATING SYSTEM / 운영체제", image: assets.freebsd, alt: "FreeBSD 로고", description: "공개된 OCA 소프트웨어 설명에 등장하는 운영체제입니다. 파일 읽기와 네트워크 전송을 수행하는 서버의 기반 계층입니다.", why: "운영체제와 네트워크·스토리지 경로를 전송 목적에 맞춰 다룰 수 있습니다.", alternative: "Linux 계열 운영체제. 드라이버·성능 튜닝·팀의 운영 경험을 함께 검증합니다." },
  { key: "nginx", node: "oca", title: "NGINX", category: "HTTP SERVER / 파일 응답", image: assets.nginx, alt: "NGINX 로고", description: "공개된 OCA 소프트웨어 구성의 HTTP 서버입니다. 플레이어가 요청한 영상 파일 데이터를 네트워크로 응답하는 역할을 합니다.", why: "영상 파일을 전달하는 HTTP 계층을 담당합니다. 전체 CDN을 대신하는 제품은 아닙니다.", alternative: "Caddy·Apache HTTP Server 또는 전용 파일 서버. 파일 응답 성능·TLS·관측·운영 기능을 검증합니다." },
  { key: "https", node: "oca", title: "HTTP(S)", category: "PROTOCOL / 요청과 전송", image: assets.https, alt: "HTTPS 전송을 설명하는 방패와 자물쇠 아이콘", description: "플레이어가 재생 정보와 영상 조각을 요청하고 응답받는 통신 기반입니다. HTTPS는 TLS를 통해 전송 내용을 보호합니다.", why: "HTTP 기반의 파일 전송과 캐시·연결 관리 생태계를 활용할 수 있습니다.", alternative: "WebRTC는 실시간 상호작용에 맞는 대안입니다. 주문형 영상과는 캐시·지연·운영 요구가 다릅니다." },
  { key: "fill", node: "fill", title: "콘텐츠 배치", category: "PREPARATION / 시청 전 준비", image: assets.fill, alt: "콘텐츠 저장과 배치를 설명하는 아이콘", description: "시청 요청이 발생하기 전에 영상 파일을 전송 거점에 준비하는 과정입니다. 실제 배치 체계를 기능 단위로 요약했습니다.", why: "시청 시점에 전달할 파일을 거점에서 제공할 수 있도록 준비합니다.", alternative: "요청 시 가져오는 캐시 방식. 첫 요청 지연·원본 부하·저장 비용을 함께 비교합니다." }
];

let selectedNode = "oca";
let selectedPanel = "role";
let selectedTechnology = null;
let selectedStep = -1;
let failover = false;
let playbackTimer = null;
let toastTimer = null;
let currentRoute = null;
let navigationSequence = 0;
let activeTransition = null;
let libraryScrollY = 0;

function renderDetail() {
  const component = technologyDetails[selectedTechnology] || components[selectedNode];
  $("#detail-kind").textContent = selectedTechnology && technologyDetails[selectedTechnology] ? "TECHNOLOGY / " : "COMPONENT / ";
  $("#detail-count").textContent = component.count;
  $("#detail-title").textContent = component.title;
  $("#detail-english").textContent = component.english;
  const image = $("#detail-image");
  image.src = component.image;
  image.alt = component.alt;
  image.classList.toggle("brand-only", Boolean(component.brand));
  $("#detail-badges").innerHTML = renderTechnologyBadges(component.badges);
  const noteKey = selectedTechnology || ({ player: "abr", playback: "aws", steering: "steering", origin: "fill", fallback: "steering" }[selectedNode] || selectedNode);
  $("#detail-content").innerHTML = (renderFocusedDescription() || component[selectedPanel]) + `<button class="detail-sheet-open" data-open-tech-sheet="${noteKey}" aria-haspopup="dialog">원리·동작·예제를 크게 보기 ↗</button><a class="detail-read-link" href="#tech-${noteKey}" data-read-tech="${noteKey}">본문에서 더 읽기 ↗</a>`;
  $("#detail-content").scrollTop = 0;
  $("#detail-content").setAttribute("aria-labelledby", `${selectedPanel}-tab`);
  $$('[data-panel]').forEach(button => {
    const active = button.dataset.panel === selectedPanel;
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
  $("#detail-source").innerHTML = `공개 설명 ↗ &nbsp;<a href="${component.source[1]}" target="_blank" rel="noopener">${component.source[0]}</a>`;
  syncTechnologySelection();
}

function centerNodeInDiagram(id) {
  const viewport = $(".diagram-viewport");
  if (viewport.scrollWidth <= viewport.clientWidth + 1) return;
  const rect = $(`[data-node="${id}"]`).getBoundingClientRect();
  const parent = viewport.getBoundingClientRect();
  viewport.scrollTo({ left: viewport.scrollLeft + rect.left - parent.left - (viewport.clientWidth - rect.width) / 2, behavior: "auto" });
}

function selectNode(id, { panel = selectedPanel, reveal = true, technology = null, preserveStep = false } = {}) {
  if (!components[id]) return;
  if (!preserveStep && selectedStep >= 0) setStep(-1);
  selectedNode = id;
  selectedPanel = panel;
  selectedTechnology = technology;
  $$(".node").forEach(node => {
    const active = node.dataset.node === id;
    node.classList.toggle("selected", active);
    node.setAttribute("aria-pressed", String(active));
  });
  renderDetail();
  if (reveal) centerNodeInDiagram(id);
}

function setStep(index) {
  selectedStep = index;
  $$('[data-step]').forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.step) === index)));
  $$('[data-flow]').forEach(group => group.classList.toggle("dimmed", index >= 0 && !group.dataset.flow.split(" ").map(Number).includes(index)));
  if (failover && index === 8) $("#segment-request").classList.add("dimmed");
  const related = failover && index === 8 ? ["player", "fallback"] : (playbackJourney[index]?.nodes || []);
  $$(".node").forEach(node => node.classList.toggle("flow-related", related.includes(node.dataset.node)));
  $("#canvas-title").textContent = index < 0 ? "제어 경로와 영상 경로를 나눠 읽어보세요." : `${String(index + 1).padStart(2, "0")} · ${failover && index === 8 ? "다른 후보로 요청 재시도" : playbackJourney[index].title}`;
}

function stopPlayback() {
  if (playbackTimer) clearInterval(playbackTimer);
  playbackTimer = null;
  $("#diagram").classList.remove("running");
  $("#play-button").textContent = "▶ 흐름 따라가기";
}

function setFailover(value) {
  failover = value;
  $("#failover-button").setAttribute("aria-pressed", String(value));
  $("#failover-button").textContent = value ? "↶ 기본 흐름으로" : "⇢ OCA 장애 흐름";
  $("#normal-video").toggleAttribute("hidden", value);
  $("#fallback-video").toggleAttribute("hidden", !value);
  $("#oca-status").setAttribute("fill", value ? "#d16d59" : "#74a17c");
  $("#oca-health-label").textContent = value ? "응답 실패" : "OCA";
  $("#scenario-description").textContent = value ? "장애 개념도 · 다른 후보로 재시도하는 경로이며 실제 복구 시간을 재현하지 않습니다." : "공개된 설계를 바탕으로 한 개념도 · 실제 물리 배치와 다를 수 있습니다.";
  if (selectedStep >= 0) setStep(selectedStep);
}

function showToast(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  toastTimer = setTimeout(() => { $("#toast").hidden = true; }, 2600);
}

function selectTech(key, fromCard = false) {
  const tech = technologies.find(item => item.key === key);
  if (!tech) return;
  stopPlayback();
  setStep(-1);
  selectNode(tech.node, { panel: "role", technology: key });
  const entry = $(`[data-stack-tech="${key}"]`);
  if (entry) {
    entry.classList.add("tech-focused");
    const container = $("#detail-content");
    if (container.scrollHeight > container.clientHeight) {
      container.scrollTop = entry.offsetTop - container.offsetTop - 8;
    }
  }
  if (fromCard) {
    $("#architecture").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    showToast(`${tech.title}의 위치와 역할을 구성도에 표시했습니다.`);
  }
}

function routeFromURL() {
  return new URLSearchParams(location.search).get("case") === "netflix" ? "netflix" : "library";
}

function scrollToRoute(route) {
  if (route === "library") {
    window.scrollTo({ top: libraryScrollY, behavior: "instant" });
    return;
  }
  syncTechnologyHash();
  let id = "";
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { /* A malformed fragment has no target. */ }
  const target = id ? document.getElementById(id) : null;
  if (target && $("#design").contains(target)) target.scrollIntoView({ block: "start", behavior: "instant" });
  else window.scrollTo({ top: 0, behavior: "instant" });
}

function applyRoute(route, resetCase = true) {
  $("#library").hidden = route !== "library";
  $("#design").hidden = route !== "netflix";
  document.documentElement.dataset.route = route;
  document.title = route === "library" ? "Architecture Atlas — 아키텍처 라이브러리" : "넷플릭스, 재생 버튼 뒤의 설계 · Architecture Atlas";
  $(".skip-link").setAttribute("href", route === "library" ? "#library-title" : "#case-title");
  if (route === "netflix") {
    if (resetCase) {
      setFailover(false);
      setStep(-1);
      selectNode("oca", { panel: "role", reveal: false });
    }
    updateScrollHint();
  }
  currentRoute = route;
  scrollToRoute(route);
}

async function presentRoute(route, { animate = true, focus = true } = {}) {
  const sequence = ++navigationSequence;
  if (activeTransition) activeTransition.skipTransition();
  stopPlayback();
  $("#toast").hidden = true;
  if (dialog.open) dialog.close();
  closeTechnologySheet();
  document.documentElement.dataset.transitioning = "true";
  const update = async () => {
    if (sequence !== navigationSequence) return;
    applyRoute(route);
    await document.fonts.ready;
    const images = [...document.querySelectorAll(".case-cover img, .detail-cover img")].filter(image => image.getClientRects().length);
    await Promise.all(images.map(image => image.decode().catch(() => {})));
  };
  try {
    const canAnimate = animate && typeof document.startViewTransition === "function" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (canAnimate) {
      document.documentElement.dataset.navigationEngine = "view-transition";
      const transition = document.startViewTransition(update);
      activeTransition = transition;
      transition.ready.catch(() => {});
      await transition.finished;
    } else {
      document.documentElement.dataset.navigationEngine = "instant";
      await update();
    }
  } finally {
    if (sequence === navigationSequence) {
      activeTransition = null;
      delete document.documentElement.dataset.transitioning;
      if (focus) {
        const target = route === "netflix" ? $("#case-title") : $("#netflix-card");
        target.focus({ preventScroll: true });
      }
    }
  }
}

function navigate(route) {
  if (route === currentRoute && !document.documentElement.dataset.transitioning) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (currentRoute === "library") libraryScrollY = window.scrollY;
  const url = new URL(location.href);
  url.hash = "";
  if (route === "netflix") url.searchParams.set("case", "netflix");
  else url.searchParams.delete("case");
  history.pushState({ atlasRoute: route }, "", url);
  presentRoute(route).catch(error => console.error("Navigation failed", error));
}

function updateScrollHint() {
  const viewport = $(".diagram-viewport");
  $(".canvas").classList.toggle("is-scrollable", viewport.scrollWidth > viewport.clientWidth + 2);
}

function wireKeyboardTabs(selector) {
  const buttons = $$(selector);
  buttons.forEach(button => button.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = buttons.indexOf(button);
    let next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].click();
    buttons[next].focus();
  }));
}

$("#tech-grid").innerHTML = technologies.map(tech => `<article class="tech-card"><div class="tech-card-header"><div class="tech-card-image${tech.wide ? " wide" : ""}"><img src="${tech.image}" alt="${tech.alt}"></div><div><h3>${tech.title}</h3><span class="category">${tech.category}</span></div></div><p>${tech.description}</p><dl><dt>이 구조에서 얻는 것</dt><dd>${tech.why}</dd></dl><button class="product-open" data-show-alternatives="${alternativeCategoryFor(tech.key)}">회사·제품별 대안 보기 ↓</button><a class="tech-card-read" href="#tech-${tech.key}" data-read-tech="${tech.key}">동작 원리와 예제 읽기 ↗</a><button data-card-tech="${tech.key}">구성도에서 위치와 역할 보기 ↗</button></article>`).join("");

$$(".node").forEach(node => {
  node.addEventListener("click", () => { stopPlayback(); selectNode(node.dataset.node); });
  node.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
});
$$('[data-panel]').forEach(button => button.addEventListener("click", () => {
  selectedPanel = button.dataset.panel;
  renderDetail();
}));
$$('[data-step]').forEach(button => button.addEventListener("click", () => {
  selectJourneyStep(Number(button.dataset.step));
}));
$$('[data-tech]').forEach(button => button.addEventListener("click", () => selectTech(button.dataset.tech)));
$$('[data-card-tech]').forEach(button => button.addEventListener("click", () => selectTech(button.dataset.cardTech, true)));
$$('[data-open-case]').forEach(link => link.addEventListener("click", event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate("netflix");
}));
$$('[data-home]').forEach(link => link.addEventListener("click", event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate("library");
}));
window.addEventListener("popstate", () => {
  closeTechnologySheet();
  const route = routeFromURL();
  if (route === currentRoute && !document.documentElement.dataset.transitioning) scrollToRoute(route);
  else presentRoute(route).catch(error => console.error("History navigation failed", error));
});

$("#play-button").addEventListener("click", () => {
  if (playbackTimer) return stopPlayback();
  setFailover(false);
  let index = 0;
  const advance = () => {
    setStep(index);
    selectNode(playbackJourney[index].node, { panel: "role", preserveStep: true });
    index = (index + 1) % playbackJourney.length;
  };
  advance();
  $("#diagram").classList.add("running");
  $("#play-button").textContent = "Ⅱ 잠시 멈추기";
  playbackTimer = setInterval(advance, 2400);
});
$("#reset-button").addEventListener("click", () => {
  stopPlayback();
  setFailover(false);
  setStep(-1);
});
$("#failover-button").addEventListener("click", () => {
  stopPlayback();
  setFailover(!failover);
  setStep(failover ? 8 : -1);
  selectNode(failover ? "fallback" : "oca", { panel: "role", preserveStep: true });
});
$("#alternatives-button").addEventListener("click", () => {
  stopPlayback();
  showAlternatives(alternativeCategoryFor(selectedTechnology || selectedNode));
});
$("#go-to-alternatives").addEventListener("click", () => showAlternatives("delivery"));

const dialog = $("#zoom-dialog");
$$(".zoomable").forEach(image => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `확대: ${image.alt}`);
  image.setAttribute("aria-haspopup", "dialog");
  const open = () => {
    $("#zoom-image").src = image.src;
    $("#zoom-image").alt = image.alt;
    dialog.showModal();
  };
  image.addEventListener("click", open);
  image.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
  });
});
$("#close-zoom").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
document.addEventListener("visibilitychange", () => { if (document.hidden) stopPlayback(); });
wireKeyboardTabs("[data-panel]");
new ResizeObserver(updateScrollHint).observe($(".diagram-viewport"));
renderDetail();
setStep(-1);
initializeTechnologyReader();
initializeArchitectureInsights();
initializeAlternativeCatalogue();
initializeTechnologySheet();

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
applyRoute(routeFromURL());
