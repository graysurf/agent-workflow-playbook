import { access, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const dist = resolve(root, "dist");
const indexPath = resolve(dist, "index.html");
const index = await readFile(indexPath, "utf8");

const requiredStrings = [
  "把 Agent 變成團隊工作流",
  "Skills 不是 prompt snippet",
  "Work Tier",
  "Heuristic System",
  "forge-cli",
  "nils-alfredworkflow",
  "symphony-board",
  "https://github.com/graysurf/agent-runtime-kit",
  "https://github.com/sympoies/nils-cli",
  "https://github.com/sympoies/nils-alfredworkflow",
  "https://github.com/sympoies/symphony-board"
];

const requiredAssets = [
  "assets/system-map.svg",
  "assets/repo-skills-screenshot.svg",
  "assets/work-tier-screenshot.svg",
  "assets/heuristic-system-screenshot.svg",
  "assets/forge-cli-screenshot.svg",
  "assets/alfred-screenshot.svg",
  "assets/symphony-board-screenshot.svg",
  "assets/og.svg",
  "styles.css",
  "main.js"
];

for (const text of requiredStrings) {
  if (!index.includes(text)) {
    throw new Error(`Missing required content: ${text}`);
  }
}

for (const asset of requiredAssets) {
  const target = resolve(dist, asset);
  await access(target);
  const info = await stat(target);
  if (!info.size) {
    throw new Error(`Empty asset: ${asset}`);
  }
}

const duplicateIds = [...index.matchAll(/\sid="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((id, index, all) => all.indexOf(id) !== index);

if (duplicateIds.length) {
  throw new Error(`Duplicate ids: ${[...new Set(duplicateIds)].join(", ")}`);
}

console.log("Validation passed");
