import fs from "node:fs/promises";
import path from "node:path";
import { build } from "vite";
const root = path.resolve(import.meta.dirname, ".."),
  dist = path.join(root, "dist");
const result = await build({ mode: "standalone", build: { write: false } });
const output = result.output;
const read = (file) => {
  const item = output.find(
    (item) => item.fileName === file.replace(/^\.\//, "").replace(/^\//, ""),
  );
  if (!item) throw new Error(`Missing build asset: ${file}`);
  return item.type === "chunk" ? item.code : String(item.source);
};
let html = read("index.html");
for (const match of html.matchAll(
  /<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g,
)) {
  const code = read(match[1]).replace(/<\/script/gi, "<\\/script");
  html = html.replace(match[0], () => `<script type="module">${code}</script>`);
}
for (const match of html.matchAll(
  /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
)) {
  html = html.replace(match[0], () => `<style>${read(match[1])}</style>`);
}
for (const match of html.matchAll(
  /<link[^>]*rel="icon"[^>]*href="([^"]+)"[^>]*>/g,
)) {
  const payload = Buffer.from(read(match[1])).toString("base64");
  html = html.replace(match[1], `data:image/svg+xml;base64,${payload}`);
}
const licenses = [];
for (const file of (await fs.readdir(path.join(root, "assets/fonts"))).filter(
  (file) => file.endsWith("-LICENSE.txt"),
))
  licenses.push(
    await fs.readFile(path.join(root, "assets/fonts", file), "utf8"),
  );
for (const file of ["react.txt", "motion.txt"]) {
  licenses.push(await fs.readFile(path.join(root, "licenses", file), "utf8"));
}
await fs.cp(path.join(root, "licenses"), path.join(dist, "licenses"), {
  recursive: true,
});
await fs.copyFile(
  path.join(root, "THIRD_PARTY_NOTICES.md"),
  path.join(dist, "THIRD_PARTY_NOTICES.md"),
);
await fs.mkdir(path.join(dist, "assets/fonts"), { recursive: true });
for (const file of (await fs.readdir(path.join(root, "assets/fonts"))).filter(
  (file) => file.endsWith("-LICENSE.txt"),
)) {
  await fs.copyFile(
    path.join(root, "assets/fonts", file),
    path.join(dist, "assets/fonts", file),
  );
}
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
html = html.replace(
  "</body>",
  `<template id="third-party-licenses"><pre>${escape(licenses.join("\n"))}</pre></template></body>`,
);
if (
  /<(?:script|link)[^>]+(?:src|href)="(?:\.\/)?assets\//.test(html) ||
  /url\((?:["']?)(?:\.\.\/)?assets\//.test(html)
)
  throw new Error("Standalone build still contains external runtime assets.");
await fs.writeFile(path.join(root, "openconnect-visual-study.html"), html);
await fs.writeFile(path.join(dist, "openconnect-visual-study.html"), html);
console.log(
  `Built offline React HTML: ${Buffer.byteLength(html).toLocaleString()} bytes`,
);
