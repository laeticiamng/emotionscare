
import React from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MusicTrack } from '@/types/music';

interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  onPlayPause?: () => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  showEmotionTag?: boolean;
  compact?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onTrackSelect,
  onPlayPause,
  currentTrack,
  isPlaying = false,
  showEmotionTag = false,
  compact = false,
}) => {
  return (
    <div className="space-y-2">
      {tracks.map((track) => {
        const isActive = currentTrack?.id === track.id;
        
        return (
          <div
            key={track.id}
            className={`flex items-center gap-3 p-2 rounded-md ${
              isActive ? 'bg-muted' : 'hover:bg-muted/50'
            } cursor-pointer transition-colors`}
            onClick={() => onTrackSelect(track)}
          >
            <div className="relative h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-primary/10">
              <img
                src={track.coverUrl || track.cover_url || '/images/music/default-cover.jpg'}
                alt={track.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/music/default-cover.jpg';
                }}
              />
              
              {isActive && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onPlayPause) onPlayPause();
                  }}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white" />
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{track.title}</p>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>
            
            {showEmotionTag && track.emotion && !compact && (
              <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                {track.emotion}
              </div>
            )}
            
            {!isActive && compact && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackSelect(track);
                }}
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
