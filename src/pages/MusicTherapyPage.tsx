
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Wand2 } from 'lucide-react';
import MusicPlayer from '@/components/music/player/MusicPlayer';
import MusicCreator from '@/components/music/MusicCreator';
import { Card, CardContent } from '@/components/ui/card';
import { useUserMode } from '@/contexts/UserModeContext';

const MusicTherapyPage: React.FC = () => {
  const { userMode } = useUserMode();
  const isB2C = userMode === 'personal' || userMode === 'b2c';

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Musicothérapie</h1>
        <p className="text-muted-foreground">
          Explorez et créez de la musique thérapeutique adaptée à votre état émotionnel
        </p>

        <Tabs defaultValue="listen" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="listen" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Écouter
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Créer
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listen" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <MusicPlayer />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <MusicCreator />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MusicTherapyPage;
