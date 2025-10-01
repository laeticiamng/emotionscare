// @ts-nocheck
/**
 * Script de nettoyage final automatique - EmotionsCare
 * Nettoie automatiquement tous les console.log et finalise la production
 */

import { logger } from '@/lib/logger';

// Remplacement global des console.log par le logger
const replaceConsoleInProduction = () => {
  if (import.meta.env.PROD) {
    // Sauvegarde des méthodes originales
    const originalMethods = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug
    };

    // Remplacement par le système de logger sécurisé
    console.log = (message: any, ...args: any[]) => {
      logger.debug(String(message), args.length > 0 ? args : undefined, 'SYSTEM');
    };

    console.warn = (message: any, ...args: any[]) => {
      logger.warn(String(message), args.length > 0 ? args : undefined, 'SYSTEM');
    };

    console.error = (message: any, ...args: any[]) => {
      logger.error(String(message), args.length > 0 ? args : undefined, 'SYSTEM');
    };

    console.info = (message: any, ...args: any[]) => {
      logger.info(String(message), args.length > 0 ? args : undefined, 'SYSTEM');
    };

    console.debug = (message: any, ...args: any[]) => {
      logger.debug(String(message), args.length > 0 ? args : undefined, 'SYSTEM');
    };

    // En développement, restaurer les méthodes originales si nécessaire
    if (import.meta.env.DEV) {
      (window as any).__restoreConsole = () => {
        Object.assign(console, originalMethods);
      };
    }

    logger.info('Console methods redirected to secure logger', null, 'SYSTEM');
  }
};

// Nettoyage des variables globales sensibles
const cleanSensitiveGlobals = () => {
  if (typeof window !== 'undefined') {
    // Supprimer les variables potentiellement exposées
    delete (window as any).SUPABASE_SERVICE_ROLE_KEY;
    delete (window as any).DATABASE_PASSWORD;
    delete (window as any).ADMIN_SECRET;
    delete (window as any).__DEV__;
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION__;

    // Nettoyer les propriétés de debug
    if (import.meta.env.PROD) {
      delete (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    }

    logger.debug('Sensitive globals cleaned', null, 'SYSTEM');
  }
};

// Optimisation des performances globales
const optimizeGlobalPerformance = () => {
  // Désactiver les animations sur les appareils à faibles performances
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
    document.documentElement.classList.add('reduced-motion');
  }

  // Optimisation des images lazy loading
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Force garbage collection si disponible
  if ('gc' in window && typeof (window as any).gc === 'function') {
    setTimeout(() => {
      (window as any).gc();
      logger.debug('Forced garbage collection', null, 'SYSTEM');
    }, 5000);
  }

  logger.debug('Global performance optimizations applied', null, 'SYSTEM');
};

// Validation finale de l'environnement
const validateFinalEnvironment = (): boolean => {
  const checks = [
    // Vérifications critiques
    () => typeof React !== 'undefined',
    () => typeof window !== 'undefined',
    () => !!document.getElementById('root'),
    () => !!import.meta.env.VITE_SUPABASE_URL,
    () => !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    
    // Vérifications de sécurité
    () => !window.location.protocol.startsWith('http:') || window.location.hostname === 'localhost',
    () => typeof logger !== 'undefined',
    
    // Vérifications des dépendances critiques
    () => typeof ReactDOM !== 'undefined'
  ];

  const results = checks.map((check, index) => {
    try {
      const result = check();
      if (!result) {
        logger.error(`Environment check ${index + 1} failed`, null, 'SYSTEM');
      }
      return result;
    } catch (error) {
      logger.error(`Environment check ${index + 1} error`, error, 'SYSTEM');
      return false;
    }
  });

  const isValid = results.every(Boolean);
  
  if (isValid) {
    logger.info('Final environment validation passed', { checksCount: checks.length }, 'SYSTEM');
  } else {
    logger.error('Final environment validation failed', { failedChecks: results.filter(r => !r).length }, 'SYSTEM');
  }

  return isValid;
};

// Initialisation du monitoring de production
const initProductionMonitoring = () => {
  // Surveillance des erreurs non capturées
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error detected', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack
    }, 'SYSTEM');
  });

  // Surveillance des promesses rejetées
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: event.reason,
      promise: event.promise
    }, 'SYSTEM');
  });

  // Surveillance des performances
  if ('PerformanceObserver' in window) {
    try {
      const perfObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation' && entry.duration > 3000) {
            logger.warn('Slow navigation detected', {
              duration: entry.duration,
              name: entry.name
            }, 'SYSTEM');
          }
        });
      });
      
      perfObserver.observe({ entryTypes: ['navigation', 'measure'] });
    } catch (error) {
      logger.debug('Performance monitoring setup failed', error, 'SYSTEM');
    }
  }

  logger.info('Production monitoring initialized', null, 'SYSTEM');
};

// Export du script principal
export const runFinalCleanup = async (): Promise<boolean> => {
  logger.info('Starting final production cleanup', null, 'SYSTEM');
  
  try {
    // 1. Remplacement des console.log
    replaceConsoleInProduction();
    
    // 2. Nettoyage des variables sensibles
    cleanSensitiveGlobals();
    
    // 3. Optimisation des performances
    optimizeGlobalPerformance();
    
    // 4. Validation finale
    const isValid = validateFinalEnvironment();
    if (!isValid) {
      throw new Error('Final environment validation failed');
    }
    
    // 5. Initialisation du monitoring
    initProductionMonitoring();
    
    logger.info('Final cleanup completed successfully', {
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
      version: '3.0.0'
    }, 'SYSTEM');
    
    return true;
  } catch (error) {
    logger.error('Final cleanup failed', error, 'SYSTEM');
    return false;
  }
};

// Auto-exécution désactivée pour éviter les boucles infinies
// if (import.meta.env.PROD) {
//   setTimeout(() => {
//     runFinalCleanup().then(success => {
//       if (success) {
//         logger.info('🎉 EmotionsCare production environment is fully optimized and secure', null, 'SYSTEM');
//       }
//     });
//   }, 1000);
// }

export default runFinalCleanup;