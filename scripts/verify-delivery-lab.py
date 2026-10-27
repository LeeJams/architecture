"""Check the published learning config against a real NGINX binary, using only loopback."""
import argparse
import http.client
import json
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import time

root = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--nginx", default="nginx", help="Path to an installed NGINX executable")
args = parser.parse_args()
binary = shutil.which(args.nginx)
if not binary:
    parser.error("NGINX executable not found; pass --nginx /path/to/nginx")


def request(port, headers=None, path="/media/demo.bin"):
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=4)
    try:
        connection.request("GET", path, headers=headers or {})
        response = connection.getresponse()
        return response.status, dict(response.getheaders()), response.read()
    finally:
        connection.close()


report = {"binary": subprocess.check_output([binary, "-v"], stderr=subprocess.STDOUT, text=True).strip(), "checks": []}
with tempfile.TemporaryDirectory(prefix="atlas-delivery-") as temporary:
    prefix = Path(temporary)
    (prefix / "logs").mkdir()
    (prefix / "data/media").mkdir(parents=True)
    content = bytes(index % 256 for index in range(10000))
    (prefix / "data/media/demo.bin").write_bytes(content)
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    # Only replace the listening port; all file serving directives are the published fixture.
    config = (root / "examples/file-delivery/nginx.conf").read_text().replace("127.0.0.1:8080", f"127.0.0.1:{port}")
    (prefix / "nginx.conf").write_text(config)
    command = [binary, "-p", str(prefix) + "/", "-c", "nginx.conf"]
    subprocess.run(command + ["-t"], check=True, capture_output=True)
    process = subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    try:
        for attempt in range(60):
            if process.poll() is not None:
                raise RuntimeError(process.stderr.read().decode())
            try:
                status, headers, body = request(port)
                break
            except (OSError, http.client.HTTPException):
                time.sleep(0.05)
        else:
            raise RuntimeError("NGINX did not become ready on loopback")
        assert status == 200 and body == content
        assert headers["Content-Length"] == "10000"
        etag = headers["ETag"]
        report["checks"].append("GET: 200, Content-Length 10000, body equals the whole source")

        status, headers, body = request(port, {"Range": "bytes=0-1023"})
        assert status == 206 and body == content[:1024]
        assert headers["Content-Range"] == "bytes 0-1023/10000"
        assert headers["Content-Length"] == "1024"
        report["checks"].append("Range 0-1023: 206, Content-Range and all 1024 bytes match")

        status, headers, body = request(port, {"Range": "bytes=-256"})
        assert status == 206 and body == content[-256:]
        assert headers["Content-Range"] == "bytes 9744-9999/10000"
        report["checks"].append("Suffix -256: 206 and the last 256 source bytes match")

        status, headers, body = request(port, {"Range": "bytes=10000-"})
        assert status == 416 and headers["Content-Range"] == "bytes */10000"
        report["checks"].append("Out-of-bounds 10000-: 416 with current representation length")

        status, headers, body = request(port, {"Range": "bytes=1024-2047", "If-Range": etag})
        assert status == 206 and body == content[1024:2048]
        assert headers["Content-Range"] == "bytes 1024-2047/10000"
        report["checks"].append("Matching If-Range: 206, requested range and source bytes match")

        status, headers, body = request(port, {"Range": "bytes=1024-2047", "If-Range": '"old-version"'})
        assert status == 200 and body == content and "Content-Range" not in headers
        report["checks"].append("Mismatching If-Range: 200 whole body, no Content-Range (not 412)")

        status, headers, body = request(port, path="/media/missing.bin")
        assert status == 404
        report["checks"].append("Missing file: 404 rather than a fallback HTML success response")
    finally:
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
        process.stderr.close()

(root / "reports").mkdir(exist_ok=True)
(root / "reports/delivery-lab-validation.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
