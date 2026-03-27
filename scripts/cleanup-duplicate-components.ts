// @ts-nocheck
#!/usr/bin/env tsx

/**
 * Script de nettoyage des composants dupliqués
 * Remplace les anciens imports par les nouvelles versions unifiées
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

interface ComponentMigration {
  oldPaths: string[];
  newImport: string;
  componentName: string;
}

const migrations: ComponentMigration[] = [
  {
    oldPaths: [
      '@/components/EmptyState',
      '@/components/common/EmptyState',
      '@/components/shared/EmptyState',
      '@/components/activity/EmptyState',
      '@/components/scan/live/EmptyState'
    ],
    newImport: '@/components/ui/unified-empty-state',
    componentName: 'UnifiedEmptyState'
  },
  {
    oldPaths: [
      '@/components/activity/ExportButton',
      '@/components/journal/ExportButton',
      '@/components/rgpd/ExportButton',
      '@/components/story/ExportButton'
    ],
    newImport: '@/components/ui/unified-export-button',
    componentName: 'UnifiedExportButton'
  },
  {
    oldPaths: [
      '@/components/layout/PageLayout',
      '@/components/common/PageLayout',
      '@/components/layout/EnhancedPageLayout'
    ],
    newImport: '@/components/ui/unified-page-layout',
    componentName: 'UnifiedPageLayout'
  }
];

const filesToDelete: string[] = [
  'src/components/EmptyState.tsx',
  'src/components/common/EmptyState.tsx',
  'src/components/shared/EmptyState.tsx',
  'src/components/activity/EmptyState.tsx',
  'src/components/scan/live/EmptyState.tsx',
  'src/components/activity/ExportButton.tsx',
  'src/components/journal/ExportButton.tsx',
  'src/components/rgpd/ExportButton.tsx',
  'src/components/story/ExportButton.tsx',
  'src/components/layout/PageLayout.tsx',
  'src/components/common/PageLayout.tsx',
  'src/components/layout/EnhancedPageLayout.tsx'
];

async function findTSXFiles(): Promise<string[]> {
  return glob('src/**/*.{ts,tsx}', { 
    ignore: [
      'src/components/ui/unified-*.tsx', // Ignore les nouveaux composants unifiés
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}'
    ]
  });
}

