
import React from 'react';
import { MusicTrack } from '@/types/music';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, ChevronRight } from 'lucide-react';

interface TrackListProps {
  tracks: MusicTrack[];
  currentTrack?: MusicTrack | null;
  isPlaying: boolean;
  onTrackSelect: (track: MusicTrack) => void;
  onPlayPause: () => void;
  emptyMessage?: string;
  showEmotionTag?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onPlayPause,
  emptyMessage = "Aucune piste disponible",
  showEmotionTag = false
}) => {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tracks.map((track) => {
        const isActive = currentTrack?.id === track.id;
        
        return (
          <div 
            key={track.id}
            className={`flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors ${
              isActive ? 'bg-muted' : ''
            }`}
          >
            <div className="flex-shrink-0 mr-3">
              {isActive ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={onPlayPause}
                >
                  {isPlaying ? (
                    <PauseCircle className="h-8 w-8 text-primary" />
                  ) : (
                    <PlayCircle className="h-8 w-8 text-primary" />
                  )}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100"
                  onClick={() => onTrackSelect(track)}
                >
                  <PlayCircle className="h-8 w-8" />
                </Button>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <div 
                className="cursor-pointer"
                onClick={() => onTrackSelect(track)}
              >
                <div className="font-medium truncate">{track.title}</div>
                <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
              </div>
            </div>
            
            {showEmotionTag && track.emotion && (
              <div className="ml-2">
                <span className="px-2 py-1 text-xs rounded-full bg-muted">
                  {track.emotion}
                </span>
              </div>
            )}
            
            <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
