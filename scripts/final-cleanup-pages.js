#!/usr/bin/env node

/**
 * Script de nettoyage FINAL des pages
 * Supprime toutes les pages non utilisées par RouterV2
 */

const fs = require('fs');
const path = require('path');

// Pages EXACTES utilisées par RouterV2 (selon registry.ts)
const REQUIRED_PAGES = [
  // Publiques
  'HomePage.tsx',
  'HomeB2CPage.tsx', 
  'HomeB2BPage.tsx',
  'AboutPage.tsx',
  'LoginPage.tsx',
  'SignupPage.tsx',
  'HelpPage.tsx',

  // Dashboards
  'AppGatePage.tsx',
  'B2CDashboardPage.tsx',
  'B2BUserDashboardPage.tsx', 
  'B2BAdminDashboardPage.tsx',

  // Modules B2C Core
  'B2CScanPage.tsx',
  'B2CMusicPage.tsx',
  'B2CCoachPage.tsx',
  'B2CJournalPage.tsx',
  'B2CVRPage.tsx',

  // Modules B2C Fun-First
  'B2CFlashGlowPage.tsx',
  'B2CBreathworkPage.tsx',
  'B2CARFiltersPage.tsx',
  'B2CBubbleBeatPage.tsx',
  'B2CScreenSilkBreakPage.tsx',
  'B2CVRGalactiquePage.tsx',
  'B2CBossLevelGritPage.tsx',
  'B2CMoodMixerPage.tsx',
  'B2CAmbitionArcadePage.tsx',
  'B2CBounceBackBattlePage.tsx',
  'B2CStorySynthLabPage.tsx',

  // Analytics B2C
  'B2CGamificationPage.tsx',
  'B2CWeeklyBarsPage.tsx',
  'B2CHeatmapVibesPage.tsx',

  // Settings B2C  
  'B2CSettingsPage.tsx',
  'B2CProfileSettingsPage.tsx',
  'B2CPrivacyTogglesPage.tsx',
  'B2CNotificationsPage.tsx',

  // B2B Features
  'B2BTeamsPage.tsx',
  'B2BSocialCoconPage.tsx',
  'B2BReportsPage.tsx',
  'B2BEventsPage.tsx',
  'B2BOptimisationPage.tsx',
  'B2BSecurityPage.tsx',
  'B2BAuditPage.tsx',
  'B2BAccessibilityPage.tsx',

  // System
  'ServerErrorPage.tsx',

  // Fallbacks nécessaires
  'GenericPage.tsx',
  'SecurityPage.tsx',
  'OptimisationPage.tsx',
  'AuditPage.tsx',
  'AccessibilityPage.tsx',

  // Index
  'index.ts'
];

// Dossiers à garder (avec contenu nécessaire)
const REQUIRED_DIRS = [
  'errors' // Pages d'erreur 401/403/404
];

console.log('🧹 NETTOYAGE FINAL DES PAGES');
console.log(`📦 Pages nécessaires: ${REQUIRED_PAGES.length}`);

const pagesDir = path.join(__dirname, '../src/pages');
let deletedFiles = 0;
let deletedDirs = 0;
let errors = [];

try {
  // Lire le contenu du dossier pages
  const items = fs.readdirSync(pagesDir);
  
  for (const item of items) {
    const itemPath = path.join(pagesDir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Supprimer les dossiers non nécessaires
      if (!REQUIRED_DIRS.includes(item)) {
        try {
          fs.rmSync(itemPath, { recursive: true, force: true });
          console.log(`🗂️ Dossier supprimé: ${item}/`);
          deletedDirs++;
        } catch (err) {
          errors.push(`Erreur dossier ${item}: ${err.message}`);
        }
      }
    } else if (stat.isFile()) {
      // Supprimer les fichiers non nécessaires
      if (!REQUIRED_PAGES.includes(item) && item !== 'immersive-styles.css') {
        try {
          fs.unlinkSync(itemPath);
          console.log(`🗄️ Fichier supprimé: ${item}`);
          deletedFiles++;
        } catch (err) {
          errors.push(`Erreur fichier ${item}: ${err.message}`);
        }
      }
    }
  }

  // Rapport final
  console.log('\n✅ NETTOYAGE TERMINÉ');
  console.log(`📁 Dossiers supprimés: ${deletedDirs}`);
  console.log(`📄 Fichiers supprimés: ${deletedFiles}`);
  
  if (errors.length > 0) {
    console.log(`❌ Erreurs: ${errors.length}`);
    errors.forEach(err => console.log(`   ${err}`));
  }
  
  // Vérification finale
  const remainingItems = fs.readdirSync(pagesDir);
  console.log(`\n📊 ÉTAT FINAL: ${remainingItems.length} éléments restants`);
  console.log('✅ Architecture optimisée pour RouterV2!');

} catch (error) {
  console.error('❌ ERREUR CRITIQUE:', error.message);
  process.exit(1);
}