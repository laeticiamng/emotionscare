/**
 * CLEANUP MANAGER - Nettoyage automatique des doublons et optimisation
 */

import { promises as fs } from 'fs';
import path from 'path';

interface CleanupReport {
  duplicatesRemoved: string[];
  filesConsolidated: string[];
  unusedFilesRemoved: string[];
  errors: string[];
  totalSizeReduced: number;
}

class CleanupManager {
  private srcPath = './src';
  private report: CleanupReport = {
    duplicatesRemoved: [],
    filesConsolidated: [],
    unusedFilesRemoved: [],
    errors: [],
    totalSizeReduced: 0
  };

  // ==================== IDENTIFICATION DES DOUBLONS ====================
  
  private duplicatePatterns = [
    // Contexts redondants
    {
      pattern: /Context(\.tsx?|\.ts)$/,
      consolidateInto: 'core/UnifiedStateManager.tsx',
      exceptions: ['ThemeProvider', 'UnifiedProvider']
    },
    
    // Stores multiples
    {
      pattern: /Store(\.ts|\.tsx?)$/,
      consolidateInto: 'core/UnifiedStateManager.tsx',
      exceptions: ['UnifiedStore']
    },
    
    // Hooks similaires
    {
      pattern: /^use[A-Z].*\.(ts|tsx)$/,
      consolidateInto: 'hooks/index.ts',
      duplicateKeywords: ['music', 'auth', 'accessibility', 'emotion']
    },
    
    // Components dupliqués
    {
      pattern: /(Button|Input|Card|Modal|Toast).*\.(tsx)$/,
      consolidateInto: 'components/premium/PremiumComponents.tsx',
      exceptions: ['PremiumButton', 'PremiumInput', 'PremiumCard']
    }
  ];

  // ==================== NETTOYAGE PRINCIPAL ====================
  
  async cleanup(): Promise<CleanupReport> {
    console.log('🧹 Démarrage du nettoyage automatique...');
    
    try {
      await this.removeDuplicateContexts();
      await this.consolidateStores();
      await this.mergeHooks();
      await this.cleanupComponents();
      await this.removeUnusedFiles();
      await this.optimizeImports();
      
      console.log('✅ Nettoyage terminé avec succès!');
      return this.report;
    } catch (error) {
      this.report.errors.push(`Erreur générale: ${error}`);
      console.error('❌ Erreur lors du nettoyage:', error);
      return this.report;
    }
  }

  // ==================== SUPPRESSION CONTEXTES REDONDANTS ====================
  
  private async removeDuplicateContexts() {
    const contextsToRemove = [
      'src/contexts/AccessibilityContext.tsx', // Remplacé par AccessibilityContextEnhanced
      'src/contexts/MusicContext.tsx', // Plusieurs versions existent
      'src/contexts/CoachContext.ts',
      'src/contexts/EmotionsCareMusicContext.tsx',
      'src/contexts/AudioContext.tsx',
      'src/contexts/SidebarContext.tsx', // Remplacé par UnifiedSidebar
      'src/contexts/ErrorContext.tsx',
      'src/contexts/SessionContext.tsx',
      'src/contexts/CacheContext.tsx',
      'src/contexts/LayoutContext.tsx'
    ];

    for (const contextPath of contextsToRemove) {
      try {
        await fs.access(contextPath);
        const stats = await fs.stat(contextPath);
        await fs.unlink(contextPath);
        
        this.report.duplicatesRemoved.push(contextPath);
        this.report.totalSizeReduced += stats.size;
        console.log(`🗑️  Supprimé: ${contextPath}`);
      } catch (error) {
        // File doesn't exist, skip
      }
    }
  }

  // ==================== CONSOLIDATION DES STORES ====================
  
  private async consolidateStores() {
    const storesToRemove = [
      'src/stores/useAuthStore.ts', // Intégré dans UnifiedStateManager
      'src/stores/useSilkStore.ts',
      'src/store/breathSlice.ts',
      'src/store/appStore.ts',
      'src/store/unified.store.ts', // Remplacé
      'src/state/modalStore.ts'
    ];

    for (const storePath of storesToRemove) {
      try {
        await fs.access(storePath);
        const stats = await fs.stat(storePath);
        await fs.unlink(storePath);
        
        this.report.duplicatesRemoved.push(storePath);
        this.report.totalSizeReduced += stats.size;
        console.log(`🗑️  Store supprimé: ${storePath}`);
      } catch (error) {
        // File doesn't exist, skip
      }
    }

    // Supprimer les dossiers vides
    try {
      await fs.rmdir('src/state');
      console.log('📁 Dossier src/state supprimé');
    } catch (error) {
      // Dossier non vide ou inexistant
    }
  }

