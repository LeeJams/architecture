// Detailed profiles for the shared technology catalogue.
export const dataPlatformTechnologies = [
  {
    id: "sqlite",
    name: "SQLite",
    provider: "SQLite 개발팀 · SQLite 프로젝트",
    category: "database",
    type: "임베디드 관계형 데이터베이스",
    summary:
      "별도 DB 서버 프로세스 없이 애플리케이션에 연결해 SQL과 트랜잭션으로 파일 데이터를 다루는 DB입니다.",
    definition:
      "SQLite는 라이브러리로 프로세스에 포함되는 관계형 데이터베이스입니다. 서버 연결 대신 파일과 저널을 다루며, WAL 모드에서는 읽기와 쓰기의 동시성이 개선되지만 동시에 여러 쓰기 트랜잭션이 실행되는 모델은 아닙니다. 파일 접근 권한·디스크·잠금·백업도 운영 계약입니다.",
    useCases: [
      [
        "모바일·데스크톱의 로컬 데이터",
        "앱의 설정·기록·오프라인 자료를 SQL과 트랜잭션으로 관리합니다.",
      ],
      [
        "단일 노드의 데이터 처리",
        "별도 서버 운영 없이 적절한 쓰기량의 서비스·도구·테스트를 구성합니다.",
      ],
    ],
    concepts: [
      [
        "프로세스 안의 DB 엔진",
        "SQLite는 DB 서버가 아니라 라이브러리입니다. 여러 연결이 같은 파일을 열 수 있어도 파일 잠금 규칙을 따릅니다.",
      ],
      [
        "WAL과 단일 작성자",
        "WAL은 변경을 로그에 기록하고 읽기 스냅샷을 유지합니다. 쓰기 경합·checkpoint·긴 읽기 트랜잭션을 관찰합니다.",
      ],
      [
        "트랜잭션과 자료형",
        "명시적 트랜잭션·제약·자료형 규칙을 확인합니다. 일반 테이블의 타입 유연성과 STRICT 테이블은 구분합니다.",
      ],
    ],
    flow: [
      ["연결·모드 설정", "파일 권한·저널·타임아웃과 제약을 정합니다."],
      ["SQL·트랜잭션 실행", "잠금과 스냅샷 규칙 안에서 읽고 변경합니다."],
      ["커밋·checkpoint·백업", "저널과 DB 파일의 일관성을 유지해 보관합니다."],
    ],
    points: [
      [
        "쓰기 트랜잭션을 짧게",
        "락을 잡은 상태에서 긴 외부 작업을 하지 않고 busy·재시도 정책을 둡니다.",
      ],
      [
        "파일 복사와 백업 구분",
        "WAL·공유 메모리·활성 연결을 고려하고 공식 백업 API나 일관된 스냅샷 경로를 사용합니다.",
      ],
      [
        "여러 서버의 공유 파일 경계",
        "네트워크 파일시스템에 파일을 두는 것을 분산 DB로 보지 않습니다. 잠금·WAL의 지원 조건을 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "database is locked가 반복",
        "긴 쓰기·읽기 트랜잭션, 연결 수와 busy 타임아웃·checkpoint 상태를 봅니다.",
      ],
      [
        "DB 파일을 옮겼더니 변경이 누락",
        "WAL과 활성 트랜잭션을 제외한 단순 복사인지 확인하고 백업 경로를 검토합니다.",
      ],
    ],
    example: {
      title: "쓰기 트랜잭션과 WAL 선택",
      description: "로컬 SQLite DB에서 실행하는 SQL 예제입니다.",
      language: "SQL",
      code: "PRAGMA journal_mode = WAL;\nCREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, title TEXT NOT NULL);\nBEGIN IMMEDIATE;\nINSERT INTO notes(title) VALUES ('첫 메모');\nCOMMIT;\nSELECT id, title FROM notes ORDER BY id DESC LIMIT 20;",
      note: "동시 작성 시 busy 오류와 재시도를 처리해야 합니다. WAL 모드의 파일·디렉터리 접근 조건도 확인합니다.",
    },
    rationale: {
      short:
        "서버 운영 없이 앱 안에서 질의·제약·원자적 변경이 필요할 때 유용합니다.",
      problem:
        "파일·JSON만으로 관계·인덱스·동시 변경의 일관성을 유지하기 어려울 수 있습니다.",
      change:
        "프로세스 안에 DB 엔진을 연결해 SQL과 트랜잭션으로 파일을 다룹니다.",
      decisions: [
        {
          gainTitle: "작은 운영 경계",
          gain: "별도 DB 서버 없이 질의·트랜잭션을 사용합니다.",
          costTitle: "파일 운영",
          cost: "권한·디스크·잠금·일관된 백업을 관리합니다.",
        },
        {
          gainTitle: "로컬 자료 관리",
          gain: "인덱스와 SQL로 앱 데이터를 다룹니다.",
          costTitle: "쓰기 동시성",
          cost: "단일 작성자와 실제 쓰기량에 맞춰 설계합니다.",
        },
      ],
      ask: "단일 노드·파일 기반 운영과 쓰기 경합 조건이 맞나요?",
      simpler:
        "여러 서버의 높은 동시 쓰기·중앙 관리가 필요하면 PostgreSQL 같은 서버형 DB와 비교하세요.",
    },
    related: ["postgresql", "mysql", "localstorage"],
    aliases: ["에스큐엘라이트", "시퀄라이트", "SQLite3"],
    image: "sqlite",
    sources: [
      [
        "SQLite · Wal-Mode Blocking Locks",
        "https://github.com/sqlite/sqlite/blob/master/doc/wal-lock.md",
        "SQLite 공식 저장소의 WAL 잠금과 구현 설명. 단일 작성자·읽기·checkpoint의 경계.",
      ],
      [
        "SQLite · wal.c",
        "https://github.com/sqlite/sqlite/blob/master/src/wal.c",
        "SQLite 공식 저장소의 WAL 잠금과 구현 설명. 단일 작성자·읽기·checkpoint의 경계.",
      ],
      [
        "SQLite 공식 문서 · 추가 읽기",
        "https://www.sqlite.org/docs.html",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/sqlite/sqlite-original.svg",
    logoAlt: "SQLite 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "mariadb",
    name: "MariaDB",
    provider: "MariaDB 프로젝트 · MariaDB 커뮤니티",
    category: "database",
    type: "관계형 데이터베이스 서버",
    summary:
      "SQL·인덱스·트랜잭션과 복제로 업무 데이터를 다루는 MySQL 계열 관계형 DB입니다.",
    definition:
      "MariaDB는 MySQL에서 분기된 관계형 데이터베이스 서버입니다. 호환되는 사용 경로가 있지만 버전·SQL 기능·자료형·복제·인증·도구가 계속 같다고 가정하면 안 됩니다. InnoDB 등 저장 엔진의 트랜잭션·잠금·복구 조건을 확인해야 합니다.",
    useCases: [
      [
        "업무 데이터와 SQL",
        "사용자·주문·재고처럼 제약과 트랜잭션이 필요한 자료를 관리합니다.",
      ],
      [
        "MySQL 계열 앱 운영",
        "기존 커넥터·질의 자산을 검토하되 실제 버전과 기능의 호환성을 시험합니다.",
      ],
    ],
    concepts: [
      [
        "저장 엔진",
        "테이블의 엔진에 따라 트랜잭션·잠금·인덱스·복구 성질이 달라집니다.",
      ],
      [
        "MVCC와 잠금",
        "읽기 스냅샷과 쓰기 경쟁을 구분합니다. 격리 수준·락 대기·deadlock 재시도를 설계합니다.",
      ],
      [
        "버전과 호환성",
        "MySQL과 JSON·함수·인증·복제·운영 도구의 차이를 확인합니다. 같은 프로토콜이 완전한 기능 호환을 뜻하지는 않습니다.",
      ],
    ],
    flow: [
      ["스키마·연결 설정", "자료형·제약·엔진·권한을 구성합니다."],
      ["질의·트랜잭션", "실행 계획과 잠금 규칙에 따라 읽고 변경합니다."],
      ["커밋·복제·복구", "저장과 복제·백업의 성공 경계를 확인합니다."],
    ],
    points: [
      [
        "실제 실행 계획 확인",
        "ORM·SQL 표현만 보고 판단하지 말고 인덱스·정렬·반환량을 관찰합니다.",
      ],
      [
        "deadlock과 재시도",
        "트랜잭션 범위·잠금 순서와 재시도 시 부수 효과의 중복을 확인합니다.",
      ],
      [
        "이전·복제 검증",
        "버전 간 호환·문자셋·콜레이션·함수와 복제 구성을 실제 자료로 검증합니다.",
      ],
    ],
    diagnostics: [
      [
        "같은 질의가 다른 버전에서 느려짐",
        "통계·실행 계획·인덱스·기능·옵티마이저와 설정 차이를 봅니다.",
      ],
      [
        "경합 때 트랜잭션 실패",
        "잠금 대기·deadlock 로그·갱신 순서와 긴 트랜잭션을 확인합니다.",
      ],
    ],
    example: {
      title: "InnoDB 트랜잭션의 롤백 확인",
      description:
        "학습용 MariaDB 데이터베이스에서 고유한 테이블 이름으로 실행합니다.",
      language: "SQL",
      code: "CREATE TABLE demo_notes (id BIGINT PRIMARY KEY, title VARCHAR(200) NOT NULL) ENGINE=InnoDB;\nSTART TRANSACTION;\nINSERT INTO demo_notes(id, title) VALUES (1, '메모');\nROLLBACK;\nSELECT * FROM demo_notes;",
      note: "마지막 조회에는 롤백한 행이 없습니다. DDL의 커밋 조건과 다른 저장 엔진·버전의 동작은 별도로 확인합니다.",
    },
    rationale: {
      short:
        "관계·제약과 SQL·트랜잭션으로 여러 사용자의 데이터를 관리할 때 필요합니다.",
      problem:
        "앱 서버마다 값을 보관하면 동시 변경·관계·복구를 일관되게 처리하기 어렵습니다.",
      change: "중앙 DB 서버에 스키마·질의·트랜잭션의 규칙을 둡니다.",
      decisions: [
        {
          gainTitle: "SQL과 생태계",
          gain: "관계형 모델과 기존 MySQL 계열 도구를 검토합니다.",
          costTitle: "호환성 점검",
          cost: "버전·기능·엔진·도구의 차이를 검증합니다.",
        },
        {
          gainTitle: "원자적 변경",
          gain: "지원 엔진의 트랜잭션으로 변경을 묶습니다.",
          costTitle: "경합과 운영",
          cost: "락·복제·용량·백업을 관리합니다.",
        },
      ],
      ask: "기존 MySQL 자산과 필요한 MariaDB 기능이 맞나요?",
      simpler:
        "새로운 서비스라면 MySQL·PostgreSQL과 데이터 모델·운영 도구를 함께 비교하세요.",
    },
    related: ["mysql", "postgresql", "laravel"],
    aliases: ["마리아DB", "마리아디비", "Maria DB"],
    image: "mariadb",
    sources: [
      [
        "MariaDB · read0read.cc",
        "https://github.com/MariaDB/server/blob/11.4/storage/innobase/read/read0read.cc",
        "MariaDB 11.4 공식 소스의 프로젝트 안내와 InnoDB 읽기·스냅샷 구현. 현재 제품 조건은 대상 버전 문서를 확인합니다.",
      ],
      [
        "MariaDB · Code status:",
        "https://github.com/MariaDB/server/blob/11.4/README.md",
        "MariaDB 11.4 공식 소스의 프로젝트 안내와 InnoDB 읽기·스냅샷 구현. 현재 제품 조건은 대상 버전 문서를 확인합니다.",
      ],
      [
        "MariaDB 공식 문서 · 추가 읽기",
        "https://mariadb.com/docs/server",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/mariadb/mariadb-original.svg",
    logoAlt: "MariaDB 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "cassandra",
    name: "Apache Cassandra",
    provider: "Apache Software Foundation · Cassandra 커뮤니티",
    category: "database",
    type: "분산 와이드 컬럼 데이터베이스",
    summary:
      "파티션 키와 복제로 여러 노드에 자료를 나눠 저장하고 정해진 질의 경로로 읽는 분산 DB입니다.",
    definition:
      "Cassandra는 파티션 키로 데이터를 분산하고 복제본에 읽기·쓰기를 수행합니다. 관계형 조인보다 질의에 맞춘 테이블·비정규화가 중요하며, 일관성 수준·복제수·장애 조건·수리 작업을 함께 설계해야 합니다. 노드를 늘리면 모든 질의와 핫 파티션이 자동으로 해결되는 것은 아닙니다.",
    useCases: [
      [
        "키·시간별 많은 기록",
        "사용자·장치·기간별 이벤트를 예측 가능한 파티션으로 나눕니다.",
      ],
      [
        "노드 장애를 고려한 저장",
        "복제와 읽기·쓰기 정책을 정하고 수리·운영 작업을 수행합니다.",
      ],
    ],
    concepts: [
      [
        "파티션·클러스터링 키",
        "어느 노드 묶음에 자료가 놓이고 파티션 안에서 어떤 순서로 읽을지 정합니다.",
      ],
      [
        "일관성 수준과 복제",
        "응답에 필요한 복제본과 장애 허용·지연의 관계를 봅니다. 이를 전체 업무 트랜잭션의 직렬화로 일반화하지 않습니다.",
      ],
      [
        "tombstone과 수리",
        "삭제·만료 표식과 복제본의 차이를 관리합니다. TTL·컴팩션·repair가 읽기와 복구에 영향을 줍니다.",
      ],
    ],
    flow: [
      ["질의에 맞춘 키 선택", "조회 조건과 파티션 크기를 먼저 정합니다."],
      ["복제본 읽기·쓰기", "설정한 일관성 수준으로 요청을 처리합니다."],
      ["수리·컴팩션", "복제본 차이와 삭제·파일 정리를 운영합니다."],
    ],
    points: [
      [
        "파티션 크기를 제한",
        "사용자 하나에 모든 기록을 무기한 모으지 않고 기간·분산 키를 검토합니다.",
      ],
      [
        "일괄 처리의 의미 확인",
        "BATCH를 임의의 여러 파티션을 빠르게 쓰는 수단으로 일반화하지 않습니다.",
      ],
      [
        "삭제·시계·복구 관리",
        "타임스탬프·TTL·수리·컴팩션과 삭제의 보관·재등장 조건을 이해합니다.",
      ],
    ],
    diagnostics: [
      [
        "특정 사용자·시간대만 느림",
        "큰 파티션·핫 키·tombstone과 노드·디스크의 부하를 확인합니다.",
      ],
      [
        "장애 복구 뒤 값이 다르게 보임",
        "일관성 수준·시계·타임스탬프와 repair 상태를 확인합니다.",
      ],
    ],
    example: {
      title: "질의에 맞춰 사용자·날짜로 분할",
      description: "이미 선택한 keyspace 안에서 실행하는 CQL 예제입니다.",
      language: "CQL",
      code: "CREATE TABLE user_events (\n  user_id uuid, day date, event_id timeuuid, kind text,\n  PRIMARY KEY ((user_id, day), event_id)\n) WITH CLUSTERING ORDER BY (event_id DESC);\n\nSELECT event_id, kind FROM user_events\nWHERE user_id = 11111111-1111-1111-1111-111111111111\n  AND day = '2026-11-03' LIMIT 20;",
      note: "복제·일관성 수준·쓰기·기간별 파티션 크기는 별도로 정합니다. 임의 조건의 관계형 조회를 그대로 옮기는 모델이 아닙니다.",
    },
    rationale: {
      short:
        "키 기반 대량 자료를 분산·복제하고 질의 경로를 미리 설계할 때 유용합니다.",
      problem:
        "한 노드의 저장·쓰기 용량과 장애 범위를 넘어서는 자료를 운영해야 할 수 있습니다.",
      change: "파티션과 복제·질의 중심 테이블로 데이터 배치를 나눕니다.",
      decisions: [
        {
          gainTitle: "분산 배치와 복제",
          gain: "키 기반 자료를 여러 노드에 나눕니다.",
          costTitle: "질의 중심 모델",
          cost: "비정규화·파티션 크기·접근 경로를 먼저 정합니다.",
        },
        {
          gainTitle: "장애·일관성 정책",
          gain: "복제와 요청별 응답 정책을 선택합니다.",
          costTitle: "운영 복잡성",
          cost: "수리·컴팩션·삭제·핫 키를 지속 관리합니다.",
        },
      ],
      ask: "질의가 예측 가능하고 분산 운영·비정규화를 감당할 수 있나요?",
      simpler:
        "용량과 장애 요구가 작다면 PostgreSQL·MySQL로 모델과 실제 부하를 먼저 확인할 수 있습니다.",
    },
    related: ["postgresql", "mongodb", "kafka"],
    aliases: ["카산드라", "Cassandra", "아파치 카산드라"],
    image: "cassandra",
    sources: [
      [
        "Apache Cassandra · dynamo.adoc",
        "https://github.com/apache/cassandra/blob/trunk/doc/modules/cassandra/pages/architecture/dynamo.adoc",
        "Cassandra 공식 아키텍처 설명의 파티션·복제·일관성·수리와 삭제.",
      ],
      [
        "Apache Cassandra 공식 문서 · 추가 읽기",
        "https://cassandra.apache.org/doc/latest/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/cassandra/cassandra-original.svg",
    logoAlt: "Apache Cassandra 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "cockroachdb",
    name: "CockroachDB",
    provider: "Cockroach Labs · CockroachDB 기여자",
    category: "database",
    type: "분산 SQL 데이터베이스",
    summary:
      "SQL과 트랜잭션을 여러 노드의 복제·분산 저장에 연결하는 관계형 데이터베이스입니다.",
    definition:
      "CockroachDB는 SQL 계층과 분산된 복제 저장·트랜잭션을 제공합니다. PostgreSQL 호환 경로가 있지만 모든 확장·기능·운영 특성이 같은 것은 아닙니다. 직렬화 가능한 트랜잭션의 재시도, 데이터 지역성·복제 배치·노드 간 통신 비용을 함께 설계해야 합니다.",
    useCases: [
      [
        "분산 관계형 데이터",
        "관계형 질의와 트랜잭션을 유지하면서 노드 배치·복제를 운영합니다.",
      ],
      [
        "지역을 고려한 서비스",
        "자료의 위치·접근 지역과 장애·지연 요구를 연결합니다.",
      ],
    ],
    concepts: [
      [
        "분산 범위와 복제",
        "키 범위가 여러 노드에 배치되고 복제됩니다. 노드·지역 배치가 읽기·쓰기 지연에 영향을 줍니다.",
      ],
      [
        "트랜잭션 재시도",
        "직렬화 충돌 등으로 40001 오류가 발생하면 전체 트랜잭션의 재시도 경로가 필요합니다.",
      ],
      [
        "SQL 호환과 지역성",
        "지원 함수·확장·드라이버·스키마를 검증하고 자료가 자주 이동하는 경로를 관찰합니다.",
      ],
    ],
    flow: [
      ["SQL·트랜잭션 시작", "스키마와 격리 수준·데이터 위치를 정합니다."],
      ["분산 읽기·쓰기 조정", "범위와 복제본 사이에서 요청을 처리합니다."],
      [
        "커밋 또는 재시도",
        "성공·충돌을 구분하고 필요한 트랜잭션을 다시 실행합니다.",
      ],
    ],
    points: [
      [
        "재시도에 외부 효과를 넣지 않기",
        "DB 재시도가 메일·결제·외부 API를 중복 실행하지 않게 경계를 나눕니다.",
      ],
      [
        "지역 배치와 질의 함께 설계",
        "자료를 가까이 둬도 교차 지역 조인·쓰기의 비용이 사라지지는 않습니다.",
      ],
      [
        "PostgreSQL 호환성 시험",
        "사용 확장·SQL·마이그레이션·도구와 실제 버전의 지원을 확인합니다.",
      ],
    ],
    diagnostics: [
      [
        "경합 때 40001 발생",
        "트랜잭션 크기·핫 키·재시도 루프와 멱등 처리를 확인합니다.",
      ],
      [
        "노드를 늘렸는데 응답이 느려짐",
        "범위 배치·복제·네트워크·교차 지역 질의와 핫 키를 확인합니다.",
      ],
    ],
    example: {
      title: "명시적 직렬화 트랜잭션",
      description: "CockroachDB의 학습용 SQL입니다.",
      language: "SQL",
      code: "CREATE TABLE IF NOT EXISTS demo_counts (id INT PRIMARY KEY, n INT NOT NULL);\nINSERT INTO demo_counts VALUES (1, 0) ON CONFLICT (id) DO NOTHING;\nBEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nUPDATE demo_counts SET n = n + 1 WHERE id = 1 RETURNING n;\nCOMMIT;",
      note: "충돌로 40001이 반환되면 클라이언트에서 트랜잭션 전체 재시도가 필요합니다. 예제는 운영용 재시도 루프·다중 지역 배치를 구현하지 않습니다.",
    },
    rationale: {
      short: "분산 배치와 관계형 질의·트랜잭션을 함께 요구할 때 검토합니다.",
      problem:
        "관계형 데이터를 여러 노드·지역에 나누면서 변경의 일관성을 유지해야 할 수 있습니다.",
      change: "SQL 위에 분산 범위·복제·트랜잭션 조정을 연결합니다.",
      decisions: [
        {
          gainTitle: "분산 SQL",
          gain: "관계형 계약과 분산 배치를 함께 다룹니다.",
          costTitle: "호환·지연 검증",
          cost: "기능 차이와 노드·지역 통신 비용을 확인합니다.",
        },
        {
          gainTitle: "직렬화 가능한 변경",
          gain: "충돌을 감지해 트랜잭션 계약을 지킵니다.",
          costTitle: "애플리케이션 재시도",
          cost: "충돌·타임아웃·외부 효과의 중복을 설계합니다.",
        },
      ],
      ask: "단일 DB의 실제 한계와 지역·장애 요구를 확인했나요?",
      simpler:
        "PostgreSQL과 적절한 복제·용량 계획으로 시작해 분산 SQL의 필요를 검증할 수 있습니다.",
    },
    related: ["postgresql", "cassandra", "mysql"],
    aliases: ["코크로치DB", "Cockroach DB", "분산 SQL"],
    image: "cockroachdb",
    sources: [
      [
        "CockroachDB · Transactions",
        "https://github.com/cockroachdb/docs/blob/main/src/current/v25.1/transactions.md",
        "CockroachDB v25.1 공식 문서의 트랜잭션·40001 재시도 경계. 현재 지원 조건은 대상 버전에서 확인합니다.",
      ],
      [
        "CockroachDB · Transaction Retry Error Reference",
        "https://github.com/cockroachdb/docs/blob/main/src/current/v25.1/transaction-retry-error-reference.md",
        "CockroachDB v25.1 공식 문서의 트랜잭션·40001 재시도 경계. 현재 지원 조건은 대상 버전에서 확인합니다.",
      ],
      [
        "CockroachDB 공식 문서 · 추가 읽기",
        "https://www.cockroachlabs.com/docs/stable/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/simple-icons/simple-icons/develop/icons/cockroachlabs.svg",
    logoAlt: "Cockroach Labs의 브랜드 심벌",
    logoNote:
      "Simple Icons 원본 심벌 · 형상·색상 보존 · CC0-1.0 · Cockroach Labs의 브랜드 심벌을 표시합니다. 실제 DB 제품은 CockroachDB입니다.",
    logoScope: "brand",
  },
  {
    id: "neo4j",
    name: "Neo4j",
    provider: "Neo4j · Neo4j 커뮤니티",
    category: "database",
    type: "속성 그래프 데이터베이스",
    summary:
      "노드·관계·속성을 저장하고 Cypher 패턴으로 연결과 경로를 질의하는 그래프 DB입니다.",
    definition:
      "Neo4j는 엔티티를 노드로, 연결을 방향과 타입이 있는 관계로 다룹니다. Cypher로 패턴·경로를 표현하며 인덱스·제약·트랜잭션을 함께 구성합니다. 그래프를 저장했다는 이유만으로 무제한 경로 탐색이나 모든 관계형 질의가 빠르게 바뀌는 것은 아닙니다.",
    useCases: [
      [
        "연결·경로가 핵심인 자료",
        "추천 후보·관계·의존성·거래 연결의 패턴을 읽습니다.",
      ],
      [
        "관계가 여러 단계인 질의",
        "엔티티의 연결 형태를 Cypher로 표현하고 시작 노드와 탐색 범위를 제한합니다.",
      ],
    ],
    concepts: [
      [
        "노드·관계·속성",
        "관계의 방향·타입과 노드의 라벨·속성을 정하고 업무 키를 구분합니다.",
      ],
      [
        "MATCH 패턴과 경로",
        "시작점과 관계의 깊이·필터가 탐색량을 결정합니다. 큰 연결망의 무제한 탐색을 피합니다.",
      ],
      [
        "인덱스·제약·실행 계획",
        "시작 노드 검색과 유일성·질의 계획을 확인합니다. 그래프 모델에도 데이터 품질 규칙이 필요합니다.",
      ],
    ],
    flow: [
      ["엔티티와 연결 모델링", "노드·관계의 의미와 키·방향을 정합니다."],
      [
        "시작점과 패턴 탐색",
        "조건에 맞는 노드를 찾고 제한한 관계를 따라갑니다.",
      ],
      ["결과·변경 관리", "반환량과 트랜잭션·제약을 확인합니다."],
    ],
    points: [
      [
        "깊이·반환량 제한",
        "사용자가 임의로 거대한 경로를 탐색하지 않도록 질의 비용을 제한합니다.",
      ],
      [
        "MERGE와 동시 생성 검토",
        "원하는 업무 유일성이 제약으로 보장되는지 확인합니다.",
      ],
      [
        "관계형과 비교",
        "고정된 단순 관계라면 SQL 조인이 충분한지 실제 질의로 비교합니다.",
      ],
    ],
    diagnostics: [
      [
        "작은 질의가 거대한 결과를 반환",
        "관계 방향·카테시안 곱·가변 길이 경로와 반환 제한을 확인합니다.",
      ],
      [
        "같은 업무 대상 노드가 중복 생성",
        "업무 키·유일성 제약과 생성·MERGE 조건을 확인합니다.",
      ],
    ],
    example: {
      title: "시작점을 제한한 관계 조회",
      description:
        "Customer·Order 노드와 PLACED 관계가 존재한다는 가정의 Cypher입니다.",
      language: "Cypher",
      code: "MATCH (c:Customer {id: $customerId})-[:PLACED]->(o:Order)\nRETURN o.id AS id, o.createdAt AS createdAt\nORDER BY createdAt DESC\nLIMIT 20;",
      note: "매개변수로 값을 전달하고 시작 키의 인덱스·권한을 구성해야 합니다. 대량 관계의 실제 계획·결과량을 확인합니다.",
    },
    rationale: {
      short:
        "엔티티보다 연결과 여러 단계의 경로가 질의의 중심일 때 유용합니다.",
      problem:
        "많은 연결 패턴을 테이블 조합으로 표현하면 질의와 모델의 이해가 어려울 수 있습니다.",
      change: "관계를 데이터 모델의 직접적인 구성 요소로 둡니다.",
      decisions: [
        {
          gainTitle: "관계의 직접 표현",
          gain: "노드·관계 패턴으로 탐색을 작성합니다.",
          costTitle: "모델·도구 학습",
          cost: "Cypher와 그래프의 데이터·운영 규칙을 배워야 합니다.",
        },
        {
          gainTitle: "경로 질의",
          gain: "연결된 후보와 의존 경로를 다룹니다.",
          costTitle: "탐색 비용",
          cost: "깊이·분기·시작점·반환량을 통제합니다.",
        },
      ],
      ask: "실제 질의가 연결·경로 탐색을 중심으로 하나요?",
      simpler:
        "단순한 외래 키 관계는 PostgreSQL 같은 관계형 DB로 먼저 비교할 수 있습니다.",
    },
    related: ["postgresql", "mongodb", "graphql"],
    aliases: ["네오포제이", "네오4j", "그래프 DB"],
    image: "neo4j",
    sources: [
      [
        "Neo4j · match.adoc",
        "https://github.com/neo4j/docs-cypher/blob/dev/modules/ROOT/pages/clauses/match.adoc",
        "Neo4j Cypher 공식 문서의 MATCH 패턴·경로·질의 설명.",
      ],
      [
        "Neo4j 공식 문서 · 추가 읽기",
        "https://neo4j.com/docs/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/neo4j/neo4j-original.svg",
    logoAlt: "Neo4j 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "elasticsearch",
    name: "Elasticsearch",
    provider: "Elastic · Elasticsearch 기여자",
    category: "search",
    type: "분산 검색·분석 엔진",
    summary:
      "문서를 역색인하고 분석기·질의·집계로 텍스트 검색과 탐색을 제공하는 검색 엔진입니다.",
    definition:
      "Elasticsearch는 문서 필드를 매핑·분석해 검색용 인덱스를 만듭니다. text·keyword의 차이와 shard·replica·refresh·색인 갱신을 이해해야 합니다. 원본 DB와 검색 인덱스의 동기화는 별도 경로이며 검색 가능해진 시점과 변경 요청의 성공을 같은 것으로 보지 않습니다.",
    useCases: [
      [
        "상품·문서·사이트 검색",
        "분석한 텍스트의 관련도와 정형 조건·집계를 함께 사용합니다.",
      ],
      [
        "로그·탐색용 보조 인덱스",
        "조회 목적의 인덱스로 필터·집계를 제공하고 보관·권한·원본 경로를 정합니다.",
      ],
    ],
    concepts: [
      [
        "text·keyword와 분석기",
        "text는 분석 후 검색하고 keyword는 정확한 값·집계에 사용합니다. 언어와 분석 조건을 맞춥니다.",
      ],
      [
        "역색인·shard·replica",
        "검색 자료가 shard로 나뉘고 복제됩니다. 작은 shard를 무한히 늘리면 운영 비용이 커질 수 있습니다.",
      ],
      [
        "refresh와 가시성",
        "색인된 변경이 검색 결과에 보이기까지 경계가 있습니다. 원본 DB·갱신 파이프라인과 구분합니다.",
      ],
    ],
    flow: [
      [
        "매핑·분석 후 색인",
        "필드의 의미와 분석 규칙으로 검색 자료를 만듭니다.",
      ],
      [
        "질의·필터·집계",
        "shard에서 후보를 읽고 관련도·조건·집계를 조합합니다.",
      ],
      [
        "결과·갱신·보관",
        "결과를 반환하고 refresh·삭제·재색인·보관을 관리합니다.",
      ],
    ],
    points: [
      [
        "검색을 원본 데이터와 연결",
        "누락·지연·중복·재색인 경로를 두고 인덱스만 원본이라고 가정하지 않습니다.",
      ],
      [
        "매핑 변경과 재색인",
        "필드 타입·분석기 변경의 기존 자료 영향과 새 인덱스 전환을 설계합니다.",
      ],
      [
        "질의·수집 비용 통제",
        "큰 집계·깊은 페이지네이션·고카디널리티 필드·shard 수와 저장 비용을 관찰합니다.",
      ],
    ],
    diagnostics: [
      [
        "저장은 성공했는데 검색에 안 나옴",
        "원본→색인 동기화·실패·refresh·질의 분석기와 실제 인덱스를 확인합니다.",
      ],
      [
        "필터·집계가 이상하거나 느림",
        "text·keyword 매핑·실행 질의·반환량·shard 부하를 확인합니다.",
      ],
    ],
    example: {
      title: "정확한 조건과 텍스트 검색을 분리",
      description:
        "products 인덱스의 category는 keyword, title은 text로 정의됐다고 가정합니다.",
      language: "HTTP · JSON",
      code: 'POST /products/_search\n{\n  "size": 10,\n  "query": {\n    "bool": {\n      "filter": [{ "term": { "category": "book" } }],\n      "must": [{ "match": { "title": "분산 시스템" } }]\n    }\n  }\n}',
      note: "클러스터·인증·한국어 분석기·매핑·자료는 별도입니다. 질의 방식과 원본 DB의 권한 조건도 함께 맞춰야 합니다.",
    },
    rationale: {
      short:
        "텍스트 관련도·분석기·검색용 집계가 DB의 기본 검색을 넘어설 때 필요합니다.",
      problem:
        "업무 DB의 단순 문자열 조건만으로는 언어 분석·관련도·탐색 요구를 다루기 어려울 수 있습니다.",
      change: "검색 목적의 역색인과 질의·집계 계층을 별도로 구성합니다.",
      decisions: [
        {
          gainTitle: "검색 표현력",
          gain: "분석·정확한 필터·관련도·집계를 조합합니다.",
          costTitle: "동기화 책임",
          cost: "원본과 인덱스의 갱신·누락·재색인을 관리합니다.",
        },
        {
          gainTitle: "분산 검색",
          gain: "자료와 질의를 shard에 나눕니다.",
          costTitle: "운영 비용",
          cost: "shard·복제·힙·보관·제품 버전과 계약을 확인합니다.",
        },
      ],
      ask: "분석기·관련도·집계의 실제 요구와 운영 비용을 확인했나요?",
      simpler:
        "작은 검색은 PostgreSQL 전문 검색 등으로 시작하고 실제 검색 품질·부하를 비교할 수 있습니다.",
    },
    related: ["opensearch", "postgresql", "kafka"],
    aliases: ["엘라스틱서치", "Elastic Search", "ES 검색"],
    image: "elasticsearch",
    sources: [
      [
        "Elasticsearch · bool-query.asciidoc",
        "https://github.com/elastic/elasticsearch/blob/8.17/docs/reference/query-dsl/bool-query.asciidoc",
        "Elasticsearch 8.17 공식 보존 문서의 bool 질의·정확한 필터·검색 문맥. 현재 버전별 기능은 추가 문서를 확인합니다.",
      ],
      [
        "Elasticsearch 공식 문서 · 추가 읽기",
        "https://www.elastic.co/docs",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/devicons/devicon/blob/master/icons/elasticsearch/elasticsearch-original.svg",
    logoAlt: "Elasticsearch 식별용 심벌",
    logoNote: "Devicon 원본 심벌 · 형상·색상 보존 · MIT",
  },
  {
    id: "opensearch",
    name: "OpenSearch",
    provider: "OpenSearch Software Foundation · OpenSearch 커뮤니티",
    category: "search",
    type: "검색·분석 엔진",
    summary:
      "분산 문서 인덱스와 검색·집계를 제공하고 보안·관측 도구와 연결하는 검색 프로젝트입니다.",
    definition:
      "OpenSearch는 문서의 매핑·분석·색인과 검색·집계를 제공하는 프로젝트입니다. Elasticsearch에서 분기했지만 제품 버전·API·플러그인·클라이언트·보안 설정을 그대로 호환된다고 가정하면 안 됩니다. 원본 자료와 인덱스의 동기화·가시성·복구는 별도로 설계합니다.",
    useCases: [
      [
        "문서·상품·로그 검색",
        "분석기와 정확한 필터·집계를 조합해 자료를 탐색합니다.",
      ],
      [
        "검색 플랫폼 운영",
        "클러스터·권한·대시보드·보관 정책을 제품과 배포 형태에 맞춰 구성합니다.",
      ],
    ],
    concepts: [
      [
        "매핑·분석·질의",
        "text·keyword·날짜와 분석기를 자료 의미에 맞춰 정합니다.",
      ],
      [
        "refresh와 검색 가시성",
        "쓰기 응답과 검색에 보이는 시점을 구분하고 refresh의 실행 비용을 고려합니다.",
      ],
      [
        "호환·플러그인 경계",
        "OpenSearch·대시보드·클라이언트·플러그인 버전의 실제 조합을 검증합니다.",
      ],
    ],
    flow: [
      ["인덱스와 권한 구성", "필드 매핑·접근 정책과 자료 유입을 정합니다."],
      ["문서 색인·refresh", "검색할 문서를 기록하고 가시성 경계를 관리합니다."],
      ["검색·보관·복구", "조회·집계·삭제·스냅샷과 재색인을 운영합니다."],
    ],
    points: [
      [
        "제품 간 이전 검증",
        "인덱스 형식·API·보안·플러그인·질의를 대표 자료로 시험합니다.",
      ],
      [
        "즉시 검색의 비용 확인",
        "쓰기마다 강제 refresh를 요청해 처리량을 떨어뜨리지 않도록 합니다.",
      ],
      [
        "원본과 권한의 일치",
        "색인 자료가 원본보다 오래 남거나 더 넓게 공개되지 않도록 갱신·삭제·권한을 연결합니다.",
      ],
    ],
    diagnostics: [
      [
        "이전 후 클라이언트 요청 실패",
        "대상 버전·클라이언트의 호환 검사·API·인증·플러그인을 확인합니다.",
      ],
      [
        "색인 응답 후 검색 결과가 지연",
        "수집·색인 오류·refresh 정책·실제 조회 인덱스를 확인합니다.",
      ],
    ],
    example: {
      title: "필드의 검색 의미를 명시",
      description: "학습용 인덱스를 만드는 OpenSearch HTTP 요청 예입니다.",
      language: "HTTP · JSON",
      code: 'PUT /demo_articles\n{\n  "mappings": {\n    "properties": {\n      "title": { "type": "text" },\n      "category": { "type": "keyword" }\n    }\n  }\n}',
      note: "클러스터·인증·분석기·자료 입력은 별도입니다. 기존 필드의 의미를 임의로 변경하기보다 재색인·전환 경로를 확인합니다.",
    },
    rationale: {
      short:
        "전문 검색·분석과 원하는 OpenSearch 생태계·운영 형태가 필요할 때 검토합니다.",
      problem:
        "검색 인덱스·분석·탐색 도구를 원본 DB와 분리해 운영해야 할 수 있습니다.",
      change: "문서 인덱스와 질의·플러그인·운영 도구를 조합합니다.",
      decisions: [
        {
          gainTitle: "검색·분석 도구",
          gain: "매핑·분석기·검색·집계를 연결합니다.",
          costTitle: "원본 동기화",
          cost: "색인·삭제·가시성·재색인을 별도로 관리합니다.",
        },
        {
          gainTitle: "프로젝트·배포 선택",
          gain: "클라이언트·플러그인·관리형 배포를 검토합니다.",
          costTitle: "호환성 운영",
          cost: "제품 간 차이와 버전 조합·권한을 확인합니다.",
        },
      ],
      ask: "검색 품질·확장 기능·배포와 지원 조건이 요구에 맞나요?",
      simpler:
        "기본 DB 검색부터 부하를 확인하고 Elasticsearch와 기능·이전·운영 조건을 비교하세요.",
    },
    related: ["elasticsearch", "postgresql", "grafana"],
    aliases: ["오픈서치", "Open Search"],
    image: "opensearch",
    sources: [
      [
        "OpenSearch · Refresh index",
        "https://github.com/opensearch-project/documentation-website/blob/main/_api-reference/index-apis/refresh.md",
        "OpenSearch 공식 문서·구현의 refresh 가시성과 keyword 필드 매핑.",
      ],
      [
        "OpenSearch · KeywordFieldMapper.java",
        "https://github.com/opensearch-project/OpenSearch/blob/main/server/src/main/java/org/opensearch/index/mapper/KeywordFieldMapper.java",
        "OpenSearch 공식 문서·구현의 refresh 가시성과 keyword 필드 매핑.",
      ],
      [
        "OpenSearch 공식 문서 · 추가 읽기",
        "https://docs.opensearch.org/latest/",
        "현재 제품의 설정·지원 버전과 추가 기능을 확인하는 공식 문서입니다.",
      ],
    ],
    logoSource:
      "https://github.com/simple-icons/simple-icons/develop/icons/opensearch.svg",
    logoAlt: "OpenSearch 식별용 심벌",
    logoNote: "Simple Icons 원본 심벌 · 형상·색상 보존 · CC0-1.0",
  },
];
