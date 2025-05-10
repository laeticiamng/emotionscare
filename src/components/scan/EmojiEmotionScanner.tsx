
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface EmojiEmotionScannerProps {
  selectedEmojis: string;
  onEmojiSelect: (emoji: string) => void;
  onClearEmojis: () => void;
  disabled?: boolean;
}

const EMOTION_EMOJIS = [
  { emoji: '😊', name: 'heureux' },
  { emoji: '😃', name: 'excité' },
  { emoji: '😌', name: 'calme' },
  { emoji: '☺️', name: 'détendu' },
  { emoji: '😐', name: 'neutre' },
  { emoji: '😔', name: 'triste' },
  { emoji: '😢', name: 'déçu' },
  { emoji: '😰', name: 'anxieux' },
  { emoji: '😫', name: 'stressé' },
  { emoji: '😡', name: 'énervé' },
  { emoji: '😤', name: 'frustré' },
  { emoji: '🥱', name: 'fatigué' },
  { emoji: '😴', name: 'endormi' },
  { emoji: '🤒', name: 'malade' },
  { emoji: '🤔', name: 'pensif' },
  { emoji: '🥳', name: 'festif' },
];

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  selectedEmojis,
  onEmojiSelect,
  onClearEmojis,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">
          Sélectionnez les emojis qui représentent votre humeur
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Cliquez sur plusieurs emojis pour décrire votre état émotionnel complet
        </p>
      </div>
      
      {selectedEmojis && (
        <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
          <div className="text-xl">{selectedEmojis}</div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearEmojis}
            disabled={disabled}
          >
            Effacer
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {EMOTION_EMOJIS.map((item) => (
          <Button
            key={item.emoji}
            variant="outline"
            className="h-12 text-2xl"
            onClick={() => onEmojiSelect(item.emoji)}
            disabled={disabled}
            title={item.name}
          >
            {item.emoji}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EmojiEmotionScanner;
