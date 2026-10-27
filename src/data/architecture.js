import { resolveAssets } from "./assets.js";

export const components = resolveAssets({
  player: {
    count: "01",
    title: "재생을 시작하고, 영상을 받는 곳",
    english: "사용자 기기 · 재생 클라이언트",
    image: "assets/tech/player.svg",
    alt: "영상 재생 화면을 보여주는 플레이어 도식",
    badges: ["TV · 모바일 · 웹", "재생", "HTTP(S)"],
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"],
    stack: [
      {
        image: "assets/tech/player.svg",
        title: "Player",
        text: "기기에서 영상 데이터를 받아 디코딩하고 재생합니다.",
        technology: "abr",
      },
      {
        image: "assets/tech/https.svg",
        title: "HTTP(S)",
        text: "재생 정보와 영상 조각을 요청하고 응답받는 통신 기반입니다.",
        technology: "https",
      },
      {
        note: "화질 선택, DRM과 기기별 플레이어 구현은 이번 전달망 구성도의 범위 밖입니다.",
      },
    ],
  },
  playback: {
    count: "02",
    title: "재생에 필요한 정보를 연결",
    english: "클라우드 · 재생 제어",
    image: "assets/tech/aws.svg",
    alt: "AWS 로고",
    brand: true,
    badges: ["AWS", "재생 API", "재생 제어"],
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"],
    stack: [
      {
        image: "assets/tech/aws.svg",
        title: "AWS / 클라우드",
        text: "재생 관련 제어 서비스를 실행하는 영역을 나타냅니다.",
        technology: "aws",
      },
      {
        image: "assets/tech/https.svg",
        title: "API 요청·응답",
        text: "플레이어와 재생 정보를 주고받습니다.",
        technology: "https",
      },
      {
        note: "특정 AWS 서비스, 프로그래밍 언어나 데이터베이스를 이 노드만으로 확정하지 않습니다.",
      },
    ],
  },
  steering: {
    count: "03",
    title: "어느 OCA에서 받을지 결정",
    english: "전송 서버 선택",
    image: "assets/tech/routing.svg",
    alt: "조건에 맞는 전달 경로를 고르는 개념 도식",
    badges: ["파일 보유 여부", "네트워크 상태", "서버 상태"],
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"],
    stack: [
      {
        image: "assets/tech/oca-icon.svg",
        title: "OCA 상태와 콘텐츠 보유 정보",
        text: "사용 가능한 파일과 서버 상태가 선택에 영향을 줍니다.",
        technology: "oca",
      },
      {
        image: "assets/tech/storage.svg",
        title: "전송 후보 선택",
        text: "콘텐츠와 네트워크 조건을 고려해 전송 후보를 결정합니다.",
        technology: null,
      },
      {
        note: "세부 라우팅 알고리즘이나 내부 API는 이 구성도에서 구현 사실로 단정하지 않습니다.",
      },
    ],
  },
  oca: {
    count: "04",
    title: "사용자 가까이의 영상 서버",
    english: "Open Connect Appliance",
    image: "assets/tech/oca-appliance.svg",
    alt: "디스크와 네트워크 전송 기능을 갖춘 OCA 서버 설명 그림",
    badges: ["OCA", "FreeBSD", "NGINX", "HTTP(S)"],
    source: [
      "Open Connect Appliances",
      "https://openconnect.netflix.com/en/appliances/",
    ],
    stack: [
      {
        image: "assets/tech/storage.svg",
        title: "디스크 / 캐시된 파일",
        text: "미리 배치한 영상 파일을 읽을 준비를 합니다.",
        technology: null,
      },
      {
        image: "assets/tech/nginx-mark.svg",
        title: "NGINX / HTTP 서버",
        text: "HTTP 요청을 처리하고 영상 파일 데이터를 응답합니다.",
        technology: "nginx",
      },
      {
        image: "assets/tech/freebsd.svg",
        title: "FreeBSD / 운영체제",
        text: "파일 읽기와 네트워크 I/O의 기반을 제공합니다.",
        technology: "freebsd",
      },
      {
        image: "assets/tech/https.svg",
        title: "HTTP(S) / 전송",
        text: "플레이어가 영상 조각을 요청하고 전달받습니다.",
        technology: "https",
      },
    ],
  },
  origin: {
    count: "05",
    title: "미리 준비한 여러 화질의 영상",
    english: "인코딩된 원본 파일",
    image: "assets/tech/storage.svg",
    alt: "인코딩된 영상 파일을 보관하는 저장소 개념 그림",
    badges: ["인코딩 파일", "영상 · 오디오", "여러 화질"],
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"],
    stack: [
      {
        image: "assets/tech/storage.svg",
        title: "영상·오디오 파일",
        text: "전송과 재생에 사용할 인코딩된 파일을 준비합니다.",
        technology: null,
      },
      {
        image: "assets/tech/storage.svg",
        title: "원본 저장 역할",
        text: "전송 거점에 배치할 콘텐츠를 보관합니다.",
        technology: null,
      },
      {
        note: "코덱, 인코딩, DRM과 패키징의 세부 선택은 별도의 설계 주제로 확장할 수 있습니다.",
      },
    ],
  },
  fill: {
    count: "06",
    title: "시청 요청 전에 거점을 채우기",
    english: "사전 배치",
    image: "assets/tech/fill.svg",
    alt: "저장된 콘텐츠를 전달망으로 배치하는 개념 그림",
    badges: ["사전 배치", "파일 보유 관리"],
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"],
    stack: [
      {
        image: "assets/tech/storage.svg",
        title: "콘텐츠 배치 정책",
        text: "어떤 파일을 어느 거점에 둘지 결정하는 역할입니다.",
        technology: "fill",
      },
      {
        image: "assets/tech/oca-icon.svg",
        title: "OCA 저장 용량",
        text: "전송 거점의 파일 보유와 저장 공간을 관리합니다.",
        technology: "oca",
      },
      {
        note: "‘콘텐츠 배치’는 기능 이름입니다. 실제 내부의 단일 제품이나 서비스 이름으로 제시한 것은 아닙니다.",
      },
    ],
  },
  fallback: {
    count: "07",
    title: "한 전송 서버에만 기대지 않기",
    english: "다른 서버로 재시도",
    image: "assets/tech/oca-appliance.svg",
    alt: "다른 전송 거점의 OCA 서버를 설명하는 그림",
    badges: ["대체 서버", "가용성", "재시도"],
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"],
    stack: [
      {
        image: "assets/tech/oca-icon.svg",
        title: "다른 전송 후보",
        text: "요청할 수 있는 대체 서버가 필요합니다.",
        technology: "oca",
      },
      {
        image: "assets/tech/player.svg",
        title: "플레이어의 오류 처리",
        text: "전송 오류를 처리하고 재생을 이어가기 위한 기능이 필요합니다.",
        technology: "abr",
      },
      {
        note: "정확한 후보 선택과 재시도 방식은 원문과 기기 구현의 확인이 필요한 범위입니다.",
      },
    ],
  },
});

