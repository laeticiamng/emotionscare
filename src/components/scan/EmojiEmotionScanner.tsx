
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EmojiEmotionScannerProps {
  selectedEmojis: string;
  onEmojiSelect: (emoji: string) => void;
  onClearEmojis: () => void;
  disabled?: boolean;
}

const EMOTION_EMOJIS = [
  { emoji: '😊', emotion: 'happy' },
  { emoji: '😃', emotion: 'excited' },
  { emoji: '😌', emotion: 'calm' },
  { emoji: '😐', emotion: 'neutral' },
  { emoji: '😢', emotion: 'sad' },
  { emoji: '😡', emotion: 'angry' },
  { emoji: '😰', emotion: 'anxious' },
  { emoji: '😫', emotion: 'stressed' },
  { emoji: '😴', emotion: 'tired' },
  { emoji: '🤔', emotion: 'pensive' },
  { emoji: '😍', emotion: 'love' },
  { emoji: '😎', emotion: 'cool' }
];

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({ 
  selectedEmojis, 
  onEmojiSelect, 
  onClearEmojis,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm">
        Sélectionnez les émojis qui représentent le mieux votre état émotionnel actuel :
      </p>
      
      <div className="grid grid-cols-6 gap-2">
        {EMOTION_EMOJIS.map(({ emoji, emotion }) => (
          <Button
            key={emotion}
            variant="outline"
            className="text-2xl h-12"
            onClick={() => onEmojiSelect(emoji)}
            disabled={disabled}
            title={emotion}
          >
            {emoji}
          </Button>
        ))}
      </div>
      
      {selectedEmojis && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Émojis sélectionnés :</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearEmojis} 
              disabled={disabled}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" /> Effacer
            </Button>
          </div>
          <div className="p-3 border rounded-md mt-1 min-h-[50px] text-2xl">
            {selectedEmojis || <span className="text-muted-foreground text-sm">Aucun emoji sélectionné</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiEmotionScanner;
