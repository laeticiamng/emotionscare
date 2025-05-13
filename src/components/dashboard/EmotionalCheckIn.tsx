import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Emotion } from '@/types/emotion';

// ... rest of imports

const EmotionalCheckIn: React.FC = () => {
  const [emotion, setEmotion] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emotion) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une émotion.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Fake API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Successful submission
      toast({
        title: "Émotion enregistrée",
        description: "Votre check-in émotionnel a été sauvegardé avec succès.",
      });
      
      setText('');
      setEmotion('');
    } catch (error) {
      console.error('Error submitting emotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre émotion. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of component
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Form content */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer mon émotion'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmotionalCheckIn;
