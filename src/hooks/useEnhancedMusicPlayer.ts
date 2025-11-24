import { useState, useCallback, useEffect } from 'react';
import { useMusicCompat } from '@/hooks/useMusicCompat';
import { MusicTrack } from '@/types/music';
import { toast } from '@/hooks/use-toast';

export const useEnhancedMusicPlayer = () => {
  const music = useMusicCompat();
  const { isPlaying } = music.state;
  const [isExpanded, setIsExpanded] = useState(false);
  const [visualizerEnabled, setVisualizerEnabled] = useState(true);
  const [keyboardShortcutsEnabled, setKeyboardShortcutsEnabled] = useState(true);

  // Gestion des raccourcis clavier globaux
  useEffect(() => {
    if (!keyboardShortcutsEnabled) return;

    const handleGlobalKeypress = (e: KeyboardEvent) => {
      // Éviter les conflits avec les champs de saisie
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'KeyP':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            togglePlayer();
          }
          break;
        case 'KeyE':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleGlobalKeypress);
    return () => document.removeEventListener('keydown', handleGlobalKeypress);
  }, [keyboardShortcutsEnabled, isExpanded]);

  const togglePlayer = useCallback(() => {
    if (isPlaying) {
      music.pause();
      toast({
        title: "Lecture mise en pause",
        duration: 1000
      });
    } else {
      music.play();
      toast({
        title: "Lecture démarrée",
        duration: 1000
      });
    }
  }, [isPlaying, music]);

  const playTrackWithFeedback = useCallback((track: MusicTrack) => {
    music.play(track);
    toast({
      title: "Lecture en cours",
      description: `${track.title} - ${track.artist}`,
      duration: 2000
    });
  }, [music]);

  const nextTrackWithFeedback = useCallback(() => {
    music.next();
    toast({
      title: "Morceau suivant",
      duration: 1000
    });
  }, [music]);

  const previousTrackWithFeedback = useCallback(() => {
    music.previous();
    toast({
      title: "Morceau précédent", 
      duration: 1000
    });
  }, [music]);

  return {
    // État du lecteur (spread state and methods from useMusicCompat)
    ...music.state,
    ...music,
    isExpanded,
    setIsExpanded,
    visualizerEnabled,
    setVisualizerEnabled,
    keyboardShortcutsEnabled,
    setKeyboardShortcutsEnabled,

    // Actions avec feedback
    togglePlayer,
    playTrackWithFeedback,
    nextTrackWithFeedback,
    previousTrackWithFeedback
  };
};

export default useEnhancedMusicPlayer;
