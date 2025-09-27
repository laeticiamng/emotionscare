#!/usr/bin/env node

/**
 * Script to prevent jpegtran-bin postinstall errors
 * This patches the problematic jpegtran-bin install script
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing jpegtran-bin postinstall issue...');

const jpegtranPath = path.join(__dirname, '../node_modules/imagemin-jpegtran/node_modules/jpegtran-bin/lib/install.js');
const alternativePath = path.join(__dirname, '../node_modules/jpegtran-bin/lib/install.js');

function patchJpegtranBin(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the problematic line that expects count to be a number
    content = content.replace(
      /squeak\.warn\(([^)]+)\)/g,
      'squeak.warn(String($1).padStart ? String($1).padStart(0, " ") : String($1))'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Patched: ${filePath}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  Could not patch ${filePath}:`, error.message);
    return false;
  }
}

// Try to patch both possible locations
const patched1 = patchJpegtranBin(jpegtranPath);
const patched2 = patchJpegtranBin(alternativePath);

if (patched1 || patched2) {
  console.log('✅ jpegtran-bin postinstall issue has been fixed');
} else {
  console.log('ℹ️  jpegtran-bin not found, probably already removed');
}

process.exit(0);