
import React, { useState, useEffect, useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { VRSessionTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, Volume2, VolumeX } from 'lucide-react';
import VRAudioSession from './VRAudioSession';
import VRMusicTrackInfo from './VRMusicTrackInfo';
import { getPlaylist } from '@/lib/musicService';
import { useToast } from '@/hooks/use-toast';
import MusicMoodVisualization from '@/components/music/page/MusicMoodVisualization';
import { Slider } from '@/components/ui/slider';

interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onCompleteSession: () => void;
}

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  template,
  onCompleteSession
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentTrack, playTrack, pauseTrack, loadPlaylistForEmotion, setVolume } = useMusic();
  const { toast } = useToast();
  
  // Set initial duration and remaining time
  useEffect(() => {
    if (template.duration) {
      setSessionDuration(template.duration);
      setRemainingTime(template.duration);
    }
  }, [template.duration]);
  
  // Load appropriate music for the VR session
  useEffect(() => {
    const loadSessionMusic = async () => {
      if (template.recommended_mood) {
        try {
          setIsLoading(true);
          await loadPlaylistForEmotion(template.recommended_mood);
          toast({
            title: "Musique d'ambiance activée",
            description: `Playlist "${template.recommended_mood}" chargée pour votre session VR`
          });
        } catch (error) {
          console.error("Erreur lors du chargement de la playlist:", error);
          toast({
            title: "Problème de chargement audio",
            description: "Impossible de charger la musique d'ambiance",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadSessionMusic();
    
    // Return cleanup function
    return () => {
      pauseTrack(); // Ensure music stops when component unmounts
    };
  }, [template.recommended_mood, loadPlaylistForEmotion, toast, pauseTrack]);
  
  // Timer to countdown session
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isPaused && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            onCompleteSession();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPaused, remainingTime, onCompleteSession]);
  
  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Toggle pause/play
  const handleTogglePause = useCallback(() => {
    setIsPaused(!isPaused);
    
    // Also control music playback
    if (currentTrack) {
      if (!isPaused) {
        pauseTrack();
      } else {
        playTrack(currentTrack);
      }
    }
  }, [isPaused, currentTrack, pauseTrack, playTrack]);
  
  // Toggle mute music
  const handleToggleMute = useCallback(() => {
    setIsMusicMuted(!isMusicMuted);
    setVolume(isMusicMuted ? musicVolume : 0);
  }, [isMusicMuted, musicVolume, setVolume]);
  
  // Handle volume change
  const handleVolumeChange = useCallback((values: number[]) => {
    const newVolume = values[0];
    setMusicVolume(newVolume);
    if (!isMusicMuted) {
      setVolume(newVolume);
    }
  }, [isMusicMuted, setVolume]);
  
  const sessionTitle = template.title || template.theme;
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-900/80 to-indigo-700/80 backdrop-blur p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-white">
          <h2 className="text-xl font-bold mb-6">{sessionTitle}</h2>
          
          <VRAudioSession
            template={template}
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onComplete={onCompleteSession}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm opacity-80">Session en cours</p>
            <div className="text-2xl font-medium">
              {formatTime(remainingTime)} / {formatTime(sessionDuration)}
            </div>
            
            <Button 
              variant="outline" 
              className="mt-4 border-white/30 hover:bg-white/10"
              onClick={handleTogglePause}
            >
              {isPaused ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Reprendre
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-secondary/10 backdrop-blur p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Music className="mr-2 h-5 w-5 text-primary" />
              Ambiance sonore
            </h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-muted mb-2"></div>
                  <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
              </div>
            ) : currentTrack ? (
              <>
                <VRMusicTrackInfo currentTrack={currentTrack} />
                
                <div className="mt-4 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={handleToggleMute}
                  >
                    {isMusicMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Slider
                    value={[musicVolume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="flex-1"
                  />
                </div>
                
                <div className="mt-6">
                  <MusicMoodVisualization 
                    mood={template.recommended_mood || 'calm'} 
                    intensity={60}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Chargement de l'ambiance musicale...
              </div>
            )}
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <h3 className="text-sm font-medium mb-2">À propos de cette session</h3>
            <p className="text-sm text-muted-foreground">{template.description || "Cette session vous aide à vous détendre et à vous reconnecter avec vous-même."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRSessionWithMusic;
