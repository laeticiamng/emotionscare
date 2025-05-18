
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Heart, PlayCircle } from 'lucide-react';
import { useMusic } from '@/contexts/music';
import { EmotionMusicParams } from '@/types/music';

// Emotion preset cards for quick selection
const emotionPresets = [
  { emotion: 'calm', label: 'Calme', color: 'bg-blue-100 hover:bg-blue-200', textColor: 'text-blue-700' },
  { emotion: 'happy', label: 'Joyeux', color: 'bg-yellow-100 hover:bg-yellow-200', textColor: 'text-yellow-700' },
  { emotion: 'focus', label: 'Concentré', color: 'bg-purple-100 hover:bg-purple-200', textColor: 'text-purple-700' },
  { emotion: 'energetic', label: 'Énergique', color: 'bg-green-100 hover:bg-green-200', textColor: 'text-green-700' },
  { emotion: 'melancholic', label: 'Mélancolique', color: 'bg-indigo-100 hover:bg-indigo-200', textColor: 'text-indigo-700' },
];

const EmotionMusicRecommendations: React.FC = () => {
  const { getRecommendationByEmotion, setPlaylist, setCurrentTrack, isInitialized } = useMusic();
  const [selectedEmotion, setSelectedEmotion] = useState('calm');
  const [intensity, setIntensity] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendation = async () => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    try {
      // Create EmotionMusicParams object
      const params: EmotionMusicParams = {
        emotion: selectedEmotion,
        intensity: intensity,
      };
      
      const playlist = await getRecommendationByEmotion(params);
      
      if (playlist && playlist.tracks.length > 0) {
        setPlaylist(playlist);
        setCurrentTrack(playlist.tracks[0]);
      }
    } catch (error) {
      console.error('Error getting music recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Musique & Émotions</CardTitle>
        <CardDescription>
          Choisissez une émotion et l'intensité pour obtenir une playlist personnalisée.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
          {emotionPresets.map((preset) => (
            <Button
              key={preset.emotion}
              variant="outline"
              className={`${
                selectedEmotion === preset.emotion ? 'ring-2 ring-offset-2 ring-primary' : ''
              } ${preset.color} ${preset.textColor} border-none`}
              onClick={() => setSelectedEmotion(preset.emotion)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="intensity" className="block text-sm font-medium mb-2">
              Intensité: {intensity}%
            </label>
            <Slider
              id="intensity"
              min={0}
              max={100}
              step={10}
              value={[intensity]}
              onValueChange={(values) => setIntensity(values[0])}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Heart className="h-4 w-4" />
          Favoris
        </Button>
        <Button
          onClick={handleGetRecommendation}
          disabled={isLoading || !isInitialized}
          className="flex items-center gap-1"
        >
          {isLoading ? (
            'Chargement...'
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              Générer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmotionMusicRecommendations;
