#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 ANALYSE DES DOUBLONS - Modules & Edge Functions');
console.log('=' .repeat(60) + '\n');

// Fonction pour lire un répertoire récursivement
function scanDirectory(dir) {
  const files = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push({ name: entry.name, path: fullPath, type: 'dir' });
      }
    }
  } catch (error) {
    // Ignorer les erreurs
  }
  return files;
}

// Analyser les modules frontend
console.log('📂 MODULES FRONTEND (src/modules/)');
console.log('-'.repeat(60));
const modules = scanDirectory('src/modules');
const moduleNames = modules.map(m => m.name.toLowerCase());

// Grouper les modules similaires
const moduleGroups = {};
moduleNames.forEach((name, idx) => {
  const baseName = name.replace(/-/g, '');
  if (!moduleGroups[baseName]) {
    moduleGroups[baseName] = [];
  }
  moduleGroups[baseName].push(modules[idx].name);
});

// Afficher les doublons potentiels
const moduleDuplicates = Object.entries(moduleGroups)
  .filter(([_, names]) => names.length > 1)
  .map(([base, names]) => ({ base, names }));

if (moduleDuplicates.length > 0) {
  console.log('⚠️  Doublons potentiels détectés:\n');
  moduleDuplicates.forEach(({ base, names }) => {
    console.log(`  🔸 Base: "${base}"`);
    names.forEach(name => console.log(`     - src/modules/${name}/`));
    console.log('');
  });
} else {
  console.log('✅ Aucun doublon détecté\n');
}

// Analyser les edge functions
console.log('\n' + '='.repeat(60));
console.log('⚡ EDGE FUNCTIONS (supabase/functions/)');
console.log('-'.repeat(60));
const functions = scanDirectory('supabase/functions').filter(f => f.name !== '_shared' && f.name !== 'README.md');
const functionNames = functions.map(f => f.name.toLowerCase());

// Grouper les fonctions similaires
const functionGroups = {};
functionNames.forEach((name, idx) => {
  // Normaliser le nom en retirant les préfixes communs
  let normalized = name
    .replace(/^(ai-|b2b-|b2c-|openai-|emotion-|hume-|music-)/g, '')
    .replace(/-/g, '');
  
  if (!functionGroups[normalized]) {
    functionGroups[normalized] = [];
  }
  functionGroups[normalized].push(functions[idx].name);
});

// Afficher les doublons potentiels
const functionDuplicates = Object.entries(functionGroups)
  .filter(([_, names]) => names.length > 1)
  .map(([base, names]) => ({ base, names }));

if (functionDuplicates.length > 0) {
  console.log('⚠️  Doublons potentiels détectés:\n');
  functionDuplicates.forEach(({ base, names }) => {
    console.log(`  🔸 Base: "${base}"`);
    names.forEach(name => console.log(`     - supabase/functions/${name}/`));
    console.log('');
  });
} else {
  console.log('✅ Aucun doublon détecté\n');
}

// Analyser les patterns spécifiques
console.log('\n' + '='.repeat(60));
console.log('🎯 PATTERNS SPÉCIFIQUES');
console.log('-'.repeat(60));

// Coach patterns
const coachFunctions = functionNames.filter(n => n.includes('coach'));
if (coachFunctions.length > 0) {
  console.log('\n🤖 Fonctions Coach:');
  coachFunctions.forEach(name => console.log(`  - ${name}`));
}

// Analytics patterns
const analyticsFunctions = functionNames.filter(n => n.includes('analytic') || n.includes('insight'));
if (analyticsFunctions.length > 0) {
  console.log('\n📊 Fonctions Analytics:');
  analyticsFunctions.forEach(name => console.log(`  - ${name}`));
}

// Journal patterns
const journalFunctions = functionNames.filter(n => n.includes('journal'));
if (journalFunctions.length > 0) {
  console.log('\n📝 Fonctions Journal:');
  journalFunctions.forEach(name => console.log(`  - ${name}`));
}

// Music patterns
const musicFunctions = functionNames.filter(n => n.includes('music'));
if (musicFunctions.length > 0) {
  console.log('\n🎵 Fonctions Music:');
  musicFunctions.forEach(name => console.log(`  - ${name}`));
}

// Emotion patterns
const emotionFunctions = functionNames.filter(n => n.includes('emotion'));
if (emotionFunctions.length > 0) {
  console.log('\n😊 Fonctions Emotion:');
  emotionFunctions.forEach(name => console.log(`  - ${name}`));
}

// B2B patterns
const b2bFunctions = functionNames.filter(n => n.startsWith('b2b-'));
console.log(`\n🏢 Fonctions B2B: ${b2bFunctions.length} fonctions`);

// B2C patterns
const b2cFunctions = functionNames.filter(n => n.startsWith('b2c-'));
console.log(`👤 Fonctions B2C: ${b2cFunctions.length} fonctions`);

// Statistiques finales
console.log('\n' + '='.repeat(60));
console.log('📊 STATISTIQUES');
console.log('-'.repeat(60));
console.log(`Total modules frontend: ${modules.length}`);
console.log(`Total edge functions: ${functions.length}`);
console.log(`Doublons modules détectés: ${moduleDuplicates.length}`);
console.log(`Doublons functions détectés: ${functionDuplicates.length}`);
console.log('\n✅ Analyse terminée\n');
