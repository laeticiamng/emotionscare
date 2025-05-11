
import { useCallback } from 'react';

export default function useLogger(componentName: string) {
  const debug = useCallback((...args: any[]) => {
    console.debug(`[${componentName}]`, ...args);
  }, [componentName]);

  const info = useCallback((...args: any[]) => {
    console.info(`[${componentName}]`, ...args);
  }, [componentName]);

  const warn = useCallback((...args: any[]) => {
    console.warn(`[${componentName}]`, ...args);
  }, [componentName]);

  const error = useCallback((...args: any[]) => {
    console.error(`[${componentName}]`, ...args);
  }, [componentName]);

  return {
    debug,
    info,
    warn,
    error
  };
}
