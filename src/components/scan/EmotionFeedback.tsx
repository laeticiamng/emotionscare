
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult } from '@/types/emotion';

interface EmotionFeedbackProps {
  result: EmotionResult;
  onSaveFeedback?: (feedback: string) => void;
}

const EmotionFeedback: React.FC<EmotionFeedbackProps> = ({
  result,
  onSaveFeedback
}) => {
  const [feedback, setFeedback] = useState(result.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSaveFeedback = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (onSaveFeedback) {
        await onSaveFeedback(feedback);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Votre ressenti</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ajouter votre propre ressenti sur cette analyse qui a détecté 
          <span className="font-medium"> {result.emotion} </span> 
          avec un score de {result.score}%.
        </p>
        
        <Textarea
          placeholder="Comment vous sentez-vous réellement ? Est-ce que l'analyse correspond à votre ressenti ?"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
        />
      </div>
      
      <Button 
        onClick={handleSaveFeedback} 
        disabled={isSubmitting || !feedback.trim()}
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer mon ressenti"}
      </Button>
    </div>
  );
};

export default EmotionFeedback;
