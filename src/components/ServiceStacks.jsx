import { assetURL } from "../data/assets.js";
import {
  serviceStacks,
  findServiceStack,
  findStackLayer,
  partsInLayer,
  layerForPart,
  stackPartId,
  stackHref,
} from "../data/service-stacks.js";
import { findTechnology } from "../data/technology-catalogue.js";
import { useApp } from "../state/AppState.jsx";
import { TechnologyMark } from "./TechnologyMark.jsx";
import { ActionIcon } from "./ui.jsx";
import { Text } from "./Glossary.jsx";

function StackLink({ service, layer, hash, children, ...props }) {
  const { followRoute } = useApp();
  return (
    <a
      {...props}
      href={stackHref(service, layer, hash)}
      onClick={(event) =>
        followRoute(event, "stacks", { service, layer, hash })
      }
    >
      {children}
    </a>
  );
}

export function ServiceStackLink({ service, children }) {
  return (
    <StackLink service={service} className="service-stack-link">
      {children || "프론트엔드·서버 구성 보기"} <ActionIcon kind="arrow" />
    </StackLink>
  );
}

function PartLink({ service, part, children, ...props }) {
  return (
    <StackLink
      {...props}
      service={service.id}
      layer={layerForPart(service, part).id}
      hash={stackPartId(service.id, part.id)}
    >
      {children}
    </StackLink>
  );
}

function EntryMark({ entry }) {
  return entry.id ? (
    <TechnologyMark technology={findTechnology(entry.id)} compact />
  ) : entry.image ? (
    <img src={assetURL(entry.image)} alt="" width="26" height="26" />
  ) : null;
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
      ) : null}
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

function Evidence({ service }) {
  return (
    <div className="stack-evidence">
      <strong>{service.basis}</strong>
      <p>{service.evidence}</p>
      <a href="#stack-sources">자료와 확인 범위 ↓</a>
    </div>
  );
}

