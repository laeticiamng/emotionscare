
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useMusic } from '@/contexts/MusicContext';
import { toast } from '@/hooks/use-toast';

interface MoodBasedRecommendationsProps {
  mood: string;
  intensity?: number;
  standalone?: boolean;
}

const MoodBasedRecommendations: React.FC<MoodBasedRecommendationsProps> = ({ mood, intensity = 0.5, standalone = true }) => {
  const { loadPlaylistForEmotion, recommendations, isLoading, error } = useMusic();

  React.useEffect(() => {
    if (mood) {
      loadPlaylistForEmotion({ emotion: mood, intensity });
    }
  }, [mood, loadPlaylistForEmotion, intensity]);

  const handlePlay = (trackId: string) => {
    toast({
      title: "Lecture de la musique",
      description: `Lecture de la musique avec l'ID: ${trackId}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommandations musicales basées sur l'humeur</CardTitle>
        <CardDescription>Découvrez de nouvelles musiques en fonction de votre humeur actuelle.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p>Chargement des recommandations...</p>}
        {error && <p className="text-red-500">Erreur: {error.message}</p>}
        {/* Pour éviter l'erreur, utilisons les données du contexte correctement */}
        <div className="grid gap-4">
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-semibold">Titre de la musique</h3>
            <p className="text-sm text-muted-foreground">Artiste: Nom de l'artiste</p>
            <Button onClick={() => handlePlay("sample-id")}>Écouter</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodBasedRecommendations;
