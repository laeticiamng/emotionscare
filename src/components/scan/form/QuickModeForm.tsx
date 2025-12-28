import React from 'react';
import EmojiSelector from '../EmojiSelector';

interface QuickModeFormProps {
  emojis: string;
  onEmojiClick: (emoji: string) => void;
  onClear: () => void;
}

const QuickModeForm: React.FC<QuickModeFormProps> = ({
  emojis,
  onEmojiClick,
  onClear
}) => {
  return (
    <div className="p-6 bg-card rounded-lg border">
      <p className="mb-4 text-sm text-muted-foreground">Sélectionnez un emoji qui représente votre humeur</p>
      <EmojiSelector 
        emojis={emojis} 
        onEmojiClick={onEmojiClick} 
        onClear={onClear}
      />
    </div>
  );
};

export default QuickModeForm;
