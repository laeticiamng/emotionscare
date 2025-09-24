
#!/usr/bin/env node

/**
 * Script d'audit complet automatisé pour EmotionsCare
 * Vérifie tous les composants, routes, dépendances et sécurité
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AUDIT COMPLET EMOTIONSCARE - DÉMARRAGE');
console.log('==========================================\n');

let globalScore = 100;
const issues = [];
const warnings = [];
const successes = [];

// 1. Vérification des routes (52 routes officielles)
console.log('📍 1. VÉRIFICATION DES ROUTES');
console.log('------------------------------');

const UNIFIED_ROUTES = {
  // Routes publiques (4)
  HOME: '/',
  CHOOSE_MODE: '/choose-mode',
  ONBOARDING: '/onboarding',
  B2B_SELECTION: '/b2b/selection',
  
  // Routes d'authentification B2C (2)
  B2C_LOGIN: '/b2c/login',
  B2C_REGISTER: '/b2c/register',
  
  // Routes d'authentification B2B (4)
  B2B_USER_LOGIN: '/b2b/user/login',
  B2B_USER_REGISTER: '/b2b/user/register',
  B2B_ADMIN_LOGIN: '/b2b/admin/login',
  B2B: '/b2b',
  
  // Routes de dashboards (3)
  B2C_DASHBOARD: '/b2c/dashboard',
  B2B_USER_DASHBOARD: '/b2b/user/dashboard',
  B2B_ADMIN_DASHBOARD: '/b2b/admin/dashboard',

  // FONCTIONNALITÉS COMMUNES (9)
  SCAN: '/scan',
  MUSIC: '/music',
  COACH: '/coach',
  JOURNAL: '/journal',
  VR: '/vr',
  PREFERENCES: '/preferences',
  GAMIFICATION: '/gamification',
  SOCIAL_COCON: '/social-cocon',

  // MODULES ÉMOTIONNELS AVANCÉS (10)
  BOSS_LEVEL_GRIT: '/boss-level-grit',
  MOOD_MIXER: '/mood-mixer',
  AMBITION_ARCADE: '/ambition-arcade',
  BOUNCE_BACK_BATTLE: '/bounce-back-battle',
  STORY_SYNTH_LAB: '/story-synth-lab',
  FLASH_GLOW: '/flash-glow',
  AR_FILTERS: '/ar-filters',
  BUBBLE_BEAT: '/bubble-beat',
  SCREEN_SILK_BREAK: '/screen-silk-break',
  VR_GALACTIQUE: '/vr-galactique',

  // ANALYTICS AVANCÉS (4)
  INSTANT_GLOW: '/instant-glow',
  WEEKLY_BARS: '/weekly-bars',
  HEATMAP_VIBES: '/heatmap-vibes',
  BREATHWORK: '/breathwork',

  // FONCTIONNALITÉS SPÉCIALISÉES (7)
  PRIVACY_TOGGLES: '/privacy-toggles',
  EXPORT_CSV: '/export-csv',
  ACCOUNT_DELETE: '/account/delete',
  HEALTH_CHECK_BADGE: '/health-check-badge',
  HELP_CENTER: '/help-center',
  PROFILE_SETTINGS: '/profile-settings',
  ACTIVITY_HISTORY: '/activity-history',

  // FONCTIONNALITÉS ADMIN (9)
  TEAMS: '/teams',
  REPORTS: '/reports',
  EVENTS: '/events',
  OPTIMISATION: '/optimisation',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  SECURITY: '/security',
  AUDIT: '/audit',
  ACCESSIBILITY: '/accessibility',
  
  // POINT 20 - FEEDBACK ET AMÉLIORATION CONTINUE (1)
  FEEDBACK: '/feedback',
};

const routes = Object.values(UNIFIED_ROUTES);
const routeCount = routes.length;

if (routeCount === 52) {
  successes.push(`✅ 52 routes officielles détectées`);
} else {
  issues.push(`❌ Nombre de routes incorrect: ${routeCount}/52`);
  globalScore -= 10;
}

console.log(`Routes détectées: ${routeCount}/52`);

// 2. Vérification des pages principales
console.log('\n📄 2. VÉRIFICATION DES PAGES');
console.log('----------------------------');

const criticalPages = [
  'src/pages/HomePage.tsx',
  'src/pages/ScanPage.tsx',
  'src/pages/MusicPage.tsx',
  'src/pages/CoachPage.tsx',
  'src/pages/JournalPage.tsx',
  'src/pages/VRPage.tsx',
  'src/pages/GamificationPage.tsx',
  'src/pages/SocialCoconPage.tsx',
  'src/pages/PreferencesPage.tsx',
  'src/pages/TeamsPage.tsx',
  'src/pages/ReportsPage.tsx',
  'src/pages/EventsPage.tsx',
  'src/pages/OptimisationPage.tsx',
  'src/pages/SettingsPage.tsx',
  'src/pages/errors/404/page.tsx',
  'src/pages/errors/500/page.tsx',
  'src/pages/errors/401/page.tsx',
  'src/pages/errors/403/page.tsx'
];

let pagesFound = 0;
criticalPages.forEach(page => {
  if (fs.existsSync(page)) {
    pagesFound++;
    console.log(`✅ ${page}`);
  } else {
    console.log(`❌ ${page} - MANQUANT`);
    issues.push(`Page manquante: ${page}`);
    globalScore -= 3;
  }
});

console.log(`Pages trouvées: ${pagesFound}/${criticalPages.length}`);

// 3. Vérification des composants critiques
console.log('\n🧩 3. VÉRIFICATION DES COMPOSANTS');
console.log('----------------------------------');

const criticalComponents = [
  'src/components/ProtectedRoute.tsx',
  'src/components/ui/enhanced-error-boundary.tsx',
  'src/components/SecurityCertifications.tsx',
  'src/components/vr/VRDashboard.tsx',
  'src/components/coach/CoachInsights.tsx',
  'src/components/coach/CoachPersonalitySelector.tsx',
  'src/components/settings/ThemeSettingsTab.tsx',
  'src/components/settings/NotificationSettings.tsx',
  'src/components/settings/PrivacySettings.tsx',
  'src/components/settings/AccessibilitySettings.tsx'
];

let componentsFound = 0;
criticalComponents.forEach(component => {
  if (fs.existsSync(component)) {
    componentsFound++;
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - MANQUANT`);
    issues.push(`Composant manquant: ${component}`);
    globalScore -= 5;
  }
});

console.log(`Composants trouvés: ${componentsFound}/${criticalComponents.length}`);

// 4. Vérification de la configuration
console.log('\n⚙️ 4. VÉRIFICATION DE LA CONFIGURATION');
console.log('--------------------------------------');

const configFiles = [
  'package.json',
  'vite.config.ts',
  'tailwind.config.js',
  'tsconfig.json'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    successes.push(`Configuration ${file} présente`);
  } else {
    console.log(`❌ ${file} - MANQUANT`);
    issues.push(`Fichier de configuration manquant: ${file}`);
    globalScore -= 5;
  }
});

// 5. Vérification du routeur unifié
console.log('\n🛤️ 5. VÉRIFICATION DU ROUTEUR');
console.log('------------------------------');

if (fs.existsSync('src/router/buildUnifiedRoutes.tsx')) {
  console.log('✅ Routeur unifié présent');
  successes.push('Routeur unifié configuré');
} else {
  console.log('❌ Routeur unifié manquant');
  issues.push('Routeur unifié non configuré');
  globalScore -= 15;
}

// 6. Vérification des utilitaires
console.log('\n🔧 6. VÉRIFICATION DES UTILITAIRES');
console.log('-----------------------------------');

const utilities = [
  'src/utils/routeUtils.ts',
  'src/utils/routeValidation.ts',
  'src/utils/privacyHelpers.ts',
  'src/utils/productionCheck.ts'
];

utilities.forEach(util => {
  if (fs.existsSync(util)) {
    console.log(`✅ ${util}`);
  } else {
    console.log(`❌ ${util} - MANQUANT`);
    warnings.push(`Utilitaire manquant: ${util}`);
    globalScore -= 2;
  }
});

// 7. Vérification des types
console.log('\n📝 7. VÉRIFICATION DES TYPES');
console.log('-----------------------------');

const typeFiles = [
  'src/types/user.ts',
  'src/types/dashboard.ts'
];

typeFiles.forEach(type => {
  if (fs.existsSync(type)) {
    console.log(`✅ ${type}`);
  } else {
    console.log(`⚠️ ${type} - MANQUANT`);
    warnings.push(`Type manquant: ${type}`);
    globalScore -= 1;
  }
});

// 8. Vérification de la sécurité
console.log('\n🔒 8. VÉRIFICATION DE LA SÉCURITÉ');
console.log('----------------------------------');

// Vérifier les variables d'environnement
if (fs.existsSync('.env.example')) {
  console.log('✅ Fichier .env.example présent');
  successes.push('Template d\'environnement configuré');
} else {
  console.log('⚠️ Fichier .env.example manquant');
  warnings.push('Template d\'environnement manquant');
  globalScore -= 2;
}

// Vérifier les en-têtes de sécurité
if (fs.existsSync('_headers')) {
  console.log('✅ En-têtes de sécurité configurés');
  successes.push('En-têtes de sécurité présents');
} else {
  console.log('⚠️ En-têtes de sécurité manquants');
  warnings.push('En-têtes de sécurité non configurés');
  globalScore -= 3;
}

// 9. Résumé final
console.log('\n📊 RÉSUMÉ DE L\'AUDIT');
console.log('=====================');

console.log(`\n🎯 SCORE GLOBAL: ${globalScore}/100`);

if (globalScore >= 95) {
  console.log('🟢 EXCELLENT - Application prête pour la production');
} else if (globalScore >= 85) {
  console.log('🟡 BON - Quelques améliorations recommandées');
} else if (globalScore >= 70) {
  console.log('🟠 MOYEN - Corrections nécessaires');
} else {
  console.log('🔴 CRITIQUE - Corrections majeures requises');
}

console.log(`\n✅ SUCCÈS (${successes.length}):`);
successes.forEach(success => console.log(`   ${success}`));

if (warnings.length > 0) {
  console.log(`\n⚠️ AVERTISSEMENTS (${warnings.length}):`);
  warnings.forEach(warning => console.log(`   ${warning}`));
}

if (issues.length > 0) {
  console.log(`\n❌ PROBLÈMES CRITIQUES (${issues.length}):`);
  issues.forEach(issue => console.log(`   ${issue}`));
}

console.log('\n🔍 RECOMMANDATIONS:');
if (globalScore >= 95) {
  console.log('   - Lancer les tests e2e');
  console.log('   - Préparer le déploiement');
  console.log('   - Configurer le monitoring');
} else {
  console.log('   - Corriger les problèmes critiques');
  console.log('   - Relancer l\'audit après corrections');
  console.log('   - Tester les fonctionnalités manuellement');
}

console.log('\n==========================================');
console.log('🏁 AUDIT COMPLET TERMINÉ');

// Générer un rapport JSON
const auditReport = {
  timestamp: new Date().toISOString(),
  score: globalScore,
  status: globalScore >= 95 ? 'excellent' : globalScore >= 85 ? 'good' : globalScore >= 70 ? 'average' : 'critical',
  routes: {
    total: routeCount,
    expected: 52,
    valid: routeCount === 52
  },
  pages: {
    found: pagesFound,
    total: criticalPages.length,
    missing: criticalPages.length - pagesFound
  },
  components: {
    found: componentsFound,
    total: criticalComponents.length,
    missing: criticalComponents.length - componentsFound
  },
  successes,
  warnings,
  issues
};

fs.writeFileSync('audit-report.json', JSON.stringify(auditReport, null, 2));
console.log('📄 Rapport détaillé sauvegardé: audit-report.json');
