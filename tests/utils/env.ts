export const getEnv = (key: string): string | undefined => {
  return (globalThis as any).importMetaEnv?.[key] || process.env[key];
};
