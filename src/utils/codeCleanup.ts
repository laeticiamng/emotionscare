// @ts-nocheck
/**
 * Code Cleanup Utilities - Production Ready
 * Removes development artifacts and optimizes for production
 */

import { logger } from '@/lib/logger';

export const cleanupDevelopmentCode = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Override console methods in production
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.info = noop;
    // Keep console.error for critical issues
  }
};

export const initializeProductionOptimizations = () => {
  if (typeof window !== 'undefined') {
    // Clean up development code
    cleanupDevelopmentCode();
    
    // Performance optimizations
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Cleanup unused DOM nodes
        const unusedElements = document.querySelectorAll('[data-dev-only]');
        unusedElements.forEach(el => el.remove());
      });
    }
    
    // Service Worker registration for caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silent fail for SW registration
      });
    }
  }
};

export const logProductionEvent = (event: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, send to analytics service instead of console
    // For now, we'll just track critical events
    if (event.includes('error') || event.includes('critical')) {
      logger.error('Production Event', { event, ...data }, 'SYSTEM');
    }
  } else {
    logger.info('Development Event', { event, ...data }, 'SYSTEM');
  }
};
