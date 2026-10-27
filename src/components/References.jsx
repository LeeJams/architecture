import { useCallback } from "react";
import { references } from "../data/references.js";
import { useApp } from "../state/AppState.jsx";
import { useNativeDialog } from "./TechnologyDialog.jsx";
export function References() {
  const { patch } = useApp();
  return (
    <details className="reference-details" id="reference-details">
      <summary>
        도식화 참고 자료 <span>참고 이미지 3개</span>
      </summary>
      <div className="references visible" id="references">
        <div className="ref-intro">
          <div className="eyebrow">
            <span className="dot" />
            도식 참고 자료
          </div>
          <h2>참고한 도식</h2>
          <p>
            웹에서 확인한 실제 이미지를 모았습니다. 그림을 누르면 확대할 수
            있습니다.
            <br />
            Open Connect 구성도는 역할과 요청 경로를 설명하기 위해 별도로
            그렸습니다.
          </p>
        </div>
        <div className="ref-grid">
          {references.map((item, index) => (
            <article className="ref-card" key={item.image}>
              <div className="ref-title">
                <span className="ref-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{item.title}</h2>
                <span className="ref-by">{item.by}</span>
              </div>
              <div className="ref-image">
                <button
                  className="reference-zoom"
                  type="button"
                  aria-label={`이미지 확대: ${item.alt}`}
                  aria-haspopup="dialog"
                  onClick={() => patch({ zoom: item })}
                >
                  <img
                    loading="lazy"
                    className="zoomable"
                    src={item.image}
                    alt={item.alt}
                  />
                  <span className="zoom-label">이미지 확대</span>
                </button>
              </div>
              <div className="ref-copy">
                {item.copy.map((copy, i) => (
                  <p key={i}>
                    {copy.includes("\n") ? (
                      <>
                        <strong>{copy.split("\n")[0]}</strong>
                        <br />
                        {copy.split("\n").slice(1).join("\n")}
                      </>
                    ) : (
                      copy
                    )}
                  </p>
                ))}
              </div>
              <div className="ref-source">
                <span>{item.credit}</span>
                <a href={item.url} target="_blank" rel="noopener">
                  원문 보기
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="ref-foot">
          도식의 표현 방식을 참고한 자료입니다. 기술 설명의 근거는 위의 출처에서
          확인할 수 있습니다.
        </p>
      </div>
    </details>
  );
}
export function ZoomDialog() {
  const { state, patch } = useApp();
  const close = useCallback(() => patch({ zoom: null }), [patch]);
  const { ref, backdrop, cancel } = useNativeDialog(Boolean(state.zoom), close);
  return (
    <dialog
      ref={ref}
      className="zoom-dialog"
      id="zoom-dialog"
      aria-label="참고 도식 확대"
      onClick={backdrop}
      onCancel={cancel}
    >
      <button id="close-zoom" onClick={close}>
        닫기 ×
      </button>
      <img
        id="zoom-image"
        src={state.zoom?.image || undefined}
        alt={state.zoom?.alt || ""}
      />
    </dialog>
  );
}
