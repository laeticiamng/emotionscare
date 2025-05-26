
import { readFileSync, writeFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

if (process.env.SKIP_HEAVY === "true") {
  ["cypress", "playwright", "puppeteer"].forEach((p) => {
    if (pkg.dependencies?.[p]) pkg.dependencies[p] = "0.0.0-empty";
    if (pkg.optionalDependencies?.[p]) pkg.optionalDependencies[p] = "0.0.0-empty";
  });
  console.log("🗑️  Heavy binaries stubbed (SKIP_HEAVY=true)");
}

if (process.env.SKIP_TEST_DEPS === "true") {
  ["edge-test-kit", "supabase-edge-functions-test", "pgtap-run", "pg-prove"].forEach(
    (p) => {
      if (pkg.dependencies?.[p]) pkg.dependencies[p] = "0.0.0-empty";
      if (pkg.devDependencies?.[p]) pkg.devDependencies[p] = "0.0.0-empty";
      if (pkg.optionalDependencies?.[p]) pkg.optionalDependencies[p] = "0.0.0-empty";
    }
  );
  console.log("🗑️  DB/Edge test deps stubbed (SKIP_TEST_DEPS=true)");
}

if (process.env.SKIP_HEAVY === "true" || process.env.SKIP_TEST_DEPS === "true") {
  writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  process.exit(0);
}
