
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { EmojiEmotionScannerProps } from '@/types/emotion';

const emojis = [
  { emoji: "😊", name: "Joie", value: 90 },
  { emoji: "😌", name: "Sérénité", value: 75 },
  { emoji: "😐", name: "Neutre", value: 50 },
  { emoji: "😔", name: "Tristesse", value: 30 },
  { emoji: "😢", name: "Peine", value: 20 },
  { emoji: "😠", name: "Colère", value: 10 },
  { emoji: "😰", name: "Anxiété", value: 25 },
  { emoji: "😱", name: "Peur", value: 15 },
  { emoji: "🤔", name: "Confusion", value: 40 },
  { emoji: "🥱", name: "Fatigue", value: 35 }
];

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const toggleEmoji = (emoji: string) => {
    setSelectedEmojis(prev => {
      if (prev.includes(emoji)) {
        return prev.filter(e => e !== emoji);
      } else if (prev.length < 3) {
        return [...prev, emoji];
      }
      return prev;
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEmojis.length === 0) {
      setError("Veuillez sélectionner au moins un emoji.");
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calcul d'un score moyen basé sur les emojis sélectionnés
      const selectedEmojisData = emojis.filter(item => selectedEmojis.includes(item.emoji));
      const averageScore = selectedEmojisData.reduce((acc, item) => acc + item.value, 0) / selectedEmojisData.length;
      
      // Trouver l'emoji avec la plus grande valeur comme primaire
      const primaryEmoji = selectedEmojisData.reduce(
        (max, obj) => (obj.value > max.value ? obj : max),
        selectedEmojisData[0]
      );
      
      // Résultat simulé
      const result = {
        score: Math.round(averageScore),
        primaryEmotion: primaryEmoji.name,
        emotions: {
          joie: Math.random(),
          tristesse: Math.random(),
          colère: Math.random(),
          peur: Math.random(),
          surprise: Math.random(),
        }
      };
      
      onScanComplete(result);
    } catch (error) {
      console.error('Error analyzing emojis:', error);
      setError("Une erreur s'est produite lors de l'analyse. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <p className="text-sm mb-2">
          Sélectionnez jusqu'à 3 emojis qui correspondent le mieux à ce que vous ressentez actuellement.
        </p>
        
        <div className="grid grid-cols-5 gap-2">
          {emojis.map((item) => (
            <div 
              key={item.emoji}
              className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all ${
                selectedEmojis.includes(item.emoji) 
                  ? 'bg-primary/20 shadow-sm border-primary/50 border' 
                  : 'hover:bg-muted border border-transparent'
              }`}
              onClick={() => !isProcessing && toggleEmoji(item.emoji)}
            >
              <span className="text-3xl mb-1">{item.emoji}</span>
              <span className="text-xs text-center">{item.name}</span>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          {selectedEmojis.length}/3 sélectionnés
        </p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={selectedEmojis.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser mes émotions'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EmojiEmotionScanner;