export const technologyDetails = resolveAssets({
  aws: {
    count: "02",
    title: "AWS · 재생 제어가 실행되는 곳",
    english: "클라우드 · 재생 제어",
    image: "assets/tech/aws.svg",
    alt: "AWS 로고",
    brand: true,
    badges: ["클라우드", "재생 서비스", "재생 제어"],
    source: ["Netflix Open Connect", "https://openconnect.netflix.com/en/"],
    stack: [
      {
        image: "assets/tech/aws.svg",
        title: "클라우드 실행 환경",
        text: "재생 관련 서비스를 실행하는 기반입니다.",
        technology: "aws",
      },
      {
        image: "assets/tech/player.svg",
        title: "재생 정보 요청·응답",
        text: "플레이어와 필요한 제어 정보를 연결합니다.",
        technology: "abr",
      },
      {
        note: "컴퓨팅, 데이터 저장, 관측의 구체적인 제품 선택은 각 서비스의 원문이 필요한 범위입니다.",
      },
    ],
  },
  freebsd: {
    count: "04",
    title: "FreeBSD · 전송 서버의 기반",
    english: "OCA의 운영체제",
    image: "assets/tech/freebsd.svg",
    alt: "FreeBSD 로고",
    brand: true,
    badges: ["운영체제", "저장장치 입출력", "네트워크 입출력"],
    source: ["FreeBSD Handbook", "https://docs.freebsd.org/en/books/handbook/"],
    stack: [
      {
        image: "assets/tech/storage.svg",
        title: "스토리지 경로",
        text: "파일 읽기와 저장장치 접근의 기반을 제공합니다.",
        technology: null,
      },
      {
        image: "assets/tech/https.svg",
        title: "네트워크 경로",
        text: "데이터를 네트워크로 전달하는 운영체제 기능을 제공합니다.",
        technology: "https",
      },
      {
        image: "assets/tech/nginx-mark.svg",
        title: "상위 계층: NGINX",
        text: "운영체제 위에서 HTTP 요청과 파일 응답을 담당합니다.",
        technology: "nginx",
      },
    ],
  },
  nginx: {
    count: "04",
    title: "NGINX · 영상 파일을 응답",
    english: "OCA의 HTTP 서버",
    image: "assets/tech/nginx-mark.svg",
    alt: "NGINX 로고",
    brand: true,
    badges: ["HTTP 서버", "파일 전송", "OCA 내부"],
    source: ["NGINX Documentation", "https://nginx.org/en/docs/"],
    stack: [
      {
        image: "assets/tech/player.svg",
        title: "입력: 플레이어의 요청",
        text: "전달받을 영상·오디오 데이터에 대한 HTTP 요청입니다.",
        technology: "abr",
      },
      {
        image: "assets/tech/storage.svg",
        title: "처리: 준비된 파일 읽기",
        text: "응답할 파일의 데이터를 읽습니다.",
        technology: null,
      },
      {
        image: "assets/tech/https.svg",
        title: "출력: 네트워크 응답",
        text: "운영체제의 I/O 기반을 사용해 데이터를 보냅니다.",
        technology: "https",
      },
    ],
  },
  https: {
    count: "04",
    title: "HTTP(S) · 요청과 데이터 전송",
    english: "플레이어와 서버 간 통신",
    image: "assets/tech/https.svg",
    alt: "HTTPS를 설명하는 방패와 자물쇠 도식",
    brand: true,
    badges: ["HTTP", "HTTPS / TLS", "요청 · 응답"],
    source: [
      "HTTP 개요 · MDN",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
    ],
    stack: [
      {
        image: "assets/tech/player.svg",
        title: "요청",
        text: "플레이어가 필요한 영상 데이터나 재생 정보를 요청합니다.",
        technology: "abr",
      },
      {
        image: "assets/tech/https.svg",
        title: "TLS 보호",
        text: "HTTPS 연결에서 전송 내용을 보호합니다.",
        technology: "https",
      },
      {
        image: "assets/tech/oca-icon.svg",
        title: "응답",
        text: "전송 서버가 요청한 영상 데이터를 돌려보냅니다.",
        technology: "oca",
      },
    ],
  },
});

