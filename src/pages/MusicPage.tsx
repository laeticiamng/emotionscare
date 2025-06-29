
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Music, Play, Pause, Volume2, Heart, Zap, Sun, CloudRain } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import AutoMusicPlayer from '@/components/music/AutoMusicPlayer';
import { useHume } from '@/hooks/useHume';
import { toast } from 'sonner';

const MusicPage: React.FC = () => {
  const { activateMusicForEmotion, isLoading } = useMusicEmotionIntegration();
  const { startEmotionScan, isAnalyzing, lastEmotionResult } = useHume();
  const [generatedPlaylist, setGeneratedPlaylist] = useState<any>(null);
  const [customDescription, setCustomDescription] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  // Sélection rapide d'émotions
  const quickEmotions = [
    { name: 'Énergique', emotion: 'energetic', icon: Zap, color: 'bg-orange-500' },
    { name: 'Calme', emotion: 'calm', icon: CloudRain, color: 'bg-blue-500' },
    { name: 'Joyeux', emotion: 'happy', icon: Sun, color: 'bg-yellow-500' },
    { name: 'Triste', emotion: 'sad', icon: Heart, color: 'bg-purple-500' }
  ];

  const handleQuickEmotion = async (emotion: string) => {
    try {
      console.log(`🎵 Génération musique pour émotion: ${emotion}`);
      const playlist = await activateMusicForEmotion({
        emotion,
        intensity: 0.7
      });
      
      if (playlist) {
        setGeneratedPlaylist(playlist);
        toast.success('Musique générée avec succès !');
      }
    } catch (error) {
      console.error('Erreur génération musique:', error);
      toast.error('Erreur lors de la génération musicale');
    }
  };

  const handleEmotionScan = async () => {
    try {
      toast.info('Analyse émotionnelle en cours...', { duration: 3000 });
      await startEmotionScan(5);
      
      // Attendre un peu que le résultat soit disponible
      setTimeout(async () => {
        if (lastEmotionResult?.emotion) {
          console.log('🎭 Émotion détectée:', lastEmotionResult.emotion);
          const playlist = await activateMusicForEmotion({
            emotion: lastEmotionResult.emotion.toLowerCase(),
            intensity: lastEmotionResult.confidence || 0.5
          });
          
          if (playlist) {
            setGeneratedPlaylist(playlist);
            toast.success(`Musique adaptée à votre émotion: ${lastEmotionResult.emotion}`);
          }
        }
      }, 1000);
    } catch (error) {
      console.error('Erreur scan émotionnel:', error);
      toast.error('Erreur lors du scan émotionnel');
    }
  };

  const handleCustomGeneration = async () => {
    if (!customDescription.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setIsGeneratingCustom(true);
    try {
      console.log(`🎼 Génération personnalisée: ${customDescription}`);
      
      // Analyser la description pour déterminer l'émotion
      let detectedEmotion = 'calm';
      const description = customDescription.toLowerCase();
      
      if (description.includes('énergique') || description.includes('dynamique') || description.includes('sport')) {
        detectedEmotion = 'energetic';
      } else if (description.includes('triste') || description.includes('mélancolique')) {
        detectedEmotion = 'sad';
      } else if (description.includes('joyeux') || description.includes('heureux') || description.includes('fête')) {
        detectedEmotion = 'happy';
      } else if (description.includes('stressé') || description.includes('anxieux')) {
        detectedEmotion = 'anxious';
      }

      const playlist = await activateMusicForEmotion({
        emotion: detectedEmotion,
        intensity: 0.6,
        preferences: {
          genre: description.includes('piano') ? ['classical', 'ambient'] : undefined,
          instrumental: description.includes('instrumental') || description.includes('piano')
        }
      });
      
      if (playlist) {
        setGeneratedPlaylist(playlist);
        toast.success('Musique personnalisée générée !');
      }
    } catch (error) {
      console.error('Erreur génération personnalisée:', error);
      toast.error('Erreur lors de la génération personnalisée');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const handleClosePlayer = () => {
    setGeneratedPlaylist(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">
          Musicothérapie EmotionsCare
        </h1>
        <p className="text-muted-foreground text-lg">
          Musique thérapeutique adaptée à votre état émotionnel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sélection rapide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Sélection rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickEmotions.map((item) => (
                <Button
                  key={item.emotion}
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={() => handleQuickEmotion(item.emotion)}
                  disabled={isLoading}
                >
                  <div className={`${item.color} p-2 rounded-full text-white`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span>{item.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scanner émotionnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Scanner émotionnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Analysez votre état émotionnel en temps réel
              </p>
              <Button
                onClick={handleEmotionScan}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? 'Analyse en cours...' : 'Scanner mon émotion'}
              </Button>
              
              {lastEmotionResult && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Émotion détectée:</strong> {lastEmotionResult.emotion}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Confiance: {Math.round((lastEmotionResult.confidence || 0) * 100)}%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Génération manuelle */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Génération manuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Description personnalisée</label>
                <Textarea
                  placeholder="Décrivez l'ambiance musicale souhaitée (ex: piano relaxant, musique énergique pour le sport...)"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleCustomGeneration}
                disabled={isGeneratingCustom || !customDescription.trim()}
                className="w-full"
              >
                {isGeneratingCustom ? 'Génération en cours...' : 'Générer la musique'}
              </Button>
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
