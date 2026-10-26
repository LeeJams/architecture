"""Build the review artifact without a server or external runtime assets."""
from pathlib import Path
import base64
import mimetypes
import re
from html import escape

root = Path(__file__).resolve().parent.parent
document = (root / "index.html").read_text()
document = document.replace(
    '<link rel="stylesheet" href="styles.css">',
    "<style>\n" + (root / "styles.css").read_text() + "\n</style>",
)
document = document.replace(
    '<script src="app.js"></script>',
    "<script>\n" + (root / "app.js").read_text() + "\n</script>",
)
paths = set(re.findall(r'assets/[A-Za-z0-9_./-]+\.(?:svg|png|jpg|jpeg|woff2?)', document))
for relative in sorted(paths, key=len, reverse=True):
    asset = (root / relative).resolve(strict=True)
    if not asset.is_relative_to(root / "assets"):
        raise ValueError(f"Asset outside the expected directory: {relative}")
    mime = mimetypes.guess_type(asset.name)[0]
    if not mime or not mime.startswith(("image/", "font/")):
        raise ValueError(f"Unexpected asset type: {relative}")
    payload = base64.b64encode(asset.read_bytes()).decode("ascii")
    document = document.replace(relative, f"data:{mime};base64,{payload}")

output = root / "openconnect-visual-study.html"
licenses = "\n".join(path.read_text() for path in sorted((root / "assets/fonts").glob("*-LICENSE.txt")))
document = document.replace("</body>", '<template id="font-licenses"><pre>' + escape(licenses) + '</pre></template>\n</body>')
output.write_text(document)
print(f"Built {output.name}: {len(paths)} embedded assets, {output.stat().st_size:,} bytes")