export const technologies = resolveAssets([
  {
    key: "aws",
    node: "playback",
    title: "AWS",
    category: "클라우드",
    image: "assets/tech/aws.svg",
    alt: "AWS 로고",
    description:
      "재생 관련 제어 서비스를 실행하는 영역입니다. 플레이어에 필요한 정보를 연결하며, 실제 영상 바이트를 보내는 경로와 구분합니다.",
    why: "재생 제어와 파일 전송을 서로 다른 요구에 맞춰 운영할 수 있습니다.",
  },
  {
    key: "oca",
    node: "oca",
    title: "OCA",
    category: "영상 전송 서버",
    image: "assets/tech/oca-appliance.svg",
    alt: "OCA 서버 개념 일러스트",
    wide: true,
    description:
      "ISP 내부 또는 피어링 거점에 놓이는 Open Connect Appliance입니다. 미리 배치한 영상을 플레이어로 직접 전달합니다.",
    why: "콘텐츠를 사용자 네트워크 가까이에 두고 여러 거점으로 전달 부하를 나눕니다.",
  },
  {
    key: "freebsd",
    node: "oca",
    title: "FreeBSD",
    category: "운영체제",
    image: "assets/tech/freebsd.svg",
    alt: "FreeBSD 로고",
    description:
      "공개된 OCA 소프트웨어 설명에 등장하는 운영체제입니다. 파일 읽기와 네트워크 전송을 수행하는 서버의 기반 계층입니다.",
    why: "운영체제와 네트워크·스토리지 경로를 전송 목적에 맞춰 다룰 수 있습니다.",
  },
  {
    key: "nginx",
    node: "oca",
    title: "NGINX",
    category: "HTTP 파일 응답",
    image: "assets/tech/nginx-mark.svg",
    alt: "NGINX 로고",
    description:
      "공개된 OCA 소프트웨어 구성의 HTTP 서버입니다. 플레이어가 요청한 영상 파일 데이터를 네트워크로 응답하는 역할을 합니다.",
    why: "영상 파일을 전달하는 HTTP 계층을 담당합니다. 전체 CDN을 대신하는 제품은 아닙니다.",
  },
  {
    key: "https",
    node: "oca",
    title: "HTTP(S)",
    category: "전송 프로토콜",
    image: "assets/tech/https.svg",
    alt: "HTTPS 전송을 설명하는 방패와 자물쇠 아이콘",
    description:
      "플레이어가 재생 정보와 영상 조각을 요청하고 응답받는 통신 기반입니다. HTTPS는 TLS를 통해 전송 내용을 보호합니다.",
    why: "HTTP 기반의 파일 전송과 캐시·연결 관리 생태계를 활용할 수 있습니다.",
  },
  {
    key: "fill",
    node: "fill",
    title: "콘텐츠 배치",
    category: "콘텐츠 사전 배치",
    image: "assets/tech/fill.svg",
    alt: "콘텐츠 저장과 배치를 설명하는 아이콘",
    description:
      "시청 요청이 발생하기 전에 영상 파일을 전송 거점에 준비하는 과정입니다. 실제 배치 체계를 기능 단위로 요약했습니다.",
    why: "시청 시점에 전달할 파일을 거점에서 제공할 수 있도록 준비합니다.",
  },
]);

