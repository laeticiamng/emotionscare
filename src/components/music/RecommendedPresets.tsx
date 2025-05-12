import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Heart, Brain, Sun, Moon } from 'lucide-react';
import MusicPresetCard from './MusicPresetCard';
import { useMusic } from '@/contexts/MusicContext';

interface PresetProps {
  name: string;
  description: string;
  genre: string;
  mood: string;
  tempo: number;
  duration: number;
  instruments?: string[];
  icon: React.ReactNode;
}

interface RecommendedPresetsProps {
  onSelectPreset: (preset: Omit<PresetProps, 'icon' | 'description'>) => void;
  emotion?: any;
}

const presets: PresetProps[] = [
  {
    name: "Méditation matinale",
    description: "Sons apaisants pour bien commencer la journée",
    genre: "ambient",
    mood: "calm",
    tempo: 70,
    duration: 180,
    instruments: ["piano", "strings"],
    icon: <Sun className="h-4 w-4" />
  },
  {
    name: "Concentration profonde",
    description: "Rythme idéal pour le travail intellectuel",
    genre: "lofi",
    mood: "focused",
    tempo: 85,
    duration: 240,
    instruments: ["piano", "synth"],
    icon: <Brain className="h-4 w-4" />
  },
  {
    name: "Relaxation du soir",
    description: "Mélodies douces pour se détendre avant le coucher",
    genre: "classical",
    mood: "melancholic",
    tempo: 60,
    duration: 300,
    instruments: ["piano", "strings", "flute"],
    icon: <Moon className="h-4 w-4" />
  },
  {
    name: "Énergie positive",
    description: "Rythmes dynamisants pour rester motivé",
    genre: "electronic",
    mood: "happy",
    tempo: 120,
    duration: 150,
    instruments: ["synth", "percussion"],
    icon: <Heart className="h-4 w-4" />
  },
];

const RecommendedPresets: React.FC<RecommendedPresetsProps> = ({ onSelectPreset, emotion }) => {
  const { currentEmotion = 'neutral' } = useMusic();
  const [activePreset, setActivePreset] = useState<string | null>(null);
  
  // You can use the emotion prop here to customize presets if needed
  // For example, filtering or sorting presets based on the emotion

  // Function to handle preset selection
  const handleSelectPreset = (preset: PresetProps) => {
    setActivePreset(preset.name);
    onSelectPreset({
      name: preset.name,
      genre: preset.genre,
      mood: preset.mood,
      tempo: preset.tempo,
      duration: preset.duration,
      instruments: preset.instruments,
    });
  };
  
  // Get recommended preset based on emotion if available
  const getRecommendedPreset = () => {
    if (!emotion || !emotion.emojis) return null;
    
    // Map emoticons to moods
    const emojiMoodMap: Record<string, string> = {
      '😊': 'happy',
      '😄': 'happy',
      '😢': 'melancholic',
      '😭': 'melancholic',
      '😡': 'calm', // calming for anger
      '😠': 'calm',
      '😰': 'calm',
      '😨': 'calm',
      '😌': 'calm',
      '🧠': 'focused',
      '🧘': 'calm'
    };
    
    // Try to match emoji with a mood
    for (const char of emotion.emojis) {
      if (emojiMoodMap[char]) {
        const matchingPresets = presets.filter(p => p.mood === emojiMoodMap[char]);
        if (matchingPresets.length > 0) {
          return matchingPresets[0];
        }
      }
    }
    
    return null;
  };
  
  const recommendedPreset = getRecommendedPreset();
  
  return (
    <div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Music className="mr-2 h-5 w-5" />
            Ambiances musicales recommandées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendedPreset && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium">Recommandé pour votre humeur {emotion?.emojis}:</p>
              <MusicPresetCard 
                preset={recommendedPreset} 
                onSelect={handleSelectPreset}
                isActive={activePreset === recommendedPreset.name || currentEmotion === recommendedPreset.mood}
              />
            </div>
          )}
          
          <div className="space-y-3">
            {presets.map((preset) => (
              <MusicPresetCard 
                key={preset.name} 
                preset={preset} 
                onSelect={handleSelectPreset}
                isActive={activePreset === preset.name || currentEmotion === preset.mood} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendedPresets;
