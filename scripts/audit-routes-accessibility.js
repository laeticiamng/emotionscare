
#!/usr/bin/env node

/**
 * Audit d'accessibilité des routes - Identifie les routes non accessibles
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Démarrage de l\'audit d\'accessibilité des routes...\n');

function getAllFiles(dirPath, arrayOfFiles = [], extension = '.tsx') {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }
  
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

const results = {
  definedRoutes: [],
  navigationLinks: [],
  inaccessibleRoutes: [],
  orphanedPages: [],
  protectedRoutes: [],
  publicRoutes: []
};

// 1. Extraire toutes les routes définies
console.log('🛣️ Analyse des routes définies...');
const routerFiles = getAllFiles('./src', [], '.tsx').filter(f => 
  f.includes('router') || f.includes('Router') || f.includes('routes')
);

routerFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Extraire les routes avec différents patterns
    const routePatterns = [
      /path:\s*['"`]([^'"`]+)['"`]/g,
      /\{\s*path:\s*['"`]([^'"`]+)['"`]/g,
      /<Route[^>]+path=['"`]([^'"`]+)['"`]/g
    ];
    
    routePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const routePath = match[1];
        if (routePath && !results.definedRoutes.some(r => r.path === routePath)) {
          // Déterminer si la route est protégée
          const isProtected = content.includes('ProtectedRoute') && 
                             content.substring(match.index - 200, match.index + 200).includes('ProtectedRoute');
          
          results.definedRoutes.push({
            path: routePath,
            file: path.relative('.', file),
            protected: isProtected
          });
          
          if (isProtected) {
            results.protectedRoutes.push(routePath);
          } else {
            results.publicRoutes.push(routePath);
          }
        }
      }
    });
  } catch (error) {
    console.warn(`⚠️ Erreur lors de la lecture de ${file}: ${error.message}`);
  }
});

// 2. Extraire tous les liens de navigation
console.log('🧭 Analyse des liens de navigation...');
const allFiles = getAllFiles('./src');

allFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Chercher les liens de navigation
    const linkPatterns = [
      /to=['"`]([^'"`]+)['"`]/g,          // React Router Link
      /href=['"`]([^'"`]+)['"`]/g,        // Liens HTML
      /navigate\(['"`]([^'"`]+)['"`]/g,   // useNavigate
      /push\(['"`]([^'"`]+)['"`]/g        // Router push
    ];
    
    linkPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const linkPath = match[1];
        if (linkPath && linkPath.startsWith('/') && !linkPath.startsWith('//')) {
          if (!results.navigationLinks.some(l => l.path === linkPath)) {
            results.navigationLinks.push({
              path: linkPath,
              file: path.relative('.', file),
              type: pattern.source.includes('to=') ? 'Link' : 
                    pattern.source.includes('href=') ? 'href' :
                    pattern.source.includes('navigate') ? 'navigate' : 'push'
            });
          }
        }
      }
    });
  } catch (error) {
    // Ignorer les erreurs de lecture
  }
});

// 3. Identifier les routes inaccessibles
console.log('🚫 Identification des routes inaccessibles...');
results.definedRoutes.forEach(route => {
  const hasNavigation = results.navigationLinks.some(link => 
    link.path === route.path || 
    link.path.startsWith(route.path.replace('/*', '')) ||
    route.path.startsWith(link.path)
  );
  
  if (!hasNavigation && route.path !== '/' && route.path !== '*' && !route.path.includes(':')) {
    results.inaccessibleRoutes.push({
      ...route,
      reason: 'Aucun lien de navigation trouvé'
    });
  }
});

// 4. Identifier les pages orphelines
console.log('📄 Identification des pages orphelines...');
const pageFiles = getAllFiles('./src/pages');

pageFiles.forEach(file => {
  const fileName = path.basename(file, '.tsx');
  const relativePath = path.relative('./src', file);
  
  // Vérifier si la page est référencée dans les routes
  const isRouted = results.definedRoutes.some(route => {
    const routerContent = routerFiles.map(f => {
      try {
        return fs.readFileSync(f, 'utf8');
      } catch {
        return '';
      }
    }).join('\n');
    
    return routerContent.includes(fileName) || routerContent.includes(relativePath);
  });
  
  if (!isRouted) {
    results.orphanedPages.push({
      file: relativePath,
      page: fileName,
      reason: 'Page non référencée dans le routeur'
    });
  }
});

// 5. Analyser l'accessibilité par rôle
console.log('👤 Analyse de l\'accessibilité par rôle...');
const roleBasedAccess = {
  public: results.publicRoutes,
  authenticated: results.protectedRoutes,
  b2c: results.definedRoutes.filter(r => r.path.includes('/b2c')).map(r => r.path),
  b2b_user: results.definedRoutes.filter(r => r.path.includes('/b2b/user')).map(r => r.path),
  b2b_admin: results.definedRoutes.filter(r => r.path.includes('/b2b/admin')).map(r => r.path)
};

// Créer le rapport
const reportDir = './reports/routes-accessibility';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// Rapport JSON détaillé
const detailedResults = {
  ...results,
  roleBasedAccess,
  summary: {
    totalRoutes: results.definedRoutes.length,
    accessibleRoutes: results.definedRoutes.length - results.inaccessibleRoutes.length,
    inaccessibleRoutes: results.inaccessibleRoutes.length,
    orphanedPages: results.orphanedPages.length,
    navigationLinks: results.navigationLinks.length
  }
};

fs.writeFileSync(
  path.join(reportDir, 'routes-accessibility.json'),
  JSON.stringify(detailedResults, null, 2)
);

// Rapport Markdown
const markdownReport = `
# Audit d'Accessibilité des Routes

## 📊 Résumé

- **Routes totales**: ${results.definedRoutes.length}
- **Routes accessibles**: ${results.definedRoutes.length - results.inaccessibleRoutes.length}
- **Routes inaccessibles**: ${results.inaccessibleRoutes.length}
- **Pages orphelines**: ${results.orphanedPages.length}
- **Liens de navigation**: ${results.navigationLinks.length}

## 🛣️ Routes Définies

### Routes Publiques (${results.publicRoutes.length})
${results.publicRoutes.map(route => `- \`${route}\``).join('\n') || 'Aucune route publique'}

### Routes Protégées (${results.protectedRoutes.length})
${results.protectedRoutes.map(route => `- \`${route}\``).join('\n') || 'Aucune route protégée'}

## 🚫 Routes Inaccessibles (${results.inaccessibleRoutes.length})

${results.inaccessibleRoutes.length === 0 ? 'Toutes les routes sont accessibles via navigation.' :
results.inaccessibleRoutes.map(route => 
  `- **\`${route.path}\`** (${route.file}) - ${route.reason}`
).join('\n')}

## 📄 Pages Orphelines (${results.orphanedPages.length})

${results.orphanedPages.length === 0 ? 'Aucune page orpheline détectée.' :
results.orphanedPages.map(page => 
  `- **${page.page}** (\`${page.file}\`) - ${page.reason}`
).join('\n')}

## 👤 Accessibilité par Rôle

### Public (${roleBasedAccess.public.length} routes)
${roleBasedAccess.public.map(route => `- \`${route}\``).join('\n') || 'Aucune route publique'}

### B2C (${roleBasedAccess.b2c.length} routes)
${roleBasedAccess.b2c.map(route => `- \`${route}\``).join('\n') || 'Aucune route B2C'}

### B2B Utilisateur (${roleBasedAccess.b2b_user.length} routes)
${roleBasedAccess.b2b_user.map(route => `- \`${route}\``).join('\n') || 'Aucune route B2B utilisateur'}

### B2B Admin (${roleBasedAccess.b2b_admin.length} routes)
${roleBasedAccess.b2b_admin.map(route => `- \`${route}\``).join('\n') || 'Aucune route B2B admin'}

## 🔧 Recommandations

1. **Ajouter navigation** pour les routes inaccessibles importantes
2. **Supprimer ou intégrer** les pages orphelines
3. **Vérifier la logique** des routes protégées
4. **Améliorer l'UX** en ajoutant des liens vers toutes les fonctionnalités

---
*Audit généré le ${new Date().toLocaleString('fr-FR')}*
`;

fs.writeFileSync(
  path.join(reportDir, 'routes-accessibility.md'),
  markdownReport
);

console.log('✅ Audit d\'accessibilité des routes terminé');
console.log(`📁 Rapports générés dans: ${reportDir}`);
console.log(`🛣️ ${results.definedRoutes.length} routes analysées`);
console.log(`🚫 ${results.inaccessibleRoutes.length} routes inaccessibles`);
console.log(`📄 ${results.orphanedPages.length} pages orphelines\n`);
