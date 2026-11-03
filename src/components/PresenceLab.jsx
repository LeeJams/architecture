import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";

const places = ["왼쪽", "가운데", "오른쪽"];
export function PresenceLab() {
  const reduced = useReducedMotion();
  const [local, setLocal] = useState(1),
    [remote, setRemote] = useState(1);
  const [period, setPeriod] = useState(500),
    [latency, setLatency] = useState(200);
  const [phase, setPhase] = useState("ready"),
    [sent, setSent] = useState(0),
    [received, setReceived] = useState(0);
  const [smooth, setSmooth] = useState(true),
    [last, setLast] = useState(null);
  const [status, setStatus] = useState(
    "방의 초기 상태를 받았습니다. 이동 지점을 골라보세요.",
  );
  const model = useRef({
    period: 500,
    latency: 200,
    phase: "ready",
    local: 1,
    server: 1,
    pending: null,
    scheduled: null,
    timers: new Set(),
    generation: 0,
    lastSent: -Infinity,
    deliveryAt: 0,
    sequence: 0,
  });
  const clear = () => {
    const state = model.current;
    state.generation++;
    for (const timer of state.timers) clearTimeout(timer);
    state.timers.clear();
    state.scheduled = null;
    state.pending = null;
    state.deliveryAt = 0;
  };
  useEffect(() => () => clear(), []);
  const later = (callback, delay) => {
    const state = model.current,
      generation = state.generation;
    const timer = setTimeout(() => {
      state.timers.delete(timer);
      if (state.generation === generation) callback();
    }, delay);
    state.timers.add(timer);
    return timer;
  };
  const schedule = () => {
    const state = model.current;
    if (
      state.phase !== "ready" ||
      state.pending === null ||
      state.scheduled !== null
    )
      return;
    const wait = Math.max(
      0,
      state.period - (performance.now() - state.lastSent),
    );
    state.scheduled = later(() => {
      state.scheduled = null;
      const position = state.pending;
      if (position === null || state.phase !== "ready") return;
      state.pending = null;
      state.lastSent = performance.now();
      const sequence = ++state.sequence;
      setSent((value) => value + 1);
      setLast({ sequence, position: places[position] });
      setStatus("이동을 보냈습니다. 다른 화면에 전달되는 중입니다.");
      state.deliveryAt = Math.max(
        performance.now() + state.latency,
        state.deliveryAt + 1,
      );
      later(
        () => {
          state.server = position;
          setRemote(position);
          setReceived((value) => value + 1);
          setStatus(
            state.pending === null && state.timers.size === 0
              ? "보낸 위치를 다른 화면에 적용했습니다."
              : "위치를 적용했습니다. 남은 이동이 대기 중입니다.",
          );
        },
        Math.max(0, state.deliveryAt - performance.now()),
      );
    }, wait);
  };
  const move = (position) => {
    const state = model.current;
    if (state.phase !== "ready") return;
    state.local = position;
    state.pending = position;
    setLocal(position);
    setStatus("내 화면을 먼저 갱신했습니다. 전송할 최신 위치를 모읍니다.");
    schedule();
  };
  const connect = () => {
    const state = model.current;
    clear();
    if (state.phase === "ready") {
      state.phase = "offline";
      setPhase("offline");
      setStatus(
        "연결 끊김을 가정합니다. 미전달 이동을 취소하고 이전 방 상태를 표시합니다.",
      );
    } else if (state.phase === "offline") {
      state.phase = "syncing";
      setPhase("syncing");
      setStatus("다시 연결한 뒤, 방이 마지막으로 반영한 전체 상태를 받습니다.");
      later(() => {
        state.local = state.server;
        state.lastSent = -Infinity;
        state.phase = "ready";
        setLocal(state.server);
        setRemote(state.server);
        setPhase("ready");
        setStatus(
          "전체 상태로 맞췄습니다. 전달되지 않은 이동은 수락된 것으로 취급하지 않습니다.",
        );
      }, state.latency);
    }
  };
  const reset = () => {
    clear();
    Object.assign(model.current, {
      phase: "ready",
      local: 1,
      server: 1,
      lastSent: -Infinity,
      sequence: 0,
    });
    setLocal(1);
    setRemote(1);
    setPhase("ready");
    setSent(0);
    setReceived(0);
    setLast(null);
    setStatus("초기 상태로 돌아왔습니다. 이동 지점을 골라보세요.");
  };
  return (
    <section
      className="presence-lab"
      aria-labelledby="presence-lab-title"
      data-presence-lab
    >
      <div className="sansa-section-heading">
        <div>
          <p className="sheet-eyebrow">설명용 동기화 실험</p>
          <h2 id="presence-lab-title">
            내 화면과 다른 화면의 시간이 달라지는 이유
          </h2>
        </div>
        <button className="quiet-button" onClick={reset}>
          실험 초기화
        </button>
      </div>
      <p>
        이동 지점을 빠르게 바꿔보세요. 내 화면은 바로 바뀌고, 전송 대기 중에는
        최신 위치를 모아 보냅니다. 이 실험은 브라우저 안의 모형이며 산사 서버에
        연결하지 않습니다.
      </p>
      <div className="presence-lab-controls">
        <label>
          이동 전송 간격
          <select
            aria-label="이동 전송 간격"
            value={period}
            onChange={(event) => {
              const next = Number(event.target.value);
              setPeriod(next);
              model.current.period = next;
              if (model.current.scheduled !== null) {
                clearTimeout(model.current.scheduled);
                model.current.timers.delete(model.current.scheduled);
                model.current.scheduled = null;
              }
              schedule();
            }}
          >
            {[100, 500, 1000].map((value) => (
              <option key={value} value={value}>
                {value}ms
              </option>
            ))}
          </select>
        </label>
        <label>
          전달 지연 가정
          <select
            aria-label="전달 지연 가정"
            value={latency}
            onChange={(event) => {
              const value = Number(event.target.value);
              setLatency(value);
              model.current.latency = value;
            }}
          >
            {[200, 800, 1500].map((value) => (
              <option key={value} value={value}>
                {value}ms
              </option>
            ))}
          </select>
        </label>
        <label className="presence-smooth">
          <input
            type="checkbox"
            checked={smooth}
            onChange={(event) => setSmooth(event.target.checked)}
          />
          수신한 위치까지 부드럽게 표시
        </label>
      </div>
      <div className="presence-rooms">
        {[
          ["내 화면", local, "local"],
          ["다른 방문자의 화면", remote, "remote"],
        ].map(([title, position, key]) => (
          <div key={key} className="presence-room">
            <h3>{title}</h3>
            <div
              className="presence-floor"
              role="img"
              aria-label={`${title}: ${places[position]}`}
              data-position={position}
              data-room-screen={key}
            >
              <m.span
                className={`presence-actor is-${key}`}
                initial={false}
                animate={{ left: `${15 + position * 35}%` }}
                transition={{
                  duration: reduced || !smooth || key === "local" ? 0 : 0.25,
                }}
              >
                <span aria-hidden="true">●</span>나
              </m.span>
            </div>
            <p>
              표시 위치: <strong>{places[position]}</strong>
            </p>
          </div>
        ))}
      </div>
      <div
        className="presence-move-buttons"
        role="group"
        aria-label="이동 지점 선택"
      >
        {places.map((place, index) => (
          <button
            key={place}
            data-move-to={index}
            onClick={() => move(index)}
            disabled={phase !== "ready"}
          >
            {place}으로 이동
          </button>
        ))}
      </div>
      <div className="presence-transport-row">
        <button
          className="quiet-button"
          disabled={phase === "syncing"}
          data-lab-connection={phase}
          onClick={connect}
        >
          {phase === "ready"
            ? "연결 끊김 가정"
            : phase === "syncing"
              ? "전체 상태 받는 중…"
              : "다시 연결하고 전체 상태 받기"}
        </button>
        <span>
          전송 <strong data-lab-sent>{sent}</strong>회 · 적용{" "}
          <strong data-lab-received>{received}</strong>회
        </span>
      </div>
      <p
        className="presence-status"
        role="status"
        aria-live="polite"
        data-lab-status
      >
        {status}
      </p>
      {last && (
        <p className="presence-last-message">
          마지막 학습용 메시지 <code>{JSON.stringify(last)}</code>
        </p>
      )}
      <p className="sheet-caption">
        전달은 순서대로 처리하며, 모형의 방 상태는 전달 완료 때 갱신됩니다. 끊김
        시 미전달 이동을 취소하고 복구 시 마지막 반영 상태를 받습니다. 부드러운
        표시는 수신 후의 짧은 화면 전환이며 실제 예측·네트워크 보간 성능을
        측정한 결과가 아닙니다.
      </p>
    </section>
  );
}
