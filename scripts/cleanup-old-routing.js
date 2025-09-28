#!/usr/bin/env node

/**
 * Script de nettoyage des anciens fichiers de routing
 * À exécuter APRÈS avoir migré vers RouterV2
 */

const fs = require('fs');
const path = require('path');

const OLD_ROUTING_FILES = [
  'src/router/routes',
  'src/router/AppRouter.tsx',
  'src/router/AppRoutes.tsx', 
  'src/router/buildUnifiedRoutes.tsx',
  'src/router/index.tsx'
];

const BACKUP_DIR = 'backup/old-routing';

function createBackup() {
  console.log('📦 Création du backup...');
  
  if (!fs.existsSync('backup')) {
    fs.mkdirSync('backup');
  }
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  OLD_ROUTING_FILES.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const fileName = path.basename(filePath);
      const backupPath = path.join(BACKUP_DIR, fileName);
      
      if (fs.statSync(filePath).isDirectory()) {
        // Copie récursive pour les dossiers
        fs.cpSync(filePath, backupPath, { recursive: true });
      } else {
        fs.copyFileSync(filePath, backupPath);
      }
      
      console.log(`✅ ${filePath} → ${backupPath}`);
    }
  });
}

function removeOldFiles() {
  console.log('\n🗑️  Suppression des anciens fichiers...');
  
  OLD_ROUTING_FILES.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      if (fs.statSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
      console.log(`🗑️  ${filePath} supprimé`);
    }
  });
}

function auditOrphanedPages() {
  console.log('\n🔍 Audit des pages orphelines...');
  
  const pagesDir = 'src/pages';
  const allPages = [];
  
  function scanPages(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        scanPages(fullPath);
      } else if (item.endsWith('.tsx')) {
        allPages.push(fullPath);
      }
    });
  }
  
  scanPages(pagesDir);
  
  // Lire RouterV2 pour voir les pages utilisées
  const routerV2Content = fs.readFileSync('src/routerV2/index.tsx', 'utf8');
  const usedPages = [];
  
  allPages.forEach(page => {
    const pageName = path.basename(page, '.tsx');
    if (routerV2Content.includes(pageName)) {
      usedPages.push(page);
    }
  });
  
  const orphanedPages = allPages.filter(page => !usedPages.includes(page));
  
  console.log(`📊 Pages totales: ${allPages.length}`);
  console.log(`✅ Pages utilisées: ${usedPages.length}`);
  console.log(`🚫 Pages orphelines: ${orphanedPages.length}`);
  
  if (orphanedPages.length > 0) {
    console.log('\n📝 Pages potentiellement orphelines:');
    orphanedPages.slice(0, 20).forEach(page => {
      console.log(`   ${page}`);
    });
    if (orphanedPages.length > 20) {
      console.log(`   ... et ${orphanedPages.length - 20} autres`);
    }
  }
  
  return { total: allPages.length, used: usedPages.length, orphaned: orphanedPages.length };
}

function main() {
  console.log('🧹 Nettoyage de l\'ancien système de routing...\n');
  
  // Vérifier que RouterV2 existe
  if (!fs.existsSync('src/routerV2/index.tsx')) {
    console.error('❌ RouterV2 non trouvé. Assurez-vous que la migration est terminée.');
    process.exit(1);
  }
  
  createBackup();
  removeOldFiles();
  const stats = auditOrphanedPages();
  
  console.log('\n✨ Nettoyage terminé!');
  console.log('\n📋 Résumé:');
  console.log(`• Anciens fichiers de routing: sauvegardés et supprimés`);
  console.log(`• Pages orphelines détectées: ${stats.orphaned}`);
  console.log(`• Taux d'utilisation des pages: ${Math.round((stats.used / stats.total) * 100)}%`);
  
  console.log('\n🎯 Prochaines étapes:');
  console.log('1. Vérifier que l\'app fonctionne toujours');
  console.log('2. Examiner les pages orphelines');
  console.log('3. Nettoyer les pages non utilisées');
  console.log('4. Activer RouterV2 par défaut');
}

if (require.main === module) {
  main();
}

module.exports = { auditOrphanedPages };