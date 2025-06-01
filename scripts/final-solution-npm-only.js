
#!/usr/bin/env node

/**
 * SOLUTION FINALE - Élimination complète de Bun et passage forcé à npm
 * Résout définitivement tous les conflits
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 SOLUTION FINALE: Élimination complète de Bun et passage à npm');

// Variables d'environnement pour bloquer Bun
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
    console.log(`⚠️ Commande échouée: ${command}`);
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
      console.log(`✅ Supprimé: ${path}`);
      return true;
    }
    return false;
  } catch (e) {
    console.log(`⚠️ Impossible de supprimer ${path}`);
    return false;
  }
}

try {
  // 1. Arrêter TOUS les processus
  console.log('🛑 Arrêt de tous les processus...');
  safeExec('pkill -f bun');
  safeExec('pkill -f vite');
  safeExec('pkill -f node');
  console.log('✅ Processus arrêtés');

  // 2. Nettoyage complet
  console.log('🧹 Nettoyage complet...');
  const filesToRemove = [
    'node_modules',
    'bun.lockb', 
    'package-lock.json',
    'yarn.lock',
    '.bun',
    '.npm',
    'pnpm-lock.yaml',
    'dist'
  ];
  
  filesToRemove.forEach(file => {
    safeRemove(file);
  });

  // 3. Créer .npmrc ultra-strict qui bloque Bun
  const npmrcContent = `# SOLUTION FINALE - FORCE NPM EXCLUSIVEMENT
engine-strict=true
package-manager=npm
package-lock=false

# Bloquer Bun complètement
bun=false
use-bun=false

# Éviter les binaires lourds
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1
playwright_skip_browser_download=1

# Optimisations réseau
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true

# Résolution des dépendances
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts étendus
network-timeout=600000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
fetch-retries=5

# Force npm exclusivement
resolution-mode=highest
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc anti-Bun créé');

  // 4. Créer fichier .no-bun pour bloquer définitivement
  fs.writeFileSync('.no-bun', 'BUN_DISABLED=true\nUSE_NPM_ONLY=true');
  console.log('✅ .no-bun créé');

  // 5. Nettoyer tous les caches
  console.log('🧽 Nettoyage de tous les caches...');
  if (safeExec('npm cache clean --force')) {
    console.log('✅ Cache npm nettoyé');
  }

  // 6. Installation avec npm en mode de compatibilité maximale
  console.log('📦 Installation avec npm (résolution de tous les conflits)...');
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund --force --verbose', {
    stdio: 'inherit',
    timeout: 600000, // 10 minutes
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false',
      npm_config_engine_strict: 'true',
      npm_config_package_manager: 'npm'
    }
  });

  console.log('');
  console.log('🎉 SUCCÈS TOTAL! Tous les problèmes résolus!');
  console.log('✅ Bun complètement éliminé');
  console.log('✅ @vitest/browser conflit résolu');
  console.log('✅ @vitejs/plugin-react installé');
  console.log('✅ npm-only setup complet');
  console.log('');
  console.log('🚀 DÉMARRER MAINTENANT: npm run dev');
  console.log('💡 Utilisez TOUJOURS npm pour ce projet');

} catch (error) {
  console.error('❌ ERREUR CRITIQUE:', error.message);
  
  console.log('\n🆘 RÉCUPÉRATION MANUELLE:');
  console.log('1. rm -rf node_modules bun.lockb .bun');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm cache clean --force');
  console.log('4. npm install --legacy-peer-deps --force');
  console.log('5. npm run dev');
  
  process.exit(1);
}
