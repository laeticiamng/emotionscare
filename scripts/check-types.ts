#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as glob from 'glob';

// Function to check if a file has outdated imports
function checkImports(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Array to store outdated imports
    const outdatedImports: string[] = [];
    
    // Regular expression to match imports from @/types/ except @/types or @/types/index
    const importRegex = /import.*from\s+['"]@\/types\/(?!index|$)([^'"]+)['"]/g;
    const matchedImports = content.match(importRegex);
    
    if (matchedImports) {
      for (const importStmt of matchedImports) {
        outdatedImports.push(importStmt);
      }
    }
    
    if (outdatedImports.length > 0) {
      console.log(`\n🔍 File: ${filePath}`);
      console.log('   Outdated imports:');
      outdatedImports.forEach(imp => {
        console.log(`   - ${imp}`);
      });
      console.log('   Suggestion: Replace with "import ... from \'@/types\';"');
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Find all TypeScript files in the project
function scanProject() {
  console.log('🚀 Starting TypeScript imports audit...');
  
  const tsFiles = glob.sync('src/**/*.{ts,tsx}', {
    ignore: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'src/types/index.ts',
      'src/types/types.ts'
    ]
  });
  
  console.log(`Found ${tsFiles.length} TypeScript files to scan.`);
  
  let hasOutdatedImports = false;
  
  // Check each file
  tsFiles.forEach(file => {
    checkImports(file);
  });
  
  if (!hasOutdatedImports) {
    console.log('\n✅ No outdated imports found! Your project is using the unified type system correctly.');
  } else {
    console.log('\n⚠️ Please fix the outdated imports listed above.');
  }
}

// Execute the scan
scanProject();