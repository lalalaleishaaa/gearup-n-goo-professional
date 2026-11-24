#!/usr/bin/env node
/* ============================================================
 * GEARUP N GOO — Heritage image mapping tool
 * Single source of truth for the 60 approved place images.
 *
 *   node tools/heritage-images.js inject   # add image: field to data files (idempotent)
 *   node tools/heritage-images.js verify   # check which files exist / are missing
 *   node tools/heritage-images.js sync     # copy uploads (exact names) from uploads dir
 *
 * NOTE: filenames are EXACT. Nothing here generates, renames,
 * downloads or converts images.
 * ============================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_FILES = ["heritage-data-1.js", "heritage-data-2.js", "heritage-data-3.js"];
const ASSET_BASE = "assets/heritage";
const UPLOAD_DIRS = [path.join(ROOT, "..", "uploads"), path.join(ROOT, "uploads"), path.join(ROOT, "assets", "heritage-flat")];

/* ---- SOURCE OF TRUTH: state -> placeId -> exact filename ---- */
const MAP = {
  "karnataka": {
    "hampi": "hampi-vijayanagara.jpg",
    "pattadakal": "pattadakal.jpg",
    "aihole": "aihole.jpg",
    "badami-cave-temples": "badami-cave-temples.jpg",
    "belur": "belur.jpg",
    "halebidu": "halebidu.jpg"
  },
  "rajasthan": {
    "chand-baori": "chand-baori.jpg",
    "bhangarh": "bhangarh-fort.jpg",
    "mandawa": "mandawa.jpg",
    "kumbhalgarh": "kumbhalgarh-fort.jpg",
    "harshnath": "harshnath-temple.jpg",
    "neemrana": "neemrana-fort.jpg"
  },
  "madhya-pradesh": {
    "bhimbetka": "bhimbetka-rock-shelters.jpg",
    "orchha": "orchha.jpg",
    "chanderi": "chanderi.jpg",
    "bagh-caves": "bagh-caves.jpg",
    "mandu": "mandu.jpg",
    "sanchi": "sanchi.jpg"
  },
  "gujarat": {
    "dholavira": "dholavira.jpg",
    "lothal": "lothal.jpg",
    "champaner-pavagadh": "champaner-pavagadh.jpg",
    "rani-ki-vav": "rani-ki-vav.jpg",
    "adalaj-stepwell": "adalaj-stepwell.jpg",
    "polo-forest": "polo-forest.jpg"
  },
  "maharashtra": {
    "ajanta-caves": "ajanta-caves.jpg",
    "ellora-caves": "ellora-caves.jpg",
    "daulatabad": "daulatabad-devagiri-fort.jpg",
    "kanheri-caves": "kanheri-caves.jpg",
    "paithan": "paithan.jpg",
    "bibi-ka-maqbara": "bibi-ka-maqbara.jpg"
  },
  "odisha": {
    "udayagiri-khandagiri": "udayagiri-khandagiri-caves.jpg",
    "ratnagiri": "ratnagiri.jpg",
    "lalitgiri": "lalitgiri.jpg",
    "chausathi-yogini": "chausathi-yogini-hirapur.jpg",
    "barabati-fort": "barabati-fort.jpg",
    "dhauli": "dhauli-ashokan-edicts.jpg"
  },
  "tamil-nadu": {
    "gingee-fort": "gingee-fort.jpg",
    "sittannavasal": "sittannavasal.jpg",
    "tharangambadi": "tharangambadi.jpg",
    "gangaikonda-cholapuram": "gangaikonda-cholapuram.jpg",
    "kodumbalur": "kodumbalur-moovarkoil.jpg",
    "thirumayam": "thirumayam-fort.jpg"
  },
  "uttar-pradesh": {
    "kalinjar-fort": "kalinjar-fort.jpg",
    "deogarh": "deogarh-dashavatara-temple.jpg",
    "bateshwar": "bateshwar.jpg",
    "chunar-fort": "chunar-fort.jpg",
    "sankisa": "sankisa.jpg",
    "kaushambi": "kaushambi.jpg"
  },
  "telangana": {
    "ramappa": "ramappa-temple.jpg",
    "warangal-fort": "warangal-fort.jpg",
    "thousand-pillar-temple": "thousand-pillar-temple.jpg",
    "qutb-shahi-tombs": "qutb-shahi-tombs.jpg",
    "elagandula-fort": "elagandhal-fort.jpg",
    "dharmapuri": "dharmapuri-buddhist-heritage.jpg"
  },
  "andhra-pradesh": {
    "lepakshi": "lepakshi-veerabhadra-temple.jpg",
    "gandikota": "gandikota-fort.jpg",
    "undavalli": "undavalli-caves.jpg",
    "chandragiri-fort": "chandragiri-fort.jpg",
    "penukonda": "penukonda-fort.jpg",
    "bavikonda": "bavikonda-buddhist-site.jpg"
  }
};

function allEntries() {
  const out = [];
  Object.keys(MAP).forEach(state => {
    Object.keys(MAP[state]).forEach(pid => {
      out.push({ state, pid, file: MAP[state][pid], rel: `${ASSET_BASE}/${state}/${MAP[state][pid]}` });
    });
  });
  return out;
}

