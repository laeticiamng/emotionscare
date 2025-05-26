
#!/usr/bin/env node

/**
 * Script d'urgence pour contourner le problème d'intégrité de @vitest/browser
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 Résolution d\'urgence du problème bun/vitest...');

// Variables d'environnement
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Supprimer tous les fichiers de cache
  console.log('🧹 Nettoyage complet...');
  
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
  
  // 2. Nettoyer les caches
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
  
  // 3. Installation avec npm (éviter bun complètement)
  console.log('📦 Installation avec npm (contournement de bun)...');
  execSync('npm install --legacy-peer-deps --no-package-lock', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('🎉 Installation réussie avec npm !');
  console.log('💡 Vous pouvez maintenant utiliser: npm run dev');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  console.log('\n🔧 Essayez manuellement:');
  console.log('rm -rf node_modules bun.lockb');
  console.log('npm install --legacy-peer-deps');
  process.exit(1);
}
