// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';

interface EmotionMoodPickerProps {
  onSelect: (mood: string) => void;
  selected: string | null;
}

const moods = [
  { name: 'Joyeux', emoji: '😊', color: 'bg-green-500/80' },
  { name: 'Calme', emoji: '😌', color: 'bg-blue-500/80' },
  { name: 'Fatigué', emoji: '😴', color: 'bg-purple-500/80' },
  { name: 'Stressé', emoji: '😓', color: 'bg-orange-500/80' },
  { name: 'Triste', emoji: '😔', color: 'bg-indigo-500/80' },
  { name: 'Énervé', emoji: '😠', color: 'bg-red-500/80' },
];

export const EmotionMoodPicker: React.FC<EmotionMoodPickerProps> = ({ onSelect, selected }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 max-w-xl mx-auto">
      {moods.map((mood) => (
        <motion.button
          key={mood.name}
          className={`flex flex-col items-center p-3 rounded-full ${
            selected === mood.name ? 'ring-2 ring-white dark:ring-white ring-offset-2' : ''
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(mood.name)}
        >
          <div 
            className={`w-16 h-16 rounded-full flex items-center justify-center ${mood.color} text-white text-4xl`}
          >
            {mood.emoji}
          </div>
          <span className="mt-2 text-sm font-medium">{mood.name}</span>
        </motion.button>
      ))}
    </div>
  );
};
