/**
 * useEnhancedMusicPlayer - Hook enrichi avec feedback et persistance
 * Connecté à MusicContext + Supabase
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { MusicTrack } from '@/types/music';
import { toast } from '@/hooks/use-toast';
import { useMusicHistory, useLastPlayedTrack } from '@/hooks/music/useMusicSettings';
import { useGamification } from '@/hooks/useGamification';
import { logger } from '@/lib/logger';

export const useEnhancedMusicPlayer = () => {
  const music = useMusic();
  const { value: history, setValue: setHistory } = useMusicHistory();
  const { setValue: setLastPlayed } = useLastPlayedTrack();
  const { updateChallengeProgress, addPoints } = useGamification();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [visualizerEnabled, setVisualizerEnabled] = useState(true);
  const [keyboardShortcutsEnabled, setKeyboardShortcutsEnabled] = useState(true);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');
  const [isShuffled, setIsShuffled] = useState(false);
  
  const tracksPlayedRef = useRef<Set<string>>(new Set());

  // Gestion des raccourcis clavier globaux
  useEffect(() => {
    if (!keyboardShortcutsEnabled) return;

    const handleGlobalKeypress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayer();
          break;
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
        case 'KeyM':
          e.preventDefault();
          music.setVolume(music.state.volume > 0 ? 0 : 0.7);
          break;
        case 'ArrowUp':
          if (e.ctrlKey) {
            e.preventDefault();
            music.setVolume(Math.min(1, music.state.volume + 0.1));
          }
          break;
        case 'ArrowDown':
          if (e.ctrlKey) {
            e.preventDefault();
            music.setVolume(Math.max(0, music.state.volume - 0.1));
          }
          break;
        case 'ArrowRight':
          if (e.ctrlKey) {
            e.preventDefault();
            nextTrackWithFeedback();
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey) {
            e.preventDefault();
            previousTrackWithFeedback();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleGlobalKeypress);
    return () => document.removeEventListener('keydown', handleGlobalKeypress);
  }, [keyboardShortcutsEnabled, isExpanded, music]);

  // Tracker l'historique et gamification
  useEffect(() => {
    const track = music.state.currentTrack;
    if (track && music.state.isPlaying && !tracksPlayedRef.current.has(track.id)) {
      tracksPlayedRef.current.add(track.id);
      
      // Sauvegarder dans l'historique
      const newHistory = [track.id, ...(history || []).filter(id => id !== track.id)].slice(0, 50);
      setHistory(newHistory);
      setLastPlayed(track.id);
      
      // Gamification
      updateChallengeProgress('3', 1); // Challenge écoute musicale
      addPoints(10);
      
      logger.debug('Track played', { trackId: track.id }, 'MUSIC');
    }
  }, [music.state.currentTrack?.id, music.state.isPlaying]);

  const togglePlayer = useCallback(() => {
    if (music.state.isPlaying) {
      music.pause();
      toast({ title: "⏸️ Lecture mise en pause", duration: 1000 });
    } else {
      music.play();
      toast({ title: "▶️ Lecture démarrée", duration: 1000 });
    }
  }, [music]);

  const playTrackWithFeedback = useCallback((track: MusicTrack) => {
    music.play(track);
    toast({
      title: "🎵 Lecture en cours",
      description: `${track.title} - ${track.artist}`,
      duration: 2000
    });
  }, [music]);

  const nextTrackWithFeedback = useCallback(() => {
    music.next();
    toast({ title: "⏭️ Morceau suivant", duration: 1000 });
  }, [music]);

  const previousTrackWithFeedback = useCallback(() => {
    music.previous();
    toast({ title: "⏮️ Morceau précédent", duration: 1000 });
  }, [music]);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(prev => {
      const next = prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none';
      toast({ 
        title: next === 'none' ? '🔁 Répétition désactivée' : next === 'all' ? '🔁 Répéter tout' : '🔂 Répéter un',
        duration: 1000 
      });
      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => {
      toast({ title: !prev ? '🔀 Lecture aléatoire' : '📋 Ordre normal', duration: 1000 });
      return !prev;
    });
  }, []);

  return {
    // État du lecteur
    ...music,
    isExpanded,
    setIsExpanded,
    visualizerEnabled,
    setVisualizerEnabled,
    keyboardShortcutsEnabled,
    setKeyboardShortcutsEnabled,
    repeatMode,
    isShuffled,
    
    // Actions avec feedback
    togglePlayer,
    playTrackWithFeedback,
    nextTrackWithFeedback,
    previousTrackWithFeedback,
    cycleRepeatMode,
    toggleShuffle
  };
};

export default useEnhancedMusicPlayer;
