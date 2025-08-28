#!/usr/bin/env node

/**
 * Script de migration automatique vers RouterV2
 * Remplace les anciens liens par les nouveaux helpers RouterV2
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mapping des anciens chemins vers RouterV2
const ROUTE_MAPPINGS = {
  // Public routes
  '/': 'routes.public.home()',
  '/about': 'routes.public.about()',
  '/contact': 'routes.public.contact()',
  '/privacy': 'routes.public.privacy()',
  '/terms': 'routes.public.terms()',
  '/legal': 'routes.public.legal()',
  '/cookies': 'routes.public.cookies()',
  
  // Auth routes
  '/login': 'routes.auth.login()',
  '/signup': 'routes.auth.signup()',
  '/b2c/login': 'routes.auth.b2cLogin()',
  '/b2c/register': 'routes.auth.b2cRegister()',
  '/b2b/user/login': 'routes.auth.b2bUserLogin()',
  '/b2b/admin/login': 'routes.auth.b2bAdminLogin()',
  
  // B2C routes
  '/dashboard': 'routes.b2c.dashboard()',
  '/scan': 'routes.b2c.scan()',
  '/music': 'routes.b2c.music()',
  '/journal': 'routes.b2c.journal()',
  '/meditation': 'routes.b2c.meditation()',
  '/vr': 'routes.b2c.vr()',
  '/profile': 'routes.b2c.profile()',
  
  // B2B routes
  '/b2b/admin/dashboard': 'routes.b2b.admin.dashboard()',
  '/b2b/user/dashboard': 'routes.b2b.user.dashboard()',
  '/teams': 'routes.b2b.teams()',
  '/reports': 'routes.b2b.reports()',
  
  // Special routes
  '/choose-mode': 'routes.special.chooseMode()',
  '/unauthorized': 'routes.special.unauthorized()',
  '/forbidden': 'routes.special.forbidden()',
  '/404': 'routes.special.notFound()',
};

function findFilesToMigrate() {
  try {
    // Trouve tous les fichiers contenant des liens
    const result = execSync(`find src -name "*.tsx" -o -name "*.ts" | xargs grep -l 'to="/' || true`, { encoding: 'utf8' });
    return result.split('\n').filter(Boolean);
  } catch (error) {
    console.warn('Erreur lors de la recherche des fichiers:', error.message);
    return [];
  }
}

function migrateFile(filePath) {
  console.log(`Migration de ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  let needsRouterImport = false;

  // Remplace les liens
  Object.entries(ROUTE_MAPPINGS).forEach(([oldPath, newPath]) => {
    const oldPattern1 = `to="${oldPath}"`;
    const oldPattern2 = `href="${oldPath}"`;
    
    if (content.includes(oldPattern1)) {
      content = content.replace(new RegExp(`to="${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'), `to={${newPath}}`);
      hasChanges = true;
      needsRouterImport = true;
    }
    
    if (content.includes(oldPattern2)) {
      // Pour href, on utilise Link de React Router au lieu de <a>
      content = content.replace(new RegExp(`href="${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'), `to={${newPath}}`);
      hasChanges = true;
      needsRouterImport = true;
    }
  });

  // Ajoute l'import RouterV2 si nécessaire
  if (needsRouterImport && !content.includes('import { routes }')) {
    // Trouve la ligne d'import React Router ou ajoute après les imports React
    const importLines = content.split('\n');
    let insertIndex = -1;
    
    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].includes('from \'react-router-dom\'')) {
        insertIndex = i + 1;
        break;
      } else if (importLines[i].includes('from \'react\'') && insertIndex === -1) {
        insertIndex = i + 1;
      }
    }
    
    if (insertIndex > -1) {
      importLines.splice(insertIndex, 0, 'import { routes } from \'@/routerV2\';');
      content = importLines.join('\n');
      hasChanges = true;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath} migré`);
    return true;
  }
  
  return false;
}

function main() {
  console.log('🚀 Migration vers RouterV2...\n');
  
  const files = findFilesToMigrate();
  console.log(`📁 ${files.length} fichiers trouvés\n`);
  
  let migratedCount = 0;
  
  files.forEach(file => {
    try {
      if (migrateFile(file)) {
        migratedCount++;
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la migration de ${file}:`, error.message);
    }
  });
  
  console.log(`\n✨ Migration terminée: ${migratedCount}/${files.length} fichiers migrés`);
  console.log('\n📋 Prochaines étapes:');
  console.log('1. Vérifier les fichiers migrés');
  console.log('2. Tester le build: npm run build');
  console.log('3. Activer RouterV2: VITE_USE_ROUTER_V2=true');
  console.log('4. Supprimer les anciens fichiers de routing');
}

if (require.main === module) {
  main();
}

module.exports = { migrateFile, ROUTE_MAPPINGS };