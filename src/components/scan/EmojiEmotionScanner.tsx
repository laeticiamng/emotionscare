
import React from 'react';
import { Button } from "@/components/ui/button";

interface EmojiEmotionScannerProps {
  selectedEmojis: string;
  onEmojiSelect: (emoji: string) => void;
  onClearEmojis: () => void;
  className?: string;
}

const EMOTION_EMOJIS = [
  "😊", "😃", "🥰", "😍", "🤩", 
  "😔", "😢", "😭", "😟", "😕",
  "😡", "😠", "🤬", "😤", "😒",
  "😐", "😑", "😶", "😬", "🙄",
  "🤔", "🤨", "😌", "😴", "😪"
];

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  selectedEmojis,
  onEmojiSelect,
  onClearEmojis,
  className
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-5 gap-2">
        {EMOTION_EMOJIS.map(emoji => (
          <Button
            key={emoji}
            variant="ghost"
            size="lg"
            onClick={() => onEmojiSelect(emoji)}
            className="text-2xl h-12"
          >
            {emoji}
          </Button>
        ))}
      </div>
      
      {selectedEmojis && (
        <div className="mt-4">
          <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
            <div className="text-2xl">
              {selectedEmojis}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearEmojis}
            >
              Effacer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiEmotionScanner;
