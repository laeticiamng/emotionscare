/**
 * Console Cleanup - Production Ready
 * Systematically removes all development console statements
 */

export const cleanupConsoleStatements = () => {
  if (process.env.NODE_ENV === 'production') {
    // Safe console override to prevent "Illegal invocation" errors
    const noop = function() {};
    
    // Override development methods with properly bound noop
    console.log = noop.bind(console);
    console.info = noop.bind(console);
    console.debug = noop.bind(console);
    console.trace = noop.bind(console);
    console.table = noop.bind(console);
    console.group = noop.bind(console);
    console.groupCollapsed = noop.bind(console);
    console.groupEnd = noop.bind(console);
    console.count = noop.bind(console);
    console.time = noop.bind(console);
    console.timeEnd = noop.bind(console);
    
    // Safely bind original methods
    const originalError = console.error.bind(console);
    const originalWarn = console.warn.bind(console);
    
    // Enhanced error reporting with proper binding
    console.error = function(...args: any[]) {
      // In production, send to monitoring service
      if (typeof window !== 'undefined' && (window as any).sentryEnabled) {
        originalError('[PRODUCTION ERROR]', ...args);
      }
    };
    
    console.warn = function(...args: any[]) {
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
