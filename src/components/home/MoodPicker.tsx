
import React from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MoodPickerProps {
  onSelect: (mood: string) => void;
  onClose: () => void;
}

const MoodPicker: React.FC<MoodPickerProps> = ({ onSelect, onClose }) => {
  // Define mood options with emojis, labels, and colors
  const moodOptions = [
    { id: 'calm', emoji: '😌', label: 'Calme', color: 'bg-blue-100 dark:bg-blue-900/40' },
    { id: 'happy', emoji: '😄', label: 'Heureux', color: 'bg-yellow-100 dark:bg-yellow-900/40' },
    { id: 'energetic', emoji: '⚡', label: 'Énergique', color: 'bg-orange-100 dark:bg-orange-900/40' },
    { id: 'creative', emoji: '🎨', label: 'Créatif', color: 'bg-purple-100 dark:bg-purple-900/40' },
    { id: 'reflective', emoji: '🤔', label: 'Réflexif', color: 'bg-indigo-100 dark:bg-indigo-900/40' },
    { id: 'tired', emoji: '😴', label: 'Fatigué', color: 'bg-gray-100 dark:bg-gray-800/40' },
    { id: 'anxious', emoji: '😰', label: 'Anxieux', color: 'bg-red-100 dark:bg-red-900/40' },
    { id: 'peaceful', emoji: '🧘', label: 'Paisible', color: 'bg-green-100 dark:bg-green-900/40' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Comment vous sentez-vous aujourd'hui ?</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 p-0" aria-label="Fermer">
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Sélectionnez une humeur pour personnaliser votre expérience
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {moodOptions.map((mood) => (
            <motion.button
              key={mood.id}
              className={`flex flex-col items-center justify-center p-4 rounded-xl ${mood.color} hover:shadow-md transition-all`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(mood.id)}
            >
              <span className="text-4xl mb-2" role="img" aria-label={mood.label}>
                {mood.emoji}
              </span>
              <span className="font-medium">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Votre sélection aidera à personnaliser le contenu et l'ambiance de votre expérience
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MoodPicker;
