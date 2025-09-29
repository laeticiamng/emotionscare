
#!/usr/bin/env node

/**
 * Script de vérification post-configuration
 * Valide que le Point 1 est correctement implémenté
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔍 Vérification Point 1/30 - Setup Bun');
console.log('==========================================\n');

const checks = [
  {
    name: 'Fichiers npm supprimés',
    check: () => !fs.existsSync('scripts/force-npm-only.js'),
    fix: 'Supprimer manuellement les fichiers npm restants'
  },
  {
    name: 'bunfig.toml présent',
    check: () => fs.existsSync('bunfig.toml'),
    fix: 'Exécuter: bun run scripts/setup-project.js'
  },
  {
    name: 'Package.json optimisé',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.bun && pkg.scripts.dev.includes('bun');
    },
    fix: 'Mettre à jour package.json avec la config Bun'
  },
  {
    name: 'CI GitHub Actions',
    check: () => fs.existsSync('.github/workflows/ci-bun.yml'),
    fix: 'Créer le fichier CI avec Bun'
  },
  {
    name: 'Vite config optimisé',
    check: () => fs.existsSync('vite.config.ts'),
    fix: 'Créer vite.config.ts optimisé'
  },
  {
    name: 'Tests configurés',
    check: () => fs.existsSync('src/setupTests.ts'),
    fix: 'Créer src/setupTests.ts'
  }
];

let passedChecks = 0;
let totalChecks = checks.length;

checks.forEach((check, index) => {
  try {
    if (check.check()) {
      console.log(`✅ ${index + 1}. ${check.name}`);
      passedChecks++;
    } else {
      console.log(`❌ ${index + 1}. ${check.name}`);
      console.log(`   Fix: ${check.fix}`);
    }
  } catch (error) {
    console.log(`❌ ${index + 1}. ${check.name} (erreur: ${error.message})`);
    console.log(`   Fix: ${check.fix}`);
  }
});

console.log(`\n📊 Résultat: ${passedChecks}/${totalChecks} vérifications passées`);

if (passedChecks === totalChecks) {
  console.log('🎉 Point 1/30 validé avec succès !');
  console.log('\n📋 Prêt pour le Point 2: Architecture de base');
} else {
  console.log('⚠️ Des corrections sont nécessaires avant de passer au Point 2');
}
