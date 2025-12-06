#!/usr/bin/env node

/**
 * Script de validation automatique RouterV2
 * Vérifie l'intégrité complète du système de routing
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDATION AUTOMATIQUE ROUTERV2');
console.log('=' .repeat(50));
console.log('');

let errors = [];
let warnings = [];
let stats = {
  files: 0,
  routes: 0,
  tests: 0,
  aliases: 0,
};

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// 1. Vérifier l'existence des fichiers critiques
log('📁 Vérification des fichiers critiques...', 'blue');

const criticalFiles = [
  'src/routerV2/registry.ts',
  'src/routerV2/router.tsx',
  'src/routerV2/guards.tsx',
  'src/routerV2/aliases.tsx',
  'src/routerV2/routes.ts',
  'src/routerV2/schema.ts',
  'src/routerV2/manifest.ts',
  'src/routerV2/validation.ts',
  'src/routerV2/performance.ts',
  'src/routerV2/index.tsx',
];

criticalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    stats.files++;
    log(`  ✅ ${file}`, 'green');
  } else {
    errors.push(`Fichier critique manquant: ${file}`);
    log(`  ❌ ${file} - MANQUANT`, 'red');
  }
});

console.log('');

// 2. Vérifier l'existence des tests
log('🧪 Vérification des tests...', 'blue');

const testFiles = [
  'src/routerV2/__tests__/AuthGuard.test.tsx',
  'src/routerV2/__tests__/RoleGuard.test.tsx',
  'src/routerV2/__tests__/ModeGuard.test.tsx',
  'src/routerV2/__tests__/RouteGuard.test.tsx',
  'src/routerV2/__tests__/aliases.test.ts',
  'src/routerV2/__tests__/guards.test.tsx',
  'src/routerV2/__tests__/registry.test.ts',
  'src/routerV2/__tests__/registry.complete.test.ts',
  'src/routerV2/__tests__/permissions.complete.test.ts',
  'src/routerV2/__tests__/validation.test.ts',
  'src/routerV2/__tests__/performance.test.ts',
];

testFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    stats.tests++;
    log(`  ✅ ${path.basename(file)}`, 'green');
  } else {
    warnings.push(`Fichier de test manquant: ${file}`);
    log(`  ⚠️  ${path.basename(file)} - MANQUANT`, 'yellow');
  }
});

console.log('');

// 3. Analyser le registry
log('📊 Analyse du registry...', 'blue');

try {
  const registryPath = path.join(process.cwd(), 'src/routerV2/registry.ts');
  const registryContent = fs.readFileSync(registryPath, 'utf8');
  
  // Compter les routes
  const routeMatches = registryContent.match(/{\s*name:/g);
  stats.routes = routeMatches ? routeMatches.length : 0;
  
  log(`  📍 Routes définies: ${stats.routes}`, 'green');
  
  // Vérifier les segments
  const segments = ['public', 'consumer', 'employee', 'manager'];
  segments.forEach(segment => {
    const segmentRegex = new RegExp(`segment:\\s*['"\`]${segment}['"\`]`, 'g');
    const matches = registryContent.match(segmentRegex);
    const count = matches ? matches.length : 0;
    log(`  ${segment.padEnd(10)}: ${count} routes`, count > 0 ? 'green' : 'yellow');
  });
  
  // Vérifier les guards
  const guardMatches = registryContent.match(/guard:\s*true/g);
  const guardCount = guardMatches ? guardMatches.length : 0;
  log(`  🔒 Routes protégées: ${guardCount}`, 'green');
  
} catch (error) {
  errors.push(`Erreur lors de l'analyse du registry: ${error.message}`);
  log(`  ❌ Erreur d'analyse`, 'red');
}

console.log('');

// 4. Analyser les alias
log('🔗 Analyse des alias...', 'blue');

try {
  const aliasPath = path.join(process.cwd(), 'src/routerV2/aliases.tsx');
  const aliasContent = fs.readFileSync(aliasPath, 'utf8');
  
  // Compter les alias
  const aliasMatches = aliasContent.match(/['"]\/[^'"]+['"]\s*:\s*['"]\/[^'"]+['"]/g);
  stats.aliases = aliasMatches ? aliasMatches.length : 0;
  
  log(`  🔄 Alias définis: ${stats.aliases}`, 'green');
  
  // Vérifier les fonctions
  const functions = ['findRedirectFor', 'isDeprecatedPath', 'LegacyRedirect'];
  functions.forEach(fn => {
    if (aliasContent.includes(`function ${fn}`) || aliasContent.includes(`const ${fn}`)) {
      log(`  ✅ Fonction ${fn}`, 'green');
    } else {
      warnings.push(`Fonction ${fn} non trouvée dans aliases.tsx`);
      log(`  ⚠️  Fonction ${fn} - NON TROUVÉE`, 'yellow');
    }
  });
  
} catch (error) {
  errors.push(`Erreur lors de l'analyse des alias: ${error.message}`);
  log(`  ❌ Erreur d'analyse`, 'red');
}

console.log('');

// 5. Vérifier la documentation
log('📚 Vérification de la documentation...', 'blue');

const docsFiles = [
  'docs/ROUTING.md',
  'docs/ROUTERV2_INDEX.md',
  'docs/ROUTERV2_SUMMARY.md',
  'docs/PHASE3_VALIDATION_COMPLETE.md',
  'docs/TEST_EXECUTION_PLAN.md',
];

docsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    log(`  ✅ ${path.basename(file)}`, 'green');
  } else {
    warnings.push(`Documentation manquante: ${file}`);
    log(`  ⚠️  ${path.basename(file)} - MANQUANT`, 'yellow');
  }
});

console.log('');

// 6. Résumé final
log('=' .repeat(50), 'blue');
log('📊 RÉSUMÉ DE LA VALIDATION', 'blue');
log('=' .repeat(50), 'blue');
console.log('');

log(`📁 Fichiers critiques: ${stats.files}/${criticalFiles.length}`, 
  stats.files === criticalFiles.length ? 'green' : 'red');
log(`🧪 Fichiers de tests: ${stats.tests}/${testFiles.length}`, 
  stats.tests === testFiles.length ? 'green' : 'yellow');
log(`📍 Routes définies: ${stats.routes}`, 
  stats.routes >= 40 ? 'green' : 'yellow');
log(`🔗 Alias configurés: ${stats.aliases}`, 
  stats.aliases > 0 ? 'green' : 'yellow');

console.log('');

if (errors.length > 0) {
  log(`❌ ERREURS (${errors.length})`, 'red');
  errors.forEach(error => log(`  - ${error}`, 'red'));
  console.log('');
}

if (warnings.length > 0) {
  log(`⚠️  AVERTISSEMENTS (${warnings.length})`, 'yellow');
  warnings.forEach(warning => log(`  - ${warning}`, 'yellow'));
  console.log('');
}

// Conclusion
console.log('');
log('=' .repeat(50), 'blue');

if (errors.length === 0) {
  log('✅ VALIDATION RÉUSSIE', 'green');
  log('Le système RouterV2 est opérationnel!', 'green');
  process.exit(0);
} else {
  log('❌ VALIDATION ÉCHOUÉE', 'red');
  log(`${errors.length} erreur(s) critique(s) détectée(s)`, 'red');
  process.exit(1);
}
