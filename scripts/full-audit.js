#!/usr/bin/env node

/**
 * Script d'audit complet du projet EmotionsCare
 * Vérifie la cohérence entre Supabase et le front-end
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔍 === AUDIT COMPLET DU PROJET EMOTIONSCARE ===\n');

const results = {
  supabase: {
    edgeFunctions: [],
    missingFunctions: [],
  },
  frontend: {
    components: [],
    services: [],
    pages: [],
    missingImplementations: [],
  },
  consistency: {
    errors: [],
    warnings: [],
    success: [],
  },
  optimization: {
    suggestions: [],
  },
};

// === 1. AUDIT SUPABASE ===
console.log('📦 1. Audit Supabase...\n');

// Vérifier les edge functions critiques
const criticalFunctions = [
  'send-weekly-report',
  'check-suspicious-role-changes',
  'trigger-webhooks',
  'gdpr-data-export',
  'gdpr-data-deletion',
  'ai-coach-response',
  'emotion-analysis',
];

criticalFunctions.forEach(funcName => {
  const funcPath = path.join('supabase', 'functions', funcName, 'index.ts');
  if (fs.existsSync(funcPath)) {
    const content = fs.readFileSync(funcPath, 'utf8');
    const hasTs = content.includes('// @ts-ignore') || content.includes('// @ts-nocheck');
    const hasCors = content.includes('corsHeaders');
    const hasErrorHandling = content.includes('try') && content.includes('catch');
    
    results.supabase.edgeFunctions.push({
      name: funcName,
      exists: true,
      hasTypeSuppress: hasTs,
      hasCors,
      hasErrorHandling,
      size: content.length,
    });
    
    // Warnings
    if (!hasTs) {
      results.consistency.warnings.push(`⚠️  ${funcName}: Manque @ts-ignore/nocheck`);
    }
    if (!hasCors) {
      results.consistency.warnings.push(`⚠️  ${funcName}: Manque CORS headers`);
    }
    if (!hasErrorHandling) {
      results.consistency.errors.push(`❌ ${funcName}: Manque gestion d'erreurs`);
    }
    if (content.length > 5000) {
      results.optimization.suggestions.push(`💡 ${funcName}: Fichier volumineux (${content.length} chars) - envisager refactoring`);
    }
  } else {
    results.supabase.missingFunctions.push(funcName);
    results.consistency.errors.push(`❌ Edge function manquante: ${funcName}`);
  }
});

// === 2. AUDIT FRONT-END ===
console.log('\n🎨 2. Audit Front-end...\n');

// Vérifier les composants admin critiques
const criticalComponents = [
  'AuditStatsDashboard',
  'SecurityAlertsPanel',
  'AlertSettingsManager',
  'ReportManualTrigger',
  'SecurityTrendsDashboard',
  'ExcelExporter',
  'AuditReportExporter',
  'MonthComparisonChart',
  'AdvancedAuditFilters',
];

criticalComponents.forEach(compName => {
  const compPath = path.join('src', 'components', 'admin', `${compName}.tsx`);
  if (fs.existsSync(compPath)) {
    const content = fs.readFileSync(compPath, 'utf8');
    const hasTests = fs.existsSync(path.join('src', 'components', 'admin', '__tests__', `${compName}.test.tsx`));
    const usesSupabase = content.includes('supabase');
    const usesTanstack = content.includes('@tanstack/react-query');
    const hasErrorHandling = content.includes('try') && content.includes('catch');
    
    results.frontend.components.push({
      name: compName,
      exists: true,
      hasTests,
      usesSupabase,
      usesTanstack,
      hasErrorHandling,
    });
    
    if (!hasTests) {
      results.consistency.warnings.push(`⚠️  ${compName}: Manque tests unitaires`);
    }
    if (!hasErrorHandling) {
      results.consistency.warnings.push(`⚠️  ${compName}: Manque gestion d'erreurs`);
    }
    results.consistency.success.push(`✅ ${compName}: OK`);
  } else {
    results.frontend.missingImplementations.push(compName);
    results.consistency.errors.push(`❌ Composant manquant: ${compName}`);
  }
});

// Vérifier les services critiques
const criticalServices = [
  'auditStatsService',
  'advancedAuditStatsService',
  'securityAlertsService',
  'securityTrendsService',
  'excelExportService',
  'auditReportExportService',
  'reportTemplateService',
];

criticalServices.forEach(serviceName => {
  const servicePath = path.join('src', 'services', `${serviceName}.ts`);
  if (fs.existsSync(servicePath)) {
    const content = fs.readFileSync(servicePath, 'utf8');
    const hasTests = fs.existsSync(path.join('src', 'services', '__tests__', `${serviceName}.test.ts`));
    const usesSupabase = content.includes('supabase');
    const hasErrorHandling = content.includes('try') && content.includes('catch');
    const hasTyping = content.includes('export interface') || content.includes('export type');
    
    results.frontend.services.push({
      name: serviceName,
      exists: true,
      hasTests,
      usesSupabase,
      hasErrorHandling,
      hasTyping,
    });
    
    if (!hasTests) {
      results.consistency.warnings.push(`⚠️  ${serviceName}: Manque tests unitaires`);
    }
    if (!hasTyping) {
      results.optimization.suggestions.push(`💡 ${serviceName}: Ajouter interfaces TypeScript`);
    }
    results.consistency.success.push(`✅ ${serviceName}: OK`);
  } else {
    results.frontend.missingImplementations.push(serviceName);
    results.consistency.errors.push(`❌ Service manquant: ${serviceName}`);
  }
});

// === 3. VÉRIFICATION COHÉRENCE DATABASE ===
console.log('\n🗄️  3. Vérification base de données...\n');

const typesPath = path.join('src', 'integrations', 'supabase', 'types.ts');
if (fs.existsSync(typesPath)) {
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  
  const criticalTables = [
    'audit_report_logs',
    'security_alerts',
    'settings_alerts',
    'role_audit_logs',
    'webhook_logs',
    'gdpr_webhooks',
  ];
  
  criticalTables.forEach(tableName => {
    if (typesContent.includes(tableName)) {
      results.consistency.success.push(`✅ Table ${tableName}: Présente dans types.ts`);
    } else {
      results.consistency.errors.push(`❌ Table ${tableName}: Manquante dans types.ts`);
    }
  });
} else {
  results.consistency.errors.push(`❌ Fichier types.ts manquant`);
}

// === 4. OPTIMISATIONS DÉTECTÉES ===
console.log('\n⚡ 4. Optimisations détectées...\n');

// Vérifier les imports dupliqués
const allTsxFiles = glob.sync('src/**/*.tsx');
const importCounts = {};

allTsxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const imports = content.match(/import.*from\s+['"](.+)['"]/g);
  if (imports) {
    imports.forEach(imp => {
      const match = imp.match(/from\s+['"](.+)['"]/);
      if (match) {
        const importPath = match[1];
        importCounts[importPath] = (importCounts[importPath] || 0) + 1;
      }
    });
  }
});

// Détecter les imports très fréquents qui pourraient être optimisés
Object.entries(importCounts)
  .filter(([_, count]) => count > 20)
  .forEach(([importPath, count]) => {
    if (!importPath.startsWith('@/components/ui')) {
      results.optimization.suggestions.push(
        `💡 Import très fréquent: "${importPath}" (${count} fois) - envisager un barrel export`
      );
    }
  });

// Vérifier les gros fichiers
allTsxFiles.forEach(file => {
  const stat = fs.statSync(file);
  if (stat.size > 15000) {
    const relPath = file.replace(process.cwd() + '/', '');
    results.optimization.suggestions.push(
      `💡 Fichier volumineux: ${relPath} (${Math.round(stat.size / 1024)}KB) - envisager découpage`
    );
  }
});

// === 5. RAPPORT FINAL ===
console.log('\n📊 === RAPPORT D\'AUDIT ===\n');

console.log('🔧 SUPABASE:');
console.log(`  ✅ Edge functions présentes: ${results.supabase.edgeFunctions.length}`);
console.log(`  ❌ Edge functions manquantes: ${results.supabase.missingFunctions.length}`);
if (results.supabase.missingFunctions.length > 0) {
  results.supabase.missingFunctions.forEach(f => console.log(`     - ${f}`));
}

console.log('\n🎨 FRONT-END:');
console.log(`  ✅ Composants présents: ${results.frontend.components.length}`);
console.log(`  ✅ Services présents: ${results.frontend.services.length}`);
console.log(`  ❌ Implémentations manquantes: ${results.frontend.missingImplementations.length}`);
if (results.frontend.missingImplementations.length > 0) {
  results.frontend.missingImplementations.forEach(i => console.log(`     - ${i}`));
}

console.log('\n🔍 COHÉRENCE:');
console.log(`  ✅ Succès: ${results.consistency.success.length}`);
console.log(`  ⚠️  Warnings: ${results.consistency.warnings.length}`);
console.log(`  ❌ Erreurs: ${results.consistency.errors.length}`);

if (results.consistency.errors.length > 0) {
  console.log('\n❌ ERREURS CRITIQUES:');
  results.consistency.errors.forEach(e => console.log(`  ${e}`));
}

if (results.consistency.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  results.consistency.warnings.slice(0, 10).forEach(w => console.log(`  ${w}`));
  if (results.consistency.warnings.length > 10) {
    console.log(`  ... et ${results.consistency.warnings.length - 10} autres warnings`);
  }
}

console.log('\n⚡ OPTIMISATIONS SUGGÉRÉES:');
if (results.optimization.suggestions.length > 0) {
  results.optimization.suggestions.slice(0, 10).forEach(s => console.log(`  ${s}`));
  if (results.optimization.suggestions.length > 10) {
    console.log(`  ... et ${results.optimization.suggestions.length - 10} autres suggestions`);
  }
} else {
  console.log('  ✨ Aucune optimisation majeure détectée');
}

// Score global
const totalChecks = 
  results.supabase.edgeFunctions.length + 
  results.frontend.components.length + 
  results.frontend.services.length;
const totalErrors = results.consistency.errors.length;
const score = totalChecks > 0 ? Math.round(((totalChecks - totalErrors) / totalChecks) * 100) : 0;

console.log('\n📈 SCORE GLOBAL: ' + score + '%');
if (score >= 90) {
  console.log('   🎉 EXCELLENT - Projet très cohérent!');
} else if (score >= 70) {
  console.log('   👍 BON - Quelques améliorations possibles');
} else if (score >= 50) {
  console.log('   ⚠️  MOYEN - Plusieurs corrections nécessaires');
} else {
  console.log('   ❌ FAIBLE - Corrections critiques requises');
}

console.log('\n✅ Audit terminé!\n');

// Sauvegarder le rapport
const reportPath = path.join('scripts', 'audit-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`📄 Rapport détaillé sauvegardé: ${reportPath}\n`);

process.exit(totalErrors > 0 ? 1 : 0);
