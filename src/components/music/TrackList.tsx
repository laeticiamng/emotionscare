// @ts-nocheck

import React from 'react';
import { MusicTrack } from '@/types/music';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { formatDuration } from '@/utils/musicCompatibility';

interface TrackListProps {
  tracks: MusicTrack[];
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  onTrackSelect?: (track: MusicTrack) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying = false,
  onTrackSelect
}) => {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Aucune piste disponible
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tracks.map((track, index) => {
        const isCurrent = currentTrack?.id === track.id;
        
        return (
          <div
            key={track.id}
            className={`flex items-center p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors ${
              isCurrent ? 'bg-accent' : ''
            }`}
            onClick={() => onTrackSelect?.(track)}
          >
            <div className="flex-shrink-0 mr-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackSelect?.(track);
                }}
              >
                {isCurrent && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${
                    isCurrent ? 'text-primary' : 'text-foreground'
                  }`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.artist}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground ml-2">
                  {formatDuration(track.duration)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
