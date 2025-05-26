
// Utilitaires de sécurité pour la production
export const initProductionSecurity = async (): Promise<void> => {
  if (import.meta.env.PROD) {
    // Désactiver les DevTools en production
    if (typeof window !== 'undefined') {
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        isDisabled: true,
        supportsFiber: true,
        inject: () => {},
        onCommitFiberRoot: () => {},
        onCommitFiberUnmount: () => {},
      };
    }

    // Console warnings en production
    console.log('🛡️ Mode production activé - Sécurité renforcée');
  }
};

export const initBuildOptimizations = async (): Promise<void> => {
  if (import.meta.env.PROD) {
    // Optimisations de performance
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker enregistré');
      } catch (error) {
        console.warn('⚠️ Échec d\'enregistrement du Service Worker:', error);
      }
    }
  }
};

export const applyCSP = (): void => {
  if (import.meta.env.PROD) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://cdn.gpteng.co;
      style-src 'self' 'unsafe-inline' https://rsms.me;
      font-src 'self' https://rsms.me;
      img-src 'self' data: https:;
      connect-src 'self' https://yaincoxihiqdksxgrsrk.supabase.co;
    `.replace(/\s+/g, ' ').trim();
    document.head.appendChild(meta);
  }
};

export const applySecurityMeta = (): void => {
  const metas = [
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'X-Frame-Options', content: 'DENY' },
    { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
    { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
  ];

  metas.forEach(({ httpEquiv, content }) => {
    const meta = document.createElement('meta');
    meta.httpEquiv = httpEquiv;
    meta.content = content;
    document.head.appendChild(meta);
  });
};
