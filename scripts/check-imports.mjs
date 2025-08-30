#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function walkFiles(dir, ext = '.tsx') {
  if (!fs.existsSync(dir)) return [];
  
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(dirent => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      return walkFiles(fullPath, ext);
    }
    return dirent.name.endsWith(ext) ? [fullPath] : [];
  });
}

function checkImports() {
  console.log('🔍 Checking import consistency...');
  
  const files = [
    ...walkFiles('src', '.ts'),
    ...walkFiles('src', '.tsx')
  ];
  
  let hasErrors = false;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Check for deep path imports (forbidden)
        if (line.includes('import') && line.includes('../../../')) {
          console.error(`❌ Deep import in ${file}:${index + 1}`);
          console.error(`   ${line.trim()}`);
          hasErrors = true;
        }
        
        // Check for direct ui imports (should use barrel)
        if (line.includes('import') && line.match(/from ['"]@\/components\/ui\/[^'"]+['"]/)) {
          if (!line.includes('from "@/components/ui"')) {
            console.warn(`⚠️  Direct UI import in ${file}:${index + 1}`);
            console.warn(`   ${line.trim()}`);
          }
        }
        
        // Check for missing default exports in Page files
        if (file.endsWith('Page.tsx') && line.includes('export default')) {
          // Good - has default export
        }
      });
      
      // Check that Page files have default exports
      if (file.endsWith('Page.tsx') && !content.includes('export default')) {
        console.error(`❌ Missing default export in ${file}`);
        hasErrors = true;
      }
      
    } catch (error) {
      console.error(`❌ Error reading ${file}:`, error.message);
      hasErrors = true;
    }
  }
  
  if (hasErrors) {
    console.error('\n❌ Import check failed');
    process.exit(1);
  } else {
    console.log('✅ All imports are valid');
  }
}

checkImports();