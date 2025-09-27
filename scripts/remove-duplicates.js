
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 NETTOYAGE DES DOUBLONS');
console.log('========================\n');

// Doublons connus à supprimer (gardant la version la plus récente/complète)
const duplicatesToRemove = [
  // Doublons de composants home
  'src/components/home/ActionButtons.tsx', // Garder UnifiedActionButtons.tsx
  
  // Doublons d'utilitaires
  'src/utils/userModeUtils.ts', // Garder userModeHelpers.ts
  'src/utils/lazyRoutes.ts', // Garder unifiedLazyRoutes.tsx
  
  // Doublons de composants navigation
  'src/components/navigation/Navigation.tsx', // Garder UnifiedNavigation.tsx
  
  // Doublons de layout
  'src/components/layout/AppLayout.tsx', // Garder Layout.tsx
  
  // Anciens fichiers router
  'src/router/routes.tsx', // Garder buildUnifiedRoutes.tsx
  'src/router/AppRouter.tsx', // Router unifié dans index.tsx
];

// Doublons potentiels dans les types
const typeDuplicates = [
  'src/types/routes.ts', // Garder navigation.ts pour les routes
  'src/types/user.ts', // Vérifier si doublon avec auth.ts
];

let removedFiles = 0;
let errors = 0;

console.log('🗑️ Suppression des doublons identifiés...\n');

duplicatesToRemove.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      // Vérifier que le fichier n'est pas critique avant suppression
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Si le fichier contient du code important non dupliqué ailleurs, le garder
      if (content.length < 100 || content.includes('export default') && content.split('\n').length < 10) {
        fs.unlinkSync(fullPath);
        console.log(`✅ Supprimé: ${filePath}`);
        removedFiles++;
      } else {
        console.log(`⚠️ Conservé (contenu important): ${filePath}`);
      }
    } else {
      console.log(`ℹ️ Déjà absent: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Erreur lors de la suppression de ${filePath}:`, error.message);
    errors++;
  }
});

// Nettoyer les imports cassés après suppression
console.log('\n🔗 Nettoyage des imports cassés...');

function updateImportsInFile(filePath, oldImport, newImport) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(new RegExp(oldImport, 'g'), newImport);
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent);
      console.log(`📝 Mis à jour: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.log(`❌ Erreur mise à jour ${filePath}:`, error.message);
  }
}

// Corrections d'imports communes
const importFixes = [
  {
    from: "from '@/components/home/ActionButtons'",
    to: "from '@/components/home/UnifiedActionButtons'"
  },
  {
    from: "from '@/utils/userModeUtils'",
    to: "from '@/utils/userModeHelpers'"
  },
  {
    from: "from '@/utils/lazyRoutes'",
    to: "from '@/utils/unifiedLazyRoutes'"
  }
];

// Scanner tous les fichiers pour corriger les imports
function scanDirectory(dir) {
  const files = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...scanDirectory(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignorer les erreurs de scan
  }
  return files;
}

const allFiles = scanDirectory(path.join(process.cwd(), 'src'));

importFixes.forEach(fix => {
  allFiles.forEach(file => {
    updateImportsInFile(file, fix.from, fix.to);
  });
});

console.log(`\n📊 RÉSUMÉ DU NETTOYAGE`);
console.log(`=====================`);
console.log(`Fichiers supprimés: ${removedFiles}`);
console.log(`Erreurs: ${errors}`);
console.log(`Status: ${errors === 0 ? '✅ Succès' : '⚠️ Avec erreurs'}`);

if (removedFiles > 0) {
  console.log('\n🔄 Relancez l\'audit pour vérifier les améliorations');
}
