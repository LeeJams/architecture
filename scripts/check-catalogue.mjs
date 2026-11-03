import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  technologyCatalogue,
  technologyCategories,
} from "../src/data/technology-catalogue.js";

const root = path.resolve(import.meta.dirname, "..");
const ids = new Set(technologyCatalogue.map((tech) => tech.id));
const categories = new Set(technologyCategories.slice(1).map(([id]) => id));
assert.equal(
  ids.size,
  technologyCatalogue.length,
  "Technology IDs must be unique.",
);
const aliasesSource = fs.readFileSync(
  path.join(root, "src/data/assets.js"),
  "utf8",
);
const imageAliases = new Map(
  [
    ...aliasesSource.matchAll(
      /(?:["']([^"']+)["']|(\w+)):\s*["'](assets\/tech\/[^"']+)["']/g,
    ),
  ].map((match) => [match[1] || match[2], match[3]]),
);
function string(value, label) {
  assert(typeof value === "string" && value.trim().length > 0, label);
}
function pairs(value, min, label) {
  assert(Array.isArray(value) && value.length >= min, label);
  for (const pair of value) {
    assert.equal(pair.length, 2, label);
    pair.forEach((item) => string(item, label));
  }
}
for (const tech of technologyCatalogue) {
  const label = tech.id;
  assert(/^[a-z][a-z0-9-]*$/.test(label), label + " ID");
  for (const key of [
    "name",
    "provider",
    "type",
    "summary",
    "definition",
    "logoAlt",
    "logoNote",
  ])
    string(tech[key], `${label}.${key}`);
  assert(categories.has(tech.category), label + " category");
  pairs(tech.useCases, 2, label + " useCases");
  pairs(tech.concepts, 3, label + " concepts");
  pairs(tech.flow, 3, label + " flow");
  assert.equal(tech.flow.length, 3, label + " flow length");
  pairs(tech.points, 3, label + " points");
  pairs(tech.diagnostics, 2, label + " diagnostics");
  for (const key of ["title", "description", "language", "code", "note"])
    string(tech.example?.[key], `${label}.example.${key}`);
  for (const key of ["short", "problem", "change", "ask", "simpler"])
    string(tech.rationale?.[key], `${label}.rationale.${key}`);
  assert(tech.rationale.decisions.length >= 2, label + " decision pairs");
  for (const pair of tech.rationale.decisions)
    for (const key of ["gainTitle", "gain", "costTitle", "cost"])
      string(pair[key], label + " decision " + key);
  assert(
    Array.isArray(tech.sources) && tech.sources.length >= 2,
    label + " sources",
  );
  for (const source of tech.sources) {
    assert.equal(source.length, 3, label + " source fields");
    source.forEach((item) => string(item, label + " source"));
    assert.equal(
      new URL(source[1]).protocol,
      "https:",
      label + " HTTPS source",
    );
  }
  assert(
    Array.isArray(tech.related) &&
      tech.related.every((id) => ids.has(id) && id !== label),
    label + " related",
  );
  assert.equal(
    new Set(tech.related).size,
    tech.related.length,
    label + " duplicate related",
  );
  if (tech.image) {
    const imagePath =
      imageAliases.get(tech.image) ||
      ["svg", "png", "jpg"]
        .map((extension) => `assets/tech/${tech.image}.${extension}`)
        .find((file) => fs.existsSync(path.join(root, file)));
    assert(
      imagePath && fs.existsSync(path.join(root, imagePath)),
      label + " local product image",
    );
    assert.equal(
      new URL(tech.logoSource).protocol,
      "https:",
      label + " logo source",
    );
  } else {
    string(tech.mark, label + " standard text mark");
    assert.equal(
      tech.logoSource,
      null,
      label + " standard has no fabricated logo",
    );
  }
}
const manifest = JSON.parse(
  fs.readFileSync(
    path.join(root, "docs/research/technology-catalogue-100-sources.json"),
    "utf8",
  ),
);
assert(manifest.profiles.length >= 56, "Expansion source coverage");
for (const item of manifest.profiles)
  assert(ids.has(item.id), item.id + " source record");
for (const item of [
  ...manifest.files.filter((file) => file.workspace_path),
  ...manifest.license_files,
]) {
  const bytes = fs.readFileSync(path.join(root, item.workspace_path));
  assert.equal(
    crypto.createHash("sha256").update(bytes).digest("hex"),
    item.sha256,
    item.workspace_path + " original bytes",
  );
}
console.log(
  `Catalogue checked: ${technologyCatalogue.length} technologies, ${categories.size} categories, complete profiles, local product marks and source hashes.`,
);
