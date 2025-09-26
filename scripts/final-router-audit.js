const fs = require('fs');
const path = require('path');

console.log('=== AUDIT FINAL ROUTERV2 - EMOTIONSCARE ===\n');

// Lire le registry pour extraire tous les composants déclarés
const registryPath = path.join(__dirname, '../src/routerV2/registry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extraire les composants avec regex plus précise
const componentMatches = registryContent.match(/component: '([^']+)'/g) || [];
const declaredComponents = componentMatches
  .map(match => match.replace(/component: '|'/g, ''))
  .filter((comp, index, arr) => arr.indexOf(comp) === index) // Déduplication
  .sort();

console.log(`📊 COMPOSANTS DÉCLARÉS DANS REGISTRY: ${declaredComponents.length}`);

// Scanner récursivement src/pages pour trouver tous les fichiers
function scanPagesDirectory(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanPagesDirectory(fullPath, files);
    } else if (item.endsWith('.tsx') && !item.includes('.test.') && !item.includes('.stories.')) {
      // Extraire le nom du composant du fichier
      const componentName = path.basename(item, '.tsx');
      if (componentName.match(/^[A-Z][a-zA-Z0-9]*$/)) { // PascalCase seulement
        files.push({
          name: componentName,
          path: path.relative(path.join(__dirname, '../src'), fullPath),
          fullPath: fullPath,
          directory: path.dirname(path.relative(path.join(__dirname, '../src/pages'), fullPath))
        });
      }
    }
  }
  
  return files;
}

const pagesDir = path.join(__dirname, '../src/pages');
const existingFiles = scanPagesDirectory(pagesDir);
const existingComponents = existingFiles.map(f => f.name).sort();

console.log(`📁 COMPOSANTS EXISTANTS DANS src/pages: ${existingComponents.length}`);

// Analyse détaillée
const analysis = {
  declared: declaredComponents,
  existing: existingComponents,
  missing: declaredComponents.filter(comp => !existingComponents.includes(comp)),
  orphaned: existingComponents.filter(comp => !declaredComponents.includes(comp)),
  matched: declaredComponents.filter(comp => existingComponents.includes(comp))
};

// Lire le router.ts pour voir quels composants sont mappés
const routerPath = path.join(__dirname, '../src/routerV2/router.ts');
const routerContent = fs.readFileSync(routerPath, 'utf8');

