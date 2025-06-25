
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useMood } from '@/hooks/useMood';
import { Play, Pause, RotateCcw, Palette, Music } from 'lucide-react';

const MoodMixerPage: React.FC = () => {
  const { mood, updateMood, isLoading } = useMood();
  const [valence, setValence] = useState(50);
  const [arousal, setArousal] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  useEffect(() => {
    if (mood) {
      setValence(mood.valence);
      setArousal(mood.arousal);
    }
  }, [mood]);

  // Générer une playlist basée sur valence/arousal
  const generatePlaylist = () => {
    const energy = arousal;
    const positivity = valence;

    if (positivity > 70 && energy > 70) {
      return {
        genre: 'Pop Énergique',
        tracks: ['Upbeat Summer', 'Feel Good Vibes', 'Energy Boost'],
        color: 'from-yellow-400 to-orange-500'
      };
    } else if (positivity > 70 && energy < 30) {
      return {
        genre: 'Chill Pop',
        tracks: ['Sunny Afternoon', 'Gentle Waves', 'Peaceful Moments'],
        color: 'from-green-400 to-blue-400'
      };
    } else if (positivity < 30 && energy > 70) {
      return {
        genre: 'Rock Motivant',
        tracks: ['Rise Up', 'Break Through', 'Fight Back'],
        color: 'from-red-400 to-orange-500'
      };
    } else {
      return {
        genre: 'Ambient Relaxant',
        tracks: ['Deep Calm', 'Meditation Flow', 'Inner Peace'],
        color: 'from-purple-400 to-indigo-500'
      };
    }
  };

  const playlist = generatePlaylist();

  const handleMoodUpdate = async () => {
    await updateMood({ valence, arousal, timestamp: Date.now() });
  };

  const resetToDefault = () => {
    setValence(50);
    setArousal(50);
  };

  const playTrack = (track: string) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Simulation de lecture
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentTrack(null);
    }, 3000);
  };

  const getMoodLabel = () => {
    if (valence > 70 && arousal > 70) return 'Euphorique';
    if (valence > 70 && arousal < 30) return 'Serein';
    if (valence < 30 && arousal > 70) return 'Tendu';
    if (valence < 30 && arousal < 30) return 'Mélancolique';
    return 'Équilibré';
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="h-8 w-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mood Mixer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ajustez votre humeur et découvrez une playlist personnalisée
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contrôles d'humeur */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                Ajustement d'Humeur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Valence (Positivité) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Positivité</label>
                  <Badge variant="outline" className="bg-white/50">
                    {valence}%
                  </Badge>
                </div>
                <Slider
                  value={[valence]}
                  onValueChange={(value) => setValence(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Négatif</span>
                  <span>Positif</span>
                </div>
              </div>

              {/* Arousal (Énergie) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Énergie</label>
                  <Badge variant="outline" className="bg-white/50">
                    {arousal}%
                  </Badge>
                </div>
                <Slider
                  value={[arousal]}
                  onValueChange={(value) => setArousal(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Calme</span>
                  <span>Excité</span>
                </div>
              </div>

              {/* État d'humeur actuel */}
              <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {getMoodLabel()}
                </div>
                <div className="text-sm text-gray-600">
                  Votre état d'humeur actuel
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleMoodUpdate}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={isLoading}
                >
                  Appliquer
                </Button>
                <Button onClick={resetToDefault} variant="outline" size="icon">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Playlist générée */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className={`bg-gradient-to-r ${playlist.color} text-white`}>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                {playlist.genre}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Playlist générée pour votre humeur actuelle
                </p>

                {playlist.tracks.map((track, index) => (
                  <div 
                    key={track}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{track}</div>
                        <div className="text-sm text-gray-500">3:24</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => playTrack(track)}
                      size="sm"
                      variant="outline"
                      disabled={currentTrack === track && isPlaying}
                    >
                      {currentTrack === track && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-sm text-gray-600 text-center">
                    🎵 Playlist adaptée à votre humeur
                    <br />
                    <span className="font-medium">
                      {getMoodLabel()} • {playlist.genre}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {currentTrack && isPlaying && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <div>
                  <div className="font-medium">En cours de lecture</div>
                  <div className="text-sm text-gray-500">{currentTrack}</div>
                </div>
                <Button 
                  onClick={() => setIsPlaying(false)}
                  size="sm"
                  variant="outline"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodMixerPage;
