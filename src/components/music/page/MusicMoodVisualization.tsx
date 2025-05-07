
import React, { useState, useEffect } from 'react';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface MusicMoodVisualizationProps {
  mood: string;
  intensity?: number;
}

const MusicMoodVisualization: React.FC<MusicMoodVisualizationProps> = ({ 
  mood,
  intensity = 50
}) => {
  const [localIntensity, setLocalIntensity] = useState(intensity);
  const [muted, setMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  
  // Update local intensity when prop changes
  useEffect(() => {
    setLocalIntensity(intensity);
  }, [intensity]);

  // Get appropriate title based on mood
  const getMoodTitle = () => {
    switch (mood.toLowerCase()) {
      case 'happy': return 'Joie';
      case 'calm': return 'Calme';
      case 'focused': return 'Concentration';
      case 'energetic': return 'Énergie';
      case 'melancholic': return 'Mélancolie';
      default: return mood.charAt(0).toUpperCase() + mood.slice(1);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
    toast({
      title: muted ? "Son activé" : "Son désactivé",
      description: muted ? "La visualisation sonore est maintenant active" : "La visualisation sonore est maintenant muette"
    });
  };
  
  // Toggle expanded view
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'md:col-span-2' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Visualisation pour ambiance "{getMoodTitle()}"</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={toggleMute}
              title={muted ? "Activer le son" : "Désactiver le son"}
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleExpand}
              className="h-8"
              title={isExpanded ? "Réduire la visualisation" : "Agrandir la visualisation"}
            >
              {isExpanded ? (
                <>
                  <Minimize className="h-4 w-4 mr-2" />
                  Réduire
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-2" />
                  Agrandir
                </>
              )}
            </Button>
          </div>
        </div>

        <div className={`transition-all duration-300 ${isExpanded ? 'h-[300px]' : 'h-[180px]'}`}>
          <EnhancedMusicVisualizer 
            emotion={mood}
            height={isExpanded ? 280 : 160}
            showControls={false}
            muted={muted}
            intensity={localIntensity}
          />
        </div>
        
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Intensité</span>
            <span>{localIntensity}%</span>
          </div>
          <Slider
            value={[localIntensity]}
            min={10}
            max={100}
            step={1}
            onValueChange={(value) => setLocalIntensity(value[0])}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicMoodVisualization;
