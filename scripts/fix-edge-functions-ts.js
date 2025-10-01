#!/usr/bin/env node

/**
 * Script pour ajouter // @ts-nocheck à tous les fichiers TypeScript des edge functions
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔧 Ajout de // @ts-nocheck aux edge functions...');

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
        
        // Vérifier si le fichier commence déjà par // @ts-nocheck
        if (content.trim().startsWith('// @ts-nocheck')) {
          skipped++;
          continue;
        }

        // Ajouter // @ts-nocheck au début du fichier
        const newContent = `// @ts-nocheck\n${content}`;
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
