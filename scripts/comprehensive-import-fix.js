#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to process a single file
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Skip files that already import from @/lib/icons
    if (content.includes('from \'@/lib/icons\'') || content.includes('from "@/lib/icons"')) {
      return false;
    }

    // Pattern to match lucide-react imports
    const patterns = [
      {
        regex: /import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]lucide-react['"];?\n?/g,
        replacement: (match, imports) => `import { ${imports} } from '@/lib/icons';\n`
      },
      {
        regex: /import\s+(\w+)\s+from\s*['"]lucide-react['"];?\n?/g,
        replacement: (match, importName) => `import { ${importName} } from '@/lib/icons';\n`
      }
    ];

    for (const pattern of patterns) {
      const newContent = content.replace(pattern.regex, pattern.replacement);
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
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Get all TypeScript files
function getAllTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      getAllTsFiles(fullPath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  
  return fileList;
}

console.log('🚀 Running comprehensive lucide-react import fix...');

const srcDir = path.join(process.cwd(), 'src');
const allFiles = getAllTsFiles(srcDir);

let fixedCount = 0;
for (const file of allFiles) {
  if (fixImportsInFile(file)) {
    fixedCount++;
  }
}

console.log(`🎉 Fixed ${fixedCount} files with lucide-react imports!`);