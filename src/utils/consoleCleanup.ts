/**
 * Console Cleanup - Production Ready
 * Systematically removes all development console statements
 */

export const cleanupConsoleStatements = () => {
  if (process.env.NODE_ENV === 'production') {
    // Safe console override to prevent "Illegal invocation" errors
    const noop = () => {};
    
    // Safely bind original methods
    const originalError = console.error.bind(console);
    const originalWarn = console.warn.bind(console);
    
    // Override development methods with bound noop
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    console.trace = noop;
    console.table = noop;
    console.group = noop;
    console.groupCollapsed = noop;
    console.groupEnd = noop;
    console.count = noop;
    console.time = noop;
    console.timeEnd = noop;
    
    // Enhanced error reporting with proper binding
    console.error = (...args: any[]) => {
      // In production, send to monitoring service
      if (typeof window !== 'undefined' && (window as any).sentryEnabled) {
        originalError('[PRODUCTION ERROR]', ...args);
      }
    };
    
    console.warn = (...args: any[]) => {
      // Log warnings only for critical issues
      if (args.some(arg => 
        typeof arg === 'string' && (
          arg.includes('accessibility') || 
          arg.includes('performance') || 
          arg.includes('security')
        )
      )) {
        originalWarn('[PRODUCTION WARNING]', ...args);
      }
    };
  }
};

// Development helper to find console statements
export const logProductionEvent = (event: string, data?: any, level: 'info' | 'warn' | 'error' = 'info') => {
  if (process.env.NODE_ENV === 'development') {
    console[level](`[${event}]`, data);
  } else if (level === 'error' || level === 'warn') {
    // Only log warnings and errors in production
    console[level](`[PROD-${event}]`, data);
  }
};

// Replace console.log with this in components
export const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export const debugLog = (context: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG-${context}]`, data);
  }
};
