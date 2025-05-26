
import { readFileSync, writeFileSync } from "fs";

if (process.env.SKIP_HEAVY === "true") {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  ["cypress","playwright","puppeteer"].forEach(p => {
    if (pkg.dependencies?.[p])          pkg.dependencies[p]          = "0.0.0-empty";
    if (pkg.optionalDependencies?.[p])  pkg.optionalDependencies[p]  = "0.0.0-empty";
  });
  writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  console.log("🗑️  Heavy binaries stubbed (SKIP_HEAVY=true)");
  process.exit(0);
}
