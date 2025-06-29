
import React from 'react';
import MusicPlayer from '@/components/music/player/MusicPlayer';
import EmotionBasedMusicSelector from '@/components/music/EmotionBasedMusicSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Brain } from 'lucide-react';

const MusicPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Thérapie Musicale</h1>
        <p className="text-muted-foreground">
          Musique adaptée à votre état émotionnel grâce à l'IA
        </p>
      </div>

      <div className="space-y-8">
        {/* Lecteur de musique */}
        <MusicPlayer className="sticky top-4 z-10" />

        {/* Interface principale */}
        <Tabs defaultValue="emotion" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emotion" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Scanner Émotionnel
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Sélection Manuelle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emotion" className="mt-6">
            <EmotionBasedMusicSelector />
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <div className="text-center text-muted-foreground p-8">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Interface de sélection manuelle</p>
              <p className="text-sm">Utilisez le scanner émotionnel pour une expérience optimale</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MusicPage;
