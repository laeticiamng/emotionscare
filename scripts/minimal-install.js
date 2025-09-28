
#!/usr/bin/env node

/**
 * Installation minimale - contourne tous les problèmes de timeout
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('⚡ Installation minimale ultra-rapide...');

// Configuration minimale
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';

// .npmrc minimal
const npmrc = `
cypress_install_binary=0
husky_skip_install=1
puppeteer_skip_download=1
prefer-offline=true
fund=false
audit=false
network-timeout=10000
`;

fs.writeFileSync('.npmrc', npmrc.trim());

try {
  // Installation rapide avec npm
  execSync('npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps --no-optional --silent', {
    stdio: 'inherit',
    timeout: 90000, // 1.5 minutes max
    env: { ...process.env }
  });
  
  console.log('✅ Installation minimale réussie !');
  console.log('🚀 Lancez: npm run dev');
  
} catch (error) {
  console.error('❌ Installation échouée:', error.message);
  console.log('\n💡 Essayez manuellement:');
  console.log('rm -rf node_modules package-lock.json');
  console.log('npm install --legacy-peer-deps');
}
