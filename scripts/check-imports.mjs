#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src');

class ImportChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  async check() {
    console.log('🔍 Checking imports...');
    
    await this.walkDirectory(srcDir);
    
    if (this.errors.length > 0) {
      console.error('❌ Import errors found:');
      this.errors.forEach(error => console.error(`  - ${error}`));
      process.exit(1);
    }
    
    if (this.warnings.length > 0) {
      console.warn('⚠️  Import warnings:');
      this.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    console.log('✅ All imports are valid');
  }

  async walkDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        await this.walkDirectory(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        await this.checkFile(fullPath);
      }
    }
  }

  async checkFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lineNum = i + 1;
        
        // Check for import statements
        if (line.startsWith('import ')) {
          await this.validateImport(line, filePath, lineNum);
        }
      }
    } catch (error) {
      this.errors.push(`Failed to read ${filePath}: ${error.message}`);
    }
  }

  async validateImport(importLine, filePath, lineNum) {
    const relativeFile = path.relative(srcDir, filePath);
    
    // Extract import path
    const fromMatch = importLine.match(/from ['"]([^'"]+)['"];?/);
    if (!fromMatch) return;
    
    const importPath = fromMatch[1];
    
    // Skip external packages
    if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
      return;
    }
    
    // Check for deep imports (forbidden except for specific patterns)
    if (importPath.includes('/ui/') && !importPath.startsWith('@/components/ui/')) {
      this.errors.push(`${relativeFile}:${lineNum} - Deep import forbidden: ${importPath}`);
      return;
    }
    
    // Check for modules directory imports - should use barrel exports
    if (importPath.match(/@\/modules\/[^/]+\/[^/]+\//)) {
      this.errors.push(`${relativeFile}:${lineNum} - Deep module import forbidden, use barrel: ${importPath}`);
      return;
    }
    
    // Resolve the actual file path
    let resolvedPath;
    if (importPath.startsWith('@/')) {
      resolvedPath = path.join(srcDir, importPath.substring(2));
    } else {
      resolvedPath = path.resolve(path.dirname(filePath), importPath);
    }
    
    // Check if file exists (try various extensions)
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
    let found = false;
    
    for (const ext of extensions) {
      try {
        await fs.access(resolvedPath + ext);
        found = true;
        break;
      } catch {}
    }
    
    if (!found) {
      this.errors.push(`${relativeFile}:${lineNum} - Import not found: ${importPath}`);
    }
    
    // Check for default vs named import mismatches
    const hasDefault = importLine.includes('import ') && !importLine.includes('import {');
    const hasNamed = importLine.includes('import {');
    
    if (hasDefault && hasNamed) {
      // Mixed import is OK
    } else if (hasDefault) {
      // Check if the target actually has a default export
      await this.checkDefaultExport(resolvedPath, importPath, relativeFile, lineNum);
    }
  }

  async checkDefaultExport(resolvedPath, importPath, sourceFile, lineNum) {
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
    
    for (const ext of extensions) {
      try {
        const content = await fs.readFile(resolvedPath + ext, 'utf8');
        
        const hasDefaultExport = content.includes('export default') || 
                                content.includes('export { ') && content.includes(' as default');
        
        if (!hasDefaultExport) {
          this.warnings.push(`${sourceFile}:${lineNum} - Default import but no default export in: ${importPath}`);
        }
        return;
      } catch {}
    }
  }
}

const checker = new ImportChecker();
checker.check().catch(error => {
  console.error('❌ Import checker failed:', error);
  process.exit(1);
});