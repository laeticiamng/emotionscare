import { promises as fs } from "fs";
import path from "path";

const REGISTRY_PATH = "src/COMPONENTS.reg.ts";
const OUTPUT_PATH = "docs/UI_COMPONENTS_REGISTRY.md";

async function readFileSafe(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return "";
    }
    throw error;
  }
}

function normalizeSource(source) {
  if (source.startsWith("./")) {
    const trimmed = source.slice(2);
    return trimmed.startsWith("src/") ? trimmed : `src/${trimmed}`;
  }
  if (source.startsWith("@/")) {
    return source.replace(/^@\//, "src/");
  }
  return source;
}

function extractExports(code) {
  const exports = [];
  const regex = /export\s*\{\s*([^}]+?)\s*\}\s*from\s*["']([^"']+)["']/gs;

  for (const match of code.matchAll(regex)) {
    const namesBlock = match[1];
    const source = match[2];
    const normalizedSource = normalizeSource(source);

    const tokens = namesBlock
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean);

    for (const token of tokens) {
      const aliasMatch = token.match(/^(?:default\s+as\s+)?(.+)$/i);
      const rawName = aliasMatch ? aliasMatch[1] : token;
      const name = rawName.replace(/\s+as\s+.*/, "").trim();
      exports.push({ name, source: normalizedSource });
    }
  }

  return exports;
}

function determineType(name, source) {
  const lowerSource = source.toLowerCase();
  const lowerName = name.toLowerCase();

  if (lowerName === "t" || lowerSource.includes("/lib/i18n")) {
    return "Internationalisation";
  }

  if (lowerSource.includes("/lib/seo")) {
    return "SEO";
  }

  if (lowerSource.includes("/theme/")) {
    return "Thème";
  }

  if (lowerSource.includes("/motion/")) {
    return "Animation";
  }

  if (lowerSource.includes("/lib/flags/")) {
    return "Feature flags";
  }

  if (name.startsWith("use") || lowerSource.includes("/hooks/")) {
    return "Hook";
  }

  if (lowerName.includes("provider")) {
    return "Provider";
  }

  if (lowerName.includes("consent")) {
    return "Consentement";
  }

  if (lowerName.includes("audio")) {
    return "Audio";
  }

  if (lowerName.includes("progress")) {
    return "Visualisation";
  }

  if (name[0] === name[0]?.toLowerCase()) {
    return "Utilitaire";
  }

  if (lowerSource.includes("/ui/")) {
    return "Composant UI";
  }

  return "Utilitaire";
}

function formatDate(date) {
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
  return formatter.format(date);
}

function buildMarkdown(entries) {
  const total = entries.length;
  const counts = new Map();

  for (const entry of entries) {
    counts.set(entry.type, (counts.get(entry.type) ?? 0) + 1);
  }

  const now = new Date();
  const lines = [];
  lines.push("# Registre des composants UI\n");
  lines.push(
    `> 📌 Généré automatiquement le ${formatDate(now)} à partir de \`${REGISTRY_PATH}\`. Utilisez \`npm run generate:ui-registry\` pour rafraîchir cette liste.\n`
  );
  lines.push("\n## Statistiques rapides\n");
  lines.push(`- **${total}** entrées référencées`);

  const sortedCounts = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [type, count] of sortedCounts) {
    lines.push(`- ${type} : ${count}`);
  }

  lines.push("\n## Détails des exports\n");
  lines.push("| Export | Type | Source |");
  lines.push("| --- | --- | --- |");

  for (const entry of entries) {
    lines.push(`| ${entry.name} | ${entry.type} | \`${entry.source}\` |`);
  }

  lines.push("\n_Généré pour faciliter l'exploration et la réutilisation des composants._\n");

  return lines.join("\n");
}

async function main() {
  const code = await readFileSafe(REGISTRY_PATH);
  if (!code) {
    throw new Error(`Impossible de lire ${REGISTRY_PATH}.`);
  }

  const extracted = extractExports(code);
  const enriched = extracted
    .map((entry) => ({
      ...entry,
      type: determineType(entry.name, entry.source),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const markdown = buildMarkdown(enriched);
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${markdown}\n`, "utf8");

  console.log(`✅ Registre généré (${enriched.length} entrées) → ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error("❌ Impossible de générer le registre UI:", error);
  process.exitCode = 1;
});
