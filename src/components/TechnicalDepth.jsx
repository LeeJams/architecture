import { memo, useRef, useState } from "react";
import {
  technicalSources,
  technologyDepth,
  replacementDepth,
} from "../data/technology-depth.js";
import { assets } from "../data/assets.js";
import { scrollBehavior } from "../state/AppState.jsx";
import { Code, Reveal } from "./ui.jsx";
import { Text, TechnicalText } from "./Glossary.jsx";

function Citations({ refs }) {
  return refs.length ? (
    <div className="technical-citations">
      {refs.map((id) => (
        <a
          key={id}
          href={technicalSources[id][1]}
          target="_blank"
          rel="noopener"
        >
          {technicalSources[id][0]}
        </a>
      ))}
    </div>
  ) : (
    <p className="technical-model">설명용 설계·계산 예제</p>
  );
}
export const TechnicalDepth = memo(function TechnicalDepth({ tech }) {
  const depth = technologyDepth[tech],
    [selected, setSelected] = useState(0),
    ref = useRef(null);
  if (!depth) return null;
  const scenario = depth.scenarios[selected];
  const jump = (key) => {
    const heading = ref.current.querySelector(
      `[data-depth-target="${key}"] h4`,
    );
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: "start", behavior: scrollBehavior() });
  };
  return (
    <div ref={ref} className="technical-depth" data-technical-depth={tech}>
      <nav className="technical-jumps" aria-label="기술 상세 탐색">
        {[
          ["principles", "핵심 원리"],
          ["scenarios", "조건별 흐름"],
          ["diagnostics", "관측·진단"],
        ].map(([key, label]) => (
          <button key={key} data-depth-jump={key} onClick={() => jump(key)}>
            {label} ↓
          </button>
        ))}
      </nav>
      <section className="technical-principles" data-depth-target="principles">
        <p className="technical-eyebrow">핵심 원리</p>
        <Text as="h4" tabIndex="-1">
          {depth.headline}
        </Text>
        <Text className="technical-scope">{depth.scope}</Text>
        <ol className="technical-keypoints">
          {depth.points.map((point, index) => (
            <li key={point.title}>
              <span className="technical-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <Text as="h5">{point.title}</Text>
                <p>
                  <TechnicalText>{point.text}</TechnicalText>
                </p>
                <Citations refs={point.refs} />
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="technical-scenarios" data-depth-target="scenarios">
        <p className="technical-eyebrow">조건별 동작</p>
        <h4 tabIndex="-1">조건에 따른 처리 과정</h4>
        <div
          className="technical-scenario-buttons"
          role="group"
          aria-label={`${tech} 동작 조건`}
        >
          {depth.scenarios.map((item, index) => (
            <button
              key={item.id}
              type="button"
              data-technical-scenario={index}
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Reveal
          identity={selected}
          className="technical-scenario-result"
          data-scenario-result
          aria-live="polite"
          aria-atomic="true"
        >
          <Text as="h5">{scenario.title}</Text>
          <ol className="technical-path">
            {scenario.path.map(([icon, title, detail], index) => (
              <li key={index}>
                <img src={assets[icon]} alt="" />
                <Text as="strong">{title}</Text>
                <Text as="span">{detail}</Text>
              </li>
            ))}
          </ol>
          <p>
            <TechnicalText>{scenario.text}</TechnicalText>
          </p>
          <Code label={`조건별 동작 · ${scenario.label}`}>{scenario.code}</Code>
          <Citations refs={scenario.refs} />
        </Reveal>
      </section>
      <section
        className="technical-diagnostics"
        data-depth-target="diagnostics"
      >
        <p className="technical-eyebrow">문제 진단</p>
        <h4 tabIndex="-1">증상별 확인 방법</h4>
        <dl>
          {depth.diagnostics.map(([symptom, check, meaning]) => (
            <div key={symptom}>
              <Text as="dt">{symptom}</Text>
              <Text as="dd">
                <strong>확인</strong> {check}
              </Text>
              <Text as="dd">
                <strong>해석</strong> {meaning}
              </Text>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
});
export function DeliveryLab({ tech }) {
  if (!["nginx", "https", "freebsd"].includes(tech)) return null;
  return (
    <aside className="technical-lab">
      <h4>실제로 요청하고 응답을 확인하기</h4>
      <Text>
        루프백 NGINX와 10,000바이트 파일로 전체 GET·부분
        범위·suffix·416·If-Range 일치/불일치·404를 확인합니다. 검사 스크립트는
        상태·헤더뿐 아니라 수신한 바이트도 원본과 대조합니다.
      </Text>
      <a
        href="https://github.com/LeeJams/architecture/tree/main/examples/file-delivery"
        target="_blank"
        rel="noopener"
      >
        실습 설정·실행 방법·기대 결과
      </a>
      <Text>
        이 실습은 정적 HTTP 응답을 확인합니다. FreeBSD 커널·KTLS·Netflix 장비의
        성능 시험은 아닙니다.
      </Text>
    </aside>
  );
}
export function ReplacementContract({ product }) {
  const detail = replacementDepth[product];
  if (!detail) return null;
  return (
    <section
      className="replacement-contract"
      data-replacement-contract={product}
    >
      <p className="sheet-eyebrow">교체할 때 확인할 사항</p>
      <Text as="h4">{detail.title}</Text>
      <Text>{detail.explanation}</Text>
      <Code
        label={
          product === "caddy"
            ? "Caddyfile · 루프백 학습 설정"
            : product === "apache"
              ? "Apache · 학습용 설정 조각"
              : "이관·검증 예시"
        }
      >
        {detail.code}
      </Code>
      <ol>
        {detail.checks.map((text) => (
          <Text as="li" key={text}>
            {text}
          </Text>
        ))}
      </ol>
      <Citations refs={detail.refs} />
    </section>
  );
}
