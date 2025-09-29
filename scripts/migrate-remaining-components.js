#!/usr/bin/env node

/**
 * Migration des composants restants vers RouterV2
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Migration des composants restants vers RouterV2...\n');

// Mapping des remplacements
const replacements = [
  // UNIFIED_ROUTES → Routes (RouterV2)
  {
    from: /import\s+{\s*UNIFIED_ROUTES\s*}\s+from\s+['"]@\/utils\/routeUtils['"];?/g,
    to: "import { Routes } from '@/routerV2';"
  },
  {
    from: /UNIFIED_ROUTES\.([A-Z_]+)/g,
    to: (match, route) => {
      // Mapping des routes UNIFIED vers RouterV2
      const routeMap = {
        'HOME': 'Routes.home()',
        'B2C_DASHBOARD': 'Routes.consumerHome()',  
        'B2B_USER_DASHBOARD': 'Routes.employeeHome()',
        'B2B_ADMIN_DASHBOARD': 'Routes.managerHome()',
        'SCAN': 'Routes.scan()',
        'MUSIC': 'Routes.music()',
        'COACH': 'Routes.coach()',
        'JOURNAL': 'Routes.journal()',
        'VR': 'Routes.vr()',
        'TEAMS': 'Routes.teams()',
        'REPORTS': 'Routes.adminReports()',
        'EVENTS': 'Routes.adminEvents()',
        'SOCIAL_COCON': 'Routes.socialCocon()',
        'SETTINGS': 'Routes.settingsGeneral()',
        'PREFERENCES': 'Routes.settingsGeneral()',
        'GAMIFICATION': 'Routes.leaderboard()',
        'B2C_LOGIN': 'Routes.login({ segment: "b2c" })',
        'B2B_USER_LOGIN': 'Routes.login({ segment: "b2b" })',
        'B2B_ADMIN_LOGIN': 'Routes.login({ segment: "b2b" })',
        'CHOOSE_MODE': 'Routes.b2cLanding()',
        'B2B_SELECTION': 'Routes.b2bLanding()',
        'OPTIMISATION': 'Routes.adminOptimization()',
        'AUTH': 'Routes.login()'
      };
      
      return routeMap[route] || `Routes.${route.toLowerCase()}()`;
    }
  },
  
  // OFFICIAL_ROUTES → Routes (RouterV2)  
  {
    from: /import\s+{\s*OFFICIAL_ROUTES[^}]*}\s+from\s+['"]@\/routesManifest['"];?/g,
    to: "import { Routes } from '@/routerV2';"
  },
  {
    from: /OFFICIAL_ROUTES\.([A-Z_]+)/g,
    to: (match, route) => {
      const routeMap = {
        'HOME': 'Routes.home()',
        'SCAN': 'Routes.scan()',
        'MUSIC': 'Routes.music()',
        'FLASH_GLOW': 'Routes.flashGlow()',
        'BOSS_LEVEL_GRIT': 'Routes.bossGrit()',
        'MOOD_MIXER': 'Routes.moodMixer()',
        'BOUNCE_BACK_BATTLE': 'Routes.bounceBack()',
        'BREATHWORK': 'Routes.breath()',
        'INSTANT_GLOW': 'Routes.flashGlow()'
      };
      
      return routeMap[route] || `Routes.${route.toLowerCase()}()`;
    }
  }
];

// Fichiers à migrer
const filesToMigrate = [
  'src/components/access/AccessDashboard.tsx',
  'src/components/admin/CompleteRouteAudit.tsx', 
  'src/components/admin/CompleteRoutesAuditInterface.tsx',
  'src/components/admin/OfficialRoutesStatus.tsx',
  'src/components/audit/PageAuditTool.tsx',
  'src/e2e/admin-dashboard.e2e.test.ts',
  'src/e2e/auth-flows.e2e.test.ts',
  'src/e2e/feature-navigation.e2e.test.ts'
];

let migratedCount = 0;
let errorCount = 0;

filesToMigrate.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Appliquer les remplacements
    replacements.forEach(({ from, to }) => {
      if (typeof to === 'function') {
        content = content.replace(from, to);
      } else {
        const newContent = content.replace(from, to);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
    });
    
    // Ajouter un commentaire de migration si modifié
    if (modified) {
      const header = `/**
 * Migré vers RouterV2 - TICKET: FE/BE-Router-Cleanup-01
 */

`;
      if (!content.includes('Migré vers RouterV2')) {
        content = header + content;
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Migré: ${filePath}`);
      migratedCount++;
    } else {
      console.log(`⚪ Aucun changement: ${filePath}`);
    }
    
  } catch (error) {
    console.log(`❌ Erreur avec ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Résultats de migration:`);
console.log(`   - ${migratedCount} fichiers migrés`);
console.log(`   - ${errorCount} erreurs`);
console.log(`   - ${filesToMigrate.length - migratedCount - errorCount} sans changement`);

if (migratedCount > 0) {
  console.log('\n✅ Migration terminée vers RouterV2 !');
} else {
  console.log('\n⚠️  Aucune migration nécessaire');
}