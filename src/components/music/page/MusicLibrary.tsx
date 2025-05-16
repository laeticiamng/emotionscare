
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({ 
  playlists = [], 
  onSelectTrack,
  onSelectPlaylist
}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  
  // Sample playlists data
  const samplePlaylists: MusicPlaylist[] = playlists.length > 0 ? playlists : [
    {
      id: '1',
      name: 'Concentration',
      cover_url: '/images/playlist-concentration.jpg',
      tracks: [
        {
          id: '1',
          title: 'Focused Mind',
          artist: 'Ambient Works',
          track_url: '/audio/focused-mind.mp3',
          duration: 240,
        },
        {
          id: '2',
          title: 'Deep Concentration',
          artist: 'Mindful Music',
          track_url: '/audio/deep-concentration.mp3',
          duration: 320,
        }
      ]
    },
    {
      id: '2',
      name: 'Relaxation',
      cover_url: '/images/playlist-relaxation.jpg',
      tracks: [
        {
          id: '3',
          title: 'Peaceful Mind',
          artist: 'Zen Sounds',
          track_url: '/audio/peaceful-mind.mp3',
          duration: 260
        }
      ]
    },
    {
      id: '3',
      name: 'Énergie',
      cover_url: '/images/playlist-energy.jpg',
      tracks: []
    },
    {
      id: '4',
      name: 'Méditation',
      cover_url: '/images/playlist-meditation.jpg',
      tracks: []
    }
  ];
  
  // Sample all tracks
  const allTracks: MusicTrack[] = [
    {
      id: '101',
      title: 'Morning Clarity',
      artist: 'Ambient Vibes',
      track_url: '/audio/morning-clarity.mp3',
      duration: 180
    },
    {
      id: '102',
      title: 'Evening Calm',
      artist: 'Night Sounds',
      track_url: '/audio/evening-calm.mp3',
      duration: 210
    }
  ];

  const handlePlaylistClick = (playlist: MusicPlaylist) => {
    setSelectedPlaylist(playlist.id);
    if (onSelectPlaylist) {
      onSelectPlaylist(playlist);
    }
  };

  const handleTrackClick = (track: MusicTrack) => {
    if (onSelectTrack) {
      onSelectTrack(track);
    }
  };

  return (
    <Tabs defaultValue="playlists">
      <TabsList className="w-full">
        <TabsTrigger value="playlists">Playlists</TabsTrigger>
        <TabsTrigger value="tracks">Morceaux</TabsTrigger>
        <TabsTrigger value="favorites">Favoris</TabsTrigger>
      </TabsList>
      
      <TabsContent value="playlists" className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {samplePlaylists.map((playlist) => (
            <Card 
              key={playlist.id} 
              className="overflow-hidden cursor-pointer"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <div 
                className="h-32 bg-primary/10"
                style={{
                  backgroundImage: playlist.cover_url ? `url(${playlist.cover_url})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <CardContent className="p-3">
                <h3 className="font-medium">{playlist.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {playlist.tracks.length} morceaux
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="tracks" className="mt-6">
        <div className="space-y-2">
          {allTracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
              onClick={() => handleTrackClick(track)}
            >
              <div>
                <h4 className="font-medium">{track.title}</h4>
                <p className="text-xs text-muted-foreground">{track.artist}</p>
              </div>
              <Button size="sm" variant="ghost">Jouer</Button>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="favorites" className="mt-6">
        <p className="text-center text-muted-foreground py-8">
          Vous n'avez pas encore de favoris.
        </p>
      </TabsContent>
    </Tabs>
  );
};

export default MusicLibrary;
