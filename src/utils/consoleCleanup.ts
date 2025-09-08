/**
 * Production console cleanup utility
 * Safe console handling without "Illegal invocation" errors
 */

/**
 * Safe production event logger
 */
export const logProductionEvent = (
  event: string, 
  data?: unknown, 
  level: 'info' | 'warn' | 'error' = 'info'
): void => {
  if (process.env.NODE_ENV === 'development') {
    const logMethod = console[level].bind(console);
    logMethod(`[${event}]`, data);
  }
};

/**
 * Safe console initialization for production
 */
export const initProductionConsole = (): void => {
  if (import.meta.env.PROD) {
    // Safe noop replacement
    const noop = () => {};
    
    // Override console methods safely
    Object.assign(console, {
      log: noop,
      debug: noop,
      info: noop,
      warn: noop,
      group: noop,
      groupCollapsed: noop,
      groupEnd: noop
    });
  }
};