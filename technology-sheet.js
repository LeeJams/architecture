"use strict";

const technologyPublishers = {
  oca: ["Netflix", "Open Connect의 영상 전달 장비"],
  aws: ["Amazon Web Services", "Amazon의 클라우드 플랫폼"],
  freebsd: ["FreeBSD Project", "커뮤니티가 개발하는 오픈소스 운영체제"],
  nginx: ["F5 · NGINX Open Source", "오픈소스 HTTP 서버 프로젝트"],
  https: ["IETF 표준", "특정 회사 제품이 아닌 HTTP·TLS 프로토콜"],
  fill: ["콘텐츠 준비 설계", "특정 회사의 단일 제품이 아닌 기능"],
  abr: ["플레이어 설계", "기기·플레이어 구현에 따르는 적응형 재생 방식"],
  steering: ["전달망 제어 설계", "파일·경로·상태로 전송 후보를 고르는 기능"]
};

function sheetSteps(steps) {
  return `<ol class="sheet-steps">${steps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><strong>${step[0]}</strong><p>${step[1] || ""}</p></li>`).join("")}</ol>`;
}

function presentTechnologySheet({ title, publisher, type, image, role, body, footer }) {
  stopPlayback();
  $("#technology-sheet-title").textContent = title;
  $("#technology-sheet-publisher").textContent = publisher;
  $("#technology-sheet-type").textContent = type;
  $("#technology-sheet-image").src = image;
  $("#technology-sheet-image").alt = title + " 로고 또는 역할 아이콘";
  $("#technology-sheet-role").textContent = role;
  $("#technology-sheet-content").innerHTML = body;
  $("#technology-sheet-footer").innerHTML = footer;
  const dialog = $("#technology-dialog");
  $("#zoom-dialog").open && $("#zoom-dialog").close();
  if (!dialog.open) dialog.showModal();
  document.documentElement.classList.add("has-technology-dialog");
  $("#technology-sheet-scroll").scrollTop = 0;
}

function openTechnologySheet(key) {
  const id = ({ player: "abr", playback: "aws", origin: "fill", fallback: "steering" })[key] || key;
  const tech = technologyNotes.find(item => item.key === id);
  if (!tech) return;
  const publisher = technologyPublishers[id];
  const code = tech.example.code ? `<div class="note-code"><span>${tech.example.language}</span><pre tabindex="0"><code>${escapeHTML(tech.example.code)}</code></pre></div>` : "";
  presentTechnologySheet({
    title: tech.title, publisher: publisher[0], type: publisher[1], image: tech.image, role: tech.intro,
    body: `<section><p class="sheet-eyebrow">이 아키텍처에서 하는 일</p><h3>${tech.question}</h3><p>${tech.problem}</p></section><section><p class="sheet-eyebrow">동작을 단계별로</p><h3>어떻게 처리하나요?</h3>${sheetSteps(tech.steps.map(([, title, text]) => [title, text]))}<dl class="sheet-explanations">${tech.mechanics.map(([title, text]) => `<div><dt>${title}</dt><dd>${text}</dd></div>`).join("")}</dl></section><section><p class="sheet-eyebrow">구체적으로 읽기</p><h3>${tech.example.title}</h3><p>${tech.example.text}</p>${code}<p class="sheet-caption">${tech.example.caveat}</p></section><section><h3>공식 문서와 근거</h3><ul class="sheet-sources">${tech.sources.map(([title, url, scope]) => `<li><a href="${url}" target="_blank" rel="noopener">${title} ↗</a><p>${scope}</p></li>`).join("")}</ul></section>`,
    footer: `<button class="quiet-button" data-read-sheet="${id}">본문에서 이어 읽기 ↗</button><button class="quiet-button" data-show-alternatives="${alternativeCategoryFor(id)}">회사·제품별 대안 보기 ↓</button>`
  });
}

function openAlternativeSheet(id) {
  const product = alternativeProducts.find(item => item.id === id);
  if (!product) return;
  presentTechnologySheet({
    title: product.name, publisher: product.company, type: product.organization + " · " + product.type, image: assets[product.image], role: product.role,
    body: `<section><p class="sheet-eyebrow">어떤 기술인가요?</p><h3>${product.type}</h3><p>${product.description}</p><div class="product-features">${product.features.map(feature => `<span>${feature}</span>`).join("")}</div></section><section><p class="sheet-eyebrow">동작 원리</p><h3>요청과 데이터가 지나는 순서</h3>${sheetSteps(product.mechanism.map(text => [text, ""]))}${product.details.map(text => `<p>${text}</p>`).join("")}</section><section class="sheet-fit"><h3>어떤 상황에서 살펴볼까요?</h3><p>${product.fit}</p></section><section><h3>공식 제품·프로젝트 문서</h3><ul class="sheet-sources"><li><a href="${product.docs}" target="_blank" rel="noopener">${product.name} 공식 문서 ↗</a></li>${product.source ? `<li><a href="${product.source}" target="_blank" rel="noopener">공식 프로젝트 저장소 ↗</a></li>` : ""}</ul></section>`,
    footer: `<button class="quiet-button" data-close-technology>대안 목록으로 돌아가기</button><span class="sheet-footer-note">역할별로 검토하는 제품·프로젝트이며 Netflix의 전환 계획을 뜻하지 않습니다.</span>`
  });
}

function closeTechnologySheet() {
  const dialog = $("#technology-dialog");
  if (dialog.open) dialog.close();
}

function initializeTechnologySheet() {
  const dialog = $("#technology-dialog");
  dialog.addEventListener("close", () => document.documentElement.classList.remove("has-technology-dialog"));
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeTechnologySheet();
  });
  $("#close-technology").addEventListener("click", closeTechnologySheet);
  document.addEventListener("click", event => {
    const technology = event.target.closest("[data-open-tech-sheet]");
    if (technology) openTechnologySheet(technology.dataset.openTechSheet);
    const alternative = event.target.closest("[data-open-alternative]");
    if (alternative) openAlternativeSheet(alternative.dataset.openAlternative);
    const close = event.target.closest("[data-close-technology]");
    if (close) closeTechnologySheet();
    const read = event.target.closest("[data-read-sheet]");
    if (read) {
      closeTechnologySheet();
      updateNoteURL(read.dataset.readSheet, true);
      selectTechnologyNote(read.dataset.readSheet, { reveal: true, focus: true });
    }
    const move = event.target.closest("[data-journey-move]");
    if (move) selectJourneyStep(selectedStep + Number(move.dataset.journeyMove));
  });
}
