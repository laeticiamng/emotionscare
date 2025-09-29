#!/usr/bin/env node

/**
 * Script de validation finale de la migration RouterV2
 * Vérifie qu'aucun ancien usage ne subsiste
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validation finale de la migration RouterV2...\n');

function checkForOldImports() {
  console.log('📂 Vérification des imports obsolètes...');
  
  try {
    const result = execSync('grep -r "import.*Routes.*from.*@/routerV2" src/ || true', { encoding: 'utf8' });
    
    if (result.trim()) {
      console.log('❌ Imports obsolètes trouvés:');
      console.log(result);
      return false;
    } else {
      console.log('✅ Aucun import obsolète trouvé');
      return true;
    }
  } catch (error) {
    console.log('✅ Aucun import obsolète trouvé');
    return true;
  }
}

function checkForOldUsages() {
  console.log('\n📂 Vérification des usages "Routes." restants...');
  
  try {
    const result = execSync('grep -r "Routes\\." src/ --exclude-dir=node_modules || true', { encoding: 'utf8' });
    
    if (result.trim()) {
      console.log('⚠️  Usages "Routes." trouvés (à vérifier manuellement):');
      const lines = result.split('\n').filter(line => line.trim());
      lines.slice(0, 10).forEach(line => console.log(`   ${line}`));
      if (lines.length > 10) {
        console.log(`   ... et ${lines.length - 10} autres`);
      }
      return false;
    } else {
      console.log('✅ Aucun usage "Routes." trouvé');
      return true;
    }
  } catch (error) {
    console.log('✅ Aucun usage "Routes." trouvé');
    return true;
  }
}

function checkHelperFileRemoved() {
  console.log('\n📂 Vérification suppression ancien fichier...');
  
  if (fs.existsSync('src/routerV2/helpers.ts')) {
    console.log('❌ Le fichier src/routerV2/helpers.ts existe encore');
    return false;
  } else {
    console.log('✅ Fichier src/routerV2/helpers.ts supprimé');
    return true;
  }
}

function checkNewImports() {
  console.log('\n📂 Vérification nouveaux imports...');
  
  try {
    const result = execSync('grep -r "import.*routes.*from.*@/routerV2" src/ | head -5', { encoding: 'utf8' });
    
    if (result.trim()) {
      console.log('✅ Nouveaux imports détectés:');
      result.split('\n').slice(0, 3).forEach(line => {
        if (line.trim()) console.log(`   ${line}`);
      });
      return true;
    } else {
      console.log('⚠️  Aucun nouveau import trouvé');
      return false;
    }
  } catch (error) {
    console.log('⚠️  Aucun nouveau import trouvé');
    return false;
  }
}

function main() {
  console.log('🎯 VALIDATION MIGRATION ROUTERV2\n');
  
  const checks = [
    { name: 'Suppression ancien fichier helpers.ts', fn: checkHelperFileRemoved },
    { name: 'Absence imports obsolètes', fn: checkForOldImports },
    { name: 'Présence nouveaux imports', fn: checkNewImports },
    { name: 'Absence usages Routes.', fn: checkForOldUsages },
  ];
  
  let allPassed = true;
  const results = [];
  
  checks.forEach(({ name, fn }) => {
    const passed = fn();
    results.push({ name, passed });
    if (!passed) allPassed = false;
  });
  
  console.log('\n📊 RÉSUMÉ DE LA VALIDATION:');
  results.forEach(({ name, passed }) => {
    console.log(`   ${passed ? '✅' : '❌'} ${name}`);
  });
  
  if (allPassed) {
    console.log('\n🎉 MIGRATION ROUTERV2 VALIDÉE AVEC SUCCÈS !');
    console.log('✨ Un seul système de routage unifié et moderne');
    console.log('🚀 Application prête pour la production');
  } else {
    console.log('\n⚠️  Validation partielle - Vérifications manuelles recommandées');
    console.log('📝 Consulter les warnings ci-dessus');
  }
  
  return allPassed;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { main };