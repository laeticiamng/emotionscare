#!/usr/bin/env node

/**
 * Script de détection automatique des dépendances circulaires
 * Analyse les imports et détecte les cycles entre modules critiques
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Modules critiques à surveiller (ordre d'initialisation)
const CRITICAL_MODULES = [
  'src/lib/env.ts',
  'src/lib/logger/index.ts',
  'src/integrations/supabase/client.ts',
  'src/lib/ai-monitoring/index.ts',
  'src/lib/errors/sentry-compat.ts',
  'src/contexts/ErrorBoundary.tsx',
  'src/providers/index.tsx',
  'src/main.tsx',
];

// Patterns d'imports à analyser
const IMPORT_PATTERNS = [
  /import\s+.*\s+from\s+['"]([^'"]+)['"]/g,
  /import\s+['"]([^'"]+)['"]/g,
  /require\(['"]([^'"]+)['"]\)/g,
];

class DependencyGraph {
  constructor() {
    this.graph = new Map();
    this.visited = new Set();
    this.recursionStack = new Set();
    this.cycles = [];
  }

  addEdge(from, to) {
    if (!this.graph.has(from)) {
      this.graph.set(from, new Set());
    }
    this.graph.get(from).add(to);
  }

  // Résout les alias de chemins (@/...)
  resolveImportPath(importPath, currentFile) {
    // Gère les imports relatifs
    if (importPath.startsWith('.')) {
      const currentDir = path.dirname(currentFile);
      return path.normalize(path.join(currentDir, importPath));
    }

    // Gère les alias @/
    if (importPath.startsWith('@/')) {
      return path.join('src', importPath.slice(2));
    }

    // Ignore les modules node_modules
    return null;
  }

  // Extrait les imports d'un fichier
  extractImports(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const imports = new Set();

      IMPORT_PATTERNS.forEach(pattern => {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
          let importPath = match[1];
          
          // Résout le chemin
          const resolved = this.resolveImportPath(importPath, filePath);
          if (resolved) {
            // Ajoute les extensions possibles
            const possiblePaths = [
              resolved,
              `${resolved}.ts`,
              `${resolved}.tsx`,
              `${resolved}/index.ts`,
              `${resolved}/index.tsx`,
            ];

            for (const p of possiblePaths) {
              if (fs.existsSync(p)) {
                imports.add(path.normalize(p));
                break;
              }
            }
          }
        }
      });

      return imports;
    } catch (error) {
      console.warn(`⚠️  Impossible de lire ${filePath}: ${error.message}`);
      return new Set();
    }
  }

  // Construit le graphe de dépendances
  buildGraph(entryPoints) {
    entryPoints.forEach(file => {
      const normalized = path.normalize(file);
      if (!fs.existsSync(normalized)) {
        console.warn(`⚠️  Fichier non trouvé: ${normalized}`);
        return;
      }

      const imports = this.extractImports(normalized);
      imports.forEach(importPath => {
        this.addEdge(normalized, importPath);
      });

      // Récursif pour les dépendances
      imports.forEach(importPath => {
        if (!this.graph.has(importPath)) {
          this.buildGraph([importPath]);
        }
      });
    });
  }

  // Détecte les cycles avec DFS
  detectCyclesDFS(node, path = []) {
    if (this.recursionStack.has(node)) {
      // Cycle détecté
      const cycleStart = path.indexOf(node);
      const cycle = [...path.slice(cycleStart), node];
      this.cycles.push(cycle);
      return true;
    }

    if (this.visited.has(node)) {
      return false;
    }

    this.visited.add(node);
    this.recursionStack.add(node);
    path.push(node);

    const neighbors = this.graph.get(node);
    if (neighbors) {
      for (const neighbor of neighbors) {
        this.detectCyclesDFS(neighbor, [...path]);
      }
    }

    this.recursionStack.delete(node);
    return false;
  }

  // Analyse tous les modules critiques
  analyze() {
    console.log('🔍 Construction du graphe de dépendances...\n');
    this.buildGraph(CRITICAL_MODULES);

    console.log(`📊 Graphe construit: ${this.graph.size} modules analysés\n`);

    console.log('🔄 Détection des cycles...\n');
    CRITICAL_MODULES.forEach(module => {
      const normalized = path.normalize(module);
      if (this.graph.has(normalized)) {
        this.detectCyclesDFS(normalized);
      }
    });

    return this.cycles;
  }

  // Formate et affiche les résultats
  report() {
    if (this.cycles.length === 0) {
      console.log('✅ Aucune dépendance circulaire détectée dans les modules critiques!\n');
      return true;
    }

    console.log(`❌ ${this.cycles.length} dépendance(s) circulaire(s) détectée(s):\n`);

    // Déduplique les cycles identiques
    const uniqueCycles = new Set();
    this.cycles.forEach(cycle => {
      const normalized = cycle.map(p => path.relative(process.cwd(), p)).sort().join(' -> ');
      uniqueCycles.add(normalized);
    });

    let index = 1;
    uniqueCycles.forEach(cycle => {
      console.log(`\n🔴 Cycle ${index}:`);
      const nodes = cycle.split(' -> ');
      nodes.forEach((node, i) => {
        const arrow = i === nodes.length - 1 ? '↩️' : '→';
        console.log(`   ${arrow} ${node}`);
      });
      index++;
    });

    console.log('\n💡 Solutions suggérées:');
    console.log('   1. Utiliser console.log au lieu de logger dans les fichiers d\'initialisation');
    console.log('   2. Créer des modules utilitaires sans dépendances');
    console.log('   3. Injecter les dépendances via des paramètres');
    console.log('   4. Utiliser le lazy loading pour différer les imports\n');

    return false;
  }
}

// Exécution principale
function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔍 DÉTECTION DES DÉPENDANCES CIRCULAIRES - EmotionsCare');
  console.log('═══════════════════════════════════════════════════════════\n');

  const graph = new DependencyGraph();
  graph.analyze();
  const success = graph.report();

  if (!success) {
    console.log('⚠️  Build continuera malgré les cycles détectés');
    console.log('⚠️  Corrigez les cycles pour éviter les erreurs d\'initialisation\n');
    // Ne pas faire échouer le build, juste avertir
    // process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════════════\n');
}

// Exporte pour utilisation en tant que module
if (require.main === module) {
  main();
}

module.exports = { DependencyGraph, CRITICAL_MODULES };
