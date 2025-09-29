
/**
 * Security headers management
 */

export const APP_BASE_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' https://rsms.me https://fonts.gstatic.com data:",
  "style-src 'self' 'unsafe-inline' https://rsms.me https://fonts.googleapis.com",
  "script-src 'self' https://cdn.gpteng.co",
  "connect-src 'self' https://*.supabase.co https://*.supabase.in https://api.emotionscare.com https://api.openai.com https://cdn.gpteng.co https://api.hume.ai https://*.sentry.io https://*.ingest.sentry.io wss://*.supabase.co wss://*.supabase.in",
  "media-src 'self' blob: https://*.supabase.co https://storage.googleapis.com",
  "frame-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
].join('; ');

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'geolocation=()',
    'microphone=()',
    'camera=()'
  ].join(', '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-site',
  'X-Robots-Tag': 'noindex',
  'Content-Security-Policy': APP_BASE_CSP,
};

/**
 * Apply security headers to fetch requests
 */
export const withSecurityHeaders = (headers: HeadersInit = {}): HeadersInit => {
  return {
    ...SECURITY_HEADERS,
    ...headers
  };
};

/**
 * Validate response headers for security compliance
 */
export const validateSecurityHeaders = (response: Response): boolean => {
  const requiredHeaders = [
    'x-content-type-options',
    'x-frame-options',
    'referrer-policy'
  ];

  return requiredHeaders.every(header => 
    response.headers.has(header)
  );
};

/**
 * Apply security headers to meta tags
 */
export const applySecurityMeta = (): void => {
  if (typeof document === 'undefined') return;

  // Remove existing security meta tags
  const existingMetas = document.querySelectorAll(
    'meta[name^="security-"], meta[http-equiv^="X-"], meta[http-equiv="Content-Security-Policy"]',
  );
  existingMetas.forEach(meta => meta.remove());

  // Add security meta tags
  const metas = [
    { httpEquiv: 'Content-Security-Policy', content: APP_BASE_CSP },
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'X-Frame-Options', content: 'DENY' },
    { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
    { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
    { httpEquiv: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' },
    { httpEquiv: 'Cross-Origin-Resource-Policy', content: 'same-site' },
    { httpEquiv: 'X-Robots-Tag', content: 'noindex' }
  ];

  metas.forEach(metaData => {
    const meta = document.createElement('meta');
    if (metaData.httpEquiv) {
      meta.httpEquiv = metaData.httpEquiv;
    }
    meta.content = metaData.content;
    document.head.appendChild(meta);
  });
};
