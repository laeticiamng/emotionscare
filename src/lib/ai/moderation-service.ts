
/**
 * Service de Modération de Contenu
 */
import { moderateContent } from './openai-client';
import { toast } from '@/hooks/use-toast';

export enum ModerationType {
  HATE = 'hate',
  HATE_THREATENING = 'hate/threatening',
  SELF_HARM = 'self-harm',
  SEXUAL = 'sexual',
  SEXUAL_MINORS = 'sexual/minors',
  VIOLENCE = 'violence',
  VIOLENCE_GRAPHIC = 'violence/graphic'
}

interface ModerationResult {
  flagged: boolean;
  categories: Record<ModerationType, boolean>;
  scores: Record<ModerationType, number>;
  isSafe: boolean;
  reason?: string;
}

/**
 * Vérifie si un contenu est approprié selon les politiques de modération
 */
export async function checkContentSafety(content: string): Promise<ModerationResult> {
  try {
    const response = await moderateContent(content);
    const result = response.results[0];
    
    // Identifier la raison du flagging si présente
    let reason = '';
    if (result.flagged) {
      const flaggedCategories = Object.entries(result.categories)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);
      
      reason = `Contenu inapproprié détecté: ${flaggedCategories.join(', ')}`;
    }
    
    return {
      flagged: result.flagged,
      categories: result.categories as Record<ModerationType, boolean>,
      scores: result.category_scores as Record<ModerationType, number>,
      isSafe: !result.flagged,
      reason: result.flagged ? reason : undefined
    };
  } catch (error) {
    console.error('Error checking content safety:', error);
    toast({
      title: "Erreur de modération",
      description: "Impossible de vérifier le contenu pour le moment.",
      variant: "warning"
    });
    
    // Par défaut, en cas d'erreur, on suppose que le contenu est sûr
    // mais on informe l'utilisateur que la vérification a échoué
    return {
      flagged: false,
      categories: {} as Record<ModerationType, boolean>,
      scores: {} as Record<ModerationType, number>,
      isSafe: true,
      reason: "La vérification de sécurité n'a pas pu être effectuée"
    };
  }
}

/**
 * Hook React pour vérifier en temps réel le contenu
 */
export function useContentModeration() {
  const moderateContentAsync = async (content: string): Promise<ModerationResult> => {
    return checkContentSafety(content);
  };
  
  return { moderateContentAsync };
}
