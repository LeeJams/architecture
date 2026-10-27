"use strict";

// Read the existing architecture through a request's input, work and output.
const requestFacts = {
  player: {
    purpose: "재생 정보를 받아, 필요한 영상 구간을 요청하는 클라이언트입니다.",
    contract: ["콘텐츠 선택 · 재생 정보 · 받은 영상 구간", "구간 요청 → 버퍼 저장 → 디코딩·재생", "다음 구간 요청 · 재생 품질 관측"],
    why: "제어 API와 영상 전달 서버를 연결합니다. 재생 제어와 바이트 전달이 별도 경로라는 사실이 여기서 만납니다.",
    boundary: "ABR은 다음 화질을 고르는 플레이어의 판단입니다. OCA가 요청마다 새로 인코딩하는 과정과 구분합니다."
  },
  playback: {
    purpose: "영상을 시작하는 데 필요한 정보와 전달 후보를 연결합니다.",
    contract: ["플레이어의 재생 정보 요청", "재생 관련 제어 서비스 처리", "재생 정보 · 전송에 사용할 후보"],
    why: "짧은 제어 요청은 응답 지연과 가용성이, 영상 전달은 대역폭과 파일 I/O가 중요합니다. 각각 다른 자원과 증설 기준을 가집니다.",
    boundary: "여러 기능을 묶은 개념 노드입니다. 특정 AWS 제품이나 내부 API 형식까지 확정하지 않습니다."
  },
  steering: {
    purpose: "요청한 파일을 제공할 수 있는 전송 후보를 찾습니다.",
    contract: ["파일 보유 정보 · 접근 경로 · 거점 상태", "파일·네트워크·용량 조건으로 후보 검토", "플레이어가 요청할 수 있는 전송 후보"],
    why: "지리적으로 가까워도 파일이 없거나 링크가 포화면 적합하지 않습니다. 위치, 파일과 상태를 함께 봅니다.",
    boundary: "상태 보고에는 지연이 있습니다. 정확한 선택 점수와 재시도 순서는 실제 구현의 확인이 필요합니다."
  },
  oca: {
    purpose: "미리 준비한 영상 파일을 사용자 가까이에서 직접 응답합니다.",
    contract: ["플레이어의 영상·오디오 파일 요청", "준비된 파일 읽기 → HTTP 응답", "플레이어로 향하는 영상·오디오 바이트"],
    why: "반복 시청되는 파일을 사용자 네트워크 가까이에 두면 긴 구간을 지나는 전송을 줄일 수 있습니다.",
    boundary: "NGINX는 HTTP 응답, FreeBSD는 파일·네트워크 I/O를 맡는 서로 다른 계층입니다. 아래 배지를 눌러 각각 살펴보세요."
  },
  origin: {
    purpose: "전달망에 준비할 여러 화질·오디오의 파일을 보관합니다.",
    contract: ["인코딩을 마친 영상·오디오 파일", "버전·표현별 파일 보관", "전송 거점에 배치할 파일"],
    why: "다양한 기기와 네트워크에 맞는 표현을 미리 준비하면 플레이어가 필요한 구간과 화질을 요청할 수 있습니다.",
    boundary: "코덱은 압축 방식, 패키징은 구간 구성, 저장소는 파일 보관의 역할입니다. 이 노드는 특정 저장소 제품을 나타내지 않습니다."
  },
  fill: {
    purpose: "시청 요청이 오기 전에 거점에 필요한 파일을 준비합니다.",
    contract: ["준비된 파일 · 예상 수요 · 저장 여유", "배치 계획 → 파일 전송·보유 상태 확인", "시청 요청에 응답할 수 있는 거점의 파일"],
    why: "콘텐츠 준비와 시청 시점의 전송을 나누어 생각합니다. 첫 요청의 대기와 배치 트래픽을 함께 계획할 수 있습니다.",
    boundary: "모든 파일을 모든 거점에 넣을 수는 없습니다. 미사용 파일의 비용과 파일 부재 시 다른 후보도 고려합니다."
  },
  fallback: {
    purpose: "현재 서버에서 계속 받기 어려울 때 다른 전송 후보를 검토합니다.",
    contract: ["전송 실패 · 다른 후보의 보유 파일과 상태", "남은 버퍼·시간 예산 안에서 재시도 검토", "다른 후보로의 요청 또는 재생 오류 처리"],
    why: "대체 서버에도 같은 파일과 접근 경로, 이동한 부하를 받을 여유가 있어야 합니다. 후보 수만 늘려서는 충분하지 않습니다.",
    boundary: "이 그림은 후보 변경의 개념입니다. 실제 복구 시간이나 무중단 재생을 보장하는 시뮬레이션이 아닙니다."
  },
  aws: {
    purpose: "재생 관련 제어 서비스를 실행하는 클라우드 플랫폼입니다.",
    contract: ["재생을 시작하는 데 필요한 API 요청", "컴퓨팅·데이터 접근·의존 서비스 처리", "플레이어에 돌려줄 재생 관련 정보"],
    why: "제어 서비스의 요청량·응답 지연과 전달망의 동시 시청·대역폭을 별도로 계획할 수 있습니다.",
    boundary: "AWS는 플랫폼 범위입니다. 이 로고만으로 EC2·EKS·Lambda나 데이터베이스 제품을 특정하지 않습니다."
  },
  nginx: {
    purpose: "요청을 해석하고, 준비된 파일의 바이트를 HTTP로 응답합니다.",
    contract: ["GET 경로 · 필요한 경우 Range 헤더", "경로와 파일 확인 → 응답 상태·범위 처리", "200 또는 206 응답 · 파일 데이터"],
    why: "작업자 프로세스가 여러 연결의 이벤트를 처리합니다. 파일 응답에서는 sendfile 등 OS의 I/O 경로도 중요합니다.",
    boundary: "NGINX는 인코더나 화질 선택기가 아닙니다. 전체 CDN의 거점 선택·파일 배치도 별도 역할입니다."
  },
  freebsd: {
    purpose: "HTTP 서버 아래에서 파일·메모리·소켓·NIC의 동작을 받칩니다.",
    contract: ["파일 읽기 · 소켓 쓰기 · 이벤트 대기 요청", "파일 페이지·kqueue·전송 경로·드라이버 처리", "읽은 데이터 · I/O 이벤트 · 네트워크 출력"],
    why: "파일에서 소켓으로 보내는 sendfile, 여러 연결의 상태를 알리는 kqueue 같은 기능을 제공합니다.",
    boundary: "메모리 복사와 I/O 비용을 줄일 여지는 있지만 TLS·드라이버·하드웨어 조건에 따라 경로와 성능은 달라집니다."
  },
  https: {
    purpose: "파일이나 일부 바이트를 요청하고 응답하는 통신 규칙입니다.",
    contract: ["URL · 메서드 · 헤더 · 바이트 범위", "요청·상태·헤더·본문 전달, HTTPS의 TLS 보호", "전체 파일 또는 구간 데이터의 응답"],
    why: "독립된 미디어 구간을 GET으로 받거나 큰 파일의 일부를 Range로 받을 수 있습니다. 재생 시작과 탐색을 구현하는 기반입니다.",
    boundary: "TLS는 전송 보호, DRM은 콘텐츠 권한·라이선스의 문제입니다. HTTP 버전·코덱·패키징도 별도 선택입니다."
  }
};

