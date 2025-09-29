
#!/usr/bin/env node

/**
 * Script de nettoyage forcé pour résoudre les problèmes d'intégrité de cache
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 Nettoyage forcé en cours...');

// Variables d'environnement pour éviter les binaires lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // Supprimer tous les caches et fichiers de lock
  console.log('🧹 Suppression complète des caches...');
  
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
    console.log('✅ node_modules supprimé');
  }
  
  if (fs.existsSync('bun.lockb')) {
    fs.unlinkSync('bun.lockb');
    console.log('✅ bun.lockb supprimé');
  }
  
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
    console.log('✅ package-lock.json supprimé');
  }
  
  if (fs.existsSync('yarn.lock')) {
    fs.unlinkSync('yarn.lock');
    console.log('✅ yarn.lock supprimé');
  }
  
  // Nettoyer les caches npm et bun
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Impossible de nettoyer le cache npm');
  }
  
  try {
    execSync('bun pm cache rm', { stdio: 'pipe' });
    console.log('✅ Cache bun nettoyé');
  } catch (e) {
    console.log('⚠️ Impossible de nettoyer le cache bun');
  }
  
  // Créer un nouveau .npmrc sans @vitest/browser
  const npmrcContent = `
# Configuration pour éviter les problèmes d'intégrité
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Optimisations réseau strictes
prefer-offline=false
fund=false
audit=false
loglevel=error
progress=false

# Dépendances
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts courts pour fail-fast
network-timeout=120000
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=30000
fetch-retries=3

# Forcer une nouvelle résolution
package-lock=false
`.trim();
  
  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc recréé avec configuration stricte');
  
  // Installation avec npm uniquement (éviter bun pour ce problème)
  console.log('📦 Installation avec npm (évitement de bun)...');
  execSync('npm install --no-package-lock --legacy-peer-deps', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('🎉 Installation réussie !');
  console.log('🚀 Vous pouvez maintenant lancer: npm run dev');
  
} catch (error) {
  console.error('❌ Erreur lors du nettoyage forcé:', error.message);
  
  console.log('\n🔧 Solution alternative manuelle:');
  console.log('1. Supprimez manuellement le dossier ~/.bun/install/cache');
  console.log('2. Relancez: bun install');
  console.log('3. Ou utilisez: npm install --legacy-peer-deps');
  
  process.exit(1);
}
