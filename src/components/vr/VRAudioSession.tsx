// @ts-nocheck

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { VRSessionTemplate } from '@/types/vr';
import { getVRTemplateAudioUrl } from '@/utils/vrCompatibility';

interface VRAudioSessionProps {
  template: VRSessionTemplate;
  autoplay?: boolean;
  className?: string;
}

const VRAudioSession: React.FC<VRAudioSessionProps> = ({
  template,
  autoplay = false,
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Get audio URL using compatibility helper
  const audioUrl = getVRTemplateAudioUrl(template);
  
  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl || '');
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    
    // Autoplay if enabled
    if (autoplay && audioUrl) {
      audio.play().catch(() => {
        // Autoplay failed - silent
      });
      setIsPlaying(true);
    }
    
    // Clean up
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [audioUrl, autoplay]);
  
  // Format time as mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Play failed - silent
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Volume2 className="h-5 w-5 mr-2 text-primary" />
          Audio de la session
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!audioUrl ? (
          <p className="text-center text-muted-foreground py-4">
            Aucun audio disponible pour cette session
          </p>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Progression</p>
              <div className="flex items-center space-x-2 text-sm">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
                aria-label={isMuted ? 'Activer le son' : 'Désactiver le son'}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={togglePlay}
                className="w-32"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Lecture
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRAudioSession;
