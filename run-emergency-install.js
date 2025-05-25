
#!/usr/bin/env node

/**
 * Script d'urgence pour résoudre les timeouts de bun install
 * Utilise les scripts optimisés déjà présents dans le projet
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 Résolution du problème de timeout bun install...');

// Variables d'environnement pour éviter les téléchargements lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Créer un .npmrc optimisé pour éviter les timeouts
const npmrcContent = `
# Configuration d'urgence pour éviter les timeouts
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Optimisations réseau
prefer-offline=true
fund=false
audit=false
loglevel=error
progress=false

# Timeouts courts pour fail-fast
network-timeout=30000
fetch-retry-mintimeout=5000
fetch-retry-maxtimeout=15000
fetch-retries=2

# Dépendances
legacy-peer-deps=true
auto-install-peers=false
strict-peer-dependencies=false
`;

try {
  fs.writeFileSync('.npmrc', npmrcContent.trim());
  console.log('✅ Configuration .npmrc optimisée créée');
} catch (error) {
  console.log('⚠️ Impossible de créer .npmrc, continuons...');
}

// Nettoyer et installer avec npm
try {
  console.log('🧹 Nettoyage...');
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit', timeout: 30000 });
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }
  
  console.log('📦 Installation avec npm...');
  execSync('npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps', {
    stdio: 'inherit',
    timeout: 120000, // 2 minutes max
    env: { ...process.env }
  });
  
  console.log('✅ Installation réussie !');
  console.log('🚀 Vous pouvez maintenant utiliser: npm run dev');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  console.log('\n💡 Solutions alternatives:');
  console.log('1. node scripts/emergency-install.js');
  console.log('2. node install-optimized.js');
  console.log('3. Vérifiez votre connexion internet');
}
