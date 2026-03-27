// @ts-nocheck
#!/usr/bin/env tsx
/**
 * Architecture Validator - EmotionsCare
 * Valide le respect des conventions architecture Route → Page → Module
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { ROUTES_REGISTRY } from '../src/routerV2/registry';

interface ValidationIssue {
  type: 'ERROR' | 'WARNING' | 'INFO';
  category: string;
  file: string;
  message: string;
  line?: number;
}

const issues: ValidationIssue[] = [];

// Patterns interdits
const FORBIDDEN_PATTERNS = {
  hardcodedColors: /className="[^"]*(?:bg-(?:blue|red|green|white|black)-\d+|text-(?:blue|red|green|white|black)-\d+)/,
  directRoutes: /href="\/(?!http)/,
  console: /console\.(log|warn|error|debug)/,
  any: /:\s*any(?!\w)/,
  commented: /^[\s]*\/\//,
};

// Scan d'un fichier
function scanFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileName = basename(filePath);

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Vérifier les couleurs hardcodées
      if (FORBIDDEN_PATTERNS.hardcodedColors.test(line)) {
        issues.push({
          type: 'ERROR',
          category: 'Design System',
          file: filePath,
          line: lineNum,
          message: '❌ Couleur hardcodée détectée. Utiliser le design system (index.css)',
        });
      }

      // Vérifier les console.log
      if (FORBIDDEN_PATTERNS.console.test(line) && !line.includes('// eslint-disable')) {
        issues.push({
          type: 'WARNING',
          category: 'Clean Code',
          file: filePath,
          line: lineNum,
          message: '⚠️ console.log détecté. À supprimer en production',
        });
      }

      // Vérifier les types 'any'
      if (FORBIDDEN_PATTERNS.any.test(line) && !line.includes('@ts-nocheck')) {
        issues.push({
          type: 'WARNING',
          category: 'TypeScript',
          file: filePath,
          line: lineNum,
          message: '⚠️ Type "any" détecté. Typer correctement',
        });
      }
    });

    // Vérifier data-testid pour les pages
    if (filePath.includes('/pages/') && filePath.endsWith('.tsx')) {
      if (!content.includes('data-testid="page-root"')) {
        issues.push({
          type: 'ERROR',
          category: 'Tests',
          file: filePath,
          message: '❌ Attribut data-testid="page-root" manquant',
        });
      }
    }

    // Vérifier le SEO pour les pages
    if (filePath.includes('/pages/') && filePath.endsWith('.tsx')) {
      if (!content.includes('usePageTitle') && !content.includes('<title>')) {
        issues.push({
          type: 'WARNING',
          category: 'SEO',
          file: filePath,
          message: '⚠️ Titre de page manquant (SEO)',
        });
      }
    }

    // Vérifier la taille des fichiers (> 300 lignes = refactoring nécessaire)
    if (lines.length > 300) {
      issues.push({
        type: 'WARNING',
        category: 'Architecture',
        file: filePath,
        message: `⚠️ Fichier trop long (${lines.length} lignes). Découper en modules`,
      });
    }
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${filePath}:`, error);
  }
}

// Scan récursif d'un répertoire
function scanDirectory(dir: string): void {
  try {
    const files = readdirSync(dir);

    files.forEach((file) => {
      const filePath = join(dir, file);
      const stat = statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        scanFile(filePath);
      }
    });
  } catch (error) {
    console.error(`Erreur lors du scan de ${dir}:`, error);
  }
}

// Valider la structure des routes
function validateRoutes(): void {
  ROUTES_REGISTRY.forEach((route) => {
    const { path, component, name } = route;

    // Vérifier que le composant existe
    const possiblePaths = [
      `src/pages/${component}.tsx`,
      `src/pages/${component}/index.tsx`,
      `src/modules/${name}/${component}.tsx`,
    ];

    const exists = possiblePaths.some((p) => existsSync(p));

    if (!exists) {
      issues.push({
        type: 'ERROR',
        category: 'Routing',
        file: 'src/routerV2/registry.ts',
        message: `❌ Route "${path}" : composant "${component}" introuvable`,
      });
    }

    // Vérifier la cohérence segment / path
    if (route.segment === 'consumer' && !path.startsWith('/app/')) {
      issues.push({
        type: 'WARNING',
        category: 'Routing',
        file: 'src/routerV2/registry.ts',
        message: `⚠️ Route consumer "${path}" devrait commencer par /app/`,
      });
    }
  });
}

// Générer le rapport
function generateReport(): void {
  console.log('\n🔍 VALIDATION ARCHITECTURE - EmotionsCare');
  console.log('='.repeat(60));

  const errors = issues.filter((i) => i.type === 'ERROR');
  const warnings = issues.filter((i) => i.type === 'WARNING');
  const infos = issues.filter((i) => i.type === 'INFO');

  console.log(`\n📊 Résumé :`);
  console.log(`  ❌ Erreurs : ${errors.length}`);
  console.log(`  ⚠️  Warnings : ${warnings.length}`);
  console.log(`  ℹ️  Infos : ${infos.length}`);

  if (errors.length > 0) {
    console.log('\n❌ ERREURS CRITIQUES :\n');
    errors.forEach((issue) => {
      console.log(`  ${issue.category} - ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
      console.log(`  ${issue.message}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS :\n');
    warnings.forEach((issue) => {
      console.log(`  ${issue.category} - ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
      console.log(`  ${issue.message}\n`);
    });
  }

  console.log('\n' + '='.repeat(60));

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Architecture validée ! Code production-ready.\n');
    process.exit(0);
  } else if (errors.length > 0) {
    console.log('❌ Validation échouée. Corriger les erreurs critiques.\n');
    process.exit(1);
  } else {
    console.log('⚠️  Validation OK avec warnings. Amélioration recommandée.\n');
    process.exit(0);
  }
}

// Main
async function main() {
  console.log('🚀 Démarrage de la validation architecture...\n');

  // Valider les routes
  console.log('📋 Validation des routes...');
  validateRoutes();

  // Scanner les fichiers
  console.log('📁 Scan des fichiers src/...');
  scanDirectory('src');

  // Générer le rapport
  generateReport();
}

main();
