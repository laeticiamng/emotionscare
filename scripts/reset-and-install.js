
#!/usr/bin/env node

/**
 * Script de reset complet et installation propre
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Reset complet et installation propre...');

// Nettoyer complètement
try {
  console.log('🧹 Suppression des fichiers...');
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }
  if (fs.existsSync('bun.lockb')) {
    fs.unlinkSync('bun.lockb');
  }
} catch (error) {
  console.log('⚠️ Erreur de nettoyage, continuons...');
}

// Variables d'environnement optimisées
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// .npmrc optimisé
const npmrc = `
cypress_install_binary=0
husky_skip_install=1
puppeteer_skip_download=1
prefer-offline=true
fund=false
audit=false
loglevel=error
progress=false
legacy-peer-deps=true
network-timeout=60000
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=30000
fetch-retries=3
`;

fs.writeFileSync('.npmrc', npmrc.trim());

try {
  console.log('📦 Installation npm avec timeout court...');
  execSync('npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps', {
    stdio: 'inherit',
    timeout: 120000, // 2 minutes max
    env: { ...process.env }
  });
  
  console.log('✅ Reset et installation réussis !');
  console.log('🚀 Vous pouvez maintenant lancer: npm run dev');
  
} catch (error) {
  console.error('❌ Installation échouée:', error.message);
  console.log('\n💡 Solutions alternatives:');
  console.log('1. Vérifiez votre connexion internet');
  console.log('2. Essayez: yarn install');
  console.log('3. Contactez le support si le problème persiste');
}
