import { useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { assetURL } from "../data/assets.js";
import { serviceStacks, findServiceStack } from "../data/service-stacks.js";
import { findTechnology } from "../data/technology-catalogue.js";
import { useApp, scrollBehavior } from "../state/AppState.jsx";
import { TechnologyMark } from "./TechnologyMark.jsx";
import { ActionIcon } from "./ui.jsx";
import { Text } from "./Glossary.jsx";

export function ServiceStackLink({ service, children }) {
  const { followRoute } = useApp();
  return (
    <a
      className="service-stack-link"
      href={`?view=stacks&service=${service}`}
      onClick={(event) => followRoute(event, "stacks", { service })}
    >
      {children || "파트별 기술 구성 보기"} <ActionIcon kind="arrow" />
    </a>
  );
}

function StackTechnology({ entry }) {
  const { patch } = useApp();
  const technology = entry.id ? findTechnology(entry.id) : null;
  const Tag = technology ? "button" : "div";
  return (
    <Tag
      className={`stack-tech-entry${technology ? " is-interactive" : ""}`}
      data-stack-technology={entry.id || undefined}
      {...(technology
        ? {
            type: "button",
            "aria-haspopup": "dialog",
            "aria-label": `${technology.name} 기술 정보 창 열기`,
            onClick: () =>
              patch({
                sheet: { kind: "catalogue", key: technology.id },
                playing: false,
              }),
          }
        : {})}
    >
      {technology ? (
        <TechnologyMark technology={technology} compact />
      ) : entry.image ? (
        <img
          src={assetURL(entry.image)}
          alt={entry.imageAlt}
          width="30"
          height="30"
        />
      ) : (
        <span className="stack-functional-mark" aria-hidden="true">
          재생
        </span>
      )}
      <span className="stack-tech-copy">
        <strong>{technology?.name || entry.name}</strong>
        <span className="stack-tech-provider">
          {technology?.provider || entry.provider}
        </span>
        <span className="stack-tech-usage">{entry.usage}</span>
        {technology ? (
          <span className="stack-open-dialog">
            기술 정보 창 열기 <ActionIcon />
          </span>
        ) : (
          <span className="stack-tech-kind">{entry.kind}</span>
        )}
      </span>
    </Tag>
  );
}

const partId = (service, part) => `stack-part-${service}-${part}`;

export function ServiceStacks({ serviceId }) {
  const { state } = useApp();
  const service = findServiceStack(serviceId || state.stackService);
  return <StackContent key={service.id} service={service} />;
}

function StackContent({ service }) {
  const { followRoute } = useApp();
  const [group, setGroup] = useState("all");
  const [activePart, setActivePart] = useState(null);
  const visibleParts = service.parts.filter(
    (part) => group === "all" || part.group === group,
  );
  const revealPart = (event, id) => {
    if (
      event.button ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    flushSync(() => {
      setGroup("all");
      setActivePart(id);
    });
    const target = document.getElementById(partId(service.id, id));
    target.querySelector("details").open = true;
    target.querySelector("h3").focus({ preventScroll: true });
    target.scrollIntoView({ block: "start", behavior: scrollBehavior() });
    const url = new URL(location.href);
    url.hash = target.id;
    history.replaceState(history.state, "", url);
  };
  useLayoutEffect(() => {
    const part = service.parts.find(
      (item) => `#${partId(service.id, item.id)}` === location.hash,
    );
    if (part) {
      setActivePart(part.id);
      document
        .getElementById(partId(service.id, part.id))
        .querySelector("details").open = true;
    }
  }, [service]);
  const selectGroup = (value) => {
    setGroup(value);
    setActivePart(null);
    const url = new URL(location.href);
    url.hash = "";
    history.replaceState(history.state, "", url);
  };
  return (
    <section
      className="service-stacks"
      id="service-stacks"
      aria-labelledby="service-stacks-title"
    >
      <header className="stack-page-heading">
        <h1 id="service-stacks-title" tabIndex="-1">
          서비스 스택
        </h1>
        <p>
          어떤 파트를, 어떤 기술로, 어떻게 구성했을까요? 서비스의 기술을
          역할별로 펼쳐 봅니다.
        </p>
      </header>

      <nav
        className="stack-service-selector"
        aria-label="기술 구성을 볼 서비스"
      >
        {serviceStacks.map((item) => (
          <a
            key={item.id}
            href={`?view=stacks&service=${item.id}`}
            data-stack-service={item.id}
            aria-current={service.id === item.id ? "page" : undefined}
            onClick={(event) =>
              followRoute(event, "stacks", { service: item.id })
            }
          >
            <span className="stack-service-name">
              <strong>{item.name}</strong>
              <span>{item.subtitle}</span>
            </span>
            <span className="stack-service-preview" aria-hidden="true">
              {item.parts
                .flatMap((part) => part.technologies)
                .filter((entry) => entry.id)
                .slice(0, 3)
                .map((entry) => (
                  <TechnologyMark
                    key={entry.id}
                    technology={findTechnology(entry.id)}
                    compact
                  />
                ))}
            </span>
            <span className="stack-service-choice">
              {service.id === item.id ? "선택됨" : "구성 보기 →"}
            </span>
          </a>
        ))}
      </nav>

      <div className="stack-overview" data-stack-overview={service.id}>
        <header className="stack-service-heading">
          <div>
            <span className="stack-scope">{service.scope}</span>
            <h2>{service.name}의 기술 구성</h2>
            <p>{service.description}</p>
          </div>
          <a
            className="stack-design-link"
            href={`?case=${service.id}`}
            onClick={(event) => followRoute(event, service.id)}
          >
            흐름과 대안 자세히 보기 <ActionIcon kind="arrow" />
          </a>
        </header>

        <section className="stack-quick-map" aria-labelledby="stack-map-title">
          <div className="stack-subheading">
            <h3 id="stack-map-title">한눈에 보는 구성</h3>
            <span>
              {service.basis} · 파트를 누르면 아래 설명으로 이동합니다.
            </span>
          </div>
          <ul>
            {service.parts.map((part) => (
              <li key={part.id}>
                <a
                  href={`#${partId(service.id, part.id)}`}
                  onClick={(event) => revealPart(event, part.id)}
                >
                  <span className="stack-map-part">
                    <strong>{part.title}</strong>
                    <span>
                      {service.groups.find(([id]) => id === part.group)[1]}
                    </span>
                  </span>
                  <span className="stack-map-technologies">
                    {part.technologies.length ? (
                      part.technologies.map((entry) => (
                        <span key={entry.id || entry.name}>
                          {entry.id ? (
                            <TechnologyMark
                              technology={findTechnology(entry.id)}
                              compact
                            />
                          ) : entry.image ? (
                            <img
                              src={assetURL(entry.image)}
                              alt=""
                              width="26"
                              height="26"
                            />
                          ) : null}
                          {entry.id
                            ? findTechnology(entry.id).name
                            : entry.name}
                        </span>
                      ))
                    ) : (
                      <span className="stack-map-unknown">제품 미확인</span>
                    )}
                  </span>
                  <span className="stack-map-jump">파트 설명으로 이동 ↓</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="stack-evidence">
          <strong>{service.basis}</strong>
          <p>{service.evidence}</p>
          <a href="#stack-sources">자료와 확인 범위 ↓</a>
        </div>

        <section className="stack-paths" aria-labelledby="stack-paths-title">
          <div className="stack-subheading">
            <h3 id="stack-paths-title">파트가 연결되는 방식</h3>
            <span>각 단계를 누르면 해당 파트 설명으로 이동합니다.</span>
          </div>
          {service.paths.map((path) => (
            <div className="stack-path" key={path.label}>
              <h4>{path.label}</h4>
              <ol>
                {path.steps.map(([id, label], index) => (
                  <li key={`${id}-${index}`}>
                    <a
                      href={`#${partId(service.id, id)}`}
                      onClick={(event) => revealPart(event, id)}
                    >
                      <span className="stack-path-number">{index + 1}</span>
                      <span>
                        {label}
                        <small>
                          {service.parts.find((part) => part.id === id).title}로
                          이동 ↓
                        </small>
                      </span>
                    </a>
                    {index < path.steps.length - 1 && (
                      <span className="stack-path-arrow" aria-hidden="true">
                        →
                      </span>
                    )}
                  </li>
                ))}
              </ol>
              <p>{path.note}</p>
            </div>
          ))}
        </section>

        <section className="stack-parts" aria-labelledby="stack-parts-title">
          <div className="stack-subheading">
            <h3 id="stack-parts-title">파트별 사용 기술</h3>
            <span role="status">
              {visibleParts.length}개 파트 · 기술 버튼은 정보 창을 엽니다.
            </span>
          </div>
          <div
            className="stack-group-filter"
            role="group"
            aria-label="실행 영역으로 파트 좁히기"
          >
            {[["all", "전체"], ...service.groups].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={group === id}
                onClick={() => selectGroup(id)}
              >
                {label}{" "}
                <span>
                  {id === "all"
                    ? service.parts.length
                    : service.parts.filter((part) => part.group === id).length}
                </span>
              </button>
            ))}
          </div>
          <div className="stack-column-headings" aria-hidden="true">
            <span>담당 파트</span>
            <span>사용 기술 · 담당하는 일</span>
            <span>무엇을 어떻게 처리하나</span>
          </div>
          <ol className="stack-part-list">
            {visibleParts.map((part) => (
              <li key={part.id}>
                <article
                  className={`stack-part${activePart === part.id ? " is-highlighted" : ""}`}
                  id={partId(service.id, part.id)}
                  data-stack-part={part.id}
                >
                  <div className="stack-part-identity">
                    <span className="stack-part-area">
                      {service.groups.find(([id]) => id === part.group)[1]}
                    </span>
                    <h3 tabIndex="-1">{part.title}</h3>
                    <p>{part.role}</p>
                    <span className={`stack-evidence-badge is-${part.status}`}>
                      {part.evidence}
                    </span>
                  </div>
                  <div className="stack-part-technologies">
                    <span className="stack-mobile-label">
                      사용 기술 · 담당하는 일
                    </span>
                    {part.technologies.length ? (
                      part.technologies.map((entry) => (
                        <StackTechnology
                          key={entry.id || entry.name}
                          entry={entry}
                        />
                      ))
                    ) : (
                      <div className="stack-unknown-product">
                        <strong>제품 미확인</strong>
                        <span>확인된 자료에 제품명이 없습니다.</span>
                      </div>
                    )}
                  </div>
                  <div className="stack-part-usage">
                    <span className="stack-mobile-label">
                      무엇을 어떻게 처리하나
                    </span>
                    <p>
                      <Text>{part.summary}</Text>
                    </p>
                  </div>
                  <details className="stack-part-detail">
                    <summary>
                      <span className="stack-detail-open">
                        처리 과정과 확인 범위 펼치기
                      </span>
                      <span className="stack-detail-close">
                        처리 과정과 확인 범위 접기
                      </span>
                    </summary>
                    <div className="stack-detail-body">
                      <dl>
                        <div>
                          <dt>왜 이 역할이 필요한가</dt>
                          <dd>
                            <Text>{part.why}</Text>
                          </dd>
                        </div>
                        <div>
                          <dt>처리 방식과 핵심</dt>
                          <dd>
                            <Text>{part.detail}</Text>
                          </dd>
                        </div>
                        <div>
                          <dt>여기까지 확인했습니다</dt>
                          <dd>
                            <Text>{part.boundary}</Text>
                          </dd>
                        </div>
                        <div>
                          <dt>함께 읽을 파트</dt>
                          <dd className="stack-connected-parts">
                            {part.connects.map((id) => (
                              <a
                                key={id}
                                href={`#${partId(service.id, id)}`}
                                onClick={(event) => revealPart(event, id)}
                              >
                                {
                                  service.parts.find((item) => item.id === id)
                                    .title
                                }{" "}
                                ↓
                              </a>
                            ))}
                          </dd>
                        </div>
                      </dl>
                      <div className="stack-part-sources">
                        <strong>이 파트의 근거</strong>
                        {part.sources.map((index) => (
                          <a
                            key={index}
                            href={service.sources[index][1]}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {service.sources[index][0]}{" "}
                            <span className="stack-external-label">
                              ↗ 새 탭
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </details>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="stack-sources"
          id="stack-sources"
          aria-labelledby="stack-sources-title"
        >
          <h3 id="stack-sources-title">자료와 확인 범위</h3>
          <p>{service.exclusions}</p>
          <ul>
            {service.sources.map(([label, url, scope]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  {label} <span className="stack-external-label">↗ 새 탭</span>
                </a>
                <p>{scope}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
