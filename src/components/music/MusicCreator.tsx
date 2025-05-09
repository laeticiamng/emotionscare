
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Music2, Play, Pause, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMusic } from '@/contexts/MusicContext';
import MusicPresetCard from './MusicPresetCard';
import EnhancedMusicVisualizer from './EnhancedMusicVisualizer';
import { safeOpen } from '@/lib/utils';

interface MusicCreatorProps {
  // Add props if needed
}

const MusicCreator: React.FC<MusicCreatorProps> = () => {
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(50);
  const [mood, setMood] = useState('calm');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const { setOpenDrawer } = useMusic();
  
  const [selectedPreset, setSelectedPreset] = useState<any>(null);

  const handleTempoChange = (values: number[]) => {
    setTempo(values[0]);
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleGenerateMusic = async () => {
    setIsLoading(true);
    
    // Simulate music generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    toast({
      title: "Musique générée",
      description: "Votre musique personnalisée est prête à être écoutée!",
    });
    safeOpen(setOpenDrawer);
  };
  
  const musicPresets = [
    {
      name: 'Relaxation',
      description: 'Ambiance douce pour la détente',
      genre: 'Ambient',
      mood: 'Calm',
      tempo: 90,
      duration: 180,
      icon: <Music2 className="h-4 w-4" />
    },
    {
      name: 'Concentration',
      description: 'Rythmes pour la concentration',
      genre: 'Lo-Fi',
      mood: 'Focused',
      tempo: 110,
      duration: 240,
      icon: <Music2 className="h-4 w-4" />
    },
    {
      name: 'Énergie',
      description: 'Morceaux pour la motivation',
      genre: 'Electro',
      mood: 'Energetic',
      tempo: 130,
      duration: 150,
      icon: <Music2 className="h-4 w-4" />
    },
    {
      name: 'Joie',
      description: 'Mélodies pour la bonne humeur',
      genre: 'Pop',
      mood: 'Happy',
      tempo: 120,
      duration: 200,
      icon: <Music2 className="h-4 w-4" />
    },
  ];
  
  const handlePresetSelect = (preset: any) => {
    setSelectedPreset(preset);
    setTempo(preset.tempo);
    setMood(preset.mood);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Créateur de musique IA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {musicPresets.map((preset) => (
            <MusicPresetCard
              key={preset.name}
              preset={preset}
              onSelect={handlePresetSelect}
              isActive={selectedPreset?.name === preset.name}
            />
          ))}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tempo ({tempo} BPM)</h3>
          <Slider
            defaultValue={[tempo]}
            max={200}
            step={1}
            onValueChange={handleTempoChange}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Volume ({volume}%)</h3>
          <Slider
            defaultValue={[volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            disabled={isLoading}
          />
        </div>
        
        <EnhancedMusicVisualizer 
          emotion={mood}
          intensity={volume}
          volume={volume / 100}
        />
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            disabled={isLoading}
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Play
              </>
            )}
          </Button>
          
          <Button 
            disabled={isLoading}
            onClick={handleGenerateMusic}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              "Générer ma musique"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicCreator;
