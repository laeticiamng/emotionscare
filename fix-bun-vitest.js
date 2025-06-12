#!/usr/bin/env node

/**
 * Solution d'urgence pour l'erreur Bun/Vitest
 * ÉTAPES SIMPLES POUR RÉSOUDRE LE PROBLÈME
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 RÉSOLUTION ERREUR BUN/VITEST...\n');

try {
  // ÉTAPE 1: Tuer tous les processus
  console.log('1️⃣ Arrêt de tous les processus...');
  try {
    execSync('pkill -f bun', { stdio: 'pipe' });
    execSync('pkill -f vite', { stdio: 'pipe' });
    console.log('✅ Processus arrêtés');
  } catch (e) {
    console.log('ℹ️ Aucun processus à arrêter');
  }

  // ÉTAPE 2: Suppression complète
  console.log('\n2️⃣ Nettoyage complet...');
  
  const filesToDelete = [
    'node_modules',
    'bun.lockb', 
    'package-lock.json',
    'yarn.lock',
    '.bun'
  ];
  
  filesToDelete.forEach(file => {
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

  // ÉTAPE 3: Configuration npm pure
  console.log('\n3️⃣ Configuration npm-only...');
  
  const npmrcContent = `# Configuration npm pure (sans Bun)
package-manager=npm
engine-strict=true
legacy-peer-deps=true
package-lock=false
audit=false
fund=false

# Variables environnement
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ Fichier .npmrc créé');

  // ÉTAPE 4: Nettoyage caches
  console.log('\n4️⃣ Nettoyage des caches...');
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Nettoyage cache ignoré');
  }

  // ÉTAPE 5: Installation npm pure
  console.log('\n5️⃣ Installation avec npm (bypass Bun)...');
  
  process.env.CYPRESS_INSTALL_BINARY = '0';
  process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
  process.env.HUSKY_SKIP_INSTALL = '1';
  process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';

  execSync('npm install --legacy-peer-deps --no-package-lock --no-audit', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_package_lock: 'false'
    }
  });

  console.log('\n🎉 PROBLÈME RÉSOLU !');
  console.log('✅ Bun complètement contourné');
  console.log('✅ Installation npm réussie');
  console.log('\n🚀 Commandes disponibles:');
  console.log('   npm run dev     → Démarrer le serveur');
  console.log('   npm run build   → Build production');
  console.log('\n⚠️ IMPORTANT: Utilisez toujours npm (jamais bun)');

} catch (error) {
  console.error('\n❌ ERREUR:', error.message);
  console.log('\n🆘 SOLUTION MANUELLE:');
  console.log('1. rm -rf node_modules bun.lockb');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm install --legacy-peer-deps');
  console.log('4. npm run dev');
  process.exit(1);
}