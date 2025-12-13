import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  safeClassAdd,
  safeClassRemove,
  safeGetDocumentRoot
} from '@/lib/safe-helpers';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  focusIndicators: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 1,
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  focusIndicators: true,
};

const SETTINGS_KEY = 'accessibility_settings';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const isLoaded = useRef(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Charger les paramètres depuis Supabase ou localStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // D'abord charger depuis localStorage pour affichage immédiat
        if (typeof window !== 'undefined') {
          const saved = window.localStorage.getItem('accessibility-settings');
          if (saved) {
            setSettings({ ...defaultSettings, ...JSON.parse(saved) });
          }
        }

        if (user) {
          // Charger depuis Supabase
          const { data } = await supabase
            .from('user_settings')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', SETTINGS_KEY)
            .maybeSingle();

          if (data?.value) {
            const parsed = typeof data.value === 'string'
              ? JSON.parse(data.value)
              : data.value;
            setSettings({ ...defaultSettings, ...parsed });
          } else {
            // Migrer depuis localStorage vers Supabase
            const localSettings = window.localStorage.getItem('accessibility-settings');
            if (localSettings) {
              const parsed = JSON.parse(localSettings);
              setSettings({ ...defaultSettings, ...parsed });
              await saveToSupabase(parsed, user.id);
            }
          }
        }
      } catch (error) {
        logger.warn('[AccessibilityProvider] Failed to load settings', { error });
      } finally {
        setIsLoading(false);
        isLoaded.current = true;
      }
    };

    loadSettings();

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
    
    if (prefersHighContrast) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
  }, [user?.id]);

  // Appliquer et sauvegarder les paramètres
  useEffect(() => {
    const root = safeGetDocumentRoot();

    // Font size
    root.style.setProperty('--font-scale', settings.fontSize.toString());

    // High contrast
    if (settings.highContrast) {
      safeClassAdd(root, 'high-contrast');
    } else {
      safeClassRemove(root, 'high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      safeClassAdd(root, 'reduced-motion');
    } else {
      safeClassRemove(root, 'reduced-motion');
    }

    // Focus indicators
    if (settings.focusIndicators) {
      safeClassAdd(root, 'enhanced-focus');
    } else {
      safeClassRemove(root, 'enhanced-focus');
    }

    // Sauvegarder en localStorage immédiatement
    try {
      window.localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    } catch (error) {
      logger.warn('[AccessibilityProvider] Failed to persist settings locally', { error });
    }

    // Debounce la sauvegarde Supabase
    if (isLoaded.current && user) {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }

      saveTimeout.current = setTimeout(async () => {
        await saveToSupabase(settings, user.id);
      }, 500);
    }

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [settings, user?.id]);

  const updateSetting = useCallback((key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(async () => {
    setSettings(defaultSettings);
    
    try {
      window.localStorage.removeItem('accessibility-settings');
    } catch (error) {
      logger.warn('[AccessibilityProvider] Failed to clear local settings', { error });
    }

    if (user) {
      try {
        await supabase
          .from('user_settings')
          .delete()
          .eq('user_id', user.id)
          .eq('key', SETTINGS_KEY);
      } catch (error) {
        logger.warn('[AccessibilityProvider] Failed to clear Supabase settings', { error });
      }
    }
  }, [user]);

  return (
    <AccessibilityContext.Provider 
      value={{ 
        settings, 
        updateSetting, 
        resetSettings,
        isLoading
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

async function saveToSupabase(settings: AccessibilitySettings, userId: string) {
  try {
    await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        key: SETTINGS_KEY,
        value: JSON.stringify(settings),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,key'
      });
  } catch (error) {
    logger.error('[AccessibilityProvider] Failed to save to Supabase', error, 'SYSTEM');
  }
}
