
#!/usr/bin/env node

/**
 * Ultra-fast installation script that bypasses all timeout issues
 * This script skips all heavy binaries and post-install scripts
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting ultra-fast installation...');

// Set all optimization environment variables
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.SKIP_POSTINSTALL = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Create optimized .npmrc if it doesn't exist
const npmrcPath = '.npmrc';
const npmrcContent = `
# Ultra-fast installation settings
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Speed optimizations
prefer-offline=true
fund=false
audit=false
loglevel=error
progress=false

# Dependency handling
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Short timeouts to fail fast
network-timeout=60000
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=30000
fetch-retries=3
`.trim();

fs.writeFileSync(npmrcPath, npmrcContent);
console.log('✅ Created ultra-fast .npmrc configuration');

// Run installation with strict timeout
function runFastInstall() {
  return new Promise((resolve, reject) => {
    console.log('📦 Running bun install with strict timeout...');
    
    const installProcess = spawn('bun', ['install', '--no-save', '--prefer-offline'], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    // Very strict timeout - 60 seconds max
    const timeout = setTimeout(() => {
      console.log('⚡ Timeout reached, killing process...');
      installProcess.kill('SIGKILL');
      reject(new Error('Installation timed out'));
    }, 60000);
    
    installProcess.on('exit', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log('✅ Ultra-fast installation completed successfully!');
        resolve();
      } else {
        console.log(`❌ Installation failed with code ${code}`);
        reject(new Error(`Installation failed with code ${code}`));
      }
    });
    
    installProcess.on('error', (err) => {
      clearTimeout(timeout);
      console.log(`❌ Installation error: ${err.message}`);
      reject(err);
    });
  });
}

// Execute installation
runFastInstall()
  .then(() => {
    console.log('🎉 Installation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Installation failed:', error.message);
    console.log('\n💡 Try running: npm install --prefer-offline --no-audit --no-fund');
    process.exit(1);
  });
