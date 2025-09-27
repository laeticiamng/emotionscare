#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, "ROUTES_MANIFEST.json");
const lockPath = path.join(__dirname, "ROUTES_LOCK");

function calculateHash(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
    d.isDirectory()
      ? walk(path.join(dir, d.name))
      : path.join(dir, d.name)
  );
}

function toRoute(filePath) {
  return "/" + filePath
    .replace(/^src\/pages\//, "")
    .replace(/Page\.tsx$/, "")
    .replace(/\/index$/, "")
    .replace(/^index$/, "");
}

async function scanRoutes() {
  try {
    console.log("🔍 Scanning route manifest...");
    
    // Read manifest
    const manifestContent = fs.readFileSync(manifestPath, "utf8");
    const manifest = JSON.parse(manifestContent);
    
    // Calculate hash
    const currentHash = calculateHash(manifestContent);
    
    console.log(`📊 Found ${manifest.routes.length} routes`);
    console.log(`🔗 Found ${manifest.aliases.length} aliases`);
    console.log(`🔐 Current hash: ${currentHash.substring(0, 12)}...`);
    
    // Check for lock mode
    const isLockMode = process.argv.includes("--lock");
    
    if (isLockMode) {
      // Update lock file
      fs.writeFileSync(lockPath, `${currentHash}\n${new Date().toISOString()}`);
      console.log("✅ ROUTES_LOCK updated");
      return;
    }
    
    // Verify against lock
    try {
      const lockContent = fs.readFileSync(lockPath, "utf8");
      const lockHash = lockContent.split('\n')[0];
      if (currentHash !== lockHash.trim()) {
        console.error("❌ Route manifest hash mismatch!");
        console.error(`Expected: ${lockHash.trim()}`);
        console.error(`Current:  ${currentHash}`);
        console.error("Run: npm run routes:manifest:lock to update");
        process.exit(1);
      }
    } catch (error) {
      console.warn("⚠️  No lock file found, creating one...");
      fs.writeFileSync(lockPath, `${currentHash}\n${new Date().toISOString()}`);
    }
    
    // Check for missing/orphan routes
    const manifestSet = new Set(manifest.routes.map(r => r.path));
    const pages = walk("src/pages").filter(f => f.endsWith("Page.tsx"));
    const fileSet = new Set(pages.map(toRoute));
    
    const missing = [...manifestSet].filter(p => !fileSet.has(p) && p !== "/");
    const orphans = [...fileSet].filter(p => !manifestSet.has(p));
    
    if (missing.length > 0) {
      console.warn("⚠️  Missing page files:", missing);
      console.warn("Run: npm run routes:stubs to create them");
    }
    
    if (orphans.length > 0) {
      console.warn("⚠️  Orphan page files:", orphans);
    }
    
    console.log("✅ Route manifest verification passed");
    
  } catch (error) {
    console.error("❌ Route scan failed:", error.message);
    process.exit(1);
  }
}

scanRoutes();