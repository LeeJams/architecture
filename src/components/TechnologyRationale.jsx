import { Text } from "./Glossary.jsx";
import { KafkaMessagingDemo } from "./KafkaMessagingDemo.jsx";

export function TechnologyRationale({ technology }) {
  const why = technology.rationale;
  return (
    <>
      <section data-info-section="why" className="technology-rationale">
        <p className="sheet-eyebrow">필요한 이유부터</p>
        <h3 tabIndex="-1">왜 이 기술이 필요한가</h3>
        <h4>어떤 문제를 겪나요?</h4>
        <Text>{why.problem}</Text>
        <div className="technology-mechanism">
          <h4>{technology.name}은 무엇을 바꾸나요?</h4>
          <Text>{why.change}</Text>
        </div>
        {technology.id === "kafka" && <KafkaMessagingDemo />}
      </section>
      <section data-info-section="decision">
        <p className="sheet-eyebrow">효과와 그에 따른 책임</p>
        <h3 tabIndex="-1">무엇을 얻고, 무엇을 감수하나요?</h3>
        <div className="technology-decision-pairs">
          {why.decisions.map((pair) => (
            <div className="technology-decision-pair" key={pair.gainTitle}>
              <article>
                <p className="technology-decision-label">얻는 것</p>
                <h4>{pair.gainTitle}</h4>
                <Text>{pair.gain}</Text>
              </article>
              <article>
                <p className="technology-decision-label">감수할 점</p>
                <h4>{pair.costTitle}</h4>
                <Text>{pair.cost}</Text>
              </article>
            </div>
          ))}
        </div>
        <div className="technology-decision-question">
          <h4>우리 서비스에도 필요한가요?</h4>
          <Text>{why.ask}</Text>
          <h4>더 단순하게 시작할 수 있다면</h4>
          <Text>{why.simpler}</Text>
        </div>
      </section>
    </>
  );
}
