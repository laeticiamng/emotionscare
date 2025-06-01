
#!/usr/bin/env node

/**
 * Safe npm-only installation script
 */

const { spawn } = require('child_process');
const fs = require('fs');

// Environment variables to optimize installation
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

console.log('📦 Starting npm-only installation...');

// Ensure .npmrc exists with correct settings
const npmrcContent = `
engine-strict=true
package-manager=npm
bun=false
use-bun=false
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1
playwright_skip_browser_download=1
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3
package-lock=false
save-exact=false
resolution-mode=highest
`.trim();

fs.writeFileSync('.npmrc', npmrcContent);

// Run npm install with aggressive settings
const npmProcess = spawn('npm', [
  'install',
  '--legacy-peer-deps',
  '--no-audit',
  '--no-fund',
  '--prefer-offline'
], {
  stdio: 'inherit',
  env: { ...process.env }
});

npmProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ npm installation completed successfully!');
    console.log('🚀 You can now run: npm run dev');
  } else {
    console.error('❌ npm installation failed with code:', code);
    process.exit(1);
  }
});

npmProcess.on('error', (error) => {
  console.error('❌ Failed to start npm process:', error.message);
  process.exit(1);
});
