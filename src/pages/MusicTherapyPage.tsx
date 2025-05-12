
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import PageHeader from '@/components/layout/PageHeader';
import MusicLayout from '@/components/music/layout/MusicLayout';
import MusicPlayer from '@/components/music/player/MusicPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const MusicTherapyPage: React.FC = () => {
  const { initializeMusicSystem, error, currentTrack } = useMusic();
  const { toast } = useToast();

  useEffect(() => {
    const initMusic = async () => {
      try {
        await initializeMusicSystem();
      } catch (err) {
        console.error('Erreur lors de l\'initialisation du système musical:', err);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le système musical',
          variant: 'destructive'
        });
      }
    };

    initMusic();
  }, [initializeMusicSystem, toast]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-medium text-red-500 mb-2">Erreur de chargement</h2>
        <p className="text-muted-foreground">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader
        title="Musicothérapie"
        description="Utilisez la musique pour réguler vos émotions et améliorer votre bien-être"
      />

      <MusicLayout>
        <Tabs defaultValue="player" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="player">Lecteur</TabsTrigger>
            <TabsTrigger value="library">Bibliothèque</TabsTrigger>
            <TabsTrigger value="for-you">Recommandations</TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <MusicPlayer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Votre bibliothèque</h3>
                {currentTrack ? (
                  <p>Exploration de votre bibliothèque musicale</p>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Votre bibliothèque musicale apparaîtra ici
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="for-you" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Pour vous</h3>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Des recommandations personnalisées basées sur vos émotions apparaîtront ici
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </MusicLayout>
    </div>
  );
};

export default MusicTherapyPage;
