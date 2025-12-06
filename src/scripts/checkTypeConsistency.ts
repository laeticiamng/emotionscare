
/**
 * Type Consistency Check Script
 * 
 * This script verifies that all the types used in the application are consistent
 * and that there are no duplicate or conflicting type definitions.
 */

import fs from 'fs';
import path from 'path';
import * as ts from 'typescript';

const PROJECT_ROOT = path.resolve(__dirname, '../..');

function findTypeDefinitions(directory: string, fileExtensions: string[]): string[] {
  const typeFiles: string[] = [];
  
  function scanDir(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        scanDir(fullPath);
      } else if (fileExtensions.some(ext => file.endsWith(ext))) {
        typeFiles.push(fullPath);
      }
    }
  }
  
  scanDir(directory);
  return typeFiles;
}

function analyzeTypeFiles(files: string[]): void {
  console.log(`Analyzing ${files.length} type files...`);
  
  // Create a map of type names to their definitions
  const typeDefinitions = new Map<string, { file: string; content: string }>();
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const sourceFile = ts.createSourceFile(
      file,
      content,
      ts.ScriptTarget.Latest,
      true
    );
    
    // Find interface and type declarations
    ts.forEachChild(sourceFile, node => {
      if (
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node)
      ) {
        const typeName = node.name.text;
        const range = { 
          pos: node.pos, 
          end: node.end 
        };
        
        const nodeText = content.substring(node.pos, node.end);
        
        if (typeDefinitions.has(typeName)) {
          console.warn(`⚠️  Duplicate type found: ${typeName}`);
          console.warn(`   - First defined in: ${typeDefinitions.get(typeName)!.file}`);
          console.warn(`   - Also defined in: ${file}`);
        } else {
          typeDefinitions.set(typeName, { file, content: nodeText });
        }
      }
    });
  }
  
  console.log(`Found ${typeDefinitions.size} unique type definitions.`);
}

// Main execution
console.log('Starting type consistency check...');
const typeFiles = findTypeDefinitions(path.join(PROJECT_ROOT, 'src'), ['.ts', '.tsx']);
analyzeTypeFiles(typeFiles);
console.log('Type consistency check completed.');
