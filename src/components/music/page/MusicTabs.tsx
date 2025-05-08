
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MusicLibrary from './MusicLibrary';
import MusicPlayer from '../player/MusicPlayer';
import MusicStatistics from './MusicStatistics';
import { Music, BarChart, Library, Headphones } from 'lucide-react';

interface MusicTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MusicTabs: React.FC<MusicTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="player" className="flex items-center gap-2">
          <Headphones className="h-4 w-4" />
          <span className="hidden sm:inline">Lecteur</span>
        </TabsTrigger>
        <TabsTrigger value="library" className="flex items-center gap-2">
          <Library className="h-4 w-4" />
          <span className="hidden sm:inline">Bibliothèque</span>
        </TabsTrigger>
        <TabsTrigger value="statistics" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          <span className="hidden sm:inline">Statistiques</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="player" className="space-y-6">
        <div className="max-w-md mx-auto">
          <MusicPlayer />
        </div>
      </TabsContent>
      
      <TabsContent value="library">
        <MusicLibrary />
      </TabsContent>
      
      <TabsContent value="statistics">
        <MusicStatistics />
      </TabsContent>
    </Tabs>
  );
};

export default MusicTabs;
