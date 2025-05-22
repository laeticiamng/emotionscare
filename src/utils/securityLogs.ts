import { trackEvent } from './analytics';

/**
 * Log an unauthorized dashboard access attempt.
 * @param userId Identifier of the user or null for anonymous
 * @param path URL attempted
 */
export function logDashboardAccessDenied(userId: string | null, path: string) {
  const timestamp = new Date().toISOString();
  trackEvent('dashboard_access_denied', {
    properties: {
      user: userId || 'anonymous',
      path,
      timestamp,
    },
    anonymous: !userId,
  });
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[SECURITY] Access denied for ${userId || 'anonymous'} on ${path} at ${timestamp}`);
  }
}
