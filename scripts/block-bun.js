
#!/usr/bin/env node

/**
 * Emergency script to completely block Bun usage
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 Blocking Bun usage...');

// Remove any Bun-related files
try {
  if (fs.existsSync('bun.lockb')) {
    fs.unlinkSync('bun.lockb');
    console.log('✅ Removed bun.lockb');
  }
} catch (error) {
  console.log('⚠️ Could not remove bun.lockb:', error.message);
}

// Clear npm cache
try {
  execSync('npm cache clean --force', { stdio: 'pipe' });
  console.log('✅ Cleared npm cache');
} catch (error) {
  console.log('⚠️ Could not clear npm cache');
}

// Remove node_modules to force clean install
try {
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
    console.log('✅ Removed node_modules');
  }
} catch (error) {
  console.log('⚠️ Could not remove node_modules');
}

console.log('🎯 Bun blocked. Please run: npm install --legacy-peer-deps');
