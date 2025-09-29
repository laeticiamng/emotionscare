#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Function to update imports in a single file
function updateFileImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Pattern to match lucide-react imports
    const lucideImportPattern = /import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]lucide-react['"];?/g;
    const defaultImportPattern = /import\s+(\w+)\s+from\s*['"]lucide-react['"];?/g;

    // Replace named imports
    content = content.replace(lucideImportPattern, (match, imports) => {
      hasChanges = true;
      return `import { ${imports} } from '@/lib/icons';`;
    });

    // Replace default imports
    content = content.replace(defaultImportPattern, (match, importName) => {
      hasChanges = true;
      return `import { ${importName} } from '@/lib/icons';`;
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🚀 Starting comprehensive lucide-react import fix...');

const srcPath = path.join(process.cwd(), 'src');
const allFiles = getAllFiles(srcPath);

let totalUpdated = 0;
allFiles.forEach((filePath) => {
  if (updateFileImports(filePath)) {
    totalUpdated++;
  }
});

console.log(`\n🎉 Completed! Updated ${totalUpdated} files.`);
console.log('📝 All lucide-react imports have been redirected to @/lib/icons');