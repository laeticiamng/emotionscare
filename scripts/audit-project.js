
#!/usr/bin/env node

/**
 * Audit automatisé du projet EmotionsCare
 * Analyse les composants, pages, APIs et fonctionnalités
 */

const fs = require('fs');
const path = require('path');

// Fonctionnalités requises selon le ticket
const REQUIRED_FEATURES = [
  'Boss Level Grit',
  'Mood Mixer', 
  'Ambition Arcade',
  'Bounce-Back Battle',
  'Story Synth Lab',
  'Flash Glow',
  'Filtres Visage AR',
  'Bubble-Beat',
  'Screen-Silk Break',
  'VR Galactique',
  'Instant Glow Widget',
  'Weekly Bars',
  'Heatmap Vibes',
  'Journal Voix/Texte',
  'Musicothérapie',
  'Scan Émotionnel',
  'Gamification',
  'VR Respiration',
  'Breathwork 4-6-8',
  'Privacy Toggles',
  'Export CSV',
  'Suppression Compte',
  'Health-check Badge',
  'Onboarding Flow',
  'Notifications & Rappels',
  'Centre d\'Aide & FAQ',
  'Paramètres de Profil',
  'Historique d\'Activité',
  'Feedback in-App'
];

console.log('🔍 AUDIT EMOTIONSCARE - État du projet\n');

// 1. Analyse de la structure des fichiers
function analyzeFileStructure() {
  console.log('📁 STRUCTURE DES FICHIERS');
  console.log('='.repeat(50));
  
  const srcPath = './src';
  const structure = {
    pages: [],
    components: [],
    hooks: [],
    services: [],
    contexts: []
  };
  
  function scanDirectory(dir, type) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      items.forEach(item => {
        if (item.isDirectory()) {
          scanDirectory(path.join(dir, item.name), type);
        } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
          structure[type].push(path.join(dir, item.name));
        }
      });
    } catch (error) {
      console.log(`⚠️ Erreur lecture ${dir}: ${error.message}`);
    }
  }
  
  // Scanner les dossiers principaux
  ['pages', 'components', 'hooks', 'services', 'contexts'].forEach(folder => {
    const folderPath = path.join(srcPath, folder);
    if (fs.existsSync(folderPath)) {
      scanDirectory(folderPath, folder);
    }
  });
  
  Object.entries(structure).forEach(([type, files]) => {
    console.log(`${type.toUpperCase()}: ${files.length} fichiers`);
    files.slice(0, 5).forEach(file => console.log(`  - ${file}`));
    if (files.length > 5) console.log(`  ... et ${files.length - 5} autres`);
    console.log('');
  });
  
  return structure;
}

// 2. Analyse des endpoints API
function analyzeAPIEndpoints() {
  console.log('🌐 ENDPOINTS API');
  console.log('='.repeat(50));
  
  try {
    const endpointsFile = './src/services/api/endpoints.ts';
    if (fs.existsSync(endpointsFile)) {
      const content = fs.readFileSync(endpointsFile, 'utf8');
      const endpoints = content.match(/[A-Z_]+:\s*{[^}]+}/g) || [];
      
      console.log(`✅ Fichier endpoints trouvé: ${endpoints.length} sections`);
      endpoints.forEach(endpoint => {
        const name = endpoint.match(/([A-Z_]+):/)[1];
        const routes = endpoint.match(/'[^']+'/g) || [];
        console.log(`  ${name}: ${routes.length} routes`);
      });
    } else {
      console.log('❌ Fichier endpoints.ts non trouvé');
    }
  } catch (error) {
    console.log(`⚠️ Erreur analyse API: ${error.message}`);
  }
  console.log('');
}

// 3. Analyse des composants existants
function analyzeComponents(structure) {
  console.log('🧩 COMPOSANTS EXISTANTS');
  console.log('='.repeat(50));
  
  const componentsByCategory = {
    emotions: [],
    dashboard: [],
    ui: [],
    charts: [],
    layout: [],
    coach: [],
    other: []
  };
  
  structure.components.forEach(file => {
    const filename = path.basename(file);
    if (filename.includes('Emotion') || filename.includes('Mood')) {
      componentsByCategory.emotions.push(filename);
    } else if (filename.includes('Dashboard') || filename.includes('Grid')) {
      componentsByCategory.dashboard.push(filename);
    } else if (filename.includes('Chart') || filename.includes('Graph')) {
      componentsByCategory.charts.push(filename);
    } else if (filename.includes('Layout') || filename.includes('Shell') || filename.includes('Nav')) {
      componentsByCategory.layout.push(filename);
    } else if (filename.includes('Coach') || filename.includes('Avatar')) {
      componentsByCategory.coach.push(filename);
    } else if (file.includes('/ui/')) {
      componentsByCategory.ui.push(filename);
    } else {
      componentsByCategory.other.push(filename);
    }
  });
  
  Object.entries(componentsByCategory).forEach(([category, components]) => {
    if (components.length > 0) {
      console.log(`${category.toUpperCase()}: ${components.length} composants`);
      components.forEach(comp => console.log(`  - ${comp}`));
      console.log('');
    }
  });
  
  return componentsByCategory;
}

