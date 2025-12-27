import React, { useEffect } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { toast } from '@/hooks/use-toast';
import { useShortcutsSeen } from '@/hooks/music/useMusicSettings';

interface PlayerKeyboardShortcutsProps {
  enabled?: boolean;
  showTooltips?: boolean;
}

const PlayerKeyboardShortcuts: React.FC<PlayerKeyboardShortcutsProps> = ({
  enabled = true,
  showTooltips = false
}) => {
  const { state, play, pause, next, previous, setVolume } = useMusic();
  const { isPlaying, volume } = state;
  const { value: hasSeenShortcuts, setValue: setHasSeenShortcuts } = useShortcutsSeen();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isPlaying) {
            pause();
            if (showTooltips) {
              toast({
                title: "Pause",
                description: "Lecture mise en pause",
                duration: 1000
              });
            }
          } else {
            play();
            if (showTooltips) {
              toast({
                title: "Lecture",
                description: "Lecture démarrée",
                duration: 1000
              });
            }
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          previous();
          if (showTooltips) {
            toast({
              title: "Précédent",
              description: "Morceau précédent",
              duration: 1000
            });
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          next();
          if (showTooltips) {
            toast({
              title: "Suivant",
              description: "Morceau suivant",
              duration: 1000
            });
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          const newVolumeUp = Math.min(1, volume + 0.1);
          setVolume(newVolumeUp);
          if (showTooltips) {
            toast({
              title: "Volume",
              description: `Volume: ${Math.round(newVolumeUp * 100)}%`,
              duration: 1000
            });
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          const newVolumeDown = Math.max(0, volume - 0.1);
          setVolume(newVolumeDown);
          if (showTooltips) {
            toast({
              title: "Volume",
              description: `Volume: ${Math.round(newVolumeDown * 100)}%`,
              duration: 1000
            });
          }
          break;

        case 'KeyM':
          e.preventDefault();
          setVolume(volume > 0 ? 0 : 0.7);
          if (showTooltips) {
            toast({
              title: volume > 0 ? "Muet" : "Son activé",
              description: volume > 0 ? "Audio coupé" : "Audio rétabli",
              duration: 1000
            });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enabled, isPlaying, volume, play, pause, next, previous, setVolume, showTooltips]);

  // Show keyboard shortcuts help on first load
  useEffect(() => {
    if (enabled && showTooltips && !hasSeenShortcuts) {
      setTimeout(() => {
        toast({
          title: "Raccourcis clavier disponibles",
          description: "Espace: Pause/Lecture, ←→: Navigation, ↑↓: Volume, M: Muet",
          duration: 5000
        });
        setHasSeenShortcuts(true);
      }, 2000);
    }
  }, [enabled, showTooltips, hasSeenShortcuts, setHasSeenShortcuts]);

  return null; // This component doesn't render anything
};

export default PlayerKeyboardShortcuts;