  // ==================== FUSION DES HOOKS ====================
  
  private async mergeHooks() {
    const hooksToRemove = [
      // Hooks de musique redondants
      'src/hooks/useMusic.ts',
      'src/hooks/useMusicPlayer.ts',
      'src/hooks/useMusicService.ts',
      'src/hooks/useMusicControls.ts',
      'src/hooks/useMusicState.tsx',
      'src/hooks/useMusicPlaylist.tsx',
      
      // Hooks d'auth redondants  
      'src/hooks/useAuth.ts',
      'src/hooks/useAuthNavigation.ts',
      'src/hooks/useAuthErrorHandler.ts',
      
      // Hooks d'accessibilité redondants
      'src/hooks/useAccessibility.tsx',
      'src/hooks/useAccessibilityChecker.ts',
      'src/hooks/useAccessibilityValidation.ts',
      
      // Hooks de performance redondants
      'src/hooks/usePerformanceMonitor.ts',
      'src/hooks/usePerformanceMonitoring.ts',
      
      // Hooks utilitaires redondants
      'src/hooks/use-local-storage.ts',
      'src/hooks/use-local-storage.tsx',
      'src/hooks/use-media-query.ts',
      'src/hooks/use-media-query.tsx',
      'src/hooks/use-mobile.ts',
      'src/hooks/use-mobile.tsx',
      'src/hooks/use-theme.ts',
      'src/hooks/use-theme.tsx',
      'src/hooks/use-toast.ts',
      'src/hooks/use-toast.tsx'
    ];

    for (const hookPath of hooksToRemove) {
      try {
        await fs.access(hookPath);
        const stats = await fs.stat(hookPath);
        await fs.unlink(hookPath);
        
        this.report.duplicatesRemoved.push(hookPath);
        this.report.totalSizeReduced += stats.size;
        console.log(`🗑️  Hook supprimé: ${hookPath}`);
      } catch (error) {
        // File doesn't exist, skip
      }
    }
  }

  // ==================== NETTOYAGE DES COMPOSANTS ====================
  
  private async cleanupComponents() {
    const componentsToRemove = [
      // Composants de loading redondants
      'src/components/loading/FullPageLoader.tsx',
      'src/components/loading/FullScreenLoader.tsx',
      'src/components/loading/PageLoader.tsx',
      
      // Error boundaries redondants
      'src/components/ErrorBoundary.tsx',
      'src/components/RootErrorBoundary.tsx',
      
      // Layouts redondants
      'src/components/DashboardLayout.tsx',
      'src/components/ProtectedLayout.tsx',
      'src/components/ProtectedLayoutWrapper.tsx',
      
      // Theme providers redondants
      'src/components/theme-provider.tsx', // Remplacé par UnifiedProvider
      
      // Navigation redondante
      'src/components/GlobalNav.tsx',
      
      // Composants utilitaires redondants
      'src/components/EmptyState.tsx',
      'src/components/HealthCheckBadge.tsx',
      'src/components/TrialBadge.tsx'
    ];

    for (const componentPath of componentsToRemove) {
      try {
        await fs.access(componentPath);
        const stats = await fs.stat(componentPath);
        await fs.unlink(componentPath);
        
        this.report.duplicatesRemoved.push(componentPath);
        this.report.totalSizeReduced += stats.size;
        console.log(`🗑️  Composant supprimé: ${componentPath}`);
      } catch (error) {
        // File doesn't exist, skip
      }
    }
  }

  // ==================== SUPPRESSION FICHIERS INUTILISÉS ====================
  
