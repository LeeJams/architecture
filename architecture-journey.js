"use strict";

const playbackJourney = [
  { title: "전달할 파일 준비", short: "여러 화질·오디오 파일", node: "origin", nodes: ["origin"],
    from: "콘텐츠 준비 과정", to: "영상 파일 저장 역할", payload: "인코딩된 영상·오디오와 파일 버전",
    description: "시청 시점보다 앞선 준비입니다. 여러 기기와 네트워크에 맞는 표현을 파일로 만들어 전송 거점에 배치할 수 있게 합니다.",
    actions: ["여러 화질·오디오 표현을 준비합니다.", "재생에 필요한 파일과 버전을 구분합니다.", "전달 거점으로 보낼 파일 목록을 준비합니다."], tech: ["fill"], sample: "영상 파일 + 오디오 파일\n표현: 비트레이트·코덱·언어별 준비" },
  { title: "OCA에 파일 배치", short: "시청 전에 거점을 채움", node: "fill", nodes: ["origin", "fill", "oca"],
    from: "준비된 콘텐츠", to: "Open Connect의 전송 거점", payload: "시청 요청에 응답할 영상·오디오 파일",
    description: "파일이 필요한 거점에 미리 존재하도록 준비합니다. 배치가 끝난 파일 보유 상태는 이후 전송 후보를 고를 때 중요한 조건이 됩니다.",
    actions: ["예상 수요·저장 공간과 배치 계획을 고려합니다.", "전송 거점으로 파일을 준비합니다.", "해당 파일을 제공할 수 있는 상태를 반영합니다."], tech: ["fill", "oca"], sample: "파일 준비 → 거점에 배치\n파일 보유 상태 → 후보 선택에 반영" },
  { title: "재생 정보 요청", short: "플레이어 → 클라우드", node: "playback", nodes: ["player", "playback"],
    from: "시청 기기의 플레이어", to: "클라우드 재생 서비스", payload: "선택한 콘텐츠와 재생에 필요한 요청 정보",
    description: "사용자가 재생을 시작하면 플레이어는 먼저 제어 경로에 필요한 정보를 요청합니다. 이 API 응답과 실제 영상 파일의 응답은 서로 다른 역할입니다.",
    actions: ["플레이어가 재생을 시작할 정보를 요청합니다.", "클라우드의 재생 관련 기능이 요청을 처리합니다.", "영상 전달에 사용할 정보와 후보를 연결합니다."], tech: ["aws", "https"], sample: "플레이어 → 재생 제어 API\n이 단계의 응답 ≠ 영상 파일 전체" },
  { title: "전송 후보 조회", short: "파일·경로·상태 확인", node: "steering", nodes: ["playback", "steering", "oca"],
    from: "재생 제어와 전송 선택 역할", to: "사용 가능한 OCA 후보", payload: "파일 보유 여부·접근 경로·서버 상태",
    description: "지리적으로 가까운지만 보지 않습니다. 요청한 파일이 있고 해당 사용자의 네트워크에서 이용할 수 있는 전송 후보가 필요합니다.",
    actions: ["요청한 파일을 제공할 수 있는지 봅니다.", "사용자의 네트워크에서 적합한 경로를 검토합니다.", "서버 상태와 여유 용량을 고려합니다."], tech: ["steering", "oca"], sample: "파일 보유 + 접근 경로 + 상태\n→ 이용할 수 있는 전송 후보" },
  { title: "정보·후보 응답", short: "클라우드 → 플레이어", node: "player", nodes: ["playback", "steering", "player"],
    from: "클라우드 재생 서비스", to: "플레이어", payload: "재생 관련 정보와 사용할 수 있는 전달 후보",
    description: "플레이어는 다음 파일 요청을 어디에 보낼지 알게 됩니다. 이 노드는 실제 응답 필드나 내부 서비스의 수를 고정하지 않고 기능을 요약합니다.",
    actions: ["재생에 필요한 정보를 돌려줍니다.", "이용할 수 있는 전송 후보를 연결합니다.", "플레이어가 영상 데이터 요청을 준비합니다."], tech: ["aws", "steering"], sample: "제어 정보 응답\n→ 다음 요청은 영상 전달 서버로" },
  { title: "영상 구간 요청", short: "플레이어 → OCA · HTTP", node: "oca", nodes: ["player", "oca"],
    from: "플레이어", to: "선택한 OCA의 HTTP 서버", payload: "미디어 파일 URL 또는 필요한 바이트 범위",
    description: "플레이어가 전송 서버에 직접 파일을 요청합니다. 미디어 구간이 별도 파일이면 일반 GET, 큰 파일의 일부를 받을 때는 Range를 활용할 수 있습니다.",
    actions: ["재생 위치에 필요한 구간을 정합니다.", "파일 URL 또는 바이트 범위를 요청합니다.", "OCA 안의 HTTP 서버가 요청을 처리합니다."], tech: ["https", "nginx"], sample: "GET /film-demo/video.mp4 HTTP/1.1\nRange: bytes=0-1023" },
  { title: "파일 읽기·응답", short: "NGINX · FreeBSD → 플레이어", node: "oca", nodes: ["oca", "player"],
    from: "OCA의 파일·HTTP·OS 계층", to: "플레이어", payload: "HTTP 상태·헤더와 영상·오디오 바이트",
    description: "NGINX가 요청을 파일과 연결하고, OS의 파일·네트워크 I/O를 활용해 응답합니다. TLS와 하드웨어 조건에 따라 실제 전송 경로는 달라집니다.",
    actions: ["파일과 요청 범위를 확인합니다.", "저장장치·파일 페이지와 전송 경로를 사용합니다.", "영상 바이트를 플레이어로 보냅니다."], tech: ["nginx", "freebsd", "https"], sample: "HTTP/1.1 206 Partial Content\nContent-Range: bytes 0-1023/10000\nContent-Length: 1024" },
  { title: "버퍼·화질 판단", short: "기기 안에서 다음 구간 판단", node: "player", nodes: ["player"],
    from: "수신한 미디어 구간", to: "플레이어의 버퍼·디코더", payload: "재생 가능한 데이터와 다운로드 관측값",
    description: "플레이어는 받은 구간을 재생하고 버퍼와 네트워크를 관측합니다. 적응형 재생에서는 다음 구간의 표현을 바꿀 수 있습니다. 이는 OCA에서 즉석 인코딩하는 과정과 다릅니다.",
    actions: ["미디어 데이터를 버퍼에 연결합니다.", "구간을 디코딩하고 재생합니다.", "다음 요청의 화질·구간을 판단합니다."], tech: ["abr"], sample: "4초 × 5 Mb/s = 20 Mb = 2.5 MB\n단순 구간 크기 예제 · 오디오 제외" },
  { title: "다음 구간 요청", short: "재생하며 요청을 반복", node: "player", nodes: ["player", "oca"],
    from: "재생 중인 플레이어", to: "사용할 수 있는 전달 후보", payload: "다음 영상·오디오 구간 요청",
    description: "재생 중에도 요청·응답이 이어집니다. 전송 오류가 발생하면 다른 후보의 파일·경로·여유 용량과 재시도 시간을 함께 검토해야 합니다.",
    actions: ["다음 구간을 이어서 요청합니다.", "처리량과 오류를 계속 관측합니다.", "실패 시 가능한 후보와 재시도 예산을 검토합니다."], tech: ["abr", "steering"], sample: "구간 수신 → 버퍼·재생 → 다음 요청\n오류 발생 → 다른 후보 검토" }
];

