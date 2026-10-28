import { useRef } from "react";
import { m, useReducedMotion } from "motion/react";
import { assets } from "../data/assets.js";
import {
  technologyCatalogue,
  technologyCategories,
  technologyCategoryDescriptions,
  findTechnology,
} from "../data/technology-catalogue.js";
import { useApp } from "../state/AppState.jsx";
import { ActionIcon, Code } from "./ui.jsx";
import { Text } from "./Glossary.jsx";

export function TechnologyCard({ technologyId, usage, caseKey }) {
  const tech = findTechnology(technologyId),
    { patch } = useApp(),
    reduced = useReducedMotion();
  if (!tech) return null;
  return (
    <m.article
      className="technology-card"
      data-technology-card={tech.id}
      initial={reduced ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16 }}
    >
      <p className="technology-card-category">
        {technologyCategories.find(([id]) => id === tech.category)?.[1]}
      </p>
      <div className="technology-card-heading">
        <img
          src={assets[tech.image]}
          alt={tech.logoAlt}
          width="48"
          height="48"
        />
        <div>
          <p className="technology-provider">{tech.provider}</p>
          <h3 tabIndex="-1">{tech.name}</h3>
          {tech.type !==
            technologyCategories.find(([id]) => id === tech.category)?.[1] && (
            <p className="technology-type">{tech.type}</p>
          )}
        </div>
      </div>
      <Text className="technology-card-summary">{tech.summary}</Text>
      {usage && (
        <div className="technology-case-use">
          <strong>이 설계에서 맡는 일</strong>
          <Text>{usage}</Text>
        </div>
      )}
      <button
        className="technology-info-open action-dialog"
        data-open-technology-info={tech.id}
        aria-haspopup="dialog"
        aria-label={`${tech.name} 기술 정보 창 열기`}
        onClick={() =>
          patch({
            playing: false,
            sheet: {
              kind: "catalogue",
              key: tech.id,
              context: caseKey ? { kind: "technology", key: caseKey } : null,
            },
          })
        }
      >
        <ActionIcon /> 기술 정보 창 열기
      </button>
    </m.article>
  );
}
export function TechnologyCatalogue() {
  const { state, patch } = useApp(),
    query = state.catalogueQuery.trim().toLocaleLowerCase("ko-KR");
  const matches = technologyCatalogue.filter(
    (tech) =>
      (state.catalogueCategory === "all" ||
        tech.category === state.catalogueCategory) &&
      [
        tech.name,
        tech.provider,
        tech.type,
        tech.summary,
        technologyCategories.find(([id]) => id === tech.category)?.[1],
        ...(tech.aliases || []),
      ]
        .join(" ")
        .toLocaleLowerCase("ko-KR")
        .includes(query),
  );
  const exact = matches.filter((tech) =>
    [tech.name, ...(tech.aliases || [])].some(
      (name) => name.toLocaleLowerCase("ko-KR") === query,
    ),
  );
  const filtered = query && exact.length ? exact : matches;
  filtered.sort(
    (a, b) =>
      technologyCategories.findIndex(([id]) => id === a.category) -
        technologyCategories.findIndex(([id]) => id === b.category) ||
      a.name.localeCompare(b.name, "en"),
  );
  const clear = () => patch({ catalogueCategory: "all", catalogueQuery: "" });
  return (
    <section
      className="technology-library"
      id="technology-library"
      aria-labelledby="technology-library-title"
      hidden={state.route !== "catalogue"}
    >
      <div className="technology-library-heading">
        <h1 id="technology-library-title" tabIndex="-1">
          기술 목록
        </h1>
        <p>
          어떤 일을 맡는 기술인지, 어디에 어떻게 쓰는지 분류별로 살펴봅니다.
        </p>
      </div>
      <div className="technology-search-row">
        <label className="technology-search" htmlFor="technology-search">
          <span>기술·제품·제공사 검색</span>
          <input
            id="technology-search"
            type="search"
            autoComplete="off"
            placeholder="예: Python, PostgreSQL, S3"
            value={state.catalogueQuery}
            onChange={(event) => patch({ catalogueQuery: event.target.value })}
          />
        </label>
        <p>카드를 누르면 기술 정보 창이 열립니다.</p>
      </div>
      <label
        className="technology-mobile-category"
        htmlFor="technology-category-select"
      >
        <span>분류 선택</span>
        <select
          id="technology-category-select"
          value={state.catalogueCategory}
          onChange={(event) => patch({ catalogueCategory: event.target.value })}
        >
          {technologyCategories.map(([id, label]) => (
            <option key={id} value={id}>
              {label} (
              {
                technologyCatalogue.filter(
                  (tech) => id === "all" || tech.category === id,
                ).length
              }
              )
            </option>
          ))}
        </select>
      </label>
      <div
        className="technology-category-list"
        role="group"
        aria-label="기술 카테고리"
        aria-describedby="technology-category-description"
      >
        {technologyCategories.map(([id, label]) => (
          <button
            key={id}
            data-technology-category={id}
            aria-pressed={state.catalogueCategory === id}
            onClick={() => patch({ catalogueCategory: id })}
          >
            {label}
            <span>
              {
                technologyCatalogue.filter(
                  (tech) => id === "all" || tech.category === id,
                ).length
              }
            </span>
          </button>
        ))}
      </div>
      <p
        className="technology-category-description"
        id="technology-category-description"
      >
        <strong>
          {
            technologyCategories.find(
              ([id]) => id === state.catalogueCategory,
            )?.[1]
          }
        </strong>
        {technologyCategoryDescriptions[state.catalogueCategory]}
      </p>
      <p className="technology-result-count" role="status" aria-live="polite">
        {filtered.length}개 기술
        {state.catalogueQuery && ` · “${state.catalogueQuery}” 검색 결과`}
      </p>
      {filtered.length ? (
        <div
          className="technology-catalogue-grid"
          id="technology-catalogue-grid"
        >
          {filtered.map((tech) => (
            <TechnologyCard key={tech.id} technologyId={tech.id} />
          ))}
        </div>
      ) : (
        <div className="technology-empty">
          <h2>조건에 맞는 기술이 없습니다.</h2>
          <p>제품명이나 제공사 이름으로 검색하거나 카테고리를 바꿔보세요.</p>
          <button className="quiet-button" onClick={clear}>
            검색·카테고리 초기화
          </button>
        </div>
      )}
      <footer className="technology-library-footer">
        <p>
          기술의 일반적인 동작과 사용 조건을 설명합니다. 아키텍처 사례에서
          실제로 쓰인 위치와 확인 범위는 각 사례에 표시합니다.
        </p>
        <p>
          제품·언어 아이콘과 브랜드 심벌은 원본을 사용합니다. 각 상세 창에서
          이미지 출처와 공식 문서를 확인할 수 있습니다.
        </p>
      </footer>
    </section>
  );
}
export function CaseTechnologies() {
  const { followRoute } = useApp();
  return (
    <section
      className="case-technology-section"
      aria-labelledby="case-technology-title"
    >
      <div className="case-technology-heading">
        <div>
          <h3 id="case-technology-title">이 설계의 사용 기술</h3>
          <p>
            역할을 확인한 뒤, 기술 정보 창에서 제품 자체의 개념과 사용법을
            읽어보세요.
          </p>
        </div>
        <a
          href="?view=technologies"
          onClick={(event) => followRoute(event, "catalogue")}
        >
          전체 기술 목록 →
        </a>
      </div>
      <div className="case-technology-grid">
        <TechnologyCard
          technologyId="nginx"
          caseKey="nginx"
          usage="OCA 내부에서 플레이어의 HTTP 요청을 파일과 연결하고 영상 바이트를 응답합니다."
        />
        <TechnologyCard
          technologyId="freebsd"
          caseKey="freebsd"
          usage="OCA의 운영체제로서 NGINX 아래의 파일·메모리·소켓·네트워크 I/O를 받칩니다."
        />
      </div>
      <p className="case-technology-scope">
        공개된 OCA 소프트웨어 설명을 기준으로 표시했습니다. 재생 제어 영역의
        구체적인 AWS 서비스와 원본 저장소 제품은 특정하지 않았습니다.
      </p>
    </section>
  );
}
export function TechnologyInfo({ technologyId }) {
  const root = useRef(null);
  const jump = (key) => {
    const heading = root.current.querySelector(
      `[data-info-section="${key}"] h3`,
    );
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({
      block: "start",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  const tech = findTechnology(technologyId),
    { patch } = useApp();
  if (!tech) return null;
  return (
    <div ref={root} className="technology-info" data-technology-info={tech.id}>
      <nav className="technology-info-jumps" aria-label="기술 정보 목차">
        {[
          ["definition", "기술 개요"],
          ["usage", "사용 상황"],
          ["concepts", "주요 개념"],
          ["example", "설정 예제"],
          ["checks", "핵심 확인"],
        ].map(([id, label]) => (
          <button key={id} data-info-jump={id} onClick={() => jump(id)}>
            {label} ↓
          </button>
        ))}
      </nav>
      <section data-info-section="definition">
        <p className="sheet-eyebrow">무엇을 하는 기술인가요?</p>
        <h3 tabIndex="-1">
          {tech.name} · {tech.type}
        </h3>
        <Text>{tech.definition}</Text>
        <dl className="technology-info-facts">
          <div>
            <dt>제공사·프로젝트</dt>
            <dd>{tech.provider}</dd>
          </div>
          <div>
            <dt>분류</dt>
            <dd>
              {technologyCategories.find(([id]) => id === tech.category)[1]}
            </dd>
          </div>
        </dl>
      </section>
      <section data-info-section="usage">
        <p className="sheet-eyebrow">어디에 사용하나요?</p>
        <h3 tabIndex="-1">사용하는 상황과 담당하는 역할</h3>
        <div className="technology-use-cases">
          {tech.useCases.map(([title, text]) => (
            <article key={title}>
              <h4>{title}</h4>
              <Text>{text}</Text>
            </article>
          ))}
        </div>
      </section>
      <section>
        <p className="sheet-eyebrow">동작 원리</p>
        <h3 tabIndex="-1">동작과 처리 순서</h3>
        <ol className="technology-info-flow">
          {tech.flow.map(([title, text], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h4>{title}</h4>
                <Text>{text}</Text>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section data-info-section="concepts">
        <p className="sheet-eyebrow">먼저 알아둘 개념</p>
        <h3 tabIndex="-1">구성과 용어</h3>
        <dl className="technology-concepts">
          {tech.concepts.map(([title, text]) => (
            <div key={title}>
              <dt>{title}</dt>
              <Text as="dd">{text}</Text>
            </div>
          ))}
        </dl>
      </section>
      <section data-info-section="example">
        <p className="sheet-eyebrow">설정과 사용 예</p>
        <h3 tabIndex="-1">{tech.example.title}</h3>
        <Text>{tech.example.description}</Text>
        <Code label={tech.example.language}>{tech.example.code}</Code>
        <Text className="sheet-caption">{tech.example.note}</Text>
      </section>
      <section data-info-section="checks">
        <p className="sheet-eyebrow">설계에서 놓치기 쉬운 점</p>
        <h3 tabIndex="-1">실제로 연결할 때 확인할 내용</h3>
        <ol className="technology-design-points">
          {tech.points.map(([title, text]) => (
            <li key={title}>
              <h4>{title}</h4>
              <Text>{text}</Text>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <p className="sheet-eyebrow">관측과 진단</p>
        <h3 tabIndex="-1">이런 증상이 보이면</h3>
        <dl className="technology-diagnostics">
          {tech.diagnostics.map(([symptom, check]) => (
            <div key={symptom}>
              <dt>{symptom}</dt>
              <Text as="dd">{check}</Text>
            </div>
          ))}
        </dl>
      </section>
      {tech.related.length > 0 && (
        <section>
          <h3 tabIndex="-1">함께 살펴볼 기술</h3>
          <div className="technology-related">
            {tech.related.map((id) => {
              const related = findTechnology(id);
              return (
                <button
                  key={id}
                  onClick={() =>
                    patch({ sheet: { kind: "catalogue", key: id } })
                  }
                >
                  <img src={assets[related.image]} alt="" />
                  {related.name}
                  <span>이 창에서 보기</span>
                </button>
              );
            })}
          </div>
        </section>
      )}
      <section>
        <h3 tabIndex="-1">공식 문서와 이미지 출처</h3>
        <ul className="sheet-sources">
          {tech.sources.map(([title, url, scope]) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener">
                {title}
              </a>
              <p>{scope}</p>
            </li>
          ))}
          <li>
            <a href={tech.logoSource} target="_blank" rel="noopener">
              {tech.name} 이미지 출처
            </a>
            <p>{tech.logoNote}</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
export function InformationSwitch({
  sheet,
  techKey,
  label = "이 사례에서의 사용",
}) {
  const { patch } = useApp(),
    origin = sheet.kind === "catalogue" ? sheet.context : sheet;
  const known = findTechnology(techKey);
  if (!known || !origin) return null;
  const general = sheet.kind === "catalogue";
  return (
    <div
      className="technology-information-switch"
      role="group"
      aria-label="설명 관점 선택"
    >
      <button
        data-info-view="case"
        aria-pressed={!general}
        onClick={() => patch({ sheet: origin })}
      >
        {label}
      </button>
      <button
        data-info-view="definition"
        aria-pressed={general}
        onClick={() =>
          patch({
            sheet: { kind: "catalogue", key: known.id, context: origin },
          })
        }
      >
        기술 자체 정보
      </button>
    </div>
  );
}
