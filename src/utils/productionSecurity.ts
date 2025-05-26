
/**
 * Production security utilities
 * Provides security features for production environment
 */

// Initialize production security features
export const initProductionSecurity = async (): Promise<void> => {
  if (!import.meta.env.PROD) {
    console.log('🛡️ Production security skipped in development');
    return;
  }

  console.log('🛡️ Initializing production security...');
  
  // Content Security Policy
  applyCSP();
  
  // Security headers
  applySecurityMeta();
  
  // Disable console in production
  if (typeof window !== 'undefined') {
    const noop = () => {};
    window.console.log = noop;
    window.console.warn = noop;
    window.console.info = noop;
  }
  
  console.log('✅ Production security initialized');
};

// Initialize build optimizations
export const initBuildOptimizations = async (): Promise<void> => {
  if (!import.meta.env.PROD) {
    console.log('⚡ Build optimizations skipped in development');
    return;
  }

  console.log('⚡ Initializing build optimizations...');
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Initialize service worker
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered');
    } catch (error) {
      console.warn('⚠️ Service Worker registration failed:', error);
    }
  }
  
  console.log('✅ Build optimizations initialized');
};

// Apply Content Security Policy
export const applyCSP = (): void => {
  if (typeof document === 'undefined') return;
  
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' data: https: blob:",
    "connect-src 'self' https: wss:",
    "frame-src 'self' https://www.youtube.com https://youtube.com"
  ].join('; ');
  
  document.head.appendChild(meta);
};

// Apply security meta tags
export const applySecurityMeta = (): void => {
  if (typeof document === 'undefined') return;
  
  const metaTags = [
    { name: 'referrer', content: 'strict-origin-when-cross-origin' },
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'X-Frame-Options', content: 'DENY' },
    { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' }
  ];
  
  metaTags.forEach(({ name, httpEquiv, content }) => {
    const meta = document.createElement('meta');
    if (name) meta.name = name;
    if (httpEquiv) meta.httpEquiv = httpEquiv;
    meta.content = content;
    document.head.appendChild(meta);
  });
};

// Preload critical resources
const preloadCriticalResources = (): void => {
  if (typeof document === 'undefined') return;
  
  const criticalResources = [
    { href: '/manifest.json', as: 'manifest' },
    { href: '/sounds/welcome.mp3', as: 'audio' }
  ];
  
  criticalResources.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
};
