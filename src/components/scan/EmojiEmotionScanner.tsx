
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmojiPicker from './EmojiPicker';

interface EmojiEmotionScannerProps {
  emojis: string;
  onEmojiChange: (emojis: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  emojis,
  onEmojiChange,
  onAnalyze,
  isAnalyzing
}) => {
  const handleEmojiSelect = (emoji: string) => {
    onEmojiChange(emojis + emoji);
  };

  const handleClear = () => {
    onEmojiChange('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse émotionnelle par emoji</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-md min-h-[80px] flex items-center justify-center text-2xl">
          {emojis || <span className="text-muted-foreground text-sm">Sélectionnez des emojis qui représentent votre humeur</span>}
        </div>

        <EmojiPicker onEmojiSelect={handleEmojiSelect} />

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleClear} disabled={!emojis || isAnalyzing}>
            Effacer
          </Button>
          <Button onClick={onAnalyze} disabled={!emojis || isAnalyzing}>
            {isAnalyzing ? "Analyse en cours..." : "Analyser"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmojiEmotionScanner;
