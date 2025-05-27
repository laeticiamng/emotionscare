
#!/usr/bin/env node

/**
 * FINAL RESOLUTION SCRIPT - Bun/@vitest/browser conflict
 * This script completely switches the project from Bun to npm
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 FINAL RESOLUTION: Switching from Bun to npm due to @vitest/browser conflict');

// Set environment variables to prevent heavy downloads
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Kill all Bun processes
  console.log('🛑 Stopping all Bun processes...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
  } catch (e) {
    console.log('   No Bun processes running');
  }

  // 2. Complete cleanup of all lock files and caches
  console.log('🧹 Complete cleanup...');
  
  const filesToRemove = [
    'node_modules',
    'bun.lockb', 
    'package-lock.json',
    'yarn.lock',
    '.bun',
    'dist'
  ];
  
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        if (file === 'node_modules' || file === '.bun' || file === 'dist') {
          execSync(`rm -rf "${file}"`, { stdio: 'pipe' });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`✅ Removed: ${file}`);
      } catch (e) {
        console.log(`⚠️ Could not remove ${file}, continuing...`);
      }
    }
  });

  // 3. Clear all caches
  console.log('🧽 Clearing all caches...');
  
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ npm cache cleared');
  } catch (e) {
    console.log('⚠️ npm cache clean failed, continuing...');
  }
  
  try {
    execSync('bun pm cache rm', { stdio: 'pipe' });
    console.log('✅ Bun cache cleared');
  } catch (e) {
    console.log('⚠️ Bun cache clean failed, continuing...');
  }

  // 4. Create .npmrc that FORCES npm usage
  const npmrcContent = `# FORCE NPM USAGE - AVOID BUN CONFLICT
package-manager=npm
engine-strict=true

# Skip heavy binaries to speed up installation
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Network optimizations
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true

# Dependency resolution
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeout settings
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Package lock settings
package-lock=false
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ Created .npmrc with npm-only configuration');

  // 5. Install with npm using optimal flags
  console.log('📦 Installing with npm (final resolution)...');
  
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund --verbose', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false',
      npm_config_engine_strict: 'true'
    }
  });

  console.log('');
  console.log('🎉 SUCCESS! Bun/@vitest/browser conflict resolved!');
  console.log('✅ Project is now using npm instead of Bun');
  console.log('');
  console.log('📋 NEW COMMANDS TO USE:');
  console.log('   npm run dev     (instead of bun dev)');
  console.log('   npm install     (instead of bun install)');
  console.log('   npm run build   (instead of bun run build)');
  console.log('   npm test        (instead of bun test)');
  console.log('');
  console.log('🚀 START YOUR PROJECT: npm run dev');
  console.log('');
  console.log('⚠️  IMPORTANT: Always use npm for this project, never bun');

} catch (error) {
  console.error('❌ CRITICAL ERROR:', error.message);
  
  console.log('\n🆘 MANUAL RECOVERY STEPS:');
  console.log('1. rm -rf node_modules bun.lockb package-lock.json .bun');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm cache clean --force');
  console.log('4. npm install --legacy-peer-deps');
  console.log('5. npm run dev');
  
  process.exit(1);
}
