
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { processEmotionForBadges } from '@/lib/gamificationService';
import { EmotionResult } from '@/types/emotion';
import { confetti } from '@/lib/confetti';

interface EmotionScanFormProps {
  userId: string;
  onSubmit?: (result: EmotionResult) => void;
  onClose?: () => void;
  onScanSaved?: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ 
  userId, 
  onSubmit,
  onClose,
  onScanSaved
}) => {
  const [text, setText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (!text.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez entrer une description de votre état émotionnel.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Mock emotion analysis
      const mockResult: EmotionResult = {
        emotion: "joy",
        score: 0.85,
        text: text,
        feedback: "Vous semblez être dans un état émotionnel positif!",
        timestamp: new Date().toISOString(),
      };
      
      // Process badges
      const earnedBadges = await processEmotionForBadges(userId, mockResult);
      
      // Display badges earned
      if (earnedBadges && earnedBadges.length > 0) {
        confetti();
        toast({
          title: "Badges débloqués!",
          description: `Vous avez gagné: ${earnedBadges.map(b => b.name).join(", ")}`,
        });
      }
      
      if (onSubmit) {
        onSubmit(mockResult);
      }
      
      toast({
        title: "Analyse émotionnelle terminée",
        description: "Votre état émotionnel a été analysé avec succès.",
      });
      
      if (onScanSaved) {
        onScanSaved();
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error processing emotion scan:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'analyse émotionnelle.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="emotion-text" className="text-sm font-medium mb-1 block">
          Décrivez votre état émotionnel actuel
        </label>
        <Textarea
          id="emotion-text"
          placeholder="Comment vous sentez-vous? Décrivez vos émotions..."
          value={text}
          onChange={handleTextChange}
          rows={5}
          className="w-full"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        )}
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !text.trim()}
        >
          {isSubmitting ? "Analyse..." : "Analyser"}
        </Button>
      </div>
    </div>
  );
};

export default EmotionScanForm;
