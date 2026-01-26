 
import { logger } from '@/lib/logger';

declare const React: any;

export const validateStartup = (): boolean => {
  try {
    // Vérifier que React est disponible
    if (typeof React === 'undefined') {
      logger.error('❌ React is not available globally', new Error('React not available'), 'SYSTEM');
      return false;
    }

    // Vérifier que les hooks React sont disponibles
    if (!React.useState || !React.useEffect) {
      logger.error('❌ React hooks are not available', new Error('React hooks not available'), 'SYSTEM');
      return false;
    }

    // Vérifier que le DOM est prêt
    if (!document.getElementById('root')) {
      logger.error('❌ Root element not found', new Error('Root element not found'), 'SYSTEM');
      return false;
    }

    // Vérifier que les modules React essentiels sont chargés
    if (typeof React.createElement !== 'function') {
      logger.error('❌ React.createElement is not available', new Error('React.createElement not available'), 'SYSTEM');
      return false;
    }

    logger.info('✅ Startup validation successful', {}, 'SYSTEM');
    return true;
  } catch (error) {
    logger.error('❌ Startup validation failed', error as Error, 'SYSTEM');
    return false;
  }
};
