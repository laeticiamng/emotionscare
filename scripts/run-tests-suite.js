#!/usr/bin/env node

/**
 * SUITE DE TESTS COMPLÈTE - EmotionsCare
 * Lance tous les tests de vérification après refactorisation
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

class TestRunner {
  constructor() {
    this.results = [];
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve) => {
      console.log(`🔄 Exécution: ${command} ${args.join(' ')}`);
      
      const process = spawn(command, args, {
        cwd: ROOT_DIR,
        stdio: 'pipe',
        shell: true,
        ...options
      });

      let stdout = '';
      let stderr = '';

      process.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        resolve({
          command: `${command} ${args.join(' ')}`,
          code,
          stdout,
          stderr,
          success: code === 0
        });
      });

      // Timeout après 2 minutes
      setTimeout(() => {
        process.kill();
        resolve({
          command: `${command} ${args.join(' ')}`,
          code: -1,
          stdout,
          stderr: stderr + '\nTimeout après 2 minutes',
          success: false
        });
      }, 120000);
    });
  }

  logResult(result) {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.command} ${result.success ? 'RÉUSSI' : 'ÉCHOUÉ'}`);
    
    if (!result.success && result.stderr) {
      console.log('   Erreur:', result.stderr.split('\n')[0]);
    }
    
    this.results.push(result);
  }

  async runTestSuite() {
    console.log('🧪 SUITE DE TESTS POST-REFACTORING EmotionsCare\n');
    
    // Test 1: Vérification personnalisée
    console.log('📋 1. Vérification de la refactorisation...');
    const verifyResult = await this.runCommand('node', ['scripts/verify-refactoring.js']);
    this.logResult(verifyResult);
    
    // Test 2: Lint du code
    console.log('\n🔍 2. Vérification qualité code (ESLint)...');
    const lintResult = await this.runCommand('npm', ['run', 'lint']);
    this.logResult(lintResult);
    
    // Test 3: Vérification TypeScript
    console.log('\n📘 3. Vérification types TypeScript...');
    const typeCheckResult = await this.runCommand('npm', ['run', 'type-check']);
    this.logResult(typeCheckResult);
    
    // Test 4: Tests unitaires
    console.log('\n🧪 4. Tests unitaires...');
    const testResult = await this.runCommand('npm', ['run', 'test']);
    this.logResult(testResult);
    
    // Test 5: Build de production
    console.log('\n🏗️  5. Build de production...');
    const buildResult = await this.runCommand('npm', ['run', 'build']);
    this.logResult(buildResult);
    
    return this.generateFinalReport();
  }

  generateFinalReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 RAPPORT FINAL DES TESTS');
    console.log('='.repeat(70));
    
    const successful = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const percentage = Math.round((successful / total) * 100);
    
    console.log(`\n✅ Tests réussis: ${successful}/${total} (${percentage}%)`);
    
    // Détail des résultats
    this.results.forEach((result, index) => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      console.log(`   ${index + 1}. ${status} - ${result.command}`);
    });
    
    // Analyse des échecs
    const failures = this.results.filter(r => !r.success);
    if (failures.length > 0) {
      console.log('\n❌ Échecs détectés:');
      failures.forEach(failure => {
        console.log(`   • ${failure.command}`);
        if (failure.stderr) {
          const firstErrorLine = failure.stderr.split('\n')[0];
          console.log(`     └─ ${firstErrorLine}`);
        }
      });
    }
    
    // Recommandations
    console.log('\n💡 Prochaines étapes:');
    
    if (percentage === 100) {
      console.log('   🎉 Parfait ! Projet prêt pour développement');
      console.log('   👉 npm run dev  # Démarrer développement');
      console.log('   👉 git add . && git commit -m "chore: refactorisation complète"');
    } else if (percentage >= 80) {
      console.log('   ✨ Très bien ! Quelques ajustements mineurs');
      console.log('   👉 Corriger les échecs ci-dessus');
      console.log('   👉 Relancer: npm run test');
    } else if (percentage >= 60) {
      console.log('   ⚠️  Refactorisation partiellement réussie');
      console.log('   👉 Examiner les erreurs de build/lint');
      console.log('   👉 Vérifier les imports manquants');
    } else {
      console.log('   🚨 Problèmes significatifs détectés');
      console.log('   👉 Réviser la refactorisation');
      console.log('   👉 Vérifier les dépendances');
    }
    
    console.log('\n📚 Documentation:');
    console.log('   • README.md - Guide de démarrage');
    console.log('   • CONTRIBUTING.md - Standards de développement');
    console.log('   • docs/DEVELOPMENT_SETUP.md - Configuration complète');
    
    console.log('\n' + '='.repeat(70));
    
    return {
      percentage,
      successful,
      total,
      status: percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error',
      failures: failures.map(f => ({
        command: f.command,
        error: f.stderr?.split('\n')[0]
      }))
    };
  }
}

// Exécution si script appelé directement
if (process.argv[1] === __filename) {
  const runner = new TestRunner();
  runner.runTestSuite().then(report => {
    process.exit(report.status === 'success' ? 0 : 1);
  }).catch(error => {
    console.error('❌ Erreur durant les tests:', error);
    process.exit(1);
  });
}

export { TestRunner };