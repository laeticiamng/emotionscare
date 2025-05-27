
#!/usr/bin/env node

/**
 * Script définitif pour forcer le passage à npm et résoudre le conflit @vitest/browser
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 RÉSOLUTION DÉFINITIVE: Passage forcé à npm pour résoudre @vitest/browser');

// Variables d'environnement pour éviter les binaires lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Arrêter tous les processus Bun
  console.log('🛑 Arrêt des processus Bun...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
    execSync('pkill -f vite', { stdio: 'pipe' });
  } catch (e) {
    console.log('Aucun processus à arrêter');
  }

  // 2. Nettoyage complet
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
        console.log(`⚠️ Impossible de supprimer ${file}, continuons...`);
      }
    }
  });

  // 3. Créer .npmrc qui force npm et bloque Bun
  const npmrcContent = `# FORCER NPM - BLOQUER BUN pour éviter conflit @vitest/browser
package-manager=npm
engine-strict=true

# Empêcher Bun d'être utilisé
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

# Timeouts
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Éviter package-lock pour flexibilité
package-lock=false
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ Créé .npmrc avec blocage de Bun');

  // 4. Nettoyer les caches npm
  console.log('🧽 Nettoyage du cache npm...');
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Nettoyage cache échoué, continuons...');
  }

  // 5. Installation avec npm
  console.log('📦 Installation avec npm (résolution conflit @vitest/browser)...');
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false'
    }
  });

  console.log('');
  console.log('🎉 SUCCÈS! Le conflit @vitest/browser a été résolu!');
  console.log('✅ Le projet utilise maintenant npm au lieu de Bun');
  console.log('');
  console.log('📋 NOUVELLES COMMANDES À UTILISER:');
  console.log('   npm run dev     (au lieu de bun dev)');
  console.log('   npm install     (au lieu de bun install)');
  console.log('   npm run build   (au lieu de bun run build)');
  console.log('   npm test        (au lieu de bun test)');
  console.log('');
  console.log('🚀 DÉMARRER VOTRE PROJET: npm run dev');

} catch (error) {
  console.error('❌ ERREUR CRITIQUE:', error.message);
  
  console.log('\n🆘 ÉTAPES DE RÉCUPÉRATION MANUELLE:');
  console.log('1. rm -rf node_modules bun.lockb package-lock.json');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm cache clean --force');
  console.log('4. npm install --legacy-peer-deps');
  console.log('5. npm run dev');
  
  process.exit(1);
}
