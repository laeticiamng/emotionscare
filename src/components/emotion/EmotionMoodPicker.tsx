
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmotionMoodPickerProps {
  onSelect: (mood: string) => void;
  selected: string | null;
}

export const EmotionMoodPicker: React.FC<EmotionMoodPickerProps> = ({ onSelect, selected }) => {
  const moods = [
    { id: 'calm', emoji: '😌', label: 'Calme' },
    { id: 'happy', emoji: '😊', label: 'Joyeux' },
    { id: 'stressed', emoji: '😰', label: 'Stressé' },
    { id: 'sad', emoji: '😔', label: 'Triste' },
    { id: 'energetic', emoji: '⚡', label: 'Énergique' },
    { id: 'tired', emoji: '😴', label: 'Fatigué' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {moods.map((mood) => (
        <Button
          key={mood.id}
          variant={selected === mood.id ? "default" : "outline"}
          className={`
            rounded-full px-4 py-2 flex items-center gap-2 transition-all
            ${selected === mood.id ? 'scale-110' : 'hover:scale-105'}
          `}
          onClick={() => onSelect(mood.id)}
        >
          <span className="text-lg">{mood.emoji}</span>
          <span>{mood.label}</span>
        </Button>
      ))}
    </div>
  );
};
