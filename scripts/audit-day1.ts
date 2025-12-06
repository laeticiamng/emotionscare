#!/usr/bin/env tsx
/**
 * Script principal d'audit Jour 1 - Architecture
 * Lance tous les audits et génère un rapport consolidé
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Créer le dossier de résultats
const resultsDir = 'audit-results';
if (!existsSync(resultsDir)) {
  mkdirSync(resultsDir, { recursive: true });
}

console.log('🚀 AUDIT JOUR 1 - ARCHITECTURE TECHNIQUE\n');
console.log('═'.repeat(60) + '\n');

const results: any = {
  date: new Date().toISOString(),
  phase: '1.1 - Architecture',
  metrics: {},
  issues: [],
};

// 1. Validation architecture globale
console.log('📋 1/8 - Validation architecture globale...');
try {
  const output = execSync('npx tsx scripts/validate-architecture.ts', {
    encoding: 'utf-8',
    stdio: 'pipe',
  });
  writeFileSync(join(resultsDir, 'J1-architecture.txt'), output);
  
  const errors = (output.match(/ERROR/g) || []).length;
  const warnings = (output.match(/WARNING/g) || []).length;
  
  results.metrics.errors_critical = errors;
  results.metrics.warnings = warnings;
  console.log(`  ✓ Erreurs: ${errors}, Warnings: ${warnings}\n`);
} catch (error: any) {
  const output = error.stdout || error.message;
  writeFileSync(join(resultsDir, 'J1-architecture.txt'), output);
  
  const errors = (output.match(/ERROR/g) || []).length;
  const warnings = (output.match(/WARNING/g) || []).length;
  
  results.metrics.errors_critical = errors;
  results.metrics.warnings = warnings;
  console.log(`  ⚠️  Erreurs: ${errors}, Warnings: ${warnings}\n`);
}

// 2. Détection couleurs hardcodées
console.log('🎨 2/8 - Détection couleurs hardcodées...');
try {
  const output = execSync(
    'grep -r "bg-\\(blue\\|red\\|green\\|white\\|black\\|gray\\|yellow\\|purple\\|pink\\|indigo\\)-[0-9]" src/ --include="*.tsx" --include="*.ts" 2>&1 || true',
    { encoding: 'utf-8' }
  );
  writeFileSync(join(resultsDir, 'J1-hardcoded-colors.txt'), output);
  
  const count = output.split('\n').filter(line => line.trim()).length;
  results.metrics.hardcoded_colors = count;
  console.log(`  ${count > 0 ? '⚠️' : '✓'} Couleurs hardcodées trouvées: ${count}\n`);
} catch (error) {
  results.metrics.hardcoded_colors = 0;
  console.log('  ✓ Aucune couleur hardcodée trouvée\n');
}

// 3. Détection console.log
console.log('🔍 3/8 - Détection console.log...');
try {
  const output = execSync(
    'grep -rn "console\\.\\(log\\|warn\\|error\\|debug\\)" src/ --include="*.tsx" --include="*.ts" | grep -v "eslint-disable" 2>&1 || true',
    { encoding: 'utf-8' }
  );
  writeFileSync(join(resultsDir, 'J1-console-logs.txt'), output);
  
  const count = output.split('\n').filter(line => line.trim()).length;
  results.metrics.console_logs = count;
  console.log(`  ${count > 0 ? '⚠️' : '✓'} console.log trouvés: ${count}\n`);
} catch (error) {
  results.metrics.console_logs = 0;
  console.log('  ✓ Aucun console.log trouvé\n');
}

// 4. Détection types any
console.log('📝 4/8 - Détection types any...');
try {
  const output = execSync(
    'grep -rn ":\\s*any" src/ --include="*.tsx" --include="*.ts" | grep -v "@ts-nocheck" | grep -v "@ts-ignore" 2>&1 || true',
    { encoding: 'utf-8' }
  );
  writeFileSync(join(resultsDir, 'J1-any-types.txt'), output);
  
  const count = output.split('\n').filter(line => line.trim()).length;
  results.metrics.any_types = count;
  console.log(`  ${count > 0 ? '⚠️' : '✓'} Types any trouvés: ${count}\n`);
} catch (error) {
  results.metrics.any_types = 0;
  console.log('  ✓ Aucun type any trouvé\n');
}

// 5. Vérification data-testid
console.log('🧪 5/8 - Vérification data-testid...');
try {
  execSync('npx tsx scripts/check-testid-pages.ts', {
    stdio: 'inherit',
  });
  results.metrics.missing_testid = 0;
} catch (error) {
  results.metrics.missing_testid = -1; // Erreurs détectées
  console.log('  ⚠️  Certaines pages n\'ont pas data-testid\n');
}

// 6. Audit SEO
console.log('🔎 6/8 - Audit SEO pages...');
try {
  execSync('npx tsx scripts/check-seo-pages.ts', {
    stdio: 'inherit',
  });
  results.metrics.missing_seo = 0;
} catch (error) {
  results.metrics.missing_seo = -1; // Erreurs détectées
  console.log('  ⚠️  Certaines pages n\'ont pas de SEO\n');
}

// 7. Analyse taille fichiers
console.log('📏 7/8 - Analyse taille fichiers...');
try {
  const output = execSync(
    'find src/ -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn | head -20',
    { encoding: 'utf-8' }
  );
  writeFileSync(join(resultsDir, 'J1-large-files.txt'), output);
  
  const largeFiles = output.split('\n').filter(line => {
    const match = line.match(/^\s*(\d+)/);
    return match && parseInt(match[1]) > 300;
  }).length;
  
  results.metrics.large_files = largeFiles;
  console.log(`  ${largeFiles > 0 ? '⚠️' : '✓'} Fichiers > 300 lignes: ${largeFiles}\n`);
} catch (error) {
  results.metrics.large_files = 0;
  console.log('  ✓ Aucun fichier trop long\n');
}

// 8. Analyse bundle size (skip si pas de build)
console.log('📦 8/8 - Analyse bundle size...');
console.log('  ℹ️  Skip (nécessite npm run build)\n');
results.metrics.bundle_size_kb = 'N/A';

// Génération rapport JSON
console.log('\n' + '═'.repeat(60));
console.log('\n📊 RAPPORT JOUR 1 - SYNTHÈSE\n');
console.log(`  Erreurs critiques : ${results.metrics.errors_critical}`);
console.log(`  Warnings : ${results.metrics.warnings}`);
console.log(`  Couleurs hardcodées : ${results.metrics.hardcoded_colors}`);
console.log(`  console.log : ${results.metrics.console_logs}`);
console.log(`  Types any : ${results.metrics.any_types}`);
console.log(`  Fichiers > 300L : ${results.metrics.large_files}`);

// Déterminer le statut
let status = 'OK';
if (results.metrics.errors_critical > 0) {
  status = 'CRITICAL';
} else if (results.metrics.warnings > 20 || 
           results.metrics.hardcoded_colors > 30 ||
           results.metrics.console_logs > 5) {
  status = 'NEEDS_ATTENTION';
}

results.status = status;

// Sauvegarder JSON
writeFileSync(
  join(resultsDir, 'J1-summary.json'),
  JSON.stringify(results, null, 2)
);

console.log(`\n  Statut global : ${status}`);
console.log(`\n✅ Audit Jour 1 terminé !`);
console.log(`📁 Résultats disponibles dans: ${resultsDir}/\n`);

if (status === 'CRITICAL') {
  console.log('❌ Actions correctives critiques requises\n');
  process.exit(1);
} else if (status === 'NEEDS_ATTENTION') {
  console.log('⚠️  Améliorations recommandées\n');
  process.exit(0);
} else {
  console.log('🎉 Architecture conforme !\n');
  process.exit(0);
}