const applianceLayers = {
  storage: { title: "저장장치 · 응답할 파일을 준비", description: "여러 화질의 파일이 있어도 요청한 파일과 구간을 읽을 수 있어야 합니다. 저장 용량과 메모리 캐시, 디스크 읽기 지연이 전송 경로에 영향을 줍니다.", note: "특정 디스크 구성이나 파일시스템을 가정하지 않는 역할 설명입니다.", read: "fill", steps: [["storage", "인코딩 파일", "여러 화질·오디오"], ["ocaIcon", "거점에 보관", "준비된 파일·버전"], ["storage", "요청 구간 읽기", "캐시 또는 디스크"]] },
  nginx: { title: "NGINX · 요청을 파일 응답으로", description: "URL과 필요한 경우 Range를 해석하고 응답할 파일을 찾습니다. 파일이 있으면 상태·헤더·바이트를 응답하며, 이벤트 처리와 OS의 I/O 경로를 활용합니다.", note: "일반적인 정적 파일 응답 경로입니다. 실제 OCA 설정이나 HTTP 버전을 재현하지 않습니다.", read: "nginx", steps: [["player", "GET · Range", "파일 경로·바이트 범위"], ["nginx", "요청과 파일 연결", "location·파일 확인"], ["https", "HTTP 응답", "200·206·파일 바이트"]] },
  freebsd: { title: "FreeBSD · 파일에서 네트워크까지", description: "파일 페이지·소켓·이벤트와 드라이버를 다룹니다. sendfile은 파일에서 소켓으로 보내는 경로, kqueue는 여러 연결의 상태 변화를 알리는 기능입니다.", note: "일반 기능을 설명하는 경로입니다. TLS·커널·하드웨어에 따라 실제 전송 경로는 달라집니다.", read: "freebsd", steps: [["storage", "파일 페이지", "캐시·저장장치 읽기"], ["freebsd", "sendfile · 소켓", "커널의 전송 경로"], ["routing", "NIC와 네트워크", "클라이언트로 전송"]] }
};

