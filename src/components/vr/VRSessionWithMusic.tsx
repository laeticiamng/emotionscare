
import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { VRSessionTemplate, MusicTrack } from '@/types';
import { formatTime } from '@/lib/utils';

interface VRSessionWithMusicProps {
  session: VRSessionTemplate;
  onSessionComplete: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  session,
  onSessionComplete,
  isAudioOnly = false,
  videoUrl,
  audioUrl,
  emotion = 'calm'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number | null>(null);
  
  const { loadPlaylistForEmotion, currentTrack } = useMusic();
  const [sessionMusic, setSessionMusic] = useState<MusicTrack | null>(null);

  // Load music for session
  useEffect(() => {
    const loadMusic = async () => {
      try {
        if (!emotion) return;

        const playlist = await loadPlaylistForEmotion(emotion);
        if (playlist && playlist.tracks && playlist.tracks.length > 0) {
          setSessionMusic(playlist.tracks[0]);
        }
      } catch (err) {
        console.error('Error loading VR session music:', err);
      }
    };
    
    loadMusic();
  }, [emotion, loadPlaylistForEmotion]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      if (videoRef.current) videoRef.current.pause();
      if (audioRef.current) audioRef.current.pause();
      clearInterval(intervalRef.current || undefined);
      intervalRef.current = null;
    } else {
      if (videoRef.current) videoRef.current.play();
      if (audioRef.current) audioRef.current.play();
      
      intervalRef.current = window.setInterval(() => {
        const media = isAudioOnly ? audioRef.current : videoRef.current;
        if (media) {
          const newCurrentTime = media.currentTime;
          const newProgress = (newCurrentTime / media.duration) * 100;
          setCurrentTime(newCurrentTime);
          setProgress(newProgress);
          
          if (newProgress >= 100) {
            setSessionCompleted(true);
            setIsPlaying(false);
            clearInterval(intervalRef.current || undefined);
            onSessionComplete();
          }
        }
      }, 1000);
    }
    
    setIsPlaying(!isPlaying);
  };

  // Handle session end
  const handleEndSession = () => {
    setSessionCompleted(true);
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    onSessionComplete();
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <div className="aspect-video rounded-lg overflow-hidden bg-black">
        {!isAudioOnly && videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            onEnded={handleEndSession}
          />
        )}
        
        {isAudioOnly && audioUrl && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={handleEndSession}
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{session.name}</h2>
              <p className="text-muted-foreground mb-4">{session.description}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Session Controls */}
      <Card className="mt-4 p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(session.duration)}
              </span>
            </div>
            <div className="text-sm font-medium">
              {sessionCompleted ? 'Session terminée' : 'En cours...'}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            onClick={togglePlayPause}
            variant={isPlaying ? "outline" : "default"}
            size="sm"
            className="gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Démarrer</span>
              </>
            )}
          </Button>
          
          <Button
            onClick={handleEndSession}
            variant="ghost"
            size="sm"
          >
            <SkipForward className="h-4 w-4 mr-2" />
            <span>Terminer</span>
          </Button>
          
          <div className="flex items-center gap-2 text-sm">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Audio {sessionMusic ? 'actif' : 'inactif'}</span>
          </div>
        </div>
      </Card>
      
      {/* Music Info */}
      {sessionMusic && (
        <Card className="mt-4 p-4 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Musique: {sessionMusic.title}</p>
              <p className="text-xs text-muted-foreground">
                Adaptée pour: {emotion}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VRSessionWithMusic;
