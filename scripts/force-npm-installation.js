
#!/usr/bin/env node

/**
 * Solution finale : Force l'installation npm et élimine complètement Bun
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 SOLUTION FINALE - Élimination complète de Bun');

// 1. Supprimer tous les caches et fichiers de lock
try {
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
  
  // Nettoyer les caches
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    console.log('⚠️ Nettoyage cache npm échoué');
  }
  
} catch (error) {
  console.log('⚠️ Erreur de nettoyage, continuons...');
}

// 2. Configurer l'environnement pour npm uniquement
process.env.BUN_DISABLED = 'true';
process.env.USE_NPM_ONLY = 'true';
process.env.PACKAGE_MANAGER = 'npm';
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// 3. Créer .npmrc optimisé
const npmrcContent = `
# FORCE NPM UNIQUEMENT
engine-strict=true
package-manager=npm

# Bloquer Bun complètement
bun=false
use-bun=false

# Éviter les binaires lourds
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Optimisations
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3
`.trim();

fs.writeFileSync('.npmrc', npmrcContent);
console.log('✅ .npmrc optimisé créé');

// 4. Installation avec npm uniquement
function installWithNpm() {
  return new Promise((resolve, reject) => {
    console.log('📦 Installation avec npm...');
    
    const npmProcess = spawn('npm', ['install', '--legacy-peer-deps'], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    npmProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ Installation npm réussie !');
        resolve();
      } else {
        console.log(`❌ Installation npm échouée avec le code ${code}`);
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
    
    npmProcess.on('error', (err) => {
      console.log(`❌ Erreur npm: ${err.message}`);
      reject(err);
    });
  });
}

// 5. Exécution
async function main() {
  try {
    await installWithNpm();
    console.log('\n🎉 Installation terminée avec succès !');
    console.log('🚀 Vous pouvez maintenant lancer: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Échec de l\'installation:', error.message);
    console.log('\n💡 Vérifiez :');
    console.log('1. Votre connexion internet');
    console.log('2. Les permissions de fichier');
    console.log('3. L\'espace disque disponible');
    process.exit(1);
  }
}

main();