export const playbackJourney = resolveAssets([
  {
    title: "전달할 파일 준비",
    short: "여러 화질·오디오 파일",
    node: "origin",
    nodes: ["origin"],
    from: "콘텐츠 준비 과정",
    to: "영상 파일 저장 역할",
    payload: "인코딩된 영상·오디오와 파일 버전",
    description:
      "시청 시점보다 앞선 준비입니다. 여러 기기와 네트워크에 맞는 표현을 파일로 만들어 전송 거점에 배치할 수 있게 합니다.",
    actions: [
      "여러 화질·오디오 표현을 준비합니다.",
      "재생에 필요한 파일과 버전을 구분합니다.",
      "전달 거점으로 보낼 파일 목록을 준비합니다.",
    ],
    tech: ["fill"],
    sample: "영상 파일 + 오디오 파일\n표현: 비트레이트·코덱·언어별 준비",
  },
  {
    title: "OCA에 파일 배치",
    short: "시청 전에 거점을 채움",
    node: "fill",
    nodes: ["origin", "fill", "oca"],
    from: "준비된 콘텐츠",
    to: "Open Connect의 전송 거점",
    payload: "시청 요청에 응답할 영상·오디오 파일",
    description:
      "파일이 필요한 거점에 미리 존재하도록 준비합니다. 배치가 끝난 파일 보유 상태는 이후 전송 후보를 고를 때 중요한 조건이 됩니다.",
    actions: [
      "예상 수요·저장 공간과 배치 계획을 고려합니다.",
      "전송 거점으로 파일을 준비합니다.",
      "해당 파일을 제공할 수 있는 상태를 반영합니다.",
    ],
    tech: ["fill", "oca"],
    sample: "파일 준비 → 거점에 배치\n파일 보유 상태 → 후보 선택에 반영",
  },
  {
    title: "재생 정보 요청",
    short: "플레이어 → 클라우드",
    node: "playback",
    nodes: ["player", "playback"],
    from: "시청 기기의 플레이어",
    to: "클라우드 재생 서비스",
    payload: "선택한 콘텐츠와 재생에 필요한 요청 정보",
    description:
      "사용자가 재생을 시작하면 플레이어는 먼저 제어 경로에 필요한 정보를 요청합니다. 이 API 응답과 실제 영상 파일의 응답은 서로 다른 역할입니다.",
    actions: [
      "플레이어가 재생을 시작할 정보를 요청합니다.",
      "클라우드의 재생 관련 기능이 요청을 처리합니다.",
      "영상 전달에 사용할 정보와 후보를 연결합니다.",
    ],
    tech: ["aws", "https"],
    sample: "플레이어 → 재생 제어 API\n이 단계의 응답 ≠ 영상 파일 전체",
  },
  {
    title: "전송 후보 조회",
    short: "파일·경로·상태 확인",
    node: "steering",
    nodes: ["playback", "steering", "oca"],
    from: "재생 제어와 전송 선택 역할",
    to: "사용 가능한 OCA 후보",
    payload: "파일 보유 여부·접근 경로·서버 상태",
    description:
      "지리적으로 가까운지만 보지 않습니다. 요청한 파일이 있고 해당 사용자의 네트워크에서 이용할 수 있는 전송 후보가 필요합니다.",
    actions: [
      "요청한 파일을 제공할 수 있는지 봅니다.",
      "사용자의 네트워크에서 적합한 경로를 검토합니다.",
      "서버 상태와 여유 용량을 고려합니다.",
    ],
    tech: ["steering", "oca"],
    sample: "파일 보유 + 접근 경로 + 상태\n→ 이용할 수 있는 전송 후보",
  },
  {
    title: "정보·후보 응답",
    short: "클라우드 → 플레이어",
    node: "player",
    nodes: ["playback", "steering", "player"],
    from: "클라우드 재생 서비스",
    to: "플레이어",
    payload: "재생 관련 정보와 사용할 수 있는 전달 후보",
    description:
      "플레이어는 다음 파일 요청을 어디에 보낼지 알게 됩니다. 이 노드는 실제 응답 필드나 내부 서비스의 수를 고정하지 않고 기능을 요약합니다.",
    actions: [
      "재생에 필요한 정보를 돌려줍니다.",
      "이용할 수 있는 전송 후보를 연결합니다.",
      "플레이어가 영상 데이터 요청을 준비합니다.",
    ],
    tech: ["aws", "steering"],
    sample: "제어 정보 응답\n→ 다음 요청은 영상 전달 서버로",
  },
  {
    title: "영상 구간 요청",
    short: "플레이어 → OCA · HTTP",
    node: "oca",
    nodes: ["player", "oca"],
    from: "플레이어",
    to: "선택한 OCA의 HTTP 서버",
    payload: "미디어 파일 URL 또는 필요한 바이트 범위",
    description:
      "플레이어가 전송 서버에 직접 파일을 요청합니다. 미디어 구간이 별도 파일이면 일반 GET, 큰 파일의 일부를 받을 때는 Range를 활용할 수 있습니다.",
    actions: [
      "재생 위치에 필요한 구간을 정합니다.",
      "파일 URL 또는 바이트 범위를 요청합니다.",
      "OCA 안의 HTTP 서버가 요청을 처리합니다.",
    ],
    tech: ["https", "nginx"],
    sample: "GET /film-demo/video.mp4 HTTP/1.1\nRange: bytes=0-1023",
  },
  {
    title: "파일 읽기·응답",
    short: "NGINX · FreeBSD → 플레이어",
    node: "oca",
    nodes: ["oca", "player"],
    from: "OCA의 파일·HTTP·OS 계층",
    to: "플레이어",
    payload: "HTTP 상태·헤더와 영상·오디오 바이트",
    description:
      "NGINX가 요청을 파일과 연결하고, OS의 파일·네트워크 I/O를 활용해 응답합니다. TLS와 하드웨어 조건에 따라 실제 전송 경로는 달라집니다.",
    actions: [
      "파일과 요청 범위를 확인합니다.",
      "저장장치·파일 페이지와 전송 경로를 사용합니다.",
      "영상 바이트를 플레이어로 보냅니다.",
    ],
    tech: ["nginx", "freebsd", "https"],
    sample:
      "HTTP/1.1 206 Partial Content\nContent-Range: bytes 0-1023/10000\nContent-Length: 1024",
  },
  {
    title: "버퍼·화질 판단",
    short: "기기 안에서 다음 구간 판단",
    node: "player",
    nodes: ["player"],
    from: "수신한 미디어 구간",
    to: "플레이어의 버퍼·디코더",
    payload: "재생 가능한 데이터와 다운로드 관측값",
    description:
      "플레이어는 받은 구간을 재생하고 버퍼와 네트워크를 관측합니다. 적응형 재생에서는 다음 구간의 표현을 바꿀 수 있습니다. 이는 OCA에서 즉석 인코딩하는 과정과 다릅니다.",
    actions: [
      "미디어 데이터를 버퍼에 연결합니다.",
      "구간을 디코딩하고 재생합니다.",
      "다음 요청의 화질·구간을 판단합니다.",
    ],
    tech: ["abr"],
    sample: "4초 × 5 Mb/s = 20 Mb = 2.5 MB\n단순 구간 크기 예제 · 오디오 제외",
  },
  {
    title: "다음 구간 요청",
    short: "재생하며 요청을 반복",
    node: "player",
    nodes: ["player", "oca"],
    from: "재생 중인 플레이어",
    to: "사용할 수 있는 전달 후보",
    payload: "다음 영상·오디오 구간 요청",
    description:
      "재생 중에도 요청·응답이 이어집니다. 전송 오류가 발생하면 다른 후보의 파일·경로·여유 용량과 재시도 시간을 함께 검토해야 합니다.",
    actions: [
      "다음 구간을 이어서 요청합니다.",
      "처리량과 오류를 계속 관측합니다.",
      "실패 시 가능한 후보와 재시도 예산을 검토합니다.",
    ],
    tech: ["abr", "steering"],
    sample: "구간 수신 → 버퍼·재생 → 다음 요청\n오류 발생 → 다른 후보 검토",
  },
]);

