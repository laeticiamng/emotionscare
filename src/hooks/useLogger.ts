
import { useCallback } from 'react';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

// Get the current log level from env or localStorage
const getCurrentLogLevel = (): number => {
  const storedLevel = localStorage.getItem('log_level');
  if (storedLevel && storedLevel in LOG_LEVELS) {
    return LOG_LEVELS[storedLevel as LogLevel];
  }
  
  // Default to 'info' in production, 'debug' otherwise
  const isProd = import.meta.env.PROD;
  return isProd ? LOG_LEVELS.info : LOG_LEVELS.debug;
};

export const useLogger = (context: string): Logger => {
  const currentLogLevel = getCurrentLogLevel();
  
  const log = useCallback((level: LogLevel, message: string, ...args: any[]) => {
    if (LOG_LEVELS[level] < currentLogLevel) {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}][${context}][${level.toUpperCase()}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  }, [context, currentLogLevel]);
  
  return {
    debug: (message: string, ...args: any[]) => log('debug', message, ...args),
    info: (message: string, ...args: any[]) => log('info', message, ...args),
    warn: (message: string, ...args: any[]) => log('warn', message, ...args),
    error: (message: string, ...args: any[]) => log('error', message, ...args),
  };
};

export default useLogger;