/* ---- inject: add/refresh `image:` on every place record ---- */
function inject() {
  DATA_FILES.forEach(f => {
    const p = path.join(ROOT, f);
    let src = fs.readFileSync(p, "utf8");
    let curState = null, changes = 0;
    const lines = src.split("\n").map(line => {
      const stateM = line.match(/^  id: "([a-z-]+)", slug: "([a-z-]+)", name: "/);
      if (stateM) { curState = stateM[2]; return line; }
      const placeM = line.match(/^(\s+)id: "([a-z0-9-]+)", slug: "([a-z0-9-]+)", name: "/);
      if (placeM && curState && MAP[curState] && MAP[curState][placeM[2]]) {
        changes++;
        const img = `assets/heritage/${curState}/${MAP[curState][placeM[2]]}`;
        return [line, `${placeM[1]}image: "${img}",`].join("\n");
      }
      return line;
    });
    // idempotency: strip any previously injected image lines that duplicate
    src = lines.join("\n").replace(new RegExp(`(\\s+)image: "assets/heritage/[a-z-]+/[a-z0-9-]+\\.jpg",\\n\\1image: "assets/heritage/`, "g"), "$1image: \"assets/heritage/");
    fs.writeFileSync(p, src);
    console.log(`${f}: ${changes} place records matched`);
  });
}

/* ---- verify: which exact files exist ---- */
function verify() {
  const entries = allEntries();
  let ok = 0; const missing = [];
  const byState = {};
  entries.forEach(e => {
    const exists = fs.existsSync(path.join(ROOT, e.rel));
    byState[e.state] = byState[e.state] || { ok: [], miss: [] };
    if (exists) { ok++; byState[e.state].ok.push(e.file); }
    else { byState[e.state].miss.push(e.file); missing.push(e); }
  });
  Object.keys(byState).forEach(s => {
    console.log(`\n${s}`);
    byState[s].ok.forEach(f => console.log(`  ✓ ${f}`));
    byState[s].miss.forEach(f => console.log(`  ✗ MISSING: ${f}`));
  });
  console.log(`\nTOTAL: ${ok}/${entries.length} present, ${missing.length} missing`);
  if (missing.length) {
    console.log("\nMissing image files (upload these exact filenames):");
    missing.forEach(e => console.log(`  ${e.file}`));
  }
  return missing.length === 0;
}

/* ---- sync: move uploads into the state folders under EXACT canonical names ---- */
function nrm(s) {
  return s.toLowerCase().replace(/ \(2\)(?=\.)/g, "").replace(/\s+/g, "");
}
function stemLev(a, b) {
  // small Levenshtein for typo-tolerant fallback (e.g. ajnata → ajanta)
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 99;
  let prev = Array.from({length: n+1}, (_, j) => j), cur = new Array(n+1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}
function sync() {
  const slots = {}; // canonical file -> entry (slots to fill)
  allEntries().forEach(e => { slots[e.file] = e; });
  const destRoot = path.join(ROOT, ASSET_BASE);
  let copied = 0;
  const ignored = [], unmatched = [], resolved = [];

  // Gather upload candidates from all upload dirs (flat only)
  const cands = [];
  UPLOAD_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(fn => {
      if (!/\.(jpe?g|png|webp)$/i.test(fn)) return;
      const st = fs.statSync(path.join(dir, fn));
      if (st.isFile()) cands.push({ fn, dir });
    });
  });

  // Pass 1: exact filename match
  const used = new Set();
  cands.forEach(c => {
    const slot = slots[c.fn];
    if (slot && !used.has(c.fn)) { c.slot = slot; c.how = "exact"; used.add(c.fn); }
  });
  // Pass 2: normalized match (case / spaces / " (2)" dupes)
  cands.forEach(c => {
    if (c.slot) return;
    const nf = nrm(c.fn);
    const hit = Object.keys(slots).find(can => !used.has(can) && nrm(can) === nf);
    if (hit) { c.slot = slots[hit]; c.how = "normalized"; used.add(hit); }
  });
  // Pass 3: typo-tolerant (unique best within edit distance 2)
  cands.forEach(c => {
    if (c.slot) return;
    const nf = nrm(c.fn).replace(/\.[a-z]+$/, "");
    let best = null, bestD = 3;
    Object.keys(slots).forEach(can => {
      if (used.has(can)) return;
      const d = stemLev(nf, nrm(can).replace(/\.[a-z]+$/, ""));
      if (d < bestD) { bestD = d; best = can; }
      else if (d === bestD) { best = best ? null : best; if (d === bestD && best && best !== can) best = null; }
    });
    if (best && bestD <= 2) { c.slot = slots[best]; c.how = `typo(dist ${bestD})`; used.add(best); }
  });

  // Copy resolved candidates under their CANONICAL name (never overwrite)
  cands.forEach(c => {
    if (c.slot) {
      const destDir = path.join(destRoot, c.slot.state);
      fs.mkdirSync(destDir, { recursive: true });
      const dest = path.join(destDir, c.slot.file);
      if (fs.existsSync(dest)) { ignored.push(`${c.fn} (slot already filled)`); return; }
      fs.copyFileSync(path.join(c.dir, c.fn), dest);
      copied++;
      resolved.push(`${c.fn}  →  ${ASSET_BASE}/${c.slot.state}/${c.slot.file}   [${c.how}]`);
    } else {
      ignored.push(`${c.fn} (no slot — duplicate or unknown name, left untouched)`);
    }
  });

  console.log("SYNC MAP:");
  resolved.forEach(r => console.log("  " + r));
  if (ignored.length) { console.log("\nLEFT IN UPLOADS (untouched):"); ignored.forEach(i => console.log("  " + i)); }
  console.log(`\n${copied} file(s) placed under canonical names.`);
}

const cmd = process.argv[2] || "verify";
if (cmd === "inject") inject();
else if (cmd === "verify") process.exit(verify() ? 0 : 1);
else if (cmd === "sync") sync();
else { console.log("usage: node tools/heritage-images.js [inject|verify|sync]"); }
