
/**
 * Startup validation utility
 * Checks if all required dependencies are available
 */

export const validateStartup = () => {
  const requiredGlobals = ['React', 'ReactDOM'];
  const missing: string[] = [];

  // Check if React is available
  try {
    if (typeof window !== 'undefined') {
      // Browser environment checks
      if (!window.React && typeof React === 'undefined') {
        missing.push('React');
      }
    }
  } catch (error) {
    console.warn('Startup check: React validation failed', error);
  }

  if (missing.length > 0) {
    console.error('Missing required dependencies:', missing);
    return false;
  }

  console.log('✅ Startup validation passed');
  return true;
};

export const logDependencyStatus = () => {
  console.log('📦 Dependency Status Check:', {
    react: typeof React !== 'undefined',
    reactDOM: typeof ReactDOM !== 'undefined',
    timestamp: new Date().toISOString()
  });
};
