
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import useAudioPreferences from '@/hooks/useAudioPreferences';
import { ThemeName } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Types pour les préférences utilisateur
export interface UserPreferencesState {
  // Apparence
  theme: ThemeName;
  dynamicTheme: 'none' | 'time' | 'emotion' | 'weather';
  highContrast: boolean;
  reducedAnimations: boolean;
  fontSize: 'small' | 'medium' | 'large';
  font: 'inter' | 'dm-sans' | 'serif';
  customBackground?: string;
  
  // Identité
  displayName?: string;
  pronouns?: 'il' | 'elle' | 'iel' | 'autre';
  biography?: string;
  avatarUrl?: string;
  
  // Accessibilité
  screenReader: boolean;
  keyboardNavigation: boolean;
  audioGuidance: boolean;
  
  // Notifications
  notificationsEnabled: boolean;
  notificationTypes: {
    journal: boolean;
    breathing: boolean;
    music: boolean;
  };
  notificationFrequency: 'daily' | 'weekly' | 'flexible';
  notificationTone: 'motivating' | 'gentle' | 'silent';
  reminderTime?: string;
  
  // Données
  dataExport: 'pdf' | 'json';
  incognitoMode: boolean;
  lockJournals: boolean;
  
  // Préférences premium
  duoModeEnabled?: boolean;
  trustedContact?: string;
  customPresets: {
    name: string;
    theme: ThemeName;
    audioPreset: string;
  }[];
}

const defaultPreferences: UserPreferencesState = {
  theme: 'light',
  dynamicTheme: 'none',
  highContrast: false,
  reducedAnimations: false,
  fontSize: 'medium',
  font: 'inter',
  
  screenReader: false,
  keyboardNavigation: true,
  audioGuidance: false,
  
  notificationsEnabled: true,
  notificationTypes: {
    journal: true,
    breathing: true,
    music: false,
  },
  notificationFrequency: 'daily',
  notificationTone: 'gentle',
  reminderTime: '09:00',
  
  dataExport: 'pdf',
  incognitoMode: false,
  lockJournals: false,
  
  customPresets: []
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferencesState>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setThemePreference } = useTheme();
  const audioPrefs = useAudioPreferences();
  const { toast } = useToast();

  // Charger les préférences depuis le localStorage au montage
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mettre à jour les préférences
  const updatePreferences = (newPreferences: Partial<UserPreferencesState>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      
      // Synchroniser avec d'autres contextes si nécessaire
      if (newPreferences.theme) {
        setThemePreference(newPreferences.theme);
      }
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos paramètres ont été enregistrés avec succès."
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Créer un preset personnalisé
  const createPreset = (name: string) => {
    const newPreset = {
      name,
      theme: theme as ThemeName,
      audioPreset: audioPrefs.preferences.currentEqualizer
    };
    
    const updatedPresets = [...preferences.customPresets, newPreset];
    updatePreferences({ customPresets: updatedPresets });
    
    toast({
      title: "Nouveau preset créé",
      description: `Le preset "${name}" a été enregistré.`
    });
  };

  // Appliquer un preset personnalisé
  const applyPreset = (name: string) => {
    const preset = preferences.customPresets.find(p => p.name === name);
    if (!preset) return false;
    
    setThemePreference(preset.theme);
    audioPrefs.setEqualizerPreset(preset.audioPreset);
    
    toast({
      title: "Preset appliqué",
      description: `Le preset "${name}" a été activé.`
    });
    
    return true;
  };

  // Réinitialiser toutes les préférences
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
    
    // Réinitialiser également les contextes associés
    setThemePreference('light');
    
    toast({
      title: "Réinitialisation effectuée",
      description: "Tous vos paramètres ont été remis à zéro."
    });
  };

  // Activer le mode incognito
  const toggleIncognitoMode = (enabled: boolean) => {
    updatePreferences({ incognitoMode: enabled });
    
    if (enabled) {
      // Logique supplémentaire pour le mode incognito
      sessionStorage.setItem('incognito', 'true');
      
      toast({
        title: "Mode incognito activé",
        description: "Aucune donnée ne sera sauvegardée pendant cette session."
      });
    } else {
      sessionStorage.removeItem('incognito');
      
      toast({
        title: "Mode incognito désactivé",
        description: "Vos données seront à nouveau sauvegardées normalement."
      });
    }
  };
  
  return {
    preferences,
    isLoading,
    updatePreferences,
    createPreset,
    applyPreset,
    resetPreferences,
    toggleIncognitoMode
  };
}

export default useUserPreferences;
