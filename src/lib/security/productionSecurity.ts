
import { APP_BASE_CSP } from './headers';

/**
 * Sécurité renforcée pour la production
 */

export const initProductionSecurity = async (): Promise<void> => {
  if (import.meta.env.PROD) {
    // Désactiver les DevTools en production
    disableDevTools();
    
    // Appliquer les en-têtes de sécurité
    applySecurityHeaders();
    
    // Nettoyer les variables sensibles
    cleanSensitiveData();
    
    // Initialiser le monitoring de sécurité
    initSecurityMonitoring();
    
    console.log('🛡️ Production security initialized');
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

    // Remplacer console par le logger sécurisé
    if (import.meta.env.PROD) {
      const noop = () => {};
      console.log = noop;
      console.warn = noop;
      console.error = noop;
      console.info = noop;
      console.debug = noop;
    }
  }
};

const applySecurityHeaders = (): void => {
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
        console.warn('🚨 Potential XSS attempt detected');
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
              console.warn('🚨 Unauthorized script injection detected');
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
    console.error('❌ Missing required environment variables:', missing);
    return false;
  }

  if (exposedForbidden.length > 0) {
    console.error('❌ Forbidden environment variables exposed in client build:', exposedForbidden);
    return false;
  }

  return true;
};
