
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TextEmotionScannerProps {
  text: string;
  onTextChange: (text: string) => void;
  maxLength?: number;
  className?: string;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  text,
  onTextChange,
  maxLength = 500,
  className
}) => {
  const [charCount, setCharCount] = useState(text.length);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      onTextChange(newText);
      setCharCount(newText.length);
    }
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Textarea
        value={text}
        onChange={handleChange}
        placeholder="Décrivez comment vous vous sentez aujourd'hui..."
        className="min-h-[120px] resize-y"
      />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Exprimez-vous librement</span>
        <span>{charCount} / {maxLength}</span>
      </div>
    </div>
  );
};

export default TextEmotionScanner;
