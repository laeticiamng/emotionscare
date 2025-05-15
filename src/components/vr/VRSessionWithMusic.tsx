
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { VRSessionWithMusicProps } from '@/types';

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
  // Use direct props or from the template
  const activeTemplate = session || template;
  const handleComplete = onSessionComplete || onComplete;
  
  const targetEmotion = emotion || (
    activeTemplate?.emotion || 'calm'
  );
  
  const { loadPlaylistForEmotion, isPlaying, playTrack, pauseTrack } = useMusic();
  
  useEffect(() => {
    // Load a playlist based on the emotion target of the session
    const loadMusic = async () => {
      try {
        if (targetEmotion && loadPlaylistForEmotion) {
          const playlist = await loadPlaylistForEmotion(targetEmotion);
          
          if (playlist && playlist.tracks.length > 0) {
            // Ensure the track has the required properties
            const track = {
              ...playlist.tracks[0],
              duration: playlist.tracks[0].duration || 0,
              url: playlist.tracks[0].url || '',
              audioUrl: playlist.tracks[0].audioUrl || playlist.tracks[0].url || ''
            };
            playTrack(track);
          }
        }
      } catch (error) {
        console.error("Error loading music for VR session:", error);
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
