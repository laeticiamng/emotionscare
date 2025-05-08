
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook pour gérer l'enregistrement des activités utilisateur
 */
export function useActivity() {
  const { user } = useAuth();
  
  const logActivity = useCallback((activityType: string, details?: Record<string, any>) => {
    try {
      const userId = user?.id;
      
      // Log to console for development
      console.log(`Activity logged: ${activityType}`, details);
      
      // Enrichir les détails avec les informations utilisateur si disponibles
      const enrichedDetails = {
        ...details,
        userId,
        timestamp: new Date().toISOString(),
      };
      
      // Pour les environnements de développement ou en l'absence d'un backend
      // nous pouvons stocker les activités dans localStorage
      try {
        const storedActivities = localStorage.getItem('user_activities') || '[]';
        const activities = JSON.parse(storedActivities);
        activities.push({
          id: Date.now().toString(),
          activity_type: activityType,
          details: enrichedDetails,
          timestamp: new Date().toISOString()
        });
        
        // Limiter le nombre d'activités stockées localement
        const limitedActivities = activities.slice(-100);
        localStorage.setItem('user_activities', JSON.stringify(limitedActivities));
      } catch (storageError) {
        console.warn('Error storing activity in localStorage:', storageError);
      }
      
      // Si Supabase est configuré, enregistrer l'activité dans la base de données
      if (userId && supabase) {
        // Ceci est commenté car nous n'avons pas encore configuré Supabase pour les activités
        // Décommenter et adapter lorsque la table sera créée
        /*
        supabase
          .from('user_activity_logs')
          .insert({
            user_id: userId,
            activity_type: activityType,
            activity_details: enrichedDetails
          })
          .then((response) => {
            if (response.error) {
              console.error('Error logging to Supabase:', response.error);
            }
          });
        */
      }
      
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  }, [user?.id]);
  
  return { logActivity };
}
