
import React from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import TrackList from '../TrackList';

interface MusicLibraryProps {
  tracks: MusicTrack[];
  playlists: MusicPlaylist[];
  onTrackSelect: (track: MusicTrack) => void;
  currentTrack: MusicTrack | null;
  className?: string;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({
  tracks,
  playlists,
  onTrackSelect,
  currentTrack,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');

  const filteredTracks = React.useMemo(() => {
    return tracks.filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tracks, searchQuery]);

  const filteredTracksByCategory = React.useMemo(() => {
    if (activeTab === 'all') return filteredTracks;
    
    return filteredTracks.filter(track => {
      // Check if track has category or emotion property to use for filtering
      if (track.category) {
        return track.category === activeTab;
      }
      if ('emotion' in track && track.emotion) {
        return track.emotion === activeTab;
      }
      return true;
    });
  }, [filteredTracks, activeTab]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Search tracks or artists..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="calm">Calm</TabsTrigger>
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTracksByCategory.length > 0 ? (
            <TrackList 
              tracks={filteredTracksByCategory} 
              onTrackSelect={onTrackSelect} 
              currentTrack={currentTrack || undefined} 
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No tracks found matching your search.
            </div>
          )}
        </TabsContent>

        <TabsContent value="calm" className="space-y-4">
          {filteredTracksByCategory.length > 0 ? (
            <TrackList 
              tracks={filteredTracksByCategory} 
              onTrackSelect={onTrackSelect} 
              currentTrack={currentTrack || undefined}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No calm tracks found.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="focus">
          {filteredTracksByCategory.length > 0 ? (
            <TrackList 
              tracks={filteredTracksByCategory} 
              onTrackSelect={onTrackSelect} 
              currentTrack={currentTrack || undefined}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No focus tracks found.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="energy">
          {filteredTracksByCategory.length > 0 ? (
            <TrackList 
              tracks={filteredTracksByCategory} 
              onTrackSelect={onTrackSelect} 
              currentTrack={currentTrack || undefined}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No energy tracks found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicLibrary;
