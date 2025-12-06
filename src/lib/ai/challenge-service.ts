
/**
 * Service de Génération de Défis Personnalisés
 */
import { chatCompletion } from './openai-client';
import { toast } from '@/hooks/use-toast';

export interface Challenge {
  title: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  duration: string;
  points?: number;
}

/**
 * Génère un défi personnalisé pour améliorer le bien-être
 */
export async function generateDailyChallenge(
  emotion: string,
  preferences?: string[],
  previousChallenges?: string[]
): Promise<Challenge | null> {
  try {
    const preferencesContext = preferences?.length 
      ? `Préférences de l'utilisateur: ${preferences.join(', ')}.` 
      : '';
      
    const previousContext = previousChallenges?.length 
      ? `Défis précédents à éviter: ${previousChallenges.join(', ')}.` 
      : '';
    
    const systemPrompt = `
      Propose un défi quotidien personnalisé pour améliorer le bien-être au travail en lien avec l'émotion: ${emotion}.
      ${preferencesContext}
      ${previousContext}
      
      Format JSON:
      {
        "title": "Titre court du défi",
        "description": "Description détaillée du défi en 1-2 phrases",
        "difficulty": "facile|moyen|difficile",
        "duration": "durée estimée (ex: 5 minutes, 1 heure)",
        "points": nombre de points (10-50)
      }
      
      Le défi doit être pratique, réalisable au bureau ou en télétravail, et adapté à l'état émotionnel indiqué.
    `;
    
    const response = await chatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Génère un défi pour l'émotion: ${emotion}` }
      ],
      'buddy'
    );
    
    const content = response.choices[0].message.content;
    
    // Extraire le JSON du texte retourné
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                     content.match(/{[\s\S]*?}/);
                     
    if (jsonMatch) {
      try {
        const challenge = JSON.parse(jsonMatch[0].replace(/```json|```/g, ''));
        return challenge as Challenge;
      } catch (parseError) {
        console.error('Error parsing challenge JSON:', parseError);
        throw new Error('Format de défi invalide');
      }
    } else {
      throw new Error('Aucun format JSON trouvé dans la réponse');
    }
  } catch (error) {
    console.error('Error generating challenge:', error);
    toast({
      title: "Erreur de génération",
      description: "Impossible de générer un défi personnalisé.",
      variant: "destructive"
    });
    
    return null;
  }
}
