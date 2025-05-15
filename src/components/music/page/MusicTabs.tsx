import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LibraryTab from './LibraryTab';
import PlayerTab from './PlayerTab';
import { MusicTrack, MusicPlaylist } from '@/types/music';

const MusicTabs: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  
  // Mock data for demonstration
  const demoPlaylists: MusicPlaylist[] = [
    {
      id: "playlist1",
      title: "Relaxation",  // Add title property
      name: "Relaxation",
      description: "Playlists pour se détendre",
      category: "relax",
      tracks: [
        {
          id: '101',
          title: 'Méditation guidée',
          artist: 'Calm Voices',
          duration: 600,
          coverUrl: '/images/covers/meditation.jpg',
          url: '/audio/meditation.mp3',
          category: 'Relaxation'
        },
        {
          id: '102',
          title: 'Sons de la forêt',
          artist: 'Nature Sounds',
          duration: 480,
          coverUrl: '/images/covers/forest.jpg',
          url: '/audio/forest.mp3',
          category: 'Nature'
        }
      ]
    }
  ];
  
  const handleSelectTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
  };
  
  const handleSelectPlaylist = (playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
  };
  
  return (
    <Tabs defaultValue="player" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="player">Lecteur</TabsTrigger>
        <TabsTrigger value="library">Bibliothèque</TabsTrigger>
      </TabsList>
      
      <TabsContent value="player">
        <PlayerTab currentTrack={currentTrack} playlist={currentPlaylist} />
      </TabsContent>
      
      <TabsContent value="library">
        <LibraryTab 
          playlists={demoPlaylists}
          onSelectTrack={handleSelectTrack}
          onSelectPlaylist={handleSelectPlaylist}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MusicTabs;
