
import React from 'react';
import { MusicTrack } from '@/types/music';
import { Music } from 'lucide-react';

interface TrackInfoProps {
  track?: MusicTrack | null;
  showEmotion?: boolean;
  className?: string;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ 
  track, 
  showEmotion = false,
  className = "" 
}) => {
  if (!track) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
          <Music className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Aucune musique sélectionnée</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center overflow-hidden">
        {track.coverUrl ? (
          <img 
            src={track.coverUrl} 
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Music className="h-6 w-6 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{track.title}</p>
        {track.artist && (
          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
        )}
        {showEmotion && track.emotion && (
          <p className="text-xs text-primary capitalize">
            {track.emotion}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackInfo;
