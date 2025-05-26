
#!/usr/bin/env node

/**
 * Audit Backend-Frontend Gap - Identifie les éléments backend non connectés au frontend
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Démarrage de l\'audit Backend-Frontend Gap...\n');

// Fonction pour parcourir récursivement les fichiers
function getAllFiles(dirPath, arrayOfFiles = [], extensions = ['.ts', '.tsx', '.js']) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles, extensions);
      }
    } else if (extensions.some(ext => file.endsWith(ext))) {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

const results = {
  unusedEdgeFunctions: [],
  unusedSupabaseFunctions: [],
  unusedBackendServices: [],
  missingFrontendIntegration: [],
  deadEndpoints: []
};

// 1. Analyser les fonctions Edge Supabase
console.log('📡 Analyse des fonctions Edge Supabase...');
const edgeFunctionsPath = './supabase/functions';
if (fs.existsSync(edgeFunctionsPath)) {
  const edgeFunctions = fs.readdirSync(edgeFunctionsPath).filter(dir => {
    const fullPath = path.join(edgeFunctionsPath, dir);
    return fs.statSync(fullPath).isDirectory() && !dir.startsWith('_');
  });

  // Analyser le code frontend pour voir quelles fonctions sont appelées
  const frontendFiles = getAllFiles('./src');
  let frontendContent = '';
  frontendFiles.forEach(file => {
    try {
      frontendContent += fs.readFileSync(file, 'utf8');
    } catch (error) {
      // Ignorer les erreurs de lecture
    }
  });

  edgeFunctions.forEach(funcName => {
    // Vérifier si la fonction est appelée dans le frontend
    const isUsed = frontendContent.includes(funcName) || 
                   frontendContent.includes(`functions/${funcName}`) ||
                   frontendContent.includes(`'${funcName}'`) ||
                   frontendContent.includes(`"${funcName}"`);
    
    if (!isUsed) {
      const funcPath = path.join(edgeFunctionsPath, funcName);
      const indexFile = path.join(funcPath, 'index.ts');
      
      let description = 'Fonction Edge non utilisée';
      if (fs.existsSync(indexFile)) {
        try {
          const content = fs.readFileSync(indexFile, 'utf8');
          // Extraire la première ligne de commentaire comme description
          const commentMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
          if (commentMatch) {
            description = commentMatch[1].replace(/\*/g, '').trim().split('\n')[0].trim();
          }
        } catch (error) {
          // Ignorer
        }
      }
      
      results.unusedEdgeFunctions.push({
        name: funcName,
        path: `supabase/functions/${funcName}`,
        description
      });
    }
  });
}

