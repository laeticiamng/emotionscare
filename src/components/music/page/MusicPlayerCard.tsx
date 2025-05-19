
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MusicTrack } from '@/types/music';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { getTrackTitle, getTrackCover, getTrackArtist, getTrackUrl } from '@/utils/musicCompatibility';

interface MusicPlayerCardProps {
  tracks: MusicTrack[];
}

const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({ 
  tracks = [] // Provide default empty array
}) => {
  // State for the current track
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(
    tracks.length > 0 ? tracks[0] : null
  );
  
  // Basic player controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  // Handle play/pause
  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  // Handle track change
  const handleNextTrack = () => {
    if (!currentTrack || tracks.length <= 1) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  };
  
  const handlePreviousTrack = () => {
    if (!currentTrack || tracks.length <= 1) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={20} />;
    if (volume < 0.3) return <Volume size={20} />;
    if (volume < 0.7) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };
  
  // Return a simple message if no tracks
  if (!currentTrack) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No tracks available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        {currentTrack && (
          <div className="space-y-4">
            {/* Track info */}
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                {getTrackCover(currentTrack) ? (
                  <img 
                    src={getTrackCover(currentTrack)} 
                    alt={getTrackTitle(currentTrack)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    ♪
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{getTrackTitle(currentTrack)}</h3>
                <p className="text-sm text-muted-foreground">{getTrackArtist(currentTrack)}</p>
              </div>
            </div>
            
            {/* Audio element */}
            <audio
              src={getTrackUrl(currentTrack)}
              autoPlay={isPlaying}
              loop={false}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleNextTrack}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
              muted={isMuted}
              volume={volume}
            />
            
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={(values) => handleSeek(values[0])}
              />
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleToggleMute}
                >
                  <VolumeIcon />
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={(values) => handleVolumeChange(values[0])}
                  className="w-24"
                />
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handlePreviousTrack}
                >
                  <SkipBack />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={handleTogglePlay}
                >
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleNextTrack}
                >
                  <SkipForward />
                </Button>
              </div>
              
              <div className="w-[72px]"></div> {/* Spacer for balance */}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicPlayerCard;
