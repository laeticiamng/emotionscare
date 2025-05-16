
import React from 'react';
import { MusicTrack, MusicPlaylist, MusicLibraryProps } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MusicLibrary: React.FC<MusicLibraryProps> = ({ 
  playlists = [], 
  onSelectTrack, 
  onSelectPlaylist
}) => {
  const [activeTab, setActiveTab] = React.useState('playlists');
  
  // Sample data for demonstration
  const samplePlaylists = [
    {
      id: '1',
      name: 'Calme et concentration',
      description: 'Mélodies douces pour se concentrer',
      coverUrl: '',
      tracks: [
        { id: '1-1', title: 'Méditation matinale', artist: 'IA Composer', duration: 180, cover_url: '' },
        { id: '1-2', title: 'Focus profond', artist: 'IA Composer', duration: 240, cover_url: '' }
      ]
    },
    {
      id: '2',
      name: 'Énergie et motivation',
      description: 'Rythmes dynamiques pour booster l\'énergie',
      coverUrl: '',
      tracks: [
        { id: '2-1', title: 'Éveil créatif', artist: 'IA Composer', duration: 190, cover_url: '' },
        { id: '2-2', title: 'Inspiration', artist: 'IA Composer', duration: 210, cover_url: '' }
      ]
    },
    {
      id: '3',
      name: 'Détente et relaxation',
      description: 'Sons apaisants pour se relaxer',
      coverUrl: '',
      tracks: [
        { id: '3-1', title: 'Vagues océaniques', artist: 'IA Composer', duration: 300, cover_url: '' },
        { id: '3-2', title: 'Forêt brumeuse', artist: 'IA Composer', duration: 280, cover_url: '' }
      ]
    },
    {
      id: '4',
      name: 'Sommeil profond',
      description: 'Berceuses et ambiances nocturnes',
      coverUrl: '',
      tracks: [
        { id: '4-1', title: 'Nuit étoilée', artist: 'IA Composer', duration: 450, cover_url: '' },
        { id: '4-2', title: 'Rêverie', artist: 'IA Composer', duration: 420, cover_url: '' }
      ]
    }
  ];

  const recentTracks = [
    {
      id: '5-1',
      title: 'Méditation matinale',
      artist: 'IA Composer',
      duration: 180,
      cover_url: '',
      track_url: ''
    },
    {
      id: '5-2',
      title: 'Focus profond',
      artist: 'IA Composer',
      duration: 240,
      cover_url: '',
      track_url: ''
    }
  ];

  // Use provided playlists or fallback to sample data
  const displayPlaylists = playlists.length > 0 ? playlists : samplePlaylists;

  const handlePlaylistSelect = (playlist: MusicPlaylist) => {
    if (onSelectPlaylist) {
      onSelectPlaylist(playlist);
    }
  };

  const handleTrackSelect = (track: MusicTrack) => {
    if (onSelectTrack) {
      onSelectTrack(track);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="playlists" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="tracks">Morceaux récents</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
        </TabsList>
        
        <TabsContent value="playlists" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayPlaylists.map((playlist) => (
              <Card 
                key={playlist.id} 
                className="overflow-hidden cursor-pointer hover:ring-1 hover:ring-primary transition-all"
                onClick={() => handlePlaylistSelect(playlist)}
              >
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
                  {/* Placeholder for playlist cover */}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium truncate">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{playlist.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {playlist.tracks.length} morceaux
                    </span>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="tracks" className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {recentTracks.map((track) => (
              <Card 
                key={track.id}
                className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleTrackSelect(track)}
              >
                <CardContent className="p-3 flex items-center">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-md mr-3">
                    {/* Track cover */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{track.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-3">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </span>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-muted-foreground">Aucun favori pour le moment</p>
            <Button variant="outline" className="mt-4">
              Explorer la bibliothèque
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicLibrary;
