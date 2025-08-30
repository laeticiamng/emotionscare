#!/usr/bin/env node

/**
 * Vérificateur d'imports - AST light pour détecter les imports cassés
 * Vérifie les imports de pages et composants, détecte les erreurs communes
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const SRC_DIR = path.join(__dirname, '../../src');
const PAGES_DIR = path.join(SRC_DIR, 'pages');

console.log('🔍 IMPORTS CHECK - Vérification des imports');
console.log('============================================\n');

let hasErrors = false;
let warnings = 0;

// Patterns d'imports à vérifier
const IMPORT_PATTERNS = {
  relative: /from\s+['"]\.\/.*['"]/g,
  absolute: /from\s+['"]@\/.*['"]/g,
  external: /from\s+['"][^@\.].*['"]/g,
  componentImport: /import\s+\{?\s*(\w+)\s*\}?\s+from/g,
  defaultImport: /import\s+(\w+)\s+from/g
};

// Fichiers à analyser
const tsxFiles = glob.sync('**/*.{ts,tsx}', { 
  cwd: SRC_DIR,
  ignore: ['node_modules/**', 'dist/**', '**/*.d.ts']
});

console.log(`📁 Fichiers à analyser: ${tsxFiles.length}`);

// Fonction pour extraire les imports d'un fichier
function extractImports(filePath, content) {
  const imports = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Import default
    const defaultMatch = line.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
    if (defaultMatch) {
      imports.push({
        type: 'default',
        name: defaultMatch[1],
        from: defaultMatch[2],
        line: lineNum,
        raw: line.trim()
      });
    }
    
    // Import named
    const namedMatch = line.match(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/);
    if (namedMatch) {
      const names = namedMatch[1].split(',').map(n => n.trim());
      names.forEach(name => {
        imports.push({
          type: 'named',
          name: name,
          from: namedMatch[2],
          line: lineNum,
          raw: line.trim()
        });
      });
    }
  });
  
  return imports;
}

// Fonction pour vérifier si un fichier existe
function checkFileExists(importPath, currentFile) {
  if (importPath.startsWith('@/')) {
    // Alias @ vers src/
    const resolvedPath = path.join(SRC_DIR, importPath.substring(2));
    return fs.existsSync(resolvedPath + '.ts') || 
           fs.existsSync(resolvedPath + '.tsx') ||
           fs.existsSync(resolvedPath + '/index.ts') ||
           fs.existsSync(resolvedPath + '/index.tsx') ||
           fs.existsSync(resolvedPath);
  }
  
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    // Import relatif
    const currentDir = path.dirname(currentFile);
    const resolvedPath = path.resolve(currentDir, importPath);
    return fs.existsSync(resolvedPath + '.ts') || 
           fs.existsSync(resolvedPath + '.tsx') ||
           fs.existsSync(resolvedPath + '/index.ts') ||
           fs.existsSync(resolvedPath + '/index.tsx') ||
           fs.existsSync(resolvedPath);
  }
  
  // Import externe - on assume qu'ils sont valides
  return true;
}

// Analyser chaque fichier
for (const file of tsxFiles) {
  const filePath = path.join(SRC_DIR, file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = extractImports(filePath, content);
    
    // Vérifier chaque import
    for (const imp of imports) {
      // Ignorer les imports d'externes packages
      if (!imp.from.startsWith('@/') && !imp.from.startsWith('./') && !imp.from.startsWith('../')) {
        continue;
      }
      
      if (!checkFileExists(imp.from, filePath)) {
        console.error(`❌ IMPORT CASSÉ: ${file}:${imp.line}`);
        console.error(`   ${imp.raw}`);
        console.error(`   → Fichier non trouvé: ${imp.from}\n`);
        hasErrors = true;
      }
    }
    
    // Vérifications spécifiques aux pages
    if (file.includes('pages/') && file.endsWith('.tsx')) {
      // Vérifier data-testid="page-root"
      if (!content.includes('data-testid="page-root"')) {
        console.warn(`⚠️ MANQUANT: ${file}`);
        console.warn(`   → Attribut data-testid="page-root" requis pour les tests E2E\n`);
        warnings++;
      }
      
      // Vérifier export default
      if (!content.includes('export default')) {
        console.error(`❌ EXPORT: ${file}`);
        console.error(`   → Export default manquant\n`);
        hasErrors = true;
      }
      
      // Vérifier que c'est un React component
      if (!content.includes('React.FC') && !content.includes(': FC') && !content.includes('function ')) {
        console.warn(`⚠️ COMPONENT: ${file}`);
        console.warn(`   → Ne semble pas être un composant React valide\n`);
        warnings++;
      }
    }
    
  } catch (error) {
    console.error(`❌ ERREUR LECTURE: ${file}`);
    console.error(`   ${error.message}\n`);
    hasErrors = true;
  }
}

// Vérifications spéciales
console.log('🔍 Vérifications spéciales...');

// Vérifier que tous les composants de pages sont exportés
const pagesIndexPath = path.join(PAGES_DIR, 'index.ts');
if (fs.existsSync(pagesIndexPath)) {
  const indexContent = fs.readFileSync(pagesIndexPath, 'utf8');
  const pageFiles = glob.sync('*Page.tsx', { cwd: PAGES_DIR });
  
  for (const pageFile of pageFiles) {
    const componentName = pageFile.replace('.tsx', '');
    if (!indexContent.includes(componentName)) {
      console.warn(`⚠️ INDEX: ${componentName}`);
      console.warn(`   → Non exporté dans pages/index.ts\n`);
      warnings++;
    }
  }
}

// Résultats finaux
console.log('📊 RÉSULTATS:');
console.log(`✅ Fichiers analysés: ${tsxFiles.length}`);
console.log(`⚠️ Avertissements: ${warnings}`);
console.log(`❌ Erreurs: ${hasErrors ? 'OUI' : 'NON'}`);

if (warnings > 0) {
  console.log('\n💡 RECOMMANDATIONS:');
  console.log('   - Ajouter data-testid="page-root" aux pages');
  console.log('   - Vérifier les exports dans pages/index.ts');
  console.log('   - S\'assurer que tous les composants sont valides');
}

if (hasErrors) {
  console.log('\n❌ ÉCHEC - Des imports cassés ont été détectés');
  process.exit(1);
} else {
  console.log('\n✅ SUCCÈS - Tous les imports sont valides');
  process.exit(0);
}