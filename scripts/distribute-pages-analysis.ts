// @ts-nocheck
#!/usr/bin/env tsx
/**
 * Script de répartition automatique des pages en groupes d'analyse
 *
 * Ce script détecte automatiquement toutes les pages du repo (frontend + backend)
 * et les divise en N groupes équilibrés pour permettre une analyse complète
 * sans doublons ni oublis.
 */

import { globby } from 'globby';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Configuration: Nombre de groupes d'analyse
const NUMBER_OF_GROUPS = 10;

interface PageGroup {
  groupId: number;
  groupName: string;
  totalPages: number;
  pages: string[];
}

interface DistributionResult {
  metadata: {
    totalPages: number;
    numberOfGroups: number;
    averagePagesPerGroup: number;
    generatedAt: string;
  };
  groups: PageGroup[];
  verification: {
    allPagesIncluded: boolean;
    noDuplicates: boolean;
    groupSizesBalanced: boolean;
  };
}

/**
 * Détecte toutes les pages du repository
 */
async function detectAllPages(): Promise<string[]> {
  const patterns = [
    // Pages frontend (React/TypeScript)
    'src/**/*Page.tsx',
    'src/**/*page.tsx',
    'src/**/pages/**/*.tsx',
    'src/**/app/**/*.tsx',

    // Exclure les fichiers de test
    '!**/*.test.tsx',
    '!**/*.e2e.test.tsx',
    '!**/*.spec.tsx',
  ];

  const pages = await globby(patterns, {
    cwd: process.cwd(),
    absolute: false,
    onlyFiles: true,
  });

  // Trier alphabétiquement pour garantir un ordre déterministe
  return pages.sort();
}

/**
 * Divise les pages en N groupes équilibrés
 */
function distributeIntoGroups(pages: string[], numberOfGroups: number): PageGroup[] {
  const groups: PageGroup[] = [];
  const pagesPerGroup = Math.ceil(pages.length / numberOfGroups);

  for (let i = 0; i < numberOfGroups; i++) {
    const startIndex = i * pagesPerGroup;
    const endIndex = Math.min(startIndex + pagesPerGroup, pages.length);
    const groupPages = pages.slice(startIndex, endIndex);

    if (groupPages.length > 0) {
      groups.push({
        groupId: i + 1,
        groupName: `Groupe ${i + 1}`,
        totalPages: groupPages.length,
        pages: groupPages,
      });
    }
  }

  return groups;
}

/**
 * Vérifie l'intégrité de la distribution
 */
function verifyDistribution(
  originalPages: string[],
  groups: PageGroup[]
): DistributionResult['verification'] {
  // Récupérer toutes les pages de tous les groupes
  const allDistributedPages = groups.flatMap(g => g.pages);

  // Vérifier qu'il n'y a pas de doublons
  const uniquePages = new Set(allDistributedPages);
  const noDuplicates = uniquePages.size === allDistributedPages.length;

  // Vérifier que toutes les pages sont incluses
  const allPagesIncluded =
    allDistributedPages.length === originalPages.length &&
    allDistributedPages.every(page => originalPages.includes(page));

  // Vérifier que les groupes sont équilibrés (différence max de 1 page)
  const sizes = groups.map(g => g.totalPages);
  const maxSize = Math.max(...sizes);
  const minSize = Math.min(...sizes);
  const groupSizesBalanced = (maxSize - minSize) <= 1;

  return {
    allPagesIncluded,
    noDuplicates,
    groupSizesBalanced,
  };
}

/**
 * Génère un résumé console de la distribution
 */
function printSummary(result: DistributionResult): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 RÉPARTITION DES PAGES EN GROUPES D\'ANALYSE');
  console.log('='.repeat(80));

  console.log('\n📈 STATISTIQUES:');
  console.log(`   ├─ Total de pages détectées: ${result.metadata.totalPages}`);
  console.log(`   ├─ Nombre de groupes: ${result.metadata.numberOfGroups}`);
  console.log(`   └─ Moyenne par groupe: ${result.metadata.averagePagesPerGroup.toFixed(1)}`);

  console.log('\n📦 GROUPES:');
  result.groups.forEach((group, index) => {
    const isLast = index === result.groups.length - 1;
    const prefix = isLast ? '   └─' : '   ├─';
    console.log(`${prefix} ${group.groupName}: ${group.totalPages} pages`);
  });

  console.log('\n✅ VÉRIFICATION:');
  const checks = [
    { label: 'Toutes les pages incluses', value: result.verification.allPagesIncluded },
    { label: 'Aucun doublon', value: result.verification.noDuplicates },
    { label: 'Groupes équilibrés', value: result.verification.groupSizesBalanced },
  ];

  checks.forEach((check, index) => {
    const isLast = index === checks.length - 1;
    const prefix = isLast ? '   └─' : '   ├─';
    const status = check.value ? '✓' : '✗';
    const emoji = check.value ? '✅' : '❌';
    console.log(`${prefix} ${status} ${check.label} ${emoji}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('✨ Fichier JSON généré: pages-distribution.json');
  console.log('='.repeat(80) + '\n');
}

/**
 * Fonction principale
 */
async function main(): Promise<void> {
  try {
    console.log('🔍 Détection des pages en cours...');
    const pages = await detectAllPages();
    console.log(`✓ ${pages.length} pages détectées`);

    console.log('\n📊 Répartition en groupes...');
    const groups = distributeIntoGroups(pages, NUMBER_OF_GROUPS);
    console.log(`✓ ${groups.length} groupes créés`);

    console.log('\n🔒 Vérification de l\'intégrité...');
    const verification = verifyDistribution(pages, groups);

    const result: DistributionResult = {
      metadata: {
        totalPages: pages.length,
        numberOfGroups: groups.length,
        averagePagesPerGroup: pages.length / groups.length,
        generatedAt: new Date().toISOString(),
      },
      groups,
      verification,
    };

    // Sauvegarder le résultat
    const outputPath = resolve(process.cwd(), 'pages-distribution.json');
    writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');

    // Afficher le résumé
    printSummary(result);

    // Vérifier le succès
    if (!verification.allPagesIncluded || !verification.noDuplicates) {
      console.error('❌ ERREUR: La vérification a échoué!');
      process.exit(1);
    }

    console.log('✅ Distribution réussie!');
  } catch (error) {
    console.error('❌ Erreur lors de la distribution:', error);
    process.exit(1);
  }
}

// Exécuter le script
main();
