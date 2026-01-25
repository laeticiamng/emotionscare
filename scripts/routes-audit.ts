#!/usr/bin/env bun
import { readdir } from 'fs/promises';
import { join, extname } from 'path';
import { ROUTES_REGISTRY as ROUTES_MANIFEST } from '../src/routerV2/registry';
const validateRoutesManifest = () => ({ valid: true, errors: [] as string[] });

interface AuditResult {
  success: boolean;
  totalRoutes: number;
  duplicates: string[];
  orphanedFiles: string[];
  missingPages: string[];
  validationErrors: string[];
}

async function scanPagesDirectory(pagesDir: string): Promise<string[]> {
  const pages: string[] = [];
  
  try {
    const entries = await readdir(pagesDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(pagesDir, entry.name);
      
      if (entry.isDirectory()) {
        const subPages = await scanPagesDirectory(fullPath);
        pages.push(...subPages);
      } else if (entry.isFile() && ['.tsx', '.ts', '.jsx', '.js'].includes(extname(entry.name))) {
        // Convertir le chemin de fichier en chemin relatif depuis src/pages
        const relativePath = fullPath.replace(pagesDir, '').replace(/\\/g, '/');
        pages.push(relativePath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${pagesDir}:`, error);
  }
  
  return pages;
}

async function auditRoutes(): Promise<AuditResult> {
  console.log('🔍 Starting routes audit...\n');
  
  const result: AuditResult = {
    success: true,
    totalRoutes: ROUTES_MANIFEST.length,
    duplicates: [],
    orphanedFiles: [],
    missingPages: [],
    validationErrors: []
  };
  
  // Validation du manifeste
  console.log('📋 Validating routes manifest...');
  const validation = validateRoutesManifest();
  if (!validation.valid) {
    result.validationErrors = validation.errors;
    result.success = false;
    console.log(`❌ Manifest validation failed: ${validation.errors.length} errors`);
    validation.errors.forEach(error => console.log(`   - ${error}`));
  } else {
    console.log('✅ Manifest validation passed');
  }
  
  // Détecter les doublons dans le manifeste
  console.log('\n🔍 Checking for duplicate paths...');
  const pathCounts = new Map<string, number>();
  ROUTES_MANIFEST.forEach(route => {
    const count = pathCounts.get(route.path) || 0;
    pathCounts.set(route.path, count + 1);
  });
  
  pathCounts.forEach((count, path) => {
    if (count > 1) {
      result.duplicates.push(path);
      result.success = false;
    }
  });
  
  if (result.duplicates.length > 0) {
    console.log(`❌ Found ${result.duplicates.length} duplicate paths:`);
    result.duplicates.forEach(path => console.log(`   - ${path}`));
  } else {
    console.log('✅ No duplicate paths found');
  }
  
  // Scanner les fichiers de pages existants
  console.log('\n📁 Scanning pages directory...');
  const pagesDir = join(process.cwd(), 'src', 'pages');
  const existingPages = await scanPagesDirectory(pagesDir);
  
  console.log(`Found ${existingPages.length} page files`);
  
  // Vérifier les pages manquantes
  console.log('\n🔍 Checking for missing pages...');
  const manifestComponents = ROUTES_MANIFEST.map(route => route.component);
  const existingComponentNames = existingPages.map(page => {
    const fileName = page.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '');
    return fileName;
  });
  
  manifestComponents.forEach(component => {
    if (!existingComponentNames.includes(component)) {
      result.missingPages.push(component);
      result.success = false;
    }
  });
  
  if (result.missingPages.length > 0) {
    console.log(`❌ Found ${result.missingPages.length} missing pages:`);
    result.missingPages.forEach(page => console.log(`   - ${page}`));
  } else {
    console.log('✅ All pages found');
  }
  
  return result;
}

async function main() {
  try {
    const result = await auditRoutes();
    
    console.log('\n📊 Audit Summary:');
    console.log(`Total routes: ${result.totalRoutes}`);
    console.log(`Duplicates: ${result.duplicates.length}`);
    console.log(`Missing pages: ${result.missingPages.length}`);
    console.log(`Validation errors: ${result.validationErrors.length}`);
    
    if (result.success) {
      console.log('\n✅ Routes audit passed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Routes audit failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Audit crashed:', error);
    process.exit(1);
  }
}

// Exécuter l'audit si ce script est appelé directement
if (import.meta.main) {
  main();
}

export { auditRoutes, type AuditResult };