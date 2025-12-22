import { useState } from 'react';
import { useToast } from './use-toast';
import type { UserPreferences } from '@/types/preferences';
import { logger } from '@/lib/logger';

export function usePreferences() {
  // Dans une app réelle, ceci viendrait de l'API ou du stockage local
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications_enabled: true,
    email_notifications: false,
    push_notifications: true,
    theme: 'system',
    fontSize: 'medium',
    emotionalCamouflage: false,
    aiSuggestions: true,
    fullAnonymity: false,
    language: 'fr',
    autoPlay: false,
    journalReminders: true,
    audioQuality: 'high'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    setIsLoading(true);
    
    try {
      // Simuler un appel d'API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPreferences({
        ...preferences,
        ...newPrefs
      });
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences ont été enregistrées avec succès"
      });
    } catch (error) {
      logger.error('Error updating preferences', error as Error, 'UI');
      
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = async () => {
    setIsLoading(true);
    
    try {
      // Simuler un appel d'API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPreferences({
        notifications_enabled: true,
        email_notifications: false,
        push_notifications: true,
        theme: 'system',
        fontSize: 'medium',
        emotionalCamouflage: false,
        aiSuggestions: true,
        fullAnonymity: false,
        language: 'fr',
        autoPlay: false,
        journalReminders: true,
        audioQuality: 'high'
      });
      
      toast({
        title: "Réinitialisation réussie",
        description: "Vos préférences ont été réinitialisées aux valeurs par défaut"
      });
    } catch (error) {
      logger.error('Error resetting preferences', error as Error, 'UI');
      
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser vos préférences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    preferences,
    isLoading,
    updatePreferences,
    resetToDefaults
  };
}
