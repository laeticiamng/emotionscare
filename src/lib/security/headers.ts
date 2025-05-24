
/**
 * Security headers management
 */

export const SECURITY_HEADERS = {
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
  ].join(', '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
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
  const existingMetas = document.querySelectorAll('meta[name^="security-"], meta[http-equiv^="X-"]');
  existingMetas.forEach(meta => meta.remove());

  // Add security meta tags
  const metas = [
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'X-Frame-Options', content: 'DENY' },
    { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
    { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
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
