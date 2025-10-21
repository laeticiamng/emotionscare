// @ts-nocheck
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveJournalEntry } from '@/lib/journalService';
import { useToast } from '@/hooks/use-toast';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { logger } from '@/lib/logger';

export function useJournalEntry() {
  const [isSaving, setIsSaving] = useState(false);
  const [backgroundGradient, setBackgroundGradient] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { activateMusicForEmotion } = useMusicEmotionIntegration();

  const setRandomGradient = () => {
    // Set a random gradient from a set of calming gradients
    const gradients = [
      'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20',
      'bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20',
      'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-800/20',
      'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-800/20',
    ];
    
    setBackgroundGradient(gradients[Math.floor(Math.random() * gradients.length)]);
  };

  const handleSave = async (entryData: any) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour enregistrer une entrée de journal",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const enrichedData = {
        ...entryData,
        user_id: user.id,
        emotion: entryData.emotion || currentEmotion
      };
      
      const result = await saveJournalEntry(enrichedData);
      
      // Suggest music based on the entry's emotion
      if (enrichedData.emotion) {
        activateMusicForEmotion({
          emotion: enrichedData.emotion,
          intensity: enrichedData.intensity || 50
        });
      }
      
      logger.info('Journal entry saved', { result }, 'UI');
      toast({
        title: "Journal enregistré",
        description: "Votre note a été sauvegardée avec succès"
      });
    } catch (error) {
      logger.error('Error saving journal entry', error as Error, 'UI');
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre entrée de journal",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    backgroundGradient,
    currentEmotion,
    setCurrentEmotion,
    setRandomGradient,
    handleSave
  };
}
