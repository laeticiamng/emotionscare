#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Replacement patterns for lucide-react imports
const replacements = [
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];?/g,
    replacement: 'import { $1 } from "@/lib/icons";'
  },
  {
    pattern: /import\s+(\w+)\s+from\s*['"]lucide-react['"];?/g,
    replacement: 'import { $1 } from "@/lib/icons";'
  }
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    replacements.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.log(`⚠️ Error with ${filePath}: ${error.message}`);
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    
    try {
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        processDirectory(fullPath);
      } else if ((item.endsWith('.tsx') || item.endsWith('.ts')) && !item.includes('.d.ts')) {
        processFile(fullPath);
      }
    } catch (error) {
      // Skip files that can't be accessed
      continue;
    }
  }
}

console.log('🔄 Replacing lucide-react imports...');
processDirectory('./src');
console.log('🎯 Replacement completed!');