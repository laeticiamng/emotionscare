
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { MusicPlaylist, MusicTrack } from '@/types';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectTrack: (track: MusicTrack) => void;
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
  currentTrack?: MusicTrack | null;
  isLoading?: boolean;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({
  playlists,
  onSelectTrack,
  onSelectPlaylist,
  currentTrack,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter playlists by category
  const emotionalPlaylists = playlists.filter(playlist => 
    playlist.emotion || playlist.category === 'emotional'
  );
  
  const focusPlaylists = playlists.filter(playlist => 
    playlist.category === 'focus'
  );
  
  const relaxationPlaylists = playlists.filter(playlist => 
    playlist.category === 'relaxation'
  );

  // Filter tracks by search query
  const filteredTracks = searchQuery 
    ? playlists.flatMap(playlist => playlist.tracks)
        .filter(track =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  // Get cover URL - handle different property names
  const getCoverUrl = (track: MusicTrack) => {
    return track.coverUrl || track.cover || track.cover_url || '/images/music-placeholder.jpg';
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une musique..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Résultats de recherche</h2>
          
          {filteredTracks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredTracks.map(track => (
                <div 
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className={`cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent/10 ${
                    currentTrack?.id === track.id ? 'bg-accent/5 ring-1 ring-accent' : ''
                  }`}
                >
                  <div className="aspect-square rounded-md overflow-hidden bg-muted mb-2">
                    <img
                      src={getCoverUrl(track)}
                      alt={track.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/music-placeholder.jpg';
                      }}
                    />
                  </div>
                  <h3 className="font-medium truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun résultat pour votre recherche</p>
          )}
        </div>
      )}

      {!searchQuery && (
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 h-auto">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="emotion">Émotions</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
            <TabsTrigger value="relax">Détente</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map(playlist => (
                <Button
                  key={playlist.id}
                  variant="outline"
                  className="flex justify-between h-auto p-4"
                  onClick={() => onSelectPlaylist(playlist)}
                >
                  <div className="text-left">
                    <h3 className="font-medium">{playlist.name || playlist.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.tracks.length} morceaux
                    </p>
                  </div>
                  {playlist.emotion && (
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {playlist.emotion}
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="emotion" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {emotionalPlaylists.map(playlist => (
                <Button
                  key={playlist.id}
                  variant="outline"
                  className="flex justify-between h-auto p-4"
                  onClick={() => onSelectPlaylist(playlist)}
                >
                  <div className="text-left">
                    <h3 className="font-medium">{playlist.name || playlist.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.tracks.length} morceaux
                    </p>
                  </div>
                  {playlist.emotion && (
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {playlist.emotion}
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="focus" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {focusPlaylists.map(playlist => (
                <Button
                  key={playlist.id}
                  variant="outline"
                  className="flex justify-between h-auto p-4"
                  onClick={() => onSelectPlaylist(playlist)}
                >
                  <div className="text-left">
                    <h3 className="font-medium">{playlist.name || playlist.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.tracks.length} morceaux
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded text-xs">
                    Focus
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="relax" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relaxationPlaylists.map(playlist => (
                <Button
                  key={playlist.id}
                  variant="outline"
                  className="flex justify-between h-auto p-4"
                  onClick={() => onSelectPlaylist(playlist)}
                >
                  <div className="text-left">
                    <h3 className="font-medium">{playlist.name || playlist.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.tracks.length} morceaux
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded text-xs">
                    Détente
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MusicLibrary;
