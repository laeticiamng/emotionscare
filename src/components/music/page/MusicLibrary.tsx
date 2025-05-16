
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMusic } from '@/contexts/music/MusicContextProvider';
import { MusicTrack, MusicPlaylist, MusicLibraryProps } from '@/types/music';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlayCircle, Heart, Search, Plus } from 'lucide-react';

const MusicLibrary: React.FC<MusicLibraryProps> = ({
  onTrackSelect,
  currentTrack,
  playlists = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { playlists: contextPlaylists } = useMusic();
  
  // Use playlists from props or context
  const libraryPlaylists = playlists.length > 0 ? playlists : (contextPlaylists || []);
  
  // Get all tracks from all playlists
  const allTracks = libraryPlaylists.flatMap(playlist => playlist.tracks);
  
  // Filter tracks based on search term
  const filteredTracks = allTracks.filter(track => 
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (track.artist && track.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Group tracks by mood/emotion
  const tracksByMood = filteredTracks.reduce((acc, track) => {
    const mood = track.mood || track.emotion || 'unknown';
    if (!acc[mood]) {
      acc[mood] = [];
    }
    acc[mood].push(track);
    return acc;
  }, {} as Record<string, MusicTrack[]>);
  
  const handleTrackSelect = (track: MusicTrack) => {
    if (onTrackSelect) {
      onTrackSelect(track);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une musique..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="moods">Par ambiance</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredTracks.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {filteredTracks.map((track) => (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors cursor-pointer ${
                    currentTrack?.id === track.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleTrackSelect(track)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mr-3 overflow-hidden">
                      {track.coverUrl || track.cover_url ? (
                        <img src={track.coverUrl || track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                      ) : (
                        <PlayCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{track.title}</p>
                      <p className="text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune musique trouvée</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="moods">
          {Object.keys(tracksByMood).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(tracksByMood).map(([mood, tracks]) => (
                <Card key={mood}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg capitalize">{mood}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {tracks.slice(0, 3).map((track) => (
                        <div
                          key={track.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                          onClick={() => handleTrackSelect(track)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center mr-2 overflow-hidden">
                              {track.coverUrl || track.cover_url ? (
                                <img src={track.coverUrl || track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                              ) : (
                                <PlayCircle className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{track.title}</p>
                              <p className="text-xs text-muted-foreground">{track.artist}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {tracks.length > 3 && (
                        <Button variant="ghost" className="w-full mt-2 text-sm">
                          Voir {tracks.length - 3} de plus
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune ambiance trouvée</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="playlists">
          {libraryPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {libraryPlaylists.map((playlist) => (
                <Card key={playlist.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-primary/50" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{playlist.title || playlist.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.tracks.length} titres
                    </p>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="overflow-hidden border-dashed">
                <div className="aspect-square bg-muted/50 flex items-center justify-center">
                  <Button variant="ghost" size="lg" className="rounded-full h-16 w-16">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </Button>
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium">Créer une playlist</h3>
                  <p className="text-sm text-muted-foreground">
                    Personnalisez votre expérience
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune playlist trouvée</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicLibrary;
