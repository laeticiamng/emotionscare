
import { useCallback } from 'react';

/**
 * Hook pour gérer l'enregistrement des activités utilisateur
 */
export function useActivity() {
  const logActivity = useCallback((activityType: string, details?: Record<string, any>) => {
    try {
      // Log to console for development
      console.log(`Activity logged: ${activityType}`, details);
      
      // Ici, on pourrait implémenter l'envoi à un service de journalisation
      // Ex: saveActivityToDatabase(userId, activityType, details);
      
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  }, []);

  return { logActivity };
}
