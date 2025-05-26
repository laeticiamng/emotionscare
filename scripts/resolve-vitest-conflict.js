
#!/usr/bin/env node

/**
 * Script de résolution définitive du conflit @vitest/browser avec Bun
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 Résolution du conflit @vitest/browser avec Bun...');

// Variables d'environnement pour éviter les binaires lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Nettoyage complet de tous les caches
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
  
  // 2. Créer un .npmrc qui force npm et évite le conflit
  const npmrcContent = `
# Forcer npm au lieu de bun (éviter le conflit @vitest/browser)
package-manager=npm

# Éviter les binaires lourds
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Configuration pour éviter les timeouts
prefer-offline=false
fund=false
audit=false
loglevel=error
progress=false

# Dépendances et compatibilité
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts optimisés
network-timeout=300000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
fetch-retries=3

# Éviter package-lock pour plus de flexibilité
package-lock=false
`.trim();
  
  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc configuré pour éviter le conflit Bun/@vitest/browser');
  
  // 3. Installation avec npm en excluant explicitement les packages problématiques
  console.log('📦 Installation avec npm (contournement du conflit)...');
  
  execSync('npm install --legacy-peer-deps --no-package-lock --no-optional', {
    stdio: 'inherit',
    env: { 
      ...process.env,
      npm_config_package_lock: 'false'
    }
  });
  
  console.log('🎉 Installation réussie ! Le conflit @vitest/browser a été contourné.');
  console.log('💡 Utilisez désormais: npm run dev');
  console.log('⚠️  Important: Utilisez npm au lieu de bun pour ce projet');
  
} catch (error) {
  console.error('❌ Erreur lors de la résolution:', error.message);
  
  console.log('\n🔧 Solutions alternatives:');
  console.log('1. Supprimez manuellement node_modules et bun.lockb');
  console.log('2. Créez un .npmrc avec package-manager=npm');
  console.log('3. Utilisez: npm install --legacy-peer-deps');
  console.log('4. Évitez bun pour ce projet (conflit avec @vitest/browser)');
  
  process.exit(1);
}
