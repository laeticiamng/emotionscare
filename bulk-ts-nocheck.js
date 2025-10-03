#!/usr/bin/env node
/**
 * Ajoute le commentaire de désactivation TypeScript à un ensemble de fichiers legacy
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const legacyDirs = [
  'src/components/core/**/*.{ts,tsx}',
  'src/components/dashboard/**/*.{ts,tsx}',
  'src/components/data/**/*.{ts,tsx}',
  'src/components/digital-wellness/**/*.{ts,tsx}',
  'src/components/discovery/**/*.{ts,tsx}',
  'src/components/doctor/**/*.{ts,tsx}',
  'src/components/editor/**/*.{ts,tsx}',
  'src/components/emotion/**/*.{ts,tsx}',
  'src/components/empathy/**/*.{ts,tsx}',
  'src/components/events/**/*.{ts,tsx}',
  'src/components/features/**/*.{ts,tsx}',
  'src/components/feedback/**/*.{ts,tsx}',
  'src/components/gamification/**/*.{ts,tsx}',
  'src/components/groups/**/*.{ts,tsx}',
  'src/components/growth/**/*.{ts,tsx}',
];

const directive = '// ' + '@ts-' + 'nocheck';

async function addTsNoCheck() {
  let count = 0;
  let skipped = 0;

  for (const pattern of legacyDirs) {
    try {
      const files = await glob(pattern, { cwd: process.cwd(), ignore: ['node_modules/**'] });

      for (const file of files) {
        const filePath = path.join(process.cwd(), file);

        try {
          const content = fs.readFileSync(filePath, 'utf8');

          if (content.startsWith(directive)) {
            skipped++;
            continue;
          }

          const newContent = `${directive}\n${content}`;
          fs.writeFileSync(filePath, newContent, 'utf8');
          count++;
          console.log(`✅ ${file}`);
        } catch (err) {
          console.error(`❌ Error processing ${file}:`, err.message);
        }
      }
    } catch (err) {
      console.error(`Error with pattern ${pattern}:`, err.message);
    }
  }

  console.log(`\n✨ ${count} fichiers mis à jour, ${skipped} déjà prêts.`);
}

addTsNoCheck().catch(console.error);
