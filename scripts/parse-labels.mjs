#!/usr/bin/env node
/**
 * parse-labels.mjs
 * Converts a Label Studio JSON export into src/config/island-hotspots.ts
 * Supports all 8 island variants: gender x time-of-day x orientation
 *
 * Usage:
 *   node scripts/parse-labels.mjs <path-to-labels.json>
 */

import fs from "fs";
import path from "path";

// Task ID -> variant mapping
const TASK_MAP = {
  8200: { gender: "boy",  time: "night", orientation: "mobile"  },
  8201: { gender: "boy",  time: "day",   orientation: "mobile"  },
  8202: { gender: "girl", time: "day",   orientation: "mobile"  },
  8203: { gender: "girl", time: "night", orientation: "mobile"  },
  8204: { gender: "girl", time: "day",   orientation: "desktop" },
  8205: { gender: "boy",  time: "day",   orientation: "desktop" },
  8206: { gender: "girl", time: "night", orientation: "desktop" },
  8207: { gender: "boy",  time: "night", orientation: "desktop" },
};

const LABEL_MAP = {
  cave:         { id: "cave",         label: "Cave",         href: "/cave",         phase: 1, timeLock: true },
  Cave:         { id: "cave",         label: "Cave",         href: "/cave",         phase: 1, timeLock: true },
  garden:       { id: "garden",       label: "Garden",       href: "/garden",       phase: 1 },
  Garden:       { id: "garden",       label: "Garden",       href: "/garden",       phase: 1 },
  lighthouse:   { id: "lighthouse",   label: "Lighthouse",   href: "/lighthouse",   phase: 1 },
  Lighthouse:   { id: "lighthouse",   label: "Lighthouse",   href: "/lighthouse",   phase: 1 },
  home:         { id: "home",         label: "Home",         href: "/home",         phase: 2 },
  Home:         { id: "home",         label: "Home",         href: "/home",         phase: 2 },
  treasure:     { id: "treasure-box", label: "Treasure Box", href: "/treasure-box", phase: 2 },
  Treasure:     { id: "treasure-box", label: "Treasure Box", href: "/treasure-box", phase: 2 },
  school:       { id: "school",       label: "School",       href: "/school",       phase: 3 },
  School:       { id: "school",       label: "School",       href: "/school",       phase: 3 },
  Fair:         { id: "fair",         label: "Fair",         href: "/fair",         phase: 3 },
  fair:         { id: "fair",         label: "Fair",         href: "/fair",         phase: 3 },
  "club house": { id: "club-house",   label: "Club House",   href: "/club-house",   phase: 3 },
  "Club house": { id: "club-house",   label: "Club House",   href: "/club-house",   phase: 3 },
  "Rest house": { id: "rest-house",   label: "Rest House",   href: "/rest-house",   phase: 3 },
  "Rest House": { id: "rest-house",   label: "Rest House",   href: "/rest-house",   phase: 3 },
};

function parseTask(task) {
  const annotation = task.annotations[0];
  if (!annotation) return [];

  const byId = {};

  for (const result of annotation.result) {
    if (result.type !== "rectanglelabels") continue;
    const { x, y, width, height } = result.value;
    const rawLabel = result.value.rectanglelabels[0];
    const mapped = LABEL_MAP[rawLabel];
    if (!mapped) {
      console.warn(`  ⚠ Unknown label "${rawLabel}" — skipped`);
      continue;
    }

    const area = width * height;

    // Auto-fix: Garden label in upper-right of desktop (y < 25%) is actually lighthouse
    if (mapped.id === "garden" && y < 25) {
      const lh = LABEL_MAP["lighthouse"];
      if (!byId["lighthouse"] || area > byId["lighthouse"].area) {
        byId["lighthouse"] = { ...lh, x, y, width, height, area };
      }
      continue;
    }

    if (!byId[mapped.id] || area > byId[mapped.id].area) {
      byId[mapped.id] = { ...mapped, x, y, width, height, area };
    }
  }

  return Object.values(byId).map(({ area, ...h }) => ({
    ...h,
    x:      parseFloat(h.x.toFixed(2)),
    y:      parseFloat(h.y.toFixed(2)),
    width:  parseFloat(h.width.toFixed(2)),
    height: parseFloat(h.height.toFixed(2)),
  }));
}

// camelCase export name: "boy_day_mobile" -> "boyDayMobileHotspots"
function toExportName(gender, time, orientation) {
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return gender + cap(time) + cap(orientation) + "Hotspots";
}

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error("Usage: node scripts/parse-labels.mjs <path-to-labels.json>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const variantResults = [];
for (const task of data) {
  const meta = TASK_MAP[task.id];
  if (!meta) {
    console.warn("  ⚠ Unknown task ID " + task.id + " — skipped");
    continue;
  }
  const hotspots = parseTask(task);
  variantResults.push({ ...meta, hotspots });
  console.log("✓ " + meta.gender + "-" + meta.time + "-" + meta.orientation + " (task " + task.id + ") → " + hotspots.length + " hotspots");
}

// Sort: boy/girl, day/night, mobile/desktop
const ORDER_GENDER = ["boy", "girl"];
const ORDER_TIME = ["day", "night"];
const ORDER_ORI = ["mobile", "desktop"];
variantResults.sort((a, b) => {
  if (a.gender !== b.gender) return ORDER_GENDER.indexOf(a.gender) - ORDER_GENDER.indexOf(b.gender);
  if (a.time !== b.time) return ORDER_TIME.indexOf(a.time) - ORDER_TIME.indexOf(b.time);
  return ORDER_ORI.indexOf(a.orientation) - ORDER_ORI.indexOf(b.orientation);
});

let blocks = "";
for (const { gender, time, orientation, hotspots } of variantResults) {
  const exportName = toExportName(gender, time, orientation);
  blocks += "/** Hotspots for the " + gender + " " + time + " " + orientation + " island image */\n";
  blocks += "export const " + exportName + ": Hotspot[] = " + JSON.stringify(hotspots, null, 2) + ";\n\n";
}

const header = `// AUTO-GENERATED by scripts/parse-labels.mjs — do not edit manually
// Re-generate: node scripts/parse-labels.mjs scripts/labels.json

export interface Hotspot {
  id: string;
  label: string;
  href: string;
  x: number;      // left edge — % of image width
  y: number;      // top edge  — % of image height
  width: number;  // % of image width
  height: number; // % of image height
  phase: number;  // minimum phase required to show this destination
  timeLock?: boolean; // true = Cave 7-day time lock
}

`;

const outDir = path.resolve("src/config");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "island-hotspots.ts"), header + blocks);
console.log("✅ Wrote src/config/island-hotspots.ts");
