import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useMusicContext } from '@/contexts/MusicContext';
import { toast } from '@/hooks/use-toast';

interface MoodBasedRecommendationsProps {
  mood: string;
}

const MoodBasedRecommendations: React.FC<MoodBasedRecommendationsProps> = ({ mood }) => {
  const { getRecommendations, recommendations, isLoading, error } = useMusicContext();

  React.useEffect(() => {
    if (mood) {
      getRecommendations(mood);
    }
  }, [mood, getRecommendations]);

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
        {error && <p className="text-red-500">Erreur: {error}</p>}
        {recommendations && recommendations.length > 0 ? (
          <div className="grid gap-4">
            {recommendations.map((track) => (
              <div key={track.id} className="border rounded-md p-4">
                <h3 className="text-lg font-semibold">{track.title}</h3>
                <p className="text-sm text-muted-foreground">Artiste: {track.artist}</p>
                <Button onClick={() => handlePlay(track.id)}>Écouter</Button>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune recommandation disponible pour l'humeur actuelle.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodBasedRecommendations;
