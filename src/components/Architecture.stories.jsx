import { useLayoutEffect } from "react";
import { Inspector } from "./Explorer.jsx";
import { TechnicalDepth } from "./TechnicalDepth.jsx";
import { ABRCalculator } from "./TechnologyReader.jsx";
import { ProductCard } from "./Alternatives.jsx";
import { GlossarySwitch } from "./Glossary.jsx";
import { alternativeProducts } from "../data/alternatives.js";
import { useApp } from "../state/AppState.jsx";

export default { title: "Architecture" };
const Frame = ({ children, width = 760 }) => (
  <div
    style={{
      maxWidth: width,
      margin: "24px auto",
      padding: 16,
      background: "#fff",
      border: "1px solid #d1d9e0",
      borderRadius: 8,
    }}
  >
    {children}
  </div>
);
export const RightPanel = ({ technology = "oca", panel = "role" }) => {
  const { patch } = useApp();
  useLayoutEffect(() => {
    patch({
      node: "oca",
      technology: technology === "oca" ? null : technology,
      panel,
      step: -1,
    });
  }, [technology, panel, patch]);
  return (
    <Frame width={410}>
      <div style={{ display: "flex", height: 920 }}>
        <Inspector />
      </div>
    </Frame>
  );
};
RightPanel.args = { technology: "oca", panel: "role" };
RightPanel.argTypes = {
  technology: {
    options: ["oca", "nginx", "freebsd", "https"],
    control: { type: "select" },
  },
  panel: { options: ["role", "stack"], control: { type: "select" } },
};
export const RequestConditions = () => (
  <Frame>
    <GlossarySwitch />
    <TechnicalDepth tech="https" />
  </Frame>
);
export const PlaybackTiming = () => (
  <Frame>
    <h2>다운로드와 재생 시간 비교</h2>
    <GlossarySwitch />
    <ABRCalculator />
  </Frame>
);
export const Replacement = ({ product = "caddy" }) => (
  <Frame width={510}>
    <ProductCard
      product={alternativeProducts.find((item) => item.id === product)}
    />
  </Frame>
);
Replacement.args = { product: "caddy" };
Replacement.argTypes = {
  product: {
    options: ["caddy", "apache", "cloudfront", "ubuntu", "gcp"],
    control: { type: "select" },
  },
};
