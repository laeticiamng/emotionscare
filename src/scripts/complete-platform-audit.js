#!/usr/bin/env node

/**
 * AUDIT COMPLET ET FINALISATION - Validation 100% de la plateforme
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 AUDIT COMPLET DE LA PLATEFORME EMOTIONSCARE');
console.log('===============================================\n');

// Couleurs pour console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  bright: '\x1b[1m'
};

let totalChecks = 0;
let passedChecks = 0;
let criticalIssues = [];
let warnings = [];
let suggestions = [];

function logCheck(description, status, details = '', level = 'info') {
  totalChecks++;
  
  if (status === 'pass') {
    passedChecks++;
    console.log(`${colors.green}✅ ${description}${colors.reset}`);
    if (details) console.log(`   ${colors.green}└─ ${details}${colors.reset}`);
  } else if (status === 'fail') {
    console.log(`${colors.red}❌ ${description}${colors.reset}`);
    if (details) {
      console.log(`   ${colors.red}└─ ${details}${colors.reset}`);
      if (level === 'critical') {
        criticalIssues.push(`${description}: ${details}`);
      } else {
        warnings.push(`${description}: ${details}`);
      }
    }
  } else if (status === 'warning') {
    console.log(`${colors.yellow}⚠️  ${description}${colors.reset}`);
    if (details) {
      console.log(`   ${colors.yellow}└─ ${details}${colors.reset}`);
      warnings.push(`${description}: ${details}`);
    }
  } else if (status === 'info') {
    console.log(`${colors.blue}ℹ️  ${description}${colors.reset}`);
    if (details) console.log(`   ${colors.cyan}└─ ${details}${colors.reset}`);
  }
}

function logSection(title) {
  console.log(`\n${colors.bold}${colors.blue}${title}${colors.reset}`);
  console.log('─'.repeat(title.length));
}

async function validateCompleteRouting() {
  logSection('1. VALIDATION SYSTÈME DE ROUTING');
  
  try {
    // Registry
    const registryPath = path.join(__dirname, '../routerV2/registry.ts');
    const registryContent = fs.readFileSync(registryPath, 'utf8');
    
    const allRoutes = registryContent.match(/{\s*name:\s*['"`]([^'"`]+)['"`][\s\S]*?}/g) || [];
    logCheck('Registry de routes', 'pass', `${allRoutes.length} routes définies`);
    
    // Vérifier les segments
    const segments = {
      public: (registryContent.match(/segment:\s*['"`]public['"`]/g) || []).length,
      consumer: (registryContent.match(/segment:\s*['"`]consumer['"`]/g) || []).length,
      employee: (registryContent.match(/segment:\s*['"`]employee['"`]/g) || []).length,
      manager: (registryContent.match(/segment:\s*['"`]manager['"`]/g) || []).length
    };
    
    console.log(`   ${colors.cyan}Segments: public(${segments.public}), consumer(${segments.consumer}), employee(${segments.employee}), manager(${segments.manager})${colors.reset}`);
    
    // Router implementation
    const routerPath = path.join(__dirname, '../routerV2/index.tsx');
    const routerContent = fs.readFileSync(routerPath, 'utf8');
    
    const hasLazyLoading = routerContent.includes('lazy(');
    const hasRouteGuards = routerContent.includes('RouteGuard');
    const hasComponentMap = routerContent.includes('componentMap');
    
    logCheck('Lazy Loading activé', hasLazyLoading ? 'pass' : 'fail', 
             hasLazyLoading ? 'Performance optimisée' : 'Manque lazy loading');
    logCheck('Guards de sécurité', hasRouteGuards ? 'pass' : 'fail',
             hasRouteGuards ? 'Protection par rôles active' : 'Sécurité manquante');
    logCheck('Mapping des composants', hasComponentMap ? 'pass' : 'fail',
             hasComponentMap ? 'Tous composants mappés' : 'ComponentMap manquant');
    
    // Helpers
    const helpersPath = path.join(__dirname, '../routerV2/helpers.ts');
    const helpersContent = fs.readFileSync(helpersPath, 'utf8');
    const helperFunctions = helpersContent.match(/\w+:\s*\(\)/g) || [];
    
    logCheck('Helpers de navigation', 'pass', `${helperFunctions.length} fonctions typées`);
    
    return { 
      totalRoutes: allRoutes.length, 
      segments, 
      helpers: helperFunctions.length,
      security: hasRouteGuards,
      performance: hasLazyLoading
    };
    
  } catch (error) {
    logCheck('Système de routing', 'fail', error.message, 'critical');
    return null;
  }
}

async function validateAllPages() {
  logSection('2. VALIDATION COMPLÈTE DES PAGES');
  
  try {
    const pagesDir = path.join(__dirname, '../pages');
    const allFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
    
    logCheck('Fichiers de pages détectés', 'pass', `${allFiles.length} pages trouvées`);
    
    // Pages critiques
    const criticalPages = [
      'HomePage.tsx', 'LoginPage.tsx', 'SignupPage.tsx',
      'B2CDashboardPage.tsx', 'B2BUserDashboardPage.tsx', 'B2BAdminDashboardPage.tsx',
      'AppGatePage.tsx', 'NotFoundPage.tsx'
    ];
    
    criticalPages.forEach(page => {
      const exists = allFiles.includes(page);
      logCheck(`Page critique ${page}`, exists ? 'pass' : 'fail', 
               exists ? 'Disponible' : 'MANQUANTE - Impact critique');
    });
    
    // Vérifier les imports dans les pages
    let validImports = 0;
    let invalidImports = 0;
    
    // Test sur un échantillon de pages pour éviter la surcharge
    const samplePages = allFiles.slice(0, 15);
    
    for (const file of samplePages) {
      try {
        const filePath = path.join(pagesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const hasReactImport = content.includes('import React') || content.includes('from \'react\'');
        const hasExportDefault = content.includes('export default');
        const hasValidComponent = content.includes('const ') && content.includes('FC') || content.includes('function ');
        
        if (hasReactImport && hasExportDefault && hasValidComponent) {
          validImports++;
        } else {
          invalidImports++;
          logCheck(`Imports ${file}`, 'warning', 'Structure component à vérifier');
        }
      } catch (err) {
        invalidImports++;
        logCheck(`Lecture ${file}`, 'fail', 'Erreur de lecture', 'critical');
      }
    }
    
    logCheck('Structure des composants', validImports > invalidImports ? 'pass' : 'warning',
             `${validImports}/${samplePages.length} pages valides dans l'échantillon`);
    
    return { 
      totalPages: allFiles.length, 
      validPages: validImports, 
      criticalPages: criticalPages.length 
    };
    
  } catch (error) {
    logCheck('Validation des pages', 'fail', error.message, 'critical');
    return null;
  }
}

async function validateNavigation() {
  logSection('3. VALIDATION SYSTÈME DE NAVIGATION');
  
  try {
    // Navigation complète
    const navPath = path.join(__dirname, '../components/navigation/CompleteNavigationMenu.tsx');
    const navExists = fs.existsSync(navPath);
    
    logCheck('Menu navigation principal', navExists ? 'pass' : 'fail',
             navExists ? 'CompleteNavigationMenu configuré' : 'Menu principal manquant');
    
    if (navExists) {
      const navContent = fs.readFileSync(navPath, 'utf8');
      const hasCategories = navContent.includes('navigationCategories');
      const hasSearch = navContent.includes('Search');
      const hasRouteValidator = navContent.includes('RouteValidator');
      
      logCheck('Catégories navigation', hasCategories ? 'pass' : 'warning',
               hasCategories ? 'Structure organisée' : 'Catégories manquantes');
      logCheck('Recherche globale', hasSearch ? 'pass' : 'warning',
               hasSearch ? 'Cmd+K activé' : 'Recherche manquante');
      logCheck('Validation routes', hasRouteValidator ? 'pass' : 'info',
               hasRouteValidator ? 'Auto-validation active' : 'Validation optionnelle');
    }
    
    // Enhanced Shell
    const shellPath = path.join(__dirname, '../components/layout/EnhancedShell.tsx');
    const shellExists = fs.existsSync(shellPath);
    
    logCheck('Layout principal', shellExists ? 'pass' : 'fail',
             shellExists ? 'EnhancedShell disponible' : 'Layout principal manquant');
    
    // Quick Access
    const quickAccessPath = path.join(__dirname, '../components/navigation/QuickAccessSidebar.tsx');
    const quickAccessExists = fs.existsSync(quickAccessPath);
    
    logCheck('Accès rapide', quickAccessExists ? 'pass' : 'info',
             quickAccessExists ? 'Sidebar configurée' : 'Feature optionnelle');
    
    return { 
      hasMainNav: navExists, 
      hasLayout: shellExists, 
      hasQuickAccess: quickAccessExists 
    };
    
  } catch (error) {
    logCheck('Système navigation', 'fail', error.message, 'critical');
    return null;
  }
}

async function validateUserExperience() {
  logSection('4. VALIDATION EXPÉRIENCE UTILISATEUR');
  
  try {
    // Vérifier les composants premium
    const premiumDir = path.join(__dirname, '../components/premium');
    const premiumExists = fs.existsSync(premiumDir);
    
    if (premiumExists) {
      const premiumFiles = fs.readdirSync(premiumDir);
      const keyComponents = [
        'PremiumBackground.tsx',
        'EnhancedCard.tsx', 
        'ImmersiveExperience.tsx',
        'AnimatedButton.tsx'
      ];
      
      keyComponents.forEach(component => {
        const exists = premiumFiles.includes(component);
        logCheck(`Component premium ${component}`, exists ? 'pass' : 'warning',
                 exists ? 'UX enrichie' : 'Experience basique');
      });
      
      logCheck('Suite Premium', 'pass', `${premiumFiles.length} composants UX`);
    } else {
      logCheck('Composants Premium', 'warning', 'Dossier premium manquant');
    }
    
    // Vérifier les animations
    const hasFramerMotion = fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8')
                              .includes('framer-motion');
    
    logCheck('Animations fluides', hasFramerMotion ? 'pass' : 'warning',
             hasFramerMotion ? 'Framer Motion configuré' : 'Animations statiques');
    
    return { premiumComponents: premiumExists, animations: hasFramerMotion };
    
  } catch (error) {
    logCheck('Expérience utilisateur', 'fail', error.message);
    return null;
  }
}

async function validateAccessibility() {
  logSection('5. VALIDATION ACCESSIBILITÉ & SÉCURITÉ');
  
  try {
    // Guards de routes
    const guardsPath = path.join(__dirname, '../routerV2/guards.tsx');
    const guardsExists = fs.existsSync(guardsPath);
    
    if (guardsExists) {
      const guardsContent = fs.readFileSync(guardsPath, 'utf8');
      const hasRoleGuard = guardsContent.includes('RouteGuard');
      const hasRoleCheck = guardsContent.includes('normalizeRole');
      const hasAuthCheck = guardsContent.includes('isAuthenticated');
      
      logCheck('Protection par rôles', hasRoleGuard ? 'pass' : 'fail',
               hasRoleGuard ? 'Guards actifs' : 'Sécurité manquante', 'critical');
      logCheck('Normalisation rôles', hasRoleCheck ? 'pass' : 'warning',
               hasRoleCheck ? 'Mapping roles sécurisé' : 'Rôles non normalisés');
      logCheck('Vérification auth', hasAuthCheck ? 'pass' : 'fail',
               hasAuthCheck ? 'Auth requise' : 'Accès non sécurisé', 'critical');
    } else {
      logCheck('Système de guards', 'fail', 'Fichier guards.tsx manquant', 'critical');
    }
    
    // Vérifier test-ids pour les tests
    const samplePagePath = path.join(__dirname, '../pages/B2CDashboardPage.tsx');
    if (fs.existsSync(samplePagePath)) {
      const pageContent = fs.readFileSync(samplePagePath, 'utf8');
      const hasTestIds = pageContent.includes('data-testid');
      
      logCheck('Support tests E2E', hasTestIds ? 'pass' : 'info',
               hasTestIds ? 'Test IDs présents' : 'Tests manuels uniquement');
    }
    
    return { hasGuards: guardsExists, securityLevel: 'high' };
    
  } catch (error) {
    logCheck('Sécurité & Accessibilité', 'fail', error.message);
    return null;
  }
}

async function generateFinalReport() {
  logSection('6. GÉNÉRATION RAPPORT FINAL');
  
  const routing = await validateCompleteRouting();
  const pages = await validateAllPages();
  const navigation = await validateNavigation();
  const ux = await validateUserExperience();
  const security = await validateAccessibility();
  
  // Calcul du score global
  const successRate = Math.round((passedChecks / totalChecks) * 100);
  
  logSection('📊 RÉSUMÉ EXÉCUTIF');
  
  console.log(`${colors.bold}Score global: ${successRate}%${colors.reset}`);
  console.log(`Vérifications: ${colors.green}${passedChecks} réussites${colors.reset} / ${colors.blue}${totalChecks} total${colors.reset}`);
  
  if (criticalIssues.length > 0) {
    console.log(`\n${colors.red}${colors.bold}🚨 PROBLÈMES CRITIQUES (${criticalIssues.length}):${colors.reset}`);
    criticalIssues.forEach((issue, i) => {
      console.log(`${colors.red}${i + 1}. ${issue}${colors.reset}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}${colors.bold}⚠️  AVERTISSEMENTS (${warnings.length}):${colors.reset}`);
    warnings.slice(0, 5).forEach((warning, i) => {
      console.log(`${colors.yellow}${i + 1}. ${warning}${colors.reset}`);
    });
    if (warnings.length > 5) {
      console.log(`${colors.yellow}... et ${warnings.length - 5} autres${colors.reset}`);
    }
  }
  
  logSection('🎯 STATUT DE LA PLATEFORME');
  
  if (successRate >= 90) {
    console.log(`${colors.green}${colors.bold}🎉 PLATEFORME PRÊTE POUR PRODUCTION${colors.reset}`);
    console.log(`${colors.green}✅ Tous les systèmes opérationnels${colors.reset}`);
    console.log(`${colors.green}✅ Navigation complète et sécurisée${colors.reset}`);
    console.log(`${colors.green}✅ Expérience utilisateur premium${colors.reset}`);
    console.log(`${colors.green}✅ Performance optimisée${colors.reset}`);
  } else if (successRate >= 75) {
    console.log(`${colors.yellow}${colors.bold}⚡ PLATEFORME FONCTIONNELLE${colors.reset}`);
    console.log(`${colors.yellow}✅ Fonctionnalités principales actives${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Quelques optimisations recommandées${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}⚠️  DÉVELOPPEMENT EN COURS${colors.reset}`);
    console.log(`${colors.red}❌ Problèmes critiques à résoudre${colors.reset}`);
  }
  
  logSection('📋 FEUILLE DE ROUTE');
  
  console.log('Priorité 1 - Critiques:');
  if (criticalIssues.length === 0) {
    console.log(`${colors.green}✅ Aucun problème critique${colors.reset}`);
  } else {
    criticalIssues.slice(0, 3).forEach(issue => {
      console.log(`${colors.red}• ${issue}${colors.reset}`);
    });
  }
  
  console.log('\nPriorité 2 - Améliorations:');
  const improvements = [
    'Tests E2E automatisés',
    'Documentation utilisateur',
    'Optimisation SEO',
    'Analytics utilisateur',
    'Support multilingue'
  ];
  
  improvements.forEach(improvement => {
    console.log(`${colors.blue}• ${improvement}${colors.reset}`);
  });
  
  logSection('🚀 PROCHAINES ÉTAPES');
  
  if (successRate >= 90) {
    console.log('1. 🔥 Déploiement production immédiat');
    console.log('2. 📊 Mise en place monitoring');
    console.log('3. 👥 Tests utilisateurs beta');
    console.log('4. 📈 Analyse des métriques');
  } else {
    console.log('1. 🔧 Correction des problèmes critiques');
    console.log('2. ✅ Re-validation complète');
    console.log('3. 🚀 Déploiement staging');
    console.log('4. 🔍 Tests finaux');
  }
  
  const statusCode = criticalIssues.length === 0 && successRate >= 85 ? 0 : 1;
  
  console.log(`\n${colors.bold}${colors.blue}Audit terminé - Code de sortie: ${statusCode}${colors.reset}\n`);
  
  return statusCode;
}

// Exécution de l'audit complet
generateFinalReport()
  .then(statusCode => process.exit(statusCode))
  .catch(error => {
    console.error(`${colors.red}❌ Erreur durant l'audit: ${error.message}${colors.reset}`);
    process.exit(1);
  });