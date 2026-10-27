import { assets } from "../data/assets.js";
import { applianceLayers } from "../data/architecture.js";
import { useApp } from "../state/AppState.jsx";
import { ReadLink, Reveal } from "./ui.jsx";
import { Text } from "./Glossary.jsx";
export function Anatomy() {
  const { state, patch, selectNode, selectTech } = useApp(),
    layer = applianceLayers[state.layer];
  const labels = {
    storage: [
      "저장장치 · 미리 준비한 영상",
      "여러 화질의 파일을 보관하고 요청한 구간을 읽습니다.",
    ],
    nginx: [
      "NGINX · HTTP 요청과 파일 응답",
      "파일 경로·범위를 해석하고 상태·헤더·바이트를 응답합니다.",
    ],
    freebsd: [
      "FreeBSD · 스토리지와 네트워크 I/O",
      "파일 페이지·이벤트·소켓과 NIC의 동작을 받칩니다.",
    ],
  };
  return (
    <section
      className="article-section"
      id="anatomy"
      aria-labelledby="anatomy-title"
    >
      <div className="section-heading">
        <div>
          <div className="section-label">
            <b>02</b> 서버 내부
          </div>
          <h2 id="anatomy-title">OCA 서버 내부</h2>
          <p>계층을 선택하면 아래의 처리 과정이 바뀝니다.</p>
        </div>
        <p className="aside-note">
          물리 장비는 설명용 일러스트
          <br />
          소프트웨어 계층은 공개 설명 기준
        </p>
      </div>
      <div className="anatomy">
        <div className="anatomy-visual">
          <img
            src={assets.oca}
            alt="여러 드라이브와 네트워크 전송 기능을 갖춘 OCA를 설명하는 서버 그림"
          />
          <div className="anatomy-tags">
            {["freebsd", "nginx", "https"].map((key) => (
              <span key={key}>
                <img src={assets[key]} alt="" />
                {{ freebsd: "FreeBSD", nginx: "NGINX", https: "HTTP(S)" }[key]}
              </span>
            ))}
          </div>
          <p className="anatomy-meta">
            정확한 제품 외형·드라이브 수를 재현한 그림은 아닙니다.
          </p>
        </div>
        <div
          className="anatomy-layers"
          role="group"
          aria-label="서버 내부 계층 선택"
        >
          {Object.entries(labels).map(([key, [title, description]]) => (
            <button
              key={key}
              className="layer"
              data-anatomy-tech={key}
              aria-pressed={key === state.layer}
              onClick={() => {
                key === "storage"
                  ? selectNode("origin", { panel: "role", reveal: false })
                  : selectTech(key);
                patch({ layer: key });
              }}
            >
              <span className="layer-image">
                <img src={assets[key]} alt="" />
              </span>
              <span className="layer-copy">
                <strong>{title}</strong>
                <span>{description}</span>
              </span>
              <span className="layer-number">
                {key === state.layer ? "선택됨" : "선택"}
              </span>
            </button>
          ))}
        </div>
        <div className="appliance-detail">
          <div className="appliance-detail-heading">
            <div>
              <span className="micro-label">계층별 처리 과정</span>
              <h3 id="appliance-layer-title">{layer.title}</h3>
            </div>
            <ReadLink id="appliance-layer-read" tech={layer.read} />
          </div>
          <Reveal identity={state.layer}>
            <ol
              className="appliance-pipeline"
              id="appliance-layer-flow"
              aria-label="선택한 계층의 처리 순서"
            >
              {layer.steps.map(([icon, title, subtitle], index) => (
                <li key={index}>
                  <img src={assets[icon]} alt="" />
                  <div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{title}</strong>
                    <Text>{subtitle}</Text>
                  </div>
                </li>
              ))}
            </ol>
            <Text id="appliance-layer-description">{layer.description}</Text>
            <Text className="appliance-scope" id="appliance-layer-note">
              {layer.note}
            </Text>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
