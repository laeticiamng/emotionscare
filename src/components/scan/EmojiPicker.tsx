// @ts-nocheck

import React from 'react';
import { Grid } from "@/components/ui/grid";

const commonEmojis = [
  '😊', '😃', '😄', '🙂', '😐', 
  '😔', '😢', '😭', '😡', '😠',
  '😴', '😪', '🤔', '😕', '😬',
  '🙄', '😌', '😇', '🥰', '😍'
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  return (
    <div className="mt-2 p-2 bg-muted rounded-md">
      <Grid className="grid-cols-5 gap-2">
        {commonEmojis.map((emoji, index) => (
          <button
            key={index}
            className="flex items-center justify-center h-10 text-lg hover:bg-accent rounded-md transition-colors"
            onClick={() => onEmojiSelect(emoji)}
            type="button"
          >
            {emoji}
          </button>
        ))}
      </Grid>
    </div>
  );
};

export default EmojiPicker;
