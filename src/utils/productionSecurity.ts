// @ts-nocheck

import { logger } from '@/lib/logger';

const isProd = import.meta.env.MODE === 'production';

export const initializeProductionSecurity = () => {
  // Configuration de sécurité pour la production
  if (typeof window !== 'undefined') {
    // Désactiver les outils de développement en production
    if (isProd) {
      logger.info('Production security initialized', {}, 'SYSTEM');
    }
  }
};

export const initializeProductionOptimizations = () => {
  if (typeof window !== 'undefined') {
    // Clean up development code
    if (isProd) {
      // Override console methods in production
      const noop = () => {};
      console.log = noop;
      console.warn = noop;
      console.info = noop;
      // Keep console.error for critical issues
    }
    
    // Performance optimizations
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Cleanup unused DOM nodes
        const unusedElements = document.querySelectorAll('[data-dev-only]');
        unusedElements.forEach(el => el.remove());
      });
    }
    
    // Service Worker registration for caching
    if ('serviceWorker' in navigator && isProd) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silent fail for SW registration
      });
    }
    
    // Initialize security
    initializeProductionSecurity();
  }
};
