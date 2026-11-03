import { sansaSources } from "./interactive-services.js";

const openConnect = [
  "Netflix Open Connect",
  "https://openconnect.netflix.com/en/",
  "재생 제어와 영상 전달의 분리, ISP와 연결되는 전달망의 공개 설명입니다.",
];
const appliances = [
  "Open Connect Appliances",
  "https://openconnect.netflix.com/en/appliances/",
  "OCA의 역할과 하드웨어·서버 소프트웨어에 관한 공개 설명입니다. 현재 버전·내부 설정 전체를 뜻하지 않습니다.",
];
const aws = [
  "AWS의 Netflix 고객 사례",
  "https://aws.amazon.com/solutions/case-studies/netflix/",
  "Netflix의 AWS 사용 범위를 설명합니다. 개별 재생 요청을 처리하는 제품 조합까지 확정하지 않습니다.",
];

// A part records service-specific usage. General technology profiles remain in
// technology-catalogue.js; alternatives never count as installed components.
export const serviceStacks = [
  {
    id: "sansa",
    name: "산사",
    subtitle: "함께 머무는 3D 공간",
    scope: "브라우저의 3D 장면과 방 연결",
    description:
      "공간을 그리는 일은 브라우저에서, 방문자 상태를 교환하는 일은 방 연결에서 처리합니다. 화면·통신·음향·저장을 나누어 보면 각 기술이 맡는 일이 드러납니다.",
    basis: "간접 자료 · 클라이언트 보관본 기준",
    evidence:
      "2026.11.03에 공개 파생 저장소의 산사 클라이언트 보관본을 읽었습니다. 현재 원본 배포와 대조하지 못했으며, 서버 내부와 운영 DB는 확인되지 않았습니다.",
    exclusions:
      "보관본에 있는 조건부 Supabase 초기화는 현재 사용의 증거가 아닙니다. 파생 프로젝트의 React·Vinext·D1, 비교 구현의 Firebase도 산사 사용 기술에 포함하지 않았습니다.",
    sources: sansaSources,
    groups: [
      ["browser", "브라우저"],
      ["server", "서버"],
      ["storage", "데이터 저장"],
    ],
    paths: [
      {
        label: "움직임이 공유되는 경로",
        steps: [
          ["scene", "내 장면 갱신"],
          ["sync", "최신 위치 전송"],
          ["presence", "방 연결"],
          ["scene", "다른 화면에 반영"],
        ],
        note: "보관본의 클라이언트 흐름입니다. 서버의 상태 배분 알고리즘은 미확인입니다.",
      },
    ],
    parts: [
      {
        id: "scene",
        group: "browser",
        title: "3D 화면",
        role: "장면·캐릭터·카메라",
        summary:
          "Three.js로 장면을 구성하고 WebGL로 화면을 그립니다. 받은 방문자 위치를 장면 속 캐릭터에 반영합니다.",
        evidence: "보관본 확인",
        status: "indirect",
        technologies: [
          { id: "threejs", usage: "장면·물체·카메라를 구성하는 3D 라이브러리" },
          { id: "webgl", usage: "GPU에 그리기 작업을 전달하는 브라우저 API" },
        ],
        why: "방문자의 위치 데이터만으로는 공간이 보이지 않습니다. 3D 좌표와 물체를 관리하는 계층, 이를 픽셀로 그리는 계층이 함께 필요합니다.",
        detail:
          "보관본에 Three.js r180 표기가 있습니다. Three.js가 장면의 구조를 맡고 WebGL 렌더러가 그리기를 수행합니다. 둘은 대체 관계가 아니라 서로 다른 계층입니다.",
        boundary:
          "모델·이미지 파일의 제작 도구, 현재 배포 버전과 GPU별 성능은 이 보관본만으로 확정하지 않습니다.",
        connects: ["sync"],
        sources: [0],
      },
      {
        id: "sync",
        group: "browser",
        title: "실시간 동기화",
        role: "위치·입장·상태 복구",
        summary:
          "WebSocket 연결로 입장·이동·좌석 요청과 방 상태를 주고받습니다. 화면을 그리는 주기와 위치를 보내는 주기를 나눕니다.",
        evidence: "보관본 확인",
        status: "indirect",
        technologies: [
          {
            id: "websocket",
            usage: "연결을 유지하며 요청과 상태를 양방향으로 전달",
          },
        ],
        why: "다른 방문자의 움직임은 내가 새로고침하지 않아도 도착해야 합니다. 연결을 유지하면 반복 조회 없이 서버가 새 상태를 전달할 수 있습니다.",
        detail:
          "전송 대기 위치는 최신 값으로 모읍니다. 보관본에는 외부 주소일 때 최소 500ms, 같은 출처일 때 100ms인 분기가 있습니다. 초기 전체 상태와 변경분·revision을 처리하고, 누락을 감지하면 다시 동기화합니다.",
        boundary:
          "주기 값은 보관본의 조건부 상수이며 현재 서비스의 측정값이 아닙니다. WebSocket 자체가 방 관리·메시지 저장·재접속 복구를 제공하는 것은 아닙니다.",
        connects: ["scene", "presence"],
        sources: [0],
      },
      {
        id: "audio",
        group: "browser",
        title: "환경음과 효과음",
        role: "음향 재생·혼합",
        summary:
          "Web Audio API로 환경음과 효과음을 나눠 처리합니다. 필터·압축·잔향을 연결해 공간의 소리를 구성합니다.",
        evidence: "보관본 확인",
        status: "indirect",
        technologies: [
          {
            id: "web-audio",
            usage: "AudioContext 안에서 음원과 처리 노드를 연결",
          },
        ],
        why: "여러 소리의 볼륨과 효과를 따로 조절하려면 음향 처리 경로가 필요합니다. 단순 파일 재생을 넘어 소리별로 다른 효과를 적용할 수 있습니다.",
        detail:
          "보관본의 AudioContext와 환경음·효과음 경로, 필터·컴프레서·리버브 구성을 확인했습니다. 음원에서 출력까지 노드를 연결하며, 브라우저의 사용자 동작과 재생 허용 상태도 고려해야 합니다.",
        boundary:
          "음향 처리가 곧 사용자 간 음성 통화라는 뜻은 아닙니다. WebRTC나 음성 채팅 서버를 사용한다고 추정하지 않습니다.",
        connects: ["settings"],
        sources: [0],
      },
      {
        id: "settings",
        group: "browser",
        title: "내 브라우저 설정",
        role: "환경설정 보관",
        summary:
          "localStorage에 설정을 남겨 같은 브라우저에서 다시 읽습니다. 다른 사람이나 다른 기기와 공유하는 DB 역할은 아닙니다.",
        evidence: "보관본 확인",
        status: "indirect",
        technologies: [
          {
            id: "localstorage",
            usage: "같은 출처의 브라우저에 문자열 설정을 보관",
          },
        ],
        why: "화면을 다시 열 때마다 설정을 처음부터 고르게 하면 불편합니다. 서버 요청 없이 작은 설정을 기억할 수 있습니다.",
        detail:
          "보관본에서 sansa: 접두사의 저장 키를 확인했습니다. localStorage는 동기 API이고 값은 문자열입니다. 접근 실패나 저장 데이터의 형식 변화에도 기본 설정으로 시작할 수 있어야 합니다.",
        boundary:
          "브라우저 데이터 삭제·시크릿 모드·기기 변경에 영향을 받습니다. 계정 간 동기화나 다른 방문자에게 보이는 영구 상태를 보장하지 않습니다.",
        connects: ["audio"],
        sources: [0],
      },
      {
        id: "presence",
        group: "server",
        title: "방 연결의 접점",
        role: "외부 실시간 연결 주소",
        summary:
          "외부 WebSocket 주소가 Cloudflare Workers 도메인의 /presence를 가리킵니다. 연결 주소는 확인했지만 서버 내부 구현은 확인하지 못했습니다.",
        evidence: "연결 주소만 확인",
        status: "indirect",
        technologies: [
          {
            id: "cloudflare-workers",
            usage: "보관본의 WebSocket 연결 주소에 나타나는 실행 플랫폼",
          },
        ],
        why: "같은 방의 사람들을 연결하려면 브라우저들이 접근할 접점이 필요합니다. 클라이언트의 연결 대상 주소가 이 경계를 보여줍니다.",
        detail:
          "클라이언트는 room·instance·region 맥락을 관리하고 연결 실패·heartbeat·재시도·전체 상태 복구를 처리합니다. 이 코드는 서버에 무엇을 요청하는지 보여주지만 서버가 그 요청을 어떻게 조정하는지는 보여주지 않습니다.",
        boundary:
          "Workers 주소만으로 Durable Objects·D1·Redis 사용, 방별 프로세스, 원자적 좌석 배정, 실제 서버 위치나 동시 접속 한도를 확정할 수 없습니다.",
        connects: ["sync", "data"],
        sources: [0, 1, 2],
      },
      {
        id: "data",
        group: "storage",
        title: "서버 데이터 저장",
        role: "영속 저장 제품 미확인",
        summary:
          "현재 산사의 운영 DB·저장소 제품은 확인되지 않았습니다. 방 상태를 전달한다는 사실과 상태를 영구 저장한다는 사실은 별개입니다.",
        evidence: "미확인",
        status: "unknown",
        technologies: [],
        why: "접속 중인 방의 상태와 서비스를 다시 시작해도 남아야 하는 기록은 수명이 다릅니다. 저장 기술을 고르기 전에 무엇을 얼마나 남길지 구분해야 합니다.",
        detail:
          "보관본만으로는 방문자 상태가 메모리에만 있는지, 외부 DB에 기록되는지, 어떤 일관성과 보관 기간을 갖는지 알 수 없습니다.",
        boundary:
          "조건부 Supabase 코드나 파생 프로젝트의 D1을 현재 산사의 운영 DB로 표시하지 않습니다. 제품명과 실제 저장 경로를 확인할 추가 자료가 필요합니다.",
        connects: ["presence"],
        sources: [0, 1, 2],
      },
    ],
  },
  {
    id: "netflix",
    name: "넷플릭스",
    subtitle: "재생 제어와 영상 전달",
    scope: "Open Connect 중심의 영상 전달",
    description:
      "재생할 수 있는지 판단하고 전달 위치를 안내하는 일과, 큰 영상 파일을 보내는 일을 분리합니다. 아래는 영상 전달에 초점을 맞춘 구성으로 Netflix의 전체 사내 스택은 아닙니다.",
    basis: "공개 기술 자료 · 영상 전달 범위",
    evidence:
      "Netflix Open Connect와 AWS의 공개 설명, OCA의 공개 소프트웨어 구성을 기준으로 정리했습니다. 현재 서버의 제품 버전·설정과 미공개 내부 서비스는 확정하지 않습니다.",
    exclusions:
      "S3·CloudFront는 이 페이지에서 Netflix의 사용 제품으로 표시하지 않습니다. 기존 설명의 원본 저장 예시와 전달망 대안은 실제 사용 근거와 구분합니다.",
    sources: [openConnect, appliances, aws],
    groups: [
      ["client", "사용자 기기"],
      ["control", "재생 제어"],
      ["delivery", "영상 전달"],
      ["storage", "원본 저장"],
    ],
    paths: [
      {
        label: "재생을 준비하는 경로",
        steps: [
          ["player", "재생 요청"],
          ["control", "재생 정보·전달 위치 안내"],
          ["player", "영상 요청 준비"],
        ],
        note: "제어 경로: 큰 영상 파일을 전달하는 경로와 분리됩니다.",
      },
      {
        label: "영상을 받는 경로",
        steps: [
          ["origin", "필요한 콘텐츠 배치"],
          ["delivery", "Open Connect"],
          ["http", "NGINX / FreeBSD"],
          ["player", "기기에서 재생"],
        ],
        note: "배치는 재생마다 동기적으로 수행하는 단계가 아닙니다. 서버 내부의 HTTP 처리와 운영체제를 함께 표시했습니다.",
      },
    ],
    parts: [
      {
        id: "player",
        group: "client",
        title: "기기의 플레이어",
        role: "영상 선택·버퍼·재생",
        summary:
          "재생 정보를 받은 뒤 영상 조각을 요청합니다. 네트워크와 버퍼 상태를 보며 재생 품질을 조절합니다.",
        evidence: "역할·동작 설명",
        status: "explanation",
        technologies: [
          {
            name: "적응형 비트레이트",
            provider: "재생 방식",
            kind: "기능 설명",
            usage: "상황에 맞춰 다음에 받을 영상 품질을 선택",
          },
        ],
        why: "대역폭은 재생 중에도 달라집니다. 한 품질만 고정해서 받으면 느린 연결에서는 멈추고 빠른 연결에서는 가능한 화질을 쓰지 못할 수 있습니다.",
        detail:
          "플레이어가 필요한 영상 조각을 내려받아 버퍼에 쌓고 재생합니다. 일반적인 적응형 재생 원리를 설명하며, 여기의 학습용 계산이 Netflix의 실제 품질 선택 알고리즘인 것은 아닙니다.",
        boundary:
          "기기별 앱 언어·프레임워크·실제 ABR 알고리즘은 이 전달 구조에서 확정하지 않습니다. React나 특정 모바일 프레임워크를 임의로 붙이지 않습니다.",
        connects: ["control", "delivery"],
        sources: [0],
      },
      {
        id: "control",
        group: "control",
        title: "재생 제어",
        role: "재생 정보·전달 후보 안내",
        summary:
          "AWS 기반 서비스가 재생을 준비하는 제어 영역을 맡습니다. 영상 데이터 자체는 Open Connect의 서버에서 받습니다.",
        evidence: "공개 자료",
        status: "public",
        technologies: [
          {
            name: "AWS",
            provider: "Amazon Web Services",
            kind: "클라우드 플랫폼",
            image: "assets/tech/aws.svg",
            imageAlt: "Amazon Web Services 로고",
            usage:
              "재생 제어를 포함한 클라우드 실행 영역 · 세부 제품 조합 미확인",
          },
        ],
        why: "작은 제어 요청과 대용량 영상 전송은 부하의 성격이 다릅니다. 서로 다른 실행 영역으로 나누면 영상 전송량이 제어 서비스의 처리 경로에 직접 실리지 않습니다.",
        detail:
          "제어 영역은 재생 정보와 사용 가능한 전달 위치를 안내합니다. 여기서 AWS는 실행 플랫폼의 범위를 뜻합니다. 요청 인증·선택·응답을 설명하는 학습 흐름과 개별 내부 마이크로서비스의 구현은 구분합니다.",
        boundary:
          "이 자료만으로 해당 재생 경로가 EC2·Lambda·EKS 중 무엇을 어떻게 사용하는지, 어떤 DB를 쓰는지 확정하지 않습니다.",
        connects: ["player", "delivery"],
        sources: [0, 2],
      },
      {
        id: "delivery",
        group: "delivery",
        title: "영상 전달망",
        role: "사용자 가까이 콘텐츠 배치",
        summary:
          "Netflix의 Open Connect가 OCA에 콘텐츠를 배치하고 전달합니다. ISP 내부나 연결 거점의 서버가 플레이어에게 영상 바이트를 보냅니다.",
        evidence: "공개 자료",
        status: "public",
        technologies: [
          {
            name: "Open Connect",
            provider: "Netflix",
            kind: "전용 콘텐츠 전달망",
            image: "assets/tech/oca-icon.svg",
            imageAlt: "OCA 전달 서버를 나타내는 자체 설명 도식",
            usage: "전용 장비 OCA를 통해 지역·ISP에 가까운 곳에서 영상 전달",
          },
        ],
        why: "모든 영상을 먼 중앙 서버에서 보내면 지역 간 전송과 네트워크 병목의 영향을 크게 받습니다. 반복해서 볼 콘텐츠를 사용자 가까이에 둡니다.",
        detail:
          "OCA는 일반적인 앱 서버의 로그인·결제 코드를 실행하는 서버가 아니라 콘텐츠 전달 장비입니다. 콘텐츠 배치와 채우기, 재생 시 전달 서버 선택은 구분되는 작업입니다.",
        boundary:
          "모든 요청이 반드시 같은 ISP 안에서 처리되는 것은 아닙니다. 콘텐츠 보유 여부·연결·상태에 따라 후보와 경로가 달라질 수 있습니다.",
        connects: ["origin", "http", "os", "player"],
        sources: [0, 1],
      },
      {
        id: "http",
        group: "delivery",
        title: "OCA의 HTTP 처리",
        role: "요청을 영상 바이트로 연결",
        summary:
          "공개 OCA 소프트웨어 구성의 NGINX가 HTTP 요청을 처리합니다. 파일 전송은 아래의 FreeBSD 네트워크·파일 처리 경로와 이어집니다.",
        evidence: "공개 소프트웨어 구성",
        status: "public",
        technologies: [
          {
            id: "nginx",
            usage: "전달 서버에서 HTTP 요청과 콘텐츠 응답을 처리",
          },
        ],
        why: "플레이어의 영상 요청을 받아 적절한 응답과 바이트 범위를 보내는 HTTP 계층이 필요합니다. 많은 연결을 다루는 작업과 파일의 실제 입출력이 맞물립니다.",
        detail:
          "NGINX는 HTTP 서버 계층이고 FreeBSD는 운영체제입니다. 둘을 같은 종류의 대안으로 비교하면 안 됩니다. Range 요청·연결 처리·전송 경로의 일반 원리는 공용 기술 설명에서 확인할 수 있습니다.",
        boundary:
          "공개 구성의 사용 사실과 현재 운영 버전·패치·worker 수·설정값은 다릅니다. 예제 NGINX 설정을 Netflix의 실제 설정으로 표시하지 않습니다.",
        connects: ["delivery", "os"],
        sources: [1],
      },
      {
        id: "os",
        group: "delivery",
        title: "OCA의 운영체제",
        role: "파일·소켓·네트워크 처리",
        summary:
          "공개 OCA 소프트웨어 구성의 FreeBSD가 파일 입출력과 네트워크 전송을 받칩니다. NGINX는 이 운영체제 위에서 동작합니다.",
        evidence: "공개 소프트웨어 구성",
        status: "public",
        technologies: [
          { id: "freebsd", usage: "전달 장비의 운영체제와 파일·네트워크 기반" },
        ],
        why: "HTTP 서버가 응답을 정해도 바이트를 읽고 소켓으로 내보내는 일은 운영체제가 맡습니다. 전송 효율을 이해하려면 응용 프로그램 아래의 경로까지 봐야 합니다.",
        detail:
          "FreeBSD의 sendfile·kqueue·커널 TLS 같은 기능은 파일·이벤트·암호화 처리 경로를 설명하는 핵심입니다. 각 기능의 일반 동작과 OCA에서 공개된 사용 맥락을 구분해 읽습니다.",
        boundary:
          "현재 모든 OCA의 커널 버전·NIC 설정·암호화 경로나 특정 전송률을 확정하지 않습니다. 기능의 존재가 모든 요청에서 그 경로가 쓰인다는 뜻은 아닙니다.",
        connects: ["http", "delivery"],
        sources: [1],
      },
      {
        id: "origin",
        group: "storage",
        title: "원본과 콘텐츠 채우기",
        role: "전달할 파일의 공급",
        summary:
          "전달할 콘텐츠를 준비해 OCA에 채웁니다. 이 설명 범위에서 원본을 보관하는 정확한 저장 제품은 확인되지 않았습니다.",
        evidence: "제품 미확인",
        status: "unknown",
        technologies: [],
        why: "전달 서버에 필요한 파일이 있어야 사용자가 받을 수 있습니다. 원본의 보관과 배포, 지역 전달 서버의 보유 상태를 나눠 관리합니다.",
        detail:
          "재생할 때마다 플레이어 요청을 원본 저장소로 그대로 넘기는 구조로 읽으면 안 됩니다. Open Connect의 콘텐츠 배치·채우기 경로는 재생 중 전달 경로와 구분됩니다.",
        boundary:
          "S3·Google Cloud Storage는 원본 저장 역할을 구현할 때의 학습 예시입니다. 이 페이지는 이를 실제 Netflix 원본 저장 제품이라고 주장하지 않습니다.",
        connects: ["delivery"],
        sources: [0],
      },
    ],
  },
];

export const findServiceStack = (id) =>
  serviceStacks.find((service) => service.id === id) || serviceStacks[0];
