
/**
 * Configuration de sécurité pour la production
 */

// Headers de sécurité obligatoires pour la production
export const PRODUCTION_SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.gpteng.co https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: https://images.unsplash.com",
    "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.hume.ai",
    "media-src 'self' blob: data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'geolocation=(self)',
    'microphone=(self)', 
    'camera=(self)',
    'fullscreen=(self)',
    'payment=()'
  ].join(', ')
};

/**
 * Validation des variables d'environnement critiques
 */
export function validateProductionEnvironment(): void {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(`Production deployment blocked: Missing ${missing.join(', ')}`);
  }

  console.log('✅ Production environment validation passed');
}

/**
 * Configuration HTTPS en production
 */
export function enforceHTTPS(): void {
  if (import.meta.env.PROD && window.location.protocol !== 'https:') {
    console.warn('🔒 Redirecting to HTTPS');
    window.location.replace(window.location.href.replace(/^http:/, 'https:'));
  }
}

/**
 * Désactive les outils de développement en production
 */
export function disableDevTools(): void {
  if (import.meta.env.PROD) {
    // Désactiver les logs de développement
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    
    // Détecter l'ouverture des DevTools
    let devtools = {open: false, orientation: null};
    const threshold = 160;
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          console.clear();
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }
}

/**
 * Protection contre le clickjacking
 */
export function preventClickjacking(): void {
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }
}

/**
 * Initialise toutes les protections de sécurité
 */
export function initProductionSecurity(): void {
  try {
    validateProductionEnvironment();
    enforceHTTPS();
    disableDevTools();
    preventClickjacking();
    
    console.log('🛡️ Production security measures activated');
  } catch (error) {
    console.error('❌ Security initialization failed:', error);
    throw error;
  }
}
