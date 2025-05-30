
#!/usr/bin/env node

/**
 * SOLUTION D'URGENCE - Force npm exclusivement et évite toutes les dépendances problématiques
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 URGENCE: Basculement complet vers npm');

// Tuer tous les processus Bun
try {
  execSync('pkill -f bun', { stdio: 'pipe' });
  execSync('pkill -f vite', { stdio: 'pipe' });
  console.log('✅ Processus Bun arrêtés');
} catch (e) {
  console.log('ℹ️ Aucun processus Bun en cours');
}

// Variables d'environnement anti-Bun
process.env.BUN = '';
process.env.USE_BUN = 'false';
process.env.PACKAGE_MANAGER = 'npm';
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';

try {
  // Nettoyage complet
  console.log('🧹 Nettoyage complet...');
  
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

  // .npmrc ultra-strict
  const npmrcContent = `# FORCE NPM EXCLUSIVEMENT
engine-strict=true
package-manager=npm

# Bloquer Bun complètement
bun=false
use-bun=false

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

# Timeouts
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Pas de package-lock
package-lock=false
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc anti-Bun créé');

  // Forcer .package-manager
  fs.writeFileSync('.package-manager', 'npm');
  console.log('✅ .package-manager défini sur npm');

  // Nettoyer les caches
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Nettoyage cache npm échoué');
  }

  // Installation avec npm en mode de compatibilité maximale
  console.log('📦 Installation npm (mode compatibilité maximale)...');
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund --force', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false',
      npm_config_engine_strict: 'true'
    }
  });

  console.log('');
  console.log('🎉 SUCCÈS! Bun complètement éliminé!');
  console.log('✅ Installation npm terminée');
  console.log('');
  console.log('🚀 Utilisez maintenant: npm run dev');
  console.log('💡 Utilisez TOUJOURS npm pour ce projet');

} catch (error) {
  console.error('❌ ERREUR CRITIQUE:', error.message);
  
  console.log('\n🆘 RÉCUPÉRATION D\'URGENCE:');
  console.log('1. rm -rf node_modules bun.lockb .bun');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm cache clean --force');
  console.log('4. npm install --legacy-peer-deps --force');
  console.log('5. npm run dev');
  
  process.exit(1);
}
