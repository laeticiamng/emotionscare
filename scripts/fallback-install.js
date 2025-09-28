
#!/usr/bin/env node

/**
 * Script d'installation de secours - contourne les timeouts de bun
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Script d'installation de secours démarré...');

// Variables d'environnement agressives
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.CYPRESS_SKIP_BINARY_CACHE = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.SKIP_POSTINSTALL = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=8192';

// Créer un .npmrc ultra-optimisé
const npmrcContent = `
# Configuration d'urgence - skip tous les binaires
cypress_install_binary=0
cypress_skip_binary_install=1
cypress_skip_binary_cache=1
husky_skip_install=1
puppeteer_skip_download=1
skip_postinstall=1

# Optimisations réseau
prefer-offline=true
fund=false
audit=false
loglevel=warn
progress=false

# Timeouts courts pour fail-fast
network-timeout=15000
fetch-retry-mintimeout=2000
fetch-retry-maxtimeout=10000
fetch-retries=1

# Dépendances
legacy-peer-deps=true
auto-install-peers=false
strict-peer-dependencies=false
`;

try {
  fs.writeFileSync('.npmrc', npmrcContent.trim());
  console.log('✅ Configuration .npmrc de secours créée');
} catch (error) {
  console.log('⚠️ Impossible de créer .npmrc, continuons...');
}

// Nettoyer le cache
try {
  console.log('🧹 Nettoyage du cache...');
  execSync('npm cache clean --force', { stdio: 'inherit', timeout: 30000 });
} catch (error) {
  console.log('⚠️ Nettoyage du cache échoué, continuons...');
}

// Installation avec timeout strict
function installWithStrictTimeout() {
  return new Promise((resolve, reject) => {
    console.log('📦 Installation npm avec timeout strict...');
    
    const npmProcess = spawn('npm', [
      'install',
      '--prefer-offline',
      '--no-audit',
      '--no-fund',
      '--legacy-peer-deps',
      '--no-optional'
    ], {
      stdio: 'pipe',
      env: { ...process.env }
    });

    let output = '';
    
    npmProcess.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write('.');
    });

    npmProcess.stderr.on('data', (data) => {
      output += data.toString();
    });

    // Timeout de 60 secondes seulement
    const timeout = setTimeout(() => {
      console.log('\n⚡ Timeout atteint, arrêt du processus...');
      npmProcess.kill('SIGKILL');
      reject(new Error('Installation timeout (60s)'));
    }, 60000);

    npmProcess.on('exit', (code) => {
      clearTimeout(timeout);
      console.log(`\n📋 Processus terminé avec le code: ${code}`);
      
      if (code === 0) {
        console.log('✅ Installation réussie !');
        resolve();
      } else {
        console.log('❌ Installation échouée');
        console.log('Sortie:', output.slice(-500)); // Dernières 500 chars
        reject(new Error(`npm install failed with code ${code}`));
      }
    });

    npmProcess.on('error', (err) => {
      clearTimeout(timeout);
      console.log(`❌ Erreur du processus: ${err.message}`);
      reject(err);
    });
  });
}

// Exécution
installWithStrictTimeout()
  .then(() => {
    console.log('\n🎉 Installation de secours terminée !');
    console.log('💡 Vous pouvez maintenant lancer: npm run dev');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Échec de l\'installation de secours:', error.message);
    console.log('\n🔧 Solutions alternatives:');
    console.log('1. Vérifiez votre connexion internet');
    console.log('2. Essayez: yarn install --prefer-offline');
    console.log('3. Supprimez node_modules et package-lock.json puis réessayez');
    console.log('4. Utilisez un VPN si vous êtes derrière un firewall');
    process.exit(1);
  });
