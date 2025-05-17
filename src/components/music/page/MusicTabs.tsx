
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MusicTrack } from '@/types/music';

interface MusicTabsProps {
  tracks: MusicTrack[];
  onSelectTrack: (track: MusicTrack) => void;
}

const MusicTabs: React.FC<MusicTabsProps> = ({ tracks, onSelectTrack }) => {
  // Group tracks by emotion/genre
  const calmTracks = tracks.filter(track => 
    track.emotion === 'calm' || 
    track.emotion === 'relaxed' || 
    track.genre === 'ambient'
  );
  
  const energeticTracks = tracks.filter(track => 
    track.emotion === 'joy' || 
    track.emotion === 'happy' || 
    track.genre === 'upbeat'
  );
  
  const focusTracks = tracks.filter(track => 
    track.emotion === 'neutral' || 
    track.emotion === 'focused' || 
    track.genre === 'concentration'
  );
  
  return (
    <Tabs defaultValue="calm" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="calm">Calme</TabsTrigger>
        <TabsTrigger value="focus">Concentration</TabsTrigger>
        <TabsTrigger value="energetic">Énergique</TabsTrigger>
      </TabsList>
      
      <TabsContent value="calm">
        {renderTrackList(calmTracks, onSelectTrack)}
      </TabsContent>
      
      <TabsContent value="focus">
        {renderTrackList(focusTracks, onSelectTrack)}
      </TabsContent>
      
      <TabsContent value="energetic">
        {renderTrackList(energeticTracks, onSelectTrack)}
      </TabsContent>
    </Tabs>
  );
};

const renderTrackList = (tracks: MusicTrack[], onSelectTrack: (track: MusicTrack) => void) => {
  if (tracks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucune piste disponible dans cette catégorie</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {tracks.map(track => (
        <div 
          key={track.id} 
          className="flex items-center p-2 rounded-md hover:bg-accent cursor-pointer"
          onClick={() => onSelectTrack(track)}
        >
          <div className="mr-4 w-10 h-10 bg-primary/20 rounded flex items-center justify-center">
            <span className="text-lg">🎵</span>
          </div>
          <div>
            <p className="font-medium">{track.title}</p>
            <p className="text-sm text-muted-foreground">{track.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MusicTabs;
