import { useState } from "react";
import { assets } from "../data/assets.js";
import { Text } from "./Glossary.jsx";
import { Reveal } from "./ui.jsx";

const situations = [
  ["normal", "정상 처리"],
  ["slow", "알림 처리 지연"],
  ["stopped", "알림 처리 중단"],
  ["uncertain", "결과 확인 전 중단"],
];
const results = {
  sync: {
    normal: [
      "후속 호출이 끝난 뒤 응답",
      "주문 저장 완료",
      "메일·분석 호출 완료",
      "직접 호출한 후속 API의 응답까지 기다립니다. 여기서 메일 API의 성공은 제공사의 접수를 뜻할 수 있으며 실제 수신함 도착과는 다릅니다.",
    ],
    slow: [
      "응답 대기 또는 시간 초과",
      "주문은 이미 저장됨",
      "메일 지연 → 뒤의 분석 호출도 대기",
      "이 예시는 메일 → 분석을 차례로 호출합니다. 병렬로 호출해도 모든 결과를 기다리면 느린 의존성의 영향을 받습니다. 주문은 저장됐는데 사용자는 실패를 볼 수 있어 재시도 시 중복 주문을 막아야 합니다.",
    ],
    stopped: [
      "오류 또는 시간 초과",
      "주문은 이미 저장됨",
      "메일 실패 → 분석 호출에 도달 못함",
      "후속 호출 실패가 주문 저장을 되돌려 주지는 않습니다. 어디까지 성공했는지 기록하고 재시도·보상·상태 조회를 설계해야 합니다. 동기 호출도 분산된 작업 전체를 자동으로 원자화하지 않습니다.",
    ],
    uncertain: [
      "성공 여부를 확인하지 못함",
      "주문은 이미 저장됨",
      "메일 API는 실행했지만 응답이 유실됨",
      "응답을 못 받았다고 실행이 안 된 것은 아닙니다. 호출을 다시 보내면 같은 메일이 발송될 수 있습니다. 요청 식별자와 수신 측의 멱등 처리·결과 조회가 동기 호출에서도 필요합니다.",
    ],
  },
  async: {
    normal: [
      "주문 접수 응답",
      "주문과 outbox를 함께 커밋",
      "각 그룹이 읽고 후속 작업 완료",
      "응답 시점에는 주문과 발행할 이벤트가 DB에 저장됐습니다. 릴레이가 이를 Kafka에 전달하고 각 그룹이 처리합니다. 접수 응답만으로 Kafka 기록이나 메일 완료까지 약속하지 않습니다.",
    ],
    slow: [
      "주문 접수 응답",
      "이벤트 보관 · 알림 소비 위치가 뒤처짐",
      "알림은 대기 · 분석 그룹은 처리 가능",
      "알림을 기다리는 시간이 요청 경로에서 빠집니다. 다만 사용자에게 알림 대기 상태를 보여줄 수 있어야 합니다. 그룹별 진행 위치는 독립적이지만 공유 브로커·네트워크·DB의 자원 경합은 여전히 생길 수 있습니다.",
    ],
    stopped: [
      "주문 접수 응답",
      "미처리 이벤트 적체 · 보관 한도 존재",
      "알림 중단 · 분석 그룹은 처리 가능",
      "소비자가 복구하면 보관된 위치부터 다시 읽습니다. 장애가 보관 기간·용량을 넘으면 누락 복구를 별도로 해야 합니다. 평소 유입보다 더 빠르게 처리할 여유가 없으면 적체를 줄일 수 없습니다.",
    ],
    uncertain: [
      "주문 접수 응답",
      "메일 처리 후 offset 커밋 전에 중단",
      "재시작 후 같은 이벤트를 다시 읽을 수 있음",
      "메일 발송은 끝났지만 Kafka에 처리 위치를 기록하지 못한 상황입니다. event_id만 DB에 남기는 것으로 외부 메일 발송까지 원자화되지는 않습니다. 제공사의 멱등 키·처리 상태·결과 대조가 필요합니다. Kafka 내부 트랜잭션도 외부 메일을 자동으로 한 번만 실행하지 않습니다.",
    ],
  },
};

