import { m, useReducedMotion } from "motion/react";
import { assets } from "../data/assets.js";
import {
  alternativeCategories,
  alternativeProducts,
  replacementSources,
} from "../data/alternatives.js";
import { scrollBehavior, useApp } from "../state/AppState.jsx";
import { ActionIcon, Reveal } from "./ui.jsx";
import { Text } from "./Glossary.jsx";

export const replacementTitle = (product) =>
  `${replacementSources[product.category].name} → ${product.name}`;
export const replacementSentence = (product) => {
  const source = replacementSources[product.category];
  return source.kind === "implementation"
    ? `현재 제품이 특정되지 않은 ${source.role}의 구현 예시: ${product.name}.`
    : `${source.name} → ${product.name}: ${source.role}을 대체합니다.`;
};
export function ReplacementPair({ product }) {
  const source = replacementSources[product.category];
  return (
    <div
      className="replacement-pair"
      role="group"
      aria-label={replacementTitle(product)}
    >
      <div className="replacement-from">
        <span>
          {source.kind === "implementation" ? "현재 설계의 역할" : "대체 대상"}
        </span>
        <img src={assets[source.image]} alt="" />
        <strong data-replacement-from-name>{source.name}</strong>
        <p className="replacement-company">{source.company}</p>
      </div>
      <span className="replacement-arrow" aria-hidden="true">
        →
      </span>
      <div className="replacement-to">
        <span>
          {source.kind === "implementation"
            ? "구현에 쓸 기술"
            : "이 기술로 대체"}
        </span>
        <img src={assets[product.image]} alt="" />
        <strong data-replacement-to-name>{product.name}</strong>
        <p className="product-company">{product.company}</p>
        <p className="product-type">{product.type}</p>
      </div>
    </div>
  );
}
export function ReplacementScope({ product }) {
  const source = replacementSources[product.category];
  return (
    <dl className="replacement-scope">
      {[
        [
          source.kind === "implementation" ? "구현할 위치" : "대체하는 위치",
          source.location,
        ],
        [
          source.kind === "implementation" ? "구현할 범위" : "대체할 범위",
          source.scope,
        ],
        ["함께 연결할 기존 역할", source.keep],
      ].map(([title, text]) => (
        <div key={title}>
          <dt>{title}</dt>
          <Text as="dd">{text}</Text>
        </div>
      ))}
    </dl>
  );
}
export function ProductCard({ product }) {
  const { patch } = useApp(),
    reduced = useReducedMotion(),
    source = replacementSources[product.category];
  return (
    <m.article
      className="product-card"
      data-replacement-kind={source.kind}
      data-replacement-source={product.category}
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <p className="replacement-card-label">
        {source.kind === "implementation"
          ? "현재 제품 미지정 · 구현 예시"
          : source.location + " 대체"}
      </p>
      <h3 className="replacement-title">{replacementTitle(product)}</h3>
      <ReplacementPair product={product} />
      <Text className="replacement-sentence">
        {replacementSentence(product)}
      </Text>
      <ReplacementScope product={product} />
      <Text className="product-description">{product.description}</Text>
      <div className="product-features">
        {product.features.map((feature) => (
          <span key={feature}>{feature}</span>
        ))}
      </div>
      <div className="product-fit">
        <strong>
          {source.kind === "implementation"
            ? "이 구현을 살펴볼 상황"
            : "이 대체 기술을 살펴볼 상황"}
        </strong>
        <Text>{product.fit}</Text>
      </div>
      <button
        className="product-open action-dialog"
        data-open-alternative={product.id}
        aria-haspopup="dialog"
        onClick={() =>
          patch({
            playing: false,
            zoom: null,
            sheet: { kind: "alternative", key: product.id },
          })
        }
      >
        <ActionIcon />{" "}
        {source.kind === "implementation"
          ? "제품 설명창 열기"
          : "구성·예제 설명창 열기"}
      </button>
    </m.article>
  );
}
export function Alternatives() {
  const { state, patch, selectTech } = useApp(),
    source = replacementSources[state.category];
  const products = alternativeProducts.filter(
    (item) =>
      item.category !== "storage" &&
      (state.category === "all" || item.category === state.category),
  );
  const locate = () => {
    selectTech(source.technology);
    document
      .getElementById("architecture")
      .scrollIntoView({ block: "start", behavior: scrollBehavior() });
    document
      .querySelector(`[data-node="${source.node}"]`)
      .focus({ preventScroll: true });
  };
  return (
    <section
      className="article-section"
      id="alternatives"
      aria-labelledby="alternatives-title"
    >
      <div className="section-heading">
        <div>
          <div className="section-label">
            <b>04</b> 대체 기술
          </div>
          <h2 id="alternatives-title" tabIndex="-1">
            무엇을 어떤 기술로 대체할까
          </h2>
          <p>
            현재 기술을 먼저 고르고, 그 역할을 대체할 기술을 확인하세요. 각
            카드에서 교체하는 부분과 기존 구성에 연결할 부분을 구분해
            설명합니다.
          </p>
        </div>
        <p className="aside-note">
          현재 기술 → 대체 기술
          <br />
          제공 회사 · 교체 범위 · 설정 예시
        </p>
      </div>
      <div className="alternative-toolbar">
        <div
          id="alternative-categories"
          role="group"
          aria-label="대체할 기술 선택"
        >
          {alternativeCategories.map(([key, title]) => (
            <button
              key={key}
              data-alternative-category={key}
              aria-pressed={key === state.category}
              onClick={() => patch({ category: key, storageOpen: false })}
            >
              {title}
            </button>
          ))}
        </div>
        <span id="alternative-count" role="status">
          {products.length}개 대체 관계
        </span>
      </div>
      <div
        className="replacement-context"
        id="replacement-context"
        aria-label="현재 설계에서 대체할 대상"
      >
        <Reveal identity={state.category}>
          {source ? (
            <>
              <div className="replacement-source">
                <img src={assets[source.image]} alt="" />
                <div>
                  <p className="micro-label">현재 설계에서 대체할 기술</p>
                  <h3>{source.name}</h3>
                  <p>
                    {source.company} · {source.location}
                  </p>
                </div>
                <button
                  className="quiet-button"
                  data-locate-replacement={state.category}
                  onClick={locate}
                >
                  현재 구성도에서 위치 보기 ↑
                </button>
              </div>
              <div className="replacement-context-description">
                <strong>무엇을 대체하나요?</strong>
                <Text>
                  {source.name}의 {source.role}을 다른 기술로 구현하는
                  선택입니다.
                </Text>
              </div>
            </>
          ) : (
            <div className="replacement-overview">
              <p className="micro-label">현재 기술 → 대체 기술</p>
              <h3>현재 기술별 대체 목록</h3>
              <p>
                각 카드에서 무엇을 바꾸는지, 어떤 기술로 바꾸는지, 어느 계층을
                대체하는지 확인하세요.
              </p>
            </div>
          )}
        </Reveal>
      </div>
      <div
        className="alternative-products"
        id="alternative-products"
        data-product-count={products.length}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <p className="alternative-scope">
        전달망·HTTP 서버·운영체제·클라우드는 각각의 역할 범위에서 대체를
        검토합니다. 구성과 연동을 다시 맞추는 선택이며 Netflix의 실제 교체
        계획을 뜻하지 않습니다.
      </p>
      <details
        className="storage-implementations"
        id="storage-implementations"
        open={state.storageOpen}
        onToggle={(event) => {
          if (event.currentTarget.open !== state.storageOpen)
            patch({ storageOpen: event.currentTarget.open });
        }}
      >
        <summary>원본 파일 저장 · 현재 제품 미지정 · 구현 예시 2개</summary>
        <div className="storage-implementation-content">
          <h3 id="storage-examples-title" tabIndex="-1">
            원본 파일을 저장할 제품
          </h3>
          <p>
            이 구성도에서는 현재 저장소 제품을 특정하지 않았습니다. 아래는 특정
            제품을 대체한다는 주장이 아닌, 원본 파일 보관 역할의 구현
            예시입니다.
          </p>
          <div className="alternative-products" id="storage-products">
            {alternativeProducts
              .filter((item) => item.category === "storage")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </details>
    </section>
  );
}
