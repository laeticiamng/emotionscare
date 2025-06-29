
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Play, Loader2 } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import AutoMusicPlayer from '@/components/music/AutoMusicPlayer';

const MusicPage: React.FC = () => {
  const { activateMusicForEmotion, getEmotionMusicDescription, isLoading } = useMusicEmotionIntegration();
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [generatedPlaylist, setGeneratedPlaylist] = useState<any>(null);
  
  const emotions = [
    { value: 'calm', label: 'Calme' },
    { value: 'happy', label: 'Heureux' },
    { value: 'energetic', label: 'Énergique' },
    { value: 'sad', label: 'Triste' },
    { value: 'focused', label: 'Concentré' },
    { value: 'relaxed', label: 'Détendu' }
  ];
  
  const handleGenerateMusic = async () => {
    if (!selectedEmotion) return;
    
    try {
      console.log('🎵 Génération de musique pour:', selectedEmotion);
      
      const playlist = await activateMusicForEmotion({
        emotion: selectedEmotion,
        intensity: 0.7
      });
      
      if (playlist) {
        console.log('✅ Playlist générée:', playlist);
        setGeneratedPlaylist(playlist);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
    }
  };
  
  const handleClosePlayer = () => {
    setGeneratedPlaylist(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Générateur de Musique
          </h1>
          <p className="text-lg text-gray-600">
            Créez des playlists personnalisées selon votre état émotionnel
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Music className="h-6 w-6 text-purple-600" />
              Sélection d'émotion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Choisissez votre état émotionnel :
              </label>
              <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une émotion..." />
                </SelectTrigger>
                <SelectContent>
                  {emotions.map((emotion) => (
                    <SelectItem key={emotion.value} value={emotion.value}>
                      {emotion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedEmotion && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  {getEmotionMusicDescription(selectedEmotion)}
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleGenerateMusic}
              disabled={!selectedEmotion || isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Générer la playlist
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {generatedPlaylist && (
          <AutoMusicPlayer 
            playlist={generatedPlaylist}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </div>
  );
};

export default MusicPage;
