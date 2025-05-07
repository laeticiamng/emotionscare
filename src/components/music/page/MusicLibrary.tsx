
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

const MusicLibrary: React.FC = () => {
  const { playlists, loadPlaylistById } = useMusic();
  const { toast } = useToast();
  
  const handlePlayPlaylist = (id: string) => {
    loadPlaylistById(id);
    toast({
      title: "Playlist chargée",
      description: "Lecture de la playlist démarrée",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary/20 flex items-center justify-center">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-medium">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground">{playlist.tracks.length} morceaux</p>
                </div>
                <div className="pr-4">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="rounded-full h-10 w-10 p-0" 
                    onClick={() => handlePlayPlaylist(playlist.id)}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MusicLibrary;
