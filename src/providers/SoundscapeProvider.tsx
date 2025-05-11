
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useBranding } from '@/contexts/BrandingContext';

// Define soundscape types
type SoundscapeType = 'ambient' | 'functional' | 'emotional' | 'storytelling' | 'none';
type SoundIntensity = 'silent' | 'subtle' | 'moderate' | 'immersive';

interface SoundscapeContextType {
  soundscapeType: SoundscapeType;
  intensity: SoundIntensity;
  isPlaying: boolean;
  isMuted: boolean;
  setSoundscapeType: (type: SoundscapeType) => void;
  setIntensity: (intensity: SoundIntensity) => void;
  playFunctionalSound: (soundType: string) => void;
  playEmotionalResponse: (emotion: string) => void;
  mute: () => void;
  unmute: () => void;
}

const SoundscapeContext = createContext<SoundscapeContextType>({
  soundscapeType: 'ambient',
  intensity: 'subtle',
  isPlaying: false,
  isMuted: false,
  setSoundscapeType: () => {},
  setIntensity: () => {},
  playFunctionalSound: () => {},
  playEmotionalResponse: () => {},
  mute: () => {},
  unmute: () => {},
});

export const SoundscapeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loadPlaylistForEmotion, playTrack, pauseTrack, isPlaying } = useMusic();
  const { soundEnabled, emotionalTone } = useBranding();
  
  const [soundscapeType, setSoundscapeType] = useState<SoundscapeType>('ambient');
  const [intensity, setIntensity] = useState<SoundIntensity>('subtle');
  const [isMuted, setIsMuted] = useState(false);
  const [functionalSounds] = useState<Record<string, string>>({
    notification: '/sounds/notification.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    click: '/sounds/click.mp3',
    transition: '/sounds/transition.mp3',
  });

  // Function to play UI feedback sounds
  const playFunctionalSound = (soundType: string) => {
    if (!soundEnabled || isMuted) return;
    
    const soundUrl = functionalSounds[soundType];
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.volume = intensity === 'subtle' ? 0.3 : 
                    intensity === 'moderate' ? 0.6 : 
                    intensity === 'immersive' ? 0.9 : 0;
      audio.play().catch(err => console.log('Audio play error:', err));
    }
  };

  // Function to play emotional response sounds
  const playEmotionalResponse = (emotion: string) => {
    if (!soundEnabled || isMuted) return;
    
    // Map emotions to music types and load appropriate playlist
    const emotionToMusic: Record<string, string> = {
      happy: 'upbeat',
      sad: 'calm',
      angry: 'dramatic',
      anxious: 'ambient',
      neutral: 'neutral',
      excited: 'energetic',
      focused: 'focus',
      relaxed: 'ambient',
    };
    
    const musicType = emotionToMusic[emotion.toLowerCase()] || 'neutral';
    loadPlaylistForEmotion(musicType);
  };

  // Set up ambient soundscape based on current emotional tone
  useEffect(() => {
    if (soundscapeType === 'ambient' && soundEnabled && !isMuted) {
      const toneToAmbient: Record<string, string> = {
        neutral: 'ambient',
        energetic: 'upbeat',
        calm: 'ambient',
        focused: 'focus',
        joyful: 'upbeat',
        reflective: 'calm'
      };
      
      const ambientType = toneToAmbient[emotionalTone] || 'ambient';
      loadPlaylistForEmotion(ambientType);
    } else if (!soundEnabled || isMuted) {
      pauseTrack();
    }
  }, [soundscapeType, soundEnabled, isMuted, emotionalTone]);

  const mute = () => setIsMuted(true);
  const unmute = () => setIsMuted(false);

  return (
    <SoundscapeContext.Provider value={{
      soundscapeType,
      intensity,
      isPlaying,
      isMuted,
      setSoundscapeType,
      setIntensity,
      playFunctionalSound,
      playEmotionalResponse,
      mute,
      unmute,
    }}>
      {children}
    </SoundscapeContext.Provider>
  );
};

export const useSoundscape = () => useContext(SoundscapeContext);

export default SoundscapeContext;
