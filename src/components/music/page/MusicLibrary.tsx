
import React, { useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MusicLibrary: React.FC = () => {
  const { playlists, loadPlaylistById } = useMusic();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlaylists = playlists.filter(playlist => 
    playlist.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaylistSelect = async (id: string) => {
    await loadPlaylistById(id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Music Library</h2>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search playlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlaylists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="bg-muted/40 hover:bg-muted/60 rounded-lg p-4 cursor-pointer transition-colors"
            onClick={() => handlePlaylistSelect(playlist.id)}
          >
            <div className="aspect-square bg-muted mb-3 rounded-md flex items-center justify-center">
              {playlist.coverUrl ? (
                <img 
                  src={playlist.coverUrl} 
                  alt={playlist.title} 
                  className="w-full h-full object-cover rounded-md" 
                />
              ) : (
                <div className="text-muted-foreground">No Cover</div>
              )}
            </div>
            <h3 className="font-medium">{playlist.title}</h3>
            <p className="text-sm text-muted-foreground">{playlist.description}</p>
          </div>
        ))}
        
        <div className="bg-muted/20 border border-dashed border-muted-foreground/30 rounded-lg p-4 flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-muted/30 transition-colors">
          <Plus className="h-10 w-10 mb-2 text-muted-foreground" />
          <p className="text-center text-muted-foreground">Create New Playlist</p>
        </div>
      </div>
    </div>
  );
};

export default MusicLibrary;
