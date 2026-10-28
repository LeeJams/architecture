import { useLayoutEffect, useRef } from "react";
import { assets } from "../data/assets.js";
import { technologyPublishers } from "../data/publishers.js";
import { replacementSources } from "../data/alternatives.js";
import { replacementSentence } from "./Alternatives.jsx";
import { Text } from "./Glossary.jsx";

export function TechnologyIdentity({ info, tech, product, title }) {
  const disclosure = useRef(null);
  useLayoutEffect(() => {
    const media = matchMedia("(max-width: 760px)");
    const update = () => {
      if (
        media.matches &&
        disclosure.current.contains(document.activeElement)
      ) {
        disclosure.current
          .querySelector("summary")
          .focus({ preventScroll: true });
      }
      disclosure.current.open = !media.matches;
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const source = product && replacementSources[product.category];
  const sections = info
    ? [
        { title: "왜 쓰는 기술인가요?", text: info.rationale.short },
        { title: "대표적인 사용처", entries: info.useCases },
        {
          title: "도입 전에 기억할 점",
          entries: [
            [
              info.rationale.decisions[0].costTitle,
              info.rationale.decisions[0].cost,
            ],
          ],
        },
      ]
    : tech
      ? [
          { title: "이 역할이 필요한 이유", text: tech.problem },
          { title: "동작에서 중요한 부분", entries: [tech.mechanics[0]] },
          { title: "이 설명의 범위", text: tech.scope },
        ]
      : [
          {
            title:
              source.kind === "implementation"
                ? "구현할 위치"
                : "대체하는 위치",
            text: replacementSentence(product),
          },
          {
            title: "이 기술로 구성하는 방법",
            paragraphs: product.details.slice(0, 2),
          },
          { title: "어떤 경우에 살펴보나요?", text: product.fit },
        ];
  return (
    <aside className="technology-sheet-identity" data-technology-identity>
      <img
        id="technology-sheet-image"
        className={info ? "catalogue-product-image" : undefined}
        src={info ? assets[info.image] : tech?.image || assets[product.image]}
        alt={info?.logoAlt || `${title} 로고 또는 역할 아이콘`}
      />
      <p id="technology-sheet-publisher">
        {info
          ? info.provider
          : tech
            ? technologyPublishers[tech.key][0]
            : product.company}
      </p>
      <h2 id="technology-sheet-title" tabIndex="-1">
        {title}
      </h2>
      <p id="technology-sheet-type">
        {info
          ? info.type
          : tech
            ? technologyPublishers[tech.key][1]
            : `${product.organization} · ${product.type}`}
      </p>
      <div className="technology-identity-introduction">
        <h3>{tech ? "이 설계에서 맡는 일" : "어떤 기술인가요?"}</h3>
        <Text id="technology-sheet-role">
          {info?.definition || tech?.intro || product.description}
        </Text>
      </div>
      <details ref={disclosure} className="technology-identity-details">
        <summary>
          <span>
            {info
              ? "사용처와 필요한 이유"
              : tech
                ? "배경과 주요 동작"
                : "위치와 구성 방법"}
          </span>
          <span className="identity-disclosure-action" aria-hidden="true">
            <span className="identity-disclosure-expand">펼치기 +</span>
            <span className="identity-disclosure-collapse">접기 −</span>
          </span>
        </summary>
        <div>
          {sections.map((section) => (
            <section key={section.title}>
              <h3>{section.title}</h3>
              {section.text && <Text>{section.text}</Text>}
              {section.paragraphs?.map((text) => (
                <Text key={text}>{text}</Text>
              ))}
              {section.entries && (
                <dl>
                  {section.entries.map(([heading, text]) => (
                    <div key={heading}>
                      <dt>{heading}</dt>
                      <Text as="dd">{text}</Text>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          ))}
        </div>
      </details>
    </aside>
  );
}
