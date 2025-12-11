import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Smile, Frown, Meh, Heart, Zap, CloudRain, Coffee, Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmotionCircleSelectorProps {
  onSelect: (emotion: string, intensity?: number) => void;
  selected: string | null;
  showIntensity?: boolean;
}

interface Emotion {
  name: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  ringColor: string;
}

const EmotionCircleSelector: React.FC<EmotionCircleSelectorProps> = ({
  onSelect,
  selected,
  showIntensity = true,
}) => {
  const [intensity, setIntensity] = useState(50);

  const emotions: Emotion[] = [
    { name: 'joy', label: 'Joie', icon: <Smile className="h-6 w-6" />, color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', ringColor: 'ring-yellow-400' },
    { name: 'calm', label: 'Calme', icon: <Sun className="h-6 w-6" />, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', ringColor: 'ring-blue-400' },
    { name: 'sad', label: 'Triste', icon: <Frown className="h-6 w-6" />, color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', ringColor: 'ring-indigo-400' },
    { name: 'neutral', label: 'Neutre', icon: <Meh className="h-6 w-6" />, color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/20', ringColor: 'ring-gray-400' },
    { name: 'love', label: 'Amour', icon: <Heart className="h-6 w-6" />, color: 'text-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-900/20', ringColor: 'ring-pink-400' },
    { name: 'energetic', label: 'Énergie', icon: <Zap className="h-6 w-6" />, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20', ringColor: 'ring-amber-400' },
    { name: 'melancholy', label: 'Mélancolie', icon: <CloudRain className="h-6 w-6" />, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20', ringColor: 'ring-purple-400' },
    { name: 'focused', label: 'Focus', icon: <Coffee className="h-6 w-6" />, color: 'text-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20', ringColor: 'ring-cyan-400' }
  ];

  const handleSelect = (emotion: string) => {
    onSelect(emotion, showIntensity ? intensity : undefined);
  };

  const selectedEmotion = emotions.find(e => e.name === selected);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        {emotions.map((emotion) => (
          <motion.button
            key={emotion.name}
            type="button"
            className={cn(
              'cursor-pointer rounded-full p-4 transition-all duration-200',
              emotion.bgColor,
              selected === emotion.name && `ring-2 ${emotion.ringColor} shadow-lg`
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(emotion.name)}
            aria-label={`Sélectionner ${emotion.label}`}
          >
            <div className={emotion.color}>{emotion.icon}</div>
            <p className="text-xs font-medium text-center mt-1">{emotion.label}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && showIntensity && selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-muted/50 rounded-lg space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Intensité</span>
              <Badge className={selectedEmotion.bgColor}>{intensity}%</Badge>
            </div>
            <Slider
              value={[intensity]}
              onValueChange={([v]) => {
                setIntensity(v);
                onSelect(selected, v);
              }}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Léger</span>
              <span>Intense</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmotionCircleSelector;
