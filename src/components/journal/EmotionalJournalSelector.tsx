/**
 * EmotionalJournalSelector - Grille d'émojis pour le journal émotionnel
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type EmotionalType = 
  | 'joy' 
  | 'sadness' 
  | 'anger' 
  | 'fear' 
  | 'surprise' 
  | 'disgust' 
  | 'serenity' 
  | 'fatigue';

interface EmotionalOption {
  id: EmotionalType;
  emoji: string;
  label: string;
  color: string;
}

export const EMOTIONAL_OPTIONS: EmotionalOption[] = [
  { id: 'joy', emoji: '😊', label: 'Joie', color: 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200' },
  { id: 'sadness', emoji: '😢', label: 'Tristesse', color: 'bg-blue-100 border-blue-400 hover:bg-blue-200' },
  { id: 'anger', emoji: '😠', label: 'Colère', color: 'bg-red-100 border-red-400 hover:bg-red-200' },
  { id: 'fear', emoji: '😨', label: 'Peur', color: 'bg-purple-100 border-purple-400 hover:bg-purple-200' },
  { id: 'surprise', emoji: '😲', label: 'Surprise', color: 'bg-orange-100 border-orange-400 hover:bg-orange-200' },
  { id: 'disgust', emoji: '🤢', label: 'Dégoût', color: 'bg-green-100 border-green-400 hover:bg-green-200' },
  { id: 'serenity', emoji: '😌', label: 'Sérénité', color: 'bg-teal-100 border-teal-400 hover:bg-teal-200' },
  { id: 'fatigue', emoji: '😴', label: 'Fatigue', color: 'bg-slate-100 border-slate-400 hover:bg-slate-200' },
];

interface EmotionalJournalSelectorProps {
  selected: EmotionalType | null;
  onSelect: (emotion: EmotionalType) => void;
}

export const EmotionalJournalSelector: React.FC<EmotionalJournalSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {EMOTIONAL_OPTIONS.map((emotion, index) => {
        const isSelected = selected === emotion.id;
        
        return (
          <motion.button
            key={emotion.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(emotion.id)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              emotion.color,
              isSelected && 'ring-2 ring-primary ring-offset-2 scale-105 border-primary'
            )}
            aria-pressed={isSelected}
            aria-label={`Sélectionner ${emotion.label}`}
          >
            <span className="text-3xl" role="img" aria-label={emotion.label}>
              {emotion.emoji}
            </span>
            <span className="text-xs font-medium text-foreground">
              {emotion.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export const getEmotionalById = (id: EmotionalType | string | null): EmotionalOption | undefined => {
  return EMOTIONAL_OPTIONS.find(e => e.id === id);
};

export default EmotionalJournalSelector;
