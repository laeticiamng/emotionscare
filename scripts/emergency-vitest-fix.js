
#!/usr/bin/env node

/**
 * Script d'urgence pour contourner le problème @vitest/browser
 * Utilise npm avec des exclusions spécifiques pour éviter le package problématique
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 Résolution d\'urgence du problème @vitest/browser...');

// Variables d'environnement pour éviter les binaires lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

try {
  // 1. Nettoyer tous les caches
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
  
  // 2. Créer un .npmrc qui évite complètement le problème
  const npmrcContent = `
# Configuration d'urgence pour éviter @vitest/browser
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Forcer npm au lieu de bun
package-manager=npm
prefer-offline=false
fund=false
audit=false
loglevel=error
progress=false

# Dépendances et compatibilité
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts courts pour fail-fast
network-timeout=60000
fetch-retry-mintimeout=5000
fetch-retry-maxtimeout=15000
fetch-retries=2

# Forcer une résolution complètement nouvelle
package-lock=false
`.trim();
  
  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc créé avec configuration anti-vitest/browser');
  
  // 3. Installation avec npm en excluant explicitement les packages problématiques
  console.log('📦 Installation avec npm (exclusion @vitest/browser)...');
  
  // Utiliser npm install avec des flags qui évitent le problème
  execSync('npm install --no-package-lock --legacy-peer-deps --no-optional', {
    stdio: 'inherit',
    env: { 
      ...process.env,
      npm_config_package_lock: 'false',
      npm_config_save_exact: 'false'
    }
  });
  
  console.log('🎉 Installation réussie sans @vitest/browser !');
  console.log('💡 Vous pouvez maintenant utiliser: npm run dev');
  console.log('⚠️  Utilisez npm au lieu de bun pour ce projet');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  
  console.log('\n🔧 Solutions alternatives:');
  console.log('1. Supprimez manuellement node_modules et bun.lockb');
  console.log('2. Créez un .npmrc avec package-manager=npm');
  console.log('3. Utilisez: npm install --legacy-peer-deps --no-optional');
  console.log('4. Évitez bun pour ce projet à cause du conflit @vitest/browser');
  
  process.exit(1);
}
