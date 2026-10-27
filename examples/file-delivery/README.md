# HTTP 파일 전송 실습

NGINX가 실제로 `200`, `206`, `416`, `If-Range`를 어떻게 처리하는지 확인합니다. 임의의 10,000바이트 파일을 쓰며 영상 디코딩·인코딩은 다루지 않습니다. TLS·인증·공유 캐시가 없는 루프백 학습 환경입니다.

## 자동 실행

NGINX와 Python 3가 설치된 환경에서 저장소 루트에서 실행합니다.

```sh
python3 scripts/verify-delivery-lab.py --nginx nginx
# nginx가 PATH에 없다면 실행 파일의 절대 경로를 넘깁니다.
```

스크립트는 임시 디렉터리에 파일·로그를 만들고, [nginx.conf](nginx.conf)의 루프백 포트만 비어 있는 포트로 바꿔 실행합니다. 설정 검사 후 다음 응답의 상태·헤더·본문 바이트를 검증하고 서버와 임시 파일을 정리합니다. 결과는 `reports/delivery-lab-validation.json`에 남습니다. 이 검사는 실제 NGINX 실행 파일이 필요하며 `npm test`의 브라우저 검사와 별도입니다.

| 요청 조건 | 기대 결과 | 확인할 점 |
| --- | --- | --- |
| 일반 GET | 200, 10,000바이트 | 원본 전체와 본문 일치 |
| `Range: bytes=0-1023` | 206, 1,024바이트 | `Content-Range: bytes 0-1023/10000` |
| `Range: bytes=-256` | 206, 마지막 256바이트 | `9744-9999/10000` |
| `Range: bytes=10000-` | 416 | `Content-Range: bytes */10000` |
| 현재 ETag의 If-Range + 범위 | 206 | 요청한 범위와 본문 일치 |
| 다른 ETag의 If-Range + 범위 | 200, 전체 본문 | Content-Range 없음. 412가 아님 |
| 없는 파일 | 404 | 성공 페이지로 대체하지 않음 |

## 직접 요청하기

설정을 읽고 경로를 추적하려면 작업 디렉터리를 준비합니다. 아래 `demo.bin`은 미디어 파일이 아닌 결정적인 바이트 표본입니다.

```sh
mkdir -p /tmp/atlas-http-lab/data/media /tmp/atlas-http-lab/logs
cp examples/file-delivery/nginx.conf /tmp/atlas-http-lab/nginx.conf
python3 - <<'PY'
from pathlib import Path
Path('/tmp/atlas-http-lab/data/media/demo.bin').write_bytes(bytes(i % 256 for i in range(10000)))
PY
nginx -p /tmp/atlas-http-lab/ -c nginx.conf -t
nginx -p /tmp/atlas-http-lab/ -c nginx.conf
```

서버는 포그라운드에서 실행됩니다. 다른 터미널에서 요청합니다.

```sh
curl -sS -D - -o /dev/null http://127.0.0.1:8080/media/demo.bin
curl -sS -D - -o /dev/null -H 'Range: bytes=0-1023' http://127.0.0.1:8080/media/demo.bin
curl -sS -D - -o /dev/null -H 'Range: bytes=10000-' http://127.0.0.1:8080/media/demo.bin
curl -sS -D - -o /dev/null -H 'Range: bytes=1024-2047' -H 'If-Range: "old-version"' http://127.0.0.1:8080/media/demo.bin
```

`root data`는 NGINX prefix 아래 `data`에 **전체 URI**를 더합니다. 따라서 `/media/demo.bin`은 `/tmp/atlas-http-lab/data/media/demo.bin`입니다. `alias`나 Caddy의 `handle_path`처럼 prefix를 제거하는 설정으로 바꾸면 경로 의미가 달라집니다.

`logs/access.log`에는 상태·본문 전송량·요청 시간·Range가 남습니다. `request_time`은 다운로드 대기까지 포함하므로 디스크 읽기 시간으로 해석하지 않습니다. `worker_connections 128`은 작은 실습용 값입니다. 종료는 서버 터미널에서 Ctrl+C로 합니다.

이 실습 결과는 HTTP 의미론의 확인입니다. Linux에서 실행한 결과로 FreeBSD의 `sendfile`·KTLS·NIC offload나 Netflix 장비의 성능을 검증했다고 주장하지 않습니다.
