// @ts-nocheck

import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface EmotionTextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxChars?: number;
}

const EmotionTextInput = ({ value, onChange, maxChars }: EmotionTextInputProps) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Racontez-nous votre ressenti..."
      className="min-h-[120px] rounded-xl border-gray-300 focus:border-primary focus:ring-primary"
      maxLength={maxChars}
    />
  );
};

export default EmotionTextInput;
