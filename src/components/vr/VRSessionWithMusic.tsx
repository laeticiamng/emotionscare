
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { VRSessionWithMusicProps } from '@/types';

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  template,
  session,
  onComplete,
  onExit,
  onSessionComplete
}) => {
  const [isActive, setIsActive] = useState(false);
  const { currentTrack, isPlaying, pauseTrack, playTrack, loadPlaylistForEmotion } = useMusic();
  const activeSession = session || template;
  
  // Get emotion from template or session safely
  const targetEmotion = activeSession && 'emotion' in activeSession 
    ? activeSession.emotion 
    : 'calm';

  useEffect(() => {
    const loadEmotionalMusic = async () => {
      if (!targetEmotion || !loadPlaylistForEmotion) return;
      
      try {
        const playlist = await loadPlaylistForEmotion(targetEmotion);
        if (playlist && playlist.tracks.length > 0) {
          const track = playlist.tracks[0];
          playTrack({
            ...track,
            audioUrl: track.audioUrl || track.url
          });
          setIsActive(true);
        }
      } catch (error) {
        console.error('Error loading music for VR session:', error);
      }
    };
    
    loadEmotionalMusic();
    
    return () => {
      pauseTrack();
    };
  }, [targetEmotion, loadPlaylistForEmotion, playTrack, pauseTrack]);
  
  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };
  
  const handleComplete = () => {
    if (onSessionComplete) {
      onSessionComplete();
    } else if (onComplete && template) {
      const completedSession = {
        id: `session-${Date.now()}`,
        templateId: template.id,
        userId: 'current-user',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: 0,
        completed: true
      };
      onComplete(completedSession);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Musique adaptative</span>
          {isActive && (
            <Button size="sm" variant="ghost" onClick={handleTogglePlay}>
              {isPlaying ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isPlaying ? 'Pause' : 'Lecture'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {currentTrack?.coverUrl ? (
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Volume2 className="h-6 w-6 text-primary/60" />
            )}
          </div>
          
          <div>
            <p className="font-medium">
              {currentTrack ? currentTrack.title : 'Choisir une musique'}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentTrack ? currentTrack.artist : 'Adaptée à votre session'}
            </p>
          </div>
        </div>
        
        {targetEmotion && (
          <p className="text-xs text-muted-foreground mt-4">
            Musique sélectionnée pour l'émotion: <span className="font-medium">{targetEmotion}</span>
          </p>
        )}
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleComplete}>
          Terminer la session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VRSessionWithMusic;
