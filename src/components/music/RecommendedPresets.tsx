
import React from 'react';
import { Music, PlayCircle, Heart, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { Emotion } from '@/types';

// Map emotions to music presets
const EMOTION_PRESET_MAP: Record<string, { name: string, emotion: string, description: string, icon: React.ReactNode }[]> = {
  happy: [
    { 
      name: 'Playlist Joyeuse', 
      emotion: 'happy', 
      description: 'Sons énergisants pour amplifier votre bonne humeur',
      icon: <Sparkles className="h-5 w-5 text-amber-500" />
    },
    { 
      name: 'Énergie Positive', 
      emotion: 'energetic', 
      description: 'Dynamique et motivante pour rester dans l\'action',
      icon: <Heart className="h-5 w-5 text-rose-500" />
    }
  ],
  sad: [
    { 
      name: 'Réconfort Apaisant', 
      emotion: 'calm', 
      description: 'Sons apaisants pour vous aider à retrouver la sérénité',
      icon: <Music className="h-5 w-5 text-blue-500" />
    },
    { 
      name: 'Transformation Émotionnelle', 
      emotion: 'neutral', 
      description: 'Transition vers un état d\'esprit plus équilibré',
      icon: <Sparkles className="h-5 w-5 text-purple-500" />
    }
  ],
  stressed: [
    { 
      name: 'Anti-Stress', 
      emotion: 'calm', 
      description: 'Détente profonde pour réduire les tensions',
      icon: <Music className="h-5 w-5 text-blue-500" />
    },
    { 
      name: 'Focus & Calme', 
      emotion: 'focused', 
      description: 'Concentration et apaisement pour retrouver le contrôle',
      icon: <Sparkles className="h-5 w-5 text-indigo-500" />
    }
  ],
  neutral: [
    { 
      name: 'Équilibre Sonore', 
      emotion: 'neutral', 
      description: 'Maintien de votre état d\'esprit équilibré',
      icon: <Sparkles className="h-5 w-5 text-emerald-500" />
    },
    { 
      name: 'Boost de Créativité', 
      emotion: 'focused', 
      description: 'Stimulation de l\'imagination et de la créativité',
      icon: <Heart className="h-5 w-5 text-violet-500" />
    }
  ],
  // Default presets when no emotion is detected
  default: [
    { 
      name: 'Sons Relaxants', 
      emotion: 'calm', 
      description: 'Ambiance apaisante pour la détente',
      icon: <Music className="h-5 w-5 text-blue-500" />
    },
    { 
      name: 'Énergie Positive', 
      emotion: 'happy', 
      description: 'Boost musical pour améliorer votre humeur',
      icon: <Sparkles className="h-5 w-5 text-amber-500" />
    }
  ]
};

// Helper function to get presets based on emotion
const getPresetsForEmotion = (emotion: Emotion | null) => {
  if (!emotion) return EMOTION_PRESET_MAP.default;
  
  let key = 'default';
  if (emotion.emotion) {
    const lowerCaseEmotion = emotion.emotion.toLowerCase();
    if (lowerCaseEmotion.includes('heureux') || lowerCaseEmotion.includes('joie')) {
      key = 'happy';
    } else if (lowerCaseEmotion.includes('triste') || lowerCaseEmotion.includes('tristesse')) {
      key = 'sad';
    } else if (lowerCaseEmotion.includes('stress') || lowerCaseEmotion.includes('anxiété') || 
               lowerCaseEmotion.includes('anxieux') || lowerCaseEmotion.includes('nerveux')) {
      key = 'stressed';
    } else if (lowerCaseEmotion.includes('neutre') || lowerCaseEmotion.includes('calme')) {
      key = 'neutral';
    }
  }
  
  return EMOTION_PRESET_MAP[key] || EMOTION_PRESET_MAP.default;
};

interface RecommendedPresetsProps {
  emotion: Emotion | null;
}

const RecommendedPresets: React.FC<RecommendedPresetsProps> = ({ emotion }) => {
  const { loadPlaylistForEmotion } = useMusic();
  const { toast } = useToast();
  
  const presets = getPresetsForEmotion(emotion);
  
  const handlePlayPreset = (preset: { name: string, emotion: string }) => {
    loadPlaylistForEmotion(preset.emotion);
    
    toast({
      title: `Playlist ${preset.name} activée`,
      description: "La musique commence à jouer",
    });
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Recommandations musicales</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {presets.map((preset) => (
          <Card key={preset.name} className="hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                {preset.icon}
                <span className="ml-2">{preset.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                {preset.description}
              </p>
              <Button 
                onClick={() => handlePlayPreset(preset)}
                className="w-full"
                variant="outline"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Écouter
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPresets;
