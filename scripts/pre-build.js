
#!/usr/bin/env node

/**
 * Pre-build script to run before the main build process
 * Sets up optimizations and environment variables without modifying package.json
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-build checks and optimizations...');

// Ensure .npmrc exists with proper settings
if (!fs.existsSync('.npmrc') || !fs.readFileSync('.npmrc', 'utf8').includes('cypress_skip_binary_install=1')) {
  console.log('📝 Adding cypress_skip_binary_install=1 to .npmrc');
  fs.writeFileSync('.npmrc', 'cypress_skip_binary_install=1\n', { flag: 'a' });
}

// Set environment variables
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Check if we have enough disk space (for CI environments)
try {
  if (process.platform === 'linux' || process.platform === 'darwin') {
    const diskInfo = execSync('df -h /').toString();
    console.log('📊 Disk space information:');
    console.log(diskInfo);
  }
} catch (error) {
  console.log('⚠️ Could not check disk space');
}

// Check node version
console.log(`📌 Using Node.js ${process.version}`);

// Check if TypeScript is installed
try {
  const tsVersion = execSync('npx tsc --version').toString().trim();
  console.log(`📌 TypeScript version: ${tsVersion}`);
} catch (error) {
  console.log('⚠️ TypeScript might not be installed properly');
}

console.log('✅ Pre-build optimizations complete');

// Exit with success
process.exit(0);