export const requestFacts = resolveAssets({
  player: {
    purpose: "재생 정보를 받아, 필요한 영상 구간을 요청하는 클라이언트입니다.",
    contract: [
      "콘텐츠 선택 · 재생 정보 · 받은 영상 구간",
      "구간 요청 → 버퍼 저장 → 디코딩·재생",
      "다음 구간 요청 · 재생 품질 관측",
    ],
    why: "제어 API와 영상 전달 서버를 연결합니다. 재생 제어와 바이트 전달이 별도 경로라는 사실이 여기서 만납니다.",
    boundary:
      "ABR은 다음 화질을 고르는 플레이어의 판단입니다. OCA가 요청마다 새로 인코딩하는 과정과 구분합니다.",
  },
  playback: {
    purpose: "영상을 시작하는 데 필요한 정보와 전달 후보를 연결합니다.",
    contract: [
      "플레이어의 재생 정보 요청",
      "재생 관련 제어 서비스 처리",
      "재생 정보 · 전송에 사용할 후보",
    ],
    why: "짧은 제어 요청은 응답 지연과 가용성이, 영상 전달은 대역폭과 파일 I/O가 중요합니다. 각각 다른 자원과 증설 기준을 가집니다.",
    boundary:
      "여러 기능을 묶은 개념 노드입니다. 특정 AWS 제품이나 내부 API 형식까지 확정하지 않습니다.",
  },
  steering: {
    purpose: "요청한 파일을 제공할 수 있는 전송 후보를 찾습니다.",
    contract: [
      "파일 보유 정보 · 접근 경로 · 거점 상태",
      "파일·네트워크·용량 조건으로 후보 검토",
      "플레이어가 요청할 수 있는 전송 후보",
    ],
    why: "지리적으로 가까워도 파일이 없거나 링크가 포화면 적합하지 않습니다. 위치, 파일과 상태를 함께 봅니다.",
    boundary:
      "상태 보고에는 지연이 있습니다. 정확한 선택 점수와 재시도 순서는 실제 구현의 확인이 필요합니다.",
  },
  oca: {
    purpose: "미리 준비한 영상 파일을 사용자 가까이에서 직접 응답합니다.",
    contract: [
      "플레이어의 영상·오디오 파일 요청",
      "준비된 파일 읽기 → HTTP 응답",
      "플레이어로 향하는 영상·오디오 바이트",
    ],
    why: "반복 시청되는 파일을 사용자 네트워크 가까이에 두면 긴 구간을 지나는 전송을 줄일 수 있습니다.",
    boundary:
      "NGINX는 HTTP 응답, FreeBSD는 파일·네트워크 I/O를 맡는 서로 다른 계층입니다. 아래 배지를 눌러 각각 살펴보세요.",
  },
  origin: {
    purpose: "전달망에 준비할 여러 화질·오디오의 파일을 보관합니다.",
    contract: [
      "인코딩을 마친 영상·오디오 파일",
      "버전·표현별 파일 보관",
      "전송 거점에 배치할 파일",
    ],
    why: "다양한 기기와 네트워크에 맞는 표현을 미리 준비하면 플레이어가 필요한 구간과 화질을 요청할 수 있습니다.",
    boundary:
      "코덱은 압축 방식, 패키징은 구간 구성, 저장소는 파일 보관의 역할입니다. 이 노드는 특정 저장소 제품을 나타내지 않습니다.",
  },
  fill: {
    purpose: "시청 요청이 오기 전에 거점에 필요한 파일을 준비합니다.",
    contract: [
      "준비된 파일 · 예상 수요 · 저장 여유",
      "배치 계획 → 파일 전송·보유 상태 확인",
      "시청 요청에 응답할 수 있는 거점의 파일",
    ],
    why: "콘텐츠 준비와 시청 시점의 전송을 나누어 생각합니다. 첫 요청의 대기와 배치 트래픽을 함께 계획할 수 있습니다.",
    boundary:
      "모든 파일을 모든 거점에 넣을 수는 없습니다. 미사용 파일의 비용과 파일 부재 시 다른 후보도 고려합니다.",
  },
  fallback: {
    purpose: "현재 서버에서 계속 받기 어려울 때 다른 전송 후보를 검토합니다.",
    contract: [
      "전송 실패 · 다른 후보의 보유 파일과 상태",
      "남은 버퍼·시간 예산 안에서 재시도 검토",
      "다른 후보로의 요청 또는 재생 오류 처리",
    ],
    why: "대체 서버에도 같은 파일과 접근 경로, 이동한 부하를 받을 여유가 있어야 합니다. 후보 수만 늘려서는 충분하지 않습니다.",
    boundary:
      "이 그림은 후보 변경의 개념입니다. 실제 복구 시간이나 무중단 재생을 보장하는 시뮬레이션이 아닙니다.",
  },
  aws: {
    purpose: "재생 관련 제어 서비스를 실행하는 클라우드 플랫폼입니다.",
    contract: [
      "재생을 시작하는 데 필요한 API 요청",
      "컴퓨팅·데이터 접근·의존 서비스 처리",
      "플레이어에 돌려줄 재생 관련 정보",
    ],
    why: "제어 서비스의 요청량·응답 지연과 전달망의 동시 시청·대역폭을 별도로 계획할 수 있습니다.",
    boundary:
      "AWS는 플랫폼 범위입니다. 이 로고만으로 EC2·EKS·Lambda나 데이터베이스 제품을 특정하지 않습니다.",
  },
  nginx: {
    purpose: "요청을 해석하고, 준비된 파일의 바이트를 HTTP로 응답합니다.",
    contract: [
      "GET 경로 · 필요한 경우 Range 헤더",
      "경로와 파일 확인 → 응답 상태·범위 처리",
      "200 또는 206 응답 · 파일 데이터",
    ],
    why: "작업자 프로세스가 여러 연결의 이벤트를 처리합니다. 파일 응답에서는 sendfile 등 OS의 I/O 경로도 중요합니다.",
    boundary:
      "NGINX는 인코더나 화질 선택기가 아닙니다. 전체 CDN의 거점 선택·파일 배치도 별도 역할입니다.",
  },
  freebsd: {
    purpose: "HTTP 서버 아래에서 파일·메모리·소켓·NIC의 동작을 받칩니다.",
    contract: [
      "파일 읽기 · 소켓 쓰기 · 이벤트 대기 요청",
      "파일 페이지·kqueue·전송 경로·드라이버 처리",
      "읽은 데이터 · I/O 이벤트 · 네트워크 출력",
    ],
    why: "파일에서 소켓으로 보내는 sendfile, 여러 연결의 상태를 알리는 kqueue 같은 기능을 제공합니다.",
    boundary:
      "메모리 복사와 I/O 비용을 줄일 여지는 있지만 TLS·드라이버·하드웨어 조건에 따라 경로와 성능은 달라집니다.",
  },
  https: {
    purpose: "파일이나 일부 바이트를 요청하고 응답하는 통신 규칙입니다.",
    contract: [
      "URL · 메서드 · 헤더 · 바이트 범위",
      "요청·상태·헤더·본문 전달, HTTPS의 TLS 보호",
      "전체 파일 또는 구간 데이터의 응답",
    ],
    why: "독립된 미디어 구간을 GET으로 받거나 큰 파일의 일부를 Range로 받을 수 있습니다. 재생 시작과 탐색을 구현하는 기반입니다.",
    boundary:
      "TLS는 전송 보호, DRM은 콘텐츠 권한·라이선스의 문제입니다. HTTP 버전·코덱·패키징도 별도 선택입니다.",
  },
});

