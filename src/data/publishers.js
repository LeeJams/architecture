import { resolveAssets } from "./assets.js";

export const technologyPublishers = resolveAssets({
  oca: ["Netflix", "Open Connect의 영상 전달 장비"],
  aws: ["Amazon Web Services", "Amazon의 클라우드 플랫폼"],
  freebsd: ["FreeBSD Project", "커뮤니티가 개발하는 오픈소스 운영체제"],
  nginx: ["F5 · NGINX Open Source", "오픈소스 HTTP 서버 프로젝트"],
  https: ["IETF 표준", "특정 회사 제품이 아닌 HTTP·TLS 프로토콜"],
  fill: ["콘텐츠 준비 설계", "특정 회사의 단일 제품이 아닌 기능"],
  abr: ["플레이어 설계", "기기·플레이어 구현에 따르는 적응형 재생 방식"],
  steering: ["전달망 제어 설계", "파일·경로·상태로 전송 후보를 고르는 기능"],
});
