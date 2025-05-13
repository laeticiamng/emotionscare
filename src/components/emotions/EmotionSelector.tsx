
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { primaryEmotions } from '@/data/emotions';

export interface EmotionSelectorProps {
  onSelect: (emotion: string, intensity: number) => void;
  selectedEmotion?: string;
  emotions?: Array<{ name: string; label: string; emoji: string; color: string }>;
  onSelectEmotion?: (emotion: string) => void;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ 
  onSelect, 
  selectedEmotion,
  emotions = primaryEmotions,
  onSelectEmotion
}) => {
  const [intensity, setIntensity] = React.useState<number>(0.5);
  
  const handleSelect = (emotion: string) => {
    if (onSelectEmotion) {
      onSelectEmotion(emotion);
    }
    onSelect(emotion, intensity);
  };
  
  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setIntensity(value);
    
    if (selectedEmotion) {
      onSelect(selectedEmotion, value);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {emotions.map((emotion) => (
          <Button
            key={emotion.name}
            variant={selectedEmotion === emotion.name ? "default" : "outline"}
            className={cn(
              "flex flex-col p-3 h-auto gap-1",
              selectedEmotion === emotion.name && "border-primary"
            )}
            onClick={() => handleSelect(emotion.name)}
          >
            <span className="text-2xl">{emotion.emoji}</span>
            <span>{emotion.label}</span>
          </Button>
        ))}
      </div>
      
      {selectedEmotion && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Intensité: {Math.round(intensity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={intensity}
            onChange={handleIntensityChange}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default EmotionSelector;