function FlowSteps({ steps, label }) {
  return (
    <ol className="messaging-flow-steps" aria-label={label}>
      {steps.map(([title, detail], index) => (
        <li key={title}>
          <span className="messaging-step-number">{index + 1}</span>
          <div>
            <strong>{title}</strong>
            <span>{detail}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function KafkaMessagingDemo() {
  const [mode, setMode] = useState("sync");
  const [situation, setSituation] = useState("slow");
  const result = results[mode][situation];
  return (
    <div className="messaging-demo" data-messaging-demo>
      <div className="messaging-demo-heading">
        <img src={assets.kafka} alt="Apache Kafka" width="36" height="36" />
        <h4>같은 주문, 후속 작업을 어디서 기다릴까요?</h4>
      </div>
      <p>
        주문 저장 뒤 메일과 분석을 처리하는 학습 예시입니다. 호출 방식과 장애
        상황을 선택해 응답·저장·완료의 차이를 살펴보세요.
      </p>
      <div
        className="messaging-controls"
        role="group"
        aria-label="처리 방식 선택"
      >
        {[
          ["sync", "동기 호출"],
          ["async", "Kafka로 후속 처리 분리"],
        ].map(([id, label]) => (
          <button
            key={id}
            data-messaging-mode={id}
            aria-pressed={mode === id}
            aria-controls="messaging-example-result"
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="messaging-scenarios">
        <p id="messaging-situation-label">어떤 상황인가요?</p>
        <div
          className="messaging-controls"
          role="group"
          aria-labelledby="messaging-situation-label"
        >
          {situations.map(([id, label]) => (
            <button
              key={id}
              data-messaging-situation={id}
              aria-pressed={situation === id}
              aria-controls="messaging-example-result"
              onClick={() => setSituation(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Reveal
        className="messaging-model"
        identity={mode}
        data-messaging-model={mode}
      >
        {mode === "sync" ? (
          <>
            <p className="messaging-lane-label">요청 안에서 모두 기다림</p>
            <FlowSteps
              label="동기 호출 흐름"
              steps={[
                ["주문 API", "요청 수신"],
                ["주문 DB", "주문 커밋"],
                [
                  "메일 → 분석 API",
                  {
                    normal: "후속 호출 완료",
                    slow: "메일 지연 · 분석 대기",
                    stopped: "메일 중단 · 분석 미호출",
                    uncertain: "메일 실행 · 응답 유실",
                  }[situation],
                ],
                ["사용자 응답", "성공·실패 반환"],
              ]}
            />
            <Text className="messaging-model-note">
              DB 저장이 끝난 뒤 외부 API를 호출합니다. 전체를 감싸는 단일
              트랜잭션이 아니므로 중간 실패 상태가 남을 수 있습니다.
            </Text>
          </>
        ) : (
          <>
            <p className="messaging-lane-label">사용자 요청 경로</p>
            <FlowSteps
              label="비동기 접수 흐름"
              steps={[
                ["주문 API", "요청 수신"],
                ["DB 트랜잭션", "주문 + outbox 커밋"],
                ["접수 응답", "후속 완료와 구분"],
              ]}
            />
            <div className="messaging-background-lane">
              <p className="messaging-lane-label">
                별도 처리 경로 · DB의 outbox에서 이어짐
              </p>
              <FlowSteps
                label="이벤트 발행 흐름"
                steps={[
                  ["Outbox 릴레이", "미발행 이벤트 전달"],
                  ["Kafka 로그", "파티션에 기록·보관"],
                  ["소비자 그룹", "각자의 offset으로 읽기"],
                ]}
              />
              <div className="messaging-consumers">
                <p>
                  <strong>알림 그룹</strong>
                  <span>메일 발송 → 처리 위치 기록</span>
                  <span
                    className="messaging-consumer-state"
                    data-consumer-state={situation}
                  >
                    {
                      {
                        normal: "처리 완료",
                        slow: "처리 지연 · 적체 증가 가능",
                        stopped: "처리 중단 · 복구 대기",
                        uncertain: "발송 완료 · offset 미기록",
                      }[situation]
                    }
                  </span>
                </p>
                <p>
                  <strong>분석 그룹</strong>
                  <span>집계 반영 → 처리 위치 기록</span>
                  <span className="messaging-consumer-state">
                    독립 처리 가능
                  </span>
                </p>
              </div>
            </div>
            <Text className="messaging-model-note">
              Outbox는 주문과 발행할 이벤트를 같은 DB 트랜잭션에 저장하는 추가
              설계입니다. Kafka 내장 기능이 아닙니다. 릴레이의 재전달도
              고려하며, 이벤트 기록 보장은 복제·acks·min.insync.replicas 등의
              설정에 달려 있습니다. 알림과 분석은 서로 다른 소비자 그룹입니다.
            </Text>
          </>
        )}
      </Reveal>
      <div
        id="messaging-example-result"
        className="messaging-result"
        data-messaging-result={`${mode}-${situation}`}
      >
        <p
          className="messaging-result-title"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {mode === "sync" ? "동기 호출" : "Kafka로 후속 처리 분리"} ·{" "}
          {situations.find(([id]) => id === situation)[1]}: {result[0]}
        </p>
        <dl>
          {["사용자 응답", "저장 상태", "후속 작업"].map((label, i) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{result[i]}</dd>
            </div>
          ))}
        </dl>
        <Text>{result[3]}</Text>
      </div>
      <BacklogCalculator />
    </div>
  );
}

const number = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 });
function BacklogCalculator() {
  const [values, setValues] = useState({
    arrival: "100",
    stopped: "60",
    capacity: "150",
  });
  const valid = Object.values(values).every(
    (value) =>
      value !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0 &&
      Number(value) <= 1_000_000 &&
      Number.isInteger(Number(value)),
  );
  const arrival = Number(values.arrival),
    stopped = Number(values.stopped),
    capacity = Number(values.capacity);
  const backlog = arrival * stopped;
  const catchup = capacity > arrival ? backlog / (capacity - arrival) : null;
  return (
    <details className="messaging-calculator" data-backlog-calculator>
      <summary>처리가 멈추면 얼마나 쌓일까요? 숫자로 확인하기</summary>
      <div>
        <p>
          알림 소비자가 멈춘 동안에도 이벤트가 계속 들어온다고 가정합니다. 복구
          후의 처리량은 실제 후속 시스템까지 처리한 양입니다.
        </p>
        <div className="messaging-calculator-fields">
          {[
            ["arrival", "초당 유입", "건/초"],
            ["stopped", "중단 시간", "초"],
            ["capacity", "복구 후 초당 처리", "건/초"],
          ].map(([key, label, unit]) => (
            <label key={key} htmlFor={`backlog-${key}`}>
              <span>
                {label} ({unit})
              </span>
              <input
                id={`backlog-${key}`}
                type="number"
                min="0"
                max="1000000"
                step="1"
                required
                value={values[key]}
                onChange={(e) =>
                  setValues({ ...values, [key]: e.target.value })
                }
              />
            </label>
          ))}
        </div>
        <div
          className="messaging-calculator-result"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          data-backlog-result
        >
          {!valid ? (
            <p>각 항목에 0~1,000,000 사이의 정수를 입력하세요.</p>
          ) : (
            <>
              <p>
                중단 중 적체{" "}
                <strong data-backlog-count>{number.format(backlog)}건</strong>
              </p>
              {backlog === 0 ? (
                <p>이 가정에서는 중단 중 새로 쌓인 이벤트가 없습니다.</p>
              ) : catchup !== null ? (
                <p>
                  복구 후 따라잡는 시간{" "}
                  <strong data-backlog-catchup>
                  {catchup > 0 && catchup < 0.1
                    ? "0.1초 미만"
                    : `${number.format(catchup)}초`}
                  </strong>
                </p>
              ) : (
                <p data-backlog-no-drain>
                  <strong>적체가 줄어들지 않습니다.</strong> 처리량이 유입량보다
                  커야 따라잡을 수 있습니다.
                </p>
              )}
            </>
          )}
        </div>
        <p className="messaging-calculator-formula">
          적체 = 초당 유입 × 중단 시간
          <br />
          따라잡는 시간 = 적체 ÷ (초당 처리 − 초당 유입)
        </p>
        <p className="sheet-caption">
          유입·처리 속도가 일정하고 복구 시 모든 이벤트가 보관돼 있다는 단순
          모형입니다. 기존 적체·재시도·이벤트 크기·보관 한도는 제외했습니다.
          Kafka 성능 측정값이 아닙니다.
        </p>
      </div>
    </details>
  );
}
