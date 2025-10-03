
/**
 * Utilitaire pour retry automatique des imports lazy en cas d'échec réseau
 */
export const retryLazyImport = async <T>(
  importFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await importFn();
    } catch (error) {
      lastError = error as Error;
      
      // Si c'est une erreur de chunk loading, on retry
      if (error instanceof Error && error.name === 'ChunkLoadError') {
        console.warn(`Chunk load failed, retrying... (attempt ${i + 1}/${maxRetries})`);
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }
      
      // Pour les autres erreurs, on ne retry pas
      throw error;
    }
  }
  
  throw lastError!;
};
