
/**
 * Journal Émotionnel IA Service
 * 
 * Service pour interagir avec un conseiller émotionnel IA
 */
import { chatCompletion } from './openai-client';
import { toast } from '@/hooks/use-toast';

export interface EmotionalJournalResponse {
  message: string;
  detectedEmotion?: string;
  advice?: string;
  emotion?: string; // Adding the missing property
  intensity?: number; // Adding the missing property
  confidence?: number;
  analysis?: string;
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
      Retourne également l'émotion identifiée en tant que valeur distincte et une intensité entre 0 et 1.
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
    
    // Mock implementation for emotional analysis
    // In a real implementation, these would be parsed from the AI response
    let primaryEmotion = 'neutral';
    let emotionIntensity = 0.5;
    
    // Simple detection logic for demo purposes
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('joie') || lowerContent.includes('heureux')) {
      primaryEmotion = 'joy';
      emotionIntensity = 0.8;
    } else if (lowerContent.includes('calme') || lowerContent.includes('serein')) {
      primaryEmotion = 'calm';
      emotionIntensity = 0.7;
    } else if (lowerContent.includes('triste') || lowerContent.includes('déprimé')) {
      primaryEmotion = 'sad';
      emotionIntensity = 0.6;
    } else if (lowerContent.includes('anxie') || lowerContent.includes('inquiet')) {
      primaryEmotion = 'anxiety';
      emotionIntensity = 0.7;
    } else if (lowerContent.includes('stress') || lowerContent.includes('tendu')) {
      primaryEmotion = 'stress';
      emotionIntensity = 0.8;
    } else if (lowerContent.includes('énerg') || lowerContent.includes('dynamique')) {
      primaryEmotion = 'energetic';
      emotionIntensity = 0.9;
    }
    
    return {
      message: content,
      detectedEmotion,
      advice,
      emotion: primaryEmotion,
      intensity: emotionIntensity,
      confidence: 0.8,
      analysis: `Analyse basée sur le texte: "${journalEntry.substring(0, 50)}..."`
    };
  } catch (error) {
    console.error('Error analyzing emotional journal:', error);
    toast({
      title: "Erreur d'analyse",
      description: "Impossible d'analyser votre journal pour le moment.",
      variant: "destructive"
    });
    
    return {
      message: "Je suis désolé, mais je rencontre des difficultés pour analyser votre journal émotionnel. Veuillez réessayer plus tard.",
      emotion: "neutral",
      intensity: 0.5,
      confidence: 0.5
    };
  }
}
