
import { useEffect, useState, useRef, useCallback } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/hooks/use-toast';

type AmbientSoundType = 'rain' | 'forest' | 'waves' | 'white-noise' | 'cafe' | 'none';

interface AmbientSoundOptions {
  defaultEnabled?: boolean;
  defaultVolume?: number;
  defaultType?: AmbientSoundType;
}

export const useAmbientSound = (options: AmbientSoundOptions = {}) => {
  const { 
    defaultEnabled = false,
    defaultVolume = 0.5,
    defaultType = 'rain'
  } = options;
  
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  
  const [isEnabled, setIsEnabled] = useState(defaultEnabled);
  const [volume, setVolume] = useState(defaultVolume);
  const [soundType, setSoundType] = useState<AmbientSoundType>(defaultType);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Mapping des types de sons aux URLs
  const soundUrls: Record<AmbientSoundType, string> = {
    'rain': '/sounds/ambient/rain.mp3',
    'forest': '/sounds/ambient/forest.mp3',
    'waves': '/sounds/ambient/waves.mp3',
    'white-noise': '/sounds/ambient/white-noise.mp3',
    'cafe': '/sounds/ambient/cafe-ambience.mp3',
    'none': ''
  };
  
  // Initialisation de l'élément audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      
      // Appliquer les préférences utilisateur si existantes
      const userEnabled = preferences.ambientSound;
      if (userEnabled !== undefined) {
        setIsEnabled(userEnabled);
      }
    }
    
    // Nettoyage
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [preferences.ambientSound]);
  
  // Gestion du changement de son
  useEffect(() => {
    if (!audioRef.current) return;
    
    const wasPlaying = !audioRef.current.paused;
    const newUrl = soundUrls[soundType];
    
    if (!newUrl) {
      audioRef.current.pause();
      return;
    }
    
    if (audioRef.current.src !== newUrl) {
      setIsLoading(true);
      audioRef.current.src = newUrl;
      audioRef.current.load();
      
      audioRef.current.onloadeddata = () => {
        setIsLoading(false);
        if (wasPlaying && isEnabled) {
          audioRef.current?.play().catch(err => {
            console.error('Failed to play ambient sound:', err);
          });
        }
      };
      
      audioRef.current.onerror = () => {
        setIsLoading(false);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger le son d'ambiance "${soundType}"`,
          variant: "destructive",
        });
      };
    }
  }, [soundType, soundUrls, isEnabled, toast]);
  
  // Gestion du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Gestion de l'état activé/désactivé
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isEnabled && soundType !== 'none') {
      audioRef.current.play().catch(err => {
        console.error('Failed to play ambient sound:', err);
        toast({
          title: "Erreur de lecture",
          description: "Impossible de lire le son d'ambiance. Vérifiez les permissions audio.",
          variant: "destructive",
        });
        setIsEnabled(false);
      });
    } else {
      audioRef.current.pause();
    }
    
    // Mettre à jour les préférences utilisateur
    updatePreferences({
      ambientSound: isEnabled
    });
  }, [isEnabled, soundType, updatePreferences, toast]);
  
  // Fonctions de contrôle
  const toggleSound = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);
  
  const changeSound = useCallback((type: AmbientSoundType) => {
    setSoundType(type);
  }, []);
  
  const adjustVolume = useCallback((value: number) => {
    const newVolume = Math.max(0, Math.min(1, value));
    setVolume(newVolume);
  }, []);
  
  return {
    isEnabled,
    soundType,
    volume,
    isLoading,
    toggleSound,
    changeSound,
    adjustVolume,
    availableSounds: Object.keys(soundUrls).filter(s => s !== 'none') as AmbientSoundType[]
  };
};

export default useAmbientSound;
