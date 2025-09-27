
#!/usr/bin/env node

/**
 * Script de configuration complète du projet EmotionsCare avec Bun
 * Point 1 du ticket FE-FULL-SCOPE-EMOTIONScare
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configuration EmotionsCare avec Bun - Point 1/30\n');

// 1. Vérifier la présence de Bun
console.log('1️⃣ Vérification de Bun...');
try {
  const bunVersion = execSync('bun --version', { encoding: 'utf8' }).trim();
  console.log(`  ✅ Bun ${bunVersion} détecté`);
} catch (error) {
  console.log('  ❌ Bun non installé. Installation requise: curl -fsSL https://bun.sh/install | bash');
  process.exit(1);
}

// 2. Créer bunfig.toml optimisé
console.log('\n2️⃣ Configuration bunfig.toml...');
const bunConfig = `
# Configuration Bun pour EmotionsCare
[install]
cache = "~/.bun/install/cache"
registry = "https://registry.npmjs.org"
production = false
optional = true
exact = false

[install.scopes]

[run]
silent = false
bun = true

[test]
preload = ["./src/setupTests.ts"]
coverage = true

[build]
target = "browser"
sourcemap = "external"
`;

try {
  fs.writeFileSync('bunfig.toml', bunConfig.trim());
  console.log('  ✅ bunfig.toml créé');
} catch (error) {
  console.log(`  ⚠️ Erreur bunfig.toml: ${error.message}`);
}

// 3. Mettre à jour package.json pour Bun
console.log('\n3️⃣ Optimisation package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Scripts optimisés pour Bun
  packageJson.scripts = {
    ...packageJson.scripts,
    'dev': 'bun --bun vite',
    'build': 'bun run vite build',
    'preview': 'bun --bun vite preview',
    'test': 'bun test',
    'test:watch': 'bun test --watch',
    'test:coverage': 'bun test --coverage',
    'test:e2e': 'bun run cypress run',
    'lint': 'bun run eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
    'lint:fix': 'bun run eslint . --ext ts,tsx --fix',
    'type-check': 'bun run tsc --noEmit',
    'audit': 'bun run scripts/audit-project.js',
    'setup': 'bun install && bun run build',
    'clean': 'rm -rf node_modules dist .bun bun.lockb && bun install'
  };
  
  // Configuration Bun
  packageJson.bun = {
    install: {
      production: false,
      optional: true,
      cache: "~/.bun/install/cache",
      exact: false
    },
    run: {
      silent: false,
      bun: true
    },
    test: {
      preload: ["./src/setupTests.ts"],
      coverage: true
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('  ✅ package.json optimisé pour Bun');
} catch (error) {
  console.log(`  ⚠️ Erreur package.json: ${error.message}`);
}

// 4. Mettre à jour .gitignore
console.log('\n4️⃣ Mise à jour .gitignore...');
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
    '',
    '# Build artifacts',
    'dist/',
    '.vite/',
    '',
    '# Test coverage',
    'coverage/',
    '.nyc_output/',
    ''
  ];
  
  const hasBunEntry = bunEntries.some(entry => gitignore.includes(entry.trim()));
  
  if (!hasBunEntry) {
    gitignore += '\n' + bunEntries.join('\n');
    fs.writeFileSync('.gitignore', gitignore);
    console.log('  ✅ .gitignore mis à jour');
  } else {
    console.log('  ✅ .gitignore déjà configuré');
  }
} catch (error) {
  console.log(`  ⚠️ Erreur .gitignore: ${error.message}`);
}

// 5. Installation des dépendances
console.log('\n5️⃣ Installation des dépendances...');
try {
  execSync('bun install', { stdio: 'inherit' });
  console.log('  ✅ Dépendances installées');
} catch (error) {
  console.log(`  ⚠️ Erreur installation: ${error.message}`);
}

// 6. Test de build
console.log('\n6️⃣ Test de build...');
try {
  execSync('bun run build', { stdio: 'inherit' });
  console.log('  ✅ Build réussi');
} catch (error) {
  console.log(`  ⚠️ Build échoué: ${error.message}`);
}

console.log('\n🎉 Point 1/30 terminé !');
console.log('\n📋 Prochaines étapes:');
console.log('  Point 2: Architecture de base');
console.log('  Point 3: Système de routing');
console.log('  Point 4: State management');
console.log('  Point 5: Configuration API');
console.log('\n💡 Commandes disponibles:');
console.log('  bun dev      - Serveur de développement');
console.log('  bun build    - Build production');
console.log('  bun test     - Tests unitaires');
console.log('  bun audit    - Audit complet');
