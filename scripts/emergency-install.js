
#!/usr/bin/env node

/**
 * Emergency installation script to handle bun timeout issues
 * Uses npm as fallback with aggressive optimizations
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 Emergency installation script started...');

// Set aggressive environment variables to prevent heavy downloads
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.CYPRESS_SKIP_BINARY_CACHE = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.SKIP_POSTINSTALL = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Create aggressive .npmrc
const npmrcContent = `
# Emergency installation settings - skip all heavy binaries
cypress_install_binary=0
cypress_skip_binary_install=1
cypress_skip_binary_cache=1
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

# Very short timeouts to fail fast
network-timeout=30000
fetch-retry-mintimeout=5000
fetch-retry-maxtimeout=15000
fetch-retries=2
`.trim();

fs.writeFileSync('.npmrc', npmrcContent);
console.log('✅ Created emergency .npmrc configuration');

// Function to run npm install with strict timeout
function runEmergencyInstall() {
  return new Promise((resolve, reject) => {
    console.log('📦 Running npm install with emergency settings...');
    
    const npmProcess = spawn('npm', [
      'install', 
      '--prefer-offline',
      '--no-audit',
      '--no-fund',
      '--legacy-peer-deps',
      '--silent'
    ], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    // 2 minute timeout
    const timeout = setTimeout(() => {
      console.log('⚡ Killing npm process due to timeout...');
      npmProcess.kill('SIGKILL');
      reject(new Error('npm install timed out'));
    }, 120000);
    
    npmProcess.on('exit', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log('✅ Emergency installation completed!');
        resolve();
      } else {
        console.log(`❌ npm install failed with code ${code}`);
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
    
    npmProcess.on('error', (err) => {
      clearTimeout(timeout);
      console.log(`❌ npm process error: ${err.message}`);
      reject(err);
    });
  });
}

// Execute emergency installation
runEmergencyInstall()
  .then(() => {
    console.log('🎉 Emergency installation successful!');
    console.log('💡 Your dependencies are now installed. You can start developing.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Emergency installation failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check your internet connection');
    console.log('2. Clear npm cache: npm cache clean --force');
    console.log('3. Delete node_modules and try again: rm -rf node_modules');
    console.log('4. Try using yarn: yarn install');
    process.exit(1);
  });
