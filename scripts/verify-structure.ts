import fs from "fs";
import path from "path";

const SNAP_FILE = "scripts/.structure-snapshot.json";
const COMPONENTS_REG = "src/COMPONENTS.reg.ts";
const APP_DIR = "src/app";

function fail(msg: string): never {
  console.error("❌", msg);
  process.exit(1);
}

function fileExists(p: string) { return fs.existsSync(p) && fs.statSync(p).isFile(); }
function dirExists(p: string) { return fs.existsSync(p) && fs.statSync(p).isDirectory(); }

function readFileOrEmpty(p: string) { return fileExists(p) ? fs.readFileSync(p, "utf8") : ""; }

function listAppFiles(root: string) {
  const out: string[] = [];
  if (!dirExists(root)) return out;
  (function walk(d: string) {
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else out.push(p.replace(/\\/g, "/"));
    }
  })(root);
  return out.sort();
}


function extractComponentExports(code: string) {
  const ex = new Set<string>();
  for (const m of code.matchAll(/export\s*\{\s*([A-Za-z0-9_]+)\s*\}\s*from\s*["'][^"']+["']/g)) ex.add(m[1]);
  return [...ex].sort();
}

// 1) Charger le snapshot de référence
if (!fileExists(SNAP_FILE)) fail("Aucun snapshot trouvé. Lance d'abord : npm run struct:snapshot");
const snap = JSON.parse(fs.readFileSync(SNAP_FILE, "utf8"));

// 2) Recalculer l'état courant
const compsNow  = extractComponentExports(readFileOrEmpty(COMPONENTS_REG));
const appFilesNow = listAppFiles(APP_DIR);

// 3) Vérifier la présence de tout ce qui existait
for (const e of snap.componentExports ?? []) {
  if (!compsNow.includes(e)) fail(`Export DS manquant/renommé : ${e}`);
}
for (const f of snap.appFiles ?? []) {
  if (!appFilesNow.includes(f)) fail(`Fichier sous src/app supprimé/déplacé : ${f}`);
}

console.log("✅ Invariants structurels OK (append-only respecté)");

