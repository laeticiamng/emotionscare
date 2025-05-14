
import React from 'react';
import { MusicTrack } from '@/types/music';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  compact?: boolean;
  showEmotionTag?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onTrackSelect,
  currentTrack,
  isPlaying,
  onPlayPause,
  compact = false,
  showEmotionTag = false
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-${compact ? '2' : '3'}`}>
      {tracks.map(track => {
        const isCurrentTrack = currentTrack?.id === track.id;
        
        return (
          <div
            key={track.id}
            className={`flex items-center ${compact ? 'gap-2' : 'gap-3'} p-2 rounded-md ${
              isCurrentTrack ? 'bg-primary/10' : 'hover:bg-muted'
            } transition-colors`}
          >
            <Avatar className={compact ? 'h-8 w-8' : 'h-12 w-12'}>
              <AvatarImage src={track.coverUrl} alt={track.title} />
              <AvatarFallback>
                {track.title.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{track.title}</div>
              <div className="text-xs text-muted-foreground">{track.artist}</div>
              
              {showEmotionTag && track.emotion && (
                <span className="inline-block px-1.5 py-0.5 mt-1 text-[10px] rounded-full bg-primary/10 text-primary">
                  {track.emotion}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {!compact && <span className="text-xs text-muted-foreground">{formatTime(track.duration)}</span>}
              
              <Button
                size="icon"
                variant={compact ? "ghost" : "secondary"}
                className={`h-8 w-8 ${compact ? 'h-6 w-6' : ''}`}
                onClick={() => {
                  if (isCurrentTrack) {
                    onPlayPause();
                  } else {
                    onTrackSelect(track);
                  }
                }}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className={compact ? "h-3 w-3" : "h-4 w-4"} />
                ) : (
                  <Play className={compact ? "h-3 w-3" : "h-4 w-4"} />
                )}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
