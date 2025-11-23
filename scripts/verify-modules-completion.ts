// Script de vérification de la complétude des modules
import { existsSync } from 'fs';
import { join } from 'path';

// Liste de tous les modules identifiés
const ALL_MODULES = [
  'achievements',
  'activities',
  'adaptive-music',
  'admin',
  'ai-coach',
  'ambition',
  'ambition-arcade',
  'ar-filters',
  'audio-studio',
  'boss-grit',
  'bounce-back',
  'breath',
  'breath-constellation',
  'breath-unified',
  'breathing-vr',
  'bubble-beat',
  'coach',
  'community',
  'dashboard',
  'emotion-orchestrator',
  'emotion-scan',
  'flash-glow',
  'flash-lite',
  'journal',
  'meditation',
  'mood-mixer',
  'music-therapy',
  'music-unified',
  'nyvee',
  'scores',
  'screen-silk',
  'sessions',
  'story-synth',
  'user-preferences',
  'vr-galaxy',
  'vr-nebula',
  'weekly-bars'
];

// Modules qui nécessitent des schémas de préférences
const PREFERENCE_REQUIRED_MODULES = ALL_MODULES.filter(m =>
  !['admin', 'dashboard', 'emotion-orchestrator', 'sessions', 'user-preferences', 'scores', 'achievements'].includes(m)
);

interface ModuleStatus {
  name: string;
  hasService: boolean;
  hasTypes: boolean;
  hasIndex: boolean;
  hasPreferencesSchema: boolean;
  hasRoute: boolean;
  hasTests: boolean;
  needsCompletion: boolean;
  missingElements: string[];
}

const modulesDir = 'src/modules';
const schemaFile = 'src/SCHEMA.ts';

function checkModule(moduleName: string): ModuleStatus {
  const modulePath = join(process.cwd(), modulesDir, moduleName);
  const missingElements: string[] = [];

  // Vérifier l'existence des fichiers essentiels
  const serviceFileName = `${moduleName.replace(/-/g, '')}Service.ts`;
  const hasService = existsSync(join(modulePath, `${moduleName}Service.ts`)) ||
                    existsSync(join(modulePath, serviceFileName)) ||
                    existsSync(join(modulePath, 'service.ts'));

  const hasTypes = existsSync(join(modulePath, 'types.ts'));
  const hasIndex = existsSync(join(modulePath, 'index.ts')) ||
                   existsSync(join(modulePath, 'index.tsx'));

  const hasTests = existsSync(join(modulePath, '__tests__'));

  if (!hasService) missingElements.push('Service');
  if (!hasTypes) missingElements.push('Types');
  if (!hasIndex) missingElements.push('Index');
  if (!hasTests) missingElements.push('Tests');

  // Pour les modules nécessitant des préférences
  const requiresPreferences = PREFERENCE_REQUIRED_MODULES.includes(moduleName);
  const hasPreferencesSchema = true; // À vérifier manuellement dans SCHEMA.ts

  if (requiresPreferences) {
    missingElements.push('Preferences Schema (à vérifier manuellement)');
  }

  const needsCompletion = missingElements.length > 0;

  return {
    name: moduleName,
    hasService,
    hasTypes,
    hasIndex,
    hasPreferencesSchema: !requiresPreferences || hasPreferencesSchema,
    hasRoute: true, // À vérifier manuellement dans registry.ts
    hasTests,
    needsCompletion,
    missingElements
  };
}

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║    VÉRIFICATION DE LA COMPLÉTUDE DES MODULES                 ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

const results: ModuleStatus[] = ALL_MODULES.map(checkModule);

// Afficher les résultats
console.log('Modules incomplets:\n');
const incompleteModules = results.filter(r => r.needsCompletion);

if (incompleteModules.length === 0) {
  console.log('✅ Tous les modules sont complets!\n');
} else {
  incompleteModules.forEach(module => {
    console.log(`❌ ${module.name}`);
    console.log(`   Éléments manquants: ${module.missingElements.join(', ')}`);
    console.log('');
  });
}

console.log(`\nRésumé: ${incompleteModules.length}/${ALL_MODULES.length} modules nécessitent une attention\n`);

// Liste des modules nécessitant des schémas de préférences
console.log('Modules nécessitant un schéma de préférences dans SCHEMA.ts:');
PREFERENCE_REQUIRED_MODULES.forEach(m => console.log(`  - ${m}`));
