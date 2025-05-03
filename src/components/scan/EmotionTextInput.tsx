
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface EmotionTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const EmotionTextInput = ({ value, onChange }: EmotionTextInputProps) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Comment vous sentez-vous aujourd'hui ?"
      className="min-h-[100px]"
    />
  );
};

export default EmotionTextInput;
