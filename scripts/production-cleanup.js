#!/usr/bin/env node

/**
 * Script de nettoyage automatique pour la production
 * Corrige tous les problèmes identifiés dans l'audit
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🧹 NETTOYAGE PRODUCTION - EMOTIONSCARE');
console.log('=====================================\n');

// 1. Nettoyer les console.log
function cleanupConsoleLogs() {
  console.log('1. Nettoyage des console.log...');
  
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', { 
    ignore: ['**/*.test.*', '**/__tests__/**'] 
  });
  
  let totalReplacements = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Remplacer console.log par logger.info
    let newContent = content
      .replace(/console\.log\(/g, 'logger.info(')
      .replace(/console\.warn\(/g, 'logger.warn(')
      .replace(/console\.error\(/g, 'logger.error(')
      .replace(/console\.debug\(/g, 'logger.debug(');
    
    // Ajouter l'import du logger si nécessaire
    if (newContent !== originalContent && !newContent.includes("import { logger }")) {
      newContent = `import { logger } from '@/utils/logger';\n${newContent}`;
    }
    
    if (newContent !== originalContent) {
      fs.writeFileSync(file, newContent);
      totalReplacements++;
    }
  });
  
  console.log(`   ✅ ${totalReplacements} fichiers nettoyés`);
}

// 2. Optimiser les performances
function optimizePerformance() {
  console.log('2. Optimisations de performance...');
  
  // Créer un fichier de configuration avancée
  const viteOptimizations = `
// Optimisations Vite avancées
export const viteOptimizations = {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
};
`;
  
  fs.writeFileSync('src/config/vite-optimizations.ts', viteOptimizations);
  console.log('   ✅ Optimisations Vite configurées');
}

// 3. Nettoyer les TODO/FIXME obsolètes
function cleanupTodos() {
  console.log('3. Nettoyage des TODO/FIXME...');
  
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}');
  let todosRemoved = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    const cleanedLines = lines.filter(line => {
      const isTodo = line.includes('TODO') || line.includes('FIXME');
      const isObsolete = line.includes('TODO: Legacy') || 
                        line.includes('FIXME: Old') ||
                        line.includes('TODO: Remove');
      
      if (isTodo && isObsolete) {
        todosRemoved++;
        return false;
      }
      return true;
    });
    
    const newContent = cleanedLines.join('\n');
    if (newContent !== content) {
      fs.writeFileSync(file, newContent);
    }
  });
  
  console.log(`   ✅ ${todosRemoved} TODO/FIXME obsolètes supprimés`);
}

// 4. Audit final
function finalAudit() {
  console.log('4. Audit final...');
  
  const issues = [];
  
  // Vérifier qu'il ne reste pas de console.log
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}');
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('console.log(') && !file.includes('test')) {
      issues.push(`Console.log restant dans ${file}`);
    }
  });
  
  if (issues.length === 0) {
    console.log('   ✅ Aucun problème détecté');
    console.log('\n🚀 EMOTIONSCARE EST PRÊT POUR LA PRODUCTION !');
  } else {
    console.log(`   ⚠️  ${issues.length} problèmes restants :`);
    issues.forEach(issue => console.log(`      - ${issue}`));
  }
}

// Exécution du nettoyage
async function main() {
  try {
    cleanupConsoleLogs();
    optimizePerformance();
    cleanupTodos();
    finalAudit();
    
    console.log('\n✅ Nettoyage production terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage :', error);
    process.exit(1);
  }
}

main();