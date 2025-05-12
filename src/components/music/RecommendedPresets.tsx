
import React, { useEffect, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import MusicPresetCard from './MusicPresetCard';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface Preset {
  name: string;
  description?: string;
  genre?: string;
  mood?: string;
  tempo?: number;
  duration?: number;
  instruments?: string[];
  icon?: React.ReactNode;
}

const EMOTION_PRESETS: Record<string, Preset[]> = {
  calm: [
    { name: "Méditation Profonde", description: "Sons apaisants pour la méditation", mood: "calm" },
    { name: "Relaxation Complète", description: "Mélodies douces et calmes", mood: "calm" }
  ],
  happy: [
    { name: "Énergie Positive", description: "Rythmes joyeux et entraînants", mood: "happy" },
    { name: "Célébration", description: "Musique festive et enjouée", mood: "happy" }
  ],
  sad: [
    { name: "Réconfort", description: "Compositions mélancoliques apaisantes", mood: "sad" },
    { name: "Introspection", description: "Mélodies douces pour la réflexion", mood: "sad" }
  ],
  focused: [
    { name: "Concentration", description: "Ambient minimaliste pour le travail", mood: "focused" },
    { name: "Productivité", description: "Rythmes constants sans distractions", mood: "focused" }
  ],
  default: [
    { name: "Équilibre", description: "Musique équilibrée pour tout moment", mood: "neutral" },
    { name: "Harmonie", description: "Compositions adaptatives", mood: "neutral" }
  ]
};

const RecommendedPresets: React.FC = () => {
  const { currentEmotion, loadPlaylistForEmotion } = useMusic();
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    // Get presets based on current emotion or use default
    const emotionKey = currentEmotion || 'default';
    const emotionPresets = EMOTION_PRESETS[emotionKey] || EMOTION_PRESETS.default;
    setPresets(emotionPresets);
  }, [currentEmotion]);

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPreset(preset);
    
    // Load corresponding playlist if mood is available
    if (preset.mood) {
      loadPlaylistForEmotion(preset.mood);
    }
  };
  
  const handleRefresh = () => {
    // In a real app, this would fetch new recommendations
    // For now, we'll just shuffle the existing presets
    setPresets([...presets].sort(() => Math.random() - 0.5));
  };
  
  if (presets.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Aucun preset recommandé disponible</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Recommandés pour vous</h3>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {presets.map((preset) => (
          <MusicPresetCard
            key={preset.name}
            preset={preset}
            onSelect={handleSelectPreset}
            isActive={selectedPreset?.name === preset.name}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedPresets;
