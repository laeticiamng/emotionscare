
#!/usr/bin/env node

/**
 * Script de nettoyage complet et réinstallation
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧹 Nettoyage complet et réinstallation...');

// Variables d'environnement pour éviter les binaires lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // Nettoyer tous les fichiers de cache
  console.log('🗑️ Suppression des caches...');
  
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
  
  // Créer un .npmrc optimisé
  const npmrcContent = `
# Éviter les binaires lourds
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Optimisations
prefer-offline=false
fund=false
audit=false
loglevel=error
progress=false
legacy-peer-deps=true

# Timeouts courts
network-timeout=60000
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=30000
fetch-retries=3
`.trim();
  
  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc optimisé créé');
  
  // Installation avec bun
  console.log('📦 Installation avec bun...');
  execSync('bun install', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('🎉 Installation réussie !');
  console.log('🚀 Vous pouvez maintenant lancer: npm run dev');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  
  // Fallback avec npm
  console.log('\n🔄 Tentative avec npm...');
  try {
    execSync('npm install --legacy-peer-deps', {
      stdio: 'inherit',
      env: { ...process.env }
    });
    console.log('✅ Installation npm réussie !');
  } catch (npmError) {
    console.error('❌ Échec npm aussi:', npmError.message);
    process.exit(1);
  }
}
