// Detailed profiles for the shared technology catalogue.
export const applicationsTechnologies = [
  {
    id: "spring-boot",
    name: "Spring Boot",
    provider: "Spring 팀 · Spring 커뮤니티",
    category: "backend",
    type: "Spring 애플리케이션 구성 프레임워크",
    summary:
      "Spring 앱의 의존성·자동 구성·실행·운영 기능을 연결해 서버 애플리케이션을 구성하는 도구입니다.",
    definition:
      "Spring Boot는 Spring 기반 앱의 시작과 구성을 돕습니다. 의존성·설정·조건에 따라 자동 구성을 적용하고 필요한 경우 작성한 Bean과 명시적 설정으로 대체합니다. Spring Framework·웹 서버·DB·메시지 브로커는 별도 계층이며 Boot가 업무 트랜잭션이나 분산 실패를 자동으로 해결하는 것은 아닙니다.",
    useCases: [
      [
        "Java·Kotlin 업무 서버",
        "HTTP·검증·DB 접근 등 Spring 생태계의 기능을 실행 가능한 앱으로 구성합니다.",
      ],
      [
        "설정과 운영의 표준화",
        "외부 설정·상태 확인·메트릭 등의 공통 운영 경로를 마련합니다.",
      ],
    ],
    concepts: [
      [
        "자동 구성의 조건",
        "클래스패스·설정·기존 Bean 등 조건에 따라 구성이 결정됩니다. 실제 적용 조건을 확인할 수 있어야 합니다.",
      ],
      [
        "DI와 Bean 수명",
        "객체와 의존성은 Spring 컨테이너가 구성합니다. singleton에 요청별 상태를 보관하지 않습니다.",
      ],
      [
        "외부 설정과 우선순위",
        "프로필·환경 변수·설정 파일의 실제 적용값을 확인하고 비밀·권한 정보를 분리합니다.",
      ],
    ],
    flow: [
      ["의존성·설정 읽기", "시작할 기능과 외부 설정을 정합니다."],
      ["컨테이너·서버 구성", "조건부 자동 구성과 명시적 Bean을 연결합니다."],
      ["요청·관측·종료", "업무 요청을 처리하고 상태·자원 종료를 관리합니다."],
    ],
    points: [
      [
        "자동 구성 결과 확인",
        "설정을 추가했다고 실제 런타임에 적용됐다고 가정하지 않고 조건·프로필·로그를 봅니다.",
      ],
      [
        "트랜잭션 경계와 외부 호출",
        "DB 원자성과 큐·메일·외부 API의 실행을 같은 성공으로 묶지 않습니다.",
      ],
      [
        "운영 엔드포인트 접근 제한",
        "관리·상태·설정 관련 엔드포인트의 공개 범위와 인증을 검토합니다.",
      ],
    ],
    diagnostics: [
      [
        "설정한 기능이 시작되지 않음",
        "의존성·자동 구성 조건·Bean 중복·실제 활성 프로필을 확인합니다.",
      ],
      [
        "서버가 살아 있는데 응답이 밀림",
        "요청 스레드·DB 풀·외부 호출과 비동기 실행 모델을 나눠 봅니다.",
      ],
    ],
    example: {
      title: "최소 HTTP 응답 구성",
      description:
        "Spring Boot 웹 의존성이 구성된 프로젝트의 Java 코드 예입니다.",
      language: "Java",
      code: 'import org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.RestController;\n\n@SpringBootApplication\n@RestController\npublic class App {\n  public static void main(String[] args) { SpringApplication.run(App.class, args); }\n  @GetMapping("/hello")\n  public String hello() { return "hello"; }\n}',
      note: "빌드 도구·대상 Java 버전·서버 의존성은 프로젝트에서 정합니다. 인증·DB·운영 배포 설정은 포함하지 않습니다.",
    },
    rationale: {
      short:
        "Spring 서버의 반복적인 구성과 운영 진입점을 표준화할 때 필요합니다.",
      problem:
        "서버마다 의존성·객체 연결·실행 설정을 수동으로 조합하면 편차가 커집니다.",
      change: "조건부 자동 구성과 외부 설정 규약으로 공통 시작점을 만듭니다.",
      decisions: [
        {
          gainTitle: "반복 구성 감소",
          gain: "Spring 생태계의 기능을 공통 규약으로 연결합니다.",
          costTitle: "조건 이해",
          cost: "자동 구성과 Bean·설정 우선순위를 이해해야 합니다.",
        },
        {
          gainTitle: "운영 진입점",
          gain: "상태·메트릭·종료 경로를 구성합니다.",
          costTitle: "공개 범위 관리",
          cost: "관리 엔드포인트·실행 자원·권한을 운영해야 합니다.",
        },
      ],
      ask: "Spring 생태계의 기능과 팀의 JVM 운영 경험이 필요한가요?",
      simpler:
        "작은 서버는 단순한 프레임워크로 시작하고 필요한 통합·운영 기능을 비교할 수 있습니다.",
    },
    related: ["java", "kotlin", "postgresql", "aspnetcore"],
    aliases: ["스프링 부트", "SpringBoot", "스프링부트"],
    image: "spring-boot",
    sources: [
      [
        "Spring Boot · auto-configuration.adoc",
        "https://github.com/spring-projects/spring-boot/blob/main/documentation/spring-boot-docs/src/docs/antora/modules/reference/pages/using/auto-configuration.adoc",
        "Spring Boot 공식 문서의 자동 구성 조건과 외부 설정.",
      ],
      [
        "Spring Boot · external-config.adoc",
        "https://github.com/spring-projects/spring-boot/blob/main/documentation/spring-boot-docs/src/docs/antora/modules/reference/pages/features/external-config.adoc",
        "Spring Boot 공식 문서의 자동 구성 조건과 외부 설정.",
      ],
      [
        "Spring Boot 공식 문서 · 추가 읽기",
        "https://docs.spring.io/spring-boot/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/simple-icons/simple-icons/develop/icons/springboot.svg",
    logoAlt: "Spring Boot 식별용 심벌",
    logoNote: "Simple Icons 원본 심벌 · 형상·색상 보존 · CC0-1.0",
  },
  {
    id: "django",
    name: "Django",
    provider: "Django Software Foundation · Django 커뮤니티",
    category: "backend",
    type: "Python 웹 프레임워크",
    summary:
      "라우팅·ORM·인증·폼·관리 화면 등 웹 앱의 공통 기능을 제공하는 Python 프레임워크입니다.",
    definition:
      "Django는 요청 처리와 모델·템플릿·인증 등의 공통 규약을 묶은 프레임워크입니다. QuerySet의 지연 실행과 DB 트랜잭션, 동기·비동기 실행 조건을 구분해야 합니다. ORM을 사용해도 데이터 권한·인덱스·동시 변경과 외부 부수 효과는 직접 설계합니다.",
    useCases: [
      [
        "데이터 중심 업무 웹",
        "사용자·권한·관리 화면과 모델 관계가 많은 서비스를 구성합니다.",
      ],
      [
        "서버 렌더링·API 기반",
        "템플릿 또는 별도 API 도구와 연결해 웹 요청과 데이터 접근을 구현합니다.",
      ],
    ],
    concepts: [
      [
        "모델과 지연 QuerySet",
        "질의 객체 생성과 실제 DB 조회 시점은 다를 수 있습니다. 관련 객체 접근에서 추가 질의가 생길 수 있습니다.",
      ],
      [
        "atomic과 DB 트랜잭션",
        "블록의 성공·실패에 따라 DB 변경을 커밋·롤백합니다. 외부 메시지·메일은 같은 트랜잭션에 속하지 않습니다.",
      ],
      [
        "관련 객체와 조회 경로",
        "select_related·prefetch_related가 각각 어떤 조회를 수행하는지 확인하고 실제 질의를 봅니다.",
      ],
    ],
    flow: [
      ["요청·권한 검사", "라우트와 사용자·입력을 확인합니다."],
      [
        "모델·질의 실행",
        "필요한 관계와 트랜잭션 범위에서 자료를 읽고 바꿉니다.",
      ],
      [
        "응답·후속 작업",
        "템플릿·API 응답을 만들고 커밋 이후 작업을 구분합니다.",
      ],
    ],
    points: [
      [
        "N+1과 인덱스 확인",
        "ORM 표현의 길이보다 실제 질의 수·계획·반환량을 관찰합니다.",
      ],
      [
        "트랜잭션을 짧게 유지",
        "락을 잡은 상태의 긴 외부 호출을 피하고 실패·경쟁 조건을 설계합니다.",
      ],
      [
        "권한은 객체 단위로 검사",
        "인증된 사용자라는 이유만으로 모든 모델 행에 접근하게 하지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "목록 한 번에 DB 질의가 급증",
        "반복문에서 관계를 지연 조회하는지 질의 로그로 확인합니다.",
      ],
      [
        "업무 실패 뒤 메일만 발송됨",
        "DB 커밋·롤백과 외부 작업의 발생 순서·outbox 같은 연결 방식을 확인합니다.",
      ],
    ],
    example: {
      title: "연관 자료를 함께 읽기",
      description:
        "Order 모델에 customer 외래 키가 있다는 가정의 Django ORM 함수입니다.",
      language: "Python",
      code: 'def recent_orders():\n    return list(\n        Order.objects\n        .select_related("customer")\n        .order_by("-created_at")[:20]\n    )',
      note: "모델·마이그레이션·DB와 사용자별 권한 조건은 별도입니다. select_related는 모든 관계 종류의 해법이 아닙니다.",
    },
    rationale: {
      short: "데이터 중심 웹의 반복 기능을 공통 규약으로 구성할 때 유용합니다.",
      problem:
        "사용자·모델·관리·폼·보호 기능을 매번 조합하면 기본 구현과 유지 비용이 커집니다.",
      change: "프레임워크의 모델·요청·관리 규약 안에서 기능을 연결합니다.",
      decisions: [
        {
          gainTitle: "공통 기능 활용",
          gain: "ORM·인증·관리 도구를 함께 사용합니다.",
          costTitle: "규약 학습",
          cost: "모델·질의·요청 수명과 확장 방식을 알아야 합니다.",
        },
        {
          gainTitle: "데이터 접근 표현",
          gain: "모델과 QuerySet으로 질의를 조합합니다.",
          costTitle: "DB 비용과 경쟁",
          cost: "질의 수·인덱스·트랜잭션·권한은 직접 설계합니다.",
        },
      ],
      ask: "모델·인증·관리 기능이 서비스의 큰 부분인가요?",
      simpler:
        "작은 API는 FastAPI 등과 비교하고 Django의 공통 기능이 필요한지 확인하세요.",
    },
    related: ["python", "fastapi", "postgresql"],
    aliases: ["장고", "Django framework"],
    image: "django",
    sources: [
      [
        "Django · transactions.txt",
        "https://github.com/django/django/blob/main/docs/topics/db/transactions.txt",
        "Django 공식 문서의 atomic 트랜잭션과 ORM 질의 최적화.",
      ],
      [
        "Django · optimization.txt",
        "https://github.com/django/django/blob/main/docs/topics/db/optimization.txt",
        "Django 공식 문서의 atomic 트랜잭션과 ORM 질의 최적화.",
      ],
      [
        "Django 공식 문서 · 추가 읽기",
        "https://docs.djangoproject.com/en/stable/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/django/django-plain.svg",
    logoAlt: "Django 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "fastapi",
    name: "FastAPI",
    provider: "FastAPI 프로젝트 · Sebastián Ramírez와 기여자",
    category: "backend",
    type: "타입 기반 Python API 프레임워크",
    summary:
      "Python 타입 표기와 검증 모델을 이용해 API 입력·의존성·문서를 구성하는 프레임워크입니다.",
    definition:
      "FastAPI는 ASGI 기반 요청 처리에 타입 표기와 Pydantic 검증·의존성 도구를 연결합니다. async def와 일반 def의 실행 조건, 동기 라이브러리와 비동기 라이브러리의 차이를 이해해야 합니다. 입력 검증과 API 문서 생성이 인증·업무 권한·DB 원자성을 대신하지는 않습니다.",
    useCases: [
      [
        "입력 계약이 있는 API",
        "경로·쿼리·본문의 형식과 오류 응답·API 문서를 일관되게 구성합니다.",
      ],
      [
        "비동기 입출력 연결",
        "지원되는 클라이언트의 await 경로와 요청별 자원 수명을 연결합니다.",
      ],
    ],
    concepts: [
      [
        "타입과 실제 입력 검증",
        "Pydantic 모델·제약으로 요청을 검증합니다. 임의 Python 함수의 모든 타입 표기가 자동 검증되는 것은 아닙니다.",
      ],
      [
        "async와 블로킹",
        "비동기 함수 안의 동기 DB·파일·CPU 작업은 이벤트 루프를 막을 수 있습니다.",
      ],
      [
        "의존성과 요청 수명",
        "인증·세션·클라이언트를 의존성으로 연결하고 생성·정리 범위를 정합니다.",
      ],
    ],
    flow: [
      ["입력·의존성 확인", "경로·본문과 요청별 의존성을 구성합니다."],
      [
        "처리 함수 실행",
        "동기·비동기 라이브러리의 실행 모델에 맞춰 처리합니다.",
      ],
      ["응답·자원 정리", "응답을 직렬화하고 요청 자원을 정리합니다."],
    ],
    points: [
      [
        "인증과 권한을 구분",
        "유효한 입력과 인증된 주체, 특정 데이터에 대한 권한을 별도 단계로 검사합니다.",
      ],
      [
        "CPU 작업 분리",
        "모델 추론·압축 같은 긴 계산은 워커·프로세스와 용량 계획을 검토합니다.",
      ],
      [
        "세션·풀 수명 관리",
        "요청마다 연결을 무한 생성하거나 전역 요청 상태를 공유하지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "async API인데 동시 요청이 막힘",
        "동기 클라이언트·큰 계산·풀의 적체와 이벤트 루프 지연을 확인합니다.",
      ],
      [
        "문서에는 타입이 맞는데 업무상 잘못된 요청 허용",
        "형식 검증과 권한·재고·동시성 등 업무 검증을 구분합니다.",
      ],
    ],
    example: {
      title: "본문 제약으로 API 입력 검증",
      description:
        "FastAPI와 Pydantic을 설치한 앱의 예이며 ASGI 서버 실행은 별도입니다.",
      language: "Python",
      code: 'from fastapi import FastAPI\nfrom pydantic import BaseModel, Field\n\napp = FastAPI()\nclass Item(BaseModel):\n    title: str = Field(min_length=1, max_length=120)\n    quantity: int = Field(ge=1, le=100)\n\n@app.post("/items")\nasync def create_item(item: Item):\n    return {"title": item.title, "quantity": item.quantity}',
      note: "입력 형식만 검증하며 실제 저장·인증·재고 처리·멱등성은 구현하지 않습니다.",
    },
    rationale: {
      short: "API의 입력 계약·검증·의존성·문서를 함께 관리할 때 유용합니다.",
      problem:
        "각 경로의 입력 검사와 문서를 따로 작성하면 실제 동작과 계약이 어긋나기 쉽습니다.",
      change: "타입과 검증 모델을 API 경계에 연결합니다.",
      decisions: [
        {
          gainTitle: "입력과 문서 연결",
          gain: "모델·제약으로 요청 계약을 표현합니다.",
          costTitle: "업무 검증 별도",
          cost: "권한·동시 변경·외부 데이터는 직접 검증합니다.",
        },
        {
          gainTitle: "비동기 입출력 조합",
          gain: "ASGI와 await 경로를 활용합니다.",
          costTitle: "블로킹 경계",
          cost: "동기 호출·CPU 작업·자원 풀을 관리합니다.",
        },
      ],
      ask: "API 계약과 비동기 입출력이 핵심 요구인가요?",
      simpler:
        "관리 화면·인증·ORM이 큰 부분이면 Django와 공통 기능을 비교하세요.",
    },
    related: ["python", "django", "postgresql"],
    aliases: ["패스트API", "패스트에이피아이", "Fast API"],
    image: "fastapi",
    sources: [
      [
        "FastAPI · Concurrency and async / await { #concurrency-and-async-await }",
        "https://github.com/fastapi/fastapi/blob/master/docs/en/docs/async.md",
        "FastAPI 공식 문서의 async/await 실행 모델과 의존성 구성.",
      ],
      [
        "FastAPI · Dependencies { #dependencies }",
        "https://github.com/fastapi/fastapi/blob/master/docs/en/docs/tutorial/dependencies/index.md",
        "FastAPI 공식 문서의 async/await 실행 모델과 의존성 구성.",
      ],
      [
        "FastAPI 공식 문서 · 추가 읽기",
        "https://fastapi.tiangolo.com/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/fastapi/fastapi-original.svg",
    logoAlt: "FastAPI 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "express",
    name: "Express",
    provider: "OpenJS Foundation · Express 커뮤니티",
    category: "backend",
    type: "Node.js 웹 프레임워크",
    summary:
      "Node.js에서 라우트와 미들웨어를 연결해 HTTP API와 웹 서버 로직을 만드는 프레임워크입니다.",
    definition:
      "Express는 요청·응답 객체와 순서가 있는 미들웨어·라우팅을 제공합니다. 인증·검증·DB·프로젝트 구조는 필요한 도구를 선택해 조합합니다. Node의 이벤트 루프 위에서 동작하므로 긴 동기 작업은 다른 요청에도 영향을 줄 수 있고 오류 처리 규칙은 Express 버전에 맞춰 확인해야 합니다.",
    useCases: [
      [
        "작은 API와 서버 경계",
        "라우트별 입력·업무 로직·응답을 직접 조합합니다.",
      ],
      [
        "기존 Node 서버 확장",
        "로깅·인증·정적 파일·오류 처리를 미들웨어로 연결합니다.",
      ],
    ],
    concepts: [
      [
        "미들웨어 순서",
        "본문 파싱·인증·라우트·오류 처리의 등록 순서가 결과에 영향을 줍니다.",
      ],
      [
        "next와 응답 종료",
        "다음 처리로 넘기기와 응답을 끝내는 일을 구분합니다. 이미 보낸 응답에 다시 쓰지 않습니다.",
      ],
      [
        "비동기 오류",
        "Promise 거부 전달은 버전별 동작을 확인합니다. 오류 미들웨어는 네 인수를 가진 규약을 사용합니다.",
      ],
    ],
    flow: [
      ["미들웨어 실행", "등록 순서에 따라 입력·인증 등을 처리합니다."],
      ["라우트 처리", "업무 함수와 저장·외부 API를 연결합니다."],
      ["응답 또는 오류 전달", "응답을 끝내거나 오류 미들웨어로 넘깁니다."],
    ],
    points: [
      [
        "오류 처리 경로 일관화",
        "동기 예외·Promise·콜백 오류를 같은 정책으로 연결합니다.",
      ],
      [
        "입력·출력 경계 직접 설계",
        "본문 크기·형식·권한·반환 오류의 정보 노출을 확인합니다.",
      ],
      [
        "프록시 신뢰 범위 명시",
        "앞단 프록시의 존재와 신뢰할 주소·헤더를 검토하고 임의 전달 헤더를 권한 근거로 쓰지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "일부 요청이 계속 대기",
        "응답 종료나 next 호출이 누락된 분기를 확인합니다.",
      ],
      [
        "헤더를 이미 보냈다는 오류",
        "응답 뒤 실행을 계속하거나 여러 비동기 경로가 동시에 응답하는지 확인합니다.",
      ],
    ],
    example: {
      title: "라우트 오류를 공통 처리기로 전달",
      description:
        "Express 앱 예제이며 읽기 함수는 실제 저장 계층에서 구현해야 합니다.",
      language: "JavaScript",
      code: "import express from 'express';\nconst app = express();\napp.get('/items/:id', async (req, res, next) => {\n  try {\n    const item = await loadItem(req.params.id);\n    if (!item) return res.status(404).json({ error: 'not_found' });\n    res.json(item);\n  } catch (error) { next(error); }\n});\napp.use((error, req, res, next) => {\n  if (res.headersSent) return next(error);\n  res.status(500).json({ error: 'internal_error' });\n});",
      note: "loadItem·인증·입력 검증·서버 시작은 별도입니다. 학습용 응답이며 내부 오류 내용을 그대로 외부에 노출하지 않습니다.",
    },
    rationale: {
      short:
        "Node HTTP 처리에 필요한 라우트와 미들웨어를 직접 조합할 때 유용합니다.",
      problem:
        "기본 HTTP 서버만으로는 공통 요청 처리·경로·오류 규약을 반복 작성하게 됩니다.",
      change: "미들웨어의 순서와 라우트로 처리 파이프라인을 구성합니다.",
      decisions: [
        {
          gainTitle: "작은 구성 단위",
          gain: "필요한 미들웨어·DB 도구를 선택합니다.",
          costTitle: "팀 규칙 필요",
          cost: "검증·인증·폴더 구조·오류 규약을 직접 정합니다.",
        },
        {
          gainTitle: "Node 생태계 연결",
          gain: "기존 JavaScript 라이브러리를 활용합니다.",
          costTitle: "실행 모델 이해",
          cost: "이벤트 루프·비동기 오류·요청 수명을 관리합니다.",
        },
      ],
      ask: "가벼운 조합과 직접 정할 규약의 균형이 팀에 맞나요?",
      simpler:
        "기본 HTTP 서버로 가능한 작은 도구인지, NestJS 같은 공통 구조가 필요한지 비교하세요.",
    },
    related: ["nodejs", "nestjs", "fastapi"],
    aliases: ["익스프레스", "Express.js", "ExpressJS"],
    image: "express",
    sources: [
      [
        "Express · application.js",
        "https://github.com/expressjs/express/blob/master/lib/application.js",
        "Express 공식 저장소의 애플리케이션·미들웨어 처리 구현과 프로젝트 안내. 오류·Promise의 지원은 실제 버전을 확인합니다.",
      ],
      [
        "Express · Readme.md",
        "https://github.com/expressjs/express/blob/master/Readme.md",
        "Express 공식 저장소의 애플리케이션·미들웨어 처리 구현과 프로젝트 안내. 오류·Promise의 지원은 실제 버전을 확인합니다.",
      ],
      [
        "Express 공식 문서 · 추가 읽기",
        "https://expressjs.com/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/express/express-original.svg",
    logoAlt: "Express 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "nestjs",
    name: "NestJS",
    provider: "NestJS 프로젝트 · Nest 기여자",
    category: "backend",
    type: "모듈·DI 기반 Node.js 프레임워크",
    summary:
      "모듈·컨트롤러·의존성 주입과 처리 단계 규약으로 Node.js 서버를 구성하는 프레임워크입니다.",
    definition:
      "NestJS는 TypeScript 중심의 서버 구조와 의존성 주입 컨테이너를 제공합니다. Express·Fastify 같은 HTTP 어댑터와 실제 전송 계층을 구분하며 컨트롤러·provider·guard·pipe·interceptor의 역할을 나눕니다. TypeScript 타입 선언만으로 요청의 런타임 검증이 생기지는 않습니다.",
    useCases: [
      [
        "여러 기능의 업무 API",
        "도메인 모듈·컨트롤러·서비스의 책임과 의존성을 공통 규약으로 구성합니다.",
      ],
      [
        "교차 기능의 일관화",
        "검증·인증·권한·로깅·오류 응답을 정해진 요청 처리 단계에 연결합니다.",
      ],
    ],
    concepts: [
      [
        "모듈과 provider",
        "등록·내보내기·가져오기 관계로 의존성을 해결합니다. provider의 생성 범위와 공유 상태를 확인합니다.",
      ],
      [
        "guard·pipe·interceptor",
        "접근 결정·입력 변환/검증·처리 전후 로직은 다른 역할입니다.",
      ],
      [
        "타입과 런타임 검증",
        "interface는 실행 중 사라집니다. 실제 요청 검증에 필요한 DTO·pipe·라이브러리를 구성합니다.",
      ],
    ],
    flow: [
      ["모듈·의존성 구성", "필요한 provider와 어댑터를 초기화합니다."],
      ["요청 단계 실행", "권한·검증과 컨트롤러·서비스 호출을 연결합니다."],
      ["응답·예외 처리", "반환값·예외를 어댑터의 응답으로 매핑합니다."],
    ],
    points: [
      [
        "singleton에 요청별 값을 두지 않기",
        "현재 사용자·요청 상태가 다른 호출에 섞이지 않게 합니다.",
      ],
      [
        "순환 의존성 줄이기",
        "forwardRef로만 덮기보다 모듈 책임과 공유 계약을 재검토합니다.",
      ],
      [
        "어댑터별 동작 확인",
        "직접 Express 응답 객체를 다루면 이식성과 공통 처리 규약에 어떤 영향이 있는지 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "의존성을 해결할 수 없다는 시작 오류",
        "provider 등록·export·import·주입 토큰·순환 관계를 확인합니다.",
      ],
      [
        "DTO 타입을 썼는데 잘못된 입력 통과",
        "런타임 검증 pipe와 실제 검증 규칙이 등록됐는지 확인합니다.",
      ],
    ],
    example: {
      title: "provider와 컨트롤러 연결",
      description:
        "Nest 프로젝트의 예입니다. 아래 클래스를 모듈의 providers·controllers에 등록해야 합니다.",
      language: "TypeScript",
      code: "import { Controller, Get, Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class StatusService {\n  read() { return { ready: true }; }\n}\n@Controller('status')\nexport class StatusController {\n  constructor(private readonly status: StatusService) {}\n  @Get()\n  read() { return this.status.read(); }\n}",
      note: "ready는 학습용 고정 값이며 DB·외부 서비스 상태를 확인한 readiness가 아닙니다. 모듈·부트스트랩·운영 검사는 별도입니다.",
    },
    rationale: {
      short:
        "여러 Node 서비스 기능의 구조와 의존성·처리 규약을 맞출 때 유용합니다.",
      problem:
        "미들웨어와 파일 구조를 팀마다 다르게 조합하면 권한·검증·오류 처리가 흩어집니다.",
      change: "모듈·DI·요청 처리 단계로 책임을 나눕니다.",
      decisions: [
        {
          gainTitle: "공통 서버 구조",
          gain: "컨트롤러·서비스와 교차 기능의 위치를 정합니다.",
          costTitle: "추상화 학습",
          cost: "DI·데코레이터·모듈·처리 순서를 이해해야 합니다.",
        },
        {
          gainTitle: "의존성 교체",
          gain: "토큰과 provider로 구성·테스트 경계를 만듭니다.",
          costTitle: "수명과 순환",
          cost: "공유 상태·요청 범위·순환 의존성을 관리합니다.",
        },
      ],
      ask: "팀 규모와 도메인 수가 공통 구조의 비용을 정당화하나요?",
      simpler:
        "작은 API는 Express·기본 서버로 시작하고 필요한 규칙이 늘 때 비교할 수 있습니다.",
    },
    related: ["typescript", "nodejs", "express"],
    aliases: ["네스트", "Nest", "Nest.js", "네스트JS"],
    image: "nestjs",
    sources: [
      [
        "NestJS · components.md",
        "https://github.com/nestjs/docs.nestjs.com/blob/master/content/components.md",
        "Nest 공식 문서의 provider·주입·수명과 pipe의 변환·검증 역할.",
      ],
      [
        "NestJS · pipes.md",
        "https://github.com/nestjs/docs.nestjs.com/blob/master/content/pipes.md",
        "Nest 공식 문서의 provider·주입·수명과 pipe의 변환·검증 역할.",
      ],
      [
        "NestJS 공식 문서 · 추가 읽기",
        "https://docs.nestjs.com/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/nestjs/nestjs-original.svg",
    logoAlt: "NestJS 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "laravel",
    name: "Laravel",
    provider: "Laravel · Laravel 커뮤니티",
    category: "backend",
    type: "PHP 웹 애플리케이션 프레임워크",
    summary:
      "라우팅·컨테이너·ORM·큐와 웹 앱의 공통 기능을 연결하는 PHP 프레임워크입니다.",
    definition:
      "Laravel은 PHP 앱의 요청 처리·Eloquent 모델·설정·작업 큐 등의 규약을 제공합니다. DB 트랜잭션과 큐 발행·소비는 서로 다른 성공 경계입니다. 요청 수명과 장시간 실행하는 워커의 상태·재시작·중복 처리를 함께 설계해야 합니다.",
    useCases: [
      [
        "데이터 중심 웹·API",
        "사용자·권한·모델·메일·작업을 프레임워크 규약으로 구성합니다.",
      ],
      [
        "후속 작업 분리",
        "느린 메일·외부 연동을 큐 워커에 맡기되 접수와 완료를 별도 상태로 표시합니다.",
      ],
    ],
    concepts: [
      [
        "컨테이너·미들웨어",
        "서비스와 의존성을 연결하고 요청 처리 순서를 정합니다.",
      ],
      [
        "Eloquent와 질의",
        "모델의 지연 조회·관계·일괄 처리와 실제 DB 질의의 비용을 구분합니다.",
      ],
      [
        "트랜잭션·afterCommit·큐",
        "커밋 후 발행 옵션은 작업이 미커밋 자료를 읽는 문제를 줄입니다. DB와 브로커의 원자적 이중 쓰기를 자동 보장하지 않습니다.",
      ],
    ],
    flow: [
      ["요청·입력 확인", "라우트·미들웨어·권한·검증을 실행합니다."],
      ["모델·업무 변경", "트랜잭션과 필요한 질의를 실행합니다."],
      ["응답과 후속 작업", "커밋·큐 발행·워커 완료를 구분합니다."],
    ],
    points: [
      [
        "재전달에 안전한 작업",
        "큐 작업이 다시 실행될 수 있어 고유 업무 키·외부 부수 효과의 중복을 설계합니다.",
      ],
      [
        "워커 코드·설정 갱신",
        "장기 워커가 배포 전 코드·설정을 계속 사용하지 않도록 교체 정책을 둡니다.",
      ],
      [
        "모델 조회·권한 확인",
        "N+1과 일괄 수정·대량 할당의 허용 필드, 객체별 권한을 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "큐 작업에서 방금 만든 행이 안 보임",
        "트랜잭션 커밋과 dispatch 시점·큐 연결의 after_commit 설정을 확인합니다.",
      ],
      [
        "배포 뒤 워커만 예전 코드로 실행",
        "워커 수명·재시작과 설정 캐시·프로세스 교체를 확인합니다.",
      ],
    ],
    example: {
      title: "커밋 후 후속 작업 발행",
      description:
        "Laravel 프로젝트에서 Order 모델과 SendReceipt 작업이 정의됐다는 가정입니다.",
      language: "PHP",
      code: "DB::transaction(function () use ($input) {\n    $order = Order::create($input);\n    SendReceipt::dispatch($order->id)->afterCommit();\n});",
      note: "허용 필드·검증·권한과 작업의 멱등성은 별도입니다. 커밋 직후 발행 실패까지 원자적으로 해결하는 outbox 구현은 아닙니다.",
    },
    rationale: {
      short:
        "PHP 웹의 공통 기능과 큐·데이터 모델을 공통 규약으로 연결할 때 유용합니다.",
      problem:
        "인증·라우팅·모델·메일·후속 작업을 매번 조합하면 작업의 수명과 규칙이 흩어집니다.",
      change: "컨테이너·모델·작업 도구로 요청과 후속 처리를 조직합니다.",
      decisions: [
        {
          gainTitle: "웹 생태계 통합",
          gain: "공통 웹·ORM·작업 기능을 함께 사용합니다.",
          costTitle: "규약과 조회 비용",
          cost: "프레임워크 수명·모델 동작·질의를 이해해야 합니다.",
        },
        {
          gainTitle: "후속 작업 분리",
          gain: "응답 뒤 별도 워커에서 처리할 수 있습니다.",
          costTitle: "큐 운영",
          cost: "커밋 순서·재전달·워커 교체와 실패 복구를 설계합니다.",
        },
      ],
      ask: "공통 웹 기능과 큐 작업의 운영 요구가 Laravel 모델에 맞나요?",
      simpler:
        "작은 PHP API는 단순 라우팅부터 시작하고 필요한 공통 기능이 늘 때 비교하세요.",
    },
    related: ["php", "mysql", "rabbitmq", "rails"],
    aliases: ["라라벨", "Laravel framework"],
    image: "laravel",
    sources: [
      [
        "Laravel · Queues",
        "https://github.com/laravel/docs/blob/12.x/queues.md",
        "Laravel 12.x 공식 보존 문서의 DB 트랜잭션과 큐·커밋 후 발행. 현재 기본 설정은 대상 버전에서 확인합니다.",
      ],
      [
        "Laravel · Database: Getting Started",
        "https://github.com/laravel/docs/blob/12.x/database.md",
        "Laravel 12.x 공식 보존 문서의 DB 트랜잭션과 큐·커밋 후 발행. 현재 기본 설정은 대상 버전에서 확인합니다.",
      ],
      [
        "Laravel 공식 문서 · 추가 읽기",
        "https://laravel.com/docs",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/laravel/laravel-original.svg",
    logoAlt: "Laravel 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "rails",
    name: "Ruby on Rails",
    provider: "Rails Core Team · Rails 커뮤니티",
    category: "backend",
    type: "Ruby 웹 애플리케이션 프레임워크",
    summary:
      "MVC·ORM·라우팅·작업 도구를 관례로 연결해 데이터 중심 웹 앱을 만드는 프레임워크입니다.",
    definition:
      "Rails는 Ruby 위에서 모델·컨트롤러·뷰와 DB·작업 등의 규약을 제공합니다. Active Record의 관계와 지연 질의, 콜백·트랜잭션·작업 발행의 시점을 이해해야 합니다. 관례가 데이터 권한·외부 부수 효과·실패 복구의 설계를 대신하지는 않습니다.",
    useCases: [
      [
        "업무 웹과 제품 API",
        "모델 관계·관리·사용자 기능을 웹 흐름과 연결합니다.",
      ],
      [
        "배치·후속 작업",
        "Active Job과 실제 큐 어댑터를 조합해 느린 처리를 분리합니다.",
      ],
    ],
    concepts: [
      [
        "MVC와 관례",
        "파일·클래스·경로의 이름 규칙으로 연결합니다. 명시되지 않은 동작도 실제 실행 경로를 확인할 수 있어야 합니다.",
      ],
      [
        "Active Record relation",
        "질의 객체와 실행 시점·연관 객체 로딩을 구분합니다. includes·preload·eager_load는 실행 질의가 다를 수 있습니다.",
      ],
      [
        "콜백·커밋·작업 수명",
        "DB 커밋과 콜백·큐 작업의 발행을 구분하고 어댑터·버전의 실제 동작을 확인합니다.",
      ],
    ],
    flow: [
      ["요청과 컨트롤러", "라우트·입력·권한을 확인합니다."],
      ["모델·DB 처리", "관계 질의·트랜잭션으로 업무 데이터를 다룹니다."],
      ["응답·커밋 후 작업", "뷰·API 응답과 별도 작업 완료를 연결합니다."],
    ],
    points: [
      [
        "질의 수와 반환량 점검",
        "목록에서 관계를 읽을 때 실제 SQL·인덱스와 조회량을 확인합니다.",
      ],
      [
        "업무 규칙을 콜백에 숨기지 않기",
        "콜백 연쇄·외부 호출·트랜잭션 경계를 추적 가능하게 만듭니다.",
      ],
      [
        "큐의 실제 어댑터 확인",
        "작업 API와 저장·재시도·실행 보장은 큐 어댑터의 설정까지 봐야 합니다.",
      ],
    ],
    diagnostics: [
      [
        "목록 응답이 데이터 수와 함께 느려짐",
        "연관 객체의 N+1·정렬·페이지네이션·실제 SQL을 확인합니다.",
      ],
      [
        "작업이 중복되거나 저장 전 실행",
        "커밋 경계·큐 어댑터·재시도와 업무 키의 중복 처리를 확인합니다.",
      ],
    ],
    example: {
      title: "연관 데이터를 미리 읽는 목록",
      description: "Post 모델이 author와 연결된 Rails 프로젝트 예제입니다.",
      language: "Ruby",
      code: 'posts = Post.preload(:author)\n            .order(created_at: :desc)\n            .limit(20)\nposts.each do |post|\n  puts "#{post.id}: #{post.author.name}"\nend',
      note: "모델·DB·권한 조건은 별도입니다. 관계의 선택성과 질의량을 보고 실제 SQL을 확인해야 합니다.",
    },
    rationale: {
      short:
        "데이터 중심 제품의 반복 웹 기능을 관례와 도구로 빠르게 연결할 때 유용합니다.",
      problem:
        "모델·경로·폼·후속 작업을 수동으로 연결하면 반복 코드와 규칙 편차가 늘어납니다.",
      change: "Rails의 관례와 ORM·작업 도구로 실행 경로를 구성합니다.",
      decisions: [
        {
          gainTitle: "관례 기반 구성",
          gain: "웹의 공통 요소를 일관되게 연결합니다.",
          costTitle: "암묵 동작 이해",
          cost: "콜백·질의·설정의 실제 실행을 알아야 합니다.",
        },
        {
          gainTitle: "Ruby 생태계",
          gain: "라이브러리와 모델·작업 도구를 활용합니다.",
          costTitle: "운영 비용",
          cost: "질의·워커·프로세스 수명과 메모리를 관찰합니다.",
        },
      ],
      ask: "관례와 ORM·작업 도구가 팀과 제품의 요구에 맞나요?",
      simpler:
        "작은 서버는 단순한 구성을 시작점으로 삼고 공통 기능의 필요를 비교할 수 있습니다.",
    },
    related: ["ruby", "django", "laravel", "postgresql"],
    aliases: ["레일즈", "루비 온 레일즈", "Rails", "RoR"],
    image: "rails",
    sources: [
      [
        "Ruby on Rails · active_record_querying.md",
        "https://github.com/rails/rails/blob/main/guides/source/active_record_querying.md",
        "Rails 공식 안내의 Active Record 질의와 Active Job 실행 경계.",
      ],
      [
        "Ruby on Rails · active_job_basics.md",
        "https://github.com/rails/rails/blob/main/guides/source/active_job_basics.md",
        "Rails 공식 안내의 Active Record 질의와 Active Job 실행 경계.",
      ],
      [
        "Ruby on Rails 공식 문서 · 추가 읽기",
        "https://guides.rubyonrails.org/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/rails/rails-original-wordmark.svg",
    logoAlt: "Ruby on Rails 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "aspnetcore",
    name: "ASP.NET Core",
    provider: "Microsoft · .NET 커뮤니티",
    category: "backend",
    type: ".NET 웹 프레임워크",
    summary:
      "미들웨어·라우팅·DI·인증 등의 규약으로 .NET 웹 API와 애플리케이션을 구성하는 프레임워크입니다.",
    definition:
      "ASP.NET Core는 .NET 위에서 요청 파이프라인과 호스팅·의존성 주입·웹 기능을 제공합니다. 미들웨어의 순서와 singleton·scoped·transient 수명을 구분해야 합니다. 비동기 입출력과 취소를 활용하되 DB와 외부 서비스의 실패·권한은 직접 설계합니다.",
    useCases: [
      [
        "타입이 있는 업무 API",
        "Minimal API 또는 컨트롤러로 요청·검증·서비스를 연결합니다.",
      ],
      [
        "공통 서버 운영 규약",
        "인증·설정·로깅·상태 확인과 호스트 종료를 구성합니다.",
      ],
    ],
    concepts: [
      [
        "미들웨어 파이프라인",
        "요청은 등록 순서로, 응답은 앞 단계로 돌아옵니다. 인증·권한·오류 처리 위치가 중요합니다.",
      ],
      [
        "DI 수명",
        "scoped 요청 자원을 singleton이 계속 붙잡지 않게 합니다. 객체 생성과 해제 경계를 확인합니다.",
      ],
      [
        "비동기와 요청 취소",
        "CancellationToken과 비동기 클라이언트를 연결합니다. .Result 같은 동기 대기가 병목을 만들 수 있습니다.",
      ],
    ],
    flow: [
      ["호스트·의존성 초기화", "설정과 수명·미들웨어를 구성합니다."],
      ["요청 파이프라인 실행", "인증·라우팅·처리 함수를 실행합니다."],
      [
        "응답·요청 자원 회수",
        "응답 완료·취소와 scoped 자원 해제를 처리합니다.",
      ],
    ],
    points: [
      [
        "미들웨어 순서 검토",
        "오류·라우팅·인증·권한이 기대한 단계에서 실행되는지 확인합니다.",
      ],
      [
        "요청 객체를 오래 보관하지 않기",
        "HttpContext·scoped 서비스를 장기 백그라운드 작업에 그대로 넘기지 않습니다.",
      ],
      [
        "외부 요청·DB의 시간 제한",
        "비동기로 호출해도 무제한 동시 실행과 풀 적체는 별도 문제입니다.",
      ],
    ],
    diagnostics: [
      [
        "다른 요청의 상태가 섞이거나 dispose 오류",
        "DI 수명과 singleton이 보유한 요청 자원을 확인합니다.",
      ],
      [
        "인증했는데 권한 처리가 기대와 다름",
        "미들웨어 등록 순서·인증 스킴·엔드포인트 권한 정책을 확인합니다.",
      ],
    ],
    example: {
      title: "Minimal API의 경로와 결과",
      description: "ASP.NET Core 웹 프로젝트의 Program.cs 예제입니다.",
      language: "C#",
      code: 'var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\n\napp.MapGet("/items/{id:int}", (int id) => {\n    if (id < 1) return Results.BadRequest();\n    return Results.Ok(new { id, title = "샘플" });\n});\napp.Run();',
      note: "id의 경로 형식과 최소 범위만 확인합니다. 실제 DB·인증·객체별 권한과 운영 서버 설정은 별도입니다.",
    },
    rationale: {
      short:
        ".NET 서버의 요청·DI·인증·운영 기능을 일관되게 구성할 때 유용합니다.",
      problem:
        "기본 HTTP 처리만으로는 서비스 수명·인증·오류 정책을 여러 위치에서 반복 구현하게 됩니다.",
      change: "호스트와 요청 파이프라인의 규약으로 기능을 연결합니다.",
      decisions: [
        {
          gainTitle: "공통 서버 기능",
          gain: "DI·라우팅·인증과 운영 도구를 활용합니다.",
          costTitle: "실행 규약",
          cost: "수명·순서·대상 .NET 버전을 이해해야 합니다.",
        },
        {
          gainTitle: "비동기 요청 처리",
          gain: "입출력과 취소를 요청 경로에 연결합니다.",
          costTitle: "자원 용량 관리",
          cost: "DB·스레드·연결 풀과 긴 작업을 따로 설계합니다.",
        },
      ],
      ask: ".NET 생태계와 배포·운영 경험이 제품에 맞나요?",
      simpler:
        "익숙한 언어의 작은 서버와 비교하며 필요한 통합 기능을 확인하세요.",
    },
    related: ["csharp", "spring-boot", "postgresql"],
    aliases: ["에이에스피닷넷 코어", "ASP NET Core", "ASP.NET", "닷넷 웹"],
    image: "aspnetcore",
    sources: [
      [
        "ASP.NET Core · ASP.NET Core middleware",
        "https://github.com/dotnet/AspNetCore.Docs/blob/main/aspnetcore/fundamentals/middleware/index.md",
        "ASP.NET Core 공식 문서의 미들웨어 순서와 DI의 수명.",
      ],
      [
        "ASP.NET Core · Dependency injection in ASP.NET Core",
        "https://github.com/dotnet/AspNetCore.Docs/blob/main/aspnetcore/fundamentals/dependency-injection.md",
        "ASP.NET Core 공식 문서의 미들웨어 순서와 DI의 수명.",
      ],
      [
        "ASP.NET Core 공식 문서 · 추가 읽기",
        "https://learn.microsoft.com/aspnet/core/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/dotnetcore/dotnetcore-original.svg",
    logoAlt: ".NET Core 계열의 공통 심벌",
    logoNote:
      "Devicon 원본 심벌 · 형상·색상 보존 · MIT · .NET Core 계열의 공통 심벌을 표시합니다. 실제 웹 프레임워크는 ASP.NET Core입니다.",
    logoScope: "brand",
  },
  {
    id: "flutter",
    name: "Flutter",
    provider: "Google · Flutter 커뮤니티",
    category: "mobile",
    type: "멀티플랫폼 UI SDK",
    summary:
      "Dart의 위젯과 렌더링 도구로 여러 플랫폼의 앱 화면과 동작을 구성하는 SDK입니다.",
    definition:
      "Flutter는 위젯·상태·레이아웃·렌더링과 플랫폼 연결 도구를 제공합니다. Widget의 설정과 Element·State의 수명을 구분하고, 플랫폼 플러그인·장치 API·빌드 도구를 대상별로 확인해야 합니다. 코드 공유가 모든 플랫폼의 동작·배포·성능을 같게 만들지는 않습니다.",
    useCases: [
      [
        "여러 플랫폼의 앱 UI",
        "모바일·데스크톱·웹에서 공유할 화면과 플랫폼 전용 동작을 나눕니다.",
      ],
      [
        "직접 구성하는 상호작용 화면",
        "위젯·애니메이션·사용자 입력으로 일관된 앱 경험을 만듭니다.",
      ],
    ],
    concepts: [
      [
        "Widget·Element·State",
        "위젯은 UI의 설정입니다. 트리의 정체성과 key에 따라 상태가 보존되거나 새로 만들어집니다.",
      ],
      [
        "build와 상태 갱신",
        "build는 반복 호출될 수 있습니다. 네트워크 요청·무거운 계산·구독 생성을 무분별하게 넣지 않습니다.",
      ],
      [
        "플랫폼 경계",
        "플러그인·네이티브 호출·권한과 웹·모바일의 실행·렌더 조건을 구분합니다.",
      ],
    ],
    flow: [
      ["상태와 위젯 구성", "입력과 화면의 상태 소유자를 정합니다."],
      ["레이아웃·그리기", "상태 변경에 맞춰 프레임의 UI를 구성합니다."],
      ["플랫폼·자원 정리", "장치 호출·구독·컨트롤러의 수명을 관리합니다."],
    ],
    points: [
      [
        "프레임 시간 관찰",
        "build·레이아웃·그리기·플랫폼 호출과 큰 동기 계산을 나눠 봅니다.",
      ],
      [
        "공유와 전용 기능 구분",
        "플러그인의 대상별 지원·권한·접근성과 장치별 입력을 확인합니다.",
      ],
      [
        "화면 제거 뒤 정리",
        "컨트롤러·구독·비동기 완료가 제거된 상태를 다시 갱신하지 않게 합니다.",
      ],
    ],
    diagnostics: [
      [
        "화면 전환 뒤 setState 관련 오류",
        "State의 mounted 상태·작업 수명과 구독 정리를 확인합니다.",
      ],
      [
        "한 플랫폼만 레이아웃·성능이 나쁨",
        "렌더·글꼴·입력·플러그인과 실제 기기의 프레임 시간을 확인합니다.",
      ],
    ],
    example: {
      title: "상태 변경으로 위젯 갱신",
      description:
        "Flutter 프로젝트의 최소 StatefulWidget 예제입니다. MaterialApp 등 앱의 바깥 구성은 별도입니다.",
      language: "Dart",
      code: "import 'package:flutter/material.dart';\n\nclass Counter extends StatefulWidget {\n  const Counter({super.key});\n  @override\n  State<Counter> createState() => _CounterState();\n}\nclass _CounterState extends State<Counter> {\n  int count = 0;\n  @override\n  Widget build(BuildContext context) => TextButton(\n    onPressed: () => setState(() => count += 1),\n    child: Text('$count'),\n  );\n}",
      note: "네트워크·상태 저장 라이브러리·네이티브 플러그인은 포함하지 않습니다. 대상별 빌드·접근성·실제 기기 검사가 필요합니다.",
    },
    rationale: {
      short:
        "여러 플랫폼에서 화면과 업무 코드를 공유하며 앱을 만들 때 유용합니다.",
      problem:
        "플랫폼마다 비슷한 UI와 로직을 따로 구현하면 변경을 맞추는 비용이 커집니다.",
      change: "위젯과 Dart 코드의 공유 범위와 플랫폼 경계를 함께 구성합니다.",
      decisions: [
        {
          gainTitle: "공유 UI",
          gain: "위젯과 업무 로직을 여러 대상에 재사용합니다.",
          costTitle: "플랫폼 검증",
          cost: "입력·권한·플러그인·접근성은 대상별로 확인합니다.",
        },
        {
          gainTitle: "렌더·상호작용 도구",
          gain: "세밀한 화면과 애니메이션을 구성합니다.",
          costTitle: "프레임·앱 수명",
          cost: "실행 비용과 장치별 UI·자원을 관리합니다.",
        },
      ],
      ask: "공유 UI와 네이티브 장치 기능의 비중이 Flutter에 맞나요?",
      simpler: "한 플랫폼이 중심이면 Swift·Kotlin의 네이티브 UI와 비교하세요.",
    },
    related: ["dart", "react-native", "swift", "kotlin"],
    aliases: ["플러터", "Flutter SDK"],
    image: "flutter",
    sources: [
      [
        "Flutter · Simple app state management",
        "https://github.com/flutter/website/blob/main/sites/docs/src/content/data-and-backend/state-mgmt/simple.md",
        "Flutter 공식 문서의 지역·앱 상태와 프레임·렌더링 성능 점검.",
      ],
      [
        "Flutter · Performance best practices",
        "https://github.com/flutter/website/blob/main/sites/docs/src/content/perf/best-practices.md",
        "Flutter 공식 문서의 지역·앱 상태와 프레임·렌더링 성능 점검.",
      ],
      [
        "Flutter 공식 문서 · 추가 읽기",
        "https://docs.flutter.dev/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/flutter/flutter-original.svg",
    logoAlt: "Flutter 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "react-native",
    name: "React Native",
    provider: "Meta · React Native 커뮤니티",
    category: "mobile",
    type: "React 기반 네이티브 앱 프레임워크",
    summary:
      "React의 컴포넌트 모델로 플랫폼의 네이티브 UI와 앱 기능을 연결하는 프레임워크입니다.",
    definition:
      "React Native는 React 컴포넌트와 네이티브 UI·모듈을 연결합니다. DOM 기반 React 웹 앱과 사용하는 컴포넌트·API·빌드 환경이 다릅니다. JavaScript 작업·네이티브 처리·플랫폼 모듈의 경계와 대상 버전의 아키텍처를 이해해야 합니다.",
    useCases: [
      [
        "모바일 앱의 공유 로직·UI",
        "React·TypeScript 경험을 활용하면서 플랫폼별 화면과 기능을 연결합니다.",
      ],
      [
        "기존 앱과 기능 통합",
        "네이티브 모듈·화면과 연결하되 빌드·권한·브리지 또는 새 아키텍처의 지원을 확인합니다.",
      ],
    ],
    concepts: [
      [
        "네이티브 UI와 React",
        "View·Text 등은 웹 DOM과 다릅니다. CSS·이벤트·접근성의 플랫폼별 규칙을 확인합니다.",
      ],
      [
        "JS와 네이티브 작업",
        "JS의 긴 작업이 상호작용에 영향을 줄 수 있습니다. 네이티브 UI·모듈 호출 비용도 별도로 관찰합니다.",
      ],
      [
        "목록과 정체성",
        "큰 목록은 FlatList 같은 가상화 도구를 활용하고 안정적인 key·아이템 비용을 확인합니다.",
      ],
    ],
    flow: [
      ["컴포넌트·상태 작성", "공유할 로직과 플랫폼별 UI를 구성합니다."],
      ["네이티브 렌더 연결", "플랫폼 화면·입력·모듈과 상태 변경을 연결합니다."],
      [
        "앱 수명·배포 처리",
        "백그라운드 전환·권한·자원과 각 플랫폼 빌드를 관리합니다.",
      ],
    ],
    points: [
      [
        "웹 코드를 그대로 가정하지 않기",
        "DOM·localStorage·CSS 속성과 플랫폼별 네트워크·파일 API를 구분합니다.",
      ],
      [
        "실제 기기에서 프레임·메모리 확인",
        "개발 모드 성능만으로 판단하지 않고 JS·UI·모듈 병목을 나눕니다.",
      ],
      [
        "플랫폼 패키지 호환성",
        "React Native 버전·네이티브 아키텍처·플러그인·OS 지원 범위를 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "스크롤이나 터치 응답이 끊김",
        "JS의 긴 계산·목록 아이템 렌더·이미지 크기와 네이티브 UI 작업을 구분합니다.",
      ],
      [
        "한 플랫폼에서만 모듈이 작동하지 않음",
        "네이티브 패키지 연결·권한·플랫폼 구현·빌드 버전을 확인합니다.",
      ],
    ],
    example: {
      title: "안정적인 키로 네이티브 목록 표시",
      description: "React Native 앱의 컴포넌트 예제입니다.",
      language: "TSX",
      code: "import { FlatList, Text } from 'react-native';\n\nconst items = [{ id: 'a', title: '언어' }, { id: 'b', title: '저장소' }];\nexport function Topics() {\n  return <FlatList\n    data={items}\n    keyExtractor={item => item.id}\n    renderItem={({ item }) => <Text>{item.title}</Text>}\n  />;\n}",
      note: "플랫폼의 앱 프로젝트가 필요합니다. 목록 가상화가 무거운 이미지·업무 계산·모든 메모리 비용을 자동 해결하지는 않습니다.",
    },
    rationale: {
      short:
        "React의 UI 모델과 로직을 활용해 네이티브 앱을 만들 때 유용합니다.",
      problem:
        "플랫폼별 구현을 모두 나누기에는 비용이 크지만 웹 DOM과 다른 장치 UI·기능이 필요할 수 있습니다.",
      change: "공유 컴포넌트·로직과 네이티브 플랫폼 경계를 연결합니다.",
      decisions: [
        {
          gainTitle: "React 경험 활용",
          gain: "컴포넌트·상태와 일부 업무 코드를 공유합니다.",
          costTitle: "플랫폼 차이",
          cost: "웹 API와 다른 UI·장치·빌드를 알아야 합니다.",
        },
        {
          gainTitle: "네이티브 기능 연결",
          gain: "플랫폼 모듈과 UI를 활용합니다.",
          costTitle: "의존성 호환",
          cost: "RN·OS·플러그인 버전과 실제 기기 성능을 관리합니다.",
        },
      ],
      ask: "공유 코드의 이점과 플랫폼 전용 기능의 비중이 균형을 이루나요?",
      simpler:
        "한 플랫폼의 세밀한 경험이 우선이면 Swift·Kotlin과 비교하고 공통 UI는 Flutter도 살펴보세요.",
    },
    related: ["react", "typescript", "flutter", "swift"],
    aliases: ["리액트 네이티브", "ReactNative", "RN"],
    image: "react-native",
    sources: [
      [
        "React Native · Performance Overview",
        "https://github.com/facebook/react-native-website/blob/main/docs/performance.md",
        "React Native 공식 성능 안내. JS·UI 작업과 목록·실제 기기 확인을 구분합니다.",
      ],
      [
        "React Native 공식 문서 · 추가 읽기",
        "https://reactnative.dev/docs/getting-started",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/react/react-original.svg",
    logoAlt: "React 계열의 공통 심벌",
    logoNote:
      "Devicon 원본 심벌 · 형상·색상 보존 · MIT · React 계열의 공통 심벌을 표시합니다. 실제 제품은 React Native입니다.",
    logoScope: "brand",
  },
];
