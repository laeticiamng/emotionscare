
#!/usr/bin/env node

/**
 * Pre-build script to run before the main build process
 * Sets up optimizations and environment variables
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Running pre-build checks and optimizations...');

// Ensure .npmrc exists with proper settings
if (!fs.existsSync('.npmrc') || !fs.readFileSync('.npmrc', 'utf8').includes('cypress_skip_binary_install=1')) {
  console.log('📝 Adding cypress_skip_binary_install=1 to .npmrc');
  fs.writeFileSync('.npmrc', 'cypress_skip_binary_install=1\n', { flag: 'a' });
}

// Set environment variables
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';

console.log('✅ Pre-build optimizations complete');

// Exit with success
process.exit(0);
