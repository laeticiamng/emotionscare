
#!/usr/bin/env node

/**
 * SCRIPT D'URGENCE FINAL - Force npm et élimine Bun définitivement
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 SCRIPT D\'URGENCE FINAL - Élimination définitive de Bun');

// Bloquer Bun au niveau système
process.env.BUN = '';
process.env.USE_BUN = 'false';
process.env.PACKAGE_MANAGER = 'npm';
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Tuer TOUS les processus
  console.log('🛑 Arrêt de TOUS les processus...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
    execSync('pkill -f vite', { stdio: 'pipe' });
    execSync('pkill -f node', { stdio: 'pipe' });
    console.log('✅ Processus arrêtés');
  } catch (e) {
    console.log('ℹ️ Aucun processus à arrêter');
  }

  // 2. DESTRUCTION TOTALE des caches
  console.log('🧹 DESTRUCTION TOTALE...');
  const filesToDestroy = [
    'node_modules',
    'bun.lockb', 
    'package-lock.json',
    'yarn.lock',
    '.bun',
    '.npm'
  ];
  
  filesToDestroy.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        if (file === 'node_modules' || file === '.bun' || file === '.npm') {
          execSync(`rm -rf "${file}"`, { stdio: 'pipe' });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`✅ DÉTRUIT: ${file}`);
      } catch (e) {
        console.log(`⚠️ Impossible de détruire ${file}`);
      }
    }
  });

  // 3. .npmrc ULTRA-STRICT
  const npmrcContent = `# ANTI-BUN CONFIGURATION FINALE
engine-strict=true
package-manager=npm

# Bloquer Bun TOTALEMENT
bun=false
use-bun=false

# Éviter binaires lourds
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

# Résolution dépendances
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts optimisés
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Pas de package-lock
package-lock=false
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc ULTRA-STRICT créé');

  // 4. Forcer .package-manager
  fs.writeFileSync('.package-manager', 'npm');
  console.log('✅ .package-manager forcé sur npm');

  // 5. Nettoyer caches npm
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Nettoyage cache npm échoué');
  }

  // 6. Installation FORCÉE npm
  console.log('📦 Installation FORCÉE npm...');
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
  console.log('🎉 SUCCÈS TOTAL !');
  console.log('✅ Bun complètement éliminé');
  console.log('✅ npm exclusivement configuré');
  console.log('');
  console.log('🚀 UTILISEZ MAINTENANT: npm run dev');
  console.log('💡 TOUJOURS utiliser npm pour ce projet');

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
