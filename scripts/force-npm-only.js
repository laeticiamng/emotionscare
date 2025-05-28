
#!/usr/bin/env node

/**
 * Script définitif pour forcer npm et éliminer complètement Bun
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 FORCE NPM ONLY - Élimination définitive de Bun');

// Variables d'environnement pour accélérer l'installation
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Tuer tous les processus Bun
  console.log('🛑 Arrêt de tous les processus Bun...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
    execSync('pkill -f vite', { stdio: 'pipe' });
    console.log('✅ Processus Bun arrêtés');
  } catch (e) {
    console.log('ℹ️ Aucun processus Bun à arrêter');
  }

  // 2. Nettoyage complet
  console.log('🧹 Nettoyage complet des caches...');
  
  const filesToRemove = ['node_modules', 'bun.lockb', 'package-lock.json', 'yarn.lock', '.bun'];
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        if (file === 'node_modules' || file === '.bun') {
          execSync(`rm -rf "${file}"`, { stdio: 'pipe' });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`✅ Supprimé: ${file}`);
      } catch (e) {
        console.log(`⚠️ Impossible de supprimer ${file}`);
      }
    }
  });

  // 3. Créer .npmrc anti-Bun
  const npmrcContent = `# CONFIGURATION ANTI-BUN - FORCE NPM UNIQUEMENT
engine-strict=true
package-manager=npm

# Bloquer Bun complètement
bun=false

# Éviter les binaires lourds
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

# Résolution des dépendances
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts optimisés
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Pas de package-lock pour flexibilité
package-lock=false
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc anti-Bun créé');

  // 4. Nettoyer le cache npm
  console.log('🧽 Nettoyage du cache npm...');
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Nettoyage cache npm échoué');
  }

  // 5. Installation FORCÉE avec npm
  console.log('📦 Installation FORCÉE avec npm...');
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
  console.log('🎉 SUCCÈS TOTAL !');
  console.log('✅ Bun a été complètement éliminé');
  console.log('✅ Le projet utilise maintenant npm exclusivement');
  console.log('');
  console.log('🚀 COMMANDES À UTILISER:');
  console.log('   npm run dev     ← Démarrer le projet');
  console.log('   npm install     ← Installer des packages');
  console.log('   npm run build   ← Construire le projet');
  console.log('');
  console.log('▶️ LANCEZ MAINTENANT: npm run dev');

} catch (error) {
  console.error('❌ ERREUR:', error.message);
  
  console.log('\n🆘 SOLUTION DE SECOURS:');
  console.log('1. rm -rf node_modules bun.lockb');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm install --legacy-peer-deps');
  console.log('4. npm run dev');
  
  process.exit(1);
}