export const applianceLayers = resolveAssets({
  storage: {
    title: "저장장치 · 응답할 파일을 준비",
    description:
      "여러 화질의 파일이 있어도 요청한 파일과 구간을 읽을 수 있어야 합니다. 저장 용량과 메모리 캐시, 디스크 읽기 지연이 전송 경로에 영향을 줍니다.",
    note: "특정 디스크 구성이나 파일시스템을 가정하지 않는 역할 설명입니다.",
    read: "fill",
    steps: [
      ["storage", "인코딩 파일", "여러 화질·오디오"],
      ["ocaIcon", "거점에 보관", "준비된 파일·버전"],
      ["storage", "요청 구간 읽기", "캐시 또는 디스크"],
    ],
  },
  nginx: {
    title: "NGINX · 요청을 파일 응답으로",
    description:
      "URL과 필요한 경우 Range를 해석하고 응답할 파일을 찾습니다. 파일이 있으면 상태·헤더·바이트를 응답하며, 이벤트 처리와 OS의 I/O 경로를 활용합니다.",
    note: "일반적인 정적 파일 응답 경로입니다. 실제 OCA 설정이나 HTTP 버전을 재현하지 않습니다.",
    read: "nginx",
    steps: [
      ["player", "GET · Range", "파일 경로·바이트 범위"],
      ["nginx", "요청과 파일 연결", "location·파일 확인"],
      ["https", "HTTP 응답", "200·206·파일 바이트"],
    ],
  },
  freebsd: {
    title: "FreeBSD · 파일에서 네트워크까지",
    description:
      "파일 페이지·소켓·이벤트와 드라이버를 다룹니다. sendfile은 파일에서 소켓으로 보내는 경로, kqueue는 여러 연결의 상태 변화를 알리는 기능입니다.",
    note: "일반 기능을 설명하는 경로입니다. TLS·커널·하드웨어에 따라 실제 전송 경로는 달라집니다.",
    read: "freebsd",
    steps: [
      ["storage", "파일 페이지", "캐시·저장장치 읽기"],
      ["freebsd", "sendfile · 소켓", "커널의 전송 경로"],
      ["routing", "NIC와 네트워크", "클라이언트로 전송"],
    ],
  },
});
