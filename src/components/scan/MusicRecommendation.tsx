// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { MusicPlaylist } from '@/types/music';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Music, Pause, SkipForward, Volume2, Loader2 } from 'lucide-react';

interface MusicRecommendationProps {
  emotion: string;
  autoPlay?: boolean;
}

export const MusicRecommendation: React.FC<MusicRecommendationProps> = ({
  emotion,
  autoPlay = false
}) => {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { playEmotion, isLoading, getEmotionMusicDescription } = useMusicEmotionIntegration();
  
  useEffect(() => {
    if (autoPlay && emotion) {
      handlePlay();
    }
  }, [emotion, autoPlay]);
  
  const handlePlay = async () => {
    if (emotion) {
      try {
        const result = await playEmotion(emotion);
        if (result) {
          setPlaylist(result);
          setIsPlaying(true);
          setCurrentTrackIndex(0);
        }
      } catch (error) {
        // Music play error - silent
      }
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const nextTrack = () => {
    if (playlist && currentTrackIndex < playlist.tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    }
  };

  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      joie: 'bg-yellow-500',
      calme: 'bg-blue-500',
      tristesse: 'bg-indigo-500',
      colère: 'bg-red-500',
      anxiété: 'bg-orange-500',
      sérénité: 'bg-teal-500',
    };
    return colors[emotion.toLowerCase()] || 'bg-primary';
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Music className="h-5 w-5 text-primary" />
          Musique adaptée
          {emotion && (
            <Badge variant="secondary" className="ml-auto capitalize">
              {emotion}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {getEmotionMusicDescription(emotion)}
        </p>
        
        {!playlist ? (
          <Button 
            onClick={handlePlay} 
            disabled={isLoading} 
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Écouter la playlist adaptée
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Current track display */}
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg ${getEmotionColor(emotion)} flex items-center justify-center`}>
                  <Music className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {playlist.tracks[currentTrackIndex]?.title || 'Piste en cours'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {playlist.name || 'Playlist personnalisée'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3">
                <Progress value={isPlaying ? 45 : 0} className="h-1" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1:23</span>
                  <span>3:45</span>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlayPause}
                className="h-12 w-12 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTrack}
                disabled={!playlist || currentTrackIndex >= playlist.tracks.length - 1}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Track list preview */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Playlist ({playlist.tracks.length} pistes)
              </p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {playlist.tracks.slice(0, 5).map((track, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${
                      idx === currentTrackIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-xs text-muted-foreground w-4">{idx + 1}</span>
                    <span className="truncate flex-1">{track.title}</span>
                    {idx === currentTrackIndex && isPlaying && (
                      <div className="flex gap-0.5">
                        <span className="w-0.5 h-3 bg-primary rounded animate-pulse" />
                        <span className="w-0.5 h-4 bg-primary rounded animate-pulse delay-75" />
                        <span className="w-0.5 h-2 bg-primary rounded animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicRecommendation;
