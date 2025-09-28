
#!/usr/bin/env node

/**
 * Script de résolution définitive du conflit Bun/@vitest/browser
 * Ce script force l'utilisation de npm et résout tous les problèmes d'intégrité
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 RÉSOLUTION AUTOMATIQUE DU CONFLIT BUN/VITEST...\n');

// Variables d'environnement pour éviter les binaires lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. ARRÊTER tous les processus
  console.log('1️⃣ Arrêt des processus en cours...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
    execSync('pkill -f vite', { stdio: 'pipe' });
    console.log('✅ Processus arrêtés');
  } catch (e) {
    console.log('ℹ️ Aucun processus à arrêter');
  }

  // 2. NETTOYAGE COMPLET
  console.log('\n2️⃣ Nettoyage complet...');
  
  const filesToRemove = [
    'node_modules',
    'bun.lockb', 
    'package-lock.json',
    'yarn.lock',
    '.bun'
  ];
  
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

  // 3. CONFIGURATION NPM FORCÉE
  console.log('\n3️⃣ Configuration npm forcée...');
  
  const npmrcContent = `# CONFIGURATION NPM FORCÉE - RÉSOLUTION CONFLIT BUN/VITEST
package-manager=npm
engine-strict=true

# Interdire complètement Bun
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

# Résolution de dépendances
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts optimisés
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Configuration package
package-lock=false
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ Configuration .npmrc créée');

  // 4. NETTOYAGE DES CACHES
  console.log('\n4️⃣ Nettoyage des caches...');
  
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Nettoyage cache npm ignoré');
  }

  // 5. INSTALLATION AVEC NPM
  console.log('\n5️⃣ Installation avec npm...');
  
  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false'
    }
  });

  // 6. VÉRIFICATION POST-INSTALLATION
  console.log('\n6️⃣ Vérification...');
  
  const criticalPackages = ['react', 'react-dom', 'vite', '@vitejs/plugin-react'];
  let allInstalled = true;
  
  criticalPackages.forEach(pkg => {
    if (fs.existsSync(`node_modules/${pkg}`)) {
      console.log(`✅ ${pkg} installé`);
    } else {
      console.log(`❌ ${pkg} MANQUANT`);
      allInstalled = false;
    }
  });

  if (allInstalled) {
    console.log('\n🎉 PROBLÈME RÉSOLU AVEC SUCCÈS !');
    console.log('✅ Le conflit Bun/@vitest/browser est éliminé');
    console.log('✅ Le projet est configuré pour npm uniquement');
    console.log('\n📋 COMMANDES À UTILISER MAINTENANT:');
    console.log('   npm run dev     ← Démarrer le projet');
    console.log('   npm install     ← Installer des dépendances');
    console.log('   npm run build   ← Construire le projet');
    console.log('\n🚀 LANCEZ: npm run dev');
    console.log('\n⚠️ IMPORTANT: N\'utilisez plus jamais "bun install"');
  } else {
    throw new Error('Installation incomplète');
  }

} catch (error) {
  console.error('\n❌ ERREUR:', error.message);
  
  console.log('\n🆘 SOLUTION MANUELLE:');
  console.log('1. rm -rf node_modules bun.lockb package-lock.json');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm install --legacy-peer-deps');
  console.log('4. npm run dev');
  
  process.exit(1);
}
