
#!/usr/bin/env node

/**
 * Optimized installation script with aggressive Cypress prevention
 */

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting optimized installation...');

// Aggressive environment variables to prevent Cypress
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.CYPRESS_SKIP_BINARY_CACHE = '1';
process.env.CYPRESS_CACHE_FOLDER = '/tmp/cypress-skip';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.SKIP_POSTINSTALL = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Create optimized .npmrc with Cypress prevention
const npmrcContent = `
# Completely prevent Cypress installation
cypress_install_binary=0
cypress_skip_binary_install=1
cypress_skip_binary_cache=1

# Skip other heavy downloads
husky_skip_install=1
puppeteer_skip_download=1

# Installation optimizations
prefer-offline=true
fund=false
audit=false
loglevel=error
progress=false

# Fast installation settings
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Aggressive timeout settings
network-timeout=120000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=60000
fetch-retries=3
`.trim();

fs.writeFileSync('.npmrc', npmrcContent);
console.log('✅ Created Cypress-proof .npmrc configuration');

// Installation with timeout
function installWithTimeout() {
  return new Promise((resolve, reject) => {
    console.log('📦 Running bun install with Cypress prevention...');
    
    const process = spawn('bun', ['install'], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    // 2 minute timeout
    const timeout = setTimeout(() => {
      console.log('⚠️ Installation taking too long, terminating...');
      process.kill('SIGTERM');
      setTimeout(() => process.kill('SIGKILL'), 5000);
      reject(new Error('Installation timeout'));
    }, 120000);
    
    process.on('exit', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log('✅ Installation completed successfully!');
        resolve();
      } else {
        console.log(`❌ Installation failed with code ${code}`);
        reject(new Error(`Installation failed with code ${code}`));
      }
    });
    
    process.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

installWithTimeout()
  .then(() => {
    console.log('🎉 Optimized installation completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Installation failed:', error.message);
    console.log('\n💡 Try running: node scripts/ultra-fast-install.js');
    process.exit(1);
  });
