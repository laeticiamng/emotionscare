
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmotionResult } from '@/types';

interface EmojiEmotionScannerProps {
  onScan: (emojis: string) => Promise<EmotionResult>;
}

const EMOTIONS_EMOJIS = [
  { emoji: "😊", name: "Heureux" },
  { emoji: "😔", name: "Triste" },
  { emoji: "😡", name: "En colère" },
  { emoji: "😰", name: "Anxieux" },
  { emoji: "😴", name: "Fatigué" },
  { emoji: "😌", name: "Calme" },
  { emoji: "😤", name: "Frustré" },
  { emoji: "🥱", name: "Ennuyé" },
  { emoji: "😲", name: "Surpris" },
  { emoji: "🥰", name: "Aimé" },
  { emoji: "😢", name: "Déçu" },
  { emoji: "🙄", name: "Exaspéré" }
];

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({ onScan }) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  const handleEmojiClick = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(prev => prev.filter(e => e !== emoji));
    } else {
      setSelectedEmojis(prev => [...prev, emoji]);
    }
  };
  
  const handleScan = async () => {
    if (selectedEmojis.length === 0) return;
    
    try {
      setIsScanning(true);
      await onScan(selectedEmojis.join(''));
    } catch (error) {
      console.error('Error scanning emojis:', error);
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
            {EMOTIONS_EMOJIS.map(({ emoji, name }) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className={`
                  flex flex-col items-center justify-center p-2 rounded-lg transition-all
                  ${selectedEmojis.includes(emoji) 
                    ? 'bg-primary/20 ring-2 ring-primary' 
                    : 'bg-muted/30 hover:bg-muted/50'
                  }
                `}
              >
                <span className="text-3xl mb-1">{emoji}</span>
                <span className="text-xs text-center">{name}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedEmojis.length} émoji{selectedEmojis.length > 1 ? 's' : ''} sélectionné{selectedEmojis.length > 1 ? 's' : ''}
            </div>
            
            <Button 
              onClick={handleScan}
              disabled={isScanning || selectedEmojis.length === 0}
            >
              {isScanning ? 'Analyse en cours...' : 'Analyser'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmojiEmotionScanner;
