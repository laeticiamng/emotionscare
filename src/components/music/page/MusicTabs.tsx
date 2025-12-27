import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { MusicPlaylist, MusicCategory } from '@/types/music';
import { ensureArray } from '@/utils/musicCompatibility';

interface MusicTabsProps {
  playlists: MusicPlaylist[];
  renderPlaylist: (playlist: MusicPlaylist) => React.ReactNode;
}

const MusicTabs: React.FC<MusicTabsProps> = ({ playlists, renderPlaylist }) => {
  // Helper function to check if a playlist matches a category
  const matchesCategory = (playlist: MusicPlaylist, category: string): boolean => {
    if (!playlist.category) return false;
    
    const categories = ensureArray(playlist.category);
    return categories.some(cat => 
      typeof cat === 'string' && cat.toLowerCase() === category.toLowerCase()
    );
  };
  
  // Filter playlists by category
  const getPlaylistsByCategory = (category: string): MusicPlaylist[] => {
    return playlists.filter(playlist => matchesCategory(playlist, category));
  };

  const relaxationPlaylists = getPlaylistsByCategory('relaxation');
  const focusPlaylists = getPlaylistsByCategory('focus');
  const energyPlaylists = getPlaylistsByCategory('energy');
  
  return (
    <>
      <TabsContent value="relaxation" className="space-y-4">
        <h2 className="text-2xl font-semibold">Relaxation & Meditation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relaxationPlaylists.map(playlist => renderPlaylist(playlist))}
        </div>
      </TabsContent>
      
      <TabsContent value="focus" className="space-y-4">
        <h2 className="text-2xl font-semibold">Focus & Concentration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {focusPlaylists.map(playlist => renderPlaylist(playlist))}
        </div>
      </TabsContent>
      
      <TabsContent value="energy" className="space-y-4">
        <h2 className="text-2xl font-semibold">Energy & Motivation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {energyPlaylists.map(playlist => renderPlaylist(playlist))}
        </div>
      </TabsContent>
      
      <TabsContent value="all" className="space-y-4">
        <h2 className="text-2xl font-semibold">All Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map(playlist => renderPlaylist(playlist))}
        </div>
      </TabsContent>
    </>
  );
};

export default MusicTabs;
