import { useEffect, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { assets } from "../data/assets.js";
import { technologies } from "../data/architecture.js";
import { technologyNotes } from "../data/technology-notes.js";
import {
  alternativeCategoryFor,
  replacementLinkLabel,
  useApp,
} from "../state/AppState.jsx";
import { TechnicalDepth, DeliveryLab } from "./TechnicalDepth.jsx";
import { GlossarySwitch, Text } from "./Glossary.jsx";
import { ActionIcon, Code, ReadLink, useRovingTabs } from "./ui.jsx";

export function TechnologyReader() {
  const { state, readTech, showAlternatives, locateTech, openTech } = useApp();
  const [vertical, setVertical] = useState(
    () => matchMedia("(min-width: 1101px)").matches,
  );
  const tabs = useRovingTabs(
    technologyNotes.map((item) => item.key),
    state.note,
    (key) => readTech(key, { reveal: false, focus: false, push: false }),
  );
  useEffect(() => {
    const query = matchMedia("(min-width: 1101px)"),
      change = () => setVertical(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return (
    <section
      className="article-section"
      id="technologies"
      aria-labelledby="technologies-title"
    >
      <div className="section-heading">
        <div>
          <div className="section-label">
            <b>03</b> 기술 설명
          </div>
          <h2 id="technologies-title">기술별 동작 원리</h2>
          <p>
            파일 전송에 쓰이는 기술과 화질 조절·서버 선택 방식을 설명합니다.
          </p>
        </div>
        <p className="aside-note">
          문제 → 원리 → 예제 → 선택
          <br />각 설명에 근거와 적용 범위를 표시
        </p>
      </div>
      <div className="technology-lab" id="technology-lab">
        <div className="note-navigation">
          <p className="micro-label" id="note-navigation-label">
            주제 선택
          </p>
          <GlossarySwitch />
          <div
            id="note-tabs"
            role="tablist"
            aria-labelledby="note-navigation-label"
            aria-orientation={vertical ? "vertical" : "horizontal"}
            onKeyDown={tabs.onKeyDown}
          >
            {technologyNotes.map((tech) => (
              <button
                key={tech.key}
                ref={(el) => {
                  tabs.refs.current[tech.key] = el;
                }}
                id={`note-tab-${tech.key}`}
                role="tab"
                aria-selected={tech.key === state.note}
                aria-controls={`tech-${tech.key}`}
                tabIndex={tech.key === state.note ? 0 : -1}
                data-note-tab={tech.key}
                onClick={() =>
                  readTech(tech.key, {
                    reveal: false,
                    focus: false,
                    push: false,
                  })
                }
              >
                <img src={tech.image} alt="" />
                <span>{tech.short}</span>
                <span className="note-tab-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>
          <p className="note-navigation-hint">
            주제를 선택하면 동작 원리와 예제를 볼 수 있습니다.
          </p>
        </div>
        <div id="note-panels" className="note-panels">
          {technologyNotes.map((tech) => (
            <article
              key={tech.key}
              id={`tech-${tech.key}`}
              className="technology-note"
              role="tabpanel"
              aria-labelledby={`note-tab-${tech.key}`}
              tabIndex="0"
              hidden={tech.key !== state.note}
            >
              <div className="note-heading">
                <div>
                  <p className="micro-label">{tech.category}</p>
                  <h3 tabIndex="-1">{tech.title}</h3>
                  <button
                    className="reader-sheet-open quiet-button action-dialog"
                    data-open-tech-sheet={tech.key}
                    aria-haspopup="dialog"
                    onClick={() => openTech(tech.key)}
                  >
                    <ActionIcon /> 기술 설명창 열기
                  </button>
                </div>
                <img
                  src={tech.image}
                  alt={`${tech.title}의 로고 또는 개념 아이콘`}
                />
              </div>
              <Text className="note-intro">{tech.intro}</Text>
              <Text className="note-scope">{tech.scope}</Text>
              <section className="note-section">
                <p className="note-section-label">해결할 문제</p>
                <Text as="h4">{tech.question}</Text>
                <Text>{tech.problem}</Text>
              </section>
              <section className="note-section">
                <p className="note-section-label">처리 과정</p>
                <h4>요청과 데이터 처리 순서</h4>
                <ol className="mechanism-flow">
                  {tech.steps.map(([icon, title, description], index) => (
                    <li key={index}>
                      <div className="mechanism-icon">
                        <img src={assets[icon]} alt="" />
                        <span>{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <div>
                        <Text as="strong">{title}</Text>
                        <Text>{description}</Text>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
              <TechnicalDepth tech={tech.key} />
              <NoteExample example={tech.example} />
              <DeliveryLab tech={tech.key} />
              <section className="note-section">
                <p className="note-section-label">대체 기술</p>
                <h4>같은 역할을 맡길 기술</h4>
                <p>
                  본문 아래에서 현재 기술과 대체 기술, 대체하는 계층과 연결할
                  기존 역할을 함께 확인합니다.
                </p>
                <button
                  className="quiet-button action-jump"
                  data-show-alternatives={alternativeCategoryFor(tech.key)}
                  onClick={() =>
                    showAlternatives(alternativeCategoryFor(tech.key))
                  }
                >
                  {replacementLinkLabel(tech.key)} ↓
                </button>
              </section>
              <section className="note-section">
                <p className="note-section-label">관측 지표</p>
                <h4>병목을 찾고 선택을 검증하는 지표</h4>
                <dl className="note-metrics">
                  {tech.metrics.map(([title, text]) => (
                    <div key={title}>
                      <Text as="dt">{title}</Text>
                      <Text as="dd">{text}</Text>
                    </div>
                  ))}
                </dl>
              </section>
              <div className="note-takeaway">
                <strong>선택 기준</strong>
                <Text>{tech.takeaway}</Text>
                <button
                  className="quiet-button action-jump"
                  data-note-location={tech.key}
                  onClick={() => locateTech(tech.key)}
                >
                  구성도 위치로 이동 ↑
                </button>
              </div>
              <footer className="note-sources">
                <h4>근거와 더 읽을 자료</h4>
                <ul>
                  {tech.sources.map(([title, url, scope]) => (
                    <li key={url}>
                      <a href={url} target="_blank" rel="noopener">
                        {title}
                      </a>
                      <span>{scope}</span>
                    </li>
                  ))}
                </ul>
              </footer>
            </article>
          ))}
        </div>
      </div>
      <TechnologyOverview />
    </section>
  );
}
export function NoteExample({ example }) {
  return (
    <section className="note-section note-example">
      <p className="note-section-label">설정과 예제</p>
      <Text as="h4">{example.title}</Text>
      <Text>{example.text}</Text>
      {example.kind === "capacity" ? (
        <CapacityCalculator />
      ) : example.kind === "abr" ? (
        <ABRCalculator />
      ) : (
        <Code label={example.language}>{example.code}</Code>
      )}
      <Text className="example-caveat">{example.caveat}</Text>
    </section>
  );
}
export function CapacityCalculator() {
  const [values, setValues] = useState(["10000", "5", "70"]);
  const fields = [
    ["capacity-viewers", "동시 시청자 수", 1, 1000000, 1],
    ["capacity-bitrate", "평균 비트레이트 (Mb/s)", 0.1, 100, 0.1],
    ["capacity-utilization", "목표 링크 사용률 (%)", 10, 100, 1],
  ];
  const valid = values.every(
    (value, index) =>
      value !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= fields[index][2] &&
      Number(value) <= fields[index][3] &&
      Math.abs(
        (Number(value) - fields[index][2]) / fields[index][4] -
          Math.round((Number(value) - fields[index][2]) / fields[index][4]),
      ) < 1e-6,
  );
  const [viewers, bitrate, utilization] = values.map(Number),
    payload = (viewers * bitrate) / 1000,
    capacity = payload / (utilization / 100);
  const decimal = (value) =>
    value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  return (
    <>
      <div className="capacity-inputs">
        {fields.map(([id, label, min, max, step], index) => (
          <label key={id}>
            {label}
            <input
              id={id}
              type="number"
              min={min}
              max={max}
              step={step}
              value={values[index]}
              inputMode={step < 1 ? "decimal" : "numeric"}
              onChange={(event) =>
                setValues((previous) =>
                  previous.map((value, i) =>
                    i === index ? event.target.value : value,
                  ),
                )
              }
            />
          </label>
        ))}
      </div>
      <div className="capacity-output" aria-live="polite" aria-atomic="true">
        <Text id="capacity-result">
          {valid ? (
            <>
              영상 페이로드 <strong>{decimal(payload)} Gb/s</strong>
              <span>
                단순 링크 용량 <strong>{decimal(capacity)} Gb/s</strong>
              </span>
            </>
          ) : (
            "각 항목에 표시된 범위 안의 숫자를 입력해 주세요."
          )}
        </Text>
        <p id="capacity-formula">
          {valid
            ? `${decimal(viewers)}명 × ${decimal(bitrate)} Mb/s ÷ 1,000 ÷ ${decimal(utilization / 100)} = ${decimal(capacity)} Gb/s`
            : "시청자 1~1,000,000명 · 비트레이트 0.1~100 Mb/s · 사용률 10~100%"}
        </p>
      </div>
    </>
  );
}
export function ABRCalculator() {
  const [throughput, setThroughput] = useState(10),
    [buffer, setBuffer] = useState("8"),
    reduced = useReducedMotion();
  const duration = 20 / throughput,
    next = [1, 3, 5, 8]
      .filter((bitrate) => bitrate <= throughput * 0.75)
      .at(-1);
  const valid =
    buffer !== "" &&
    Number(buffer) >= 0 &&
    Number(buffer) <= 120 &&
    Number(buffer) % 0.5 === 0;
  const stall = Math.max(0, duration - Number(buffer)),
    after = Math.max(0, Number(buffer) - duration) + 4;
  const scale = Math.max(4, duration);
  return (
    <>
      <label className="abr-control" htmlFor="abr-throughput">
        유효 다운로드 처리량{" "}
        <output id="abr-speed" htmlFor="abr-throughput">
          {throughput} Mb/s
        </output>
      </label>
      <input
        id="abr-throughput"
        className="abr-slider"
        type="range"
        min="0.5"
        max="15"
        step="0.5"
        value={throughput}
        onChange={(event) => setThroughput(Number(event.target.value))}
      />
      <label className="abr-buffer-control">
        다운로드 시작 시 재생 버퍼 (초){" "}
        <input
          id="abr-buffer"
          type="number"
          min="0"
          max="120"
          step="0.5"
          value={buffer}
          inputMode="decimal"
          onChange={(event) => setBuffer(event.target.value)}
        />
      </label>
      <div
        className="abr-time-comparison"
        aria-label="4초 구간의 재생 시간과 수신 시간 비교"
      >
        <div>
          <span>재생할 분량</span>
          <div className="time-track">
            <m.div
              className="time-playback"
              animate={{ width: `${(4 / scale) * 100}%` }}
              transition={{ duration: reduced ? 0 : 0.2 }}
            />
          </div>
          <strong>4초</strong>
        </div>
        <div>
          <span>다운로드</span>
          <div className="time-track">
            <m.div
              className={
                duration > 4 ? "time-download is-slow" : "time-download"
              }
              animate={{ width: `${(duration / scale) * 100}%` }}
              transition={{ duration: reduced ? 0 : 0.2 }}
            />
          </div>
          <strong>{duration.toFixed(2)}초</strong>
        </div>
      </div>
      <div className="abr-output" aria-live="polite" aria-atomic="true">
        <Text id="abr-result">
          4초 구간 수신에 <strong>{duration.toFixed(2)}초</strong>
          <span>
            {duration > 4
              ? "재생 시간보다 오래 걸려 버퍼가 줄어듭니다."
              : duration < 4
                ? "재생 시간보다 빨리 받아 버퍼를 채울 여지가 있습니다."
                : "재생 시간과 수신 시간이 같아 여유가 없습니다."}
          </span>
        </Text>
        <Text id="abr-next">{`안전 예산 ${(throughput * 0.75).toFixed(2)} Mb/s → ${next ? `다음 후보 ${next} Mb/s` : "조건을 만족하는 후보 없음: 최저 화질도 지속 수신 예산을 넘습니다."}`}</Text>
        <Text id="abr-buffer-result">
          {valid
            ? `초기 버퍼 ${Number(buffer)}초 → 이 구간 수신 중 재버퍼링 ${stall.toFixed(2)}초 → 수신 완료 후 버퍼 ${after.toFixed(2)}초. 상수 처리량·연속 재생 모델입니다.`
            : "재생 버퍼는 0~120초 범위의 숫자로 입력해 주세요."}
        </Text>
      </div>
    </>
  );
}
function TechnologyOverview() {
  const { showAlternatives, locateTech } = useApp();
  return (
    <details className="technology-overview">
      <summary>주요 기술 요약</summary>
      <div className="tech-grid" id="tech-grid">
        {technologies.map((tech) => (
          <article key={tech.key} className="tech-card">
            <div className="tech-card-header">
              <div className={`tech-card-image ${tech.wide ? "wide" : ""}`}>
                <img src={tech.image} alt={tech.alt} />
              </div>
              <div>
                <h3>{tech.title}</h3>
                <span className="category">{tech.category}</span>
              </div>
            </div>
            <Text>{tech.description}</Text>
            <dl>
              <dt>이 구조에서 얻는 것</dt>
              <Text as="dd">{tech.why}</Text>
            </dl>
            <button
              className="product-open"
              data-show-alternatives={alternativeCategoryFor(tech.key)}
              onClick={() => showAlternatives(alternativeCategoryFor(tech.key))}
            >
              {replacementLinkLabel(tech.key)} ↓
            </button>
            <ReadLink className="tech-card-read" tech={tech.key} />
            <button
              data-card-tech={tech.key}
              onClick={() => locateTech(tech.key)}
            >
              구성도 위치로 이동 ↑
            </button>
          </article>
        ))}
      </div>
    </details>
  );
}
