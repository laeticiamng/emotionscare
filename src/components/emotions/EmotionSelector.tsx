
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Heart, Zap, Brain, Coffee, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Emotion {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  intensity: number;
}

interface EmotionSelectorProps {
  onEmotionSelect?: (emotion: Emotion) => void;
  selectedEmotion?: Emotion | null;
  showIntensity?: boolean;
  className?: string;
}

const emotions: Emotion[] = [
  { id: 'happy', name: 'Heureux', icon: Smile, color: 'text-green-500', intensity: 0 },
  { id: 'sad', name: 'Triste', icon: Frown, color: 'text-blue-500', intensity: 0 },
  { id: 'neutral', name: 'Neutre', icon: Meh, color: 'text-gray-500', intensity: 0 },
  { id: 'love', name: 'Amour', icon: Heart, color: 'text-red-500', intensity: 0 },
  { id: 'energetic', name: 'Énergique', icon: Zap, color: 'text-yellow-500', intensity: 0 },
  { id: 'focused', name: 'Concentré', icon: Brain, color: 'text-purple-500', intensity: 0 },
  { id: 'stressed', name: 'Stressé', icon: Coffee, color: 'text-orange-500', intensity: 0 },
  { id: 'tired', name: 'Fatigué', icon: Moon, color: 'text-indigo-500', intensity: 0 }
];

const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  onEmotionSelect,
  selectedEmotion,
  showIntensity = true,
  className
}) => {
  const [localSelected, setLocalSelected] = useState<Emotion | null>(selectedEmotion || null);
  const [intensity, setIntensity] = useState(5);

  const handleEmotionClick = (emotion: Emotion) => {
    const emotionWithIntensity = { ...emotion, intensity };
    setLocalSelected(emotionWithIntensity);
    onEmotionSelect?.(emotionWithIntensity);
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Comment vous sentez-vous ?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {emotions.map((emotion) => {
            const Icon = emotion.icon;
            const isSelected = localSelected?.id === emotion.id;
            
            return (
              <motion.div
                key={emotion.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "h-20 w-full flex-col gap-2 relative",
                    isSelected && "ring-2 ring-primary"
                  )}
                  onClick={() => handleEmotionClick(emotion)}
                >
                  <Icon className={cn("h-6 w-6", emotion.color)} />
                  <span className="text-xs">{emotion.name}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge variant="secondary" className="h-5 w-5 p-0 rounded-full">
                        ✓
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
        
        {showIntensity && localSelected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <label className="text-sm font-medium">
              Intensité de l'émotion : {intensity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Faible</span>
              <span>Intense</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionSelector;
