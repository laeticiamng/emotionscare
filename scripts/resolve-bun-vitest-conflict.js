
#!/usr/bin/env node

/**
 * Script de résolution définitive du conflit @vitest/browser avec Bun
 * Force l'utilisation de npm et nettoie tous les caches
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 Résolution définitive du conflit @vitest/browser avec Bun...');

// Variables d'environnement pour éviter les binaires lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Nettoyage complet et agressif
  console.log('🧹 Nettoyage complet de tous les caches et fichiers...');
  
  const filesToRemove = [
    'node_modules',
    'bun.lockb', 
    'package-lock.json',
    'yarn.lock',
    '.bun',
    'dist'
  ];
  
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        if (file === 'node_modules' || file === '.bun' || file === 'dist') {
          execSync(`rm -rf ${file}`, { stdio: 'pipe' });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`✅ Supprimé: ${file}`);
      } catch (e) {
        console.log(`⚠️ Impossible de supprimer ${file}, continuons...`);
      }
    }
  });

  // 2. Nettoyer les caches système
  console.log('🧽 Nettoyage des caches système...');
  
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Nettoyage cache npm ignoré');
  }
  
  try {
    execSync('bun pm cache rm', { stdio: 'pipe' });
    console.log('✅ Cache bun nettoyé');
  } catch (e) {
    console.log('⚠️ Nettoyage cache bun ignoré');
  }

  // 3. Créer un .npmrc qui force npm et évite bun
  const npmrcContent = `# FORCE NPM USAGE - AVOID BUN CONFLICT WITH @vitest/browser
package-manager=npm
engine-strict=true

# Skip heavy binaries to speed up installation
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Network optimizations
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true

# Dependency resolution
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeout settings
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Package lock settings
package-lock=false
save-exact=false`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc créé avec configuration anti-bun');

  // 4. Créer .nvmrc pour version Node cohérente
  fs.writeFileSync('.nvmrc', '18');
  console.log('✅ .nvmrc créé pour Node 18');

  // 5. Installation avec npm - éviter complètement bun
  console.log('📦 Installation avec npm (contournement complet de bun)...');
  
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
  console.log('✅ Le conflit @vitest/browser avec Bun a été éliminé');
  console.log('');
  console.log('📋 NOUVELLES COMMANDES À UTILISER:');
  console.log('   npm run dev     (au lieu de bun dev)');
  console.log('   npm install     (au lieu de bun install)');
  console.log('   npm run build   (au lieu de bun run build)');
  console.log('   npm test        (au lieu de bun test)');
  console.log('');
  console.log('🚀 Démarrer maintenant: npm run dev');

} catch (error) {
  console.error('❌ Erreur lors de la résolution:', error.message);
  
  console.log('\n🆘 SOLUTION MANUELLE D\'URGENCE:');
  console.log('1. rm -rf node_modules bun.lockb package-lock.json .bun');
  console.log('2. echo "package-manager=npm" > .npmrc');
  console.log('3. npm cache clean --force');
  console.log('4. npm install --legacy-peer-deps');
  console.log('5. npm run dev');
  
  process.exit(1);
}
