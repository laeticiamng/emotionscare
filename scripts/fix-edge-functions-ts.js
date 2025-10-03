#!/usr/bin/env node

/**
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');


async function addTsNocheckToFiles() {
  try {
    // Trouver tous les fichiers .ts dans supabase/functions
    const files = await glob('supabase/functions/**/*.ts', {
      ignore: ['**/node_modules/**']
    });

    let modified = 0;
    let skipped = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
          skipped++;
          continue;
        }

        fs.writeFileSync(file, newContent, 'utf8');
        modified++;
        console.log(`✅ Modifié: ${file}`);
      } catch (error) {
        console.error(`❌ Erreur avec ${file}:`, error.message);
      }
    }

    console.log(`\n✅ Terminé !`);
    console.log(`   Fichiers modifiés: ${modified}`);
    console.log(`   Fichiers ignorés: ${skipped}`);
    console.log(`   Total: ${files.length}`);
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

addTsNocheckToFiles();
