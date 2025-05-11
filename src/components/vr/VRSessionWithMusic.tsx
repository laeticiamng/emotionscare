
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { VRSessionWithMusicProps } from '@/types/vr';

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({ 
  template, 
  onComplete, 
  session, 
  onSessionComplete, 
  isAudioOnly, 
  videoUrl, 
  audioUrl, 
  emotion 
}) => {
  // Use either direct props or from template
  const activeTemplate = session || template;
  const handleComplete = onSessionComplete || onComplete;
  const targetEmotion = emotion || (activeTemplate.emotions && activeTemplate.emotions.length > 0 ? activeTemplate.emotions[0] : 'calm');
  
  const { loadPlaylistForEmotion, isPlaying, playTrack, pauseTrack } = useMusic();
  
  useEffect(() => {
    // Load a playlist based on the target emotion of the session
    const loadMusic = async () => {
      if (targetEmotion) {
        const playlist = await loadPlaylistForEmotion(targetEmotion);
        
        if (playlist && playlist.tracks.length > 0) {
          playTrack(playlist.tracks[0]);
        }
      }
    };
    
    loadMusic();
    
    // Cleanup
    return () => {
      pauseTrack();
    };
  }, [activeTemplate, targetEmotion, loadPlaylistForEmotion, playTrack, pauseTrack]);
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Musique adaptative</h3>
            <p className="text-sm text-muted-foreground">
              {isPlaying ? 
                'Lecture en cours - Musique adaptée à votre session' : 
                'La musique démarrera automatiquement'}
            </p>
          </div>
          
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="animate-pulse">🎵</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionWithMusic;
