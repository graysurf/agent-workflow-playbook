import { access, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const dist = resolve(root, "dist");
const indexPath = resolve(dist, "index.html");
const index = await readFile(indexPath, "utf8");

const requiredStrings = [
  "把 Agent Workflow 變成可維護系統",
  "Skills 不是 prompt snippet",
  "Work Tier",
  "Heuristic System",
  "forge-cli",
  "nils-alfredworkflow",
  "symphony-board",
  "CLI Contract Demo",
  "用 agent 安裝 agent-runtime-kit",
  "請幫我安裝 graysurf/agent-runtime-kit 到這台 Mac",
  "agent-runtime doctor --product codex --format json",
  "bash scripts/setup.sh --profile core --skip-homebrew-install --dry-run",
  "bash scripts/sync-runtime-surfaces.sh --apply",
  "forge-cli activity feed --repo sympoies/symphony-board --limit 5 --format json",
  "forge-cli inbox list --item-type pr --kind review --limit 5 --format json",
  "forge-cli issue view 146 --with-comments --repo sympoies/symphony-board --format json",
  "forge-cli pr view 172 --repo sympoies/symphony-board --format json",
  "forge-cli pr deliver --kind feature --title",
  "https://github.com/graysurf/agent-runtime-kit",
  "https://github.com/sympoies/nils-cli",
  "https://github.com/sympoies/nils-alfredworkflow",
  "https://github.com/sympoies/symphony-board"
];

const bannedStrings = [
  "團隊",
  "聽眾",
  "分享目標",
  "建議分享路線",
  "Team skill",
  "team skill"
];

const requiredAssets = [
  "assets/system-map.svg",
  "assets/repo-skills-screenshot.svg",
  "assets/work-tier-screenshot.svg",
  "assets/heuristic-system-screenshot.svg",
  "assets/forge-cli-screenshot.svg",
  "assets/forge-inbox-alfred.png",
  "assets/symphony-board-activity.png",
  "assets/visual-flow.svg",
  "assets/visual-layers.svg",
  "assets/visual-case.svg",
  "assets/visual-repo.svg",
  "assets/og.svg",
  "assets/favicon.svg",
  "styles.css",
  "main.js"
];

for (const text of requiredStrings) {
  if (!index.includes(text)) {
    throw new Error(`Missing required content: ${text}`);
  }
}

for (const text of bannedStrings) {
  if (index.includes(text)) {
    throw new Error(`Unexpected audience-specific content: ${text}`);
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

const externalLinks = [...index.matchAll(/<a\b[^>]*\bhref="https:\/\/[^"]+"[^>]*>/g)].map(
  (match) => match[0]
);
const nonBlankExternalLinks = externalLinks.filter(
  (tag) =>
    !tag.includes('target="_blank"') ||
    !tag.includes('rel="noopener noreferrer"')
);

if (nonBlankExternalLinks.length) {
  throw new Error(
    `External links must open in a new tab: ${nonBlankExternalLinks.join(", ")}`
  );
}

console.log("Validation passed");
