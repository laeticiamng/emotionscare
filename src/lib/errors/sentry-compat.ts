/**
 * Compatibility layer for Sentry API
 * Redirects Sentry calls to AI Monitoring
 */

import { captureException as aiCaptureException } from '@/lib/ai-monitoring';
import { logger } from '@/lib/logger';

export const Sentry = {
  captureException(error: unknown, options?: any) {
    aiCaptureException(error, options);
  },
  
  addBreadcrumb(breadcrumb: any) {
    const level = breadcrumb.level || 'info';
    const category = breadcrumb.category || 'APP';
    const message = breadcrumb.message || '';
    const data = breadcrumb.data;
    
    const logLevel = level === 'warning' ? 'warn' : level;
    logger[logLevel as keyof typeof logger](message, data, category.toUpperCase());
  },
  
  getCurrentHub() {
    return {
      getClient() {
        return true; // Always active
      }
    };
  },
  
  configureScope(_callback: any) {
    // No-op: AI Monitoring doesn't use scopes
  },
  
  setTag(_key: string, _value: string) {
    // No-op: AI Monitoring uses different tagging
  },
  
  withScope(callback: any) {
    // Execute callback directly without scope
    callback({
      setTag: () => {},
      setContext: () => {},
      setLevel: () => {},
      setFingerprint: () => {},
    });
  },
};
