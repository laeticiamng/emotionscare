
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getEmotionColor } from '@/data/emotions';

export interface EmotionSelectorProps {
  onSelect: (emotion: string, intensity: number) => void;
  preselected?: string;
  selectedEmotion?: string;
  onSelectEmotion?: React.Dispatch<React.SetStateAction<string>>;
  emotions?: string[];
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  onSelect,
  preselected,
  selectedEmotion,
  onSelectEmotion,
  emotions = [
    'joy', 'calm', 'excitement',
    'sadness', 'anger', 'anxiety',
    'fear', 'surprise', 'disgust',
    'neutral', 'contentment', 'confusion'
  ]
}) => {
  const handleEmotionClick = (emotion: string) => {
    if (onSelectEmotion) {
      onSelectEmotion(emotion);
    }
    
    // Default intensity to 0.5 (medium)
    onSelect(emotion, 0.5);
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {emotions.map((emotion) => {
        const isSelected = selectedEmotion === emotion || preselected === emotion;
        const emotionColor = getEmotionColor(emotion);
        
        return (
          <Button
            key={emotion}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "py-6 h-auto capitalize flex flex-col",
              isSelected ? "border-2 border-primary" : ""
            )}
            onClick={() => handleEmotionClick(emotion)}
            style={{
              backgroundColor: isSelected ? `${emotionColor}20` : undefined,
              borderColor: isSelected ? emotionColor : undefined
            }}
          >
            <span className="text-lg mb-1">{getEmotionEmoji(emotion)}</span>
            <span>{emotion}</span>
          </Button>
        );
      })}
    </div>
  );
};

function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    joy: '😊',
    happiness: '😄',
    sadness: '😢',
    anger: '😠',
    fear: '😨',
    surprise: '😯',
    disgust: '🤢',
    neutral: '😐',
    calm: '😌',
    anxiety: '😰',
    stress: '😫',
    excitement: '🤩',
    contentment: '😊',
    confusion: '😕'
  };
  
  return emojiMap[emotion.toLowerCase()] || '😐';
}

export default EmotionSelector;
