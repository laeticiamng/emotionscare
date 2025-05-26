
#!/usr/bin/env node

/**
 * Audit complet de l'accessibilité des pages et composants
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Audit d\'accessibilité - Pages et composants...');

// Fonction pour analyser récursivement les fichiers
function analyzeDirectory(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const results = [];
  
  function scanDir(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDir(fullPath);
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          results.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Impossible de lire le dossier: ${currentDir}`);
    }
  }
  
  scanDir(dir);
  return results;
}

// Analyser les routes définies
function analyzeRoutes() {
  const routes = [];
  const routeFiles = [
    'src/router.tsx',
    'src/router/index.tsx',
    'src/AppRouter.tsx',
    'src/App.tsx'
  ];
  
  for (const file of routeFiles) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Extraire les routes avec regex
        const pathMatches = content.match(/path=['"`]([^'"`]+)['"`]/g);
        if (pathMatches) {
          pathMatches.forEach(match => {
            const path = match.match(/path=['"`]([^'"`]+)['"`]/)[1];
            routes.push({
              path,
              file,
              defined: true
            });
          });
        }
      } catch (error) {
        console.warn(`Erreur lors de l'analyse de ${file}:`, error.message);
      }
    }
  }
  
  return routes;
}

// Analyser les pages dans src/pages
function analyzePages() {
  const pages = [];
  const pagesDir = 'src/pages';
  
  if (fs.existsSync(pagesDir)) {
    const pageFiles = analyzeDirectory(pagesDir);
    
    pageFiles.forEach(file => {
      const relativePath = path.relative('src/pages', file);
      const pageName = relativePath.replace(/\.(tsx|ts|jsx|js)$/, '');
      
      pages.push({
        file,
        pageName,
        relativePath
      });
    });
  }
  
  return pages;
}

// Analyser les composants
function analyzeComponents() {
  const components = [];
  const componentsDir = 'src/components';
  
  if (fs.existsSync(componentsDir)) {
    const componentFiles = analyzeDirectory(componentsDir);
    
    componentFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const isExported = content.includes('export') && (
          content.includes('export default') || 
          content.includes('export const') ||
          content.includes('export function')
        );
        
        components.push({
          file,
          isExported,
          hasJSX: content.includes('jsx') || content.includes('<') || content.includes('React')
        });
      } catch (error) {
        components.push({
          file,
          isExported: false,
          hasJSX: false,
          error: error.message
        });
      }
    });
  }
  
  return components;
}

// Analyser les liens de navigation
function analyzeNavigation() {
  const navFiles = analyzeDirectory('src/components/navigation');
  const links = [];
  
  navFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Chercher les liens avec to, href, navigate
      const linkMatches = content.match(/(to|href|navigate\()=['"`]([^'"`]+)['"`]/g);
      if (linkMatches) {
        linkMatches.forEach(match => {
          const link = match.match(/(to|href|navigate\()=['"`]([^'"`]+)['"`]/)[2];
          links.push({
            link,
            file,
            context: match
          });
        });
      }
    } catch (error) {
      console.warn(`Erreur navigation ${file}:`, error.message);
    }
  });
  
  return links;
}

// Exécuter l'audit
async function runAudit() {
  const results = {
    timestamp: new Date().toISOString(),
    routes: analyzeRoutes(),
    pages: analyzePages(),
    components: analyzeComponents(),
    navigation: analyzeNavigation(),
    analysis: {}
  };
  
  // Analyser les problèmes
  const definedPaths = results.routes.map(r => r.path);
  const navigationLinks = results.navigation.map(n => n.link);
  
  results.analysis = {
    orphanedPages: results.pages.filter(page => 
      !definedPaths.some(path => path.includes(page.pageName))
    ),
    unreachableRoutes: results.routes.filter(route =>
      !navigationLinks.some(link => link === route.path)
    ),
    brokenLinks: navigationLinks.filter(link =>
      !definedPaths.includes(link) && !link.startsWith('http') && !link.startsWith('#')
    ),
    unusedComponents: results.components.filter(comp =>
      comp.isExported && comp.hasJSX && !comp.file.includes('test') && !comp.file.includes('story')
    )
  };
  
  // Sauvegarder le rapport
  if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports');
  }
  
  fs.writeFileSync(
    'reports/accessibility-audit.json',
    JSON.stringify(results, null, 2)
  );
  
  // Afficher le résumé
  console.log('\n📊 Résultats de l\'audit d\'accessibilité:');
  console.log(`✅ Routes définies: ${results.routes.length}`);
  console.log(`📄 Pages trouvées: ${results.pages.length}`);
  console.log(`🧩 Composants trouvés: ${results.components.length}`);
  console.log(`🔗 Liens de navigation: ${results.navigation.length}`);
  
  console.log('\n⚠️ Problèmes identifiés:');
  console.log(`🔸 Pages orphelines: ${results.analysis.orphanedPages.length}`);
  console.log(`🔸 Routes inaccessibles: ${results.analysis.unreachableRoutes.length}`);
  console.log(`🔸 Liens cassés: ${results.analysis.brokenLinks.length}`);
  console.log(`🔸 Composants potentiellement inutilisés: ${results.analysis.unusedComponents.length}`);
  
  console.log('\n📄 Rapport détaillé sauvegardé: reports/accessibility-audit.json');
  
  return results;
}

if (require.main === module) {
  runAudit().catch(console.error);
}

module.exports = { runAudit };
