
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { emotionsList, intensityLevels } from '@/data/emotions';
import { EmotionSelectorProps } from '@/types/emotion';

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ 
  onSelect,
  preselected
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>(preselected || '');
  const [intensity, setIntensity] = useState<number>(3);

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
  };

  const handleConfirm = () => {
    if (selectedEmotion) {
      onSelect(selectedEmotion, intensity);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Comment vous sentez-vous ?</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {emotionsList.map((emotion) => (
            <Button
              key={emotion.name}
              variant={selectedEmotion === emotion.name ? "default" : "outline"}
              className="h-auto py-2 px-3 flex flex-col items-center justify-center"
              onClick={() => handleEmotionSelect(emotion.name)}
              style={{
                borderColor: selectedEmotion === emotion.name ? emotion.color : undefined,
                backgroundColor: selectedEmotion === emotion.name ? emotion.color : undefined,
                color: selectedEmotion === emotion.name ? '#fff' : undefined
              }}
            >
              <span className="text-sm capitalize">{emotion.name}</span>
            </Button>
          ))}
        </div>
        
        {selectedEmotion && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Intensité</span>
                <span>{intensityLevels.find(level => level.value === intensity)?.label}</span>
              </div>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[intensity]}
                onValueChange={(value) => setIntensity(value[0])}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleConfirm}
            >
              Confirmer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionSelector;
