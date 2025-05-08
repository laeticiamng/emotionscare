
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, Pause, Play, Volume2, VolumeX, PictureInPicture, Maximize, Minimize, Clock } from 'lucide-react';
import { VRSessionTemplate } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMusic } from '@/contexts/MusicContext';
import VRMusicTrackInfo from './VRMusicTrackInfo';
import { formatTime } from '@/lib/utils';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';

interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onCompleteSession: () => void;
  isAudioOnly: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  template,
  onCompleteSession,
  isAudioOnly = false,
  videoUrl = '',
  audioUrl = '',
  emotion = 'calm'
}) => {
  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [inFullscreen, setInFullscreen] = useState(false);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Music integration
  const { loadPlaylistForEmotion, currentTrack, playTrack } = useMusic();
  const { EMOTION_TO_MUSIC_MAP, activateMusicForEmotion } = useMusicEmotionIntegration();
  
  // Load music based on emotion when component mounts
  useEffect(() => {
    if (emotion) {
      const emotionKey = emotion.toLowerCase();
      const musicType = EMOTION_TO_MUSIC_MAP[emotionKey] || EMOTION_TO_MUSIC_MAP.default;
      const playlist = loadPlaylistForEmotion(musicType);
      
      // Autoplay first track if a playlist is loaded
      if (playlist && playlist.tracks.length > 0 && !currentTrack) {
        playTrack(playlist.tracks[0]);
      }
    }
  }, [emotion, loadPlaylistForEmotion, playTrack, EMOTION_TO_MUSIC_MAP, currentTrack]);
  
  // Handle video playback
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleTimeUpdate = () => {
      const current = videoElement.currentTime;
      const videoDuration = videoElement.duration;
      
      if (videoDuration) {
        setCurrentTime(current);
        setProgress((current / videoDuration) * 100);
        
        // Mark session as completed when it reaches the end
        if (current >= videoDuration - 1) {
          setSessionCompleted(true);
          setIsPlaying(false);
          onCompleteSession();
        }
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };
    
    const handleError = () => {
      setError('Erreur lors du chargement de la vidéo. Veuillez réessayer.');
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('error', handleError);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('error', handleError);
    };
  }, [onCompleteSession]);
  
  // Update video element when volume changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);
  
  // Handle play/pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (!hasStarted) {
      setHasStarted(true);
    }
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error('Error playing video:', err);
        setError('Erreur de lecture. Veuillez vérifier vos paramètres de navigateur.');
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle seeking
  const handleSeek = (newValue: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const seekTime = (newValue[0] / 100) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
    setProgress(newValue[0]);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!contentRef.current) return;
    
    if (!document.fullscreenElement) {
      contentRef.current.requestFullscreen().then(() => {
        setInFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setInFullscreen(false);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };
  
  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setInFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Card className="overflow-hidden">
      <div ref={contentRef} className="relative">
        {/* Video or Audio Only Container */}
        <div className={`relative ${isAudioOnly ? 'aspect-[16/9] bg-gradient-to-b from-primary/10 to-primary/5 flex items-center justify-center' : ''}`}>
          {isAudioOnly ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-medium mb-3">{template.title || 'Session audio guidée'}</h3>
              <p className="text-muted-foreground mb-6">
                Fermez les yeux et laissez-vous guider par cette séance audio.
              </p>
              {audioUrl && (
                <audio
                  ref={videoRef as React.RefObject<HTMLAudioElement>} 
                  src={audioUrl}
                  className="w-full"
                  preload="metadata"
                />
              )}
              <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <Clock className="h-10 w-10 text-primary" />
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto"
              preload="metadata"
              poster={template.preview_url}
            />
          )}
          
          {/* Play button overlay when not started */}
          {!hasStarted && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={togglePlayPause}
            >
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-full">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <CardContent className="p-4 bg-background">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-1">
              <Slider 
                value={[progress]} 
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <div>{formatTime(currentTime)}</div>
                <div>{formatTime(duration)}</div>
              </div>
            </div>
            
            {/* Playback controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={togglePlayPause}
                  size="icon"
                  variant="ghost"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                
                <Button
                  onClick={toggleMute}
                  size="icon"
                  variant="ghost"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                
                <div className="w-24 hidden md:block">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={(newValue) => setVolume(newValue[0])}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleFullscreen}
                  size="icon"
                  variant="ghost"
                  className="hidden md:flex"
                >
                  {inFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="hidden md:flex"
                >
                  <PictureInPicture className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Music track info */}
            {currentTrack && (
              <div className="border-t pt-3 mt-3">
                <VRMusicTrackInfo currentTrack={currentTrack} />
              </div>
            )}
            
            {/* Status indicator */}
            {sessionCompleted && (
              <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">
                Session terminée ! Vous avez complété cette séance avec succès.
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default VRSessionWithMusic;
