// @ts-nocheck
import { EmotionRecommendation } from '@/types/emotion';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

// Fetch journal entries for a specific user from Supabase
export const getJournalEntriesForUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      logger.error('Failed to fetch journal entries', { error, userId }, 'journal-service');
      return [];
    }

    return data ?? [];
  } catch (err) {
    logger.error('Unexpected error fetching journal entries', { err }, 'journal-service');
    return [];
  }
};

// Fetch a specific journal entry by ID from Supabase
export const getJournalEntryById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Failed to fetch journal entry by id', { error, id }, 'journal-service');
      return null;
    }

    return data ?? null;
  } catch (err) {
    logger.error('Unexpected error fetching journal entry', { err }, 'journal-service');
    return null;
  }
};

// Save a journal entry to Supabase
export const saveJournalEntry = async (entry: any) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entry)
      .select()
      .single();

    if (error) {
      logger.error('Failed to save journal entry', { error }, 'journal-service');
      return null;
    }

    logger.info('Journal entry saved successfully', { id: data?.id }, 'journal-service');
    return data;
  } catch (err) {
    logger.error('Unexpected error saving journal entry', { err }, 'journal-service');
    return null;
  }
};

// Delete a journal entry from Supabase
export const deleteJournalEntry = async (id: string) => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Failed to delete journal entry', { error, id }, 'journal-service');
      return false;
    }

    logger.info('Journal entry deleted successfully', { id }, 'journal-service');
    return true;
  } catch (err) {
    logger.error('Unexpected error deleting journal entry', { err }, 'journal-service');
    return false;
  }
};

// Function to get emotion recommendations based on the detected emotion
const getRecommendationsForEmotion = (emotion: string): EmotionRecommendation[] => {
  switch (emotion.toLowerCase()) {
    case 'joy':
    case 'happy':
    case 'happiness':
      return [
        { id: '1', type: 'activity', title: 'Partager votre joie', description: 'Partagez ce qui vous rend heureux avec un proche.' },
        { id: '2', type: 'activity', title: 'Créer un souvenir', description: 'Prenez une photo ou écrivez ce moment pour vous en souvenir plus tard.' },
        { id: '3', type: 'activity', title: 'Exprimer votre gratitude', description: 'Faites une liste de 3 choses qui vous font vous sentir reconnaissant aujourd\'hui.' }
      ];
    case 'sad':
    case 'sadness':
      return [
        { id: '4', type: 'reflection', title: 'Accepter l\'émotion', description: 'Donnez-vous la permission de ressentir cette tristesse sans jugement.' },
        { id: '5', type: 'activity', title: 'Pratiquer l\'auto-compassion', description: 'Parlez-vous comme vous parleriez à un ami qui traverse une période difficile.' },
        { id: '6', type: 'activity', title: 'Contacter un proche', description: 'Partagez ce que vous ressentez avec quelqu\'un en qui vous avez confiance.' }
      ];
    case 'angry':
    case 'anger':
      return [
        { id: '7', type: 'activity', title: 'Respiration profonde', description: 'Prenez 5 respirations lentes et profondes en vous concentrant uniquement sur votre souffle.' },
        { id: '8', type: 'reflection', title: 'Explorer les causes', description: 'Qu\'est-ce qui a déclenché cette colère? Est-ce que cette réaction est proportionnée?' },
        { id: '9', type: 'activity', title: 'Exercice physique', description: 'Faites une courte marche ou quelques étirements pour libérer la tension.' }
      ];
    case 'fear':
    case 'anxious':
    case 'anxiety':
      return [
        { id: '10', type: 'activity', title: 'Ancrage dans le présent', description: 'Nommez 5 choses que vous pouvez voir, 4 que vous pouvez toucher, 3 que vous pouvez entendre, 2 que vous pouvez sentir, 1 que vous pouvez goûter.' },
        { id: '11', type: 'reflection', title: 'Challenger vos pensées', description: 'Identifiez une pensée anxieuse et demandez-vous si elle est basée sur des faits.' },
        { id: '12', type: 'activity', title: 'Méditation guidée', description: 'Essayez une courte méditation de pleine conscience de 5 minutes.' }
      ];
    case 'surprise':
    case 'surprised':
      return [
        { id: '13', type: 'reflection', title: 'Explorer la nouveauté', description: 'Qu\'est-ce qui vous a surpris et qu\'avez-vous appris de cette expérience?' },
        { id: '14', type: 'activity', title: 'Rester ouvert', description: 'Prenez un moment pour apprécier l\'inattendu et l\'imprévisibilité de la vie.' },
        { id: '15', type: 'activity', title: 'Partager votre expérience', description: 'Racontez cette surprise à quelqu\'un d\'autre pour voir sa perspective.' }
      ];
    default:
      return [
        { id: '16', type: 'reflection', title: 'Explorer vos émotions', description: 'Prenez un moment pour identifier ce que vous ressentez exactement.' },
        { id: '17', type: 'activity', title: 'Journal émotionnel', description: 'Écrivez librement pendant 5 minutes sur ce que vous ressentez actuellement.' },
        { id: '18', type: 'activity', title: 'Respiration consciente', description: 'Concentrez-vous sur votre respiration pendant quelques minutes pour vous recentrer.' }
      ];
  }
};

// Function to fetch recommendations for a specific emotion
export const getEmotionRecommendations = (emotion: string): EmotionRecommendation[] => {
  return getRecommendationsForEmotion(emotion);
};
