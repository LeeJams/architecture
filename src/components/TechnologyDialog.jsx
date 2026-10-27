import { useEffect, useLayoutEffect, useRef } from "react";
import { assets } from "../data/assets.js";
import { technologyNotes } from "../data/technology-notes.js";
import { technologyPublishers } from "../data/publishers.js";
import {
  alternativeProducts,
  replacementSources,
} from "../data/alternatives.js";
import {
  alternativeCategoryFor,
  replacementLinkLabel,
  useApp,
} from "../state/AppState.jsx";
import {
  TechnicalDepth,
  DeliveryLab,
  ReplacementContract,
} from "./TechnicalDepth.jsx";
import {
  ReplacementPair,
  ReplacementScope,
  replacementTitle,
  replacementSentence,
} from "./Alternatives.jsx";
import { GlossarySwitch, GlossaryGuide, Text } from "./Glossary.jsx";
import { ActionIcon, Code, Reveal } from "./ui.jsx";

export function useNativeDialog(open, onClose, lock = false) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
    if (lock)
      document.documentElement.classList.toggle(
        "has-technology-dialog",
        Boolean(open),
      );
    return () => {
      if (lock)
        document.documentElement.classList.remove("has-technology-dialog");
    };
  }, [open, lock]);
  useEffect(() => {
    const element = ref.current;
    const closed = () => {
      if (!element.open) onClose();
    };
    element.addEventListener("close", closed);
    return () => element.removeEventListener("close", closed);
  }, [onClose]);
  const backdrop = (event) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      onClose();
  };
  return {
    ref,
    backdrop,
    cancel: (event) => {
      event.preventDefault();
      onClose();
    },
    close: onClose,
  };
}
export function SheetSteps({ steps }) {
  return (
    <ol className="sheet-steps">
      {steps.map(([title, text], index) => (
        <li key={index}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <Text as="strong">{title}</Text>
          <Text>{text || ""}</Text>
        </li>
      ))}
    </ol>
  );
}
export function TechnologyDialog() {
  const { state, closeSheet, readTech, showAlternatives } = useApp(),
    sheet = state.sheet;
  const { ref, backdrop, cancel, close } = useNativeDialog(
    Boolean(sheet),
    closeSheet,
    true,
  );
  const scroll = useRef(null);
  useLayoutEffect(() => {
    if (sheet) scroll.current.scrollTop = 0;
  }, [sheet]);
  const tech =
    sheet?.kind === "technology"
      ? technologyNotes.find((item) => item.key === sheet.key)
      : null;
  const product =
    sheet?.kind === "alternative"
      ? alternativeProducts.find((item) => item.id === sheet.key)
      : null;
  const source = product ? replacementSources[product.category] : null;
  const title = tech?.title || (product ? replacementTitle(product) : "");
  return (
    <dialog
      ref={ref}
      className="technology-dialog"
      id="technology-dialog"
      aria-labelledby="technology-sheet-title"
      onClick={backdrop}
      onCancel={cancel}
    >
      <header className="technology-sheet-header">
        <span className="micro-label">기술 상세</span>
        <div className="sheet-header-controls">
          <GlossarySwitch />
          <button
            id="close-technology"
            className="quiet-button"
            autoFocus
            onClick={close}
          >
            닫기 ×
          </button>
        </div>
      </header>
      <div
        ref={scroll}
        className="technology-sheet-scroll"
        id="technology-sheet-scroll"
      >
        <GlossaryGuide sheet />
        {sheet && (
          <Reveal
            identity={`${sheet.kind}-${sheet.key}`}
            className="technology-sheet-layout"
          >
            <aside className="technology-sheet-identity">
              <img
                id="technology-sheet-image"
                src={tech?.image || assets[product.image]}
                alt={`${title} 로고 또는 역할 아이콘`}
              />
              <p id="technology-sheet-publisher">
                {tech ? technologyPublishers[tech.key][0] : product.company}
              </p>
              <h2 id="technology-sheet-title">{title}</h2>
              <p id="technology-sheet-type">
                {tech
                  ? technologyPublishers[tech.key][1]
                  : `${product.organization} · ${product.type}`}
              </p>
              <Text id="technology-sheet-role">
                {tech?.intro || replacementSentence(product)}
              </Text>
            </aside>
            <div
              className="technology-sheet-reading"
              id="technology-sheet-content"
            >
              {tech ? (
                <TechnologyContent key={tech.key} tech={tech} />
              ) : (
                <AlternativeContent product={product} />
              )}
            </div>
          </Reveal>
        )}
      </div>
      <footer className="technology-sheet-footer" id="technology-sheet-footer">
        {tech ? (
          <>
            <button
              className="quiet-button action-jump"
              data-read-sheet={tech.key}
              onClick={() => readTech(tech.key)}
            >
              본문의 전체 설명으로 이동 <ActionIcon kind="down" />
            </button>
            <button
              className="quiet-button action-jump"
              data-show-alternatives={alternativeCategoryFor(tech.key)}
              onClick={() => showAlternatives(alternativeCategoryFor(tech.key))}
            >
              {replacementLinkLabel(tech.key)} <ActionIcon kind="down" />
            </button>
          </>
        ) : (
          product && (
            <>
              <button
                className="quiet-button"
                data-close-technology
                onClick={close}
              >
                {source.kind === "implementation" ? "구현 예시" : "대체 관계"}{" "}
                목록으로 돌아가기
              </button>
              <span className="sheet-footer-note">
                {source.kind === "implementation"
                  ? "현재 저장소 제품이 특정되지 않아 역할의 구현 예시로 구분합니다."
                  : "해당 역할을 다른 기술로 구성하는 선택이며 넷플릭스의 실제 전환 계획을 뜻하지 않습니다."}
              </span>
            </>
          )
        )}
      </footer>
    </dialog>
  );
}
function TechnologyContent({ tech }) {
  return (
    <>
      <TechnicalDepth tech={tech.key} />
      <section>
        <p className="sheet-eyebrow">아키텍처와 연결하기</p>
        <Text as="h3">{tech.question}</Text>
        <Text>{tech.problem}</Text>
        <SheetSteps
          steps={tech.steps.map(([, title, text]) => [title, text])}
        />
      </section>
      <section>
        <p className="sheet-eyebrow">구체적으로 읽기</p>
        <Text as="h3">{tech.example.title}</Text>
        <Text>{tech.example.text}</Text>
        {tech.example.code && (
          <Code label={tech.example.language}>{tech.example.code}</Code>
        )}
        <Text className="sheet-caption">{tech.example.caveat}</Text>
      </section>
      <DeliveryLab tech={tech.key} />
      <section>
        <h3>공식 문서와 근거</h3>
        <ul className="sheet-sources">
          {tech.sources.map(([title, url, scope]) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener">
                {title}
              </a>
              <p>{scope}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
function AlternativeContent({ product }) {
  const source = replacementSources[product.category];
  return (
    <>
      <section className="sheet-replacement">
        <p className="sheet-eyebrow">
          {source.kind === "implementation"
            ? "현재 제품 미지정 · 역할의 구현 예시"
            : "무엇을 어떤 기술로 대체하나요?"}
        </p>
        <h3>{replacementTitle(product)}</h3>
        <ReplacementPair product={product} />
        <Text>{replacementSentence(product)}</Text>
        <ReplacementScope product={product} />
      </section>
      <section>
        <p className="sheet-eyebrow">대체에 사용할 기술 설명</p>
        <h3>
          {product.name} · {product.type}
        </h3>
        <Text>{product.description}</Text>
        <div className="product-features">
          {product.features.map((feature) => (
            <span key={feature}>{feature}</span>
          ))}
        </div>
      </section>
      <section>
        <p className="sheet-eyebrow">동작 원리</p>
        <h3>요청과 데이터가 지나는 순서</h3>
        <SheetSteps steps={product.mechanism.map((text) => [text, ""])} />
        {product.details.map((text) => (
          <Text key={text}>{text}</Text>
        ))}
      </section>
      <ReplacementContract product={product.id} />
      <section className="sheet-fit">
        <h3>사용을 검토할 상황</h3>
        <Text>{product.fit}</Text>
      </section>
      <section>
        <h3>공식 제품·프로젝트 문서</h3>
        <ul className="sheet-sources">
          <li>
            <a href={product.docs} target="_blank" rel="noopener">
              {product.name} 공식 문서
            </a>
          </li>
          {product.source && (
            <li>
              <a href={product.source} target="_blank" rel="noopener">
                공식 프로젝트 저장소
              </a>
            </li>
          )}
        </ul>
      </section>
    </>
  );
}
