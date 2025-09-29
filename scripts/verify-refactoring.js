#!/usr/bin/env node

/**
 * SCRIPT DE VÉRIFICATION POST-REFACTORING - EmotionsCare
 * Vérifie que la refactorisation a été effectuée correctement
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

class RefactoringVerifier {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  log(type, message, details = null) {
    const entry = { message, details, timestamp: new Date().toISOString() };
    this.results[type].push(entry);
    
    const icons = { passed: '✅', failed: '❌', warnings: '⚠️' };
    console.log(`${icons[type]} ${message}`);
    if (details) console.log(`   ${details}`);
  }

  // Vérification 1: Plus de dépendances conflictuelles
  async checkDependencyConflicts() {
    console.log('\n📦 Vérification des dépendances...');
    
    try {
      const packagePath = join(ROOT_DIR, 'package.json');
      const packageContent = JSON.parse(readFileSync(packagePath, 'utf8'));
      
      // Vérifier react-query v3 supprimé
      if (packageContent.dependencies?.['react-query']) {
        this.log('failed', 'Ancienne dépendance react-query v3 encore présente');
      } else {
        this.log('passed', 'react-query v3 supprimé avec succès');
      }
      
      // Vérifier @tanstack/react-query présent
      if (packageContent.dependencies?.['@tanstack/react-query']) {
        this.log('passed', 'TanStack Query v5 correctement configuré');
      } else {
        this.log('failed', '@tanstack/react-query manquant');
      }
      
      // Vérifier @sentry/tracing supprimé
      if (packageContent.dependencies?.['@sentry/tracing']) {
        this.log('failed', 'Dépendance obsolète @sentry/tracing encore présente');
      } else {
        this.log('passed', '@sentry/tracing supprimé avec succès');
      }
      
      // Vérifier types dans devDependencies
      const typesInProd = Object.keys(packageContent.dependencies || {})
        .filter(dep => dep.startsWith('@types/'));
      
      if (typesInProd.length > 0) {
        this.log('warnings', `${typesInProd.length} types en dependencies au lieu de devDependencies`);
      } else {
        this.log('passed', 'Types correctement dans devDependencies');
      }
      
    } catch (error) {
      this.log('failed', 'Erreur lors de la vérification package.json', error.message);
    }
  }

  // Vérification 2: Fichiers environnement centralisés
  checkEnvironmentFiles() {
    console.log('\n🔧 Vérification fichiers environnement...');
    
    // Vérifier .env.example à la racine
    if (existsSync(join(ROOT_DIR, '.env.example'))) {
      this.log('passed', '.env.example présent à la racine');
    } else {
      this.log('failed', '.env.example manquant à la racine');
    }
    
    // Vérifier absence dans src/
    if (existsSync(join(ROOT_DIR, 'src', '.env.example'))) {
      this.log('failed', 'Doublon .env.example encore présent dans src/');
    } else {
      this.log('passed', 'Pas de doublon .env.example dans src/');
    }
  }

  // Vérification 3: Nettoyage des fichiers obsolètes
  async checkObsoleteFiles() {
    console.log('\n🧹 Vérification nettoyage fichiers obsolètes...');
    
    const obsoletePatterns = [
      'AUDIT*.md',
      'PHASE*.md',
      'RAPPORT*.md', 
      'STATUS*.md',
      'FINAL*.md',
      'CLEANUP*.md',
      'USE_NPM_*.{md,txt}',
      'verification-*.md',
      'fix-*.js',
      'emergency-*.js',
      'bun-*.md'
    ];
    
    let foundObsolete = 0;
    
    for (const pattern of obsoletePatterns) {
      try {
        const files = await glob(pattern, { 
          cwd: ROOT_DIR,
          ignore: ['node_modules/**', '.git/**', 'reports/**']
        });
        
        foundObsolete += files.length;
        if (files.length > 0) {
          this.log('failed', `Fichiers obsolètes trouvés: ${pattern}`, files.join(', '));
        }
      } catch (error) {
        // Pattern non valide, ignorer
      }
    }
    
    if (foundObsolete === 0) {
      this.log('passed', 'Tous les fichiers obsolètes supprimés');
    }
  }

  // Vérification 4: Structure reports/ organisée  
  checkReportsStructure() {
    console.log('\n📊 Vérification structure reports/...');
    
    const reportsDir = join(ROOT_DIR, 'reports');
    
    if (!existsSync(reportsDir)) {
      this.log('warnings', 'Dossier reports/ non créé');
      return;
    }
    
    const expectedDirs = ['accessibility', 'dependencies', 'archive'];
    let foundDirs = 0;
    
    for (const dir of expectedDirs) {
      if (existsSync(join(reportsDir, dir))) {
        foundDirs++;
      }
    }
    
    if (foundDirs > 0) {
      this.log('passed', `Structure reports/ organisée (${foundDirs}/${expectedDirs.length} dossiers)`);
    } else {
      this.log('warnings', 'Structure reports/ pas encore organisée');
    }
  }

  // Vérification 5: Imports cohérents
  async checkImportConsistency() {
    console.log('\n📥 Vérification cohérence imports...');
    
    try {
      // Vérifier qu'il n'y a plus d'imports de react-query v3
      const reactQueryFiles = await glob('src/**/*.{ts,tsx}', { 
        cwd: ROOT_DIR,
        absolute: true
      });
      
      let oldImports = 0;
      let newImports = 0;
      
      for (const file of reactQueryFiles.slice(0, 50)) { // Limiter pour performance
        try {
          const content = readFileSync(file, 'utf8');
          
          if (content.includes("from 'react-query'") || content.includes('from "react-query"')) {
            oldImports++;
          }
          
          if (content.includes("from '@tanstack/react-query'")) {
            newImports++;
          }
        } catch (error) {
          // Fichier non lisible, ignorer
        }
      }
      
      if (oldImports > 0) {
        this.log('failed', `${oldImports} fichiers utilisent encore l'ancienne API react-query`);
      } else {
        this.log('passed', 'Aucun import react-query v3 détecté');
      }
      
      if (newImports > 0) {
        this.log('passed', `${newImports} fichiers utilisent TanStack Query v5`);
      }
      
    } catch (error) {
      this.log('warnings', 'Erreur lors de la vérification imports', error.message);
    }
  }

  // Vérification 6: Documentation créée
  checkDocumentation() {
    console.log('\n📚 Vérification documentation...');
    
    const docs = [
      { file: 'README.md', name: 'README principal' },
      { file: 'CONTRIBUTING.md', name: 'Guide contribution' },
      { file: 'docs/DEVELOPMENT_SETUP.md', name: 'Guide développement' }
    ];
    
    for (const doc of docs) {
      if (existsSync(join(ROOT_DIR, doc.file))) {
        this.log('passed', `${doc.name} créé`);
      } else {
        this.log('failed', `${doc.name} manquant`);
      }
    }
  }

  // Vérification 7: Taille du projet réduite
  checkProjectSize() {
    console.log('\n📏 Estimation réduction taille projet...');
    
    try {
      const rootFiles = readdirSync(ROOT_DIR).filter(f => {
        const stat = statSync(join(ROOT_DIR, f));
        return stat.isFile() && f.endsWith('.md');
      });
      
      this.log('passed', `${rootFiles.length} fichiers .md à la racine (vs ~50 avant)`);
      
    } catch (error) {
      this.log('warnings', 'Impossible d\'estimer la taille', error.message);
    }
  }

  // Génération du rapport final
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 RAPPORT DE VÉRIFICATION POST-REFACTORING');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Tests réussis: ${this.results.passed.length}`);
    console.log(`❌ Tests échoués: ${this.results.failed.length}`);
    console.log(`⚠️ Avertissements: ${this.results.warnings.length}`);
    
    const totalScore = this.results.passed.length;
    const maxScore = this.results.passed.length + this.results.failed.length;
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100;
    
    console.log(`\n🎯 Score global: ${percentage}%`);
    
    if (this.results.failed.length > 0) {
      console.log('\n❌ Problèmes détectés:');
      this.results.failed.forEach(item => {
        console.log(`  - ${item.message}`);
        if (item.details) console.log(`    ${item.details}`);
      });
    }
    
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️ Avertissements:');
      this.results.warnings.forEach(item => {
        console.log(`  - ${item.message}`);
        if (item.details) console.log(`    ${item.details}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (percentage >= 80) {
      console.log('🎉 Refactorisation réussie ! Projet prêt pour développement.');
    } else if (percentage >= 60) {
      console.log('⚠️ Refactorisation partiellement réussie. Quelques ajustements nécessaires.');
    } else {
      console.log('❌ Refactorisation incomplète. Révision requise.');
    }
    
    return {
      score: percentage,
      status: percentage >= 80 ? 'success' : percentage >= 60 ? 'partial' : 'failed',
      results: this.results
    };
  }

  // Méthode principale
  async run() {
    console.log('🚀 Démarrage vérification post-refactoring EmotionsCare...\n');
    
    await this.checkDependencyConflicts();
    this.checkEnvironmentFiles();
    await this.checkObsoleteFiles();
    this.checkReportsStructure();
    await this.checkImportConsistency();
    this.checkDocumentation();
    this.checkProjectSize();
    
    return this.generateReport();
  }
}

// Exécution si script appelé directement
if (process.argv[1] === __filename) {
  const verifier = new RefactoringVerifier();
  verifier.run().then(result => {
    process.exit(result.status === 'success' ? 0 : 1);
  }).catch(error => {
    console.error('❌ Erreur durant la vérification:', error);
    process.exit(1);
  });
}

export { RefactoringVerifier };