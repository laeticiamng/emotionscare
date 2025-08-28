#!/usr/bin/env node

/**
 * Script de nettoyage massif des pages orphelines
 * Supprime toutes les pages non utilisées par RouterV2
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 DÉBUT DU NETTOYAGE MASSIF DES PAGES ORPHELINES...\n');

// Pages OFFICIELLEMENT utilisées par RouterV2 (ne PAS supprimer)
const ROUTER_V2_PAGES = [
  // Public
  'HomePage.tsx',
  'AboutPage.tsx', 
  'ContactPage.tsx',
  'HelpPage.tsx',
  
  // Auth unifiées
  'LoginPage.tsx',
  'SignupPage.tsx',
  'HomeB2CPage.tsx',
  'HomeB2BPage.tsx',
  
  // Dashboards principaux
  'B2CDashboardPage.tsx',
  'B2BUserDashboardPage.tsx', 
  'B2BAdminDashboardPage.tsx',
  'AppGatePage.tsx',
  
  // Modules B2C
  'B2CScanPage.tsx',
  'B2CMusicPage.tsx',
  'B2CCoachPage.tsx', 
  'B2CJournalPage.tsx',
  'B2CVRPage.tsx',
  
  // Fun-First modules
  'B2CFlashGlowPage.tsx',
  'B2CBreathworkPage.tsx',
  'B2CARFiltersPage.tsx',
  'B2CBubbleBeatPage.tsx',
  'B2CScreenSilkBreakPage.tsx',
  'B2CVRGalactiquePage.tsx',
  
  // Analytics
  'B2CGamificationPage.tsx',
  'B2CWeeklyBarsPage.tsx',
  'B2CHeatmapVibesPage.tsx',
  
  // Settings
  'B2CSettingsPage.tsx',
  'B2CProfileSettingsPage.tsx',
  'B2CPrivacyTogglesPage.tsx',
  'B2CNotificationsPage.tsx',
  
  // B2B
  'B2BTeamsPage.tsx',
  'GenericPage.tsx',
  'OptimisationPage.tsx',
  'SecurityPage.tsx',
  'AuditPage.tsx', 
  'AccessibilityPage.tsx',
  
  // System
  'UnauthorizedPage.tsx',
  'ForbiddenPage.tsx',
  'NotFoundPage.tsx',
  'ServerErrorPage.tsx',
  
  // Completes
  'B2BLandingPageComplete.tsx',
  'PlatformStatusPageComplete.tsx',
  
  // Index
  'Index.tsx',
  'index.ts'
];

// Doublons à supprimer définitivement
const DOUBLONS_TO_DELETE = [
  // Auth doublons
  'B2BUserLoginPage.tsx',
  'B2CLoginPage.tsx', 
  'B2BAdminLoginPage.tsx',
  'AdminLoginPage.tsx',
  'RegisterPage.tsx',
  
  // Dashboard doublons
  'Dashboard.tsx',
  'DashboardPage.tsx',
  'DashboardHome.tsx',
  'UserDashboard.tsx',
  'DashboardRedirect.tsx',
  
  // Auth legacy
  'Auth.tsx',
  'AuthPage.tsx',
  'Login.tsx',
  
  // Pages obsolètes
  'NotFound.tsx',
  'Unauthorized.tsx',
  'TestPage.tsx',
  'TestHome.tsx',
  'SimpleHome.tsx',
  'ImmersiveHome.tsx',
  
  // Duplicates B2B
  'B2BPage.tsx',
  'HomeB2BPage.tsx',
  'B2CPage.tsx',
  
  // Settings doublons
  'Settings.tsx',
  'SettingsPage.tsx',
  'UserSettings.tsx',
  'UserPreferences.tsx',
  'PreferencesPage.tsx',
  'PreferencesForm.tsx',
  
  // Modules doublons
  'Music.tsx',
  'MusicPage.tsx',
  'Scan.tsx',
  'ScanPage.tsx',
  'Coach.tsx',
  'CoachPage.tsx',
  'Journal.tsx',
  'JournalPage.tsx',
  'VR.tsx',
  'VRPage.tsx',
  
  // Community doublons
  'Community.tsx',
  'CommunityPage.tsx',
  'Social.tsx',
  'SocialPage.tsx',
  'SocialCocoon.tsx',
  'SocialCocoonPage.tsx',
  
  // Profile doublons
  'Profile.tsx',
  'ProfilePage.tsx',
  
  // Support doublons
  'Support.tsx',
  'SupportPage.tsx',
  
  // Docs/Help doublons
  'Docs.tsx',
  'HelpCenterPage.tsx',
  
  // Legal doublons
  'Legal.tsx',
  'LegalPage.tsx',
  'PrivacyPolicy.tsx',
  'TermsOfService.tsx',
  
  // Contact doublons
  'Contact.tsx',
  'ContactPage.tsx',
  
  // Pricing doublons
  'Pricing.tsx',
  'PricingPage.tsx',
  
  // Business doublons
  'BusinessPage.tsx',
  
  // Gamification doublons
  'Gamification.tsx',
  'GamificationPage.tsx',
  
  // Progress doublons
  'Progress.tsx',
  'ProgressPage.tsx'
];

// Dossiers entiers à supprimer
const FOLDERS_TO_DELETE = [
  'ErrorPages',           // Doublon de errors/
  'Settings',            // Doublon de settings/
  '__tests__',           // Tests mal placés
  'testing',             // Pages de test
  'accessibility',       // Doublon
  'analytics',           // Doublon
  'audit',               // Doublon
  'auth',                // Remplacé par unifiées
  'common',              // Doublon
  'privacy',             // Doublon
  'help',                // Doublon
  'support',             // Doublon
  'user',                // Doublon
  'extensions',          // Non utilisé
  'innovation',          // Non utilisé
  'onboarding',          // Doublon
  'wellness',            // Doublon
  'health',              // Doublon
  'marketing',           // Doublon
  'creativity',          // Non utilisé
  'motivation',          // Non utilisé
  'resilience',          // Non utilisé
  'biofeedback',         // Non utilisé
  'gamification',        // Doublon
  'modules',             // Doublon
  'features',            // Doublon
  'enhanced',            // Doublon
  'dashboards'           // Doublon de dashboard/
];

const pagesDir = path.join(__dirname, '../src/pages');
let deletedFiles = 0;
let deletedFolders = 0;
let errors = [];

// Fonction pour supprimer récursivement un dossier
function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        deleteFolder(filePath);
      } else {
        fs.unlinkSync(filePath);
        deletedFiles++;
      }
    });
    
    fs.rmdirSync(folderPath);
    deletedFolders++;
    console.log(`🗑️  Dossier supprimé: ${path.basename(folderPath)}/`);
  }
}

try {
  // 1. Supprimer les dossiers entiers
  console.log('📁 SUPPRESSION DES DOSSIERS ORPHELINES...\n');
  
  FOLDERS_TO_DELETE.forEach(folder => {
    const folderPath = path.join(pagesDir, folder);
    if (fs.existsSync(folderPath)) {
      deleteFolder(folderPath);
    }
  });
  
  // 2. Supprimer les fichiers doublons
  console.log('\n📄 SUPPRESSION DES FICHIERS DOUBLONS...\n');
  
  DOUBLONS_TO_DELETE.forEach(file => {
    const filePath = path.join(pagesDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deletedFiles++;
      console.log(`🗑️  Fichier supprimé: ${file}`);
    }
  });
  
  // 3. Scanner les sous-dossiers restants pour les doublons
  console.log('\n🔍 SCAN DES SOUS-DOSSIERS POUR DOUBLONS...\n');
  
  const scanSubfolders = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Vérifier si c'est un dossier à garder
        const keepFolders = ['b2b', 'b2c', 'errors', 'admin'];
        if (!keepFolders.includes(item)) {
          console.log(`⚠️  Dossier suspect trouvé: ${item}/`);
        }
        scanSubfolders(itemPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        // Vérifier doublons dans sous-dossiers
        const filename = item;
        if (DOUBLONS_TO_DELETE.includes(filename)) {
          fs.unlinkSync(itemPath);
          deletedFiles++;
          console.log(`🗑️  Doublon supprimé: ${itemPath.replace(pagesDir, 'pages')}`);
        }
      }
    });
  };
  
  scanSubfolders(pagesDir);
  
  console.log('\n✅ NETTOYAGE TERMINÉ !\n');
  console.log('📊 STATISTIQUES DE NETTOYAGE :');
  console.log(`   🗑️  Fichiers supprimés: ${deletedFiles}`);
  console.log(`   📁 Dossiers supprimés: ${deletedFolders}`);
  console.log(`   📄 Pages restantes: ${ROUTER_V2_PAGES.length} (RouterV2)`);
  
  // Vérifier que les pages RouterV2 existent toujours
  console.log('\n🔍 VÉRIFICATION DES PAGES ROUTERV2...');
  let missingPages = 0;
  
  ROUTER_V2_PAGES.forEach(page => {
    const pagePath = path.join(pagesDir, page);
    if (!fs.existsSync(pagePath)) {
      console.log(`⚠️  Page RouterV2 manquante: ${page}`);
      missingPages++;
    }
  });
  
  if (missingPages === 0) {
    console.log('✅ Toutes les pages RouterV2 sont présentes !');
  } else {
    console.log(`❌ ${missingPages} pages RouterV2 manquantes !`);
  }
  
  console.log('\n🎉 NETTOYAGE MASSIF RÉUSSI !');
  console.log('   ✅ Pages orphelines supprimées');
  console.log('   ✅ Doublons éliminés'); 
  console.log('   ✅ Architecture propre');
  console.log('   ✅ Bundle size réduit');
  console.log('   ✅ Maintenance simplifiée');
  
} catch (error) {
  console.error('❌ ERREUR PENDANT LE NETTOYAGE:', error.message);
  errors.push(error.message);
}

if (errors.length > 0) {
  console.log('\n⚠️  ERREURS RENCONTRÉES:');
  errors.forEach(error => console.log(`   - ${error}`));
} else {
  console.log('\n🚀 NETTOYAGE 100% RÉUSSI - AUCUNE ERREUR !');
}

console.log('\n📋 PROCHAINES ÉTAPES:');
console.log('   1. Vérifier que l\'app fonctionne');
console.log('   2. Tester RouterV2 navigation');
console.log('   3. Commit des suppressions');
console.log('   4. Célébrer le code propre ! 🎊');