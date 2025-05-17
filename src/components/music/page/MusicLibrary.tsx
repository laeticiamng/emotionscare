
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackList from '../TrackList';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import { Music2 } from 'lucide-react';

export interface MusicLibraryProps {
  tracks: MusicTrack[];
  playlists: MusicPlaylist[];
  onTrackSelect?: (track: MusicTrack) => void;
  currentTrack: MusicTrack | null;
  onPlaylistSelect?: (playlist: MusicPlaylist) => void;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({ 
  tracks,
  playlists,
  onTrackSelect,
  currentTrack,
  onPlaylistSelect
}) => {
  const [activeTab, setActiveTab] = useState('all');
  
  const handlePlaylistClick = (playlist: MusicPlaylist) => {
    if (onPlaylistSelect) {
      onPlaylistSelect(playlist);
    }
  };

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">Tous les titres</TabsTrigger>
        <TabsTrigger value="playlists">Playlists</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        {tracks.length > 0 ? (
          <TrackList 
            tracks={tracks} 
            onTrackSelect={onTrackSelect} 
            currentTrack={currentTrack} 
          />
        ) : (
          <EmptyState 
            title="Aucun titre"
            description="Votre bibliothèque musicale est vide."
            icon={<Music2 className="h-10 w-10 text-muted-foreground" />}
            actionLabel="Ajouter de la musique"
          />
        )}
      </TabsContent>
      
      <TabsContent value="playlists">
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map(playlist => (
              <div 
                key={playlist.id} 
                className="bg-card border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <h3 className="font-medium">{playlist.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {playlist.tracks.length} titres
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="Aucune playlist"
            description="Créez des playlists pour organiser votre musique."
            icon={<Music2 className="h-10 w-10 text-muted-foreground" />}
            actionLabel="Créer une playlist"
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MusicLibrary;
