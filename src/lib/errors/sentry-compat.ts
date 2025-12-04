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
  
  captureMessage(message: string, options?: any) {
    const level = options?.level || 'info';
    switch (level) {
      case 'debug':
        logger.debug(message, options || {}, 'SENTRY');
        break;
      case 'warning':
      case 'warn':
        logger.warn(message, options || {}, 'SENTRY');
        break;
      case 'error':
        logger.error(message, options || {}, 'SENTRY');
        break;
      default:
        logger.info(message, options || {}, 'SENTRY');
    }
  },
  
  addBreadcrumb(breadcrumb: any) {
    const level = breadcrumb.level || 'info';
    const category = breadcrumb.category || 'APP';
    const message = breadcrumb.message || '';
    const data = breadcrumb.data;
    
    // Map level to logger method
    if (level === 'debug') {
      logger.debug(message, data, category.toUpperCase());
    } else if (level === 'warning' || level === 'warn') {
      logger.warn(message, data, category.toUpperCase());
    } else if (level === 'error') {
      logger.error(message, data, category.toUpperCase());
    } else {
      logger.info(message, data, category.toUpperCase());
    }
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
  
  metrics: {
    increment(_name: string, _value?: number, _tags?: any) {
      // No-op: AI Monitoring doesn't use metrics
    },
    distribution(_name: string, _value: number, _tags?: any) {
      // No-op: AI Monitoring doesn't use metrics
    },
    gauge(_name: string, _value: number, _tags?: any) {
      // No-op: AI Monitoring doesn't use metrics
    },
    set(_name: string, _value: number | string, _tags?: any) {
      // No-op: AI Monitoring doesn't use metrics
    },
  },
};
