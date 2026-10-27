import { assetURL } from "../data/assets.js";
import { playbackJourney } from "../data/architecture.js";
import { useApp } from "../state/AppState.jsx";
import { activate } from "./ui.jsx";
export function Diagram() {
  const { state, selectNode, selectTech } = useApp();
  const related =
    state.failover && state.step === 8
      ? ["player", "fallback"]
      : playbackJourney[state.step]?.nodes || [];
  const isDimmed = (flow, id) =>
    state.step >= 0 &&
    (!flow.split(" ").map(Number).includes(state.step) ||
      (state.failover && state.step === 8 && id === "segment-request"));
  return (
    <svg
      id="diagram"
      className={state.playing ? "diagram running" : "diagram"}
      viewBox="0 0 1080 760"
      role="group"
      aria-labelledby="diagram-title diagram-description"
    >
      <title id="diagram-title">
        Netflix Open Connect의 제어·영상 전송·사전 배치 경로
      </title>
      <desc id="diagram-description">
        플레이어가 클라우드에서 재생 정보와 OCA 후보를 받은 뒤, 영상 데이터를 OCA에서 직접 받습니다. 준비된 영상은 시청 전에 전송 거점으로 배치됩니다. 각 구성 요소를 선택하면 역할과 기술을 읽을 수 있습니다.
      </desc>
      <defs>
        <filter id="node-shadow" x="-10%" y="-15%" width="120%" height="145%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="4"
            floodColor="#1f2328"
            floodOpacity=".035"
          ></feDropShadow>
        </filter>
        <marker
          id="arrow-control"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7" fill="#0969da"></path>
        </marker>
        <marker
          id="arrow-video"
          markerWidth="5"
          markerHeight="5"
          refX="4.5"
          refY="2.5"
          orient="auto"
        >
          <path d="M0 0L5 2.5L0 5" fill="#cf222e"></path>
        </marker>
        <marker
          id="arrow-fill"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7" fill="#9a6700"></path>
        </marker>
        <marker
          id="arrow-telemetry"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6" fill="#8c959f"></path>
        </marker>
      </defs>
      <rect
        className="zone"
        x="330"
        y="35"
        width="700"
        height="192"
        rx="12"
      ></rect>
      <text className="zone-label" x="349" y="61">
        재생 제어
      </text>
      <image
        href={assetURL("assets/tech/aws.svg")}
        x="970"
        y="46"
        width="40"
        height="23"
        aria-label="AWS 로고"
      ></image>
      <rect
        className="zone edge"
        x="760"
        y="307"
        width="270"
        height="398"
        rx="12"
      ></rect>
      <text className="zone-label" x="782" y="333" style={{ fill: "#656d76" }}>
        영상 전달 · Open Connect
      </text>
      <text className="zone-sub" x="782" y="357">
        ISP 내부 · 피어링 거점
      </text>
      <g className={isDimmed("2", "") ? "dimmed" : ""} data-flow="2">
        <path
          className="flow control"
          d="M263 369H289Q300 369 300 357V157Q300 145 312 145H354"
        ></path>
        <rect
          className="label-background"
          x="273"
          y="283"
          width="96"
          height="21"
          rx="4"
        ></rect>
        <text className="flow-label" x="279" y="298">
          03 재생 요청
        </text>
      </g>
      <g className={isDimmed("3", "") ? "dimmed" : ""} data-flow="3">
        <path className="flow control" d="M609 146H708"></path>
        <text className="flow-label" x="619" y="132">
          04 후보 조회
        </text>
        <path
          className="flow telemetry"
          d="M973 370V263Q973 250 960 250H877Q865 250 865 237V203"
        ></path>
        <rect
          className="label-background"
          x="886"
          y="276"
          width="139"
          height="21"
          rx="4"
        ></rect>
        <text className="flow-help" x="896" y="290">
          보유 파일 · 경로 · 상태
        </text>
      </g>
      <g className={isDimmed("4", "") ? "dimmed" : ""} data-flow="4">
        <path
          className="flow control response"
          d="M389 203V258Q389 270 377 270H177Q165 270 165 282V330"
        ></path>
        <rect
          className="label-background"
          x="177"
          y="258"
          width="197"
          height="22"
          rx="4"
        ></rect>
        <text className="flow-label" x="188" y="274">
          05 재생 정보 · 후보 OCA
        </text>
      </g>
      <g
        className={isDimmed("5 8", "segment-request") ? "dimmed" : ""}
        data-flow="5 8"
        id="segment-request"
      >
        <path
          className="flow control"
          d="M263 392H292Q306 392 306 379V322Q306 309 319 309H761Q773 309 773 321V390H783"
        ></path>
        <rect
          className="label-background"
          x="422"
          y="297"
          width="228"
          height="22"
          rx="4"
        ></rect>
        <text className="flow-label" x="434" y="313">
          06 구간 요청 · GET / Range
        </text>
      </g>
      <g
        className={isDimmed("6", "normal-video") ? "dimmed" : ""}
        hidden={state.failover}
        data-flow="6"
        id="normal-video"
      >
        <path className="flow video" d="M783 425H264"></path>
        <rect
          className="label-background"
          x="368"
          y="390"
          width="254"
          height="25"
          rx="5"
        ></rect>
        <text className="flow-label video" x="382" y="408">
          07 영상·오디오 응답 / HTTP(S)
        </text>
        <text className="flow-help" x="377" y="452">
          영상 바이트는 재생 API를 경유하지 않습니다.
        </text>
      </g>
      <g
        className={isDimmed("8", "fallback-video") ? "dimmed" : ""}
        hidden={!state.failover}
        data-flow="8"
        id="fallback-video"
      >
        <path
          className="flow control"
          d="M263 503H317Q329 503 329 515V533Q329 545 341 545H759Q771 545 771 557V580H783"
        ></path>
        <rect
          className="label-background"
          x="419"
          y="532"
          width="208"
          height="22"
          rx="4"
        ></rect>
        <text className="flow-label" x="430" y="548">
          09 다른 후보로 파일 요청
        </text>
        <path className="flow video" d="M783 609H753V491H264"></path>
        <rect
          className="label-background"
          x="370"
          y="462"
          width="305"
          height="23"
          rx="4"
        ></rect>
        <text className="flow-label video" x="383" y="478">
          다른 후보 OCA로 요청을 재시도하는 개념
        </text>
      </g>
      <g className={isDimmed("1", "") ? "dimmed" : ""} data-flow="1">
        <path className="flow fill" d="M533 615H579"></path>
        <path className="flow fill" d="M745 615H766V490H783"></path>
        <rect
          className="label-background"
          x="362"
          y="696"
          width="360"
          height="24"
          rx="4"
        ></rect>
        <text className="flow-label fill" x="376" y="713">
          02 시청 전에 파일을 전달 거점에 배치합니다.
        </text>
      </g>
      <g
        className={`node ${state.node === "player" ? "selected" : ""} ${related.includes("player") ? "flow-related" : ""}`}
        aria-pressed={state.node === "player"}
        onClick={() => selectNode("player")}
        onKeyDown={(event) => activate(event, () => selectNode("player"))}
        data-node="player"
        role="button"
        tabIndex="0"
        aria-label="플레이어의 역할과 기술 보기"
      >
        <rect
          className="node-box"
          x="58"
          y="330"
          width="205"
          height="189"
          rx="10"
        ></rect>
        <image
          href={assetURL("assets/tech/player.svg")}
          x="80"
          y="348"
          width="61"
          height="61"
        ></image>
        <image
          data-brand="netflix"
          href={assetURL("assets/tech/netflix.svg")}
          x="221"
          y="349"
          width="17"
          height="26"
        ></image>
        <text className="node-title" x="80" y="437">
          시청 기기의 플레이어
        </text>
        <text className="node-sub" x="80" y="460">
          TV · 모바일 · 웹
        </text>
        <rect
          className="node-badge"
          x="80"
          y="478"
          width="130"
          height="23"
          rx="4"
        ></rect>
        <text className="node-tech" x="90" y="494">
          넷플릭스 플레이어
        </text>
      </g>
      <g
        className={`node ${state.node === "playback" ? "selected" : ""} ${related.includes("playback") ? "flow-related" : ""}`}
        aria-pressed={state.node === "playback"}
        onClick={() => selectNode("playback")}
        onKeyDown={(event) => activate(event, () => selectNode("playback"))}
        data-node="playback"
        role="button"
        tabIndex="0"
        aria-label="클라우드 재생 서비스의 역할과 기술 보기"
      >
        <rect
          className="node-box"
          x="354"
          y="85"
          width="255"
          height="118"
          rx="9"
        ></rect>
        <image
          href={assetURL("assets/tech/aws.svg")}
          x="373"
          y="101"
          width="46"
          height="32"
        ></image>
        <text className="node-title" x="373" y="158">
          클라우드 재생 서비스
        </text>
        <text className="node-sub" x="373" y="181">
          재생 정보 요청과 응답 · AWS
        </text>
      </g>
      <g
        className={`node ${state.node === "steering" ? "selected" : ""} ${related.includes("steering") ? "flow-related" : ""}`}
        aria-pressed={state.node === "steering"}
        onClick={() => selectNode("steering")}
        onKeyDown={(event) => activate(event, () => selectNode("steering"))}
        data-node="steering"
        role="button"
        tabIndex="0"
        aria-label="OCA 선택과 제어 기술 보기"
      >
        <rect
          className="node-box"
          x="708"
          y="85"
          width="297"
          height="118"
          rx="9"
        ></rect>
        <image
          href={assetURL("assets/tech/routing.svg")}
          x="722"
          y="97"
          width="40"
          height="40"
        ></image>
        <text className="node-title" x="727" y="158">
          전송 서버 선택 · 제어
        </text>
        <text className="node-sub" x="727" y="181">
          콘텐츠 보유 여부 + 네트워크 조건
        </text>
      </g>
      <g
        className={`node ${state.node === "oca" ? "selected" : ""} ${related.includes("oca") ? "flow-related" : ""}`}
        aria-pressed={state.node === "oca"}
        onClick={() => selectNode("oca")}
        onKeyDown={(event) => activate(event, () => selectNode("oca"))}
        data-node="oca"
        role="button"
        tabIndex="0"
        aria-label="OCA 서버와 FreeBSD, NGINX 기술 보기"
      >
        <rect
          className="selection-halo"
          x="783"
          y="370"
          width="225"
          height="143"
          rx="10"
        ></rect>
        <rect
          className="node-box"
          x="783"
          y="370"
          width="225"
          height="143"
          rx="10"
        ></rect>
        <image
          href={assetURL("assets/tech/oca-appliance.svg")}
          x="798"
          y="374"
          width="91"
          height="47"
        ></image>
        <text className="node-tech" x="901" y="403" id="oca-health-label">
          {state.failover ? "응답 실패" : "OCA"}
        </text>
        <circle
          id="oca-status"
          cx="985"
          cy="391"
          r="3.5"
          fill={state.failover ? "#d16d59" : "#74a17c"}
        ></circle>
        <text
          className="node-title"
          x="801"
          y="440"
          style={{ fontSize: "15px" }}
        >
          Open Connect Appliance
        </text>
        <text className="node-sub" x="801" y="461">
          영상 파일을 보관하고 직접 전달
        </text>
        <image
          data-brand="freebsd"
          href={assetURL("assets/tech/freebsd.svg")}
          x="801"
          y="479"
          width="17"
          height="17"
        ></image>
        <text className="node-tech" x="824" y="492">
          FreeBSD
        </text>
        <image
          data-brand="nginx"
          href={assetURL("assets/tech/nginx-mark.svg")}
          x="905"
          y="479"
          width="17"
          height="17"
        ></image>
        <text className="node-tech" x="928" y="492">
          NGINX
        </text>
      </g>
      <g
        className={`node ${state.node === "origin" ? "selected" : ""} ${related.includes("origin") ? "flow-related" : ""}`}
        aria-pressed={state.node === "origin"}
        onClick={() => selectNode("origin")}
        onKeyDown={(event) => activate(event, () => selectNode("origin"))}
        data-node="origin"
        role="button"
        tabIndex="0"
        aria-label="인코딩된 콘텐츠 저장소의 역할 보기"
      >
        <rect
          className="node-box"
          x="335"
          y="557"
          width="198"
          height="115"
          rx="9"
        ></rect>
        <image
          href={assetURL("assets/tech/storage.svg")}
          x="351"
          y="570"
          width="36"
          height="36"
        ></image>
        <text
          className="node-title"
          x="351"
          y="630"
          style={{ fontSize: "15px" }}
        >
          인코딩된 영상 원본
        </text>
        <text className="node-sub" x="351" y="651">
          여러 화질 · 영상과 오디오
        </text>
      </g>
      <g
        className={`node ${state.node === "fill" ? "selected" : ""} ${related.includes("fill") ? "flow-related" : ""}`}
        aria-pressed={state.node === "fill"}
        onClick={() => selectNode("fill")}
        onKeyDown={(event) => activate(event, () => selectNode("fill"))}
        data-node="fill"
        role="button"
        tabIndex="0"
        aria-label="콘텐츠 사전 배치의 역할 보기"
      >
        <rect
          className="node-box"
          x="579"
          y="557"
          width="166"
          height="115"
          rx="9"
        ></rect>
        <image
          href={assetURL("assets/tech/fill.svg")}
          x="592"
          y="570"
          width="39"
          height="39"
        ></image>
        <text
          className="node-title"
          x="598"
          y="630"
          style={{ fontSize: "15px" }}
        >
          콘텐츠 배치
        </text>
        <text className="node-sub" x="598" y="651">
          시청 전 파일 준비
        </text>
      </g>
      <g
        className={`node ${state.node === "fallback" ? "selected" : ""} ${related.includes("fallback") ? "flow-related" : ""}`}
        aria-pressed={state.node === "fallback"}
        onClick={() => selectNode("fallback")}
        onKeyDown={(event) => activate(event, () => selectNode("fallback"))}
        data-node="fallback"
        role="button"
        tabIndex="0"
        aria-label="다른 OCA 후보와 장애 대응 설명 보기"
      >
        <rect
          className="node-box"
          x="783"
          y="558"
          width="225"
          height="114"
          rx="9"
          style={{ fill: "#fdfaf7", strokeDasharray: "4 3" }}
        ></rect>
        <image
          href={assetURL("assets/tech/oca-appliance.svg")}
          x="797"
          y="568"
          width="68"
          height="35"
        ></image>
        <text
          className="node-title"
          x="801"
          y="627"
          style={{ fontSize: "15px" }}
        >
          다른 전송 거점의 OCA
        </text>
        <text className="node-sub" x="801" y="651">
          사용 가능한 다른 후보 서버
        </text>
      </g>
      <g
        aria-pressed={state.technology === "freebsd"}
        onClick={() => selectTech("freebsd")}
        onKeyDown={(event) => activate(event, () => selectTech("freebsd"))}
        className="diagram-tech-hit"
        data-diagram-tech="freebsd"
        role="button"
        tabIndex="0"
        aria-label="OCA 안의 FreeBSD 설명을 오른쪽 패널에 표시"
      >
        <title>FreeBSD의 역할·내부 동작·Linux와의 비교</title>
        <rect x="796" y="475" width="98" height="25" rx="4"></rect>
      </g>
      <g
        aria-pressed={state.technology === "nginx"}
        onClick={() => selectTech("nginx")}
        onKeyDown={(event) => activate(event, () => selectTech("nginx"))}
        className="diagram-tech-hit"
        data-diagram-tech="nginx"
        role="button"
        tabIndex="0"
        aria-label="OCA 안의 NGINX 설명을 오른쪽 패널에 표시"
      >
        <title>NGINX의 역할·파일 응답·Caddy와의 비교</title>
        <rect x="900" y="475" width="94" height="25" rx="4"></rect>
      </g>
      <text className="flow-help" x="60" y="743">
        내부 서비스를 기능별로 묶은 설명용 구성도입니다. 배치 체계와 서버 수는 단순화했습니다.
      </text>
    </svg>
  );
}
