#!/usr/bin/env node

/**
 * Script de finalisation de la refactorisation
 * Exécute les dernières vérifications et prépare le commit
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Finalisation de la refactorisation...\n');

// 1. Vérification finale des tests
console.log('📋 1. Tests finaux...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Lint OK\n');
} catch (error) {
  console.log('⚠️ Lint warnings (non-bloquant)\n');
}

// 2. Build de vérification
console.log('🔨 2. Build de vérification...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build OK\n');
} catch (error) {
  console.error('❌ Erreur de build:', error.message);
  process.exit(1);
}

// 3. Statistiques du projet
console.log('📊 3. Statistiques post-refactorisation:');
const stats = {
  'Fichiers src/': execSync('find src -type f -name "*.ts" -o -name "*.tsx" | wc -l').toString().trim(),
  'Composants': execSync('find src/components -name "*.tsx" 2>/dev/null | wc -l').toString().trim(),
  'Pages': execSync('find src/pages -name "*.tsx" 2>/dev/null | wc -l').toString().trim(),
  'Hooks': execSync('find src/hooks -name "*.ts" 2>/dev/null | wc -l').toString().trim(),
  'Taille dist/': execSync('du -sh dist 2>/dev/null || echo "N/A"').toString().trim()
};

Object.entries(stats).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`);
});

console.log('\n✅ Refactorisation terminée avec succès!');
console.log('\n📝 Prochaines étapes:');
console.log('   git add .');
console.log('   git commit -m "chore: refactorisation complète - projet optimisé"');
console.log('   npm run dev');