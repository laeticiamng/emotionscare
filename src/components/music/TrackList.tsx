
import React from 'react';
import { MusicTrack } from '@/types';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  onPlayPause: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  compact?: boolean;
  showEmotionTag?: boolean;
  onPlay?: (track: MusicTrack) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onTrackSelect,
  onPlayPause,
  currentTrack,
  isPlaying = false,
  compact = false,
  showEmotionTag = false
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCurrentTrack = (track: MusicTrack) => {
    return currentTrack?.id === track.id;
  };

  return (
    <div className="space-y-2">
      {tracks.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No tracks available
        </div>
      ) : (
        tracks.map((track) => (
          <div
            key={track.id}
            className={`flex items-center gap-3 p-2 rounded-md ${
              isCurrentTrack(track) ? 'bg-secondary/40' : 'hover:bg-muted/50'
            } cursor-pointer transition-colors`}
            onClick={() => onTrackSelect(track)}
          >
            {/* Track cover/icon */}
            <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded overflow-hidden">
              {track.coverUrl || track.cover ? (
                <img
                  src={track.coverUrl || track.cover}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Track info */}
            <div className="flex-grow min-w-0">
              <div className="font-medium text-sm truncate">{track.title}</div>
              <div className="text-xs text-muted-foreground truncate flex items-center gap-2">
                <span>{track.artist}</span>
                {showEmotionTag && track.emotion && (
                  <Badge variant="outline" className="px-1.5 py-0 h-4 text-[10px]">
                    {track.emotion}
                  </Badge>
                )}
              </div>
            </div>

            {/* Duration & Play button */}
            <div className="flex items-center gap-3">
              {!compact && (
                <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                  {formatTime(track.duration)}
                </span>
              )}

              <Button
                size="sm"
                variant={isCurrentTrack(track) ? "secondary" : "ghost"}
                className="h-8 w-8 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayPause(track);
                }}
              >
                {isCurrentTrack(track) && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TrackList;
