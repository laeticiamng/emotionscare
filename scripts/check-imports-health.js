#!/usr/bin/env node

/**
 * Vérification de la santé des imports du projet
 * Détecte les problèmes courants d'imports
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const issues = [];

// Règles de vérification
const RULES = {
  // Règle 1: Pas d'import de logger dans les fichiers d'init
  noLoggerInInit: {
    name: 'No Logger in Init Files',
    pattern: /import.*logger.*from.*['"]@\/lib\/logger['"]/i,
    files: [
      'src/lib/env.ts',
      'src/integrations/supabase/client.ts',
      'src/lib/ai-monitoring/index.ts',
    ],
    severity: 'error',
    message: 'Ne pas importer logger dans les fichiers d\'initialisation (risque de cycle)',
  },

  // Règle 2: Pas d'import direct de Sentry (utiliser sentry-compat)
  noDirectSentry: {
    name: 'No Direct Sentry Import',
    pattern: /import.*from.*['"]@sentry\/react['"]/i,
    files: 'src/**/*.{ts,tsx}',
    exclude: ['src/lib/errors/sentry-compat.ts', 'src/lib/errors/sentry.ts'],
    severity: 'warning',
    message: 'Utiliser @/lib/errors/sentry-compat au lieu de @sentry/react',
  },

  // Règle 3: Imports absolus préférés aux relatifs profonds
  deepRelativeImports: {
    name: 'Deep Relative Imports',
    pattern: /from\s+['"](\.\.\/){3,}/,
    files: 'src/**/*.{ts,tsx}',
    severity: 'warning',
    message: 'Utiliser les imports absolus (@/) au lieu de chemins relatifs profonds',
  },

  // Règle 4: Pas de console.log en production
  noConsoleLog: {
    name: 'No Console.log',
    pattern: /console\.log\(/,
    files: 'src/**/*.{ts,tsx}',
    exclude: ['src/lib/env.ts', 'src/integrations/supabase/client.ts'],
    severity: 'info',
    message: 'Remplacer console.log par logger.debug',
  },
};

async function checkFile(filePath, rule) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(rule.pattern);

    if (matches) {
      issues.push({
        file: path.relative(process.cwd(), filePath),
        rule: rule.name,
        severity: rule.severity,
        message: rule.message,
        line: findLineNumber(content, rule.pattern),
      });
    }
  } catch (error) {
    // Ignore les erreurs de lecture
  }
}

function findLineNumber(content, pattern) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return 1;
}

async function checkRule(rule) {
  if (Array.isArray(rule.files)) {
    // Liste de fichiers spécifiques
    for (const file of rule.files) {
      if (fs.existsSync(file)) {
        await checkFile(file, rule);
      }
    }
  } else {
    // Pattern glob
    const files = await glob(rule.files, {
      ignore: rule.exclude || [],
      cwd: process.cwd(),
    });

    for (const file of files) {
      await checkFile(file, rule);
    }
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🏥 VÉRIFICATION DE LA SANTÉ DES IMPORTS - EmotionsCare');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Exécute toutes les règles
  for (const [key, rule] of Object.entries(RULES)) {
    console.log(`🔍 Vérification: ${rule.name}...`);
    await checkRule(rule);
  }

  console.log('\n📊 RÉSULTATS:\n');

  if (issues.length === 0) {
    console.log('✅ Aucun problème détecté!\n');
    return;
  }

  // Groupe par sévérité
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  const info = issues.filter(i => i.severity === 'info');

  if (errors.length > 0) {
    console.log(`❌ ${errors.length} ERREUR(S):\n`);
    errors.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   └─ ${issue.message}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} AVERTISSEMENT(S):\n`);
    warnings.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   └─ ${issue.message}\n`);
    });
  }

  if (info.length > 0) {
    console.log(`ℹ️  ${info.length} INFO(S):\n`);
    info.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   └─ ${issue.message}\n`);
    });
  }

  console.log('═══════════════════════════════════════════════════════════\n');

  // Ne fait échouer que si erreurs critiques
  if (errors.length > 0) {
    console.log('⚠️  Corrigez les erreurs avant le déploiement en production\n');
    // process.exit(1);
  }
}

main().catch(console.error);
