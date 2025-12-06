// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { MusicTrack, AdaptiveMusicConfig } from '@/types/music';
import { adaptiveMusicService } from '@/services/adaptiveMusicService';
import { useMusicControls } from './useMusicControls';

interface UseAdaptiveMusicProps {
  emotion?: string;
  autoStart?: boolean;
  initialConfig?: Partial<AdaptiveMusicConfig>;
}

export const useAdaptiveMusic = ({ 
  emotion, 
  autoStart = false,
  initialConfig = {}
}: UseAdaptiveMusicProps = {}) => {
  const [currentEmotion, setCurrentEmotion] = useState<string>(emotion || 'calm');
  const [recommendedTrack, setRecommendedTrack] = useState<MusicTrack | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [config, setConfig] = useState<AdaptiveMusicConfig>(() => ({
    ...adaptiveMusicService.getConfig(),
    ...initialConfig
  }));

  const musicControls = useMusicControls(recommendedTrack);

  // Mettre à jour la configuration du service
  useEffect(() => {
    adaptiveMusicService.updateConfig(config);
  }, [config]);

  // Obtenir une recommandation de track basée sur l'émotion
  const getRecommendation = useCallback((targetEmotion: string) => {
    return adaptiveMusicService.getRecommendedTrack(targetEmotion);
  }, []);

  // Transition douce entre les tracks
  const transitionToTrack = useCallback(async (newTrack: MusicTrack) => {
    if (!config.autoTransition) {
      musicControls.loadTrack(newTrack);
      return;
    }

    setIsTransitioning(true);

    // Fade out du track actuel
    if (musicControls.isPlaying) {
      const originalVolume = musicControls.volume;
      const fadeSteps = 20;
      const fadeStepDuration = config.fadeOutDuration / fadeSteps;
      const volumeStep = originalVolume / fadeSteps;

      for (let i = 0; i < fadeSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, fadeStepDuration));
        musicControls.setVolume(originalVolume - (volumeStep * (i + 1)));
      }

      musicControls.pause();
      musicControls.setVolume(originalVolume);
    }

    // Charger le nouveau track
    musicControls.loadTrack(newTrack);

    // Fade in du nouveau track
    if (autoStart) {
      await musicControls.play();
      const targetVolume = musicControls.volume;
      musicControls.setVolume(0);

      const fadeSteps = 20;
      const fadeStepDuration = config.fadeInDuration / fadeSteps;
      const volumeStep = targetVolume / fadeSteps;

      for (let i = 0; i < fadeSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, fadeStepDuration));
        musicControls.setVolume(volumeStep * (i + 1));
      }
    }

    setIsTransitioning(false);
  }, [config, musicControls, autoStart]);

  // Adapter la musique à l'émotion
  const adaptToEmotion = useCallback(async (newEmotion: string) => {
    if (!config.enabled) return;

    setCurrentEmotion(newEmotion);
    const newTrack = getRecommendation(newEmotion);
    
    if (newTrack && newTrack.id !== musicControls.currentTrack?.id) {
      setRecommendedTrack(newTrack);
      await transitionToTrack(newTrack);
    }
  }, [config.enabled, getRecommendation, musicControls.currentTrack, transitionToTrack]);

  // Effet pour adapter automatiquement à l'émotion
  useEffect(() => {
    if (emotion && emotion !== currentEmotion) {
      adaptToEmotion(emotion);
    }
  }, [emotion, currentEmotion, adaptToEmotion]);

  // Initialisation
  useEffect(() => {
    const initialTrack = getRecommendation(currentEmotion);
    if (initialTrack && !recommendedTrack) {
      setRecommendedTrack(initialTrack);
      musicControls.loadTrack(initialTrack);
      
      if (autoStart) {
        musicControls.play();
      }
    }
  }, []);

  const updateConfig = (newConfig: Partial<AdaptiveMusicConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const getAllPlaylists = () => {
    return adaptiveMusicService.getAllPlaylists();
  };

  const getPlaylistForEmotion = (targetEmotion: string) => {
    return adaptiveMusicService.getPlaylistForEmotion(targetEmotion);
  };

  return {
    // État
    currentEmotion,
    recommendedTrack,
    isTransitioning,
    config,
    playlists: getAllPlaylists(),

    // Contrôles musicaux
    ...musicControls,

    // Fonctions adaptatives
    adaptToEmotion,
    getRecommendation,
    getPlaylistForEmotion,
    updateConfig,
    
    // Utilitaires
    isAdaptiveEnabled: config.enabled,
    setAdaptiveEnabled: (enabled: boolean) => updateConfig({ enabled })
  };
};
