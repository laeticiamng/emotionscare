
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/music';
import { Heart, PlayCircle, Zap, Smile, Brain, Home, Moon, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmotionMusicParams } from '@/types/music';

interface PresetButtonProps {
  label: string;
  emotion: string;
  intensity: number;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const PresetButton: React.FC<PresetButtonProps> = ({ label, icon, onClick, color }) => (
  <Button
    variant="outline"
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center h-20 w-full gap-1 p-2 border transition-all",
      color
    )}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </Button>
);

const RecommendedPresets: React.FC = () => {
  const { getRecommendationByEmotion, setPlaylist, setCurrentTrack, setOpenDrawer } = useMusic();
  const [loading, setLoading] = useState<string | null>(null);

  const presets = [
    { label: 'Focus', emotion: 'focus', intensity: 70, icon: <Brain size={18} />, color: 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200' },
    { label: 'Détente', emotion: 'calm', intensity: 60, icon: <Moon size={18} />, color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200' },
    { label: 'Énergie', emotion: 'energy', intensity: 80, icon: <Zap size={18} />, color: 'hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200' },
    { label: 'Joie', emotion: 'happy', intensity: 65, icon: <Smile size={18} />, color: 'hover:bg-green-50 hover:text-green-600 hover:border-green-200' },
    { label: 'Ambiance', emotion: 'ambient', intensity: 50, icon: <Home size={18} />, color: 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200' },
    { label: 'Créativité', emotion: 'creative', intensity: 75, icon: <Music size={18} />, color: 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200' },
  ];

  const handleSelectPreset = async (preset: any) => {
    setLoading(preset.label);
    
    try {
      // Create params object
      const params: EmotionMusicParams = {
        emotion: preset.emotion,
        intensity: preset.intensity,
      };
      
      const playlist = await getRecommendationByEmotion(params);
      
      if (playlist && playlist.tracks.length > 0) {
        setPlaylist(playlist);
        setCurrentTrack(playlist.tracks[0]);
        setOpenDrawer(true);
      }
    } catch (error) {
      console.error('Error loading preset:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <PlayCircle className="mr-2 h-4 w-4" />
          Préférences Musicales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {presets.map((preset) => (
            <PresetButton
              key={preset.label}
              label={loading === preset.label ? 'Chargement...' : preset.label}
              emotion={preset.emotion}
              intensity={preset.intensity}
              icon={preset.icon}
              color={preset.color}
              onClick={() => handleSelectPreset(preset)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedPresets;
