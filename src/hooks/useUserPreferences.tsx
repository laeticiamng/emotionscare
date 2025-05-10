
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import useAudioPreferences from '@/hooks/useAudioPreferences';
import { NotificationFrequency, NotificationTone, FontFamily, FontSize } from '@/types/preferences';
import { useToast } from '@/hooks/use-toast';

// Types for user preferences
export interface UserPreferencesState {
  // Appearance
  theme: string;
  dynamicTheme: 'none' | 'time' | 'emotion' | 'weather';
  highContrast: boolean;
  reducedAnimations: boolean;
  fontSize: FontSize;
  font: FontFamily;
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
  notificationFrequency: NotificationFrequency;
  notificationTone: NotificationTone;
  reminderTime?: string;
  
  // Backwards compatibility
  notifications_enabled?: boolean;
  reminder_time?: string;
  
  // Données
  dataExport: 'pdf' | 'json';
  incognitoMode: boolean;
  lockJournals: boolean;
  
  // Premium features
  emotionalCamouflage: boolean;
  duoModeEnabled?: boolean;
  trustedContact?: string;
  customPresets: {
    name: string;
    theme: string;
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
  
  customPresets: []
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferencesState>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setThemePreference } = useTheme();
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
  const updatePreferences = (newPreferences: Partial<UserPreferencesState>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      
      // Synchronize with other contexts if needed
      if (newPreferences.theme) {
        setThemePreference(newPreferences.theme);
      }
      
      toast({
        title: "Preferences updated",
        description: "Your settings have been successfully saved."
      });
      
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      
      toast({
        title: "Error",
        description: "Unable to save your preferences.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Create a custom preset
  const createPreset = (name: string) => {
    const newPreset = {
      name,
      theme: theme,
      audioPreset: audioPrefs.preferences.currentEqualizer
    };
    
    const updatedPresets = [...preferences.customPresets, newPreset];
    updatePreferences({ customPresets: updatedPresets });
    
    toast({
      title: "New preset created",
      description: `Preset "${name}" has been saved.`
    });
  };

  // Apply a custom preset
  const applyPreset = (name: string) => {
    const preset = preferences.customPresets.find(p => p.name === name);
    if (!preset) return false;
    
    setThemePreference(preset.theme);
    audioPrefs.setEqualizerPreset?.(preset.audioPreset);
    
    toast({
      title: "Preset applied",
      description: `Preset "${name}" has been activated.`
    });
    
    return true;
  };

  // Reset all preferences
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
    
    // Also reset associated contexts
    setThemePreference('light');
    
    toast({
      title: "Reset completed",
      description: "All your settings have been reset to defaults."
    });
  };

  // Toggle incognito mode
  const toggleIncognitoMode = (enabled: boolean) => {
    updatePreferences({ incognitoMode: enabled });
    
    if (enabled) {
      // Additional logic for incognito mode
      sessionStorage.setItem('incognito', 'true');
      
      toast({
        title: "Incognito mode enabled",
        description: "No data will be saved during this session."
      });
    } else {
      sessionStorage.removeItem('incognito');
      
      toast({
        title: "Incognito mode disabled",
        description: "Your data will be saved normally again."
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
