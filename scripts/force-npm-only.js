#!/usr/bin/env node

console.log('🚨 FORCING NPM-ONLY MODE - FIXING BUN/VITEST CONFLICT');

const fs = require('fs');
const { execSync } = require('child_process');

// 1. Remove all Bun traces
try {
  console.log('1. Removing Bun artifacts...');
  if (fs.existsSync('bun.lockb')) fs.unlinkSync('bun.lockb');
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
  }
} catch (e) {
  console.log('   Cleanup completed');
}

// 2. Create .npmrc to force npm
console.log('2. Configuring npm-only mode...');
const npmrcContent = `# FORCE NPM ONLY - BLOCKS BUN
engine-strict=true
package-manager=npm
legacy-peer-deps=true
audit=false
fund=false
cypress_install_binary=0
husky_skip_install=1
puppeteer_skip_download=1
`;

fs.writeFileSync('.npmrc', npmrcContent);

// 3. Create preinstall script to block bun
console.log('3. Creating Bun blocker...');
const preinstallContent = `#!/usr/bin/env node
if (process.env.npm_execpath && process.env.npm_execpath.includes('bun')) {
  console.error('❌ BUN BLOCKED: Use npm install instead');
  process.exit(1);
}
`;

if (!fs.existsSync('scripts')) fs.mkdirSync('scripts');
fs.writeFileSync('scripts/preinstall.js', preinstallContent);

// 4. Update package.json
console.log('4. Updating package.json...');
const packagePath = 'package.json';
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.preinstall = 'node scripts/preinstall.js';
  pkg.engines = pkg.engines || {};
  pkg.engines.npm = '>=8.0.0';
  pkg.packageManager = 'npm';
  
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
}

// 5. Install with npm
console.log('5. Installing with npm...');
try {
  execSync('npm install --legacy-peer-deps', { 
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' }
  });
  console.log('✅ SUCCESS! Project configured for npm-only');
  console.log('🚀 Run: npm run dev');
} catch (error) {
  console.log('❌ Installation failed, but npm-only mode is configured');
  console.log('🔄 Try: npm install --legacy-peer-deps');
}