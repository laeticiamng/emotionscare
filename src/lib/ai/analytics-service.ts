// @ts-nocheck

/**
 * Service d'Analyse IA pour le Dashboard Admin
 */
import { chatCompletion } from './openai-client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface AnalyticsInsight {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  emotionalTrends: string;
  success: boolean;
}

/**
 * Génère des insights à partir des données statistiques brutes
 */
export async function generateAnalyticsInsights(
  rawData: any,
  timeframe: 'daily' | 'weekly' | 'monthly' = 'weekly'
): Promise<AnalyticsInsight> {
  try {
    const systemPrompt = `
      Tu es un analyste RH spécialisé dans le bien-être au travail.
      Analyse ces données statistiques et génère un rapport concis avec:
      1. Un résumé général des tendances (1 paragraphe)
      2. 3-5 observations clés sous forme de liste à puces
      3. 2-3 recommandations concrètes sous forme de liste à puces
      4. Une brève analyse des tendances émotionnelles observées
      
      Timeframe: ${timeframe}
      Format: JSON
    `;
    
    const response = await chatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(rawData) }
      ],
      'journal'
    );
    
    const content = response.choices[0].message.content;
    
    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                     content.match(/{[\s\S]*?}/);
    
    if (jsonMatch) {
      try {
        const insight = JSON.parse(jsonMatch[0].replace(/```json|```/g, ''));
        return {
          ...insight,
          success: true
        };
      } catch (parseError) {
        logger.error('Error parsing analytics JSON', parseError, 'Analytics');
        throw new Error('Format de rapport invalide');
      }
    } else {
      // Traitement manuel si le format JSON n'est pas détecté
      const lines = content.split('\n').filter(line => line.trim());
      
      const summary = lines[0];
      const keyFindings = lines
        .filter(line => line.startsWith('-') || line.startsWith('*'))
        .slice(0, 5);
      
      return {
        summary,
        keyFindings,
        recommendations: [],
        emotionalTrends: "Analyse des tendances non disponible",
        success: true
      };
    }
  } catch (error) {
    logger.error('Error generating analytics insights', error, 'Analytics');
    toast({
      title: "Erreur d'analyse",
      description: "Impossible de générer le rapport d'analyse.",
      variant: "destructive"
    });
    
    return {
      summary: "L'analyse des données n'est pas disponible pour le moment.",
      keyFindings: [],
      recommendations: [],
      emotionalTrends: "",
      success: false
    };
  }
}
