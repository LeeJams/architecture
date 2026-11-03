// Copy this object into the appropriate src/data/technologies/*.js array.
// Replace every instruction below with sourced, technology-specific content.
export const technologyProfileTemplate = {
  id: "replace-me",
  name: "정확한 기술·제품명",
  provider: "회사·재단·프로젝트",
  category: "web", // Use an existing technologyCategories ID.
  type: "라이브러리·프레임워크·언어 등 실제 기술 종류",
  image: "replace-me", // assets/tech/replace-me.svg; keep original bytes.
  summary: "어떤 역할의 기술인지 한 문장으로 설명합니다.",
  definition:
    "무엇을 입력받아 어떻게 처리하며 어느 계층에서 동작하는지 설명합니다. 함께 쓰지만 역할이 다른 기술과 경계를 구분합니다.",
  useCases: [
    ["사용 상황 1", "실제 작업과 연결할 시스템·데이터를 적습니다."],
    ["사용 상황 2", "다른 적용 상황과 필요한 조건을 적습니다."],
  ],
  concepts: [
    ["핵심 개념 1", "정의와 동작에 미치는 영향을 적습니다."],
    ["핵심 개념 2", "상태·수명·실패 또는 데이터 모델을 설명합니다."],
    ["핵심 개념 3", "혼동하기 쉬운 보장 범위와 한계를 적습니다."],
  ],
  flow: [
    ["입력·준비", "설정과 입력을 어떤 조건으로 받는지 적습니다."],
    ["핵심 처리", "실제로 어떤 계층이 어떤 작업을 하는지 적습니다."],
    ["결과·정리", "성공·실패·완료·자원 정리의 경계를 적습니다."],
  ],
  points: [
    ["도입 조건 1", "개발자가 구현·운영에서 확인해야 할 구체적인 조건입니다."],
    ["도입 조건 2", "자료·상태·권한 또는 동시 실행의 경계를 설명합니다."],
    ["도입 조건 3", "실패·재시도·지원 버전·용량 등 놓치기 쉬운 조건입니다."],
  ],
  diagnostics: [
    ["관찰 가능한 증상 1", "어떤 값·로그·설정·경로를 확인할지 적습니다."],
    ["관찰 가능한 증상 2", "서로 다른 원인을 나눠 확인할 방법을 적습니다."],
  ],
  example: {
    title: "실제 역할을 보여주는 작은 예제",
    description:
      "필요한 패키지·대상 버전·준비된 환경과 파일의 위치를 적습니다.",
    language: "사용 언어·설정 형식",
    code: "기술의 핵심을 확인할 수 있는 실제 코드로 바꿉니다.",
    note: "생략한 구성과 확인하지 않은 실행·운영 범위를 적습니다.",
  },
  rationale: {
    short: "어떤 문제 때문에 이 기술을 검토하는지 한 문장으로 적습니다.",
    problem: "이 기술이 없을 때의 구체적인 상황과 비용을 설명합니다.",
    change: "처리 방식과 책임이 어떻게 바뀌는지 설명합니다.",
    decisions: [
      {
        gainTitle: "얻는 것 1",
        gain: "구체적인 변화",
        costTitle: "감수할 점 1",
        cost: "함께 생기는 책임·조건",
      },
      {
        gainTitle: "얻는 것 2",
        gain: "다른 구체적인 변화",
        costTitle: "감수할 점 2",
        cost: "함께 생기는 책임·조건",
      },
    ],
    ask: "도입 판단에 필요한 질문을 적습니다.",
    simpler: "언제 더 단순한 방법부터 시작할 수 있는지 적습니다.",
  },
  sources: [
    [
      "공식 개요",
      "https://docs.example/overview",
      "읽은 자료에서 확인한 범위를 적습니다.",
    ],
    [
      "공식 핵심 동작",
      "https://docs.example/mechanism",
      "본문의 핵심 동작을 뒷받침하는 범위를 적습니다.",
    ],
  ],
  related: [], // Existing technology IDs; explain the relation in the content.
  aliases: ["한국어 이름·통용 약칭"],
  logoSource: "https://repo.example/original-symbol.svg",
  logoAlt: "실제 기술 또는 브랜드의 심벌 설명",
  logoNote: "원출처·라이선스·공통 브랜드라면 표시 범위",
  // logoScope: "brand", // Only for a shared brand mark, not a product logo.
};