  private async removeUnusedFiles() {
    const unusedFiles = [
      // Fichiers config redondants
      'src/App.css',
      'src/eslint.config.js',
      'src/tailwind.config.js',
      
      // Fichiers de test obsolètes
      'src/setupLogging.ts',
      'src/monitoring.ts',
      'src/sw.ts',
      
      // Fichiers utilitaires redondants
      'src/utils/lazyComponents.tsx',
      'src/utils/loadComponent.ts',
      'src/utils/musicCleanup.js',
      'src/utils/duplicateChecker.ts',
      'src/utils/routeSimilarityAnalyzer.ts',
      'src/utils/unifiedLazyRoutes.tsx',
      
      // Documentation obsolète
      'src/AUDIT.md',
      'src/README.md'
    ];

    for (const filePath of unusedFiles) {
      try {
        await fs.access(filePath);
        const stats = await fs.stat(filePath);
        await fs.unlink(filePath);
        
        this.report.unusedFilesRemoved.push(filePath);
        this.report.totalSizeReduced += stats.size;
        console.log(`🗑️  Fichier inutilisé supprimé: ${filePath}`);
      } catch (error) {
        // File doesn't exist, skip
      }
    }
  }

  // ==================== OPTIMISATION DES IMPORTS ====================
  
  private async optimizeImports() {
    const mainFiles = [
      'src/App.tsx',
      'src/AppProviders.tsx',
      'src/main.tsx'
    ];

    for (const filePath of mainFiles) {
      try {
        let content = await fs.readFile(filePath, 'utf-8');
        
        // Remplacer les imports redondants
        const importReplacements = [
          // Contexts
          {
            from: /import.*from ['"]@\/contexts\/.*Context['"];?\n/g,
            to: ''
          },
          
          // Stores
          {
            from: /import.*from ['"]@\/stores?\/.*['"];?\n/g,
            to: ''
          },
          
          // Hooks redondants
          {
            from: /import { use[A-Z][a-zA-Z]* } from ['"]@\/hooks\/use-[a-z-]*['"];?\n/g,
            to: ''
          }
        ];

        let hasChanges = false;
        for (const replacement of importReplacements) {
          const newContent = content.replace(replacement.from, replacement.to);
          if (newContent !== content) {
            content = newContent;
            hasChanges = true;
          }
        }

        if (hasChanges) {
          await fs.writeFile(filePath, content);
          this.report.filesConsolidated.push(filePath);
          console.log(`📝 Imports optimisés: ${filePath}`);
        }
      } catch (error) {
        this.report.errors.push(`Erreur optimisation imports ${filePath}: ${error}`);
      }
    }
  }

  // ==================== SUPPRESSION DOSSIERS VIDES ====================
  
  private async removeEmptyDirectories() {
    const potentiallyEmptyDirs = [
      'src/providers',
      'src/state',
      'src/stores',
      'src/contexts/__tests__',
      'src/hooks/__tests__',
      'src/components/ErrorBoundary',
      'src/components/loading'
    ];

    for (const dirPath of potentiallyEmptyDirs) {
      try {
        const files = await fs.readdir(dirPath);
        if (files.length === 0) {
          await fs.rmdir(dirPath);
          console.log(`📁 Dossier vide supprimé: ${dirPath}`);
        }
      } catch (error) {
        // Directory doesn't exist or not empty
      }
    }
  }

  // ==================== CRÉATION D'UN RAPPORT ====================
  
  generateReport(): string {
    const totalFiles = this.report.duplicatesRemoved.length + 
                      this.report.unusedFilesRemoved.length;
    const sizeInKB = (this.report.totalSizeReduced / 1024).toFixed(2);
    
    return `
🧹 RAPPORT DE NETTOYAGE AUTOMATIQUE
=====================================

📊 Statistiques:
- Fichiers supprimés: ${totalFiles}
- Doublons éliminés: ${this.report.duplicatesRemoved.length}
- Fichiers inutilisés: ${this.report.unusedFilesRemoved.length}
- Fichiers consolidés: ${this.report.filesConsolidated.length}
- Taille réduite: ${sizeInKB} KB
- Erreurs: ${this.report.errors.length}

🗑️  Doublons supprimés:
${this.report.duplicatesRemoved.map(f => `  - ${f}`).join('\n')}

📦 Fichiers consolidés:
${this.report.filesConsolidated.map(f => `  - ${f}`).join('\n')}

${this.report.errors.length > 0 ? `
❌ Erreurs:
${this.report.errors.map(e => `  - ${e}`).join('\n')}
` : ''}

✅ Nettoyage terminé avec succès!
Architecture unifiée et optimisée.`;
  }
}

export const cleanupManager = new CleanupManager();

// Fonction d'exécution pour le CLI
export const runCleanup = async () => {
  const report = await cleanupManager.cleanup();
  console.log(cleanupManager.generateReport());
  return report;
};

export default CleanupManager;