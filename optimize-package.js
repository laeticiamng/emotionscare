
#!/usr/bin/env node

/**
 * Script to optimize package.json for faster installations
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Optimizing package.json for faster installations...');

const packagePath = './package.json';

if (!fs.existsSync(packagePath)) {
  console.log('❌ package.json not found');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add installation optimization scripts
if (!packageJson.scripts) {
  packageJson.scripts = {};
}

packageJson.scripts['install:optimized'] = 'node install-optimized.js';
packageJson.scripts['install:fast'] = 'CYPRESS_INSTALL_BINARY=0 npm install --prefer-offline --no-audit --no-fund';

// Write back the optimized package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

console.log('✅ package.json optimized successfully');
console.log('\nYou can now run:');
console.log('  npm run install:optimized  (recommended)');
console.log('  npm run install:fast');
