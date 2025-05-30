
/**
 * Emergency script to completely eliminate Bun and force npm usage
 * Resolves @vitest/browser integrity conflict
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 EMERGENCY NPM FIX - Eliminating Bun completely');

// Set environment variables to avoid heavy binaries
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

  // 3. Clean npm cache
  console.log('🧽 Cleaning npm cache...');
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ npm cache cleaned');
  } catch (e) {
    console.log('⚠️ npm cache clean failed');
  }

  // 4. Force npm installation
  console.log('📦 Installing with npm (avoiding @vitest/browser conflict)...');
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false'
    }
  });

  console.log('');
  console.log('🎉 SUCCESS! Bun eliminated, npm-only setup complete');
  console.log('✅ @vitest/browser conflict resolved');
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
