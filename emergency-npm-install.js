
#!/usr/bin/env node

/**
 * Emergency NPM installation script - bypasses all Bun/vitest issues
 * This completely switches to npm and avoids the @vitest/browser integrity problem
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 Emergency NPM installation - bypassing Bun/@vitest/browser completely');

// Kill any running processes
try {
  execSync('pkill -f bun', { stdio: 'pipe' });
  execSync('pkill -f vite', { stdio: 'pipe' });
} catch (e) {
  console.log('No running processes to kill');
}

// Environment variables to skip heavy downloads
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Complete cleanup
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

  // 2. Create .npmrc that completely avoids Bun
  const npmrcContent = `# Emergency NPM-only configuration
package-manager=npm
engine-strict=true

# Skip all heavy binaries
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

# Prevent package-lock for flexibility
package-lock=false
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ Created emergency .npmrc');

  // 3. Clear all caches
  console.log('🧽 Clearing caches...');
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
  } catch (e) {
    console.log('⚠️ npm cache clean failed, continuing...');
  }

  // 4. Install with npm
  console.log('📦 Installing with npm (emergency mode)...');
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false'
    }
  });

  console.log('');
  console.log('🎉 Emergency installation successful!');
  console.log('✅ Project now uses npm instead of Bun');
  console.log('');
  console.log('🚀 Start development: npm run dev');
  console.log('⚠️  Always use npm commands from now on');

} catch (error) {
  console.error('❌ Emergency installation failed:', error.message);
  console.log('\n🆘 Manual steps:');
  console.log('1. rm -rf node_modules bun.lockb');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm install --legacy-peer-deps');
  console.log('4. npm run dev');
  process.exit(1);
}
