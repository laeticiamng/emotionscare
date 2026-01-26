#!/usr/bin/env node

/**
 * Codemod Script - Remplace les liens en dur par Routes.*()
 * TICKET: FE/BE-Router-Cleanup-01
 * 
 * Usage: npm run codemod:links
 */

import { globby } from 'globby';
import fs from 'fs/promises';

interface LinkReplacement {
  pattern: RegExp;
  replacement: string;
  routeFunction: string;
}

// Mapping des anciens chemins vers les nouvelles fonctions Routes.*()
const LINK_REPLACEMENTS: LinkReplacement[] = [
  // Authentification
  { pattern: /to="\/login"/g, replacement: 'to={Routes.login()}', routeFunction: 'login' },
  { pattern: /to="\/b2c\/login"/g, replacement: 'to={Routes.login({segment: "b2c"})}', routeFunction: 'login' },
  { pattern: /to="\/b2b\/user\/login"/g, replacement: 'to={Routes.login({segment: "b2b"})}', routeFunction: 'login' },
  { pattern: /to="\/b2b\/admin\/login"/g, replacement: 'to={Routes.login({segment: "b2b"})}', routeFunction: 'login' },
  { pattern: /to="\/signup"/g, replacement: 'to={Routes.signup()}', routeFunction: 'signup' },
  { pattern: /to="\/register"/g, replacement: 'to={Routes.signup()}', routeFunction: 'signup' },
  { pattern: /to="\/b2c\/register"/g, replacement: 'to={Routes.signup({segment: "b2c"})}', routeFunction: 'signup' },
  
  // Landing pages
  { pattern: /to="\/"/g, replacement: 'to={Routes.home()}', routeFunction: 'home' },
  { pattern: /to="\/b2c"/g, replacement: 'to={Routes.b2cLanding()}', routeFunction: 'b2cLanding' },
  { pattern: /to="\/entreprise"/g, replacement: 'to={Routes.b2bLanding()}', routeFunction: 'b2bLanding' },
  { pattern: /to="\/about"/g, replacement: 'to={Routes.about()}', routeFunction: 'about' },
  { pattern: /to="\/contact"/g, replacement: 'to={Routes.contact()}', routeFunction: 'contact' },
  { pattern: /to="\/help"/g, replacement: 'to={Routes.help()}', routeFunction: 'help' },

  // Dashboards
  { pattern: /to="\/app"/g, replacement: 'to={Routes.app()}', routeFunction: 'app' },
  { pattern: /to="\/app\/home"/g, replacement: 'to={Routes.consumerHome()}', routeFunction: 'consumerHome' },
  { pattern: /to="\/b2c\/dashboard"/g, replacement: 'to={Routes.consumerHome()}', routeFunction: 'consumerHome' },
  { pattern: /to="\/dashboard"/g, replacement: 'to={Routes.consumerHome()}', routeFunction: 'consumerHome' },
  { pattern: /to="\/app\/collab"/g, replacement: 'to={Routes.employeeHome()}', routeFunction: 'employeeHome' },
  { pattern: /to="\/b2b\/user\/dashboard"/g, replacement: 'to={Routes.employeeHome()}', routeFunction: 'employeeHome' },
  { pattern: /to="\/app\/rh"/g, replacement: 'to={Routes.managerHome()}', routeFunction: 'managerHome' },
  { pattern: /to="\/b2b\/admin\/dashboard"/g, replacement: 'to={Routes.managerHome()}', routeFunction: 'managerHome' },

  // Modules fonctionnels
  { pattern: /to="\/scan"/g, replacement: 'to={Routes.scan()}', routeFunction: 'scan' },
  { pattern: /to="\/app\/scan"/g, replacement: 'to={Routes.scan()}', routeFunction: 'scan' },
  { pattern: /to="\/music"/g, replacement: 'to={Routes.music()}', routeFunction: 'music' },
  { pattern: /to="\/app\/music"/g, replacement: 'to={Routes.music()}', routeFunction: 'music' },
  { pattern: /to="\/coach"/g, replacement: 'to={Routes.coach()}', routeFunction: 'coach' },
  { pattern: /to="\/app\/coach"/g, replacement: 'to={Routes.coach()}', routeFunction: 'coach' },
  { pattern: /to="\/journal"/g, replacement: 'to={Routes.journal()}', routeFunction: 'journal' },
  { pattern: /to="\/app\/journal"/g, replacement: 'to={Routes.journal()}', routeFunction: 'journal' },
  { pattern: /to="\/vr"/g, replacement: 'to={Routes.vr()}', routeFunction: 'vr' },
  { pattern: /to="\/app\/vr"/g, replacement: 'to={Routes.vr()}', routeFunction: 'vr' },

  // Modules Fun-First
  { pattern: /to="\/flash-glow"/g, replacement: 'to={Routes.flashGlow()}', routeFunction: 'flashGlow' },
  { pattern: /to="\/instant-glow"/g, replacement: 'to={Routes.flashGlow()}', routeFunction: 'flashGlow' },
  { pattern: /to="\/breathwork"/g, replacement: 'to={Routes.breath()}', routeFunction: 'breath' },
  { pattern: /to="\/ar-filters"/g, replacement: 'to={Routes.faceAR()}', routeFunction: 'faceAR' },
  { pattern: /to="\/bubble-beat"/g, replacement: 'to={Routes.bubbleBeat()}', routeFunction: 'bubbleBeat' },
  { pattern: /to="\/screen-silk-break"/g, replacement: 'to={Routes.screenSilk()}', routeFunction: 'screenSilk' },
  { pattern: /to="\/vr-galactique"/g, replacement: 'to={Routes.vrGalaxy()}', routeFunction: 'vrGalaxy' },

  // Paramètres
  { pattern: /to="\/settings"/g, replacement: 'to={Routes.settingsGeneral()}', routeFunction: 'settingsGeneral' },
  { pattern: /to="\/preferences"/g, replacement: 'to={Routes.settingsGeneral()}', routeFunction: 'settingsGeneral' },
  { pattern: /to="\/profile-settings"/g, replacement: 'to={Routes.settingsProfile()}', routeFunction: 'settingsProfile' },
  { pattern: /to="\/privacy-toggles"/g, replacement: 'to={Routes.settingsPrivacy()}', routeFunction: 'settingsPrivacy' },
  { pattern: /to="\/notifications"/g, replacement: 'to={Routes.settingsNotifications()}', routeFunction: 'settingsNotifications' },

  // B2B Features
  { pattern: /to="\/teams"/g, replacement: 'to={Routes.teams()}', routeFunction: 'teams' },
  { pattern: /to="\/social-cocon"/g, replacement: 'to={Routes.socialCocon()}', routeFunction: 'socialCocon' },
  { pattern: /to="\/reports"/g, replacement: 'to={Routes.adminReports()}', routeFunction: 'adminReports' },
  { pattern: /to="\/events"/g, replacement: 'to={Routes.adminEvents()}', routeFunction: 'adminEvents' },

  // Pages système
  { pattern: /to="\/404"/g, replacement: 'to={Routes.notFound()}', routeFunction: 'notFound' },
  { pattern: /to="\/403"/g, replacement: 'to={Routes.forbidden()}', routeFunction: 'forbidden' },
  { pattern: /to="\/401"/g, replacement: 'to={Routes.unauthorized()}', routeFunction: 'unauthorized' },
];

