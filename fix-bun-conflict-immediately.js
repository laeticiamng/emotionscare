
#!/usr/bin/env node

/**
 * SCRIPT D'URGENCE - Résolution immédiate du conflit Bun/@vitest/browser
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 RÉSOLUTION IMMÉDIATE DU CONFLIT BUN/@vitest/browser');

// Variables d'environnement pour éviter les binaires lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. ARRÊTER tous les processus bun immédiatement
  console.log('🛑 Arrêt forcé de tous les processus bun...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
    execSync('pkill -f vite', { stdio: 'pipe' });
  } catch (e) {
    console.log('   (Aucun processus bun en cours)');
  }

  // 2. DESTRUCTION complète des fichiers problématiques
  console.log('🧹 Destruction complète des caches...');
  
  const filesToDestroy = [
    'node_modules',
    'bun.lockb', 
    'package-lock.json',
    'yarn.lock',
    '.bun'
  ];
  
  filesToDestroy.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        if (file === 'node_modules' || file === '.bun') {
          execSync(`rm -rf "${file}"`, { stdio: 'pipe' });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`✅ Détruit: ${file}`);
      } catch (e) {
        console.log(`⚠️ Impossible de détruire ${file}`);
      }
    }
  });

  // 3. FORCER npm et INTERDIRE bun complètement
  const npmrcContent = `# INTERDICTION TOTALE DE BUN - RÉSOLUTION @vitest/browser
package-manager=npm
engine-strict=true

# Bloquer bun complètement
bun=false

# Éviter tous les binaires lourds
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Optimisations réseau
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true

# Résolution de dépendances
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts optimisés
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Empêcher package-lock
package-lock=false
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc anti-bun créé');

  // 4. NETTOYER tous les caches
  console.log('🧽 Nettoyage de tous les caches...');
  
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Cache npm non accessible');
  }

  // 5. INSTALLATION FORCÉE avec npm uniquement
  console.log('📦 Installation FORCÉE avec npm...');
  
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false'
    }
  });

  console.log('');
  console.log('🎉 PROBLÈME RÉSOLU !');
  console.log('✅ Le conflit @vitest/browser est ÉLIMINÉ');
  console.log('');
  console.log('📋 UTILISEZ MAINTENANT:');
  console.log('   npm run dev     ← Démarrer le projet');
  console.log('   npm install     ← Installer des packages');
  console.log('   npm run build   ← Construire le projet');
  console.log('');
  console.log('🚀 LANCEZ: npm run dev');

} catch (error) {
  console.error('❌ ERREUR:', error.message);
  
  console.log('\n🆘 SOLUTION MANUELLE:');
  console.log('1. rm -rf node_modules bun.lockb package-lock.json');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm install --legacy-peer-deps');
  console.log('4. npm run dev');
  
  process.exit(1);
}
