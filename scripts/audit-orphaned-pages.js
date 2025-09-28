#!/usr/bin/env node

/**
 * Audit des pages orphelines
 * Identifie les pages dans src/pages/ qui ne sont pas référencées dans RouterV2
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Fonction pour trouver récursivement tous les fichiers .tsx dans src/pages/
function findAllPageFiles(dir = 'src/pages') {
  let files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(findAllPageFiles(fullPath));
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Erreur lors de la lecture du dossier ${dir}:`, error.message);
  }
  
  return files;
}

// Fonction pour extraire les routes définies dans RouterV2
function getRouterV2Routes() {
  const routes = new Set();
  
  try {
    // Lire le fichier de registry RouterV2
    const registryPath = 'src/routerV2/registry.ts';
    if (fs.existsSync(registryPath)) {
      const content = fs.readFileSync(registryPath, 'utf8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        // Chercher les définitions de composants
        const match = line.match(/component:\s*['"`]([^'"`]+)['"`]/);
        if (match) {
          routes.add(match[1]);
        }
      }
    }
    
    // Aussi chercher dans les fichiers routes.ts
    const routesPath = 'src/routerV2/routes.ts';
    if (fs.existsSync(routesPath)) {
      const content = fs.readFileSync(routesPath, 'utf8');
      // Extraire les chemins depuis les fonctions
      const pathMatches = content.match(/return\s+['"`]([^'"`]+)['"`]/g);
      if (pathMatches) {
        pathMatches.forEach(match => {
          const path = match.match(/['"`]([^'"`]+)['"`]/)[1];
          routes.add(path);
        });
      }
    }
    
  } catch (error) {
    console.warn('Erreur lors de la lecture des routes RouterV2:', error.message);
  }
  
  return routes;
}

// Fonction pour analyser les imports et usages
function findPageUsages() {
  const usedPages = new Set();
  
  try {
    // Chercher les imports dans tous les fichiers TypeScript
    const result = execSync(`find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "from.*pages/" || true`, { encoding: 'utf8' });
    const files = result.split('\n').filter(Boolean);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const importMatches = content.match(/from\s+['"`]([^'"`]*pages\/[^'"`]*)['"`]/g);
        
        if (importMatches) {
          importMatches.forEach(match => {
            const importPath = match.match(/['"`]([^'"`]+)['"`]/)[1];
            usedPages.add(importPath);
          });
        }
      } catch (error) {
        // Ignorer les erreurs de lecture de fichier
      }
    }
  } catch (error) {
    console.warn('Erreur lors de la recherche des usages:', error.message);
  }
  
  return usedPages;
}

// Fonction pour analyser une page et déterminer si elle est potentiellement orpheline
function analyzePage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = filePath.replace('src/', '');
    
    // Informations sur la page
    const info = {
      path: filePath,
      relativePath,
      size: fs.statSync(filePath).size,
      hasExport: content.includes('export default') || content.includes('export '),
      hasReactComponent: content.includes('React.FC') || content.includes(': FC') || content.includes('function '),
      hasNavigate: content.includes('Navigate') || content.includes('useNavigate'),
      hasRouterLinks: content.includes('Link to=') || content.includes('to={'),
      isTestFile: filePath.includes('test') || filePath.includes('spec') || filePath.includes('__tests__'),
      isTypeFile: filePath.endsWith('.d.ts'),
      lastModified: fs.statSync(filePath).mtime,
    };
    
    // Score de confiance (plus élevé = plus susceptible d'être orpheline)
    let orphanScore = 0;
    
    if (!info.hasExport) orphanScore += 30;
    if (!info.hasReactComponent) orphanScore += 20;
    if (info.size < 500) orphanScore += 15; // Petits fichiers
    if (info.isTestFile) orphanScore -= 50; // Les tests sont normaux
    if (info.isTypeFile) orphanScore -= 50; // Les types sont normaux
    
    // Vérifier si le nom suggère une page obsolète
    const fileName = path.basename(filePath, path.extname(filePath));
    const obsoleteKeywords = ['old', 'deprecated', 'temp', 'tmp', 'backup', 'copy', 'test', 'draft'];
    if (obsoleteKeywords.some(keyword => fileName.toLowerCase().includes(keyword))) {
      orphanScore += 25;
    }
    
    return { ...info, orphanScore };
  } catch (error) {
    return { path: filePath, error: error.message, orphanScore: 100 };
  }
}

function main() {
  console.log('🔍 Audit des pages orphelines...\n');
  
  // 1. Trouver toutes les pages
  const allPages = findAllPageFiles();
  console.log(`📁 ${allPages.length} fichiers trouvés dans src/pages/\n`);
  
  // 2. Obtenir les routes RouterV2
  const routerV2Routes = getRouterV2Routes();
  console.log(`🛣️ ${routerV2Routes.size} routes référencées dans RouterV2\n`);
  
  // 3. Trouver les usages des pages
  const usedPages = findPageUsages();
  console.log(`🔗 ${usedPages.size} pages importées trouvées\n`);
  
  // 4. Analyser chaque page
  const analysis = allPages.map(analyzePage);
  
  // 5. Classer les pages
  const potentialOrphans = analysis.filter(page => page.orphanScore > 20);
  const definitiveOrphans = analysis.filter(page => page.orphanScore > 50);
  const testFiles = analysis.filter(page => page.isTestFile);
  
  // 6. Rapport
  console.log('📊 RÉSULTATS DE L\'AUDIT\n');
  console.log('========================\n');
  
  console.log(`📈 Statistiques générales:`);
  console.log(`   • Total des fichiers analysés: ${analysis.length}`);
  console.log(`   • Fichiers de test: ${testFiles.length}`);
  console.log(`   • Pages potentiellement orphelines: ${potentialOrphans.length}`);
  console.log(`   • Pages probablement orphelines: ${definitiveOrphans.length}\n`);
  
  if (definitiveOrphans.length > 0) {
    console.log('🗑️ PAGES PROBABLEMENT ORPHELINES (score > 50):\n');
    definitiveOrphans
      .sort((a, b) => b.orphanScore - a.orphanScore)
      .slice(0, 20) // Top 20
      .forEach(page => {
        console.log(`   Score ${page.orphanScore}: ${page.relativePath}`);
        if (page.error) console.log(`     ❌ Erreur: ${page.error}`);
        if (!page.hasExport) console.log(`     ⚠️ Pas d'export par défaut`);
        if (!page.hasReactComponent) console.log(`     ⚠️ Pas de composant React détecté`);
        if (page.size < 500) console.log(`     📏 Petit fichier (${page.size} bytes)`);
      });
    console.log();
  }
  
  if (potentialOrphans.length > definitiveOrphans.length) {
    console.log('⚠️ PAGES POTENTIELLEMENT ORPHELINES (score 20-50):\n');
    potentialOrphans
      .filter(page => page.orphanScore <= 50)
      .sort((a, b) => b.orphanScore - a.orphanScore)
      .slice(0, 15) // Top 15
      .forEach(page => {
        console.log(`   Score ${page.orphanScore}: ${page.relativePath}`);
      });
    console.log();
  }
  
  // 7. Recommandations
  console.log('💡 RECOMMANDATIONS:\n');
  console.log('1. Examiner manuellement les pages avec score > 50');
  console.log('2. Supprimer les pages confirmées comme orphelines');
  console.log('3. Ajouter les pages utiles à RouterV2');
  console.log('4. Nettoyer les dossiers de test obsolètes\n');
  
  // 8. Créer un script de nettoyage
  if (definitiveOrphans.length > 0) {
    const cleanupScript = definitiveOrphans
      .filter(page => page.orphanScore > 75) // Très haute confiance
      .map(page => `rm "${page.path}"`)
      .join('\n');
      
    if (cleanupScript) {
      fs.writeFileSync('scripts/cleanup-orphaned-pages.sh', '#!/bin/bash\n\n# Pages orphelines à supprimer (haute confiance)\n\n' + cleanupScript + '\n');
      console.log('📝 Script de nettoyage généré: scripts/cleanup-orphaned-pages.sh');
      console.log('   Examinez le script avant exécution!\n');
    }
  }
  
  console.log('✅ Audit terminé!');
}

if (require.main === module) {
  main();
}

module.exports = { findAllPageFiles, analyzePage };