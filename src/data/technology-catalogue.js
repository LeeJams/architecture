export const technologyCategories = [
  [
    "all",
    "전체"
  ],
  [
    "storage",
    "저장소"
  ],
  [
    "delivery",
    "CDN · 콘텐츠 전달"
  ],
  [
    "http",
    "HTTP 서버"
  ],
  [
    "os",
    "운영체제"
  ]
];

export const technologyCatalogue = [
  {
    "id": "s3",
    "name": "Amazon S3",
    "provider": "Amazon Web Services",
    "category": "storage",
    "type": "오브젝트 스토리지",
    "image": "s3",
    "summary": "버킷과 객체 키로 파일을 저장하고 HTTP API로 읽고 쓰는 AWS 서비스입니다.",
    "definition": "Amazon Simple Storage Service는 파일의 바이트와 메타데이터를 객체로 보관하는 관리형 저장 서비스입니다. 애플리케이션은 버킷과 객체 키를 지정해 PUT·GET·HEAD·DELETE 등의 API를 호출합니다. 서버에 디스크를 붙여 파일시스템으로 쓰는 EBS, 여러 서버가 공유하는 파일시스템인 EFS와 접근 모델이 다릅니다.",
    "useCases": [
      [
        "사용자가 올린 이미지·첨부파일",
        "웹 서버의 로컬 디스크 대신 원본을 보관합니다. 서버가 업로드 권한을 확인한 뒤 직접 받거나, 제한된 서명 URL로 클라이언트가 업로드하도록 설계할 수 있습니다."
      ],
      [
        "영상 원본·분석 데이터·백업",
        "인코딩된 미디어와 분석용 파일을 객체로 보관하고 배치 작업이나 CDN 원본에 연결합니다. 저장소가 인코딩·재생 API·CDN까지 제공하는 것은 아닙니다."
      ]
    ],
    "concepts": [
      [
        "버킷과 객체 키",
        "버킷은 객체를 담는 경계이고 키는 그 안에서 객체를 찾는 이름입니다. videos/v1/a.mp4의 슬래시는 키의 일부이며 디렉터리 이동 연산을 뜻하지 않습니다."
      ],
      [
        "메타데이터와 버전",
        "Content-Type·Cache-Control 등은 소비자가 파일을 해석하고 캐시하는 데 영향을 줍니다. 버전 관리가 켜진 버킷에서는 버전 ID로 같은 키의 여러 버전을 구분합니다."
      ],
      [
        "접근 권한과 서명 URL",
        "IAM·버킷 정책·퍼블릭 액세스 차단·암호화 키 권한이 요청 결과에 영향을 줍니다. 서명 URL은 정해진 작업을 제한된 시간에 허용하는 권한 정보이므로 토큰처럼 취급합니다."
      ],
      [
        "읽기 일관성과 객체 단위 원자성",
        "성공한 객체 PUT·DELETE 이후의 원본 읽기는 강한 일관성을 제공합니다. 같은 키를 쓰는 중에 동시에 읽으면 이전 전체 또는 새 전체를 읽으며, 반만 바뀐 객체를 읽는 모델이 아닙니다. 여러 객체 키를 한 트랜잭션으로 변경하는 기능은 별개이므로, 여러 파일과 목록을 함께 공개할 순서는 애플리케이션에서 정해야 합니다."
      ],
      [
        "멀티파트 업로드",
        "업로드를 시작해 Upload ID를 받고, 조각을 전송한 뒤 조각 번호·ETag 목록으로 완료를 요청합니다. 일부 조각을 다시 보낼 수 있지만, 조각 전송만 끝났다고 최종 객체가 공개된 것은 아닙니다. CompleteMultipartUpload 성공과 최종 객체를 확인해야 합니다."
      ]
    ],
    "flow": [
      [
        "업로드 권한 결정",
        "서버가 사용자와 대상 키·파일 조건을 확인합니다."
      ],
      [
        "파일과 메타데이터 저장",
        "PUT 또는 멀티파트 업로드로 바이트를 보냅니다."
      ],
      [
        "API·CDN으로 읽기",
        "GET·HEAD로 읽거나 별도의 CDN을 원본에 연결합니다."
      ]
    ],
    "points": [
      [
        "공유 URL과 비공개 저장을 구분",
        "파일 공유 때문에 버킷 전체를 공개하지 않습니다. 서버 경유·서명 URL·CDN의 원본 접근 방식 중 필요한 경로를 설계합니다. 서명 URL도 발급 자격증명의 권한과 만료 조건을 따릅니다."
      ],
      [
        "ETag를 항상 파일의 MD5로 보지 않기",
        "멀티파트 업로드와 암호화 방식에 따라 ETag를 단순 MD5로 해석할 수 없습니다. 무결성 확인은 해당 업로드 API가 지원하는 체크섬과 실제 전송 결과로 설계합니다."
      ],
      [
        "이름·수명주기·캐시를 함께 설계",
        "객체를 새 버전 키에 올릴지 같은 키에 덮어쓸지 정합니다. CDN에 남은 응답과 원본의 변경은 별개의 상태입니다. 버전 관리·이전 버전 정리·복제 정책도 비용과 복구 요구에 맞춰 설정합니다."
      ],
      [
        "영상 구간과 목록의 공개 순서를 정하기",
        "여러 구간 파일을 새 버전 키에 올려 검증하고, 그 파일을 가리키는 재생 목록이나 버전 참조를 마지막에 공개하는 방식을 검토합니다. 객체 하나의 강한 일관성이 여러 파일의 일괄 공개나 CDN 캐시의 동시 변경까지 보장하지는 않습니다."
      ],
      [
        "중단된 멀티파트 조각 정리",
        "완료되지 않은 업로드 조각은 최종 객체와 구분해 관리합니다. Abort 또는 AbortIncompleteMultipartUpload 수명주기 규칙과 실패 기록을 설계합니다. 완성된 객체를 삭제하는 규칙과도 구분합니다."
      ]
    ],
    "diagnostics": [
      [
        "403으로 파일을 읽지 못함",
        "요청 주체의 GetObject 권한·버킷 정책·퍼블릭 차단·KMS 권한·서명 만료와 요청 메서드를 함께 확인합니다."
      ],
      [
        "바꾼 파일이 계속 예전 내용으로 보임",
        "실제 버킷·키·버전 ID를 확인하고 브라우저·CDN의 캐시를 분리해 봅니다. S3 원본 조회 결과와 캐시 응답을 같은 현상으로 묶지 않습니다."
      ]
    ],
    "example": {
      "title": "객체 업로드와 확인",
      "description": "이미 만들어진 버킷과 로컬 파일, 해당 작업의 권한이 있다는 가정의 AWS CLI 예제입니다. 웹에서 실행되지 않습니다.",
      "language": "AWS CLI",
      "code": "aws s3api put-object \\\n  --bucket amzn-s3-demo-bucket \\\n  --key videos/demo/v1/segment-001.m4s \\\n  --body ./segment-001.m4s\n\naws s3api head-object \\\n  --bucket amzn-s3-demo-bucket \\\n  --key videos/demo/v1/segment-001.m4s",
      "note": "버킷 생성·권한·리전·메타데이터는 별도 구성입니다. 이 예제는 특정 회사의 실제 저장 구조를 뜻하지 않습니다."
    },
    "sources": [
      [
        "S3 객체와 구성 요소",
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingObjects.html",
        "객체 키·메타데이터·버전의 제품 문서. 현재 서비스 조건은 원문에서 확인합니다."
      ],
      [
        "AWS CLI 공식 업로드 예제",
        "https://github.com/aws/aws-cli/blob/develop/awscli/examples/s3api/put-object.rst",
        "확인한 공식 예제: bucket·key·body로 객체 업로드."
      ],
      [
        "AWS SDK 공식 서명 URL 예제",
        "https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/python/example_code/s3/s3_basics/presigned_url.py",
        "확인한 공식 SDK 예제: 작업별 서명 URL과 만료 인수."
      ],
      [
        "S3 무결성 검증",
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity.html",
        "체크섬·ETag 조건의 추가 제품 문서."
      ],
      [
        "S3 읽기 일관성 공식 보존 문서",
        "https://github.com/awsdocs/amazon-s3-developer-guide/blob/master/doc_source/Introduction.md",
        "확인한 객체 PUT·DELETE의 강한 일관성, 단일 키 원자성·다중 키 변경 경계."
      ],
      [
        "멀티파트 업로드 공식 보존 문서",
        "https://github.com/awsdocs/amazon-s3-developer-guide/blob/master/doc_source/mpuoverview.md",
        "확인한 시작·조각 전송·완료와 미완료 업로드 정리. 현재 한도·요금은 옮기지 않습니다."
      ]
    ],
    "related": [
      "cloudfront",
      "gcs"
    ],
    "logoSource": "https://github.com/awslabs/aws-icons-for-plantuml",
    "logoAlt": "Amazon S3 제품·프로젝트 심벌",
    "logoNote": "AWS 제품 아이콘 · AWS Icons for PlantUML 원본 PNG",
    "aliases": [
      "에스쓰리",
      "아마존 S3"
    ]
  },
  {
    "id": "cloudfront",
    "name": "Amazon CloudFront",
    "provider": "Amazon Web Services",
    "category": "delivery",
    "type": "관리형 CDN",
    "image": "cloudfront",
    "summary": "사용자와 원본 사이의 엣지에서 파일을 캐시하고 전달하는 AWS CDN입니다.",
    "definition": "CloudFront는 distribution에 연결한 원본의 콘텐츠를 엣지에서 전달합니다. 원본은 S3 같은 객체 저장소 또는 HTTP 서버일 수 있습니다. 경로별 behavior에 원본·캐시 정책·허용 메서드·접근 설정을 연결해, 어떤 요청을 어디로 보낼지 결정합니다.",
    "useCases": [
      [
        "정적 파일과 주문형 영상 전달",
        "이미지·스크립트·미디어 구간 등 반복되는 바이트를 원본에서 매번 멀리 전송하는 부담을 줄일 때 사용합니다."
      ],
      [
        "비공개 파일 전달",
        "원본 접근 권한과 시청자 접근 정책을 각각 설정해 비공개 콘텐츠를 전달하는 경로를 구성합니다."
      ]
    ],
    "concepts": [
      [
        "Distribution·원본·Behavior",
        "배포는 도메인과 원본을 묶고, behavior는 요청 경로별 동작을 정합니다. 서로 다른 경로에 다른 원본·정책을 붙일 수 있습니다."
      ],
      [
        "캐시 키와 TTL",
        "캐시 키는 같은 응답을 재사용할 수 있는 요청을 구분합니다. TTL은 신선도 정책이며 접근 권한의 만료와는 별개입니다."
      ],
      [
        "원본 접근과 시청자 권한",
        "S3 원본에 대한 접근 제어와 사용자에 대한 서명 URL·쿠키 등의 검증은 다른 경계입니다. 하나를 설정했다고 다른 경계까지 해결되지 않습니다."
      ]
    ],
    "flow": [
      [
        "도메인으로 요청",
        "사용자가 배포 도메인의 파일 URL을 요청합니다."
      ],
      [
        "캐시와 정책 평가",
        "경로 behavior와 캐시 키에 맞는 응답을 찾습니다."
      ],
      [
        "응답 또는 원본 조회",
        "재사용 가능한 응답을 전달하거나 연결된 원본에 요청합니다."
      ]
    ],
    "points": [
      [
        "캐시 키가 바이트의 정체성을 보존해야 함",
        "파일 버전·화질 등 응답 바이트를 바꾸는 값을 구분해야 합니다. 사용자 토큰을 캐시 키에 넣을지와 매 요청의 접근 검증을 별도로 결정합니다."
      ],
      [
        "원본이 느리거나 막히면 미스 요청이 영향을 받음",
        "엣지 적중률만 보지 말고 원본 오류·첫 바이트 시간·대량 동시 미스·권한 실패도 확인합니다. 캐시되지 않은 콘텐츠의 전송 경로를 시험합니다."
      ],
      [
        "파일 변경과 캐시 반영은 분리",
        "버전 URL과 무효화 정책을 정합니다. CloudFront를 쓰는 것만으로 인코딩·플레이어·DRM·재생 정보 API가 만들어지지는 않습니다."
      ]
    ],
    "diagnostics": [
      [
        "원본은 정상인데 엣지에서 403",
        "원본 접근·도메인·behavior 경로·시청자 권한·응답 캐시 상태를 구분합니다."
      ],
      [
        "캐시 적중률이 예상보다 낮음",
        "실제 캐시 키에 들어가는 쿼리·헤더·쿠키와 응답 Cache-Control·TTL 정책을 대조합니다."
      ]
    ],
    "example": {
      "title": "요청을 설정에 연결하기",
      "description": "설정 문법이 아닌 구성 요소의 연결 예입니다.",
      "language": "설계 연결 예",
      "code": "media.example.com/video/v1/segment.m4s\n  → distribution\n  → /video/* behavior\n  → cache policy + viewer access policy\n  → S3 origin or HTTP origin",
      "note": "제품별 캐시·권한·Range 조건과 정책의 기본값은 현재 공식 문서로 확인합니다."
    },
    "sources": [
      [
        "CloudFront 소개",
        "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
        "배포와 엣지 전달의 제품 개요."
      ],
      [
        "CloudFront 공식 보존 문서",
        "https://github.com/awsdocs/amazon-cloudfront-developer-guide/blob/main/doc_source/Introduction.md",
        "확인한 AWS 보존 문서. 최신 제한·정책의 근거로 확장하지 않습니다."
      ],
      [
        "캐시 키",
        "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/understanding-the-cache-key.html",
        "요청과 캐시 키의 관계."
      ]
    ],
    "related": [
      "s3",
      "nginx"
    ],
    "logoSource": "https://github.com/awslabs/aws-icons-for-plantuml",
    "logoAlt": "Amazon CloudFront 제품·프로젝트 심벌",
    "logoNote": "AWS 제품 아이콘 · AWS Icons for PlantUML 원본 PNG",
    "aliases": [
      "클라우드프론트"
    ]
  },
  {
    "id": "nginx",
    "name": "NGINX",
    "provider": "F5 · NGINX Open Source",
    "category": "http",
    "type": "HTTP 서버·리버스 프록시",
    "image": "nginx",
    "summary": "HTTP 요청을 파일 응답이나 뒤쪽 애플리케이션 서버에 연결하는 서버 소프트웨어입니다.",
    "definition": "NGINX는 정적 파일 제공, 리버스 프록시, TLS 종단, 업스트림 요청 분산 등을 구성하는 웹 서버입니다. master가 설정과 worker를 관리하고 worker가 여러 연결의 이벤트를 처리합니다. 요청의 URL을 파일 경로나 업스트림에 어떻게 연결하는지가 설정의 핵심입니다.",
    "useCases": [
      [
        "정적 파일·미디어 파일 응답",
        "준비된 이미지·영상 구간·다운로드 파일을 HTTP로 제공합니다. Range·캐시 헤더·파일 권한과 응답 상태를 함께 설계합니다."
      ],
      [
        "애플리케이션 앞의 프록시",
        "클라이언트 요청을 앱 서버에 연결하고 TLS·요청 제한 시간·전달 헤더·로그 경계를 구성합니다."
      ]
    ],
    "concepts": [
      [
        "Server·Location",
        "호스트와 요청 URI를 처리할 설정을 고릅니다. 정규식·prefix 선택 순서와 root·alias의 경로 조합을 이해해야 합니다."
      ],
      [
        "Worker와 이벤트 처리",
        "worker_connections는 클라이언트뿐 아니라 업스트림 연결에도 관련됩니다. 실제 프로세스의 FD 한도와 열리는 파일·로그 자원을 함께 확인합니다."
      ],
      [
        "파일 전송과 OS",
        "sendfile·aio·thread pool 등의 사용 조건은 빌드와 OS에 따라 다릅니다. 소켓 준비 알림이 디스크 읽기 지연까지 없애는 것은 아닙니다."
      ]
    ],
    "flow": [
      [
        "요청과 설정 선택",
        "Host·URI로 server와 location을 선택합니다."
      ],
      [
        "파일 또는 업스트림 처리",
        "준비된 파일을 찾거나 프록시 대상에 요청합니다."
      ],
      [
        "상태·헤더·본문 응답",
        "OS의 파일·소켓 I/O를 활용해 응답을 전달합니다."
      ]
    ],
    "points": [
      [
        "root와 alias의 URI 해석을 확인",
        "같은 URL이 어떤 실제 파일 경로가 되는지 먼저 확인합니다. 파일이 없을 때 404·프록시·대체 파일 중 어떤 동작을 할지도 명시합니다."
      ],
      [
        "설정 파일과 실행 중인 빌드를 함께 확인",
        "nginx -t로 문법·구성 참조를 검사하고 nginx -V로 모듈·빌드 옵션을 확인합니다. 설정을 바꾸면 reload 적용 여부와 오류 로그를 봅니다."
      ],
      [
        "응답 속도는 여러 대기를 포함",
        "request_time만으로 디스크가 느리다고 결론내리지 않습니다. 느린 수신자·업스트림·TLS·스토리지·네트워크 지표를 함께 관측합니다."
      ]
    ],
    "diagnostics": [
      [
        "파일은 있는데 404 또는 403",
        "선택된 location, root·alias 조합, 서비스 계정과 디렉터리 접근 권한을 확인합니다."
      ],
      [
        "연결 상한에 먼저 도달",
        "worker 수·연결 설정과 실제 프로세스 FD 한도·업스트림 연결·열린 파일 수를 대조합니다."
      ]
    ],
    "example": {
      "title": "정적 파일을 제공하는 최소 경로",
      "description": "기존 http 블록 안에 넣는 학습용 server 설정 조각입니다.",
      "language": "NGINX 설정 조각",
      "code": "server {\n    listen 127.0.0.1:8080;\n    location /media/ {\n        root /srv;\n        try_files $uri =404;\n    }\n}\n# /media/demo.bin → /srv/media/demo.bin",
      "note": "완전한 운영 설정이 아닙니다. TLS·사용자 권한·로그·프로세스 제한은 별도 구성입니다."
    },
    "sources": [
      [
        "NGINX 입문",
        "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/beginners_guide.xml",
        "확인한 master·worker·정적 파일·프록시 원문."
      ],
      [
        "HTTP core 지시어",
        "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/http/ngx_http_core_module.xml",
        "root·alias·sendfile·aio와 사용 조건."
      ],
      [
        "연결 처리 방식",
        "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/events.xml",
        "OS별 이벤트 처리."
      ]
    ],
    "related": [
      "caddy",
      "apache",
      "freebsd"
    ],
    "logoSource": "https://github.com/simple-icons/simple-icons",
    "logoAlt": "NGINX 제품·프로젝트 심벌",
    "logoNote": "브랜드 심벌 · Simple Icons 제공 · 원본 형상",
    "aliases": [
      "엔진엑스"
    ]
  },
  {
    "id": "freebsd",
    "name": "FreeBSD",
    "provider": "FreeBSD Project",
    "category": "os",
    "type": "서버 운영체제",
    "image": "freebsd",
    "summary": "커널과 기본 사용자 공간을 함께 개발하는 오픈소스 Unix 계열 운영체제입니다.",
    "definition": "FreeBSD는 프로세스·메모리·파일시스템·장치·네트워크를 관리하는 운영체제입니다. 웹 서버와 데이터베이스 같은 프로그램이 그 위에서 실행됩니다. Linux 배포판의 이름이 아니며 커널 API·드라이버·패키지·서비스 운영 방식이 Linux와 다릅니다.",
    "useCases": [
      [
        "파일·네트워크 서비스를 실행",
        "HTTP 서버가 요청한 파일 읽기와 소켓 전송, 저장장치·NIC 드라이버의 실행 기반을 제공합니다."
      ],
      [
        "격리된 서비스 운영",
        "jail 같은 OS 기능을 이용해 서비스 환경을 구분하고, 운영 정책에 맞춰 네트워크·파일 접근을 구성할 수 있습니다."
      ]
    ],
    "concepts": [
      [
        "기본 시스템과 패키지",
        "커널·기본 사용자 공간과 추가 패키지의 업데이트 경로를 구분합니다. 시스템 버전과 애플리케이션 빌드를 함께 기록합니다."
      ],
      [
        "kqueue",
        "파일 디스크립터의 읽기·쓰기 가능 상태 등 이벤트를 받습니다. 준비 알림과 실제 데이터의 읽기·전송 완료는 구분해야 합니다."
      ],
      [
        "sendfile과 KTLS",
        "sendfile은 파일에서 소켓으로 전달하는 API입니다. KTLS는 협상 후 TLS 레코드 처리와 관련되며, 실제 경로는 커널·서버·TLS·NIC 조건을 따릅니다."
      ]
    ],
    "flow": [
      [
        "앱이 시스템 호출",
        "파일·메모리·네트워크 작업을 요청합니다."
      ],
      [
        "커널과 장치 처리",
        "페이지·소켓·이벤트·드라이버를 관리합니다."
      ],
      [
        "진행 결과와 이벤트 반환",
        "처리된 길이와 준비 상태에 맞춰 앱이 작업을 이어갑니다."
      ]
    ],
    "points": [
      [
        "부분 전송과 재시도를 고려",
        "비차단 sendfile에서 반환값만 보지 말고 sbytes로 진행 길이를 확인합니다. EAGAIN 때 이미 전송된 부분을 중복해서 보내지 않아야 합니다."
      ],
      [
        "TLS 기능 이름으로 경로를 단정하지 않기",
        "KTLS를 사용해도 모든 연결이 NIC에서 암호화되는 것은 아닙니다. 소프트웨어 처리와 지원 장치의 offload 조건을 구분합니다."
      ],
      [
        "목표 하드웨어와 빌드를 검증",
        "운영체제를 바꿀 때 커널 API·드라이버·서비스 제한·패키지·관측 도구를 확인합니다. 다른 OS의 튜닝 값을 이름만 바꿔 복사하지 않습니다."
      ]
    ],
    "diagnostics": [
      [
        "NIC 여유가 있는데 전송이 느림",
        "페이지 캐시·물리 디스크 읽기·CPU·TLS 모드·외부 경로를 함께 확인합니다."
      ],
      [
        "다른 OS용 설정이 동작하지 않음",
        "서버의 빌드 모듈과 이벤트 방식, 커널 API·서비스 제한의 차이를 확인합니다."
      ]
    ],
    "example": {
      "title": "실행 환경부터 확인하기",
      "description": "FreeBSD 호스트에서 버전과 설치된 서버 빌드를 기록하는 읽기 명령 예입니다.",
      "language": "셸 · 관측 명령",
      "code": "freebsd-version -kru\nuname -a\nnginx -V",
      "note": "명령은 해당 프로그램의 설치 여부를 전제로 합니다. 커널 튜닝이나 성능 우위를 증명하는 예제가 아닙니다."
    },
    "sources": [
      [
        "FreeBSD Handbook",
        "https://docs.freebsd.org/en/books/handbook/",
        "운영체제·기본 시스템·서비스 관리."
      ],
      [
        "sendfile(2) 공식 원문",
        "https://github.com/freebsd/freebsd-src/blob/main/lib/libsys/sendfile.2",
        "확인한 부분 전송·sbytes·EAGAIN 조건."
      ],
      [
        "kqueue(2) 공식 원문",
        "https://github.com/freebsd/freebsd-src/blob/main/lib/libsys/kqueue.2",
        "이벤트 필터와 통지."
      ],
      [
        "KTLS 공식 원문",
        "https://github.com/freebsd/freebsd-src/blob/main/share/man/man4/ktls.4",
        "TLS 레코드 처리와 장치 조건."
      ]
    ],
    "related": [
      "ubuntu",
      "debian",
      "nginx"
    ],
    "logoSource": "https://github.com/simple-icons/simple-icons",
    "logoAlt": "FreeBSD 제품·프로젝트 심벌",
    "logoNote": "브랜드 심벌 · Simple Icons 제공 · 원본 형상",
    "aliases": [
      "프리비에스디"
    ]
  },
  {
    "id": "caddy",
    "name": "Caddy",
    "provider": "ZeroSSL · HID Global",
    "category": "http",
    "type": "HTTP 서버·리버스 프록시",
    "image": "caddy",
    "summary": "자동 HTTPS와 파일 서버·프록시 기능을 제공하는 Go 기반 웹 서버입니다.",
    "definition": "Caddy는 JSON 설정 모델과 Caddyfile 어댑터를 제공하는 웹 서버입니다. 정적 파일 응답과 리버스 프록시를 구성하며, 지원되는 이름과 네트워크·발급 조건에서 인증서 획득·갱신을 자동화할 수 있습니다.",
    "useCases": [
      [
        "정적 사이트와 파일 제공",
        "파일 트리의 경로를 HTTP 요청에 연결해 사이트·이미지·다운로드를 제공합니다."
      ],
      [
        "서비스 앞의 HTTPS 프록시",
        "앱 서버 앞에서 인증서 관리와 요청 전달 경계를 구성할 때 사용합니다."
      ]
    ],
    "concepts": [
      [
        "JSON과 Caddyfile",
        "JSON이 기본 설정 모델입니다. Caddyfile은 사람이 작성하기 쉬운 문법을 어댑터로 변환합니다."
      ],
      [
        "Root와 file_server",
        "root가 파일 탐색 기준을 정하고 file_server가 실제 파일 응답을 담당합니다. URI 변경 handler를 조합하면 실제 매핑도 바뀝니다."
      ],
      [
        "자동 HTTPS",
        "도메인·인증서 발급 방법·포트·권한·외부 도달성에 따라 동작합니다. 명시적인 http:// 사이트 주소와는 구분합니다."
      ]
    ],
    "flow": [
      [
        "사이트 설정 선택",
        "호스트와 경로에 맞는 handler 체인을 선택합니다."
      ],
      [
        "파일 또는 프록시 처리",
        "file_server로 읽거나 reverse_proxy로 앱에 연결합니다."
      ],
      [
        "HTTP 응답과 인증서 운영",
        "설정된 응답을 보내고 적용 가능한 HTTPS 인증서를 관리합니다."
      ]
    ],
    "points": [
      [
        "handle_path는 prefix를 제거",
        "/media/*를 handle_path로 감싸면 /media가 제거됩니다. 파일 경로를 유지할지 바꿀지 먼저 결정합니다."
      ],
      [
        "자동화에도 실행 조건이 필요",
        "인증서 저장 위치·권한·갱신 실패·여러 인스턴스의 운영 방식을 관측합니다. 자동 HTTPS라는 이름만으로 모든 환경에서 발급이 완료되지는 않습니다."
      ],
      [
        "동일 파일의 HTTP 응답을 검사",
        "전체·부분 범위·없는 파일·If-Range와 ETag를 확인합니다. 다른 서버의 ETag 형식이 같다고 가정하지 않습니다."
      ]
    ],
    "diagnostics": [
      [
        "원하는 파일 대신 404",
        "작업 디렉터리·root·URI rewrite와 파일 권한을 확인합니다."
      ],
      [
        "인증서 발급 실패",
        "사이트 주소·DNS·챌린지의 도달 경로·저장 권한과 오류 로그를 확인합니다."
      ]
    ],
    "example": {
      "title": "로컬 정적 파일 서버",
      "description": "실행 위치의 data/media/demo.bin을 제공하는 HTTP 학습 설정입니다.",
      "language": "Caddyfile",
      "code": "http://127.0.0.1:8081 {\n    root * ./data\n    file_server\n}\n# /media/demo.bin → ./data/media/demo.bin",
      "note": "명시적인 http://이므로 이 예제는 자동 HTTPS를 시험하지 않습니다."
    },
    "sources": [
      [
        "Caddy 공식 문서",
        "https://caddyserver.com/docs/",
        "설정 모델·자동 HTTPS·모듈."
      ],
      [
        "공식 file_server 구현",
        "https://github.com/caddyserver/caddy/blob/master/modules/caddyhttp/fileserver/staticfiles.go",
        "확인한 파일·조건부 요청·범위 응답 구현."
      ],
      [
        "프로젝트와 소속",
        "https://github.com/caddyserver/caddy",
        "공식 README에 표시된 소속과 프로젝트 설명."
      ]
    ],
    "related": [
      "nginx",
      "apache"
    ],
    "logoSource": "https://github.com/simple-icons/simple-icons",
    "logoAlt": "Caddy 제품·프로젝트 심벌",
    "logoNote": "브랜드 심벌 · Simple Icons 제공 · 원본 형상",
    "aliases": [
      "캐디"
    ]
  },
  {
    "id": "apache",
    "name": "Apache HTTP Server",
    "provider": "Apache Software Foundation",
    "category": "http",
    "type": "HTTP 서버",
    "image": "apache",
    "summary": "가상 호스트·정적 파일·프록시를 모듈로 조합하는 오픈소스 웹 서버입니다.",
    "definition": "Apache HTTP Server는 요청을 가상 호스트와 파일·모듈 처리에 연결합니다. 연결을 관리할 프로세스·스레드 모델은 선택한 MPM이 담당하고, 인증·TLS·프록시 등은 활성 모듈과 설정으로 구성합니다.",
    "useCases": [
      [
        "파일과 사이트 제공",
        "DocumentRoot·가상 호스트로 여러 사이트와 파일 경로를 운영합니다."
      ],
      [
        "기존 모듈 기반 서비스",
        "필요한 인증·재작성·프록시 모듈과 운영 경험을 활용하는 서비스에 사용합니다."
      ]
    ],
    "concepts": [
      [
        "VirtualHost와 DocumentRoot",
        "요청 호스트와 URI를 파일 트리에 연결합니다. Directory는 파일시스템 경로의 접근 설정입니다."
      ],
      [
        "MPM",
        "prefork·worker·event 등은 연결 처리 모델이 다릅니다. 실제 활성 MPM과 모듈의 조합을 확인합니다."
      ],
      [
        "모듈과 설정 범위",
        "로드된 모듈·서버/가상 호스트/디렉터리 설정 범위에 따라 동작이 달라집니다."
      ]
    ],
    "flow": [
      [
        "호스트·URI 선택",
        "요청에 맞는 가상 호스트와 경로를 고릅니다."
      ],
      [
        "MPM·모듈 처리",
        "연결 관리와 인증·재작성·파일 처리를 수행합니다."
      ],
      [
        "응답 전달",
        "상태·헤더·파일 또는 프록시 결과를 보냅니다."
      ]
    ],
    "points": [
      [
        "event MPM과 요청 처리를 구분",
        "keep-alive 연결 관리와 응답을 수행하는 worker의 일을 구분합니다. 모든 요청의 전체 처리가 비동기라는 의미로 읽지 않습니다."
      ],
      [
        "Directory와 URL은 다른 경계",
        "파일 접근 권한은 Directory·Require와 OS 권한을 함께 봅니다. URL 경로와 실제 DocumentRoot 매핑을 기록합니다."
      ],
      [
        "운영 중 모듈·빌드·한도를 관측",
        "설정 파일만 같아도 설치 모듈·MPM·서비스 제한이 다를 수 있습니다. sendfile 사용도 OS·파일시스템 조건을 확인합니다."
      ]
    ],
    "diagnostics": [
      [
        "설정은 있는데 403",
        "Directory의 Require·파일 권한·실제 경로와 활성 가상 호스트를 확인합니다."
      ],
      [
        "접속이 늘면 대기가 커짐",
        "활성 MPM·worker/연결 한도·느린 응답과 실제 자원 사용을 함께 확인합니다."
      ]
    ],
    "example": {
      "title": "파일 경로 접근 설정",
      "description": "기존 설정에 넣는 학습용 조각입니다.",
      "language": "Apache 설정 조각",
      "code": "DocumentRoot \"/srv/video\"\n<Directory \"/srv/video\">\n    Require all granted\n    Options -Indexes\n    AllowOverride None\n</Directory>",
      "note": "모듈·MPM·TLS·로그·실행 계정은 별도 설정합니다."
    },
    "sources": [
      [
        "Apache HTTP Server 문서",
        "https://httpd.apache.org/docs/2.4/",
        "서버와 모듈 구성."
      ],
      [
        "event MPM 공식 원문",
        "https://github.com/apache/httpd/blob/trunk/docs/manual/mod/event.xml",
        "확인한 worker와 keep-alive 처리."
      ]
    ],
    "related": [
      "nginx",
      "caddy"
    ],
    "logoSource": "https://github.com/simple-icons/simple-icons",
    "logoAlt": "Apache HTTP Server 제품·프로젝트 심벌",
    "logoNote": "브랜드 심벌 · Simple Icons 제공 · 원본 형상",
    "aliases": [
      "아파치"
    ]
  },
  {
    "id": "gcs",
    "name": "Cloud Storage",
    "provider": "Google Cloud",
    "category": "storage",
    "type": "오브젝트 스토리지",
    "image": "gcs",
    "summary": "버킷 안의 객체로 파일을 보관하고 API·권한 정책으로 접근하는 Google Cloud 서비스입니다.",
    "definition": "Cloud Storage는 미디어·이미지·분석 파일·백업 같은 바이트를 객체로 저장하는 관리형 서비스입니다. 버킷·객체 이름으로 접근하고 메타데이터·세대 번호와 접근 정책을 이용해 변경과 권한을 관리합니다. Cloud CDN·인코딩·파일시스템 서비스와는 다른 제품입니다.",
    "useCases": [
      [
        "업로드 파일과 미디어 원본",
        "애플리케이션의 원본 파일을 보관하고 후속 처리·배치·전달망에 연결합니다."
      ],
      [
        "분석용 파일과 보관 데이터",
        "분석 작업이 읽을 파일과 백업을 접근 패턴에 맞는 저장·수명주기 정책으로 관리합니다."
      ]
    ],
    "concepts": [
      [
        "버킷·객체 이름",
        "객체와 정책의 경계를 정합니다. 파일처럼 보이는 prefix와 디렉터리 의미는 선택한 네임스페이스 기능에 맞춰 확인합니다."
      ],
      [
        "세대 번호와 조건부 변경",
        "객체의 세대 번호로 현재 버전을 식별하고 변경 조건을 명시해 덮어쓰기 충돌을 줄일 수 있습니다."
      ],
      [
        "IAM과 접근 경로",
        "서비스 계정·버킷 권한·서명 URL 등 실제 소비자가 파일을 읽는 경로의 인증을 설계합니다."
      ]
    ],
    "flow": [
      [
        "대상과 권한 결정",
        "버킷·객체 이름과 작업 주체를 정합니다."
      ],
      [
        "객체와 메타데이터 저장",
        "API·SDK로 업로드하고 결과를 확인합니다."
      ],
      [
        "소비 작업에서 읽기",
        "앱·분석·배치·CDN 원본에서 필요한 객체를 읽습니다."
      ]
    ],
    "points": [
      [
        "업로드 완료와 공개 상태를 분리",
        "파일이 존재하는 것과 소비자에게 읽을 권한이 있는 것은 다릅니다. 공개 범위·서명·서비스 계정 권한을 각각 검증합니다."
      ],
      [
        "덮어쓰기 충돌 조건을 명시",
        "객체 세대와 요청의 precondition을 사용해 예상하지 않은 변경을 감지하는 방식을 검토합니다."
      ],
      [
        "저장 정책과 전달 정책을 구분",
        "저장 클래스·수명주기는 객체 보관 결정입니다. CDN 캐시·사용자 URL·재생 권한은 별도로 연결합니다."
      ]
    ],
    "diagnostics": [
      [
        "업로드는 성공했는데 앱이 못 읽음",
        "정확한 객체 이름·세대·실행 계정의 권한과 접근 경로를 확인합니다."
      ],
      [
        "새 버전을 잘못 덮어씀",
        "객체 세대와 업로드의 precondition·애플리케이션 재시도 방식을 기록합니다."
      ]
    ],
    "example": {
      "title": "파일을 객체 경로에 연결",
      "description": "이미 존재하는 버킷과 권한을 가정한 gcloud 명령입니다.",
      "language": "gcloud CLI",
      "code": "gcloud storage cp ./segment-001.m4s \\\n  gs://example-media-bucket/videos/v1/segment-001.m4s",
      "note": "권한·버킷 위치·메타데이터·수명주기는 별도 구성입니다."
    },
    "sources": [
      [
        "Cloud Storage 제품 개요",
        "https://cloud.google.com/storage/docs/introduction",
        "버킷·객체와 저장 서비스 범위."
      ],
      [
        "요청 조건",
        "https://cloud.google.com/storage/docs/request-preconditions",
        "객체 세대와 조건부 변경."
      ],
      [
        "공식 Python SDK",
        "https://github.com/googleapis/python-storage",
        "추가 확인할 SDK·제품 예제."
      ]
    ],
    "related": [
      "s3",
      "cloudfront"
    ],
    "logoSource": "https://github.com/simple-icons/simple-icons",
    "logoAlt": "Cloud Storage 제품·프로젝트 심벌",
    "logoNote": "브랜드 심벌 · Simple Icons 제공 · 원본 형상",
    "aliases": [
      "구글 클라우드 스토리지",
      "GCS"
    ]
  },
  {
    "id": "ubuntu",
    "name": "Ubuntu Server",
    "provider": "Canonical",
    "category": "os",
    "type": "Linux 서버 배포판",
    "image": "ubuntu",
    "summary": "Linux 커널과 패키지·운영 도구를 묶어 HTTP 서버·애플리케이션을 실행하는 기반입니다.",
    "definition": "Canonical이 제공하는 Linux 서버 배포판입니다. 커널과 패키지·서비스 관리·보안 업데이트 경로를 묶어 서버 실행 환경을 구성합니다. LTS라는 이름만으로 특정 설치의 모든 패키지 지원 조건을 단정하지 않고 실제 릴리스·저장소·지원 범위를 확인합니다.",
    "useCases": [
      [
        "서버 애플리케이션 실행",
        "NGINX·데이터베이스·배치 작업 등이 사용할 파일·메모리·네트워크 기반을 제공합니다."
      ],
      [
        "팀의 배포·운영 표준",
        "패키지·서비스 관리·계정·로그·모니터링·보안 업데이트를 일관된 운영 환경에 연결합니다."
      ]
    ],
    "concepts": [
      [
        "릴리스와 패키지",
        "OS 버전·패키지 저장소·보안 업데이트와 추가 빌드의 유지보수 책임을 정합니다."
      ],
      [
        "epoll·파일·소켓 I/O",
        "Linux 이벤트와 파일 전송 API를 이용할 수 있습니다. 어떤 경로가 쓰이는지는 앱 빌드·TLS·드라이버와 설정을 함께 봅니다."
      ],
      [
        "서비스의 실제 제한",
        "systemd 서비스의 FD·실행 계정·파일 경로 등은 셸 세션과 다를 수 있습니다. 실행 프로세스에 적용된 값을 확인합니다."
      ]
    ],
    "flow": [
      [
        "OS·패키지 준비",
        "릴리스와 업데이트 경로를 선택합니다."
      ],
      [
        "앱·장치·서비스 구성",
        "서버 프로그램과 드라이버·계정·서비스 제한을 구성합니다."
      ],
      [
        "실행·관측·업데이트",
        "실제 자원·오류와 업데이트 적용을 확인합니다."
      ]
    ],
    "points": [
      [
        "커널 이름만으로 성능을 결론내리지 않기",
        "같은 파일 분포·TLS·클라이언트 속도·하드웨어에서 CPU·디스크·네트워크를 함께 봅니다."
      ],
      [
        "앱 설정과 OS 설정의 경계 확인",
        "NGINX 연결 수를 높여도 서비스 FD 한도와 장치·파일 경로가 먼저 제한할 수 있습니다."
      ],
      [
        "업데이트와 복구 절차까지 운영 범위",
        "패키지 변경·커널 재부팅·설정 배포와 이전 버전 복구가 가능한지 확인합니다."
      ]
    ],
    "diagnostics": [
      [
        "셸에서는 되는데 서비스에서 실패",
        "실행 계정·작업 경로·환경 변수·서비스 제한과 접근 권한을 비교합니다."
      ],
      [
        "NIC 여유에도 전송이 느림",
        "물리 디스크 읽기·페이지 적중·TLS CPU·외부 경로와 앱 지표를 함께 확인합니다."
      ]
    ],
    "example": {
      "title": "실행 중인 환경과 한도 확인",
      "description": "설정 변경이 아닌 관측 명령 예입니다.",
      "language": "Linux 셸",
      "code": "cat /etc/os-release\nnginx -V\nsystemctl show nginx -p LimitNOFILE\nss -tin",
      "note": "해당 프로그램의 설치와 권한이 필요합니다. 명령 결과만으로 성능 병목이 확정되지는 않습니다."
    },
    "sources": [
      [
        "Ubuntu Server 공식 안내",
        "https://documentation.ubuntu.com/server/",
        "제품·프로젝트와 서버 운영 환경."
      ],
      [
        "NGINX 이벤트 처리 문서",
        "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/events.xml",
        "확인한 Linux epoll과 OS별 이벤트 처리 조건."
      ]
    ],
    "related": [
      "freebsd",
      "nginx"
    ],
    "logoSource": "https://github.com/simple-icons/simple-icons",
    "logoAlt": "Ubuntu Server 제품·프로젝트 심벌",
    "logoNote": "브랜드 심벌 · Simple Icons 제공 · 원본 형상",
    "aliases": [
      "우분투"
    ]
  },
  {
    "id": "debian",
    "name": "Debian",
    "provider": "Debian Project",
    "category": "os",
    "type": "Linux 서버 배포판",
    "image": "debian",
    "summary": "Linux 커널과 패키지·운영 도구를 묶어 HTTP 서버·애플리케이션을 실행하는 기반입니다.",
    "definition": "커뮤니티가 개발하는 Linux 배포판입니다. 커널·패키지 저장소·설치 및 관리 도구로 서버를 구성합니다. 특정 회사의 CDN 제품이 아니며 HTTP 서버·스토리지·관측과 업데이트 정책은 별도로 정해야 합니다.",
    "useCases": [
      [
        "서버 애플리케이션 실행",
        "NGINX·데이터베이스·배치 작업 등이 사용할 파일·메모리·네트워크 기반을 제공합니다."
      ],
      [
        "팀의 배포·운영 표준",
        "패키지·서비스 관리·계정·로그·모니터링·보안 업데이트를 일관된 운영 환경에 연결합니다."
      ]
    ],
    "concepts": [
      [
        "릴리스와 패키지",
        "OS 버전·패키지 저장소·보안 업데이트와 추가 빌드의 유지보수 책임을 정합니다."
      ],
      [
        "epoll·파일·소켓 I/O",
        "Linux 이벤트와 파일 전송 API를 이용할 수 있습니다. 어떤 경로가 쓰이는지는 앱 빌드·TLS·드라이버와 설정을 함께 봅니다."
      ],
      [
        "서비스의 실제 제한",
        "systemd 서비스의 FD·실행 계정·파일 경로 등은 셸 세션과 다를 수 있습니다. 실행 프로세스에 적용된 값을 확인합니다."
      ]
    ],
    "flow": [
      [
        "OS·패키지 준비",
        "릴리스와 업데이트 경로를 선택합니다."
      ],
      [
        "앱·장치·서비스 구성",
        "서버 프로그램과 드라이버·계정·서비스 제한을 구성합니다."
      ],
      [
        "실행·관측·업데이트",
        "실제 자원·오류와 업데이트 적용을 확인합니다."
      ]
    ],
    "points": [
      [
        "커널 이름만으로 성능을 결론내리지 않기",
        "같은 파일 분포·TLS·클라이언트 속도·하드웨어에서 CPU·디스크·네트워크를 함께 봅니다."
      ],
      [
        "앱 설정과 OS 설정의 경계 확인",
        "NGINX 연결 수를 높여도 서비스 FD 한도와 장치·파일 경로가 먼저 제한할 수 있습니다."
      ],
      [
        "업데이트와 복구 절차까지 운영 범위",
        "패키지 변경·커널 재부팅·설정 배포와 이전 버전 복구가 가능한지 확인합니다."
      ]
    ],
    "diagnostics": [
      [
        "셸에서는 되는데 서비스에서 실패",
        "실행 계정·작업 경로·환경 변수·서비스 제한과 접근 권한을 비교합니다."
      ],
      [
        "NIC 여유에도 전송이 느림",
        "물리 디스크 읽기·페이지 적중·TLS CPU·외부 경로와 앱 지표를 함께 확인합니다."
      ]
    ],
    "example": {
      "title": "실행 중인 환경과 한도 확인",
      "description": "설정 변경이 아닌 관측 명령 예입니다.",
      "language": "Linux 셸",
      "code": "cat /etc/os-release\nnginx -V\nsystemctl show nginx -p LimitNOFILE\nss -tin",
      "note": "해당 프로그램의 설치와 권한이 필요합니다. 명령 결과만으로 성능 병목이 확정되지는 않습니다."
    },
    "sources": [
      [
        "Debian 공식 안내",
        "https://www.debian.org/intro/about",
        "제품·프로젝트와 서버 운영 환경."
      ],
      [
        "NGINX 이벤트 처리 문서",
        "https://github.com/nginx/nginx.org/blob/master/xml/en/docs/events.xml",
        "확인한 Linux epoll과 OS별 이벤트 처리 조건."
      ]
    ],
    "related": [
      "freebsd",
      "nginx"
    ],
    "logoSource": "https://github.com/simple-icons/simple-icons",
    "logoAlt": "Debian 제품·프로젝트 심벌",
    "logoNote": "브랜드 심벌 · Simple Icons 제공 · 원본 형상",
    "aliases": [
      "데비안"
    ]
  },
  {
    "id": "fastly",
    "name": "Fastly CDN",
    "provider": "Fastly",
    "category": "delivery",
    "type": "관리형 CDN",
    "image": "fastly",
    "summary": "엣지 네트워크에서 원본의 콘텐츠를 캐시하고 요청 정책에 따라 전달합니다.",
    "definition": "Fastly가 운영하는 엣지 전달 서비스입니다. 원본을 서비스에 연결하고 캐시·전달·무효화 설정으로 사용자 요청을 처리합니다. 엣지 기능과 캐시를 어디까지 사용할지는 선택 제품과 설정에 따라 정합니다.",
    "useCases": [
      [
        "반복되는 정적 콘텐츠 전달",
        "이미지·미디어 파일 등 원본의 바이트를 여러 사용자에게 전달할 때 캐시·원본 경로를 구성합니다."
      ],
      [
        "원본 앞 요청 정책",
        "도메인·TLS·접근 정책·캐시·갱신을 서비스 요구에 맞춰 연결합니다."
      ]
    ],
    "concepts": [
      [
        "서비스와 원본",
        "서비스 도메인·원본 호스트·TLS·경로와 요청 정책을 연결합니다."
      ],
      [
        "캐시와 무효화",
        "객체를 어떤 키로 저장하고 갱신·무효화할지 정합니다. 원본 변경과 이미 캐시된 응답은 다른 상태입니다."
      ],
      [
        "전달 정책과 관측",
        "캐시 상태·원본 오류·첫 바이트·요청별 전송량으로 실제 경로를 확인합니다."
      ]
    ],
    "flow": [
      [
        "원본·도메인 연결",
        "요청이 전달 서비스를 경유하도록 구성합니다."
      ],
      [
        "캐시와 요청 정책 평가",
        "재사용 가능한 객체와 적용 규칙을 확인합니다."
      ],
      [
        "캐시 또는 원본 응답",
        "바이트를 전달하고 상태·원본 오류를 관측합니다."
      ]
    ],
    "points": [
      [
        "파일 정체성을 유지",
        "같은 키에 다른 버전·권한별 바이트가 섞이지 않도록 캐시 키와 접근 검증을 설계합니다."
      ],
      [
        "캐시가 없을 때도 시험",
        "인기 파일이 이미 있는 상태뿐 아니라 원본 미스·동시 미스·원본 거절에서의 동작을 봅니다."
      ],
      [
        "무효화와 버전 URL을 구분",
        "원본·엣지·브라우저의 변경 반영 정책을 나누어 정합니다. 구체적 객체 크기·Range 조건은 현재 제품 문서로 확인합니다."
      ]
    ],
    "diagnostics": [
      [
        "원본과 엣지 응답이 다름",
        "요청 Host·캐시 키·유효 정책·권한·원본과 엣지의 객체 버전을 비교합니다."
      ],
      [
        "원본 트래픽이 갑자기 증가",
        "대량 미스·키의 과도한 분산·무효화·재시도 증폭과 캐시 상태를 확인합니다."
      ]
    ],
    "example": {
      "title": "원본과 엣지 요청을 연결",
      "description": "제품 설정 문법이 아닌 일반 CDN의 역할 연결입니다.",
      "language": "설계 연결 예",
      "code": "client URL → edge request policy\n           → cache identity / freshness\n           → cached response or origin request",
      "note": "현재 제품별 정책·영상 범위·크기·Range 조건은 공식 문서로 정합니다."
    },
    "sources": [
      [
        "Fastly CDN 공식 문서",
        "https://www.fastly.com/documentation/",
        "제품 범위·원본·캐시·요청 설정."
      ],
      [
        "HTTP 캐싱 표준",
        "https://www.rfc-editor.org/rfc/rfc9111.html",
        "공유 저장·신선도·재검증의 일반 원리."
      ]
    ],
    "related": [
      "cloudfront",
      "s3"
    ],
    "logoSource": "https://github.com/simple-icons/simple-icons",
    "logoAlt": "Fastly CDN 제품·프로젝트 심벌",
    "logoNote": "브랜드 심벌 · Simple Icons 제공 · 원본 형상",
    "aliases": [
      "패스트리"
    ]
  },
  {
    "id": "cloudflare",
    "name": "Cloudflare CDN",
    "provider": "Cloudflare",
    "category": "delivery",
    "type": "관리형 CDN",
    "image": "cloudflare",
    "summary": "엣지 네트워크에서 원본의 콘텐츠를 캐시하고 요청 정책에 따라 전달합니다.",
    "definition": "Cloudflare 네트워크를 경유하는 요청에 캐시·전달 규칙을 적용하는 CDN입니다. 원본과 도메인을 연결해 콘텐츠를 전달하며, 영상 관리·인코딩 제품인 Cloudflare Stream과는 제공 범위가 다릅니다.",
    "useCases": [
      [
        "반복되는 정적 콘텐츠 전달",
        "이미지·미디어 파일 등 원본의 바이트를 여러 사용자에게 전달할 때 캐시·원본 경로를 구성합니다."
      ],
      [
        "원본 앞 요청 정책",
        "도메인·TLS·접근 정책·캐시·갱신을 서비스 요구에 맞춰 연결합니다."
      ]
    ],
    "concepts": [
      [
        "도메인과 원본",
        "프록시 경로·원본 주소·Host·TLS와 접근 권한을 구성합니다."
      ],
      [
        "Cache Rules",
        "경로·요청 조건에 맞춰 캐시 적격성과 정책을 정합니다. 실제 적용 규칙과 원본 헤더를 함께 봅니다."
      ],
      [
        "Origin Cache Control",
        "원본의 캐시 지시어가 실제 규칙과 어떻게 결합하는지 확인합니다. no-cache와 no-store는 같은 의미가 아닙니다."
      ]
    ],
    "flow": [
      [
        "원본·도메인 연결",
        "요청이 전달 서비스를 경유하도록 구성합니다."
      ],
      [
        "캐시와 요청 정책 평가",
        "재사용 가능한 객체와 적용 규칙을 확인합니다."
      ],
      [
        "캐시 또는 원본 응답",
        "바이트를 전달하고 상태·원본 오류를 관측합니다."
      ]
    ],
    "points": [
      [
        "CDN과 Stream의 범위를 구분",
        "파일 전달을 구성하는 결정과 업로드·인코딩·플레이어를 포함한 영상 관리 제품의 선택은 다릅니다. 영상 사용 범위·플랜·계약 조건은 현재 제품 문서로 확인합니다."
      ],
      [
        "헤더 이름만 보고 캐시를 추정하지 않기",
        "원본 Cache-Control과 적용 규칙·응답 캐시 상태를 대조합니다. 재검증과 저장 금지를 구분합니다."
      ],
      [
        "권한별 응답을 공유하지 않기",
        "사용자별로 바이트가 다르면 공유 저장 허용부터 정의합니다. 같은 바이트를 공유해도 요청마다 접근 권한을 확인해야 할 수 있습니다."
      ]
    ],
    "diagnostics": [
      [
        "원본과 엣지 응답이 다름",
        "요청 Host·캐시 키·유효 정책·권한·원본과 엣지의 객체 버전을 비교합니다."
      ],
      [
        "원본 트래픽이 갑자기 증가",
        "대량 미스·키의 과도한 분산·무효화·재시도 증폭과 캐시 상태를 확인합니다."
      ]
    ],
    "example": {
      "title": "원본과 엣지 요청을 연결",
      "description": "제품 설정 문법이 아닌 일반 CDN의 역할 연결입니다.",
      "language": "설계 연결 예",
      "code": "client URL → edge request policy\n           → cache identity / freshness\n           → cached response or origin request",
      "note": "현재 제품별 정책·영상 범위·크기·Range 조건은 공식 문서로 정합니다."
    },
    "sources": [
      [
        "Cloudflare CDN 공식 문서",
        "https://developers.cloudflare.com/cache/",
        "제품 범위·원본·캐시·요청 설정."
      ],
      [
        "HTTP 캐싱 표준",
        "https://www.rfc-editor.org/rfc/rfc9111.html",
        "공유 저장·신선도·재검증의 일반 원리."
      ],
      [
        "캐시 제어 공식 원문",
        "https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/cache/concepts/cache-control.mdx",
        "확인한 원본 캐시 제어 지시어 설명."
      ]
    ],
    "related": [
      "cloudfront",
      "s3"
    ],
    "logoSource": "https://github.com/simple-icons/simple-icons",
    "logoAlt": "Cloudflare CDN 제품·프로젝트 심벌",
    "logoNote": "브랜드 심벌 · Simple Icons 제공 · 원본 형상",
    "aliases": [
      "클라우드플레어"
    ]
  }
];

export const findTechnology = id => technologyCatalogue.find(technology => technology.id === id);
