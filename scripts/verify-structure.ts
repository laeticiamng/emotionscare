import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getRoutes } from "../src/ROUTES.reg.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const snapshotPath = path.join(__dirname, ".structure-snapshot.json");

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(full));
    } else {
      files.push(path.relative(path.join(process.cwd(), "src"), full));
    }
  }
  return files.sort();
}

if (!fs.existsSync(snapshotPath)) {
  console.error("Snapshot file not found. Run struct:snapshot first.");
  process.exit(1);
}

const compSource = fs.readFileSync(path.join(process.cwd(), "src/COMPONENTS.reg.ts"), "utf8");
const componentExports = compSource
  .split("\n")
  .filter((l) => l.startsWith("export {"))
  .map((l) => l.match(/export\s+{\s*(?:default\s+as\s+)?(\w+)/)?.[1])
  .filter(Boolean) as string[];

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
const current = {
  routes: getRoutes(),
  components: componentExports.sort(),
  appFiles: listFiles(path.join(process.cwd(), "src/app")),
};

function diff<T extends { id?: string }>(prev: T[], now: T[], key: keyof T) {
  const prevSet = new Set(prev.map((i) => i[key] as string));
  const nowSet = new Set(now.map((i) => i[key] as string));
  const missing: string[] = [];
  for (const item of prevSet) {
    if (!nowSet.has(item)) missing.push(item);
  }
  return missing;
}

const missingRoutes = diff(snapshot.routes, current.routes, "id");
const missingComponents = snapshot.components.filter((c: string) => !current.components.includes(c));
const missingFiles = snapshot.appFiles.filter((f: string) => !current.appFiles.includes(f));

if (missingRoutes.length || missingComponents.length || missingFiles.length) {
  console.error("Structure verification failed:");
  if (missingRoutes.length) console.error("Missing routes:", missingRoutes);
  if (missingComponents.length) console.error("Missing components:", missingComponents);
  if (missingFiles.length) console.error("Missing app files:", missingFiles);
  process.exit(1);
}

console.log("Structure verified");
