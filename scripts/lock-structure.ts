import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getRoutes } from "../src/ROUTES.reg.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const compSource = fs.readFileSync(path.join(process.cwd(), "src/COMPONENTS.reg.ts"), "utf8");
const componentExports = compSource
  .split("\n")
  .filter((l) => l.startsWith("export {"))
  .map((l) => l.match(/export\s+{\s*(?:default\s+as\s+)?(\w+)/)?.[1])
  .filter(Boolean) as string[];

const snapshot = {
  routes: getRoutes(),
  components: componentExports.sort(),
  appFiles: listFiles(path.join(process.cwd(), "src/app")),
};

fs.writeFileSync(
  path.join(__dirname, ".structure-snapshot.json"),
  JSON.stringify(snapshot, null, 2)
);
console.log("Structure snapshot saved");
