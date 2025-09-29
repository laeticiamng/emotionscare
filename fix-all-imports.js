#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix all lucide-react imports in a file
function fixImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = content.replace(/from\s+['"]lucide-react['"]/g, "from '@/lib/icons'");
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`⚠️ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Recursive function to process all .tsx/.ts files in src/
function fixAllImports(dir) {
  const items = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    try {
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        fixedCount += fixAllImports(fullPath);
      } else if ((item.endsWith('.tsx') || item.endsWith('.ts')) && !item.includes('.d.ts')) {
        if (fixImportsInFile(fullPath)) {
          fixedCount++;
        }
      }
    } catch (error) {
      // Skip files that can't be accessed
      continue;
    }
  }
  
  return fixedCount;
}

// Execute the fix
console.log('🔄 Fixing all lucide-react imports...');
const srcPath = path.join(__dirname, 'src');
const fixedCount = fixAllImports(srcPath);
console.log(`🎯 Total files fixed: ${fixedCount}`);
console.log('✅ All lucide-react imports have been updated to use @/lib/icons');