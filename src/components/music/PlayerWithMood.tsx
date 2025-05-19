
import React, { useState, useEffect } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, ListMusic, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getTrackTitle, getTrackArtist, getTrackCover } from '@/utils/musicCompatibility';
import MusicVisualizer from './MusicVisualizer';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerWithMoodProps {
  className?: string;
  showPlaylist?: boolean;
  showVisualization?: boolean;
  compact?: boolean;
}

const PlayerWithMood: React.FC<PlayerWithMoodProps> = ({
  className,
  showPlaylist = true,
  showVisualization = true,
  compact = false
}) => {
  const { 
    currentTrack, 
    isPlaying, 
    currentPlaylist,
    togglePlay,
    previousTrack,
    nextTrack,
    toggleMute,
    muted,
    volume,
    setVolume,
    playTrack,
    currentTime = 0,
    duration = 0,
    seekTo
  } = useMusic();

  const [moodColor, setMoodColor] = useState<string>('bg-blue-500');
  const [moodName, setMoodName] = useState<string>('Calm');
  const [favorited, setFavorited] = useState<boolean>(false);

  useEffect(() => {
    if (currentTrack) {
      // Extract mood information from track
      const trackMood = currentTrack.mood || currentTrack.emotion || '';
      
      // Set mood colors based on track mood
      if (trackMood.toLowerCase().includes('calm') || trackMood.toLowerCase().includes('relax')) {
        setMoodColor('bg-blue-500');
        setMoodName('Calm');
      } else if (trackMood.toLowerCase().includes('energetic') || trackMood.toLowerCase().includes('happy')) {
        setMoodColor('bg-yellow-500');
        setMoodName('Energetic');
      } else if (trackMood.toLowerCase().includes('focus') || trackMood.toLowerCase().includes('concentrate')) {
        setMoodColor('bg-purple-500');
        setMoodName('Focused');
      } else if (trackMood.toLowerCase().includes('sad') || trackMood.toLowerCase().includes('melancholic')) {
        setMoodColor('bg-indigo-500');
        setMoodName('Reflective');
      } else {
        setMoodColor('bg-green-500');
        setMoodName('Neutral');
      }
      
      // Reset favorited state for new track
      setFavorited(false);
    }
  }, [currentTrack]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (values: number[]) => {
    if (seekTo) {
      seekTo(values[0]);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    if (setVolume) {
      setVolume(values[0] / 100);
    }
  };

  const toggleFavorite = () => {
    setFavorited(!favorited);
  };

  if (!currentTrack) {
    return (
      <Card className={className}>
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
          <Music className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune musique en lecture</p>
          <Button className="mt-4" variant="outline">
            Explorez la bibliothèque
          </Button>
        </CardContent>
      </Card>
    );
  }

  const coverUrl = getTrackCover(currentTrack);
  const title = getTrackTitle(currentTrack);
  const artist = getTrackArtist(currentTrack);

  return (
    <Card className={`overflow-hidden ${className}`}>
      {!compact && (
        <div className={`${moodColor} h-2`} />
      )}
      
      <CardContent className={`p-4 ${compact ? 'py-3' : 'p-6'}`}>
        <div className={`flex ${compact ? 'gap-3' : 'gap-6'} ${compact ? 'flex-row' : 'flex-col md:flex-row'}`}>
          {/* Cover image */}
          <div className={`${compact ? 'w-16 h-16' : 'w-32 h-32 md:w-48 md:h-48'} rounded-lg overflow-hidden flex-shrink-0 relative`}>
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-muted flex items-center justify-center`}>
                <Music className={`${compact ? 'h-8 w-8' : 'h-12 w-12'} text-muted-foreground`} />
              </div>
            )}
            
            {!compact && (
              <div className="absolute bottom-2 left-2">
                <Badge 
                  className={`${moodColor} text-white border-none`}
                >
                  {moodName}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Player controls */}
          <div className="flex-1 flex flex-col">
            <div className={`${compact ? 'mb-1' : 'mb-3'}`}>
              <h3 className={`font-medium ${compact ? 'text-base' : 'text-xl'} truncate`}>
                {title}
              </h3>
              <p className={`text-muted-foreground ${compact ? 'text-sm' : 'text-base'} truncate`}>
                {artist}
              </p>
            </div>
            
            {!compact && showVisualization && (
              <div className="h-12 mb-4">
                <MusicVisualizer 
                  barCount={24}
                  height={48}
                  animated={isPlaying}
                />
              </div>
            )}
            
            {/* Progress slider */}
            <div className="space-y-1 mb-3">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full ${compact ? 'h-8 w-8' : 'h-9 w-9'}`}
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-4 w-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full ${compact ? 'h-8 w-8' : 'h-9 w-9'}`}
                    onClick={toggleMute}
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  
                  {!compact && (
                    <Slider
                      value={[muted ? 0 : volume * 100]}
                      max={100}
                      step={1}
                      className="w-20"
                      onValueChange={handleVolumeChange}
                    />
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full ${compact ? 'h-8 w-8' : 'h-9 w-9'}`}
                  onClick={previousTrack}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  className={`rounded-full ${compact ? 'h-8 w-8' : 'h-10 w-10'}`}
                  onClick={togglePlay}
                >
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Pause className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Play className="h-4 w-4 ml-0.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full ${compact ? 'h-8 w-8' : 'h-9 w-9'}`}
                  onClick={nextTrack}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Playlist section */}
        {showPlaylist && !compact && currentPlaylist && currentPlaylist.tracks.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium flex items-center">
                <ListMusic className="h-4 w-4 mr-1" /> Playlist
              </h4>
              <Badge variant="outline">{currentPlaylist.tracks.length} morceaux</Badge>
            </div>
            
            <div className="space-y-1 max-h-36 overflow-y-auto pr-2">
              {currentPlaylist.tracks.slice(0, 4).map((track) => (
                <div 
                  key={track.id}
                  className={`flex items-center p-1.5 rounded-md text-sm ${
                    currentTrack.id === track.id ? 'bg-muted' : 'hover:bg-muted/50'
                  } cursor-pointer transition-colors`}
                  onClick={() => playTrack && playTrack(track)}
                >
                  <div className="h-8 w-8 rounded bg-muted/50 mr-2 flex-shrink-0 overflow-hidden">
                    {getTrackCover(track) ? (
                      <img 
                        src={getTrackCover(track)} 
                        alt={getTrackTitle(track)} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`truncate ${currentTrack.id === track.id ? 'font-medium' : ''}`}>
                      {getTrackTitle(track)}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {track.duration ? formatTime(track.duration) : '0:00'}
                  </div>
                </div>
              ))}
              
              {currentPlaylist.tracks.length > 4 && (
                <Button variant="ghost" className="w-full text-xs h-8" size="sm">
                  + {currentPlaylist.tracks.length - 4} autres morceaux
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerWithMood;
