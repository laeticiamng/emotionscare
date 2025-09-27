#!/usr/bin/env node

/**
 * Script de vérification de la santé du projet après refactorisation
 * Valide tous les critères d'acceptation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Vérification de la santé du projet post-refactorisation\n');

let score = 0;
let maxScore = 0;
const issues = [];
const passed = [];

function checkCriteria(name, condition, details = '') {
  maxScore++;
  if (condition) {
    score++;
    passed.push(`✅ ${name}: ${details || 'OK'}`);
  } else {
    issues.push(`❌ ${name}: ${details || 'FAILED'}`);
  }
}

// 1. Modèle d'environnement unique
console.log('📁 1. Vérification modèle d'environnement...');
const envExampleExists = fs.existsSync('.env.example');
const noSrcEnv = !fs.existsSync('src/env.mjs') && !fs.existsSync('src/lib/env-validation.ts');  
const hasEnvFile = fs.existsSync('src/lib/env.ts');

checkCriteria(
  'Modèle environnement unique', 
  envExampleExists && noSrcEnv && hasEnvFile,
  envExampleExists ? 'Fichier .env.example présent' : 'Manque .env.example'
);

// 2. Fichiers ignorés
console.log('📁 2. Vérification fichiers ignorés...');
const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
const hasEnvIgnored = gitignoreContent.includes('.env') && gitignoreContent.includes('.env.*');
const hasNodeModulesIgnored = gitignoreContent.includes('node_modules');

checkCriteria(
  'Fichiers sensibles ignorés',
  hasEnvIgnored && hasNodeModulesIgnored,
  'Variables d\'environnement et dépendances ignorées'
);

// 3. Scripts uniformes
console.log('🛠️ 3. Vérification scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['dev', 'build', 'preview', 'lint', 'test'];
const hasAllScripts = requiredScripts.every(script => packageJson.scripts[script]);

checkCriteria(
  'Scripts uniformes',
  hasAllScripts,
  `Scripts présents: ${Object.keys(packageJson.scripts).join(', ')}`
);

// 4. Nettoyage fichiers obsolètes
console.log('🧹 4. Vérification nettoyage...');
const obsoleteFiles = [
  'AUDIT_FRONTEND_REPORT.md',
  'PHASE1_VICTORY.md', 
  'src/env.mjs',
  'src/Shell.tsx',
  'audit-complet.js'
];
const noObsoleteFiles = obsoleteFiles.every(file => !fs.existsSync(file));

checkCriteria(
  'Fichiers obsolètes supprimés',
  noObsoleteFiles,
  noObsoleteFiles ? 'Tous les fichiers temporaires supprimés' : 'Certains fichiers obsolètes restent'
);

// 5. Organisation source
console.log('📂 5. Vérification organisation source...');
const requiredDirs = ['src/components', 'src/lib', 'src/integrations', 'src/pages'];
const hasRequiredDirs = requiredDirs.every(dir => fs.existsSync(dir));
const hasCleanSrc = !fs.existsSync('src/README.md') && !fs.existsSync('src/AUDIT.md');

checkCriteria(
  'Organisation source claire',
  hasRequiredDirs && hasCleanSrc,
  'Dossiers principaux présents et src/ nettoyé'
);

// 6. Documentation
console.log('📚 6. Vérification documentation...');
const hasReadme = fs.existsSync('README.md');
const hasContributing = fs.existsSync('CONTRIBUTING.md');
const hasQuickStart = fs.existsSync('GUIDE_DEMARRAGE_RAPIDE.md');

checkCriteria(
  'Documentation complète',
  hasReadme && hasContributing && hasQuickStart,
  'README, CONTRIBUTING et guide rapide présents'
);

// 7. Tests de build
console.log('🔨 7. Tests de fonctionnement...');
try {
  // Test lint
  execSync('npm run lint', { stdio: 'pipe', timeout: 30000 });
  const lintPassed = true;
  
  checkCriteria('Lint passe', lintPassed, 'Code conforme aux standards');
} catch (error) {
  checkCriteria('Lint passe', false, 'Erreurs de lint détectées');
}

try {
  // Test build
  execSync('npm run build', { stdio: 'pipe', timeout: 60000 });
  const buildPassed = fs.existsSync('dist');
  
  checkCriteria('Build réussit', buildPassed, 'Application buildée correctement');
} catch (error) {
  checkCriteria('Build réussit', false, 'Erreur de build détectée');
}

// 8. Structure finale
console.log('🗂️ 8. Vérification structure finale...');
const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.md') && f !== 'README.md' && f !== 'CONTRIBUTING.md' && f !== 'CHANGELOG.md' && f !== 'GUIDE_DEMARRAGE_RAPIDE.md').length;
const hasCleanRoot = rootFiles < 5; // Moins de 5 fichiers MD non-essentiels

checkCriteria(
  'Racine propre',
  hasCleanRoot,
  `${rootFiles} fichiers MD non-essentiels dans la racine`
);

// Résultats
console.log('\n' + '='.repeat(60));
console.log('📊 RAPPORT FINAL DE SANTÉ DU PROJET');
console.log('='.repeat(60));

console.log('\n✅ CRITÈRES RÉUSSIS:\n');
passed.forEach(item => console.log(`   ${item}`));

if (issues.length > 0) {
  console.log('\n❌ CRITÈRES ÉCHOUÉS:\n');
  issues.forEach(item => console.log(`   ${item}`));
}

const percentage = Math.round((score / maxScore) * 100);
console.log(`\n🎯 SCORE FINAL: ${score}/${maxScore} (${percentage}%)`);

if (percentage >= 90) {
  console.log('\n🎉 EXCELLENT ! Projet production-ready');
} else if (percentage >= 80) {
  console.log('\n👍 BON ! Quelques améliorations mineures nécessaires');
} else if (percentage >= 70) {
  console.log('\n⚠️ ACCEPTABLE ! Plusieurs corrections nécessaires');
} else {
  console.log('\n🚨 CRITIQUE ! Refactorisation incomplète');
}

console.log('\n📋 Prochaines étapes recommandées:');
if (percentage >= 90) {
  console.log('   • npm run dev - Lancer le développement');
  console.log('   • Déployer en production');
  console.log('   • Monitorer les performances');
} else {
  console.log('   • Corriger les critères échoués');
  console.log('   • Relancer la vérification');
  console.log('   • Compléter la documentation manquante');
}

console.log('\n' + '='.repeat(60));

process.exit(percentage >= 80 ? 0 : 1);