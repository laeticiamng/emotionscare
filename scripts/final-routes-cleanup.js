#!/usr/bin/env node

/**
 * Script de nettoyage final du système de routes
 * Migre tous les usages de Routes. vers routes. et supprime l'ancien système
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Nettoyage final du système de routes...\n');

// Mapping complet ancien -> nouveau système
const ROUTE_MAPPINGS = {
  // Routes publiques
  'Routes.home()': 'routes.public.home()',
  'Routes.about()': 'routes.public.about()',
  'Routes.contact()': 'routes.public.contact()',
  'Routes.help()': 'routes.public.help()',
  'Routes.privacy()': 'routes.public.privacy()',
  'Routes.terms()': 'routes.public.terms()',
  
  // Routes commerciales
  'Routes.b2c()': 'routes.b2c.home()',
  'Routes.enterprise()': 'routes.b2b.home()',
  
  // Routes auth
  'Routes.login()': 'routes.auth.login()',
  'Routes.signup()': 'routes.auth.signup()',
  'Routes.login({ segment: \'b2c\' })': 'routes.auth.b2cLogin()',
  'Routes.signup({ segment: \'b2c\' })': 'routes.auth.b2cRegister()',
  'Routes.login({ segment: \'b2b\' })': 'routes.auth.b2bUserLogin()',
  'Routes.signup({ segment: \'b2b\' })': 'routes.auth.b2bAdminLogin()',
  
  // Routes B2C principales
  'Routes.consumerHome()': 'routes.b2c.dashboard()',
  'Routes.scan()': 'routes.b2c.scan()',
  'Routes.music()': 'routes.b2c.music()',
  'Routes.coach()': 'routes.b2c.coach()',
  'Routes.journal()': 'routes.b2c.journal()',
  'Routes.vr()': 'routes.b2c.vr()',
  'Routes.emotions()': 'routes.b2c.emotions()',
  'Routes.community()': 'routes.b2c.community()',
  'Routes.settingsGeneral()': 'routes.b2c.settings()',
  'Routes.settings()': 'routes.b2c.settings()',
  'Routes.profile()': 'routes.b2c.profile()',
  
  // Routes B2C fun-first
  'Routes.flashGlow()': 'routes.b2c.flashGlow()',
  'Routes.breath()': 'routes.b2c.breathwork()',
  'Routes.breathwork()': 'routes.b2c.breathwork()',
  'Routes.vrBreath()': 'routes.b2c.breathwork()',
  'Routes.activity()': 'routes.b2c.activity()',
  'Routes.gamification()': 'routes.b2c.bubbleBeat()',
  'Routes.leaderboard()': 'routes.b2c.bossLevel()',
  'Routes.socialCocon()': 'routes.b2c.community()',
  'Routes.socialCoconB2C()': 'routes.b2c.community()',
  
  // Routes B2B
  'Routes.employeeHome()': 'routes.b2b.user.dashboard()',
  'Routes.managerHome()': 'routes.b2b.admin.dashboard()',
  'Routes.teams()': 'routes.b2b.teams()',
  'Routes.adminReports()': 'routes.b2b.reports()',
  'Routes.adminEvents()': 'routes.b2b.events()',
  'Routes.adminOptimization()': 'routes.b2b.admin.analytics()',
  'Routes.adminSettings()': 'routes.b2b.admin.settings()',
  
  // Routes système  
  'Routes.error.unauthorized()': 'routes.special.unauthorized()',
  'Routes.error.forbidden()': 'routes.special.forbidden()',
  'Routes.error.notFound()': 'routes.special.notFound()',
  'Routes.error.serverError()': 'routes.special.serverError()',
  
  // Routes nested (compatibilité)
  'Routes.app.home()': 'routes.b2c.dashboard()',
  'Routes.app.scan()': 'routes.b2c.scan()',
  'Routes.app.music()': 'routes.b2c.music()',
  'Routes.app.coach()': 'routes.b2c.coach()',
  'Routes.app.journal()': 'routes.b2c.journal()',
  'Routes.business.dashboard()': 'routes.b2b.user.dashboard()',
  'Routes.business.admin()': 'routes.b2b.admin.dashboard()',
};

// Transformations d'imports
const IMPORT_TRANSFORMATIONS = [
  {
    from: /import\s*{\s*Routes\s*}\s*from\s*['"]@\/routerV2['"]/g,
    to: "import { routes } from '@/routerV2'"
  },
  {
    from: /import\s*{\s*Routes\s*}\s*from\s*['"]@\/routerV2\/helpers['"]/g,
    to: "import { routes } from '@/routerV2'"
  }
];

function findAllFiles() {
  console.log('📂 Recherche des fichiers à migrer...');
  try {
    const result = execSync('find src -type f -name "*.ts" -o -name "*.tsx" | grep -E "\\.(ts|tsx)$"', { encoding: 'utf8' });
    return result.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error.message);
    return [];
  }
}

function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    const originalContent = content;

    // 1. Transformer les imports
    IMPORT_TRANSFORMATIONS.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        hasChanges = true;
      }
    });

    // 2. Transformer les appels de routes
    Object.entries(ROUTE_MAPPINGS).forEach(([oldRoute, newRoute]) => {
      const regex = new RegExp(oldRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (regex.test(content)) {
        content = content.replace(regex, newRoute);
        hasChanges = true;
      }
    });

    // 3. Patterns génériques pour Routes. non mappés
    const genericPatterns = [
      {
        from: /Routes\.(\w+)\(\)/g,
        to: (match, route) => {
          // Essayer de deviner la catégorie
          const publicRoutes = ['home', 'about', 'contact', 'help', 'privacy', 'terms'];
          const authRoutes = ['login', 'signup'];
          const b2cRoutes = ['scan', 'music', 'coach', 'journal', 'dashboard', 'settings', 'profile'];
          
          if (publicRoutes.includes(route)) return `routes.public.${route}()`;
          if (authRoutes.includes(route)) return `routes.auth.${route}()`;
          if (b2cRoutes.includes(route)) return `routes.b2c.${route}()`;
          
          return match; // Garder l'original si pas trouvé
        }
      }
    ];

    genericPatterns.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });

    // Écrire le fichier si des changements ont été faits
    if (hasChanges && content !== originalContent) {
      // Ajouter header de migration si pas déjà présent
      if (!content.includes('RouterV2 Migration')) {
        const migrationComment = `/**\n * RouterV2 Migration: Routes -> routes (système unifié)\n */\n\n`;
        content = migrationComment + content;
      }
      
      fs.writeFileSync(filePath, content);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur migration ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  const files = findAllFiles();
  console.log(`📊 ${files.length} fichiers TypeScript trouvés\n`);
  
  let migratedCount = 0;
  let errorCount = 0;
  
  files.forEach(filePath => {
    // Ignorer les fichiers de définition et node_modules
    if (filePath.includes('node_modules') || 
        filePath.includes('.d.ts') || 
        filePath.includes('helpers.ts')) {
      return;
    }
    
    const success = migrateFile(filePath);
    if (success) {
      console.log(`✅ Migré: ${filePath}`);
      migratedCount++;
    }
  });
  
  console.log(`\n📈 Résumé de la migration:`);
  console.log(`   - Fichiers migrés: ${migratedCount}`);
  console.log(`   - Erreurs: ${errorCount}`);
  
  if (migratedCount > 0) {
    console.log('\n🎉 Migration terminée avec succès !');
    console.log('📝 Prochaine étape: suppression de src/routerV2/helpers.ts');
  } else {
    console.log('\n✨ Aucune migration nécessaire - système déjà unifié !');
  }
}

if (require.main === module) {
  main();
}

module.exports = { migrateFile, ROUTE_MAPPINGS };