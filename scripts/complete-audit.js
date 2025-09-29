
#!/usr/bin/env node

/**
 * Audit complet de l'application EmotionsCare
 * Vérifie toutes les routes, pages, et composants
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AUDIT COMPLET EMOTIONSCARE - JANVIER 2025');
console.log('=' .repeat(60));

// Routes unifiées (les 52 routes officielles)
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
  FEEDBACK: '/feedback'
};

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function scanDirectory(dirPath, extension = '.tsx') {
  const files = [];
  try {
    if (fs.existsSync(dirPath)) {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          files.push(...scanDirectory(fullPath, extension));
        } else if (entry.name.endsWith(extension)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Erreur lors du scan de ${dirPath}:`, error.message);
  }
  return files;
}

function auditPages() {
  console.log('\n📄 AUDIT DES PAGES');
  console.log('-'.repeat(30));
  
  const pagesDir = path.join(process.cwd(), 'src', 'pages');
  const existingPages = scanDirectory(pagesDir);
  
  console.log(`✅ Pages trouvées: ${existingPages.length}`);
  
  // Mapping route -> page attendue
  const routeToPage = {
    '/': 'HomePage',
    '/choose-mode': 'ChooseModePage',
    '/onboarding': 'OnboardingPage',
    '/b2b/selection': 'B2BSelectionPage',
    '/b2c/login': 'B2CLoginPage',
    '/b2c/register': 'B2CRegisterPage',
    '/b2b/user/login': 'B2BUserLoginPage',
    '/b2b/user/register': 'B2BUserRegisterPage',
    '/b2b/admin/login': 'B2BAdminLoginPage',
    '/b2c/dashboard': 'B2CDashboardPage',
    '/b2b/user/dashboard': 'B2BUserDashboardPage',
    '/b2b/admin/dashboard': 'B2BAdminDashboardPage',
    '/scan': 'ScanPage',
    '/music': 'MusicPage',
    '/coach': 'CoachPage',
    '/journal': 'JournalPage',
    '/vr': 'VRPage',
    '/meditation': 'MeditationPage',
    '/preferences': 'PreferencesPage',
    '/gamification': 'GamificationPage',
    '/social-cocon': 'SocialCoconPage',
    '/teams': 'TeamsPage',
    '/reports': 'ReportsPage',
    '/events': 'EventsPage',
    '/optimisation': 'OptimisationPage',
    '/settings': 'SettingsPage',
    '/notifications': 'NotificationsPage',
    '/security': 'SecurityPage',
    '/audit': 'SystemAuditPage',
    '/accessibility': 'AccessibilityPage',
    '/feedback': 'FeedbackPage'
  };
  
  let completedPages = 0;
  let missingPages = [];
  
  for (const [route, pageName] of Object.entries(routeToPage)) {
    const pageExists = existingPages.some(file => file.includes(pageName));
    if (pageExists) {
      completedPages++;
      console.log(`✅ ${pageName} (${route})`);
    } else {
      missingPages.push({ route, pageName });
      console.log(`❌ ${pageName} (${route}) - MANQUANT`);
    }
  }
  
  console.log(`\n📊 Résumé Pages:`);
  console.log(`   Complétées: ${completedPages}/${Object.keys(routeToPage).length}`);
  console.log(`   Manquantes: ${missingPages.length}`);
  
  return { completedPages, missingPages, totalExpected: Object.keys(routeToPage).length };
}

function auditComponents() {
  console.log('\n🧩 AUDIT DES COMPOSANTS');
  console.log('-'.repeat(30));
  
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  const existingComponents = scanDirectory(componentsDir);
  
  console.log(`✅ Composants trouvés: ${existingComponents.length}`);
  
  // Vérifier les composants critiques
  const criticalComponents = [
    'FullScreenLoader',
    'UnifiedShell',
    'ProtectedRoute',
    'NavBar',
    'Layout',
    'DashboardHero'
  ];
  
  let foundCritical = 0;
  for (const component of criticalComponents) {
    const exists = existingComponents.some(file => file.includes(component));
    if (exists) {
      foundCritical++;
      console.log(`✅ ${component}`);
    } else {
      console.log(`❌ ${component} - MANQUANT`);
    }
  }
  
  console.log(`\n📊 Composants critiques: ${foundCritical}/${criticalComponents.length}`);
  
  return { totalComponents: existingComponents.length, criticalFound: foundCritical };
}

function auditRoutes() {
  console.log('\n🗺️ AUDIT DES ROUTES');
  console.log('-'.repeat(30));
  
  const routes = Object.values(UNIFIED_ROUTES);
  console.log(`📋 Total routes unifiées: ${routes.length}`);
  
  // Vérifier l'unicité
  const uniqueRoutes = new Set(routes);
  const duplicates = routes.length - uniqueRoutes.size;
  
  if (duplicates === 0) {
    console.log('✅ Toutes les routes sont uniques');
  } else {
    console.log(`❌ ${duplicates} routes dupliquées détectées`);
  }
  
  // Vérifier la structure du routeur
  const routerFile = path.join(process.cwd(), 'src', 'router', 'index.tsx');
  const routerExists = checkFileExists(routerFile);
  
  console.log(`Router principal: ${routerExists ? '✅' : '❌'}`);
  
  return { totalRoutes: routes.length, duplicates, routerExists };
}

function auditDependencies() {
  console.log('\n📦 AUDIT DES DÉPENDANCES');
  console.log('-'.repeat(30));
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!checkFileExists(packageJsonPath)) {
    console.log('❌ package.json introuvable');
    return { status: 'error' };
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const criticalDeps = [
      'react',
      'react-dom',
      'react-router-dom',
      'typescript',
      '@tanstack/react-query',
      'lucide-react',
      'tailwindcss'
    ];
    
    let foundDeps = 0;
    for (const dep of criticalDeps) {
      if (deps[dep]) {
        foundDeps++;
        console.log(`✅ ${dep}: ${deps[dep]}`);
      } else {
        console.log(`❌ ${dep} - MANQUANT`);
      }
    }
    
    console.log(`\n📊 Dépendances critiques: ${foundDeps}/${criticalDeps.length}`);
    console.log(`📊 Total dépendances: ${Object.keys(deps).length}`);
    
    return { foundDeps, totalDeps: Object.keys(deps).length };
  } catch (error) {
    console.log('❌ Erreur lecture package.json:', error.message);
    return { status: 'error' };
  }
}

function auditSecurity() {
  console.log('\n🛡️ AUDIT SÉCURITÉ');
  console.log('-'.repeat(30));
  
  const securityFiles = [
    { path: '.env.example', desc: 'Template environnement' },
    { path: 'src/lib/security', desc: 'Module sécurité' },
    { path: 'src/utils/productionSecurity.ts', desc: 'Sécurité production' }
  ];
  
  let securityScore = 0;
  for (const file of securityFiles) {
    const exists = checkFileExists(path.join(process.cwd(), file.path));
    if (exists) {
      securityScore++;
      console.log(`✅ ${file.desc}`);
    } else {
      console.log(`❌ ${file.desc} - MANQUANT`);
    }
  }
  
  console.log(`\n📊 Score sécurité: ${securityScore}/${securityFiles.length}`);
  
  return { securityScore, maxScore: securityFiles.length };
}

function generateFinalReport(audits) {
  console.log('\n📋 RAPPORT FINAL');
  console.log('='.repeat(60));
  
  const { pagesAudit, componentsAudit, routesAudit, depsAudit, securityAudit } = audits;
  
  // Calcul du score global
  const pageScore = (pagesAudit.completedPages / pagesAudit.totalExpected) * 100;
  const routeScore = routesAudit.duplicates === 0 ? 100 : 50;
  const depScore = (depsAudit.foundDeps / 7) * 100; // 7 deps critiques
  const secScore = (securityAudit.securityScore / securityAudit.maxScore) * 100;
  
  const globalScore = Math.round((pageScore + routeScore + depScore + secScore) / 4);
  
  console.log(`🎯 SCORE GLOBAL: ${globalScore}/100`);
  console.log('');
  console.log('📊 DÉTAILS PAR CATÉGORIE:');
  console.log(`   📄 Pages: ${Math.round(pageScore)}% (${pagesAudit.completedPages}/${pagesAudit.totalExpected})`);
  console.log(`   🗺️ Routes: ${routeScore}% (${routesAudit.totalRoutes} routes, ${routesAudit.duplicates} doublons)`);
  console.log(`   📦 Dépendances: ${Math.round(depScore)}% (${depsAudit.foundDeps}/7 critiques)`);
  console.log(`   🛡️ Sécurité: ${Math.round(secScore)}% (${securityAudit.securityScore}/${securityAudit.maxScore})`);
  console.log('');
  
  if (globalScore >= 90) {
    console.log('🎉 EXCELLENT! Application prête pour la production');
  } else if (globalScore >= 75) {
    console.log('✅ BIEN! Quelques améliorations possibles');
  } else if (globalScore >= 60) {
    console.log('⚠️ MOYEN! Corrections nécessaires');
  } else {
    console.log('❌ PROBLÈMES! Corrections urgentes requises');
  }
  
  console.log('');
  console.log('📋 PROCHAINES ÉTAPES:');
  
  if (pagesAudit.missingPages.length > 0) {
    console.log(`   • Créer ${pagesAudit.missingPages.length} pages manquantes`);
  }
  
  if (routesAudit.duplicates > 0) {
    console.log(`   • Corriger ${routesAudit.duplicates} doublons de routes`);
  }
  
  if (depsAudit.foundDeps < 7) {
    console.log(`   • Installer ${7 - depsAudit.foundDeps} dépendances manquantes`);
  }
  
  if (securityAudit.securityScore < securityAudit.maxScore) {
    console.log(`   • Améliorer la configuration sécurité`);
  }
  
  console.log('');
  console.log('🚀 EmotionsCare - Audit terminé!');
  
  return globalScore;
}

// Exécution de l'audit complet
async function runCompleteAudit() {
  try {
    const audits = {
      pagesAudit: auditPages(),
      componentsAudit: auditComponents(),
      routesAudit: auditRoutes(),
      depsAudit: auditDependencies(),
      securityAudit: auditSecurity()
    };
    
    const globalScore = generateFinalReport(audits);
    
    // Créer un fichier de rapport
    const reportData = {
      timestamp: new Date().toISOString(),
      globalScore,
      audits,
      recommendations: []
    };
    
    if (audits.pagesAudit.missingPages.length > 0) {
      reportData.recommendations.push(`Créer ${audits.pagesAudit.missingPages.length} pages manquantes`);
    }
    
    const reportPath = path.join(process.cwd(), 'reports', 'complete-audit-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`📄 Rapport sauvegardé: ${reportPath}`);
    
    process.exit(globalScore >= 75 ? 0 : 1);
  } catch (error) {
    console.error('💥 Erreur durant l\'audit:', error);
    process.exit(1);
  }
}

// Lancer l'audit si le script est exécuté directement
if (require.main === module) {
  runCompleteAudit();
}

module.exports = { runCompleteAudit };
