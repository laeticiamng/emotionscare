// @ts-nocheck

import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface EmotionTextInputProps {
  value: string;
  onChange: (text: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

const EmotionTextInput: React.FC<EmotionTextInputProps> = ({ 
  value, 
  onChange, 
  maxLength = 500,
  placeholder = "Décrivez ce que vous ressentez...",
  className = "" 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`min-h-[120px] resize-y ${className}`}
        maxLength={maxLength}
      />
      
      <div className="text-right text-xs text-muted-foreground">
        {value.length}/{maxLength} caractères
      </div>
    </div>
  );
};

export default EmotionTextInput;
