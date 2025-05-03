
import React from 'react';
import { Button } from "@/components/ui/button";
import { Smile } from 'lucide-react';

interface EmojiSelectorProps {
  emojis: string;
  onEmojiClick: (emoji: string) => void;
  onClear: () => void;
}

const EmojiSelector = ({ emojis, onEmojiClick, onClear }: EmojiSelectorProps) => {
  const commonEmojis = ["😊", "😃", "😄", "🙂", "😐", "😕", "😢", "😡", "😴", "🤔", "😌", "🥺"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {commonEmojis.map((emoji) => (
          <Button
            key={emoji}
            variant="outline"
            className="text-xl"
            onClick={() => onEmojiClick(emoji)}
          >
            {emoji}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center p-2 border rounded-md">
        <div className="text-xl mr-2">
          <Smile className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-h-[40px] flex-1 text-xl">
          {emojis || <span className="text-muted-foreground">Sélectionnez des emojis...</span>}
        </div>
        {emojis && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
          >
            Effacer
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmojiSelector;
