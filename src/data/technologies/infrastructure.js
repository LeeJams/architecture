// Detailed profiles for the shared technology catalogue.
export const infrastructureTechnologies = [
  {
    id: "nats",
    name: "NATS",
    provider: "NATS 프로젝트 · Synadia와 NATS 기여자",
    category: "messaging",
    type: "메시징·영속 스트림 시스템",
    summary:
      "subject 기반 메시지 전달과 요청·응답, JetStream의 저장·소비 기능을 제공하는 메시징 시스템입니다.",
    definition:
      "NATS는 subject를 기준으로 메시지를 발행·구독하고 요청·응답을 연결합니다. Core NATS의 온라인 전달과 JetStream의 영속 스트림·소비자·확인은 다른 모델입니다. 저장·재전달·순서와 업무 부수 효과의 중복 처리 범위를 명시해야 합니다.",
    useCases: [
      [
        "서비스 간 메시지·요청",
        "subject와 구독자·queue group으로 이벤트와 요청을 분배합니다.",
      ],
      [
        "보관과 재처리가 필요한 이벤트",
        "JetStream의 stream·consumer·확인 정책으로 보관·재전달을 설계합니다.",
      ],
    ],
    concepts: [
      [
        "subject와 queue group",
        "이름과 와일드카드로 구독 대상을 정하고 같은 queue group의 작업 분배를 이해합니다.",
      ],
      [
        "Core와 JetStream",
        "Core의 at-most-once 전달과 JetStream의 보관·소비 상태·ack를 구분합니다.",
      ],
      [
        "consumer와 재전달",
        "ack·시간 제한·재전달 정책에 따라 같은 이벤트가 다시 올 수 있습니다. 업무 결과의 중복은 별도입니다.",
      ],
    ],
    flow: [
      ["연결·subject 권한 설정", "발행·구독 대상과 접근 범위를 정합니다."],
      ["발행과 전달·저장", "Core 전달 또는 선택한 stream의 저장을 수행합니다."],
      ["소비·확인·복구", "consumer 정책과 오류·재연결·재전달을 처리합니다."],
    ],
    points: [
      [
        "전달 보장을 제품 모드와 연결",
        "NATS라는 이름만 보고 모든 메시지가 보관·재생된다고 가정하지 않습니다.",
      ],
      [
        "요청 시간 초과와 실행 구분",
        "응답을 못 받아도 상대 작업이 완료됐을 수 있어 업무 키·재시도를 설계합니다.",
      ],
      [
        "구독·보관 용량 통제",
        "subject 권한·최대 보관·ack 대기·느린 소비자와 미처리량을 관찰합니다.",
      ],
    ],
    diagnostics: [
      [
        "메시지가 사라진 것처럼 보임",
        "Core인지 JetStream인지, 구독 준비·subject·stream 선택·보관 정책을 확인합니다.",
      ],
      [
        "소비 작업이 반복 실행",
        "ack 손실·시간 제한·재연결과 멱등 처리 기록을 확인합니다.",
      ],
    ],
    example: {
      title: "Core NATS의 발행·구독 확인",
      description:
        "NATS 서버와 CLI가 준비된 환경에서 두 터미널로 실행하는 예입니다.",
      language: "NATS CLI",
      code: '# 터미널 1: 구독을 먼저 준비\nnats sub demo.events\n\n# 터미널 2: 메시지 발행\nnats pub demo.events \'{"event_id":"e1","type":"created"}\'',
      note: "Core NATS 예제이며 영속 보관·replay를 제공하는 JetStream 설정은 아닙니다. 실제 연결 주소·인증·접근 권한은 별도입니다.",
    },
    rationale: {
      short:
        "서비스 간 요청·이벤트 전달과 필요한 보관 모델을 분리해 구성할 때 유용합니다.",
      problem:
        "여러 서비스를 직접 연결하면 수신 대상·작업 분배·연결 실패 처리가 복잡해집니다.",
      change:
        "subject와 메시지 전달 계층을 두고 저장이 필요할 때 JetStream 정책을 추가합니다.",
      decisions: [
        {
          gainTitle: "전달 모델 조합",
          gain: "발행·구독·요청·응답을 subject로 연결합니다.",
          costTitle: "구독·권한 설계",
          cost: "subject의 범위와 서비스 계약을 관리합니다.",
        },
        {
          gainTitle: "영속 소비 선택",
          gain: "JetStream에서 보관·소비·재전달을 구성합니다.",
          costTitle: "모드와 중복 구분",
          cost: "Core와 저장 모드의 보장·ack·업무 멱등성을 이해합니다.",
        },
      ],
      ask: "온라인 알림인가요, 반드시 보관·재처리할 업무 이벤트인가요?",
      simpler:
        "작은 호출은 HTTP로 시작하고 작업 큐·로그 요구에 따라 RabbitMQ·Kafka도 비교하세요.",
    },
    related: ["kafka", "rabbitmq", "websocket"],
    aliases: ["내츠", "NATS.io", "JetStream"],
    image: "nats",
    sources: [
      [
        "NATS · Consumers",
        "https://github.com/nats-io/nats.docs/blob/master/nats-concepts/jetstream/consumers.md",
        "NATS 공식 문서의 JetStream consumer·ack·재전달과 Core 전달 보장의 구분.",
      ],
      [
        "NATS 공식 문서 · 추가 읽기",
        "https://docs.nats.io/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/nats/nats-original.svg",
    logoAlt: "NATS 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "memcached",
    name: "Memcached",
    provider: "Memcached 프로젝트 · Memcached 기여자",
    category: "cache",
    type: "분산 메모리 캐시",
    summary:
      "키로 값을 메모리에 보관해 반복 조회의 비용을 줄이는 캐시 서버입니다.",
    definition:
      "Memcached는 키·값과 만료·퇴거를 제공하는 메모리 캐시입니다. 원본 DB나 영속 저장소로 보지 않으며 서버 재시작·메모리 압박·키 배치 변경으로 값이 없어질 수 있습니다. 캐시 미스·갱신·동시 변경과 사용 클라이언트의 키 분배 방식을 함께 설계합니다.",
    useCases: [
      [
        "반복 조회 캐시",
        "DB·외부 API의 비싼 결과를 일정 시간 보관하고 미스 시 원본을 조회합니다.",
      ],
      [
        "일시적인 계산 결과",
        "재계산 가능한 작은 결과를 키와 만료로 공유합니다.",
      ],
    ],
    concepts: [
      [
        "만료·퇴거·미스",
        "TTL 이전에도 퇴거될 수 있습니다. 없는 값과 빈 값의 실제 표현을 구분합니다.",
      ],
      [
        "CAS와 갱신 경쟁",
        "gets/cas로 특정 값의 변경 여부를 확인할 수 있지만 DB와 원자적으로 함께 바뀌는 것은 아닙니다.",
      ],
      [
        "키 배치와 장애",
        "서버 선택은 클라이언트와 구성의 영향을 받습니다. 분산 캐시 이름만으로 자동 복제·복구를 가정하지 않습니다.",
      ],
    ],
    flow: [
      ["키로 캐시 조회", "사용자·조건·버전이 반영된 키를 찾습니다."],
      [
        "미스 시 원본 조회",
        "원본에서 결과를 계산하고 적절한 만료로 보관합니다.",
      ],
      ["갱신·만료·퇴거", "원본 변경·메모리·시간에 따라 값을 정리합니다."],
    ],
    points: [
      [
        "원본의 진실과 분리",
        "인증·잔액·재고 같은 원본 상태를 캐시에만 의존하지 않습니다.",
      ],
      [
        "30일을 넘는 만료 값의 해석",
        "텍스트 프로토콜에서 30일 이하의 양수는 상대 초, 그보다 큰 값은 Unix 시각으로 해석합니다. 0은 시간상 만료 없음이지만 메모리 퇴거·재시작까지 막지는 않습니다. 클라이언트의 변환도 확인합니다.",
      ],
      [
        "동시 미스 제어",
        "같은 키의 만료에 조회가 몰릴 때 작업 합치기·지터·갱신 방식을 검토합니다.",
      ],
    ],
    diagnostics: [
      [
        "TTL 전인데 값이 없음",
        "메모리 퇴거·재시작·키 배치·다른 클라이언트의 갱신을 확인합니다.",
      ],
      [
        "캐시 장애가 DB 장애로 번짐",
        "미스 폭증·동시 조회·원본 보호와 장애 시 우회 정책을 봅니다.",
      ],
    ],
    example: {
      title: "없는 값과 빈 값을 구분",
      description:
        "pymemcache와 로컬 Memcached 서버가 준비된 Python 예제입니다.",
      language: "Python",
      code: "from pymemcache.client.base import Client\n\nclient = Client(('127.0.0.1', 11211))\ntry:\n    client.set('demo:greeting:v1', b'hello', expire=60)\n    value = client.get('demo:greeting:v1')\n    print('cache miss' if value is None else value.decode())\nfinally:\n    client.close()",
      note: "60초는 학습용 TTL입니다. 캐시 미스 시의 원본 조회·접근 권한·연결 풀과 장애 처리는 별도입니다.",
    },
    rationale: {
      short:
        "반복 계산·원본 조회를 줄이기 위해 사라져도 다시 만들 수 있는 값을 보관할 때 필요합니다.",
      problem:
        "같은 요청마다 DB·외부 API를 반복 호출하면 지연과 부하가 쌓일 수 있습니다.",
      change: "키·만료가 있는 캐시를 원본 앞에 두고 미스 경로를 정의합니다.",
      decisions: [
        {
          gainTitle: "원본 부하 절감",
          gain: "반복 결과를 메모리에서 재사용합니다.",
          costTitle: "오래된 값·퇴거",
          cost: "만료·갱신·미스가 항상 발생할 수 있습니다.",
        },
        {
          gainTitle: "작은 캐시 모델",
          gain: "키·값 중심의 캐시 운영을 선택합니다.",
          costTitle: "원본 보호",
          cost: "동시 미스·장애·키 분배를 직접 설계합니다.",
        },
      ],
      ask: "값이 사라지거나 잠시 오래돼도 서비스가 감당할 수 있나요?",
      simpler:
        "먼저 원본 질의·인덱스를 개선하고 필요한 자료구조가 있다면 Redis와 비교하세요.",
    },
    related: ["redis", "postgresql", "mysql"],
    aliases: ["멤캐시드", "Memcache", "Mem Cached"],
    image: "memcached",
    sources: [
      [
        "Memcached · protocol.txt",
        "https://github.com/memcached/memcached/blob/master/doc/protocol.txt",
        "Memcached 공식 프로토콜의 저장·조회·만료·CAS와 응답 규칙.",
      ],
      [
        "Memcached 공식 문서 · 추가 읽기",
        "https://docs.memcached.org/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/memcached/memcached-original.svg",
    logoAlt: "Memcached 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "deno",
    name: "Deno",
    provider: "Deno Land · Deno 커뮤니티",
    category: "runtime",
    type: "JavaScript·TypeScript 실행 환경",
    summary:
      "웹 표준 API·권한 모델과 도구를 제공하는 JavaScript·TypeScript 실행 환경입니다.",
    definition:
      "Deno는 브라우저 밖에서 코드를 실행하고 파일·네트워크 등의 작업 권한을 구성합니다. TypeScript 소스 실행과 정적 타입 검사는 구분해야 하며 Node·npm 호환 범위도 실제 API·패키지·버전에 따라 확인합니다. 권한 플래그만으로 모든 의존성과 네이티브 경계를 설명할 수는 없습니다.",
    useCases: [
      [
        "HTTP 서버·도구",
        "웹 표준 API와 런타임의 서버 기능으로 스크립트·서비스를 작성합니다.",
      ],
      [
        "권한을 제한한 자동화",
        "필요한 파일·네트워크 권한을 정해 작업을 실행합니다.",
      ],
    ],
    concepts: [
      [
        "권한과 신뢰 경계",
        "읽기·쓰기·네트워크·하위 프로세스·FFI의 허용 범위를 정합니다.",
      ],
      [
        "웹 API와 호환",
        "fetch·Request·Response 같은 API와 Node·npm 경로의 차이를 확인합니다.",
      ],
      [
        "실행과 타입 검사",
        "TypeScript 실행이 요청 자료의 런타임 검증이나 별도 타입 검사를 대신하지 않습니다.",
      ],
    ],
    flow: [
      ["의존성·권한 결정", "모듈·잠금과 필요한 환경 접근을 정합니다."],
      ["코드·이벤트 실행", "런타임 API와 비동기 입출력을 처리합니다."],
      ["정리·검사·배포", "시간 제한·자원·타입 검사와 배포 대상을 관리합니다."],
    ],
    points: [
      [
        "최소 권한으로 시작",
        "모든 권한을 허용하는 대신 실제 필요한 대상과 하위 실행 경계를 확인합니다.",
      ],
      [
        "Node 호환성을 테스트",
        "네이티브 모듈·빌드 스크립트·특정 API를 실제 대상에서 확인합니다.",
      ],
      [
        "모듈과 외부 입력 검증",
        "버전·lockfile·코드 출처와 런타임 자료의 스키마를 관리합니다.",
      ],
    ],
    diagnostics: [
      [
        "개발 환경에서만 파일·네트워크 동작",
        "실행 플래그와 경로·호스트·하위 프로세스 권한을 확인합니다.",
      ],
      [
        "npm 패키지가 일부 기능에서 실패",
        "Node API·네이티브 의존성·설치 스크립트와 지원 버전을 확인합니다.",
      ],
    ],
    example: {
      title: "필요한 주소로 HTTP 서버 실행",
      description: "Deno가 설치된 네이티브 환경의 server.ts 예입니다.",
      language: "TypeScript · CLI",
      code: 'Deno.serve({ hostname: "127.0.0.1", port: 8000 }, () => {\n  return new Response("hello");\n});\n\n// 실행: deno run --allow-net=127.0.0.1:8000 server.ts',
      note: "로컬 학습 서버이며 TLS·인증·종료·운영 제한은 포함하지 않습니다. 정적 타입 검사는 deno check 등으로 따로 확인합니다.",
    },
    rationale: {
      short:
        "서버·도구에 웹 API와 명시적인 권한·개발 도구 규약이 필요할 때 검토합니다.",
      problem:
        "브라우저 밖 코드의 파일·네트워크 접근과 도구·의존성을 일관되게 구성해야 합니다.",
      change: "런타임 API·권한·모듈 관리 규약으로 실행을 구성합니다.",
      decisions: [
        {
          gainTitle: "웹 API와 도구",
          gain: "서버·스크립트에서 일관된 API와 도구를 사용합니다.",
          costTitle: "생태계 차이",
          cost: "Node·네이티브 의존성·배포 대상의 지원을 검증합니다.",
        },
        {
          gainTitle: "접근 권한 명시",
          gain: "파일·네트워크의 필요한 범위를 제한합니다.",
          costTitle: "실행 경계 이해",
          cost: "하위 프로세스·FFI·외부 코드의 권한을 확인합니다.",
        },
      ],
      ask: "권한 모델·도구와 실제 의존성의 지원이 운영 환경에 맞나요?",
      simpler:
        "이미 검증된 Node.js 구성이 있다면 대표 작업과 의존성을 먼저 비교하세요.",
    },
    related: ["javascript", "typescript", "nodejs", "bun"],
    aliases: ["디노", "Deno runtime"],
    image: "deno",
    sources: [
      [
        "Deno · Security and permissions",
        "https://github.com/denoland/docs/blob/main/runtime/fundamentals/security.md",
        "Deno 공식 문서의 권한·실행 경계와 Node·npm 호환 조건.",
      ],
      [
        "Deno · Node and npm Compatibility",
        "https://github.com/denoland/docs/blob/main/runtime/fundamentals/node.md",
        "Deno 공식 문서의 권한·실행 경계와 Node·npm 호환 조건.",
      ],
      [
        "Deno 공식 문서 · 추가 읽기",
        "https://docs.deno.com/runtime/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/denojs/denojs-original.svg",
    logoAlt: "Deno 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "bun",
    name: "Bun",
    provider: "Bun 프로젝트 · Bun 기여자",
    category: "runtime",
    type: "JavaScript 런타임·개발 도구",
    summary:
      "JavaScript·TypeScript 실행과 패키지 설치·테스트·빌드 도구를 함께 제공하는 프로젝트입니다.",
    definition:
      "Bun은 JavaScriptCore 기반 실행과 여러 개발 도구를 제공합니다. Node API·npm 패키지와의 호환을 목표로 하지만 실제 사용하는 모듈·네이티브 확장·동작·배포 환경을 검증해야 합니다. 패키지 관리 성능과 앱의 요청 처리·데이터베이스 병목은 같은 지표가 아닙니다.",
    useCases: [
      [
        "서버·자동화 실행",
        "런타임의 HTTP·파일·표준 API를 사용해 앱과 도구를 실행합니다.",
      ],
      [
        "개발 도구 통합",
        "패키지 설치·테스트·빌드의 실제 기능과 기존 설정의 호환성을 비교합니다.",
      ],
    ],
    concepts: [
      [
        "런타임과 도구의 역할",
        "bun run·install·test·build는 서로 다른 작업입니다. 도구 채택과 서버 런타임 교체를 분리할 수 있습니다.",
      ],
      [
        "Node·패키지 호환",
        "API·모듈 로딩·네이티브 의존성·프로세스 동작의 지원을 시험합니다.",
      ],
      [
        "TypeScript와 검증",
        "타입 표기를 실행할 수 있어도 타입 오류·외부 입력을 검증해주는 것은 아닙니다.",
      ],
    ],
    flow: [
      [
        "역할·의존성 결정",
        "런타임 또는 필요한 도구를 선택하고 버전을 고정합니다.",
      ],
      ["빌드·실행", "모듈을 해석하고 서버·테스트·번들 작업을 수행합니다."],
      ["대상 환경 검증", "종료·오류·호환·자원과 실제 성능을 측정합니다."],
    ],
    points: [
      [
        "대표 워크로드로 비교",
        "설치 속도·빌드 시간·서버 지연·메모리를 나눠 측정합니다.",
      ],
      [
        "호환성 회귀 검사",
        "Node와 교체할 때 사용하는 API·네이티브 패키지·운영 도구를 검사합니다.",
      ],
      [
        "타입·의존성 별도 관리",
        "tsc·검증 도구와 lockfile·설치 스크립트의 실행 정책을 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "Node에서는 되는데 Bun에서 다름",
        "사용 API·네이티브 확장·모듈 로딩·프로세스와 버전 차이를 확인합니다.",
      ],
      [
        "도구는 빨라졌지만 API는 그대로 느림",
        "DB·네트워크·직렬화·CPU 중 실제 병목을 구분합니다.",
      ],
    ],
    example: {
      title: "런타임의 HTTP 서버 API",
      description:
        "Bun이 설치된 환경에서 bun run server.ts로 실행하는 예입니다.",
      language: "TypeScript",
      code: 'Bun.serve({\n  hostname: "127.0.0.1",\n  port: 3000,\n  fetch(request) {\n    return new Response("hello");\n  },\n});',
      note: "로컬 최소 서버이며 운영 배포·인증·타입 검사·종료 처리는 별도입니다. 이 API가 Node 표준 API와 같다는 뜻은 아닙니다.",
    },
    rationale: {
      short: "실행·패키지·검사·빌드의 도구 구성을 단순화할 때 검토합니다.",
      problem:
        "개발 도구를 여러 개 조합하면서 설치·설정·실행 시간이 부담이 될 수 있습니다.",
      change: "필요한 도구 또는 런타임을 선택해 기존 작업과 비교합니다.",
      decisions: [
        {
          gainTitle: "도구 통합",
          gain: "실행·패키지·테스트·빌드를 한 프로젝트의 도구로 다룹니다.",
          costTitle: "기능별 검증",
          cost: "각 도구의 호환·설정·동작을 따로 확인합니다.",
        },
        {
          gainTitle: "런타임 선택",
          gain: "앱 실행의 실제 자원·성능을 비교할 수 있습니다.",
          costTitle: "운영 호환",
          cost: "패키지·관측·배포 환경의 회귀 검사가 필요합니다.",
        },
      ],
      ask: "바꾸려는 대상은 설치 도구인가요, 실제 서버 실행 환경인가요?",
      simpler:
        "Node.js를 유지한 채 필요한 도구만 작은 범위로 시험할 수 있습니다.",
    },
    related: ["nodejs", "deno", "typescript", "vite"],
    aliases: ["번", "Bun runtime"],
    image: "bun",
    sources: [
      [
        "Bun · README.md",
        "https://github.com/oven-sh/bun/blob/main/README.md",
        "Bun 공식 프로젝트 안내의 실행·패키지·테스트·빌드 도구와 지원 경로. 앱 성능 수치로 일반화하지 않습니다.",
      ],
      [
        "Bun 공식 문서 · 추가 읽기",
        "https://bun.com/docs",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/bun/bun-original.svg",
    logoAlt: "Bun 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "prometheus",
    name: "Prometheus",
    provider: "Prometheus 프로젝트 · CNCF 커뮤니티",
    category: "observability",
    type: "메트릭 수집·시계열 질의 시스템",
    summary:
      "메트릭을 수집·보관하고 PromQL로 시간에 따른 서비스 상태와 변화율을 질의하는 시스템입니다.",
    definition:
      "Prometheus는 대상의 메트릭을 수집하고 라벨이 붙은 시계열로 보관·질의합니다. counter·gauge·histogram의 의미와 수집·보관 정책을 알아야 합니다. 로그·분산 추적 저장소나 알림 전달 전체와는 역할이 다르며 원격 저장·Alertmanager 등과 연결할 수 있습니다.",
    useCases: [
      [
        "서비스 상태·처리량 관측",
        "요청 수·오류·지연·자원의 시간별 변화를 읽습니다.",
      ],
      [
        "경보 조건 구성",
        "PromQL과 규칙으로 이상 조건을 계산하고 별도 알림 경로로 연결합니다.",
      ],
    ],
    concepts: [
      [
        "메트릭 타입",
        "counter의 누적과 reset·gauge의 현재 값, histogram의 버킷 분포를 구분합니다.",
      ],
      [
        "라벨과 카디널리티",
        "라벨 값 조합마다 시계열이 늘어납니다. 사용자 ID·무제한 URL을 라벨로 넣지 않습니다.",
      ],
      [
        "수집과 질의의 시간",
        "수집 간격·누락·보관·rate 구간이 결과에 영향을 줍니다. 없는 자료를 0과 같은 뜻으로 보지 않습니다.",
      ],
    ],
    flow: [
      ["계측·수집 대상 정의", "어떤 측정값·라벨을 노출할지 정합니다."],
      ["수집·시계열 보관", "대상의 메트릭을 읽고 시간과 라벨로 저장합니다."],
      [
        "질의·규칙 평가",
        "변화율·분포·오류 조건을 계산해 표시·알림에 연결합니다.",
      ],
    ],
    points: [
      [
        "분모·단위·구간 확인",
        "요청 수와 오류 수의 같은 범위·단위·구간을 맞춥니다.",
      ],
      [
        "높은 백분위와 버킷",
        "histogram의 버킷 선택과 집계 방법이 지연 추정에 영향을 줍니다.",
      ],
      [
        "용량과 접근 범위",
        "시계열 수·보관·수집 부하와 메트릭·관리 API의 접근을 운영합니다.",
      ],
    ],
    diagnostics: [
      [
        "메모리와 저장량이 급증",
        "라벨 조합·새 대상·고카디널리티와 보관 정책을 확인합니다.",
      ],
      [
        "요청 변화율이나 백분위가 이상함",
        "counter reset·수집 누락·rate 구간과 histogram 집계의 le 라벨을 확인합니다.",
      ],
    ],
    example: {
      title: "누적 요청 수를 초당 변화율로 보기",
      description: "이미 수집 중인 counter 메트릭을 가정한 PromQL입니다.",
      language: "PromQL",
      code: "sum by (service) (\n  rate(http_requests_total[5m])\n)",
      note: "5분은 학습용 구간입니다. 메트릭의 실제 타입·라벨·수집 간격을 확인하고 희소한 데이터·누락을 해석해야 합니다.",
    },
    rationale: {
      short:
        "서비스의 상태·부하·실패를 시간에 따라 계측하고 질의할 때 필요합니다.",
      problem:
        "서버가 켜져 있다는 사실만으로 요청 지연·오류·적체의 변화를 알 수 없습니다.",
      change: "계측한 메트릭을 시계열로 모아 구간·라벨별로 질의합니다.",
      decisions: [
        {
          gainTitle: "변화의 관측",
          gain: "처리량·오류·지연과 자원 추세를 계산합니다.",
          costTitle: "계측 설계",
          cost: "메트릭 의미·단위·라벨과 수집 조건을 정합니다.",
        },
        {
          gainTitle: "질의와 경보 규칙",
          gain: "같은 메트릭을 대시보드·경보에 사용합니다.",
          costTitle: "운영 비용",
          cost: "시계열 수·보관·누락·수집 부하를 관리합니다.",
        },
      ],
      ask: "서비스의 어떤 변화와 실패를 어떤 지표로 판단해야 하나요?",
      simpler:
        "작은 서비스는 핵심 메트릭과 관리형 관측 도구로 시작해 저장·운영 요구를 확인할 수 있습니다.",
    },
    related: ["grafana", "opentelemetry", "kubernetes"],
    aliases: ["프로메테우스", "PromQL"],
    image: "prometheus",
    sources: [
      [
        "Prometheus · Histograms and summaries",
        "https://github.com/prometheus/docs/blob/main/docs/practices/histograms.md",
        "Prometheus 공식 문서의 histogram·백분위와 메트릭·라벨 명명·카디널리티.",
      ],
      [
        "Prometheus · Metric and label naming",
        "https://github.com/prometheus/docs/blob/main/docs/practices/naming.md",
        "Prometheus 공식 문서의 histogram·백분위와 메트릭·라벨 명명·카디널리티.",
      ],
      [
        "Prometheus 공식 문서 · 추가 읽기",
        "https://prometheus.io/docs/introduction/overview/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/prometheus/prometheus-original.svg",
    logoAlt: "Prometheus 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "grafana",
    name: "Grafana",
    provider: "Grafana Labs · Grafana 커뮤니티",
    category: "observability",
    type: "데이터 탐색·대시보드 도구",
    summary:
      "여러 데이터 소스를 질의해 시간·조건에 따른 그래프와 대시보드로 보여주는 관측 도구입니다.",
    definition:
      "Grafana는 Prometheus·DB·로그 등 데이터 소스에 질의하고 패널·변수·시간 범위로 결과를 구성합니다. Grafana 화면 자체를 모든 메트릭·로그의 저장소로 보지 않습니다. 연결한 백엔드의 자료·권한·질의·보관과 패널의 단위·집계 의미를 함께 확인해야 합니다.",
    useCases: [
      [
        "운영 상태 대시보드",
        "요청·오류·지연·자원 지표를 같은 시간 범위와 서비스 조건으로 비교합니다.",
      ],
      [
        "여러 자료의 탐색",
        "데이터 소스·변수·링크를 연결해 증상과 로그·추적의 조사 경로를 만듭니다.",
      ],
    ],
    concepts: [
      [
        "데이터 소스와 질의",
        "패널이 어느 저장소에 어떤 질의를 보내는지 확인합니다. 시각화가 원본 자료를 새로 수집하는 것은 아닙니다.",
      ],
      [
        "시간·단위·집계",
        "시간 범위·구간·시간대와 byte·초·비율·초당 값의 단위를 맞춥니다.",
      ],
      [
        "변수·권한·알림",
        "대시보드 변수와 사용자별 자료 접근, 알림의 평가·실행 환경을 구분합니다.",
      ],
    ],
    flow: [
      ["소스·권한 연결", "서버가 조회할 백엔드와 접근 범위를 설정합니다."],
      ["질의·패널 구성", "시간·변수·집계와 시각화 단위를 정합니다."],
      ["공유·탐색·평가", "대시보드를 읽고 링크·알림의 실제 실행을 확인합니다."],
    ],
    points: [
      [
        "0과 자료 없음을 구분",
        "결측을 0으로 채워 장애나 수집 중단을 숨기지 않도록 합니다.",
      ],
      [
        "브라우저와 소스 권한",
        "데이터 소스 인증·프록시·대시보드 공유의 범위를 확인합니다.",
      ],
      [
        "질의 비용과 새로고침",
        "여러 패널과 잦은 갱신이 원본 DB·관측 백엔드에 주는 부하를 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "그래프가 다른 도구와 다름",
        "데이터 소스·시간대·구간·집계·단위와 실제 질의를 비교합니다.",
      ],
      [
        "대시보드만 열면 백엔드가 느려짐",
        "패널 수·변수 질의·갱신 주기와 고비용 집계를 확인합니다.",
      ],
    ],
    example: {
      title: "메트릭 패널의 질의와 단위 맞추기",
      description:
        "Prometheus 데이터 소스를 연결한 Grafana 패널의 질의 예입니다.",
      language: "PromQL · Grafana 패널",
      code: "sum by (service) (rate(http_requests_total[5m]))\n\n# 패널 단위: 요청/초\n# 범례: service 라벨\n# 자료 없음은 0과 구분",
      note: "메트릭의 실제 라벨과 패널 단위·시간 범위를 맞춰야 합니다. Grafana의 대시보드 전체 가져오기 JSON은 아닙니다.",
    },
    rationale: {
      short: "여러 관측 자료를 일관된 화면과 탐색 경로로 묶을 때 유용합니다.",
      problem:
        "로그·지표·DB를 따로 열면 같은 서비스·시간 범위를 맞추기 어렵습니다.",
      change: "데이터 소스의 질의를 대시보드·변수·링크로 구성합니다.",
      decisions: [
        {
          gainTitle: "통합 탐색",
          gain: "여러 자료를 같은 시간·조건으로 비교합니다.",
          costTitle: "해석의 책임",
          cost: "단위·집계·결측·원본 지연을 정확히 표현해야 합니다.",
        },
        {
          gainTitle: "공유 관측 화면",
          gain: "팀이 같은 대시보드와 조사 경로를 사용합니다.",
          costTitle: "질의·접근 운영",
          cost: "새로고침 부하·데이터 소스 권한·공유 범위를 관리합니다.",
        },
      ],
      ask: "필요한 자료가 어디에 있고 어떤 판단을 화면에서 내려야 하나요?",
      simpler:
        "작은 요구는 원본 도구의 탐색 화면으로 시작하고 여러 소스를 묶을 때 도입할 수 있습니다.",
    },
    related: ["prometheus", "opentelemetry", "opensearch"],
    aliases: ["그라파나", "Grafana dashboard"],
    image: "grafana",
    sources: [
      [
        "Grafana · Data sources",
        "https://github.com/grafana/grafana/blob/main/docs/sources/datasources/_index.md",
        "Grafana 공식 문서의 데이터 소스와 대시보드·패널 구성.",
      ],
      [
        "Grafana · Build dashboards",
        "https://github.com/grafana/grafana/blob/main/docs/sources/visualizations/dashboards/build-dashboards/_index.md",
        "Grafana 공식 문서의 데이터 소스와 대시보드·패널 구성.",
      ],
      [
        "Grafana 공식 문서 · 추가 읽기",
        "https://grafana.com/docs/grafana/latest/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/grafana/grafana-original.svg",
    logoAlt: "Grafana 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "opentelemetry",
    name: "OpenTelemetry",
    provider: "OpenTelemetry 프로젝트 · CNCF 커뮤니티",
    category: "observability",
    type: "관측 계측·수집 규약과 도구",
    summary:
      "애플리케이션의 추적·메트릭·로그를 계측하고 문맥·전달 경로를 연결하는 규약과 도구입니다.",
    definition:
      "OpenTelemetry는 관측 자료의 API·SDK·자동 계측·프로토콜과 Collector 등을 제공합니다. 저장·검색·대시보드 백엔드는 별도로 선택합니다. 서비스 간 추적 문맥의 전파, 샘플링·버퍼·내보내기 실패와 개인정보가 계측 경계를 결정합니다.",
    useCases: [
      [
        "서비스 사이의 요청 추적",
        "호출의 span과 context를 연결해 지연·오류의 위치를 조사합니다.",
      ],
      [
        "관측 자료의 공통 경로",
        "계측과 내보내기를 특정 저장 백엔드와 느슨하게 연결합니다.",
      ],
    ],
    concepts: [
      [
        "trace·span·context",
        "span은 작업 구간이고 context가 호출 경계를 이어줍니다. 비동기 작업에서도 전파가 유지되는지 확인합니다.",
      ],
      [
        "API·SDK·Exporter",
        "API 호출만으로 자료가 저장되는 것은 아닙니다. SDK·처리·내보내기 구성이 필요합니다.",
      ],
      [
        "Collector와 샘플링",
        "수신·처리·내보내기를 구성하고 누락·큐·재시도·샘플링 범위를 관측합니다.",
      ],
    ],
    flow: [
      ["작업·자원 계측", "서비스·작업의 의미와 필요한 속성을 정합니다."],
      ["문맥 전파·수집", "호출 경계를 이어 자료를 처리·내보냅니다."],
      ["백엔드 저장·조회", "별도 관측 저장소와 화면에서 자료를 조사합니다."],
    ],
    points: [
      [
        "비밀·고카디널리티 속성 제어",
        "토큰·개인정보·무제한 ID를 무분별하게 속성이나 메트릭 라벨에 넣지 않습니다.",
      ],
      [
        "누락과 성능 비용 확인",
        "샘플링·버퍼 초과·내보내기 실패와 계측의 CPU·네트워크 비용을 봅니다.",
      ],
      [
        "버전·지원 신호 확인",
        "언어별 SDK·자동 계측·의미 규약·백엔드의 지원을 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "추적이 서비스 경계에서 끊김",
        "HTTP·메시지 헤더의 context 전파·비동기 문맥과 sampling을 확인합니다.",
      ],
      [
        "계측 코드는 있는데 자료 없음",
        "SDK 등록·exporter·Collector 주소·큐·오류와 종료 시 flush를 확인합니다.",
      ],
    ],
    example: {
      title: "작업 구간에 span 연결",
      description:
        "OpenTelemetry SDK·context manager·exporter가 구성된 Node 앱의 함수 예제입니다.",
      language: "JavaScript",
      code: "import { trace, SpanStatusCode } from '@opentelemetry/api';\nconst tracer = trace.getTracer('catalog');\n\nexport function loadObserved() {\n  return tracer.startActiveSpan('load-catalog', async span => {\n    try { return await loadCatalog(); }\n    catch (error) {\n      span.recordException(error);\n      span.setStatus({ code: SpanStatusCode.ERROR });\n      throw error;\n    } finally { span.end(); }\n  });\n}",
      note: "loadCatalog와 SDK·exporter 구성은 별도입니다. API만 설치해도 자동으로 자료가 전송·저장되는 것은 아닙니다.",
    },
    rationale: {
      short:
        "여러 서비스의 관측 문맥과 계측·내보내기 규칙을 맞출 때 유용합니다.",
      problem:
        "각 서비스가 다른 관측 방식만 사용하면 호출의 전체 경로와 백엔드 교체가 어려워집니다.",
      change: "공통 계측 API·문맥·전달 경로로 관측 자료를 연결합니다.",
      decisions: [
        {
          gainTitle: "계측의 공통 계약",
          gain: "서비스 간 추적과 관측 데이터 형식을 맞춥니다.",
          costTitle: "계측·전파 작업",
          cost: "언어·라이브러리·메시지 경계의 지원을 확인합니다.",
        },
        {
          gainTitle: "백엔드와 분리",
          gain: "Collector·exporter로 저장 도구를 연결합니다.",
          costTitle: "자료량·누락",
          cost: "샘플링·버퍼·재시도·비밀 속성과 비용을 관리합니다.",
        },
      ],
      ask: "어떤 호출 경계를 추적하고 어느 백엔드에서 조사할 것인가요?",
      simpler:
        "한 서비스의 핵심 로그·메트릭으로 시작하고 경계가 늘어날 때 공통 계측을 더할 수 있습니다.",
    },
    related: ["prometheus", "grafana", "grpc"],
    aliases: ["오픈텔레메트리", "OTel", "Open Telemetry"],
    image: "opentelemetry",
    sources: [
      [
        "OpenTelemetry · Signals",
        "https://github.com/open-telemetry/opentelemetry.io/blob/main/content/en/docs/concepts/signals/_index.md",
        "OpenTelemetry 공식 문서의 신호와 context 전파. 저장·검색 백엔드는 별도 역할입니다.",
      ],
      [
        "OpenTelemetry · Context propagation",
        "https://github.com/open-telemetry/opentelemetry.io/blob/main/content/en/docs/concepts/context-propagation/index.md",
        "OpenTelemetry 공식 문서의 신호와 context 전파. 저장·검색 백엔드는 별도 역할입니다.",
      ],
      [
        "OpenTelemetry 공식 문서 · 추가 읽기",
        "https://opentelemetry.io/docs/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/opentelemetry/opentelemetry-original.svg",
    logoAlt: "OpenTelemetry 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "terraform",
    name: "Terraform",
    provider: "HashiCorp · Terraform 기여자",
    category: "operations",
    type: "선언형 인프라 관리 도구",
    summary:
      "리소스의 원하는 구성을 코드로 정의하고 plan·state·provider로 실제 인프라 변경을 관리하는 도구입니다.",
    definition:
      "Terraform은 HCL 구성과 provider를 이용해 리소스를 조회·생성·변경·삭제합니다. state는 구성과 원격 객체의 연결·기록이며 실제 서비스 상태 전체를 담는 백업은 아닙니다. plan의 검토·동시 실행·state 접근·민감 정보와 변경의 되돌리기 가능성을 운영해야 합니다.",
    useCases: [
      [
        "클라우드·서비스 자원 구성",
        "계정·환경별 네트워크·컴퓨팅·서비스 리소스의 구성을 코드로 남깁니다.",
      ],
      [
        "변경 검토와 재현",
        "실행 전 plan을 검토하고 버전·provider·state의 범위를 팀이 공유합니다.",
      ],
    ],
    concepts: [
      [
        "구성·provider·리소스",
        "provider API와 리소스 의존성으로 원하는 상태를 표현합니다.",
      ],
      [
        "plan·apply와 실제 변경",
        "plan은 시점의 관찰과 변경 계획입니다. 모든 변경이 트랜잭션으로 일괄 롤백되는 것은 아닙니다.",
      ],
      [
        "state·잠금·민감 정보",
        "state와 잠금 지원·접근 권한을 관리합니다. sensitive 표시가 state 저장을 암호화하는 것은 아닙니다.",
      ],
    ],
    flow: [
      ["구성·버전 초기화", "provider·모듈과 state 저장 범위를 정합니다."],
      ["조회·변경 계획", "현재 리소스와 구성의 차이·의존성을 검토합니다."],
      [
        "적용·기록·복구",
        "API 변경과 state 기록을 수행하고 부분 실패를 처리합니다.",
      ],
    ],
    points: [
      [
        "state의 소유·접근 제한",
        "원격 state·백업·잠금과 민감 자료의 보관을 구성합니다.",
      ],
      [
        "삭제·교체의 영향 검토",
        "이름 변경·주소 이동·리소스 재생성으로 실제 자료와 서비스가 영향을 받는지 확인합니다.",
      ],
      [
        "동시·수동 변경 통제",
        "여러 실행과 콘솔 수정으로 생긴 drift를 관찰하고 복구 순서를 정합니다.",
      ],
    ],
    diagnostics: [
      [
        "예상하지 않은 삭제·재생성 계획",
        "리소스 주소·키·provider 변화·state 이동과 실제 원격 객체를 확인합니다.",
      ],
      [
        "일부 적용 뒤 실패·잠금 충돌",
        "원격 리소스와 state의 차이·실행 주체를 확인하고 다른 실행을 중복하지 않습니다.",
      ],
    ],
    example: {
      title: "로컬 파일로 리소스 모델 확인",
      description:
        "Terraform과 local provider를 사용하는 임시 작업 디렉터리용 학습 구성입니다.",
      language: "HCL",
      code: 'terraform {\n  required_providers {\n    local = { source = "hashicorp/local", version = "~> 2.5" }\n  }\n}\nresource "local_file" "note" {\n  filename = "${path.module}/architecture-note.txt"\n  content  = "기술 구성 기록\\n"\n}',
      note: "적용 시 파일과 state가 생성됩니다. 실제 적용 전 plan을 확인하고 비밀 자료를 넣지 마세요. 클라우드 자원을 배포하는 예는 아닙니다.",
    },
    rationale: {
      short: "인프라의 구성·변경 계획·공유 기록을 코드로 관리할 때 유용합니다.",
      problem:
        "콘솔에서 수동 변경한 자원은 누가 무엇을 바꿨는지와 환경 재현을 추적하기 어렵습니다.",
      change:
        "선언한 구성과 provider·state를 이용해 차이를 계획하고 적용합니다.",
      decisions: [
        {
          gainTitle: "구성의 검토·기록",
          gain: "인프라 변경을 코드와 plan으로 검토합니다.",
          costTitle: "실제 변경의 영향",
          cost: "삭제·교체·부분 실패는 리소스별로 이해해야 합니다.",
        },
        {
          gainTitle: "공유된 상태 관리",
          gain: "리소스와 구성의 연결을 기록합니다.",
          costTitle: "state 운영",
          cost: "잠금·접근·백업·민감 정보와 drift를 관리합니다.",
        },
      ],
      ask: "누가 어떤 state 범위로 어느 환경의 변경을 책임지나요?",
      simpler:
        "작은 고정 환경은 수동 구성을 기록하며 시작하고 반복·협업의 비용이 커질 때 비교하세요.",
    },
    related: ["ansible", "kubernetes", "ec2"],
    aliases: ["테라폼", "IaC Terraform", "인프라 코드"],
    image: "terraform",
    sources: [
      [
        "Terraform · State",
        "https://github.com/hashicorp/terraform/blob/v1.5.7/website/docs/language/state/index.mdx",
        "Terraform v1.5.7 공식 보존 문서와 현재 state 구현의 리소스 연결·상태 기록. 현재 기능·권한·라이선스는 추가 문서를 확인합니다.",
      ],
      [
        "Terraform · state.go",
        "https://github.com/hashicorp/terraform/blob/main/internal/states/state.go",
        "Terraform v1.5.7 공식 보존 문서와 현재 state 구현의 리소스 연결·상태 기록. 현재 기능·권한·라이선스는 추가 문서를 확인합니다.",
      ],
      [
        "Terraform 공식 문서 · 추가 읽기",
        "https://developer.hashicorp.com/terraform/docs",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/terraform/terraform-original.svg",
    logoAlt: "Terraform 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "ansible",
    name: "Ansible",
    provider: "Red Hat · Ansible 커뮤니티",
    category: "operations",
    type: "구성·작업 자동화 도구",
    summary:
      "인벤토리·플레이북·모듈로 여러 대상의 설정과 배포 작업을 자동화하는 도구입니다.",
    definition:
      "Ansible은 대상 목록과 작업 순서를 정의하고 모듈을 실행해 설정·파일·패키지 등을 관리합니다. 많은 모듈은 원하는 상태를 표현하지만 모든 shell 명령·모듈·외부 작업이 멱등인 것은 아닙니다. 연결·권한·비밀·부분 실패와 실제 변경을 운영해야 합니다.",
    useCases: [
      [
        "서버 구성·배포 절차",
        "여러 호스트의 파일·패키지·서비스 설정을 공통 작업으로 연결합니다.",
      ],
      [
        "반복 운영 작업",
        "인벤토리·변수·role로 대상과 작업을 구분하고 결과를 확인합니다.",
      ],
    ],
    concepts: [
      ["인벤토리와 변수", "대상·그룹·환경별 값과 변수 우선순위를 명시합니다."],
      [
        "모듈·멱등성·handler",
        "상태 기반 모듈의 변경 여부와 handler 실행을 구분합니다. shell로 만든 작업은 별도 검증이 필요합니다.",
      ],
      [
        "check mode와 부분 실패",
        "검사 모드의 지원 범위는 모듈마다 다릅니다. 여러 서버를 바꾸다 실패하면 일괄 롤백된다고 가정하지 않습니다.",
      ],
    ],
    flow: [
      ["대상·변수 확인", "인벤토리·권한과 적용 범위를 정합니다."],
      ["작업·상태 변경", "모듈이 대상을 확인하고 필요한 변경을 수행합니다."],
      ["결과·handler·복구", "변경 결과와 실패·재실행·후속 작업을 처리합니다."],
    ],
    points: [
      [
        "적용 범위와 최소 권한",
        "그룹·limit·연결 계정·권한 상승을 검토하고 작은 범위에서 시작합니다.",
      ],
      [
        "비밀과 출력 분리",
        "암호·토큰의 변수 보관·전달·로그 노출을 관리합니다.",
      ],
      [
        "재실행·롤링 변경 설계",
        "중간 실패와 재실행 시의 상태, 서비스 교체 순서와 영향 범위를 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "반복 실행할 때 매번 변경됨",
        "shell 작업·템플릿 값·시간값과 모듈의 실제 변경 판단을 확인합니다.",
      ],
      [
        "일부 서버만 다른 상태로 남음",
        "인벤토리·변수 우선순위·실패 단계와 재실행 범위를 확인합니다.",
      ],
    ],
    example: {
      title: "로컬 파일을 상태 기반 모듈로 관리",
      description: "localhost에만 적용하는 Ansible 플레이북 예입니다.",
      language: "YAML",
      code: '- name: Write a local learning note\n  hosts: localhost\n  connection: local\n  gather_facts: false\n  tasks:\n    - name: Keep note content consistent\n      ansible.builtin.copy:\n        dest: /tmp/architecture-ansible-note.txt\n        content: "구성 기록\\n"\n        mode: "0644"',
      note: "파일을 생성·갱신하는 학습 예입니다. 다른 호스트의 서비스·권한을 바꾸지 않으며 실제 운영 인벤토리와 비밀 관리는 별도입니다.",
    },
    rationale: {
      short: "여러 대상의 설정·작업을 같은 규칙으로 반복 실행할 때 유용합니다.",
      problem:
        "수동 접속과 명령 복사는 대상별 차이와 누락·부분 실패를 추적하기 어렵게 합니다.",
      change: "인벤토리와 플레이북·상태 모듈로 작업을 구성합니다.",
      decisions: [
        {
          gainTitle: "공통 작업 재사용",
          gain: "여러 호스트의 설정을 코드로 기록합니다.",
          costTitle: "환경·권한 관리",
          cost: "인벤토리·변수·연결·비밀의 범위를 관리합니다.",
        },
        {
          gainTitle: "변경 여부 기반 실행",
          gain: "지원 모듈로 반복 실행의 차이를 줄입니다.",
          costTitle: "멱등성과 복구",
          cost: "임의 명령·외부 효과·부분 실패는 직접 설계합니다.",
        },
      ],
      ask: "원하는 상태와 실행할 작업, 실패 뒤 재실행 경로가 명확한가요?",
      simpler:
        "작은 로컬 작업은 스크립트로 시작하고 인프라 생성·수명은 Terraform과 역할을 비교하세요.",
    },
    related: ["terraform", "bash", "ubuntu"],
    aliases: ["앤서블", "엔서블", "Ansible playbook"],
    image: "ansible",
    sources: [
      [
        "Ansible · playbooks_intro.rst",
        "https://github.com/ansible/ansible-documentation/blob/devel/docs/docsite/rst/playbook_guide/playbooks_intro.rst",
        "Ansible 공식 문서의 플레이북·모듈·변경 상태와 check mode의 지원 범위.",
      ],
      [
        "Ansible · playbooks_checkmode.rst",
        "https://github.com/ansible/ansible-documentation/blob/devel/docs/docsite/rst/playbook_guide/playbooks_checkmode.rst",
        "Ansible 공식 문서의 플레이북·모듈·변경 상태와 check mode의 지원 범위.",
      ],
      [
        "Ansible 공식 문서 · 추가 읽기",
        "https://docs.ansible.com/ansible/latest/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/ansible/ansible-original.svg",
    logoAlt: "Ansible 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "git",
    name: "Git",
    provider: "Git 프로젝트 · Git 기여자",
    category: "tooling",
    type: "분산 버전 관리 도구",
    summary:
      "소스의 스냅샷·변경 관계를 커밋으로 기록하고 브랜치·병합으로 협업을 연결하는 도구입니다.",
    definition:
      "Git은 저장소의 객체와 커밋 그래프로 변경을 기록합니다. 작업 디렉터리·index·커밋과 원격 추적 참조는 서로 다른 상태입니다. GitHub는 저장소 호스팅·협업 서비스이며 로컬 커밋 자체가 원격 반영이나 배포 완료를 뜻하지는 않습니다.",
    useCases: [
      [
        "코드 변경의 기록·검토",
        "무엇을 왜 바꿨는지 커밋과 diff로 남기고 작업을 분리합니다.",
      ],
      [
        "브랜치·원격 협업",
        "서로의 변경을 fetch·merge·rebase 등의 규칙으로 통합합니다.",
      ],
    ],
    concepts: [
      [
        "작업 트리·index·HEAD",
        "수정한 파일과 다음 커밋에 넣을 내용, 현재 가리키는 커밋을 구분합니다.",
      ],
      [
        "커밋 그래프와 참조",
        "브랜치는 커밋을 가리키는 참조입니다. 파일 복사본 폴더와 같은 개념이 아닙니다.",
      ],
      [
        "병합과 이력 재작성",
        "merge·rebase의 결과와 공유 중인 커밋의 변경 영향을 구분합니다.",
      ],
    ],
    flow: [
      ["작업과 diff 확인", "수정 범위와 stage할 내용을 검토합니다."],
      ["커밋으로 기록", "선택한 스냅샷과 설명을 로컬에 남깁니다."],
      ["가져오기·통합·공유", "원격 변경과 충돌을 확인하고 결과를 공유합니다."],
    ],
    points: [
      [
        "stage와 실제 변경 비교",
        "의도하지 않은 파일·비밀·생성 결과가 커밋에 섞이지 않도록 diff를 검토합니다.",
      ],
      [
        "공유 이력의 변경 영향",
        "다른 사람이 쓰는 커밋을 재작성하기 전 협업 규칙을 확인합니다.",
      ],
      [
        "충돌의 의미 검증",
        "충돌 마커를 없애는 것과 두 변경의 업무 의미를 통합하는 일은 다릅니다. 통합 후 검사를 실행합니다.",
      ],
    ],
    diagnostics: [
      [
        "커밋했는데 다른 사람에게 안 보임",
        "현재 브랜치·원격·push 결과와 실제 커밋 해시를 확인합니다.",
      ],
      [
        "병합은 됐는데 기능이 잘못됨",
        "텍스트 충돌 외의 의미 충돌·삭제된 계약·검사 결과를 확인합니다.",
      ],
    ],
    example: {
      title: "읽기 전용으로 변경과 이력 확인",
      description: "Git 저장소 안에서 실행하는 확인 명령입니다.",
      language: "Git CLI",
      code: "git status --short --branch\ngit diff\ngit diff --cached\ngit log --oneline -5",
      note: "작업 파일·stage 내용·이력을 구분해 확인합니다. 명령만으로 원격 동기화나 배포가 수행되지는 않습니다.",
    },
    rationale: {
      short: "소스 변경의 근거·되돌아갈 지점·협업 통합을 기록할 때 필요합니다.",
      problem:
        "파일을 복사해 공유하면 어떤 변경이 포함됐는지와 충돌의 근거를 알기 어렵습니다.",
      change: "스냅샷과 변경 관계를 커밋 그래프로 남깁니다.",
      decisions: [
        {
          gainTitle: "추적 가능한 변경",
          gain: "커밋·diff로 변경 범위와 근거를 남깁니다.",
          costTitle: "기록의 품질",
          cost: "작업 분리·설명·검토가 있어야 이력이 유용해집니다.",
        },
        {
          gainTitle: "분산 협업",
          gain: "각 저장소에서 기록·통합하고 공유합니다.",
          costTitle: "동기화·충돌",
          cost: "로컬과 원격의 참조·충돌·공유 규칙을 관리합니다.",
        },
      ],
      ask: "한 커밋의 변경 이유와 검토·되돌리기 범위가 명확한가요?",
      simpler:
        "처음에는 작은 커밋과 diff 확인·단순 브랜치 규칙부터 시작할 수 있습니다.",
    },
    related: ["github-actions", "bash", "docker"],
    aliases: ["깃", "Git version control", "버전 관리"],
    image: "git",
    sources: [
      [
        "Git · git-merge.adoc",
        "https://github.com/git/git/blob/master/Documentation/git-merge.adoc",
        "Git 공식 명령 문서의 merge·rebase와 공유 이력 변경의 의미.",
      ],
      [
        "Git · git-rebase.adoc",
        "https://github.com/git/git/blob/master/Documentation/git-rebase.adoc",
        "Git 공식 명령 문서의 merge·rebase와 공유 이력 변경의 의미.",
      ],
      [
        "Git 공식 문서 · 추가 읽기",
        "https://git-scm.com/docs",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/git/git-original.svg",
    logoAlt: "Git 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    provider: "GitHub · GitHub Actions 커뮤니티",
    category: "tooling",
    type: "워크플로·CI 자동화 서비스",
    summary:
      "저장소 이벤트·수동 실행·일정에 따라 runner에서 빌드·검사·배포 작업을 실행하는 서비스입니다.",
    definition:
      "GitHub Actions는 workflow의 job·step과 runner 실행을 구성합니다. 체크아웃한 코드·외부 action·권한 토큰·비밀·캐시가 서로 다른 신뢰 경계를 가집니다. workflow 성공이 실제 운영 배포·서비스 정상·모든 검증의 완료와 같은 뜻은 아니므로 실행한 작업을 확인해야 합니다.",
    useCases: [
      [
        "커밋·PR의 빌드·검사",
        "변경한 코드의 설치·빌드·테스트를 공통 환경에서 반복 실행합니다.",
      ],
      [
        "명시적인 배포·운영 자동화",
        "환경·권한·조건을 갖춘 job으로 배포·수동 작업을 연결합니다.",
      ],
    ],
    concepts: [
      [
        "workflow·job·step",
        "이벤트와 조건, 병렬·의존 job·순차 step의 관계를 정합니다.",
      ],
      [
        "runner와 격리",
        "호스팅·자가 runner의 수명·작업 디렉터리·네트워크·비밀 접근을 확인합니다.",
      ],
      [
        "권한·action·비밀",
        "GITHUB_TOKEN 권한·외부 action 버전·PR의 신뢰 경계를 최소 범위로 구성합니다.",
      ],
    ],
    flow: [
      ["이벤트·조건 평가", "실행 대상의 코드·브랜치·권한을 결정합니다."],
      ["runner 작업 실행", "소스·의존성을 준비해 step을 수행합니다."],
      ["결과·산출물 처리", "실패·캐시·artifact·배포 결과를 구분해 기록합니다."],
    ],
    points: [
      [
        "PR 코드와 비밀 분리",
        "신뢰하지 않은 코드가 높은 권한·비밀을 받는 이벤트·runner 경로를 검토합니다.",
      ],
      [
        "외부 action·도구 고정",
        "재현성과 출처를 확인하고 운영에서는 검토한 커밋 SHA 고정을 고려합니다.",
      ],
      [
        "캐시를 결과의 근거로 보지 않기",
        "캐시 키·오염·만료와 실제 검사·artifact의 생성 커밋을 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "로컬은 성공하고 CI만 실패",
        "runner OS·도구 버전·환경·잠금 파일·캐시와 실제 체크아웃 커밋을 확인합니다.",
      ],
      [
        "초록색인데 필요한 검사가 실행 안 됨",
        "이벤트 필터·조건·스킵·실행 step·필수 검사 설정을 확인합니다.",
      ],
    ],
    example: {
      title: "읽기 권한의 빌드·검사 workflow",
      description:
        "package-lock.json과 npm test가 있는 Node 저장소의 학습용 workflow입니다.",
      language: "YAML",
      code: 'name: checks\non: [push, pull_request]\npermissions:\n  contents: read\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: "22"\n          cache: npm\n      - run: npm ci\n      - run: npm test',
      note: "v4와 Node 22는 예제의 선택이며 최신 버전이라는 주장이 아닙니다. 운영은 검토한 SHA·의존성·이벤트·비밀과 runner 정책을 정해야 합니다.",
    },
    rationale: {
      short:
        "저장소 변경의 빌드·검사를 같은 규칙으로 반복 실행할 때 유용합니다.",
      problem:
        "개발자마다 다른 환경에서 수동 확인하면 실행 누락과 결과 차이를 추적하기 어렵습니다.",
      change: "이벤트와 runner·job으로 검사·산출물 생성 과정을 기록합니다.",
      decisions: [
        {
          gainTitle: "반복 검사",
          gain: "커밋·PR과 검사 결과를 연결합니다.",
          costTitle: "환경·재현성",
          cost: "도구·의존성·캐시·runner 차이를 관리합니다.",
        },
        {
          gainTitle: "자동화 연결",
          gain: "검사·산출물·배포의 의존 관계를 구성합니다.",
          costTitle: "실행 권한",
          cost: "외부 코드·action·비밀·자가 runner의 신뢰 경계를 설계합니다.",
        },
      ],
      ask: "무슨 이벤트에서 어떤 코드를 어느 권한으로 실행하나요?",
      simpler:
        "처음에는 읽기 권한의 빌드·테스트만 자동화하고 배포는 검토 가능한 별도 단계로 추가할 수 있습니다.",
    },
    related: ["git", "docker", "bash"],
    aliases: ["깃허브 액션", "깃허브 액션즈", "GitHubActions", "CI", "CI/CD"],
    image: "github-actions",
    sources: [
      [
        "GitHub Actions · Workflow syntax for GitHub Actions",
        "https://github.com/github/docs/blob/main/content/actions/reference/workflows-and-actions/workflow-syntax.md",
        "GitHub 공식 workflow 문법의 이벤트·job·runner·권한·실행 조건.",
      ],
      [
        "GitHub Actions 공식 문서 · 추가 읽기",
        "https://docs.github.com/actions",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/githubactions/githubactions-original.svg",
    logoAlt: "GitHub Actions 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "haproxy",
    name: "HAProxy",
    provider: "HAProxy 프로젝트 · HAProxy 기여자",
    category: "http",
    type: "로드 밸런서·리버스 프록시",
    summary:
      "TCP·HTTP 연결을 여러 서버로 분배하고 상태 확인·연결 정책을 적용하는 프록시입니다.",
    definition:
      "HAProxy는 클라이언트 연결을 받아 frontend·backend와 분배 규칙으로 서버에 전달합니다. 상태 확인·타임아웃·TLS·연결 수 등의 정책을 구성할 수 있습니다. 서버의 메모리 상태·로그인 세션·DB 트랜잭션이 프록시를 둔다고 자동 공유되는 것은 아닙니다.",
    useCases: [
      [
        "여러 앱 서버의 앞단",
        "요청을 분배하고 서버 추가·제거·상태 확인을 연결합니다.",
      ],
      [
        "연결·응답 정책의 공통화",
        "시간 제한·연결 수·라우팅·TLS 경로를 서비스 요구에 맞게 구성합니다.",
      ],
    ],
    concepts: [
      [
        "frontend·backend·server",
        "받는 주소와 분배할 서버·선택 규칙을 분리합니다.",
      ],
      [
        "상태 확인과 실제 요청",
        "헬스체크 성공이 모든 요청·DB·외부 의존성이 정상이라는 뜻은 아닙니다.",
      ],
      [
        "연결·재시도·시간 제한",
        "연결 실패와 응답 시간 초과, 요청이 실행됐는지 모르는 상태를 구분합니다.",
      ],
    ],
    flow: [
      ["연결·규칙 평가", "frontend가 프로토콜·주소·라우팅 규칙을 확인합니다."],
      ["서버 선택과 전달", "상태·분배 정책에 맞춰 backend 서버에 연결합니다."],
      ["응답·실패·관측", "응답과 시간 제한·재시도·로그를 처리합니다."],
    ],
    points: [
      [
        "쓰기 재시도에 주의",
        "POST 등의 요청이 서버에서 실행됐는지 불확실할 수 있어 업무 멱등성을 설계합니다.",
      ],
      [
        "세션·상태 경계 분리",
        "고정 세션 라우팅과 공용 상태 저장·인증의 실제 보장 범위를 구분합니다.",
      ],
      [
        "변경 시 기존 연결 관리",
        "drain·타임아웃·reload와 긴 연결·진행 중 요청의 영향을 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "서버가 있는데 간헐적으로 502·504",
        "연결·응답 타임아웃·헬스체크·서버 로그와 실제 실행 결과를 비교합니다.",
      ],
      [
        "서버 증설 뒤 로그인·상태가 풀림",
        "앱 서버 로컬 세션과 요청 분배·쿠키·공유 저장 경계를 확인합니다.",
      ],
    ],
    example: {
      title: "로컬 HTTP 서버 두 개로 분배",
      description:
        "127.0.0.1:9001과 9002에 앱이 준비됐다는 가정의 HAProxy 설정입니다.",
      language: "HAProxy 설정",
      code: "defaults\n  mode http\n  timeout connect 3s\n  timeout client 30s\n  timeout server 30s\nfrontend local_http\n  bind 127.0.0.1:8080\n  default_backend apps\nbackend apps\n  balance roundrobin\n  server app1 127.0.0.1:9001 check\n  server app2 127.0.0.1:9002 check",
      note: "시간은 학습용 선택이며 TLS·인증·업무 readiness·운영 권한 설정은 포함하지 않습니다. check는 여기서 앱의 모든 의존성을 검사하지 않습니다.",
    },
    rationale: {
      short:
        "여러 서버의 연결 분배와 공통 네트워크 정책이 필요할 때 유용합니다.",
      problem:
        "클라이언트가 서버 목록·장애·교체를 직접 알게 하면 배포와 연결 관리가 복잡해집니다.",
      change: "프록시 앞단에서 서버 선택·상태·시간 제한을 구성합니다.",
      decisions: [
        {
          gainTitle: "서버 분배·교체",
          gain: "공통 주소 뒤에서 서버를 선택·관리합니다.",
          costTitle: "상태의 별도 설계",
          cost: "앱 세션·DB·쓰기 중복은 프록시가 해결하지 않습니다.",
        },
        {
          gainTitle: "연결 정책",
          gain: "타임아웃·TLS·상태 확인을 공통화합니다.",
          costTitle: "운영 경계",
          cost: "프록시 용량·장애·reload·관측을 관리합니다.",
        },
      ],
      ask: "L4·L7 요구와 상태 확인·연결 종료의 정책이 명확한가요?",
      simpler:
        "단일 앱 서버라면 기본 앞단 구성부터 시작하고 NGINX·Envoy·관리형 로드 밸런서와 비교하세요.",
    },
    related: ["nginx", "envoy", "caddy"],
    aliases: ["에이치에이프록시", "HA Proxy", "로드밸런서 HAProxy"],
    image: "haproxy",
    sources: [
      [
        "HAProxy · configuration.txt",
        "https://github.com/haproxy/haproxy/blob/master/doc/configuration.txt",
        "HAProxy 공식 설정 매뉴얼의 frontend·backend·분배·연결·상태·시간 제한.",
      ],
      [
        "HAProxy 공식 문서 · 추가 읽기",
        "https://www.haproxy.org/#docs",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/haproxy/haproxy-original.svg",
    logoAlt: "HAProxy 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "envoy",
    name: "Envoy Proxy",
    provider: "Envoy 프로젝트 · CNCF 커뮤니티",
    category: "http",
    type: "L4·L7 서비스 프록시",
    summary:
      "서비스 트래픽의 라우팅·연결 풀·상태·정책과 관측을 구성하는 프록시입니다.",
    definition:
      "Envoy는 listener·filter·route·cluster·endpoint 등의 구성으로 트래픽을 처리합니다. 정적 설정과 xDS를 통한 동적 구성을 지원하며 제어 평면과 데이터 평면을 구분해야 합니다. Envoy 자체가 서비스 메시의 인증·정책·운영 전체를 자동으로 제공하는 것은 아닙니다.",
    useCases: [
      [
        "서비스 사이의 트래픽 경계",
        "라우팅·시간 제한·상태 확인·관측을 서비스 호출 앞단에서 다룹니다.",
      ],
      [
        "동적 프록시 구성",
        "제어 평면에서 전달한 설정으로 여러 프록시의 경로와 정책을 관리합니다.",
      ],
    ],
    concepts: [
      [
        "listener·route·cluster",
        "받는 연결·HTTP 필터·경로·상류 서버 묶음의 관계를 구분합니다.",
      ],
      [
        "연결 풀·상태·시간 제한",
        "상류 연결·건강 상태·회로 차단·요청과 연결의 시간 제한을 함께 설정합니다.",
      ],
      [
        "xDS와 제어 평면",
        "동적 구성의 전달·수락·실패와 실제 적용 상태를 확인합니다. 구성 API와 앱 요청은 다른 경로입니다.",
      ],
    ],
    flow: [
      ["listener·필터 처리", "연결·프로토콜과 요청 필터를 적용합니다."],
      ["route·cluster 선택", "요청 경로와 상류 대상·정책을 결정합니다."],
      ["연결·응답 관측", "풀·상태·시간 제한과 로그·메트릭을 처리합니다."],
    ],
    points: [
      [
        "시간 제한·재시도 예산",
        "중첩된 재시도와 각 계층의 timeout이 부하·지연을 증폭시키지 않게 합니다.",
      ],
      [
        "구성의 유효성과 적용 확인",
        "정적 검사·xDS 수락·실제 route·endpoint 상태를 함께 봅니다.",
      ],
      [
        "관리 인터페이스·인증",
        "admin 포트·동적 구성의 신뢰 주체·업스트림 TLS와 권한을 제한합니다.",
      ],
    ],
    diagnostics: [
      [
        "설정은 바뀌었는데 경로가 그대로",
        "xDS 전달·수락·오류와 프록시의 실제 활성 구성을 확인합니다.",
      ],
      [
        "장애 때 요청 수가 더 폭증",
        "앱·프록시·클라이언트의 중첩 재시도와 회로 차단·timeout을 확인합니다.",
      ],
    ],
    example: {
      title: "경로를 이름 있는 cluster에 연결",
      description:
        "Envoy HTTP connection manager의 route_config 부분만 발췌한 YAML입니다.",
      language: "YAML",
      code: 'route_config:\n  name: local_routes\n  virtual_hosts:\n    - name: catalog\n      domains: ["*"]\n      routes:\n        - match:\n            prefix: "/"\n          route:\n            cluster: catalog_service\n            timeout: 2s',
      note: "listener·HTTP 필터·catalog_service cluster와 endpoint를 별도로 정의해야 합니다. 전체 실행 설정이나 운영용 시간 제한은 아닙니다.",
    },
    rationale: {
      short:
        "서비스 트래픽 정책·관측과 동적 구성을 공통 프록시에서 다룰 때 유용합니다.",
      problem:
        "각 서비스가 연결 풀·시간 제한·경로·관측 정책을 제각각 구현하면 일관성을 유지하기 어렵습니다.",
      change: "프록시의 데이터 경로와 별도 구성 관리 경로로 정책을 조직합니다.",
      decisions: [
        {
          gainTitle: "공통 트래픽 기능",
          gain: "라우팅·풀·상태·관측 정책을 연결합니다.",
          costTitle: "추가 실행 계층",
          cost: "프록시 자원·장애·버전·디버깅을 운영합니다.",
        },
        {
          gainTitle: "동적 구성",
          gain: "실행 중 경로·대상을 갱신할 수 있습니다.",
          costTitle: "제어 평면 운영",
          cost: "설정의 전달·수락·신뢰와 적용 상태를 관리합니다.",
        },
      ],
      ask: "동적 구성과 서비스별 정책의 이점이 운영 복잡성보다 큰가요?",
      simpler:
        "단순한 분배는 HAProxy·NGINX·관리형 로드 밸런서와 먼저 비교할 수 있습니다.",
    },
    related: ["haproxy", "nginx", "grpc", "opentelemetry"],
    aliases: ["엔보이", "Envoy", "EnvoyProxy"],
    image: "envoy",
    sources: [
      [
        "Envoy Proxy · http_routing.rst",
        "https://github.com/envoyproxy/envoy/blob/main/docs/root/intro/arch_overview/http/http_routing.rst",
        "Envoy 공식 아키텍처 문서의 HTTP 라우팅·cluster와 상태 확인.",
      ],
      [
        "Envoy Proxy · health_checking.rst",
        "https://github.com/envoyproxy/envoy/blob/main/docs/root/intro/arch_overview/upstream/health_checking.rst",
        "Envoy 공식 아키텍처 문서의 HTTP 라우팅·cluster와 상태 확인.",
      ],
      [
        "Envoy Proxy 공식 문서 · 추가 읽기",
        "https://www.envoyproxy.io/docs/envoy/latest/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/envoy/envoy-original.svg",
    logoAlt: "Envoy Proxy 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "graphql",
    name: "GraphQL",
    provider: "GraphQL Foundation · GraphQL 커뮤니티",
    category: "api",
    type: "API 질의 언어·실행 규약",
    summary:
      "스키마에서 허용한 필드를 클라이언트가 선택하고 resolver가 결과를 구성하는 API 규약입니다.",
    definition:
      "GraphQL은 스키마·타입·operation과 실행·응답 규칙을 정의합니다. DB 자체나 특정 전송 서버가 아니며 resolver에서 DB·캐시·다른 서비스를 호출합니다. 필요한 필드만 고를 수 있어도 권한·질의 비용·N+1·캐시와 실행 실패를 자동 해결하지는 않습니다.",
    useCases: [
      [
        "여러 화면의 데이터 조합",
        "클라이언트가 필요한 필드를 선택하고 서버는 스키마와 resolver로 결과를 구성합니다.",
      ],
      [
        "API 계약과 점진적 변화",
        "필드·타입·사용 현황을 기준으로 API를 확장하고 폐기를 관리합니다.",
      ],
    ],
    concepts: [
      [
        "스키마·필드·operation",
        "허용 타입과 query·mutation의 입력·결과를 정의합니다. 타입이 업무 권한을 뜻하지는 않습니다.",
      ],
      [
        "resolver와 N+1",
        "필드마다 호출이 발생할 수 있습니다. 배치·자료 로딩과 요청별 캐시 경계를 설계합니다.",
      ],
      [
        "오류·null·실행 경계",
        "부분 결과·errors·null 전파를 이해해야 합니다. mutation의 순차 실행이 자동 DB 트랜잭션은 아닙니다.",
      ],
    ],
    flow: [
      ["문법·스키마 검증", "operation과 변수가 스키마에 맞는지 검사합니다."],
      ["resolver 실행", "권한·질의 비용과 실제 데이터 소스를 연결합니다."],
      ["선택 필드 응답", "요청한 결과와 부분 오류·null을 규약대로 반환합니다."],
    ],
    points: [
      [
        "필드·객체 권한",
        "인증과 별개로 각 자료와 민감 필드의 접근 권한을 검사합니다.",
      ],
      [
        "깊이·복잡도·반환량 제한",
        "중첩·배치·페이지네이션으로 생기는 실행 비용을 통제합니다.",
      ],
      [
        "클라이언트·서버 캐시 분리",
        "요청별 로더 캐시에 서로 다른 사용자의 자료가 섞이지 않게 하고 갱신 경로를 정합니다.",
      ],
    ],
    diagnostics: [
      [
        "한 요청이 DB를 수백 번 호출",
        "필드 resolver의 N+1·배치·페이지네이션과 요청별 캐시를 확인합니다.",
      ],
      [
        "HTTP 성공인데 화면에 일부 자료가 없음",
        "GraphQL errors·null 전파·권한·클라이언트 오류 처리 정책을 확인합니다.",
      ],
    ],
    example: {
      title: "변수로 식별자를 전달하는 질의",
      description:
        "스키마에 product(id: ID!) 필드와 Product 타입이 있다는 가정의 operation입니다.",
      language: "GraphQL",
      code: 'query ProductDetail($id: ID!) {\n  product(id: $id) {\n    id\n    title\n    price\n  }\n}\n\n# 별도 variables: {"id":"p1"}',
      note: "스키마·resolver·인증·서버와 비용 제한은 별도입니다. 필드의 price 단위·통화·권한도 API 계약으로 정해야 합니다.",
    },
    rationale: {
      short:
        "여러 화면이 다른 데이터 조합을 필요로 하고 명시적 API 스키마가 유용할 때 검토합니다.",
      problem:
        "화면마다 필요한 필드와 관련 자료가 달라 고정 응답을 여러 번 받아 조합할 수 있습니다.",
      change:
        "스키마에서 선택 가능한 필드와 resolver의 실행 계약을 제공합니다.",
      decisions: [
        {
          gainTitle: "응답 선택",
          gain: "필요한 필드를 operation으로 표현합니다.",
          costTitle: "실행 비용·권한",
          cost: "resolver·중첩·반환량·객체별 권한을 설계합니다.",
        },
        {
          gainTitle: "스키마 계약",
          gain: "API 타입과 변경·도구를 연결합니다.",
          costTitle: "오류·캐시 모델",
          cost: "부분 실패·null·갱신과 요청별 상태를 관리합니다.",
        },
      ],
      ask: "클라이언트의 데이터 조합 문제와 서버의 실행·권한 경계를 확인했나요?",
      simpler:
        "단순하고 고정된 API는 HTTP·JSON으로 시작하고 내부 호출은 gRPC와도 역할을 비교하세요.",
    },
    related: ["grpc", "nestjs", "postgresql", "tanstack-query"],
    aliases: ["그래프큐엘", "Graph QL", "GQL"],
    image: "graphql",
    sources: [
      [
        "GraphQL · Type System",
        "https://github.com/graphql/graphql-spec/blob/main/spec/Section%203%20--%20Type%20System.md",
        "GraphQL 공식 사양의 타입·실행·필드 결과와 오류 처리. DB나 권한 정책은 별도입니다.",
      ],
      [
        "GraphQL · Execution",
        "https://github.com/graphql/graphql-spec/blob/main/spec/Section%206%20--%20Execution.md",
        "GraphQL 공식 사양의 타입·실행·필드 결과와 오류 처리. DB나 권한 정책은 별도입니다.",
      ],
      [
        "GraphQL 공식 문서 · 추가 읽기",
        "https://spec.graphql.org/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/graphql/graphql-plain.svg",
    logoAlt: "GraphQL 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "grpc",
    name: "gRPC",
    provider: "gRPC 프로젝트 · CNCF 커뮤니티",
    category: "api",
    type: "원격 프로시저 호출 프레임워크",
    summary:
      "서비스·메시지 계약과 생성된 코드를 이용해 단일 응답·스트리밍 RPC를 연결하는 프레임워크입니다.",
    definition:
      "gRPC는 서비스 정의·생성된 client/server 코드와 전송·상태·시간 제한을 연결합니다. 흔히 Protocol Buffers와 HTTP/2를 사용하지만 언어·구현·전송의 지원을 확인해야 합니다. 타입 계약은 권한·업무 멱등성·배포 호환성·장애 복구를 대신하지 않습니다.",
    useCases: [
      [
        "내부 서비스 간 계약",
        "여러 언어의 서비스가 같은 메시지·서비스 정의에서 코드를 생성합니다.",
      ],
      [
        "스트리밍 호출",
        "서버·클라이언트·양방향 스트리밍을 요구와 지원 환경에 맞게 사용합니다.",
      ],
    ],
    concepts: [
      [
        "서비스·메시지·필드 번호",
        "계약과 코드 생성을 연결합니다. 사용했던 protobuf 필드 번호의 재사용·자료형 변경을 신중히 관리합니다.",
      ],
      [
        "deadline·취소·상태",
        "클라이언트가 기다리는 기한과 서버 작업의 중단을 연결합니다. 시간 초과는 업무 미실행의 증거가 아닙니다.",
      ],
      [
        "스트리밍·흐름 제어",
        "연결과 메시지 흐름·소비 속도·버퍼·최대 크기를 관리합니다. 스트림 순서와 재연결 복구는 구분합니다.",
      ],
    ],
    flow: [
      [
        "계약·코드 생성",
        "서비스와 메시지를 정의하고 대상 언어 코드를 만듭니다.",
      ],
      ["호출·전송", "metadata·deadline과 요청·응답 또는 스트림을 연결합니다."],
      [
        "상태·취소·복구",
        "결과 상태와 불확실한 실행·재시도·연결 종료를 처리합니다.",
      ],
    ],
    points: [
      [
        "기한과 재시도 예산",
        "기본 무제한 대기를 피하고 호출 연쇄·남은 시간·업무 멱등성을 고려합니다.",
      ],
      [
        "계약의 점진적 변경",
        "필드·메서드·클라이언트 버전의 호환성과 배포 순서를 확인합니다.",
      ],
      [
        "브라우저·프록시 지원",
        "브라우저 직접 호출에는 gRPC-Web 등 별도 경로와 프록시 지원을 검토합니다.",
      ],
    ],
    diagnostics: [
      [
        "클라이언트는 timeout인데 서버는 처리함",
        "deadline·취소 전달·실제 커밋 시점과 재시도·업무 키를 확인합니다.",
      ],
      [
        "스트림 메모리·지연이 증가",
        "수신 속도·버퍼·흐름 제어·메시지 크기와 재연결 경로를 확인합니다.",
      ],
    ],
    example: {
      title: "메시지와 호출 계약 정의",
      description: "Protocol Buffers의 proto3 서비스 정의 예제입니다.",
      language: "Protocol Buffers",
      code: 'syntax = "proto3";\npackage catalog;\n\nservice Catalog {\n  rpc GetProduct(GetProductRequest) returns (Product);\n}\nmessage GetProductRequest { string id = 1; }\nmessage Product {\n  string id = 1;\n  string title = 2;\n}',
      note: "코드 생성·서버·클라이언트·TLS·deadline·권한은 별도입니다. 호출 실패 뒤 업무가 실행됐는지 판별하는 정책도 필요합니다.",
    },
    rationale: {
      short:
        "서비스 간 타입 계약과 코드 생성·스트리밍 호출이 필요할 때 유용합니다.",
      problem:
        "여러 언어의 서비스가 요청·응답 형식과 호출·실패 규칙을 따로 구현하면 편차가 커집니다.",
      change: "명시적 서비스·메시지 정의와 RPC 실행 규약으로 연결합니다.",
      decisions: [
        {
          gainTitle: "계약과 도구",
          gain: "여러 언어의 메시지·호출 코드를 생성합니다.",
          costTitle: "계약의 호환",
          cost: "필드 번호·타입·버전·배포 순서를 관리합니다.",
        },
        {
          gainTitle: "호출·스트리밍 모델",
          gain: "deadline·상태·스트림을 공통 규약으로 다룹니다.",
          costTitle: "네트워크 실패",
          cost: "취소·재시도·버퍼·불확실한 실행을 설계합니다.",
        },
      ],
      ask: "타입 계약·스트리밍과 실제 클라이언트·프록시 환경이 맞나요?",
      simpler:
        "공개·브라우저 중심 API는 HTTP·JSON·GraphQL과 도구·캐시·호환성을 비교하세요.",
    },
    related: ["graphql", "envoy", "go", "java"],
    aliases: ["지알피씨", "GRPC", "g RPC"],
    image: "grpc",
    sources: [
      [
        "gRPC · gRPC over HTTP2",
        "https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md",
        "gRPC 공식 HTTP/2 프로토콜과 deadline 안내의 메시지·상태·기한·취소 경계.",
      ],
      [
        "gRPC · Deadlines",
        "https://github.com/grpc/grpc.io/blob/main/content/en/docs/guides/deadlines.md",
        "gRPC 공식 HTTP/2 프로토콜과 deadline 안내의 메시지·상태·기한·취소 경계.",
      ],
      [
        "gRPC 공식 문서 · 추가 읽기",
        "https://grpc.io/docs/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/grpc/grpc-original.svg",
    logoAlt: "gRPC 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
];
