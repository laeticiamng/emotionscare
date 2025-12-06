import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Play, 
  Pause, 
  Shuffle, 
  SkipForward, 
  Volume2,
  Heart,
  Zap,
  Focus,
  Music
} from 'lucide-react';

interface BlendState {
  joy: number;
  calm: number;
  energy: number;
  focus: number;
}

interface MoodControlsProps {
  blend: BlendState;
  onBlendChange: (blend: Partial<BlendState>) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onShuffle: () => void;
  onNext: () => void;
  currentMixName?: string;
}

const moodSliders = [
  { 
    key: 'joy' as keyof BlendState, 
    label: 'Joie', 
    icon: Heart, 
    color: 'from-pink-500 to-red-500',
    textColor: 'text-pink-500'
  },
  { 
    key: 'calm' as keyof BlendState, 
    label: 'Calme', 
    icon: Focus, 
    color: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-500'
  },
  { 
    key: 'energy' as keyof BlendState, 
    label: 'Énergie', 
    icon: Zap, 
    color: 'from-yellow-500 to-orange-500',
    textColor: 'text-orange-500'
  },
  { 
    key: 'focus' as keyof BlendState, 
    label: 'Concentration', 
    icon: Music, 
    color: 'from-green-500 to-emerald-500',
    textColor: 'text-green-500'
  }
];

const MoodControls: React.FC<MoodControlsProps> = ({
  blend,
  onBlendChange,
  isPlaying,
  onPlay,
  onPause,
  onShuffle,
  onNext,
  currentMixName = 'Mix Personnalisé'
}) => {
  
  const handleSliderChange = (key: keyof BlendState, value: number[]) => {
    onBlendChange({ [key]: value[0] / 100 });
  };

  return (
    <Card className="bg-gradient-to-br from-background to-muted/20 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Palette className="h-6 w-6 text-primary" />
          {currentMixName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Mood Sliders */}
        <div className="space-y-6">
          {moodSliders.map(({ key, label, icon: Icon, color, textColor }) => (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${textColor}`} />
                  {label}
                </label>
                <Badge variant="outline" className="min-w-[50px]">
                  {Math.round(blend[key] * 100)}%
                </Badge>
              </div>
              
              <Slider
                value={[blend[key] * 100]}
                onValueChange={(value) => handleSliderChange(key, value)}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              
              <div className={`h-2 rounded-full bg-gradient-to-r ${color} opacity-30`} />
            </div>
          ))}
        </div>

        {/* Playback Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-12 rounded-full"
              onClick={onShuffle}
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
              onClick={isPlaying ? onPause : onPlay}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-12 rounded-full"
              onClick={onNext}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              defaultValue={[70]}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        </div>

        {/* Mix Info */}
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            Ambiance générée selon vos paramètres
          </div>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">
              IA Musicale
            </Badge>
            {isPlaying && (
              <Badge className="bg-green-500">
                En lecture
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodControls;