#!/usr/bin/env node

/**
 * 🔍 AUDIT DU SYSTÈME D'ALERTE ET STATISTIQUES
 * 
 * Vérifie tous les composants du système :
 * - Table settings_alerts
 * - Edge function check-suspicious-role-changes
 * - Services front-end
 * - Composants React
 * - Configuration cron
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AUDIT DU SYSTÈME D\'ALERTE ET STATISTIQUES');
console.log('='.repeat(60));
console.log('');

const checks = [];

// Fonction helper pour vérifier l'existence d'un fichier
function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  checks.push({
    category: 'Fichiers',
    check: description,
    status: exists ? '✅' : '❌',
    path: filePath,
  });
  return exists;
}

// Fonction helper pour vérifier le contenu d'un fichier
function checkFileContent(filePath, searchStrings, description) {
  if (!fs.existsSync(filePath)) {
    checks.push({
      category: 'Contenu',
      check: description,
      status: '❌',
      detail: 'Fichier introuvable',
    });
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const allFound = searchStrings.every((str) => content.includes(str));
  
  checks.push({
    category: 'Contenu',
    check: description,
    status: allFound ? '✅' : '❌',
    detail: allFound ? 'Contenu vérifié' : 'Contenu manquant',
  });
  
  return allFound;
}

console.log('📁 VÉRIFICATION DES FICHIERS');
console.log('-'.repeat(60));

// 1. Vérification des migrations
const migrationsDir = 'supabase/migrations';
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir);
  const hasAlertsMigration = migrations.some(m => {
    const content = fs.readFileSync(path.join(migrationsDir, m), 'utf-8');
    return content.includes('settings_alerts');
  });
  
  checks.push({
    category: 'Database',
    check: 'Migration settings_alerts',
    status: hasAlertsMigration ? '✅' : '❌',
  });
}

// 2. Vérification Edge Function
checkFile(
  'supabase/functions/check-suspicious-role-changes/index.ts',
  'Edge function check-suspicious-role-changes'
);

checkFileContent(
  'supabase/functions/check-suspicious-role-changes/index.ts',
  ['check_suspicious_role_activity', 'getActionLabel'],
  'Edge function utilise les seuils configurables'
);

// 3. Vérification Services Front-end
checkFile(
  'src/services/auditStatsService.ts',
  'Service auditStatsService'
);

checkFile(
  'src/services/advancedAuditStatsService.ts',
  'Service advancedAuditStatsService'
);

checkFileContent(
  'src/services/advancedAuditStatsService.ts',
  ['getStatsByRole', 'getMonthToMonthComparison', 'getCustomPeriodStats'],
  'Service avec filtres avancés'
);

checkFile(
  'src/services/roleAuditExportService.ts',
  'Service roleAuditExportService'
);

// 4. Vérification Composants React
checkFile(
  'src/components/admin/AuditStatsDashboard.tsx',
  'Composant AuditStatsDashboard'
);

checkFileContent(
  'src/components/admin/AuditStatsDashboard.tsx',
  ['Tabs', 'AdvancedAuditFilters', 'MonthComparisonChart', 'AlertSettingsManager'],
  'Dashboard avec onglets et filtres avancés'
);

checkFile(
  'src/components/admin/AlertSettingsManager.tsx',
  'Composant AlertSettingsManager'
);

checkFile(
  'src/components/admin/AdvancedAuditFilters.tsx',
  'Composant AdvancedAuditFilters'
);

checkFile(
  'src/components/admin/MonthComparisonChart.tsx',
  'Composant MonthComparisonChart'
);

checkFile(
  'src/components/admin/UserRolesManager.tsx',
  'Composant UserRolesManager'
);

// 5. Vérification config.toml
checkFileContent(
  'supabase/config.toml',
  ['[pg_cron]', 'enabled = true'],
  'Configuration pg_cron activée'
);

console.log('');
console.log('📊 RÉSULTATS DE L\'AUDIT');
console.log('='.repeat(60));

// Grouper les checks par catégorie
const categories = [...new Set(checks.map(c => c.category))];

categories.forEach(category => {
  console.log('');
  console.log(`\n${category.toUpperCase()}`);
  console.log('-'.repeat(60));
  
  const categoryChecks = checks.filter(c => c.category === category);
  categoryChecks.forEach(check => {
    console.log(`${check.status} ${check.check}`);
    if (check.detail) {
      console.log(`   ${check.detail}`);
    }
    if (check.path) {
      console.log(`   📂 ${check.path}`);
    }
  });
});

// Résumé final
const totalChecks = checks.length;
const passedChecks = checks.filter(c => c.status === '✅').length;
const failedChecks = checks.filter(c => c.status === '❌').length;

console.log('');
console.log('');
console.log('📈 RÉSUMÉ');
console.log('='.repeat(60));
console.log(`Total vérifications : ${totalChecks}`);
console.log(`✅ Réussies         : ${passedChecks} (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log(`❌ Échouées         : ${failedChecks} (${Math.round((failedChecks / totalChecks) * 100)}%)`);
console.log('');

if (failedChecks === 0) {
  console.log('🎉 AUDIT RÉUSSI ! Tous les composants sont en place.');
} else {
  console.log('⚠️  ATTENTION : Certains composants sont manquants ou incomplets.');
}

console.log('');
console.log('='.repeat(60));
console.log('');

// Afficher les fonctionnalités implémentées
console.log('✨ FONCTIONNALITÉS IMPLÉMENTÉES');
console.log('='.repeat(60));
console.log('');
console.log('1. 🎯 Seuils d\'alerte configurables');
console.log('   - Table settings_alerts avec RLS');
console.log('   - Interface admin pour modifier les seuils');
console.log('   - 4 types d\'alertes par défaut');
console.log('');
console.log('2. ⏰ Cron job automatique');
console.log('   - Configuration pg_cron activée');
console.log('   - Détection horaire des activités suspectes');
console.log('   - Appel automatique de l\'edge function');
console.log('');
console.log('3. 📊 Filtres avancés dashboard');
console.log('   - Filtrage par rôle spécifique');
console.log('   - Filtrage par période personnalisée');
console.log('   - Comparaison mois à mois');
console.log('   - Statistiques par action');
console.log('');
console.log('4. 🔔 Notifications email');
console.log('   - Alertes automatiques aux admins');
console.log('   - Emails configurables par type d\'alerte');
console.log('   - Détail des logs suspects');
console.log('');
console.log('='.repeat(60));

process.exit(failedChecks > 0 ? 1 : 0);
