
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MusicTrack, MusicPlaylist, MusicLibraryProps } from '@/types/music';
import TrackList from '../TrackList';
import PlaylistGrid from '../PlaylistGrid';
import { Search } from 'lucide-react';

// Updated interface to include className
interface ExtendedMusicLibraryProps extends MusicLibraryProps {
  className?: string;
}

const MusicLibrary: React.FC<ExtendedMusicLibraryProps> = ({
  tracks = [],
  playlists = [],
  onTrackSelect,
  onPlaylistSelect,
  currentTrack,
  searchTerm = '',
  onSearchChange,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setLocalSearchTerm(term);
    if (onSearchChange) {
      onSearchChange(term);
    }
  };

  const filteredTracks = tracks.filter(track => {
    const searchLower = localSearchTerm.toLowerCase();
    return (
      track.title.toLowerCase().includes(searchLower) ||
      (track.artist && track.artist.toLowerCase().includes(searchLower))
    );
  });

  const filteredPlaylists = playlists.filter(playlist => {
    const searchLower = localSearchTerm.toLowerCase();
    return (
      playlist.title.toLowerCase().includes(searchLower) ||
      (playlist.name && playlist.name.toLowerCase().includes(searchLower))
    );
  });

  // Group tracks by emotion/mood for the "Ambiance" tab
  const emotionGroups: Record<string, MusicTrack[]> = {};
  filteredTracks.forEach(track => {
    if (track.mood || track.emotion) {
      const emotionKey = (track.mood || track.emotion || 'unknown').toLowerCase();
      if (!emotionGroups[emotionKey]) {
        emotionGroups[emotionKey] = [];
      }
      emotionGroups[emotionKey].push(track);
    }
  });

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre, artiste ou playlist"
          className="pl-8"
          value={localSearchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">Tout</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="ambiance">Ambiance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredTracks.length > 0 ? (
            <TrackList tracks={filteredTracks} onTrackSelect={onTrackSelect} currentTrack={currentTrack} />
          ) : (
            <p className="text-center text-muted-foreground py-8">Aucun titre trouvé</p>
          )}
        </TabsContent>

        <TabsContent value="playlists" className="space-y-6">
          {filteredPlaylists.length > 0 ? (
            <PlaylistGrid playlists={filteredPlaylists} onSelectPlaylist={onPlaylistSelect} />
          ) : (
            <p className="text-center text-muted-foreground py-8">Aucune playlist trouvée</p>
          )}
        </TabsContent>

        <TabsContent value="ambiance" className="space-y-8">
          {Object.keys(emotionGroups).length > 0 ? (
            Object.entries(emotionGroups).map(([emotion, tracks]) => (
              <div key={emotion} className="space-y-3">
                <h3 className="font-medium capitalize">{emotion}</h3>
                <TrackList
                  tracks={tracks}
                  onTrackSelect={onTrackSelect}
                  currentTrack={currentTrack}
                  compact
                />
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucune musique par ambiance trouvée
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicLibrary;
