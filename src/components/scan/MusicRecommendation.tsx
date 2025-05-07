
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, PlayCircle, Headphones } from 'lucide-react';
import type { Emotion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AudioVisualizer from '@/components/music/AudioVisualizer';

// Enhanced emotion to music type mapping
const EMOTION_MUSIC_MAP: Record<string, { 
  type: string, 
  description: string,
  visualizer: 'bars' | 'circle' | 'wave',
  color: string
}> = {
  '😊': { 
    type: 'happy', 
    description: 'Profitez de cette énergie positive avec une playlist enjouée',
    visualizer: 'bars',
    color: '#F59E0B'
  },
  '😄': { 
    type: 'happy', 
    description: 'Une playlist dynamique pour prolonger votre bonne humeur',
    visualizer: 'bars',
    color: '#FBBF24'
  },
  '😢': { 
    type: 'calm', 
    description: 'Une ambiance apaisante pour vous aider à retrouver la sérénité',
    visualizer: 'wave',
    color: '#3B82F6'
  },
  '😭': { 
    type: 'calm', 
    description: 'Des mélodies douces pour accompagner vos émotions',
    visualizer: 'wave',
    color: '#60A5FA'
  },
  '😡': { 
    type: 'calm', 
    description: 'Une ambiance apaisante qui vous aidera à vous détendre',
    visualizer: 'wave',
    color: '#3B82F6'
  },
  '😠': { 
    type: 'calm', 
    description: 'Des sons relaxants pour apaiser votre frustration',
    visualizer: 'wave',
    color: '#60A5FA'
  },
  '😰': { 
    type: 'calm', 
    description: 'De la musique relaxante pour diminuer votre anxiété',
    visualizer: 'wave',
    color: '#3B82F6'
  },
  '😨': { 
    type: 'calm', 
    description: 'Une ambiance sonore qui vous aidera à vous recentrer',
    visualizer: 'wave',
    color: '#3B82F6'
  },
  '😌': { 
    type: 'neutral', 
    description: 'Une musique équilibrée pour maintenir votre état serein',
    visualizer: 'wave',
    color: '#6366F1'
  },
  '😎': { 
    type: 'energetic', 
    description: 'Une sélection rythmée pour accompagner votre assurance',
    visualizer: 'bars',
    color: '#F59E0B'
  },
  '😐': { 
    type: 'neutral', 
    description: 'Des mélodies pour enrichir votre état émotionnel',
    visualizer: 'bars',
    color: '#6366F1'
  },
  '🧠': { 
    type: 'focused', 
    description: 'Des morceaux pour favoriser la concentration et la clarté mentale',
    visualizer: 'circle',
    color: '#7C3AED'
  },
  '⚡': { 
    type: 'energetic', 
    description: 'Une playlist dynamique pour canaliser votre énergie',
    visualizer: 'bars',
    color: '#F59E0B'
  },
  '🧘': { 
    type: 'calm', 
    description: 'Une musique zen pour accompagner votre méditation',
    visualizer: 'wave',
    color: '#3B82F6'
  },
  '🌧️': { 
    type: 'melancholic', 
    description: 'Des mélodies réconfortantes pour accompagner votre état d\'esprit',
    visualizer: 'wave',
    color: '#6B7280'
  },
  '😔': { 
    type: 'melancholic', 
    description: 'Une ambiance musicale douce pour vous accompagner',
    visualizer: 'wave',
    color: '#6B7280'
  }
};

interface MusicRecommendationProps {
  emotion?: Emotion | null;
}

const MusicRecommendation: React.FC<MusicRecommendationProps> = ({ emotion }) => {
  const { loadPlaylistForEmotion, openDrawer, currentTrack, isPlaying } = useMusic();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!emotion) {
    return null;
  }

  // Determine music type from emojis, fallback to score
  let musicRecommendation = {
    type: 'neutral',
    description: "Une sélection musicale adaptée à votre état émotionnel",
    visualizer: 'bars' as 'bars' | 'circle' | 'wave',
    color: '#6366F1'
  };
  
  if (emotion.emojis) {
    // Try to find a matching emoji
    const firstEmoji = [...emotion.emojis][0]; // Get first character
    if (EMOTION_MUSIC_MAP[firstEmoji]) {
      musicRecommendation = EMOTION_MUSIC_MAP[firstEmoji];
    }
  } else if (emotion.text) {
    // Try to derive from text
    const text = emotion.text.toLowerCase();
    if (text.includes('heureux') || text.includes('joie')) {
      musicRecommendation = EMOTION_MUSIC_MAP['😊'];
    } else if (text.includes('triste')) {
      musicRecommendation = EMOTION_MUSIC_MAP['😔'];
    } else if (text.includes('calme') || text.includes('détendu')) {
      musicRecommendation = EMOTION_MUSIC_MAP['🧘'];
    } else if (text.includes('énerg') || text.includes('dynamique')) {
      musicRecommendation = EMOTION_MUSIC_MAP['⚡'];
    } else if (text.includes('concentr') || text.includes('focus')) {
      musicRecommendation = EMOTION_MUSIC_MAP['🧠'];
    }
  } else if (emotion.score !== undefined) {
    // Derive from score
    if (emotion.score > 75) musicRecommendation = EMOTION_MUSIC_MAP['😊'];
    else if (emotion.score < 40) musicRecommendation = EMOTION_MUSIC_MAP['😔'];
    else if (emotion.score < 55) musicRecommendation = EMOTION_MUSIC_MAP['🧘'];
    else musicRecommendation = EMOTION_MUSIC_MAP['😌'];
  }

  const handlePlayMusic = () => {
    loadPlaylistForEmotion(musicRecommendation.type);
    openDrawer();
    
    toast({
      title: "Playlist activée",
      description: `Votre ambiance musicale "${musicRecommendation.type}" est prête à être écoutée`,
    });
  };

  const handleCreateMusic = () => {
    // Navigate to music generation page
    navigate('/music-generation');
    
    toast({
      title: "Création musicale",
      description: `Créez votre propre musique adaptée à votre humeur "${musicRecommendation.type}"`,
    });
  };

  return (
    <Card className="mt-6 border-t-4 hover:shadow-md transition-all duration-300" style={{ borderTopColor: musicRecommendation.color }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Music className="mr-2 h-5 w-5" />
          Recommandations musicales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <h4 className="font-medium mb-1">
            Basé sur votre état émotionnel:
            <span className="text-primary"> {emotion.emojis || musicRecommendation.type}</span>
          </h4>
          <p className="text-sm text-muted-foreground">
            {musicRecommendation.description}
          </p>
        </div>
        
        {currentTrack && (
          <div className="mb-4 bg-muted/30 p-2 rounded-md">
            <AudioVisualizer 
              audioUrl={currentTrack.url}
              isPlaying={isPlaying}
              variant={musicRecommendation.visualizer}
              height={80}
              primaryColor={musicRecommendation.color}
            />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={handlePlayMusic}
            className="flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform"
            variant="outline"
          >
            <PlayCircle className="h-5 w-5" />
            Écouter la playlist
          </Button>
          
          <Button 
            onClick={handleCreateMusic}
            className="flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform"
            variant="default"
          >
            <Headphones className="h-5 w-5" />
            Créer ma musique
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendation;
