
import React from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { Card, CardContent } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface PlayerTabProps {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
}

const PlayerTab: React.FC<PlayerTabProps> = ({ currentTrack, playlist }) => {
  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Music className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-xl font-medium">Aucune musique en cours</h3>
        <p className="text-muted-foreground">Sélectionnez une piste dans la bibliothèque pour commencer</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {currentTrack.coverUrl ? (
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title}
                className="w-full h-full object-cover" 
              />
            ) : (
              <Music className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
            {playlist && (
              <p className="text-xs text-muted-foreground mt-1">
                Playlist: {playlist.name || playlist.title}
              </p>
            )}
          </div>
        </div>
        
        {/* Player controls would go here */}
        <div className="mt-6">
          <div className="h-1 w-full bg-muted rounded-full">
            <div className="h-1 w-1/3 bg-primary rounded-full" />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1:15</span>
            <span>3:45</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerTab;
