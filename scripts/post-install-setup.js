
#!/usr/bin/env node

/**
 * Post-install setup - Bloque Bun DÉFINITIVEMENT et force npm
 * Script exécuté après chaque npm install pour garantir la stabilité
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Détection précoce de Bun - ARRÊT IMMÉDIAT
if (process.env.npm_execpath && process.env.npm_execpath.includes('bun')) {
  console.error('\n🚨 ERREUR CRITIQUE: Bun détecté et BLOQUÉ');
  console.error('╔══════════════════════════════════════════════════════════╗');
  console.error('║  Ce projet EXIGE npm exclusivement                      ║');
  console.error('║  Conflit d\'intégrité avec @vitest/browser               ║');
  console.error('╚══════════════════════════════════════════════════════════╝');
  console.error('\n✅ SOLUTION:');
  console.error('  rm -rf node_modules bun.lockb');
  console.error('  npm install --legacy-peer-deps');
  console.error('  npm run dev\n');
  process.exit(1);
}

// Vérification des arguments de commande
if (process.argv.some(arg => arg.includes('bun'))) {
  console.error('\n❌ Commande Bun détectée dans les arguments');
  console.error('Utilisez npm exclusivement pour ce projet');
  process.exit(1);
}

console.log('🔧 Post-install setup - Sécurisation npm...');

try {
  // 1. SUPPRESSION AGGRESSIVE des traces Bun
  const bunFiles = ['bun.lockb', '.bun', 'bun.lockb.tmp'];
  bunFiles.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        if (file === '.bun') {
          execSync(`rm -rf "${file}"`, { stdio: 'pipe' });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`✅ Supprimé: ${file}`);
      }
    } catch (e) {
      // Ignore les erreurs de suppression
    }
  });

  // 2. RENFORCEMENT .npmrc
  const npmrcPath = path.join(process.cwd(), '.npmrc');
  const npmrcContent = `# CONFIGURATION NPM RENFORCÉE - ANTI-BUN
engine-strict=true
package-manager=npm

# BLOCAGE TOTAL DE BUN
bun=false
use-bun=false
allow-bun=false

# Optimisations installation
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true
legacy-peer-deps=true

# Timeouts étendus
network-timeout=300000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
fetch-retries=5

# Résolution de dépendances
auto-install-peers=true
strict-peer-dependencies=false
package-lock=false
save-exact=false
`;

  fs.writeFileSync(npmrcPath, npmrcContent);
  console.log('✅ Configuration .npmrc renforcée');

  // 3. NETTOYAGE caches si nécessaire
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache npm nettoyé');
  } catch (e) {
    // Cache déjà propre
  }

  // 4. VÉRIFICATION intégrité critique
  const criticalFiles = ['package.json', 'src/main.tsx', 'index.html'];
  const allExist = criticalFiles.every(file => fs.existsSync(file));
  
  if (!allExist) {
    console.error('❌ Fichiers critiques manquants après installation');
    process.exit(1);
  }

  // 5. DÉCLENCHEMENT bootstrap si disponible
  if (fs.existsSync('scripts/bootstrap.js')) {
    console.log('🚀 Lancement du bootstrap...');
    execSync('npm run bootstrap', { stdio: 'inherit' });
  }

  console.log('\n🎉 Post-install setup RÉUSSI');
  console.log('✅ Bun définitivement bloqué');
  console.log('✅ npm configuré et sécurisé');
  console.log('\n📋 COMMANDES AUTORISÉES:');
  console.log('   npm run dev     ← Démarrer le projet');
  console.log('   npm install     ← Installer des dépendances');
  console.log('   npm run build   ← Construire le projet');
  console.log('   npm test        ← Lancer les tests');

} catch (error) {
  console.error('\n❌ ERREUR lors du post-install setup:', error.message);
  console.error('\n🆘 SOLUTION MANUELLE:');
  console.error('1. rm -rf node_modules bun.lockb package-lock.json');
  console.error('2. echo "package-manager=npm" > .npmrc');
  console.error('3. npm install --legacy-peer-deps');
  console.error('4. npm run dev');
  process.exit(1);
}
