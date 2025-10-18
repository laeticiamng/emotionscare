// @ts-nocheck

/**
 * Service de Génération de Paroles Personnalisées
 */
import { chatCompletion } from './openai-client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface LyricsGenerationResult {
  lyrics: string;
  title?: string;
  genre?: string;
  success: boolean;
}

/**
 * Génère des paroles personnalisées pour une chanson
 */
export async function generateLyrics(
  emotion: string,
  theme?: string,
  genre?: string,
  language: string = 'français'
): Promise<LyricsGenerationResult> {
  try {
    const systemPrompt = `
      Génère des paroles pour une chanson qui correspond à l'émotion suivante: ${emotion}.
      ${theme ? `Thème spécifique: ${theme}` : ''}
      ${genre ? `Genre musical: ${genre}` : ''}
      Langue: ${language}
      
      Format:
      - Titre évocateur
      - Structure classique: couplet, refrain, couplet, refrain, pont, refrain
      - Limiter à environ 20 lignes au total
      - Adapté pour être mis en musique
      - Ton adapté à l'émotion exprimée
    `;
    
    const response = await chatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Crée des paroles pour exprimer cette émotion: ${emotion}` }
      ],
      'journal'
    );
    
    const content = response.choices[0].message.content;
    
    // Extraction du titre si disponible
    const titleMatch = content.match(/^#\s*(.*?)$/m) || content.match(/^Titre\s*:\s*(.*?)$/m);
    const title = titleMatch ? titleMatch[1] : `Chanson: ${emotion}`;
    
    return {
      lyrics: content,
      title,
      genre,
      success: true
    };
  } catch (error) {
    logger.error('Error generating lyrics', error as Error, 'API');
    toast({
      title: "Erreur de génération",
      description: "Impossible de générer les paroles.",
      variant: "destructive"
    });
    
    return {
      lyrics: "Nous ne pouvons pas générer des paroles personnalisées pour le moment. Veuillez réessayer plus tard.",
      success: false
    };
  }
}
