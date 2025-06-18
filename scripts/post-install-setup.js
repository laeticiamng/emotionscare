
#!/usr/bin/env node

/**
 * Post-install setup - Sécurise npm et déclenche bootstrap
 * Remplace force-npm-only.js supprimé
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Post-install setup démarré...');

// 1. Bloquer Bun définitivement
if (process.env.npm_execpath && process.env.npm_execpath.includes('bun')) {
  console.error('❌ ERREUR: Bun détecté et bloqué');
  console.error('Ce projet requiert exclusivement npm:');
  console.error('  npm install');
  console.error('  npm run dev');
  process.exit(1);
}

// 2. Nettoyer traces Bun
const bunFiles = ['bun.lockb', '.bun'];
bunFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      if (file === '.bun') {
        execSync(`rm -rf "${file}"`, { stdio: 'pipe' });
      } else {
        fs.unlinkSync(file);
      }
      console.log(`✅ Nettoyé: ${file}`);
    } catch (e) {
      // Ignore les erreurs de nettoyage
    }
  }
});

// 3. Déclencher bootstrap
try {
  console.log('🚀 Lancement du bootstrap...');
  execSync('npm run bootstrap', { stdio: 'inherit' });
  console.log('✅ Post-install setup terminé avec succès');
} catch (error) {
  console.error('❌ Erreur lors du bootstrap:', error.message);
  process.exit(1);
}
