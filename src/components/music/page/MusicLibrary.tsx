
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LibraryTab from './LibraryTab';
import { MusicLibraryProps, MusicPlaylist, MusicTrack } from '@/types';

// Default playlists for demo
const defaultPlaylists: MusicPlaylist[] = [
  {
    id: 'calm',
    name: 'Calme et relaxation',
    title: 'Calme et relaxation',
    description: 'Musiques apaisantes pour la relaxation et la méditation',
    tracks: [],
    category: 'relaxation',
  },
  {
    id: 'energy',
    name: 'Énergie et motivation',
    title: 'Énergie et motivation',
    description: 'Boost d\'énergie pour commencer la journée',
    tracks: [],
    category: 'energie',
  },
  {
    id: 'focus',
    name: 'Concentration',
    title: 'Concentration',
    description: 'Améliorer votre focus et productivité',
    tracks: [],
    category: 'travail',
  },
  {
    id: 'sleep',
    name: 'Sommeil',
    title: 'Sommeil',
    description: 'Sons relaxants pour un meilleur sommeil',
    tracks: [],
    category: 'relaxation',
  }
];

// Default track placeholders
const placeholderTracks: MusicTrack[] = [
  {
    id: 'track1',
    title: 'Méditation matinale',
    artist: 'Nature Sounds',
    duration: 180,
    url: '/audio/track1.mp3',
    cover_url: 'https://via.placeholder.com/300?text=Morning+Meditation',
    genre: 'meditation',
    emotion: 'calm',
  },
  {
    id: 'track2',
    title: 'Focus intense',
    artist: 'Mind Collection',
    duration: 240,
    url: '/audio/track2.mp3',
    cover_url: 'https://via.placeholder.com/300?text=Deep+Focus',
    genre: 'focus',
    emotion: 'neutral',
  },
];

const MusicLibrary: React.FC<MusicLibraryProps> = ({
  playlists = defaultPlaylists,
  onSelectTrack,
  onSelectPlaylist
}) => {
  // Get categories from playlists
  const categories = [...new Set(playlists.map(p => p.category || 'Autres'))];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="discover">Découvrir</TabsTrigger>
          <TabsTrigger value="library">Bibliothèque</TabsTrigger>
          <TabsTrigger value="mood">Par humeur</TabsTrigger>
          <TabsTrigger value="recent">Récents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-3">Recommandé pour vous</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {placeholderTracks.map(track => (
                <Card key={track.id} className="overflow-hidden">
                  <div className="relative group">
                    <img 
                      src={track.cover_url} 
                      alt={track.title}
                      className="w-full aspect-square object-cover" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        className="rounded-full" 
                        onClick={() => onSelectTrack?.(track)}
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium truncate">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Playlists populaires</h2>
              <Button variant="link" size="sm" className="text-xs">
                Voir tout <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {playlists.slice(0, 3).map(playlist => (
                <Card 
                  key={playlist.id} 
                  className="overflow-hidden cursor-pointer"
                  onClick={() => onSelectPlaylist?.(playlist)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">{playlist.title || playlist.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {playlist.description || 'Collection de morceaux'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="library">
          <LibraryTab 
            playlists={playlists}
            onSelectTrack={onSelectTrack}
            onSelectPlaylist={onSelectPlaylist}
          />
        </TabsContent>
        
        <TabsContent value="mood" className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-3">Calme et détente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {playlists
                .filter(p => p.emotion === 'calm' || p.category === 'relaxation')
                .slice(0, 4)
                .map(playlist => (
                  <Card 
                    key={playlist.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSelectPlaylist?.(playlist)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">{playlist.title || playlist.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Pour se détendre</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-3">Concentration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {playlists
                .filter(p => p.emotion === 'focused' || p.category === 'travail')
                .slice(0, 4)
                .map(playlist => (
                  <Card 
                    key={playlist.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSelectPlaylist?.(playlist)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">{playlist.title || playlist.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Pour la concentration</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-3">Énergie</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {playlists
                .filter(p => p.emotion === 'energetic' || p.category === 'energie')
                .slice(0, 4)
                .map(playlist => (
                  <Card 
                    key={playlist.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSelectPlaylist?.(playlist)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">{playlist.title || playlist.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Pour s'énergiser</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              Vous n'avez pas encore écouté de musique récemment.
            </p>
            <Button className="mt-4" onClick={() => onSelectPlaylist?.(defaultPlaylists[0])}>
              Découvrir des playlists
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicLibrary;
