
import React from 'react';
import { motion } from 'framer-motion';

interface EmotionCircleSelectorProps {
  onSelect: (emotion: string) => void;
  selected: string | null;
}

const emotions = [
  { id: 'happy', label: 'Heureux', emoji: '😊', color: 'bg-yellow-400' },
  { id: 'calm', label: 'Calme', emoji: '😌', color: 'bg-blue-400' },
  { id: 'focused', label: 'Concentré', emoji: '🧐', color: 'bg-purple-400' },
  { id: 'energetic', label: 'Énergique', emoji: '⚡', color: 'bg-red-400' },
  { id: 'tired', label: 'Fatigué', emoji: '😴', color: 'bg-gray-400' },
  { id: 'stressed', label: 'Stressé', emoji: '😰', color: 'bg-orange-400' },
  { id: 'sad', label: 'Triste', emoji: '😢', color: 'bg-blue-300' },
  { id: 'melancholic', label: 'Mélancolique', emoji: '🥺', color: 'bg-indigo-300' },
];

const EmotionCircleSelector: React.FC<EmotionCircleSelectorProps> = ({ onSelect, selected }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {emotions.map(emotion => (
        <motion.button
          key={emotion.id}
          onClick={() => onSelect(emotion.id)}
          className={`flex flex-col items-center ${selected === emotion.id ? 'scale-110' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div 
            className={`
              w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl
              ${emotion.color} 
              ${selected === emotion.id ? 'ring-2 ring-offset-2 ring-primary' : ''}
            `}
          >
            {emotion.emoji}
          </div>
          <span className="mt-2 text-xs sm:text-sm">{emotion.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default EmotionCircleSelector;
