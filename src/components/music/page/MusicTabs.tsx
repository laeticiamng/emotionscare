
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MusicLibrary from './MusicLibrary';
import { Music, Library, Settings } from 'lucide-react';

interface MusicTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const MusicTabs: React.FC<MusicTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="player" className="flex items-center gap-2">
          <Music className="h-4 w-4" />
          <span className="hidden sm:inline">Player</span>
        </TabsTrigger>
        <TabsTrigger value="library" className="flex items-center gap-2">
          <Library className="h-4 w-4" />
          <span className="hidden sm:inline">Library</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="player">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Music Player</h2>
          <p className="text-muted-foreground">
            Use the player controls below to adjust your music experience.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="library">
        <MusicLibrary />
      </TabsContent>

      <TabsContent value="settings">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Music Settings</h2>
          <p className="text-muted-foreground">
            Adjust your music preferences and settings here.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MusicTabs;
