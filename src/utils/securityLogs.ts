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

/**
 * Log a redirection triggered because the session was missing or invalid.
 * @param userId Optional user identifier
 * @param path Route the user attempted to access
 * @param reason Reason for the redirect (e.g. session_lost)
 */
export function logSessionRedirect(
  userId: string | null,
  path: string,
  reason: string
) {
  const timestamp = new Date().toISOString();
  trackEvent('session_redirect', {
    properties: {
      user: userId || 'anonymous',
      path,
      reason,
      timestamp,
    },
    anonymous: !userId,
  });
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[SECURITY] Session redirect for ${userId || 'anonymous'} on ${path} reason ${reason} at ${timestamp}`
    );
  }
}