// 4. Vérification des fonctionnalités requises
function checkRequiredFeatures(structure, components) {
  console.log('📋 FONCTIONNALITÉS REQUISES');
  console.log('='.repeat(50));
  
  const implemented = [];
  const missing = [];
  
  REQUIRED_FEATURES.forEach(feature => {
    const searchTerms = feature.toLowerCase().split(/[\s-]+/);
    let found = false;
    
    // Chercher dans les noms de fichiers
    [...structure.pages, ...structure.components].forEach(file => {
      const filename = file.toLowerCase();
      if (searchTerms.some(term => filename.includes(term))) {
        found = true;
      }
    });
    
    if (found) {
      implemented.push(feature);
    } else {
      missing.push(feature);
    }
  });
  
  console.log(`✅ IMPLÉMENTÉES (${implemented.length}):`);
  implemented.forEach(feat => console.log(`  - ${feat}`));
  
  console.log(`\n❌ MANQUANTES (${missing.length}):`);
  missing.forEach(feat => console.log(`  - ${feat}`));
  
  console.log(`\n📊 PROGRESSION: ${Math.round((implemented.length / REQUIRED_FEATURES.length) * 100)}%\n`);
  
  return { implemented, missing };
}

// 5. Analyse de la configuration build
function analyzeBuildConfig() {
  console.log('⚙️ CONFIGURATION BUILD');
  console.log('='.repeat(50));
  
  const configs = [
    { name: 'package.json', path: './package.json' },
    { name: 'vite.config.ts', path: './vite.config.ts' },
    { name: 'tsconfig.json', path: './tsconfig.json' },
    { name: 'tailwind.config.js', path: './tailwind.config.js' }
  ];
  
  configs.forEach(config => {
    if (fs.existsSync(config.path)) {
      console.log(`✅ ${config.name} trouvé`);
    } else {
      console.log(`❌ ${config.name} manquant`);
    }
  });
  
  // Vérifier les scripts Bun
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    console.log('\n📜 Scripts disponibles:');
    Object.keys(packageJson.scripts || {}).forEach(script => {
      console.log(`  - ${script}`);
    });
    
    console.log('\n🔧 Gestionnaire de paquets détecté:');
    if (fs.existsSync('./bun.lockb')) {
      console.log('  ✅ Bun (bun.lockb présent)');
    } else if (fs.existsSync('./package-lock.json')) {
      console.log('  ⚠️ npm (package-lock.json présent)');
    } else {
      console.log('  ❓ Indéterminé');
    }
  } catch (error) {
    console.log(`⚠️ Erreur lecture package.json: ${error.message}`);
  }
  
  console.log('');
}

// 6. Recommandations
function generateRecommendations(analysis) {
  console.log('💡 RECOMMANDATIONS');
  console.log('='.repeat(50));
  
  console.log('PRIORITÉ HAUTE:');
  analysis.missing.slice(0, 5).forEach(feat => {
    console.log(`  🔴 Implémenter: ${feat}`);
  });
  
  console.log('\nPRIORITÉ MOYENNE:');
  if (analysis.missing.length > 5) {
    analysis.missing.slice(5, 10).forEach(feat => {
      console.log(`  🟡 Implémenter: ${feat}`);
    });
  }
  
  console.log('\nACTIONS TECHNIQUES:');
  console.log('  🔧 Nettoyer les scripts force-npm');
  console.log('  🔧 Configurer CI pour Bun');
  console.log('  🔧 Ajouter tests E2E Cypress');
  console.log('  🔧 Audit Lighthouse automatisé');
  console.log('  📚 Mettre à jour README');
  
  console.log('');
}

// Exécution de l'audit
async function runAudit() {
  try {
    const structure = analyzeFileStructure();
    analyzeAPIEndpoints();
    const components = analyzeComponents(structure);
    const featureAnalysis = checkRequiredFeatures(structure, components);
    analyzeBuildConfig();
    generateRecommendations(featureAnalysis);
    
    console.log('🎯 AUDIT TERMINÉ');
    console.log('='.repeat(50));
    console.log('Rapport généré avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur durant l\'audit:', error);
    process.exit(1);
  }
}

runAudit();
