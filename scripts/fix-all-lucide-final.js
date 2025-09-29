#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all files recursively
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

// Fix imports in a single file
function fixLucideImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Skip if already uses @/lib/icons
    if (content.includes('@/lib/icons')) {
      return false;
    }
    
    // Replace all lucide-react imports
    const patterns = [
      {
        from: /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]lucide-react['"];?/g,
        to: (match, imports) => `import { ${imports} } from '@/lib/icons';`
      },
      {
        from: /import\s+(\w+)\s+from\s*['"]lucide-react['"];?/g,
        to: (match, importName) => `import { ${importName} } from '@/lib/icons';`
      }
    ];
    
    for (const pattern of patterns) {
      const newContent = content.replace(pattern.from, pattern.to);
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error with ${filePath}: ${error.message}`);
    return false;
  }
}

// Main execution
console.log('🚀 Running comprehensive lucide-react import fix...');

const srcPath = path.join(process.cwd(), 'src');
const allFiles = getAllFiles(srcPath);

let fixedCount = 0;
for (const file of allFiles) {
  if (fixLucideImports(file)) {
    fixedCount++;
  }
}

console.log(`\n🎉 Successfully fixed ${fixedCount} files!`);
console.log('All lucide-react imports have been redirected to @/lib/icons');