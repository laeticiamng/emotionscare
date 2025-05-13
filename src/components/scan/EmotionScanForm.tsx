
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnifiedEmotionCheckin from './UnifiedEmotionCheckin';
import { EmotionResult } from '@/types/emotion';
import { useToast } from '@/hooks/use-toast';
import { processEmotionForBadges } from '@/lib/gamificationService';
import { useAuth } from '@/contexts/AuthContext';

export interface EmotionScanFormProps {
  onScanSaved: () => void;
  onClose: () => void;
  userId?: string;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ 
  onScanSaved, 
  onClose,
  userId 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionResult | null>(null);
  const actualUserId = userId || user?.id;
  
  const handleEmotionDetected = (emotion: EmotionResult) => {
    setDetectedEmotion(emotion);
  };
  
  const handleSaveScan = async () => {
    if (!detectedEmotion || !actualUserId) return;
    
    try {
      // In a real app, save the emotion to your database
      console.log('Saving emotion:', detectedEmotion);
      
      // Check if user earned any badges from this emotion recording
      if (detectedEmotion.emotion) {
        const earnedBadges = await processEmotionForBadges(
          actualUserId, 
          detectedEmotion.emotion, 
          detectedEmotion.score || 0
        );
        
        // Show badge earned notification if applicable
        if (earnedBadges.length > 0) {
          toast({
            title: "Badge débloqué !",
            description: `Vous avez gagné le badge "${earnedBadges[0].name}"`,
          });
        }
      }
      
      toast({
        title: "Émotion enregistrée !",
        description: "Votre état émotionnel a été enregistré avec succès.",
      });
      
      onScanSaved();
    } catch (error) {
      console.error('Error saving emotion scan:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre émotion. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
      </CardHeader>
      <CardContent>
        <UnifiedEmotionCheckin onEmotionDetected={handleEmotionDetected} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSaveScan}
          disabled={!detectedEmotion}
        >
          Enregistrer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmotionScanForm;
