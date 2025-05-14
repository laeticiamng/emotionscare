
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences } from '@/types';
import { defaultPreferences } from '@/constants/defaults';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...defaultPreferences,
    notifications: {
      enabled: false,
      emailEnabled: false,
      pushEnabled: false,
      frequency: 'daily'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate fetching preferences from an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be a real API call
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select('preferences')
      //   .eq('id', user.id)
      //   .single();
      
      // if (error) throw error;
      
      // Mock data for now
      const mockData = {
        preferences: {
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'inter',
          notifications: {
            enabled: true,
            emailEnabled: false,
            pushEnabled: true,
            frequency: 'daily'
          },
          autoplayVideos: false,
          dataCollection: true,
          emotionalCamouflage: false,
          aiSuggestions: true,
          fullAnonymity: false,
          language: 'fr',
          privacy: 'private',
          privacyLevel: 'private'
        }
      };
      
      setPreferences(mockData.preferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Failed to fetch preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Merge the current preferences with the new ones
      const updatedPreferences = {
        ...preferences,
        ...newPreferences
      };
      
      // In a real app, this would be a real API call
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({ preferences: updatedPreferences })
      //   .eq('id', user.id);
      
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    refreshPreferences: fetchPreferences
  };
};

export default usePreferences;