function renderRequestFacts(key) {
  const facts = requestFacts[key];
  if (!facts) return null;
  return `<p class="request-purpose">${facts.purpose}</p><dl class="request-contract">${facts.contract.map((text, index) => `<div><dt><span>${String(index + 1).padStart(2, "0")}</span>${["받는 것", "처리하는 일", "내보내는 것"][index]}</dt><dd>${text}</dd></div>`).join("")}</dl><h3>이 역할을 분리한 이유</h3><p>${facts.why}</p><div class="detail-note">${facts.boundary}</div>`;
}

function renderFocusedDescription() {
  const key = selectedTechnology || selectedNode;
  if (selectedPanel === "role") return selectedStep >= 0 ? renderJourneyFocus() : renderRequestFacts(key);
  return null;
}

function renderTechnologyBadges(badges) {
  const keys = { AWS: "aws", OCA: "oca", FreeBSD: "freebsd", NGINX: "nginx", "HTTP(S)": "https", Fill: "fill" };
  return badges.map(badge => keys[badge] ? `<button class="badge badge-button action-dialog" data-inspect-tech="${keys[badge]}" aria-haspopup="dialog" aria-label="${badge} 기술 설명창 열기">${badge}<span class="badge-action">설명</span>${actionIcon("dialog")}</button>` : `<span class="badge">${badge}</span>`).join("");
}

function updateApplianceLayer(key) {
  const layer = applianceLayers[key];
  if (!layer) return;
  $$('[data-anatomy-tech]').forEach(button => {
    const selected = button.dataset.anatomyTech === key;
    button.setAttribute("aria-pressed", String(selected));
    button.querySelector(".layer-number").textContent = selected ? "선택됨" : "선택";
  });
  $("#appliance-layer-title").textContent = layer.title;
  $("#appliance-layer-description").textContent = layer.description;
  $("#appliance-layer-note").textContent = layer.note;
  $("#appliance-layer-flow").innerHTML = layer.steps.map(([icon, title, subtitle], index) => `<li><img src="${assets[icon]}" alt=""><div><span>${String(index + 1).padStart(2, "0")}</span><strong>${title}</strong><p>${subtitle}</p></div></li>`).join("");
  const link = $("#appliance-layer-read");
  link.href = `#tech-${layer.read}`;
  link.dataset.readTech = layer.read;
}

function syncTechnologySelection() {
  const key = selectedTechnology || ({ oca: "oca", fill: "fill", playback: "aws" }[selectedNode]);
  $$('[data-tech]').forEach(button => button.setAttribute("aria-pressed", String(button.dataset.tech === key)));
  $$('[data-diagram-tech]').forEach(button => button.setAttribute("aria-pressed", String(button.dataset.diagramTech === selectedTechnology)));
  if (applianceLayers[selectedTechnology]) updateApplianceLayer(selectedTechnology);
}

function initializeArchitectureInsights() {
  updateApplianceLayer("nginx");
  document.addEventListener("click", event => {
    const technology = event.target.closest("[data-inspect-tech]");
    if (technology) {
      openTechnologySheet(technology.dataset.inspectTech);
      return;
    }

  });
  $$('[data-diagram-tech]').forEach(button => {
    button.addEventListener("click", () => selectTech(button.dataset.diagramTech));
    button.addEventListener("keydown", event => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      selectTech(button.dataset.diagramTech);
    });
  });
  $$('[data-anatomy-tech]').forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.anatomyTech;
    if (key === "storage") selectNode("origin", { panel: "role", reveal: false });
    else selectTech(key);
    updateApplianceLayer(key);
  }));
}
