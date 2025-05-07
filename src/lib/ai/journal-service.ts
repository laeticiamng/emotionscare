
/**
 * Journal Émotionnel IA Service
 * 
 * Service pour interagir avec un conseiller émotionnel IA
 */
import { chatCompletion } from './openai-client';
import { toast } from '@/hooks/use-toast';

interface EmotionalJournalResponse {
  message: string;
  detectedEmotion?: string;
  advice?: string;
}

/**
 * Analyse une entrée de journal émotionnel et retourne des conseils adaptés
 */
export async function analyzeEmotionalJournal(
  journalEntry: string,
  userContext?: { recentEmotions?: string, language?: string }
): Promise<EmotionalJournalResponse> {
  try {
    const contextPrompt = userContext?.recentEmotions ? 
      `L'utilisateur a récemment ressenti: ${userContext.recentEmotions}.` : 
      '';
    
    const languagePrompt = userContext?.language ? 
      `Réponds en ${userContext.language}.` : 
      'Réponds en français.';
    
    const systemPrompt = `
      Tu es un conseiller émotionnel empathique, spécialisé dans la gestion du stress et des émotions au travail.
      Analyse l'entrée du journal émotionnel et fournis:
      1. Une identification de l'émotion dominante
      2. Un conseil court et bienveillant adapté à cette émotion
      ${contextPrompt}
      ${languagePrompt}
      Format ta réponse en deux paragraphes séparés: d'abord l'identification de l'émotion, puis le conseil.
    `;
    
    const response = await chatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: journalEntry }
      ],
      'journal'
    );
    
    const content = response.choices[0].message.content;
    const paragraphs = content.split('\n\n');
    
    // Extraire l'émotion détectée et le conseil
    const detectedEmotion = paragraphs[0];
    const advice = paragraphs.length > 1 ? paragraphs[1] : '';
    
    return {
      message: content,
      detectedEmotion,
      advice
    };
  } catch (error) {
    console.error('Error analyzing emotional journal:', error);
    toast({
      title: "Erreur d'analyse",
      description: "Impossible d'analyser votre journal pour le moment.",
      variant: "destructive"
    });
    
    return {
      message: "Je suis désolé, mais je rencontre des difficultés pour analyser votre journal émotionnel. Veuillez réessayer plus tard."
    };
  }
}
