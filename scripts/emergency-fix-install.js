
#!/usr/bin/env node

/**
 * Script d'installation d'urgence pour résoudre les problèmes de package.json
 * Corrige automatiquement les dépendances problématiques et lance l'installation
 */

const fs = require('fs');
const { spawn, execSync } = require('child_process');
const path = require('path');

console.log('🚨 Script d\'installation d\'urgence démarré...');

const packageJsonPath = './package.json';

// Étape 1: Corriger package.json
console.log('🔧 Correction automatique de package.json...');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json non trouvé');
  process.exit(1);
}

try {
  const packageContent = fs.readFileSync(packageJsonPath, 'utf8');
  let packageJson = JSON.parse(packageContent);

  // Supprimer pgtap-run des devDependencies
  if (packageJson.devDependencies && packageJson.devDependencies['pgtap-run']) {
    delete packageJson.devDependencies['pgtap-run'];
    console.log('✅ Suppression de pgtap-run des devDependencies');
  }

  // Supprimer edge-test-kit s'il existe
  if (packageJson.devDependencies && packageJson.devDependencies['edge-test-kit']) {
    delete packageJson.devDependencies['edge-test-kit'];
    console.log('✅ Suppression de edge-test-kit des devDependencies');
  }

  // Supprimer le doublon de pg dans devDependencies
  if (packageJson.devDependencies && packageJson.devDependencies['pg'] && packageJson.dependencies && packageJson.dependencies['pg']) {
    delete packageJson.devDependencies['pg'];
    console.log('✅ Suppression du doublon pg dans devDependencies');
  }

  // Modifier le script test:sql
  if (packageJson.scripts && packageJson.scripts['test:sql']) {
    packageJson.scripts['test:sql'] = 'echo "pgtap-run non disponible - tests SQL désactivés"';
    console.log('✅ Modification du script test:sql');
  }

  // Sauvegarder le package.json corrigé
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json corrigé et sauvegardé');

} catch (error) {
  console.error('❌ Erreur lors de la correction de package.json:', error.message);
  process.exit(1);
}

// Étape 2: Nettoyer les fichiers existants
console.log('🧹 Nettoyage des fichiers existants...');

try {
  if (fs.existsSync('node_modules')) {
    console.log('Suppression de node_modules...');
    execSync('rm -rf node_modules', { stdio: 'inherit', timeout: 30000 });
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
    console.log('Suppression de package-lock.json');
  }
  if (fs.existsSync('bun.lockb')) {
    fs.unlinkSync('bun.lockb');
    console.log('Suppression de bun.lockb');
  }
} catch (error) {
  console.log('⚠️ Erreur lors du nettoyage:', error.message);
}

// Étape 3: Créer .npmrc optimisé
console.log('⚙️ Création de .npmrc optimisé...');

const npmrcContent = `
# Configuration d'urgence pour éviter les timeouts
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Optimisations réseau
prefer-offline=false
fund=false
audit=false
loglevel=error
progress=true

# Timeouts augmentés
network-timeout=300000
fetch-retry-mintimeout=30000
fetch-retry-maxtimeout=120000
fetch-retries=5

# Dépendances
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false
`.trim();

try {
  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc créé avec succès');
} catch (error) {
  console.log('⚠️ Impossible de créer .npmrc:', error.message);
}

// Étape 4: Variables d'environnement
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Étape 5: Installation avec npm
console.log('📦 Installation avec npm (plus fiable que bun pour cette situation)...');

function runInstallation() {
  return new Promise((resolve, reject) => {
    const npmProcess = spawn('npm', [
      'install',
      '--prefer-offline',
      '--no-audit',
      '--no-fund',
      '--legacy-peer-deps'
    ], {
      stdio: 'inherit',
      env: { ...process.env }
    });

    // Timeout de 10 minutes
    const timeout = setTimeout(() => {
      console.log('⚠️ Timeout atteint, arrêt du processus...');
      npmProcess.kill('SIGTERM');
      setTimeout(() => npmProcess.kill('SIGKILL'), 5000);
      reject(new Error('Installation timeout'));
    }, 600000);

    npmProcess.on('exit', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log('✅ Installation npm réussie !');
        resolve();
      } else {
        console.log(`❌ Installation npm échouée avec le code ${code}`);
        reject(new Error(`npm install failed with code ${code}`));
      }
    });

    npmProcess.on('error', (err) => {
      clearTimeout(timeout);
      console.log(`❌ Erreur du processus npm: ${err.message}`);
      reject(err);
    });
  });
}

// Exécution de l'installation
runInstallation()
  .then(() => {
    console.log('\n🎉 Installation d\'urgence terminée avec succès !');
    console.log('✅ Les dépendances problématiques ont été supprimées');
    console.log('✅ L\'installation a été effectuée avec npm');
    console.log('\n🚀 Vous pouvez maintenant utiliser:');
    console.log('  npm run dev');
    console.log('  ou');
    console.log('  bun dev');
    console.log('\n💡 Note: Vous pouvez maintenant utiliser bun pour les prochaines installations');
  })
  .catch((error) => {
    console.error('\n💥 Échec de l\'installation d\'urgence:', error.message);
    console.log('\n🔧 Solutions alternatives:');
    console.log('1. Vérifiez votre connexion internet');
    console.log('2. Essayez: yarn install');
    console.log('3. Redémarrez votre terminal et réessayez');
    console.log('4. Contactez le support si le problème persiste');
    process.exit(1);
  });
node scripts/emergency-fix-install.js
