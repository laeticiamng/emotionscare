
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";

export interface TextEmotionScannerProps {
  text: string;
  onTextChange: (text: string) => void;
  onChange?: (text: string) => void; // For backward compatibility
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  text,
  onTextChange,
  onChange,
  onAnalyze,
  isAnalyzing
}) => {
  // Use the appropriate change handler
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (onChange) {
      onChange(newText);
    } else if (onTextChange) {
      onTextChange(newText);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Textarea
          value={text}
          onChange={handleChange}
          placeholder="Décrivez comment vous vous sentez aujourd'hui..."
          className="min-h-32"
        />
      </div>

      <Button
        onClick={onAnalyze}
        disabled={isAnalyzing || !text.trim()}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <MessageSquare className="mr-2 h-4 w-4" />
            Analyser mon texte
          </>
        )}
      </Button>
    </div>
  );
};

export default TextEmotionScanner;
