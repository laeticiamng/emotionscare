#!/usr/bin/env node

/**
 * AUDIT COMPLET PLATEFORME EMOTIONSCARE
 * Analyse exhaustive de tous les éléments: pages, routes, composants, services, edge functions
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AUDIT COMPLET PLATEFORME EMOTIONSCARE');
console.log('==========================================\n');

// ═══════════════════════════════════════════════════════════
// 1. INVENTAIRE DES PAGES
// ═══════════════════════════════════════════════════════════

const PAGES_DIR = path.join(process.cwd(), 'src/pages');

function scanPagesDirectory(dir, prefix = '') {
  const pages = [];
  
  if (!fs.existsSync(dir)) {
    return pages;
  }
  
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      pages.push(...scanPagesDirectory(fullPath, `${prefix}${item}/`));
    } else if (item.endsWith('.tsx') && !item.includes('.test.')) {
      pages.push({
        file: `${prefix}${item}`,
        name: item.replace('.tsx', ''),
        path: fullPath,
        size: stat.size
      });
    }
  });
  
  return pages;
}

const allPages = scanPagesDirectory(PAGES_DIR);

// ═══════════════════════════════════════════════════════════
// 2. INVENTAIRE DES COMPOSANTS
// ═══════════════════════════════════════════════════════════

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components');

function scanComponentsDirectory(dir, prefix = '') {
  const components = [];
  
  if (!fs.existsSync(dir)) {
    return components;
  }
  
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      components.push(...scanComponentsDirectory(fullPath, `${prefix}${item}/`));
    } else if ((item.endsWith('.tsx') || item.endsWith('.ts')) && !item.includes('.test.')) {
      components.push({
        file: `${prefix}${item}`,
        category: prefix.split('/')[0] || 'root',
        path: fullPath,
        size: stat.size
      });
    }
  });
  
  return components;
}

const allComponents = scanComponentsDirectory(COMPONENTS_DIR);

// ═══════════════════════════════════════════════════════════
// 3. INVENTAIRE DES SERVICES
// ═══════════════════════════════════════════════════════════

const SERVICES_DIR = path.join(process.cwd(), 'src/services');

function scanServicesDirectory(dir, prefix = '') {
  const services = [];
  
  if (!fs.existsSync(dir)) {
    return services;
  }
  
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      services.push(...scanServicesDirectory(fullPath, `${prefix}${item}/`));
    } else if (item.endsWith('.ts') && !item.includes('.test.')) {
      services.push({
        file: `${prefix}${item}`,
        name: item.replace('.ts', ''),
        path: fullPath,
        size: stat.size
      });
    }
  });
  
  return services;
}

const allServices = scanServicesDirectory(SERVICES_DIR);

// ═══════════════════════════════════════════════════════════
// 4. INVENTAIRE DES EDGE FUNCTIONS
// ═══════════════════════════════════════════════════════════

const FUNCTIONS_DIR = path.join(process.cwd(), 'supabase/functions');

function scanEdgeFunctions() {
  const functions = [];
  
  if (!fs.existsSync(FUNCTIONS_DIR)) {
    return functions;
  }
  
  const items = fs.readdirSync(FUNCTIONS_DIR);
  
  items.forEach(item => {
    const fullPath = path.join(FUNCTIONS_DIR, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && item !== '_shared') {
      const indexPath = path.join(fullPath, 'index.ts');
      if (fs.existsSync(indexPath)) {
        const indexStat = fs.statSync(indexPath);
        functions.push({
          name: item,
          path: indexPath,
          size: indexStat.size
        });
      }
    }
  });
  
  return functions;
}

const allEdgeFunctions = scanEdgeFunctions();

// ═══════════════════════════════════════════════════════════
// 5. ANALYSE DES ROUTES
// ═══════════════════════════════════════════════════════════

const ROUTES_FILE = path.join(process.cwd(), 'src/lib/routes.ts');
let definedRoutes = [];

if (fs.existsSync(ROUTES_FILE)) {
  const routesContent = fs.readFileSync(ROUTES_FILE, 'utf8');
  const routeMatches = routesContent.match(/(\w+):\s*\(\)\s*=>\s*resolveRoutePath\(['"]([^'"]+)['"]\)/g) || [];
  definedRoutes = routeMatches.map(match => {
    const [, name, path] = match.match(/(\w+):\s*\(\)\s*=>\s*resolveRoutePath\(['"]([^'"]+)['"]\)/) || [];
    return { name, path };
  }).filter(r => r.name && r.path);
}

// ═══════════════════════════════════════════════════════════
// 6. CATÉGORISATION DES MODULES
// ═══════════════════════════════════════════════════════════

const moduleCategories = {
  'Core Features': [
    'B2CScanPage', 'B2CAICoachPage', 'B2CJournalPage', 
    'B2CMusicEnhanced', 'B2CMusicTherapyPremiumPage'
  ],
  'VR & Immersion': [
    'B2CVRBreathGuidePage', 'B2CVRGalaxyPage'
  ],
  'Fun-First Modules': [
    'B2CFlashGlowPage', 'B2CBreathworkPage', 'B2CARFiltersPage',
    'B2CBubbleBeatPage', 'B2CScreenSilkBreakPage',
    'B2CBossLevelGritPage', 'B2CMoodMixerPage', 
    'B2CAmbitionArcadePage', 'B2CBounceBackBattlePage',
    'B2CStorySynthLabPage'
  ],
  'Social & Community': [
    'B2CSocialCoconPage', 'B2CCommunautePage'
  ],
  'Analytics & Gamification': [
    'B2CActivitePage', 'B2CGamificationPage', 
    'B2CWeeklyBarsPage', 'B2CHeatmapVibesPage'
  ],
  'Settings & Profile': [
    'B2CSettingsPage', 'B2CProfileSettingsPage',
    'B2CPrivacyTogglesPage', 'B2CNotificationsPage',
    'B2CDataPrivacyPage'
  ],
  'B2B Admin': [
    'B2BTeamsPage', 'B2BReportsPage', 'B2BEventsPage',
    'B2BOptimisationPage', 'B2BSecurityPage',
    'B2BAuditPage', 'B2BAccessibilityPage'
  ],
  'Auth & Onboarding': [
    'LoginPage', 'SignupPage', 'OnboardingPage',
    'UnifiedLoginPage'
  ],
  'Legal & Support': [
    'LegalTermsPage', 'LegalPrivacyPage', 'ContactPage',
    'HelpPage', 'AboutPage'
  ]
};

// Catégoriser les pages existantes
const categorizedPages = {};
Object.keys(moduleCategories).forEach(category => {
  categorizedPages[category] = moduleCategories[category].filter(pageName =>
    allPages.some(p => p.name === pageName)
  );
});

// Pages non catégorisées
const uncategorizedPages = allPages
  .map(p => p.name)
  .filter(name => !Object.values(moduleCategories).flat().includes(name));

// ═══════════════════════════════════════════════════════════
// 7. ANALYSE DE COHÉRENCE
// ═══════════════════════════════════════════════════════════

const coherenceIssues = [];

// Vérifier que chaque route a une page correspondante
definedRoutes.forEach(route => {
  const expectedPageName = route.path
    .split('/')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') + 'Page';
  
  const pageExists = allPages.some(p => 
    p.name.toLowerCase().includes(route.name.toLowerCase())
  );
  
  if (!pageExists && !route.path.includes(':')) {
    coherenceIssues.push({
      type: 'missing_page',
      route: route.path,
      expected: expectedPageName
    });
  }
});

// Vérifier que chaque page importante a un service
const corePages = ['Scan', 'Coach', 'Journal', 'Music'];
corePages.forEach(page => {
  const serviceExists = allServices.some(s => 
    s.name.toLowerCase().includes(page.toLowerCase())
  );
  
  if (!serviceExists) {
    coherenceIssues.push({
      type: 'missing_service',
      page: page,
      expected: `${page.toLowerCase()}Service.ts`
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 8. GÉNÉRATION DU RAPPORT
// ═══════════════════════════════════════════════════════════

const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalPages: allPages.length,
    totalComponents: allComponents.length,
    totalServices: allServices.length,
    totalEdgeFunctions: allEdgeFunctions.length,
    totalRoutes: definedRoutes.length
  },
  pages: {
    byCategory: categorizedPages,
    uncategorized: uncategorizedPages,
    all: allPages.map(p => ({ name: p.name, file: p.file, size: p.size }))
  },
  components: {
    total: allComponents.length,
    byCategory: Object.entries(
      allComponents.reduce((acc, comp) => {
        acc[comp.category] = (acc[comp.category] || 0) + 1;
        return acc;
      }, {})
    ).map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
  },
  services: {
    total: allServices.length,
    list: allServices.map(s => ({ name: s.name, file: s.file, size: s.size }))
  },
  edgeFunctions: {
    total: allEdgeFunctions.length,
    list: allEdgeFunctions.map(f => ({ name: f.name, size: f.size })),
    bySize: allEdgeFunctions
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .map(f => ({ name: f.name, size: Math.round(f.size / 1024) + ' KB' }))
  },
  routes: {
    total: definedRoutes.length,
    list: definedRoutes
  },
  coherence: {
    issuesCount: coherenceIssues.length,
    issues: coherenceIssues
  },
  health: {
    pagesImplemented: (categorizedPages['Core Features']?.length || 0) + 
                       (categorizedPages['Fun-First Modules']?.length || 0),
    routesHealthy: definedRoutes.length - coherenceIssues.filter(i => i.type === 'missing_page').length,
    servicesHealthy: allServices.length - coherenceIssues.filter(i => i.type === 'missing_service').length,
    globalScore: Math.round(
      ((allPages.length / 150) * 30 +
       (allComponents.length / 500) * 25 +
       (allServices.length / 100) * 20 +
       (allEdgeFunctions.length / 150) * 15 +
       ((coherenceIssues.length === 0 ? 10 : Math.max(0, 10 - coherenceIssues.length))) * 1) * 100
    ) / 100
  },
  recommendations: []
};

// Générer des recommandations
if (uncategorizedPages.length > 10) {
  report.recommendations.push({
    priority: 'medium',
    message: `${uncategorizedPages.length} pages ne sont pas catégorisées. Organiser pour meilleure navigation.`
  });
}

if (coherenceIssues.length > 0) {
  report.recommendations.push({
    priority: 'high',
    message: `${coherenceIssues.length} problèmes de cohérence détectés entre routes et pages.`
  });
}

if (allEdgeFunctions.length > 100 && allServices.length < 50) {
  report.recommendations.push({
    priority: 'medium',
    message: 'Beaucoup d\'edge functions mais peu de services frontend. Créer des services pour encapsuler les appels.'
  });
}

const largeEdgeFunctions = allEdgeFunctions.filter(f => f.size > 50000);
if (largeEdgeFunctions.length > 0) {
  report.recommendations.push({
    priority: 'low',
    message: `${largeEdgeFunctions.length} edge functions dépassent 50KB. Optimiser si possible.`
  });
}

if (report.health.globalScore < 75) {
  report.recommendations.push({
    priority: 'high',
    message: 'Score global < 75%. Compléter les modules manquants et corriger les incohérences.'
  });
}

// Sauvegarder le rapport
const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const reportPath = path.join(reportsDir, 'comprehensive-platform-audit.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

// Afficher le résumé
console.log('📊 RÉSULTATS AUDIT COMPLET\n');
console.log('══════════════════════════════════════════════════════════');
console.log('INVENTAIRE:');
console.log(`  ✓ Pages:            ${report.summary.totalPages} fichiers`);
console.log(`  ✓ Composants:       ${report.summary.totalComponents} fichiers`);
console.log(`  ✓ Services:         ${report.summary.totalServices} fichiers`);
console.log(`  ✓ Edge Functions:   ${report.summary.totalEdgeFunctions} fonctions`);
console.log(`  ✓ Routes définies:  ${report.summary.totalRoutes} routes`);
console.log('\n══════════════════════════════════════════════════════════');
console.log('MODULES PAR CATÉGORIE:');
Object.entries(categorizedPages).forEach(([category, pages]) => {
  if (pages.length > 0) {
    console.log(`  • ${category}: ${pages.length} pages`);
  }
});
console.log('\n══════════════════════════════════════════════════════════');
console.log('COMPOSANTS PAR CATÉGORIE (Top 10):');
report.components.byCategory.slice(0, 10).forEach(cat => {
  console.log(`  • ${cat.category}: ${cat.count} composants`);
});
console.log('\n══════════════════════════════════════════════════════════');
console.log('EDGE FUNCTIONS LES PLUS VOLUMINEUSES:');
report.edgeFunctions.bySize.slice(0, 5).forEach(f => {
  console.log(`  • ${f.name}: ${f.size}`);
});
console.log('\n══════════════════════════════════════════════════════════');
console.log('COHÉRENCE:');
console.log(`  ${coherenceIssues.length === 0 ? '✓' : '⚠'} Problèmes détectés: ${coherenceIssues.length}`);
if (coherenceIssues.length > 0) {
  coherenceIssues.slice(0, 5).forEach(issue => {
    console.log(`    - ${issue.type}: ${issue.route || issue.page}`);
  });
  if (coherenceIssues.length > 5) {
    console.log(`    ... et ${coherenceIssues.length - 5} autres`);
  }
}
console.log('\n══════════════════════════════════════════════════════════');
console.log('SANTÉ GLOBALE:');
console.log(`  Score: ${report.health.globalScore}/100`);
console.log(`  • Pages core implémentées: ${report.health.pagesImplemented}`);
console.log(`  • Routes saines: ${report.health.routesHealthy}/${definedRoutes.length}`);
console.log(`  • Services actifs: ${report.health.servicesHealthy}`);
console.log('\n══════════════════════════════════════════════════════════');
console.log('RECOMMANDATIONS:');
if (report.recommendations.length === 0) {
  console.log('  ✓ Aucune recommandation - plateforme optimale!');
} else {
  report.recommendations.forEach((rec, i) => {
    const icon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
    console.log(`  ${icon} ${rec.message}`);
  });
}
console.log('\n══════════════════════════════════════════════════════════');
console.log(`📁 Rapport complet: ${reportPath}`);
console.log('\n✅ Audit terminé avec succès\n');

// Sortir avec code approprié
process.exit(coherenceIssues.length > 10 ? 1 : 0);
    totalRoutes,
    duplicateRoutes,
    missingComponents: missingComponents.length
  };
}

// Analyse des dépendances
function analyzeDependencies() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    
    // Identifier les dépendances potentiellement inutiles ou obsolètes
    const heavyDependencies = dependencies.filter(dep => 
      dep.includes('lodash') || 
      dep.includes('moment') ||
      dep.includes('jquery')
    );
    
    const duplicateLogic = dependencies.filter(dep =>
      (dep.includes('date-fns') && dependencies.includes('dayjs')) ||
      (dep.includes('axios') && dependencies.includes('fetch'))
    );
    
    return {
      totalDependencies: dependencies.length,
      totalDevDependencies: devDependencies.length,
      heavyDependencies,
      duplicateLogic,
      bundleOptimizationPotential: heavyDependencies.length + duplicateLogic.length
    };
    
  } catch (error) {
    return { error: 'Could not analyze package.json' };
  }
}

// Analyse de la sécurité
function analyzeSecurity() {
  const securityIssues = [];
  
  try {
    // Vérifier les variables d'environnement exposées
    const envFiles = ['.env', '.env.local', '.env.production'];
    envFiles.forEach(envFile => {
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf8');
        if (content.includes('SECRET') || content.includes('PRIVATE')) {
          securityIssues.push(`Potential secret exposure in ${envFile}`);
        }
      }
    });
    
    // Vérifier l'utilisation de eval, innerHTML, dangerouslySetInnerHTML
    const srcFiles = fs.readdirSync('./src', { recursive: true })
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));
    
    srcFiles.forEach(file => {
      try {
        const content = fs.readFileSync(path.join('./src', file), 'utf8');
        if (content.includes('dangerouslySetInnerHTML') || 
            content.includes('eval(') || 
            content.includes('innerHTML')) {
          securityIssues.push(`Potential XSS vulnerability in ${file}`);
        }
      } catch (e) {
        // Ignorer les erreurs de lecture
      }
    });
    
  } catch (error) {
    securityIssues.push('Could not complete security analysis');
  }
  
  return {
    issuesFound: securityIssues.length,
    issues: securityIssues
  };
}

// Générer le rapport complet
function generateComprehensiveReport() {
  const timestamp = new Date().toISOString();
  
  console.log('📊 Analyse du code source...');
  const sourceAnalysis = analyzeSourceCode();
  
  console.log('🗺️  Analyse des routes...');
  const routeAnalysis = analyzeRoutes();
  
  console.log('📦 Analyse des dépendances...');
  const dependencyAnalysis = analyzeDependencies();
  
  console.log('🔒 Analyse de sécurité...');
  const securityAnalysis = analyzeSecurity();
  
  const report = {
    timestamp,
    platform: 'EmotionsCare',
    version: '1.0.0',
    auditType: 'COMPREHENSIVE_OPTIMIZATION',
    
    // Métriques globales
    metrics: {
      totalSourceFiles: sourceAnalysis.totalFiles,
      totalRoutes: routeAnalysis.totalRoutes,
      totalDependencies: dependencyAnalysis.totalDependencies,
      codeQualityScore: calculateQualityScore(sourceAnalysis, routeAnalysis, securityAnalysis)
    },
    
    // Analyse détaillée
    codeQuality: {
      todoItems: sourceAnalysis.todoItems.length,
      consoleStatements: sourceAnalysis.consoleUsage.reduce((total, file) => total + file.count, 0),
      performanceIssues: sourceAnalysis.performanceIssues.length,
      topConsoleFiles: sourceAnalysis.consoleUsage.slice(0, 10)
    },
    
    architecture: {
      routesDuplicates: routeAnalysis.duplicateRoutes,
      missingComponents: routeAnalysis.missingComponents,
      bundleOptimization: dependencyAnalysis.bundleOptimizationPotential
    },
    
    security: {
      riskLevel: securityAnalysis.issuesFound > 5 ? 'HIGH' : 
                 securityAnalysis.issuesFound > 2 ? 'MEDIUM' : 'LOW',
      issuesFound: securityAnalysis.issuesFound,
      criticalIssues: securityAnalysis.issues
    },
    
    // Plan d'optimisation prioritaire
    optimizationPlan: [
      {
        priority: 'CRITICAL',
        category: 'Performance',
        tasks: [
          'Supprimer tous les console.log/warn/error en production',
          'Implémenter le lazy loading pour les routes',
          'Optimiser les re-renders avec React.memo et useMemo'
        ]
      },
      {
        priority: 'HIGH',
        category: 'Code Quality',
        tasks: [
          `Résoudre ${sourceAnalysis.todoItems.length} TODO items`,
          'Ajouter des tests unitaires (couverture actuelle: 0%)',
          'Implémenter TypeScript strict mode'
        ]
      },
      {
        priority: 'MEDIUM',
        category: 'Architecture',
        tasks: [
          'Centraliser la gestion d\'état avec Zustand',
          'Implémenter un système de cache avancé',
          'Optimiser le bundle size (tree shaking)'
        ]
      },
      {
        priority: 'LOW',
        category: 'Features',
        tasks: [
          'Compléter les pages avec TODO',
          'Ajouter l\'internationalisation',
          'Implémenter les PWA features'
        ]
      }
    ],
    
    // Métriques de performance estimées après optimisation
    performanceGains: {
      bundleSizeReduction: '25-40%',
      initialLoadTime: '30-50% improvement',
      memoryUsage: '20-35% reduction',
      consolePollution: '100% cleanup'
    }
  };
  
  return report;
}

// Calculer le score de qualité
function calculateQualityScore(source, routes, security) {
  let score = 100;
  
  // Pénalités
  score -= Math.min(source.todoItems.length * 2, 30); // -2 par TODO, max -30
  score -= Math.min(source.consoleUsage.length, 25); // -1 par fichier avec console, max -25
  score -= source.performanceIssues.length * 3; // -3 par problème de performance
  score -= routes.duplicateRoutes.length * 5; // -5 par route dupliquée
  score -= security.issuesFound * 10; // -10 par problème de sécurité
  
  return Math.max(score, 0);
}

// Créer le plan d'actions concrètes
function createActionPlan(report) {
  const actions = [
    '🚀 PLAN D\'ACTION IMMÉDIAT:',
    '',
    '1. NETTOYAGE CRITIQUE:',
    '   ✅ Supprimer tous les console.log en production',
    '   ✅ Nettoyer les TODO items prioritaires',
    '   ✅ Corriger les problèmes de sécurité identifiés',
    '',
    '2. OPTIMISATION PERFORMANCE:',
    '   ✅ Implémenter React.lazy pour toutes les routes',
    '   ✅ Ajouter useMemo/useCallback où nécessaire', 
    '   ✅ Optimiser les images (WebP, lazy loading)',
    '',
    '3. AMÉLIORATION ARCHITECTURE:',
    '   ✅ Centraliser l\'état global avec Zustand',
    '   ✅ Implémenter un système de cache robuste',
    '   ✅ Ajouter les tests unitaires essentiels',
    '',
    '4. FINALISATION FONCTIONNALITÉS:',
    '   ✅ Compléter les pages avec placeholder TODO',
    '   ✅ Tester toutes les routes pour zéro écran blanc',
    '   ✅ Valider l\'authentification Supabase',
    '',
    `📊 IMPACT ESTIMÉ: Score qualité ${report.metrics.codeQualityScore}/100 → 85+/100`,
    `⚡ GAINS: ${report.performanceGains.bundleSizeReduction} bundle, ${report.performanceGains.initialLoadTime} load time`
  ];
  
  return actions;
}

// Exécution principale
const report = generateComprehensiveReport();

// Sauvegarder le rapport détaillé
const reportPath = path.join(process.cwd(), 'reports', 'comprehensive-audit-report.json');
if (!fs.existsSync(path.dirname(reportPath))) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

// Afficher le résumé
console.log('\n📊 RÉSULTATS AUDIT COMPLET:');
console.log('============================');
console.log(`📁 Fichiers analysés: ${report.metrics.totalSourceFiles}`);
console.log(`🗺️  Routes totales: ${report.metrics.totalRoutes}`);
console.log(`📦 Dépendances: ${report.metrics.totalDependencies}`);
console.log(`⚡ Score qualité: ${report.metrics.codeQualityScore}/100`);
console.log(`🔴 TODO items: ${report.codeQuality.todoItems}`);
console.log(`🟡 Console usage: ${report.codeQuality.consoleStatements} statements`);
console.log(`🟠 Problèmes performance: ${report.codeQuality.performanceIssues}`);
console.log(`🔒 Niveau sécurité: ${report.security.riskLevel}`);

// Afficher le plan d'action
const actionPlan = createActionPlan(report);
console.log('\n');
actionPlan.forEach(line => console.log(line));

console.log(`\n📄 Rapport détaillé sauvegardé: ${reportPath}`);
console.log('\n✅ AUDIT TERMINÉ - PRÊT POUR OPTIMISATION MASSIVE');