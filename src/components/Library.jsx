import { assetURL } from "../data/assets.js";
import { useApp } from "../state/AppState.jsx";

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
          서비스의 구조와 기술
        </h1>
        <p className="library-description">
          어떤 기술이 어디에서 동작하는지, 무엇으로 대체할 수 있는지 정리합니다.
        </p>
      </div>
      <div className="library-heading">
        <h2>살펴볼 서비스</h2>
        <span>1개</span>
      </div>
      <ul className="case-list" aria-label="서비스 목록">
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
                재생 정보는 클라우드에서, 영상은 가까운 서버에서 받습니다. Open Connect의 전달 구조와 서버에 쓰이는 기술을 살펴봅니다.
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