// Mapping des navigate() calls
const NAVIGATE_REPLACEMENTS: LinkReplacement[] = [
  { pattern: /navigate\('\/login'\)/g, replacement: 'navigate(Routes.login())', routeFunction: 'login' },
  { pattern: /navigate\('\/b2c\/dashboard'\)/g, replacement: 'navigate(Routes.consumerHome())', routeFunction: 'consumerHome' },
  { pattern: /navigate\('\/dashboard'\)/g, replacement: 'navigate(Routes.consumerHome())', routeFunction: 'consumerHome' },
  { pattern: /navigate\('\/music'\)/g, replacement: 'navigate(Routes.music())', routeFunction: 'music' },
  { pattern: /navigate\('\/journal'\)/g, replacement: 'navigate(Routes.journal())', routeFunction: 'journal' },
  { pattern: /navigate\('\/scan'\)/g, replacement: 'navigate(Routes.scan())', routeFunction: 'scan' },
  { pattern: /navigate\('\/coach'\)/g, replacement: 'navigate(Routes.coach())', routeFunction: 'coach' },
  { pattern: /navigate\('\/vr'\)/g, replacement: 'navigate(Routes.vr())', routeFunction: 'vr' },
  { pattern: /navigate\('\/settings'\)/g, replacement: 'navigate(Routes.settingsGeneral())', routeFunction: 'settingsGeneral' },
  { pattern: /navigate\('\/'\)/g, replacement: 'navigate(Routes.home())', routeFunction: 'home' },
];

