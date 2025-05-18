
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MusicTrack } from '@/types/music';
import { Music, Bookmark } from 'lucide-react';

interface MusicTabsProps {
  tracks: MusicTrack[];
  onSelectTrack: (track: MusicTrack) => void;
}

const MusicTabs: React.FC<MusicTabsProps> = ({ tracks, onSelectTrack }) => {
  // Filters for different music categories
  const focusTracks = tracks.filter(track => 
    (track.genre && track.genre.toLowerCase().includes('focus')) || 
    (track.category && track.category.toLowerCase().includes('focus')) ||
    (track.emotion && track.emotion.toLowerCase().includes('focus'))
  );
  
  const relaxTracks = tracks.filter(track => 
    (track.genre && track.genre.toLowerCase().includes('relax')) || 
    (track.category && track.category.toLowerCase().includes('relax')) ||
    (track.emotion && track.emotion.toLowerCase().includes('calm'))
  );
  
  const energyTracks = tracks.filter(track => 
    (track.genre && track.genre.toLowerCase().includes('energy')) || 
    (track.category && track.category.toLowerCase().includes('energy')) ||
    (track.emotion && track.emotion.toLowerCase().includes('energy'))
  );

  // Function to render track list
  const renderTrackList = (trackList: MusicTrack[]) => (
    <div className="space-y-2">
      {trackList.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          Aucune piste disponible dans cette catégorie
        </div>
      ) : (
        trackList.map(track => (
          <div
            key={track.id}
            className="flex items-center justify-between p-3 rounded-md hover:bg-accent cursor-pointer"
            onClick={() => onSelectTrack(track)}
          >
            <div className="flex items-center">
              <Music className="h-4 w-4 mr-3 text-muted-foreground" />
              <div>
                <p className="font-medium">{track.title || track.name}</p>
                <p className="text-xs text-muted-foreground">{track.artist || 'Unknown'}</p>
              </div>
            </div>
            <Bookmark className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </div>
        ))
      )}
    </div>
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">Toutes</TabsTrigger>
        <TabsTrigger value="focus">Focus</TabsTrigger>
        <TabsTrigger value="relax">Détente</TabsTrigger>
        <TabsTrigger value="energy">Énergie</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4">
        {renderTrackList(tracks)}
      </TabsContent>
      
      <TabsContent value="focus" className="mt-4">
        {renderTrackList(focusTracks)}
      </TabsContent>
      
      <TabsContent value="relax" className="mt-4">
        {renderTrackList(relaxTracks)}
      </TabsContent>
      
      <TabsContent value="energy" className="mt-4">
        {renderTrackList(energyTracks)}
      </TabsContent>
    </Tabs>
  );
};

export default MusicTabs;
