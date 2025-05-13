
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Smile } from "lucide-react";

export interface EmojiEmotionScannerProps {
  emojis: string;
  onEmojiChange?: (emojis: string) => void;
  onChange?: (emojis: string) => void; // For backward compatibility
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  emojis,
  onEmojiChange,
  onChange,
  onAnalyze,
  isAnalyzing
}) => {
  // Use the appropriate change handler
  const handleEmojiClick = (emoji: string) => {
    const newEmojis = emojis.includes(emoji)
      ? emojis.replace(emoji, '')
      : emojis + emoji;
    
    if (onChange) {
      onChange(newEmojis);
    } else if (onEmojiChange) {
      onEmojiChange(newEmojis);
    }
  };

  // Common emoji groups
  const emojiGroups = [
    ["😊", "🙂", "😀", "😄", "😁"], // happy
    ["😔", "😢", "😭", "😞", "🥺"], // sad
    ["😠", "😡", "🤬", "😤", "😒"], // angry
    ["😨", "😰", "😱", "😓", "😳"], // scared
    ["😌", "😴", "🥱", "😪", "🙄"]  // tired/bored
  ];

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 min-h-32 flex flex-wrap items-start gap-1">
        {emojis ? (
          <div className="text-4xl leading-relaxed tracking-wider">
            {Array.from(emojis).map((emoji, index) => (
              <span 
                key={index} 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-center w-full">
            Sélectionnez des emojis qui représentent votre humeur
          </div>
        )}
      </div>

      <div className="space-y-2">
        {emojiGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex gap-2 justify-center">
            {group.map((emoji) => (
              <button
                key={emoji}
                className={`text-2xl p-2 rounded-md hover:bg-muted transition-colors ${
                  emojis.includes(emoji) ? 'bg-muted' : ''
                }`}
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        ))}
      </div>

      <Button
        onClick={onAnalyze}
        disabled={isAnalyzing || !emojis}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Smile className="mr-2 h-4 w-4" />
            Analyser mes émojis
          </>
        )}
      </Button>
    </div>
  );
};

export default EmojiEmotionScanner;
