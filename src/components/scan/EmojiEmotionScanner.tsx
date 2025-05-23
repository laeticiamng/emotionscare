
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EmojiEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel?: () => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  onProcessingChange = () => {},
}) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const emojis = [
    { emoji: '😊', name: 'Joyeux' },
    { emoji: '🙂', name: 'Content' },
    { emoji: '😐', name: 'Neutre' },
    { emoji: '😔', name: 'Triste' },
    { emoji: '😢', name: 'Pleurs' },
    { emoji: '😡', name: 'Colère' },
    { emoji: '😠', name: 'Agacé' },
    { emoji: '😤', name: 'Frustré' },
    { emoji: '😨', name: 'Peur' },
    { emoji: '😰', name: 'Anxieux' },
    { emoji: '😳', name: 'Gêné' },
    { emoji: '🤔', name: 'Pensif' },
    { emoji: '😴', name: 'Fatigué' },
    { emoji: '🥱', name: 'Ennuyé' },
    { emoji: '🤗', name: 'Réconforté' },
    { emoji: '🥰', name: 'Aimé' },
    { emoji: '😎', name: 'Cool' },
    { emoji: '🤯', name: 'Dépassé' },
    { emoji: '😵', name: 'Confus' },
    { emoji: '🙄', name: 'Exaspéré' },
  ];

  const handleEmojiSelect = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter((e) => e !== emoji));
    } else if (selectedEmojis.length < 3) {
      setSelectedEmojis([...selectedEmojis, emoji]);
    } else {
      toast.info('Vous pouvez sélectionner un maximum de 3 émojis');
    }
  };

  const handleSubmit = async () => {
    if (selectedEmojis.length === 0) {
      toast.error('Veuillez sélectionner au moins un emoji');
      return;
    }

    setIsProcessing(true);
    onProcessingChange(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Calculate a mock score based on the selected emojis
      const happyEmojis = ['😊', '🙂', '🤗', '🥰', '😎'];
      const neutralEmojis = ['😐', '🤔', '😳', '😴', '🥱', '😵'];
      const sadEmojis = ['😔', '😢', '😡', '😠', '😤', '😨', '😰', '🤯', '🙄'];
      
      let emotionScore = 50; // Default neutral score
      
      selectedEmojis.forEach(emoji => {
        if (happyEmojis.includes(emoji)) {
          emotionScore += 15;
        } else if (sadEmojis.includes(emoji)) {
          emotionScore -= 15;
        }
      });
      
      // Ensure score is between 0 and 100
      emotionScore = Math.max(0, Math.min(100, emotionScore));
      
      const result: EmotionResult = {
        emotion: selectedEmojis.join(''),
        intensity: emotionScore / 100,
        source: 'emoji',
        emojis: selectedEmojis.join(''),
        score: emotionScore,
        ai_feedback: `Je détecte que vous vous sentez ${emotionScore > 70 ? 'plutôt bien' : emotionScore < 30 ? 'assez mal' : 'modérément bien'}. Prenez un moment pour réfléchir à ce qui influence votre humeur aujourd'hui.`
      };
      
      onScanComplete(result);
    } catch (error) {
      console.error('Error processing emotion:', error);
      toast.error('Une erreur est survenue lors de l\'analyse');
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p>Sélectionnez jusqu'à 3 émojis qui représentent le mieux votre état émotionnel actuel</p>
      </div>

      <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
        {emojis.map(({ emoji, name }) => (
          <Button
            key={emoji}
            variant={selectedEmojis.includes(emoji) ? "default" : "outline"}
            className="h-12 text-xl sm:text-2xl"
            onClick={() => handleEmojiSelect(emoji)}
            disabled={isProcessing}
            title={name}
          >
            {emoji}
          </Button>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isProcessing}
          >
            Annuler
          </Button>
        )}
        <Button 
          onClick={handleSubmit}
          disabled={isProcessing || selectedEmojis.length === 0}
          className="ml-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse...
            </>
          ) : (
            'Analyser'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmojiEmotionScanner;
