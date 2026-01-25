import { APP_BASE_CSP } from './headers';
import { logger } from '@/lib/logger';

/**
 * Sécurité renforcée pour la production
 */

export const initProductionSecurity = async (): Promise<void> => {
  if (import.meta.env.PROD) {
    // Désactiver les DevTools en production
    disableDevTools();
    
    // Nettoyer les variables sensibles
    cleanSensitiveData();
    
    // Initialiser le monitoring de sécurité
    initSecurityMonitoring();
    
    logger.info('Production security initialized', undefined, 'SYSTEM');
  }
};

const disableDevTools = (): void => {
  if (typeof window !== 'undefined') {
    // Désactiver React DevTools
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      isDisabled: true,
      supportsFiber: true,
      inject: () => {},
      onCommitFiberRoot: () => {},
      onCommitFiberUnmount: () => {},
    };

    // EN PRODUCTION SEULEMENT : Remplacer console par le logger sécurisé
    // MAIS garder console.error pour le débogage critique
    if (import.meta.env.PROD) {
      const noop = () => {};
      const originalError = console.error;
      console.log = noop;
      console.warn = noop;
      console.info = noop;
      console.debug = noop;
      // Garder console.error pour voir les erreurs critiques
      console.error = (...args) => {
        logger.error('Production error', args[0], 'SYSTEM');
        originalError(...args);
      };
    }
  }
};

const _applySecurityHeaders = (): void => {
  if (typeof document === 'undefined') {
    return;
  }

  // Content Security Policy
  const existingCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (existingCsp) {
    existingCsp.setAttribute('content', APP_BASE_CSP);
  } else {
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = APP_BASE_CSP;
    document.head.appendChild(cspMeta);
  }

  // Autres en-têtes de sécurité
  const securityHeaders = [
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'X-Frame-Options', content: 'DENY' },
    { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
    { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
    { httpEquiv: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' },
    { httpEquiv: 'Cross-Origin-Resource-Policy', content: 'same-site' },
    { httpEquiv: 'X-Robots-Tag', content: 'noindex' }
  ];

  securityHeaders.forEach(({ httpEquiv, content }) => {
    const selector = `meta[http-equiv="${httpEquiv}"]`;
    const existing = document.querySelector(selector);
    if (existing) {
      existing.setAttribute('content', content);
      return;
    }

    const meta = document.createElement('meta');
    meta.httpEquiv = httpEquiv;
    meta.content = content;
    document.head.appendChild(meta);
  });
};

const cleanSensitiveData = (): void => {
  // Nettoyer les variables d'environnement sensibles du côté client
  if (typeof window !== 'undefined') {
    // Supprimer les clés sensibles qui pourraient être exposées
    delete (window as any).SUPABASE_SERVICE_ROLE_KEY;
    delete (window as any).DATABASE_PASSWORD;
    delete (window as any).VITE_SUPABASE_SERVICE_ROLE_KEY;
    delete (window as any).VITE_SUPABASE_SERVICE_ROLE;
    delete (window as any).SUPABASE_SERVICE_ROLE;
  }
};

const initSecurityMonitoring = (): void => {
  // Surveiller les tentatives d'injection XSS
  window.addEventListener('error', (event) => {
    if (event.error && event.error.stack) {
      const stack = event.error.stack.toLowerCase();
      if (stack.includes('script') || stack.includes('eval') || stack.includes('function')) {
        logger.warn('Potential XSS attempt detected', undefined, 'SYSTEM');
        // En production, envoyer à un service de monitoring
      }
    }
  });

  // Surveiller les tentatives de manipulation du DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-allowed')) {
              logger.warn('Unauthorized script injection detected', undefined, 'SYSTEM');
              element.remove();
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

export const validateEnvironment = (): boolean => {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missing = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);

  const forbiddenEnvVars = ['VITE_SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_SERVICE_ROLE'];
  const exposedForbidden = forbiddenEnvVars.filter((envVar) => {
    const value = (import.meta.env as Record<string, string | undefined>)[envVar];
    return typeof value === 'string' && value.trim().length > 0;
  });

  if (missing.length > 0) {
    logger.error('Missing required environment variables', { missing }, 'SYSTEM');
    return false;
  }

  if (exposedForbidden.length > 0) {
    logger.error('Forbidden environment variables exposed in client build', { exposedForbidden }, 'SYSTEM');
    return false;
  }

  return true;
};
