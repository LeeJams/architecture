import { useLayoutEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { assets } from "../data/assets.js";
import {
  playbackJourney,
  components,
  technologyDetails,
  requestFacts,
} from "../data/architecture.js";
import { technologyDepth } from "../data/technology-depth.js";
import {
  alternativeCategoryFor,
  noteKeyFor,
  useApp,
} from "../state/AppState.jsx";
import { ActionIcon, ReadLink, Reveal, useRovingTabs } from "./ui.jsx";
import { Text } from "./Glossary.jsx";
import { Diagram } from "./Diagram.jsx";

const techLabels = {
  aws: "AWS",
  oca: "OCA",
  freebsd: "FreeBSD",
  nginx: "NGINX",
  https: "HTTP(S)",
  fill: "콘텐츠 배치",
  abr: "플레이어·ABR",
  steering: "전송 후보 선택",
};
const techImage = (key) =>
  assets[{ oca: "ocaIcon", abr: "player", steering: "routing" }[key] || key];
export function Explorer() {
  const { state, patch, selectStep, selectTech, showAlternatives } = useApp();
  const viewport = useRef(null),
    [scrollable, setScrollable] = useState(false),
    reduced = useReducedMotion();
  useLayoutEffect(() => {
    let lastWidth = 0;
    const update = () => {
      const element = viewport.current;
      if (!element) return;
      if (lastWidth !== element.clientWidth) {
        lastWidth = element.clientWidth;
        if (innerWidth >= 1440 && element.scrollWidth > lastWidth)
          element.scrollLeft = (element.scrollWidth - lastWidth) / 2;
      }
      element.dataset.layoutWidth = String(lastWidth);
      setScrollable(element.scrollWidth > element.clientWidth + 2);
    };
    const observer = new ResizeObserver(update);
    observer.observe(viewport.current);
    update();
    return () => observer.disconnect();
  }, [state.route]);
  const togglePlayback = () =>
    state.playing
      ? patch({ playing: false })
      : patch({
          playing: true,
          failover: false,
          step: 0,
          node: playbackJourney[0].node,
          technology: null,
          panel: "role",
        });
  const toggleFailover = () =>
    patch({
      playing: false,
      failover: !state.failover,
      step: state.failover ? -1 : 8,
      node: state.failover ? "oca" : "fallback",
      panel: "role",
      technology: null,
    });
  const activeTech =
    state.technology ||
    { oca: "oca", fill: "fill", playback: "aws" }[state.node];
  return (
    <section
      className="workspace"
      id="architecture"
      aria-label="넷플릭스 영상 전달 구성도"
    >
      <div className="workspace-toolbar">
        <span className="section-label">
          <b>01</b> 영상 전달 구조
        </span>
        <div className="toolbar-actions">
          <div className="legend" aria-label="연결선 범례">
            <span>
              <i />
              요청·응답
            </span>
            <span>
              <i className="video" />
              영상 전송
            </span>
            <span>
              <i className="fill" />
              사전 배치
            </span>
          </div>
          <button
            id="failover-button"
            className="quiet-button"
            aria-pressed={state.failover}
            onClick={toggleFailover}
          >
            {state.failover ? "↶ 기본 흐름으로" : "⇢ OCA 장애 흐름"}
          </button>
          <button
            id="alternatives-button"
            className="quiet-button action-jump"
            onClick={() =>
              showAlternatives(
                alternativeCategoryFor(state.technology || state.node),
              )
            }
          >
            대체 목록으로 이동 ↓
          </button>
        </div>
      </div>
      <div className="explorer">
        <aside className="story" aria-label="영상 전달 단계">
          <p className="micro-label">처리 순서</p>
          <div className="steps">
            {playbackJourney.map((step, index) => (
              <m.button
                key={step.title}
                className="step"
                data-step={index}
                aria-pressed={state.step === index}
                onClick={() => selectStep(index)}
                whileTap={reduced ? undefined : { scale: 0.985 }}
              >
                <span className="number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.short}</small>
                </span>
              </m.button>
            ))}
          </div>
          <div className="story-bottom">
            <button
              className="play-button"
              id="play-button"
              onClick={togglePlayback}
            >
              {state.playing ? "Ⅱ 잠시 멈추기" : "▶ 흐름 따라가기"}
            </button>
            <button
              className="reset-button"
              id="reset-button"
              onClick={() =>
                patch({ playing: false, failover: false, step: -1 })
              }
            >
              전체 흐름 보기
            </button>
            <p>
              상자를 선택하면
              <br />
              설명이 바뀝니다.
            </p>
          </div>
        </aside>
        <div className={`canvas ${scrollable ? "is-scrollable" : ""}`}>
          <div className="canvas-top">
            <h2 id="canvas-title">
              {state.step < 0
                ? "재생 제어와 영상 전송"
                : `${String(state.step + 1).padStart(2, "0")} · ${state.failover && state.step === 8 ? "다른 후보로 요청 재시도" : playbackJourney[state.step].title}`}
            </h2>
            <span>상자를 선택하면 설명이 표시됩니다.</span>
            <div className="flow-progress" aria-hidden="true">
              <m.div
                animate={{ scaleX: state.step < 0 ? 0 : (state.step + 1) / 9 }}
                transition={{ duration: reduced ? 0 : 0.22 }}
              />
            </div>
          </div>
          <div
            ref={viewport}
            className="diagram-viewport"
            tabIndex="0"
            role="region"
            aria-label="아키텍처 도식, 좁은 화면에서는 좌우로 스크롤"
          >
            <div className="diagram-world">
              <Diagram />
            </div>
          </div>
          <div className="canvas-bottom">
            <span id="scenario-description">
              {state.failover
                ? "장애 개념도 · 다른 후보로 재시도하는 경로이며 실제 복구 시간을 재현하지 않습니다."
                : "공개된 설계를 바탕으로 한 개념도 · 실제 물리 배치와 다를 수 있습니다."}
            </span>
            <span className="desktop-hint">
              노드 선택 → 역할 · 구성 기술 · 대안
            </span>
            <span className="mobile-hint">좌우로 밀어 전체 구성도 보기 ↔</span>
          </div>
        </div>
        <Inspector />
      </div>
      <div className="underbar">
        <span className="micro-label">구성 기술</span>
        <div className="tech-links">
          {["aws", "oca", "freebsd", "nginx", "https", "fill"].map((key) => (
            <button
              key={key}
              data-tech={key}
              aria-pressed={key === activeTech}
              onClick={() => selectTech(key)}
            >
              <img src={techImage(key)} alt="" />
              {techLabels[key]}
            </button>
          ))}
        </div>
        <span className="hint">기술 선택 → 설명 패널</span>
      </div>
    </section>
  );
}
export function Inspector() {
  const { state, patch, openTech } = useApp();
  const component =
    technologyDetails[state.technology] || components[state.node];
  const noteKey = noteKeyFor(state.node, state.technology),
    keypoint = technologyDepth[noteKey];
  const content = useRef(null),
    tabs = useRovingTabs(["role", "stack"], state.panel, (panel) =>
      patch({ panel }),
    );
  useLayoutEffect(() => {
    content.current.scrollTop = 0;
  }, [state.node, state.technology, state.panel, state.step]);
  return (
    <aside
      className={`inspector ${state.step >= 0 ? "is-journey" : ""}`}
      aria-label="선택한 구성 요소의 상세 설명"
    >
      <div className="inspector-head">
        <div className="micro-label">
          <span id="detail-kind">
            {state.technology && technologyDetails[state.technology]
              ? "기술 · "
              : "구성 요소 · "}
          </span>
          <span id="detail-count">{component.count}</span>
        </div>
        <img
          id="detail-image"
          className={`component-visual ${component.brand ? "brand-only" : ""}`}
          src={component.image}
          alt={component.alt}
        />
        <h2 id="detail-title" tabIndex="-1">
          {component.title}
        </h2>
        <p className="detail-english" id="detail-english">
          {component.english}
        </p>
        <div className="badges" id="detail-badges">
          {component.badges.map((badge) => {
            const key = {
              AWS: "aws",
              OCA: "oca",
              FreeBSD: "freebsd",
              NGINX: "nginx",
              "HTTP(S)": "https",
            }[badge];
            return key ? (
              <button
                key={badge}
                className="badge badge-button action-dialog"
                data-inspect-tech={key}
                aria-haspopup="dialog"
                aria-label={`${badge} 기술 설명창 열기`}
                onClick={() => openTech(key)}
              >
                {badge}
                <span className="badge-action">설명</span>
                <ActionIcon />
              </button>
            ) : (
              <span key={badge} className="badge">
                {badge}
              </span>
            );
          })}
        </div>
      </div>
      <div className="inspector-main">
        <div
          className="detail-tabs"
          role="tablist"
          aria-label="상세 설명 종류"
          onKeyDown={tabs.onKeyDown}
        >
          {[
            ["role", "역할과 흐름"],
            ["stack", "구성 기술"],
          ].map(([key, title]) => (
            <button
              key={key}
              ref={(el) => {
                tabs.refs.current[key] = el;
              }}
              id={`${key}-tab`}
              role="tab"
              aria-selected={key === state.panel}
              aria-controls="detail-content"
              tabIndex={key === state.panel ? 0 : -1}
              data-panel={key}
              onClick={() => patch({ panel: key })}
            >
              {title}
            </button>
          ))}
        </div>
        <div
          ref={content}
          className="detail-content"
          id="detail-content"
          role="tabpanel"
          tabIndex="0"
          aria-labelledby={`${state.panel}-tab`}
        >
          <Reveal
            identity={`${state.node}-${state.technology}-${state.panel}-${state.step}`}
          >
            {state.panel === "role" ? (
              state.step >= 0 ? (
                <JourneyFocus />
              ) : (
                <RequestFacts name={state.technology || state.node} />
              )
            ) : (
              <Stack entries={component.stack} />
            )}
            {state.panel === "role" && state.step < 0 && keypoint && (
              <div className="inspector-keypoint">
                <Text as="strong">핵심 · {keypoint.headline}</Text>
                <p>
                  상세에서 조건별 동작과 요청·응답, 증상별 확인 방법을 읽습니다.
                </p>
              </div>
            )}
          </Reveal>
        </div>
        <div className="inspector-actions" id="inspector-actions">
          <button
            className="detail-sheet-open action-dialog"
            data-open-tech-sheet={noteKey}
            aria-haspopup="dialog"
            aria-label={`${component.title} 동작 원리와 예제 설명창 열기`}
            onClick={() => openTech(noteKey)}
          >
            <ActionIcon /> 기술 설명창 열기
          </button>
          <ReadLink className="detail-read-link action-jump" tech={noteKey}>
            본문의 전체 설명으로 이동 <ActionIcon kind="down" />
          </ReadLink>
        </div>
      </div>
      <div className="detail-source" id="detail-source">
        출처 ·{" "}
        <a href={component.source[1]} target="_blank" rel="noopener">
          {component.source[0]}
        </a>
      </div>
    </aside>
  );
}
function RequestFacts({ name }) {
  const facts = requestFacts[name];
  return (
    <>
      <Text className="request-purpose">{facts.purpose}</Text>
      <dl className="request-contract">
        {facts.contract.map((text, index) => (
          <div key={index}>
            <dt>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {["받는 것", "처리하는 일", "내보내는 것"][index]}
            </dt>
            <Text as="dd">{text}</Text>
          </div>
        ))}
      </dl>
      <h3>이 역할을 분리한 이유</h3>
      <Text>{facts.why}</Text>
      <Text as="div" className="detail-note">
        {facts.boundary}
      </Text>
    </>
  );
}
function Stack({ entries }) {
  const { openTech } = useApp();
  return entries.map((item, index) =>
    item.note ? (
      <Text key={index} as="div" className="detail-note">
        {item.note}
      </Text>
    ) : item.technology ? (
      <button
        key={index}
        className="stack-entry action-dialog"
        data-stack-tech={item.technology}
        data-inspect-tech={item.technology}
        aria-haspopup="dialog"
        onClick={() => openTech(item.technology)}
      >
        <img src={item.image} alt="" />
        <span className="stack-entry-copy">
          <strong>{item.title}</strong>
          <span>{item.text}</span>
        </span>
        <span className="stack-entry-action">
          설명 열기 <ActionIcon />
        </span>
      </button>
    ) : (
      <div key={index} className="stack-entry">
        <img src={item.image} alt="" />
        <div>
          <h3>{item.title}</h3>
          <Text>{item.text}</Text>
        </div>
      </div>
    ),
  );
}
function JourneyFocus() {
  const { state, selectStep, openTech } = useApp();
  const step = playbackJourney[state.step],
    retry = state.failover && state.step === 8;
  return (
    <div className="journey-focus">
      <p className="journey-phase">
        {state.step + 1} / {playbackJourney.length} 단계
      </p>
      <h3>{retry ? "다른 후보로 요청 재시도" : step.title}</h3>
      <Text>{step.description}</Text>
      <dl className="request-contract">
        <div>
          <dt>어디에서 → 어디로</dt>
          <Text as="dd">
            {step.from} → {retry ? "다른 전송 거점의 OCA" : step.to}
          </Text>
        </div>
        <div>
          <dt>오가는 데이터</dt>
          <Text as="dd">{step.payload}</Text>
        </div>
      </dl>
      <h3>이 단계에서 일어나는 일</h3>
      <ol className="journey-actions">
        {step.actions.map((action) => (
          <Text as="li" key={action}>
            {action}
          </Text>
        ))}
      </ol>
      <div className="journey-tech">
        {step.tech.map((key) => (
          <button
            key={key}
            className="action-dialog"
            aria-haspopup="dialog"
            data-open-tech-sheet={key}
            onClick={() => openTech(key)}
          >
            <img src={techImage(key)} alt="" />
            {techLabels[key]} 설명 <ActionIcon />
          </button>
        ))}
      </div>
      <div className="flow-sample">
        <span>설명용 데이터 · 실제 Netflix API 형식이 아닙니다.</span>
        <pre>
          <code>{step.sample}</code>
        </pre>
      </div>
      <div className="journey-controls">
        <button
          data-journey-move="-1"
          disabled={state.step === 0}
          onClick={() => selectStep(state.step - 1)}
        >
          ← 이전
        </button>
        <button
          data-journey-move="1"
          disabled={state.step === 8}
          onClick={() => selectStep(state.step + 1)}
        >
          다음 단계 →
        </button>
      </div>
    </div>
  );
}
