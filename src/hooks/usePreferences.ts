
import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/user';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

export function usePreferences() {
  const themeContext = useTheme();
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: themeContext?.theme || 'system',
    fontSize: 'medium',
    fontFamily: 'inter',
    language: 'fr',
    notifications: true,
    soundEnabled: true,
    // Additional preferences fields used by components
    notifications_enabled: true,
    email_notifications: false,
    push_notifications: true,
    privacy: 'private',
    autoplayVideos: false,
    dataCollection: true,
    emotionalCamouflage: false,
    aiSuggestions: true,
    fullAnonymity: false
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Dans une vraie application, charger depuis une API
    const loadPreferences = async () => {
      try {
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Récupérer les préférences depuis le localStorage
        const storedPreferences = localStorage.getItem('userPreferences');
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, []);
  
  // Mettre à jour les préférences
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      
      // Dans une vraie application, envoyer à une API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mettre à jour le thème si nécessaire
      if (newPreferences.theme && themeContext) {
        themeContext.setTheme(newPreferences.theme);
      }
      
      // Mettre à jour la taille de police si nécessaire
      if (newPreferences.fontSize && themeContext && themeContext.setFontSize) {
        themeContext.setFontSize(newPreferences.fontSize);
      }
      
      // Mettre à jour la famille de police si nécessaire
      if (newPreferences.fontFamily && themeContext && themeContext.setFontFamily) {
        themeContext.setFontFamily(newPreferences.fontFamily);
      }
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      
      setPreferences(updatedPreferences);
      toast.success("Préférences mises à jour");
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      toast.error("Erreur lors de la mise à jour des préférences");
      return false;
    }
  };
  
  // Réinitialiser les préférences aux valeurs par défaut
  const resetPreferences = async () => {
    const defaultPreferences: UserPreferences = {
      theme: 'system',
      fontSize: 'medium',
      fontFamily: 'inter',
      language: 'fr',
      notifications: true,
      soundEnabled: true,
      notifications_enabled: true,
      email_notifications: false,
      push_notifications: true,
      privacy: 'private',
      autoplayVideos: false,
      dataCollection: true,
      emotionalCamouflage: false,
      aiSuggestions: false,
      fullAnonymity: false
    };
    
    return updatePreferences(defaultPreferences);
  };
  
  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isLoading
  };
}
