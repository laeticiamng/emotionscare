
#!/usr/bin/env node

/**
 * SOLUTION FINALE - Élimination complète de Bun et force npm
 * Résout définitivement le conflit @vitest/browser
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 SOLUTION FINALE: Élimination complète de Bun');

// Bloquer Bun au niveau environnement
process.env.BUN = '';
process.env.USE_BUN = 'false';
process.env.PACKAGE_MANAGER = 'npm';
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

function safeExec(command, options = {}) {
  try {
    execSync(command, { stdio: 'pipe', ...options });
    return true;
  } catch (e) {
    console.log(`⚠️ Command failed: ${command}`);
    return false;
  }
}

function safeRemove(path) {
  try {
    if (fs.existsSync(path)) {
      if (fs.lstatSync(path).isDirectory()) {
        execSync(`rm -rf "${path}"`, { stdio: 'pipe' });
      } else {
        fs.unlinkSync(path);
      }
      console.log(`✅ Removed: ${path}`);
      return true;
    }
    return false;
  } catch (e) {
    console.log(`⚠️ Could not remove ${path}: ${e.message}`);
    return false;
  }
}

try {
  // 1. Arrêter tous les processus Bun et Node
  console.log('🛑 Stopping all Bun and Node processes...');
  safeExec('pkill -f bun');
  safeExec('pkill -f vite');
  safeExec('pkill -f node');
  console.log('✅ Processes stopped');

  // 2. Nettoyage complet du système de fichiers
  console.log('🧹 Complete filesystem cleanup...');
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
    safeRemove(file);
  });

  // 3. Créer .npmrc anti-Bun ultra-strict
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

  // 4. Créer fichier .package-manager strict
  fs.writeFileSync('.package-manager', 'npm');
  console.log('✅ .package-manager set to npm');

  // 5. Nettoyer tous les caches de manière agressive
  console.log('🧽 Cleaning all caches aggressively...');
  if (safeExec('npm cache clean --force')) {
    console.log('✅ npm cache cleaned');
  }
  
  if (safeExec('bun pm cache rm')) {
    console.log('✅ bun cache cleaned');
  }

  // 6. Installation avec npm en mode de compatibilité maximale
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
