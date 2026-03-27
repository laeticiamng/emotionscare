// @ts-nocheck
/**
 * Experience Layer — useAmbientAudio
 * React hook for controlling the AudioEngine.
 */

import { useEffect, useCallback } from 'react';
import { audioEngine } from '../services/AudioEngine';
import { useExperienceStore } from '../store/experience.store';

type AmbientTrack = 'morning-calm' | 'afternoon-focus' | 'evening-wind-down' | 'night-rest' | 'breathing-sync';
type FeedbackSound = 'unlock' | 'level-up' | 'badge-reveal' | 'transition' | 'pulse' | 'insight' | 'streak' | 'error';

export function useAmbientAudio() {
  const audioEnabled = useExperienceStore((s) => s.preferences.ambientAudioEnabled);
  const masterVolume = useExperienceStore((s) => s.preferences.masterVolume);
  const updatePreferences = useExperienceStore((s) => s.updatePreferences);

  // Sync enabled state
  useEffect(() => {
    if (audioEnabled) {
      audioEngine.enable();
    } else {
      audioEngine.disable();
    }
  }, [audioEnabled]);

  // Sync volume
  useEffect(() => {
    audioEngine.setMasterVolume(masterVolume);
  }, [masterVolume]);

  // Tab visibility handling
  useEffect(() => {
    const handler = () => {
      audioEngine.handleVisibilityChange(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopAmbient();
    };
  }, []);

  const toggleAudio = useCallback(() => {
    updatePreferences({ ambientAudioEnabled: !audioEnabled });
  }, [audioEnabled, updatePreferences]);

  const setVolume = useCallback((volume: number) => {
    updatePreferences({ masterVolume: Math.max(0, Math.min(1, volume)) });
  }, [updatePreferences]);

  const playAmbient = useCallback((track: AmbientTrack) => {
    audioEngine.setAmbientTrack(track);
  }, []);

  const stopAmbient = useCallback(() => {
    audioEngine.stopAmbient();
  }, []);

  const playFeedback = useCallback((sound: FeedbackSound) => {
    audioEngine.playFeedback(sound);
  }, []);

  return {
    enabled: audioEnabled,
    volume: masterVolume,
    toggleAudio,
    setVolume,
    playAmbient,
    stopAmbient,
    playFeedback,
  };
}
