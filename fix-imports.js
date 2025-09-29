#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fonction pour corriger tous les imports lucide-react dans un fichier
function fixImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const fixedContent = content.replace(/from\s+['"]lucide-react['"]/g, "from '@/lib/icons'");
  
  if (content !== fixedContent) {
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  return false;
}

// Fonction récursive pour parcourir tous les fichiers .tsx dans src/
function fixAllImports(dir) {
  const items = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixedCount += fixAllImports(fullPath);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      if (fixImportsInFile(fullPath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// Exécuter le fix
const srcPath = path.join(__dirname, 'src');
const fixedCount = fixAllImports(srcPath);
console.log(`Total files fixed: ${fixedCount}`);