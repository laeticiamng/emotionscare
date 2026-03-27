// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AudioPreference {
  volume: number;
  autoplay: boolean;
  currentEqualizer: string;
  equalizerEnabled: boolean;
  equalizerPresets: string[];
  setVolume: (volume: number) => void;
  setAutoplay: (enabled: boolean) => void;
  toggleEqualizer: (enabled?: boolean) => void;
  setEqualizerPreset: (preset: string) => void;
}

const STORAGE_KEY = 'audio_preferences';

export default function useAudioPreferences() {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [preferences, setPreferences] = useState<Omit<AudioPreference, 'setVolume' | 'setAutoplay' | 'toggleEqualizer' | 'setEqualizerPreset'>>({
    volume: 0.8,
    autoplay: true,
    currentEqualizer: 'default',
    equalizerEnabled: false,
    equalizerPresets: ['default', 'bass', 'vocal', 'ambient'],
  });

  // Charger les préférences au montage
  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_preferences')
          .select('audio_preferences')
          .eq('user_id', user.id)
          .single();
        
        if (data?.audio_preferences) {
          setPreferences(prev => ({ ...prev, ...data.audio_preferences }));
        }
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setPreferences(prev => ({ ...prev, ...JSON.parse(saved) }));
          } catch {}
        }
      }
      setIsLoaded(true);
    };
    loadPreferences();
  }, [user]);

  // Sauvegarder les préférences
  const savePreferences = useCallback(async (newPrefs: typeof preferences) => {
    const toSave = {
      volume: newPrefs.volume,
      autoplay: newPrefs.autoplay,
      currentEqualizer: newPrefs.currentEqualizer,
      equalizerEnabled: newPrefs.equalizerEnabled,
    };

    if (user) {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          audio_preferences: toSave,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
  }, [user]);

  const setVolume = useCallback((volume: number) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, volume };
      savePreferences(newPrefs);
      return newPrefs;
    });
  }, [savePreferences]);

  const setAutoplay = useCallback((autoplay: boolean) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, autoplay };
      savePreferences(newPrefs);
      return newPrefs;
    });
  }, [savePreferences]);

  const toggleEqualizer = useCallback((enabled?: boolean) => {
    setPreferences(prev => {
      const newPrefs = { 
        ...prev, 
        equalizerEnabled: enabled !== undefined ? enabled : !prev.equalizerEnabled 
      };
      savePreferences(newPrefs);
      return newPrefs;
    });
  }, [savePreferences]);

  const setEqualizerPreset = useCallback((preset: string) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, currentEqualizer: preset };
      savePreferences(newPrefs);
      return newPrefs;
    });
  }, [savePreferences]);

  return {
    preferences: { ...preferences, setVolume, setAutoplay, toggleEqualizer, setEqualizerPreset },
    setVolume,
    setAutoplay,
    toggleEqualizer,
    setEqualizerPreset,
    isLoaded,
    volume: preferences.volume,
    autoplay: preferences.autoplay,
    currentEqualizer: preferences.currentEqualizer,
    equalizerEnabled: preferences.equalizerEnabled,
    equalizerPresets: preferences.equalizerPresets
  };
}
