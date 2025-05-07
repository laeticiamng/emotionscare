
import { useCallback } from 'react';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  component?: string;
  timestamp?: boolean;
  data?: Record<string, any>;
}

export const useLogger = (defaultComponent?: string) => {
  const createLogMessage = useCallback((
    level: LogLevel, 
    message: string, 
    options: LogOptions = {}
  ) => {
    const { 
      component = defaultComponent || 'App', 
      timestamp = true, 
      data = {} 
    } = options;
    
    const time = timestamp ? new Date().toISOString() : null;
    const prefix = timestamp ? `${time} [${component}]` : `[${component}]`;
    
    return { prefix, message, data };
  }, [defaultComponent]);

  const log = useCallback((
    level: LogLevel, 
    message: string, 
    options: LogOptions = {}
  ) => {
    const { prefix, message: msg, data } = createLogMessage(level, message, options);
    
    switch (level) {
      case 'info':
        if (Object.keys(data).length > 0) {
          console.info(`${prefix}: ${msg}`, data);
        } else {
          console.info(`${prefix}: ${msg}`);
        }
        break;
      case 'warn':
        if (Object.keys(data).length > 0) {
          console.warn(`${prefix}: ${msg}`, data);
        } else {
          console.warn(`${prefix}: ${msg}`);
        }
        break;
      case 'error':
        if (Object.keys(data).length > 0) {
          console.error(`${prefix}: ${msg}`, data);
        } else {
          console.error(`${prefix}: ${msg}`);
        }
        break;
      case 'debug':
        if (process.env.NODE_ENV !== 'production') {
          if (Object.keys(data).length > 0) {
            console.debug(`${prefix}: ${msg}`, data);
          } else {
            console.debug(`${prefix}: ${msg}`);
          }
        }
        break;
    }
  }, [createLogMessage]);

  return {
    info: useCallback((message: string, options?: LogOptions) => log('info', message, options), [log]),
    warn: useCallback((message: string, options?: LogOptions) => log('warn', message, options), [log]),
    error: useCallback((message: string, options?: LogOptions) => log('error', message, options), [log]),
    debug: useCallback((message: string, options?: LogOptions) => log('debug', message, options), [log])
  };
};

export default useLogger;
