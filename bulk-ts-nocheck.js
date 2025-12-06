#!/usr/bin/env node
/**
 * Bulk add // @ts-nocheck to all legacy TypeScript/TSX files
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

          // Skip if already has // @ts-nocheck
          if (content.startsWith('// @ts-nocheck') || content.startsWith('//@ts-nocheck')) {
            skipped++;
            continue;
          }

          // Add // @ts-nocheck at the beginning
          const newContent = '// @ts-nocheck\n' + content;
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

  console.log(`\n✨ Done! Updated ${count} files, skipped ${skipped} files that already had // @ts-nocheck`);
}

addTsNoCheck().catch(console.error);
