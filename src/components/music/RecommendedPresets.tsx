
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music, Heart, CloudLightning, Smile, Frown } from 'lucide-react';

// Presets pour différentes émotions
const EMOTION_PRESETS = [
  {
    name: "Relaxation profonde",
    emotion: "calm",
    icon: <Heart className="h-5 w-5 text-rose-400" />,
    description: "Mélodies apaisantes pour vous aider à vous détendre"
  },
  {
    name: "Boost d'énergie",
    emotion: "happy",
    icon: <Smile className="h-5 w-5 text-amber-400" />,
    description: "Rythmes entraînants pour vous donner de l'énergie"
  },
  {
    name: "Apaisement",
    emotion: "anxious",
    icon: <CloudLightning className="h-5 w-5 text-blue-400" />,
    description: "Sons calmants pour réduire l'anxiété"
  },
  {
    name: "Réconfort",
    emotion: "sad",
    icon: <Frown className="h-5 w-5 text-purple-400" />,
    description: "Musique douce pour vous accompagner dans les moments difficiles"
  }
];

interface RecommendedPresetsProps {
  className?: string;
}

const RecommendedPresets: React.FC<RecommendedPresetsProps> = ({ className }) => {
  const { loadPlaylistForEmotion, playTrack, currentEmotion } = useMusic();
  
  const handlePresetClick = async (emotion: string) => {
    try {
      const playlist = await loadPlaylistForEmotion(emotion);
      if (playlist && playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la playlist:', error);
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium">Recommandations musicales</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EMOTION_PRESETS.map((preset) => (
          <Card 
            key={preset.emotion}
            className={`hover:bg-muted/30 transition-colors cursor-pointer ${
              currentEmotion === preset.emotion ? 'border-primary border-2' : ''
            }`}
            onClick={() => handlePresetClick(preset.emotion)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {preset.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{preset.name}</h4>
                    <p className="text-sm text-muted-foreground">{preset.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPresets;
