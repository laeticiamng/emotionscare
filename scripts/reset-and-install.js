
#!/usr/bin/env node

/**
 * Complete reset and installation script
 * Cleans everything and starts fresh
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Starting complete reset and installation...');

// Step 1: Clean up existing installations
console.log('🧹 Cleaning up existing files...');
try {
  if (fs.existsSync('node_modules')) {
    console.log('  - Removing node_modules...');
    if (process.platform === 'win32') {
      execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
    } else {
      execSync('rm -rf node_modules', { stdio: 'inherit' });
    }
  }
  
  if (fs.existsSync('package-lock.json')) {
    console.log('  - Removing package-lock.json...');
    fs.unlinkSync('package-lock.json');
  }
  
  if (fs.existsSync('bun.lockb')) {
    console.log('  - Removing bun.lockb...');
    fs.unlinkSync('bun.lockb');
  }
} catch (error) {
  console.log('⚠️ Some cleanup failed, continuing anyway...');
}

// Step 2: Set environment variables
console.log('⚙️ Setting up environment...');
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Step 3: Create optimized .npmrc
console.log('📝 Creating optimized .npmrc...');
const npmrcContent = `
cypress_install_binary=0
husky_skip_install=1
puppeteer_skip_download=1
prefer-offline=true
fund=false
audit=false
legacy-peer-deps=true
network-timeout=60000
fetch-retries=3
`;

fs.writeFileSync('.npmrc', npmrcContent.trim());

// Step 4: Clear npm cache
console.log('🗑️ Clearing npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️ Cache clean failed, continuing...');
}

// Step 5: Install dependencies
console.log('📦 Installing dependencies with npm...');
try {
  execSync('npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps', {
    stdio: 'inherit',
    timeout: 300000 // 5 minutes
  });
  
  console.log('✅ Installation completed successfully!');
  console.log('🚀 You can now run: npm run dev');
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  console.log('\n💡 Try running: node scripts/emergency-install.js');
  process.exit(1);
}