function Sources({ service, parts = service.parts }) {
  const indices = [...new Set(parts.flatMap((part) => part.sources))].sort();
  return (
    <section
      className="stack-sources"
      id="stack-sources"
      aria-labelledby="stack-sources-title"
    >
      <h2 id="stack-sources-title">자료와 확인 범위</h2>
      <p>{service.exclusions}</p>
      <ul>
        {indices.map((index) => {
          const [label, url, scope] = service.sources[index];
          return (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer">
                {label} <span className="stack-external-label">↗ 새 탭</span>
              </a>
              <p>{scope}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ServiceSelector({ service }) {
  return (
    <nav className="stack-service-selector" aria-label="기술 구성을 볼 서비스">
      {serviceStacks.map((item) => (
        <StackLink
          key={item.id}
          service={item.id}
          data-stack-service={item.id}
          aria-current={service.id === item.id ? "page" : undefined}
        >
          <span className="stack-service-name">
            <strong>{item.name}</strong>
            <span>{item.subtitle}</span>
          </span>
          <span className="stack-service-choice">
            {service.id === item.id ? "선택됨" : "구성 보기 →"}
          </span>
        </StackLink>
      ))}
    </nav>
  );
}

function StackPaths({ service }) {
  return (
    <section className="stack-paths" aria-labelledby="stack-paths-title">
      <div className="stack-subheading">
        <h2 id="stack-paths-title">영역을 오가는 처리 흐름</h2>
        <span>단계를 누르면 담당 영역의 상세 페이지로 이동합니다.</span>
      </div>
      {service.paths.map((path) => (
        <div className="stack-path" key={path.label}>
          <h3>{path.label}</h3>
          <ol>
            {path.steps.map(([id, label], index) => {
              const part = service.parts.find((item) => item.id === id);
              return (
                <li key={`${id}-${index}`}>
                  <PartLink service={service} part={part}>
                    <span className="stack-path-number">{index + 1}</span>
                    <span>
                      {label}
                      <small>{layerForPart(service, part).name} 상세 →</small>
                    </span>
                  </PartLink>
                  {index < path.steps.length - 1 && (
                    <span className="stack-path-arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <p>{path.note}</p>
        </div>
      ))}
    </section>
  );
}

function ServiceOverview({ service }) {
  const { followRoute } = useApp();
  return (
    <>
      <header className="stack-page-heading">
        <h1 id="service-stacks-title" tabIndex="-1">
          서비스 스택
        </h1>
        <p>
          프론트엔드와 서버, 데이터 저장을 나눠 보고 각 영역의 상세 구성으로
          들어갑니다.
        </p>
      </header>
      <ServiceSelector service={service} />
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
        <section
          className="stack-layer-overview"
          aria-labelledby="stack-layers-title"
        >
          <div className="stack-subheading">
            <h2 id="stack-layers-title">영역별 구성</h2>
            <span>{service.basis}</span>
          </div>
          <div className="stack-layer-cards">
            {service.layers.map((layer) => {
              const parts = partsInLayer(service, layer);
              return (
                <StackLink
                  className="stack-layer-card"
                  key={layer.id}
                  service={service.id}
                  layer={layer.id}
                  data-stack-layer-link={layer.id}
                  id={`stack-layer-card-${layer.id}`}
                >
                  <span className="stack-layer-card-heading">
                    <strong>{layer.name}</strong>
                    <span>{parts.length}개 파트</span>
                  </span>
                  <span className="stack-layer-location">{layer.location}</span>
                  <span className="stack-layer-card-action">
                    {layer.name} 상세 페이지로 이동 <ActionIcon kind="arrow" />
                  </span>
                  <p>{layer.summary}</p>
                  <ul className="stack-layer-preview">
                    {parts.map((part) => (
                      <li key={part.id}>
                        <strong>{part.title}</strong>
                        <span className="stack-preview-technologies">
                          {part.technologies.length ? (
                            part.technologies.map((entry) => (
                              <span key={entry.id || entry.name}>
                                <EntryMark entry={entry} />
                                {entry.id
                                  ? findTechnology(entry.id).name
                                  : entry.name}
                              </span>
                            ))
                          ) : (
                            <span className="stack-unknown-label">
                              제품 미확인
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <span className="stack-layer-card-note">{layer.note}</span>
                </StackLink>
              );
            })}
          </div>
        </section>
        <Evidence service={service} />
        <StackPaths service={service} />
        <Sources service={service} />
      </div>
    </>
  );
}

function PartDetail({ service, part }) {
  return (
    <article
      className="stack-part"
      id={stackPartId(service.id, part.id)}
      data-stack-part={part.id}
    >
      <header className="stack-part-heading">
        <div>
          <span className="stack-part-area">
            {service.groups.find(([id]) => id === part.group)[1]} · {part.role}
          </span>
          <h3 tabIndex="-1">{part.title}</h3>
        </div>
        <span className={`stack-evidence-badge is-${part.status}`}>
          {part.evidence}
        </span>
      </header>
      <p className="stack-part-summary">
        <Text>{part.summary}</Text>
      </p>
      <div className="stack-part-columns">
        <div className="stack-part-technologies">
          <h4>사용 기술과 담당하는 일</h4>
          {part.technologies.length ? (
            part.technologies.map((entry) => (
              <StackTechnology key={entry.id || entry.name} entry={entry} />
            ))
          ) : (
            <div className="stack-unknown-product">
              <strong>제품 미확인</strong>
              <span>확인된 자료에 제품명이 없습니다.</span>
            </div>
          )}
        </div>
        <dl className="stack-part-explanation">
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
        </dl>
      </div>
      <div className="stack-connected-parts">
        <strong>이어지는 파트</strong>
        {part.connects.map((id) => {
          const target = service.parts.find((item) => item.id === id);
          return (
            <PartLink key={id} service={service} part={target}>
              {layerForPart(service, target).name} · {target.title}{" "}
              <ActionIcon kind="arrow" />
            </PartLink>
          );
        })}
      </div>
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
            <span className="stack-external-label">↗ 새 탭</span>
          </a>
        ))}
      </div>
    </article>
  );
}

function LayerDetail({ service, layer }) {
  const parts = partsInLayer(service, layer);
  return (
    <>
      <nav className="stack-breadcrumb" aria-label="현재 위치">
        <StackLink service={service.id} data-stack-back>
          {service.name}의 전체 구성
        </StackLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{layer.name}</span>
      </nav>
      <header className="stack-page-heading stack-detail-heading">
        <div>
          <span className="stack-scope">{layer.location}</span>
          <h1 id="service-stacks-title" tabIndex="-1">
            {service.name} · {layer.name}
          </h1>
          <p>{layer.summary}</p>
          <span className="stack-detail-basis">{service.basis}</span>
        </div>
        <StackLink className="service-stack-link" service={service.id}>
          전체 구성으로 돌아가기 <ActionIcon kind="arrow" />
        </StackLink>
      </header>
      <div className="stack-layer-layout" data-stack-detail={layer.id}>
        <aside className="stack-layer-sidebar">
          <nav className="stack-layer-navigation" aria-label="상세 영역 선택">
            <h2>서비스 구성</h2>
            {service.layers.map((item) => (
              <StackLink
                key={item.id}
                service={service.id}
                layer={item.id}
                data-stack-detail-link={item.id}
                aria-current={layer.id === item.id ? "page" : undefined}
              >
                <span>{item.name}</span>
                <small>{partsInLayer(service, item).length}개 파트</small>
                <ActionIcon kind="arrow" />
              </StackLink>
            ))}
          </nav>
          <p>{layer.note}</p>
        </aside>
        <div className="stack-layer-content">
          <section
            className="stack-detail-parts"
            aria-labelledby="stack-parts-title"
          >
            <div className="stack-subheading">
              <h2 id="stack-parts-title">담당 파트와 기술</h2>
              <span>기술 버튼은 공용 정보 창을 엽니다.</span>
            </div>
            {parts.length > 1 && (
              <nav className="stack-part-index" aria-label="이 영역의 파트">
                {parts.map((part) => (
                  <PartLink key={part.id} service={service} part={part}>
                    {part.title} ↓
                  </PartLink>
                ))}
              </nav>
            )}
            <div className="stack-part-list">
              {parts.map((part) => (
                <PartDetail key={part.id} service={service} part={part} />
              ))}
            </div>
          </section>
          <Evidence service={service} />
          <Sources service={service} parts={parts} />
        </div>
      </div>
    </>
  );
}

export function ServiceStacks({ serviceId, layerId }) {
  const { state } = useApp();
  const service = findServiceStack(serviceId || state.stackService);
  const layer = findStackLayer(
    service,
    layerId === undefined ? state.stackLayer : layerId,
  );
  return (
    <section
      className="service-stacks"
      id="service-stacks"
      data-stack-layer={layer?.id || "overview"}
      aria-labelledby="service-stacks-title"
    >
      {layer ? (
        <LayerDetail service={service} layer={layer} />
      ) : (
        <ServiceOverview service={service} />
      )}
    </section>
  );
}
