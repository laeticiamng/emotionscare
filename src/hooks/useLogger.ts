
const useLogger = (componentName: string) => {
  const prefix = `[${componentName}]`;
  
  const debug = (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`${prefix} ${message}`, data || '');
    }
  };
  
  const info = (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`${prefix} ${message}`, data || '');
    }
  };
  
  const warn = (message: string, data?: any) => {
    console.warn(`${prefix} ${message}`, data || '');
  };
  
  const error = (message: string, data?: any) => {
    console.error(`${prefix} ${message}`, data || '');
  };
  
  return { debug, info, warn, error };
};

export default useLogger;
