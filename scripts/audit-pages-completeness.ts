#!/usr/bin/env tsx
/**
 * Script d'audit de la complétude des pages
 * Vérifie que chaque page déclarée dans le registry est complète et fonctionnelle
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface PageIssue {
  component: string;
  path: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'ok';
  issues: string[];
  score: number;
}

// Critères de complétude
interface CompletenessChecks {
  fileExists: boolean;
  hasContent: boolean;
  hasPageRoot: boolean;
  hasTitle: boolean;
  hasMainContent: boolean;
  hasComponents: boolean;
  hasNavigation: boolean;
  lineCount: number;
  componentCount: number;
  isStub: boolean;
}

const pagesDir = join(process.cwd(), 'src/pages');
const registryPath = join(process.cwd(), 'src/routerV2/registry.ts');

// Lire le registry
const registryContent = readFileSync(registryPath, 'utf-8');

// Extraire les routes
const routeRegex = /\{[^}]*name:\s*['"]([^'"]+)['"],[^}]*path:\s*['"]([^'"]+)['"],[^}]*component:\s*['"]([^'"]+)['"]/gs;
let match;
const routes: Array<{ name: string; path: string; component: string }> = [];

while ((match = routeRegex.exec(registryContent)) !== null) {
  routes.push({
    name: match[1],
    path: match[2],
    component: match[3],
  });
}

console.log('🔍 AUDIT DE COMPLÉTUDE DES PAGES');
console.log('═'.repeat(80));
console.log(`📊 Routes à analyser: ${routes.length}\n`);

const issues: PageIssue[] = [];
let totalScore = 0;

// Fonction pour trouver un fichier de page
function findPageFile(component: string): string | null {
  const possiblePaths = [
    join(pagesDir, `${component}.tsx`),
    join(pagesDir, component.toLowerCase(), 'index.tsx'),
    join(pagesDir, component.replace(/Page$/, ''), 'page.tsx'),
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

// Fonction pour analyser la complétude d'un fichier
function analyzePageCompleteness(filePath: string): CompletenessChecks {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  return {
    fileExists: true,
    hasContent: lines.length > 20,
    hasPageRoot: /data-testid=["']page-root["']/.test(content),
    hasTitle: /<h1|<title/.test(content) || /document\.title/.test(content),
    hasMainContent: lines.length > 50 && /<div|<section|<main|<Card/.test(content),
    hasComponents: /<Card|<Button|<Input|<Badge/.test(content),
    hasNavigation: /useNavigate|navigate\(|Link to/.test(content),
    lineCount: lines.length,
    componentCount: (content.match(/<[A-Z][a-zA-Z]+/g) || []).length,
    isStub: content.includes('TODO') || content.includes('Coming soon') || 
            content.includes('Placeholder') || content.includes('En construction') ||
            (lines.length < 50 && !/<Card|<section|<main/.test(content)),
  };
}

// Fonction pour calculer le score de complétude
function calculateCompletenessScore(checks: CompletenessChecks): number {
  let score = 0;
  
  if (checks.hasContent) score += 15;
  if (checks.hasPageRoot) score += 20;
  if (checks.hasTitle) score += 15;
  if (checks.hasMainContent) score += 20;
  if (checks.hasComponents) score += 15;
  if (checks.hasNavigation) score += 10;
  if (checks.lineCount > 100) score += 5;
  if (!checks.isStub) score += 10;
  
  return Math.min(score, 100);
}

// Fonction pour déterminer la sévérité
function getSeverity(score: number): 'critical' | 'high' | 'medium' | 'low' | 'ok' {
  if (score >= 80) return 'ok';
  if (score >= 60) return 'low';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'high';
  return 'critical';
}

// Analyser chaque route
for (const route of routes) {
  const filePath = findPageFile(route.component);
  
  if (!filePath) {
    issues.push({
      component: route.component,
      path: route.path,
      severity: 'critical',
      score: 0,
      issues: ['❌ Fichier de page introuvable'],
    });
    continue;
  }

  const checks = analyzePageCompleteness(filePath);
  const score = calculateCompletenessScore(checks);
  const severity = getSeverity(score);
  totalScore += score;
  
  const pageIssues: string[] = [];
  
  if (!checks.hasPageRoot) pageIssues.push('⚠️  Manque data-testid="page-root"');
  if (!checks.hasTitle) pageIssues.push('⚠️  Manque titre (<h1> ou document.title)');
  if (!checks.hasMainContent) pageIssues.push('⚠️  Contenu principal insuffisant');
  if (!checks.hasComponents) pageIssues.push('⚠️  N\'utilise pas de composants UI');
  if (!checks.hasNavigation) pageIssues.push('ℹ️  Pas de navigation détectée');
  if (checks.isStub) pageIssues.push('🚧 Semble être un placeholder/stub');
  if (checks.lineCount < 50) pageIssues.push(`📏 Trop court (${checks.lineCount} lignes)`);
  
  if (pageIssues.length > 0 || severity !== 'ok') {
    issues.push({
      component: route.component,
      path: route.path,
      severity,
      score,
      issues: pageIssues.length > 0 ? pageIssues : ['✅ Page complète'],
    });
  }
}

// Trier par sévérité
const sortedIssues = issues.sort((a, b) => {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, ok: 4 };
  return severityOrder[a.severity] - severityOrder[b.severity];
});

// Afficher les résultats par sévérité
console.log('🚨 PAGES CRITIQUES (Score < 20%)\n');
const critical = sortedIssues.filter(i => i.severity === 'critical');
if (critical.length === 0) {
  console.log('✅ Aucune page critique détectée!\n');
} else {
  critical.forEach((issue, idx) => {
    console.log(`${idx + 1}. ${issue.component} - Score: ${issue.score}%`);
    console.log(`   Route: ${issue.path}`);
    issue.issues.forEach(i => console.log(`   ${i}`));
    console.log();
  });
}

console.log('═'.repeat(80));
console.log('🔶 PAGES À AMÉLIORER (Score 20-60%)\n');
const needsWork = sortedIssues.filter(i => ['high', 'medium'].includes(i.severity));
if (needsWork.length === 0) {
  console.log('✅ Toutes les pages sont en bon état!\n');
} else {
  needsWork.forEach((issue, idx) => {
    console.log(`${idx + 1}. ${issue.component} - Score: ${issue.score}%`);
    console.log(`   Route: ${issue.path}`);
    issue.issues.forEach(i => console.log(`   ${i}`));
    console.log();
  });
}

console.log('═'.repeat(80));
console.log('⚠️  PAGES ACCEPTABLES (Score 60-80%)\n');
const acceptable = sortedIssues.filter(i => i.severity === 'low');
if (acceptable.length === 0) {
  console.log('✅ Aucune page dans cette catégorie\n');
} else {
  console.log(`${acceptable.length} pages pourraient être améliorées:\n`);
  acceptable.slice(0, 10).forEach((issue) => {
    console.log(`• ${issue.component} (${issue.score}%) - ${issue.path}`);
  });
  if (acceptable.length > 10) {
    console.log(`... et ${acceptable.length - 10} autres`);
  }
  console.log();
}

console.log('═'.repeat(80));
console.log('📊 RÉSUMÉ GLOBAL\n');

const avgScore = Math.round(totalScore / routes.length);
const criticalCount = critical.length;
const highCount = sortedIssues.filter(i => i.severity === 'high').length;
const mediumCount = sortedIssues.filter(i => i.severity === 'medium').length;
const lowCount = acceptable.length;
const okCount = routes.length - issues.length;

console.log(`Total pages analysées:     ${routes.length}`);
console.log(`Score moyen:               ${avgScore}%`);
console.log();
console.log(`🚨 Critiques (0-20%):      ${criticalCount} pages`);
console.log(`🔶 Hautes priorité (20-40%): ${highCount} pages`);
console.log(`⚠️  Moyennes priorité (40-60%): ${mediumCount} pages`);
console.log(`📝 Basses priorité (60-80%): ${lowCount} pages`);
console.log(`✅ Complètes (80-100%):    ${okCount} pages`);
console.log();

// Pourcentage de complétude
const completenessPercentage = Math.round((okCount / routes.length) * 100);
console.log(`📈 Taux de complétude global: ${completenessPercentage}%`);
console.log();

// Recommandations
console.log('💡 RECOMMANDATIONS:\n');
if (criticalCount > 0) {
  console.log(`1. URGENT: Corriger les ${criticalCount} pages critiques (fichiers manquants ou vides)`);
}
if (highCount > 0) {
  console.log(`2. HAUTE: Compléter les ${highCount} pages avec contenu minimal`);
}
if (mediumCount > 0) {
  console.log(`3. MOYENNE: Enrichir les ${mediumCount} pages avec plus de composants`);
}
if (lowCount > 5) {
  console.log(`4. BASSE: Améliorer progressivement les ${lowCount} pages acceptables`);
}

console.log();
console.log('🎯 ACTIONS PRIORITAIRES:\n');
console.log('• Ajouter data-testid="page-root" sur toutes les pages');
console.log('• Compléter les stubs et placeholders');
console.log('• Utiliser les composants UI (Card, Button, Badge, etc.)');
console.log('• Ajouter navigation et titres appropriés');
console.log('• Viser un minimum de 80 lignes par page');
console.log();

// Code de sortie
if (criticalCount > 0) {
  console.log('❌ Audit échoué: Pages critiques détectées');
  process.exit(1);
} else if (avgScore < 60) {
  console.log('⚠️  Audit partiellement réussi: Score moyen insuffisant');
  process.exit(0);
} else {
  console.log('✅ Audit réussi: Toutes les pages sont en bon état!');
  process.exit(0);
}
