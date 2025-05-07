
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlayerTab from './PlayerTab';
import LibraryTab from './LibraryTab';
import MusicMixer from './MusicMixer';

interface MusicTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MusicTabs: React.FC<MusicTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="player">Lecteur</TabsTrigger>
        <TabsTrigger value="library">Bibliothèque</TabsTrigger>
        <TabsTrigger value="mixer">Mixage</TabsTrigger>
      </TabsList>
      
      <TabsContent value="player">
        <PlayerTab />
      </TabsContent>
      
      <TabsContent value="library">
        <LibraryTab />
      </TabsContent>
      
      <TabsContent value="mixer">
        <MusicMixer />
      </TabsContent>
    </Tabs>
  );
};

export default MusicTabs;
