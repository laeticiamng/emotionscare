
#!/usr/bin/env node

/**
 * Installation rapide pour contourner les timeouts de bun
 */

const { execSync } = require('child_process');

console.log('🚀 Installation rapide démarrée...');

// Variables d'environnement
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';

try {
  console.log('📦 Installation avec npm...');
  execSync('npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps --network-timeout=600000', {
    stdio: 'inherit',
    timeout: 900000 // 15 minutes
  });
  console.log('✅ Installation terminée avec succès!');
} catch (error) {
  console.error('❌ Erreur d\'installation:', error.message);
  console.log('\n💡 Essayez: node install-optimized.js');
  process.exit(1);
}
