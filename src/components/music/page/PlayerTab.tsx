
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';
import { useMusic } from '@/contexts/music';
import { MusicTrack } from '@/types/music';
import { ProgressBar } from '../player/ProgressBar';

interface PlayerTabProps {
  className?: string;
}

const TrackItem: React.FC<{ 
  track: MusicTrack;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ track, isActive, onClick }) => (
  <div 
    className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
      isActive ? 'bg-primary/10' : 'hover:bg-muted'
    }`}
    onClick={onClick}
  >
    <div className="flex-shrink-0 mr-3">
      {track.cover ? (
        <img 
          src={track.cover} 
          alt={track.name || track.title || "Album art"} 
          className="w-10 h-10 rounded object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">No img</span>
        </div>
      )}
    </div>
    <div className="min-w-0 flex-1">
      <h4 className={`text-sm font-medium truncate ${isActive ? 'text-primary' : ''}`}>
        {track.name || track.title || "Unknown track"}
      </h4>
      <p className="text-xs text-muted-foreground truncate">
        {track.artist || "Unknown artist"}
      </p>
    </div>
  </div>
);

const PlayerTab: React.FC<PlayerTabProps> = ({ className }) => {
  const { 
    isPlaying, 
    currentTrack, 
    playlist, 
    togglePlay,
    nextTrack,
    previousTrack, 
    setCurrentTrack,
    currentTime,
    duration,
    seekTo
  } = useMusic();
  
  return (
    <div className={className}>
      {/* Now playing section with large album art */}
      <Card className="mb-6 overflow-hidden">
        <div className="aspect-square bg-muted">
          {currentTrack?.cover ? (
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.name || currentTrack.title || "Album art"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No album art
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <h3 className="font-bold text-xl mb-1">
            {currentTrack?.name || currentTrack?.title || "No track selected"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {currentTrack?.artist || "Unknown artist"}
          </p>
          
          <ProgressBar 
            currentTime={currentTime} 
            duration={duration} 
            onSeek={seekTo} 
          />
          
          {/* Player controls */}
          <div className="flex items-center justify-between mt-4">
            <Button variant="ghost" size="icon" disabled>
              <Shuffle className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={previousTrack}>
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </Button>
              
              <Button variant="outline" size="icon" onClick={nextTrack}>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" disabled>
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Playlist section */}
      {playlist && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center">
            {playlist.title || playlist.name || "Current Playlist"}
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              ({playlist.tracks.length} tracks)
            </span>
          </h3>
          
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {playlist.tracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                isActive={currentTrack?.id === track.id}
                onClick={() => setCurrentTrack(track)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerTab;
