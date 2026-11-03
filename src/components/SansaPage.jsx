import { useState } from "react";
import { assetURL } from "../data/assets.js";
import { findTechnology } from "../data/technology-catalogue.js";
import {
  sansaActions,
  sansaSources,
  relatedWebProjects,
} from "../data/interactive-services.js";
import { useApp } from "../state/AppState.jsx";
import { TechnologyCard } from "./TechnologyCatalogue.jsx";
import { TechnologyMark } from "./TechnologyMark.jsx";
import { Text } from "./Glossary.jsx";
import { ActionIcon, Reveal, useRovingTabs } from "./ui.jsx";
import { PresenceLab } from "./PresenceLab.jsx";

export function TechnologyInfoButton({ id, children }) {
  const { patch } = useApp(),
    technology = findTechnology(id);
  return (
    <button
      className="sansa-technology-button action-dialog"
      data-sansa-info={id}
      aria-haspopup="dialog"
      onClick={() =>
        patch({ sheet: { kind: "catalogue", key: id }, playing: false })
      }
    >
      <TechnologyMark technology={technology} compact />
      <span>
        <strong>{technology.name}</strong>
        {children && <span>{children}</span>}
      </span>
      <ActionIcon />
    </button>
  );
}

export function SansaPage() {
  const { followRoute } = useApp();
  const [actionId, setActionId] = useState("move"),
    [step, setStep] = useState(0),
    [panel, setPanel] = useState("role");
  const action = sansaActions.find((item) => item.id === actionId);
  const tabs = useRovingTabs(["role", "stack"], panel, setPanel);
  const selectAction = (id) => {
    setActionId(id);
    setStep(0);
  };
  return (
    <section
      className="sansa-page"
      id="sansa-design"
      aria-labelledby="sansa-title"
    >
      <div className="detail-transition-surface" aria-hidden="true" />
      <a
        className="back-to-library"
        data-home
        href="?"
        onClick={(event) => followRoute(event, "library")}
      >
        <ActionIcon kind="arrow" />
        서비스 목록
      </a>
      <div className="intro">
        <div className="detail-intro-copy">
          <div className="eyebrow">산사 · 3D 공간과 실시간 상태</div>
          <h1 id="sansa-title" tabIndex="-1">
            같은 방에서 움직임이 공유되는 방식
          </h1>
          <p>
            방에 들어가고, 움직이고, 다른 방문자를 보는 과정을 따라갑니다.
            <br />
            화면을 그리는 기술과 상태를 주고받는 기술을 연결해 읽습니다.
          </p>
        </div>
        <div className="detail-cover">
          <img
            src={assetURL("assets/sansa-study.svg")}
            alt="브라우저의 위치가 방 연결을 통해 다른 화면으로 전달되는 설명용 도식"
            width="880"
            height="480"
          />
        </div>
      </div>
      <div className="sansa-evidence-note">
        <strong>간접 자료 · 2026.11.03 확인</strong>
        <p>
          공개 파생 저장소의 산사 클라이언트 보관본을 읽었습니다. 원본 현재
          배포와 직접 대조하지 못했습니다. 아래 흐름은 이 보관본의 클라이언트
          처리이며, 실험·대안과 공개 비교 구현은 별도로 표시합니다.
        </p>
        <a href="#sansa-sources">확인한 자료와 범위 ↓</a>
      </div>
      <nav className="section-nav" aria-label="산사 설명 목차">
        <a href="#sansa-flow">01 행동과 흐름</a>
        <a href="#sansa-lab">02 동기화 실험</a>
        <a href="#sansa-technologies">03 구성 기술</a>
        <a href="#sansa-alternatives">04 대안과 공개 구현</a>
      </nav>
      <section
        id="sansa-flow"
        className="sansa-section"
        aria-labelledby="sansa-flow-title"
      >
        <div className="sansa-section-heading">
          <div>
            <p className="sheet-eyebrow">보관본의 클라이언트 흐름</p>
            <h2 id="sansa-flow-title">해보고 싶은 행동에서 시작하세요</h2>
          </div>
        </div>
        <div className="sansa-explorer">
          <nav className="sansa-actions" aria-label="살펴볼 행동">
            {sansaActions.map((item, index) => (
              <button
                key={item.id}
                data-sansa-action={item.id}
                aria-pressed={actionId === item.id}
                onClick={() => selectAction(item.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </nav>
          <div className="sansa-flow-reading">
            <Reveal identity={action.id}>
              <p className="sansa-flow-label">{action.label} · 간접 자료</p>
              <h3>{action.title}</h3>
              <Text>{action.summary}</Text>
              <ol className="sansa-flow-steps">
                {action.steps.map(([actor, title, description], index) => (
                  <li key={title}>
                    <button
                      data-sansa-step={index}
                      aria-pressed={step === index}
                      onClick={() => setStep(index)}
                    >
                      <span className="sansa-step-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <small>{actor}</small>
                        <strong>{title}</strong>
                      </span>
                      <span aria-hidden="true">→</span>
                    </button>
                    <p>{description}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
          <aside className="sansa-inspector" aria-label="선택한 단계 설명">
            <div
              className="sansa-inspector-tabs"
              role="tablist"
              aria-label="산사 단계 설명 관점"
              onKeyDown={tabs.onKeyDown}
            >
              {[
                ["role", "역할과 흐름"],
                ["stack", "구성 기술"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  ref={(element) => {
                    tabs.refs.current[id] = element;
                  }}
                  id={`sansa-tab-${id}`}
                  role="tab"
                  tabIndex={panel === id ? 0 : -1}
                  aria-selected={panel === id}
                  aria-controls={`sansa-panel-${id}`}
                  onClick={() => setPanel(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              id={`sansa-panel-${panel}`}
              aria-labelledby={`sansa-tab-${panel}`}
            >
              {panel === "role" ? (
                <Reveal identity={`${action.id}-${step}`}>
                  <p className="sheet-eyebrow">
                    선택 단계 {step + 1} · {action.steps[step][0]}
                  </p>
                  <h3>{action.steps[step][1]}</h3>
                  <Text>{action.steps[step][2]}</Text>
                  <h4>이 처리가 필요한 이유</h4>
                  <Text>{action.why}</Text>
                  <dl className="sansa-stage-facts">
                    {action.facts.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="sansa-keypoint">
                    <strong>{action.point[0]}</strong>
                    <Text>{action.point[1]}</Text>
                  </div>
                  <button
                    className="quiet-button"
                    onClick={() => {
                      setPanel("stack");
                      tabs.refs.current.stack?.focus({ preventScroll: true });
                    }}
                  >
                    이 흐름의 구성 기술 보기 →
                  </button>
                </Reveal>
              ) : (
                <div>
                  <p>
                    버튼을 누르면 기술 자체의 정의·필요한 이유·예제를 같은
                    화면의 설명 창에서 읽습니다.
                  </p>
                  <div className="sansa-technology-buttons">
                    {action.techs.map(([id, usage]) => (
                      <TechnologyInfoButton key={id} id={id}>
                        {usage}
                      </TechnologyInfoButton>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
      <div id="sansa-lab">
        <PresenceLab />
      </div>
      <section
        className="sansa-section"
        id="sansa-technologies"
        aria-labelledby="sansa-technologies-title"
      >
        <div className="sansa-section-heading">
          <div>
            <p className="sheet-eyebrow">간접 자료의 구성 기술</p>
            <h2 id="sansa-technologies-title">
              화면·연결·소리·설정을 나누어 읽기
            </h2>
            <p>
              각 카드에는 보관본에서 읽은 역할을 표시했습니다. 자세한 창은
              제품·API 자체의 일반 설명입니다.
            </p>
          </div>
          <a
            href="?view=technologies"
            onClick={(event) => followRoute(event, "catalogue")}
          >
            전체 기술 목록 보기 →
          </a>
        </div>
        <div className="technology-catalogue-grid">
          {[
            ["threejs", "보관본의 3D 장면·카메라·캐릭터 표시를 구성합니다."],
            [
              "webgl",
              "보관본의 Three.js 렌더링 기반입니다. 저수준 GPU API와 장면 라이브러리를 구분합니다.",
            ],
            ["websocket", "보관본의 이동·방·좌석·복구 메시지를 전달합니다."],
            ["web-audio", "보관본의 환경음·효과음·필터·잔향을 연결합니다."],
            ["localstorage", "보관본의 이 장치 내 소리 등 설정을 유지합니다."],
            [
              "cloudflare-workers",
              "보관본의 외부 WebSocket 주소가 Workers 도메인입니다. 서버 내부 제품은 미확인입니다.",
            ],
          ].map(([id, usage]) => (
            <TechnologyCard key={id} technologyId={id} usage={usage} />
          ))}
        </div>
      </section>
      <section
        className="sansa-section"
        id="sansa-alternatives"
        aria-labelledby="sansa-alternatives-title"
      >
        <div className="sansa-section-heading">
          <div>
            <p className="sheet-eyebrow">역할별 대안 · 일반 구현 예시</p>
            <h2 id="sansa-alternatives-title">
              무엇을 어떤 기술로 바꿀 수 있을까요?
            </h2>
            <p>
              같은 경험을 구성하는 선택입니다. 산사가 실제로 사용하거나 전환한
              기술로 표시하지 않습니다.
            </p>
          </div>
        </div>
        <div className="sansa-alternative-grid">
          <article>
            <h3>3D 장면 구성</h3>
            <p className="sansa-replacement-name">Three.js → Babylon.js</p>
            <Text>
              Babylon.js 프로젝트의 엔진·장면·도구로 같은 역할을 구성할 수
              있습니다. 입력·좌표·재질·로더·자원 정리 API를 다시 연결하고 실제
              모델과 기기에서 비교합니다.
            </Text>
            <TechnologyInfoButton id="babylonjs">
              장면 계층을 바꿀 때의 조건과 예제
            </TechnologyInfoButton>
          </article>
          <article>
            <h3>방의 상태·메시지 전달</h3>
            <p className="sansa-replacement-name">
              자체 WebSocket 전달 → 관리형 Realtime
            </p>
            <Text>
              Supabase Realtime의 Presence/Broadcast 또는 Firebase Realtime
              Database의 값 구독으로 같은 방의 공유 경험을 구성할 수 있습니다.
              초기 상태·보관·권한·연결 해제·업무 수락의 설계는 제품별로
              달라집니다.
            </Text>
            <TechnologyInfoButton id="supabase-realtime">
              Supabase · 참여자 상태와 메시지
            </TechnologyInfoButton>
            <TechnologyInfoButton id="firebase-rtdb">
              Google Firebase · 공유 JSON과 변경 구독
            </TechnologyInfoButton>
          </article>
          <article>
            <h3>장치 내 설정에서 공유 자료로</h3>
            <p className="sansa-replacement-name">
              localStorage → 서버의 계정·공유 저장
            </p>
            <Text>
              여러 장치·사용자가 같은 자료를 읽고 바꾸어야 하면 저장 범위를
              넓혀야 합니다. Firebase 같은 DB에 자료를 옮기면서 ID·권한·동시
              변경·보관 수명을 새로 정합니다.
            </Text>
            <TechnologyInfoButton id="localstorage">
              브라우저 저장의 범위부터 확인
            </TechnologyInfoButton>
          </article>
        </div>
        <h3 className="sansa-project-heading">
          실제 코드를 읽을 수 있는 비교 프로젝트
        </h3>
        <p>
          최근 갱신된 관련 공개 구현입니다. 대중적 인기 순위나 운영 부하 검증
          자료로 제시하지 않습니다.
        </p>
        <div className="sansa-project-grid">
          {relatedWebProjects.map((project) => (
            <article key={project.id} data-related-web-project={project.id}>
              <p className="sheet-eyebrow">공개 구현 · {project.author}</p>
              <h3>{project.title}</h3>
              <Text>{project.description}</Text>
              <Text>{project.point}</Text>
              <div className="sansa-project-techs">
                {project.techs.map((id) => (
                  <TechnologyInfoButton key={id} id={id} />
                ))}
              </div>
              <a href={project.url} target="_blank" rel="noopener">
                확인한 코드·자료 보기 ↗
              </a>
            </article>
          ))}
        </div>
      </section>
      <section
        className="sansa-section"
        id="sansa-sources"
        aria-labelledby="sansa-sources-title"
      >
        <h2 id="sansa-sources-title">자료와 확인 범위</h2>
        <p>
          보관본은 원본 현재 배포와 대조되지 않은 간접 자료입니다. Supabase
          설정도 있지만 외부 WebSocket 주소가 비어 있을 때만 선택하는
          분기입니다. 현재 산사의 운영 DB·서버 내부 구성은 확인되지 않았습니다.
        </p>
        <ul className="sheet-sources">
          {sansaSources.map(([title, url, scope]) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener">
                {title} ↗
              </a>
              <p>{scope}</p>
            </li>
          ))}
        </ul>
        <p className="sheet-caption">
          표지와 흐름은 자체 설명 도식이며 산사 화면·모델·음원을 재사용한 것이
          아닙니다. 실험은 브라우저 내 학습 모형입니다.
        </p>
      </section>
    </section>
  );
}
