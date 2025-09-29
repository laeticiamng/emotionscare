
#!/usr/bin/env node

/**
 * Script de configuration Bun pour EmotionsCare
 * Nettoie les artefacts npm et configure l'environnement Bun
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Configuration Bun pour EmotionsCare\n');

// 1. Nettoyer les artefacts npm
console.log('1️⃣ Nettoyage des artefacts npm...');

const filesToRemove = [
  'package-lock.json',
  'yarn.lock',
  'scripts/force-npm-only.js',
  'emergency-npm-install.js',
  'fix-bun-conflict-now.js',
  'install-with-npm.js'
];

filesToRemove.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`  ✅ Supprimé: ${file}`);
    } catch (error) {
      console.log(`  ⚠️ Impossible de supprimer ${file}: ${error.message}`);
    }
  }
});

// 2. Vérifier la présence de Bun
console.log('\n2️⃣ Vérification de Bun...');
try {
  const bunVersion = execSync('bun --version', { encoding: 'utf8' }).trim();
  console.log(`  ✅ Bun ${bunVersion} détecté`);
} catch (error) {
  console.log('  ❌ Bun non installé. Installez Bun: curl -fsSL https://bun.sh/install | bash');
  process.exit(1);
}

// 3. Mettre à jour package.json pour Bun
console.log('\n3️⃣ Configuration package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Ajouter des scripts Bun optimisés
  packageJson.scripts = {
    ...packageJson.scripts,
    'dev': 'bun run vite',
    'build': 'bun run vite build',
    'preview': 'bun run vite preview',
    'test': 'bun test',
    'test:watch': 'bun test --watch',
    'test:coverage': 'bun test --coverage',
    'lint': 'bun run eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
    'audit': 'bun run scripts/audit-project.js',
    'setup': 'bun install && bun run build'
  };
  
  // Ajouter configuration Bun
  packageJson.bun = {
    install: {
      production: false,
      optional: true,
      cache: "~/.bun/install/cache"
    },
    run: {
      silent: false
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('  ✅ package.json mis à jour');
} catch (error) {
  console.log(`  ⚠️ Erreur package.json: ${error.message}`);
}

// 4. Créer bunfig.toml
console.log('\n4️⃣ Configuration bunfig.toml...');
const bunConfig = `
# Configuration Bun pour EmotionsCare
[install]
cache = "~/.bun/install/cache"
registry = "https://registry.npmjs.org"
production = false
optional = true

[install.scopes]

[run]
silent = false

[test]
preload = ["./src/setupTests.ts"]
`;

try {
  fs.writeFileSync('bunfig.toml', bunConfig.trim());
  console.log('  ✅ bunfig.toml créé');
} catch (error) {
  console.log(`  ⚠️ Erreur bunfig.toml: ${error.message}`);
}

// 5. Mettre à jour .gitignore
console.log('\n5️⃣ Mise à jour .gitignore...');
try {
  let gitignore = '';
  if (fs.existsSync('.gitignore')) {
    gitignore = fs.readFileSync('.gitignore', 'utf8');
  }
  
  const bunEntries = [
    '# Bun',
    'bun.lockb',
    '.bun/',
    '*.bun',
    ''
  ];
  
  const hasBeenEntry = bunEntries.some(entry => gitignore.includes(entry.trim()));
  
  if (!hasBunEntry) {
    gitignore += '\n' + bunEntries.join('\n');
    fs.writeFileSync('.gitignore', gitignore);
    console.log('  ✅ .gitignore mis à jour avec les entrées Bun');
  } else {
    console.log('  ✅ .gitignore déjà configuré pour Bun');
  }
} catch (error) {
  console.log(`  ⚠️ Erreur .gitignore: ${error.message}`);
}

// 6. Installer les dépendances avec Bun
console.log('\n6️⃣ Installation des dépendances avec Bun...');
try {
  execSync('bun install', { stdio: 'inherit' });
  console.log('  ✅ Dépendances installées');
} catch (error) {
  console.log(`  ⚠️ Erreur installation: ${error.message}`);
}

console.log('\n🎉 Configuration Bun terminée !');
console.log('\nCommandes disponibles:');
console.log('  bun dev      - Démarrer le serveur de développement');
console.log('  bun build    - Construire pour la production');
console.log('  bun test     - Lancer les tests');
console.log('  bun audit    - Lancer l\'audit du projet');
console.log('  bun setup    - Installation complète');
