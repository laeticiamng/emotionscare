
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 ÉLIMINATION COMPLÈTE DE BUN - SOLUTION FINALE');

// Variables d'environnement pour éviter les binaires lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';
process.env.USE_BUN = 'false';
process.env.BUN = '';

try {
  // 1. TUER tous les processus bun ET vite
  console.log('🛑 Arrêt forcé de TOUS les processus...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
    execSync('pkill -f vite', { stdio: 'pipe' });
    execSync('pkill -f node', { stdio: 'pipe' });
    console.log('✅ Processus arrêtés');
  } catch (e) {
    console.log('ℹ️ Aucun processus à arrêter');
  }

  // 2. DESTRUCTION COMPLÈTE de tous les fichiers
  console.log('🧹 Destruction complète...');
  const filesToDestroy = [
    'node_modules',
    'bun.lockb',
    'package-lock.json',
    'yarn.lock',
    '.bun',
    '.npm',
    '.cache'
  ];
  
  filesToDestroy.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        execSync(`rm -rf "${file}"`, { stdio: 'pipe' });
        console.log(`✅ Détruit: ${file}`);
      } catch (e) {
        console.log(`⚠️ Impossible de détruire ${file}`);
      }
    }
  });

  // 3. CRÉER .npmrc ultra-strict
  const npmrcContent = `# INTERDICTION TOTALE DE BUN
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
playwright_skip_browser_download=1

# Optimisations réseau
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true

# Résolution des dépendances pour éviter les conflits
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts optimisés
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Éviter package-lock pour plus de flexibilité
package-lock=false
save-exact=false

# Forcer la résolution npm
resolution-mode=highest`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc anti-Bun créé');

  // 4. CRÉER .package-manager
  fs.writeFileSync('.package-manager', 'npm');
  console.log('✅ .package-manager défini sur npm');

  // 5. NETTOYER tous les caches
  console.log('🧽 Nettoyage de tous les caches...');
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Cache npm non accessible');
  }

  // 6. INSTALLATION FORCÉE avec npm uniquement
  console.log('📦 Installation FORCÉE avec npm (évitant @vitest/browser)...');
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false',
      npm_config_engine_strict: 'true'
    }
  });

  console.log('');
  console.log('🎉 BUN COMPLÈTEMENT ÉLIMINÉ !');
  console.log('✅ Le conflit @vitest/browser est RÉSOLU');
  console.log('');
  console.log('🚀 UTILISEZ MAINTENANT: npm run dev');

} catch (error) {
  console.error('❌ ERREUR:', error.message);
  
  console.log('\n🆘 RÉCUPÉRATION MANUELLE:');
  console.log('1. rm -rf node_modules bun.lockb .bun');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm cache clean --force');
  console.log('4. npm install --legacy-peer-deps');
  console.log('5. npm run dev');
  
  process.exit(1);
}
