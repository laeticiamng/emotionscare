#!/usr/bin/env node

/**
 * Script pour copier les overrides des packages problématiques
 */

const fs = require('fs');
const path = require('path');

console.log('📦 Configuration des overrides pour packages problématiques...');

const overrideDir = path.join(__dirname, '../node_modules_overrides');
const nodeModulesDir = path.join(__dirname, '../node_modules');

if (!fs.existsSync(nodeModulesDir)) {
  fs.mkdirSync(nodeModulesDir, { recursive: true });
}

function copyOverride(packageName) {
  const sourcePath = path.join(overrideDir, packageName);
  const targetPath = path.join(nodeModulesDir, packageName);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
      fs.cpSync(sourcePath, targetPath, { recursive: true });
      console.log(`✅ Override installé: ${packageName}`);
    } catch (error) {
      console.warn(`⚠️  Erreur pour ${packageName}:`, error.message);
    }
  }
}

// Installer les overrides
copyOverride('imagemin-avif');
copyOverride('imagemin-webp');
copyOverride('vite-plugin-imagemin');

console.log('✅ Overrides configurés, les packages problématiques sont remplacés par des stubs');