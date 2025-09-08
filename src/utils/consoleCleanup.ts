/**
 * Console Cleanup - Production Ready
 * Systematically removes all development console statements
 */

export const cleanupConsoleStatements = () => {
  // Disabled to prevent "Illegal invocation" errors
  // Console cleanup is handled by the build process instead
  if (false && process.env.NODE_ENV === 'production') {
    // This code is intentionally disabled
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
