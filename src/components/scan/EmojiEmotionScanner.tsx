
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotion';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EmojiEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
  onProcessingChange: (processing: boolean) => void;
}

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  onProcessingChange
}) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const emotionEmojis = [
    { emoji: '😊', emotion: 'joy', label: 'Joie' },
    { emoji: '😢', emotion: 'sadness', label: 'Tristesse' },
    { emoji: '😠', emotion: 'anger', label: 'Colère' },
    { emoji: '😰', emotion: 'fear', label: 'Peur' },
    { emoji: '😲', emotion: 'surprise', label: 'Surprise' },
    { emoji: '🤢', emotion: 'disgust', label: 'Dégoût' },
    { emoji: '😌', emotion: 'calm', label: 'Calme' },
    { emoji: '🤗', emotion: 'love', label: 'Amour' },
    { emoji: '😴', emotion: 'tired', label: 'Fatigue' },
    { emoji: '🤔', emotion: 'thinking', label: 'Réflexion' },
    { emoji: '😎', emotion: 'confident', label: 'Confiance' },
    { emoji: '🥳', emotion: 'celebration', label: 'Célébration' },
    { emoji: '😤', emotion: 'frustration', label: 'Frustration' },
    { emoji: '🙄', emotion: 'annoyance', label: 'Agacement' },
    { emoji: '😇', emotion: 'peaceful', label: 'Paix' },
    { emoji: '🤩', emotion: 'amazed', label: 'Émerveillement' }
  ];
  
  const handleEmojiClick = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter(e => e !== emoji));
    } else {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };
  
  const handleAnalyze = async () => {
    if (selectedEmojis.length === 0) {
      toast.error('Veuillez sélectionner au moins un emoji');
      return;
    }
    
    setIsProcessing(true);
    onProcessingChange(true);
    
    try {
      // Simuler l'analyse
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Analyser les emojis sélectionnés
      const selectedEmojiData = emotionEmojis.filter(item => 
        selectedEmojis.includes(item.emoji)
      );
      
      // Déterminer l'émotion dominante
      const dominantEmotion = selectedEmojiData[0]?.emotion || 'neutral';
      const intensity = selectedEmojis.length > 1 ? 0.8 : 0.6;
      
      // Générer un feedback basé sur les emojis sélectionnés
      let feedback = '';
      if (selectedEmojis.length === 1) {
        const emojiData = selectedEmojiData[0];
        feedback = `Vous avez choisi ${emojiData.emoji} (${emojiData.label}). Cela reflète votre état émotionnel actuel.`;
      } else {
        feedback = `Vous avez sélectionné plusieurs emojis (${selectedEmojis.join(' ')}), ce qui suggère un mélange d'émotions. C'est tout à fait normal !`;
      }
      
      const result: EmotionResult = {
        emotion: dominantEmotion,
        intensity,
        source: 'emoji',
        score: Math.round(intensity * 100),
        emojis: selectedEmojis.join(' '),
        ai_feedback: feedback,
        date: new Date().toISOString()
      };
      
      onScanComplete(result);
      toast.success('Analyse des emojis terminée');
    } catch (error) {
      console.error('Erreur lors de l\'analyse des emojis:', error);
      toast.error('Erreur lors de l\'analyse des emojis');
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélection d'emojis</CardTitle>
        <CardDescription>
          Choisissez les emojis qui représentent le mieux votre état émotionnel actuel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {emotionEmojis.map((item) => (
            <Button
              key={item.emoji}
              variant={selectedEmojis.includes(item.emoji) ? "default" : "outline"}
              className="h-16 w-16 text-2xl p-0"
              onClick={() => handleEmojiClick(item.emoji)}
              title={item.label}
            >
              {item.emoji}
            </Button>
          ))}
        </div>
        
        {selectedEmojis.length > 0 && (
          <div className="p-4 bg-muted/30 rounded-md">
            <p className="text-sm font-medium mb-2">Emojis sélectionnés :</p>
            <div className="text-3xl">{selectedEmojis.join(' ')}</div>
          </div>
        )}
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Annuler
          </Button>
          <Button onClick={handleAnalyze} disabled={isProcessing || selectedEmojis.length === 0}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse...
              </>
            ) : (
              'Analyser mes emojis'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmojiEmotionScanner;
