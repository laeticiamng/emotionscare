
import { useRef, useEffect, useState, useCallback, ChangeEvent } from 'react';
import { MusicTrack } from '@/types/music';
import { useAudioPlayerCore } from './audio/useAudioPlayerCore';

/**
 * Hook centralisé pour gérer la lecture audio dans toute l'application
 */
export function useAudioPlayer() {
  // Utiliser notre implémentation core
  const audioPlayer = useAudioPlayerCore();
  
  // Fonction auxiliaire pour le changement de volume via l'élément input
  const handleVolumeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    audioPlayer.setVolume(newVolume);
  }, [audioPlayer]);
  
  // Retourner l'API publique
  return {
    // État
    currentTrack: audioPlayer.currentTrack,
    isPlaying: audioPlayer.isPlaying,
    volume: audioPlayer.volume,
    repeat: audioPlayer.repeat,
    shuffle: audioPlayer.shuffle,
    progress: audioPlayer.progress,
    duration: audioPlayer.duration,
    loading: audioPlayer.loading,
    error: audioPlayer.error,
    currentTime: audioPlayer.currentTime,
    loadingTrack: audioPlayer.loadingTrack,
    isMuted: audioPlayer.isMuted,
    
    // Opérations sur les pistes
    playTrack: audioPlayer.playTrack,
    pauseTrack: audioPlayer.pauseTrack,
    resumeTrack: audioPlayer.resumeTrack,
    nextTrack: audioPlayer.nextTrack,
    previousTrack: audioPlayer.previousTrack,
    
    // Contrôles du lecteur
    seekTo: audioPlayer.seekTo,
    setVolume: audioPlayer.setVolume,
    toggleMute: audioPlayer.toggleMute,
    formatTime: audioPlayer.formatTime,
    handleProgressClick: audioPlayer.handleProgressClick,
    handleVolumeChange,
    toggleRepeat: audioPlayer.toggleRepeat,
    toggleShuffle: audioPlayer.toggleShuffle
  };
}

export default useAudioPlayer;