function renderJourneyFocus() {
  const step = playbackJourney[selectedStep];
  if (!step) return null;
  const retry = failover && selectedStep === 8;
  return `<div class="journey-focus"><p class="journey-phase">${selectedStep + 1} / ${playbackJourney.length} 단계</p><h3>${retry ? "다른 후보로 요청 재시도" : step.title}</h3><p>${step.description}</p><dl class="request-contract"><div><dt>어디에서 → 어디로</dt><dd>${step.from} → ${retry ? "다른 전송 거점의 OCA" : step.to}</dd></div><div><dt>오가는 데이터</dt><dd>${step.payload}</dd></div></dl><h3>이 단계에서 일어나는 일</h3><ol class="journey-actions">${step.actions.map(action => `<li>${action}</li>`).join("")}</ol><div class="journey-tech">${step.tech.map(key => `<button data-open-tech-sheet="${key}"><img src="${assets[({ abr: "player", steering: "routing", oca: "ocaIcon" })[key] || key]}" alt="">${({ abr: "플레이어·ABR", steering: "전송 후보 선택", fill: "콘텐츠 배치", oca: "OCA", aws: "AWS", https: "HTTP(S)", nginx: "NGINX", freebsd: "FreeBSD" })[key]}</button>`).join("")}</div><div class="flow-sample"><span>설명용 데이터 · 실제 Netflix API 형식이 아닙니다.</span><pre><code>${escapeHTML(step.sample)}</code></pre></div><div class="journey-controls"><button data-journey-move="-1" ${selectedStep === 0 ? "disabled" : ""}>← 이전</button><button data-journey-move="1" ${selectedStep === playbackJourney.length - 1 ? "disabled" : ""}>다음 단계 →</button></div></div>`;
}

function selectJourneyStep(index) {
  if (!playbackJourney[index]) return;
  stopPlayback();
  setStep(index);
  const node = failover && index === 8 ? "fallback" : playbackJourney[index].node;
  selectNode(node, { panel: "role", preserveStep: true });
}
