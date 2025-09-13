import fs from "fs";
import path from "path";

const SNAP_FILE = "scripts/.structure-snapshot.json";
const ROUTES_REG = "src/ROUTES.reg.ts";
const COMPONENTS_REG = "src/COMPONENTS.reg.ts";
const APP_DIR = "src/app";

function fileExists(p: string) { return fs.existsSync(p) && fs.statSync(p).isFile(); }
function dirExists(p: string) { return fs.existsSync(p) && fs.statSync(p).isDirectory(); }

function listAppFiles(root: string) {
  const out: string[] = [];
  if (!dirExists(root)) return out;
  (function walk(d: string) {
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else out.push(p.replace(/\\/g, "/")); // normalize
    }
  })(root);
  // On stocke des chemins relatifs au repo pour éviter les surprises
  return out.sort();
}

function readFileOrEmpty(p: string) { return fileExists(p) ? fs.readFileSync(p, "utf8") : ""; }

// Heuristiques robustes et tolérantes (on cherche l'append-only, pas l'AST parfait)
function extractRouteIds(code: string) {
  // ex: id: "home"  OU  addRoute({ id: "mood-mixer", ... })
  const ids = new Set<string>();
  for (const m of code.matchAll(/\bid\s*:\s*["'`](.+?)["'`]/g)) ids.add(m[1]);
  return [...ids].sort();
}

function extractComponentExports(code: string) {
  // ex: export { Button } from "@/ui/Button"
  const ex = new Set<string>();
  for (const m of code.matchAll(/export\s*\{\s*([A-Za-z0-9_]+)\s*\}\s*from\s*["'][^"]+["']/g)) ex.add(m[1]);
  return [...ex].sort();
}

const routesCode = readFileOrEmpty(ROUTES_REG);
const compsCode  = readFileOrEmpty(COMPONENTS_REG);

const snapshot = {
  createdAt: new Date().toISOString(),
  files: {
    routesReg: fileExists(ROUTES_REG) ? ROUTES_REG : null,
    componentsReg: fileExists(COMPONENTS_REG) ? COMPONENTS_REG : null,
    appDir: dirExists(APP_DIR) ? APP_DIR : null
  },
  routes: extractRouteIds(routesCode),
  componentExports: extractComponentExports(compsCode),
  appFiles: listAppFiles(APP_DIR)
};

fs.writeFileSync(SNAP_FILE, JSON.stringify(snapshot, null, 2));
console.log("✅ Structure snapshot enregistrée :", SNAP_FILE);

