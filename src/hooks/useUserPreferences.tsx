
import { useState, useEffect, useCallback } from 'react';
import { useTheme, Theme, FontFamily, FontSize } from '@/contexts/ThemeContext';
import useAudioPreferences from '@/hooks/useAudioPreferences';
import { useToast } from '@/hooks/use-toast';

// Types for user preferences
export interface UserPreferencesState {
  // Appearance
  theme: Theme;
  dynamicTheme: 'none' | 'time' | 'emotion' | 'weather';
  highContrast: boolean;
  reducedAnimations: boolean;
  fontSize: FontSize;
  font: FontFamily | string;
  customBackground?: string;
  
  // Identity
  displayName?: string;
  pronouns?: 'il' | 'elle' | 'iel' | 'autre';
  biography?: string;
  avatarUrl?: string;
  
  // Accessibility
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
  notificationFrequency: string;
  notificationTone: string;
  reminderTime?: string;
  
  // Backwards compatibility
  notifications_enabled?: boolean;
  reminder_time?: string;
  
  // Données
  dataExport: 'pdf' | 'json';
  incognitoMode: boolean;
  lockJournals: boolean;
  
  // Privacy
  privacyLevel?: string;
  
  // Premium features
  emotionalCamouflage: boolean;
  duoModeEnabled?: boolean;
  trustedContact?: string;
  customPresets: {
    name: string;
    theme: Theme;
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
  emotionalCamouflage: false,
  privacyLevel: 'standard',
  
  customPresets: []
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferencesState>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const themeContext = useTheme();
  const audioPrefs = useAudioPreferences();
  const { toast } = useToast();

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferencesState>) => {
    try {
      // Fix: ensure theme value is compatible with Theme type before updating
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      
      // Synchronize with other contexts if needed
      if (newPreferences.theme && themeContext?.setTheme) {
        // Fix: Ensure theme is one of the allowed values
        const themeValue = newPreferences.theme;
        if (['light', 'dark', 'system', 'pastel'].includes(themeValue)) {
          themeContext.setTheme(themeValue);
        }
      }
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos paramètres ont été enregistrés avec succès."
      });
      
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences.",
        variant: "destructive"
      });
      
      return false;
    }
  }, [preferences, themeContext, toast]);

  // Create a custom preset
  const createPreset = useCallback((name: string) => {
    const newPreset = {
      name,
      theme: preferences.theme,
      audioPreset: audioPrefs.preferences?.currentEqualizer || "standard"
    };
    
    const updatedPresets = [...preferences.customPresets, newPreset];
    updatePreferences({ customPresets: updatedPresets });
    
    toast({
      title: "Nouveau préréglage créé",
      description: `Le préréglage "${name}" a été enregistré.`
    });
  }, [preferences, audioPrefs, updatePreferences, toast]);

  // Apply a custom preset
  const applyPreset = useCallback((name: string) => {
    const preset = preferences.customPresets.find(p => p.name === name);
    if (!preset) return false;
    
    // Ensure the preset theme is a valid Theme type
    const presetTheme = preset.theme;
    if (['light', 'dark', 'system', 'pastel'].includes(presetTheme)) {
      updatePreferences({ theme: presetTheme });
    }
    
    if (audioPrefs.setEqualizerPreset) {
      audioPrefs.setEqualizerPreset(preset.audioPreset);
    }
    
    toast({
      title: "Préréglage appliqué",
      description: `Le préréglage "${name}" a été activé.`
    });
    
    return true;
  }, [preferences, audioPrefs, updatePreferences, toast]);

  // Reset all preferences
  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
    
    // Also reset associated contexts
    if (themeContext?.setTheme) {
      themeContext.setTheme('light');
    }
    
    toast({
      title: "Réinitialisation terminée",
      description: "Tous vos paramètres ont été réinitialisés aux valeurs par défaut."
    });
  }, [themeContext, toast]);

  // Toggle incognito mode
  const toggleIncognitoMode = useCallback((enabled: boolean) => {
    updatePreferences({ incognitoMode: enabled });
    
    if (enabled) {
      // Additional logic for incognito mode
      sessionStorage.setItem('incognito', 'true');
      
      toast({
        title: "Mode incognito activé",
        description: "Aucune donnée ne sera enregistrée pendant cette session."
      });
    } else {
      sessionStorage.removeItem('incognito');
      
      toast({
        title: "Mode incognito désactivé",
        description: "Vos données seront à nouveau enregistrées normalement."
      });
    }
  }, [updatePreferences, toast]);
  
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
