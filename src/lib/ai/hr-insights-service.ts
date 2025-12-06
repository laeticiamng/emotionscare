// @ts-nocheck

/**
 * Service d'Insights RH basés sur l'analyse émotionnelle
 */
import { chatCompletion } from './openai-client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface HRInsight {
  summary: string;
  alerts: Array<{
    level: 'info' | 'warning' | 'critical';
    message: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    actionable: boolean;
  }>;
  teamMorale: number; // 0-100
  success: boolean;
}

/**
 * Génère des insights RH à partir des données émotionnelles des collaborateurs
 */
export async function generateHRInsights(
  emotionalData: any,
  timeframe: 'daily' | 'weekly' | 'monthly' = 'weekly'
): Promise<HRInsight> {
  try {
    const systemPrompt = `
      Tu es un conseiller RH automatisé spécialisé dans le bien-être au travail.
      Analyse ces données émotionnelles des employés et propose:
      
      1. Un résumé global de la santé émotionnelle (1 paragraphe)
      2. Des alertes sur des problèmes potentiels (max 3)
      3. Des recommandations d'actions concrètes (max 3)
      4. Un score de moral d'équipe (0-100)
      
      Timeframe: ${timeframe}
      Format: JSON structuré avec les champs summary, alerts, recommendations, teamMorale
    `;
    
    const response = await chatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(emotionalData) }
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
        logger.error('Error parsing HR insights JSON', parseError as Error, 'API');
        throw new Error('Format de rapport invalide');
      }
    } else {
      // Fallback si le format JSON n'est pas détecté
      return {
        summary: content.split('\n')[0] || "Analyse RH disponible",
        alerts: [{
          level: 'info',
          message: 'Format de rapport incomplet, veuillez réessayer'
        }],
        recommendations: [{
          title: 'Réanalyser les données',
          description: 'Le format du rapport est incomplet, veuillez relancer l\'analyse',
          priority: 'medium',
          actionable: true
        }],
        teamMorale: 50, // valeur neutre par défaut
        success: true
      };
    }
  } catch (error) {
    logger.error('Error generating HR insights', error as Error, 'API');
    toast({
      title: "Erreur d'analyse RH",
      description: "Impossible de générer le rapport RH.",
      variant: "destructive"
    });
    
    return {
      summary: "L'analyse RH n'est pas disponible pour le moment.",
      alerts: [],
      recommendations: [],
      teamMorale: 0,
      success: false
    };
  }
}
