
import React, { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Music } from 'lucide-react';

const MusicLibrary: React.FC = () => {
  const { playlists, loadPlaylistById } = useMusic();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    if (playlists.length > 0 && !selectedPlaylistId) {
      setSelectedPlaylistId(playlists[0].id);
    }
  }, [playlists, selectedPlaylistId]);

  const loadPlaylist = async (id: string) => {
    setIsLoading(true);
    try {
      await loadPlaylistById(id);
      setSelectedPlaylistId(id);
    } catch (error) {
      console.error('Erreur lors du chargement de la playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Bibliothèque musicale</h3>
      
      {playlists.length === 0 ? (
        <div className="text-center py-8">
          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p>Aucune playlist disponible</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map(playlist => (
            <Card 
              key={playlist.id} 
              className={`cursor-pointer transition-all ${
                selectedPlaylistId === playlist.id 
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => loadPlaylist(playlist.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 bg-muted flex items-center justify-center rounded">
                    {playlist.coverUrl ? (
                      <img 
                        src={playlist.coverUrl} 
                        alt={playlist.title} 
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <Music className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{playlist.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {playlist.tracks.length} pistes
                    </p>
                    {playlist.emotion && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        {playlist.emotion}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {isLoading && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MusicLibrary;
