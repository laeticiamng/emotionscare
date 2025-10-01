// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import {
  Smile,
  Frown,
  Meh,
  Heart,
  Zap,
  CloudRain,
  Coffee,
  Sun
} from 'lucide-react';

interface EmotionCircleSelectorProps {
  onSelect: (emotion: string) => void;
  selected: string | null;
}

interface Emotion {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  ringColor: string;
}

const EmotionCircleSelector: React.FC<EmotionCircleSelectorProps> = ({
  onSelect,
  selected
}) => {
  const emotions: Emotion[] = [
    { 
      name: 'joy',
      icon: <Smile className="h-6 w-6" />,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      ringColor: 'ring-yellow-400'
    },
    { 
      name: 'calm',
      icon: <Sun className="h-6 w-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      ringColor: 'ring-blue-400'
    },
    { 
      name: 'sad',
      icon: <Frown className="h-6 w-6" />,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      ringColor: 'ring-indigo-400'
    },
    { 
      name: 'neutral',
      icon: <Meh className="h-6 w-6" />,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      ringColor: 'ring-gray-400'
    },
    { 
      name: 'love',
      icon: <Heart className="h-6 w-6" />,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      ringColor: 'ring-pink-400'
    },
    { 
      name: 'energetic',
      icon: <Zap className="h-6 w-6" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      ringColor: 'ring-amber-400'
    },
    { 
      name: 'melancholy',
      icon: <CloudRain className="h-6 w-6" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      ringColor: 'ring-purple-400'
    },
    { 
      name: 'focused',
      icon: <Coffee className="h-6 w-6" />,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      ringColor: 'ring-cyan-400'
    }
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {emotions.map((emotion) => (
        <motion.div
          key={emotion.name}
          className={`
            cursor-pointer rounded-full p-4
            ${emotion.bgColor}
            ${selected === emotion.name ? `ring-2 ${emotion.ringColor}` : ''}
            transition-all duration-200
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(emotion.name)}
        >
          <div className={`${emotion.color}`}>
            {emotion.icon}
          </div>
          <p className="text-xs font-medium text-center mt-1 capitalize">
            {emotion.name}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default EmotionCircleSelector;
