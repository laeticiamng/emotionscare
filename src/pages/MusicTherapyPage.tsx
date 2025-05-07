
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Plus, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchLatestEmotion } from '@/lib/scanService';
import MusicPlayer from '@/components/music/MusicPlayer';
import RecommendedPresets from '@/components/music/RecommendedPresets';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';

const MusicTherapyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listen');
  const [latestEmotion, setLatestEmotion] = useState<any>(null);
  const { toast } = useToast();
  const { currentEmotion } = useMusic();

  useEffect(() => {
    const loadLatestEmotion = async () => {
      try {
        const emotion = await fetchLatestEmotion();
        setLatestEmotion(emotion);
      } catch (error) {
        console.error('Error loading latest emotion:', error);
      }
    };

    loadLatestEmotion();
  }, []);

  const handleCreateMusic = () => {
    navigate('/music/create');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Musicothérapie IA</h1>
        <p className="text-muted-foreground mt-1">
          Écoutez et créez des morceaux musicaux adaptés à votre état émotionnel
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="listen" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="listen">
            <Volume2 className="h-4 w-4 mr-2" />
            Écouter
          </TabsTrigger>
          <TabsTrigger value="create" onClick={handleCreateMusic}>
            <Plus className="h-4 w-4 mr-2" />
            Créer ma musique
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="listen" className="mt-6 space-y-6">
          {/* Current emotional state and music player */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="mr-2 h-5 w-5" />
                Votre lecteur musical
              </CardTitle>
              <CardDescription>
                {currentEmotion 
                  ? `Musique adaptée à votre humeur : ${currentEmotion}` 
                  : "Écoutez des morceaux de musique adaptés à votre humeur"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MusicPlayer />
            </CardContent>
          </Card>

          {/* Recommended music presets based on emotions */}
          <RecommendedPresets emotion={latestEmotion} />
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          {/* This tab will redirect to the creation page */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicTherapyPage;
