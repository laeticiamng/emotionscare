import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Headphones, Sparkles } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { useHume } from '@/hooks/useHume';
import { toast } from 'sonner';

const MusicPage: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    play, 
    pause, 
    nextTrack, 
    prevTrack, 
    setVolume 
  } = useMusic();
  
  const { activateMusicForEmotion, isLoading: musicLoading } = useMusicEmotionIntegration();
  const { startAnalysis, isAnalyzing } = useHume();
  
  const [manualEmotion, setManualEmotion] = useState('');
  const [description, setDescription] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);

  // Fonction pour gérer la sélection rapide
  const handleQuickSelection = async (emotion: string) => {
    console.log(`🎵 Sélection rapide: ${emotion}`);
    setCurrentEmotion(emotion);
    
    try {
      toast.loading('Génération de la playlist en cours...', { id: 'music-generation' });
      
      const result = await activateMusicForEmotion({
        emotion: emotion.toLowerCase(),
        intensity: 0.7
      });
      
      if (result) {
        toast.success(`Playlist ${emotion} générée avec succès !`, { id: 'music-generation' });
        console.log('✅ Playlist générée:', result);
      } else {
        toast.error('Erreur lors de la génération de la playlist', { id: 'music-generation' });
      }
    } catch (error) {
      console.error('❌ Erreur sélection rapide:', error);
      toast.error('Erreur lors de la génération de la playlist', { id: 'music-generation' });
    }
  };

  // Fonction pour scanner l'émotion
  const handleEmotionScan = async () => {
    console.log('🔍 Démarrage du scan émotionnel');
    
    try {
      toast.loading('Analyse de votre émotion...', { id: 'emotion-scan' });
      
      const emotionResult = await startAnalysis();
      
      if (emotionResult && emotionResult.emotion) {
        console.log('✅ Émotion détectée:', emotionResult.emotion);
        setCurrentEmotion(emotionResult.emotion);
        
        toast.success(`Émotion détectée: ${emotionResult.emotion}`, { id: 'emotion-scan' });
        
        // Générer automatiquement la musique pour cette émotion
        await handleQuickSelection(emotionResult.emotion);
      } else {
        toast.error('Impossible de détecter votre émotion', { id: 'emotion-scan' });
      }
    } catch (error) {
      console.error('❌ Erreur scan émotionnel:', error);
      toast.error('Erreur lors de l\'analyse émotionnelle', { id: 'emotion-scan' });
    }
  };

  // Fonction pour la génération manuelle
  const handleManualGeneration = async () => {
    if (!manualEmotion.trim()) {
      toast.error('Veuillez saisir une émotion');
      return;
    }

    console.log(`🎵 Génération manuelle: ${manualEmotion}`);
    
    try {
      toast.loading('Génération personnalisée...', { id: 'manual-generation' });
      
      const result = await activateMusicForEmotion({
        emotion: manualEmotion.toLowerCase(),
        intensity: 0.7
      });
      
      if (result) {
        setCurrentEmotion(manualEmotion);
        toast.success('Playlist personnalisée générée !', { id: 'manual-generation' });
      } else {
        toast.error('Erreur lors de la génération', { id: 'manual-generation' });
      }
    } catch (error) {
      console.error('❌ Erreur génération manuelle:', error);
      toast.error('Erreur lors de la génération', { id: 'manual-generation' });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Music className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Thérapie Musicale</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez des playlists personnalisées adaptées à votre état émotionnel pour améliorer votre bien-être
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélection rapide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Sélection rapide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleQuickSelection('Énergique')}
                disabled={musicLoading}
                variant="outline"
                className="h-12 text-sm font-medium hover:bg-orange-50 hover:border-orange-300"
              >
                🔥 Énergique
              </Button>
              <Button 
                onClick={() => handleQuickSelection('Calme')}
                disabled={musicLoading}
                variant="outline"
                className="h-12 text-sm font-medium hover:bg-blue-50 hover:border-blue-300"
              >
                🧘 Calme
              </Button>
              <Button 
                onClick={() => handleQuickSelection('Heureux')}
                disabled={musicLoading}
                variant="outline"
                className="h-12 text-sm font-medium hover:bg-yellow-50 hover:border-yellow-300"
              >
                😊 Heureux
              </Button>
              <Button 
                onClick={() => handleQuickSelection('Triste')}
                disabled={musicLoading}
                variant="outline"
                className="h-12 text-sm font-medium hover:bg-purple-50 hover:border-purple-300"
              >
                😢 Triste
              </Button>
            </div>
            {currentEmotion && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">
                  État sélectionné: <span className="text-primary">{currentEmotion}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scanner émotionnel */}
        <Card>
          <CardHeader>
            <CardTitle>Scanner émotionnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Laissez l'IA analyser votre état émotionnel actuel
            </p>
            <Button 
              onClick={handleEmotionScan}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyse en cours...' : 'Scanner mon émotion'}
            </Button>
            {currentEmotion && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800">
                  Émotion détectée: {currentEmotion}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Génération manuelle */}
        <Card>
          <CardHeader>
            <CardTitle>Génération manuelle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emotion">Émotion cible</Label>
              <Input 
                id="emotion"
                value={manualEmotion}
                onChange={(e) => setManualEmotion(e.target.value)}
                placeholder="ex: motivé, détendu, concentré..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description personnalisée</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre humeur ou vos préférences musicales..."
                rows={3}
              />
            </div>
            <Button 
              onClick={handleManualGeneration}
              disabled={musicLoading || !manualEmotion.trim()}
              className="w-full"
            >
              {musicLoading ? 'Génération...' : 'Générer la musique'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lecteur musical */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Lecteur
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentTrack ? (
            <div className="space-y-6">
              {/* Info du morceau */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
                <p className="text-muted-foreground">{currentTrack.artist}</p>
              </div>

              {/* Contrôles de lecture */}
              <div className="flex items-center justify-center space-x-4">
                <Button variant="ghost" size="icon" onClick={prevTrack}>
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button 
                  variant="default" 
                  size="icon" 
                  className="h-12 w-12 rounded-full"
                  onClick={isPlaying ? pause : play}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={nextTrack}>
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* Contrôle du volume */}
              <div className="flex items-center space-x-3">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              {/* Statut */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isPlaying ? '▶️ En cours de lecture' : '⏸️ En pause'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Music className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                Sélectionnez une émotion pour commencer à écouter de la musique
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicPage;