// Extraire les composants mappés dans componentMap
const componentMapMatches = routerContent.match(/([A-Z][a-zA-Z0-9]*): lazy\(/g) || [];
const mappedComponents = componentMapMatches
  .map(match => match.replace(/: lazy\(/, '').trim())
  .sort();

console.log(`🗺️ COMPOSANTS MAPPÉS DANS ROUTER: ${mappedComponents.length}`);

const notMappedButExists = existingComponents.filter(comp => !mappedComponents.includes(comp));
const mappedButMissing = mappedComponents.filter(comp => !existingComponents.includes(comp));

console.log(`\n🎯 RÉSULTATS ANALYSE:`);
console.log(`✅ Composants déclarés ET existants: ${analysis.matched.length}/${declaredComponents.length} (${Math.round(analysis.matched.length/declaredComponents.length*100)}%)`);
console.log(`❌ Composants déclarés mais MANQUANTS: ${analysis.missing.length}`);
console.log(`🔄 Composants existants mais NON déclarés: ${analysis.orphaned.length}`);
console.log(`🗺️ Composants existants mais NON mappés: ${notMappedButExists.length}`);
console.log(`⚠️ Composants mappés mais MANQUANTS: ${mappedButMissing.length}`);

console.log(`\n❌ COMPOSANTS CRITIQUES MANQUANTS:`);
analysis.missing.forEach((comp, index) => {
  console.log(`${index + 1}. ${comp}`);
});

console.log(`\n🗺️ COMPOSANTS NON MAPPÉS DANS ROUTER:`);
notMappedButExists.slice(0, 15).forEach((comp, index) => {
  console.log(`${index + 1}. ${comp}`);
});
if (notMappedButExists.length > 15) {
  console.log(`... et ${notMappedButExists.length - 15} autres`);
}

console.log(`\n⚠️ COMPOSANTS MAPPÉS MAIS FICHIERS MANQUANTS:`);
mappedButMissing.forEach((comp, index) => {
  console.log(`${index + 1}. ${comp}`);
});

// Analyser les doublons potentiels
const potentialDuplicates = [];
const componentGroups = {};

analysis.existing.forEach(comp => {
  const baseName = comp.replace(/^B2C|^B2B|Page$/, '').toLowerCase();
  if (!componentGroups[baseName]) {
    componentGroups[baseName] = [];
  }
  componentGroups[baseName].push(comp);
});

Object.entries(componentGroups).forEach(([base, comps]) => {
  if (comps.length > 1) {
    potentialDuplicates.push({ base, components: comps });
  }
});

console.log(`\n🔍 DOUBLONS POTENTIELS DÉTECTÉS (${potentialDuplicates.length}):`);
potentialDuplicates.slice(0, 10).forEach((dup, index) => {
  console.log(`${index + 1}. ${dup.base}: ${dup.components.join(', ')}`);
});

// Catégoriser les composants manquants par priorité
const criticalMissing = analysis.missing.filter(comp => 
  comp.includes('Dashboard') || 
  comp.includes('Login') || 
  comp.includes('Error') || 
  comp.includes('Landing') ||
  comp.includes('Gateway') ||
  comp.includes('Redirect')
);

const functionalMissing = analysis.missing.filter(comp => 
  !criticalMissing.includes(comp) && (
    comp.includes('Page') ||
    comp.includes('B2C') ||
    comp.includes('B2B')
  )
);

const utilityMissing = analysis.missing.filter(comp => 
  !criticalMissing.includes(comp) && 
  !functionalMissing.includes(comp)
);

console.log(`\n📋 PRIORITÉS DE CRÉATION:`);
console.log(`🔴 CRITIQUES (${criticalMissing.length}): ${criticalMissing.join(', ')}`);
console.log(`🟡 FONCTIONNELS (${functionalMissing.length}): ${functionalMissing.slice(0, 8).join(', ')}${functionalMissing.length > 8 ? '...' : ''}`);
console.log(`🟢 UTILITAIRES (${utilityMissing.length}): ${utilityMissing.slice(0, 8).join(', ')}${utilityMissing.length > 8 ? '...' : ''}`);

// Analyser les pages importantes non couvertes
const importantPages = [
  'UnifiedLoginPage', 'SignupPage', 'HomeB2CPage', 'B2BEntreprisePage',
  'AppGatePage', 'B2CDashboardPage', 'B2BCollabDashboard', 'B2BRHDashboard',
  'B2CScanPage', 'B2CMusicEnhanced', 'B2CAICoachPage', 'B2CJournalPage',
  'B2CVRGalaxyPage', 'B2CFlashGlowPage', 'B2CBreathworkPage',
  'B2CSettingsPage', 'B2CProfileSettingsPage', 'B2CPrivacyTogglesPage', 'B2CNotificationsPage',
  'B2BTeamsPage', 'B2BReportsPage', 'B2BEventsPage', 'B2BOptimisationPage',
  'B2BSecurityPage', 'B2BAuditPage', 'B2BAccessibilityPage',
  'UnauthorizedPage', 'ForbiddenPage', 'UnifiedErrorPage', 'ServerErrorPage',
  'LegalTermsPage', 'LegalPrivacyPage', 'LegalMentionsPage', 'LegalSalesPage', 'LegalCookiesPage'
];

const missingImportant = importantPages.filter(page => !existingComponents.includes(page));
const existingImportant = importantPages.filter(page => existingComponents.includes(page));

console.log(`\n🎯 PAGES IMPORTANTES:`);
console.log(`✅ Pages importantes existantes: ${existingImportant.length}/${importantPages.length}`);
console.log(`❌ Pages importantes manquantes: ${missingImportant.length}`);

if (missingImportant.length > 0) {
  console.log(`\n❗ PAGES IMPORTANTES À CRÉER:`);
  missingImportant.forEach((page, index) => {
    console.log(`${index + 1}. ${page}`);
  });
}

// Sauvegarder le rapport complet
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    declared: declaredComponents.length,
    existing: existingComponents.length,
    mapped: mappedComponents.length,
    missing: analysis.missing.length,
    orphaned: analysis.orphaned.length,
    notMapped: notMappedButExists.length,
    mappedButMissing: mappedButMissing.length,
    coverage: Math.round(analysis.matched.length/declaredComponents.length*100),
    importantMissing: missingImportant.length,
    duplicates: potentialDuplicates.length
  },
  detailed: {
    missing: analysis.missing,
    orphaned: analysis.orphaned,
    notMapped: notMappedButExists,
    mappedButMissing: mappedButMissing,
    duplicates: potentialDuplicates,
    importantMissing: missingImportant,
    existingFiles: existingFiles.map(f => ({ name: f.name, path: f.path, directory: f.directory }))
  },
  priorities: {
    critical: criticalMissing,
    functional: functionalMissing,
    utility: utilityMissing
  }
};

fs.writeFileSync(
  path.join(__dirname, '../final-router-audit-report.json'),
  JSON.stringify(report, null, 2)
);

console.log(`\n📄 Rapport final sauvegardé: final-router-audit-report.json`);

// Générer des recommandations
console.log(`\n📋 RECOMMANDATIONS:`);

if (analysis.missing.length > 0) {
  console.log(`1. Créer ${analysis.missing.length} composants manquants déclarés dans registry`);
}

if (notMappedButExists.length > 0) {
  console.log(`2. Mapper ${notMappedButExists.length} composants existants dans router.ts`);
}

if (mappedButMissing.length > 0) {
  console.log(`3. Créer ${mappedButMissing.length} composants mappés mais fichiers manquants`);
}

if (potentialDuplicates.length > 0) {
  console.log(`4. Analyser et fusionner ${potentialDuplicates.length} groupes de doublons potentiels`);
}

console.log(`\n🚀 PRÊT POUR FINALISATION COMPLETE DU ROUTERV2!`);