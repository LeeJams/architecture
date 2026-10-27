"use strict";

const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));

function renderNoteExample(example) {
  const content = example.kind === "capacity" ? `
    <div class="capacity-inputs">
      <label>동시 시청자 수 <input id="capacity-viewers" type="number" min="1" max="1000000" step="1" value="10000" inputmode="numeric"></label>
      <label>평균 비트레이트 (Mb/s) <input id="capacity-bitrate" type="number" min="0.1" max="100" step="0.1" value="5" inputmode="decimal"></label>
      <label>목표 링크 사용률 (%) <input id="capacity-utilization" type="number" min="10" max="100" step="1" value="70" inputmode="numeric"></label>
    </div>
    <div class="capacity-output" aria-live="polite" aria-atomic="true"><p id="capacity-result"></p><p id="capacity-formula"></p></div>`
    : example.kind === "abr" ? `
    <label class="abr-control" for="abr-throughput">유효 다운로드 처리량 <output id="abr-speed" for="abr-throughput">10 Mb/s</output></label>
    <input id="abr-throughput" class="abr-slider" type="range" min="0.5" max="15" step="0.5" value="10">
    <div class="abr-output" aria-live="polite" aria-atomic="true"><p id="abr-result"></p><p id="abr-next"></p></div>`
    : `<div class="note-code"><span>${escapeHTML(example.language)}</span><pre tabindex="0" aria-label="${escapeHTML(example.title)}"><code>${escapeHTML(example.code)}</code></pre></div>`;
  return `<section class="note-section note-example"><p class="note-section-label">03 / WORKED EXAMPLE</p><h4>${example.title}</h4><p>${example.text}</p>${content}<p class="example-caveat">${example.caveat}</p></section>`;
}