interface TransformResult {
  filePath: string;
  hasChanges: boolean;
  addedImport: boolean;
  replacements: number;
}

async function transformFile(filePath: string): Promise<TransformResult> {
  const content = await fs.readFile(filePath, 'utf-8');
  let newContent = content;
  let replacements = 0;
  const usedFunctions = new Set<string>();

  // Appliquer les remplacements de liens
  for (const { pattern, replacement, routeFunction } of LINK_REPLACEMENTS) {
    const matches = newContent.match(pattern);
    if (matches) {
      newContent = newContent.replace(pattern, replacement);
      replacements += matches.length;
      usedFunctions.add(routeFunction);
    }
  }

  // Appliquer les remplacements de navigate()
  for (const { pattern, replacement, routeFunction } of NAVIGATE_REPLACEMENTS) {
    const matches = newContent.match(pattern);
    if (matches) {
      newContent = newContent.replace(pattern, replacement);
      replacements += matches.length;
      usedFunctions.add(routeFunction);
    }
  }

  // Ajouter l'import Routes si nécessaire
  let addedImport = false;
  if (usedFunctions.size > 0) {
    const hasRoutesImport = /import.*Routes.*from.*routerV2\/helpers/.test(newContent);
    
    if (!hasRoutesImport) {
      // Trouver la position pour ajouter l'import
      const importLines = newContent.split('\n');
      let insertIndex = 0;
      
      // Chercher la dernière ligne d'import
      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].startsWith('import ')) {
          insertIndex = i + 1;
        }
      }
      
      importLines.splice(insertIndex, 0, "import { Routes } from '@/routerV2/helpers';");
      newContent = importLines.join('\n');
      addedImport = true;
    }
  }

  return {
    filePath,
    hasChanges: replacements > 0,
    addedImport,
    replacements,
  };
}

async function processFiles(pattern: string): Promise<TransformResult[]> {
  const files = await globby([pattern]);
  const results: TransformResult[] = [];

  for (const file of files) {
    try {
      const result = await transformFile(file);
      results.push(result);

      if (result.hasChanges) {
        // Écrire le fichier modifié (pour l'instant, on fait juste un dry-run)
        // await fs.writeFile(file, modifiedContent);
        console.log(`📝 ${file}: ${result.replacements} remplacements${result.addedImport ? ' + import ajouté' : ''}`);
      }
    } catch (error) {
      console.error(`❌ Erreur dans ${file}:`, error);
    }
  }

  return results;
}

async function main() {
  console.log('🔄 CODEMOD - Remplacement des liens en dur par Routes.*()');
  console.log('====================================================\n');

  const patterns = [
    'src/pages/**/*.{tsx,ts}',
    'src/components/**/*.{tsx,ts}',
    'src/hooks/**/*.{tsx,ts}',
    // Ajoutez d'autres patterns si nécessaire
  ];

  let totalReplacements = 0;
  let totalFiles = 0;
  let modifiedFiles = 0;

  for (const pattern of patterns) {
    console.log(`📂 Traitement: ${pattern}`);
    const results = await processFiles(pattern);
    
    totalFiles += results.length;
    
    const modified = results.filter(r => r.hasChanges);
    modifiedFiles += modified.length;
    
    const patternReplacements = modified.reduce((sum, r) => sum + r.replacements, 0);
    totalReplacements += patternReplacements;
    
    console.log(`   ${modified.length}/${results.length} fichiers modifiés (${patternReplacements} remplacements)\n`);
  }

  console.log('📊 RÉSUMÉ:');
  console.log(`   Fichiers analysés: ${totalFiles}`);
  console.log(`   Fichiers modifiés: ${modifiedFiles}`);
  console.log(`   Total des remplacements: ${totalReplacements}`);
  
  if (modifiedFiles > 0) {
    console.log('\n⚠️  MODE DRY-RUN activé - Aucun fichier n\'a été réellement modifié');
    console.log('   Pour appliquer les changements, décommentez la ligne writeFile dans le code');
  } else {
    console.log('\n✅ Aucun lien en dur détecté - Le code est déjà compatible RouterV2 !');
  }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  });
}

export { transformFile, processFiles };