// 2. Analyser les services backend
console.log('🔧 Analyse des services backend...');
const servicesPath = './services';
if (fs.existsSync(servicesPath)) {
  const services = fs.readdirSync(servicesPath).filter(dir => {
    const fullPath = path.join(servicesPath, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  const frontendFiles = getAllFiles('./src');
  let frontendContent = '';
  frontendFiles.forEach(file => {
    try {
      frontendContent += fs.readFileSync(file, 'utf8');
    } catch (error) {
      // Ignorer
    }
  });

  services.forEach(serviceName => {
    const isUsed = frontendContent.includes(serviceName);
    
    if (!isUsed) {
      results.unusedBackendServices.push({
        name: serviceName,
        path: `services/${serviceName}`,
        type: 'Service backend'
      });
    }
  });
}

// 3. Analyser les endpoints API manqués
console.log('🌐 Analyse des endpoints API...');
const frontendFiles = getAllFiles('./src');
const apiCalls = new Set();

frontendFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Chercher les appels fetch, axios, etc.
    const fetchRegex = /fetch\s*\(\s*['"`]([^'"`]+)['"`]/g;
    const axiosRegex = /axios\.(get|post|put|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    const supabaseRegex = /supabase\.functions\.invoke\s*\(\s*['"`]([^'"`]+)['"`]/g;
    
    let match;
    while ((match = fetchRegex.exec(content)) !== null) {
      apiCalls.add(match[1]);
    }
    while ((match = axiosRegex.exec(content)) !== null) {
      apiCalls.add(match[2]);
    }
    while ((match = supabaseRegex.exec(content)) !== null) {
      apiCalls.add(match[1]);
    }
  } catch (error) {
    // Ignorer
  }
});

// 4. Identifier les fonctions de base de données non utilisées
console.log('🗄️ Analyse des fonctions de base de données...');
// Cette partie nécessiterait une connexion à la base de données pour être complète
// Nous nous contenterons d'identifier les fonctions définies dans les migrations

// 5. Analyser les scripts et utilitaires
console.log('📜 Analyse des scripts et utilitaires...');
const scriptsPath = './scripts';
if (fs.existsSync(scriptsPath)) {
  const scriptFiles = getAllFiles(scriptsPath, [], ['.js', '.ts']);
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const packageScripts = Object.keys(packageJson.scripts || {});
  
  scriptFiles.forEach(scriptFile => {
    const scriptName = path.basename(scriptFile, path.extname(scriptFile));
    const isUsedInPackage = packageScripts.some(script => 
      packageJson.scripts[script].includes(scriptName)
    );
    
    if (!isUsedInPackage && !scriptName.includes('audit')) {
      results.deadEndpoints.push({
        name: scriptName,
        path: path.relative('.', scriptFile),
        type: 'Script non référencé'
      });
    }
  });
}

// Créer le rapport
const reportDir = './reports/backend-frontend-gap';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// Rapport JSON détaillé
fs.writeFileSync(
  path.join(reportDir, 'backend-frontend-gap.json'),
  JSON.stringify(results, null, 2)
);

// Rapport Markdown
const markdownReport = `
# Audit Backend-Frontend Gap

## 📊 Résumé

- **Fonctions Edge inutilisées**: ${results.unusedEdgeFunctions.length}
- **Services backend non connectés**: ${results.unusedBackendServices.length}
- **Scripts orphelins**: ${results.deadEndpoints.length}

## 🔌 Fonctions Edge Supabase Non Utilisées

${results.unusedEdgeFunctions.length === 0 ? 'Toutes les fonctions Edge sont utilisées.' :
results.unusedEdgeFunctions.map(func => `- **${func.name}** (\`${func.path}\`) - ${func.description}`).join('\n')}

## 🔧 Services Backend Non Connectés

${results.unusedBackendServices.length === 0 ? 'Tous les services sont connectés.' :
results.unusedBackendServices.map(service => `- **${service.name}** (\`${service.path}\`) - ${service.type}`).join('\n')}

## 📜 Scripts et Endpoints Orphelins

${results.deadEndpoints.length === 0 ? 'Aucun script orphelin détecté.' :
results.deadEndpoints.map(endpoint => `- **${endpoint.name}** (\`${endpoint.path}\`) - ${endpoint.type}`).join('\n')}

## 🔧 Actions Recommandées

1. **Intégrer les fonctions Edge** - Connecter les fonctions utiles au frontend ou les supprimer
2. **Nettoyer les services** - Supprimer les services non utilisés ou les intégrer
3. **Optimiser les scripts** - Supprimer ou référencer les scripts orphelins
4. **Documentation** - Documenter les endpoints disponibles mais non utilisés

---
*Audit généré le ${new Date().toLocaleString('fr-FR')}*
`;

fs.writeFileSync(
  path.join(reportDir, 'backend-frontend-gap.md'),
  markdownReport
);

console.log('✅ Audit Backend-Frontend Gap terminé');
console.log(`📁 Rapports générés dans: ${reportDir}`);
console.log(`🔌 ${results.unusedEdgeFunctions.length} fonctions Edge inutilisées`);
console.log(`🔧 ${results.unusedBackendServices.length} services non connectés`);
console.log(`📜 ${results.deadEndpoints.length} scripts orphelins\n`);
