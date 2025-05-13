
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FacialEmotionScanner from '@/components/scan/FacialEmotionScanner';
import { useHumeAI } from '@/hooks/useHumeAI';
import { EmotionResult } from '@/types/emotion';
import { useToast } from '@/components/ui/use-toast';

const EmotionalCheckIn: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  const { toast } = useToast();
  
  // Check if check-in was done today
  useEffect(() => {
    const lastCheckIn = localStorage.getItem('last_emotion_check_in');
    if (lastCheckIn) {
      const lastDate = new Date(lastCheckIn).toDateString();
      const today = new Date().toDateString();
      
      if (lastDate === today) {
        setCheckInCompleted(true);
      }
    }
    
    // Auto-prompt after 5 seconds if not completed today
    const timer = setTimeout(() => {
      if (!checkInCompleted) {
        setOpen(true);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleEmotionDetected = (result: EmotionResult) => {
    setEmotionResult(result);
    
    // Store check-in timestamp
    localStorage.setItem('last_emotion_check_in', new Date().toISOString());
    setCheckInCompleted(true);
    
    // Close dialog after 3 seconds
    setTimeout(() => {
      setOpen(false);
      
      // Show toast with suggestion based on emotion
      toast({
        title: `Bonjour ! Vous semblez ${getEmotionLabel(result.emotion)}`,
        description: getEmotionSuggestion(result.emotion),
        duration: 5000,
      });
    }, 3000);
  };
  
  const getEmotionLabel = (emotion: string): string => {
    switch (emotion.toLowerCase()) {
      case 'joy':
      case 'happy':
        return 'joyeux(se) aujourd\'hui !';
      case 'calm':
      case 'relaxed':
        return 'calme et détendu(e).';
      case 'focused':
      case 'concentration':
        return 'très concentré(e).';
      case 'surprise':
        return 'surpris(e).';
      case 'anger':
        return 'un peu tendu(e).';
      case 'sadness':
        return 'un peu mélancolique.';
      default:
        return 'dans un état émotionnel intéressant.';
    }
  };
  
  const getEmotionSuggestion = (emotion: string): string => {
    switch (emotion.toLowerCase()) {
      case 'joy':
      case 'happy':
        return 'Profitez de cette énergie positive pour accomplir vos tâches importantes !';
      case 'calm':
      case 'relaxed':
        return 'C\'est un bon moment pour la réflexion et la planification.';
      case 'focused':
      case 'concentration':
        return 'Excellent moment pour travailler sur des tâches complexes.';
      case 'surprise':
        return 'Prenez un moment pour intégrer les nouvelles informations.';
      case 'anger':
        return 'Une session de respiration ou de musique pourrait vous aider à vous détendre.';
      case 'sadness':
        return 'Un peu de musicothérapie pourrait vous aider à vous sentir mieux.';
      default:
        return 'Explorez nos différents modules pour accompagner votre journée.';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Check-in émotionnel</DialogTitle>
            <DialogDescription>
              Prenons un moment pour analyser comment vous vous sentez aujourd'hui.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <FacialEmotionScanner 
              onEmotionDetected={handleEmotionDetected}
              autoStart={true}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Plus tard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmotionalCheckIn;
