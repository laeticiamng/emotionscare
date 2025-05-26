
#!/usr/bin/env node

/**
 * Audit spécifique des routes et de leur accessibilité
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Audit des routes et accessibilité...');

// Analyser les types de navigation
function analyzeNavigationTypes() {
  const navTypes = {
    routes: [],
    protectedRoutes: [],
    publicRoutes: [],
    redirects: []
  };
  
  try {
    // Analyser src/types/navigation.ts
    if (fs.existsSync('src/types/navigation.ts')) {
      const content = fs.readFileSync('src/types/navigation.ts', 'utf8');
      
      // Extraire les routes définies
      const routeMatches = content.match(/'([^']+)':\s*'([^']+)'/g);
      if (routeMatches) {
        routeMatches.forEach(match => {
          const [, key, path] = match.match(/'([^']+)':\s*'([^']+)'/);
          navTypes.routes.push({ key, path, source: 'navigation.ts' });
        });
      }
    }
    
    // Analyser src/utils/routeUtils.ts
    if (fs.existsSync('src/utils/routeUtils.ts')) {
      const content = fs.readFileSync('src/utils/routeUtils.ts', 'utf8');
      
      const routeMatches = content.match(/([A-Z_]+):\s*'([^']+)'/g);
      if (routeMatches) {
        routeMatches.forEach(match => {
          const [, key, path] = match.match(/([A-Z_]+):\s*'([^']+)'/);
          navTypes.routes.push({ key, path, source: 'routeUtils.ts' });
        });
      }
    }
  } catch (error) {
    console.warn('Erreur analyse types navigation:', error.message);
  }
  
  return navTypes;
}

// Analyser les composants de route protégée
function analyzeProtectedRoutes() {
  const protectedRoutes = [];
  
  try {
    const routerFiles = [
      'src/router.tsx',
      'src/router/index.tsx',
      'src/AppRouter.tsx'
    ];
    
    routerFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Chercher ProtectedRoute
        const protectedMatches = content.match(/<ProtectedRoute[^>]*>/g);
        if (protectedMatches) {
          protectedMatches.forEach(match => {
            const pathMatch = content.match(new RegExp(`${match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^<]*path=['"\`]([^'"\`]+)['"\`]`));
            if (pathMatch) {
              protectedRoutes.push({
                path: pathMatch[1],
                component: match,
                file
              });
            }
          });
        }
      }
    });
  } catch (error) {
    console.warn('Erreur analyse routes protégées:', error.message);
  }
  
  return protectedRoutes;
}

// Analyser les redirections
function analyzeRedirects() {
  const redirects = [];
  
  try {
    const files = [
      'src/components/auth/AuthFlow.tsx',
      'src/components/auth/AuthTransition.tsx',
      'src/utils/routeUtils.ts'
    ];
    
    files.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Chercher Navigate et redirections
        const navigateMatches = content.match(/<Navigate[^>]*to=['"]([^'"]+)['"]/g);
        if (navigateMatches) {
          navigateMatches.forEach(match => {
            const path = match.match(/to=['"]([^'"]+)['"]/)[1];
            redirects.push({
              from: 'auto-redirect',
              to: path,
              file,
              context: match
            });
          });
        }
        
        // Chercher navigate() calls
        const functionNavigates = content.match(/navigate\(['"]([^'"]+)['"]\)/g);
        if (functionNavigates) {
          functionNavigates.forEach(match => {
            const path = match.match(/navigate\(['"]([^'"]+)['"]\)/)[1];
            redirects.push({
              from: 'function-call',
              to: path,
              file,
              context: match
            });
          });
        }
      }
    });
  } catch (error) {
    console.warn('Erreur analyse redirections:', error.message);
  }
  
  return redirects;
}

// Analyser l'accessibilité depuis l'UI
function analyzeUIAccessibility() {
  const uiAccess = {
    buttons: [],
    links: [],
    menus: []
  };
  
  try {
    // Analyser les composants de navigation
    const navDirs = [
      'src/components/navigation',
      'src/components/layout',
      'src/components/ui/sidebar'
    ];
    
    navDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir)
          .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
          .map(f => path.join(dir, f));
        
        files.forEach(file => {
          try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Chercher les boutons avec navigation
            const buttonMatches = content.match(/<Button[^>]*onClick[^>]*>/g);
            if (buttonMatches) {
              buttonMatches.forEach(match => {
                uiAccess.buttons.push({
                  component: match,
                  file,
                  type: 'button'
                });
              });
            }
            
            // Chercher les liens
            const linkMatches = content.match(/<Link[^>]*to=['"]([^'"]+)['"]/g);
            if (linkMatches) {
              linkMatches.forEach(match => {
                const path = match.match(/to=['"]([^'"]+)['"]/)[1];
                uiAccess.links.push({
                  path,
                  component: match,
                  file,
                  type: 'link'
                });
              });
            }
          } catch (error) {
            console.warn(`Erreur lecture ${file}:`, error.message);
          }
        });
      }
    });
  } catch (error) {
    console.warn('Erreur analyse UI accessibility:', error.message);
  }
  
  return uiAccess;
}

// Exécuter l'audit des routes
async function runRoutesAudit() {
  const results = {
    timestamp: new Date().toISOString(),
    navigationTypes: analyzeNavigationTypes(),
    protectedRoutes: analyzeProtectedRoutes(),
    redirects: analyzeRedirects(),
    uiAccessibility: analyzeUIAccessibility(),
    analysis: {}
  };
  
  // Analyser les problèmes d'accessibilité
  const allDefinedPaths = results.navigationTypes.routes.map(r => r.path);
  const accessiblePaths = results.uiAccessibility.links.map(l => l.path);
  const protectedPaths = results.protectedRoutes.map(r => r.path);
  
  results.analysis = {
    inaccessibleRoutes: allDefinedPaths.filter(path =>
      !accessiblePaths.includes(path) && 
      !results.redirects.some(r => r.to === path)
    ),
    orphanedProtectedRoutes: protectedPaths.filter(path =>
      !accessiblePaths.includes(path)
    ),
    deadEndRedirects: results.redirects.filter(redirect =>
      !allDefinedPaths.includes(redirect.to)
    ),
    unprotectedSensitiveRoutes: allDefinedPaths.filter(path =>
      (path.includes('admin') || path.includes('dashboard')) &&
      !protectedPaths.includes(path)
    )
  };
  
  // Sauvegarder le rapport
  if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports');
  }
  
  fs.writeFileSync(
    'reports/routes-accessibility.json',
    JSON.stringify(results, null, 2)
  );
  
  // Afficher le résumé
  console.log('\n📊 Résultats de l\'audit des routes:');
  console.log(`🛣️ Routes définies: ${results.navigationTypes.routes.length}`);
  console.log(`🔒 Routes protégées: ${results.protectedRoutes.length}`);
  console.log(`↩️ Redirections: ${results.redirects.length}`);
  console.log(`🔗 Liens UI: ${results.uiAccessibility.links.length}`);
  console.log(`🔘 Boutons UI: ${results.uiAccessibility.buttons.length}`);
  
  console.log('\n⚠️ Problèmes d\'accessibilité:');
  console.log(`🔸 Routes inaccessibles: ${results.analysis.inaccessibleRoutes.length}`);
  console.log(`🔸 Routes protégées orphelines: ${results.analysis.orphanedProtectedRoutes.length}`);
  console.log(`🔸 Redirections cassées: ${results.analysis.deadEndRedirects.length}`);
  console.log(`🔸 Routes sensibles non protégées: ${results.analysis.unprotectedSensitiveRoutes.length}`);
  
  console.log('\n📄 Rapport détaillé sauvegardé: reports/routes-accessibility.json');
  
  return results;
}

if (require.main === module) {
  runRoutesAudit().catch(console.error);
}

module.exports = { runRoutesAudit };
