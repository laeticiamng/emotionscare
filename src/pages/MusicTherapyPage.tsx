
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Wand2 } from 'lucide-react';
import MusicPlayer from '@/components/music/player/MusicPlayer';
import MusicCreator from '@/components/music/MusicCreator';
import { Card, CardContent } from '@/components/ui/card';
import { useUserMode } from '@/contexts/UserModeContext';
import { UserModeType } from '@/types';

const MusicTherapyPage: React.FC = () => {
  const { userMode } = useUserMode();
  const isB2C = userMode === 'b2c' || userMode === 'personal';

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
                <MusicPlayer 
                  track={{
                    id: "default-track",
                    title: "Relaxation ambiance",
                    artist: "IA Musicothérapie",
                    url: "/sounds/ambient-calm.mp3",
                    duration: 180,
                    cover: "/images/music/ambient-cover.jpg"
                  }}
                  isPlaying={false}
                  onPlay={() => console.log('Playing music')}
                  onPause={() => console.log('Pausing music')}
                  onSeek={(time) => console.log('Seeking to', time)}
                  onNext={() => console.log('Next track')}
                  onPrevious={() => console.log('Previous track')}
                  onVolumeChange={(volume) => console.log('Volume changed to', volume)}
                  volume={0.7}
                  currentTime={0}
                  showControls={true}
                  showProgress={true}
                />
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
