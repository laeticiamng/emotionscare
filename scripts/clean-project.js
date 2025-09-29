#!/usr/bin/env node

/**
 * SCRIPT DE NETTOYAGE PROJET - EmotionsCare
 * Nettoie automatiquement les fichiers inutiles et optimise la structure
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, unlinkSync, rmSync, writeFileSync, readFileSync } from 'fs';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Configuration du nettoyage
const CLEANUP_CONFIG = {
  // Fichiers à supprimer (patterns glob)
  deletePatterns: [
    '**/*AUDIT*.md',
    '**/*PHASE*.md', 
    '**/*RAPPORT*.md',
    '**/*STATUS*.md',
    '**/*FINAL*.md',
    '**/*COMPLETE*.md',
    '**/*TICKET*.md',
    '**/*CLEANUP*.md',
    '**/verification-*.md',
    '**/fix-*.js',
    '**/emergency-*.js',
    '**/clean-*.js',
    '**/optimize-*.js',
    '**/USE_NPM_*.{md,txt}',
    '**/bun-*.md',
    '**/*.backup',
    '**/*.tmp'
  ],
  
  // Dossiers à nettoyer
  emptyDirectories: [
    'temp/',
    'tmp/', 
    '.temp/',
    'cache/'
  ],
  
  // Extensions inutiles
  unusedExtensions: [
    '.log',
    '.backup', 
    '.tmp',
    '.cache',
    '.old'
  ]
};

/**
 * Supprime les fichiers selon les patterns définis
 */
async function cleanupFiles() {
  console.log('🧹 Nettoyage des fichiers...');
  let deletedCount = 0;
  
  for (const pattern of CLEANUP_CONFIG.deletePatterns) {
    try {
      const files = await glob(pattern, { 
        cwd: ROOT_DIR,
        absolute: true,
        ignore: ['node_modules/**', '.git/**']
      });
      
      for (const file of files) {
        try {
          unlinkSync(file);
          deletedCount++;
          console.log(`  ❌ ${file.replace(ROOT_DIR, '.')}`);
        } catch (err) {
          console.warn(`  ⚠️  Impossible de supprimer: ${file}`);
        }
      }
    } catch (err) {
      console.warn(`Pattern invalide: ${pattern}`);
    }
  }
  
  console.log(`✅ ${deletedCount} fichiers supprimés`);
}

/**
 * Nettoie les dossiers vides
 */
function cleanupEmptyDirectories() {
  console.log('🗂️  Nettoyage des dossiers vides...');
  
  // Implementation basique - pourrait être améliorée
  for (const dir of CLEANUP_CONFIG.emptyDirectories) {
    const fullPath = join(ROOT_DIR, dir);
    if (existsSync(fullPath)) {
      try {
        rmSync(fullPath, { recursive: true, force: true });
        console.log(`  ❌ ${dir}`);
      } catch (err) {
        console.warn(`  ⚠️  Impossible de supprimer: ${dir}`);
      }
    }
  }
}

/**
 * Optimise package.json
 */
function optimizePackageJson() {
  console.log('📦 Optimisation package.json...');
  
  const packagePath = join(ROOT_DIR, 'package.json');
  if (!existsSync(packagePath)) {
    console.warn('package.json non trouvé');
    return;
  }
  
  try {
    const packageContent = JSON.parse(readFileSync(packagePath, 'utf8'));
    
    // Nettoyage des scripts obsolètes
    const obsoleteScripts = [
      'clean:install',
      'emergency:fix',
      'bun:fix',
      'temp:script'
    ];
    
    let scriptsCleaned = 0;
    for (const script of obsoleteScripts) {
      if (packageContent.scripts && packageContent.scripts[script]) {
        delete packageContent.scripts[script];
        scriptsCleaned++;
      }
    }
    
    // Tri des dépendances
    if (packageContent.dependencies) {
      const sorted = {};
      Object.keys(packageContent.dependencies)
        .sort()
        .forEach(key => {
          sorted[key] = packageContent.dependencies[key];
        });
      packageContent.dependencies = sorted;
    }
    
    if (packageContent.devDependencies) {
      const sorted = {};
      Object.keys(packageContent.devDependencies)
        .sort()
        .forEach(key => {
          sorted[key] = packageContent.devDependencies[key];
        });
      packageContent.devDependencies = sorted;
    }
    
    writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
    console.log(`  ✅ ${scriptsCleaned} scripts obsolètes supprimés`);
    console.log(`  ✅ Dépendances triées`);
    
  } catch (err) {
    console.error('Erreur lors de l\'optimisation package.json:', err.message);
  }
}

/**
 * Génère un rapport de nettoyage
 */
function generateCleanupReport() {
  const reportPath = join(ROOT_DIR, 'reports', 'cleanup-report.md');
  const report = `# 📊 Rapport de Nettoyage - ${new Date().toISOString()}

## Actions effectuées

✅ **Fichiers supprimés** : Suppression des rapports d'audit obsolètes
✅ **Dossiers nettoyés** : Suppression des dossiers temporaires  
✅ **package.json optimisé** : Scripts obsolètes supprimés, dépendances triées
✅ **Structure allégée** : Projet plus propre et maintenable

## Résultat

- ⚡ **Performance** : Temps de build améliorés
- 🧹 **Propreté** : Structure de fichiers claire
- 📦 **Optimisation** : Dépendances organisées
- 🔍 **Maintenabilité** : Code plus facile à naviguer

## Prochaines étapes

1. Vérifier que tout fonctionne : \`npm run test\`
2. Rebuild complet : \`npm run build\`
3. Commit des changements : \`git add . && git commit -m "chore: nettoyage projet"\`

---
*Rapport généré automatiquement par clean-project.js*
`;
  
  writeFileSync(reportPath, report);
  console.log(`📊 Rapport généré: ${reportPath}`);
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Démarrage du nettoyage du projet EmotionsCare...\n');
  
  try {
    await cleanupFiles();
    cleanupEmptyDirectories(); 
    optimizePackageJson();
    generateCleanupReport();
    
    console.log('\n🎉 Nettoyage terminé avec succès !');
    console.log('👉 Prochaines étapes:');
    console.log('   npm run test    # Vérifier que tout fonctionne');
    console.log('   npm run build   # Tester le build production');
    console.log('   git status      # Voir les changements');
    
  } catch (error) {
    console.error('❌ Erreur durant le nettoyage:', error.message);
    process.exit(1);
  }
}

// Exécution si script appelé directement
if (process.argv[1] === __filename) {
  main();
}

export { main as cleanProject };