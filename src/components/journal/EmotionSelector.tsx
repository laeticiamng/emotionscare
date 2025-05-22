
import React from 'react';
import { getEmotionIcon } from '@/lib/emotionUtils';

interface EmotionOption {
  value: string;
  label: string;
}

interface EmotionSelectorProps {
  selectedEmotion: string;
  onSelectEmotion: (emotion: string) => void;
}

const emotionOptions: EmotionOption[] = [
  { value: 'joy', label: 'Joie' },
  { value: 'excited', label: 'Excité' },
  { value: 'calm', label: 'Calme' },
  { value: 'relaxed', label: 'Détendu' },
  { value: 'neutral', label: 'Neutre' },
  { value: 'sad', label: 'Triste' },
  { value: 'angry', label: 'En colère' },
  { value: 'stressed', label: 'Stressé' },
  { value: 'anxious', label: 'Anxieux' },
  { value: 'tired', label: 'Fatigué' },
];

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ selectedEmotion, onSelectEmotion }) => {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3">
      {emotionOptions.map((emotion) => (
        <button
          key={emotion.value}
          type="button"
          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
            selectedEmotion === emotion.value
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50 hover:bg-accent'
          }`}
          onClick={() => onSelectEmotion(emotion.value)}
        >
          <span className="text-2xl mb-1">{getEmotionIcon(emotion.value)}</span>
          <span className="text-xs">{emotion.label}</span>
        </button>
      ))}
    </div>
  );
};

export default EmotionSelector;
