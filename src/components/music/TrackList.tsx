
import React from 'react';
import { MusicTrack } from '@/types';

export interface TrackListProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack;
  onSelect: (track: MusicTrack) => void;
  onSelectTrack?: (track: MusicTrack) => void; // For backward compatibility
}

const TrackList = ({ tracks, currentTrack, onSelect, onSelectTrack }: TrackListProps) => {
  const handleSelectTrack = (track: MusicTrack) => {
    if (onSelectTrack) {
      onSelectTrack(track);
    } else {
      onSelect(track);
    }
  };

  return (
    <div className="space-y-1 max-h-[300px] overflow-y-auto">
      {tracks.map((track) => (
        <div
          key={track.id}
          className={`flex items-center p-2 rounded-md cursor-pointer ${
            currentTrack?.id === track.id ? 'bg-secondary' : 'hover:bg-secondary/30'
          }`}
          onClick={() => handleSelectTrack(track)}
        >
          <div className="h-10 w-10 rounded bg-primary/10 mr-3 overflow-hidden">
            {track.coverUrl ? (
              <img
                src={track.coverUrl || track.cover}
                alt={track.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                ♪
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{track.title}</p>
            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
