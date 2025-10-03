
import React from 'react';
import { getEmotionIcon, getEmotionColor } from '@/lib/emotionUtils';

interface EmotionOption {
  value: string;
  label: string;
}

interface EmotionSelectorProps {
  selectedEmotion: string;
  onSelectEmotion: (emotion: string) => void;
}

// Emotions with consistent French labels and values
const emotionOptions: EmotionOption[] = [
  { value: 'joy', label: 'Joie' },
  { value: 'excited', label: 'Excité(e)' },
  { value: 'calm', label: 'Calme' },
  { value: 'relaxed', label: 'Détendu(e)' },
  { value: 'neutral', label: 'Neutre' },
  { value: 'sad', label: 'Triste' },
  { value: 'angry', label: 'En colère' },
  { value: 'stressed', label: 'Stressé(e)' },
  { value: 'anxious', label: 'Anxieux(se)' },
  { value: 'tired', label: 'Fatigué(e)' },
  { value: 'happy', label: 'Heureux(se)' },
  { value: 'proud', label: 'Fier(ère)' },
];

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ selectedEmotion, onSelectEmotion }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
      {emotionOptions.map((emotion) => {
        const isSelected = selectedEmotion === emotion.value;
        const emotionColorClass = isSelected ? getEmotionColor(emotion.value) : '';
        
        return (
          <button
            key={emotion.value}
            type="button"
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
              isSelected
                ? `border-primary bg-primary/10 shadow-md ${emotionColorClass} scale-105`
                : 'border-border hover:border-primary/50 hover:bg-accent hover:scale-102'
            }`}
            onClick={() => onSelectEmotion(emotion.value)}
            aria-pressed={isSelected}
          >
            <span className="text-3xl mb-1">{getEmotionIcon(emotion.value)}</span>
            <span className="text-xs font-medium">{emotion.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default EmotionSelector;
