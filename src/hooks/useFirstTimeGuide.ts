/**
 * Hook pour gérer l'affichage du guide de première visite
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFirstTimeGuide = () => {
  const { user } = useAuth();
  const [shouldShowGuide, setShouldShowGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstTimeStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Vérifier si l'utilisateur a déjà complété ou dismissé le guide
        const { data, error } = await supabase
          .from('discovery_log')
          .select('action')
          .eq('user_id', user.id)
          .eq('module_name', 'first_time_guide')
          .in('action', ['completed', 'dismissed'])
          .limit(1);

        if (error) {
          console.error('Error checking first time status:', error);
          setIsLoading(false);
          return;
        }

        // Afficher le guide si aucune action précédente
        setShouldShowGuide(!data || data.length === 0);
      } catch (error) {
        console.error('Error in useFirstTimeGuide:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstTimeStatus();
  }, [user]);

  const markAsCompleted = async () => {
    setShouldShowGuide(false);
  };

  const markAsDismissed = async () => {
    setShouldShowGuide(false);
  };

  return {
    shouldShowGuide,
    isLoading,
    markAsCompleted,
    markAsDismissed
  };
};

export default useFirstTimeGuide;
