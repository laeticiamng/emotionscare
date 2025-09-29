
/**
 * Content Security Policy configuration
 */

export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Needed for Vite in development
    "'unsafe-eval'", // Needed for development
    "https://cdn.gpteng.co", // Lovable badge
    "https://www.googletagmanager.com",
    "https://unpkg.com" // For external libraries
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Needed for CSS-in-JS and Tailwind
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com",
    "data:"
  ],
  'img-src': [
    "'self'",
    "data:",
    "blob:",
    "https:",
    "https://images.unsplash.com",
    "https://cdn.gpteng.co"
  ],
  'media-src': [
    "'self'",
    "blob:",
    "data:"
  ],
  'connect-src': [
    "'self'",
    "https://api.openai.com",
    "https://*.supabase.co",
    "https://api.hume.ai",
    "wss://*.supabase.co",
    process.env.NODE_ENV === 'development' ? "ws://localhost:*" : ""
  ].filter(Boolean),
  'frame-src': [
    "'self'",
    "https://www.youtube.com",
    "https://player.vimeo.com"
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

export const generateCSP = (): string => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
};

/**
 * Apply CSP meta tag to document head
 */
export const applyCSP = (): void => {
  if (typeof document === 'undefined') return;
  
  const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (existingMeta) {
    existingMeta.remove();
  }

  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = generateCSP();
  document.head.appendChild(meta);
};
