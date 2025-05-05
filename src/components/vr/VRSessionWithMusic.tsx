
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Play, Pause, Timer, Music, Headphones } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import YoutubeEmbed from './YoutubeEmbed';
import { VRSessionTemplate } from '@/types';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onCompleteSession: () => void;
}

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({ template, onCompleteSession }) => {
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const totalDurationSeconds = template.duration * 60;
  const percentageComplete = Math.min((elapsed / totalDurationSeconds) * 100, 100);
  const { loadPlaylistForEmotion, openDrawer, isPlaying, pauseTrack, playTrack, currentTrack } = useMusic();
  const { toast } = useToast();
  
  // Auto-complete session when time is up
  useEffect(() => {
    if (elapsed >= totalDurationSeconds) {
      onCompleteSession();
    }
  }, [elapsed, totalDurationSeconds, onCompleteSession]);

  // Timer logic
  useEffect(() => {
    let timer: number | undefined;
    if (!isPaused && elapsed < totalDurationSeconds) {
      timer = window.setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPaused, elapsed, totalDurationSeconds]);

  // Format time remaining as mm:ss
  const formatTimeRemaining = () => {
    const remainingSeconds = Math.max(totalDurationSeconds - elapsed, 0);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
    setIsAudioPlaying(!isPaused);
  };
  
  const toggleAmbianceMusic = () => {
    if (isMusicPlaying) {
      pauseTrack();
      setIsMusicPlaying(false);
      toast({
        title: "Musique d'ambiance désactivée",
        description: "La musique a été mise en pause"
      });
    } else {
      // Map VR template themes to music playlists
      const musicTypeMap = {
        'Forêt apaisante': 'calm',
        'Plage relaxante': 'calm',
        'Méditation guidée': 'focused',
        'Respiration profonde': 'focused'
      };
      
      const musicType = musicTypeMap[template.theme as keyof typeof musicTypeMap] || 'calm';
      
      loadPlaylistForEmotion(musicType);
      setIsMusicPlaying(true);
      toast({
        title: "Musique d'ambiance activée",
        description: `Playlist "${musicType}" ajoutée à votre expérience VR`
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4 text-center">
          <h2 className="text-xl font-semibold">{template.theme}</h2>
          
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-muted">
              {template.is_audio_only ? (
                <div className="bg-gradient-to-br from-purple-900 to-indigo-600 p-10 rounded-lg flex flex-col items-center justify-center space-y-6">
                  <div className="h-32 w-32 rounded-full bg-indigo-700/50 flex items-center justify-center">
                    {isPaused ? (
                      <Play className="h-16 w-16 text-white" />
                    ) : (
                      <Pause className="h-16 w-16 text-white" />
                    )}
                  </div>
                  <div className="text-white text-xl font-medium">Méditation guidée</div>
                  {template.audio_url && (
                    <audio
                      src={template.audio_url}
                      autoPlay={!isPaused}
                      loop={false}
                      onEnded={onCompleteSession}
                      className="hidden"
                    />
                  )}
                </div>
              ) : (
                <AspectRatio ratio={16/9} className="max-w-4xl mx-auto">
                  <YoutubeEmbed 
                    videoUrl={template.preview_url}
                    autoplay={true}
                    controls={true}
                    showInfo={false}
                    loop={true}
                  />
                </AspectRatio>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-1" />
                  <span>Temps restant</span>
                </div>
                <span className="font-mono">{formatTimeRemaining()}</span>
              </div>
              <Progress value={percentageComplete} className="h-2" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {template.is_audio_only && (
                <Button 
                  onClick={togglePlayPause}
                  variant="outline"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Reprendre
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                onClick={toggleAmbianceMusic}
                variant="outline"
                className={isMusicPlaying ? "bg-primary/10" : ""}
              >
                {isMusicPlaying ? (
                  <>
                    <Music className="h-4 w-4 mr-2" />
                    Arrêter la musique
                  </>
                ) : (
                  <>
                    <Headphones className="h-4 w-4 mr-2" />
                    Ajouter musique
                  </>
                )}
              </Button>
              
              <Button 
                onClick={onCompleteSession}
                variant={template.is_audio_only ? "outline" : "default"}
              >
                Terminer la session
              </Button>
            </div>
            
            {isMusicPlaying && currentTrack && (
              <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                    <Music className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{currentTrack.title}</p>
                    <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRSessionWithMusic;
