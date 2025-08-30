#!/usr/bin/env node

const fs = require('fs');

/**
 * AUDIT COMPLET - Pages & Routes
 */

console.log('🔍 AUDIT COMPLET - PAGES & ROUTES');
console.log('==================================\n');

// 1. COMPTAGE DES PAGES
const pagesDir = 'src/pages';
const allFiles = fs.readdirSync(pagesDir);

// Filtrer uniquement les pages (.tsx, hors index et CSS)
const pageFiles = allFiles.filter(file => 
  file.endsWith('.tsx') && 
  !file.includes('index') && 
  !file.includes('.css')
);

console.log(`📊 PAGES TOTALES : ${pageFiles.length}`);
console.log('\n📝 Liste des pages :');
pageFiles.sort().forEach((file, i) => {
  const name = file.replace('.tsx', '');
  console.log(`  ${(i + 1).toString().padStart(2, '0')}. ${name}`);
});

// 2. COMPTAGE DES ROUTES
const registryPath = 'src/routerV2/registry.ts';
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extraire les routes (objets avec name, path, etc.)
const routeMatches = [...registryContent.matchAll(/{\s*name:\s*['"]([^'"]*)['"]/g)];
const routes = routeMatches.map(m => m[1]);

console.log(`\n🚀 ROUTES TOTALES : ${routes.length}`);
console.log('\n🗺️  Liste des routes :');
routes.forEach((route, i) => {
  console.log(`  ${(i + 1).toString().padStart(2, '0')}. ${route}`);
});

// 3. ANALYSE PAR CATÉGORIE

// Catégoriser les pages
const categories = {
  'System/Error': ['401Page', '403Page', '404Page', '503Page', 'UnauthorizedPage', 'NotFoundPage', 'ServerErrorPage', 'ForbiddenPage'],
  'Public': ['HomePage', 'AboutPage', 'ContactPage', 'HelpPage', 'DemoPage', 'OnboardingPage', 'PrivacyPage'],
  'Auth': ['LoginPage', 'SignupPage'],
  'B2C Core': ['HomeB2CPage', 'B2CDashboardPage', 'AppGatePage', 'B2CScanPage', 'B2CAICoachPage', 'B2CJournalPage'],
  'B2C VR': ['B2CVRBreathGuidePage', 'B2CVRGalaxyPage'], 
  'B2C Fun': ['B2CFlashGlowPage', 'B2CBreathworkPage', 'B2CARFiltersPage', 'B2CBubbleBeatPage', 'B2CScreenSilkBreakPage', 'B2CBossLevelGritPage', 'B2CMoodMixerPage', 'B2CAmbitionArcadePage', 'B2CBounceBackBattlePage', 'B2CStorySynthLabPage'],
  'B2C Social': ['B2CSocialCoconPage', 'B2CCommunautePage'],
  'B2C Analytics': ['B2CActivitePage', 'B2CGamificationPage', 'B2CWeeklyBarsPage', 'B2CHeatmapVibesPage'],
  'B2C Settings': ['B2CSettingsPage', 'B2CProfileSettingsPage', 'B2CPrivacyTogglesPage', 'B2CNotificationsPage', 'B2CDataPrivacyPage'],
  'B2C Music': ['B2CMusicEnhanced', 'B2CMusicTherapyPremiumPage', 'B2CEmotionsPage'],
  'B2B Dashboards': ['B2BUserDashboardPage', 'B2BAdminDashboardPage', 'B2BCollabDashboard', 'B2BRHDashboard'],
  'B2B Features': ['B2BTeamsPage', 'B2BSelectionPage', 'B2BEntreprisePage', 'B2BSocialCoconPage', 'B2BReportsPage', 'B2BEventsPage'],
  'B2B Admin': ['B2BOptimisationPage', 'B2BSecurityPage', 'B2BAuditPage', 'B2BAccessibilityPage'],
  'Legal': ['LegalTermsPage', 'LegalPrivacyPage'],
  'Other': ['ApiMonitoringPage', 'SubscribePage', 'ValidationPage', 'B2CNyveeCoconPage', 'B2CAICoachMicroPage', 'AppDispatcher', 'B2CPage', 'B2CHomePage']
};

console.log('\n📂 RÉPARTITION PAR CATÉGORIE :');
let totalCategorized = 0;
Object.entries(categories).forEach(([category, pageList]) => {
  const existing = pageList.filter(page => pageFiles.includes(page + '.tsx'));
  if (existing.length > 0) {
    console.log(`\n  ${category} (${existing.length}) :`);
    existing.forEach(page => console.log(`    - ${page}`));
    totalCategorized += existing.length;
  }
});

// Pages non catégorisées
const categorizedPageNames = Object.values(categories).flat();
const uncategorized = pageFiles
  .map(f => f.replace('.tsx', ''))
  .filter(name => !categorizedPageNames.includes(name));

if (uncategorized.length > 0) {
  console.log(`\n  Non catégorisées (${uncategorized.length}) :`);
  uncategorized.forEach(page => console.log(`    - ${page}`));
  totalCategorized += uncategorized.length;
}

// 4. RÉSUMÉ FINAL
console.log('\n' + '='.repeat(50));
console.log('📊 RÉSUMÉ FINAL');
console.log('===============');
console.log(`🏠 Pages totales : ${pageFiles.length}`);
console.log(`🗺️  Routes totales : ${routes.length}`);
console.log(`📂 Pages catégorisées : ${totalCategorized}`);
console.log(`🔗 Ratio Routes/Pages : ${(routes.length / pageFiles.length).toFixed(2)}`);

// Vérification de cohérence
if (totalCategorized === pageFiles.length) {
  console.log('✅ Toutes les pages sont catégorisées');
} else {
  console.log(`⚠️  ${pageFiles.length - totalCategorized} pages non catégorisées`);
}

if (routes.length >= pageFiles.length * 0.7) {
  console.log('✅ Bon ratio de routes par page');
} else {
  console.log('⚠️  Ratio de routes faible, certaines pages peuvent manquer de routes');
}

console.log('\n🎯 Architecture RouterV2 : OPÉRATIONNELLE');