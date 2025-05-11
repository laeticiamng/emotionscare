
import { useCallback, useEffect, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useSoundscape } from '@/providers/SoundscapeProvider';
import { useOpenAI } from '@/hooks/ai/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { EMOTION_TO_MUSIC_MAP } from '@/services/music/emotion-music-mapping';

export interface CommunityAmbienceOptions {
  autoAdjust?: boolean;
  intensity?: 'subtle' | 'moderate' | 'immersive';
  syncWithMood?: boolean;
}

export function useCommunityAmbience(options: CommunityAmbienceOptions = {}) {
  const { autoAdjust = true, intensity = 'moderate', syncWithMood = true } = options;
  const { loadPlaylistForEmotion, setOpenDrawer, playTrack, pauseTrack, isPlaying } = useMusic();
  const { updateSoundscapeForEmotion } = useSoundscape();
  const { moderation } = useOpenAI();
  const { toast } = useToast();
  
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Analyser le contenu de la communauté pour détecter l'ambiance émotionnelle
  const analyzeGroupMood = useCallback(async (content: string) => {
    if (!content) return null;
    
    setIsLoading(true);
    try {
      // Utiliser OpenAI pour détecter l'émotion dominante
      const result = await moderation.checkContent(content);
      
      if (result && !result.flagged) {
        // Simulation de détection d'émotion (dans une implémentation réelle,
        // on utiliserait OpenAI pour extraire l'émotion dominante)
        const emotions = ['calm', 'energetic', 'creative', 'reflective', 'anxious'];
        const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        setCurrentMood(detectedEmotion);
        return detectedEmotion;
      }
      
      if (result?.flagged) {
        console.warn("Contenu inapproprié détecté:", result.reason);
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'ambiance:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [moderation]);
  
  // Adapter l'ambiance sonore en fonction de l'émotion détectée
  const adjustAmbience = useCallback(async (emotion: string) => {
    if (!emotion) return;
    
    try {
      // Mapper l'émotion à un type de musique
      const musicType = EMOTION_TO_MUSIC_MAP[emotion.toLowerCase()] || EMOTION_TO_MUSIC_MAP.default;
      
      // Adapter le soundscape
      if (syncWithMood) {
        updateSoundscapeForEmotion(emotion);
      }
      
      // Charger et jouer la playlist correspondante (seulement si intensity est immersive)
      if (intensity === 'immersive') {
        const playlist = await loadPlaylistForEmotion(musicType);
        
        if (playlist && playlist.tracks && playlist.tracks.length > 0) {
          // Ne pas auto-jouer, juste préparer
          // si on veut jouer: playTrack(playlist.tracks[0]);
          
          if (autoAdjust && !isPlaying) {
            // Montrer le lecteur de musique discrètement
            setOpenDrawer(true);
            
            toast({
              title: "Ambiance communautaire",
              description: `Une playlist adaptée à l'ambiance ${emotion} est prête à être écoutée`,
            });
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'ajustement de l'ambiance:", error);
    }
  }, [autoAdjust, intensity, syncWithMood, updateSoundscapeForEmotion, loadPlaylistForEmotion, isPlaying, setOpenDrawer, toast]);
  
  // Activer/désactiver l'ambiance
  const toggleAmbience = useCallback((forceState?: boolean) => {
    if (forceState === true || (!forceState && !isPlaying)) {
      if (currentMood) {
        adjustAmbience(currentMood);
      }
    } else {
      pauseTrack();
    }
  }, [currentMood, isPlaying, adjustAmbience, pauseTrack]);
  
  // Analyser et adapter automatiquement l'ambiance pour un groupe de discussion
  const syncGroupAmbience = useCallback(async (groupId: string, recentMessages: string[]) => {
    if (recentMessages.length === 0) return;
    
    // Combiner les messages récents pour analyse
    const combinedContent = recentMessages.join(" ");
    const detectedMood = await analyzeGroupMood(combinedContent);
    
    if (detectedMood && autoAdjust) {
      adjustAmbience(detectedMood);
    }
    
    return detectedMood;
  }, [analyzeGroupMood, autoAdjust, adjustAmbience]);
  
  return {
    currentMood,
    isLoading,
    analyzeGroupMood,
    adjustAmbience,
    toggleAmbience,
    syncGroupAmbience
  };
}