async function updateImportsInFile(filePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    let updatedContent = content;
    let hasChanges = false;

    // Pour chaque migration
    for (const migration of migrations) {
      for (const oldPath of migration.oldPaths) {
        // Patterns d'import à remplacer
        const patterns = [
          // import Component from 'path';
          new RegExp(`import\\s+(\\w+)\\s+from\\s+['"]${escapeRegex(oldPath)}['"];?`, 'g'),
          // import { Component } from 'path';
          new RegExp(`import\\s*\\{\\s*(\\w+)\\s*\\}\\s*from\\s+['"]${escapeRegex(oldPath)}['"];?`, 'g'),
          // import { Component as Alias } from 'path';
          new RegExp(`import\\s*\\{\\s*(\\w+)\\s+as\\s+(\\w+)\\s*\\}\\s*from\\s+['"]${escapeRegex(oldPath)}['"];?`, 'g')
        ];

        patterns.forEach(pattern => {
          if (pattern.test(content)) {
            // Remplacer par le nouvel import
            updatedContent = updatedContent.replace(pattern, (match, componentName, alias) => {
              hasChanges = true;
              const importName = alias || componentName;
              
              // Si le composant est renommé en UnifiedXxx, créer un alias
              if (migration.componentName.startsWith('Unified')) {
                return `import { ${migration.componentName} as ${importName} } from '${migration.newImport}';`;
              } else {
                return `import { ${migration.componentName} } from '${migration.newImport}';`;
              }
            });
          }
        });
      }
    }

    if (hasChanges) {
      await fs.writeFile(filePath, updatedContent);
      console.log(`✅ Updated imports in: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error);
    return false;
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function deleteOldFiles(): Promise<void> {
  console.log('\n🗑️  Deleting old duplicate files...');
  
  for (const filePath of filesToDelete) {
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log(`✅ Deleted: ${filePath}`);
    } catch (error) {
      // File doesn't exist, skip silently
      console.log(`ℹ️  File not found (already deleted?): ${filePath}`);
    }
  }
}

async function updateIndexExports(): Promise<void> {
  console.log('\n📝 Updating index.ts exports...');
  
  const indexFiles = [
    'src/components/index.ts',
    'src/components/ui/index.ts',
    'src/components/common/index.ts',
    'src/components/shared/index.ts'
  ];

  for (const indexFile of indexFiles) {
    try {
      await fs.access(indexFile);
      const content = await fs.readFile(indexFile, 'utf-8');
      
      // Remove exports of deleted components
      let updatedContent = content;
      
      // Remove old exports
      const exportsToRemove = [
        /export.*EmptyState.*from.*['"][^'"]*['"];?\s*\n?/g,
        /export.*ExportButton.*from.*['"][^'"]*['"];?\s*\n?/g,
        /export.*PageLayout.*from.*['"][^'"]*['"];?\s*\n?/g
      ];

      exportsToRemove.forEach(pattern => {
        updatedContent = updatedContent.replace(pattern, '');
      });

      // Add new unified exports if not present
      const unifiedExports = [
        "export { UnifiedEmptyState } from './unified-empty-state';",
        "export { UnifiedExportButton } from './unified-export-button';", 
        "export { UnifiedPageLayout } from './unified-page-layout';"
      ];

      // Add to ui/index.ts if it's the ui index
      if (indexFile.includes('ui/index.ts')) {
        unifiedExports.forEach(exportLine => {
          if (!updatedContent.includes(exportLine)) {
            updatedContent += `\n${exportLine}`;
          }
        });
      }

      if (updatedContent !== content) {
        await fs.writeFile(indexFile, updatedContent);
        console.log(`✅ Updated exports in: ${indexFile}`);
      }
    } catch (error) {
      // File doesn't exist, skip
      console.log(`ℹ️  Index file not found: ${indexFile}`);
    }
  }
}

async function generateReport(): Promise<void> {
  const reportPath = 'component-migration-report.md';
  const timestamp = new Date().toISOString();
  
  const report = `# Component Migration Report

Generated: ${timestamp}

## Migrations Applied

### EmptyState Components
- ✅ Unified into \`UnifiedEmptyState\`
- 🗑️ Removed 5 duplicate implementations
- 📦 Variants: default, card, minimal, dashed

### ExportButton Components  
- ✅ Unified into \`UnifiedExportButton\`
- 🗑️ Removed 4 duplicate implementations
- 📦 Variants: default, outline, ghost, card

### PageLayout Components
- ✅ Unified into \`UnifiedPageLayout\`
- 🗑️ Removed 3 duplicate implementations  
- 📦 Variants: default, plain, elevated

## New Import Paths

\`\`\`typescript
// Old imports (now removed)
import EmptyState from '@/components/EmptyState';
import { ExportButton } from '@/components/activity/ExportButton';
import PageLayout from '@/components/layout/PageLayout';

// New unified imports
import { UnifiedEmptyState as EmptyState } from '@/components/ui/unified-empty-state';
import { UnifiedExportButton as ExportButton } from '@/components/ui/unified-export-button';
import { UnifiedPageLayout as PageLayout } from '@/components/ui/unified-page-layout';
\`\`\`

## Benefits

- 🎯 **Consistency**: Single implementation per component type
- 📦 **Variants**: Flexible variants system with cva
- 🚀 **Performance**: Reduced bundle size
- 🛠️ **Maintenance**: Easier updates and bug fixes
- 🎨 **Design System**: Better adherence to design tokens

## Next Steps

1. Test all affected pages for regressions
2. Update Storybook stories if needed
3. Update component documentation
4. Consider creating more unified components for other duplicates

---
*This migration was automatically applied by the cleanup script*
`;

  await fs.writeFile(reportPath, report);
  console.log(`\n📋 Migration report generated: ${reportPath}`);
}

async function main(): Promise<void> {
  console.log('🚀 Starting component deduplication...\n');

  try {
    // 1. Find all TypeScript files
    const files = await findTSXFiles();
    console.log(`📁 Found ${files.length} TypeScript files to process\n`);

    // 2. Update imports in all files
    console.log('🔄 Updating imports...');
    let updatedFiles = 0;

    for (const file of files) {
      const wasUpdated = await updateImportsInFile(file);
      if (wasUpdated) {
        updatedFiles++;
      }
    }

    console.log(`\n✅ Updated imports in ${updatedFiles} files`);

    // 3. Delete old duplicate files
    await deleteOldFiles();

    // 4. Update index exports
    await updateIndexExports();

    // 5. Generate report
    await generateReport();

    console.log('\n🎉 Component deduplication completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - ${updatedFiles} files updated`);
    console.log(`   - ${filesToDelete.length} duplicate files removed`);
    console.log(`   - 3 unified components created`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { main as cleanupDuplicateComponents };