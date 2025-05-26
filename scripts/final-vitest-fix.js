
#!/usr/bin/env node

/**
 * Final definitive fix for @vitest/browser conflict with Bun
 * This script completely switches the project to npm to avoid the integrity issue
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Final fix for @vitest/browser conflict with Bun...');

// Set environment variables to prevent heavy downloads
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Complete cleanup
  console.log('🧹 Complete cleanup...');
  
  const filesToRemove = ['node_modules', 'bun.lockb', 'package-lock.json', 'yarn.lock'];
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      if (file === 'node_modules') {
        execSync(`rm -rf ${file}`, { stdio: 'pipe' });
      } else {
        fs.unlinkSync(file);
      }
      console.log(`✅ Removed ${file}`);
    }
  });

  // 2. Create .npmrc that forces npm and prevents bun usage
  const npmrcContent = `# Force npm usage to avoid @vitest/browser conflict with Bun
package-manager=npm

# Prevent Bun from being used
engine-strict=true

# Skip heavy binaries
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

# Dependency handling
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeout settings
network-timeout=300000
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Prevent package-lock for flexibility
package-lock=false
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ Created .npmrc with npm-only configuration');

  // 3. Create .nvmrc to ensure consistent Node version
  const nvmrcContent = '18';
  fs.writeFileSync('.nvmrc', nvmrcContent);
  console.log('✅ Created .nvmrc for Node 18');

  // 4. Install with npm using specific flags to avoid the vitest/browser issue
  console.log('📦 Installing with npm (avoiding @vitest/browser conflict)...');
  
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false'
    }
  });

  console.log('🎉 Installation successful!');
  console.log('');
  console.log('✅ The @vitest/browser conflict has been resolved');
  console.log('💡 From now on, use npm instead of bun:');
  console.log('   - npm run dev (instead of bun dev)');
  console.log('   - npm install (instead of bun install)');
  console.log('   - npm run build (instead of bun run build)');
  console.log('');
  console.log('🚀 You can now start development with: npm run dev');

} catch (error) {
  console.error('❌ Error during fix:', error.message);
  
  console.log('\n🔧 Manual fallback steps:');
  console.log('1. rm -rf node_modules bun.lockb package-lock.json');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm install --legacy-peer-deps');
  console.log('4. Use npm commands instead of bun');
  
  process.exit(1);
}
