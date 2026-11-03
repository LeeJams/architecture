import { assets } from "../data/assets.js";

export function TechnologyMark({
  technology: tech,
  id,
  compact = false,
  identity = false,
}) {
  const size = compact ? 26 : identity ? 64 : 48;
  if (!tech.image)
    return (
      <span
        id={id}
        className={`technology-api-mark${compact ? " is-compact" : ""}`}
        role={compact ? undefined : "img"}
        aria-hidden={compact || undefined}
        aria-label={
          compact ? undefined : `${tech.name} · 웹 표준 API 문자 표기`
        }
        style={{ "--mark-size": `${size}px` }}
      >
        <strong>{tech.mark}</strong>
        {!compact && <small>웹 API</small>}
      </span>
    );
  const picture = (
    <img
      id={id}
      src={assets[tech.image]}
      alt={compact ? "" : tech.logoAlt}
      className={identity ? "catalogue-product-image" : undefined}
      width={size}
      height={size}
    />
  );
  return tech.logoScope === "brand" && !compact ? (
    <span
      className="technology-brand-mark"
      style={{ "--mark-size": `${size}px` }}
    >
      {picture}
      <small>브랜드 심벌</small>
    </span>
  ) : (
    picture
  );
}
