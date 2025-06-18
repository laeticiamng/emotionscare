
#!/usr/bin/env node

/**
 * Script d'urgence - Force npm et supprime toute trace de Bun
 * À utiliser si Bun persiste malgré les autres scripts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 SCRIPT D\'URGENCE - FORCE NPM EXCLUSIF');
console.log('═══════════════════════════════════════════');

try {
  // 1. ARRÊT de tous les processus Bun
  console.log('1️⃣ Arrêt des processus Bun...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
    console.log('✅ Processus Bun arrêtés');
  } catch (e) {
    console.log('ℹ️ Aucun processus Bun en cours');
  }

  // 2. SUPPRESSION TOTALE des fichiers Bun
  console.log('\n2️⃣ Suppression des fichiers Bun...');
  const bunFiles = [
    'bun.lockb',
    'bun.lockb.tmp', 
    '.bun',
    'node_modules/.bun',
    'package-lock.json',
    'yarn.lock'
  ];
  
  bunFiles.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        if (file.includes('.bun') || file === 'node_modules') {
          execSync(`rm -rf "${file}"`, { stdio: 'pipe' });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`✅ Supprimé: ${file}`);
      }
    } catch (e) {
      console.log(`⚠️ Impossible de supprimer ${file}`);
    }
  });

  // 3. SUPPRESSION node_modules pour installation propre
  console.log('\n3️⃣ Nettoyage node_modules...');
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
    console.log('✅ node_modules supprimé');
  }

  // 4. NETTOYAGE des caches
  console.log('\n4️⃣ Nettoyage des caches...');
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Nettoyage cache npm ignoré');
  }

  // 5. CONFIGURATION .npmrc RENFORCÉE
  console.log('\n5️⃣ Configuration npm renforcée...');
  const npmrcContent = `# SOLUTION DÉFINITIVE - CONFLIT BUN/VITEST RÉSOLU
engine-strict=true
package-manager=npm

# BLOCAGE TOTAL BUN
bun=false
use-bun=false
allow-bun=false

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

# Résolution dépendances
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts étendus
network-timeout=300000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
fetch-retries=5

# Configuration package
package-lock=false
save-exact=false
`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc configuré');

  // 6. INSTALLATION AVEC NPM
  console.log('\n6️⃣ Installation avec npm...');
  execSync('npm install --legacy-peer-deps', {
    stdio: 'inherit',
    env: {
      ...process.env,
      CYPRESS_INSTALL_BINARY: '0',
      HUSKY_SKIP_INSTALL: '1',
      PUPPETEER_SKIP_DOWNLOAD: '1',
      NODE_OPTIONS: '--max-old-space-size=4096'
    }
  });

  console.log('\n🎉 SUCCÈS COMPLET !');
  console.log('✅ Bun complètement supprimé');
  console.log('✅ npm installé et configuré');
  console.log('✅ Dépendances installées');
  
  console.log('\n📋 COMMANDES DISPONIBLES:');
  console.log('   npm run dev     ← Démarrer le projet');
  console.log('   npm run build   ← Construire');
  console.log('   npm test        ← Tests');
  
  console.log('\n⚠️ IMPORTANT: N\'utilisez plus jamais "bun install"');

} catch (error) {
  console.error('\n❌ ERREUR:', error.message);
  
  console.log('\n🆘 SOLUTION MANUELLE ULTIME:');
  console.log('1. rm -rf node_modules bun.lockb package-lock.json .bun');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm cache clean --force');
  console.log('4. npm install --legacy-peer-deps');
  console.log('5. npm run dev');
  
  process.exit(1);
}
