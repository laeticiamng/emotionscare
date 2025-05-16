
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { MusicTrack } from '@/types/music';

interface VRMusicTrackInfoProps {
  currentTrack: MusicTrack;
}

const VRMusicTrackInfo: React.FC<VRMusicTrackInfoProps> = ({ currentTrack }) => {
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get cover URL with fallback
  const getCoverUrl = () => {
    return currentTrack.coverUrl || currentTrack.cover_url || currentTrack.cover || '';
  };

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
      <div className="w-12 h-12 rounded overflow-hidden bg-primary/10">
        {getCoverUrl() ? (
          <img 
            src={getCoverUrl()} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl">♪</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <h4 className="font-medium text-sm truncate">{currentTrack.title}</h4>
          {currentTrack.url && (
            <a 
              href={currentTrack.url} 
              className="ml-2 text-muted-foreground" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <p className="text-xs text-muted-foreground flex items-center justify-between">
          <span>{currentTrack.artist || 'Unknown Artist'}</span>
          {currentTrack.duration && <span>{formatDuration(currentTrack.duration)}</span>}
        </p>
      </div>
    </div>
  );
};

export default VRMusicTrackInfo;
