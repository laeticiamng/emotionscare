
import React, { useEffect, useState } from 'react';
import { useMusic } from '@/contexts/music/MusicContext';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ARExperienceProps {
  emotionTrigger?: string;
}

const ARExperience: React.FC<ARExperienceProps> = ({ emotionTrigger = 'calm' }) => {
  const { loadPlaylistForEmotion, playTrack, pauseTrack, isPlaying, volume, setVolume, adjustVolume } = useMusic();
  const [isMuted, setIsMuted] = useState(false);
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const [currentEmotion, setCurrentEmotion] = useState(emotionTrigger);

  useEffect(() => {
    // Initialiser l'audio immersif basé sur l'émotion
    const initializeImmersiveAudio = async () => {
      try {
        const emotionPlaylist = await loadPlaylistForEmotion({ emotion: currentEmotion });
        
        if (emotionPlaylist && emotionPlaylist.tracks && emotionPlaylist.tracks.length > 0) {
          playTrack(emotionPlaylist.tracks[0]);
          toast({
            title: "Audio immersif activé",
            description: `Ambiance sonore adaptée à l'émotion: ${currentEmotion}`
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation audio AR:", error);
      }
    };
    
    initializeImmersiveAudio();
    
    // Cleanup
    return () => {
      pauseTrack();
    };
  }, [currentEmotion, loadPlaylistForEmotion, pauseTrack, playTrack, toast]);

  const toggleMute = () => {
    if (isMuted) {
      if (setVolume) setVolume(0.5); // Restore previous volume
    } else {
      if (setVolume) setVolume(0); // Mute
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeAdjustment = (delta: number) => {
    if (adjustVolume) {
      adjustVolume(delta);
    }
  };

  return (
    <div className="ar-experience-container">
      <div className="ar-controls absolute bottom-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
        </Button>
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        {/* La scène AR sera injectée ici via Three.js ou WebXR */}
      </div>
    </div>
  );
};

export default ARExperience;
