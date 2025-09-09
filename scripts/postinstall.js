#!/usr/bin/env node

/**
 * Postinstall script to handle problematic packages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Running postinstall fixes...');

// Fix jpegtran-bin if it exists
try {
  require('./fix-jpegtran.js');
} catch (error) {
  console.log('ℹ️  jpegtran-bin fix not needed');
}

// Remove problematic packages if they somehow got installed
const problematicPaths = [
  'node_modules/imagemin-avif',
  'node_modules/imagemin-webp', 
  'node_modules/vite-plugin-imagemin'
];

problematicPaths.forEach(pkgPath => {
  const fullPath = path.join(__dirname, '..', pkgPath);
  if (fs.existsSync(fullPath)) {
    console.log(`🗑️  Removing problematic package: ${pkgPath}`);
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } catch (error) {
      console.warn(`⚠️  Could not remove ${pkgPath}:`, error.message);
    }
  }
});

console.log('✅ Postinstall fixes completed');