// @ts-nocheck

/**
 * Service de Génération de Scripts VR Immersifs
 */
import { chatCompletion } from './openai-client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface VRScriptGenerationResult {
  script: string;
  title?: string;
  duration?: number;
  success: boolean;
}

/**
 * Génère un script audio immersif pour une expérience VR
 */
export async function generateVRScript(
  emotion: string,
  description?: string,
  duration: number = 5, // en minutes
  theme?: string
): Promise<VRScriptGenerationResult> {
  try {
    const systemPrompt = `
      Crée un scénario audio relaxant, immersif et personnalisé pour une session VR de ${duration} minutes.
      L'utilisateur ressent: ${emotion}.
      ${description ? `Contexte supplémentaire: ${description}` : ''}
      ${theme ? `Le thème choisi est: ${theme}` : ''}
      
      Format:
      - Titre évocateur
      - Guide vocal précis et apaisant, étape par étape
      - Ambiance sonore recommandée
      - Durée recommandée (en minutes)

      Le script doit être adapté pour une narration audio et inclure des respirations profondes et des éléments de visualisation.
    `;
    
    const response = await chatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Génère un script immersif basé sur l'émotion: ${emotion}` }
      ],
      'coach'
    );
    
    const content = response.choices[0].message.content;
    
    // Extraction du titre si disponible
    const titleMatch = content.match(/^#\s*(.*?)$/m) || content.match(/^Titre\s*:\s*(.*?)$/m);
    const title = titleMatch ? titleMatch[1] : "Session immersive";
    
    // Extraction de la durée si mentionnée
    const durationMatch = content.match(/Durée.*?(\d+)/i);
    const extractedDuration = durationMatch ? parseInt(durationMatch[1], 10) : duration;
    
    return {
      script: content,
      title,
      duration: extractedDuration,
      success: true
    };
  } catch (error) {
    logger.error('Error generating VR script', error as Error, 'API');
    toast({
      title: "Erreur de génération",
      description: "Impossible de générer le script immersif.",
      variant: "destructive"
    });
    
    return {
      script: "Nous ne pouvons pas générer un script personnalisé pour le moment. Veuillez réessayer plus tard.",
      success: false
    };
  }
}
