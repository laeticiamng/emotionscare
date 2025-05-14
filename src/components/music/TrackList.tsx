
import React from 'react';
import { MusicTrack } from '@/types/music';
import { Play, Pause } from 'lucide-react';

export interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  onPlayPause: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  compact?: boolean;
  onPlay?: (track: MusicTrack) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onTrackSelect,
  onPlayPause,
  currentTrack,
  isPlaying,
  compact = false,
  onPlay
}) => {
  const handlePlay = (track: MusicTrack) => {
    if (onPlay) {
      onPlay(track);
    } else {
      onPlayPause(track);
    }
  };

  return (
    <div className={`space-y-1 ${compact ? 'text-sm' : ''}`}>
      {tracks.map((track) => {
        const isActive = currentTrack && currentTrack.id === track.id;
        
        return (
          <div
            key={track.id}
            className={`flex items-center p-2 rounded-md ${
              isActive ? 'bg-primary/10' : 'hover:bg-secondary/80'
            } cursor-pointer transition-colors`}
            onClick={() => onTrackSelect(track)}
          >
            <div className="mr-3">
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-primary text-white' : 'bg-muted hover:bg-primary/20'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(track);
                }}
              >
                {isActive && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {!compact && track.coverUrl && (
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-10 h-10 rounded object-cover mr-3"
              />
            )}
            
            <div className="flex-grow min-w-0">
              <p className={`font-medium truncate ${isActive ? 'text-primary' : ''}`}>
                {track.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {track.artist}
              </p>
            </div>
            
            {!compact && (
              <div className="text-xs text-muted-foreground ml-2">
                {formatDuration(track.duration)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper function to format duration in seconds to MM:SS
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default TrackList;
