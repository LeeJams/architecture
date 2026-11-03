export const interactiveWebTechnologies = [
  {
    id: "threejs",
    name: "Three.js",
    provider: "Three.js 프로젝트·기여자",
    category: "graphics",
    type: "브라우저 3D 라이브러리",
    summary:
      "장면·카메라·기하·재질을 구성해 브라우저에서 3D 공간과 물체를 그리는 JavaScript 라이브러리입니다.",
    definition:
      "Three.js는 Scene에 물체와 조명을 배치하고 Camera에서 본 모습을 Renderer로 그리는 3D 라이브러리입니다. WebGL 같은 저수준 그래픽 API 위에 기하·재질·텍스처·애니메이션·로더를 제공합니다. 물리 법칙·사용자 간 상태 공유·방 서버까지 하나의 기능으로 제공하는 것은 아니므로, 공간의 렌더링과 앱의 규칙·통신은 함께 설계해야 합니다.",
    useCases: [
      [
        "걸어 다니는 공간·제품 미리보기",
        "카메라와 조명을 배치하고 모델의 위치·회전을 바꾸어 산책 공간이나 제품의 모습을 보여줍니다. 기기의 GPU·화면 해상도에 맞는 표시량을 정합니다.",
      ],
      [
        "입력과 3D 물체 연결",
        "Raycaster로 화면의 클릭 위치에서 장면으로 광선을 보내 선택한 바닥이나 물체를 찾습니다. 사용자 입력·충돌 판정·카메라 이동을 이어 붙입니다.",
      ],
    ],
    concepts: [
      [
        "Scene·Object3D·좌표",
        "부모·자식 변환이 누적되는 장면 그래프입니다. 로컬 좌표와 월드 좌표, 카메라가 보는 범위를 구분해야 물체 선택과 이동을 올바르게 연결할 수 있습니다.",
      ],
      [
        "Geometry·Material·Texture",
        "기하는 정점·면의 구조, 재질은 빛과 표면의 표현, 텍스처는 재질이 읽는 데이터입니다. 같은 모양도 조명·색 공간·투명도·깊이 설정에 따라 다르게 보입니다.",
      ],
      [
        "렌더 루프와 시뮬레이션 시간",
        "프레임마다 경과 시간에 따라 상태를 갱신하고 그립니다. 프레임 수에 고정된 이동량을 더하면 빠른 기기와 느린 기기의 이동 속도가 달라집니다.",
      ],
      [
        "Raycasting과 물체 선택",
        "화면 좌표를 정규화하고 카메라에서 장면을 향한 광선과 기하의 교차를 계산합니다. 투명하게 보이는 픽셀과 기하 자체의 교차는 같은 기준이 아닐 수 있습니다.",
      ],
      [
        "GPU 자원의 수명",
        "장면에서 물체를 제거하는 것과 GPU 버퍼·재질·텍스처를 해제하는 일은 구분합니다. 공유 자원의 소유자를 정해 dispose를 호출해야 합니다.",
      ],
    ],
    flow: [
      [
        "장면과 카메라 구성",
        "기하·재질·조명·카메라를 만들고 캔버스의 크기와 시야를 맞춥니다.",
      ],
      [
        "입력·시간에 따라 상태 갱신",
        "클릭·터치·수신한 위치로 물체와 카메라의 상태를 바꿉니다.",
      ],
      [
        "GPU로 그리기·사용한 자원 정리",
        "렌더러가 화면을 만들며, 화면을 닫을 때 루프·리스너·GPU 자원을 정리합니다.",
      ],
    ],
    points: [
      [
        "프레임 시간의 병목을 나누기",
        "정점 수뿐 아니라 draw call·재질 전환·픽셀 수·그림자·투명 물체·CPU 장면 갱신을 함께 봅니다. pixel ratio가 두 배면 같은 CSS 크기에서 그릴 픽셀 수는 대략 네 배가 됩니다.",
      ],
      [
        "네트워크 전송과 렌더 루프를 분리",
        "화면을 갱신할 때마다 모든 위치를 서버에 보내지 않습니다. 최신 상태를 모아 전송하고 수신 사이의 표시를 별도로 설계합니다. Three.js가 방 동기화나 서버 권한을 대신하지 않습니다.",
      ],
      [
        "모델 로딩·좌표·색 공간 확인",
        "파일 다운로드·해석·텍스처 업로드 시간을 나누고 모델의 단위·축·카메라·조명과 색 공간을 확인합니다. 파일이 로드됐다는 사실만으로 화면에 보이지는 않습니다.",
      ],
      [
        "정리·실패·대체 화면 설계",
        "루프 중단과 resize 리스너 해제, 사용이 끝난 geometry·material·texture 해제를 함께 처리합니다. context loss나 지원 부족을 사용자에게 설명하고 복구·대체 경로를 마련합니다.",
      ],
    ],
    diagnostics: [
      [
        "화면이 검거나 물체가 보이지 않음",
        "카메라 위치·near/far·물체 크기·조명·재질·로딩 오류를 각각 확인합니다. 렌더 루프가 실제로 돌고 있는지도 점검합니다.",
      ],
      [
        "휴대폰에서 뜨겁거나 화면이 끊김",
        "프레임 시간과 GPU·CPU 부하, pixel ratio·그림자·draw call·텍스처 메모리를 확인하고 같은 장면에서 조건을 하나씩 바꿉니다.",
      ],
    ],
    example: {
      title: "장면을 만들고 닫을 때 정리하기",
      description:
        "three 패키지가 설치된 브라우저 모듈의 예입니다. mount는 캔버스를 넣을 DOM 요소입니다.",
      language: "JavaScript · Three.js",
      code: "import * as THREE from 'three';\n\nfunction mountScene(mount) {\n  const renderer = new THREE.WebGLRenderer({ antialias: true });\n  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));\n  renderer.setSize(480, 300);\n  mount.append(renderer.domElement);\n  const scene = new THREE.Scene();\n  const camera = new THREE.PerspectiveCamera(50, 480 / 300, 0.1, 100);\n  camera.position.z = 4;\n  const geometry = new THREE.BoxGeometry();\n  const material = new THREE.MeshNormalMaterial();\n  const cube = new THREE.Mesh(geometry, material);\n  scene.add(cube);\n  renderer.setAnimationLoop(() => renderer.render(scene, camera));\n  return () => {\n    renderer.setAnimationLoop(null);\n    geometry.dispose();\n    material.dispose();\n    renderer.dispose();\n    renderer.domElement.remove();\n  };\n}",
      note: "고정 크기의 최소 장면입니다. 실제 앱은 resize·입력·모델 로딩·공유 자원의 소유권과 context loss를 추가로 처리합니다. 서버와 연결하는 예제가 아닙니다.",
    },
    sources: [
      [
        "Three.js 공식 소개",
        "https://github.com/mrdoob/three.js/blob/dev/README.md",
        "확인한 JavaScript 3D 라이브러리의 범위와 공식 예제.",
      ],
      [
        "Raycaster 공식 코드",
        "https://github.com/mrdoob/three.js/blob/dev/src/core/Raycaster.js",
        "확인한 카메라·광선과 교차 판정의 API 계약.",
      ],
      [
        "자원 정리 안내",
        "https://threejs.org/manual/en/cleanup.html",
        "dispose와 자원 수명을 확인하는 추가 공식 문서.",
      ],
    ],
    related: ["webgl", "babylonjs", "websocket", "web-audio"],
    aliases: ["쓰리제이에스", "쓰리js", "3D", "three"],
    rationale: {
      short:
        "3D 장면·카메라·입력을 구성하면서 저수준 그래픽 처리의 구현 범위를 줄이기 위해 사용합니다.",
      problem:
        "3D 물체를 직접 그리려면 정점·행렬·셰이더·텍스처·조명과 화면 크기를 함께 관리해야 합니다. 제품·산책 공간·시각화에서 이 기반을 매번 구현하면 앱의 동작을 만드는 범위가 커집니다.",
      change:
        "Scene·Camera·Renderer와 기하·재질·로더로 장면을 구성합니다. 앱의 상태를 3D 표현으로 연결하고 GPU에 그리는 경로를 라이브러리에 맡깁니다.",
      decisions: [
        {
          gainTitle: "장면과 입력을 빠르게 연결",
          gain: "재사용 가능한 기하·재질·로더·Raycaster로 필요한 공간과 선택 동작을 작성할 수 있습니다.",
          costTitle: "성능과 자원은 직접 관리",
          cost: "표시량·루프·모델·텍스처와 GPU 자원 수명을 이해해야 합니다. 라이브러리 설치만으로 모바일 성능이 보장되지는 않습니다.",
        },
        {
          gainTitle: "앱에 맞게 표현을 조합",
          gain: "기존 DOM UI와 3D 장면을 함께 구성하고 필요한 도구를 선택할 수 있습니다.",
          costTitle: "규칙·통신·접근성 설계",
          cost: "충돌·방 동기화·서버의 결정과 키보드·대체 설명은 별도 작업입니다. 장면 전체를 다른 엔진으로 바꿀 때도 API와 자원 모델을 다시 연결해야 합니다.",
        },
      ],
      ask: "입체 공간과 시점 변화가 사용자에게 필요한가요? 대상 기기의 프레임 시간과 자원 정리를 관리할 수 있나요?",
      simpler:
        "정적인 설명은 이미지·SVG, 평면적인 상호작용은 Canvas 2D나 DOM으로도 구현할 수 있습니다. 필요한 표현과 기기 조건부터 확인합니다.",
    },
    image: "threejs",
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/threejs/threejs-original.svg",
    logoAlt: "Three.js 프로젝트 심벌",
    logoNote: "프로젝트 심벌 · Devicon 원본",
  },
  {
    id: "webgl",
    name: "WebGL",
    provider: "Khronos Group·브라우저 구현",
    category: "graphics",
    type: "브라우저 GPU 그래픽 API",
    summary:
      "브라우저의 캔버스에서 GPU로 기하·텍스처·셰이더를 처리해 화면을 그리는 표준 API입니다.",
    definition:
      "WebGL은 JavaScript에서 그래픽 컨텍스트를 얻어 버퍼·프로그램·텍스처와 그리기 명령을 관리하는 그래픽 API입니다. WebGL 1과 WebGL 2는 기능과 지원 조건이 다릅니다. Three.js 같은 라이브러리는 이 계층 위에 장면·카메라·재질을 구성합니다. WebGL 자체에는 사용자·서버·물리·장면 저장 모델이 없습니다.",
    useCases: [
      [
        "3D·큰 수의 그래픽 요소",
        "정점과 텍스처를 GPU로 처리해 입체 장면·많은 점·필터 등을 그립니다. GPU 지원과 장면의 표시 비용을 함께 확인합니다.",
      ],
      [
        "직접 제어하는 그래픽 파이프라인",
        "사용자 정의 셰이더와 렌더 타깃을 구성해 효과·과학 시각화·영상 처리를 구현합니다. 좌표·정밀도·상태 전환을 직접 다룹니다.",
      ],
    ],
    concepts: [
      [
        "컨텍스트와 기능 확인",
        "canvas.getContext로 얻은 객체가 null일 수 있습니다. WebGL 2라고 해서 모든 기기의 확장·한도·성능이 같지는 않습니다.",
      ],
      [
        "정점·프래그먼트 셰이더",
        "정점 단계는 위치 등의 값을 처리하고, 래스터화된 프래그먼트 단계는 출력 색 등을 계산합니다. 셰이더 컴파일과 프로그램 링크 오류를 구분합니다.",
      ],
      [
        "버퍼·텍스처·상태",
        "정점 데이터를 GPU 버퍼에, 이미지·수치 자료를 텍스처에 올립니다. viewport·깊이 검사·블렌딩·프로그램 등 현재 상태가 그리기 결과에 영향을 줍니다.",
      ],
      [
        "컨텍스트 손실",
        "GPU 자원은 영구히 유지되는 것이 아닙니다. context loss를 감지하고 사용 중인 상태·자원을 다시 구성할 수 있어야 합니다.",
      ],
    ],
    flow: [
      [
        "컨텍스트·기능 확인",
        "지원 여부와 크기를 확인하고 필요한 버퍼·셰이더를 만듭니다.",
      ],
      [
        "데이터와 그리기 상태 설정",
        "정점·텍스처·변환과 깊이·혼합 상태를 준비합니다.",
      ],
      [
        "명령 실행과 자원 회수",
        "GPU가 결과를 캔버스에 그리며 필요 없는 버퍼·프로그램·텍스처를 해제합니다.",
      ],
    ],
    points: [
      [
        "CSS 크기와 픽셀 버퍼를 구분",
        "캔버스가 차지하는 CSS 크기와 실제 그리는 픽셀 수를 맞춥니다. viewport도 바꾸고 해상도 상승에 따른 픽셀 처리 비용을 확인합니다.",
      ],
      [
        "동기식 GPU 결과 읽기를 줄이기",
        "잦은 readPixels·동기화·상태 조회는 CPU가 GPU를 기다리게 할 수 있습니다. 정점 수만 보고 병목을 판단하지 않습니다.",
      ],
      [
        "실패와 지원 차이를 표현",
        "컨텍스트 생성 실패·셰이더 오류·자원 손실을 구분하고 복구나 대체 화면을 제공합니다. WebGL 1·2와 WebGPU는 같은 API를 바꾸어 끼우는 관계가 아닙니다.",
      ],
    ],
    diagnostics: [
      [
        "그리기 호출 뒤 화면에 아무것도 없음",
        "컨텍스트·셰이더 컴파일/링크·버퍼 바인딩·속성 위치·viewport·카메라/클립 좌표와 깊이 상태를 확인합니다.",
      ],
      [
        "해상도를 올리자 갑자기 느려짐",
        "프래그먼트 처리량·오버드로·텍스처·렌더 타깃 크기와 GPU 메모리를 함께 확인합니다.",
      ],
    ],
    example: {
      title: "컨텍스트를 얻고 화면 지우기",
      description: "HTMLCanvasElement가 canvas에 연결된 브라우저 예제입니다.",
      language: "JavaScript · WebGL 2",
      code: "const gl = canvas.getContext('webgl2');\nif (!gl) throw new Error('WebGL 2를 사용할 수 없습니다.');\ncanvas.width = 640;\ncanvas.height = 360;\ngl.viewport(0, 0, canvas.width, canvas.height);\ngl.clearColor(0.95, 0.96, 0.97, 1);\ngl.clear(gl.COLOR_BUFFER_BIT);",
      note: "컨텍스트와 화면 초기화만 보여줍니다. 도형을 그리려면 셰이더 프로그램·정점 버퍼·그리기 상태를 추가로 구성해야 합니다.",
    },
    sources: [
      [
        "MDN WebGL 시작 원문",
        "https://github.com/mdn/content/blob/main/files/en-us/web/api/webgl_api/tutorial/getting_started_with_webgl/index.md",
        "확인한 컨텍스트 생성·canvas와 초기화.",
      ],
      [
        "WebGL 사양",
        "https://registry.khronos.org/webgl/specs/latest/2.0/",
        "기능·타입·오류 조건을 확인하는 표준 원문.",
      ],
      [
        "WebGL 권장 사용법",
        "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices",
        "GPU 자원·크기·호출 비용을 확인하는 추가 문서.",
      ],
    ],
    related: ["threejs", "babylonjs", "canvas2d"],
    aliases: ["웹지엘", "GPU", "셰이더", "그래픽"],
    rationale: {
      short:
        "GPU의 병렬 처리로 많은 기하·픽셀을 그리거나 직접 그래픽 파이프라인을 제어하기 위해 사용합니다.",
      problem:
        "입체 물체의 투영·조명·많은 픽셀 효과를 CPU와 DOM 요소만으로 구성하면 작업 범위와 표시 비용이 커질 수 있습니다. GPU에 데이터를 전달하고 그리는 인터페이스가 필요합니다.",
      change:
        "정점·셰이더·텍스처와 그리기 명령을 GPU에 연결합니다. 브라우저 안에서 그래픽 파이프라인을 제어할 수 있습니다.",
      decisions: [
        {
          gainTitle: "GPU 그래픽 처리 활용",
          gain: "입체 기하와 픽셀 효과를 병렬 처리하는 기반을 사용할 수 있습니다.",
          costTitle: "저수준 상태와 수명 관리",
          cost: "셰이더·버퍼·좌표·프로그램·텍스처와 기기의 기능 차이를 이해해야 합니다.",
        },
        {
          gainTitle: "표현 방식 직접 제어",
          gain: "필요한 렌더링과 사용자 정의 효과를 구성할 수 있습니다.",
          costTitle: "지원·복구·관측의 책임",
          cost: "컨텍스트 실패·손실·GPU 메모리·프레임 시간을 다루고 접근 가능한 대체 설명을 제공해야 합니다.",
        },
      ],
      ask: "직접 GPU 파이프라인을 제어해야 하나요? 장면 라이브러리로 충족하는 표현과 저수준 요구를 구분했나요?",
      simpler:
        "일반적인 3D는 Three.js·Babylon.js, 2D 도형·차트는 SVG·Canvas 2D로 시작할 수 있습니다.",
    },
    mark: "GL",
    logoSource: null,
    logoAlt: "WebGL 웹 표준 표기",
    logoNote: "별도 제품 로고 대신 API·표준 이름을 문자로 표시합니다.",
  },
  {
    id: "canvas2d",
    name: "Canvas 2D",
    provider: "WHATWG·브라우저 구현",
    category: "graphics",
    type: "브라우저 2D 그리기 API",
    summary:
      "캔버스의 픽셀 버퍼에 도형·텍스트·이미지를 그리는 브라우저 API입니다.",
    definition:
      "CanvasRenderingContext2D는 경로·채우기·선·텍스트·이미지와 변환 상태를 조합해 2D 화면을 그립니다. DOM처럼 각각의 도형이 별도 HTML 요소로 남는 모델이 아니므로 선택·다시 그리기·실행 취소를 위한 앱의 자료 구조가 필요합니다. Three.js 장면에 넣을 텍스처를 코드로 만드는 데도 사용할 수 있습니다.",
    useCases: [
      [
        "그림판·브러시·동적 차트",
        "포인터 이동에 따라 선·그림을 그리고 화면 변화에 맞춰 필요한 영역을 갱신합니다. 도형과 작업 기록을 앱에서 별도로 보관합니다.",
      ],
      [
        "절차적 텍스처·이미지 내보내기",
        "한지·나무결·이름표 같은 이미지를 코드로 그려 3D 텍스처로 쓰거나 PNG 등으로 내보냅니다. 픽셀 이미지와 편집 가능한 문서 상태를 구분합니다.",
      ],
    ],
    concepts: [
      [
        "픽셀 버퍼와 CSS 크기",
        "width·height 속성은 실제 픽셀 버퍼의 크기이고 CSS 크기는 배치 크기입니다. DPR과 좌표 변환을 맞추어 선명도와 비용을 조절합니다.",
      ],
      [
        "현재 그리기 상태",
        "변환·투명도·선·클립 등은 후속 그리기에 영향을 줍니다. save/restore와 beginPath를 사용해 상태·경로의 범위를 관리합니다.",
      ],
      [
        "픽셀과 문서 상태",
        "한 번 그린 도형을 DOM 노드처럼 찾아 수정하지 않습니다. 원본 도형·순서·작업 이력으로 다시 그리거나 픽셀을 조작하는 정책을 정합니다.",
      ],
      [
        "출처 오염과 내보내기",
        "허용되지 않은 다른 출처 이미지를 그리면 픽셀 읽기·내보내기가 제한될 수 있습니다. CORS 설정과 이미지 로딩 경로를 확인합니다.",
      ],
    ],
    flow: [
      [
        "크기·컨텍스트 준비",
        "표시 크기·픽셀 크기를 정하고 2D 컨텍스트를 얻습니다.",
      ],
      [
        "입력과 자료를 도형으로 표현",
        "앱의 도형·작업 이력을 경로·텍스트·이미지로 그립니다.",
      ],
      [
        "다시 그리기·저장",
        "변경을 다시 그리고 문서 상태 또는 이미지로 저장합니다.",
      ],
    ],
    points: [
      [
        "크기를 바꾸면 상태가 초기화됨",
        "canvas의 width·height를 다시 지정하면 픽셀과 컨텍스트 상태가 초기화됩니다. resize 후 변환·스타일을 다시 적용합니다.",
      ],
      [
        "선택·실행 취소·접근성을 별도 설계",
        "앱의 도형 목록·hit test·작업 이력을 유지하고 키보드 조작과 텍스트 설명을 연결합니다. 픽셀만 저장하면 편집 의미가 사라집니다.",
      ],
      [
        "DPR·매 프레임 작업량 확인",
        "고해상도 버퍼, 큰 픽셀 읽기·전체 화면 다시 그리기의 비용을 확인합니다. 2D 도형 몇 개를 위해 항상 WebGL이 필요한 것은 아닙니다.",
      ],
    ],
    diagnostics: [
      [
        "글자·선이 흐리거나 클릭 위치가 어긋남",
        "CSS와 픽셀 버퍼의 비율·DPR·좌표 변환, 캔버스의 실제 화면 위치와 확대 배율을 확인합니다.",
      ],
      [
        "PNG로 저장할 때 오류가 발생",
        "다른 출처 이미지의 CORS·로딩 방식과 캔버스 오염 여부를 확인하고, 저장할 데이터가 이미지인지 편집 문서인지도 구분합니다.",
      ],
    ],
    example: {
      title: "CSS 크기와 픽셀 크기를 맞추기",
      description: "canvas가 HTMLCanvasElement인 예제입니다.",
      language: "JavaScript · Canvas 2D",
      code: "const width = 480, height = 240;\nconst ratio = Math.min(devicePixelRatio || 1, 2);\ncanvas.style.width = `${width}px`;\ncanvas.style.height = `${height}px`;\ncanvas.width = Math.round(width * ratio);\ncanvas.height = Math.round(height * ratio);\nconst ctx = canvas.getContext('2d');\nif (!ctx) throw new Error('2D 캔버스를 사용할 수 없습니다.');\nctx.setTransform(ratio, 0, 0, ratio, 0, 0);\nctx.fillStyle = '#eef2f6';\nctx.fillRect(0, 0, width, height);\nctx.fillStyle = '#24292f';\nctx.font = '20px sans-serif';\nctx.fillText('화면 좌표와 픽셀 버퍼', 24, 52);",
      note: "resize 때 버퍼와 그리기 상태를 다시 맞춰야 합니다. 캔버스를 페이지 폭에 맞추는 배치와 키보드·대체 텍스트는 별도 구성입니다.",
    },
    sources: [
      [
        "MDN Canvas 기본 사용 원문",
        "https://github.com/mdn/content/blob/main/files/en-us/web/api/canvas_api/tutorial/basic_usage/index.md",
        "확인한 canvas·2D 컨텍스트와 기본 동작.",
      ],
      [
        "HTML Canvas 2D 사양",
        "https://html.spec.whatwg.org/multipage/canvas.html#2dcontext",
        "그리기 상태·크기·출처 조건을 확인하는 표준 원문.",
      ],
      [
        "MDN Canvas 튜토리얼",
        "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial",
        "경로·텍스트·이미지·변환을 읽는 추가 문서.",
      ],
    ],
    related: ["webgl", "threejs", "localstorage"],
    aliases: ["캔버스", "캔버스2D", "Canvas", "그림판"],
    rationale: {
      short:
        "포인터·자료에 따라 많은 2D 도형이나 텍스처의 픽셀을 직접 그려야 할 때 사용합니다.",
      problem:
        "브러시 자국·수많은 점·절차적 텍스처를 각각 DOM 요소로 관리하면 화면 요소와 갱신의 범위가 커집니다. 이미지 버퍼를 직접 만들고 갱신할 방법이 필요할 수 있습니다.",
      change:
        "한 캔버스에 경로·텍스트·이미지를 그리고 앱의 자료로 화면을 다시 만듭니다. 생성한 픽셀을 3D 텍스처나 내보낼 이미지로 활용할 수도 있습니다.",
      decisions: [
        {
          gainTitle: "픽셀 단위의 자유로운 표현",
          gain: "도형·이미지·글자와 합성 규칙을 조합해 필요한 화면을 만들 수 있습니다.",
          costTitle: "선택과 문서 상태를 관리",
          cost: "도형의 의미·위치·작업 이력과 다시 그리기·hit test를 앱에서 유지해야 합니다.",
        },
        {
          gainTitle: "코드로 이미지 생성",
          gain: "외부 이미지 없이 패턴·텍스처·작업 결과를 만들 수 있습니다.",
          costTitle: "해상도·읽기 비용·접근성",
          cost: "픽셀 수와 동기식 픽셀 처리 비용을 확인하고, 키보드·텍스트·출처 조건을 다뤄야 합니다.",
        },
      ],
      ask: "표현을 픽셀로 직접 그릴 필요가 있나요? 개별 요소의 선택·의미와 작업 기록을 어디에 둘지 정했나요?",
      simpler:
        "메뉴·텍스트 UI는 DOM, 도형의 선택·확대와 문서 구조가 중요하면 SVG도 검토할 수 있습니다.",
    },
    mark: "2D",
    logoSource: null,
    logoAlt: "Canvas 2D 웹 표준 표기",
    logoNote: "별도 제품 로고 대신 API·표준 이름을 문자로 표시합니다.",
  },
  {
    id: "babylonjs",
    name: "Babylon.js",
    provider: "Babylon.js 프로젝트·기여자",
    category: "graphics",
    type: "브라우저 3D 엔진",
    summary:
      "장면·카메라·재질·로더와 여러 3D 제작 기능을 제공하는 웹 3D 엔진입니다.",
    definition:
      "Babylon.js는 Engine과 Scene을 중심으로 카메라·조명·메시·재질·애니메이션 등을 구성하는 3D 엔진입니다. 지원되는 브라우저와 엔진 설정에 따라 WebGL·WebGPU 렌더링을 선택합니다. Three.js와 비슷한 장면 역할을 맡을 수 있지만 장면 API·도구·자원 관리가 달라 애플리케이션 코드를 그대로 바꾸어 끼우는 관계는 아닙니다.",
    useCases: [
      [
        "상호작용하는 3D 앱·체험",
        "카메라·애니메이션·로더·재질·검사 도구를 활용해 제품 미리보기나 3D 공간을 만듭니다. 필요한 기능과 엔진 버전을 함께 선택합니다.",
      ],
      [
        "장면 제작과 실행의 통합",
        "외부 모델을 로드하고 장면을 검사·조정하며 여러 3D 기능을 같은 엔진 모델로 관리합니다. 물리 등 추가 구성은 필요한 플러그인과 실행 비용을 확인합니다.",
      ],
    ],
    concepts: [
      [
        "Engine·Scene",
        "엔진은 렌더링 기반을, Scene은 장면의 물체·카메라·조명 등을 관리합니다. 앱의 화면 전환과 장면 수명·렌더 루프를 연결합니다.",
      ],
      [
        "카메라·메시·재질",
        "기하 구조와 표면 표현, 보는 위치를 엔진 API로 조합합니다. 모델 단위·축·텍스처와 재질 모델의 차이가 이관 결과에 영향을 줍니다.",
      ],
      [
        "WebGL·WebGPU 선택",
        "기기의 기능·브라우저 지원과 엔진의 생성 방식에 따라 경로를 선택합니다. WebGPU가 존재한다고 모든 기기에서 더 빠르거나 같은 결과가 보장되지는 않습니다.",
      ],
      [
        "모듈·도구·플러그인",
        "검사 도구·로더·물리 등의 모듈과 버전·의존성을 확인합니다. 필요한 기능의 로딩 범위를 구성하고 배포 크기를 측정합니다.",
      ],
    ],
    flow: [
      ["엔진·장면 준비", "캔버스와 기능 조건에 맞는 엔진·Scene을 생성합니다."],
      [
        "입력·모델·동작 연결",
        "카메라·물체·재질·애니메이션과 사용자 동작을 구성합니다.",
      ],
      [
        "렌더·크기 변경·종료",
        "프레임을 그리고 resize에 대응하며 장면을 닫을 때 자원과 루프를 정리합니다.",
      ],
    ],
    points: [
      [
        "이관 범위를 장면 계층으로 정하기",
        "Three.js의 Scene·Material·Controls를 이름만 바꿔 옮기지 않습니다. 입력·좌표·로더·재질·애니메이션·정리 경로를 대응시키고 실제 모델로 비교합니다.",
      ],
      [
        "기능과 번들·자원 수명 확인",
        "도구·로더·물리를 포함하는 범위를 정하고 시작 시간·메모리·프레임 시간을 측정합니다. Scene·Engine·외부 리스너의 수명을 함께 관리합니다.",
      ],
      [
        "네트워크와 업무 규칙 분리",
        "3D 엔진이 같은 방의 참여자나 결제·기록의 정확성을 자동으로 보장하지 않습니다. 동기화·서버의 판단·영속 저장은 별도 계약입니다.",
      ],
    ],
    diagnostics: [
      [
        "다른 엔진에서 가져온 모델이 다르게 보임",
        "모델 단위·좌표축·재질·색 공간·조명·카메라와 지원되는 확장을 확인합니다.",
      ],
      [
        "장면을 여러 번 열면 메모리가 늘어남",
        "Scene·Engine·텍스처·렌더 타깃·이벤트·옵저버가 정리되는지와 공유 자원의 소유자를 확인합니다.",
      ],
    ],
    example: {
      title: "장면과 렌더 루프의 수명 연결",
      description: "@babylonjs/core가 설치된 브라우저 모듈의 최소 예입니다.",
      language: "JavaScript · Babylon.js",
      code: "import {\n  Engine, Scene, ArcRotateCamera,\n  HemisphericLight, MeshBuilder, Vector3\n} from '@babylonjs/core';\n\nconst engine = new Engine(canvas, true);\nconst scene = new Scene(engine);\nconst camera = new ArcRotateCamera('camera', 0.8, 1.1, 5, Vector3.Zero(), scene);\ncamera.attachControl(canvas, true);\nnew HemisphericLight('light', new Vector3(0, 1, 0), scene);\nMeshBuilder.CreateBox('box', {}, scene);\nconst draw = () => scene.render();\nengine.runRenderLoop(draw);\nconst resize = () => engine.resize();\nwindow.addEventListener('resize', resize);\nfunction dispose() {\n  window.removeEventListener('resize', resize);\n  engine.stopRenderLoop(draw);\n  scene.dispose();\n  engine.dispose();\n}",
      note: "dispose는 앱에서 이 장면을 닫을 때 호출합니다. 패키지·모듈 구성과 기기 기능은 사용하는 버전에서 확인합니다. 서버 동기화는 포함하지 않습니다.",
    },
    sources: [
      [
        "Babylon.js 공식 저장소",
        "https://github.com/BabylonJS/Babylon.js",
        "확인한 웹 3D 엔진의 기능·모듈과 공식 안내.",
      ],
      [
        "Babylon.js 시작 안내",
        "https://doc.babylonjs.com/journey/theFirstStep/",
        "Engine·Scene·카메라·장면 구성의 추가 공식 문서.",
      ],
      [
        "Babylon.js 문서",
        "https://doc.babylonjs.com/",
        "버전별 API·WebGPU·자원 관리 확인.",
      ],
    ],
    related: ["threejs", "webgl", "websocket"],
    aliases: ["바빌론", "바빌론제이에스", "Babylon"],
    rationale: {
      short:
        "장면 제작·검사와 여러 3D 기능을 같은 엔진 모델로 연결하고 싶을 때 사용합니다.",
      problem:
        "3D 앱에 로더·재질·애니메이션·입력·제작 도구를 따로 조합하면 기능 간 설정과 수명이 복잡해질 수 있습니다. 필요한 기능을 한 장면 모델과 도구로 다룰 기반을 검토합니다.",
      change:
        "Engine·Scene과 관련 모듈로 장면의 구성·실행·검사를 연결합니다. 필요한 기능을 엔진의 API와 도구로 작성합니다.",
      decisions: [
        {
          gainTitle: "여러 3D 기능을 함께 구성",
          gain: "장면·재질·애니메이션·도구를 같은 생태계의 구성으로 연결할 수 있습니다.",
          costTitle: "엔진과 모듈의 학습·의존성",
          cost: "버전·플러그인·로딩 범위와 도구의 사용법을 익혀야 합니다.",
        },
        {
          gainTitle: "제작·진단의 공통 기반",
          gain: "장면을 검사하고 필요한 렌더 경로를 선택하는 도구를 활용할 수 있습니다.",
          costTitle: "이관과 성능 검증",
          cost: "기존 장면의 API·좌표·재질·자원 수명을 다시 연결하고 대상 기기의 시작 시간·메모리·프레임 시간을 비교해야 합니다.",
        },
      ],
      ask: "장면 제작과 여러 기능을 한 엔진으로 관리해야 하나요? 팀이 필요한 도구·모듈과 기기 조건을 확인했나요?",
      simpler:
        "작은 3D 표현은 현재 쓰는 Three.js 기반을 유지하거나, 입체가 필요 없는 화면은 DOM·SVG로 구현할 수 있습니다.",
    },
    image: "babylonjs",
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/babylonjs/babylonjs-original.svg",
    logoAlt: "Babylon.js 프로젝트 심벌",
    logoNote: "프로젝트 심벌 · Devicon 원본",
  },
  {
    id: "web-audio",
    name: "Web Audio API",
    provider: "W3C·브라우저 구현",
    category: "browser",
    type: "브라우저 오디오 API",
    summary:
      "오디오 소스·필터·음량·효과를 노드로 연결해 재생·합성·믹싱하는 브라우저 API입니다.",
    definition:
      "Web Audio API는 AudioContext 안에서 소스와 처리 노드를 연결해 소리를 재생하고 합성합니다. 파일을 디코딩해 재생하거나 오실레이터·노이즈로 소리를 만들고 필터·음량·공간 효과를 조합합니다. 일반적인 긴 음악 재생에는 HTMLAudioElement를 함께 쓸 수도 있습니다. 사용자 조작·오디오 시계·장치 상태와 노드의 수명을 함께 다뤄야 합니다.",
    useCases: [
      [
        "행동의 효과음과 공간의 환경음",
        "인사·클릭·충돌의 짧은 소리와 바람·물소리의 음량을 별도 버스로 조절합니다. 여러 소리가 겹칠 때의 출력 크기와 재생 정책을 정합니다.",
      ],
      [
        "소리 합성·가공·정밀한 예약",
        "주파수·필터·음량의 시간 변화를 조합하고 오디오 시계에 맞춰 재생을 예약합니다. 시각 애니메이션과 오디오의 갱신 시계는 구분합니다.",
      ],
    ],
    concepts: [
      [
        "AudioContext와 그래프",
        "컨텍스트 안에서 소스→처리 노드→destination의 경로를 만듭니다. 연결을 두 번 만들거나 닫힌 컨텍스트를 재사용하지 않도록 소유권을 정합니다.",
      ],
      [
        "사용자 조작과 상태",
        "컨텍스트가 suspended로 시작하거나 중단될 수 있습니다. 사용자 클릭에서 생성·resume하고 running·suspended·closed 상태를 화면과 연결합니다.",
      ],
      [
        "오디오 시계와 자동화",
        "currentTime과 AudioParam의 예약·램프로 변화를 만들면 짧은 효과의 타이밍과 음량을 다룰 수 있습니다. JS 타이머만으로 정밀한 오디오 시점을 보장하지 않습니다.",
      ],
      [
        "버퍼·미디어·합성 소스",
        "짧은 음원은 디코딩한 버퍼를 재사용하고, 길게 재생하는 미디어는 미디어 요소와 연결하는 선택을 검토합니다. AudioBufferSourceNode는 한 번 시작하는 소스이므로 다음 재생은 새 소스를 만듭니다.",
      ],
    ],
    flow: [
      [
        "사용자 조작 후 준비",
        "컨텍스트의 상태를 확인하고 소스·처리·출력 경로를 구성합니다.",
      ],
      [
        "재생과 시간 변화 예약",
        "버퍼·오실레이터를 시작하고 오디오 시계에 음량·필터 변화를 예약합니다.",
      ],
      [
        "정지·해제·상태 반영",
        "사용이 끝난 소스와 연결·컨텍스트를 정리하고 음소거·중단 상태를 표시합니다.",
      ],
    ],
    points: [
      [
        "갑작스러운 음량 변화와 과도한 출력 방지",
        "소리를 켜고 끌 때 Gain의 짧은 램프를 사용하고 여러 소스의 합산을 고려합니다. 사용자의 음량·음소거 선택을 존중합니다.",
      ],
      [
        "소스·리스너·컨텍스트 수명 관리",
        "같은 효과를 누를 때마다 컨텍스트와 루프가 쌓이지 않게 합니다. 파일 다운로드·디코딩·노드 생성·출력 문제를 나눠 확인합니다.",
      ],
      [
        "재생 성공과 서버 상태를 구분",
        "클라이언트가 재생하는 효과음과 다른 사용자에게 행동을 전달하는 통신은 별도 흐름입니다. 오디오 API가 사용자 간 상태나 음성 통화를 자동으로 동기화하지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "소리 버튼을 눌러도 들리지 않음",
        "컨텍스트 상태·사용자 제스처·음소거·Gain·노드 연결과 출력 장치를 확인합니다. 파일 요청과 디코딩 오류도 따로 봅니다.",
      ],
      [
        "클릭 소리·울림이 계속 쌓임",
        "소스·반복 재생·리버브·중복 연결과 정리 경로, 음량 변화의 불연속을 확인합니다.",
      ],
    ],
    example: {
      title: "사용자 클릭에서 짧은 소리 만들기",
      description: "playButton과 closeButton이 DOM 버튼인 예제입니다.",
      language: "JavaScript · Web Audio",
      code: "let audio;\nplayButton.addEventListener('click', async () => {\n  audio ??= new AudioContext();\n  await audio.resume();\n  const tone = audio.createOscillator();\n  const gain = audio.createGain();\n  tone.frequency.value = 440;\n  tone.connect(gain).connect(audio.destination);\n  const now = audio.currentTime;\n  gain.gain.setValueAtTime(0.0001, now);\n  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);\n  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);\n  tone.onended = () => { tone.disconnect(); gain.disconnect(); };\n  tone.start(now);\n  tone.stop(now + 0.22);\n});\ncloseButton.addEventListener('click', async () => {\n  if (audio) await audio.close();\n  audio = undefined;\n});",
      note: "짧은 단일 효과의 예입니다. 실제 앱은 빠른 연속 클릭·비동기 오류·중단·출력 장치 변화와 화면 종료 때의 정리를 함께 처리합니다.",
    },
    sources: [
      [
        "MDN 오디오 권장 사용법 원문",
        "https://github.com/mdn/content/blob/main/files/en-us/web/api/web_audio_api/best_practices/index.md",
        "확인한 소스 선택·사용자 조작·재생 정책과 상태.",
      ],
      [
        "Web Audio 사양",
        "https://webaudio.github.io/web-audio-api/",
        "컨텍스트·노드·오디오 시간의 표준 계약.",
      ],
      [
        "MDN Web Audio API",
        "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",
        "노드·예약·미디어 연결을 확인하는 추가 문서.",
      ],
    ],
    related: ["threejs", "canvas2d", "javascript"],
    aliases: ["웹오디오", "오디오", "효과음", "AudioContext"],
    rationale: {
      short:
        "여러 소리의 타이밍·음량·필터와 합성을 사용자 행동에 연결하기 위해 사용합니다.",
      problem:
        "효과음과 환경음을 동시에 재생하면서 각각의 음량·반복·잔향을 조절하거나, 누르는 순간마다 소리를 합성할 필요가 있습니다. 단순 파일 재생을 넘어 처리 경로와 시간을 관리해야 합니다.",
      change:
        "소스·필터·Gain 같은 노드를 그래프로 연결하고 오디오 시계에 재생과 변화를 예약합니다.",
      decisions: [
        {
          gainTitle: "행동에 맞춘 소리 구성",
          gain: "효과음과 환경음을 나누고 필터·음량·합성·예약을 조합할 수 있습니다.",
          costTitle: "재생 정책과 상태 대응",
          cost: "사용자 제스처·중단·출력·오류와 소리의 접근성·음소거 상태를 처리해야 합니다.",
        },
        {
          gainTitle: "파일과 합성을 함께 활용",
          gain: "버퍼를 재사용하고 필요한 소리를 코드로 만들 수 있습니다.",
          costTitle: "노드·메모리·출력 관리",
          cost: "디코딩 메모리·컨텍스트·소스 수명·중복 연결과 과도한 음량을 관리해야 합니다.",
        },
      ],
      ask: "오디오 처리·여러 소스·시간 예약이 필요한가요? 사용자 조작과 중단·정리 경로를 설계했나요?",
      simpler:
        "한 곡을 재생하고 멈추는 기능은 audio 요소로 충분할 수 있습니다. 필요한 믹싱·효과·합성의 범위에 맞춰 선택합니다.",
    },
    mark: "음향",
    logoSource: null,
    logoAlt: "Web Audio API 웹 표준 표기",
    logoNote: "별도 제품 로고 대신 API·표준 이름을 문자로 표시합니다.",
  },
  {
    id: "websocket",
    name: "WebSocket",
    provider: "IETF·WHATWG·브라우저 구현",
    category: "realtime",
    type: "양방향 통신 프로토콜·브라우저 API",
    summary:
      "연결을 유지하면서 브라우저와 서버가 메시지를 양방향으로 주고받는 통신 방식입니다.",
    definition:
      "WebSocket은 HTTP 기반 연결 협상 뒤 하나의 연결에서 메시지를 양방향으로 전달합니다. 브라우저의 WebSocket 객체는 연결·송수신·오류·닫힘을 제공합니다. 방 입장·권한·초기 상태·메시지 의미·중복 업무 방지·재연결 후 복구는 앱의 프로토콜로 정해야 합니다. 표준 브라우저 WebSocket API에는 자동 역압력 제어가 없으므로 처리할 수 있는 양을 관리해야 합니다.",
    useCases: [
      [
        "같은 공간의 위치·행동 전달",
        "변경이 생길 때 같은 방의 참여자에게 전송합니다. 렌더 주기와 통신 주기를 분리하고 처음 들어온 사용자의 상태도 준비합니다.",
      ],
      [
        "채팅·진행 상황·상호작용",
        "서버와 클라이언트가 모두 메시지를 보낼 때 활용합니다. 메시지 보관과 연결의 수명, 전송 확인과 업무 처리 완료를 구분합니다.",
      ],
    ],
    concepts: [
      [
        "연결과 앱의 준비 상태",
        "OPEN은 전송할 수 있는 연결 상태입니다. 인증·방 입장·스냅샷 수신이 끝나야 실제로 동작할 수 있는 앱도 있습니다.",
      ],
      [
        "순서와 재연결",
        "한 연결의 전달 순서와 연결을 새로 만든 뒤의 업무 연속성은 다릅니다. revision·요청 ID·스냅샷·재시도로 상태를 복구할 방법을 정합니다.",
      ],
      [
        "전송량과 역압력",
        "bufferedAmount는 아직 전송되지 않은 양을 관측하는 단서입니다. 수신 처리 속도와 메모리도 제한하고, 위치처럼 덮어써도 되는 상태와 보존할 명령을 나눕니다.",
      ],
      [
        "연결의 수명",
        "모바일 전환·백그라운드·프록시·서버 교체로 연결이 끊길 수 있습니다. heartbeat·제한 시간·취소·무작위 지연이 있는 재연결을 설계합니다.",
      ],
    ],
    flow: [
      [
        "접속·준비 확인",
        "연결을 만들고 앱의 인증·방 입장·초기 상태 교환을 마칩니다.",
      ],
      [
        "이벤트·변경분 전달",
        "종류·ID·순번을 가진 메시지를 필요한 범위로 주고받습니다.",
      ],
      [
        "끊김 감지·복구",
        "이전 연결의 작업을 정리하고 재접속 후 필요한 상태를 다시 맞춥니다.",
      ],
    ],
    points: [
      [
        "연결 성공과 명령 수락을 구분",
        "send 호출 성공만으로 서버가 좌석·결제·저장을 수락한 것은 아닙니다. 명령마다 필요한 응답·실패·시간 제한을 설계합니다.",
      ],
      [
        "재접속 때 오래된 상태를 이어 붙이지 않기",
        "연결 세대·방·revision을 확인해 이전 연결의 응답을 걸러내고 전체 상태 또는 필요한 변경분으로 복구합니다.",
      ],
      [
        "메시지 크기·빈도·받는 범위 제한",
        "매 프레임의 모든 상태를 무제한으로 브로드캐스트하지 않습니다. 최신 위치를 합치고 전송 주기를 정하며 큐·수신 처리·접속 수를 관측합니다.",
      ],
      [
        "인증과 데이터 검증을 서버에 두기",
        "브라우저 메시지의 사용자·좌표·행동을 그대로 신뢰하지 않습니다. Origin·인증·방 접근·메시지 형식과 행위의 허용 조건을 함께 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "다시 연결되었지만 다른 사람 위치가 틀림",
        "초기 상태 요청·revision·방 ID·이전 연결의 응답과 클라이언트 상태 초기화 순서를 확인합니다.",
      ],
      [
        "오래 켜두면 지연·메모리가 증가",
        "전송 큐·bufferedAmount·수신 처리량·메시지 크기·중복 리스너와 화면 갱신 비용을 구분해 확인합니다.",
      ],
    ],
    example: {
      title: "연결 상태와 앱 메시지 구분하기",
      description:
        "서버가 ready·snapshot 메시지를 구현했다는 학습용 계약입니다. example 도메인은 실제 서비스가 아닙니다.",
      language: "JavaScript · WebSocket",
      code: "const socket = new WebSocket('wss://example.com/room');\nlet roomReady = false;\nsocket.addEventListener('open', () => {\n  socket.send(JSON.stringify({ type: 'join', room: 'learning' }));\n});\nsocket.addEventListener('message', event => {\n  try {\n    const message = JSON.parse(event.data);\n    if (message.type === 'snapshot') roomReady = true;\n  } catch (error) { console.error('메시지 해석 실패', error); }\n});\nfunction sendMove(x, z) {\n  if (!roomReady || socket.readyState !== WebSocket.OPEN) return false;\n  if (socket.bufferedAmount > 16 * 1024) return false;\n  socket.send(JSON.stringify({ type: 'move', x, z }));\n  return true;\n}\nsocket.addEventListener('close', () => { roomReady = false; });",
      note: "16KiB는 설명용 기준입니다. 전송을 보류한 위치의 최신값 관리·수신 데이터 검증·heartbeat·재연결·수락 응답은 추가 설계입니다.",
    },
    sources: [
      [
        "MDN WebSocket 원문",
        "https://github.com/mdn/content/blob/main/files/en-us/web/api/websocket/index.md",
        "확인한 양방향 API·이벤트와 역압력의 제약.",
      ],
      [
        "WebSocket 프로토콜",
        "https://www.rfc-editor.org/rfc/rfc6455",
        "연결 협상·메시지·프레임의 표준.",
      ],
      [
        "브라우저 WebSocket 표준",
        "https://websockets.spec.whatwg.org/",
        "브라우저 객체·상태·이벤트 계약.",
      ],
    ],
    related: ["supabase-realtime", "firebase-rtdb", "cloudflare-workers"],
    aliases: ["웹소켓", "WS", "실시간", "양방향"],
    rationale: {
      short:
        "서버와 브라우저가 서로 변경을 보내는 앱에서 연결을 유지하며 메시지를 전달하기 위해 사용합니다.",
      problem:
        "브라우저가 주기적으로 서버에 물어보면 변화가 없는 요청도 생기고, 주기를 늘리면 새 상태를 늦게 보게 됩니다. 위치·채팅처럼 양쪽에서 계속 변경을 보내는 경험에 맞는 전달 경로가 필요합니다.",
      change:
        "연결을 열어 양쪽에서 메시지를 보냅니다. 앱의 방·권한·상태·명령 계약을 그 메시지 위에 설계합니다.",
      decisions: [
        {
          gainTitle: "변경 발생 시 양방향 전달",
          gain: "매번 새 요청을 만들지 않고 변경을 보내고 받을 수 있습니다.",
          costTitle: "연결·복구 운영",
          cost: "인증·heartbeat·제한 시간·재연결·스냅샷과 서버 교체의 연결 수명을 다뤄야 합니다.",
        },
        {
          gainTitle: "앱에 맞는 메시지 모델",
          gain: "위치·행동·응답을 필요한 형태로 설계하고 전달 범위를 나눌 수 있습니다.",
          costTitle: "수락·정확성·처리량 책임",
          cost: "순서·ID·누락 복구·업무 중복과 큐·빈도·크기 한도를 직접 설계해야 합니다.",
        },
      ],
      ask: "양쪽에서 지속적으로 변경을 보내야 하나요? 방 준비와 재접속 후 상태 복구를 설계할 수 있나요?",
      simpler:
        "변화가 적으면 HTTP 조회, 서버→브라우저 알림 중심이면 SSE를 검토할 수 있습니다. 관리형 Realtime도 전달·초기 상태·보관의 조건을 확인해 선택합니다.",
    },
    mark: "WS",
    logoSource: null,
    logoAlt: "WebSocket 웹 표준 표기",
    logoNote: "별도 제품 로고 대신 API·표준 이름을 문자로 표시합니다.",
  },
  {
    id: "cloudflare-workers",
    name: "Cloudflare Workers",
    provider: "Cloudflare",
    category: "compute",
    type: "분산 실행 플랫폼",
    summary:
      "Cloudflare의 실행 환경에서 HTTP 요청과 WebSocket 같은 이벤트를 처리하는 코드를 배포하는 플랫폼입니다.",
    definition:
      "Cloudflare Workers는 서버 프로세스와 장비를 직접 운영하는 범위를 줄이고 요청·이벤트 처리 코드를 실행하는 플랫폼입니다. Fetch API 형태의 요청·응답과 제품의 런타임 API를 사용합니다. WebSocketPair로 연결을 수락할 수 있지만 여러 연결이 같은 방의 상태를 공유하려면 단일 조정 지점과 별도 상태 모델이 필요합니다. Durable Objects·DB 등의 연결은 사용 목적에 맞춰 구성합니다.",
    useCases: [
      [
        "요청 중계·검증·응답 가공",
        "원본 앞의 요청 정책·캐시 연결·가벼운 API 처리를 구성합니다. 비밀값과 데이터 접근은 런타임의 바인딩·권한에 맞춰 연결합니다.",
      ],
      [
        "실시간 연결의 입구",
        "WebSocket 연결을 처리하고 방 상태를 맡을 서비스에 연결합니다. 같은 방을 어떤 조정 단위로 묶을지는 앱이 정해야 합니다.",
      ],
    ],
    concepts: [
      [
        "이벤트 처리와 isolate",
        "요청을 처리하는 실행 인스턴스와 전역 메모리가 영구적인 서버·공유 저장소를 뜻하지 않습니다. 요청·버전·장애 사이의 상태 보존 요구를 분리합니다.",
      ],
      [
        "바인딩과 데이터 서비스",
        "환경에 연결한 DB·객체 저장·다른 서비스 등을 바인딩으로 사용합니다. 코드에 설정 이름이 있다는 사실과 실제 운영 연결은 구분합니다.",
      ],
      [
        "WebSocketPair와 조정 지점",
        "client·server 쌍을 만들고 업그레이드 응답과 서버 쪽 연결을 처리합니다. 여러 사용자의 방 상태는 Durable Objects 같은 조정 수단을 따로 검토합니다.",
      ],
      [
        "플랫폼 조건",
        "지원 API·CPU·메모리·연결·지역·요금·배포 조건은 상품과 설정에 따릅니다. 일반 Node.js 서버와 런타임 계약이 모두 같지는 않습니다.",
      ],
    ],
    flow: [
      ["요청과 바인딩 수신", "배포한 핸들러가 요청·환경 연결을 받습니다."],
      [
        "정책·서비스·상태 경로 처리",
        "필요한 검증을 하고 원본·저장·방 조정 서비스를 호출합니다.",
      ],
      [
        "응답·연결 수명 관리",
        "HTTP 응답이나 WebSocket 연결을 돌려주고 오류·종료·재접속 경로를 관리합니다.",
      ],
    ],
    points: [
      [
        "전역 객체를 영속 방 저장소로 가정하지 않기",
        "isolate가 나뉘거나 교체될 수 있습니다. 같은 방에 대한 동시 변경을 누가 직렬화하고 복구할지 정합니다.",
      ],
      [
        "원본과 연결 구간을 나누어 관측",
        "클라이언트→Worker, Worker→원본·DB, 방 서비스의 지연·오류·연결 수를 구분합니다. 도메인만 보고 서버 내부 제품을 확정하지 않습니다.",
      ],
      [
        "호환성·수명·플랫폼 한도 확인",
        "사용 API·패키지·노드 호환 모드·장시간 연결과 상태 저장을 검증합니다. 로컬 성공만으로 실제 운영의 위치·용량·비용을 확정하지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "사용자마다 같은 방의 내용이 다름",
        "연결이 어느 조정 지점에 배정됐는지, 전역 메모리를 방 저장으로 사용했는지, 스냅샷·상태 버전을 확인합니다.",
      ],
      [
        "WebSocket은 연결됐지만 자주 끊김",
        "업그레이드·수락·프록시·인증·heartbeat·연결 종료와 배포 중의 복구 처리를 확인합니다.",
      ],
    ],
    example: {
      title: "Worker에서 WebSocket 업그레이드 받기",
      description:
        "Cloudflare Workers 런타임의 최소 에코 예입니다. 이 사이트에서 서버를 만들거나 접속하지 않습니다.",
      language: "JavaScript · Workers",
      code: "export default {\n  async fetch(request) {\n    if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {\n      return new Response('WebSocket 연결이 필요합니다.', { status: 426 });\n    }\n    const [client, server] = Object.values(new WebSocketPair());\n    server.accept();\n    server.addEventListener('message', event => {\n      server.send(event.data);\n    });\n    return new Response(null, { status: 101, webSocket: client });\n  }\n};",
      note: "단일 연결의 에코이며 멀티플레이 방 서버가 아닙니다. 인증·메시지 크기·빈도·종료·방의 단일 조정과 저장을 추가로 구성합니다.",
    },
    sources: [
      [
        "Workers 공식 WebSocket 문서 원문",
        "https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/runtime-apis/websockets.mdx",
        "확인한 WebSocketPair·연결 처리와 다중 연결의 조정 필요성.",
      ],
      [
        "Workers 런타임 안내",
        "https://developers.cloudflare.com/workers/runtime-apis/",
        "API·호환성·환경을 확인하는 추가 공식 문서.",
      ],
      [
        "Durable Objects WebSocket 안내",
        "https://developers.cloudflare.com/durable-objects/best-practices/websockets/",
        "방의 조정·연결 수명·hibernation을 검토하는 추가 공식 문서.",
      ],
    ],
    related: ["websocket", "supabase-realtime", "nodejs"],
    aliases: ["워커스", "클라우드플레어워커스", "Workers", "서버리스"],
    rationale: {
      short:
        "요청·이벤트 처리 코드를 배포하면서 실행 서버의 운영 범위를 줄이고 싶을 때 사용합니다.",
      problem:
        "작은 요청 처리나 연결 입구를 운영할 때 서버 OS·프로세스·인스턴스 배치까지 관리하는 부담이 생길 수 있습니다. 실행과 배포를 플랫폼에 맡길 범위를 결정해야 합니다.",
      change:
        "요청 핸들러와 런타임 API·바인딩으로 처리 경로를 구성합니다. 필요한 저장과 여러 연결의 조정은 별도 서비스와 계약으로 연결합니다.",
      decisions: [
        {
          gainTitle: "실행·배포 기반 활용",
          gain: "요청 처리 코드를 플랫폼에 배포하고 네트워크·운영 기능과 연결할 수 있습니다.",
          costTitle: "플랫폼 계약과 비용",
          cost: "지원 API·호환성·자원·연결·데이터 경로·요금 조건을 이해해야 합니다.",
        },
        {
          gainTitle: "연결·서비스의 입구 구성",
          gain: "WebSocket과 데이터 서비스를 필요한 경로에 연결할 수 있습니다.",
          costTitle: "상태와 연결의 수명 설계",
          cost: "전역 메모리의 공유·영속성을 가정하지 않고 방 조정·보관·오류·재접속을 설계해야 합니다.",
        },
      ],
      ask: "플랫폼에 맡길 실행·배포 역할이 명확한가요? 상태·동시 변경·런타임 호환과 데이터 경로를 확인했나요?",
      simpler:
        "기존 앱 서버나 관리형 Realtime에서 요구를 충족하면 그 기반을 활용할 수 있습니다. 실행 위치와 상태 소유자를 먼저 정합니다.",
    },
    image: "cloudflare-workers",
    logoSource:
      "https://github.com/simple-icons/simple-icons/blob/develop/icons/cloudflareworkers.svg",
    logoAlt: "Cloudflare Workers 프로젝트 심벌",
    logoNote: "Cloudflare Workers 제품 심벌 · Simple Icons 원본",
  },
  {
    id: "supabase-realtime",
    name: "Supabase Realtime",
    provider: "Supabase",
    category: "realtime",
    type: "관리형 실시간 메시징·상태 동기화",
    summary:
      "Broadcast·Presence·Postgres Changes로 메시지·참여자 상태·DB 변경을 전달하는 서비스입니다.",
    definition:
      "Supabase Realtime은 WebSocket 위에서 메시지 전달과 참여자 상태 동기화, PostgreSQL 변경 전달을 제공하는 제품입니다. Broadcast는 이벤트를, Presence는 참여자 관련 공유 상태를, Postgres Changes는 권한이 있는 DB 변경을 다룹니다. 같은 제품 안에서도 초기 상태·보관·전달 보장·권한 경계가 다르므로 필요한 기능을 선택해 연결해야 합니다.",
    useCases: [
      [
        "방의 움직임·채팅 전달",
        "방별 채널의 Broadcast로 상태·행동을 보내고 Presence로 참여자의 입장·퇴장·상태를 다룹니다. 새 참여자에게 필요한 초기 위치와 보관할 채팅은 따로 설계합니다.",
      ],
      [
        "화면에 DB 변경 반영",
        "Postgres Changes 또는 DB에서 발행하는 Broadcast 경로로 변경을 알립니다. DB에 저장된 자료와 일시적인 클라이언트 이벤트를 구분합니다.",
      ],
    ],
    concepts: [
      [
        "채널과 접근 권한",
        "프로젝트와 채널 이름이 전달 범위를 나눕니다. private 채널·인증 토큰·정책을 구성해 누가 구독하고 발행할 수 있는지 결정합니다. 공개 클라이언트 키가 접근 규칙을 대신하지 않습니다.",
      ],
      [
        "Broadcast·Presence·Postgres Changes",
        "클라이언트 Broadcast를 보관 가능한 업무 로그로 가정하지 않습니다. Presence의 현재 상태, DB의 원본 자료, 제품이 제공하는 발행·재생 경로를 각각 확인합니다.",
      ],
      [
        "초기 상태와 재접속",
        "이벤트 구독만 시작한 새 사용자는 이미 발생한 변경을 모를 수 있습니다. 초기 조회·스냅샷과 수신 이벤트의 적용 순서, 재접속 후 재동기화를 설계합니다.",
      ],
      [
        "확인 응답의 범위",
        "Broadcast의 확인 설정은 제품이 정의한 서버 수신 확인입니다. 모든 사용자가 화면에 적용했거나 업무 DB에 커밋했다는 보장으로 확대하지 않습니다.",
      ],
    ],
    flow: [
      [
        "권한·채널·초기 상태 준비",
        "인증·정책과 채널 범위를 정하고 필요한 원본 상태를 확보합니다.",
      ],
      [
        "상태·이벤트 구독과 발행",
        "Presence와 Broadcast 또는 DB 변경 경로를 역할에 맞게 연결합니다.",
      ],
      [
        "오류·재접속·채널 정리",
        "구독 상태를 관측하고 재동기화하며 화면을 닫을 때 채널을 제거합니다.",
      ],
    ],
    points: [
      [
        "Presence와 움직임의 최신값 조합",
        "참여자 메타데이터의 갱신이 Broadcast로 받은 최신 위치를 과거 값으로 덮지 않도록 시점·순번·병합 규칙을 정합니다.",
      ],
      [
        "보관과 재생의 요구를 확인",
        "클라이언트 이벤트·DB 발행·과거 메시지 재생 기능의 차이를 현재 문서에서 확인합니다. 필요한 업무 기록은 DB나 로그에 보관하고 복구 경로를 마련합니다.",
      ],
      [
        "전송 주기·한도·공유 범위 관리",
        "매 프레임의 상태를 무제한 전송하지 않습니다. 변한 필드·최신 위치·방 범위·접속 수와 메시지 사용량을 관리합니다.",
      ],
      [
        "클라이언트가 결정할 수 있는 상태 구분",
        "Presence에 좌석·점수를 썼다는 사실만으로 충돌 해결이나 부정 조작 방지가 되지는 않습니다. 업무 규칙과 접근 검증을 맡을 주체를 정합니다.",
      ],
    ],
    diagnostics: [
      [
        "입장 인원은 보이는데 위치가 되돌아감",
        "Presence 갱신과 Broadcast의 시점·병합 규칙, 이벤트 순번·방 이름과 초기 스냅샷 적용 순서를 확인합니다.",
      ],
      [
        "연결은 되지만 이벤트를 못 받음",
        "구독 상태·프로젝트·채널·이벤트 이름, self 설정·인증·private 채널 정책과 재접속을 확인합니다.",
      ],
    ],
    example: {
      title: "참여자 상태와 이동 메시지를 나누기",
      description:
        "@supabase/supabase-js와 접근 정책이 준비된 프로젝트의 학습용 예입니다.",
      language: "JavaScript · Supabase",
      code: "import { createClient } from '@supabase/supabase-js';\nconst client = createClient(projectUrl, publishableKey);\nconst channel = client.channel('room:learning', {\n  config: { broadcast: { self: false, ack: true }, presence: { key: userId } }\n});\nchannel.on('presence', { event: 'sync' }, () => {\n  console.log('참여자 상태', channel.presenceState());\n});\nchannel.on('broadcast', { event: 'move' }, ({ payload }) => {\n  console.log('수신 위치', payload);\n});\nchannel.subscribe(async status => {\n  if (status === 'SUBSCRIBED') {\n    await channel.track({ id: userId, name: displayName });\n  }\n});\nasync function sendMove(x, z) {\n  return channel.send({ type: 'broadcast', event: 'move', payload: { x, z } });\n}\nconst dispose = () => client.removeChannel(channel);",
      note: "변수·인증·정책·연결 상태·전송 빈도·수신 검증은 앱에서 준비합니다. private 채널에는 해당 구성과 권한이 필요합니다. 확인 응답은 업무 완료나 모든 클라이언트 적용을 뜻하지 않습니다.",
    },
    sources: [
      [
        "Supabase Realtime 공식 저장소",
        "https://github.com/supabase/realtime",
        "확인한 Broadcast·Presence·Postgres Changes의 서로 다른 역할.",
      ],
      [
        "Broadcast 공식 문서 원문",
        "https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/realtime/broadcast.mdx",
        "확인한 클라이언트·REST·DB 발행 경로, 확인·권한과 보관 조건.",
      ],
      [
        "Realtime 권한 안내",
        "https://supabase.com/docs/guides/realtime/authorization",
        "private 채널·정책·인증을 확인하는 추가 공식 문서.",
      ],
    ],
    related: ["websocket", "firebase-rtdb", "postgresql", "cloudflare-workers"],
    aliases: ["수파베이스", "Supabase", "Presence", "Broadcast"],
    rationale: {
      short:
        "메시지 전달·참여자 상태·DB 변경을 관리형 채널로 연결하기 위해 사용합니다.",
      problem:
        "방 참여자와 움직임·채팅·DB 변경을 직접 전달하려면 연결·구독·전달 범위·접속 상태를 구현하고 운영해야 합니다. 필요한 전달 기능을 관리형 제품에 맡길 수 있는지 검토합니다.",
      change:
        "채널과 Broadcast·Presence·Postgres Changes로 각 역할을 구성합니다. 초기 상태와 권한·업무 보관은 그 위에 명시적으로 연결합니다.",
      decisions: [
        {
          gainTitle: "실시간 전달 기반 활용",
          gain: "참여자 동기화와 이벤트·DB 변경을 제품 기능으로 연결할 수 있습니다.",
          costTitle: "역할별 보장과 권한 확인",
          cost: "각 기능의 보관·재생·확인 범위와 인증·채널 정책을 이해해야 합니다.",
        },
        {
          gainTitle: "방과 화면의 상태 연결",
          gain: "채널을 사용 경험의 단위로 나누고 클라이언트에 변화를 반영할 수 있습니다.",
          costTitle: "병합·복구·사용량 관리",
          cost: "초기 상태·재접속·순번·전송량·한도와 최신 위치의 병합을 앱에서 설계해야 합니다.",
        },
      ],
      ask: "필요한 기능이 메시지·참여자 상태·DB 변경 중 무엇인가요? 보관·재생·권한과 사용량 조건이 맞나요?",
      simpler:
        "간헐적 갱신은 HTTP 조회로 시작할 수 있습니다. 현재 DB의 구독 기능이나 자체 WebSocket과 비교할 때도 같은 초기 상태·복구 요구를 기준으로 봅니다.",
    },
    image: "supabase",
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/supabase/supabase-original.svg",
    logoAlt: "Supabase 브랜드 심벌 · Realtime 제품명은 별도 표시",
    logoNote:
      "Supabase 브랜드 심벌 · Devicon 원본. 제품명은 Supabase Realtime으로 구분합니다.",
    logoScope: "brand",
  },
  {
    id: "firebase-rtdb",
    name: "Firebase Realtime Database",
    provider: "Google·Firebase",
    category: "database",
    type: "관리형 JSON 실시간 데이터베이스",
    summary:
      "JSON 트리에 자료를 보관하고 연결된 클라이언트에 변경을 전달하는 Firebase 제품입니다.",
    definition:
      "Firebase Realtime Database는 JSON 트리의 경로에 값을 저장하고 리스너로 변경을 구독하는 관리형 DB입니다. Cloud Firestore와는 별도 제품이며 질의·데이터 모델·동시 변경·과금 조건을 각각 확인해야 합니다. 인증과 Security Rules로 경로의 접근·검증을 구성하고, 접속 상태·연결 해제 작업·트랜잭션 등의 API를 사용합니다.",
    useCases: [
      [
        "같은 방의 위치·공유 상태",
        "방 아래 참여자·위치·상태를 저장하고 child_added·child_changed·child_removed 등으로 변화를 반영합니다. 어느 경로를 얼마나 넓게 구독할지 설계합니다.",
      ],
      [
        "접속 상태·공유 자료",
        "연결 상태와 onDisconnect를 이용한 접속 표시, 공동 편집 자료·카운터 등을 구성합니다. 임시 참여자와 오래 보관할 기록의 수명을 나눕니다.",
      ],
    ],
    concepts: [
      [
        "JSON 경로와 구독 범위",
        "상위 경로를 구독하면 해당 범위의 자료를 받습니다. 사용자·방·질의와 인덱스를 고려해 필요한 범위만 읽고 쓰도록 모델링합니다.",
      ],
      [
        "인증·Security Rules",
        "공개 SDK 설정이나 API 키가 DB 접근을 허용하는 정책은 아닙니다. 사용자·경로별 읽기·쓰기·자료 검증을 규칙과 서버 로직에 연결합니다.",
      ],
      [
        "접속 상태와 onDisconnect",
        "클라이언트가 서버에 연결 해제 시 수행할 작업을 등록합니다. 새 연결마다 다시 등록하고, 등록 수락을 확인한 뒤 접속 상태를 쓰는 순서를 고려합니다.",
      ],
      [
        "동시 변경과 트랜잭션",
        "조회 후 값을 정해 쓰는 단계 사이에 다른 쓰기가 들어올 수 있습니다. 충돌을 다루는 트랜잭션·원자적 갱신과 규칙을 필요한 범위에 맞게 선택합니다.",
      ],
    ],
    flow: [
      [
        "권한·경로·접속 준비",
        "데이터 경로와 규칙을 정하고 연결 상태를 관측합니다.",
      ],
      [
        "값 저장과 변경 구독",
        "쓰기 결과와 경로별 변경을 반영하고 보류·오류를 다룹니다.",
      ],
      [
        "접속 종료와 보관 자료 정리",
        "임시 상태의 연결 해제 작업과 장기 자료의 보존 정책을 따로 관리합니다.",
      ],
    ],
    points: [
      [
        "인원 조회와 자리 확보의 경합",
        "클라이언트가 인원을 읽고 빈 방을 골라도 동시에 여러 명이 같은 결정을 할 수 있습니다. 정원이 업무 조건이면 검사·슬롯 확보의 원자성과 거부 응답을 설계합니다.",
      ],
      [
        "구독의 폭과 전송 비용 관측",
        "방 전체·전체 사용자 같은 넓은 경로를 과도하게 구독하지 않습니다. 메시지/상태 크기·변경 빈도·연결 수·권한·제품 한도를 함께 봅니다.",
      ],
      [
        "로컬 반영·서버 수락·접속 정리를 구분",
        "화면에 값이 반영된 시점과 서버의 쓰기 성공·실패, 연결 해제 감지 시점은 다릅니다. onDisconnect가 등록되지 않은 실패와 재접속을 처리합니다.",
      ],
      [
        "제품과 저장 목적 구분",
        "Firestore의 기능·쿼리·요금을 Realtime Database에 그대로 적용하지 않습니다. 위치처럼 짧게 쓸 상태와 보관할 기록을 같은 수명으로 운영하지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "새로고침 뒤 유령 참여자가 남음",
        "접속 해제 작업의 등록·성공·권한과 경로·새 연결의 재등록, 연결 상태·보존 정책을 확인합니다.",
      ],
      [
        "방 인원을 넘겨 입장하거나 쓰기가 충돌",
        "인원 읽기와 쓰기 사이의 경쟁, 트랜잭션 범위·규칙·클라이언트 재시도와 서버의 실제 수락 결과를 확인합니다.",
      ],
    ],
    example: {
      title: "연결 해제 작업을 등록한 뒤 참여자 쓰기",
      description:
        "Firebase 앱의 설정·로그인·Security Rules와 변수들이 준비된 브라우저 모듈 예입니다.",
      language: "JavaScript · Firebase RTDB",
      code: "import {\n  ref, onValue, onDisconnect, set,\n  serverTimestamp, remove\n} from 'firebase/database';\n\nconst me = ref(db, `rooms/${roomId}/players/${userId}`);\nconst stopConnection = onValue(ref(db, '.info/connected'), async snapshot => {\n  if (snapshot.val() !== true) return;\n  try {\n    await onDisconnect(me).remove();\n    await set(me, { name: displayName, joinedAt: serverTimestamp() });\n  } catch (error) { console.error('참여 상태 등록 실패', error); }\n});\nconst stopPlayers = onValue(ref(db, `rooms/${roomId}/players`), snapshot => {\n  console.log(snapshot.val());\n});\nasync function dispose() {\n  stopPlayers();\n  stopConnection();\n  await remove(me);\n}",
      note: "경로 값 검증·인증·규칙·전송 빈도·동시성은 추가 구성입니다. 예제는 입장 정원을 원자적으로 제한하지 않습니다. 페이지 종료 때의 비동기 remove 완료만을 기대하지 않고 onDisconnect를 함께 구성합니다.",
    },
    sources: [
      [
        "Firebase 공식 DB 예제",
        "https://github.com/firebase/quickstart-js/tree/master/database",
        "확인한 Realtime Database 예제와 설정·인증·규칙의 연결.",
      ],
      [
        "onDisconnect 공식 SDK 코드",
        "https://github.com/firebase/firebase-js-sdk/blob/main/packages/database/src/api/OnDisconnect.ts",
        "확인한 서버 측 연결 해제 작업 API 계약과 재연결 시 등록 조건.",
      ],
      [
        "Realtime Database 데이터 읽기·쓰기",
        "https://firebase.google.com/docs/database/web/read-and-write",
        "구독·쓰기·트랜잭션을 확인하는 추가 공식 문서.",
      ],
    ],
    related: ["supabase-realtime", "websocket", "localstorage"],
    aliases: ["파이어베이스", "Firebase", "RTDB", "리얼타임데이터베이스"],
    rationale: {
      short:
        "공유 자료를 보관하고 경로별 변경을 여러 클라이언트에 반영하기 위해 사용합니다.",
      problem:
        "각 브라우저가 가진 상태를 여러 사용자에게 공유하려면 원본 저장 위치·변경 전달·접속 상태와 동시 쓰기를 처리해야 합니다. 값의 보관과 구독을 같은 제품으로 구성할 요구가 있을 수 있습니다.",
      change:
        "JSON 경로에 자료를 쓰고 리스너로 변경을 받습니다. 인증·규칙·트랜잭션·연결 해제 작업으로 앱의 보관·접근·동시성을 구성합니다.",
      decisions: [
        {
          gainTitle: "값의 보관과 변경 구독 연결",
          gain: "공유 JSON 상태와 구독 기능을 활용해 여러 화면에 변화를 반영할 수 있습니다.",
          costTitle: "데이터 경로·규칙·사용량 설계",
          cost: "구독 범위와 보관 수명·접속 수·변경 크기, 읽기·쓰기 권한을 관리해야 합니다.",
        },
        {
          gainTitle: "접속·동시 변경 도구 활용",
          gain: "onDisconnect·트랜잭션 등을 필요한 상태에 적용할 수 있습니다.",
          costTitle: "업무 조건과 수락 결과 확인",
          cost: "도구를 사용한다고 방 정원·좌석·자료 일관성이 자동으로 완성되지는 않습니다. 원자적 작업 범위와 실패·재시도를 설계해야 합니다.",
        },
      ],
      ask: "변경될 원본 값을 공유·보관해야 하나요? JSON 경로·규칙·동시 변경과 구독 비용을 운영할 수 있나요?",
      simpler:
        "한 장치의 설정은 localStorage로, 보관이 필요 없는 이벤트 전달은 별도 메시지 채널로 충족할 수 있습니다. 필요한 자료의 수명부터 정합니다.",
    },
    image: "firebase",
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/firebase/firebase-original.svg",
    logoAlt: "Firebase 브랜드 심벌 · Realtime Database 제품명은 별도 표시",
    logoNote:
      "Firebase 브랜드 심벌 · Devicon 원본. Cloud Firestore와 구분해 Realtime Database 제품명을 표시합니다.",
    logoScope: "brand",
  },
  {
    id: "localstorage",
    name: "localStorage",
    provider: "WHATWG·브라우저 구현",
    category: "browser",
    type: "브라우저의 출처별 키·값 저장 API",
    summary:
      "같은 출처의 브라우저 환경에 문자열 키·값을 저장해 설정 등을 유지하는 API입니다.",
    definition:
      "window.localStorage는 출처별 Storage에 문자열을 동기식으로 읽고 쓰는 브라우저 API입니다. 일반적인 브라우저 세션을 넘어 값을 보관하지만 사용자가 지우거나 정책·저장 공간·비공개 환경에 따라 제한될 수 있습니다. 서버 DB·계정 간 동기화와는 별도의 보관 범위이며, file URL에서의 동작도 보장된 공통 계약으로 가정하지 않습니다.",
    useCases: [
      [
        "소리·테마·마지막 선택 기억",
        "작은 설정을 저장하고 다음 방문에 복원합니다. 읽기·파싱·쓰기 실패 시 기본값과 메모리 상태로 동작하도록 설계합니다.",
      ],
      [
        "한 장치의 작은 작업 상태",
        "설명 페이지의 선택·임시 입력 등을 버전과 함께 저장합니다. 큰 문서·자주 갱신하는 자료에는 비동기 저장 방식도 검토합니다.",
      ],
    ],
    concepts: [
      [
        "출처별 보관",
        "scheme·host·port가 다른 환경은 같은 저장 공간이 아닙니다. 같은 계정으로 로그인해도 다른 장치로 자동 복제되는 것은 아닙니다.",
      ],
      [
        "문자열과 스키마 버전",
        "객체는 JSON 등으로 직렬화합니다. 오래된 값·다른 버전·깨진 문자열을 검증하고 기본값·이관·삭제 정책을 정합니다.",
      ],
      [
        "동기식 호출과 용량",
        "읽기·쓰기가 메인 스레드 작업입니다. quota·정책·보안 조건으로 예외가 날 수 있어 요청 크기·빈도·실패를 관리합니다.",
      ],
      [
        "storage 이벤트와 창 간 상태",
        "다른 같은 출처 문서에서의 변경을 관측할 수 있지만 쓰기를 수행한 같은 창에 같은 이벤트가 발생하는 모델은 아닙니다. 창 사이 동시 갱신도 원자적 업무 트랜잭션으로 보지 않습니다.",
      ],
    ],
    flow: [
      ["키·버전·기본값 결정", "어떤 장치 내 설정을 얼마나 보관할지 정합니다."],
      [
        "안전하게 읽고 쓰기",
        "파싱·형태 검증과 쓰기 실패를 처리하며 화면 상태를 따로 유지합니다.",
      ],
      [
        "갱신·초기화·이관",
        "다른 창의 변경과 버전 변경, 사용자 삭제·초기화에 대응합니다.",
      ],
    ],
    points: [
      [
        "민감한 인증 비밀의 보관으로 가정하지 않기",
        "같은 출처의 실행 코드가 접근할 수 있는 저장 공간입니다. 인증·세션 정책과 데이터 노출 범위를 별도로 설계합니다.",
      ],
      [
        "공유 기능의 구현 범위를 정확히 표시",
        "초기 샘플과 localStorage의 내용을 다른 사용자와 실시간으로 공유한 결과라고 표시하지 않습니다. 서버·계정·권한과 공유 저장이 필요한 요구를 구분합니다.",
      ],
      [
        "자료 검증과 실패 시 동작 유지",
        "존재하는 문자열도 올바른 현재 버전 자료인지는 검증해야 합니다. 초기 읽기·JSON.parse·setItem 모두 실패할 수 있다고 보고 기본값과 메모리 동작을 준비합니다.",
      ],
    ],
    diagnostics: [
      [
        "다른 기기에서 설정·소원이 안 보임",
        "설정이 출처·브라우저·장치 내 저장인지, 계정 기반 서버 저장인지 먼저 확인합니다. 다른 scheme·port·도메인도 살펴봅니다.",
      ],
      [
        "일부 브라우저에서 화면이 시작되지 않음",
        "localStorage 접근·JSON 해석·quota·정책 예외를 잡는지와 저장소 없이도 기본 상태로 렌더링되는지 확인합니다.",
      ],
    ],
    example: {
      title: "버전 검증과 저장 실패 처리",
      description: "작은 음소거 설정을 저장하는 학습용 브라우저 코드입니다.",
      language: "JavaScript · localStorage",
      code: "const key = 'learning:audio';\nfunction loadMuted() {\n  try {\n    const saved = JSON.parse(localStorage.getItem(key) || 'null');\n    return saved?.version === 1 && typeof saved.muted === 'boolean'\n      ? saved.muted : true;\n  } catch { return true; }\n}\nfunction saveMuted(muted) {\n  try {\n    localStorage.setItem(key, JSON.stringify({ version: 1, muted }));\n    return true;\n  } catch { return false; }\n}",
      note: "호출자는 저장 실패에도 메모리 상태와 UI를 유지해야 합니다. 사용자 계정이나 다른 장치와 동기화하는 코드는 아닙니다.",
    },
    sources: [
      [
        "MDN localStorage 원문",
        "https://github.com/mdn/content/blob/main/files/en-us/web/api/window/localstorage/index.md",
        "확인한 출처·세션·예외와 file URL의 조건.",
      ],
      [
        "Web Storage 표준",
        "https://html.spec.whatwg.org/multipage/webstorage.html",
        "키·값·이벤트·동기 작업의 표준 계약.",
      ],
      [
        "MDN Storage 이벤트",
        "https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event",
        "다른 문서의 변경 알림을 확인하는 추가 문서.",
      ],
    ],
    related: ["javascript", "firebase-rtdb", "web-audio"],
    aliases: ["로컬스토리지", "로컬저장", "브라우저저장", "Web Storage"],
    rationale: {
      short: "한 장치의 작은 설정을 다음 방문에도 복원하고 싶을 때 사용합니다.",
      problem:
        "음소거·테마·마지막 선택을 새로고침 때마다 잃으면 사용자가 같은 설정을 반복해야 합니다. 이 값이 계정 전체가 아니라 현재 브라우저에만 있어도 되는지 판단해야 합니다.",
      change:
        "출처별 문자열 저장 공간에서 작은 값을 읽고 씁니다. 앱은 기본값·자료 검증·저장 실패와 버전 변경을 함께 처리합니다.",
      decisions: [
        {
          gainTitle: "서버 없이 작은 설정 유지",
          gain: "장치 안에서 사용자의 선택을 저장하고 복원할 수 있습니다.",
          costTitle: "보관 범위와 실패 조건",
          cost: "사용자 삭제·정책·quota·비공개 환경에 영향을 받고 장치·출처 간 자동 공유는 제공하지 않습니다.",
        },
        {
          gainTitle: "간단한 키·값 인터페이스",
          gain: "작은 설정과 버전을 직렬화해 사용할 수 있습니다.",
          costTitle: "동기 작업과 자료 관리",
          cost: "메인 스레드 비용·파싱·검증·버전 이관과 민감 자료의 접근 범위를 관리해야 합니다.",
        },
      ],
      ask: "값이 현재 출처·장치 안에만 있어도 되나요? 저장 불가·자료 손상·버전 변경에도 앱이 동작하나요?",
      simpler:
        "탭 수명 동안이면 메모리나 sessionStorage를, 큰 구조화 자료는 IndexedDB를, 여러 사용자·장치 공유는 서버 저장을 검토합니다.",
    },
    mark: "저장",
    logoSource: null,
    logoAlt: "localStorage 웹 표준 표기",
    logoNote: "별도 제품 로고 대신 API·표준 이름을 문자로 표시합니다.",
  },
  {
    id: "vite",
    name: "Vite",
    provider: "Vite 프로젝트·기여자",
    category: "tooling",
    type: "개발 서버·빌드 도구",
    summary:
      "소스 모듈을 개발 서버에서 제공하고 배포용 결과를 만드는 프런트엔드 개발 도구입니다.",
    definition:
      "Vite는 개발 중 모듈 제공·의존성 처리·변경 반영과 배포용 빌드를 연결하는 도구입니다. 사용하는 버전과 플러그인에 따라 번들러·지원 문법·실행 조건이 달라지므로 프로젝트의 잠금 파일과 문서를 기준으로 확인합니다. React·일반 JavaScript·3D 라이브러리 등의 앱을 만들 때 사용할 수 있지만, 배포 뒤 방 서버나 데이터베이스가 되는 제품은 아닙니다.",
    useCases: [
      [
        "웹 앱·3D 실험의 개발",
        "모듈과 에셋을 로컬 서버에서 읽고 변경을 빠르게 확인합니다. 같은 코드를 번들·에셋 경로가 정리된 배포 결과로 만듭니다.",
      ],
      [
        "프레임워크·컴포넌트 도구 연결",
        "필요한 플러그인으로 JSX·CSS·컴포넌트 작업대를 구성합니다. 개발 서버와 실제 배포 환경의 경로·보안·동작 차이를 확인합니다.",
      ],
    ],
    concepts: [
      [
        "개발 경로와 배포 경로",
        "개발에서 제공되는 모듈과 HMR, 배포용 정적 파일·서버 출력은 다른 경로입니다. 개발 성공과 배포 성공을 구분해 확인합니다.",
      ],
      [
        "클라이언트 환경 변수",
        "클라이언트 번들에 노출되는 환경 변수는 사용자가 읽을 수 있습니다. VITE_ 접두사를 붙였다고 비밀이 되는 것이 아니므로 서버 비밀은 별도 실행 환경에 둡니다.",
      ],
      [
        "모듈·에셋·base",
        "모듈 import와 공개 파일·배포 base 경로가 결과 URL을 정합니다. 하위 경로 호스팅·새로고침·라우팅을 실제 빌드 결과로 확인합니다.",
      ],
      [
        "변환과 타입 검사",
        "TypeScript 문법을 변환하는 것과 프로젝트 전체의 타입을 검사하는 일은 구분합니다. 필요한 타입 검사·린트·브라우저 검사를 별도로 실행합니다.",
      ],
    ],
    flow: [
      [
        "소스와 개발 서버 준비",
        "프로젝트 버전·의존성·플러그인·모듈 구조를 설정합니다.",
      ],
      [
        "변경을 확인하며 구현",
        "개발 서버에서 화면과 에셋·변경 반영을 확인합니다.",
      ],
      [
        "빌드 결과를 검사·배포",
        "배포용 산출물·경로·정적 호스팅·서버 연결을 확인합니다.",
      ],
    ],
    points: [
      [
        "버전과 실행 환경 고정",
        "Node·Vite·플러그인과 잠금 파일을 함께 관리합니다. 오래된 안내의 번들러·기본값을 모든 버전에 적용하지 않습니다.",
      ],
      [
        "환경 변수의 공개 범위 확인",
        "클라이언트 코드에 들어간 값은 전달된 결과에서 확인할 수 있습니다. 공개 설정과 서버 자격증명을 구분하고 올바른 실행 경로에 둡니다.",
      ],
      [
        "실제 산출물의 경로·외부 의존성 확인",
        "하위 경로 base·에셋·직접 URL 접근·API 주소와 외부 이미지·폰트 요청을 확인합니다. preview는 검토 도구이며 운영 배포 구성을 대신하지 않습니다.",
      ],
    ],
    diagnostics: [
      [
        "개발은 되는데 배포에서 이미지·페이지가 깨짐",
        "base·에셋 import·공개 경로·서버 rewrite·직접 URL 새로고침과 실제 빌드 결과를 확인합니다.",
      ],
      [
        "환경 변수 변경이 화면에 반영되지 않음",
        "어느 모드·환경 파일을 읽었는지, 값이 빌드 때 포함되는지와 개발 서버 재시작·재빌드·실제 배포 파일을 확인합니다.",
      ],
    ],
    example: {
      title: "작은 웹 프로젝트를 만들고 빌드하기",
      description:
        "현재 create-vite가 요구하는 Node 버전과 사용하려는 Vite 버전을 먼저 확인합니다.",
      language: "Shell · Vite",
      code: "npm create vite@latest interactive-room -- --template vanilla\ncd interactive-room\nnpm install\nnpm run dev\n\n# 배포용 결과를 만든 뒤 로컬에서 확인\nnpm run build\nnpm run preview",
      note: "학습용 생성 명령이며 이 사이트에서 실행되지 않습니다. 서버 인증·방 동기화·DB는 별도 구현입니다. 프로젝트와 플러그인의 버전을 잠금 파일로 고정합니다.",
    },
    sources: [
      [
        "Vite 공식 시작 안내 원문",
        "https://github.com/vitejs/vite/blob/main/docs/guide/index.md",
        "확인한 개발 서버·빌드·프로젝트 생성과 버전 조건.",
      ],
      [
        "Vite 환경 변수·모드",
        "https://vite.dev/guide/env-and-mode",
        "클라이언트 공개 변수와 모드의 추가 공식 문서.",
      ],
      [
        "Vite 배포 안내",
        "https://vite.dev/guide/static-deploy",
        "빌드·preview·호스팅의 추가 공식 문서.",
      ],
    ],
    related: ["javascript", "typescript", "threejs"],
    aliases: ["비트", "개발서버", "빌드도구"],
    rationale: {
      short:
        "소스·모듈·에셋을 개발하며 확인하고 배포용 결과로 만드는 작업 흐름이 필요할 때 사용합니다.",
      problem:
        "여러 모듈·스타일·이미지와 프레임워크 코드를 직접 제공·갱신·최적화하려면 개발 서버와 빌드 구성을 별도로 연결해야 합니다. 팀이 재현할 수 있는 작업 흐름이 필요합니다.",
      change:
        "개발 서버·변경 반영과 배포 빌드를 도구·플러그인으로 구성합니다. 실제 서비스 실행과 데이터 기능은 앱과 배포 환경이 맡습니다.",
      decisions: [
        {
          gainTitle: "개발과 배포 작업 연결",
          gain: "모듈·에셋·프레임워크 지원과 빌드 명령을 일정한 작업 흐름으로 사용할 수 있습니다.",
          costTitle: "버전·플러그인·환경 관리",
          cost: "Node·의존성·모드·base와 클라이언트 공개 범위를 확인해야 합니다.",
        },
        {
          gainTitle: "변경을 빠르게 확인",
          gain: "개발 서버와 변경 반영 기능으로 화면을 조정할 수 있습니다.",
          costTitle: "실제 배포 검증",
          cost: "개발 동작만으로 산출물·경로·서버 연결·타입 정확성이 보장되지는 않습니다. 별도 검사를 구성합니다.",
        },
      ],
      ask: "모듈·에셋·프레임워크와 팀의 개발 흐름을 관리할 필요가 있나요? 배포 결과와 환경 변수의 범위를 확인했나요?",
      simpler:
        "작은 정적 HTML·CSS·모듈은 간단한 서버로 시작할 수 있습니다. 이미 사용하는 프레임워크의 도구로 충족하면 새 빌드 도구를 중복 도입할 필요를 확인합니다.",
    },
    image: "vitejs",
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/vitejs/vitejs-original.svg",
    logoAlt: "Vite 프로젝트 심벌",
    logoNote: "프로젝트 심벌 · Devicon 원본",
  },
];
