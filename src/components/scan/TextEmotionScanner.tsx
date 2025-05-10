
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
    const value = e.target.value;
    if (maxLength && value.length <= maxLength) {
      onTextChange(value);
    } else if (!maxLength) {
      onTextChange(value);
    }
  };

  const charCount = text.length;
  const charPercentage = maxLength ? Math.floor((charCount / maxLength) * 100) : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="emotion-text" className="text-sm font-medium">
          Décrivez votre état émotionnel actuel
        </Label>
        <span className={`text-xs ${charCount > (maxLength * 0.9) ? 'text-red-500' : 'text-muted-foreground'}`}>
          {charCount}/{maxLength}
        </span>
      </div>
      <Textarea
        id="emotion-text"
        placeholder="Comment vous sentez-vous en ce moment ? Partagez vos pensées..."
        value={text}
        onChange={handleChange}
        disabled={disabled}
        className="min-h-[150px] resize-none"
      />
      <p className="text-xs text-muted-foreground italic">
        Soyez aussi détaillé que possible pour une analyse plus précise.
      </p>
    </div>
  );
};

export default TextEmotionScanner;
