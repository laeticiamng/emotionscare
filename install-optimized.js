
#!/usr/bin/env node

/**
 * Script d'installation optimisé avec gestion robuste des timeouts
 * Résout les erreurs ProcessIOError avec bun install
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage de l\'installation optimisée...');

// Variables d'environnement pour éviter les téléchargements lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Configuration .npmrc optimisée
const npmrcContent = `
# Éviter les téléchargements lourds
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Optimisations d'installation
prefer-offline=true
fund=false
audit=false
loglevel=error
progress=false

# Timeouts étendus pour éviter ProcessIOError
network-timeout=900000
fetch-retry-mintimeout=60000
fetch-retry-maxtimeout=300000
fetch-retries=10

# Gestion des dépendances
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Cache
cache-min=86400
`.trim();

fs.writeFileSync('.npmrc', npmrcContent);
console.log('✅ Configuration .npmrc optimisée créée');

// Fonction d'installation avec timeout personnalisé
function runInstallation(command, args, timeoutMs = 600000) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Exécution: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    const timeout = setTimeout(() => {
      console.log(`⚠️ Timeout après ${timeoutMs / 1000}s, arrêt du processus...`);
      process.kill('SIGTERM');
      setTimeout(() => process.kill('SIGKILL'), 5000);
      reject(new Error(`Timeout après ${timeoutMs / 1000}s`));
    }, timeoutMs);
    
    process.on('exit', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log(`✅ ${command} terminé avec succès`);
        resolve();
      } else {
        console.log(`❌ ${command} a échoué avec le code ${code}`);
        reject(new Error(`Processus échoué avec le code ${code}`));
      }
    });
    
    process.on('error', (err) => {
      clearTimeout(timeout);
      console.log(`❌ Erreur d'exécution ${command}: ${err.message}`);
      reject(err);
    });
  });
}

// Installation principale avec fallbacks
async function install() {
  console.log('\n📊 Informations système:');
  console.log(`Node.js: ${process.version}`);
  console.log(`Plateforme: ${process.platform}`);
  
  try {
    const memInfo = require('os');
    console.log(`Mémoire totale: ${Math.round(memInfo.totalmem() / 1024 / 1024 / 1024)}GB`);
    console.log(`Mémoire libre: ${Math.round(memInfo.freemem() / 1024 / 1024)}MB`);
  } catch (e) {
    console.log('Impossible de récupérer les informations mémoire');
  }

  try {
    // Essayer bun avec timeout étendu
    console.log('\n🔄 Tentative avec bun (timeout 10 minutes)...');
    await runInstallation('bun', ['install', '--no-save'], 600000);
    console.log('🎉 Installation réussie avec bun!');
    return;
  } catch (bunError) {
    console.log('⚠️ Échec avec bun, fallback vers npm...');
  }

  try {
    // Fallback npm avec timeout étendu
    console.log('\n🔄 Tentative avec npm (timeout 15 minutes)...');
    await runInstallation('npm', ['install', '--prefer-offline', '--no-audit', '--no-fund', '--legacy-peer-deps'], 900000);
    console.log('🎉 Installation réussie avec npm!');
    return;
  } catch (npmError) {
    console.log('⚠️ Échec avec npm, tentative finale avec yarn...');
  }

  try {
    // Fallback final yarn
    console.log('\n🔄 Tentative finale avec yarn...');
    await runInstallation('yarn', ['install', '--prefer-offline', '--silent'], 900000);
    console.log('🎉 Installation réussie avec yarn!');
  } catch (error) {
    console.error('\n💥 Toutes les méthodes d\'installation ont échoué!');
    console.error('Erreur:', error.message);
    
    console.log('\n🔍 Suggestions de dépannage:');
    console.log('1. Vérifiez votre connexion internet');
    console.log('2. Nettoyez le cache: npm cache clean --force');
    console.log('3. Supprimez node_modules: rm -rf node_modules');
    console.log('4. Vérifiez l\'espace disque disponible');
    console.log('5. Essayez sur un autre réseau');
    
    process.exit(1);
  }
}

// Démarrer l'installation
install();
