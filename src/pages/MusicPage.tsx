
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { Slider } from '@/components/ui/slider';
import EmotionsCareMusicPlayer from '@/components/music/emotionscare/EmotionsCareMusicPlayer';

const MusicPage: React.FC = () => {
  const { activateMusicForEmotion, getEmotionMusicDescription, isLoading } = useMusicEmotionIntegration();
  const [generatedPlaylist, setGeneratedPlaylist] = useState<any>(null);

  const handleEmotionClick = async (emotion: string) => {
    try {
      console.log(`🎵 EmotionsCare - Génération pour émotion: ${emotion}`);
      
      const playlist = await activateMusicForEmotion({
        emotion: emotion.toLowerCase(),
        intensity: 0.7
      });
      
      if (playlist) {
        console.log('✅ EmotionsCare - Playlist générée:', playlist);
        setGeneratedPlaylist(playlist);
      }
    } catch (error) {
      console.error('❌ EmotionsCare - Erreur:', error);
    }
  };

  const handleClosePlayer = () => {
    setGeneratedPlaylist(null);
  };

  const emotions = [
    { name: 'Calme', value: 'calm', description: 'Musique apaisante pour la relaxation' },
    { name: 'Énergique', value: 'energetic', description: 'Musique dynamique pour se motiver' },
    { name: 'Heureux', value: 'happy', description: 'Musique joyeuse pour élever l\'humeur' },
    { name: 'Focus', value: 'focus', description: 'Musique pour la concentration' },
    { name: 'Détendu', value: 'relaxed', description: 'Musique douce pour se détendre' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header EmotionsCare */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Music className="h-8 w-8" />
            EmotionsCare Music
          </CardTitle>
          <p className="text-muted-foreground">
            Thérapie musicale personnalisée basée sur vos émotions
          </p>
        </CardHeader>
      </Card>

      {/* Sélection d'émotions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emotions.map((emotion) => (
          <Card key={emotion.value} className="hover:shadow-lg transition-shadow cursor-pointer border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">{emotion.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{emotion.description}</p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleEmotionClick(emotion.value)}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                <Play className="mr-2 h-4 w-4" />
                {isLoading ? 'Génération...' : 'Activer la thérapie'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Description des bienfaits */}
      <Card>
        <CardHeader>
          <CardTitle>Bienfaits de la thérapie musicale EmotionsCare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">🧘‍♀️ Réduction du stress</h4>
              <p className="text-sm text-muted-foreground">
                La musique adaptée à votre état émotionnel aide à réduire le cortisol et favorise la relaxation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎯 Amélioration de la concentration</h4>
              <p className="text-sm text-muted-foreground">
                Des rythmes spécifiques stimulent la productivité et maintiennent l'attention.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">😊 Régulation émotionnelle</h4>
              <p className="text-sm text-muted-foreground">
                La musicothérapie aide à équilibrer et harmoniser vos émotions naturellement.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💤 Amélioration du sommeil</h4>
              <p className="text-sm text-muted-foreground">
                Les fréquences apaisantes préparent votre corps et esprit au repos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lecteur EmotionsCare */}
      {generatedPlaylist && (
        <EmotionsCareMusicPlayer 
          playlist={generatedPlaylist}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default MusicPage;
