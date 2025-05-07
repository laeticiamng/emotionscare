
import React from 'react';
import { Music2 } from 'lucide-react';
import { Track } from '@/services/music/types';

interface TrackInfoProps {
  currentTrack: Track;
  loadingTrack: boolean;
  audioError: string | null;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ 
  currentTrack, 
  loadingTrack, 
  audioError 
}) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
        {currentTrack.cover ? (
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="h-full w-full object-cover" 
            onError={(e) => {
              // Fallback in case of image loading error
              e.currentTarget.src = '';
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.classList.add('bg-primary/10');
              const icon = document.createElement('div');
              icon.className = 'h-full w-full flex items-center justify-center';
              icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary/70"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
              e.currentTarget.parentElement!.appendChild(icon);
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-primary/10">
            <Music2 className="h-8 w-8 text-primary/70" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium leading-none truncate">{currentTrack.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 truncate">{currentTrack.artist}</p>
        
        {loadingTrack && (
          <p className="text-xs text-muted mt-1">Chargement en cours...</p>
        )}
        
        {audioError && (
          <p className="text-xs text-destructive mt-1">{audioError}</p>
        )}
      </div>
    </div>
  );
};

export default TrackInfo;
