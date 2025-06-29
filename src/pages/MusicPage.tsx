
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Heart, Clock, Users } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import AutoMusicPlayer from '@/components/music/AutoMusicPlayer';
import { toast } from '@/hooks/use-toast';

const MusicPage: React.FC = () => {
  const [activeEmotion, setActiveEmotion] = useState<string | null>(null);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<any>(null);
  const { activateMusicForEmotion, isLoading } = useMusicEmotionIntegration();

  const quickEmotions = [
    { 
      name: 'Énergique', 
      emotion: 'energetic', 
      color: 'bg-red-500 hover:bg-red-600',
      icon: '⚡'
    },
    { 
      name: 'Calme', 
      emotion: 'calm', 
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: '🧘'
    },
    { 
      name: 'Joyeux', 
      emotion: 'happy', 
      color: 'bg-yellow-500 hover:bg-yellow-600',
      icon: '😊'
    },
    { 
      name: 'Triste', 
      emotion: 'sad', 
      color: 'bg-gray-500 hover:bg-gray-600',
      icon: '😢'
    },
    { 
      name: 'Focus', 
      emotion: 'focus', 
      color: 'bg-purple-500 hover:bg-purple-600',
      icon: '🎯'
    }
  ];

  const handleQuickSelection = async (emotion: string, emotionName: string) => {
    console.log(`🎵 Sélection rapide: ${emotionName} (${emotion})`);
    setActiveEmotion(emotion);
    
    try {
      const playlist = await activateMusicForEmotion({
        emotion: emotion,
        intensity: 0.7
      });
      
      if (playlist) {
        console.log('✅ Playlist générée:', playlist);
        setGeneratedPlaylist(playlist);
        toast({
          title: "Playlist générée avec succès !",
          description: `Une playlist ${emotionName.toLowerCase()} est prête à être écoutée.`,
        });
      } else {
        throw new Error('Aucune playlist générée');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la playlist. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleClosePlayer = () => {
    setGeneratedPlaylist(null);
    setActiveEmotion(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎵 Thérapie Musicale IA
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Découvrez la musique adaptée à vos émotions
          </p>
        </div>

        {/* Sélection rapide d'émotions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Sélection rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {quickEmotions.map((item) => (
                <Button
                  key={item.emotion}
                  onClick={() => handleQuickSelection(item.emotion, item.name)}
                  disabled={isLoading}
                  className={`${item.color} text-white h-20 flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Button>
              ))}
            </div>
            {isLoading && (
              <div className="text-center mt-4">
                <p className="text-muted-foreground">Génération de votre playlist en cours...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fonctionnalités */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Musique Adaptative</h3>
              <p className="text-muted-foreground">
                Notre IA génère de la musique parfaitement adaptée à votre état émotionnel
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Disponible 24/7</h3>
              <p className="text-muted-foreground">
                Accédez à votre thérapie musicale à tout moment, où que vous soyez
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personnalisé</h3>
              <p className="text-muted-foreground">
                Chaque playlist est unique et créée spécialement pour vous
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Comment ça fonctionne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <p>Choisissez votre émotion actuelle en cliquant sur l'un des boutons ci-dessus</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <p>Notre IA génère instantanément une playlist personnalisée</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <p>Relaxez-vous et laissez la musique vous accompagner</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lecteur automatique */}
      {generatedPlaylist && (
        <AutoMusicPlayer 
          playlist={generatedPlaylist}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default MusicPage;
