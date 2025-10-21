// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore, type Profile } from '@/store/settings.store';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from 'react-use';
import { logger } from '@/lib/logger';

export const useProfileSettings = () => {
  const {
    profile,
    loading,
    error,
    setProfile,
    setTheme,
    setLanguage,
    setA11y,
    setLoading,
    setError,
    applyTheme,
    applyA11y
  } = useSettingsStore();

  const [initialized, setInitialized] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Partial<Profile>>({});

  // Debounce API calls to avoid spam
  const [debouncedChanges, setDebouncedChanges] = useState<Partial<Profile>>({});
  
  useDebounce(
    () => {
      if (Object.keys(pendingChanges).length > 0) {
        setDebouncedChanges(pendingChanges);
        setPendingChanges({});
      }
    },
    500,
    [pendingChanges]
  );

  // Load profile from API
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/me/profile');
      
      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      setProfile(data);
      
      // Apply settings immediately
      applyTheme();
      applyA11y();
      
    } catch (error: any) {
      logger.error('Load profile failed', error as Error, 'AUTH');
      setError(error.message);
      
      // Use stored profile as fallback
      applyTheme();
      applyA11y();
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [setProfile, setLoading, setError, applyTheme, applyA11y]);

  // Save profile changes to API
  const saveProfile = useCallback(async (changes: Partial<Profile>) => {
    if (Object.keys(changes).length === 0) return true;

    setLoading(true);
    setError(null);

    // Store original values for rollback
    const originalProfile = { ...profile };

    try {
      const response = await fetch('/api/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        if (changes.theme) {
          window.gtag('event', 'settings.profile.theme.changed', {
            theme: changes.theme
          });
        }
        if (changes.language) {
          window.gtag('event', 'settings.profile.language.changed', {
            lang: changes.language
          });
        }
        if (changes.a11y) {
          Object.keys(changes.a11y).forEach(key => {
            window.gtag('event', 'settings.profile.a11y.changed', {
              key: key
            });
          });
        }
      }

      return true;

    } catch (error: any) {
      // Rollback changes
      setProfile(originalProfile);
      applyTheme();
      applyA11y();
      
      logger.error('Save profile failed', error as Error, 'AUTH');
      setError(error.message);
      
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres. Réessayez.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [profile, setProfile, setLoading, setError, applyTheme, applyA11y]);

  // Update settings with optimistic UI
  const updateSettings = useCallback((changes: Partial<Profile>) => {
    // Apply changes immediately for UI responsiveness
    setProfile(changes);
    
    // Queue for debounced API call
    setPendingChanges(prev => ({ ...prev, ...changes }));
  }, [setProfile]);

  // Convenience methods
  const updateTheme = useCallback((theme: Profile['theme']) => {
    setTheme(theme);
    setPendingChanges(prev => ({ ...prev, theme }));
  }, [setTheme]);

  const updateLanguage = useCallback((language: Profile['language']) => {
    setLanguage(language);
    
    // Apply language change immediately if available
    if (typeof window !== 'undefined' && window.i18n) {
      window.i18n.changeLanguage(language === 'auto' ? navigator.language.slice(0, 2) : language);
    }
    
    setPendingChanges(prev => ({ ...prev, language }));
  }, [setLanguage]);

  const updateA11y = useCallback((a11yChanges: Partial<Profile['a11y']>) => {
    setA11y(a11yChanges);
    setPendingChanges(prev => ({ 
      ...prev, 
      a11y: { ...profile.a11y, ...a11yChanges }
    }));
  }, [setA11y, profile.a11y]);

  // Initialize on mount
  useEffect(() => {
    if (!initialized) {
      loadProfile();
    }
  }, [initialized, loadProfile]);

  // Save debounced changes
  useEffect(() => {
    if (Object.keys(debouncedChanges).length > 0) {
      saveProfile(debouncedChanges);
      setDebouncedChanges({});
    }
  }, [debouncedChanges, saveProfile]);

  // Apply system theme changes
  useEffect(() => {
    if (profile.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme();
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [profile.theme, applyTheme]);

  return {
    profile,
    loading,
    error,
    initialized,
    loadProfile,
    save: saveProfile,
    updateSettings,
    updateTheme,
    updateLanguage,
    updateA11y
  };
};