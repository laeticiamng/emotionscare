
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";

// List of common emojis for emotional expression
const EMOJI_LIST = [
  "😊", "😃", "😄", "🥰", "😍",  // Happy
  "😢", "😭", "😔", "😞", "😥",  // Sad
  "😠", "😡", "🤬", "😤", "😩",  // Angry
  "😨", "😰", "😱", "😳", "🤯",  // Anxious/Shocked
  "😴", "😪", "🥱", "😌", "🧘‍♀️",  // Calm/Relaxed
];

interface EmojiSelectorProps {
  emojis: string;
  onEmojiClick: (emoji: string) => void;
  onClear: () => void;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ emojis, onEmojiClick, onClear }) => {
  return (
    <div className="space-y-4">
      {/* Selected emojis display */}
      {emojis && (
        <div className="flex items-center justify-between">
          <div className="px-4 py-2 bg-primary/10 rounded-full text-2xl">
            {emojis}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground"
          >
            <Trash className="h-4 w-4 mr-1" /> Effacer
          </Button>
        </div>
      )}

      {/* Emoji grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {EMOJI_LIST.map((emoji, index) => (
          <motion.button
            key={emoji}
            onClick={() => onEmojiClick(emoji)}
            className="text-2xl h-12 w-12 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.03 }
            }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default EmojiSelector;
