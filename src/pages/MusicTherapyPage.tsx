
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Plus, Volume2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpandedTabs, ExpandedTabsList, ExpandedTabsTrigger, ExpandedTabsContent } from '@/components/ui/expanded-tabs';
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

  const handleCollectiveJam = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'univers sonore collaboratif sera bientôt disponible!",
    });
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
      <ExpandedTabs>
        <ExpandedTabsList>
          <ExpandedTabsTrigger 
            active={activeTab === 'listen'} 
            onClick={() => setActiveTab('listen')}
          >
            <Volume2 className="h-4 w-4 mr-2 inline" />
            Écouter
          </ExpandedTabsTrigger>
          <ExpandedTabsTrigger 
            active={activeTab === 'create'} 
            onClick={() => handleCreateMusic()}
          >
            <Plus className="h-4 w-4 mr-2 inline" />
            Créer ma musique
          </ExpandedTabsTrigger>
          <ExpandedTabsTrigger 
            active={activeTab === 'jam'} 
            onClick={() => {
              setActiveTab('jam');
              handleCollectiveJam();
            }}
          >
            <Music className="h-4 w-4 mr-2 inline" />
            Jam collective
          </ExpandedTabsTrigger>
        </ExpandedTabsList>
        
        <ExpandedTabsContent active={activeTab === 'listen'} className="mt-6 space-y-6">
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
          
          {/* New feature - Ambient Workspace Control */}
          <Card className="border-t-4" style={{ borderTopColor: 'var(--primary)' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" />
                Ambiance Adaptive Workspace
              </CardTitle>
              <CardDescription>
                Contrôle intelligent de votre environnement de travail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Synchronisez votre éclairage connecté avec votre musique et votre état émotionnel pour une expérience immersive complète.
              </p>
              <Button variant="outline" onClick={() => toast({
                title: "Fonctionnalité à venir",
                description: "Le contrôle de l'éclairage sera bientôt disponible!"
              })}>
                Configurer mon éclairage
              </Button>
            </CardContent>
          </Card>
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'create'} className="mt-6">
          {/* This tab will redirect to the creation page */}
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'jam'} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Univers sonore collaboratif</CardTitle>
              <CardDescription>
                Créez des jams musicales en temps réel avec votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <Music className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-lg font-medium">Fonctionnalité en développement</h3>
              <p className="text-muted-foreground max-w-md">
                Nous travaillons actuellement sur cette innovation qui permettra de créer de la musique collaborative avec votre équipe en temps réel.
              </p>
              <Button variant="outline" onClick={() => toast({
                title: "En développement",
                description: "Nous vous informerons dès que cette fonctionnalité sera disponible!"
              })}>
                Me notifier à la sortie
              </Button>
            </CardContent>
          </Card>
        </ExpandedTabsContent>
      </ExpandedTabs>
    </div>
  );
};

export default MusicTherapyPage;
