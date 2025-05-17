
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Zap, Brain, Moon } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { toast } from '@/hooks/use-toast';

interface RecommendedPresetsProps {
  className?: string;
}

const RecommendedPresets: React.FC<RecommendedPresetsProps> = ({ className = '' }) => {
  const { loadPlaylistForEmotion } = useMusic();

  const emotionPresets = [
    {
      name: 'Calme',
      emotion: 'calm',
      icon: <Moon className="h-4 w-4" />,
      intensity: 0.8,
    },
    {
      name: 'Concentration',
      emotion: 'focus',
      icon: <Brain className="h-4 w-4" />,
      intensity: 0.9,
    },
    {
      name: 'Énergie',
      emotion: 'energetic',
      icon: <Zap className="h-4 w-4" />,
      intensity: 0.85,
    },
    {
      name: 'Bien-être',
      emotion: 'happy',
      icon: <Heart className="h-4 w-4" />,
      intensity: 0.75,
    },
  ];

  const handlePresetClick = async (preset: { emotion: string; intensity: number }) => {
    try {
      await loadPlaylistForEmotion({
        emotion: preset.emotion,
        intensity: preset.intensity
      });
      
      toast({
        title: `Mode ${preset.emotion} activé`,
        description: 'Votre playlist personnalisée est prête.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la playlist.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {emotionPresets.map((preset) => (
        <Button
          key={preset.emotion}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handlePresetClick(preset)}
        >
          {preset.icon}
          {preset.name}
        </Button>
      ))}
    </div>
  );
};

export default RecommendedPresets;
