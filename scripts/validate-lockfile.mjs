#!/usr/bin/env node
import fs from "fs";

const path = "package-lock.json";
try {
  const txt = fs.readFileSync(path, "utf8");
  const json = JSON.parse(txt);

  const ok =
    json &&
    (typeof json.lockfileVersion === "number" || typeof json.lockfileVersion === "string") &&
    json.name &&
    json.packages;

  if (!ok) {
    console.error("❌ package-lock.json structure inattendue (lockfileVersion/name/packages).");
    process.exit(2);
  }

  // Alerte douce si lockfile trop ancien (reco npm>=7 → v2+, npm>=9/10 → v3)
  const v = Number(json.lockfileVersion);
  if (Number.isFinite(v) && v < 2) {
    console.warn("⚠️ lockfileVersion < 2 détecté. Re-génère avec `npm install` récent.");
  }

  console.log("✅ package-lock.json valide.");
} catch (e) {
  console.error("❌ package-lock.json invalide / illisible :", e?.message || e);
  process.exit(1);
}
