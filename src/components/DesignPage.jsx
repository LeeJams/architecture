import { assetURL } from "../data/assets.js";
import { useApp } from "../state/AppState.jsx";
import { Explorer } from "./Explorer.jsx";
import { Anatomy } from "./Anatomy.jsx";
import { TechnologyReader } from "./TechnologyReader.jsx";
import { Alternatives } from "./Alternatives.jsx";
import { References } from "./References.jsx";

export function DesignPage() {
  const { state, followRoute, showAlternatives } = useApp();
  return (
    <section
      className="design"
      id="design"
      hidden={state.route !== "netflix"}
      aria-labelledby="case-title"
    >
      <div className="detail-transition-surface" aria-hidden="true"></div>
      <a
        className="back-to-library"
        data-home=""
        onClick={(event) => followRoute(event, "library")}
        href="?"
        id="back-to-library"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M19 12H5M11 6L5 12L11 18"></path>
        </svg>
        서비스 목록
      </a>
      <div className="intro">
        <div className="detail-intro-copy">
          <div className="eyebrow">넷플릭스 · Open Connect</div>
          <h1 id="case-title" tabIndex="-1">
            넷플릭스, 재생 버튼 뒤의 설계
          </h1>
          <p>
            Open Connect의 영상 전달 경로와 서버 구성을 살펴봅니다.
            <br />
            각 기술의 동작 원리와 대체 기술을 확인할 수 있습니다.
          </p>
        </div>
        <div className="detail-cover">
          <img
            src={assetURL("assets/netflix-case.svg")}
            alt="Netflix Open Connect의 제어와 영상 전달 경로"
            width="880"
            height="480"
          />
        </div>
      </div>
      <nav className="section-nav" aria-label="목차">
        <a href="#architecture">01 전달 구조</a>
        <a href="#anatomy">02 서버 내부</a>
        <a href="#technologies">03 기술 설명</a>
        <a href="#alternatives">04 대체 기술</a>
        <a href="#sources">출처</a>
      </nav>
      <Explorer />
      <div className="takeaway">
        <p className="micro-label">설계의 핵심</p>
        <p>
          <strong>재생 제어와 영상 전송을 분리합니다.</strong>
          <br />
          제어 서비스는 재생 정보를, OCA는 영상 데이터를 전달합니다.
        </p>
        <button
          onClick={() => showAlternatives("delivery")}
          id="go-to-alternatives"
          className="action-jump"
        >
          {"대체 목록으로 이동 "}
          <span aria-hidden="true">↓</span>
        </button>
      </div>
      <Anatomy />
      <TechnologyReader />
      <Alternatives />
      <section className="article-section" id="sources">
        <div className="section-heading">
          <div>
            <div className="section-label">출처</div>
            <h2>자료와 설명 범위</h2>
            <p>설계와 기술 설명에 참고한 자료입니다.</p>
          </div>
        </div>
        <div className="source-notes">
          <div className="source-box">
            <h3>원문과 기술 설명</h3>
            <ul>
              <li>
                <a
                  href="https://openconnect.netflix.com/en/"
                  target="_blank"
                  rel="noopener"
                >
                  Netflix Open Connect
                </a>
                {" · 전달망과 OCA 개요"}
              </li>
              <li>
                <a
                  href="https://openconnect.netflix.com/en/appliances/"
                  target="_blank"
                  rel="noopener"
                >
                  Netflix Open Connect Appliances
                </a>
                {" · 장비와 소프트웨어 설명"}
              </li>
              <li>
                <a
                  href="https://docs.freebsd.org/en/books/handbook/introduction/"
                  target="_blank"
                  rel="noopener"
                >
                  FreeBSD 안내서
                </a>
                {" · 운영체제의 기능과 구조"}
              </li>
              <li>
                <a
                  href="https://nginx.org/en/docs/"
                  target="_blank"
                  rel="noopener"
                >
                  NGINX 공식 문서
                </a>
                {" · HTTP 서버와 파일 응답"}
              </li>
            </ul>
          </div>
          <div className="source-box">
            <h3>설명 범위</h3>
            <p>
              주문형 영상 전달을 설명하는 기능 단위 구성도입니다. 실제 내부 서비스 수, 물리 위치, 콘텐츠 배치의 계층과 모든 장애 대응 절차를 재현하지 않습니다. 장애 흐름은 다른 후보로 재시도하는 개념을 보여줍니다.
            </p>
            <p>
              공개 자료에 설명된 역할을 정리했습니다. 실제 배포 버전과 장비 사양은 자료의 시점에 따라 다를 수 있습니다. 상세한 확인 범위는 저장소의 출처 문서에 기록했습니다.
            </p>
          </div>
        </div>
      </section>
      <References />
      <footer className="page-footer">
        <span>
          아키텍처 노트 · 넷플릭스 Open Connect
          <br />
          공개 자료를 바탕으로 재구성한 설명용 도식입니다.
        </span>
        <span>
          기술 로고: Devicon · Simple Icons · AWS Icons for PlantUML
          <br />
          서버·플레이어·저장소 도식: 자체 제작
        </span>
      </footer>
    </section>
  );
}
