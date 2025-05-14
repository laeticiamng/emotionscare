
import React from 'react';
import { MusicTrack } from '@/types/music';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/utils/formatters';

export interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  showEmotionTag?: boolean;
  compact?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onTrackSelect,
  currentTrack,
  isPlaying,
  onPlayPause,
  showEmotionTag = false,
  compact = false
}) => {
  const getEmotionTagColor = (emotion: string): string => {
    const emotionColors: Record<string, string> = {
      calm: 'bg-blue-100 text-blue-800',
      happy: 'bg-yellow-100 text-yellow-800',
      joy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-indigo-100 text-indigo-800',
      sadness: 'bg-indigo-100 text-indigo-800',
      angry: 'bg-red-100 text-red-800',
      anger: 'bg-red-100 text-red-800',
      fear: 'bg-purple-100 text-purple-800',
      neutral: 'bg-gray-100 text-gray-800'
    };

    return emotionColors[emotion?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-2">
      {tracks.map((track) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        
        return (
          <div
            key={track.id}
            className={`flex items-center p-2 rounded-md ${
              isCurrentTrack
                ? 'bg-primary/10 dark:bg-primary/20'
                : 'hover:bg-muted/50'
            }`}
          >
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded overflow-hidden bg-muted">
                {(track.coverUrl || track.cover_url || track.cover) ? (
                  <img
                    src={track.coverUrl || track.cover_url || track.cover}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl">♪</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0 mr-2">
              <p className={`font-medium truncate ${compact ? 'text-sm' : ''}`}>
                {track.title}
              </p>
              <p className={`text-muted-foreground truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                {track.artist}
              </p>
            </div>
            {showEmotionTag && track.emotion && (
              <div className={`hidden sm:block mr-2`}>
                <span
                  className={`inline-flex text-xs px-2 py-0.5 rounded ${getEmotionTagColor(
                    track.emotion
                  )}`}
                >
                  {track.emotion}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              {track.duration && !compact && (
                <span className="text-xs text-muted-foreground hidden sm:inline-block">
                  {formatDuration(track.duration)}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (isCurrentTrack) {
                    onPlayPause();
                  } else {
                    onTrackSelect(track);
                  }
                }}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        );
      })}
      {tracks.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          Aucun morceau disponible
        </div>
      )}
    </div>
  );
};

export default TrackList;
