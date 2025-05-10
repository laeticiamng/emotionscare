
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TextEmotionScannerProps {
  text: string;
  onTextChange: (text: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ 
  text, 
  onTextChange, 
  disabled = false, 
  maxLength = 500
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      onTextChange(newText);
    }
  };

  const charCount = text.length;
  const isNearLimit = charCount > maxLength * 0.8;
  const isAtLimit = charCount >= maxLength;

  return (
    <div className="space-y-3">
      <p className="text-sm">
        Décrivez votre état émotionnel actuel en quelques phrases :
      </p>
      
      <Textarea 
        placeholder="Comment vous sentez-vous aujourd'hui ? (Ex: Je me sens plutôt calme aujourd'hui, malgré une journée chargée...)" 
        value={text}
        onChange={handleChange}
        className="min-h-[120px] resize-none"
        disabled={disabled}
      />
      
      <div className={`text-xs text-right ${
        isAtLimit ? 'text-destructive' : (isNearLimit ? 'text-amber-500' : 'text-muted-foreground')
      }`}>
        {charCount} / {maxLength} caractères
      </div>
    </div>
  );
};

export default TextEmotionScanner;
