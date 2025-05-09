
import React from 'react';
import { motion } from 'framer-motion';

interface Emotion {
  name: string;
  color: string;
  icon: string;
}

interface EmotionCircleSelectorProps {
  onSelect: (emotion: string) => void;
  selected: string | null;
}

const EmotionCircleSelector: React.FC<EmotionCircleSelectorProps> = ({ 
  onSelect, 
  selected 
}) => {
  const emotions: Emotion[] = [
    { name: 'calm', color: 'bg-blue-100 border-blue-300 text-blue-700', icon: '😌' },
    { name: 'happy', color: 'bg-yellow-100 border-yellow-300 text-yellow-700', icon: '😊' },
    { name: 'sad', color: 'bg-indigo-100 border-indigo-300 text-indigo-700', icon: '😢' },
    { name: 'anxious', color: 'bg-purple-100 border-purple-300 text-purple-700', icon: '😰' },
    { name: 'angry', color: 'bg-red-100 border-red-300 text-red-700', icon: '😠' },
    { name: 'energetic', color: 'bg-orange-100 border-orange-300 text-orange-700', icon: '⚡' },
    { name: 'focused', color: 'bg-emerald-100 border-emerald-300 text-emerald-700', icon: '🧠' },
    { name: 'tired', color: 'bg-gray-100 border-gray-300 text-gray-700', icon: '😴' },
  ];
  
  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
      {emotions.map((emotion) => (
        <motion.button
          key={emotion.name}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(emotion.name)}
          className={`
            w-[70px] h-[70px] rounded-full flex flex-col items-center justify-center
            border-2 transition-all
            ${emotion.color}
            ${selected === emotion.name 
              ? 'ring-2 ring-offset-2 ring-primary' 
              : 'opacity-80 hover:opacity-100'
            }
          `}
        >
          <span className="text-2xl mb-1">{emotion.icon}</span>
          <span className="text-xs font-medium capitalize">{emotion.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default EmotionCircleSelector;
