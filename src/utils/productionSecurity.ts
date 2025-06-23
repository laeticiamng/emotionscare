
/**
 * Sécurité renforcée pour la production
 */

// CSP (Content Security Policy) stricte
export const setupCSP = () => {
  if (typeof window !== 'undefined' && import.meta.env.PROD) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://api.supabase.co wss://realtime.supabase.co;
      media-src 'self' blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim();
    document.head.appendChild(meta);
  }
};

// Désactivation des DevTools en production
export const disableDevTools = () => {
  if (import.meta.env.PROD) {
    // Désactiver le clic droit
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Désactiver les raccourcis clavier des DevTools
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    });

    // Détection d'ouverture des DevTools
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          console.clear();
          console.log('%c🔒 Application protégée', 'color: red; font-size: 20px; font-weight: bold;');
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }
};

// Protection contre l'injection de scripts
export const preventXSS = () => {
  // Surveiller les tentatives d'injection de scripts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          
          // Supprimer les scripts non autorisés
          if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-allowed')) {
            element.remove();
            console.warn('🚨 Script non autorisé supprimé');
          }
          
          // Nettoyer les attributs event handlers
          Array.from(element.attributes || []).forEach((attr) => {
            if (attr.name.startsWith('on')) {
              element.removeAttribute(attr.name);
              console.warn(`🚨 Event handler ${attr.name} supprimé`);
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

// Nettoyage des données sensibles
export const sanitizeData = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });
  
  return sanitized;
};

// Initialisation de la sécurité production
export const initializeProductionSecurity = () => {
  if (import.meta.env.PROD) {
    setupCSP();
    disableDevTools();
    preventXSS();
    
    // Log sécurisé
    const originalLog = console.log;
    console.log = (...args) => {
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'object' ? sanitizeData(arg) : arg
      );
      originalLog(...sanitizedArgs);
    };
    
    console.log('🔒 Sécurité production activée');
  }
};
