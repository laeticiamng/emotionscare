
import React from 'react';
import { MusicTrack } from '@/types/music';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface TrackListProps {
  tracks: MusicTrack[];
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  onTrackSelect?: (track: MusicTrack) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackSelect
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-2">
      {tracks.map((track) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        
        return (
          <div 
            key={track.id}
            className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer ${
              isCurrentTrack ? 'bg-muted' : ''
            }`}
            onClick={() => onTrackSelect?.(track)}
          >
            <div className="flex items-center space-x-3">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackSelect?.(track);
                }}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <div>
                <div className="font-medium">{track.title}</div>
                {track.artist && (
                  <div className="text-sm text-muted-foreground">{track.artist}</div>
                )}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {formatDuration(track.duration)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
