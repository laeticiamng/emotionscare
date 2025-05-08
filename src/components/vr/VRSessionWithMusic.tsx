
import React, { useState, useEffect } from 'react';
import { VRSessionTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Pause, Play, SkipForward } from 'lucide-react';
import MusicPlayer from '../music/player/MusicPlayer';
import { useMusic } from '@/contexts/MusicContext';

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onCompleteSession: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  template,
  onCompleteSession,
  isAudioOnly = true,
  videoUrl,
  audioUrl,
  emotion = 'calm'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { loadPlaylistForEmotion } = useMusic();
  
  useEffect(() => {
    // Load appropriate music based on emotion
    if (emotion) {
      loadPlaylistForEmotion(emotion);
    }
  }, [emotion, loadPlaylistForEmotion]);
  
  // Handle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Skip session
  const skipSession = () => {
    onCompleteSession();
  };
  
  return (
    <div className="space-y-6">
      {/* Session display area */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {isAudioOnly ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <h3 className="text-xl font-medium mb-4">{template.title || "Session audio"}</h3>
              <p className="text-muted-foreground">
                {isPlaying ? "Session en cours..." : "Appuyez sur Play pour commencer"}
              </p>
            </div>
          </div>
        ) : (
          videoUrl && (
            <video 
              src={videoUrl} 
              className="w-full h-full object-cover" 
              controls={false}
              loop
              muted={false}
              autoPlay={isPlaying}
            />
          )
        )}
        
        {/* Play/Pause overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Button 
            size="lg" 
            variant="secondary" 
            className="rounded-full h-16 w-16 mr-4"
            onClick={togglePlayback}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
          
          <Button 
            variant="ghost" 
            className="rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={skipSession}
          >
            <SkipForward className="h-5 w-5 mr-2" />
            Terminer
          </Button>
        </div>
      </div>
      
      {/* Music player */}
      <div className="p-4 bg-background border rounded-lg">
        <h3 className="font-medium mb-3">Musique thérapeutique</h3>
        <MusicPlayer />
      </div>
    </div>
  );
};

export default VRSessionWithMusic;
