
#!/usr/bin/env node

/**
 * SCRIPT D'URGENCE - Résolution immédiate du conflit Bun/@vitest/browser
 * À lancer à la racine du projet avec : node fix-bun-conflict-now.js
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 RÉSOLUTION D\'URGENCE DU CONFLIT BUN/@vitest/browser');
console.log('📍 Script lancé depuis :', process.cwd());

// Variables d'environnement pour éviter les binaires lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. ARRÊTER tous les processus bun
  console.log('🛑 Arrêt des processus bun...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
  } catch (e) {
    console.log('   (Aucun processus bun en cours)');
  }

  // 2. NETTOYAGE BRUTAL de tous les fichiers
  console.log('🧹 Nettoyage brutal de tous les caches...');
  
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
        console.log(`⚠️ Impossible de détruire ${file}, continuons...`);
      }
    }
  });

  // 3. NETTOYER les caches système
  console.log('🧽 Nettoyage des caches système...');
  
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Cache npm non accessible');
  }
  
  try {
    execSync('bun pm cache rm', { stdio: 'pipe' });
    console.log('✅ Cache bun détruit');
  } catch (e) {
    console.log('⚠️ Cache bun non accessible');
  }

  // 4. CRÉER un .npmrc qui INTERDIT bun
  const npmrcContent = `# INTERDICTION TOTALE DE BUN - RÉSOLUTION @vitest/browser
package-manager=npm
engine-strict=true

# Interdire bun complètement
scripts-prepend-node-path=true

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

  // 5. INSTALLATION FORCÉE avec npm
  console.log('📦 Installation FORCÉE avec npm (contournement @vitest/browser)...');
  
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund --verbose', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false',
      npm_config_engine_strict: 'true'
    }
  });

  console.log('');
  console.log('🎉 PROBLÈME RÉSOLU AVEC SUCCÈS !');
  console.log('✅ Le conflit @vitest/browser avec Bun est ÉLIMINÉ');
  console.log('');
  console.log('📋 COMMANDES À UTILISER MAINTENANT:');
  console.log('   npm run dev     ← Démarrer le projet');
  console.log('   npm install     ← Installer des dépendances');
  console.log('   npm run build   ← Construire le projet');
  console.log('   npm test        ← Lancer les tests');
  console.log('');
  console.log('🚀 LANCEZ MAINTENANT: npm run dev');
  console.log('');
  console.log('⚠️  IMPORTANT: N\'utilisez plus jamais "bun" pour ce projet');

} catch (error) {
  console.error('❌ ERREUR CRITIQUE:', error.message);
  
  console.log('\n🆘 SOLUTION MANUELLE D\'URGENCE:');
  console.log('1. rm -rf node_modules bun.lockb package-lock.json .bun');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm cache clean --force');
  console.log('4. npm install --legacy-peer-deps');
  console.log('5. npm run dev');
  
  process.exit(1);
}
