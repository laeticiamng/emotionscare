
#!/usr/bin/env node

/**
 * Audit d'accessibilité - Identifie les éléments non accessibles côté utilisateur
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Démarrage de l\'audit d\'accessibilité...\n');

// Fonction pour parcourir récursivement les fichiers
function getAllFiles(dirPath, arrayOfFiles = [], extension = '.tsx') {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles, extension);
      }
    } else if (file.endsWith(extension)) {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

// Fonction pour extraire les imports et exports
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    const exports = [];
    
    // Extraire les imports
    const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // Extraire les exports
    const exportRegex = /export\s+(default\s+)?(\w+|{[^}]+})/g;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[0]);
    }
    
    return { imports, exports, content };
  } catch (error) {
    return { imports: [], exports: [], content: '', error: error.message };
  }
}

// Analyser les composants
const componentFiles = getAllFiles('./src/components');
const pageFiles = getAllFiles('./src/pages');
const allTsxFiles = [...componentFiles, ...pageFiles];

console.log(`📊 Analyse de ${allTsxFiles.length} fichiers...\n`);

const results = {
  orphanedComponents: [],
  unusedPages: [],
  missingNavigation: [],
  deadFiles: [],
  inaccessibleElements: []
};

// Analyser chaque fichier
const fileAnalysis = {};
allTsxFiles.forEach(file => {
  fileAnalysis[file] = analyzeFile(file);
});

// Identifier les composants orphelins
componentFiles.forEach(file => {
  const fileName = path.basename(file, '.tsx');
  const relativePath = path.relative('./src', file);
  
  // Vérifier si le composant est importé quelque part
  let isImported = false;
  for (const [otherFile, analysis] of Object.entries(fileAnalysis)) {
    if (otherFile !== file) {
      const importPaths = analysis.imports.filter(imp => 
        imp.includes(fileName) || imp.includes(relativePath.replace('.tsx', ''))
      );
      if (importPaths.length > 0) {
        isImported = true;
        break;
      }
    }
  }
  
  if (!isImported) {
    results.orphanedComponents.push({
      file: relativePath,
      component: fileName
    });
  }
});

// Identifier les pages inutilisées (non référencées dans les routes)
const routerFiles = getAllFiles('./src', [], '.tsx').filter(f => 
  f.includes('router') || f.includes('Router') || f.includes('App.tsx')
);

let routerContent = '';
routerFiles.forEach(file => {
  routerContent += fs.readFileSync(file, 'utf8');
});

pageFiles.forEach(file => {
  const fileName = path.basename(file, '.tsx');
  const relativePath = path.relative('./src', file);
  
  // Vérifier si la page est référencée dans le routeur
  if (!routerContent.includes(fileName) && !routerContent.includes(relativePath)) {
    results.unusedPages.push({
      file: relativePath,
      page: fileName
    });
  }
});

// Vérifier les éléments sans navigation
const navigationFiles = getAllFiles('./src/components', [], '.tsx').filter(f => 
  f.includes('Nav') || f.includes('Menu') || f.includes('Header') || f.includes('Sidebar')
);

let navigationContent = '';
navigationFiles.forEach(file => {
  navigationContent += fs.readFileSync(file, 'utf8');
});

// Analyser les routes définies mais sans liens de navigation
const routeRegex = /path:\s*['"`]([^'"`]+)['"`]/g;
const definedRoutes = [];
let match;
while ((match = routeRegex.exec(routerContent)) !== null) {
  definedRoutes.push(match[1]);
}

definedRoutes.forEach(route => {
  if (!navigationContent.includes(route) && route !== '/' && route !== '*') {
    results.missingNavigation.push({
      route: route,
      accessible: false,
      reason: 'Aucun lien de navigation trouvé'
    });
  }
});

// Créer le rapport
const reportDir = './reports/accessibility';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// Rapport JSON détaillé
fs.writeFileSync(
  path.join(reportDir, 'accessibility-audit.json'),
  JSON.stringify(results, null, 2)
);

// Rapport Markdown lisible
const markdownReport = `
# Audit d'Accessibilité Frontend

## 📊 Résumé

- **Composants orphelins**: ${results.orphanedComponents.length}
- **Pages inutilisées**: ${results.unusedPages.length}
- **Routes sans navigation**: ${results.missingNavigation.length}

## 🚫 Composants Orphelins

${results.orphanedComponents.length === 0 ? 'Aucun composant orphelin détecté.' : 
results.orphanedComponents.map(comp => `- \`${comp.file}\` - ${comp.component}`).join('\n')}

## 📄 Pages Inutilisées

${results.unusedPages.length === 0 ? 'Aucune page inutilisée détectée.' :
results.unusedPages.map(page => `- \`${page.file}\` - ${page.page}`).join('\n')}

## 🧭 Routes Sans Navigation

${results.missingNavigation.length === 0 ? 'Toutes les routes ont une navigation.' :
results.missingNavigation.map(route => `- \`${route.route}\` - ${route.reason}`).join('\n')}

## 🔧 Recommandations

1. **Nettoyer les composants orphelins** - Supprimer ou intégrer les composants non utilisés
2. **Connecter les pages isolées** - Ajouter des liens de navigation vers les pages accessibles
3. **Audit des routes** - Vérifier que toutes les routes importantes sont accessibles via l'interface

---
*Audit généré le ${new Date().toLocaleString('fr-FR')}*
`;

fs.writeFileSync(
  path.join(reportDir, 'accessibility-audit.md'),
  markdownReport
);

console.log('✅ Audit d\'accessibilité terminé');
console.log(`📁 Rapports générés dans: ${reportDir}`);
console.log(`📊 ${results.orphanedComponents.length} composants orphelins`);
console.log(`📄 ${results.unusedPages.length} pages inutilisées`);
console.log(`🧭 ${results.missingNavigation.length} routes sans navigation\n`);
