export const additionalTechnologies = [
  {
    id: "javascript",
    name: "JavaScript",
    provider: "Ecma TC39 · JavaScript 커뮤니티",
    category: "language",
    type: "프로그래밍 언어",
    image: "javascript",
    summary:
      "브라우저와 서버 실행 환경에서 사용자 동작·비동기 요청·애플리케이션 로직을 작성하는 언어입니다.",
    definition:
      "ECMAScript 사양을 바탕으로 동작하는 동적 타입 언어입니다. 브라우저는 DOM·이벤트·웹 API를, Node.js 같은 서버 실행 환경은 파일·네트워크 등의 API를 제공합니다. 언어 자체와 실행 환경이 제공하는 기능을 구분해야 같은 코드가 어디에서 실행될지 알 수 있습니다.",
    useCases: [
      [
        "웹 화면의 상호작용",
        "클릭·입력·서버 응답에 따라 화면 상태를 바꾸고, 비동기 요청의 성공·실패·취소를 처리합니다.",
      ],
      [
        "서버·도구의 공통 언어",
        "Node.js 같은 실행 환경에서 API·자동화 도구를 작성합니다. 브라우저의 document와 서버의 파일 API가 양쪽에 모두 있는 것은 아닙니다.",
      ],
    ],
    concepts: [
      [
        "작업과 마이크로태스크",
        "한 작업의 동기 코드는 끝까지 실행됩니다. Promise 후속 처리는 마이크로태스크로 예약되며, 실행 순서는 호스트의 이벤트 루프와 함께 이해해야 합니다.",
      ],
      [
        "Promise와 async/await",
        "await는 Promise의 결과를 기다리는 코드를 표현합니다. CPU 계산을 다른 스레드로 옮기거나 동기 함수를 비차단으로 바꾸는 문법은 아닙니다.",
      ],
      [
        "값·숫자·객체의 의미",
        "Number는 부동소수점이며 모든 정수를 정확하게 표현하지 않습니다. 큰 식별자·금액의 표현, 객체 참조의 공유와 복사 범위를 설계해야 합니다.",
      ],
    ],
    flow: [
      ["동기 코드 실행", "현재 작업의 상태와 값을 계산합니다."],
      ["외부 작업 요청", "호스트의 네트워크·타이머 API 등에 작업을 맡깁니다."],
      ["후속 처리", "준비된 작업·마이크로태스크에서 결과와 오류를 처리합니다."],
    ],
    points: [
      [
        "오래 걸리는 계산은 화면과 요청 처리를 막음",
        "큰 JSON 처리·정렬·압축을 오래 실행하면 다른 작업도 기다립니다. Web Worker·서버 worker 또는 작업 분할을 검토하고 실제 이벤트 루프 지연을 측정합니다.",
      ],
      [
        "네트워크 실패와 HTTP 오류를 구분",
        "fetch는 응답이 404·500이어도 Promise가 이행될 수 있습니다. response.ok와 본문 해석 오류를 확인하고, 취소·제한 시간을 별도로 연결합니다.",
      ],
      [
        "타입 강제 변환과 정밀도를 경계에서 확인",
        "입력 문자열을 숫자로 바꿀 때 유효 범위를 검사합니다. 큰 정수 ID를 Number로 바꾸기 전에 안전 정수 범위를 확인하고 BigInt의 JSON 처리도 별도로 정합니다.",
      ],
    ],
    diagnostics: [
      [
        "화면이 멈추거나 API 응답이 밀림",
        "긴 동기 작업·반복 마이크로태스크·대형 본문 처리와 이벤트 루프 지연을 확인합니다.",
      ],
      [
        "요청이 실패했는데 성공 화면이 나옴",
        "HTTP 상태 검사·Promise 반환·예외 처리·요청 취소 경로가 실제로 연결됐는지 확인합니다.",
      ],
    ],
    example: {
      title: "HTTP 상태와 요청 취소를 함께 처리",
      description:
        "fetch·AbortController를 제공하는 현대 브라우저에서 실행하는 함수 예입니다.",
      language: "JavaScript",
      code: "async function loadJSON(url) {\n  const controller = new AbortController();\n  const timer = setTimeout(() => controller.abort(), 2000);\n  try {\n    const response = await fetch(url, { signal: controller.signal });\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n    return await response.json();\n  } finally {\n    clearTimeout(timer);\n  }\n}",
      note: "호출자는 오류·취소를 처리해야 합니다. 2초는 학습용 제한 시간이며 재시도·응답 크기·인증 정책은 별도 설계입니다.",
    },
    sources: [
      [
        "MDN 실행 모델 원문",
        "https://github.com/mdn/content/blob/main/files/en-us/web/javascript/reference/execution_model/index.md",
        "확인한 작업·마이크로태스크·run-to-completion과 호스트의 역할.",
      ],
      [
        "MDN Number 원문",
        "https://github.com/mdn/content/blob/main/files/en-us/web/javascript/reference/global_objects/number/index.md",
        "부동소수점과 안전 정수 범위.",
      ],
    ],
    related: ["typescript", "nodejs", "python"],
    aliases: ["자바스크립트", "JS", "ECMAScript"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg",
    logoAlt: "JavaScript 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "typescript",
    name: "TypeScript",
    provider: "Microsoft · TypeScript 커뮤니티",
    category: "language",
    type: "정적 타입을 추가한 언어",
    image: "typescript",
    summary:
      "JavaScript 코드에 타입 검사를 더해 값의 구조와 함수 간 계약을 개발 단계에서 확인합니다.",
    definition:
      "TypeScript는 JavaScript를 기반으로 타입 표현과 정적 검사를 제공하는 언어·도구입니다. 일반적인 빌드에서는 타입 정보가 제거된 JavaScript가 실행됩니다. 컴파일이 성공했다는 사실이 외부 JSON·DB 값·사용자 입력의 런타임 유효성을 보장하지는 않습니다.",
    useCases: [
      [
        "여러 모듈이 공유하는 API 계약",
        "함수 인수·반환값·상태의 가능한 형태를 정의해 변경 영향과 잘못된 조합을 일찍 찾습니다.",
      ],
      [
        "규모가 커지는 웹·서버 코드",
        "브라우저·Node.js 등 JavaScript 실행 환경을 대상으로 편집기·리팩터링·타입 검사 도구를 활용합니다.",
      ],
    ],
    concepts: [
      [
        "타입 소거",
        "인터페이스와 대부분의 타입 주석은 실행 중의 검증 코드로 남지 않습니다. 빌드 도구와 대상 런타임이 지원하는 문법을 함께 확인합니다.",
      ],
      [
        "좁히기와 unknown",
        "unknown 값은 검사 후 사용합니다. typeof·in·사용자 정의 타입 가드로 가능한 형태를 좁히는 것이 any로 검사를 끄는 것과 다릅니다.",
      ],
      [
        "구조적 타입과 엄격한 검사",
        "주로 값의 구조로 호환성을 판단합니다. strict·strictNullChecks와 tsconfig의 target·lib·module 선택이 검사와 출력 환경에 영향을 줍니다.",
      ],
    ],
    flow: [
      ["계약 작성", "자료 구조와 함수의 입출력 타입을 정의합니다."],
      ["개발·빌드 검사", "타입 오류와 null·상태 조합을 검사합니다."],
      ["JavaScript 실행", "런타임은 실제 값과 외부 입력을 별도로 다룹니다."],
    ],
    points: [
      [
        "as 단언을 데이터 검증으로 쓰지 않기",
        "response.json() as User는 User 형태를 검사하지 않습니다. 경계에서 스키마 검사 또는 명시적 검증을 수행한 뒤 내부 타입으로 전달합니다.",
      ],
      [
        "타입 검사와 번들을 분리해 확인",
        "일부 번들러는 타입을 제거하면서 오류 검사를 수행하지 않습니다. 실제 배포 경로에 tsc --noEmit 같은 검사 단계가 있는지 확인합니다.",
      ],
      [
        "개발 환경의 타입과 실제 API를 맞추기",
        "lib에 DOM 타입이 있다고 서버에서 document가 생기지는 않습니다. 의존성의 타입 정의·실제 버전·모듈 해석·런타임 지원을 함께 맞춥니다.",
      ],
    ],
    diagnostics: [
      [
        "컴파일은 통과했는데 undefined 오류",
        "외부 입력·any·타입 단언·검사되지 않은 JSON 경계와 실제 런타임을 확인합니다.",
      ],
      [
        "로컬과 CI의 타입 검사 결과가 다름",
        "TypeScript·타입 패키지 버전·tsconfig 상속·빌드와 검사 명령의 차이를 비교합니다.",
      ],
    ],
    example: {
      title: "외부 값을 검사한 뒤 타입으로 사용",
      description:
        "strict 모드의 TypeScript에서 사용할 수 있는 간단한 타입 가드입니다.",
      language: "TypeScript",
      code: 'type User = { id: string };\nfunction isUser(value: unknown): value is User {\n  return typeof value === "object" && value !== null\n    && "id" in value && typeof value.id === "string";\n}\nfunction readUser(value: unknown): User {\n  if (!isUser(value)) throw new Error("Invalid user");\n  return value;\n}',
      note: "이 검사는 id의 문자열 여부만 확인합니다. 형식·길이·권한·추가 필드 정책은 서비스 계약에 맞춰 더 정의해야 합니다.",
    },
    sources: [
      [
        "TypeScript Handbook · Basics",
        "https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/handbook-v2/Basics.md",
        "확인한 타입 검사·출력 JavaScript와 타입 소거.",
      ],
      [
        "TypeScript Handbook · Narrowing",
        "https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/handbook-v2/Narrowing.md",
        "unknown 값과 제어 흐름·타입 가드.",
      ],
    ],
    related: ["javascript", "nodejs", "java"],
    aliases: ["타입스크립트", "TS"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/typescript/typescript-original.svg",
    logoAlt: "TypeScript 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "python",
    name: "Python",
    provider: "Python Software Foundation · Python 커뮤니티",
    category: "language",
    type: "프로그래밍 언어",
    image: "python",
    summary:
      "웹 서비스·자동화·데이터 처리에서 사용하는 동적 타입의 범용 언어입니다.",
    definition:
      "Python은 읽기 쉬운 문법과 표준 라이브러리·외부 패키지 생태계를 갖춘 언어입니다. CPython은 널리 사용하는 구현 중 하나입니다. 언어 문법, 인터프리터 구현, 가상 환경과 패키지 버전을 구분해야 프로그램의 동작·성능·배포 조건을 재현할 수 있습니다.",
    useCases: [
      [
        "API와 업무 자동화",
        "웹 프레임워크·표준 라이브러리로 요청 처리·파일 변환·배치 작업을 작성합니다.",
      ],
      [
        "데이터·AI 작업 연결",
        "분석·모델·수치 계산 패키지를 활용합니다. Python 코드와 내부 네이티브 라이브러리의 실행 비용·병렬화 특성은 다를 수 있습니다.",
      ],
    ],
    concepts: [
      [
        "인터프리터와 가상 환경",
        "프로젝트별 패키지 환경과 실행 인터프리터를 맞춥니다. pip 명령의 설치 대상과 실제 프로그램을 실행하는 Python이 같은지 확인합니다.",
      ],
      [
        "asyncio의 협력적 실행",
        "코루틴이 대기할 때 다른 작업이 진행할 수 있습니다. 이벤트 루프 안에서 동기 I/O나 긴 계산을 수행하면 그 루프의 다른 작업도 기다립니다.",
      ],
      [
        "GIL과 구현·빌드 조건",
        "GIL이 있는 CPython에서는 Python 바이트코드 실행의 병렬성이 제한됩니다. free-threaded 빌드와 별도 프로세스·네이티브 코드의 실행 모델은 구분해야 합니다.",
      ],
    ],
    flow: [
      ["환경과 입력 준비", "인터프리터·패키지·입력 형식을 확인합니다."],
      ["작업 실행", "일반 함수·코루틴·프로세스에 맞게 일을 나눕니다."],
      ["결과와 오류 처리", "출력·재시도·취소·자원 정리를 연결합니다."],
    ],
    points: [
      [
        "async 함수 안의 동기 호출을 점검",
        "time.sleep·동기 HTTP 클라이언트·파일 처리가 자동으로 비차단이 되지는 않습니다. 해당 작업에 맞는 비동기 API나 제한된 실행 풀을 검토합니다.",
      ],
      [
        "CPU 작업과 I/O 대기를 다르게 측정",
        "스레드 수만 늘려 CPU 계산이 빨라진다고 가정하지 않습니다. GIL·확장 모듈·프로세스 간 전달 비용과 실제 빌드를 확인합니다.",
      ],
      [
        "재현 가능한 패키지와 오류 경계",
        "인터프리터·패키지 버전을 기록하고 의존성을 고정합니다. 파일의 인코딩·외부 입력·예외 종류를 명시해 조용한 데이터 손상을 피합니다.",
      ],
    ],
    diagnostics: [
      [
        "동시 요청 중 일부 작업이 전체를 막음",
        "이벤트 루프의 동기 호출·긴 계산·공유 실행 풀의 포화를 확인합니다.",
      ],
      [
        "서버마다 결과나 import가 다름",
        "실행 Python·가상 환경·설치 패키지·작업 경로·환경 변수를 비교합니다.",
      ],
    ],
    example: {
      title: "동기 파일 작업을 이벤트 루프 밖에서 실행",
      description:
        "asyncio.to_thread를 제공하는 Python에서 실행하는 학습 예입니다.",
      language: "Python",
      code: 'import asyncio\nfrom pathlib import Path\n\nasync def main():\n    text = await asyncio.to_thread(\n        Path("input.txt").read_text, encoding="utf-8"\n    )\n    print(len(text))\n\nif __name__ == "__main__":\n    asyncio.run(main())',
      note: "input.txt가 필요합니다. to_thread는 동기 함수가 루프를 막지 않게 하는 수단이며 CPU 계산의 병렬화나 실행 중인 스레드의 강제 중단을 보장하지 않습니다.",
    },
    sources: [
      [
        "CPython asyncio 작업 문서",
        "https://github.com/python/cpython/blob/main/Doc/library/asyncio-task.rst",
        "확인한 코루틴·to_thread·취소와 이벤트 루프의 조건.",
      ],
      [
        "CPython threading 문서",
        "https://github.com/python/cpython/blob/main/Doc/library/threading.rst",
        "GIL과 free-threaded 빌드의 구분.",
      ],
    ],
    related: ["go", "nodejs", "postgresql"],
    aliases: ["파이썬", "CPython"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/python/python-original.svg",
    logoAlt: "Python 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "go",
    name: "Go",
    provider: "Go 프로젝트",
    category: "language",
    type: "컴파일 언어",
    image: "go",
    summary:
      "고루틴·채널·표준 네트워크 라이브러리로 서버와 운영 도구를 작성하는 언어입니다.",
    definition:
      "Go는 정적 타입과 컴파일, 가비지 컬렉션을 제공하는 언어입니다. 고루틴은 런타임이 스케줄링하는 실행 단위이고 채널·동기화 도구로 작업을 연결할 수 있습니다. 실행 파일로 배포하더라도 외부 파일·인증서·네트워크·시스템 라이브러리 의존성이 사라지는 것은 아닙니다.",
    useCases: [
      [
        "네트워크 API·동시 I/O 서비스",
        "요청마다 필요한 일을 나누고 제한 시간·취소를 전파하는 서버를 구성합니다.",
      ],
      [
        "배포·인프라·CLI 도구",
        "운영 도구와 장기 실행 서비스를 작성하며 표준 라이브러리·빌드 도구를 활용합니다.",
      ],
    ],
    concepts: [
      [
        "고루틴과 스케줄링",
        "고루틴이 OS 스레드와 일대일 대응하는 것은 아닙니다. 많은 작업을 시작할 수 있어도 CPU·메모리·하위 서비스의 용량은 제한됩니다.",
      ],
      [
        "Context",
        "요청의 제한 시간·취소 신호를 호출 경로에 전달합니다. Context를 전달한다고 하위 작업이 자동으로 중단되는 것은 아니며 각 작업이 신호를 처리해야 합니다.",
      ],
      [
        "명시적 오류와 자원 정리",
        "error 반환값을 확인하고 응답 본문·파일 등의 자원을 닫습니다. defer는 함수가 반환될 때 실행되므로 긴 루프 안에 무제한 쌓지 않습니다.",
      ],
    ],
    flow: [
      ["요청 범위 정의", "입력·Context·동시 실행 한도를 정합니다."],
      ["고루틴과 I/O 처리", "작업을 실행하고 취소·오류를 전달합니다."],
      ["결과·자원 정리", "성공 또는 실패를 응답하고 작업과 연결을 정리합니다."],
    ],
    points: [
      [
        "고루틴 수와 하위 시스템 부하를 제한",
        "무제한 fan-out은 고루틴 누수·메모리 증가·DB 연결 포화를 만들 수 있습니다. 작업 큐·세마포어·풀과 취소 전파를 함께 설계합니다.",
      ],
      [
        "HTTP 본문까지 처리 경로에 포함",
        "응답을 받았으면 본문을 닫고 오류 상태도 검사합니다. Client.Timeout·Context·전송 계층 제한 시간의 범위를 구분합니다.",
      ],
      [
        "데이터 레이스를 별도로 확인",
        "고루틴이 공유 값을 동시에 수정하는 코드는 별도 동기화가 필요합니다. 레이스 검사·프로파일과 실제 부하에서 관측한 지연을 함께 봅니다.",
      ],
    ],
    diagnostics: [
      [
        "요청은 끝났는데 고루틴이 늘어남",
        "취소를 받지 않는 작업·닫히지 않은 채널·소비되지 않는 결과와 본문 누수를 확인합니다.",
      ],
      [
        "CPU는 남는데 하위 호출이 밀림",
        "동시 실행 한도·HTTP/DB 연결 풀·요청 제한 시간과 큐 대기를 대조합니다.",
      ],
    ],
    example: {
      title: "요청 제한 시간과 본문 정리",
      description: "표준 라이브러리를 사용하는 Go 프로그램 예입니다.",
      language: "Go",
      code: 'package main\nimport (\n    "context"\n    "fmt"\n    "net/http"\n    "time"\n)\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)\n    defer cancel()\n    req, err := http.NewRequestWithContext(ctx, "GET", "https://example.com", nil)\n    if err != nil { panic(err) }\n    res, err := http.DefaultClient.Do(req)\n    if err != nil { fmt.Println(err); return }\n    defer res.Body.Close()\n    fmt.Println(res.StatusCode)\n}',
      note: "2초는 학습용 값입니다. 운영에서는 HTTP 상태·본문·인증·재시도와 연결 재사용 정책을 별도로 정합니다.",
    },
    sources: [
      [
        "Go Context 공식 소스·설명",
        "https://github.com/golang/go/blob/master/src/context/context.go",
        "확인한 제한 시간·취소 전파와 동시 사용 조건.",
      ],
      [
        "Go HTTP Client 공식 소스·설명",
        "https://github.com/golang/go/blob/master/src/net/http/client.go",
        "Client.Timeout과 응답 본문 정리.",
      ],
    ],
    related: ["nodejs", "java", "rust"],
    aliases: ["고", "골랭", "Golang"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/go/go-original-wordmark.svg",
    logoAlt: "Go 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "java",
    name: "Java",
    provider: "OpenJDK · Java 커뮤니티",
    category: "language",
    type: "JVM 기반 프로그래밍 언어",
    image: "java",
    summary:
      "JVM과 라이브러리 생태계를 활용해 서버·업무 시스템·도구를 작성하는 정적 타입 언어입니다.",
    definition:
      "Java 코드는 보통 클래스 파일로 컴파일되어 JVM에서 실행됩니다. JDK는 컴파일·실행·진단 도구를 제공하고 JVM은 실행·메모리·스레드 등을 관리합니다. Java 언어, JVM 구현, 프레임워크와 Tomcat 같은 컨테이너는 서로 다른 역할입니다.",
    useCases: [
      [
        "업무 API와 트랜잭션 서비스",
        "웹 프레임워크·DB 드라이버·관측 도구를 연결해 장기 운영하는 서버를 구성합니다.",
      ],
      [
        "JVM 라이브러리 활용",
        "동시성·네트워크·메시징 생태계를 활용하고 JDK의 프로파일·덤프 도구로 실행을 관측합니다.",
      ],
    ],
    concepts: [
      [
        "언어·JDK·JVM",
        "소스 문법·컴파일 대상과 실제 실행 JDK 버전을 맞춥니다. JVM 힙만이 프로세스의 전체 메모리는 아닙니다.",
      ],
      [
        "스레드와 가상 스레드",
        "가상 스레드는 JVM이 스케줄링하는 실행 단위로 I/O 대기가 많은 작업에 활용할 수 있습니다. CPU 계산의 처리 능력이나 DB 연결 수를 자동으로 늘려주지는 않습니다.",
      ],
      [
        "객체와 GC·JIT",
        "객체 수명과 참조를 관리하고 실행 경로를 최적화합니다. 워밍업·할당률·GC 정지와 네이티브 메모리를 구분해 관측합니다.",
      ],
    ],
    flow: [
      ["소스와 의존성 컴파일", "사용할 언어 기능과 대상 JDK를 정합니다."],
      ["JVM 실행", "클래스 로딩·스레드·메모리와 실행 최적화를 수행합니다."],
      [
        "요청·오류·자원 관리",
        "응답·예외·연결 정리를 애플리케이션 규칙에 연결합니다.",
      ],
    ],
    points: [
      [
        "힙 설정과 컨테이너 메모리를 함께 맞추기",
        "힙 외에 스레드 스택·클래스 메타데이터·직접 버퍼·네이티브 라이브러리도 메모리를 사용합니다. 컨테이너 제한과 RSS를 함께 봅니다.",
      ],
      [
        "가상 스레드와 자원 한도는 별개",
        "많은 요청을 대기시킬 수 있어도 DB 풀·외부 API·CPU는 제한됩니다. 사용하는 JDK의 스케줄링·블로킹 조건과 하위 자원 제한을 확인합니다.",
      ],
      [
        "자료 구조가 불변처럼 보여도 경계를 검증",
        "record의 구성 요소 참조가 고정되는 것과 그 참조가 가리키는 컬렉션까지 불변인 것은 다릅니다. 외부 입력과 복사·공유 규칙을 명시합니다.",
      ],
    ],
    diagnostics: [
      [
        "평균은 정상인데 p99가 큼",
        "GC·스레드 대기·락·하위 서비스·JIT 워밍업을 분산 추적과 함께 확인합니다.",
      ],
      [
        "힙은 작지만 프로세스가 메모리 제한에 걸림",
        "스레드 수·직접 버퍼·네이티브 영역·메모리 맵과 실제 RSS를 확인합니다.",
      ],
    ],
    example: {
      title: "생성 경계에서 입력 계약을 검증",
      description:
        "Java record를 지원하는 JDK 17 이상에서 컴파일하는 예입니다.",
      language: "Java",
      code: 'public class Main {\n    record UserId(String value) {\n        UserId {\n            if (value == null || value.isBlank()) {\n                throw new IllegalArgumentException("Empty user ID");\n            }\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(new UserId("user-42").value());\n    }\n}',
      note: "Main.java로 저장합니다. 간단한 값 검증이며 인증·권한·DB의 유일성 검사를 대신하지 않습니다.",
    },
    sources: [
      [
        "OpenJDK Thread API 원문",
        "https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/lang/Thread.java",
        "확인한 플랫폼 스레드·가상 스레드와 실행 모델.",
      ],
      [
        "OpenJDK Record API 원문",
        "https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/lang/Record.java",
        "record의 구성 요소와 참조·동등성 계약.",
      ],
    ],
    related: ["tomcat", "go", "postgresql"],
    aliases: ["자바", "JVM", "OpenJDK"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/java/java-original.svg",
    logoAlt: "Java 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "rust",
    name: "Rust",
    provider: "Rust 프로젝트",
    category: "language",
    type: "시스템 프로그래밍 언어",
    image: "rust",
    summary:
      "소유권·빌림·타입 검사로 메모리와 공유 자원의 사용 규칙을 표현하는 컴파일 언어입니다.",
    definition:
      "Rust는 소유권과 빌림 검사로 안전한 코드의 메모리 사용 규칙을 컴파일 단계에서 확인합니다. 일반적인 객체 수명 관리를 추적 GC에 맡기지 않지만, 할당 비용·자원 누수·데드락·운영 중 오류까지 모두 없어지는 것은 아닙니다. unsafe·FFI 경계의 책임도 별도로 관리해야 합니다.",
    useCases: [
      [
        "파일·네트워크·시스템 구성 요소",
        "메모리·실행 비용을 세밀하게 다루는 서버 구성 요소와 도구를 작성합니다.",
      ],
      [
        "오류와 상태를 타입으로 표현",
        "Option·Result·열거형으로 값의 부재·실패·상태 전이를 구분해 호출 경로에서 처리합니다.",
      ],
    ],
    concepts: [
      [
        "소유권·빌림·수명",
        "값을 소유하거나 참조로 빌리는 규칙을 표현합니다. 참조가 유효한 범위를 검사하며 수명 표기가 객체를 오래 살게 만드는 명령은 아닙니다.",
      ],
      [
        "Result와 ?",
        "실패 가능한 작업의 오류를 값으로 전달합니다. ?는 오류를 호출자에게 반환하는 수단이며 자동 재시도가 아닙니다.",
      ],
      [
        "동시성과 비동기 실행",
        "Send는 값을 다른 스레드로 이동할 수 있는 조건, Sync는 공유 참조를 스레드 사이에서 사용할 수 있는 조건을 표현합니다. async Future를 작성해도 실행기 없이 스스로 실행되는 것은 아닙니다.",
      ],
    ],
    flow: [
      ["타입과 소유 규칙 검사", "컴파일러가 값·참조의 사용 조건을 확인합니다."],
      ["작업과 자원 사용", "파일·메모리·네트워크 작업을 수행합니다."],
      ["반환과 정리", "Result로 결과를 전달하고 소유 자원을 정리합니다."],
    ],
    points: [
      [
        "unsafe와 외부 라이브러리의 경계를 기록",
        "안전성 주장이 성립하는 전제와 FFI·unsafe 코드의 검증 책임을 확인합니다. 안전한 Rust 코드만으로 외부 시스템 오류가 없어지지는 않습니다.",
      ],
      [
        "panic과 복구 가능한 오류를 구분",
        "설정·파일·네트워크 실패는 Result로 전달하고 복구 정책을 정합니다. unwrap을 모든 입력 경계에서 사용하지 않습니다.",
      ],
      [
        "비동기 실행기에서도 블로킹 작업을 분리",
        "동기 파일·CPU 작업이 실행기 스레드를 오래 점유하면 다른 작업이 지연됩니다. 실행기와 풀·취소·동시 실행 한도를 함께 설계합니다.",
      ],
    ],
    diagnostics: [
      [
        "빌림 오류를 clone으로만 우회하며 메모리가 늘어남",
        "공유·소유 설계와 실제 복사 크기·자료 수명을 함께 확인합니다.",
      ],
      [
        "안전한 코드인데 서비스가 멈춤",
        "락 순서·블로킹 작업·풀 고갈·상위 오류 처리·외부 호출 제한 시간을 확인합니다.",
      ],
    ],
    example: {
      title: "파일 오류를 호출자에게 전달",
      description: "외부 패키지 없이 실행하는 Rust 프로그램 예입니다.",
      language: "Rust",
      code: 'use std::fs;\nuse std::io;\nfn main() -> io::Result<()> {\n    let text = fs::read_to_string("input.txt")?;\n    println!("{} bytes", text.len());\n    Ok(())\n}',
      note: "input.txt가 필요하며 UTF-8이 아니면 오류가 납니다. String::len은 문자 수가 아닌 바이트 수입니다.",
    },
    sources: [
      [
        "The Rust Book · Ownership",
        "https://github.com/rust-lang/book/blob/main/src/ch04-01-what-is-ownership.md",
        "확인한 소유권·빌림·수명과 정리 원리.",
      ],
      [
        "The Rust Book · Result",
        "https://github.com/rust-lang/book/blob/main/src/ch09-02-recoverable-errors-with-result.md",
        "복구 가능한 오류와 ? 전파.",
      ],
    ],
    related: ["go", "java", "nodejs"],
    aliases: ["러스트"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/rust/rust-original.svg",
    logoAlt: "Rust 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "nodejs",
    name: "Node.js",
    provider: "OpenJS Foundation · Node.js 프로젝트",
    category: "runtime",
    type: "JavaScript 실행 환경",
    image: "nodejs",
    summary:
      "V8과 비동기 I/O를 바탕으로 서버·명령줄에서 JavaScript를 실행하는 환경입니다.",
    definition:
      "Node.js는 JavaScript 언어 자체가 아닌 실행 환경입니다. HTTP·파일·프로세스·모듈 등의 API를 제공하며, 이벤트 루프와 운영체제·libuv의 실행 경로로 여러 I/O 작업을 처리합니다. worker_threads와 별도 프로세스를 사용할 수 있으므로 모든 작업이 하나의 스레드에서만 실행된다고 설명해서는 안 됩니다.",
    useCases: [
      [
        "I/O 중심의 API와 연결 처리",
        "HTTP·DB·외부 API 응답을 기다리는 작업을 처리하고 요청별 제한 시간·취소·관측을 연결합니다.",
      ],
      [
        "CLI·빌드·개발 도구",
        "서버 측 JavaScript와 패키지 생태계로 자동화·변환·배포 도구를 작성합니다.",
      ],
    ],
    concepts: [
      [
        "이벤트 루프와 I/O",
        "동기 JavaScript 실행과 비동기 I/O 완료 처리를 구분합니다. 파일·암호화 등 일부 작업은 별도 풀과도 관련됩니다.",
      ],
      [
        "Worker Threads",
        "CPU를 오래 사용하는 JavaScript 작업을 다른 실행 단위로 옮길 수 있습니다. 일반적인 비동기 I/O에 worker를 하나씩 만드는 것은 별도 비용을 추가할 수 있습니다.",
      ],
      [
        "스트림과 역압력",
        "생산 속도와 소비 속도가 다를 때 버퍼가 무제한 증가하지 않게 흐름을 조절합니다. 응답·파일 전체를 매번 메모리에 모으는 방식과 구분합니다.",
      ],
    ],
    flow: [
      ["요청 이벤트 처리", "입력을 검증하고 필요한 I/O를 시작합니다."],
      [
        "비동기 결과와 스트림",
        "작업 완료·오류·취소와 데이터 흐름을 처리합니다.",
      ],
      ["응답과 정리", "연결·타이머·스트림을 마무리합니다."],
    ],
    points: [
      [
        "async로 긴 CPU 작업을 숨기지 않기",
        "함수에 async를 붙여도 계산은 해당 실행 스레드를 점유합니다. 이벤트 루프 지연과 CPU 프로파일을 보고 작업 분할·worker 풀·별도 서비스를 검토합니다.",
      ],
      [
        "제한 시간의 의미를 확인",
        "HTTP 소켓의 비활성 제한 시간과 요청 전체 제한 시간은 다릅니다. 취소 신호를 실제 하위 작업과 연결하고 본문 크기·재시도를 제한합니다.",
      ],
      [
        "실행 버전과 모듈 형식을 명시",
        "ES modules·CommonJS와 패키지의 해석 조건, 런타임이 제공하는 API 버전을 맞춥니다. 개발 시 타입이 존재하는 것과 API가 실제 실행 가능한 것은 다릅니다.",
      ],
    ],
    diagnostics: [
      [
        "DB가 빠른데 모든 요청이 지연",
        "동기 파일·큰 JSON·CPU 작업·이벤트 루프 지연과 실행 풀 포화를 확인합니다.",
      ],
      [
        "프로세스 메모리가 계속 증가",
        "열린 연결·타이머·리스너·스트림 버퍼·보관 중인 객체를 확인합니다.",
      ],
    ],
    example: {
      title: "응답 상태와 전체 요청 취소 신호",
      description: "Node.js 20 이상에서 .mjs 파일로 실행하는 예입니다.",
      language: "Node.js",
      code: 'const response = await fetch("https://example.com", {\n  signal: AbortSignal.timeout(2000)\n});\nawait response.body?.cancel();\nif (!response.ok) throw new Error(`HTTP ${response.status}`);\nconsole.log(response.status);',
      note: "호출 오류를 처리하는 최상위 정책이 필요합니다. 큰 본문을 읽거나 재시도하는 운영 코드는 별도 범위·크기·시간 예산을 정합니다.",
    },
    sources: [
      [
        "Node.js Worker Threads 공식 문서",
        "https://github.com/nodejs/node/blob/main/doc/api/worker_threads.md",
        "확인한 CPU 작업·I/O와 worker 사용 범위.",
      ],
      [
        "Node.js HTTP API 공식 문서",
        "https://github.com/nodejs/node/blob/main/doc/api/http.md",
        "요청·연결·스트림·timeout의 동작 조건.",
      ],
    ],
    related: ["javascript", "typescript", "go"],
    aliases: ["노드", "노드제이에스", "Node"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original.svg",
    logoAlt: "Node.js 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "tomcat",
    name: "Apache Tomcat",
    provider: "Apache Software Foundation",
    category: "runtime",
    type: "Jakarta Servlet 컨테이너",
    image: "tomcat",
    summary:
      "Java 웹 애플리케이션의 Servlet 요청 처리와 배포·수명주기를 관리하는 서버입니다.",
    definition:
      "Tomcat은 Java 웹 애플리케이션이 HTTP 요청을 받아 Servlet 등으로 처리하도록 실행하는 컨테이너입니다. Java 언어나 JVM 자체, 모든 Jakarta EE 기능을 제공하는 전체 플랫폼과는 범위를 구분합니다. 애플리케이션을 WAR로 배포하거나 다른 제품 안에 내장해 사용할 수 있습니다.",
    useCases: [
      [
        "Java 웹 애플리케이션 실행",
        "URL과 Servlet·필터·리스너를 연결하고 초기화·요청 처리·종료의 수명주기를 관리합니다.",
      ],
      [
        "기존 WAR 서비스 운영",
        "서로 맞는 JDK·Servlet API·라이브러리·설정으로 패키징된 앱을 배포합니다.",
      ],
    ],
    concepts: [
      [
        "Connector와 요청 처리",
        "HTTP·TLS·연결 수·처리 스레드·대기열을 구성합니다. 연결 한도와 실제 애플리케이션 동시 처리 능력은 다른 값입니다.",
      ],
      [
        "웹 애플리케이션과 클래스 로더",
        "앱의 클래스·라이브러리·공유 라이브러리와 배포 범위를 구분합니다. 같은 이름의 서로 다른 버전이 충돌할 수 있습니다.",
      ],
      [
        "Servlet API와 배포 버전",
        "Tomcat 세대에 따라 javax와 jakarta 네임스페이스 및 필요한 JDK가 다릅니다. 앱·프레임워크·컨테이너의 호환 범위를 맞춰야 합니다.",
      ],
    ],
    flow: [
      ["HTTP 연결 수신", "Connector가 연결과 요청을 처리할 준비를 합니다."],
      ["웹 앱·Servlet 연결", "경로·컨텍스트와 앱의 처리 체인을 선택합니다."],
      ["응답·수명주기 관리", "응답을 쓰고 오류·세션·배포 상태를 관리합니다."],
    ],
    points: [
      [
        "스레드 수와 DB 풀을 함께 조정",
        "요청 스레드만 늘리면 DB 연결 대기와 메모리 사용이 커질 수 있습니다. 연결·처리·하위 호출의 큐와 제한 시간을 함께 봅니다.",
      ],
      [
        "배포 호환성과 의존성 중복을 확인",
        "JDK·Servlet API 네임스페이스와 앱 안에 포함한 API·드라이버가 실제 컨테이너와 맞는지 검사합니다.",
      ],
      [
        "프록시 뒤의 원래 요청 정보를 설계",
        "TLS 종료 위치·전달 헤더·원래 클라이언트 주소를 신뢰할 경계를 정합니다. 외부에서 온 헤더를 무조건 신뢰하지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "배포 후 ClassNotFound·NoSuchMethod 오류",
        "JDK·javax/jakarta·클래스 로더·중복 JAR·컨테이너 버전의 조합을 비교합니다.",
      ],
      [
        "요청이 쌓이는데 CPU는 낮음",
        "요청 스레드·DB 풀·외부 API·락·Connector 대기열과 제한 시간을 확인합니다.",
      ],
    ],
    example: {
      title: "WAR가 담는 앱 구성",
      description:
        "실행 명령이 아닌 전형적인 Java 웹 애플리케이션 아카이브 구조입니다.",
      language: "WAR 구조 예",
      code: "app.war\n  WEB-INF/\n    classes/      # application classes\n    lib/          # application dependencies\n    web.xml       # optional, depending on app configuration\n  static/",
      note: "실제 배포 형식과 설정은 앱·컨테이너 버전에 따라 다릅니다. web.xml의 존재만으로 API 호환성과 운영 설정이 보장되지는 않습니다.",
    },
    sources: [
      [
        "Tomcat 공식 소개·구성 원문",
        "https://github.com/apache/tomcat/blob/main/webapps/docs/introduction.xml",
        "확인한 웹 앱·컨테이너·주요 디렉터리와 배포 개념.",
      ],
      [
        "Tomcat HTTP Connector 원문",
        "https://github.com/apache/tomcat/blob/main/webapps/docs/config/http.xml",
        "연결·실행기·스레드·대기와 프록시 설정.",
      ],
    ],
    related: ["java", "nginx", "postgresql"],
    aliases: ["톰캣", "서블릿", "Servlet"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/tomcat/tomcat-original.svg",
    logoAlt: "Apache Tomcat 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    provider: "PostgreSQL Global Development Group",
    category: "database",
    type: "관계형 데이터베이스",
    image: "postgresql",
    summary:
      "SQL·제약 조건·트랜잭션으로 관계형 데이터를 저장하고 질의하는 데이터베이스입니다.",
    definition:
      "PostgreSQL은 행·테이블·인덱스·SQL을 기반으로 데이터를 관리합니다. MVCC로 여러 트랜잭션의 읽기·쓰기를 조정하고, WAL을 이용해 변경의 복구 경로를 구성합니다. 파일 보관 저장소와 달리 데이터의 관계·질의·동시 변경 계약을 데이터베이스가 다룹니다.",
    useCases: [
      [
        "주문·계정·재고 같은 업무 데이터",
        "유일성·참조 무결성·트랜잭션을 사용해 여러 변경의 업무 규칙을 지킵니다.",
      ],
      [
        "검색 조건·집계·관계 질의",
        "적절한 인덱스와 SQL 계획을 이용해 여러 조건·테이블을 질의합니다. 실제 데이터 분포와 실행 계획이 성능을 결정합니다.",
      ],
    ],
    concepts: [
      [
        "MVCC와 격리 수준",
        "MVCC는 행의 여러 버전을 이용해 트랜잭션에 보이는 데이터를 구분하는 방식입니다. Read Committed·Repeatable Read·Serializable은 같은 스냅샷·동시 변경 보장을 주지 않으며, 선택한 격리 수준에 따라 충돌 후 트랜잭션 전체를 재시도해야 할 수 있습니다.",
      ],
      [
        "인덱스와 실행 계획",
        "인덱스는 읽기를 돕지만 쓰기·저장 공간 비용도 가집니다. 조건·정렬·선택도·통계와 EXPLAIN 결과를 연결해서 봅니다.",
      ],
      [
        "WAL과 복구·복제",
        "WAL은 데이터 페이지를 저장하기 전에 변경을 복구할 수 있는 로그를 기록하는 방식입니다. 커밋 응답·로그 flush·데이터 페이지 저장·복제의 시점은 구분해야 합니다. 실제 설정과 복구 절차를 검증하며 WAL이 있다는 사실을 독립된 백업으로 보지 않습니다.",
      ],
    ],
    flow: [
      ["SQL과 트랜잭션 수신", "연결·권한·질의와 트랜잭션 범위를 확인합니다."],
      [
        "계획·가시성·잠금 처리",
        "인덱스·MVCC·필요한 잠금을 사용해 읽고 변경합니다.",
      ],
      [
        "커밋·응답·복구 기록",
        "성공·충돌·오류를 반환하고 변경의 복구 경로를 관리합니다.",
      ],
    ],
    points: [
      [
        "읽고 계산한 뒤 쓰는 경쟁을 피하기",
        "재고를 먼저 읽고 앱에서 빼는 두 단계는 경쟁할 수 있습니다. 조건부 UPDATE·제약·잠금·적절한 격리 수준으로 업무 규칙을 구현합니다.",
      ],
      [
        "긴 트랜잭션과 정리를 관측",
        "오래 열린 트랜잭션은 가시성·잠금·정리 작업에 영향을 줍니다. 연결 풀의 대기·idle in transaction·VACUUM 상태를 확인합니다.",
      ],
      [
        "쿼리 지연과 내구성 조건을 함께 기록",
        "연결 수를 무작정 늘리지 않습니다. 느린 질의·락 대기·I/O·WAL·복제 지연과 커밋 설정을 같은 시간대에서 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "인덱스가 있는데도 질의가 느림",
        "실제 실행 계획·통계·반환 행 수·필터·정렬·락 대기를 확인합니다. EXPLAIN ANALYZE는 질의를 실제 실행합니다.",
      ],
      [
        "재고나 잔액이 경쟁 상황에서 잘못 바뀜",
        "조건부 변경·제약·트랜잭션 경계·격리 수준과 실패 재시도의 멱등성을 확인합니다.",
      ],
    ],
    example: {
      title: "재고 조건을 변경문 안에서 검사",
      description: "미리 만든 inventory 테이블에 적용하는 SQL 조각입니다.",
      language: "PostgreSQL SQL",
      code: "BEGIN;\nUPDATE inventory\nSET stock = stock - 1\nWHERE sku = 'item-42' AND stock >= 1\nRETURNING sku, stock;\nCOMMIT;",
      note: "반환 행이 없으면 재고 부족 또는 대상 부재를 처리해야 합니다. 주문 저장·멱등성·다른 테이블의 변경과 오류 정책은 별도 업무 트랜잭션으로 설계합니다.",
    },
    sources: [
      [
        "PostgreSQL 동시성 제어 원문",
        "https://github.com/postgres/postgres/blob/master/doc/src/sgml/mvcc.sgml",
        "확인한 MVCC·격리 수준·동시 변경과 재시도 조건.",
      ],
      [
        "PostgreSQL WAL 원문",
        "https://github.com/postgres/postgres/blob/master/doc/src/sgml/wal.sgml",
        "WAL·복구·커밋과 내구성 설정의 관계.",
      ],
    ],
    related: ["mysql", "mongodb", "redis"],
    aliases: ["포스트그레", "포스트그레스", "포스트그레SQL", "Postgres"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/postgresql/postgresql-original.svg",
    logoAlt: "PostgreSQL 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "mysql",
    name: "MySQL",
    provider: "Oracle · MySQL 커뮤니티",
    category: "database",
    type: "관계형 데이터베이스",
    image: "mysql",
    summary:
      "SQL과 InnoDB의 트랜잭션·인덱스·동시성 제어를 이용하는 관계형 데이터베이스입니다.",
    definition:
      "MySQL은 SQL 서버이며 저장 엔진에 따라 데이터 처리 특성이 달라집니다. 여기서는 널리 사용하는 InnoDB를 기준으로 설명합니다. InnoDB는 MVCC·행 잠금·인덱스·복구 로그로 동시 변경을 관리합니다. 모든 저장 엔진이 같은 트랜잭션·잠금 보장을 제공하는 것은 아닙니다.",
    useCases: [
      [
        "웹 서비스의 관계형 업무 데이터",
        "계정·주문·상품처럼 제약과 트랜잭션이 필요한 데이터를 저장하고 SQL로 처리합니다.",
      ],
      [
        "인덱스 중심의 조회 서비스",
        "조회 조건과 정렬에 맞춰 인덱스·스키마를 설계하고 연결 풀·복제·백업을 운영합니다.",
      ],
    ],
    concepts: [
      [
        "InnoDB와 MVCC",
        "InnoDB는 변경 이력과 read view로 어떤 행 버전을 볼 수 있는지 판단하고, 필요한 잠금으로 동시 수정을 다룹니다. 실제 격리 수준과 일관 읽기·잠금 읽기의 차이를 확인합니다.",
      ],
      [
        "기본 키와 보조 인덱스",
        "InnoDB의 클러스터 인덱스는 행 데이터를 기본 키 순서의 리프에 보관합니다. 보조 인덱스는 행을 찾을 기본 키 값도 담으므로 기본 키의 크기와 보조 인덱스 수가 저장·쓰기 비용에 영향을 줍니다. 보조 인덱스만으로 질의를 처리하는지 추가 행 조회가 필요한지도 확인합니다.",
      ],
      [
        "복구 로그와 바이너리 로그",
        "InnoDB 복구를 위한 로그와 복제·시점 복구에 사용하는 바이너리 로그의 역할을 구분합니다. 설정과 백업 검증이 함께 필요합니다.",
      ],
    ],
    flow: [
      ["SQL·세션 설정 확인", "연결과 트랜잭션·격리 수준을 적용합니다."],
      ["인덱스·가시성·잠금 처리", "InnoDB가 필요한 행·범위를 읽고 변경합니다."],
      [
        "커밋과 결과 반환",
        "변경 결과와 오류를 반환하고 복구·복제 경로를 관리합니다.",
      ],
    ],
    points: [
      [
        "범위 질의의 잠금을 예상",
        "격리 수준·인덱스·접근 경로에 따라 잠기는 범위가 달라질 수 있습니다. 결과 행이 적다는 사실만으로 잠금 영향이 작다고 단정하지 않습니다.",
      ],
      [
        "데드락과 재시도 단위를 정의",
        "데드락은 발생할 수 있는 동시성 결과입니다. 트랜잭션 전체의 재시도·멱등성과 일관된 잠금 순서를 설계합니다.",
      ],
      [
        "현재 엔진·격리·실행 계획을 확인",
        "다른 DB의 기본값을 그대로 가정하지 않습니다. 실제 테이블 엔진·세션 격리 수준·질의 계획·로그·복제 설정을 기록합니다.",
      ],
    ],
    diagnostics: [
      [
        "UPDATE가 오래 대기하거나 데드락 발생",
        "선행 트랜잭션·인덱스 경로·잠금 범위와 접근 순서를 확인합니다.",
      ],
      [
        "조회는 괜찮은데 쓰기가 급격히 느려짐",
        "인덱스 증가·로그 flush·디스크·복제·커밋 대기와 연결 풀 대기를 비교합니다.",
      ],
    ],
    example: {
      title: "조건부 변경 결과를 확인",
      description: "InnoDB inventory 테이블이 있다는 가정의 SQL 조각입니다.",
      language: "MySQL SQL",
      code: "START TRANSACTION;\nUPDATE inventory\nSET stock = stock - 1\nWHERE sku = 'item-42' AND stock >= 1;\nSELECT ROW_COUNT() AS changed_rows;\nCOMMIT;",
      note: "ROW_COUNT는 해당 UPDATE 직후 확인합니다. 앱은 0행·오류·데드락을 구분해야 하며 주문·결제의 전체 업무 트랜잭션 예제는 아닙니다.",
    },
    sources: [
      [
        "MySQL 8.4 InnoDB MVCC 원문",
        "https://github.com/mysql/mysql-server/blob/8.4/storage/innobase/include/read0read.h",
        "확인한 read view와 버전 가시성 관리.",
      ],
      [
        "MySQL 8.4 InnoDB 잠금 원문",
        "https://github.com/mysql/mysql-server/blob/8.4/storage/innobase/include/lock0lock.h",
        "행·범위 잠금과 동시성 제어 구현.",
      ],
      [
        "MySQL InnoDB 공식 매뉴얼",
        "https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html",
        "격리 수준을 설명하는 추가 읽기 자료.",
      ],
    ],
    related: ["postgresql", "mongodb", "redis"],
    aliases: ["마이SQL", "마이에스큐엘"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/mysql/mysql-original.svg",
    logoAlt: "MySQL 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    provider: "MongoDB, Inc. · MongoDB 커뮤니티",
    category: "database",
    type: "문서형 데이터베이스",
    image: "mongodb",
    summary:
      "BSON 문서와 인덱스·질의·집계로 애플리케이션 데이터를 관리하는 데이터베이스입니다.",
    definition:
      "MongoDB는 관련 데이터를 문서 구조로 모델링하는 데이터베이스입니다. 문서의 유연성이 스키마와 데이터 계약을 설계하지 않아도 된다는 뜻은 아닙니다. 단일 문서 변경의 원자성과 여러 문서의 트랜잭션, 읽기·쓰기 보장과 복제 구성을 구분해서 사용해야 합니다.",
    useCases: [
      [
        "함께 읽고 바꾸는 데이터 묶음",
        "업무에서 함께 사용하는 하위 정보를 한 문서에 포함할지 참조로 나눌지 모델링합니다.",
      ],
      [
        "여러 형태의 자료와 집계",
        "제품 속성·콘텐츠 메타데이터 등을 명시적 검증 규칙·인덱스·집계 파이프라인으로 처리합니다.",
      ],
    ],
    concepts: [
      [
        "문서와 BSON 타입",
        "문서의 구조·타입·크기와 증가 패턴을 설계합니다. 문자열 ID·숫자·날짜를 서로 다른 타입으로 저장하면 질의 의미가 달라집니다.",
      ],
      [
        "단일 문서 원자성",
        "조건과 변경을 한 문서 연산에 연결할 수 있습니다. 여러 문서에 걸친 변경까지 자동으로 하나의 원자적 작업이 되지는 않습니다.",
      ],
      [
        "인덱스·복제·일관성",
        "인덱스가 질의·정렬 경로를 돕고 write concern·read concern·복제 구성이 관측과 실패 조건에 영향을 줍니다.",
      ],
    ],
    flow: [
      ["문서 모델·조건 정의", "저장할 구조·타입·검증과 질의 조건을 정합니다."],
      ["인덱스·변경 처리", "단일 문서 연산 또는 필요한 트랜잭션을 수행합니다."],
      [
        "결과·복제 상태 확인",
        "변경 수·오류와 읽기·쓰기 보장 범위를 확인합니다.",
      ],
    ],
    points: [
      [
        "업무 단위와 문서 경계를 맞추기",
        "늘 함께 바뀌는 데이터를 무조건 분리하거나 큰 배열에 무한히 넣지 않습니다. 접근 패턴·원자적 변경·문서 성장과 참조 규칙을 함께 결정합니다.",
      ],
      [
        "인덱스와 검증은 생략하지 않기",
        "스키마 검증·유일 인덱스·복합 인덱스와 실제 질의 계획을 확인합니다. 유연한 문서 구조가 값의 품질을 자동으로 보장하지 않습니다.",
      ],
      [
        "다중 문서 변경과 재시도를 명시",
        "필요한 트랜잭션의 토폴로지·세션·보장 조건을 확인합니다. 장애·재시도에서 같은 업무가 중복 적용되지 않도록 식별자·조건을 설계합니다.",
      ],
    ],
    diagnostics: [
      [
        "재고가 음수가 되거나 변경이 덮어써짐",
        "조건을 변경문에 포함했는지, 문서 경계·동시 업데이트 연산·결과 수를 확인합니다.",
      ],
      [
        "데이터가 늘자 조회 지연이 커짐",
        "실행 계획·스캔 문서 수·정렬·인덱스 선택과 문서 크기·배열 증가를 확인합니다.",
      ],
    ],
    example: {
      title: "단일 문서의 조건과 변경을 묶기",
      description: "mongosh에서 inventory 컬렉션을 대상으로 실행하는 예입니다.",
      language: "MongoDB JavaScript",
      code: 'db.inventory.updateOne(\n  { _id: "item-42", stock: { $gte: 1 } },\n  { $inc: { stock: -1 } }\n)',
      note: "matchedCount·modifiedCount와 오류를 확인해야 합니다. 여러 문서의 주문 처리와 중복 요청 방지는 별도로 설계합니다.",
    },
    sources: [
      [
        "MongoDB 원자성과 트랜잭션 원문",
        "https://github.com/mongodb/docs/blob/master/source/core/write-operations-atomicity.txt",
        "확인한 단일 문서 변경과 다중 문서 경계.",
      ],
      [
        "MongoDB 인덱스 원문",
        "https://github.com/mongodb/docs/blob/master/source/indexes.txt",
        "인덱스·질의·쓰기 비용의 역할.",
      ],
    ],
    related: ["postgresql", "mysql", "redis"],
    aliases: ["몽고DB", "몽고디비"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/mongodb/mongodb-original.svg",
    logoAlt: "MongoDB 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "redis",
    name: "Redis",
    provider: "Redis · Redis 커뮤니티",
    category: "cache",
    type: "인메모리 데이터 저장소",
    image: "redis",
    summary:
      "키와 다양한 자료 구조로 빠른 조회·임시 상태·캐시를 처리하는 데이터 저장소입니다.",
    definition:
      "Redis는 문자열·해시·집합 등 자료 구조를 키로 관리하는 인메모리 데이터 저장소입니다. 캐시·세션·카운터 등에 활용하며, 저장·복제·퇴거 설정에 따라 손실과 재구성 조건이 달라집니다. 메모리에서 빠르게 동작한다는 사실만으로 영구 보관이나 장애 후 무손실 복구가 보장되지는 않습니다.",
    useCases: [
      [
        "반복 조회와 캐시",
        "원본 DB의 반복 조회를 줄이고 만료·갱신·실패 시 원본 접근 경로를 설계합니다.",
      ],
      [
        "유효 기간이 있는 공유 상태",
        "세션·한시적 작업 상태·카운터 등을 관리합니다. 정합성과 중복 실행·만료 요구에 맞는 연산을 선택합니다.",
      ],
    ],
    concepts: [
      [
        "키·자료 구조·만료",
        "자료의 크기·연산 비용·TTL을 함께 설계합니다. 하나의 큰 키나 오래 걸리는 명령은 다른 요청에도 영향을 줄 수 있습니다.",
      ],
      [
        "maxmemory와 퇴거 정책",
        "메모리가 부족할 때 어떤 키를 제거하거나 쓰기를 거절할지 정합니다. Redis 데이터의 한도와 프로세스 RSS·복제 버퍼는 같은 값이 아닙니다.",
      ],
      [
        "RDB·AOF·복제",
        "RDB는 시점 스냅샷, AOF는 변경 기록을 이용합니다. fsync·복제·복구 정책에 따라 실패 시 보장 범위가 달라집니다.",
      ],
    ],
    flow: [
      ["키와 유효성 확인", "찾을 키·버전과 만료 조건을 정합니다."],
      [
        "메모리 연산·원본 연결",
        "값을 읽고 바꾸거나 캐시 미스에서 원본을 조회합니다.",
      ],
      ["만료·저장·정리", "TTL·퇴거·저장·갱신 정책을 적용합니다."],
    ],
    points: [
      [
        "캐시 미스가 한꺼번에 원본을 압박할 수 있음",
        "TTL 분산·동시 갱신 제어·원본 보호·오래된 값 허용 범위를 설계합니다. 캐시가 없어도 서비스가 감당할 경로가 필요합니다.",
      ],
      [
        "영속화와 장애 전환의 손실 조건을 검증",
        "AOF가 있다는 이유만으로 모든 커밋의 무손실 복구를 가정하지 않습니다. fsync·복제·failover와 실제 복구 시험을 함께 확인합니다.",
      ],
      [
        "단일 명령의 원자성과 업무 트랜잭션을 구분",
        "복합 업무·외부 DB·API까지 하나의 원자적 작업이 되는 것은 아닙니다. 분산 락도 토큰·만료·소유권 확인·실패 시 동작을 설계해야 합니다.",
      ],
    ],
    diagnostics: [
      [
        "메모리 부족으로 키가 사라지거나 쓰기가 실패",
        "maxmemory·퇴거 정책·큰 키·TTL·RSS·복제 및 AOF 버퍼를 확인합니다.",
      ],
      [
        "캐시 도입 후 원본 DB 부하가 순간적으로 커짐",
        "동시 미스·동시 만료·갱신 경쟁·재시도와 캐시 적중률을 비교합니다.",
      ],
    ],
    example: {
      title: "유효 기간이 있는 캐시 키",
      description: "Redis 서버가 준비된 로컬 환경의 redis-cli 예입니다.",
      language: "Redis CLI",
      code: 'redis-cli SET film:42 \'{"title":"Demo"}\' EX 60\nredis-cli GET film:42\nredis-cli TTL film:42',
      note: "60초는 학습용 TTL입니다. 명령 성공과 장애 후 영구 보관의 보장은 별개이며, 원본 갱신·캐시 무효화도 추가로 설계합니다.",
    },
    sources: [
      [
        "Redis 영속화 공식 문서",
        "https://github.com/redis/docs/blob/main/content/operate/oss_and_stack/management/persistence.md",
        "확인한 RDB·AOF·fsync·복구 범위.",
      ],
      [
        "Redis 키 퇴거 공식 문서",
        "https://github.com/redis/docs/blob/main/content/develop/reference/eviction/index.md",
        "maxmemory·퇴거 정책과 메모리 계산의 경계.",
      ],
    ],
    related: ["postgresql", "mysql", "mongodb"],
    aliases: ["레디스", "캐시", "cache"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/redis/redis-original.svg",
    logoAlt: "Redis 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    provider: "Apache Software Foundation",
    category: "messaging",
    type: "분산 이벤트 로그",
    image: "kafka",
    summary:
      "이벤트를 파티션 로그에 보관하고 여러 소비자가 각자의 진행 위치로 읽는 플랫폼입니다.",
    definition:
      "Kafka는 토픽을 파티션으로 나누어 이벤트를 기록하고 소비자가 offset으로 읽는 분산 이벤트 스트리밍 플랫폼입니다. 소비 후 즉시 사라지는 단순 작업 큐 모델과 구분해야 합니다. 보관·복제·파티션·소비자 그룹의 구성이 순서·재처리·가용성과 처리량에 영향을 줍니다.",
    useCases: [
      [
        "이벤트를 여러 서비스로 전달",
        "주문·활동·변경 이벤트를 여러 소비자 그룹이 독립적으로 읽어 후속 처리에 사용합니다.",
      ],
      [
        "재처리와 스트림 처리",
        "보관된 이벤트를 읽어 집계·색인·분석 결과를 만들고, 소비 위치를 관리하며 재처리합니다.",
      ],
    ],
    concepts: [
      [
        "토픽·파티션·키",
        "순서 보장은 파티션 단위입니다. 같은 업무 키를 어느 파티션으로 보낼지와 파티션 수 변경의 영향을 함께 설계합니다.",
      ],
      [
        "Offset과 소비자 그룹",
        "그룹은 파티션을 나누어 읽고 진행 위치를 offset으로 관리합니다. 읽고 커밋해도 이벤트가 즉시 삭제되는 것은 아니며 보관·압축 정책을 따릅니다. 업무 처리와 offset 커밋의 순서가 중복·누락 조건에 영향을 줍니다.",
      ],
      [
        "복제와 전달 보장",
        "producer acks·최소 동기 복제본·재시도·멱등성·트랜잭션 설정이 보장 범위를 정합니다. 기능 이름만으로 외부 시스템까지 exactly-once가 되는 것은 아닙니다.",
      ],
    ],
    flow: [
      ["키와 함께 이벤트 기록", "producer가 대상 파티션에 이벤트를 보냅니다."],
      [
        "로그 보관·복제",
        "브로커가 설정된 보관·복제 정책으로 이벤트를 관리합니다.",
      ],
      [
        "소비·처리·진행 위치 기록",
        "소비자가 작업하고 offset과 재시도를 관리합니다.",
      ],
    ],
    points: [
      [
        "순서 요구를 파티션 설계에 반영",
        "전체 토픽의 전역 순서를 가정하지 않습니다. 동일 키의 처리 순서·소비자 병렬성·재시도 방식과 파티션 변경을 함께 봅니다.",
      ],
      [
        "처리와 offset 커밋 사이의 실패를 설계",
        "처리 후 커밋 전에 실패하면 다시 처리할 수 있습니다. DB 유일 키·업무 식별자·멱등성 등을 설계하고 재처리를 실제 시험합니다.",
      ],
      [
        "멱등 producer와 업무의 정확히 한 번을 구분",
        "재전송의 로그 중복 방지와 외부 DB·결제 API의 부수 효과는 다른 문제입니다. 트랜잭션이 포괄하는 읽기·쓰기의 범위를 명시합니다.",
      ],
    ],
    diagnostics: [
      [
        "consumer lag가 계속 증가",
        "파티션별 유입·처리 속도·느린 외부 호출·재균형·실패 이벤트와 소비자 수를 확인합니다.",
      ],
      [
        "같은 이벤트가 업무에 두 번 반영됨",
        "메시지 ID·업무 키·offset 커밋 시점·재시도와 외부 저장의 멱등성을 확인합니다.",
      ],
    ],
    example: {
      title: "학습용 토픽과 소비자 그룹",
      description:
        "Kafka 개발 브로커와 해당 배포판의 CLI가 준비됐다는 가정입니다.",
      language: "Kafka CLI",
      code: "kafka-topics.sh --bootstrap-server 127.0.0.1:9092 \\\n  --create --topic learning.events \\\n  --partitions 3 --replication-factor 1\nkafka-console-consumer.sh --bootstrap-server 127.0.0.1:9092 \\\n  --topic learning.events --group learning-reader --from-beginning",
      note: "복제본 1개는 학습용이며 장애 내구성을 제공하는 운영 권장값이 아닙니다. 브로커·권한·보관·producer와 업무 처리는 별도 구성입니다.",
    },
    sources: [
      [
        "Kafka 공식 설계 문서",
        "https://github.com/apache/kafka/blob/trunk/docs/design/design.md",
        "확인한 파티션·로그·소비자·복제와 전달 의미.",
      ],
      [
        "Kafka producer 설정",
        "https://kafka.apache.org/documentation/#producerconfigs",
        "acks·멱등성·재시도를 확인하는 추가 공식 설정 문서.",
      ],
    ],
    related: ["rabbitmq", "postgresql", "redis"],
    aliases: ["카프카", "이벤트 스트리밍"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/apachekafka/apachekafka-original.svg",
    logoAlt: "Apache Kafka 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "rabbitmq",
    name: "RabbitMQ",
    provider: "RabbitMQ 프로젝트",
    category: "messaging",
    type: "메시지 브로커",
    image: "rabbitmq",
    summary:
      "메시지를 exchange·queue로 라우팅하고 소비자의 처리·확인·재전달을 관리합니다.",
    definition:
      "RabbitMQ는 producer가 보낸 메시지를 exchange와 binding 규칙으로 queue에 연결하는 메시지 브로커입니다. 작업 분배·비동기 서비스 연결 등에 사용합니다. producer의 전송 확인과 소비자의 처리 확인, 큐의 내구성과 복제는 각각 다른 보장 경계입니다.",
    useCases: [
      [
        "백그라운드 작업 분배",
        "메일·변환·후속 처리 같은 일을 큐에 넣고 소비자의 처리 능력에 맞춰 분배합니다.",
      ],
      [
        "서비스 간 비동기 연결",
        "요청 처리와 후속 작업을 분리하고 라우팅·재전달·실패 메시지의 경로를 구성합니다.",
      ],
    ],
    concepts: [
      [
        "Exchange·Binding·Queue",
        "exchange가 binding·routing key에 따라 메시지를 queue로 보냅니다. 어떤 큐에 도달했는지와 앱이 처리했는지는 다릅니다.",
      ],
      [
        "Publisher confirm·Consumer ack",
        "confirm은 브로커 측 수락 경로, ack는 소비자 처리 완료의 확인입니다. 하나가 다른 쪽 성공을 대신하지 않습니다.",
      ],
      [
        "Prefetch와 Quorum queue",
        "prefetch로 미확인 메시지 수를 제한할 수 있습니다. quorum queue는 복제된 큐 상태를 관리하며 과반수·배치·디스크 조건에 영향을 받습니다.",
      ],
    ],
    flow: [
      [
        "메시지 발행·라우팅",
        "producer가 메시지를 exchange에 보내고 큐로 연결합니다.",
      ],
      ["전달과 처리", "소비자에게 보내고 prefetch·처리 속도를 조정합니다."],
      [
        "확인·재전달·실패 경로",
        "ack 또는 재전달·dead-letter 정책으로 결과를 관리합니다.",
      ],
    ],
    points: [
      [
        "업무 완료 뒤 ack, 중복은 별도로 처리",
        "처리 전에 ack하면 이후 실패에서 작업을 잃을 수 있고, 처리 후 ack 전에 실패하면 재전달될 수 있습니다. 업무 멱등성이 필요합니다.",
      ],
      [
        "무한 requeue를 피하기",
        "계속 실패하는 메시지가 즉시 재전달을 반복하지 않게 재시도 횟수·지연·dead-letter 경로와 운영 알림을 정합니다.",
      ],
      [
        "큐 내구성·복제·확인을 함께 설계",
        "durable 큐·메시지 속성·confirm·queue type·복제 구성을 각각 확인합니다. 모든 조합이 같은 장애 보장을 제공하지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "메시지가 큐에서 줄지 않음",
        "ready·unacked 수·소비자·prefetch·처리 시간·연결 오류를 함께 확인합니다.",
      ],
      [
        "중복 처리 또는 일부 작업 유실",
        "confirm·라우팅 결과·ack 시점·재전달·큐 종류와 업무 식별자의 멱등성을 확인합니다.",
      ],
    ],
    example: {
      title: "처리 후 확인하는 소비자",
      description:
        "pika 패키지와 로컬 RabbitMQ, quorum queue 사용 환경이 필요합니다.",
      language: "Python · pika",
      code: 'import pika\nconnection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))\nchannel = connection.channel()\nchannel.queue_declare(queue="jobs", durable=True,\n                      arguments={"x-queue-type": "quorum"})\nchannel.basic_qos(prefetch_count=10)\ndef handle(ch, method, properties, body):\n    print(body.decode("utf-8"))  # replace with idempotent work\n    ch.basic_ack(delivery_tag=method.delivery_tag)\nchannel.basic_consume(queue="jobs", on_message_callback=handle)\nchannel.start_consuming()',
      note: "학습용 처리 함수입니다. 예외·재시도·dead-letter·종료·접근 권한과 클러스터 구성은 별도로 정의해야 합니다.",
    },
    sources: [
      [
        "RabbitMQ 확인·전달 공식 문서",
        "https://github.com/rabbitmq/rabbitmq-website/blob/main/docs/confirms.md",
        "확인한 publisher confirm·consumer ack·prefetch의 구분.",
      ],
      [
        "RabbitMQ Quorum Queues 공식 문서",
        "https://github.com/rabbitmq/rabbitmq-website/blob/main/docs/quorum-queues/index.md",
        "과반수·복제와 큐의 장애 보장 조건.",
      ],
    ],
    related: ["kafka", "redis", "postgresql"],
    aliases: ["래빗MQ", "래빗엠큐", "메시지 큐"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/rabbitmq/rabbitmq-original.svg",
    logoAlt: "RabbitMQ 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "docker",
    name: "Docker",
    provider: "Docker · Moby 프로젝트",
    category: "operations",
    type: "컨테이너 실행·이미지 도구",
    image: "docker",
    summary:
      "이미지로 애플리케이션 파일과 실행 조건을 묶고 격리된 프로세스를 실행하는 도구입니다.",
    definition:
      "Docker는 이미지를 만들고 컨테이너를 실행하는 도구·플랫폼입니다. 컨테이너는 보통 호스트 커널을 공유하는 격리된 프로세스이며 VM과 같은 단위가 아닙니다. Docker Engine·이미지·레지스트리와 개발용 제품인 Docker Desktop도 역할과 배포 조건을 구분합니다.",
    useCases: [
      [
        "동일한 앱 실행 조건 전달",
        "실행 파일·의존성·설정 방식과 시작 명령을 이미지로 묶어 개발·CI·서버에서 사용합니다.",
      ],
      [
        "서비스 배포의 실행 단위",
        "이미지를 레지스트리에서 받아 실행하고 포트·자원·스토리지·로그와 종료 동작을 연결합니다.",
      ],
    ],
    concepts: [
      [
        "이미지와 컨테이너",
        "이미지는 실행할 파일과 메타데이터의 기반이고, 컨테이너는 실행 상태입니다. 같은 이미지로 여러 컨테이너를 만들 수 있습니다.",
      ],
      [
        "격리와 호스트 커널",
        "namespace로 프로세스·네트워크 등이 보이는 영역을 구분하고 cgroup으로 자원 사용을 계량·제한합니다. 공유 커널·실행 권한·마운트·Docker 소켓 노출은 별도 보안 경계입니다.",
      ],
      [
        "쓰기 계층·볼륨·포트",
        "컨테이너의 쓰기 계층과 외부 저장 볼륨을 구분합니다. EXPOSE는 포트 설명이며 외부 접근을 위한 publish와 같은 동작이 아닙니다.",
      ],
    ],
    flow: [
      ["이미지 빌드·선택", "필요한 파일·의존성·시작 명령을 정합니다."],
      ["실행 자원 연결", "컨테이너에 포트·설정·저장·자원 제한을 연결합니다."],
      ["프로세스 운영", "로그·종료 신호·재시작·데이터 보관을 관리합니다."],
    ],
    points: [
      [
        "데이터 수명과 컨테이너 수명을 분리",
        "컨테이너를 지웠을 때 유지해야 하는 데이터는 적절한 외부 저장에 둡니다. 이미지를 다시 받는 것과 사용자 데이터를 복구하는 것은 다릅니다.",
      ],
      [
        "태그만으로 같은 바이트를 가정하지 않기",
        "태그가 가리키는 이미지와 CPU 아키텍처·기반 이미지·의존성 버전을 확인합니다. 재현이 중요하면 digest 등 고정 가능한 식별자를 사용합니다.",
      ],
      [
        "권한과 종료 동작을 확인",
        "실행 사용자·불필요한 권한·호스트 소켓·비밀 값의 포함 여부를 점검합니다. PID 1과 종료 신호·로그·자원 제한을 운영 요구에 맞춥니다.",
      ],
    ],
    diagnostics: [
      [
        "컨테이너 삭제 후 업로드 파일이 사라짐",
        "쓰기 계층·볼륨 마운트·경로·백업과 실제 데이터 저장 위치를 확인합니다.",
      ],
      [
        "로컬에서는 되는데 서버에서 실행 실패",
        "CPU 아키텍처·이미지 digest·환경 변수·포트 publish·권한·네트워크를 비교합니다.",
      ],
    ],
    example: {
      title: "정적 사이트를 담는 이미지",
      description:
        "site 디렉터리에 정적 파일을 준비한 학습용 Dockerfile입니다.",
      language: "Dockerfile",
      code: "FROM nginx:stable\nCOPY ./site/ /usr/share/nginx/html/\n# build: docker build -t learning-site .\n# run: docker run --rm -p 127.0.0.1:8080:80 learning-site",
      note: "stable 태그는 가리키는 바이트가 바뀔 수 있습니다. 운영에서는 이미지 식별자·업데이트·보안·데이터와 TLS 설정을 따로 정합니다.",
    },
    sources: [
      [
        "Docker 공식 컨테이너 설명",
        "https://github.com/docker/docs/blob/main/content/get-started/docker-concepts/the-basics/what-is-a-container.md",
        "확인한 프로세스·이미지·호스트 커널과 VM의 구분.",
      ],
      [
        "Docker 저장소 공식 문서",
        "https://github.com/docker/docs/blob/main/content/manuals/engine/storage/_index.md",
        "컨테이너 쓰기 계층·볼륨과 데이터 수명.",
      ],
    ],
    related: ["kubernetes", "alpine", "nginx"],
    aliases: ["도커", "컨테이너"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/docker/docker-original.svg",
    logoAlt: "Docker 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    provider: "Cloud Native Computing Foundation · Kubernetes 프로젝트",
    category: "operations",
    type: "컨테이너 오케스트레이션",
    image: "kubernetes",
    summary:
      "컨테이너 워크로드의 원하는 상태를 선언하고 배치·교체·연결을 조정하는 시스템입니다.",
    definition:
      "Kubernetes는 API에 선언한 원하는 상태와 실제 클러스터 상태를 컨트롤러가 맞추는 시스템입니다. Pod를 노드에 배치하고 애플리케이션 복제·교체·서비스 연결을 관리합니다. 데이터베이스의 정합성·앱의 멱등성·모든 장애에서의 무중단 운영까지 자동으로 해결하지는 않습니다.",
    useCases: [
      [
        "여러 서비스와 복제본 운영",
        "배포·스케줄링·롤링 변경·서비스 연결을 일관된 API로 관리합니다.",
      ],
      [
        "자원과 상태 기반 운영",
        "requests·limits·상태 검사·확장 조건을 실제 워크로드의 자원과 처리 능력에 맞춥니다.",
      ],
    ],
    concepts: [
      [
        "Pod와 Deployment",
        "Pod는 함께 실행·종료되는 컨테이너 묶음의 단위입니다. Deployment 같은 컨트롤러가 원하는 복제본과 배포 상태를 관리합니다.",
      ],
      [
        "원하는 상태와 재조정",
        "선언을 적용했다고 즉시 모든 인스턴스가 준비되는 것은 아닙니다. 스케줄링·이미지 다운로드·초기화·상태 검사 과정이 필요합니다.",
      ],
      [
        "Readiness·Liveness·Startup",
        "readiness는 트래픽을 받을 준비, liveness는 재시작 판단, startup은 초기 기동을 다룹니다. 같은 검사로 모든 목적을 대신하지 않습니다.",
      ],
    ],
    flow: [
      [
        "원하는 상태 선언",
        "앱·이미지·자원·상태 검사와 복제본을 API로 지정합니다.",
      ],
      [
        "노드 배치·실행",
        "컨트롤러·스케줄러·kubelet 등이 실제 상태를 맞춥니다.",
      ],
      [
        "상태 관측·재조정",
        "준비·오류·자원 변화에 맞춰 연결과 실행 상태를 조정합니다.",
      ],
    ],
    points: [
      [
        "상태 검사의 실패 효과를 구분",
        "하위 DB가 잠깐 느리다는 이유로 모든 Pod를 재시작하면 장애를 증폭할 수 있습니다. 각 probe가 판별할 상태와 실패 시 효과를 설계합니다.",
      ],
      [
        "자원 요청과 제한을 실제 사용량에 맞추기",
        "requests는 노드 배치의 자원 계산에 사용하고 limits는 실행 중 자원 사용을 제한합니다. CPU 제한의 throttling과 메모리 제한 초과 종료를 구분합니다. 복제본 수를 늘려도 DB·캐시·외부 API의 용량까지 자동으로 늘어나지는 않습니다.",
      ],
      [
        "종료·저장·배포 실패도 설계",
        "종료 신호·유예 시간·진행 중 요청·Pod 교체와 영속 데이터·마이그레이션의 순서를 확인합니다. 단순 재시작을 데이터 복구로 보지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "Pod가 Running인데 요청 실패",
        "readiness·Service 선택자·포트·네트워크·앱의 실제 준비 상태를 확인합니다.",
      ],
      [
        "재시작이 반복되거나 응답이 갑자기 느림",
        "종료 원인·이벤트·probe 실패·메모리 초과·CPU throttling·하위 의존성을 비교합니다.",
      ],
    ],
    example: {
      title: "준비 상태 검사가 있는 배포",
      description: "클러스터에서 실행할 수 있는 학습용 Deployment YAML입니다.",
      language: "Kubernetes YAML",
      code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: learning-web\nspec:\n  replicas: 2\n  selector:\n    matchLabels: { app: learning-web }\n  template:\n    metadata:\n      labels: { app: learning-web }\n    spec:\n      containers:\n        - name: web\n          image: nginx:stable\n          ports:\n            - containerPort: 80\n          readinessProbe:\n            httpGet: { path: /, port: 80 }\n          resources:\n            requests: { cpu: "100m", memory: "64Mi" }\n            limits: { cpu: "500m", memory: "128Mi" }',
      note: "자원 수치·복제본 수는 학습용 가정입니다. Service·외부 접근·TLS·이미지 고정·저장·운영 정책은 별도 구성입니다.",
    },
    sources: [
      [
        "Kubernetes Pod 공식 문서",
        "https://github.com/kubernetes/website/blob/main/content/en/docs/concepts/workloads/pods/_index.md",
        "확인한 Pod·수명주기·워크로드 구성 단위.",
      ],
      [
        "Kubernetes 상태 검사 공식 문서",
        "https://github.com/kubernetes/website/blob/main/content/en/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes.md",
        "readiness·liveness·startup의 목적과 동작 차이.",
      ],
    ],
    related: ["docker", "nginx", "postgresql"],
    aliases: ["쿠버네티스", "K8s", "오케스트레이션"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/kubernetes/kubernetes-original.svg",
    logoAlt: "Kubernetes 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "ceph",
    name: "Ceph",
    provider: "Ceph 커뮤니티",
    category: "storage",
    type: "분산 스토리지 시스템",
    image: "ceph",
    summary:
      "여러 노드의 저장장치를 묶어 오브젝트·블록·파일 접근 경로를 제공하는 스토리지 시스템입니다.",
    definition:
      "Ceph는 데이터를 여러 저장 노드에 배치하고 복구·복제 등을 운영하는 분산 스토리지입니다. RADOS 기반 위에 RBD 블록 장치, CephFS 파일시스템, RGW 오브젝트 API 같은 접근 방식을 제공합니다. 어떤 접근 경로를 사용하는지와 저장 클러스터를 운영할 책임을 구분해야 합니다.",
    useCases: [
      [
        "자체 분산 저장 기반",
        "여러 노드·디스크의 용량을 묶어 복제·장애 복구·증설을 운영하는 환경에서 사용합니다.",
      ],
      [
        "서로 다른 저장 API 제공",
        "VM의 블록 장치·공유 파일·오브젝트 접근 중 워크로드가 요구하는 인터페이스를 선택합니다.",
      ],
    ],
    concepts: [
      [
        "RADOS와 저장 노드",
        "데이터를 보관하는 OSD와 클러스터 상태를 관리하는 구성 요소가 함께 동작합니다. 노드 수만큼 가용성이 자동 보장되지는 않습니다.",
      ],
      [
        "CRUSH와 장애 영역",
        "데이터의 배치 규칙과 장애 영역을 정의합니다. 호스트·랙 등 실패가 함께 일어날 범위를 반영해야 복제본이 같은 장애에 묶이는 것을 줄일 수 있습니다.",
      ],
      [
        "RBD·CephFS·RGW",
        "블록·파일·오브젝트는 서로 다른 인터페이스입니다. RGW의 S3 호환 API가 AWS의 모든 권한·서비스 기능과 동일하다는 뜻은 아닙니다.",
      ],
    ],
    flow: [
      [
        "접근 인터페이스 선택",
        "클라이언트가 블록·파일·오브젝트 경로로 요청합니다.",
      ],
      ["배치와 저장 처리", "클러스터가 규칙에 맞춰 데이터를 배치·복제합니다."],
      [
        "상태·복구 관리",
        "노드·디스크 실패와 증설·재배치를 관측하고 운영합니다.",
      ],
    ],
    points: [
      [
        "복제 수와 장애 영역을 함께 설계",
        "복제본을 많이 두어도 같은 호스트·랙·전원에 묶여 있으면 같은 사고에 영향을 받을 수 있습니다. 배치 규칙과 실제 장비 구성을 대조합니다.",
      ],
      [
        "복구 트래픽도 용량에 포함",
        "장애·증설 중의 재배치·복구가 저장장치·네트워크를 사용합니다. 정상 상태의 여유와 복구 중 서비스 품질을 따로 검증합니다.",
      ],
      [
        "호환 API와 운영 범위를 구분",
        "앱의 S3 사용 기능·메타데이터·권한·오류·운영 도구가 RGW에서 어떻게 동작하는지 시험합니다. 관리형 서비스의 운영 책임까지 같은 것은 아닙니다.",
      ],
    ],
    diagnostics: [
      [
        "정상 때는 빠르지만 디스크 장애 후 지연 급증",
        "복구·재배치 작업과 디스크·네트워크 여유, 배치 규칙을 확인합니다.",
      ],
      [
        "일부 파일·객체 접근만 실패",
        "해당 인터페이스·게이트웨이·풀·클러스터 health와 권한을 구분해 확인합니다.",
      ],
    ],
    example: {
      title: "설정된 클러스터 상태 관측",
      description:
        "Ceph CLI·접속 설정·조회 권한이 있는 관리 환경의 읽기 명령입니다.",
      language: "Ceph CLI",
      code: "ceph status\nceph health detail\nceph osd df tree",
      note: "명령은 클러스터를 생성하거나 성능을 보증하지 않습니다. 데이터 배치·복구·여유 용량과 인터페이스를 함께 해석해야 합니다.",
    },
    sources: [
      [
        "Ceph CRUSH 공식 문서",
        "https://github.com/ceph/ceph/blob/main/doc/rados/operations/crush-map.rst",
        "확인한 데이터 배치·장애 영역·규칙의 역할.",
      ],
      [
        "Ceph RGW S3 API 공식 문서",
        "https://github.com/ceph/ceph/blob/main/doc/radosgw/s3.rst",
        "지원하는 오브젝트 API와 호환 범위.",
      ],
    ],
    related: ["s3", "ebs", "efs"],
    aliases: ["세프", "RADOS", "RBD", "CephFS", "RGW"],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/ceph/ceph-original.svg",
    logoAlt: "Ceph 제품·프로젝트 심벌",
    logoNote: "제품·언어 심벌 · Devicon 원본",
  },
  {
    id: "ebs",
    name: "Amazon EBS",
    provider: "Amazon Web Services",
    category: "storage",
    type: "블록 스토리지",
    image: "ebs",
    summary:
      "EC2 인스턴스에 블록 장치로 연결해 파일시스템·데이터베이스 저장에 사용하는 AWS 서비스입니다.",
    definition:
      "Amazon Elastic Block Store는 EC2가 디스크처럼 사용할 수 있는 블록 볼륨을 제공합니다. 애플리케이션은 보통 그 위에 파일시스템이나 DB 저장 구조를 구성합니다. 버킷·키 API로 파일을 읽는 S3나 여러 클라이언트가 NFS로 공유하는 EFS와 접근 모델이 다릅니다.",
    useCases: [
      [
        "가상 서버의 운영체제·앱 데이터",
        "EC2의 부팅·애플리케이션 파일·DB 저장 등 블록 장치를 요구하는 워크로드에 연결합니다.",
      ],
      [
        "볼륨과 백업 운영",
        "볼륨 유형·용량·I/O 조건·스냅샷과 복구 절차를 워크로드에 맞춰 구성합니다.",
      ],
    ],
    concepts: [
      [
        "블록 볼륨과 파일시스템",
        "볼륨을 연결하는 것과 파일시스템을 마운트해 앱이 사용하는 것은 다른 단계입니다. 장치 이름·UUID·권한·마운트 경로를 확인합니다.",
      ],
      [
        "가용 영역과 연결 조건",
        "볼륨과 인스턴스의 위치·연결 조건을 확인합니다. 모든 볼륨이 여러 서버에서 일반 공유 파일시스템처럼 동작하는 것은 아닙니다.",
      ],
      [
        "스냅샷과 앱 일관성",
        "블록 스냅샷이 만들어져도 DB·여러 볼륨에 걸친 앱의 일관된 복구가 자동으로 증명되지는 않습니다. 버퍼·쓰기 순서·백업 방식을 확인합니다.",
      ],
    ],
    flow: [
      ["볼륨 준비·연결", "가용 영역·유형·용량을 정하고 인스턴스에 연결합니다."],
      [
        "OS·앱의 블록 접근",
        "파일시스템·마운트 또는 DB 저장 구조로 읽고 씁니다.",
      ],
      ["상태·백업·복구", "I/O·스냅샷·암호화·수명과 복구를 관리합니다."],
    ],
    points: [
      [
        "인스턴스 종료와 데이터 삭제 설정을 확인",
        "인스턴스 수명과 볼륨 수명은 설정에 따라 연결됩니다. DeleteOnTermination·마운트·백업을 확인해 기대한 보관 정책과 맞춥니다.",
      ],
      [
        "IOPS와 처리량·지연을 구분",
        "IOPS는 초당 I/O 횟수, 처리량은 단위 시간에 전달하는 바이트 양입니다. 작은 무작위 I/O와 큰 순차 I/O는 다른 한도에 먼저 도달할 수 있습니다. 볼륨·인스턴스·실제 I/O 크기·큐 대기를 함께 관측합니다.",
      ],
      [
        "스냅샷을 실제 복구로 검증",
        "스냅샷 존재만 확인하지 않습니다. 앱 일관성·여러 볼륨의 관계·복원 후 초기 접근과 운영 복구 시간을 시험합니다.",
      ],
    ],
    diagnostics: [
      [
        "볼륨은 붙었는데 앱이 데이터를 못 읽음",
        "실제 장치·파일시스템·마운트·권한·앱 경로와 볼륨 상태를 확인합니다.",
      ],
      [
        "디스크 용량은 남는데 I/O가 느림",
        "I/O 크기·IOPS·처리량·큐·볼륨 및 인스턴스 한도와 앱 패턴을 비교합니다.",
      ],
    ],
    example: {
      title: "현재 볼륨의 위치와 형태 조회",
      description:
        "자격증명·리전·조회 권한이 있는 AWS CLI 환경의 읽기 명령입니다.",
      language: "AWS CLI",
      code: "aws ec2 describe-volumes \\\n  --query 'Volumes[].{ID:VolumeId,AZ:AvailabilityZone,Type:VolumeType,SizeGiB:Size}'",
      note: "리소스를 생성·변경하지 않는 조회입니다. 결과만으로 파일시스템·데이터 보관·복구의 올바름이 보장되지는 않습니다.",
    },
    sources: [
      [
        "AWS EBS 볼륨 공식 보존 문서",
        "https://github.com/awsdocs/amazon-ec2-user-guide/blob/master/doc_source/ebs-volumes.md",
        "확인한 블록 볼륨·연결·스토리지 수명. 현재 유형·제한·요금은 확인 필요.",
      ],
      [
        "AWS EBS 스냅샷 공식 보존 문서",
        "https://github.com/awsdocs/amazon-ec2-user-guide/blob/master/doc_source/ebs-creating-snapshot.md",
        "스냅샷과 파일시스템·애플리케이션 데이터의 관계.",
      ],
    ],
    related: ["ec2", "efs", "s3"],
    aliases: ["EBS", "아마존 EBS", "블록 볼륨"],
    logoSource:
      "https://github.com/awslabs/aws-icons-for-plantuml/blob/main/dist/Storage/ElasticBlockStore.png",
    logoAlt: "Amazon EBS 제품·프로젝트 심벌",
    logoNote: "AWS 제품 아이콘 · AWS Icons for PlantUML 원본 PNG",
  },
  {
    id: "efs",
    name: "Amazon EFS",
    provider: "Amazon Web Services",
    category: "storage",
    type: "관리형 NFS 파일 스토리지",
    image: "efs",
    summary:
      "여러 클라이언트가 NFS로 파일·디렉터리를 공유하도록 제공하는 AWS 파일 스토리지입니다.",
    definition:
      "Amazon Elastic File System은 NFS 클라이언트가 파일·디렉터리 경로로 사용하는 관리형 파일 스토리지입니다. 여러 애플리케이션 인스턴스가 공유 파일을 읽고 써야 할 때 검토합니다. 객체 API인 S3·개별 블록 장치인 EBS와 파일 접근·권한·동시 사용 방식이 다릅니다.",
    useCases: [
      [
        "여러 서버의 공유 파일",
        "동일한 자료·사용자 파일·공통 경로를 여러 클라이언트에서 사용해야 할 때 파일 인터페이스로 연결합니다.",
      ],
      [
        "파일 경로가 필요한 기존 앱",
        "객체 API로 바꾸기 어려운 앱에 NFS 경로를 제공하고 권한·네트워크·접근 지점을 관리합니다.",
      ],
    ],
    concepts: [
      [
        "NFS·Mount target",
        "클라이언트 네트워크와 파일시스템의 mount target·DNS·보안 그룹을 맞춥니다. 저장소가 생성됐다고 앱에서 바로 접근 가능한 것은 아닙니다.",
      ],
      [
        "POSIX 권한과 Access point",
        "UID·GID·디렉터리 권한과 IAM·접근 지점이 함께 영향을 줍니다. access point로 앱의 루트 경로와 파일 접근 주체를 제한할 수 있습니다.",
      ],
      [
        "공유 파일의 동시 사용",
        "여러 클라이언트가 같은 경로를 쓰므로 앱의 잠금·파일 공개·캐시·일관성 요구를 확인해야 합니다. 공유 경로가 업무 트랜잭션을 대신하지 않습니다.",
      ],
    ],
    flow: [
      [
        "파일시스템과 접근 경로 준비",
        "종류·네트워크·mount target·접근 지점을 구성합니다.",
      ],
      [
        "클라이언트에 마운트",
        "NFS와 필요한 인증·전송 보호 옵션으로 연결합니다.",
      ],
      ["공유 파일 사용·관측", "앱의 권한·동시 사용·I/O·오류를 확인합니다."],
    ],
    points: [
      [
        "IAM과 파일 권한을 함께 확인",
        "클라이언트의 AWS 권한만 맞아도 POSIX UID·GID·디렉터리 권한 때문에 작업이 실패할 수 있습니다. 실제 앱 프로세스 주체를 확인합니다.",
      ],
      [
        "작은 파일·메타데이터 작업도 측정",
        "처리량만 보지 말고 파일 열기·목록·작은 I/O·동시 클라이언트 수·네트워크 지연을 함께 봅니다.",
      ],
      [
        "공유 저장과 배포·복구 범위를 구분",
        "여러 앱이 같은 파일을 바꾸는 순서와 잠금·원자적 공개를 설계합니다. 선택한 파일시스템 종류·위치·백업의 가용성 범위를 별도로 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "마운트가 실패하거나 연결 시간이 길어짐",
        "VPC·DNS·mount target·보안 그룹·NFS 경로와 클라이언트 도구를 확인합니다.",
      ],
      [
        "파일은 보이지만 읽기·쓰기가 거절됨",
        "앱의 UID·GID·파일 권한·access point 루트와 IAM 정책을 대조합니다.",
      ],
    ],
    example: {
      title: "마운트 상태를 먼저 확인",
      description: "이미 EFS가 마운트된 Linux 클라이언트의 읽기 명령입니다.",
      language: "Linux 관측 명령",
      code: "findmnt -t nfs,nfs4\nid\nls -ld /mnt/shared",
      note: "마운트 경로는 환경의 실제 값으로 바꿉니다. 네트워크·IAM·POSIX 권한이 모두 맞아야 파일 작업이 가능합니다.",
    },
    sources: [
      [
        "AWS EFS 공식 보존 개요",
        "https://github.com/awsdocs/amazon-efs-user-guide/blob/main/doc_source/whatisefs.md",
        "확인한 공유 파일·NFS 접근 모델. 현재 유형·성능 조건은 확인 필요.",
      ],
      [
        "AWS EFS Access Point 공식 보존 문서",
        "https://github.com/awsdocs/amazon-efs-user-guide/blob/main/doc_source/efs-access-points.md",
        "UID·GID·루트 디렉터리와 접근 경계.",
      ],
    ],
    related: ["s3", "ebs", "ceph"],
    aliases: ["EFS", "아마존 EFS", "NFS", "공유 파일"],
    logoSource:
      "https://github.com/awslabs/aws-icons-for-plantuml/blob/main/dist/Storage/EFS.png",
    logoAlt: "Amazon EFS 제품·프로젝트 심벌",
    logoNote: "AWS 제품 아이콘 · AWS Icons for PlantUML 원본 PNG",
  },
  {
    id: "alpine",
    name: "Alpine Linux",
    provider: "Alpine Linux 프로젝트",
    category: "os",
    type: "Linux 배포판",
    image: "alpine",
    summary: "musl libc·BusyBox·apk 패키지 도구를 사용하는 Linux 배포판입니다.",
    definition:
      "Alpine Linux는 서버·컨테이너 기반 이미지 등에서 사용하는 Linux 배포판입니다. musl libc와 BusyBox·apk 같은 구성 선택이 다른 배포판과의 프로그램·패키지 호환성에 영향을 줍니다. JavaScript UI 프레임워크인 Alpine.js와는 별개 프로젝트입니다.",
    useCases: [
      [
        "필요한 구성만 갖춘 기반 이미지",
        "앱에 필요한 실행 파일·라이브러리·인증서·패키지를 명확히 선택해 이미지와 실행 환경을 구성합니다.",
      ],
      [
        "Alpine 운영 환경의 서버·도구",
        "릴리스·저장소·업데이트와 팀의 패키지 운영 체계를 맞춰 사용합니다.",
      ],
    ],
    concepts: [
      [
        "musl libc",
        "glibc를 가정해 만든 네이티브 바이너리·확장 모듈과 호환 조건이 다를 수 있습니다. 언어 패키지가 설치된다는 것과 실행까지 가능한 것은 다릅니다.",
      ],
      [
        "BusyBox 도구",
        "일부 명령의 옵션·동작이 GNU 도구와 다를 수 있습니다. 기존 셸 스크립트의 전제를 확인합니다.",
      ],
      [
        "apk와 릴리스 저장소",
        "설치 패키지·릴리스 브랜치·저장소를 함께 관리합니다. 다른 릴리스의 패키지를 임의로 섞지 않습니다.",
      ],
    ],
    flow: [
      ["릴리스와 기반 환경 선택", "필요한 libc·도구·패키지 조건을 확인합니다."],
      ["앱과 의존성 구성", "실행 파일·네이티브 모듈·인증서 등을 준비합니다."],
      [
        "실행·업데이트 검증",
        "앱 동작과 패키지·보안 업데이트 경로를 확인합니다.",
      ],
    ],
    points: [
      [
        "작다는 이유로 호환·보안을 단정하지 않기",
        "이미지 크기는 구성에 따른 결과입니다. 실제 런타임·네이티브 의존성과 업데이트·권한·노출을 함께 확인합니다.",
      ],
      [
        "소스 빌드가 발생하는 조건 확인",
        "미리 빌드된 패키지가 없어 설치 중 컴파일이 필요할 수 있습니다. 도구 체인·빌드 시간·실행 의존성을 구분합니다.",
      ],
      [
        "운영 스크립트와 진단 도구를 검증",
        "BusyBox와 패키지 선택 때문에 익숙한 도구나 옵션이 없을 수 있습니다. 장애 때 필요한 관측 방법까지 준비합니다.",
      ],
    ],
    diagnostics: [
      [
        "다른 Linux 이미지에서는 되던 프로그램이 실패",
        "libc·동적 로더·네이티브 모듈·CPU 아키텍처와 필요한 공유 라이브러리를 확인합니다.",
      ],
      [
        "설치는 느려지고 이미지가 예상보다 커짐",
        "네이티브 소스 빌드·빌드 도구 잔존·패키지 저장소·캐시와 런타임 의존성을 확인합니다.",
      ],
    ],
    example: {
      title: "실제 배포판과 설치 패키지 확인",
      description: "Alpine 호스트 또는 해당 컨테이너 내부의 읽기 명령입니다.",
      language: "Alpine Linux 셸",
      code: "cat /etc/alpine-release\ncat /etc/os-release\napk info -v",
      note: "Alpine.js 명령이 아닙니다. 컨테이너 안에서 이 명령을 실행해도 호스트의 운영체제가 Alpine이라는 뜻은 아닙니다.",
    },
    sources: [
      [
        "Alpine 공식 컨테이너 이미지 원문",
        "https://github.com/alpinelinux/docker-alpine/blob/master/README.adoc",
        "확인한 Alpine 기반 이미지·패키지 모델. 예전 크기 비교 수치는 사용하지 않습니다.",
      ],
      [
        "Alpine aports 공식 저장소",
        "https://github.com/alpinelinux/aports/blob/master/README.md",
        "패키지·빌드·릴리스 저장소 구성.",
      ],
    ],
    related: ["docker", "ubuntu", "debian"],
    aliases: ["알파인 리눅스", "Alpine Linux"],
    logoSource:
      "https://github.com/simple-icons/simple-icons/blob/develop/icons/alpinelinux.svg",
    logoAlt: "Alpine Linux 제품·프로젝트 심벌",
    logoNote: "Alpine Linux 심벌 · Simple Icons 원본",
  },
  {
    id: "ec2",
    name: "Amazon EC2",
    provider: "Amazon Web Services",
    category: "compute",
    type: "가상 서버 컴퓨팅",
    image: "ec2",
    summary:
      "운영체제와 애플리케이션을 직접 구성해 실행하는 AWS 가상 서버 서비스입니다.",
    definition:
      "Amazon Elastic Compute Cloud는 인스턴스라는 가상 서버를 실행하는 서비스입니다. 이미지·인스턴스 유형·가용 영역·네트워크·역할·스토리지를 선택하고 OS와 앱을 운영합니다. 서버를 실행할 수 있는 기반을 제공하는 것이며 앱의 배포·업데이트·가용성까지 자동 완성되는 것은 아닙니다.",
    useCases: [
      [
        "장기 실행 서버와 기존 앱",
        "OS·프로세스·드라이버·네트워크를 직접 제어해야 하는 웹·업무·배치 서비스를 실행합니다.",
      ],
      [
        "원하는 실행·자원 환경 구성",
        "CPU·메모리·네트워크·스토리지 요구에 맞는 실행 기반을 고르고 배포·확장·복구 체계를 연결합니다.",
      ],
    ],
    concepts: [
      [
        "AMI와 인스턴스",
        "AMI는 시작할 OS·파일 구성의 기반이고, 인스턴스는 실행 자원입니다. 이미지와 런타임 설정·실제 설치 상태를 구분합니다.",
      ],
      [
        "VPC·가용 영역·보안 그룹",
        "네트워크 경로·접근 허용·위치를 설계합니다. 포트를 열었다고 라우팅·앱 리스닝·인증이 모두 맞는 것은 아닙니다.",
      ],
      [
        "역할과 데이터 수명",
        "인스턴스 역할로 필요한 서비스 권한을 부여합니다. EBS·인스턴스 스토어·외부 저장의 데이터 수명과 종료·교체의 영향을 구분합니다.",
      ],
    ],
    flow: [
      ["이미지·위치·자원 선택", "AMI·유형·가용 영역과 네트워크를 정합니다."],
      ["OS·앱 실행", "역할·스토리지·설정·배포로 서비스를 준비합니다."],
      ["관측·교체·확장", "앱 상태·패치·백업·교체와 실패 복구를 운영합니다."],
    ],
    points: [
      [
        "인스턴스 상태와 서비스 준비를 구분",
        "인스턴스가 실행 중이어도 앱·DB·인증서·마운트가 준비되지 않았을 수 있습니다. 사용자 요청 기준의 상태 확인이 필요합니다.",
      ],
      [
        "권한·접근 경계를 최소화",
        "실행 역할·관리 접속·보안 그룹·비밀 값 전달을 분리합니다. 앱에 장기 키를 내장하는 방식과 인스턴스 역할을 구분합니다.",
      ],
      [
        "단일 서버를 가용성 설계로 보지 않기",
        "위치·복제본·데이터 보관·복구·배포 순서와 교체 가능성을 시험합니다. 인스턴스 크기만 키우는 결정과 실패 대응은 다릅니다.",
      ],
    ],
    diagnostics: [
      [
        "서버는 실행 중인데 접속되지 않음",
        "주소·라우팅·보안 그룹·OS 방화벽·리스닝 포트·앱 준비 상태를 단계별로 확인합니다.",
      ],
      [
        "인스턴스 교체 후 파일·설정이 사라짐",
        "AMI·시작 구성·EBS 종료 설정·인스턴스 스토어와 외부 데이터 위치를 확인합니다.",
      ],
    ],
    example: {
      title: "실행 자원과 위치 조회",
      description:
        "자격증명·리전·조회 권한이 있는 AWS CLI 환경의 읽기 예입니다.",
      language: "AWS CLI",
      code: "aws ec2 describe-instances \\\n  --query 'Reservations[].Instances[].{ID:InstanceId,State:State.Name,AZ:Placement.AvailabilityZone,Type:InstanceType}'",
      note: "리소스를 만들지 않는 조회입니다. 앱의 준비 상태·권한·보관 데이터·운영 품질까지 판단하는 명령은 아닙니다.",
    },
    sources: [
      [
        "AWS EC2 개념 공식 보존 문서",
        "https://github.com/awsdocs/amazon-ec2-user-guide/blob/master/doc_source/concepts.md",
        "확인한 인스턴스·이미지·네트워크·위치·보안 그룹. 현재 유형·한도·요금은 확인 필요.",
      ],
      [
        "AWS EBS 공식 보존 문서",
        "https://github.com/awsdocs/amazon-ec2-user-guide/blob/master/doc_source/ebs-volumes.md",
        "인스턴스와 스토리지의 연결·수명.",
      ],
    ],
    related: ["ebs", "efs", "lambda"],
    aliases: ["EC2", "아마존 EC2", "가상 머신", "VM"],
    logoSource:
      "https://github.com/awslabs/aws-icons-for-plantuml/blob/main/dist/Compute/EC2.png",
    logoAlt: "Amazon EC2 제품·프로젝트 심벌",
    logoNote: "AWS 제품 아이콘 · AWS Icons for PlantUML 원본 PNG",
  },
  {
    id: "lambda",
    name: "AWS Lambda",
    provider: "Amazon Web Services",
    category: "compute",
    type: "함수 실행 서비스",
    image: "lambda",
    summary:
      "요청·이벤트에 따라 함수를 호출하고 실행 환경과 동시 실행을 관리하는 AWS 서비스입니다.",
    definition:
      "Lambda는 함수 코드와 설정을 배포하고 요청·이벤트로 실행하는 컴퓨팅 서비스입니다. 호출 방식·이벤트 소스에 따라 전달·재시도·응답 계약이 다릅니다. 함수 실행 기반을 관리해 주지만 업무의 멱등성·하위 DB 용량·권한·오류·처리 제한 시간을 앱 대신 결정해 주지는 않습니다.",
    useCases: [
      [
        "이벤트 기반 후속 처리",
        "파일 업로드·메시지·일정 등에 반응해 검증·변환·연결 작업을 수행합니다. 각 이벤트 소스의 전달과 실패 방식을 확인합니다.",
      ],
      [
        "요청 단위의 API·작업",
        "호출 입력·출력·제한 시간·동시 실행·배포를 정해 함수로 처리합니다. HTTP API와 직접 함수 호출의 이벤트 형식은 다릅니다.",
      ],
    ],
    concepts: [
      [
        "동기·비동기·이벤트 소스",
        "직접 동기 호출·비동기 호출·이벤트 소스 매핑은 같은 재시도 계약이 아닙니다. 누가 호출과 재시도를 담당하는지 확인합니다.",
      ],
      [
        "실행 환경과 수명",
        "환경은 초기화 후 여러 호출에 재사용될 수 있지만 이를 항상 보장받는 상태 저장소로 보면 안 됩니다. 전역 캐시·연결 재사용과 영구 업무 상태를 구분합니다.",
      ],
      [
        "동시 실행·제한 시간·권한",
        "함수·계정의 실행 한도와 하위 서비스의 용량을 함께 설계합니다. 실행 역할·환경·비밀 값·timeout도 함수의 동작 조건입니다.",
      ],
    ],
    flow: [
      [
        "입력과 호출 경로 수신",
        "호출 주체·이벤트 형식·전달 방식을 확인합니다.",
      ],
      [
        "환경에서 Handler 실행",
        "필요한 초기화·권한·하위 호출로 업무를 수행합니다.",
      ],
      [
        "결과·오류·재처리",
        "호출 방식에 맞는 응답·오류·재시도·실패 보관을 연결합니다.",
      ],
    ],
    points: [
      [
        "중복 호출과 부분 성공을 설계",
        "같은 이벤트가 다시 전달될 수 있습니다. 이벤트·업무 식별자와 하위 DB·API의 멱등성, 처리 후 응답 전에 실패하는 경우를 다룹니다.",
      ],
      [
        "호출 성공 코드와 함수 오류를 구분",
        "Invoke API의 HTTP 상태가 함수 내부 업무 성공을 그대로 뜻하지는 않습니다. 함수 오류·로그·추적·이벤트 소스 결과를 함께 확인합니다.",
      ],
      [
        "자동 동시 실행이 하위 시스템을 압박할 수 있음",
        "함수 수만 늘면 DB 연결·API 제한·큐 대기가 더 나빠질 수 있습니다. 제한·버퍼·재시도 예산과 남은 실행 시간을 맞춥니다.",
      ],
    ],
    diagnostics: [
      [
        "같은 작업이 여러 번 반영됨",
        "이벤트 소스·호출 방식·재시도·부분 성공과 업무 멱등성 키를 확인합니다.",
      ],
      [
        "함수는 실행됐는데 상위 요청은 실패",
        "함수 오류·반환 형식·연동 API 계약·실행 시간·상위 클라이언트 timeout을 구분합니다.",
      ],
    ],
    example: {
      title: "직접 호출 입력을 검증하는 Handler",
      description: "Lambda의 Python 런타임에서 직접 호출하는 함수 예입니다.",
      language: "Python · Lambda Handler",
      code: 'def lambda_handler(event, context):\n    task_id = event.get("task_id")\n    if not isinstance(task_id, str) or not task_id:\n        raise ValueError("task_id is required")\n    return {"task_id": task_id, "request_id": context.aws_request_id}',
      note: "입력은 task_id를 가진 JSON 객체를 가정합니다. HTTP API 응답 형식·실제 업무·멱등성·재시도·영구 상태는 구현하지 않은 학습용 예입니다.",
    },
    sources: [
      [
        "AWS SDK Lambda Invoke 계약",
        "https://github.com/boto/botocore/blob/develop/botocore/data/lambda/2015-03-31/service-2.json",
        "확인한 동기·비동기 호출·중복·재시도·함수 오류와 호출 오류의 구분.",
      ],
      [
        "AWS Python Runtime Interface Client 원문",
        "https://github.com/aws/aws-lambda-python-runtime-interface-client/blob/main/awslambdaric/bootstrap.py",
        "여러 이벤트를 처리하는 런타임 루프·Handler 호출과 오류 처리.",
      ],
    ],
    related: ["ec2", "s3", "rabbitmq"],
    aliases: ["람다", "AWS 람다", "서버리스"],
    logoSource:
      "https://github.com/awslabs/aws-icons-for-plantuml/blob/main/dist/Compute/Lambda.png",
    logoAlt: "AWS Lambda 제품·프로젝트 심벌",
    logoNote: "AWS 제품 아이콘 · AWS Icons for PlantUML 원본 PNG",
  },
];
