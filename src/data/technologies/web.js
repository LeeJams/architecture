// Detailed profiles for the shared technology catalogue.
export const webTechnologies = [
  {
    id: "react",
    name: "React",
    provider: "Meta · React 커뮤니티",
    category: "web",
    type: "컴포넌트 UI 라이브러리",
    summary:
      "컴포넌트와 상태를 조합해 사용자 입력에 따라 바뀌는 화면을 구성하는 라이브러리입니다.",
    definition:
      "React는 상태에서 UI를 계산하는 컴포넌트 모델을 제공합니다. 렌더링은 현재 props·state의 스냅샷으로 화면을 계산하고, 커밋 단계에서 실제 화면에 반영합니다. 라우팅·데이터 저장·서버 운영은 별도 선택이며 React를 쓴다는 사실만으로 전체 앱의 실행 위치가 정해지지는 않습니다.",
    useCases: [
      [
        "상태가 많은 웹 화면",
        "폼·필터·선택·모달처럼 서로 연결되는 화면 상태를 컴포넌트로 나눕니다.",
      ],
      [
        "공용 UI와 제품 기능",
        "컴포넌트·Hook으로 반복되는 표시·동작을 묶되 실제 업무 상태의 소유자를 정합니다.",
      ],
    ],
    concepts: [
      [
        "상태는 렌더의 스냅샷",
        "setState가 현재 함수의 변수를 즉시 바꾸지는 않습니다. 이전 값 기반 변경은 updater 함수를 사용합니다.",
      ],
      [
        "렌더·커밋·Effect",
        "렌더는 순수하게 계산하고 Effect는 외부 시스템과 동기화합니다. 계산 가능한 값을 Effect로 다시 저장하지 않습니다.",
      ],
      [
        "key와 상태의 정체성",
        "목록의 key·컴포넌트 위치가 상태 보존에 영향을 줍니다. 바뀌는 순번을 안정적인 ID처럼 쓰지 않습니다.",
      ],
    ],
    flow: [
      ["props·상태로 렌더", "현재 입력에서 표시할 UI를 계산합니다."],
      ["변경을 커밋", "필요한 DOM 변경을 적용합니다."],
      [
        "이벤트·외부 동기화",
        "입력으로 새 상태를 만들고 구독·외부 자원을 정리합니다.",
      ],
    ],
    points: [
      [
        "공유 상태의 소유자를 정하기",
        "파생 값을 중복 저장하지 않고 필요한 공통 상위에서 관리합니다.",
      ],
      [
        "Effect 의존성과 정리",
        "구독·타이머·요청의 수명을 정리하고 오래된 응답이 최신 상태를 덮지 않도록 합니다.",
      ],
      [
        "클라이언트와 서버 책임 구분",
        "컴포넌트에 권한·비밀 정보를 넣지 않고 프레임워크의 실행 경계를 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "값을 바꿨는데 이전 값이 쓰임",
        "렌더 스냅샷·클로저·updater 사용과 실제 비동기 응답 순서를 확인합니다.",
      ],
      [
        "목록 수정 때 입력값이 다른 행으로 이동",
        "key의 안정성과 컴포넌트 위치가 바뀌는지 확인합니다.",
      ],
    ],
    example: {
      title: "이전 상태를 기준으로 두 번 갱신",
      description: "React 앱의 함수 컴포넌트이며 JSX 변환 환경이 필요합니다.",
      language: "JSX",
      code: "import { useState } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  function addTwo() {\n    setCount(n => n + 1);\n    setCount(n => n + 1);\n  }\n  return <button onClick={addTwo}>{count} · 2 더하기</button>;\n}",
      note: "updater 함수는 대기한 이전 값을 이어받습니다. 저장·API·라우터가 포함된 예제는 아닙니다.",
    },
    rationale: {
      short:
        "화면의 상태와 DOM 변경을 컴포넌트 단위로 일관되게 연결할 때 유용합니다.",
      problem:
        "여러 이벤트가 직접 DOM을 바꾸면 표시된 값과 앱 상태가 어긋나기 쉽습니다.",
      change: "상태에서 UI를 계산하고 컴포넌트로 책임을 나눕니다.",
      decisions: [
        {
          gainTitle: "UI 재사용",
          gain: "상태·표시·이벤트를 조합 가능한 단위로 만듭니다.",
          costTitle: "상태 모델 설계",
          cost: "공유 상태·Effect·key의 규칙을 이해해야 합니다.",
        },
        {
          gainTitle: "생태계 선택",
          gain: "라우팅·서버 렌더링·데이터 도구를 연결합니다.",
          costTitle: "선택과 실행 비용",
          cost: "라이브러리 조합·브라우저 코드량·렌더 비용을 관리합니다.",
        },
      ],
      ask: "지속적으로 상호작용하는 화면과 공용 UI가 필요한가요?",
      simpler:
        "단순 문서나 작은 동작은 HTML·웹 API 또는 Astro 같은 콘텐츠 중심 구성을 검토할 수 있습니다.",
    },
    related: ["nextjs", "vue", "svelte", "tanstack-query"],
    aliases: ["리액트", "React.js", "ReactJS"],
    image: "react",
    sources: [
      [
        "React · State as a Snapshot",
        "https://github.com/reactjs/react.dev/blob/main/src/content/learn/state-as-a-snapshot.md",
        "React 공식 문서의 상태 스냅샷과 Effect의 사용·정리 경계.",
      ],
      [
        "React · You Might Not Need an Effect",
        "https://github.com/reactjs/react.dev/blob/main/src/content/learn/you-might-not-need-an-effect.md",
        "React 공식 문서의 상태 스냅샷과 Effect의 사용·정리 경계.",
      ],
      [
        "React 공식 문서 · 추가 읽기",
        "https://react.dev/learn",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/react/react-original.svg",
    logoAlt: "React 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "nextjs",
    name: "Next.js",
    provider: "Vercel · Next.js 커뮤니티",
    category: "web",
    type: "React 웹 애플리케이션 프레임워크",
    summary:
      "React 앱의 라우팅·서버 렌더링·클라이언트 상호작용과 배포 결과를 구성하는 프레임워크입니다.",
    definition:
      "Next.js는 React 위에 라우트·서버 실행·빌드·데이터 처리 규약을 제공합니다. App Router에서는 Server Component와 Client Component의 경계를 이해해야 합니다. 정적 생성·요청 시 렌더링·캐시·배포 런타임은 버전과 설정에 따라 달라지며 모두 같은 실행 모델은 아닙니다.",
    useCases: [
      [
        "공개 페이지와 상호작용 앱",
        "서버에서 초기 콘텐츠를 만들고 필요한 UI만 브라우저의 동작과 연결합니다.",
      ],
      [
        "앱과 가까운 서버 경계",
        "라우트 핸들러·서버 코드에서 인증·데이터 조회를 연결하되 업무 서버의 범위와 분리합니다.",
      ],
    ],
    concepts: [
      [
        "서버·클라이언트 컴포넌트",
        "use client는 클라이언트 모듈 경계를 만듭니다. 브라우저로 보내는 props는 직렬화와 공개 범위를 확인합니다.",
      ],
      [
        "렌더링과 캐시",
        "fetch·라우트·배포 캐시의 수명과 사용자별 응답을 구분합니다. 기본값을 버전 간에 그대로 가정하지 않습니다.",
      ],
      [
        "라우트와 요청의 수명",
        "경로·매개변수·오류·로딩을 구성하고 서버 실행의 인증·시간 제한을 확인합니다.",
      ],
    ],
    flow: [
      ["요청·라우트 결정", "경로와 렌더링·캐시 정책을 확인합니다."],
      [
        "서버에서 콘텐츠 구성",
        "필요한 데이터를 읽고 서버 렌더 결과를 만듭니다.",
      ],
      [
        "브라우저에 상호작용 연결",
        "클라이언트 경계의 코드를 내려받고 이벤트를 연결합니다.",
      ],
    ],
    points: [
      [
        "비밀 정보의 모듈 경계",
        "클라이언트 번들·props·HTML에 무엇이 포함되는지 확인합니다.",
      ],
      [
        "개인화 응답의 캐시",
        "사용자·권한·언어 등 캐시 키와 요청 경계를 명시해 다른 사용자 응답과 섞이지 않게 합니다.",
      ],
      [
        "런타임과 운영 조건",
        "Node·엣지·정적 배포의 API·실행 시간·스트리밍 지원과 장애 경로를 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "바꾼 데이터가 이전 상태로 보임",
        "브라우저·프레임워크·CDN 캐시를 나눠 보고 실제 버전·갱신 조건을 확인합니다.",
      ],
      [
        "서버 코드가 브라우저에서 오류",
        "use client 경계·서버 전용 의존성과 직렬화할 수 없는 props를 확인합니다.",
      ],
    ],
    example: {
      title: "서버 컴포넌트에서 캐시 정책 명시",
      description:
        "App Router의 app/products/page.tsx 예시이며 API의 배열 형식과 인증은 별도로 구성해야 합니다.",
      language: "TSX",
      code: 'export default async function ProductsPage() {\n  const response = await fetch("https://catalog.example/products", {\n    cache: "no-store",\n  });\n  if (!response.ok) throw new Error("상품 조회 실패");\n  const products = await response.json();\n  return <pre>{JSON.stringify(products, null, 2)}</pre>;\n}',
      note: "example 도메인의 학습용 코드입니다. 실제 외부 데이터는 검증해야 하며 no-store가 다른 계층의 모든 캐시까지 제거하지는 않습니다.",
    },
    rationale: {
      short:
        "라우팅·서버 렌더링·브라우저 UI를 하나의 앱 규약으로 연결할 때 필요합니다.",
      problem:
        "React UI만으로는 라우팅·초기 콘텐츠·서버 실행과 배포 방식을 정할 수 없습니다.",
      change:
        "프레임워크의 서버·클라이언트 경계와 라우트 규칙 안에서 앱을 구성합니다.",
      decisions: [
        {
          gainTitle: "통합된 앱 규약",
          gain: "React와 라우팅·서버 렌더를 함께 구성합니다.",
          costTitle: "실행 경계 이해",
          cost: "서버·브라우저·캐시의 여러 수명을 관리합니다.",
        },
        {
          gainTitle: "콘텐츠 전달 선택",
          gain: "정적·동적 렌더링을 요구에 맞게 선택합니다.",
          costTitle: "운영·버전 차이",
          cost: "배포 환경과 버전별 기본 동작을 확인합니다.",
        },
      ],
      ask: "서버 렌더링·검색 노출·서버 코드 통합이 필요한가요?",
      simpler:
        "내부 대시보드라면 React와 Vite의 클라이언트 앱부터 비교할 수 있습니다.",
    },
    related: ["react", "nodejs", "astro"],
    aliases: ["넥스트", "Next", "NextJS"],
    image: "nextjs",
    sources: [
      [
        "Next.js · use client",
        "https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/01-directives/use-client.mdx",
        "Next.js App Router의 클라이언트 경계·직렬화와 서버·클라이언트 컴포넌트 설명.",
      ],
      [
        "Next.js · Server and Client Components",
        "https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx",
        "Next.js App Router의 클라이언트 경계·직렬화와 서버·클라이언트 컴포넌트 설명.",
      ],
      [
        "Next.js 공식 문서 · 추가 읽기",
        "https://nextjs.org/docs",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/nextjs/nextjs-original.svg",
    logoAlt: "Next.js 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "vue",
    name: "Vue.js",
    provider: "Vue Core Team · Vue 커뮤니티",
    category: "web",
    type: "반응형 UI 프레임워크",
    summary:
      "템플릿과 반응형 상태를 연결해 웹 컴포넌트와 상호작용 화면을 만드는 프레임워크입니다.",
    definition:
      "Vue는 선언적 템플릿·컴포넌트와 반응형 시스템으로 상태 변화를 UI에 연결합니다. Composition API의 ref·reactive·computed와 컴포넌트 수명을 함께 이해해야 합니다. 라우터·서버 렌더링·데이터 저장은 별도 도구 또는 Nuxt 같은 프레임워크와 조합합니다.",
    useCases: [
      [
        "점진적 화면 도입",
        "기존 페이지의 일부 동작이나 여러 컴포넌트로 구성된 앱을 만듭니다.",
      ],
      [
        "폼·업무 UI",
        "입력·파생 값·서버 응답을 반응형 상태와 컴포넌트 경계로 연결합니다.",
      ],
    ],
    concepts: [
      [
        "ref와 reactive",
        "ref의 값은 스크립트에서 .value로 다룹니다. 반응형 객체를 분해할 때 추적이 유지되는지 확인합니다.",
      ],
      [
        "computed와 watch",
        "computed는 파생 값을 계산하고 watch는 외부 효과를 연결합니다. 순수 계산과 입출력을 구분합니다.",
      ],
      [
        "컴포넌트 수명과 key",
        "구독·효과를 정리하고 목록의 정체성을 안정적인 key로 표현합니다.",
      ],
    ],
    flow: [
      ["상태와 템플릿 정의", "컴포넌트의 입력·상태·표시를 구성합니다."],
      ["변경 의존성 추적", "읽은 반응형 값과 파생 값을 연결합니다."],
      ["화면 갱신·정리", "변경을 반영하고 구독·외부 자원을 해제합니다."],
    ],
    points: [
      [
        "반응형 경계를 끊지 않기",
        "일반 변수로 분리한 값과 추적되는 ref를 구분합니다.",
      ],
      [
        "watch의 비동기 경쟁 처리",
        "늦게 도착한 요청과 정리·취소 경로를 관리합니다.",
      ],
      [
        "입력과 신뢰 경계",
        "템플릿 렌더링과 원시 HTML 삽입을 구분하고 v-html 등에 신뢰하지 않은 값을 넣지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "값은 바뀌는데 화면이 그대로임",
        "ref의 .value·구조 분해·일반 객체와 반응형 객체의 차이를 봅니다.",
      ],
      [
        "조회 조건 변경 후 이전 결과 표시",
        "watch의 요청 취소·정리와 응답 순서를 확인합니다.",
      ],
    ],
    example: {
      title: "파생 값을 computed로 표현",
      description: "Vue 3의 단일 파일 컴포넌트 예입니다.",
      language: "Vue SFC",
      code: "<script setup>\nimport { ref, computed } from 'vue';\nconst count = ref(0);\nconst doubled = computed(() => count.value * 2);\n</script>\n\n<template>\n  <button @click=\"count++\">{{ count }} · 두 배 {{ doubled }}</button>\n</template>",
      note: "템플릿의 ref 해제와 스크립트의 .value를 구분합니다. 별도의 상태 저장소 없이 계산 가능한 값입니다.",
    },
    rationale: {
      short: "템플릿과 상태의 변경을 반응형 규칙으로 연결할 때 유용합니다.",
      problem:
        "화면마다 DOM과 값을 수동으로 맞추면 파생 값과 이벤트 처리가 중복됩니다.",
      change: "반응형 의존성과 컴포넌트로 화면 계산을 묶습니다.",
      decisions: [
        {
          gainTitle: "선언적 화면",
          gain: "템플릿·computed로 표시와 파생 값을 표현합니다.",
          costTitle: "추적 규칙",
          cost: "ref·프록시·구조 분해의 동작을 알아야 합니다.",
        },
        {
          gainTitle: "점진적 도입",
          gain: "작은 위젯부터 앱으로 확장할 수 있습니다.",
          costTitle: "주변 도구 선택",
          cost: "라우터·서버 렌더·상태와 운영 방식을 별도로 정합니다.",
        },
      ],
      ask: "템플릿 기반 컴포넌트와 팀의 개발 방식이 맞나요?",
      simpler:
        "작은 동작은 웹 API로 시작하고 서버 렌더가 필요하면 Nuxt도 비교하세요.",
    },
    related: ["nuxt", "react", "svelte"],
    aliases: ["뷰", "뷰제이에스", "Vue", "VueJS"],
    image: "vue",
    sources: [
      [
        "Vue.js · Reactivity Fundamentals {#reactivity-fundamentals}",
        "https://github.com/vuejs/docs/blob/main/src/guide/essentials/reactivity-fundamentals.md",
        "Vue 3 공식 문서의 ref·반응형 상태와 watcher의 동작.",
      ],
      [
        "Vue.js · Watchers {#watchers}",
        "https://github.com/vuejs/docs/blob/main/src/guide/essentials/watchers.md",
        "Vue 3 공식 문서의 ref·반응형 상태와 watcher의 동작.",
      ],
      [
        "Vue.js 공식 문서 · 추가 읽기",
        "https://vuejs.org/guide/introduction.html",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/vuejs/vuejs-original.svg",
    logoAlt: "Vue.js 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "nuxt",
    name: "Nuxt",
    provider: "Nuxt 팀 · Nuxt 커뮤니티",
    category: "web",
    type: "Vue 웹 애플리케이션 프레임워크",
    summary:
      "Vue 앱의 라우팅·서버 렌더링·데이터 조회와 서버 실행 경로를 구성하는 프레임워크입니다.",
    definition:
      "Nuxt는 Vue와 파일 기반 라우팅·서버 렌더링·데이터 composable을 연결하며 Nitro를 통해 서버와 배포 경계를 구성합니다. 서버에서 읽은 결과를 브라우저로 전달하는 과정과 요청별 상태를 이해해야 합니다. 정적·서버·하이브리드 배포의 지원은 설정과 어댑터에 따라 달라집니다.",
    useCases: [
      [
        "공개 페이지·Vue 앱",
        "서버에서 초기 화면을 만들고 브라우저의 상호작용을 연결합니다.",
      ],
      [
        "SSR 데이터 전달",
        "useFetch·useAsyncData로 서버 조회와 브라우저의 데이터 사용을 연결합니다.",
      ],
    ],
    concepts: [
      [
        "서버 렌더와 hydration",
        "서버가 만든 HTML과 브라우저 초기 상태가 일치해야 합니다. 시간·난수·브라우저 API의 위치를 구분합니다.",
      ],
      [
        "데이터 키와 payload",
        "조회 키와 입력·공유 범위, 서버에서 직렬화해 보낼 데이터의 노출을 확인합니다.",
      ],
      [
        "요청별 상태",
        "모듈 전역의 변경 가능 상태가 여러 요청 사이에 공유될 수 있습니다. 사용자별 상태의 경계를 정합니다.",
      ],
    ],
    flow: [
      [
        "라우트·렌더 정책 결정",
        "요청할 페이지와 서버·정적 처리 방식을 선택합니다.",
      ],
      [
        "서버 조회와 결과 전달",
        "인증·조회 키를 정하고 필요한 데이터를 전달합니다.",
      ],
      [
        "클라이언트 동작 연결",
        "초기 결과를 활용하고 이후 입력·갱신을 처리합니다.",
      ],
    ],
    points: [
      [
        "개인화 데이터의 격리",
        "전역 싱글턴·공유 키·캐시가 서로 다른 사용자의 결과를 섞지 않게 합니다.",
      ],
      [
        "서버 데이터의 공개 범위",
        "서버에서 조회했다는 이유만으로 payload에 비밀 값을 포함해도 되는 것은 아닙니다.",
      ],
      [
        "배포별 서버 기능 확인",
        "Nitro 어댑터와 파일·네트워크·실행 시간의 지원을 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "첫 표시 뒤 화면이 바뀌며 경고",
        "서버와 클라이언트의 입력·시간·브라우저 전용 상태 차이를 확인합니다.",
      ],
      [
        "중복 조회나 다른 조건의 결과 표시",
        "useAsyncData 키·조회 입력·payload와 캐시 범위를 확인합니다.",
      ],
    ],
    example: {
      title: "조회 상태와 오류를 함께 표시",
      description:
        "Nuxt의 페이지 예제입니다. /api/products가 공개 상품 배열을 반환한다고 가정합니다.",
      language: "Vue SFC",
      code: '<script setup lang="ts">\nconst { data, status, error } = await useFetch<{ id: string; title: string }[]>(\n  "/api/products"\n);\n</script>\n<template>\n  <p v-if="status === \'pending\'">조회 중</p>\n  <p v-else-if="error">조회 실패</p>\n  <ul v-else><li v-for="item in data ?? []" :key="item.id">{{ item.title }}</li></ul>\n</template>',
      note: "TypeScript 표기가 실제 API 응답을 검증하지는 않습니다. API·인증·개인화 데이터의 키와 캐시 정책은 별도로 작성해야 합니다.",
    },
    rationale: {
      short: "Vue UI에 라우팅·SSR·서버 데이터 전달 규칙을 더할 때 필요합니다.",
      problem:
        "Vue 화면만으로는 초기 렌더와 서버 조회·배포 경로가 정해지지 않습니다.",
      change: "Nuxt의 라우트·데이터 composable·서버 실행 규약을 사용합니다.",
      decisions: [
        {
          gainTitle: "Vue 앱의 공통 규약",
          gain: "초기 화면·데이터·라우팅을 함께 구성합니다.",
          costTitle: "요청 상태의 격리",
          cost: "SSR과 payload·캐시·전역 상태의 범위를 이해해야 합니다.",
        },
        {
          gainTitle: "배포 방식 선택",
          gain: "정적·서버·혼합 렌더를 선택합니다.",
          costTitle: "환경별 차이",
          cost: "어댑터와 버전·서버 API의 지원을 검증합니다.",
        },
      ],
      ask: "SSR과 서버 경계가 필요한 Vue 앱인가요?",
      simpler: "브라우저 전용 화면은 Vue와 Vite부터 시작할 수 있습니다.",
    },
    related: ["vue", "nextjs", "vite"],
    aliases: ["넉스트", "Nuxt.js", "NuxtJS"],
    image: "nuxt",
    sources: [
      [
        "Nuxt · useAsyncData",
        "https://github.com/nuxt/nuxt/blob/main/docs/4.api/2.composables/use-async-data.md",
        "Nuxt 공식 문서의 useAsyncData·키·결과 전달과 렌더링 경계.",
      ],
      [
        "Nuxt · Rendering Modes",
        "https://github.com/nuxt/nuxt/blob/main/docs/3.guide/1.concepts/1.rendering.md",
        "Nuxt 공식 문서의 useAsyncData·키·결과 전달과 렌더링 경계.",
      ],
      [
        "Nuxt 공식 문서 · 추가 읽기",
        "https://nuxt.com/docs",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/nuxtjs/nuxtjs-original.svg",
    logoAlt: "Nuxt 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "angular",
    name: "Angular",
    provider: "Google · Angular 커뮤니티",
    category: "web",
    type: "웹 애플리케이션 프레임워크",
    summary:
      "컴포넌트·템플릿·의존성 주입과 도구 규약으로 큰 웹 애플리케이션을 구성하는 프레임워크입니다.",
    definition:
      "Angular는 UI 컴포넌트와 라우팅·폼·의존성 주입 등의 규약을 제공하는 프레임워크입니다. Signals로 반응형 값을 표현하고 템플릿과 상태 변경을 연결합니다. RxJS·서버 렌더링·변경 감지 설정은 서로 다른 도구와 실행 조건이므로 지원 버전과 수명을 확인해야 합니다.",
    useCases: [
      [
        "여러 팀의 업무 웹 앱",
        "모듈 경계·서비스·라우팅·폼 처리 규칙을 공유합니다.",
      ],
      [
        "입력·조회가 연결된 화면",
        "컴포넌트 상태와 주입한 서비스, 반응형 데이터 흐름을 연결합니다.",
      ],
    ],
    concepts: [
      [
        "컴포넌트와 템플릿",
        "표시·입력·이벤트를 정의합니다. 생성·갱신·제거의 수명 단계가 있습니다.",
      ],
      [
        "Signals와 파생 값",
        "signal·computed로 읽는 값의 의존성을 추적합니다. 순수한 파생 계산과 외부 효과를 구분합니다.",
      ],
      [
        "의존성 주입과 수명",
        "제공 위치에 따라 서비스의 공유·생성 범위가 달라집니다. 전역 상태와 화면별 상태를 구분합니다.",
      ],
    ],
    flow: [
      ["컴포넌트·서비스 구성", "입력·의존성·라우트와 수명을 정합니다."],
      ["값·템플릿 연결", "상태 의존성에 따라 화면을 계산합니다."],
      ["제거와 자원 정리", "구독·타이머·외부 리스너를 해제합니다."],
    ],
    points: [
      ["구독과 컴포넌트 수명", "화면 제거 뒤 남는 스트림·리스너를 정리합니다."],
      [
        "서비스 제공 범위 확인",
        "싱글턴에 화면별 사용자 상태가 섞이지 않도록 합니다.",
      ],
      [
        "버전과 변경 감지 조건",
        "Signals·Zone 관련 설정과 서버 렌더의 지원을 버전에 맞게 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "화면을 닫아도 요청·이벤트가 계속 실행",
        "구독 정리·서비스 수명·타이머의 소유자를 확인합니다.",
      ],
      [
        "상태가 다른 화면과 예상 밖으로 공유",
        "DI 제공 위치와 singleton 서비스의 변경 가능 값을 확인합니다.",
      ],
    ],
    example: {
      title: "signal로 컴포넌트 상태 표현",
      description:
        "Signals를 지원하는 Angular의 standalone 컴포넌트 예입니다. 앱 부트스트랩은 별도입니다.",
      language: "TypeScript",
      code: "import { Component, signal } from '@angular/core';\n\n@Component({\n  selector: 'app-counter',\n  standalone: true,\n  template: '<button (click)=\"increment()\">{{ count() }}</button>',\n})\nexport class Counter {\n  readonly count = signal(0);\n  increment() { this.count.update(n => n + 1); }\n}",
      note: "Signals는 서버 저장이나 요청 인증을 제공하지 않습니다. 실제 서비스의 폼·라우트·서버 경계는 별도로 구성합니다.",
    },
    rationale: {
      short: "큰 웹 앱에서 화면·주입·폼·라우팅의 팀 규칙을 맞출 때 유용합니다.",
      problem:
        "화면마다 라이브러리와 서비스 수명 규칙이 다르면 팀 간 통합이 어려워집니다.",
      change: "프레임워크의 컴포넌트·DI·도구 규약으로 앱을 구성합니다.",
      decisions: [
        {
          gainTitle: "공통 구조",
          gain: "여러 기능과 팀이 같은 앱 규약을 공유합니다.",
          costTitle: "학습과 버전 관리",
          cost: "템플릿·DI·반응형 도구와 업그레이드를 배워야 합니다.",
        },
        {
          gainTitle: "상태 의존성 표현",
          gain: "Signals로 파생 값과 화면을 연결합니다.",
          costTitle: "수명·외부 효과",
          cost: "구독·서비스 범위·부수 효과를 별도로 관리합니다.",
        },
      ],
      ask: "팀 규모와 공통 도구 규약의 이점이 프레임워크 학습 비용보다 큰가요?",
      simpler:
        "작은 독립 화면은 가벼운 구성부터 시작해 필요한 공통 기능을 확인할 수 있습니다.",
    },
    related: ["typescript", "react", "vue"],
    aliases: ["앵귤러", "Angular framework"],
    image: "angular",
    sources: [
      [
        "Angular · Component Lifecycle",
        "https://github.com/angular/angular/blob/main/adev/src/content/guide/components/lifecycle.md",
        "Angular 공식 문서의 Signals와 컴포넌트 수명.",
      ],
      [
        "Angular · overview.md",
        "https://github.com/angular/angular/blob/main/adev/src/content/guide/signals/overview.md",
        "Angular 공식 문서의 Signals와 컴포넌트 수명.",
      ],
      [
        "Angular 공식 문서 · 추가 읽기",
        "https://angular.dev/overview",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/angular/angular-original.svg",
    logoAlt: "Angular 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "svelte",
    name: "Svelte",
    provider: "Svelte 팀 · Svelte 커뮤니티",
    category: "web",
    type: "컴파일 기반 UI 프레임워크",
    summary:
      "컴포넌트와 반응형 선언을 컴파일해 웹 화면의 상태·이벤트를 연결하는 프레임워크입니다.",
    definition:
      "Svelte는 .svelte 컴포넌트의 템플릿·스크립트·스타일을 빌드 과정에서 처리합니다. Svelte 5의 runes는 $state·$derived·$effect 등으로 반응형 경계를 표현합니다. SvelteKit의 라우팅·서버 처리와 언어·컴포넌트 컴파일은 다른 계층입니다.",
    useCases: [
      [
        "상호작용 컴포넌트",
        "입력·조건·목록과 상태 변화를 단일 파일에서 연결합니다.",
      ],
      [
        "위젯·웹 앱 UI",
        "기존 웹 기능과 연결하고 앱 라우팅·서버 계층은 별도로 선택합니다.",
      ],
    ],
    concepts: [
      [
        "$state와 프록시",
        "배열·일반 객체는 깊은 반응형 프록시가 될 수 있습니다. 모든 클래스·외부 객체가 같은 방식으로 반응형이 되지는 않습니다.",
      ],
      [
        "$derived의 파생 계산",
        "현재 상태에서 계산 가능한 값을 순수하게 표현합니다. 네트워크 요청을 파생 계산에 섞지 않습니다.",
      ],
      [
        "컴파일과 실행 경계",
        "컴파일러가 변환해도 브라우저에서 실행할 코드·리스너·자원의 비용은 남습니다.",
      ],
    ],
    flow: [
      ["컴포넌트 컴파일", "스크립트·템플릿의 반응형 선언을 변환합니다."],
      ["상태 의존성 갱신", "입력으로 상태와 파생 값을 바꿉니다."],
      ["DOM·효과 정리", "화면을 반영하고 외부 구독·자원을 해제합니다."],
    ],
    points: [
      [
        "버전별 반응형 문법 구분",
        "Svelte 5 runes와 이전 문법의 차이를 명시합니다.",
      ],
      [
        "파생 값과 효과 분리",
        "계산 가능한 값을 Effect로 다시 저장해 순환 갱신을 만들지 않습니다.",
      ],
      [
        "외부 객체와 정리",
        "외부 라이브러리·클래스의 변경 추적과 정리 경로를 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "객체를 바꿔도 화면이 갱신되지 않음",
        "$state의 대상·분리한 일반 값·클래스 객체의 반응형 경계를 확인합니다.",
      ],
      [
        "컴포넌트 제거 뒤에도 동작이 남음",
        "Effect·타이머·이벤트 리스너의 정리 함수를 확인합니다.",
      ],
    ],
    example: {
      title: "runes로 상태와 파생 값 나누기",
      description: "Svelte 5의 .svelte 컴포넌트 예제입니다.",
      language: "Svelte",
      code: "<script>\n  let count = $state(0);\n  let doubled = $derived(count * 2);\n</script>\n\n<button onclick={() => count += 1}>\n  {count} · 두 배 {doubled}\n</button>",
      note: "계산 가능한 값은 derived로 표현합니다. 라우터·서버·저장 기능은 포함하지 않습니다.",
    },
    rationale: {
      short:
        "간결한 컴포넌트 문법과 컴파일 기반 반응형 UI를 원할 때 유용합니다.",
      problem:
        "화면 상태·템플릿·스타일을 연결하는 반복 코드가 많아질 수 있습니다.",
      change: "컴파일러와 명시적인 반응형 선언으로 갱신 경계를 표현합니다.",
      decisions: [
        {
          gainTitle: "컴포넌트 표현",
          gain: "표시·스타일·동작을 가까이 구성합니다.",
          costTitle: "컴파일 규칙",
          cost: "반응형 문법과 빌드·버전의 조건을 알아야 합니다.",
        },
        {
          gainTitle: "파생 상태 표현",
          gain: "상태와 계산의 의존성을 드러냅니다.",
          costTitle: "효과·외부 통합",
          cost: "입출력·구독·앱 서버 경계는 별도 설계합니다.",
        },
      ],
      ask: "프로젝트와 팀에 Svelte의 컴파일·반응형 모델이 맞나요?",
      simpler:
        "정적인 페이지는 HTML이나 Astro로 시작하고 필요한 상호작용만 더할 수 있습니다.",
    },
    related: ["vue", "react", "astro"],
    aliases: ["스벨트", "Svelte 5"],
    image: "svelte",
    sources: [
      [
        "Svelte · $state",
        "https://github.com/sveltejs/svelte/blob/main/documentation/docs/02-runes/02-$state.md",
        "Svelte 5 공식 문서의 $state 프록시와 $derived 계산.",
      ],
      [
        "Svelte · $derived",
        "https://github.com/sveltejs/svelte/blob/main/documentation/docs/02-runes/03-$derived.md",
        "Svelte 5 공식 문서의 $state 프록시와 $derived 계산.",
      ],
      [
        "Svelte 공식 문서 · 추가 읽기",
        "https://svelte.dev/docs/svelte/overview",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/svelte/svelte-original.svg",
    logoAlt: "Svelte 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "astro",
    name: "Astro",
    provider: "Astro 팀 · Astro 커뮤니티",
    category: "web",
    type: "콘텐츠 중심 웹 프레임워크",
    summary:
      "HTML 중심 페이지에 필요한 상호작용 컴포넌트만 연결하는 웹 프레임워크입니다.",
    definition:
      "Astro는 콘텐츠를 HTML로 구성하고 islands 모델로 일부 컴포넌트에 클라이언트 동작을 연결합니다. client 지시어로 언제 컴포넌트를 내려받아 활성화할지 정할 수 있습니다. 기본 정적 생성과 서버 어댑터를 통한 요청 시 실행은 다른 배포 경로입니다.",
    useCases: [
      [
        "문서·블로그·소개 페이지",
        "읽는 콘텐츠 중심 페이지에서 브라우저 스크립트를 필요한 부분에만 둡니다.",
      ],
      [
        "일부 상호작용이 있는 콘텐츠",
        "검색·계산기·선택 UI를 아일랜드로 연결하고 사용할 UI 통합을 고릅니다.",
      ],
    ],
    concepts: [
      [
        "HTML과 아일랜드",
        "서버·빌드가 만든 콘텐츠와 클라이언트에서 동작할 컴포넌트를 구분합니다.",
      ],
      [
        "client 지시어",
        "client:load·idle·visible 등으로 활성화 시점을 조절합니다. 지연은 첫 사용 응답성에도 영향을 줍니다.",
      ],
      [
        "정적·요청 시 실행",
        "서버 어댑터와 라우트 정책에 따라 데이터 조회·인증·배포 조건이 달라집니다.",
      ],
    ],
    flow: [
      ["콘텐츠·라우트 구성", "문서와 컴포넌트의 경계를 정합니다."],
      ["HTML 생성", "빌드 또는 설정한 서버 실행으로 콘텐츠를 만듭니다."],
      [
        "필요한 UI 활성화",
        "지시어의 조건에 맞춰 클라이언트 코드를 연결합니다.",
      ],
    ],
    points: [
      [
        "공유 상태의 경계",
        "여러 아일랜드의 상태·이벤트를 어떻게 공유할지 정합니다.",
      ],
      [
        "지연 로딩과 접근성",
        "동작 준비 전의 콘텐츠·입력·대체 경로를 고려합니다.",
      ],
      [
        "서버·브라우저 데이터 구분",
        "빌드 결과·HTML·직렬화 props에 공개할 정보만 담습니다.",
      ],
    ],
    diagnostics: [
      [
        "화면은 보이는데 버튼이 반응하지 않음",
        "해당 컴포넌트의 통합 설치와 client 지시어·활성화 조건을 확인합니다.",
      ],
      [
        "데이터가 배포 전 값으로 남음",
        "정적 생성 시점·서버 어댑터·캐시와 콘텐츠 재빌드 경로를 구분합니다.",
      ],
    ],
    example: {
      title: "보일 때만 상호작용 컴포넌트 활성화",
      description:
        "Astro에 React 통합이 설치되고 Counter.jsx가 존재한다는 가정입니다.",
      language: "Astro",
      code: '---\nimport Counter from "../components/Counter.jsx";\n---\n<h1>기술 설명</h1>\n<p>읽는 내용은 HTML로 제공하고 아래 UI만 활성화합니다.</p>\n<Counter client:visible />',
      note: "컴포넌트 파일과 통합 설치는 별도입니다. 화면 전체가 즉시 상호작용해야 하는 앱에 같은 전략이 항상 유리한 것은 아닙니다.",
    },
    rationale: {
      short: "읽는 콘텐츠가 중심이고 일부 UI만 상호작용할 때 유용합니다.",
      problem:
        "문서 페이지 전체에 큰 클라이언트 앱을 내려보내면 필요 이상의 실행 비용이 생길 수 있습니다.",
      change: "HTML 콘텐츠와 활성화할 아일랜드의 경계를 나눕니다.",
      decisions: [
        {
          gainTitle: "선택적 클라이언트 실행",
          gain: "필요한 컴포넌트의 활성화 시점을 정합니다.",
          costTitle: "경계 간 상태",
          cost: "아일랜드 사이의 상태·이벤트 공유를 설계합니다.",
        },
        {
          gainTitle: "콘텐츠 작성 규약",
          gain: "문서와 UI 통합을 함께 구성합니다.",
          costTitle: "동적 기능의 조건",
          cost: "서버 어댑터·인증·캐시 요구를 확인합니다.",
        },
      ],
      ask: "페이지의 대부분이 읽는 내용인가요, 지속적인 앱 상호작용인가요?",
      simpler:
        "작은 정적 사이트는 HTML로 시작하고 앱 중심이면 다른 웹 프레임워크와 비교하세요.",
    },
    related: ["react", "svelte", "nextjs"],
    aliases: ["아스트로", "Astro framework"],
    image: "astro",
    sources: [
      [
        "Astro · Islands architecture",
        "https://github.com/withastro/docs/blob/main/src/content/docs/en/concepts/islands.mdx",
        "Astro 공식 문서의 islands·선택적 hydration과 클라이언트 스크립트.",
      ],
      [
        "Astro · Scripts and event handling",
        "https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/client-side-scripts.mdx",
        "Astro 공식 문서의 islands·선택적 hydration과 클라이언트 스크립트.",
      ],
      [
        "Astro 공식 문서 · 추가 읽기",
        "https://docs.astro.build/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/astro/astro-original.svg",
    logoAlt: "Astro 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    provider: "Tailwind Labs · Tailwind CSS 커뮤니티",
    category: "web",
    type: "유틸리티 CSS 프레임워크",
    summary:
      "작은 스타일 클래스와 테마 규칙을 조합해 화면의 배치·색·반응형 상태를 작성하는 CSS 도구입니다.",
    definition:
      "Tailwind CSS는 소스에서 사용하는 유틸리티를 찾아 CSS를 구성하는 도구입니다. 클래스는 CSS 속성·반응형 조건·상호작용 상태를 표현합니다. 디자인 시스템·접근성·컴포넌트의 업무 동작을 자동으로 제공하는 것은 아니며 주요 버전별 설정과 소스 탐지 방식을 확인해야 합니다.",
    useCases: [
      [
        "공통 스타일 규칙",
        "여백·색·글자·상태의 테마 규칙을 여러 컴포넌트에서 공유합니다.",
      ],
      [
        "반응형 UI 작성",
        "기본 스타일과 화면 조건·hover·focus-visible 등을 같은 요소에서 조합합니다.",
      ],
    ],
    concepts: [
      [
        "유틸리티와 테마",
        "작은 속성 클래스를 조합하고 팀의 색·간격 토큰을 정합니다.",
      ],
      [
        "소스 탐지",
        "빌드 도구가 실제 클래스 이름을 찾을 수 있어야 합니다. 문자열 일부를 동적으로 조합하면 생성되지 않을 수 있습니다.",
      ],
      [
        "변형과 상태",
        "반응형 접두사·focus·hover는 CSS 조건입니다. 서버·클라이언트 상태를 저장하는 기능은 아닙니다.",
      ],
    ],
    flow: [
      ["테마·소스 설정", "버전에 맞는 테마와 탐지 대상을 정합니다."],
      ["사용 클래스 수집", "완전한 클래스 이름을 바탕으로 CSS를 생성합니다."],
      ["브라우저 스타일 적용", "캐스케이드·상태·화면 조건에 맞춰 표시합니다."],
    ],
    points: [
      [
        "동적 값은 매핑으로 명시",
        "가능한 클래스의 전체 이름을 코드에 두고 실제 생성된 CSS를 확인합니다.",
      ],
      [
        "컴포넌트 추상화",
        "같은 스타일 문자열의 무분별한 복사를 줄이되 모든 속성을 추상화하지는 않습니다.",
      ],
      [
        "접근성과 의미 구조 별도 설계",
        "색 대비·포커스·라벨·키보드 동작은 작성자가 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "개발에서는 되는데 배포에서 스타일 없음",
        "소스 탐지 경로·동적 클래스 조합·사용 버전과 생성 결과를 확인합니다.",
      ],
      [
        "유틸리티를 추가해도 다른 스타일이 이김",
        "캐스케이드·우선순위·상태 조건과 중복된 CSS를 확인합니다.",
      ],
    ],
    example: {
      title: "상태와 포커스를 함께 표시",
      description: "Tailwind CSS가 빌드되어 연결된 HTML의 버튼 예입니다.",
      language: "HTML",
      code: '<button class="rounded-md bg-blue-700 px-4 py-3 font-medium text-white\n               hover:bg-blue-800 focus-visible:outline\n               focus-visible:outline-2 focus-visible:outline-offset-2">\n  기술 정보 보기\n</button>',
      note: "버튼의 실제 동작과 접근 가능한 이름·상태는 별도로 연결해야 합니다. 이 프로젝트에 Tailwind를 설치한다는 의미는 아닙니다.",
    },
    rationale: {
      short:
        "화면의 스타일 규칙과 상태 표현을 일관된 유틸리티로 조합할 때 유용합니다.",
      problem:
        "여러 화면의 임의 여백·색·상태 규칙이 늘면 일관성을 유지하기 어렵습니다.",
      change: "테마와 작은 유틸리티를 컴포넌트에 조합합니다.",
      decisions: [
        {
          gainTitle: "공통 스타일 어휘",
          gain: "간격·색·상태를 같은 규칙으로 표현합니다.",
          costTitle: "마크업의 밀도",
          cost: "긴 클래스와 반복 스타일을 관리해야 합니다.",
        },
        {
          gainTitle: "사용 중심의 CSS 생성",
          gain: "소스에 있는 클래스에 맞춰 결과를 만듭니다.",
          costTitle: "빌드와 탐지",
          cost: "동적 클래스·외부 패키지·버전 설정을 확인합니다.",
        },
      ],
      ask: "팀의 디자인 토큰과 컴포넌트 작성 방식에 맞나요?",
      simpler:
        "작은 사이트는 CSS 변수와 일반 CSS로 시작해 반복 문제가 생길 때 비교할 수 있습니다.",
    },
    related: ["react", "vue", "astro"],
    aliases: ["테일윈드", "Tailwind", "유틸리티 CSS"],
    image: "tailwindcss",
    sources: [
      [
        "Tailwind CSS · styling-with-utility-classes.mdx",
        "https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/styling-with-utility-classes.mdx",
        "Tailwind CSS 공식 문서의 유틸리티·상태·반응형과 소스 탐지 규칙.",
      ],
      [
        "Tailwind CSS · responsive-design.mdx",
        "https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/responsive-design.mdx",
        "Tailwind CSS 공식 문서의 유틸리티·상태·반응형과 소스 탐지 규칙.",
      ],
      [
        "Tailwind CSS 공식 문서 · 추가 읽기",
        "https://tailwindcss.com/docs",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/tailwindcss/tailwindcss-original.svg",
    logoAlt: "Tailwind CSS 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "tanstack-query",
    name: "TanStack Query",
    provider: "TanStack · TanStack Query 기여자",
    category: "web",
    type: "비동기 서버 상태 관리 라이브러리",
    summary:
      "서버 데이터 조회의 키·캐시·갱신·재시도 상태를 UI에 연결하는 라이브러리입니다.",
    definition:
      "TanStack Query는 원격 데이터의 조회 결과와 수명을 관리하는 도구입니다. query key로 데이터를 구분하고 staleTime·사용 여부·갱신 조건을 바탕으로 조회합니다. 서버 DB의 트랜잭션이나 일반 UI 상태 저장소와는 다른 계층이며 프레임워크별 어댑터를 확인해야 합니다.",
    useCases: [
      [
        "반복되는 API 조회",
        "여러 컴포넌트에서 같은 데이터를 읽고 로딩·오류·재조회를 일관되게 처리합니다.",
      ],
      [
        "수정 뒤 데이터 갱신",
        "mutation 뒤 관련 조회를 무효화하거나 캐시를 갱신합니다. 서버 저장의 성공과 분리해서 다룹니다.",
      ],
    ],
    concepts: [
      [
        "query key",
        "리소스와 조회 조건을 키에 넣습니다. 다른 사용자·필터의 결과를 같은 키로 섞지 않습니다.",
      ],
      [
        "staleTime과 gcTime",
        "새로움 판단과 사용하지 않는 캐시의 보관 시간은 다릅니다. 캐시가 있다는 사실이 재조회하지 않는다는 뜻은 아닙니다.",
      ],
      [
        "재시도·취소·무효화",
        "조회 실패의 재시도와 AbortSignal 전달, 수정 후 관련 데이터 갱신을 구분합니다.",
      ],
    ],
    flow: [
      ["키와 조회 함수 지정", "같은 데이터와 조건을 식별할 키를 구성합니다."],
      [
        "캐시·네트워크 조정",
        "현재 결과를 표시하고 정책에 따라 새 조회를 실행합니다.",
      ],
      [
        "변경·만료 처리",
        "수정 결과와 관련 조회를 갱신하고 사용하지 않는 캐시를 정리합니다.",
      ],
    ],
    points: [
      [
        "서버 상태와 UI 상태 분리",
        "선택한 탭·입력 중 값과 서버의 원격 자료를 같은 수명으로 관리하지 않습니다.",
      ],
      [
        "기본 재조회 정책 확인",
        "마운트·포커스·연결 복구·재시도가 발생할 조건을 제품 버전에 맞춰 확인합니다.",
      ],
      [
        "낙관적 변경의 복구",
        "실패 시 롤백·동시 변경·최종 서버 응답과의 정합성을 설계합니다.",
      ],
    ],
    diagnostics: [
      [
        "화면에 돌아올 때 예상 밖의 요청",
        "stale 여부와 포커스·재접속·마운트의 재조회 조건을 확인합니다.",
      ],
      [
        "조건을 바꿨는데 다른 결과와 섞임",
        "query key의 변수·사용자 경계와 캐시 갱신 코드를 확인합니다.",
      ],
    ],
    example: {
      title: "조회 조건·취소·새로움 정책 명시",
      description:
        "React 어댑터와 QueryClientProvider가 이미 구성된 앱의 Hook 예입니다.",
      language: "TSX",
      code: "import { useQuery } from '@tanstack/react-query';\n\nexport function useProduct(id: string) {\n  return useQuery({\n    queryKey: ['product', id],\n    staleTime: 30_000,\n    queryFn: async ({ signal }) => {\n      const response = await fetch(`/api/products/${encodeURIComponent(id)}`, { signal });\n      if (!response.ok) throw new Error('조회 실패');\n      return response.json();\n    },\n  });\n}",
      note: "30초는 학습용 정책입니다. API 응답 검증·인증·SSR의 QueryClient 수명과 사용자별 캐시 범위는 별도로 설계합니다.",
    },
    rationale: {
      short:
        "원격 조회의 캐시·재조회·오류 상태가 여러 화면에서 반복될 때 유용합니다.",
      problem:
        "컴포넌트마다 fetch·로딩·재시도·최신 응답 처리를 쓰면 규칙이 흩어집니다.",
      change: "데이터의 키와 수명·갱신 정책을 조회 계층에 모읍니다.",
      decisions: [
        {
          gainTitle: "조회 흐름 재사용",
          gain: "캐시·로딩·오류·갱신을 같은 규칙으로 다룹니다.",
          costTitle: "키와 수명 설계",
          cost: "데이터 경계와 재조회 조건을 정확히 정해야 합니다.",
        },
        {
          gainTitle: "수정과 표시 연결",
          gain: "mutation 뒤 관련 UI를 갱신합니다.",
          costTitle: "서버 정합성",
          cost: "DB 저장·경쟁·멱등성은 서버와 별도로 처리합니다.",
        },
      ],
      ask: "여러 화면에서 같은 원격 데이터의 수명 관리가 반복되나요?",
      simpler:
        "한두 번의 조회라면 fetch와 명시적 상태·취소 처리로 시작할 수 있습니다.",
    },
    related: ["react", "redux-toolkit", "graphql"],
    aliases: ["탠스택 쿼리", "TanStack", "React Query", "react-query"],
    image: "tanstack-query",
    sources: [
      [
        "TanStack Query · Important Defaults",
        "https://github.com/TanStack/query/blob/main/docs/framework/react/guides/important-defaults.md",
        "TanStack Query 공식 문서의 staleTime·기본 갱신 조건과 query key.",
      ],
      [
        "TanStack Query · Query Keys",
        "https://github.com/TanStack/query/blob/main/docs/framework/react/guides/query-keys.md",
        "TanStack Query 공식 문서의 staleTime·기본 갱신 조건과 query key.",
      ],
      [
        "TanStack Query 공식 문서 · 추가 읽기",
        "https://tanstack.com/query/latest/docs/framework/react/overview",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/TanStack/query/blob/main/media/emblem-light.svg",
    logoAlt: "TanStack Query 식별용 심벌",
    logoNote: "TanStack Query 프로젝트 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "redux-toolkit",
    name: "Redux Toolkit",
    provider: "Redux 팀 · Redux 커뮤니티",
    category: "web",
    type: "클라이언트 상태 관리 도구",
    summary:
      "여러 화면이 공유하는 상태의 변경을 action·reducer·store 규칙으로 구성하는 Redux 공식 도구입니다.",
    definition:
      "Redux Toolkit은 Redux store·slice·reducer와 비동기 도구의 설정을 단순화합니다. createSlice에서는 Immer draft를 통해 수정처럼 보이는 코드를 불변 갱신으로 처리합니다. 모든 객체를 자유롭게 변경해도 되는 것은 아니며 서버 데이터 조회는 RTK Query 등 별도의 역할과 구분합니다.",
    useCases: [
      [
        "여러 기능이 공유하는 상태",
        "여러 화면의 선택·편집·업무 UI 상태를 명시적 action으로 변경합니다.",
      ],
      [
        "변경 추적과 디버깅",
        "상태 전이와 selector를 통해 어떤 동작이 화면을 바꿨는지 추적합니다.",
      ],
    ],
    concepts: [
      [
        "store·action·reducer",
        "이벤트를 action으로 표현하고 순수 reducer에서 다음 상태를 만듭니다.",
      ],
      [
        "Immer draft",
        "createSlice 내부의 draft 변경을 불변 결과로 만듭니다. 외부 상태나 모든 객체를 임의로 바꾸는 기능은 아닙니다.",
      ],
      [
        "직렬화와 파생 selector",
        "state·action을 설명 가능한 값으로 두고 계산 가능한 값을 selector에서 파생합니다.",
      ],
    ],
    flow: [
      ["action 발행", "사용자 동작·완료 결과를 이벤트로 전달합니다."],
      ["reducer로 상태 변경", "이전 상태와 action으로 다음 상태를 만듭니다."],
      ["selector와 UI 갱신", "필요한 상태를 읽는 컴포넌트를 갱신합니다."],
    ],
    points: [
      [
        "비동기 효과를 reducer 밖에 두기",
        "네트워크·시간·랜덤 같은 효과는 middleware·thunk 등의 경로로 연결합니다.",
      ],
      [
        "전역 상태를 최소화",
        "한 화면의 입력과 계산 가능한 값을 모두 store에 넣지 않습니다.",
      ],
      [
        "서버 캐시와 역할 구분",
        "원격 데이터의 재조회·무효화와 UI 상태 전이는 다른 요구입니다.",
      ],
    ],
    diagnostics: [
      [
        "상태는 바뀌는데 화면 갱신이 이상함",
        "reducer 밖의 객체 변경·selector 참조·메모이제이션 조건을 확인합니다.",
      ],
      [
        "개발 도구에서 상태를 추적하기 어려움",
        "Promise·함수·클래스 객체와 큰 중복 자료가 store에 있는지 확인합니다.",
      ],
    ],
    example: {
      title: "slice 안에서 상태 변경 표현",
      description:
        "Redux Toolkit이 설치된 앱의 slice 예입니다. store 등록과 UI 연결은 별도입니다.",
      language: "JavaScript",
      code: "import { createSlice } from '@reduxjs/toolkit';\n\nconst counter = createSlice({\n  name: 'counter',\n  initialState: { value: 0 },\n  reducers: {\n    increment(state) { state.value += 1; },\n  },\n});\nexport const { increment } = counter.actions;\nexport default counter.reducer;",
      note: "이 변경 문법은 Immer draft를 제공하는 reducer 안에서 사용합니다. 외부 객체를 직접 변경해도 된다는 뜻은 아닙니다.",
    },
    rationale: {
      short:
        "여러 화면의 공유 상태와 변경 이력을 일관된 규칙으로 다룰 때 유용합니다.",
      problem:
        "여러 위치에서 같은 상태를 변경하면 발생 원인과 파생 결과를 추적하기 어려울 수 있습니다.",
      change: "action과 reducer로 상태 전이를 한 경로에 모읍니다.",
      decisions: [
        {
          gainTitle: "명시적 상태 전이",
          gain: "변경 원인을 추적하고 테스트하기 쉽습니다.",
          costTitle: "모델링 비용",
          cost: "action·slice·selector와 상태 범위를 설계합니다.",
        },
        {
          gainTitle: "불변 갱신 도구",
          gain: "Immer로 반복 갱신 코드를 줄입니다.",
          costTitle: "규칙의 경계",
          cost: "draft 밖 변경·비직렬화 값·부수 효과를 구분해야 합니다.",
        },
      ],
      ask: "여러 기능이 같은 클라이언트 상태를 바꾸고 추적해야 하나요?",
      simpler:
        "지역 상태와 props로 시작하고 원격 조회의 문제라면 TanStack Query와 역할을 비교하세요.",
    },
    related: ["react", "tanstack-query", "typescript"],
    aliases: ["리덕스", "RTK", "Redux", "리덕스 툴킷"],
    image: "redux-toolkit",
    sources: [
      [
        "Redux Toolkit · createSlice",
        "https://github.com/reduxjs/redux-toolkit/blob/master/docs/api/createSlice.mdx",
        "Redux Toolkit의 createSlice와 Immer draft·불변 갱신의 경계.",
      ],
      [
        "Redux Toolkit · Writing Reducers with Immer",
        "https://github.com/reduxjs/redux-toolkit/blob/master/docs/usage/immer-reducers.md",
        "Redux Toolkit의 createSlice와 Immer draft·불변 갱신의 경계.",
      ],
      [
        "Redux Toolkit 공식 문서 · 추가 읽기",
        "https://redux-toolkit.js.org/introduction/getting-started",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/redux/redux-original.svg",
    logoAlt: "Redux 브랜드 심벌",
    logoNote:
      "Devicon 원본 심벌 · 형상·색상 보존 · MIT · Redux 브랜드 심벌을 표시합니다. 개별 Toolkit 전용 심벌과 구분합니다.",
    logoScope: "brand",
  },
];
