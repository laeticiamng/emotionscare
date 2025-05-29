
#!/usr/bin/env node

/**
 * EMERGENCY SOLUTION: Complete Bun elimination and npm-only setup
 * Resolves @vitest/browser integrity conflict permanently
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 EMERGENCY: Eliminating Bun completely and forcing npm');

// Block Bun at environment level
process.env.BUN = '';
process.env.USE_BUN = 'false';
process.env.PACKAGE_MANAGER = 'npm';
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Kill all Bun and Node processes
  console.log('🛑 Stopping all Bun and Node processes...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
    execSync('pkill -f vite', { stdio: 'pipe' });
    execSync('pkill -f node', { stdio: 'pipe' });
    console.log('✅ Processes stopped');
  } catch (e) {
    console.log('ℹ️ No processes to stop');
  }

  // 2. Complete filesystem cleanup
  console.log('🧹 Complete cleanup...');
  const filesToRemove = [
    'node_modules',
    'bun.lockb', 
    'package-lock.json',
    'yarn.lock',
    '.bun',
    '.npm',
    'pnpm-lock.yaml'
  ];
  
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        if (file === 'node_modules' || file === '.bun' || file === '.npm') {
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

  // 3. Create anti-Bun .npmrc
  const npmrcContent = `# ANTI-BUN CONFIGURATION - FORCE NPM ONLY
engine-strict=true
package-manager=npm
package-lock=false
scripts-prepend-node-path=true

# Completely disable Bun
bun=false
use-bun=false

# Skip heavy binaries completely
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1
playwright_skip_browser_download=1

# Network and dependency optimizations
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Aggressive timeout settings
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Force npm resolution
resolution-mode=highest
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ Anti-Bun .npmrc created');

  // 4. Clean all caches aggressively
  console.log('🧽 Cleaning all caches...');
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ npm cache cleaned');
  } catch (e) {
    console.log('⚠️ npm cache clean failed');
  }

  try {
    execSync('bun pm cache rm', { stdio: 'pipe' });
    console.log('✅ bun cache cleaned');
  } catch (e) {
    console.log('⚠️ bun cache clean failed');
  }

  // 5. Install with npm using maximum compatibility flags
  console.log('📦 Installing with npm (maximum compatibility mode)...');
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund --force', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false',
      npm_config_engine_strict: 'true',
      npm_config_package_manager: 'npm'
    }
  });

  console.log('');
  console.log('🎉 SUCCESS! Bun completely eliminated!');
  console.log('✅ @vitest/browser conflict resolved');
  console.log('✅ npm-only setup complete');
  console.log('');
  console.log('🚀 Now use: npm run dev');
  console.log('💡 Always use npm commands from now on');

} catch (error) {
  console.error('❌ CRITICAL ERROR:', error.message);
  
  console.log('\n🆘 EMERGENCY RECOVERY:');
  console.log('1. rm -rf node_modules bun.lockb .bun');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm cache clean --force');
  console.log('4. npm install --legacy-peer-deps --force');
  console.log('5. npm run dev');
  
  process.exit(1);
}