function selectTechnologyNote(key, { reveal = false, focus = false } = {}) {
  if (!technologyNotes.some(tech => tech.key === key)) return;
  $$('[data-note-tab]').forEach(button => {
    const selected = button.dataset.noteTab === key;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $$(".technology-note").forEach(panel => { panel.hidden = panel.id !== `tech-${key}`; });
  const panel = $(`#tech-${key}`);
  if (focus) panel.querySelector("h3").focus({ preventScroll: true });
  if (reveal) panel.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
}

function syncTechnologyHash() {
  const match = location.hash.match(/^#tech-([a-z]+)$/);
  if (match) selectTechnologyNote(match[1]);
}

function updateNoteURL(key, push = false) {
  const url = new URL(location.href);
  url.hash = `tech-${key}`;
  if (url.href === location.href) return;
  history[push ? "pushState" : "replaceState"]({ atlasRoute: currentRoute }, "", url);
}

function updateCapacity() {
  const inputs = [$("#capacity-viewers"), $("#capacity-bitrate"), $("#capacity-utilization")];
  if (!inputs.every(input => input.value !== "" && input.validity.valid)) {
    $("#capacity-result").textContent = "각 항목에 표시된 범위 안의 숫자를 입력해 주세요.";
    $("#capacity-formula").textContent = "시청자 1~1,000,000명 · 비트레이트 0.1~100 Mb/s · 사용률 10~100%";
    return;
  }
  const [viewers, bitrate, utilization] = inputs.map(input => Number(input.value));
  const payload = viewers * bitrate / 1000;
  const capacity = payload / (utilization / 100);
  const decimal = value => value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  $("#capacity-result").innerHTML = `영상 페이로드 <strong>${decimal(payload)} Gb/s</strong><span>단순 링크 용량 <strong>${decimal(capacity)} Gb/s</strong></span>`;
  $("#capacity-formula").textContent = `${decimal(viewers)}명 × ${decimal(bitrate)} Mb/s ÷ 1,000 ÷ ${decimal(utilization / 100)} = ${decimal(capacity)} Gb/s`;
}

function updateABR() {
  const throughput = Number($("#abr-throughput").value);
  const duration = 20 / throughput;
  const sustainable = [1, 3, 5, 8].filter(bitrate => bitrate <= throughput * 0.75);
  const next = sustainable.at(-1);
  $("#abr-speed").textContent = `${throughput} Mb/s`;
  $("#abr-result").innerHTML = `4초 구간 수신에 <strong>${duration.toFixed(2)}초</strong><span>${duration > 4 ? "재생 시간보다 오래 걸려 버퍼가 줄어듭니다." : duration < 4 ? "재생 시간보다 빨리 받아 버퍼를 채울 여지가 있습니다." : "재생 시간과 수신 시간이 같아 여유가 없습니다."}</span>`;
  $("#abr-next").textContent = `안전 예산 ${(throughput * 0.75).toFixed(2)} Mb/s → ${next ? `다음 후보 ${next} Mb/s` : "조건을 만족하는 후보 없음: 최저 화질도 지속 수신 예산을 넘습니다."}`;
}

function initializeTechnologyReader() {
  $("#note-tabs").innerHTML = technologyNotes.map((tech, index) => `<button id="note-tab-${tech.key}" role="tab" aria-selected="${index === 0}" aria-controls="tech-${tech.key}" tabindex="${index === 0 ? 0 : -1}" data-note-tab="${tech.key}"><img src="${tech.image}" alt=""><span>${tech.short}</span><span class="note-tab-arrow" aria-hidden="true">↗</span></button>`).join("");
  $("#note-panels").innerHTML = technologyNotes.map((tech, index) => `
    <article id="tech-${tech.key}" class="technology-note" role="tabpanel" aria-labelledby="note-tab-${tech.key}" tabindex="0" ${index ? "hidden" : ""}>
      <div class="note-heading"><div><p class="micro-label">${tech.category}</p><h3 tabindex="-1">${tech.title}</h3></div><img src="${tech.image}" alt="${tech.title}의 로고 또는 개념 아이콘"></div>
      <p class="note-intro">${tech.intro}</p><p class="note-scope">${tech.scope}</p>
      <section class="note-section"><p class="note-section-label">01 / THE PROBLEM</p><h4>${tech.question}</h4><p>${tech.problem}</p></section>
      <section class="note-section"><p class="note-section-label">02 / HOW IT WORKS</p><h4>데이터를 따라가며 동작을 읽기</h4>
        <ol class="mechanism-flow">${tech.steps.map(([icon, title, description], step) => `<li><div class="mechanism-icon"><img src="${assets[icon]}" alt=""><span>${String(step + 1).padStart(2, "0")}</span></div><div><strong>${title}</strong><p>${description}</p></div></li>`).join("")}</ol>
        <dl class="mechanism-explanations">${tech.mechanics.map(([title, text]) => `<div><dt>${title}</dt><dd>${text}</dd></div>`).join("")}</dl>
      </section>
      ${renderNoteExample(tech.example)}
      <section class="note-section"><p class="note-section-label">04 / CHOOSING AN ALTERNATIVE</p><h4>대안에서 얻는 것과 감당할 것</h4><p class="note-table-hint">좁은 화면에서는 표를 좌우로 밀어 읽을 수 있습니다.</p>
        <div class="table-scroll note-table-scroll" role="region" tabindex="0" aria-label="${tech.title} 대안 비교표"><table class="note-comparison"><caption>${tech.title}의 대안별 선택 조건</caption><thead><tr><th scope="col">선택지</th><th scope="col">얻는 것</th><th scope="col">비용과 제약</th><th scope="col">선택할 조건</th></tr></thead><tbody>${tech.alternatives.map(([title, gain, cost, condition]) => `<tr><th scope="row">${title}</th><td>${gain}</td><td>${cost}</td><td>${condition}</td></tr>`).join("")}</tbody></table></div>
      </section>
      <section class="note-section"><p class="note-section-label">05 / WHAT TO MEASURE</p><h4>병목을 찾고 선택을 검증하는 지표</h4><dl class="note-metrics">${tech.metrics.map(([title, text]) => `<div><dt>${title}</dt><dd>${text}</dd></div>`).join("")}</dl></section>
      <div class="note-takeaway"><strong>설계에 가져갈 판단</strong><p>${tech.takeaway}</p><button class="quiet-button" data-note-location="${tech.key}">구성도에서 이 역할 보기 ↑</button></div>
      <footer class="note-sources"><h4>근거와 더 읽을 자료</h4><ul>${tech.sources.map(([title, url, scope]) => `<li><a href="${url}" target="_blank" rel="noopener">${title} ↗</a><span>${scope}</span></li>`).join("")}</ul></footer>
    </article>`).join("");

  $$('[data-note-tab]').forEach(button => button.addEventListener("click", () => {
    selectTechnologyNote(button.dataset.noteTab);
    updateNoteURL(button.dataset.noteTab);
  }));
  $("#note-tabs").addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const buttons = $$("[data-note-tab]");
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1) + buttons.length) % buttons.length;
    buttons[next].click();
    buttons[next].focus({ preventScroll: true });
  });
  document.addEventListener("click", event => {
    const link = event.target.closest("[data-read-tech]");
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    stopPlayback();
    updateNoteURL(link.dataset.readTech, true);
    selectTechnologyNote(link.dataset.readTech, { reveal: true, focus: true });
  });
  $$('[data-note-location]').forEach(button => button.addEventListener("click", () => {
    const tech = technologyNotes.find(item => item.key === button.dataset.noteLocation);
    if (technologies.some(item => item.key === tech.key)) selectTech(tech.key);
    else { stopPlayback(); setStep(-1); selectNode(tech.node, { panel: "role" }); }
    const url = new URL(location.href);
    url.hash = "architecture";
    history.pushState({ atlasRoute: currentRoute }, "", url);
    const target = window.innerWidth < 1440 ? $(".inspector") : $("#architecture");
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    $("#detail-title").setAttribute("tabindex", "-1");
    $("#detail-title").focus({ preventScroll: true });
  }));
  window.addEventListener("hashchange", () => {
    syncTechnologyHash();
    if (/^#tech-[a-z]+$/.test(location.hash) && currentRoute === "netflix") scrollToRoute(currentRoute);
  });
  const noteLayout = matchMedia("(min-width: 1101px)");
  const updateNoteOrientation = () => $("#note-tabs").setAttribute("aria-orientation", noteLayout.matches ? "vertical" : "horizontal");
  noteLayout.addEventListener("change", updateNoteOrientation);
  updateNoteOrientation();
  $$('.capacity-inputs input').forEach(input => input.addEventListener("input", updateCapacity));
  $("#abr-throughput").addEventListener("input", updateABR);
  updateCapacity();
  updateABR();
}
