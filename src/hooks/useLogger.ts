
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  enabled?: boolean;
  minLevel?: LogLevel;
  includeTimestamp?: boolean;
}

const logLevelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

export default function useLogger(namespace: string, options: LoggerOptions = {}) {
  const {
    enabled = true,
    minLevel = 'debug',
    includeTimestamp = true
  } = options;
  
  const shouldLog = (level: LogLevel): boolean => {
    if (!enabled) return false;
    return logLevelPriority[level] >= logLevelPriority[minLevel];
  };
  
  const formatMessage = (message: string): string => {
    const timestamp = includeTimestamp ? `[${new Date().toISOString()}]` : '';
    return `${timestamp} [${namespace}] ${message}`;
  };
  
  const debug = (message: string, ...args: any[]): void => {
    if (shouldLog('debug')) {
      console.debug(formatMessage(message), ...args);
    }
  };
  
  const info = (message: string, ...args: any[]): void => {
    if (shouldLog('info')) {
      console.info(formatMessage(message), ...args);
    }
  };
  
  const warn = (message: string, ...args: any[]): void => {
    if (shouldLog('warn')) {
      console.warn(formatMessage(message), ...args);
    }
  };
  
  const error = (message: string, ...args: any[]): void => {
    if (shouldLog('error')) {
      console.error(formatMessage(message), ...args);
    }
  };
  
  return {
    debug,
    info,
    warn,
    error
  };
}
