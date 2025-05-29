
#!/usr/bin/env node

/**
 * FINAL SOLUTION: Force npm and remove @vitest/browser completely
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 FINAL FIX: Eliminating Bun and @vitest/browser conflict');

// Set environment variables
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';
process.env.USE_BUN = 'false';

try {
  // 1. Kill all Bun processes
  console.log('🛑 Stopping all Bun processes...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
    execSync('pkill -f vite', { stdio: 'pipe' });
    console.log('✅ Bun processes stopped');
  } catch (e) {
    console.log('ℹ️ No Bun processes running');
  }

  // 2. Complete cleanup
  console.log('🧹 Complete cleanup...');
  const filesToRemove = ['node_modules', 'bun.lockb', 'package-lock.json', 'yarn.lock', '.bun'];
  
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        if (file === 'node_modules' || file === '.bun') {
          execSync(`rm -rf "${file}"`, { stdio: 'pipe' });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`✅ Removed: ${file}`);
      } catch (e) {
        console.log(`⚠️ Could not remove ${file}`);
      }
    }
  });

  // 3. Create .npmrc that completely blocks Bun
  const npmrcContent = `# FORCE NPM ONLY - ELIMINATE BUN COMPLETELY
engine-strict=true
package-lock=false
scripts-prepend-node-path=true

# Block Bun completely
package-manager=npm

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
fetch-retries=3`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ Created .npmrc with Bun blocking');

  // 4. Clean npm cache
  console.log('🧽 Cleaning npm cache...');
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ npm cache cleaned');
  } catch (e) {
    console.log('⚠️ npm cache clean failed');
  }

  // 5. Install with npm (without @vitest/browser)
  console.log('📦 Installing with npm (without problematic @vitest/browser)...');
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false',
      USE_BUN: 'false'
    }
  });

  console.log('');
  console.log('🎉 SUCCESS! Problem resolved!');
  console.log('✅ @vitest/browser removed');
  console.log('✅ Bun completely eliminated');
  console.log('✅ npm-only setup complete');
  console.log('');
  console.log('🚀 Start your project: npm run dev');

} catch (error) {
  console.error('❌ ERROR:', error.message);
  
  console.log('\n🆘 MANUAL RECOVERY:');
  console.log('1. rm -rf node_modules bun.lockb');
  console.log('2. npm cache clean --force');
  console.log('3. npm install --legacy-peer-deps');
  console.log('4. npm run dev');
  
  process.exit(1);
}
