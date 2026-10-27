import { resolveAssets } from "./assets.js";
export const references = resolveAssets([
  {
    title: "넷플릭스 기술 구성",
    by: "ByteByteGo · 넷플릭스 기술 구성",
    image: "assets/netflix.png",
    alt: "ByteByteGo의 Netflix 기술 스택 도식. 클라이언트·백엔드·스트리밍·데이터 처리 영역별로 기술명을 묶어 보여준다.",
    copy: [
      "참고할 점\n기술명을 모바일·백엔드·전달 등 역할별 영역에 묶어, 어디에 쓰이는지 바로 읽게 합니다.",
      "이 사이트에서 참고한 부분\n각 노드 안에 역할과 기술 배지를 함께 두고, 배지를 누르면 설명을 연결합니다.",
      "공개된 2023년 스냅샷입니다. 현재 넷플릭스 구성의 근거가 아닌 시각 표현 참고 자료입니다.",
    ],
    credit: "© ByteByteGo · 시각 참고",
    url: "https://github.com/ByteByteGoHq/system-design-101/blob/44f1251199ae384a1d46c01479b58b1bed610cb8/README.md#netflixs-tech-stack",
  },
  {
    title: "라이브 스트리밍 처리 순서",
    by: "ByteByteGo · 라이브 스트리밍",
    image: "assets/streaming.jpg",
    alt: "ByteByteGo의 라이브 스트리밍 도식. 캡처·인코딩·CDN·재생의 흐름에 번호를 붙이고 경계를 점선으로 나눈다.",
    copy: [
      "참고할 점\n번호, 화살표, 경계로 처리 순서와 담당 영역을 연결합니다. 프로토콜은 연결선에 표시합니다.",
      "이 사이트에서 참고한 부분\n왼쪽의 재생 단계를 누르면 해당 연결선만 강조하고, 영상 경로는 굵기와 색으로 구분합니다.",
      "라이브 방송 설명입니다. 주문형 영상인 이번 주제에는 도식의 표현 기법만 참고합니다.",
    ],
    credit: "© ByteByteGo · 시각 참고",
    url: "https://github.com/ByteByteGoHq/system-design-101/blob/44f1251199ae384a1d46c01479b58b1bed610cb8/README.md#how-do-video-live-streamings-work-on-youtube-tiktok-live-or-twitch",
  },
  {
    title: "CDN 거점 분포",
    by: "System Design Primer · CDN",
    image: "assets/cdn.jpg",
    alt: "System Design Primer에서 인용한 CDN 분포 도식. 중앙 서버에서 각 지역의 서버로 콘텐츠가 전달되고 사용자는 지역 서버와 연결된다.",
    copy: [
      "참고할 점\n지리적 분산을 보여줘, 사용자 가까이에 콘텐츠를 둔다는 CDN의 목적을 직관적으로 전달합니다.",
      "이 사이트에서 참고한 부분\nISP 내부와 피어링 거점을 구분해 영상 서버가 놓이는 위치를 표시합니다.",
      "일반적인 CDN 개념도입니다. 실제 Netflix의 거점 위치를 나타내는 자료는 아닙니다.",
    ],
    credit: "원출처 Creative Artworks · Primer 인용",
    url: "https://github.com/donnemartin/system-design-primer#content-delivery-network",
  },
]);
