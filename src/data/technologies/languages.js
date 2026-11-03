// Detailed profiles for the shared technology catalogue.
export const languagesTechnologies = [
  {
    id: "c",
    name: "C",
    provider: "ISO C 위원회 · 컴파일러 커뮤니티",
    category: "language",
    type: "시스템 프로그래밍 언어",
    summary:
      "포인터와 메모리 배치를 직접 다루며 운영체제·장치·네이티브 라이브러리를 구현하는 언어입니다.",
    definition:
      "C는 소스를 컴파일해 기계어 프로그램을 만드는 언어입니다. 배열·포인터·구조체로 메모리와 C ABI를 다루지만, 할당한 자원의 수명과 버퍼 범위를 작성자가 관리해야 합니다. 언어 규칙, 컴파일러 확장, 운영체제 API는 서로 다른 계약입니다.",
    useCases: [
      [
        "장치와 운영체제 경계",
        "임베디드 펌웨어·드라이버·시스템 라이브러리에서 메모리와 외부 인터페이스를 제어합니다.",
      ],
      [
        "다른 언어가 호출하는 기반",
        "DB·코덱·압축 모듈의 네이티브 API를 만들고 소유권·길이·오류 규약을 정의합니다.",
      ],
    ],
    concepts: [
      [
        "포인터와 유효 기간",
        "주소가 가리키는 객체가 살아 있는지와 접근 가능한 길이를 함께 추적해야 합니다.",
      ],
      [
        "정의되지 않은 동작",
        "범위 밖 접근·해제 후 사용 등은 실패 방식이 보장되지 않습니다. 최적화가 꺼져도 안전해지지 않습니다.",
      ],
      [
        "크기와 이식성",
        "sizeof·size_t·정수 폭·정렬·엔디언을 확인합니다. 포인터 크기와 파일 형식을 같은 규칙으로 저장하지 않습니다.",
      ],
    ],
    flow: [
      ["컴파일", "언어 모드·경고와 대상 플랫폼을 정해 번역합니다."],
      ["링크", "라이브러리와 심벌을 연결해 실행 파일을 만듭니다."],
      ["실행과 자원 회수", "범위를 검사하고 할당·파일·소켓의 수명을 끝냅니다."],
    ],
    points: [
      [
        "입력 길이를 경계에서 검사",
        "배열 크기·문자열 종료·곱셈 오버플로를 확인한 뒤 복사·할당합니다.",
      ],
      [
        "소유권을 API에 명시",
        "누가 할당하고 해제하는지, 오류 시 부분 자원을 어떻게 회수하는지 정합니다.",
      ],
      [
        "경고와 Sanitizer 활용",
        "AddressSanitizer·UBSan으로 실행 경로를 검사하되 모든 입력의 안전성이 증명되는 것은 아닙니다.",
      ],
    ],
    diagnostics: [
      [
        "가끔 다른 위치에서 충돌",
        "해제 후 사용·스택 주소 반환·버퍼 오염을 의심하고 재현 입력에 Sanitizer를 적용합니다.",
      ],
      [
        "플랫폼을 바꾸면 값이 달라짐",
        "정수 폭·형식 지정자·정렬·서명 있는 정수 오버플로와 컴파일 옵션을 확인합니다.",
      ],
    ],
    example: {
      title: "버퍼 범위를 검사한 복사",
      description:
        "C 표준 라이브러리만 사용하는 함수입니다. dst와 src의 메모리 영역은 겹치지 않아야 합니다.",
      language: "C",
      code: "#include <stddef.h>\n#include <string.h>\n\nint copy_bytes(void *dst, size_t capacity,\n               const void *src, size_t length) {\n    if (length > capacity) return -1;\n    if (length == 0) return 0;\n    if (dst == NULL || src == NULL) return -1;\n    memcpy(dst, src, length);\n    return 0;\n}",
      note: "포인터가 실제로 그 길이만큼 유효한지는 호출자의 계약입니다. 문자열 종료 문자를 자동으로 추가하지 않습니다.",
    },
    rationale: {
      short: "장치·메모리·기존 C 인터페이스를 직접 제어해야 할 때 필요합니다.",
      problem:
        "관리형 실행 환경이 제공하지 않는 장치 접근이나 네이티브 ABI를 구현해야 할 수 있습니다.",
      change: "주소·바이트·자원의 수명을 명시적으로 다루는 경계로 내려갑니다.",
      decisions: [
        {
          gainTitle: "낮은 계층과 연결",
          gain: "C ABI와 시스템 API를 통해 장치·네이티브 라이브러리에 연결합니다.",
          costTitle: "메모리 책임",
          cost: "범위·수명·해제를 직접 지켜야 합니다.",
        },
        {
          gainTitle: "실행 환경 선택",
          gain: "대상 장치에 맞춰 작게 컴파일할 수 있습니다.",
          costTitle: "이식성 점검",
          cost: "컴파일러·아키텍처별 차이를 검증해야 합니다.",
        },
      ],
      ask: "메모리 배치나 C ABI의 직접 제어가 실제 요구사항인가요?",
      simpler:
        "일반 업무 API라면 관리형 언어나 메모리 안전성을 제공하는 Rust부터 검토할 수 있습니다.",
    },
    related: ["cpp", "rust", "go"],
    aliases: ["씨 언어", "C언어", "시언어"],
    image: "c",
    sources: [
      [
        "C · UsersManual.rst",
        "https://github.com/llvm/llvm-project/blob/release/19.x/clang/docs/UsersManual.rst",
        "Clang 공식 보존 문서의 컴파일·언어 모드와 정의되지 않은 동작 진단. C 표준 자체와 컴파일러의 기능을 구분합니다.",
      ],
      [
        "C · UndefinedBehaviorSanitizer.rst",
        "https://github.com/llvm/llvm-project/blob/release/19.x/clang/docs/UndefinedBehaviorSanitizer.rst",
        "Clang 공식 보존 문서의 컴파일·언어 모드와 정의되지 않은 동작 진단. C 표준 자체와 컴파일러의 기능을 구분합니다.",
      ],
      [
        "C 공식 문서 · 추가 읽기",
        "https://www.open-std.org/jtc1/sc22/wg14/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/c/c-original.svg",
    logoAlt: "C 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "cpp",
    name: "C++",
    provider: "ISO C++ 위원회 · 컴파일러 커뮤니티",
    category: "language",
    type: "시스템·네이티브 언어",
    summary:
      "직접적인 자원 제어와 템플릿·객체 추상화를 결합해 네이티브 프로그램을 만드는 언어입니다.",
    definition:
      "C++는 컴파일 시점의 타입·템플릿과 실행 시점의 객체·자원 수명을 다루는 언어입니다. RAII로 자원 해제를 객체 수명에 연결하고 값·참조·이동을 구분합니다. 표준 라이브러리의 안전한 추상화를 쓰더라도 참조의 유효 기간과 동시 접근은 별도로 설계해야 합니다.",
    useCases: [
      [
        "게임·네이티브 엔진",
        "렌더링·물리·실시간 처리에서 자원 배치와 객체 수명을 제어합니다.",
      ],
      [
        "고성능 공용 라이브러리",
        "템플릿과 값 타입으로 재사용하면서 네이티브 호출 경계를 제공합니다.",
      ],
    ],
    concepts: [
      [
        "RAII와 소유권",
        "객체 소멸에 파일·메모리·락 해제를 연결합니다. unique_ptr와 shared_ptr의 소유 모델은 다릅니다.",
      ],
      [
        "이동과 빌린 참조",
        "move는 소유 자원을 옮기는 문맥이며 참조·span·string_view의 수명을 연장하지 않습니다.",
      ],
      [
        "컨테이너와 무효화",
        "vector 재할당 등으로 반복자·포인터·참조가 무효화될 수 있습니다. 연산별 규칙을 확인합니다.",
      ],
    ],
    flow: [
      ["타입과 소유 모델 정의", "값·참조·소유 포인터의 책임을 구분합니다."],
      ["컴파일·링크", "표준 버전과 라이브러리 ABI를 맞춥니다."],
      ["스코프 종료와 해제", "정상·예외 경로에서 소멸자가 자원을 회수합니다."],
    ],
    points: [
      [
        "raw 포인터의 의미 구분",
        "소유권을 이전하는지 잠시 빌리는지 API로 표현하고 불필요한 공유 소유를 피합니다.",
      ],
      [
        "예외 안전성 확인",
        "중간 실패가 기존 상태를 얼마나 보존하는지 정하고 소멸자가 예외를 던지지 않게 합니다.",
      ],
      [
        "데이터 경쟁 방지",
        "스마트 포인터가 가리키는 객체의 동시 변경까지 자동으로 안전해지는 것은 아닙니다.",
      ],
    ],
    diagnostics: [
      [
        "컨테이너 변경 후 잘못된 값",
        "재할당·삭제 뒤 남은 참조와 view의 유효 기간을 확인합니다.",
      ],
      [
        "종료 시 누수·충돌",
        "순환 shared_ptr·소멸 순서·이중 해제와 다른 모듈의 ABI 차이를 확인합니다.",
      ],
    ],
    example: {
      title: "자원 소유를 객체로 표현",
      description: "C++17 이상에서 컴파일하는 최소 예입니다.",
      language: "C++",
      code: "#include <memory>\n#include <vector>\n\nint main() {\n    auto values = std::make_unique<std::vector<int>>();\n    values->push_back(7);\n    return values->at(0) == 7 ? 0 : 1;\n}",
      note: "unique_ptr가 벡터 수명을 소유합니다. 공유 상태나 다중 스레드의 동기화를 설명하는 코드는 아닙니다.",
    },
    rationale: {
      short: "자원 제어와 큰 네이티브 코드의 추상화를 함께 다룰 때 필요합니다.",
      problem:
        "장치·메모리를 다루는 코드가 커지면 수동 해제와 반복 구현만으로 관리하기 어렵습니다.",
      change: "타입·컨테이너·RAII로 자원 규칙을 추상화에 담습니다.",
      decisions: [
        {
          gainTitle: "수명에 연결한 회수",
          gain: "RAII로 예외 경로에도 자원 정리를 연결합니다.",
          costTitle: "빌림의 수명",
          cost: "포인터·view의 유효 기간을 계속 지켜야 합니다.",
        },
        {
          gainTitle: "컴파일 시 추상화",
          gain: "템플릿으로 타입별 코드를 구성합니다.",
          costTitle: "빌드 복잡성",
          cost: "컴파일 시간·오류 메시지·ABI와 표준 버전을 관리합니다.",
        },
      ],
      ask: "네이티브 성능 요구와 라이브러리 자산이 복잡성보다 큰가요?",
      simpler:
        "작은 도구는 Go·Python으로 시작하고 메모리 안전성이 중요하면 Rust도 비교하세요.",
    },
    related: ["c", "rust", "swift"],
    aliases: ["씨플러스플러스", "C plus plus", "CPP"],
    image: "cpp",
    sources: [
      [
        'C++ · a name="main"/aC++ Core Guidelines',
        "https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md",
        "ISO C++ 커뮤니티 지침의 자원 수명·RAII·소유권·참조·동시성. 표준 문법의 규범 문서와 구분합니다.",
      ],
      [
        "C++ 공식 문서 · 추가 읽기",
        "https://isocpp.org/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/cplusplus/cplusplus-original.svg",
    logoAlt: "C++ 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "csharp",
    name: "C#",
    provider: "Microsoft · .NET 커뮤니티",
    category: "language",
    type: ".NET 프로그래밍 언어",
    summary:
      "정적 타입과 .NET 실행 환경에서 웹·업무 서비스·데스크톱·게임 로직을 작성하는 언어입니다.",
    definition:
      "C#은 값 타입·참조 타입·제네릭과 async/await를 제공하는 언어입니다. .NET 런타임과 기본 라이브러리 위에서 실행하며 ASP.NET Core는 그 위의 웹 프레임워크입니다. nullable 참조 표시는 정적 분석을 돕지만 외부 입력의 실행 중 검증을 대체하지 않습니다.",
    useCases: [
      [
        "업무 API와 서비스",
        "ASP.NET Core와 함께 타입이 있는 요청·업무 규칙·비동기 입출력을 작성합니다.",
      ],
      [
        "데스크톱·게임 로직",
        "플랫폼별 UI나 엔진과 연결합니다. 언어가 모든 플랫폼 API를 통일하는 것은 아닙니다.",
      ],
    ],
    concepts: [
      [
        "값 타입과 참조 타입",
        "struct의 값 복사와 class 참조 공유를 구분합니다. readonly만으로 내부 객체 전체가 불변이 되지는 않습니다.",
      ],
      [
        "Task와 비동기 입출력",
        "await는 완료를 기다리는 흐름입니다. CPU 계산을 자동으로 새 스레드로 보내지 않습니다.",
      ],
      [
        "nullable와 자원 수명",
        "null 분석과 using/IDisposable의 명시적 자원 해제를 함께 사용합니다. GC가 파일·소켓 정리 시점을 정해주지는 않습니다.",
      ],
    ],
    flow: [
      ["타입 검사와 빌드", "프로젝트의 대상 .NET과 nullable 정책을 정합니다."],
      ["실행·비동기 대기", "런타임에서 요청·입출력·작업 완료를 연결합니다."],
      [
        "취소와 자원 정리",
        "CancellationToken을 전달하고 IDisposable을 해제합니다.",
      ],
    ],
    points: [
      [
        "동기 대기로 막지 않기",
        "서버 코드에서 .Result·Wait로 비동기 호출을 막지 말고 호출 경로에 await를 이어갑니다.",
      ],
      [
        "취소를 아래까지 전달",
        "시간 초과와 사용자 취소를 네트워크·DB API에 전달하고 오류와 구분합니다.",
      ],
      [
        "외부 경계의 검증 유지",
        "타입·nullable 선언이 JSON·DB의 실제 값과 권한을 검증하지는 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "동시 요청이 늘면 지연 급증",
        "동기 대기·블로킹 호출·스레드 풀 적체와 GC 지표를 구분합니다.",
      ],
      [
        "응답 뒤 자원 사용 오류",
        "범위를 벗어난 disposable 객체·취소 토큰과 scoped 서비스 수명을 확인합니다.",
      ],
    ],
    example: {
      title: "비동기 HTTP와 자원 해제",
      description:
        "현대 .NET의 함수 예이며 System.Net.Http·System.Threading 네임스페이스가 필요합니다.",
      language: "C#",
      code: "static async Task<string> LoadAsync(\n    HttpClient http, Uri url, CancellationToken ct)\n{\n    using var response = await http.GetAsync(url, ct);\n    response.EnsureSuccessStatusCode();\n    return await response.Content.ReadAsStringAsync(ct);\n}",
      note: "HttpClient의 수명은 호출자가 관리합니다. HTTP 상태 검사와 요청 취소를 포함하며 재시도 정책은 별도입니다.",
    },
    rationale: {
      short:
        "정적 타입과 .NET 생태계로 업무 로직을 일관되게 구성할 때 필요합니다.",
      problem:
        "큰 서비스에서 값의 계약·비동기 호출·라이브러리 연결을 함께 관리해야 합니다.",
      change:
        "언어의 타입 검사와 런타임·웹 프레임워크의 역할을 분리해 사용합니다.",
      decisions: [
        {
          gainTitle: "타입과 도구 지원",
          gain: "정적 분석·IDE·.NET 라이브러리를 함께 활용합니다.",
          costTitle: "실행 환경 관리",
          cost: ".NET 대상 버전과 배포 방식을 맞춰야 합니다.",
        },
        {
          gainTitle: "비동기 흐름 표현",
          gain: "Task·await·취소를 조합합니다.",
          costTitle: "수명과 동기 대기",
          cost: "GC 밖의 자원과 블로킹 호출을 관리해야 합니다.",
        },
      ],
      ask: ".NET 라이브러리와 운영 경험이 요구사항에 맞나요?",
      simpler:
        "작은 HTTP 서비스는 익숙한 언어로 시작하고 필요한 생태계가 생길 때 비교하세요.",
    },
    related: ["aspnetcore", "java", "kotlin"],
    aliases: ["씨샵", "C Sharp", "CSharp", "닷넷 언어"],
    image: "csharp",
    sources: [
      [
        "C# · The C# type system",
        "https://github.com/dotnet/docs/blob/main/docs/csharp/fundamentals/types/index.md",
        "C# 타입 모델과 Task·async/await 기반 비동기 처리의 공식 원문.",
      ],
      [
        "C# · Asynchronous programming",
        "https://github.com/dotnet/docs/blob/main/docs/csharp/asynchronous-programming/index.md",
        "C# 타입 모델과 Task·async/await 기반 비동기 처리의 공식 원문.",
      ],
      [
        "C# 공식 문서 · 추가 읽기",
        "https://learn.microsoft.com/dotnet/csharp/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/csharp/csharp-original.svg",
    logoAlt: "C# 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "kotlin",
    name: "Kotlin",
    provider: "JetBrains · Kotlin 커뮤니티",
    category: "language",
    type: "정적 타입·멀티플랫폼 언어",
    summary:
      "null 안전성과 간결한 타입 표현으로 Android·JVM 서버·멀티플랫폼 로직을 작성하는 언어입니다.",
    definition:
      "Kotlin은 JVM·JavaScript·네이티브 등의 대상을 지원하는 언어입니다. nullable 타입과 스마트 캐스트를 제공하며 코루틴은 별도 라이브러리와 실행 문맥을 통해 사용합니다. 공유할 수 있는 업무 코드와 각 플랫폼의 UI·API·라이브러리 지원 범위를 구분해야 합니다.",
    useCases: [
      [
        "Android와 JVM 서버",
        "기존 Java 라이브러리를 활용하며 타입이 있는 앱·서버 로직을 작성합니다.",
      ],
      [
        "플랫폼 사이의 업무 코드 공유",
        "멀티플랫폼 모듈로 모델과 로직을 나누고 플랫폼별 구현을 연결합니다.",
      ],
    ],
    concepts: [
      [
        "nullable와 스마트 캐스트",
        "String?은 null 가능성을 표시합니다. Java 플랫폼 타입과 !! 단언은 여전히 실행 중 오류를 만들 수 있습니다.",
      ],
      [
        "구조화된 코루틴",
        "부모 스코프 아래 작업의 수명·취소를 묶습니다. suspend만 붙여도 블로킹 작업이 이동하는 것은 아닙니다.",
      ],
      [
        "data class와 복사",
        "copy는 일반적으로 얕은 복사입니다. 내부의 변경 가능한 컬렉션이 공유될 수 있습니다.",
      ],
    ],
    flow: [
      ["대상·의존성 선택", "JVM·Android·공유 모듈의 지원 범위를 정합니다."],
      ["타입 검사·컴파일", "null 처리와 함수의 계약을 검사합니다."],
      ["스코프 안에서 실행", "호출과 코루틴의 취소·완료를 관리합니다."],
    ],
    points: [
      [
        "스코프 수명을 화면·요청에 연결",
        "취소된 화면의 작업이 계속 남지 않도록 합니다. GlobalScope를 기본 선택으로 삼지 않습니다.",
      ],
      [
        "공유 변경 상태 경계 설정",
        "코루틴도 같은 객체를 바꾸면 경쟁할 수 있습니다. 불변 값·Mutex·원자 연산을 검토합니다.",
      ],
      [
        "플랫폼별 호환성 확인",
        "공통 소스에 들어갈 API와 플랫폼 전용 API를 구분하고 대상별 빌드를 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "suspend 함수인데 화면이 멈춤",
        "내부의 블로킹 호출과 CPU 계산, Dispatcher 선택을 확인합니다.",
      ],
      [
        "null 예외가 예상 밖에서 발생",
        "!!·Java 플랫폼 타입·외부 역직렬화의 실제 값을 확인합니다.",
      ],
    ],
    example: {
      title: "nullable 입력에서 표시 이름 만들기",
      description: "Kotlin 표준 라이브러리만 사용하는 함수입니다.",
      language: "Kotlin",
      code: 'data class User(val name: String?)\n\nfun displayName(user: User): String =\n    user.name?.trim()?.takeIf { it.isNotEmpty() }\n        ?: "이름 없음"',
      note: "입력 검증과 권한 검사는 별도입니다. data class가 내부 객체까지 불변으로 만드는 것은 아닙니다.",
    },
    rationale: {
      short:
        "JVM 자산을 활용하면서 null 처리와 비동기 작업 수명을 명시할 때 유용합니다.",
      problem:
        "모바일·서버 코드에서 null 분기와 수명이 제각각인 비동기 작업이 늘어납니다.",
      change: "타입의 null 가능성과 스코프의 작업 수명으로 계약을 드러냅니다.",
      decisions: [
        {
          gainTitle: "기존 Java와 연결",
          gain: "JVM 라이브러리와 점진적으로 함께 쓸 수 있습니다.",
          costTitle: "경계의 타입 차이",
          cost: "플랫폼 타입과 언어 사이의 계약을 확인해야 합니다.",
        },
        {
          gainTitle: "작업 수명 조직",
          gain: "코루틴의 완료와 취소를 묶습니다.",
          costTitle: "경쟁·블로킹 관리",
          cost: "Dispatcher와 공유 상태는 직접 설계합니다.",
        },
      ],
      ask: "JVM 호환성과 공유 코드의 범위가 실제 이점인가요?",
      simpler:
        "Java 기반 서비스가 단순하다면 기존 언어로 시작하고 한 모듈부터 비교하세요.",
    },
    related: ["java", "spring-boot", "flutter"],
    aliases: ["코틀린", "KMP", "Kotlin Multiplatform"],
    image: "kotlin",
    sources: [
      [
        "Kotlin · null-safety.md",
        "https://github.com/JetBrains/kotlin-web-site/blob/master/docs/topics/null-safety.md",
        "nullable·스마트 캐스트와 kotlinx.coroutines의 스코프·중단·실행 문맥.",
      ],
      [
        "Kotlin · coroutines-basics.md",
        "https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/topics/coroutines-basics.md",
        "nullable·스마트 캐스트와 kotlinx.coroutines의 스코프·중단·실행 문맥.",
      ],
      [
        "Kotlin 공식 문서 · 추가 읽기",
        "https://kotlinlang.org/docs/home.html",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/kotlin/kotlin-original.svg",
    logoAlt: "Kotlin 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "swift",
    name: "Swift",
    provider: "Swift.org · Apple과 Swift 기여자",
    category: "language",
    type: "앱·시스템 프로그래밍 언어",
    summary:
      "정적 타입·값 타입·ARC와 구조화된 동시성으로 앱과 네이티브 로직을 만드는 언어입니다.",
    definition:
      "Swift는 struct·enum·protocol과 메모리·동시성 규칙을 제공하는 컴파일 언어입니다. class 인스턴스는 ARC로 수명을 추적하며 actor와 Sendable은 공유 상태의 격리를 표현합니다. SwiftUI·UIKit은 별도 UI 프레임워크이고 언어의 async 호출은 특정 스레드를 보장하지 않습니다.",
    useCases: [
      [
        "Apple 플랫폼 앱",
        "플랫폼 SDK·SwiftUI·UIKit과 연결해 앱의 모델과 동작을 작성합니다.",
      ],
      [
        "공유 패키지·서버·도구",
        "Swift 패키지로 로직을 분리합니다. 운영체제와 SDK별 API 가용성을 확인합니다.",
      ],
    ],
    concepts: [
      [
        "값 타입과 참조 타입",
        "struct의 값 의미와 class의 공유 참조를 구분합니다. 내부 참조까지 자동으로 깊게 복사되는 것은 아닙니다.",
      ],
      [
        "ARC와 강한 참조 순환",
        "서로 참조하는 객체·클로저가 해제되지 않을 수 있어 weak와 소유 관계를 설계합니다.",
      ],
      [
        "actor의 격리와 재진입",
        "actor는 상태 접근을 격리하지만 await로 멈춘 사이 다른 작업이 들어올 수 있습니다. 가정한 상태를 다시 확인합니다.",
      ],
    ],
    flow: [
      [
        "타입·격리 검사",
        "플랫폼과 언어 모드에 맞춰 타입·동시성 계약을 확인합니다.",
      ],
      ["비동기 작업 실행", "Task와 actor를 통해 수명·격리된 상태를 다룹니다."],
      ["완료·취소·메모리 회수", "작업 취소를 처리하고 강한 참조를 끊습니다."],
    ],
    points: [
      [
        "UI 격리와 작업을 구분",
        "MainActor에서 긴 계산·동기 입출력을 실행하면 UI가 멈출 수 있습니다.",
      ],
      [
        "취소를 완료와 구분",
        "취소 요청 뒤에도 작업이 즉시 사라지는 것은 아닙니다. 중간 확인과 정리 경로가 필요합니다.",
      ],
      [
        "버전·플랫폼 조건 명시",
        "SDK 가용성·언어 모드·Sendable 검사의 범위를 함께 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "화면을 닫아도 객체가 남음",
        "클로저 캡처·델리게이트·Task 보유 관계와 deinit 실행 여부를 확인합니다.",
      ],
      [
        "await 전후 상태가 달라짐",
        "actor 재진입과 취소·수신 순서, 상태 재검증이 필요한 지점을 봅니다.",
      ],
    ],
    example: {
      title: "actor 안에서 카운터 상태 격리",
      description:
        "actor를 지원하는 Swift의 타입 예제입니다. 외부 호출은 비동기 문맥에서 await로 합니다.",
      language: "Swift",
      code: "actor Counter {\n    private var value = 0\n\n    func increment() -> Int {\n        value += 1\n        return value\n    }\n}",
      note: "메서드 안에 중단 지점이 없는 단일 상태 변경입니다. 네트워크 순서·영속 저장·여러 actor의 원자성을 보장하는 예제는 아닙니다.",
    },
    rationale: {
      short:
        "플랫폼 API와 연결하면서 메모리 소유권·공유 상태의 계약을 표현할 때 필요합니다.",
      problem:
        "앱의 객체 수명과 비동기 작업이 얽히면 누수와 상태 경쟁을 찾기 어렵습니다.",
      change: "값·참조·격리된 실행 문맥으로 책임을 나눕니다.",
      decisions: [
        {
          gainTitle: "플랫폼과 타입 지원",
          gain: "네이티브 SDK와 정적 검사를 활용합니다.",
          costTitle: "SDK·언어 모드",
          cost: "지원 대상과 동시성 규칙을 맞춰야 합니다.",
        },
        {
          gainTitle: "공유 상태 격리",
          gain: "actor로 접근 경계를 드러냅니다.",
          costTitle: "중단 이후의 상태",
          cost: "재진입·취소·외부 부수 효과를 설계합니다.",
        },
      ],
      ask: "플랫폼별 UI·장치 기능과 공유 코드 중 무엇이 더 중요한가요?",
      simpler:
        "크로스플랫폼 UI가 우선이면 Flutter·React Native와 플랫폼 기능 요구를 비교하세요.",
    },
    related: ["kotlin", "flutter", "react-native"],
    aliases: ["스위프트", "Swift 언어"],
    image: "swift",
    sources: [
      [
        "Swift · Automatic Reference Counting",
        "https://github.com/swiftlang/swift-book/blob/main/TSPL.docc/LanguageGuide/AutomaticReferenceCounting.md",
        "Swift 공식 언어 안내의 ARC·강한 참조와 동시성·actor의 경계.",
      ],
      [
        "Swift · Concurrency",
        "https://github.com/swiftlang/swift-book/blob/main/TSPL.docc/LanguageGuide/Concurrency.md",
        "Swift 공식 언어 안내의 ARC·강한 참조와 동시성·actor의 경계.",
      ],
      [
        "Swift 공식 문서 · 추가 읽기",
        "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/swift/swift-original.svg",
    logoAlt: "Swift 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "dart",
    name: "Dart",
    provider: "Google · Dart 커뮤니티",
    category: "language",
    type: "앱·클라이언트 언어",
    summary:
      "정적 타입·null 안전성과 비동기 기능으로 Flutter 앱과 클라이언트 로직을 작성하는 언어입니다.",
    definition:
      "Dart는 VM·네이티브·웹 대상의 실행과 컴파일을 지원합니다. Future·Stream은 비동기 결과를, isolate는 분리된 실행 상태와 메시지 전달을 표현합니다. Flutter는 Dart 위의 UI 도구이며 모든 Dart 대상에서 isolate와 플랫폼 API의 지원이 같지는 않습니다.",
    useCases: [
      [
        "Flutter의 화면·업무 로직",
        "위젯과 분리한 모델·비동기 요청·사용자 동작을 작성합니다.",
      ],
      [
        "비동기 처리와 계산 분리",
        "입출력의 완료를 기다리거나 지원되는 대상에서 무거운 계산을 isolate로 나눕니다.",
      ],
    ],
    concepts: [
      [
        "null 안전성",
        "nullable 여부를 타입에 표현합니다. ! 단언·외부 데이터 해석은 실행 중 실패할 수 있습니다.",
      ],
      [
        "Future·Stream과 이벤트 루프",
        "await는 비동기 흐름을 표현하며 긴 동기 계산을 분리해주지는 않습니다.",
      ],
      [
        "isolate의 메시지 경계",
        "isolate는 일반적인 공유 메모리 스레드와 다릅니다. 전달 가능한 값과 복사·전달 비용을 확인합니다.",
      ],
    ],
    flow: [
      ["타입·대상 확인", "네이티브·웹 대상과 패키지의 지원을 정합니다."],
      ["이벤트·비동기 작업 처리", "Future·Stream의 결과와 오류를 연결합니다."],
      [
        "분리 작업·구독 정리",
        "isolate와 구독·플랫폼 자원의 수명을 마무리합니다.",
      ],
    ],
    points: [
      [
        "큰 계산을 await로 감추지 않기",
        "JSON 처리·정렬이 이벤트 루프에서 오래 실행되는지 먼저 측정합니다.",
      ],
      [
        "웹과 VM 차이 확인",
        "isolate·파일·플랫폼 플러그인이 대상 환경에서 가능한지 확인합니다.",
      ],
      [
        "취소·구독의 책임 명시",
        "화면이 사라질 때 Stream 구독·타이머·플랫폼 객체를 정리합니다.",
      ],
    ],
    diagnostics: [
      [
        "로딩 중 애니메이션이 끊김",
        "await 사이에서 실행하는 큰 동기 계산을 확인합니다.",
      ],
      [
        "다른 대상에서 패키지 실행 실패",
        "네이티브 전용 import·플러그인·isolate 지원을 확인합니다.",
      ],
    ],
    example: {
      title: "별도 isolate에서 합계 계산",
      description: "Isolate.run을 지원하는 Dart 네이티브 실행 환경의 예입니다.",
      language: "Dart",
      code: "import 'dart:isolate';\n\nFuture<int> sumAway(List<int> values) =>\n    Isolate.run(() => values.fold<int>(0, (sum, n) => sum + n));",
      note: "리스트를 넘기는 비용과 작업 크기를 비교해야 합니다. 브라우저 대상의 병렬 실행 API를 대신하는 코드는 아닙니다.",
    },
    rationale: {
      short:
        "앱의 비동기 로직을 표현하고 Flutter와 같은 UI 생태계를 활용할 때 필요합니다.",
      problem:
        "화면을 반응하게 유지하면서 입출력과 계산, 플랫폼별 기능을 연결해야 합니다.",
      change: "Future·Stream·분리된 실행 상태로 완료와 작업 경계를 표현합니다.",
      decisions: [
        {
          gainTitle: "UI 생태계와 연결",
          gain: "Flutter와 타입이 있는 앱 로직을 공유합니다.",
          costTitle: "플랫폼 차이",
          cost: "패키지·네이티브 API·실행 대상별 지원을 확인합니다.",
        },
        {
          gainTitle: "계산 분리",
          gain: "지원되는 환경에서 isolate로 상태를 나눕니다.",
          costTitle: "전달 비용",
          cost: "값 복사와 작업 시작 비용을 감수합니다.",
        },
      ],
      ask: "공유할 UI와 플랫폼 기능이 Dart·Flutter 생태계에 맞나요?",
      simpler:
        "작은 웹 화면은 기존 웹 도구로 시작하고 네이티브 UI가 필요할 때 비교하세요.",
    },
    related: ["flutter", "kotlin", "swift"],
    aliases: ["다트", "Dart 언어"],
    image: "dart",
    sources: [
      [
        "Dart · Sound null safety",
        "https://github.com/dart-lang/site-www/blob/main/src/content/null-safety/index.md",
        "Dart의 null 안전성·이벤트 루프·Future와 isolate의 상태 분리.",
      ],
      [
        "Dart · Concurrency in Dart",
        "https://github.com/dart-lang/site-www/blob/main/src/content/language/concurrency.md",
        "Dart의 null 안전성·이벤트 루프·Future와 isolate의 상태 분리.",
      ],
      [
        "Dart 공식 문서 · 추가 읽기",
        "https://dart.dev/language",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/dart/dart-original.svg",
    logoAlt: "Dart 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "ruby",
    name: "Ruby",
    provider: "Ruby Core Team · Ruby 커뮤니티",
    category: "language",
    type: "동적 객체지향 언어",
    summary:
      "객체·블록·Enumerable과 유연한 문법으로 업무 로직과 자동화·웹 애플리케이션을 작성하는 언어입니다.",
    definition:
      "Ruby는 동적 타입과 객체 중심 모델을 제공하는 언어입니다. 블록·모듈·메타프로그래밍으로 API와 DSL을 구성할 수 있습니다. Rails는 별도 웹 프레임워크이고 CRuby의 GVL 같은 실행 특성을 모든 Ruby 구현의 언어 규칙으로 일반화해서는 안 됩니다.",
    useCases: [
      [
        "웹 업무 로직",
        "Rails 등의 프레임워크에서 도메인 규칙과 데이터 처리를 표현합니다.",
      ],
      [
        "자동화·내부 도구",
        "텍스트·파일·반복 작업을 블록과 라이브러리로 조합합니다.",
      ],
    ],
    concepts: [
      [
        "덕 타이핑과 계약",
        "구체적인 상속보다 제공하는 메서드를 활용합니다. 잘못된 입력은 테스트·검증으로 경계에서 잡아야 합니다.",
      ],
      [
        "블록과 Enumerable",
        "map·select·reduce·sum 등으로 컬렉션 처리를 표현합니다. 지연 평가와 실제 순회 시점을 구분합니다.",
      ],
      [
        "참조 공유와 실행 환경",
        "동일한 변경 가능 객체가 공유될 수 있습니다. CRuby의 스레드와 CPU 병렬성은 구현별로 확인합니다.",
      ],
    ],
    flow: [
      ["객체·메서드 구성", "모듈과 객체가 제공할 동작을 정합니다."],
      ["호출·블록 실행", "실행 중 메서드를 찾고 컬렉션·입출력을 처리합니다."],
      ["오류와 자원 정리", "예외·ensure와 블록 기반 자원 관리를 연결합니다."],
    ],
    points: [
      [
        "메타프로그래밍의 범위 제한",
        "동적으로 만든 메서드가 계약·탐색·오류 추적을 어렵게 하는지 확인합니다.",
      ],
      [
        "프레임워크 비용을 언어와 구분",
        "DB N+1·직렬화·외부 요청과 Ruby 계산의 비용을 나눠 관찰합니다.",
      ],
      [
        "정수 금액·입력 검증",
        "외부 문자열·키 누락을 검증하고 금액을 부동소수점으로 단순 합산하지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "요청마다 DB 질의가 과도함",
        "ORM의 지연 로딩과 반복문 안의 질의를 봅니다. 언어 변경보다 질의 경로부터 확인합니다.",
      ],
      [
        "스레드를 늘려도 계산이 안 빨라짐",
        "실행 구현의 GVL·CPU 병목·프로세스 분리와 공유 객체를 확인합니다.",
      ],
    ],
    example: {
      title: "누락 키를 드러내는 금액 합계",
      description: "Ruby 표준 기능으로 최소 화폐 단위 정수를 합산합니다.",
      language: "Ruby",
      code: "def total_cents(items)\n  items.sum { |item| Integer(item.fetch(:cents)) }\nend\n\np total_cents([{ cents: 1200 }, { cents: 800 }])",
      note: "Integer 변환·키 누락의 오류는 호출자가 처리해야 합니다. 세금·환율·통화 규칙은 별도입니다.",
    },
    rationale: {
      short:
        "업무 규칙과 내부 도구를 간결한 객체·블록 API로 표현할 때 유용합니다.",
      problem: "반복 코드가 많고 도메인의 표현을 빠르게 바꿔야 할 수 있습니다.",
      change: "객체와 블록·모듈로 도메인에 가까운 API를 구성합니다.",
      decisions: [
        {
          gainTitle: "표현과 반복 작업",
          gain: "블록·라이브러리로 로직을 짧게 조합합니다.",
          costTitle: "실행 중 계약",
          cost: "입력·메서드 계약을 테스트와 검증으로 지켜야 합니다.",
        },
        {
          gainTitle: "프레임워크 생태계",
          gain: "Rails와 검증된 라이브러리를 활용합니다.",
          costTitle: "실행·질의 비용",
          cost: "구현의 병렬성·ORM·메모리를 측정해야 합니다.",
        },
      ],
      ask: "팀의 Ruby 경험과 라이브러리 자산이 서비스 운영 요구에 맞나요?",
      simpler: "기존 언어가 있다면 작은 자동화나 모듈부터 비교할 수 있습니다.",
    },
    related: ["rails", "python", "php"],
    aliases: ["루비", "Ruby 언어"],
    image: "ruby",
    sources: [
      [
        "Ruby · methods.rdoc",
        "https://github.com/ruby/ruby/blob/master/doc/syntax/methods.rdoc",
        "Ruby 프로젝트의 메서드·블록과 실행 구현 원문. 구현별 스레드 특성을 언어 전체의 보장으로 일반화하지 않습니다.",
      ],
      [
        "Ruby · thread.c",
        "https://github.com/ruby/ruby/blob/master/thread.c",
        "Ruby 프로젝트의 메서드·블록과 실행 구현 원문. 구현별 스레드 특성을 언어 전체의 보장으로 일반화하지 않습니다.",
      ],
      [
        "Ruby 공식 문서 · 추가 읽기",
        "https://www.ruby-lang.org/en/documentation/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/ruby/ruby-original.svg",
    logoAlt: "Ruby 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "php",
    name: "PHP",
    provider: "The PHP Group · PHP 커뮤니티",
    category: "language",
    type: "서버 웹 프로그래밍 언어",
    summary:
      "HTTP 요청의 서버 로직·템플릿·웹 애플리케이션을 작성하는 언어입니다.",
    definition:
      "PHP는 웹 서버와 PHP-FPM 같은 실행 경로, 또는 CLI에서 사용할 수 있는 언어입니다. 타입 선언·예외·객체와 표준 라이브러리를 제공하며 Laravel은 별도 프레임워크입니다. 요청마다 시작·종료하는 배포와 장시간 살아 있는 워커는 상태·자원 수명 조건이 다릅니다.",
    useCases: [
      [
        "서버 렌더링·API",
        "요청의 입력을 해석하고 DB·템플릿·응답을 연결합니다.",
      ],
      [
        "워커·운영 스크립트",
        "큐 소비나 배치 작업을 CLI로 실행하되 긴 프로세스의 상태를 관리합니다.",
      ],
    ],
    concepts: [
      [
        "타입 선언과 strict_types",
        "선언된 스칼라 인수의 변환 정책을 이해하고 파일·호출 경계를 확인합니다. 모든 입력 검증을 대신하지 않습니다.",
      ],
      [
        "배열과 객체",
        "PHP 배열은 키·값 자료구조입니다. 객체 참조 공유와 배열의 복사 동작을 같은 것으로 보지 않습니다.",
      ],
      [
        "요청·워커 수명",
        "웹 요청 뒤 정리되는 상태와 재사용되는 워커의 상태를 구분하고 연결·메모리를 관리합니다.",
      ],
    ],
    flow: [
      ["요청·CLI 입력 수신", "입력의 형식과 접근 권한을 검사합니다."],
      ["업무 로직과 입출력", "함수·객체에서 DB·파일·외부 API를 호출합니다."],
      ["응답·작업 완료", "오류를 응답에 매핑하고 자원을 정리합니다."],
    ],
    points: [
      [
        "SQL과 출력의 경계 보호",
        "매개변수 질의와 문맥별 출력 이스케이프를 적용합니다. 타입 선언만으로 주입 공격이 사라지지 않습니다.",
      ],
      [
        "타입 강제 변환 확인",
        "외부 문자열·null·숫자 표현을 명시적으로 검증합니다.",
      ],
      [
        "긴 워커 상태 분리",
        "이전 요청의 사용자 상태와 자원·메모리가 다음 작업에 남지 않게 합니다.",
      ],
    ],
    diagnostics: [
      [
        "특정 입력만 잘못된 값이 됨",
        "느슨한 비교·형 변환·빈 문자열과 null의 분기를 확인합니다.",
      ],
      [
        "워커를 오래 띄우면 메모리가 증가",
        "보관한 객체·정적 상태·연결과 작업 후 정리 경로를 점검합니다.",
      ],
    ],
    example: {
      title: "정수 값의 범위를 계약으로 표현",
      description: "PHP 함수 예제이며 웹 서버·프레임워크가 필요하지 않습니다.",
      language: "PHP",
      code: '<?php\ndeclare(strict_types=1);\n\nfunction pageSize(int $value): int {\n    if ($value < 1 || $value > 100) {\n        throw new InvalidArgumentException("범위를 벗어남");\n    }\n    return $value;\n}\necho pageSize(20);',
      note: "HTTP 문자열 입력을 이 함수에 넘기기 전 형식 검증이 필요합니다. strict_types는 권한·업무 규칙을 검증하지 않습니다.",
    },
    rationale: {
      short:
        "서버에서 웹 요청과 업무 데이터를 처리하는 생태계가 필요할 때 사용합니다.",
      problem: "템플릿·폼·DB·API를 연결하는 웹 서버 로직을 작성해야 합니다.",
      change: "PHP 실행 경로와 프레임워크를 조합해 요청을 처리합니다.",
      decisions: [
        {
          gainTitle: "웹 생태계",
          gain: "호스팅·프레임워크·기존 앱 자산을 활용합니다.",
          costTitle: "실행 방식 차이",
          cost: "FPM 요청 모델과 지속 워커의 수명을 구분합니다.",
        },
        {
          gainTitle: "점진적 타입 사용",
          gain: "기존 코드에 타입 선언을 더할 수 있습니다.",
          costTitle: "입력 검증 책임",
          cost: "강제 변환과 외부 경계를 별도로 검사합니다.",
        },
      ],
      ask: "기존 PHP 자산과 요청·워커 운영 방식이 요구에 맞나요?",
      simpler:
        "단순한 서비스는 익숙한 언어로 시작하고 기존 생태계를 활용할 이유를 비교하세요.",
    },
    related: ["laravel", "ruby", "python"],
    aliases: ["피에이치피", "PHP 언어"],
    image: "php",
    sources: [
      [
        "PHP · type-system.xml",
        "https://github.com/php/doc-en/blob/master/language/types/type-system.xml",
        "PHP 공식 매뉴얼 원본의 타입 시스템·객체 모델.",
      ],
      [
        "PHP · basic.xml",
        "https://github.com/php/doc-en/blob/master/language/oop5/basic.xml",
        "PHP 공식 매뉴얼 원본의 타입 시스템·객체 모델.",
      ],
      [
        "PHP 공식 문서 · 추가 읽기",
        "https://www.php.net/manual/en/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/php/php-original.svg",
    logoAlt: "PHP 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "elixir",
    name: "Elixir",
    provider: "Elixir Core Team · Elixir 커뮤니티",
    category: "language",
    type: "BEAM 기반 함수형 언어",
    summary:
      "불변 데이터·경량 프로세스·OTP로 메시지를 주고받는 동시 서비스 로직을 작성하는 언어입니다.",
    definition:
      "Elixir는 Erlang VM인 BEAM 위에서 동작하며 OTP의 서버·감독 트리 도구를 사용합니다. 프로세스마다 상태와 메시지함을 나누고 패턴 매칭으로 처리합니다. 프로세스 재시작이 외부 DB의 상태나 이미 발생한 부수 효과를 되돌리는 것은 아닙니다.",
    useCases: [
      [
        "연결·상태가 많은 서비스",
        "사용자 세션·실시간 방·작업 조정처럼 독립된 상태를 프로세스로 표현합니다.",
      ],
      [
        "장애를 분리한 워커",
        "감독 트리 아래 작업 프로세스를 두고 재시작 정책과 상태 복구를 설계합니다.",
      ],
    ],
    concepts: [
      [
        "불변 데이터와 패턴 매칭",
        "새 값을 만들고 형태로 분기합니다. 잘못된 패턴은 프로세스 실패로 이어질 수 있습니다.",
      ],
      [
        "프로세스·메시지함",
        "경량 프로세스는 메모리 상태를 분리합니다. 메시지함이 무한히 커지지 않도록 유입을 제어합니다.",
      ],
      [
        "OTP와 감독 트리",
        "GenServer는 상태·호출 규약을, Supervisor는 자식의 재시작 정책을 제공합니다. 영속 저장은 별도입니다.",
      ],
    ],
    flow: [
      ["프로세스 시작", "감독 관계와 초기 상태를 구성합니다."],
      ["메시지 처리", "프로세스의 메시지함에서 요청과 상태 변경을 처리합니다."],
      ["실패와 복구", "감독 정책에 따라 재시작하고 필요한 상태를 복구합니다."],
    ],
    points: [
      [
        "타임아웃과 실행 취소 구분",
        "호출자가 기다리기를 멈춰도 서버 작업이 끝났거나 취소됐다는 보장은 없습니다.",
      ],
      [
        "단일 GenServer에 몰지 않기",
        "하나의 상태 처리 경계가 병목이 될 수 있어 키·방·작업 단위로 분리합니다.",
      ],
      [
        "재시작과 멱등성 설계",
        "상태 복구와 외부 API 중복 호출을 고려합니다. 감독 트리만으로 데이터가 복구되지는 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "응답이 점점 느려짐",
        "프로세스의 mailbox 길이·긴 콜백·단일 상태 소유자를 확인합니다.",
      ],
      [
        "재시작 뒤 값이 사라짐",
        "프로세스 메모리와 영속 저장·외부 부수 효과의 복구 경로를 구분합니다.",
      ],
    ],
    example: {
      title: "GenServer에 상태를 두기",
      description:
        "Elixir의 최소 GenServer 모듈입니다. 호출은 GenServer.call(pid, :next) 형태입니다.",
      language: "Elixir",
      code: "defmodule Counter do\n  use GenServer\n  def start_link(n), do: GenServer.start_link(__MODULE__, n)\n  def init(n), do: {:ok, n}\n  def handle_call(:next, _from, n), do: {:reply, n + 1, n + 1}\nend",
      note: "감독 트리·영속 저장·분산 배치는 포함하지 않습니다. 이 프로세스가 재시작되면 초기 상태에서 시작합니다.",
    },
    rationale: {
      short: "동시 연결의 상태와 장애 경계를 나눠 운영할 때 유용합니다.",
      problem:
        "서로 독립적인 세션·작업을 하나의 공유 상태에서 관리하면 장애와 경쟁이 얽힙니다.",
      change: "프로세스·메시지·감독 관계로 상태와 복구 단위를 나눕니다.",
      decisions: [
        {
          gainTitle: "상태와 장애 분리",
          gain: "BEAM 프로세스와 OTP 규약을 활용합니다.",
          costTitle: "메시지 적체",
          cost: "메일박스와 동기 호출 병목을 관리합니다.",
        },
        {
          gainTitle: "감독 기반 재시작",
          gain: "실패한 실행 단위를 다시 시작합니다.",
          costTitle: "복구 계약",
          cost: "영속 상태·중복 부수 효과·분산 실패는 별도 설계합니다.",
        },
      ],
      ask: "프로세스별 상태와 장애 복구 모델이 업무와 팀 경험에 맞나요?",
      simpler:
        "작은 무상태 HTTP 서비스라면 기존 프레임워크로 먼저 요구를 확인할 수 있습니다.",
    },
    related: ["erlang", "websocket", "nats"],
    aliases: ["엘릭서", "BEAM Elixir"],
    image: "elixir",
    sources: [
      [
        "Elixir · Processes",
        "https://github.com/elixir-lang/elixir/blob/main/lib/elixir/pages/getting-started/processes.md",
        "Elixir 공식 안내의 프로세스·메시지와 OTP GenServer 규약.",
      ],
      [
        "Elixir · Client-server with GenServer",
        "https://github.com/elixir-lang/elixir/blob/main/lib/elixir/pages/mix-and-otp/genservers.md",
        "Elixir 공식 안내의 프로세스·메시지와 OTP GenServer 규약.",
      ],
      [
        "Elixir 공식 문서 · 추가 읽기",
        "https://hexdocs.pm/elixir/introduction.html",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/elixir/elixir-original.svg",
    logoAlt: "Elixir 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "erlang",
    name: "Erlang",
    provider: "Ericsson · Erlang/OTP 커뮤니티",
    category: "language",
    type: "분산·동시성 언어",
    summary:
      "BEAM의 경량 프로세스와 메시지 전달, OTP로 연결과 장애를 다루는 언어입니다.",
    definition:
      "Erlang은 불변 데이터와 패턴 매칭, 프로세스 간 메시지 전달을 중심으로 한 언어입니다. Erlang/OTP는 VM과 라이브러리·감독 도구를 함께 제공합니다. 다른 노드와 메시지를 주고받을 수 있어도 네트워크 단절·중복 부수 효과·데이터 복제의 계약이 자동으로 해결되지는 않습니다.",
    useCases: [
      ["통신·실시간 연결", "많은 독립 연결의 상태와 메시지 처리를 분리합니다."],
      [
        "감독되는 장기 실행 서비스",
        "OTP 동작 규약과 감독 트리로 서버·워커의 실패 범위를 나눕니다.",
      ],
    ],
    concepts: [
      [
        "프로세스와 receive",
        "각 프로세스가 메시지를 골라 처리합니다. 선택적 receive와 쌓인 메시지의 비용을 이해해야 합니다.",
      ],
      [
        "링크·모니터·감독",
        "종료 신호를 전파하거나 감시합니다. 어떤 실패가 누구에게 전달되는지 정합니다.",
      ],
      [
        "노드와 배달의 경계",
        "메시지를 보냈다는 사실과 상대의 업무 처리가 완료됐다는 사실은 다릅니다. 요청 ID·응답·시간 제한이 필요합니다.",
      ],
    ],
    flow: [
      [
        "프로세스·감독 구성",
        "상태를 소유하는 실행 단위와 감시 관계를 정합니다.",
      ],
      [
        "메시지와 상태 전이",
        "패턴에 맞는 요청을 처리하고 새 상태로 이어갑니다.",
      ],
      ["실패 감지·복구", "종료·시간 초과·노드 단절을 구분해 복구합니다."],
    ],
    points: [
      [
        "재시도를 업무 의미와 연결",
        "응답을 잃으면 실행됐는지 모를 수 있어 요청 식별자와 멱등 처리가 필요합니다.",
      ],
      [
        "메일박스 길이 관측",
        "수신 속도와 처리 속도를 맞추고 오래된 메시지 처리 정책을 정합니다.",
      ],
      [
        "분산 신뢰 경계 구성",
        "노드 연결의 인증·네트워크 접근과 상태 저장을 함께 설계합니다.",
      ],
    ],
    diagnostics: [
      [
        "프로세스가 살아 있는데 응답 없음",
        "receive 패턴·mailbox·요청 상관 ID와 긴 처리를 확인합니다.",
      ],
      [
        "다른 노드와 상태가 어긋남",
        "연결 단절·재시도·복제의 충돌 규칙과 실제 저장 경로를 확인합니다.",
      ],
    ],
    example: {
      title: "요청 식별자를 돌려주는 프로세스",
      description:
        "Erlang 모듈 예입니다. OTP 감독 트리 대신 메시지 경계를 설명합니다.",
      language: "Erlang",
      code: "-module(counter).\n-export([start/0]).\n\nstart() -> spawn(fun() -> loop(0) end).\nloop(N) ->\n  receive\n    {next, From, Ref} ->\n      From ! {Ref, N + 1},\n      loop(N + 1);\n    stop -> ok\n  end.",
      note: "호출자는 자기 PID와 make_ref()로 만든 Ref를 보내고 응답·타임아웃을 처리해야 합니다. 카운터는 메모리에만 있습니다.",
    },
    rationale: {
      short:
        "많은 독립 상태와 장기 실행 프로세스의 장애를 분리할 때 필요합니다.",
      problem:
        "공유 상태와 프로세스 전체의 장애가 함께 묶이면 일부 실패가 넓게 전파될 수 있습니다.",
      change: "메시지·감독 관계로 실행과 복구 경계를 표현합니다.",
      decisions: [
        {
          gainTitle: "동시 처리 모델",
          gain: "독립된 프로세스와 OTP 도구를 사용합니다.",
          costTitle: "상태 전달 비용",
          cost: "프로세스 간 데이터 전달과 적체를 관리합니다.",
        },
        {
          gainTitle: "실패 감지 규약",
          gain: "링크·모니터·감독으로 종료를 다룹니다.",
          costTitle: "업무 복구",
          cost: "재시작과 영속 데이터·외부 실행 결과는 구분합니다.",
        },
      ],
      ask: "장기 연결·장애 분리 요구가 OTP 모델에 맞나요?",
      simpler:
        "단순한 작업은 일반 워커와 큐로 시작하고 상태·복구 요구가 커질 때 비교하세요.",
    },
    related: ["elixir", "nats", "rabbitmq"],
    aliases: ["얼랭", "Erlang OTP", "BEAM Erlang"],
    image: "erlang",
    sources: [
      [
        "Erlang · Supervisor Behaviour",
        "https://github.com/erlang/otp/blob/master/system/doc/design_principles/sup_princ.md",
        "Erlang/OTP의 프로세스·메시지와 감독 관계의 공식 설명.",
      ],
      [
        "Erlang · Processes",
        "https://github.com/erlang/otp/blob/master/system/doc/reference_manual/ref_man_processes.md",
        "Erlang/OTP의 프로세스·메시지와 감독 관계의 공식 설명.",
      ],
      [
        "Erlang 공식 문서 · 추가 읽기",
        "https://www.erlang.org/doc/system/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/erlang/erlang-original.svg",
    logoAlt: "Erlang 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "scala",
    name: "Scala",
    provider: "Scala Center · Scala 커뮤니티",
    category: "language",
    type: "JVM·함수형 프로그래밍 언어",
    summary:
      "객체지향과 함수형 타입 모델을 결합해 JVM 서비스·데이터 처리 코드를 작성하는 언어입니다.",
    definition:
      "Scala는 case class·패턴 매칭·제네릭과 불변 자료구조로 업무 상태를 표현하는 언어입니다. JVM 라이브러리와 연결할 수 있고 Scala 2와 3의 문법·바이너리 생태계는 구분해야 합니다. Spark나 액터 라이브러리는 별도 실행·동시성 도구이지 언어의 자동 기능은 아닙니다.",
    useCases: [
      [
        "타입으로 표현하는 서버 로직",
        "성공·실패·업무 상태를 합 타입과 패턴 매칭으로 다룹니다.",
      ],
      [
        "데이터 파이프라인",
        "JVM 데이터 도구와 연결하되 분산 실행·직렬화·버전 호환성을 따로 확인합니다.",
      ],
    ],
    concepts: [
      [
        "합 타입과 패턴 매칭",
        "가능한 상태를 타입으로 제한하고 분기합니다. 외부 입력의 파싱은 별도 경계입니다.",
      ],
      [
        "불변 값과 컬렉션",
        "상태 변경을 새 값으로 표현합니다. 내부 Java 객체의 변경 가능성이 사라지는 것은 아닙니다.",
      ],
      [
        "Option·Either·효과",
        "없음·실패·비동기 작업을 표현하는 타입과 실행 시점을 구분합니다. Future가 모든 라이브러리의 효과 모델은 아닙니다.",
      ],
    ],
    flow: [
      ["상태·오류 모델 정의", "업무 상태와 유효 입력을 타입으로 표현합니다."],
      ["컴파일과 라이브러리 연결", "Scala·JVM과 의존성 버전을 맞춥니다."],
      ["값 변환·효과 실행", "불변 변환과 실제 입출력 실행을 연결합니다."],
    ],
    points: [
      [
        "2·3 생태계 호환성 확인",
        "라이브러리의 Scala 버전 교차 빌드와 JVM 대상을 확인합니다.",
      ],
      [
        "추상화의 설명 가능성 유지",
        "복잡한 타입·암묵적 문맥이 팀의 오류 추적을 어렵게 하는지 확인합니다.",
      ],
      [
        "동시성 도구의 실행 모델 확인",
        "블로킹 호출과 실행 스레드·취소·리소스 수명을 라이브러리별로 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "의존성 추가 후 컴파일 실패",
        "Scala 바이너리 버전·JVM 대상·문맥 인스턴스 충돌을 확인합니다.",
      ],
      [
        "비동기 서버가 느려짐",
        "블로킹 호출이 실행 풀을 점유하는지, 분산 처리의 직렬화 비용이 있는지 구분합니다.",
      ],
    ],
    example: {
      title: "가능한 파싱 결과를 타입으로 나누기",
      description: "Scala 3 문법 예제입니다.",
      language: "Scala",
      code: 'enum CountResult:\n  case Ready(value: Int)\n  case Invalid(reason: String)\n\ndef parseCount(text: String): CountResult =\n  text.toIntOption.filter(_ >= 0) match\n    case Some(n) => CountResult.Ready(n)\n    case None => CountResult.Invalid("0 이상의 정수 필요")',
      note: "Scala 2 문법과 구분합니다. 외부 저장·서버 프레임워크를 실행하는 예는 아닙니다.",
    },
    rationale: {
      short: "복잡한 업무 상태를 타입과 불변 변환으로 표현할 때 유용합니다.",
      problem:
        "상태·실패·없음이 여러 nullable 값과 예외에 흩어지면 분기를 이해하기 어렵습니다.",
      change: "타입의 조합과 패턴 매칭으로 가능한 상태를 드러냅니다.",
      decisions: [
        {
          gainTitle: "도메인 모델 표현",
          gain: "합 타입·불변 값으로 계약을 표현합니다.",
          costTitle: "학습·빌드 비용",
          cost: "팀이 타입과 라이브러리 추상화를 이해해야 합니다.",
        },
        {
          gainTitle: "JVM 자산 활용",
          gain: "Java 라이브러리와 데이터 도구를 연결합니다.",
          costTitle: "버전 경계",
          cost: "Scala 교차 빌드와 JVM·라이브러리 호환성을 관리합니다.",
        },
      ],
      ask: "타입 모델의 이점이 팀의 학습·운영 비용을 정당화하나요?",
      simpler:
        "단순 서비스는 Java·Kotlin으로 시작하고 상태 모델이 복잡한 모듈에서 비교할 수 있습니다.",
    },
    related: ["java", "kotlin", "elixir"],
    aliases: ["스칼라", "Scala 3"],
    image: "scala",
    sources: [
      [
        "Scala · Immutable Values",
        "https://github.com/scala/docs.scala-lang/blob/main/_overviews/scala3-book/fp-immutable-values.md",
        "Scala 3 공식 안내의 불변 값과 합 타입·패턴 매칭.",
      ],
      [
        "Scala · Algebraic Data Types",
        "https://github.com/scala/docs.scala-lang/blob/main/_overviews/scala3-book/types-adts-gadts.md",
        "Scala 3 공식 안내의 불변 값과 합 타입·패턴 매칭.",
      ],
      [
        "Scala 공식 문서 · 추가 읽기",
        "https://docs.scala-lang.org/scala3/book/introduction.html",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/scala/scala-original.svg",
    logoAlt: "Scala 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "r",
    name: "R",
    provider: "R Core Team · R Foundation",
    category: "language",
    type: "통계·데이터 분석 언어",
    summary:
      "벡터·데이터 프레임·통계 함수로 데이터를 분석하고 모델과 그래프를 만드는 언어입니다.",
    definition:
      "R은 벡터화된 자료와 통계 분석 환경을 제공하는 언어입니다. 패키지로 전처리·모델·보고서를 연결하지만 데이터 타입·결측·범주와 재현 가능한 환경을 관리해야 합니다. 분석 코드가 자동으로 운영 API나 분산 처리 시스템이 되는 것은 아닙니다.",
    useCases: [
      [
        "탐색·통계 분석",
        "표본·집계·가설·모델의 가정을 확인하고 수치와 시각화를 만듭니다.",
      ],
      [
        "재현 가능한 분석·보고",
        "데이터 처리 순서·패키지 버전·난수 조건을 기록해 결과를 다시 만듭니다.",
      ],
    ],
    concepts: [
      [
        "벡터와 재활용",
        "길이가 다른 벡터의 연산에서 짧은 벡터가 재활용될 수 있습니다. 의도한 행별 계산인지 확인합니다.",
      ],
      [
        "NA·NaN·자료형",
        "결측·계산 불능·문자·수치·범주를 구분하고 결측을 제외한 집계의 분모를 명시합니다.",
      ],
      [
        "factor와 범주",
        "factor의 내부 코드는 실제 수치 값이 아닙니다. 범주 레벨과 순서·새 레벨 처리를 확인합니다.",
      ],
    ],
    flow: [
      ["자료형·결측 확인", "열의 의미와 단위·분석 대상을 정합니다."],
      ["변환·모형 계산", "벡터·표를 변환하고 가정에 맞는 통계를 계산합니다."],
      ["결과 검증·기록", "분모·불확실성·버전과 입력 조건을 남깁니다."],
    ],
    points: [
      [
        "집계의 분모를 남기기",
        "결측을 제외하면 표본 수가 달라집니다. 평균만으로 결과를 전달하지 않습니다.",
      ],
      [
        "메모리와 복사 비용 확인",
        "큰 객체의 변환·복사와 사용 라이브러리의 메모리 동작을 봅니다.",
      ],
      [
        "실행 환경 재현",
        "패키지·입력 버전·난수 시드를 기록하고 시드가 모든 외부 병렬 작업을 통제하지는 않음을 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "집계값이 예상과 다름",
        "벡터 길이 재활용·NA 처리·factor 변환과 그룹별 분모를 확인합니다.",
      ],
      [
        "분석이 다른 컴퓨터에서 달라짐",
        "패키지·데이터 버전·정렬·로케일·난수와 수치 라이브러리를 확인합니다.",
      ],
    ],
    example: {
      title: "결측 수와 유효 평균을 함께 표시",
      description: "R 기본 함수만 사용하는 분석 예입니다.",
      language: "R",
      code: "x <- c(1, NA_real_, 3)\nvalid <- sum(!is.na(x))\naverage <- if (valid == 0) NA_real_ else mean(x, na.rm = TRUE)\nprint(c(valid = valid, average = average))",
      note: "결측을 제외한 분모를 함께 남깁니다. 표본의 대표성이나 통계적 유의성을 증명하는 예제는 아닙니다.",
    },
    rationale: {
      short:
        "통계·분석의 가정과 계산 과정을 재현 가능한 코드로 다룰 때 유용합니다.",
      problem:
        "스프레드시트의 수동 변환만으로는 자료형·결측·분석 순서를 추적하기 어려울 수 있습니다.",
      change: "벡터·표·모형을 코드와 패키지로 연결합니다.",
      decisions: [
        {
          gainTitle: "분석 생태계",
          gain: "통계·시각화·보고 라이브러리를 활용합니다.",
          costTitle: "자료 해석 책임",
          cost: "분모·결측·가정과 수치 표현을 확인합니다.",
        },
        {
          gainTitle: "재현 가능한 과정",
          gain: "입력과 변환·모형을 코드로 기록합니다.",
          costTitle: "환경 관리",
          cost: "패키지·난수·외부 자료의 버전을 관리합니다.",
        },
      ],
      ask: "통계 모델·보고 도구와 팀의 분석 경험이 R에 맞나요?",
      simpler:
        "작은 집계는 SQL로 시작하고 통계·시각화가 필요하면 Python과 함께 비교하세요.",
    },
    related: ["python", "postgresql", "scala"],
    aliases: ["알 언어", "R 언어", "R language"],
    image: "r",
    sources: [
      [
        "R · R-intro.texi",
        "https://github.com/wch/r-source/blob/trunk/doc/manual/R-intro.texi",
        "R Core 매뉴얼을 제공하는 공개 소스 미러. 벡터·결측·자료형의 설명입니다.",
      ],
      [
        "R · R-lang.texi",
        "https://github.com/wch/r-source/blob/trunk/doc/manual/R-lang.texi",
        "R Core 매뉴얼을 제공하는 공개 소스 미러. 벡터·결측·자료형의 설명입니다.",
      ],
      [
        "R 공식 문서 · 추가 읽기",
        "https://cran.r-project.org/manuals.html",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/r/r-original.svg",
    logoAlt: "R 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "lua",
    name: "Lua",
    provider: "PUC-Rio Lua 팀 · Lua 커뮤니티",
    category: "language",
    type: "임베딩·스크립트 언어",
    summary:
      "작은 실행 환경과 C API로 호스트 프로그램에 규칙·설정·확장 로직을 넣는 언어입니다.",
    definition:
      "Lua는 테이블·함수·코루틴과 GC를 제공하는 경량 언어입니다. 호스트 프로그램에 VM을 넣거나 독립 스크립트로 사용할 수 있습니다. 게임 엔진·프록시 등에 포함된 Lua는 그 호스트가 제공하는 API·버전·보안 경계에 따라 동작 범위가 달라집니다.",
    useCases: [
      [
        "호스트의 확장 로직",
        "게임 규칙·플러그인·프록시 처리처럼 프로그램 일부를 스크립트로 바꿉니다.",
      ],
      [
        "작은 설정·자동화",
        "테이블과 함수를 조합해 유연한 설정·변환을 표현합니다.",
      ],
    ],
    concepts: [
      [
        "테이블과 nil",
        "배열·사전의 기반이며 nil은 키가 없는 상태를 만듭니다. # 연산을 임의의 사전 크기로 사용하지 않습니다.",
      ],
      [
        "코루틴",
        "실행을 협력적으로 양보합니다. 코루틴 자체가 OS 스레드 병렬 실행을 제공하지 않습니다.",
      ],
      [
        "C API와 수명",
        "스택 위치·값 변환·userdata·호스트 객체의 소유권을 명시합니다. GC와 외부 자원 수명을 구분합니다.",
      ],
    ],
    flow: [
      ["호스트·환경 구성", "허용할 라이브러리와 외부 API를 정합니다."],
      ["함수·테이블 실행", "스크립트에서 규칙과 상태를 처리합니다."],
      [
        "결과·자원 회수",
        "호스트로 결과를 돌려주고 참조·외부 자원을 정리합니다.",
      ],
    ],
    points: [
      [
        "호스트별 API 구분",
        "기본 Lua와 LuaJIT·엔진 확장 API·버전을 같은 것으로 보지 않습니다.",
      ],
      [
        "신뢰할 코드의 범위 제한",
        "파일·프로세스·네트워크 API와 실행량을 호스트의 권한 모델에 맞춥니다.",
      ],
      [
        "테이블의 수명 관리",
        "전역 테이블·참조·메타테이블이 큰 객체를 계속 붙잡는지 관찰합니다.",
      ],
    ],
    diagnostics: [
      [
        "목록의 길이나 순회가 예상과 다름",
        "nil 구멍·ipairs와 pairs·# 연산의 대상이 무엇인지 확인합니다.",
      ],
      [
        "스크립트 호출 뒤 호스트 메모리 증가",
        "registry 참조·userdata·C 자원 해제와 전역 상태를 확인합니다.",
      ],
    ],
    example: {
      title: "메모리 안에서 만료되는 값",
      description: "Lua 테이블과 함수 예제이며 시간을 호출자가 전달합니다.",
      language: "Lua",
      code: 'local cache = {}\nlocal function put(key, value, expires)\n  cache[key] = { value = value, expires = expires }\nend\nlocal function get(key, now)\n  local item = cache[key]\n  if not item or item.expires <= now then\n    cache[key] = nil\n    return nil\n  end\n  return item.value\nend\nput("greeting", "hello", 60)\nprint(get("greeting", 10))',
      note: "같은 Lua 상태의 로컬 예제입니다. 여러 서버 공유·영속 저장·동시 접근 제어를 제공하지 않습니다.",
    },
    rationale: {
      short:
        "기존 프로그램 일부를 작고 유연한 스크립트로 확장할 때 유용합니다.",
      problem:
        "작은 규칙을 바꿀 때마다 전체 네이티브 프로그램을 수정·배포하는 비용이 클 수 있습니다.",
      change: "호스트가 제공한 API 경계 안에서 Lua 스크립트를 실행합니다.",
      decisions: [
        {
          gainTitle: "임베딩의 유연성",
          gain: "작은 VM과 C API로 규칙을 분리합니다.",
          costTitle: "호스트 계약",
          cost: "API·버전·권한과 자원 수명을 관리합니다.",
        },
        {
          gainTitle: "동적 규칙 표현",
          gain: "테이블·함수로 설정과 로직을 조합합니다.",
          costTitle: "실행 중 검증",
          cost: "타입·nil·실행량과 공유 상태를 검증합니다.",
        },
      ],
      ask: "스크립트로 노출할 API와 신뢰 경계를 명확히 정할 수 있나요?",
      simpler:
        "단순 설정은 JSON 같은 데이터 형식으로 시작하고 실제 실행 규칙이 필요할 때 비교하세요.",
    },
    related: ["c", "javascript", "nginx"],
    aliases: ["루아", "Lua 언어"],
    image: "lua",
    sources: [
      [
        "Lua · lapi.c",
        "https://github.com/lua/lua/blob/master/lapi.c",
        "Lua 프로젝트의 C API·GC 구현 원문. 버전별 언어 규범은 공식 매뉴얼에서 확인합니다.",
      ],
      [
        "Lua · lgc.c",
        "https://github.com/lua/lua/blob/master/lgc.c",
        "Lua 프로젝트의 C API·GC 구현 원문. 버전별 언어 규범은 공식 매뉴얼에서 확인합니다.",
      ],
      [
        "Lua 공식 문서 · 추가 읽기",
        "https://www.lua.org/manual/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/lua/lua-original.svg",
    logoAlt: "Lua 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "bash",
    name: "Bash",
    provider: "GNU 프로젝트 · Bash 기여자",
    category: "language",
    type: "셸·자동화 언어",
    summary:
      "명령·파이프·파일 경로·종료 상태를 연결해 운영과 개발 작업을 자동화하는 셸입니다.",
    definition:
      "Bash는 명령 해석기이자 스크립트 언어입니다. 단어 확장·인용·파이프·프로세스의 종료 상태가 동작을 결정합니다. POSIX sh와 Bash 전용 문법은 구분해야 하며, 명령 문자열의 조합은 배열로 인수를 전달하는 것과 같은 작업이 아닙니다.",
    useCases: [
      [
        "개발·운영 작업 연결",
        "빌드·검사·파일 확인처럼 이미 있는 명령을 조합합니다.",
      ],
      [
        "반복 실행 자동화",
        "정해진 환경에서 인수·경로·실패 처리를 기록하는 스크립트를 만듭니다.",
      ],
    ],
    concepts: [
      [
        "인용과 인수 배열",
        '변수 확장은 공백 분리·글로브의 영향을 받습니다. "$@"와 배열로 원래 인수 경계를 지킵니다.',
      ],
      [
        "종료 상태와 파이프",
        "성공 여부를 종료 코드로 판단합니다. pipefail과 set -e의 예외 문맥을 이해해야 합니다.",
      ],
      [
        "서브셸과 환경",
        "파이프·괄호·명령 치환의 실행 문맥에서 변경한 변수가 부모 셸로 돌아오는지 구분합니다.",
      ],
    ],
    flow: [
      ["인수와 환경 검사", "필요한 도구·변수·파일을 명시적으로 확인합니다."],
      ["명령과 파이프 실행", "문자열 대신 인수 경계와 종료 상태를 연결합니다."],
      [
        "실패·정리와 반환",
        "오류를 기록하고 임시 자원·정리 동작을 마무리합니다.",
      ],
    ],
    points: [
      [
        "인수를 명령 문자열로 만들지 않기",
        "eval 대신 배열과 인용을 사용합니다. 비밀 값을 로그·추적 출력에 남기지 않습니다.",
      ],
      [
        "성공·실패를 직접 분기",
        "set -e만 믿지 말고 중요한 명령의 상태를 if 등으로 확인합니다.",
      ],
      [
        "복잡한 자료 처리의 경계",
        "중첩 JSON·복잡한 재시도·자료형 검증은 Python 같은 도구로 분리할 수 있습니다.",
      ],
    ],
    diagnostics: [
      [
        "공백 있는 파일에서만 실패",
        "인용되지 않은 변수·글로브와 인수 분리를 확인합니다.",
      ],
      [
        "중간 명령이 실패했는데 성공으로 종료",
        "파이프의 종료 상태·조건문·서브셸과 오류 처리를 확인합니다.",
      ],
    ],
    example: {
      title: "경로를 안전하게 순회하고 실패 반환",
      description:
        "Bash에서 인수로 받은 파일 경로를 확인하는 읽기 전용 예입니다.",
      language: "Bash",
      code: '#!/usr/bin/env bash\nset -u\nfor path in "$@"; do\n  if [[ -f "$path" ]]; then\n    printf \'%s\\n\' "$path"\n  else\n    printf \'파일 없음: %s\\n\' "$path" >&2\n    exit 1\n  fi\ndone',
      note: "파일을 변경하지 않습니다. 다른 명령에 경로를 넘길 때는 그 명령의 -- 지원과 옵션 해석도 확인합니다.",
    },
    rationale: {
      short: "여러 명령을 인수·파일·종료 상태로 연결할 때 유용합니다.",
      problem:
        "수동으로 반복하는 빌드·검사 작업은 실행 순서와 실패 처리가 흔들리기 쉽습니다.",
      change: "명령의 입출력과 상태를 명시한 스크립트로 연결합니다.",
      decisions: [
        {
          gainTitle: "기존 도구 재사용",
          gain: "작은 명령을 빠르게 조합합니다.",
          costTitle: "인용과 실행 문맥",
          cost: "확장·파이프·환경·종료 상태를 이해해야 합니다.",
        },
        {
          gainTitle: "작업 순서 기록",
          gain: "반복 작업과 실패 분기를 코드에 남깁니다.",
          costTitle: "복잡성의 한계",
          cost: "큰 자료 구조·복잡한 복구 로직은 유지보수가 어려워집니다.",
        },
      ],
      ask: "주로 명령을 연결하는 작업인가요, 복잡한 데이터를 다루는 프로그램인가요?",
      simpler:
        "명령 연결은 Bash로, 자료형·복구 로직이 커지면 Python 등으로 나눌 수 있습니다.",
    },
    related: ["python", "git", "github-actions"],
    aliases: ["배시", "배쉬", "셸", "shell", "GNU Bash"],
    image: "bash",
    sources: [
      [
        "Bash · bashref.texi",
        "https://github.com/gitGNU/gnu_bash/blob/master/doc/bashref.texi",
        "GNU Bash 매뉴얼의 공개 미러. 인용·확장·파이프·종료 상태의 규칙입니다.",
      ],
      [
        "Bash 공식 문서 · 추가 읽기",
        "https://www.gnu.org/software/bash/manual/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/bash/bash-original.svg",
    logoAlt: "Bash 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
];
