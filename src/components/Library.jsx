import { assetURL } from "../data/assets.js";
import { useApp } from "../state/AppState.jsx";
import { ServiceStackLink } from "./ServiceStacks.jsx";

export function Library() {
  const { state, followRoute } = useApp();
  return (
    <section
      className="library"
      id="library"
      hidden={state.route !== "library"}
      aria-labelledby="library-title"
    >
      <div className="library-hero">
        <h1 id="library-title" tabIndex="-1">
          익숙한 서비스, 그 안의 기술
        </h1>
        <p className="library-description">
          화면 속 행동을 따라가며 기술이 필요한 이유와 처리 흐름, 대체할 수 있는
          기술을 살펴봅니다.
        </p>
        <div className="library-stack-entry">
          <ServiceStackLink service="sansa">
            서비스별 기술 구성 보기
          </ServiceStackLink>
        </div>
      </div>
      <div className="library-heading">
        <h2>살펴볼 서비스</h2>
        <span>2개</span>
      </div>
      <ul className="case-list" aria-label="서비스 목록">
        <li>
          <a
            aria-labelledby="sansa-card-title"
            className="case-card"
            data-open-case="sansa"
            onClick={(event) => followRoute(event, "sansa")}
            href="?case=sansa"
            id="sansa-card"
          >
            <div className="case-cover">
              <img
                src={assetURL("assets/sansa-study.svg")}
                alt="산사의 위치·행동 전달을 설명하는 자체 도식"
                width="880"
                height="480"
              />
            </div>
            <div className="case-card-copy">
              <div className="case-card-meta">
                <span className="company-name">산사</span>
                <span className="case-category">3D 공간 · 실시간 동기화</span>
              </div>
              <h2 className="case-card-title" id="sansa-card-title">
                같은 방에서 움직임이 공유되는 방식
              </h2>
              <p className="case-card-description">
                방에 들어가고 움직이고 다른 방문자를 보는 과정을 읽습니다.
                클라이언트 보관본과 공개 비교 구현을 바탕으로 설명합니다.
              </p>
              <div className="case-technologies" aria-label="주요 기술">
                <span>
                  <img src={assetURL("assets/tech/threejs.svg")} alt="" />
                  Three.js
                </span>
                <span>WebSocket</span>
                <span>Web Audio API</span>
              </div>
              <div className="case-card-bottom">
                <span>간접 자료 · 동기화 실험 · 공개 구현 비교</span>
                <span className="case-open">설계 페이지 보기 →</span>
              </div>
            </div>
          </a>
        </li>
        <li>
          <a
            aria-labelledby="netflix-card-title"
            className="case-card"
            data-open-case="netflix"
            onClick={(event) => followRoute(event, "netflix")}
            href="?case=netflix"
            id="netflix-card"
          >
            <div className="case-cover">
              <img
                alt="넷플릭스의 재생 제어와 영상 전달 경로"
                height="480"
                src={assetURL("assets/netflix-case.svg")}
                width="880"
              />
            </div>
            <div className="case-card-copy">
              <div className="case-card-meta">
                <span className="company-name">넷플릭스</span>
                <span className="case-category">영상 스트리밍 · CDN</span>
              </div>
              <h2 className="case-card-title" id="netflix-card-title">
                재생 버튼 뒤의 설계
              </h2>
              <p className="case-card-description">
                재생 정보는 클라우드에서, 영상은 가까운 서버에서 받습니다. Open
                Connect의 전달 구조와 서버에 쓰이는 기술을 살펴봅니다.
              </p>
              <div aria-label="주요 기술" className="case-technologies">
                <span>
                  <img alt="" src={assetURL("assets/tech/aws.svg")} />
                  AWS
                </span>
                <span>
                  <img alt="" src={assetURL("assets/tech/oca-icon.svg")} />
                  Open Connect
                </span>
                <span>
                  <img alt="" src={assetURL("assets/tech/freebsd.svg")} />
                  FreeBSD
                </span>
                <span>
                  <img alt="" src={assetURL("assets/tech/nginx-mark.svg")} />
                  NGINX
                </span>
              </div>
              <div className="case-card-bottom">
                <span>전달 구조 · 서버 내부 · 대체 기술</span>
                <span className="case-open">
                  {"설계 페이지 보기 "}
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M5 12H19M13 6L19 12L13 18"></path>
                  </svg>
                </span>
              </div>
            </div>
          </a>
        </li>
      </ul>
      <footer className="library-footer">
        <span>아키텍처 노트</span>
        <p>공개 기술 문서와 발표 자료를 바탕으로 정리합니다.</p>
      </footer>
    </section>
  );
}
