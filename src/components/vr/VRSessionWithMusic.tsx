
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { MusicTrack } from '@/types';
import { useVRSessionTimer } from '@/hooks/useVRSessionTimer';
import { YoutubeEmbed } from '../ui/youtube-embed';
import VRSessionProgress from './VRSessionProgress';

interface VRSessionWithMusicProps {
  emotion?: string;
  sessionDuration: number; // in seconds
  videoUrl?: string;
  audioUrl?: string;
  isAudioOnly?: boolean;
  onComplete: () => void;
}

export const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  emotion = 'calm',
  sessionDuration,
  videoUrl,
  audioUrl,
  isAudioOnly = false,
  onComplete
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();
  const { loadPlaylistForEmotion, pauseTrack, playTrack, currentTrack } = useMusic();
  
  // Initialize timer with proper duration
  const {
    percentageComplete,
    formatTimeRemaining,
  } = useVRSessionTimer({ 
    totalDurationSeconds: sessionDuration,
    onComplete
  });
  
  // Load emotionally appropriate music when session starts
  useEffect(() => {
    loadPlaylistForEmotion(emotion);
    
    toast({
      title: "Session VR démarrée",
      description: `Musique adaptée à l'état "${emotion}" chargée.`
    });
    
    // Cleanup when component unmounts
    return () => {
      pauseTrack();
    };
  }, [emotion, loadPlaylistForEmotion, pauseTrack, toast]);
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Son activé" : "Son désactivé",
      description: isMuted ? "Le son a été réactivé." : "Le son a été coupé.",
    });
  };
  
  const handleRestartSession = () => {
    // This would typically restart the session
    toast({
      title: "Session redémarrée",
      description: "La session VR a été redémarrée.",
    });
  };
  
  return (
    <div className="space-y-5">
      {/* Visual Experience Container */}
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        {isAudioOnly ? (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-indigo-900/80 to-indigo-600/80 text-white">
            <Volume2 className="h-20 w-20 mb-4" />
            <h2 className="text-2xl font-bold">Expérience audio</h2>
            <p className="text-lg">{currentTrack?.title || "Méditation guidée"}</p>
            
            <div className="mt-8 text-center">
              <p className="text-sm opacity-70">Les yeux fermés, concentrez-vous sur votre respiration</p>
              <p className="text-sm opacity-70">Laissez-vous guider par l'audio</p>
            </div>
          </div>
        ) : videoUrl ? (
          <YoutubeEmbed 
            videoUrl={videoUrl} 
            autoplay={true} 
            controls={false} 
            showInfo={false}
            loop={true}
            mute={isMuted} // Fixed attribute name
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-900 to-purple-800 text-white">
            <p className="text-xl font-semibold">Vidéo de démonstration</p>
          </div>
        )}
      </div>
      
      {/* Session Progress and Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Progress bar */}
          <VRSessionProgress percentComplete={percentageComplete} />
          
          <div className="flex justify-between items-center pt-2">
            <div>
              <p className="text-sm font-medium">Temps restant:</p>
              <p className="text-2xl font-bold">{formatTimeRemaining()}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleToggleMute}
                title={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRestartSession}
                title="Redémarrer la session"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
              
              <Button variant="default" onClick={onComplete}>
                Terminer la session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRSessionWithMusic;
