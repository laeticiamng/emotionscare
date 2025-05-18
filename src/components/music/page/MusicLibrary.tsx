
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MusicLibraryProps, MusicPlaylist, MusicTrack } from '@/types/music';
import { Music, PlayCircle, Search, Heart, Clock, List } from 'lucide-react';

const MusicLibrary: React.FC<MusicLibraryProps> = ({ playlists, onSelectPlaylist }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter playlists based on search query
  const filteredPlaylists = playlists.filter(playlist => {
    const titleMatch = (playlist.name || playlist.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descriptionMatch = (playlist.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const tagsMatch = playlist.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return titleMatch || descriptionMatch || tagsMatch;
  });
  
  // Filter playlists based on active tab
  const getFilteredPlaylistsByTab = () => {
    switch (activeTab) {
      case 'mood':
        return filteredPlaylists.filter(playlist => playlist.mood);
      case 'favorites':
        return filteredPlaylists.filter(playlist => playlist.tags?.includes('favorite'));
      case 'recent':
        return [...filteredPlaylists].sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }).slice(0, 5);
      default:
        return filteredPlaylists;
    }
  };
  
  const playlistsToShow = getFilteredPlaylistsByTab();
  
  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher une playlist..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>+ Nouvelle playlist</Button>
      </div>
      
      {/* Tab filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            <List className="h-4 w-4 mr-2 hidden sm:block" />
            Tout
          </TabsTrigger>
          <TabsTrigger value="mood" className="text-xs sm:text-sm">
            <Music className="h-4 w-4 mr-2 hidden sm:block" />
            Par mood
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs sm:text-sm">
            <Heart className="h-4 w-4 mr-2 hidden sm:block" />
            Favoris
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-xs sm:text-sm">
            <Clock className="h-4 w-4 mr-2 hidden sm:block" />
            Récents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {playlistsToShow.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Music className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Aucune playlist trouvée pour votre recherche
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlistsToShow.map((playlist) => (
                <Card 
                  key={playlist.id}
                  className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                  onClick={() => onSelectPlaylist(playlist)}
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {playlist.cover ? (
                      <img 
                        src={playlist.cover}
                        alt={playlist.title || playlist.name || "Playlist cover"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="h-12 w-12 text-muted-foreground opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="icon" className="rounded-full h-12 w-12">
                        <PlayCircle className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold truncate">
                      {playlist.name || playlist.title || `Playlist ${playlist.id}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.tracks.length} morceaux
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicLibrary;
